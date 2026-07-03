#!/usr/bin/env node
// Generate site/recent.json — git-aware "last updated" data for the front
// page's "Most recent updates" section. An article counts as updated whenever
// ANY commit touches its file (in-app publish, bulk edit, external patch/PR),
// not just when the app bumps its **Updated:** metadata header. The repo's
// latest commit is recorded too, so site-level patches surface as well.
//
// Run from CI (needs full git history — checkout with fetch-depth: 0):
//   node tools/build-recent.js
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'articles', 'index.json'), 'utf8'));

const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

const articles = {};
for (const a of manifest.articles || []) {
  try {
    const iso = git(['log', '-1', '--format=%cI', '--', a.path]);
    if (iso) articles[a.record_id] = iso;
  } catch (e) { /* renamed/missing file — leave it to the metadata date */ }
}

// The latest commit that isn't this pipeline's own chore commit.
const site = {
  updated_at: git(['log', '-1', '--invert-grep', '--grep', '^chore: rebuild', '--format=%cI']),
  message: git(['log', '-1', '--invert-grep', '--grep', '^chore: rebuild', '--format=%s']),
};

// No generated_at field: the file's bytes only change when the underlying
// history changes, so CI can skip no-op commits with a plain diff check.
const out = { version: 1, site, articles };
fs.writeFileSync(path.join(root, 'site', 'recent.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`site/recent.json: ${Object.keys(articles).length} articles, site updated ${site.updated_at}`);
