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
