# EO Wiki — GitHub-native storage (the NPJ method)

The wiki has no application backend. All data lives natively in this GitHub
repo; writes go **browser → n8n webhook → GitHub Contents API**, the same
pattern the NPJ site uses.

## How it works

- **Storage.** Every article is a plain Markdown file in this repo under
  `articles/<type>/<slug>.md`, plus a manifest at `articles/index.json` that the
  app reads on load. Site-level data lives under `site/`:
  - `site/getstarted.json` — the "Get started" operator-card assignments
    (curated by the admin, seen by every visitor).
  - `site/auth.json` — SHA-256 hashes of the admin publish key(s); this is what
    the webhook authorizes against (hashes only, never the key).
  The site is served by GitHub Pages (`experientialontology.org`), so reads are
  same-origin static fetches — no server, no API tokens, no rate limits.
- **Reading.** `index.html` fetches `articles/index.json`, then loads each
  article file and renders its Markdown body with `marked`. It also fetches
  `site/getstarted.json` for the front-page cards.
- **Full Markdown export (permanent URL).** The entire wiki, unabridged, is
  always available as a single Markdown file at
  **<https://experientialontology.org/eo-wiki.md>**. It is byte-for-byte the
  in-app "Download all as Markdown" output (every article, title-ordered, joined
  with `\n\n---\n\n---\n\n`). See "Full Markdown export" below.
- **Editing (admin only).** Sign in with the editor password. On save, the app
  POSTs the changed file(s) as JSON to the **n8n publish webhook** with
  `Authorization: Bearer <admin key>`. The workflow verifies the caller
  **server-side** — it SHA-256-hashes the Bearer key and only commits when the
  hash appears in the `admins` list of the committed `site/auth.json` — then
  writes the file to this repo on `main` via the GitHub Contents API. GitHub
  Pages redeploys and the change goes live.
- **The endpoint is not a secret.** Because authorization is enforced in the
  workflow (the NPJ method), the webhook URL sits in plain text in
  `index.html` (`DEFAULT_PUBLISH_ENDPOINT`). It can be overridden per-browser
  via `localStorage['eo_publish_cfg_v1'] = '{"endpoint":"https://…"}'`.
  This replaces the old scheme where the URL was AES-GCM encrypted in source
  (`WEBHOOK_ENC`) and the unauthenticated webhook URL itself was the write
  capability.
- **Login** uses the same password as before. Its SHA-256 is in `ADMIN_HASH`
  (client-side UX check) and in `site/auth.json` (the server-side gate); the
  password itself is never stored in the repo.

## What an admin can do

Create, edit (Markdown), search-and-replace, and bulk-edit articles, assign
"Get started" operator cards, and download a full Markdown export. Each write
publishes the affected file through the webhook: articles publish
`articles/<type>/<slug>.md` and refresh `articles/index.json`; card
assignments publish `site/getstarted.json` (debounced into one commit).

### Client publish behavior (mirrors NPJ)

- Requests are bounded by an `AbortController` (120 s).
- The **response body, not the HTTP status, is the verdict**: the workflow
  answers `{ ok, gh_status, commit_sha, bytes, error }` even on failure. A
  structured `{ ok:false }` fails fast; only body-less gateway blips
  (408/429/502/503/504) and GitHub 409/422 blob-SHA races are retried, with
  backoff 600 ms → 1.5 s → 3 s.
- Successful commits append a receipt to
  `localStorage['eo_publish_receipts_v1']` (`{ filename, commit_sha, bytes,
  published_at }`, last 100 kept).

## Full Markdown export

The whole wiki, unabridged, lives at one stable URL:

```
https://experientialontology.org/eo-wiki.md
```

`eo-wiki.md` (repo root) is a static file served by GitHub Pages, so the URL is
permanent — fetch it with `curl`, point an LLM at it, or open it in a browser.

- **Build.** `tools/build-full-md.js` reads `articles/index.json`, concatenates
  every article (title-ordered, `site:*` records dropped, joined with
  `\n\n---\n\n---\n\n`) and writes `eo-wiki.md`. The output is byte-for-byte the
  in-app "Download all as Markdown" button. Run manually with
  `node tools/build-full-md.js`.
