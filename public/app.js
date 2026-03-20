/* ── Emergent Ontology Wiki ── */

const API_GET  = '/api/content';
const API_POST = '/api/content';

// ── State ──────────────────────────────────────────────
let articles = [];
let activeLevel = null;
let activeCluster = null;
let currentView = 'grouped';

// ── Clusters ───────────────────────────────────────────
const CLUSTERS = {
  'Foundation':    { keywords: ['ontology','being','existence','emergence','foundation','metaphysics','reality','ground'], css: 'cluster-foundation' },
  'Entity Types':  { keywords: ['entity','object','process','event','substance','particular','universal','type','kind'], css: 'cluster-entities' },
  'Operators':     { keywords: ['operator','relation','composition','transformation','function','mapping','morphism'], css: 'cluster-operators' },
  'Dynamics':      { keywords: ['change','time','causation','dynamics','evolution','becoming','temporal','flux'], css: 'cluster-dynamics' },
  'Formal':        { keywords: ['formal','logic','axiom','proof','theorem','structure','model','category','algebra'], css: 'cluster-formal' },
  'Applied':       { keywords: ['applied','practice','method','system','design','technology','implementation','tool'], css: 'cluster-applied' },
};

function clusterOf(art) {
  const text = `${art.title} ${(art.tags||[]).join(' ')} ${(art.keywords||[]).join(' ')} ${art.body||''}`.toLowerCase();
  let best = null, bestScore = 0;
  for (const [name, info] of Object.entries(CLUSTERS)) {
    const score = info.keywords.reduce((s, k) => s + (text.includes(k) ? 1 : 0), 0);
    if (score > bestScore) { best = name; bestScore = score; }
  }
  return best || 'Foundation';
}

function clusterCSS(name) {
  return CLUSTERS[name]?.css || 'cluster-default';
}

// ── Data ───────────────────────────────────────────────
async function fetchArticles() {
  const grid = document.getElementById('article-grid');
  grid.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading articles...</p></div>';

  try {
    const res = await fetch(API_GET);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    articles = normalizeData(data);
  } catch (e) {
    console.warn('API fetch failed, using demo data:', e);
    articles = getDemoArticles();
  }

  buildFilters();
  renderList();
  handleHash();
}

function normalizeData(data) {
  // Handle various API response shapes
  const list = Array.isArray(data) ? data : (data.items || data.articles || data.data || []);
  return list.map((item, i) => ({
    id:       item.id || item._id || i + 1,
    title:    item.title || item.meta?.title || item.name || 'Untitled',
    slug:     item.slug || item.meta?.slug || slugify(item.title || item.meta?.title || `article-${i}`),
    level:    item.level || item.meta?.level || '101',
    tags:     parseTags(item.tags || item.meta?.tags),
    keywords: parseTags(item.keywords || item.meta?.keywords),
    body:     item.body || item.content || item.meta?.body || item.revisions?.[0]?.body || '',
    status:   item.status || item.meta?.status || 'published',
    created:  item.created_at || item.created || new Date().toISOString(),
  }));
}

