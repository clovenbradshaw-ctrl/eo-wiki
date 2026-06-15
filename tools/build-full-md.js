#!/usr/bin/env node
/*
 * build-full-md.js — build the single, full, unabridged Markdown export of the
 * entire wiki and write it to one stable file at the repo root.
 *
 *   node tools/build-full-md.js [outfile]   (default: eo-wiki.md)
 *
 * GitHub Pages then serves that file at a permanent URL:
 *
 *   https://experientialontology.org/eo-wiki.md
 *
 * The output is byte-for-byte what the in-app "Download all as Markdown" button
 * (downloadAllAsMarkdown in index.html) produces: every article in the manifest,
 * sorted by title, joined with "\n\n---\n\n---\n\n". Because the on-disk article
 * files are already the serialized form (header + body) that the button emits,
 * we just read and concatenate them — no re-rendering needed.
 *
 * A GitHub Action (.github/workflows/build-full-md.yml) reruns this on every
 * push to main that touches articles/**, so the URL is always current.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(ROOT, 'articles', 'index.json');
const OUT = path.resolve(ROOT, process.argv[2] || 'eo-wiki.md');

// Matches downloadAllAsMarkdown(): a horizontal rule, a blank line, then a
// second rule, so consumers can split articles unambiguously.
const SEPARATOR = '\n\n---\n\n---\n\n';

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

  // Same selection + ordering the app uses: drop site:* records, sort by title.
  const entries = (manifest.articles || [])
    .filter((e) => e.record_id && !e.record_id.startsWith('site:'))
    .sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')));

  const parts = [];
  let missing = 0;
  for (const e of entries) {
    const file = path.join(ROOT, e.path);
    let text;
    try {
      text = fs.readFileSync(file, 'utf8');
    } catch (err) {
      console.warn(`! skipping unreadable article: ${e.path} (${err.message})`);
      missing++;
      continue;
    }
    // Normalize newlines and strip trailing blank lines, like the button does.
    parts.push(text.replace(/\r\n/g, '\n').replace(/\n+$/, ''));
  }

  // Trailing newline so the file is POSIX-clean; the body is otherwise identical
  // to the downloaded blob.
  const body = parts.join(SEPARATOR) + '\n';
  fs.writeFileSync(OUT, body, 'utf8');

  const rel = path.relative(ROOT, OUT);
  console.log(
    `Wrote ${rel}: ${parts.length} articles, ${body.length} bytes` +
      (missing ? ` (${missing} skipped)` : '')
  );
}

main();
