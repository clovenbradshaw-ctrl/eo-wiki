# EO Wiki — backend migration (Xano → GitHub + n8n)

The wiki no longer has an application backend. Xano (and the Matrix
forks/suggestions/hydration layer that sat on top of it) has been removed.

## How it works now

- **Storage.** Every article is a plain Markdown file in this repo under
  `articles/<type>/<slug>.md`, plus a manifest at `articles/index.json` that the
  app reads on load. The site is served by GitHub Pages (`experientialontology.org`),
  so reads are same-origin static fetches — no server.
- **Reading.** `index.html` fetches `articles/index.json`, then loads each
  article file and renders its Markdown body with `marked`.
- **Full Markdown export (permanent URL).** The entire wiki, unabridged, is
  always available as a single Markdown file at
  **<https://experientialontology.org/eo-wiki.md>**. It is byte-for-byte the
  in-app "Download all as Markdown" output (every article, title-ordered, joined
  with `\n\n---\n\n---\n\n`). See "Full Markdown export" below.
- **Editing (admin only).** Sign in with the editor password. On save, the app
  POSTs the changed file(s) to an **n8n webhook**, which commits them to this
  repo on `main`. GitHub Pages redeploys and the change goes live.
- **The webhook URL is not in the source.** It is AES-GCM encrypted
  (`WEBHOOK_ENC` in `index.html`) under a key derived from the password via
  PBKDF2. It is decrypted in memory only after a correct login. Viewing source
  reveals nothing usable.
- **Login** uses the same password as before (the old admin key). Its SHA-256 is
  in `ADMIN_HASH`; the password itself is never stored in the repo.

## What an admin can do

Create, edit (Markdown), search-and-replace, and bulk-edit articles, assign
"Get started" operator cards, and download a full Markdown export. Each write
publishes the affected `articles/<type>/<slug>.md` and refreshes
`articles/index.json` through the webhook.

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

Import `tools/n8n-publish-wiki.workflow.json`. It is the workflow you provided,
corrected so it actually works with this app:

- **Writes to `eo-wiki`** (the original wrote to `plain-text`, which the site
  never reads).
- **Accepts the publish body as a JSON string** (the app sends `text/plain` to
  avoid a CORS preflight) as well as a JSON object.
- Webhook path is unchanged: `POST /webhook/site/publish-wiki`.

The webhook needs a GitHub OAuth credential with write access to
`clovenbradshaw-ctrl/eo-wiki`. Responses already send
`Access-Control-Allow-Origin: *`.

### Publish request contract

```
POST https://<your-n8n-host>/webhook/site/publish-wiki
Content-Type: text/plain
{ "filename": "articles/wiki/emanon.md", "mode": "overwrite",
  "contentRaw": "<file text>", "message": "edit wiki:emanon" }
```

> The real webhook host is deliberately kept out of the repo (the webhook is
> unauthenticated, so the URL is effectively a write capability). It lives only
> as the encrypted `WEBHOOK_ENC` blob in `index.html`.

## Re-generating the article files

`tools/build-articles.js` is the one-time parser that split the Markdown export
into per-article files:

```
node tools/build-articles.js <export.md> ./articles
```

It dedupes by `record_id` and drops `site:*` metadata records.

## Rotating the password / webhook URL

The webhook ciphertext is bound to the password. If either changes, regenerate
`WEBHOOK_ENC` and `ADMIN_HASH`:

```js
// in Node:
const crypto = require('crypto');
const PASSWORD = '<new password>';
const URL = 'https://<your-n8n-host>/webhook/site/publish-wiki'; // the real URL
const salt = crypto.randomBytes(16), iv = crypto.randomBytes(12);
const key = crypto.pbkdf2Sync(Buffer.from(PASSWORD), salt, 200000, 32, 'sha256');
const c = crypto.createCipheriv('aes-256-gcm', key, iv);
const ct = Buffer.concat([c.update(Buffer.from(URL)), c.final()]);
console.log('WEBHOOK_ENC =', Buffer.concat([salt, iv, ct, c.getAuthTag()]).toString('base64'));
console.log('ADMIN_HASH  =', crypto.createHash('sha256').update(PASSWORD).digest('hex'));
```

Keep `WEBHOOK_PBKDF2_ITERATIONS` (200000) in sync with the value in `index.html`.

## Decommissioning Xano

Nothing in the app calls Xano anymore. The Xano workspace/endpoints
(`xvkq-pq7i-idtl.n7d.xano.io`) can be paused or deleted once you've confirmed
the published site reads and writes correctly.