function parseTags(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(t => typeof t === 'string' ? t.trim() : String(t)).filter(Boolean);
  if (typeof val === 'string') return val.split(',').map(t => t.trim()).filter(Boolean);
  return [];
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ── Filters ────────────────────────────────────────────
function buildFilters() {
  const levels = [...new Set(articles.map(a => String(a.level)))].sort();
  const clusters = [...new Set(articles.map(a => clusterOf(a)))].sort();

  document.getElementById('level-filters').innerHTML = levels.map(lv =>
    `<span class="pill${activeLevel===lv?' active':''}" onclick="toggleLevel('${lv}')">${lv}</span>`
  ).join('');

  document.getElementById('cluster-filters').innerHTML = clusters.map(c =>
    `<span class="pill${activeCluster===c?' active':''}" onclick="toggleCluster('${c}')">${c}</span>`
  ).join('');
}

function toggleLevel(lv) {
  activeLevel = activeLevel === lv ? null : lv;
  buildFilters();
  renderList();
}

function toggleCluster(c) {
  activeCluster = activeCluster === c ? null : c;
  buildFilters();
  renderList();
}

function setView(v) {
  currentView = v;
  document.querySelectorAll('.vt').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  renderList();
}

// ── Filtered Articles ──────────────────────────────────
function filtered() {
  const q = (document.getElementById('filter-input')?.value || '').toLowerCase();
  const sq = (document.getElementById('search-input')?.value || '').toLowerCase();
  const query = q || sq;

  return articles.filter(a => {
    if (activeLevel && String(a.level) !== activeLevel) return false;
    if (activeCluster && clusterOf(a) !== activeCluster) return false;
    if (query) {
      const text = `${a.title} ${a.tags.join(' ')} ${a.keywords.join(' ')} ${a.body}`.toLowerCase();
      if (!text.includes(query)) return false;
    }
    return true;
  });
}

// ── Render List ────────────────────────────────────────
function renderList() {
  const grid = document.getElementById('article-grid');
  const arts = filtered();

  // Also render search results if overlay is open
  renderSearchResults(arts);

  if (!arts.length) {
    grid.innerHTML = `<div class="empty-state"><div class="icon">∿</div><p>No articles found</p></div>`;
    return;
  }

  if (currentView === 'all') {
    grid.innerHTML = `<div class="grid">${arts.map(cardHTML).join('')}</div>`;
  } else if (currentView === 'level') {
    const groups = groupBy(arts, a => String(a.level));
    grid.innerHTML = Object.entries(groups).sort(([a],[b]) => a.localeCompare(b)).map(([lv, items]) =>
      `<div class="group-label">Level ${lv}</div><div class="grid">${items.map(cardHTML).join('')}</div>`
    ).join('');
  } else {
    const groups = groupBy(arts, a => clusterOf(a));
    grid.innerHTML = Object.entries(groups).sort(([a],[b]) => a.localeCompare(b)).map(([cl, items]) =>
      `<div class="group-label">${cl}</div><div class="grid">${items.map(cardHTML).join('')}</div>`
    ).join('');
  }
}

function cardHTML(a) {
  const cluster = clusterOf(a);
  const excerpt = stripMd(a.body).slice(0, 120);
  return `
    <div class="card ${clusterCSS(cluster)}" onclick="showArticle(${a.id})">
      <div class="card-title">${esc(a.title)}</div>
      <div class="card-meta">
        <span class="tag lv">${a.level}</span>
        ${a.tags.slice(0, 3).map(t => `<span class="tag">${esc(t)}</span>`).join('')}
      </div>
      ${excerpt ? `<div class="card-excerpt">${esc(excerpt)}</div>` : ''}
    </div>`;
}

function groupBy(arr, fn) {
  const m = {};
  arr.forEach(item => { const k = fn(item); (m[k] = m[k] || []).push(item); });
  return m;
}

// ── Search ─────────────────────────────────────────────
function renderSearchResults(arts) {
  const container = document.getElementById('search-results');
  if (!container) return;
  const q = (document.getElementById('search-input')?.value || '').toLowerCase();
  if (!q) { container.innerHTML = ''; return; }

  container.innerHTML = arts.slice(0, 15).map(a => `
    <div class="sr-item" onclick="closeSearch();showArticle(${a.id})">
      <div class="sr-title">${esc(a.title)}</div>
      <div class="sr-excerpt">${esc(stripMd(a.body).slice(0, 80))}</div>
    </div>
  `).join('') || '<div class="sr-item"><div class="sr-title">No results</div></div>';
}

function openSearch() {
  document.getElementById('search-overlay').classList.remove('hidden');
  document.getElementById('search-input').value = '';
  document.getElementById('search-input').focus();
}

function closeSearch() {
  document.getElementById('search-overlay').classList.add('hidden');
  document.getElementById('search-input').value = '';
}

// ── Article View ───────────────────────────────────────
function showArticle(id) {
  const a = articles.find(x => x.id == id);
  if (!a) return;

  window.location.hash = a.slug;

  document.getElementById('list-view').classList.add('hidden');
  document.getElementById('article-view').classList.remove('hidden');

  const cluster = clusterOf(a);

  document.getElementById('article-content').innerHTML = `
    <h1 class="art-title">${esc(a.title)}</h1>
    <div class="art-meta">
      <span class="tag lv">${a.level}</span>
      <span class="tag">${cluster}</span>
      ${a.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}
    </div>
    <div class="art-body">${renderMarkdown(a.body)}</div>
  `;

  // Related articles
  const rel = findRelated(a);
  const relEl = document.getElementById('related-articles');
  if (rel.length) {
    relEl.innerHTML = `
      <h3>Related Articles</h3>
      <div class="related-list">
        ${rel.map(r => `<span class="related-chip" onclick="showArticle(${r.id})">${esc(r.title)}</span>`).join('')}
      </div>`;
  } else {
    relEl.innerHTML = '';
  }

  window.scrollTo(0, 0);
}

function findRelated(a) {
  const cluster = clusterOf(a);
  const kw = new Set([...a.tags, ...a.keywords].map(s => s.toLowerCase()));
  return articles
    .filter(b => b.id !== a.id)
    .map(b => {
      let score = 0;
      if (clusterOf(b) === cluster) score += 2;
      [...b.tags, ...b.keywords].forEach(t => { if (kw.has(t.toLowerCase())) score += 1; });
      return { ...b, score };
    })
    .filter(b => b.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

// ── Navigation ─────────────────────────────────────────
function goBack() {
  window.location.hash = '';
  document.getElementById('list-view').classList.remove('hidden');
  document.getElementById('article-view').classList.add('hidden');
  window.scrollTo(0, 0);
}

function handleHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  const a = articles.find(x => x.slug === hash || String(x.id) === hash);
  if (a) showArticle(a.id);
}

// ── Markdown (simple) ──────────────────────────────────
function renderMarkdown(md) {
  if (!md) return '';
  return md
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold & italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Wiki links: [[Article Name]]
    .replace(/\[\[([^\]]+)\]\]/g, (_, name) => {
      const target = articles.find(a => a.title.toLowerCase() === name.toLowerCase());
      if (target) return `<a href="#${target.slug}" onclick="event.preventDefault();showArticle(${target.id})">${esc(name)}</a>`;
      return `<span style="color:var(--danger)">${esc(name)}</span>`;
    })
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hupbl])(.+)/gm, '<p>$1</p>')
    // Clean up
    .replace(/<p><\/p>/g, '')
    .replace(/<\/blockquote>\n?<blockquote>/g, '<br>');
}

