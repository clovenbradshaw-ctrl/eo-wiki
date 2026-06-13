# Forms

**Record ID:** experiment:phaseposts  
**DB ID:** 14  
**Status:** archived  
**Updated:** 2026-03-22T21:42:45.596Z  

---

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>27 Forms</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #f4f3ef;
    --surface: #fff;
    --border: #e2e0d8;
    --text: #2a2a28;
    --dim: #999;
    --r1: #c43838; --r2: #c47028; --r3: #a88c18; --r4: #6838a8; --r5: #1868a8;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--text); overflow:hidden; height:100vh; }

  /* Header bar */
  .bar {
    height:44px; border-bottom:1px solid var(--border); display:flex; align-items:center;
    padding:0 16px; gap:6px; flex-wrap:nowrap; background:#fff; z-index:100; position:relative;
  }
  .bar-title {
    font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:700;
    letter-spacing:-0.03em; margin-right:10px; white-space:nowrap;
  }
  .btn {
    padding:3px 9px; font:500 11px/1 'DM Sans',sans-serif; border-radius:3px;
    border:1px solid var(--border); background:transparent; color:var(--dim);
    cursor:pointer; transition:all 0.15s; white-space:nowrap;
  }
  .btn:hover { border-color:#bbb; color:var(--text); }
  .btn.on { background:var(--text); color:#fff; border-color:var(--text); font-weight:600; }
  .sep { color:#ddd; font-size:11px; margin:0 2px; }
  .slider { width:54px; accent-color:#888; }

  /* Scene */
  .scene {
    width:100%; height:calc(100vh - 44px); perspective:1400px; perspective-origin:50% 46%;
    position:relative; cursor:grab;
  }
  .scene.dragging { cursor:grabbing; }
  .scene.has-sel { cursor:default; }

  .rig {
    width:100%; height:100%; display:flex; align-items:center; justify-content:center;
    transform-style:preserve-3d; transition:opacity 0.3s;
  }
  .rig.dimmed { opacity:0.1; pointer-events:none; }

  .pivot { transform-style:preserve-3d; }
  .pivot.smooth { transition:transform 0.4s ease; }

  /* Cells */
  .cell {
    position:absolute; transform-style:preserve-3d; cursor:pointer;
    transition:transform 0.35s ease;
  }
  .cell:hover { z-index:100; }
  .cell.hovered { transform:scale(1.12); }

  .face {
    position:absolute; display:flex; align-items:center; justify-content:center;
    backface-visibility:hidden; border:1px solid rgba(0,0,0,0.08);
    font:600 10px/1.1 'JetBrains Mono',monospace; color:#fff;
    text-shadow:0 1px 2px rgba(0,0,0,0.3); text-align:center; padding:2px;
  }

  /* Tooltip */
  .tip {
    position:absolute; bottom:calc(100% + 6px); left:50%; transform:translateX(-50%);
    background:#fff; border:1px solid #ddd; border-radius:4px; padding:4px 8px;
    white-space:nowrap; font:11px 'DM Sans',sans-serif; color:var(--text);
    box-shadow:0 2px 8px rgba(0,0,0,0.1); pointer-events:none; z-index:200;
    display:none;
  }
  .cell:hover .tip { display:block; }
  .tip strong { font-weight:600; }
  .tip .ct { color:var(--dim); margin-left:6px; }

  /* Detail overlay */
  .overlay {
    position:absolute; inset:0; display:none; align-items:center; justify-content:center;
    z-index:500;
  }
  .overlay.open { display:flex; }

  .cross {
    display:grid; grid-template-columns:repeat(3,120px); grid-template-rows:repeat(3,120px);
    gap:4px; animation:popIn 0.22s ease;
  }
  .cross-cell {
    border-radius:4px; padding:12px; display:flex; flex-direction:column; justify-content:space-between;
  }
  .cross-label { font-size:9px; color:rgba(255,255,255,0.5); text-transform:uppercase; letter-spacing:0.08em; }
  .cross-val { font-size:18px; font-weight:700; color:#fff; }
  .cross-sub { font-size:10px; color:rgba(255,255,255,0.55); }
  .cross-center { align-items:center; justify-content:center; text-align:center; }
  .cross-center .cross-val { font-size:30px; }
  .cross-center .glyph { font-size:18px; color:rgba(255,255,255,0.6); margin-top:2px; }

  .info-card {
    position:absolute; top:calc(50% + 204px); left:50%; transform:translateX(-50%);
    background:#fff; border:1px solid #ddd; border-radius:6px; padding:12px 16px;
    width:372px; max-width:90vw; box-shadow:0 4px 20px rgba(0,0,0,0.1);
    animation:popIn 0.22s ease;
  }
  .info-head { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:3px; }
  .info-name { font-size:15px; font-weight:700; color:#222; }
  .info-count { font-size:13px; font-weight:700; }
  .info-desc { font-size:12px; color:#777; line-height:1.4; margin-bottom:6px; }
  .info-tags { display:flex; flex-wrap:wrap; gap:3px; }
  .info-tag {
    padding:2px 6px; font-size:11px; background:#f0f0e8; color:#555;
    border-radius:3px; border:1px solid #e4e4d8;
  }
  .info-sp { margin-top:5px; font-size:11px; color:#999; }

  .nav-btn {
    position:absolute; top:50%; transform:translateY(-50%);
    background:#fff; border:1px solid #ddd; border-radius:20px;
    width:36px; height:36px; font-size:16px; cursor:pointer; color:#666;
    box-shadow:0 2px 8px rgba(0,0,0,0.08); display:flex; align-items:center; justify-content:center;
  }
  .nav-btn:hover { border-color:#bbb; }
  .nav-prev { left:20px; }
  .nav-next { right:20px; }
  .close-hint { position:absolute; top:16px; right:20px; font-size:11px; color:#bbb; }

  /* Legend */
  .legend {
    position:fixed; bottom:8px; left:16px; display:flex; gap:8px;
    font-size:10px; color:#aaa; z-index:10;
  }
  .legend-dot {
    width:7px; height:7px; border-radius:1px; display:inline-block;
    vertical-align:middle; margin-right:3px;
  }

  @keyframes popIn { from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)} }
</style>
</head>
<body>

<div class="bar" id="bar">
  <span class="bar-title">27 Forms</span>
  <button class="btn on" data-view="capacity ground">capacity ground</button>
  <button class="btn" data-view="flat">Op × Ref</button>
  <span class="sep">|</span>
  <button class="btn on" data-color="realm">Realm</button>
  <button class="btn" data-color="operator">Operator</button>
  <button class="btn" data-color="density">Density</button>
  <span class="sep cam-only">|</span>
  <button class="btn cam-only" data-cam="iso">Iso</button>
  <button class="btn cam-only" data-cam="top">Top</button>
  <button class="btn cam-only" data-cam="front">Front</button>
  <button class="btn cam-only" data-cam="right">Right</button>
  <button class="btn cam-only" data-cam="left">Left</button>
  <span class="sep cam-only">|</span>
  <input type="range" class="slider cam-only" id="explodeSlider" min="0" max="3" step="0.1" value="0" title="Explode">
</div>

<div class="scene" id="scene">
  <div class="rig" id="rig">
    <div class="pivot smooth" id="pivot"></div>
  </div>

  <div class="overlay" id="overlay">
    <div class="cross" id="cross"></div>
    <div class="info-card" id="infoCard"></div>
    <button class="nav-btn nav-prev" id="navPrev">←</button>
    <button class="nav-btn nav-next" id="navNext">→</button>
    <div class="close-hint">click anywhere to close</div>
  </div>
</div>

<div class="legend" id="legend"></div>

<script>
const P = [
  {id:1,p:[0,0,0],op:"NUL",ref:"Ground",mode:"Differentiating",dom:"Existence",addr:"⟨−1,−1,−1⟩",name:"The Void",ent:"Emanon",realm:1,v:311,desc:"Pure potential. Absence of the ambient condition.",ex:"lack, be silent, fail, rest, decay",g:"ν",sp:null},
  {id:2,p:[0,0,1],op:"NUL",ref:"Figure",mode:"Differentiating",dom:"Existence",addr:"⟨−1,−1,+1⟩",name:"Sequential Phantom",ent:"Emanon",realm:1,v:1873,desc:"Specific entities withdrawn from presence.",ex:"die, hide, stop, kill, conceal",g:"ν",sp:null},
  {id:3,p:[0,0,2],op:"NUL",ref:"Pattern",mode:"Differentiating",dom:"Existence",addr:"⟨−1,−1,√2⟩",name:"Recursive Anonymity",ent:"Emanon",realm:1,v:24,desc:"A regularity withdrawn — not a thing but a tendency.",ex:"avoid, taboo, hate, hinder, diminish",g:"ν",sp:"desert"},
  {id:4,p:[0,1,0],op:"DEF",ref:"Ground",mode:"Differentiating",dom:"Significance",addr:"⟨−1,+1,−1⟩",name:"Structural Phantom",ent:"Emanon",realm:1,v:1189,desc:"The interpretive substrate shifts.",ex:"sleep, be afraid, remain, calm down",g:"δ",sp:null},
  {id:5,p:[0,1,1],op:"DEF",ref:"Figure",mode:"Differentiating",dom:"Significance",addr:"⟨−1,+1,+1⟩",name:"Phantom Pulse",ent:"Emanon",realm:1,v:3890,desc:"A specific entity's read changes.",ex:"change, turn, increase, transform, move",g:"δ",sp:null},
  {id:6,p:[0,1,2],op:"DEF",ref:"Pattern",mode:"Differentiating",dom:"Significance",addr:"⟨−1,+1,√2⟩",name:"Emanon Sensitivity",ent:"Emanon",realm:1,v:290,desc:"A regularity is reread.",ex:"influence, affect, compare, resemble",g:"δ",sp:null},
  {id:7,p:[0,2,0],op:"SEG",ref:"Ground",mode:"Differentiating",dom:"Structure",addr:"⟨−1,√2,−1⟩",name:"Emergent Absence",ent:"Emanon",realm:2,v:24,desc:"Partitioning an ambient state — nearly inconceivable.",ex:"be alone, move away, separate",g:"κ",sp:"desert"},
  {id:8,p:[0,2,1],op:"SEG",ref:"Figure",mode:"Differentiating",dom:"Structure",addr:"⟨−1,√2,+1⟩",name:"Anonymous Flow",ent:"Emanon",realm:2,v:2187,desc:"A specific entity is partitioned.",ex:"divide, cut, separate, break, escape",g:"κ",sp:null},
  {id:9,p:[0,2,2],op:"SEG",ref:"Pattern",mode:"Differentiating",dom:"Structure",addr:"⟨−1,√2,√2⟩",name:"Field Flux",ent:"Emanon",realm:2,v:74,desc:"Drawing boundaries between patterns.",ex:"differ, distinguish, separate, vary",g:"κ",sp:null},
  {id:10,p:[1,0,0],op:"SIG",ref:"Ground",mode:"Relating",dom:"Existence",addr:"⟨+1,−1,−1⟩",name:"Instantiated Absence",ent:"Protogon",realm:2,v:893,desc:"The copular heartland.",ex:"believe, can, must, think, permit",g:"σ",sp:null},
  {id:11,p:[1,0,1],op:"SIG",ref:"Figure",mode:"Relating",dom:"Existence",addr:"⟨+1,−1,+1⟩",name:"Operator Fluency",ent:"Protogon",realm:2,v:1402,desc:"Pointing at something and giving it a name.",ex:"choose, decide, select, appoint",g:"σ",sp:null},
  {id:12,p:[1,0,2],op:"SIG",ref:"Pattern",mode:"Relating",dom:"Existence",addr:"⟨+1,−1,√2⟩",name:"Frame Rhythm",ent:"Protogon",realm:2,v:526,desc:"Definition aimed at the relational.",ex:"consider, classify, represent, lead",g:"σ",sp:null},
  {id:13,p:[1,1,0],op:"EVA",ref:"Ground",mode:"Relating",dom:"Significance",addr:"⟨+1,+1,−1⟩",name:"Scope",ent:"Protogon",realm:3,v:83,desc:"Indeterminacy as atmosphere.",ex:"doubt, hesitate, suspect, endure",g:"ψ",sp:null},
  {id:14,p:[1,1,1],op:"EVA",ref:"Figure",mode:"Relating",dom:"Significance",addr:"⟨+1,+1,+1⟩",name:"Full Figure Classic",ent:"Protogon",realm:3,v:40,desc:"Simultaneously present and indeterminate.",ex:"endure, bear, contest, doubt",g:"ψ",sp:null},
  {id:15,p:[1,1,2],op:"EVA",ref:"Pattern",mode:"Relating",dom:"Significance",addr:"⟨+1,+1,√2⟩",name:"Syntactic Coherence",ent:"Protogon",realm:3,v:36,desc:"Competing regularities without resolution.",ex:"contradict, conflict, oscillate",g:"ψ",sp:null},
  {id:16,p:[1,2,0],op:"CON",ref:"Ground",mode:"Relating",dom:"Structure",addr:"⟨+1,√2,−1⟩",name:"Phase Awareness",ent:"Protogon",realm:3,v:309,desc:"Maintaining a relationship to a persistent state.",ex:"trust, hold, endure, persist",g:"ε",sp:null},
  {id:17,p:[1,2,1],op:"CON",ref:"Figure",mode:"Relating",dom:"Structure",addr:"⟨+1,√2,+1⟩",name:"Intervention",ent:"Protogon",realm:3,v:3263,desc:"The vast middle of relational action.",ex:"bind, tie, meet, give, take",g:"ε",sp:null},
  {id:18,p:[1,2,2],op:"CON",ref:"Pattern",mode:"Relating",dom:"Structure",addr:"⟨+1,√2,√2⟩",name:"Trajectory",ent:"Protogon",realm:3,v:956,desc:"Binding pattern to pattern.",ex:"connect, control, follow, accompany",g:"ε",sp:null},
  {id:19,p:[2,0,0],op:"INS",ref:"Ground",mode:"Generating",dom:"Existence",addr:"⟨√2,−1,−1⟩",name:"Pattern Function",ent:"Holon-prone",realm:4,v:1588,desc:"Generating the substrate itself.",ex:"live, desire, endure, fear, exist",g:"α",sp:null},
  {id:20,p:[2,0,1],op:"INS",ref:"Figure",mode:"Generating",dom:"Existence",addr:"⟨√2,−1,+1⟩",name:"Dream Logic",ent:"Holon-prone",realm:4,v:10633,desc:"THE GRAVITY WELL. Every language invests most here.",ex:"begin, speak, throw, run, go",g:"α",sp:"gravity"},
  {id:21,p:[2,0,2],op:"INS",ref:"Pattern",mode:"Generating",dom:"Existence",addr:"⟨√2,−1,√2⟩",name:"Void Symbolics",ent:"Holon-prone",realm:4,v:477,desc:"Pushing a pattern into existence.",ex:"surpass, follow, compete, repeat",g:"α",sp:null},
  {id:22,p:[2,1,0],op:"REC",ref:"Ground",mode:"Generating",dom:"Significance",addr:"⟨√2,+1,−1⟩",name:"Dialectics",ent:"Holon-prone",realm:4,v:15,desc:"THE DEEPEST SIGERT. Ground restructures itself.",ex:"mature, recover, rebel",g:"Ω",sp:"abyss"},
  {id:23,p:[2,1,1],op:"REC",ref:"Figure",mode:"Generating",dom:"Significance",addr:"⟨√2,+1,+1⟩",name:"Pattern Recognition",ent:"Holon-prone",realm:4,v:409,desc:"Restructured at the level determining what change means.",ex:"organize, recover, restore, develop",g:"Ω",sp:null},
  {id:24,p:[2,1,2],op:"REC",ref:"Pattern",mode:"Generating",dom:"Significance",addr:"⟨√2,+1,√2⟩",name:"Ecology",ent:"Holon-prone",realm:4,v:57,desc:"Rules-about-rules being rewritten.",ex:"organize, arrange, govern, evolve",g:"Ω",sp:null},
  {id:25,p:[2,2,0],op:"SYN",ref:"Ground",mode:"Generating",dom:"Structure",addr:"⟨√2,√2,−1⟩",name:"Form",ent:"Holon-prone",realm:5,v:18,desc:"Meta-awareness. The substrate unified.",ex:"accumulate, harmonize, peace",g:"η",sp:"desert"},
  {id:26,p:[2,2,1],op:"SYN",ref:"Figure",mode:"Generating",dom:"Structure",addr:"⟨√2,√2,+1⟩",name:"Metadomaining",ent:"Holon-prone",realm:5,v:755,desc:"Creating semantic territories.",ex:"gather, collect, mix, blend, assemble",g:"η",sp:null},
  {id:27,p:[2,2,2],op:"SYN",ref:"Pattern",mode:"Generating",dom:"Structure",addr:"⟨√2,√2,√2⟩",name:"Resonant Cosmogenesis",ent:"Holon(∞↻)",realm:5,v:109,desc:"Complete integration. All axes emergent.",ex:"combine, multiply, harmonize, unite",g:"η",sp:"omega"},
];

const RC = {1:"#c43838",2:"#c47028",3:"#a88c18",4:"#6838a8",5:"#1868a8"};
const RL = {1:"I",2:"II",3:"III",4:"IV",5:"V"};
const RLF = {1:"I Pre-Structural",2:"II Systemic",3:"III Semantic",4:"IV Worldmaking",5:"V Resonance"};
const OC = {NUL:"#778",SIG:"#86c",INS:"#3a7",SEG:"#b90",CON:"#d70",SYN:"#28a",DEF:"#c46",EVA:"#a5c",REC:"#84a"};
const OPS = ["NUL","SIG","INS","SEG","CON","SYN","DEF","EVA","REC"];
const REFS = ["Ground","Figure","Pattern"];
const lm = Math.log(10634);

const CAMS = {iso:{rx:-25,ry:35},top:{rx:-89,ry:0},front:{rx:0,ry:0},right:{rx:0,ry:-90},left:{rx:0,ry:90}};

// State
let view = "capacity ground", colorMode = "realm", explode = 0;
let rx = -25, ry = 35;
let sel = null, dragging = false, dx = 0, dy = 0;

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function cellColor(p) {
  if (colorMode === "realm") return RC[p.realm];
  if (colorMode === "operator") return OC[p.op];
  const t = Math.log(p.v + 1) / lm;
  return `hsl(${Math.round(200+t*50)},${Math.round(15+t*50)}%,${Math.round(88-t*45)}%)`;
}

function pos3d(p) {
  const sp = 90 + explode * 45;
  if (view === "flat") {
    return { x: (REFS.indexOf(p.ref) - 1) * sp, y: -(OPS.indexOf(p.op) - 4) * (sp * 0.6), z: 0 };
  }
  return { x: (p.p[0]-1)*sp, y: -(p.p[1]-1)*sp, z: (p.p[2]-1)*sp };
}

function buildCells() {
  const pivot = $("#pivot");
  pivot.innerHTML = "";
  const sz = 38, h = sz/2;

  P.forEach(p => {
    const {x,y,z} = pos3d(p);
    const c = cellColor(p);

    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.id = p.id;
    cell.style.cssText = `width:${sz}px;height:${sz}px;margin-left:${-h}px;margin-top:${-h}px;transform:translate3d(${x}px,${y}px,${z}px);`;

    const faces = [
      { label: p.op, op: 0.88, tf: `translateZ(${h}px)` },
      { label: p.op, op: 0.65, tf: `rotateY(180deg) translateZ(${h}px)` },
      { label: p.mode.slice(0,4), op: 0.7, tf: `rotateY(90deg) translateZ(${h}px)` },
      { label: p.ref.slice(0,3), op: 0.7, tf: `rotateY(-90deg) translateZ(${h}px)` },
      { label: p.dom.slice(0,5), op: 0.6, tf: `rotateX(90deg) translateZ(${h}px)` },
      { label: p.dom.slice(0,5), op: 0.6, tf: `rotateX(-90deg) translateZ(${h}px)` },
    ];

    faces.forEach(f => {
      const face = document.createElement("div");
      face.className = "face";
      face.style.cssText = `width:${sz}px;height:${sz}px;background:${c};opacity:${f.op};transform:${f.tf};`;
      face.textContent = f.label;
      cell.appendChild(face);
    });

    // Tooltip
    const tip = document.createElement("div");
    tip.className = "tip";
    tip.innerHTML = `<strong>${p.name}</strong><span class="ct">${p.v.toLocaleString()}</span>`;
    cell.appendChild(tip);

    cell.addEventListener("click", e => { e.stopPropagation(); openDetail(p.id); });
    pivot.appendChild(cell);
  });
}

function updatePositions() {
  const cells = $$("#pivot .cell");
  cells.forEach(el => {
    const p = P.find(x => x.id === +el.dataset.id);
    const {x,y,z} = pos3d(p);
    const c = cellColor(p);
    el.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
    el.querySelectorAll(".face").forEach(f => f.style.background = c);
  });
}

function updatePivot(smooth) {
  const pivot = $("#pivot");
  pivot.classList.toggle("smooth", smooth);
  pivot.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
}

function openDetail(id) {
  sel = id;
  const s = P.find(p => p.id === id);
  const c = cellColor(s);

  // Cross
  const cross = $("#cross");
  cross.innerHTML = `
    <div></div>
    <div class="cross-cell" style="background:${c};border-radius:4px 4px 0 0">
      <div class="cross-label">Domain</div>
      <div class="cross-val">${s.dom}</div>
      <div class="cross-sub">Where you act</div>
    </div>
    <div></div>
    <div class="cross-cell" style="background:${c};opacity:0.85;border-radius:4px 0 0 4px">
      <div class="cross-label">Object</div>
      <div class="cross-val">${s.ref}</div>
      <div class="cross-sub">What you act on</div>
    </div>
    <div class="cross-cell cross-center" style="background:${c}">
      <div class="cross-label">Operator</div>
      <div class="cross-val">${s.op}</div>
      <div class="glyph">${s.g}</div>
    </div>
    <div class="cross-cell" style="background:${c};opacity:0.85;border-radius:0 4px 4px 0">
      <div class="cross-label">Mode</div>
      <div class="cross-val">${s.mode}</div>
      <div class="cross-sub">How you act</div>
    </div>
    <div></div>
    <div class="cross-cell" style="background:${c};opacity:0.9;border-radius:0 0 4px 4px">
      <div class="cross-label">Address</div>
      <div class="cross-val" style="font-family:'JetBrains Mono',monospace;font-size:15px">${s.addr}</div>
      <div class="cross-sub">${s.ent} · Realm ${RL[s.realm]}</div>
    </div>
    <div></div>
  `;

  // Info card
  const tags = s.ex.split(", ").map(w => `<span class="info-tag">${w}</span>`).join("");
  let spText = "";
  if (s.sp === "gravity") spText = "◉ Gravity well — 745:1 ratio to deepest desert";
  else if (s.sp === "abyss") spText = "★ Deepest desert — empty in 17/27 languages";
  else if (s.sp === "desert") spText = "★ Desert — among the sparsest across all languages";
  else if (s.sp === "omega") spText = "∞↻ All axes at emergent values";

  $("#infoCard").innerHTML = `
    <div class="info-head">
      <span class="info-name">${s.name}</span>
      <span class="info-count" style="color:${c}">${s.v.toLocaleString()} verbs</span>
    </div>
    <div class="info-desc">${s.desc}</div>
    <div class="info-tags">${tags}</div>
    ${spText ? `<div class="info-sp">${spText}</div>` : ""}
  `;

  $("#overlay").classList.add("open");
  $("#rig").classList.add("dimmed");
  $("#scene").classList.add("has-sel");
}

function closeDetail() {
  sel = null;
  $("#overlay").classList.remove("open");
  $("#rig").classList.remove("dimmed");
  $("#scene").classList.remove("has-sel");
}

function renderLegend() {
  const leg = $("#legend");
  if (colorMode === "realm") {
    leg.innerHTML = Object.entries(RC).map(([r,c]) =>
      `<span><span class="legend-dot" style="background:${c}"></span>${RLF[r]}</span>`
    ).join("");
  } else if (colorMode === "operator") {
    leg.innerHTML = Object.entries(OC).map(([op,c]) =>
      `<span><span class="legend-dot" style="background:${c}"></span>${op}</span>`
    ).join("");
  } else {
    leg.innerHTML = "<span>Light = sparse · Dark = dense</span>";
  }
}

// Init
buildCells();
updatePivot(true);
renderLegend();

// Bar: view buttons
$$("[data-view]").forEach(b => b.addEventListener("click", () => {
  view = b.dataset.view;
  $$("[data-view]").forEach(x => x.classList.toggle("on", x === b));
  $$(".cam-only").forEach(x => x.style.display = view === "capacity ground" ? "" : "none");
  closeDetail();
  updatePositions();
}));

// Bar: color buttons
$$("[data-color]").forEach(b => b.addEventListener("click", () => {
  colorMode = b.dataset.color;
  $$("[data-color]").forEach(x => x.classList.toggle("on", x === b));
  updatePositions();
  renderLegend();
}));

// Bar: camera buttons
$$("[data-cam]").forEach(b => b.addEventListener("click", () => {
  const cam = CAMS[b.dataset.cam];
  rx = cam.rx; ry = cam.ry;
  updatePivot(true);
}));

// Explode slider
$("#explodeSlider").addEventListener("input", e => {
  explode = parseFloat(e.target.value);
  updatePositions();
});

// Drag rotation
const scene = $("#scene");
scene.addEventListener("mousedown", e => {
  if (sel || e.target.closest(".cell")) return;
  dragging = true; dx = e.clientX; dy = e.clientY;
  scene.classList.add("dragging");
  $("#pivot").classList.remove("smooth");
});
window.addEventListener("mousemove", e => {
  if (!dragging) return;
  ry += (e.clientX - dx) * 0.4;
  rx = Math.max(-89, Math.min(89, rx - (e.clientY - dy) * 0.4));
  dx = e.clientX; dy = e.clientY;
  updatePivot(false);
});
window.addEventListener("mouseup", () => {
  dragging = false;
  scene.classList.remove("dragging");
});

// Touch rotation
let touchId = null;
scene.addEventListener("touchstart", e => {
  if (sel || e.target.closest(".cell") || e.touches.length > 1) return;
  const t = e.touches[0];
  touchId = t.identifier; dx = t.clientX; dy = t.clientY;
  $("#pivot").classList.remove("smooth");
}, {passive:true});
window.addEventListener("touchmove", e => {
  if (touchId === null) return;
  const t = Array.from(e.touches).find(x => x.identifier === touchId);
  if (!t) return;
  ry += (t.clientX - dx) * 0.4;
  rx = Math.max(-89, Math.min(89, rx - (t.clientY - dy) * 0.4));
  dx = t.clientX; dy = t.clientY;
  updatePivot(false);
}, {passive:true});
window.addEventListener("touchend", () => { touchId = null; });

// Overlay close
$("#overlay").addEventListener("click", e => {
  if (!e.target.closest(".cross") && !e.target.closest(".info-card") && !e.target.closest(".nav-btn")) closeDetail();
});

// Nav buttons
$("#navPrev").addEventListener("click", e => {
  e.stopPropagation();
  openDetail(sel > 1 ? sel - 1 : 27);
});
$("#navNext").addEventListener("click", e => {
  e.stopPropagation();
  openDetail(sel < 27 ? sel + 1 : 1);
});

// Keyboard
window.addEventListener("keydown", e => {
  if (sel) {
    if (e.key === "Escape") closeDetail();
    else if (e.key === "ArrowLeft") openDetail(sel > 1 ? sel - 1 : 27);
    else if (e.key === "ArrowRight") openDetail(sel < 27 ? sel + 1 : 1);
  }
});
</script>
</body>
</html>
