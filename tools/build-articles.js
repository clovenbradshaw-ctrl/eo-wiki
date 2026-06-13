#!/usr/bin/env node
/*
 * build-articles.js — one-time migration: split the monolithic eo-wiki Markdown
 * export into one file per article plus an index manifest.
 *
 *   node tools/build-articles.js <path-to-export.md> [outDir]
 *
 * Output:
 *   <outDir>/<type>/<slug>.md   — each article (verbatim header + body block)
 *   <outDir>/index.json         — manifest the app reads on load
 *
 * The export format (produced by downloadAllAsMarkdown in index.html) is:
 *
 *   # {title}
 *
 *   **Record ID:** {type}:{slug}
 *   **DB ID:** {n}
 *   [**Tags:** a, b]
 *   [**Keywords:** x, y]
 *   **Status:** {status}
 *   [**Updated:** {iso-or-epoch}]
 *
 *   ---
 *
 *   {markdown body}
 *
 * Articles are joined with "\n\n---\n\n---\n\n". Bodies themselves contain `#`
 * headings and `---` rules, so we anchor on the *header signature* (a `# Title`
 * line immediately followed by `**Record ID:**` then `**DB ID:**`) rather than
 * splitting on separators.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const SRC = process.argv[2];
const OUT = process.argv[3] || path.join(process.cwd(), 'articles');

if (!SRC) {
  console.error('usage: node tools/build-articles.js <export.md> [outDir]');
  process.exit(1);
}

const raw = fs.readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n');

// Anchor: "# Title" + blank + "**Record ID:** id" + "**DB ID:** n".
// The DB ID line is what disqualifies in-body "**Record ID:**" mentions.
const anchorRe = /^# (.+)\n\n\*\*Record ID:\*\* (.+?)[ \t]*\n\*\*DB ID:\*\* (\d+)[ \t]*$/gm;

const anchors = [];
let m;
while ((m = anchorRe.exec(raw)) !== null) {
  anchors.push({ index: m.index, title: m[1].trim(), recordId: m[2].trim(), dbId: parseInt(m[3], 10) });
}

if (!anchors.length) {
  console.error('No article headers found — check the export format.');
  process.exit(1);
}

function parseHeaderField(headerText, label) {
  const re = new RegExp('^\\*\\*' + label + ':\\*\\* (.*?)[ \\t]*$', 'm');
  const mm = headerText.match(re);
  return mm ? mm[1].trim() : '';
}

function splitList(s) {
  return s ? s.split(',').map(x => x.trim()).filter(Boolean) : [];
}

function safeSlug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'untitled';
}

const seen = new Map(); // record_id -> manifest entry (dedupe)
const skipped = [];
const articles = [];

for (let i = 0; i < anchors.length; i++) {
  const start = anchors[i].index;
  const end = i + 1 < anchors.length ? anchors[i + 1].index : raw.length;
  let block = raw.slice(start, end);

  // Strip the trailing inter-article separator ("\n\n---\n\n---\n\n") and any
  // trailing whitespace/rules left at the boundary.
  block = block.replace(/\n+(?:-{3,}\s*\n+)+$/g, '\n').replace(/\s+$/g, '') + '\n';

  const recordId = anchors[i].recordId;
  const colon = recordId.indexOf(':');
  const type = colon >= 0 ? recordId.slice(0, colon) : 'wiki';
  const slug = colon >= 0 ? recordId.slice(colon + 1) : recordId;

  // Drop site-level metadata records (site:index, site:hydration, …).
  if (type === 'site') { skipped.push(recordId + ' (metadata)'); continue; }

  if (seen.has(recordId)) { skipped.push(recordId + ' (duplicate)'); continue; }

  // Split header section from body at the first "\n---\n" after the metadata.
  const sepIdx = block.indexOf('\n---\n');
  const headerText = sepIdx >= 0 ? block.slice(0, sepIdx) : block;

  const entry = {
    record_id: recordId,
    content_type: type,
    slug: slug,
    title: anchors[i].title.replace(/^"(.*)"$/, '$1'),
    db_id: anchors[i].dbId,
    status: parseHeaderField(headerText, 'Status') || 'draft',
    tags: splitList(parseHeaderField(headerText, 'Tags')),
    keywords: splitList(parseHeaderField(headerText, 'Keywords')),
    updated_at: parseHeaderField(headerText, 'Updated') || '',
    path: 'articles/' + type + '/' + safeSlug(slug) + '.md',
  };

  const dir = path.join(OUT, type);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(OUT, type, safeSlug(slug) + '.md'), block, 'utf8');

  seen.set(recordId, entry);
  articles.push(entry);
}

// Stable order: by title (case-insensitive), matching the app's nav sort.
articles.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));

const manifest = {
  version: 1,
  generated_at: new Date().toISOString(),
  count: articles.length,
  articles: articles.map(a => ({
    record_id: a.record_id,
    content_type: a.content_type,
    slug: a.slug,
    title: a.title,
    db_id: a.db_id,
    status: a.status,
    tags: a.tags,
    keywords: a.keywords,
    updated_at: a.updated_at,
    path: a.path,
  })),
};

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');

console.log('Anchors found: ' + anchors.length);
console.log('Articles written: ' + articles.length);
console.log('Skipped (' + skipped.length + '): ' + skipped.join(', '));
console.log('Manifest: ' + path.join(OUT, 'index.json'));