function stripMd(s) {
  if (!s) return '';
  return s.replace(/[#*`>\[\]()-]/g, '').replace(/\n+/g, ' ').trim();
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ── Theme ──────────────────────────────────────────────
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('eo-theme', isDark ? 'light' : 'dark');
}

function loadTheme() {
  const saved = localStorage.getItem('eo-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

// ── Keyboard Shortcuts ─────────────────────────────────
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
  if (e.key === 'Escape') {
    closeSearch();
  }
});

window.addEventListener('hashchange', handleHash);

// ── Demo Data ──────────────────────────────────────────
function getDemoArticles() {
  return [
    {
      id: 1,
      title: 'What is Emergent Ontology?',
      slug: 'what-is-emergent-ontology',
      level: '101',
      tags: ['foundation', 'introduction'],
      keywords: ['ontology', 'emergence', 'being', 'reality'],
      body: `## Overview\n\nEmergent Ontology (EO) is a framework for understanding how complex structures of being arise from simpler components through processes of emergence.\n\nUnlike classical ontology, which seeks fixed categories, EO treats **categories themselves as emergent** — arising from the dynamic interplay of entities, operators, and contexts.\n\n## Core Principles\n\n- **Emergence over essence**: Structure arises from interaction, not from pre-given essences\n- **Process over substance**: Being is fundamentally dynamic\n- **Relation over isolation**: Entities are constituted by their relations\n- **Context-sensitivity**: Ontological status depends on observational context\n\n## Why It Matters\n\nTraditional ontologies struggle with complexity, novelty, and context-dependence. EO provides tools for thinking about systems where the categories themselves are in flux.\n\n> "The map is not the territory, but in EO, the territory itself is always being redrawn."`,
      status: 'published',
      created: '2024-01-15',
    },
    {
      id: 2,
      title: 'Entity Types in EO',
      slug: 'entity-types',
      level: '201',
      tags: ['entities', 'classification'],
      keywords: ['entity', 'type', 'particular', 'universal', 'kind'],
      body: `## Entity Classification\n\nEO recognizes several fundamental entity types, though it acknowledges that these categories are themselves emergent.\n\n### Particulars\n\nIndividual, concrete entities that exist in space and time. In EO, particulars are not bare substrata but are constituted by their relational properties.\n\n### Processes\n\nTemporal entities that unfold over time. EO treats processes as ontologically primary — objects are understood as relatively stable patterns within larger process flows.\n\n### Relations\n\nConnections between entities that are themselves ontologically real. In EO, relations can be:\n- **Internal**: constitutive of the relata\n- **External**: connecting but not constituting\n- **Emergent**: arising from lower-level interactions\n\n### Operators\n\nSpecial entities that transform other entities. See [[Operators in EO]] for details.\n\n> Entity types are not fixed boxes but attractor basins in ontological space.`,
      status: 'published',
      created: '2024-02-10',
    },
    {
      id: 3,
      title: 'Operators in EO',
      slug: 'operators-in-eo',
      level: '201',
      tags: ['operators', 'transformation'],
      keywords: ['operator', 'composition', 'transformation', 'function', 'morphism'],
      body: `## What Are Operators?\n\nOperators are the engines of emergence in EO. They are entities that act on other entities to produce new structures.\n\n## The Nine Operators\n\nEO identifies nine fundamental operators:\n\n- **∅ (Null)** — Absence, the void operator\n- **σ (Selection)** — Filtering and choosing\n- **ι (Identity)** — Preserving structure\n- **| (Boundary)** — Creating distinctions\n- **⋈ (Join)** — Combining entities\n- **∨ (Branch)** — Splitting possibilities\n- **∿ (Wave)** — Oscillation and rhythm\n- **⊕ (Compose)** — Building complex from simple\n- **↬ (Emerge)** — Generating novelty\n\n## Operator Composition\n\nOperators can be composed to form higher-order operators. The composition of ⊕ and ↬ is particularly important — it describes how novel wholes arise from the combination of parts.\n\n## Formal Properties\n\nOperators in EO satisfy certain algebraic properties:\n- Composition is associative\n- ι is the identity element\n- ∅ is the absorbing element`,
      status: 'published',
      created: '2024-02-20',
    },
    {
      id: 4,
      title: 'Emergence and Causation',
      slug: 'emergence-and-causation',
      level: '301',
      tags: ['dynamics', 'causation'],
      keywords: ['emergence', 'causation', 'dynamics', 'change', 'temporal'],
      body: `## The Problem of Emergence\n\nHow do genuinely new properties arise from combinations of simpler elements? This is the central puzzle that EO addresses.\n\n## Weak vs Strong Emergence\n\n**Weak emergence**: New properties that are in principle predictable from lower-level descriptions, but surprising in practice.\n\n**Strong emergence**: New properties that are not even in principle deducible from lower-level descriptions. EO takes strong emergence seriously.\n\n## Downward Causation\n\nEO embraces a form of downward causation — higher-level emergent structures can constrain and influence lower-level dynamics.\n\nThis is formalized through the ↬ operator acting in composition with | (boundary):\n\n\`↬ ∘ | : lower-level → higher-level constraints\`\n\n## Temporal Dynamics\n\nEmergence is not instantaneous. It unfolds through:\n1. **Accumulation**: Building up of interactions\n2. **Threshold**: Critical point of phase transition\n3. **Stabilization**: New level becomes self-sustaining\n4. **Feedback**: New level constrains its own conditions`,
      status: 'published',
      created: '2024-03-05',
    },
    {
      id: 5,
      title: 'Formal Foundations of EO',
      slug: 'formal-foundations',
      level: '401',
      tags: ['formal', 'mathematics'],
      keywords: ['formal', 'logic', 'axiom', 'category', 'algebra', 'structure'],
      body: `## Category-Theoretic Framework\n\nEO can be formalized using category theory. The key structures are:\n\n### Categories\n\n- **Ent**: Category of entities and morphisms between them\n- **Op**: Category of operators\n- **Em**: Category of emergent structures\n\n### Functors\n\nThe emergence process is modeled as a functor:\n\n\`E: Ent × Op → Em\`\n\nThis functor preserves composition (emergence is compositional) but is not faithful (information is lost/gained in emergence).\n\n## Axioms\n\n1. **Closure**: The composition of operators yields an operator\n2. **Emergence**: For any sufficiently complex composition, there exists an emergent property not present in the components\n3. **Context**: Ontological status is relative to an observational functor\n4. **Grounding**: Every emergent structure has a ground in some base category\n\n## Open Problems\n\n- Characterizing the precise conditions under which emergence occurs\n- Formalizing the relationship between levels\n- Connecting EO to existing mathematical frameworks (topos theory, homotopy type theory)`,
      status: 'published',
      created: '2024-03-20',
    },
    {
      id: 6,
      title: 'EO and Systems Thinking',
      slug: 'eo-and-systems-thinking',
      level: '201',
      tags: ['applied', 'systems'],
      keywords: ['system', 'applied', 'practice', 'design', 'implementation'],
      body: `## Bridging Theory and Practice\n\nEO is not just an abstract framework — it has practical implications for how we understand and design complex systems.\n\n## Applications\n\n### Software Architecture\n\nEO suggests that good software architecture should:\n- Allow for emergence (not over-specify)\n- Make boundaries explicit (the | operator)\n- Support composition (the ⊕ operator)\n\n### Organizational Design\n\nOrganizations are emergent entities. EO provides tools for:\n- Understanding how organizational culture emerges\n- Designing for adaptability rather than rigidity\n- Recognizing the role of boundaries and interfaces\n\n### Knowledge Management\n\nThis wiki itself is an experiment in EO-informed knowledge management:\n- Articles are entities that relate to each other\n- Categories emerge from content, not vice versa\n- The structure evolves as understanding deepens\n\n> The best systems are those that leave room for emergence.`,
      status: 'published',
      created: '2024-04-01',
    },
  ];
}

// ── Init ───────────────────────────────────────────────
loadTheme();
fetchArticles();
