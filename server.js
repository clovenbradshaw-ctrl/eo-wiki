const express = require('express');
const path = require('path');
const crypto = require('crypto');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Password hash ──────────────────────────────────────────
// SHA-256 of "Brethren0-Happiest6-Dynamite5-Hammock9-Sharply0"
const ADMIN_HASH = 'e89ade35085fc8736d6b4755af45e842c6eec0c5978d318156aff6351f0fa950';

function hashPassword(pw) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

function verifyAuth(req, res, next) {
  // Accept password from Authorization header (Bearer <password>) or JSON body
  let pw = null;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    pw = auth.slice(7);
  } else if (req.body && req.body.password) {
    pw = req.body.password;
  }
  if (!pw || hashPassword(pw) !== ADMIN_HASH) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ── Database ───────────────────────────────────────────────
const dbPath = path.join(__dirname, 'db', 'eo.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS content (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id     TEXT UNIQUE NOT NULL,
    content_type  TEXT NOT NULL DEFAULT 'wiki',
    title         TEXT NOT NULL,
    slug          TEXT UNIQUE NOT NULL,
    status        TEXT NOT NULL DEFAULT 'draft',
    level         TEXT DEFAULT '101',
    tags          TEXT DEFAULT '[]',
    keywords      TEXT DEFAULT '[]',
    body          TEXT DEFAULT '',
    display_name  TEXT DEFAULT '',
    visibility    TEXT DEFAULT 'public',
    nav           INTEGER DEFAULT 0,
    parent_id     TEXT DEFAULT NULL,
    created_at    TEXT DEFAULT (datetime('now')),
    updated_at    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS revisions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id   TEXT NOT NULL,
    content     TEXT DEFAULT '',
    summary     TEXT DEFAULT '',
    format      TEXT DEFAULT 'html',
    agent       TEXT DEFAULT 'admin',
    created_at  TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (record_id) REFERENCES content(record_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS site_index (
    id    INTEGER PRIMARY KEY CHECK (id = 1),
    data  TEXT DEFAULT '{}'
  );

  INSERT OR IGNORE INTO site_index (id, data) VALUES (1, '{"entries":[]}');
`);

// Prepared statements
const stmts = {
  getAllContent: db.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM revisions r WHERE r.record_id = c.record_id) AS revision_count
    FROM content c ORDER BY c.updated_at DESC
  `),
  getPublished: db.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM revisions r WHERE r.record_id = c.record_id) AS revision_count
    FROM content c WHERE c.status = 'published' ORDER BY c.updated_at DESC
  `),
  getPublishedByType: db.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM revisions r WHERE r.record_id = c.record_id) AS revision_count
    FROM content c WHERE c.status = 'published' AND c.content_type = ? ORDER BY c.updated_at DESC
  `),
  getBySlug: db.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM revisions r WHERE r.record_id = c.record_id) AS revision_count
    FROM content c WHERE c.slug = ?
  `),
  getByRecordId: db.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM revisions r WHERE r.record_id = c.record_id) AS revision_count
    FROM content c WHERE c.record_id = ?
  `),
  insertContent: db.prepare(`
    INSERT INTO content (record_id, content_type, title, slug, status, level, tags, keywords, body, display_name, visibility, nav, parent_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateContent: db.prepare(`
    UPDATE content SET title=?, slug=?, status=?, level=?, tags=?, keywords=?, body=?, display_name=?,
    visibility=?, nav=?, parent_id=?, content_type=?, updated_at=datetime('now') WHERE record_id=?
  `),
  deleteContent: db.prepare(`DELETE FROM content WHERE record_id = ?`),
  getRevisions: db.prepare(`SELECT * FROM revisions WHERE record_id = ? ORDER BY created_at DESC`),
  insertRevision: db.prepare(`INSERT INTO revisions (record_id, content, summary, format, agent) VALUES (?, ?, ?, ?, ?)`),
  getSiteIndex: db.prepare(`SELECT data FROM site_index WHERE id = 1`),
  updateSiteIndex: db.prepare(`UPDATE site_index SET data = ? WHERE id = 1`),
};

// ── Middleware ──────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Helper ─────────────────────────────────────────────────
function parseRecord(row) {
  if (!row) return null;
  return {
    ...row,
    tags: JSON.parse(row.tags || '[]'),
    keywords: JSON.parse(row.keywords || '[]'),
  };
}

function generateRecordId(type, slug) {
  return `${type}:${slug}`;
}

// ── PUBLIC API ─────────────────────────────────────────────

// Get all published content (public)
app.get('/api/content', (req, res) => {
  const type = req.query.content_type;
  const rows = type ? stmts.getPublishedByType.all(type) : stmts.getPublished.all();
  res.json(rows.map(parseRecord));
});

// Get single content by slug (public)
app.get('/api/content/:slug', (req, res) => {
  const row = stmts.getBySlug.get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const parsed = parseRecord(row);
  // Include revisions for public article view (latest only)
  const revisions = stmts.getRevisions.all(row.record_id);
  parsed.current_revision = revisions[0] || null;
  parsed.revision_count = revisions.length;
  res.json(parsed);
});

// Get site index (public)
app.get('/api/index', (req, res) => {
  const row = stmts.getSiteIndex.get();
  res.json(JSON.parse(row.data));
});

// Verify password (returns success/failure)
app.post('/api/auth/verify', (req, res) => {
  const { password } = req.body;
  if (!password || hashPassword(password) !== ADMIN_HASH) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  res.json({ ok: true });
});

// ── ADMIN API (requires password) ──────────────────────────

// Get ALL content including drafts (admin)
app.get('/api/admin/content', verifyAuth, (req, res) => {
  const rows = stmts.getAllContent.all();
  res.json(rows.map(parseRecord));
});

// Get single content with revisions (admin)
app.get('/api/admin/content/:recordId', verifyAuth, (req, res) => {
  const row = stmts.getByRecordId.get(req.params.recordId);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const parsed = parseRecord(row);
  parsed.revisions = stmts.getRevisions.all(row.record_id);
  res.json(parsed);
});

// Create content
app.post('/api/admin/content', verifyAuth, (req, res) => {
  const { content_type, title, slug, status, level, tags, keywords, body, display_name, visibility, nav, parent_id } = req.body;
  if (!title || !slug) return res.status(400).json({ error: 'title and slug are required' });

  const record_id = generateRecordId(content_type || 'wiki', slug);
  try {
    stmts.insertContent.run(
      record_id, content_type || 'wiki', title, slug, status || 'draft',
      level || '101', JSON.stringify(tags || []), JSON.stringify(keywords || []),
      body || '', display_name || '', visibility || 'public', nav ? 1 : 0, parent_id || null
    );
    // Create initial revision if body provided
    if (body) {
      stmts.insertRevision.run(record_id, body, 'Initial creation', 'html', 'admin');
    }
    // Update site index
    updateSiteIndex();
    const created = stmts.getByRecordId.get(record_id);
    res.status(201).json(parseRecord(created));
  } catch (e) {
    if (e.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Content with this slug already exists' });
    }
    res.status(500).json({ error: e.message });
  }
});

// Update content
app.put('/api/admin/content/:recordId', verifyAuth, (req, res) => {
  const { title, slug, status, level, tags, keywords, body, display_name, visibility, nav, parent_id, content_type, summary } = req.body;
  const existing = stmts.getByRecordId.get(req.params.recordId);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  try {
    stmts.updateContent.run(
      title ?? existing.title, slug ?? existing.slug, status ?? existing.status,
      level ?? existing.level, JSON.stringify(tags ?? JSON.parse(existing.tags)),
      JSON.stringify(keywords ?? JSON.parse(existing.keywords)),
      body ?? existing.body, display_name ?? existing.display_name,
      visibility ?? existing.visibility, nav !== undefined ? (nav ? 1 : 0) : existing.nav,
      parent_id !== undefined ? parent_id : existing.parent_id,
      content_type ?? existing.content_type, req.params.recordId
    );
    // Create revision if body changed
    if (body !== undefined && body !== existing.body) {
      stmts.insertRevision.run(req.params.recordId, body, summary || 'Updated', 'html', 'admin');
    }
    updateSiteIndex();
    const updated = stmts.getByRecordId.get(req.params.recordId);
    res.json(parseRecord(updated));
  } catch (e) {
    if (e.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Slug already in use' });
    }
    res.status(500).json({ error: e.message });
  }
});

// Delete content
app.delete('/api/admin/content/:recordId', verifyAuth, (req, res) => {
  const existing = stmts.getByRecordId.get(req.params.recordId);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  stmts.deleteContent.run(req.params.recordId);
  updateSiteIndex();
  res.json({ ok: true });
});

// Get revisions for a record
app.get('/api/admin/revisions/:recordId', verifyAuth, (req, res) => {
  const revisions = stmts.getRevisions.all(req.params.recordId);
  res.json(revisions);
});

// Update site index
app.put('/api/admin/index', verifyAuth, (req, res) => {
  stmts.updateSiteIndex.run(JSON.stringify(req.body));
  res.json({ ok: true });
});

function updateSiteIndex() {
  const rows = stmts.getAllContent.all();
  const entries = rows.map(r => ({
    content_id: r.record_id,
    slug: r.slug,
    title: r.title,
    content_type: r.content_type,
    status: r.status,
    visibility: r.visibility,
    updated_at: r.updated_at,
    level: r.level,
    tags: JSON.parse(r.tags || '[]'),
    keywords: JSON.parse(r.keywords || '[]'),
  }));
  const slugMap = {};
  entries.forEach(e => { slugMap[e.slug] = e.content_id; });
  stmts.updateSiteIndex.run(JSON.stringify({ entries, slug_map: slugMap }));
}

// ── Serve admin panel ──────────────────────────────────────
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ── SPA fallback ───────────────────────────────────────────
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`EO Wiki server running at http://localhost:${PORT}`);
  console.log(`Admin panel at http://localhost:${PORT}/admin/`);
});