- **Stays current automatically.** `.github/workflows/build-full-md.yml` reruns
  the build on every push to `main` that touches `articles/**` (i.e. every n8n
  publish) and commits the refreshed `eo-wiki.md`. That commit only touches
  `eo-wiki.md`, never `articles/**`, so it does not retrigger itself. The
  workflow can also be run on demand from the Actions tab (`workflow_dispatch`).

## n8n workflow

Import `tools/n8n-publish-eo-wiki.workflow.json` (replaces the old
`n8n-publish-wiki.workflow.json`). Node flow, modeled on NPJ's `publish-npj`:

```
Publish Webhook → Extract Token → Hash Token → Fetch Auth → Authorize → Authorized?
  ├─ no  → Respond Unauthorized (401)
  └─ yes → GH Get File → Build Content → Delete?
             ├─ yes → GH Delete
             └─ no  → Exists? → GH Update / GH Create
           → Check GH Result → Publish OK ({ ok, gh_status, commit_sha, … })
```

The Bearer key is hashed by the built-in **Crypto node** (`Hash Token`), so no
Code node uses `require()` — the workflow runs even on n8n instances where
`NODE_FUNCTION_ALLOW_BUILTIN` is unset.

- **Fetch Auth** reads `site/auth.json` from
  `raw.githubusercontent.com/clovenbradshaw-ctrl/eo-wiki/main` (cache-busted),
  so authorization data lives in the repo itself — no secrets in the workflow.
- **Authorize** SHA-256-hashes the Bearer key and requires the hash to be in
  `admins`, the filename to match the allowlist
  (`articles/<type>/<slug>.md`, `articles/index.json`, `site/*.json`,
  `eo-wiki.md`) and the mode to be `overwrite`, `append` or `delete`.
- **GH Update / GH Create / GH Delete** commit to `clovenbradshaw-ctrl/eo-wiki`
  on `main` with the GitHub OAuth2 credential. `delete` mode removes a file —
  the old webhook couldn't, which is why renames used to leave orphans.
- **Check GH Result** normalizes n8n's varying error shapes and reports success
  only when a commit SHA came back; **Publish OK** returns that verdict as the
  response body with the computed HTTP status and `Access-Control-Allow-Origin: *`.

After import: re-bind the **GitHub OAuth2 credential** (credential IDs don't
transfer between n8n instances; it needs Contents write on
`clovenbradshaw-ctrl/eo-wiki`), activate the workflow, and deactivate/delete
the old `site/publish-wiki` workflow — it is unauthenticated and its URL is a
write capability.

### Publish request contract

```
POST https://<your-n8n-host>/webhook/site/publish-eo-wiki
Content-Type: application/json
Authorization: Bearer <admin key>
{ "filename": "articles/wiki/emanon.md", "mode": "overwrite",
  "contentRaw": "<file text>", "message": "edit wiki:emanon" }
```

Response: `{ ok, statusCode, filename, mode, bytes, commit_sha, gh_status, error }`.
`mode` may be `overwrite` (replace/create), `append`, or `delete`.

## Re-generating the article files

`tools/build-articles.js` is the one-time parser that split the Markdown export
into per-article files:

```
node tools/build-articles.js <export.md> ./articles
```

It dedupes by `record_id` and drops `site:*` metadata records.

## Rotating the admin key

```js
// in Node:
const crypto = require('crypto');
console.log(crypto.createHash('sha256').update('<new password>').digest('hex'));
```

Put the hash in **both** places:

1. `site/auth.json` → `admins` (the server-side gate — this is the one that
   actually protects writes);
2. `ADMIN_HASH` in `index.html` (the client-side login check).

Commit both (the old key keeps working until the `site/auth.json` commit lands
on `main`). No webhook re-encryption is needed anymore — the endpoint is public
by design.

## History

- **Xano → GitHub + n8n (2025).** The original Xano backend (workspace
  `xvkq-pq7i-idtl.n7d.xano.io`) and the Matrix forks/suggestions layer were
  removed; articles became Markdown files in this repo, published through an
  unauthenticated n8n webhook whose URL was AES-GCM encrypted in source
  (`WEBHOOK_ENC`).
- **NPJ method (2026).** The write path was rebuilt on NPJ's pattern:
  plain-text endpoint, server-side Bearer authorization against the committed
  `site/auth.json`, JSON response contract, client retry/verdict logic, and
  GitHub-native storage for the remaining site data
  (`site/getstarted.json`, previously browser-localStorage only).
