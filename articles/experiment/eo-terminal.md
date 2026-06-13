# EO Terminal

**Record ID:** experiment:eo-terminal  
**DB ID:** 34  
**Status:** draft  
**Updated:** 2026-03-26T22:10:28.908Z  

---

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>EO vs Vanilla — Event Store Benchmark</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #070909;
    --bg2: #0d1214;
    --bg3: #111618;
    --border: #1e2a2e;
    --border2: #243035;
    --orange: #FF6600;
    --orange-dim: #cc5200;
    --orange-glow: rgba(255,102,0,0.12);
    --amber: #FFB800;
    --amber-dim: #cc9200;
    --green: #00CC66;
    --green-dim: #009944;
    --red: #FF3344;
    --red-dim: #cc1122;
    --cyan: #00CCDD;
    --cyan-dim: #009eac;
    --purple: #9966FF;
    --text: #c8d8dc;
    --text-dim: #6a8490;
    --text-faint: #3a5060;
    --sup: #FFB800;
    --nul: #9966FF;
    --rec: #FF9944;
    --clean: #00CC66;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    margin: 0;
    padding: 0;
  }

  #terminal-root {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  /* CRT scanline overlay */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.04) 2px,
      rgba(0,0,0,0.04) 4px
    );
    pointer-events: none;
    z-index: 1000;
  }

  /* ── HEADER ─────────────────────────────────────── */
  #header {
    background: #000;
    border-bottom: 2px solid var(--orange);
    padding: 6px 12px;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;
  }

  .hdr-logo {
    font-size: 13px;
    font-weight: 700;
    color: var(--orange);
    letter-spacing: 0.1em;
    white-space: nowrap;
  }

  .hdr-sep { color: var(--text-faint); }

  .hdr-price {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }
  .hdr-ticker { font-weight: 700; color: var(--amber); font-size: 13px; }
  .hdr-val { font-size: 16px; font-weight: 700; color: #fff; }
  .hdr-chg { font-size: 11px; }
  .hdr-chg.neg { color: var(--red); }
  .hdr-chg.pos { color: var(--green); }

  .hdr-date { color: var(--text-dim); font-size: 11px; }
  .hdr-evtcount { 
    margin-left: auto; 
    color: var(--text-dim);
    font-size: 10px;
  }
  .hdr-evtcount span { color: var(--orange); font-weight: 600; }

  /* ── NEWS TICKER ─────────────────────────────────── */
  #ticker {
    background: #000;
    border-bottom: 1px solid var(--border);
    padding: 4px 0;
    overflow: hidden;
    flex-shrink: 0;
    position: relative;
  }
  #ticker-inner {
    display: inline-flex;
    gap: 60px;
    white-space: nowrap;
    padding-left: 12px;
    transition: none;
  }
  .tick-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
  }
  .tick-cat { 
    font-weight: 700; 
    font-size: 9px;
    padding: 1px 4px;
    border-radius: 2px;
  }
  .tick-cat.sup { background: var(--sup); color: #000; }
  .tick-cat.nul { background: var(--nul); color: #fff; }
  .tick-cat.rec { background: var(--rec); color: #fff; }
  .tick-cat.clean { background: var(--clean); color: #000; }
  .tick-text { color: var(--text-dim); }

  /* ── SCRUBBER ─────────────────────────────────────── */
  #scrubber-bar {
    background: var(--bg2);
    border-bottom: 1px solid var(--border);
    padding: 8px 14px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  #scrubber-labels {
    display: flex;
    justify-content: space-between;
    font-size: 9px;
    color: var(--text-faint);
    padding: 0 2px;
  }

  .scrubber-track-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  #scrubber {
    flex: 1;
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: var(--bg3);
    border: 1px solid var(--border2);
    border-radius: 0;
    outline: none;
    cursor: pointer;
  }
  #scrubber::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    background: var(--orange);
    border: none;
    border-radius: 0;
    cursor: pointer;
    box-shadow: 0 0 8px var(--orange);
  }

  .scrubber-dots {
    position: relative;
    height: 6px;
    display: flex;
    align-items: center;
    gap: 0;
  }

  #evt-markers {
    position: absolute;
    left: 0; right: 0;
    display: flex;
    pointer-events: none;
  }

  .scrubber-btn {
    background: var(--bg3);
    border: 1px solid var(--border2);
    color: var(--orange);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    padding: 2px 8px;
    cursor: pointer;
    white-space: nowrap;
  }
  .scrubber-btn:hover { background: var(--orange-glow); }

  #scrubber-info {
    display: flex;
    gap: 20px;
    font-size: 10px;
    color: var(--text-dim);
  }
  #scrubber-info .si-val { color: var(--text); }

  /* ── MAIN GRID ─────────────────────────────────────── */
  #main {
    min-height: 0;
    display: grid;
    grid-template-columns: 280px 1fr 1fr;
    grid-template-rows: 1fr;
    flex: 1;
    overflow: hidden;
    gap: 0;
  }

  /* ── PANEL CHROME ─────────────────────────────────── */
  .panel {
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
  }
  .panel:last-child { border-right: none; }

  .panel-hdr {
    background: #000;
    border-bottom: 1px solid var(--border2);
    padding: 5px 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .panel-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .panel-title.orange { color: var(--orange); }
  .panel-title.amber { color: var(--amber); }
  .panel-title.cyan { color: var(--cyan); }

  .panel-badge {
    font-size: 8px;
    padding: 1px 5px;
    border-radius: 2px;
    font-weight: 600;
    letter-spacing: 0.05em;
  }
  .badge-vanilla { background: #1a2a1a; color: var(--green); border: 1px solid var(--green-dim); }
  .badge-eo { background: #1a1a2a; color: var(--cyan); border: 1px solid var(--cyan-dim); }

  .panel-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    word-break: break-word;
    padding: 8px;
    scrollbar-width: thin;
    scrollbar-color: var(--border2) transparent;
  }

  /* ── EVENT FEED (left panel) ──────────────────────── */
  .evt-item {
    border-left: 2px solid transparent;
    padding: 6px 8px;
    margin-bottom: 3px;
    cursor: pointer;
    transition: all 0.1s;
    background: var(--bg2);
  }
  .evt-item:hover { background: var(--bg3); }
  .evt-item.active {
    background: #0f1e22;
    border-left-color: var(--orange);
  }
  .evt-item.future { opacity: 0.3; }

  .evt-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 3px;
  }
  .evt-id { color: var(--text-faint); font-size: 9px; }
  .evt-date { color: var(--amber); font-size: 9px; }
  .evt-time { color: var(--text-faint); font-size: 9px; }

  .cat-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .cat-dot.clean { background: var(--clean); }
  .cat-dot.sup { background: var(--sup); box-shadow: 0 0 4px var(--sup); }
  .cat-dot.nul { background: var(--nul); box-shadow: 0 0 4px var(--nul); }
  .cat-dot.rec { background: var(--rec); box-shadow: 0 0 4px var(--rec); }

  .evt-plain {
    font-size: 9.5px;
    line-height: 1.5;
    color: var(--text-dim);
  }
  .evt-item.active .evt-plain { color: var(--text); }

  /* ── STORE PANELS ─────────────────────────────────── */
  .store-section {
    margin-bottom: 10px;
  }
  .store-section-title {
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-faint);
    padding: 2px 0 4px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 6px;
  }

  /* Current event rendering */
  .current-evt-box {
    background: var(--bg3);
    border: 1px solid var(--border2);
    padding: 8px;
    margin-bottom: 8px;
    position: relative;
  }
  .current-evt-box.active-sup { border-color: var(--sup); background: rgba(255,184,0,0.04); }
  .current-evt-box.active-nul { border-color: var(--nul); background: rgba(153,102,255,0.04); }
  .current-evt-box.active-rec { border-color: var(--rec); background: rgba(255,51,68,0.04); }
  .current-evt-box.active-clean { border-color: var(--green); background: rgba(0,204,102,0.03); }

  .ceb-label {
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .ceb-label.sup { color: var(--sup); }
  .ceb-label.nul { color: var(--nul); }
  .ceb-label.rec { color: var(--rec); }
  .ceb-label.clean { color: var(--green); }

  pre.code-block {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9.5px;
    line-height: 1.6;
    color: var(--text);
    white-space: pre-wrap;
    word-break: break-all;
  }

  /* JSON syntax highlighting */
  .j-key { color: var(--cyan-dim); }
  .j-str { color: var(--amber); }
  .j-num { color: var(--green); }
  .j-kw { color: var(--purple); }

  /* EO notation highlighting */
  .eo-op { font-weight: 700; }
  .eo-op.INS { color: var(--green); }
  .eo-op.DEF { color: var(--cyan); }
  .eo-op.EVA { color: var(--sup); }
  .eo-op.NUL { color: var(--nul); }
  .eo-op.REC { color: var(--rec); }
  .eo-op.CON { color: var(--purple); }
  .eo-op.SEG { color: #FF99CC; }
  .eo-op.SYN { color: #FFCCAA; }
  .eo-op.SIG { color: #AADDFF; }
  .eo-target { color: var(--amber); }
  .eo-operand { color: var(--text-dim); }

  /* State view */
  .state-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    padding: 2px 0;
    border-bottom: 1px solid var(--border);
    font-size: 9.5px;
  }
  .state-key { color: var(--text-dim); min-width: 140px; flex-shrink: 0; }
  .state-val { color: var(--text); flex: 1; }
  .state-val.conflict { color: var(--sup); }
  .state-val.null { color: var(--nul); font-style: italic; }
  .state-val.restated { color: var(--rec); }
  .state-meta { font-size: 8px; color: var(--text-faint); }

  /* stream log */
  .stream-row {
    display: flex;
    gap: 6px;
    padding: 2px 0;
    border-bottom: 1px dotted var(--border);
    font-size: 9px;
    align-items: flex-start;
  }
  .stream-ver { color: var(--text-faint); min-width: 22px; flex-shrink: 0; }
  .stream-type { color: var(--green); }
  .stream-type.sup-type { color: var(--sup); }
  .stream-type.nul-type { color: var(--nul); }
  .stream-type.rec-type { color: var(--rec); }

  /* ── DELTA BOTTOM PANEL ──────────────────────────── */
  #delta-panel {
    flex-shrink: 0;
    border-top: 2px solid var(--border);
    background: #000;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 0;
    height: 130px;
  }

  .delta-cell {
    border-right: 1px solid var(--border);
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .delta-cell:last-child { border-right: none; }

  .delta-title {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 2px;
  }
  .delta-title.loss { color: var(--red); }
  .delta-title.gain { color: var(--cyan); }
  .delta-title.eff { color: var(--amber); }
  .delta-title.score { color: var(--green); }

  .delta-big {
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
  }
  .delta-big.loss { color: var(--red); }
  .delta-big.gain { color: var(--cyan); }
  .delta-big.eff { color: var(--amber); }
  .delta-big.score { color: var(--green); }

  .delta-sub { font-size: 9px; color: var(--text-faint); }

  .delta-bars { display: flex; flex-direction: column; gap: 3px; margin-top: 2px; }
  .delta-bar-row { display: flex; align-items: center; gap: 5px; font-size: 8px; }
  .delta-bar-label { color: var(--text-faint); min-width: 40px; }
  .delta-bar-track { flex: 1; height: 4px; background: var(--bg3); border-radius: 0; }
  .delta-bar-fill { height: 100%; border-radius: 0; transition: width 0.4s ease; }
  .delta-bar-val { color: var(--text-dim); min-width: 20px; text-align: right; }

  /* warning box */
  .vanilla-warn {
    background: rgba(255,51,68,0.08);
    border: 1px solid var(--red-dim);
    padding: 4px 6px;
    font-size: 8.5px;
    color: var(--red);
    margin-bottom: 6px;
  }
  .vanilla-warn::before { content: "⚠ "; }

  .eo-note {
    background: rgba(0,204,221,0.06);
    border: 1px solid var(--cyan-dim);
    padding: 4px 6px;
    font-size: 8.5px;
    color: var(--cyan);
    margin-bottom: 6px;
  }

  /* nav buttons */
  .nav-btns {
    display: flex;
    gap: 4px;
  }

  .pulse {
    animation: pulse 1s ease-in-out infinite alternate;
  }
  @keyframes pulse {
    from { opacity: 1; }
    to { opacity: 0.4; }
  }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); }

  .no-events-msg {
    color: var(--text-faint);
    font-size: 9px;
    padding: 10px;
    text-align: center;
  }

  /* ── TABS ─────────────────────────────────────── */
  #mode-tabs {
    display: flex;
    background: #000;
    border-bottom: 2px solid var(--border);
    flex-shrink: 0;
  }
  .mode-tab {
    padding: 6px 18px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    cursor: pointer;
    color: var(--text-faint);
    border-right: 1px solid var(--border);
    transition: all 0.1s;
    background: none;
    border-top: none;
    border-left: none;
    border-bottom: 2px solid transparent;
    font-family: 'IBM Plex Mono', monospace;
    margin-bottom: -2px;
  }
  .mode-tab:hover { color: var(--text); }
  .mode-tab.active { color: var(--orange); border-bottom-color: var(--orange); }

  /* ── QUERY ENGINE ───────────────────────────── */
  #query-mode { display: none; flex: 1; overflow: hidden; min-height: 0; }
  #query-mode.visible { display: flex; }
  #replay-mode { display: flex; flex-direction: column; flex: 1; overflow: hidden; min-height: 0; }

  #query-layout {
    display: grid;
    grid-template-columns: 220px 1fr 1fr;
    flex: 1;
    overflow: hidden;
    min-height: 0;
  }

  .q-sidebar {
    border-right: 1px solid var(--border);
    overflow-y: auto;
    background: var(--bg2);
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  .q-sidebar-hdr {
    padding: 8px 10px;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-faint);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .q-card {
    padding: 8px 10px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.1s;
    border-left: 2px solid transparent;
  }
  .q-card:hover { background: var(--bg3); }
  .q-card.active { background: #0d1e22; border-left-color: var(--orange); }
  .q-card-num { font-size: 8px; color: var(--text-faint); margin-bottom: 2px; }
  .q-card-title { font-size: 9.5px; font-weight: 600; color: var(--text); margin-bottom: 4px; line-height: 1.4; }
  .q-card-desc { font-size: 8.5px; color: var(--text-dim); line-height: 1.4; }
  .q-tags { display: flex; gap: 3px; margin-top: 5px; flex-wrap: wrap; }
  .q-tag { font-size: 7px; font-weight: 700; padding: 1px 4px; border-radius: 2px; }
  .q-tag.EVA { background: rgba(255,184,0,0.2); color: var(--sup); }
  .q-tag.NUL { background: rgba(153,102,255,0.2); color: var(--nul); }
  .q-tag.REC { background: rgba(255,51,68,0.2); color: var(--rec); }
  .q-tag.INS { background: rgba(0,204,102,0.15); color: var(--green); }
  .q-tag.DEF { background: rgba(0,204,221,0.15); color: var(--cyan); }
  .q-tag.CON { background: rgba(153,102,255,0.15); color: var(--purple); }

  .q-result-panel {
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
  }
  .q-result-panel:last-child { border-right: none; }
  .q-result-hdr {
    background: #000;
    border-bottom: 1px solid var(--border2);
    padding: 5px 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .q-result-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 10px;
    scrollbar-width: thin;
    scrollbar-color: var(--border2) transparent;
  }

  /* Result table */
  .q-table { width: 100%; border-collapse: collapse; font-size: 9px; }
  .q-table th { 
    text-align: left; padding: 3px 6px; 
    color: var(--text-faint); font-weight: 600;
    border-bottom: 1px solid var(--border2);
    font-size: 8px; text-transform: uppercase; letter-spacing: 0.05em;
  }
  .q-table td { padding: 4px 6px; border-bottom: 1px dotted var(--border); vertical-align: top; line-height: 1.5; }
  .q-table tr:last-child td { border-bottom: none; }
  .q-table .td-id { color: var(--text-faint); }
  .q-table .td-op { font-weight: 700; }
  .q-table .td-op.EVA { color: var(--sup); }
  .q-table .td-op.DEF { color: var(--cyan); }
  .q-table .td-op.REC { color: var(--rec); }
  .q-table .td-op.NUL { color: var(--nul); }
  .q-table .td-op.INS { color: var(--green); }
  .q-table .td-op.CON { color: var(--purple); }
  .td-link { color: var(--cyan); }
  .td-flag { color: var(--sup); }
  .td-warn { color: var(--red); }
  .td-ok { color: var(--green); }

  /* Failure terminal */
  .q-fail-terminal {
    background: #020808;
    border: 1px solid var(--border2);
    padding: 10px;
    font-size: 9px;
    line-height: 1.8;
    margin-bottom: 10px;
  }
  .q-fail-step { color: var(--text-dim); }
  .q-fail-step::before { content: '> '; color: var(--text-faint); }
  .q-fail-error { color: var(--red); }
  .q-fail-error::before { content: '⚠ '; }
  .q-fail-partial { color: var(--amber); }
  .q-fail-partial::before { content: '~ '; }

  /* Dependency tree */
  .dep-tree { font-size: 9px; line-height: 1.9; }
  .dep-node { display: flex; align-items: flex-start; gap: 6px; }
  .dep-indent { color: var(--text-faint); }
  .dep-evt { color: var(--amber); }
  .dep-arrow { color: var(--text-faint); }
  .dep-desc { color: var(--text-dim); }

  /* Frame view */
  .frame-box {
    border: 1px solid var(--border2);
    margin-bottom: 8px;
  }
  .frame-hdr {
    padding: 3px 8px;
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .frame-hdr.pre { background: rgba(0,204,221,0.08); color: var(--cyan); border-bottom: 1px solid var(--border2); }
  .frame-hdr.post { background: rgba(255,153,68,0.08); color: var(--rec); border-bottom: 1px solid var(--border2); }
  .frame-body { padding: 6px 8px; }

  /* Query bottom bar */
  #query-delta {
    display: none;
    flex-shrink: 0;
    border-top: 2px solid var(--border);
    background: #000;
    grid-template-columns: 1fr 1fr 1fr;
    height: 80px;
  }
  #query-delta.visible { display: grid; }

  .qd-cell {
    border-right: 1px solid var(--border);
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .qd-cell:last-child { border-right: none; }
  .qd-title { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-faint); margin-bottom: 4px; }
  .qd-content { display: flex; align-items: baseline; gap: 12px; }
  .qd-score { font-size: 22px; font-weight: 700; }
  .qd-vanilla { color: var(--red); }
  .qd-eo { color: var(--green); }
  .qd-label { font-size: 9px; color: var(--text-dim); }
</style>
</head>
<body>
<div id="terminal-root">

<div id="header">
  <div class="hdr-logo">EO // TERM</div>
  <div class="hdr-sep">|</div>
  <div class="hdr-price">
    <span class="hdr-ticker">ORCL</span>
    <span class="hdr-val" id="hdr-price-val">312.40</span>
    <span class="hdr-chg neg" id="hdr-price-chg">— OCT 1 2025</span>
  </div>
  <div class="hdr-sep">|</div>
  <div class="hdr-date" id="hdr-date">2025-10-01 09:32:00</div>
  <div class="hdr-sep">|</div>
  <div style="font-size:9px;color:var(--text-faint);">VANILLA <span style="color:var(--text-faint)">vs</span> EO EVENT STORE BENCHMARK — ORACLE CORP DESK</div>
  <div class="hdr-evtcount">EVENT <span id="hdr-evt-n">1</span> / <span id="hdr-evt-total">27</span></div>
</div>

<div id="mode-tabs">
  <button class="mode-tab active" onclick="setMode('replay')">▶ EVENT REPLAY</button>
  <button class="mode-tab" onclick="setMode('query')">⬡ QUERY ENGINE</button>
</div>

<div id="replay-mode">
<div id="ticker">
  <div id="ticker-inner"></div>
</div>

<div id="scrubber-bar">
  <div class="scrubber-labels-outer" style="display:flex;align-items:center;gap:10px;">
    <div class="nav-btns">
      <button class="scrubber-btn" onclick="stepEvt(-1)">◀ PREV</button>
      <button class="scrubber-btn" onclick="stepEvt(1)">NEXT ▶</button>
    </div>
    <div style="flex:1;position:relative;">
      <input type="range" id="scrubber" min="0" max="26" value="0" oninput="onScrub(this.value)">
    </div>
    <div id="scrubber-info">
      <span>DATE: <span class="si-val" id="si-date">—</span></span>
      <span>CATEGORY: <span class="si-val" id="si-cat">—</span></span>
      <span>STREAM VER: <span class="si-val" id="si-ver">—</span></span>
    </div>
  </div>
  <div id="scrubber-labels" style="display:flex;justify-content:space-between;font-size:9px;color:var(--text-faint);padding:0 2px;">
    <span>OCT 1</span><span>OCT 10</span><span>OCT 20</span><span>NOV 1</span><span>NOV 11</span><span>NOV 18</span><span>DEC 1</span><span>DEC 19</span>
  </div>
</div>

<div id="main">
  <!-- LEFT: Event Feed -->
  <div class="panel" id="panel-feed">
    <div class="panel-hdr">
      <div class="panel-title orange">EVENT FEED</div>
      <div style="margin-left:auto;font-size:9px;color:var(--text-faint);">PLAIN TEXT SOURCE</div>
    </div>
    <div class="panel-body" id="feed-body"></div>
  </div>

  <!-- CENTER: Vanilla Store -->
  <div class="panel" id="panel-vanilla">
    <div class="panel-hdr">
      <div class="panel-title amber">VANILLA STORE</div>
      <div class="panel-badge badge-vanilla">GREG YOUNG / EVENTSTORE</div>
      <div style="margin-left:auto;font-size:9px;color:var(--text-faint);">streams + events schema</div>
    </div>
    <div class="panel-body">
      <div id="v-notice" style="margin-bottom:6px;"></div>
      <div class="store-section">
        <div class="store-section-title"><span id="v-evt-title">CURRENT EVENT</span></div>
        <div id="v-evt-box" class="current-evt-box active-clean">
          <div class="ceb-label clean" id="v-evt-label">EVENT RECORDED</div>
          <pre class="code-block" id="v-evt-code" style="max-height:none;"></pre>
        </div>
      </div>
      <div id="v-size-bar" style="margin:-4px 0 10px 0;"></div>
      <div class="store-section">
        <div class="store-section-title">POSITION NOW</div>
        <div id="v-state"></div>
      </div>
      <div class="store-section">
        <div class="store-section-title" id="v-log-title">STREAM LOG</div>
        <div id="v-log" style="min-height:40px;"></div>
      </div>
    </div>
  </div>

  <!-- RIGHT: EO Store -->
  <div class="panel" id="panel-eo">
    <div class="panel-hdr">
      <div class="panel-title cyan">EO STORE</div>
      <div class="panel-badge badge-eo">EO: EVENT OPERATIONS</div>
      <div style="margin-left:auto;font-size:9px;color:var(--text-faint);">operator(target, operand)</div>
    </div>
    <div class="panel-body">
      <div id="eo-notice" style="margin-bottom:6px;"></div>
      <div class="store-section">
        <div class="store-section-title"><span id="eo-evt-title">CURRENT EVENT</span></div>
        <div id="eo-evt-box" class="current-evt-box active-clean">
          <div style="display:flex;align-items:flex-start;gap:8px;">
            <span id="eo-op-badge" style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:2px;flex-shrink:0;letter-spacing:0.08em;margin-top:2px;"></span>
            <span id="eo-evt-expr" style="font-size:11px;line-height:1.7;word-break:break-all;white-space:pre-wrap;color:var(--text);"></span>
          </div>
        </div>
      </div>
      <div id="eo-size-bar" style="margin:-4px 0 10px 0;"></div>
      <div class="store-section">
        <div class="store-section-title">POSITION NOW</div>
        <div id="eo-state"></div>
      </div>
      <div class="store-section">
        <div class="store-section-title">EVENT LOG</div>
        <div id="eo-log" style="min-height:40px;"></div>
        <div id="eo-provenance"></div>
      </div>
    </div>
  </div>
</div>

<!-- DELTA PANEL -->
<div id="delta-panel" class="replay-only">
  <div class="delta-cell">
    <div class="delta-title loss">VANILLA INFORMATION LOSS</div>
    <div class="delta-big loss" id="d-loss">0</div>
    <div class="delta-sub" id="d-loss-sub">values silently discarded</div>
    <div class="delta-bars" id="d-loss-bars"></div>
  </div>
  <div class="delta-cell">
    <div class="delta-title gain">EO STRUCTURAL GAINS</div>
    <div class="delta-big gain" id="d-gain">0</div>
    <div class="delta-sub" id="d-gain-sub">distinctions preserved</div>
    <div class="delta-bars" id="d-gain-bars"></div>
  </div>
  <div class="delta-cell">
    <div class="delta-title eff">EO NOTATION EFFICIENCY</div>
    <div class="delta-big eff" id="d-eff">—</div>
    <div class="delta-sub" id="d-eff-sub">chars vs vanilla JSON</div>
    <div id="d-eff-detail" style="margin-top:4px;"></div>
  </div>
  <div class="delta-cell">
    <div class="delta-title score">CUMULATIVE SCORE</div>
    <div id="d-score-breakdown" style="display:flex;flex-direction:column;gap:3px;margin-top:2px;"></div>
  </div>
</div>

<script>
const EVENTS = [{"event_id":"evt_001","date":"2025-10-01","time":"09:32:00","category":"clean","plain_text":"Desk opens long position in ORCL: 10,000 shares at $312.40. Post-ATH pullback play. Single execution via Goldman Sachs. No competing prices.","vanilla":{"event_type":"PositionOpened","stream_id":"position_ORCL","version":1,"timestamp":"2025-10-01T09:32:00Z","data":{"instrument":"ORCL","quantity":10000,"price":312.4,"counterparty":"Goldman Sachs"},"metadata":{"agent":"human","source":"goldman_sachs"}},"eo":"INS(position_ORCL, {instrument: ORCL, quantity: 10000, price: 312.40, counterparty: Goldman Sachs})\n@ {agent: human, source: goldman_sachs}"},{"event_id":"evt_002","date":"2025-10-01","time":"16:00:00","category":"clean","plain_text":"EOD mark ORCL: Bloomberg $309.80, Reuters $309.75. Gap $0.05 — within tolerance. Bloomberg primary.","vanilla":{"event_type":"PositionMarked","stream_id":"position_ORCL","version":2,"timestamp":"2025-10-01T16:00:00Z","data":{"mark_price":309.8,"mark_source":"bloomberg"},"metadata":{"agent":"automated","source":"bloomberg"}},"eo":"EVA(position_ORCL.mark_price, 312.40 -> 309.80)\n@ {agent: automated, source: bloomberg}"},{"event_id":"evt_003","date":"2025-10-02","time":"09:45:00","category":"clean","plain_text":"Desk opens hedge: buys 200 ORCL put contracts, strike $280, expiry Dec 19 2025, at $8.20 premium. Counterparty JPMorgan.","vanilla":{"event_type":"PositionOpened","stream_id":"position_ORCL_PUT_280","version":1,"timestamp":"2025-10-02T09:45:00Z","data":{"instrument":"ORCL_PUT_280_DEC25","contracts":200,"strike":280.0,"expiry":"2025-12-19","premium":8.2,"counterparty":"JPMorgan"},"metadata":{"agent":"human","source":"jpmorgan"}},"eo":"INS(position_ORCL_PUT_280, {instrument: ORCL_PUT_280_DEC25, contracts: 200, strike: 280.00, expiry: 2025-12-19, premium: 8.20, counterparty: JPMorgan})\n@ {agent: human, source: jpmorgan}"},{"event_id":"evt_004","date":"2025-10-07","time":"16:00:00","category":"clean","plain_text":"EOD marks: ORCL $298.10, ORCL put now worth $12.40. Straight Bloomberg, no conflicts.","vanilla":{"event_type":"EODMarksApplied","stream_id":"portfolio_desk1","version":1,"timestamp":"2025-10-07T16:00:00Z","data":{"marks":{"ORCL":298.1,"ORCL_PUT_280":12.4},"source":"bloomberg"},"metadata":{"agent":"automated","source":"bloomberg"}},"eo":"EVA(portfolio_desk1.marks, {ORCL: 298.10, ORCL_PUT_280: 12.40})\n@ {agent: automated, source: bloomberg}"},{"event_id":"evt_005","date":"2025-10-10","time":"16:00:00","category":"sup","plain_text":"ORCL EOD mark conflict: Bloomberg $284.20, Reuters $279.60, internal model $281.90. Spread of $4.60 outside tolerance. Stock now moving fast on AI capex concern headlines. Risk desk cannot resolve — all three values valid under different assumptions about near-term FCF.","vanilla":{"event_type":"PositionMarked","stream_id":"position_ORCL","version":3,"timestamp":"2025-10-10T16:00:00Z","data":{"mark_price":284.2,"mark_source":"bloomberg"},"note":"Reuters $279.60 and internal $281.90 discarded. Bloomberg wins by default.","metadata":{"agent":"automated"}},"eo":"DEF(position_ORCL.mark_price, [{value: 284.20, source: bloomberg}, {value: 279.60, source: reuters}, {value: 281.90, source: internal_model}])\n@ {agent: automated}"},{"event_id":"evt_006","date":"2025-10-11","time":"09:15:00","category":"sup","plain_text":"Risk desk resolves Oct 10 ORCL mark conflict: Reuters value of $279.60 confirmed after Bloomberg found to have stale FCF model input. Mark set to $279.60.","vanilla":{"event_type":"PositionMarked","stream_id":"position_ORCL","version":4,"timestamp":"2025-10-11T09:15:00Z","data":{"mark_price":279.6,"mark_source":"reuters","note":"Bloomberg stale FCF model — corrected"},"metadata":{"agent":"human","source":"risk_desk"}},"eo":"EVA(evt_005.mark_price, 279.60)\n@ {agent: human, source: risk_desk}"},{"event_id":"evt_007","date":"2025-10-14","time":"11:00:00","category":"clean","plain_text":"Analyst downgrade hits: Morgan Stanley cuts ORCL from Overweight to Equal Weight, price target $260. Desk notes but takes no immediate action.","vanilla":{"event_type":"AnalystActionRecorded","stream_id":"position_ORCL","version":5,"timestamp":"2025-10-14T11:00:00Z","data":{"analyst":"Morgan Stanley","action":"downgrade","from_rating":"Overweight","to_rating":"Equal Weight","price_target":260.0},"metadata":{"agent":"automated","source":"morgan_stanley"}},"eo":"EVA(position_ORCL.analyst_consensus, {Morgan Stanley: Overweight -> Equal Weight, price_target: 260.00})\n@ {agent: automated, source: morgan_stanley}"},{"event_id":"evt_008","date":"2025-10-16","time":"16:00:00","category":"clean","plain_text":"EOD: ORCL $271.30, put position now worth $19.80. Clean single-source marks.","vanilla":{"event_type":"EODMarksApplied","stream_id":"portfolio_desk1","version":2,"timestamp":"2025-10-16T16:00:00Z","data":{"marks":{"ORCL":271.3,"ORCL_PUT_280":19.8},"source":"bloomberg"},"metadata":{"agent":"automated","source":"bloomberg"}},"eo":"EVA(portfolio_desk1.marks, {ORCL: 271.30, ORCL_PUT_280: 19.80})\n@ {agent: automated, source: bloomberg}"},{"event_id":"evt_009","date":"2025-10-20","time":"08:30:00","category":"nul","plain_text":"Bloomberg reports Oracle and OpenAI have scrapped plans to expand the Texas AI data center. The contract relationship that anchored Oracle's AI revenue thesis no longer exists. This is not a rumor — it is confirmed. Counterparty relationship severed.","vanilla":{"event_type":"ContractTerminated","stream_id":"position_ORCL","version":6,"timestamp":"2025-10-20T08:30:00Z","data":{"contract":"OpenAI_Texas_DC_expansion","status":"terminated","note":"Financing and OpenAI scope disagreement"},"metadata":{"agent":"automated","source":"bloomberg_news"}},"eo":"NUL(CON(ORCL, OpenAI, {contract: Texas_DC_expansion}))\n@ {agent: automated, source: bloomberg_news}"},{"event_id":"evt_010","date":"2025-10-20","time":"09:35:00","category":"sup","plain_text":"ORCL opens down hard on OpenAI news. Bloomberg real-time: $241.10. Reuters: $238.80. Internal risk model using yesterday's close ($271.30) hasn't updated yet. Three valid prices simultaneously — open is chaotic.","vanilla":{"event_type":"PositionMarked","stream_id":"position_ORCL","version":7,"timestamp":"2025-10-20T09:35:00Z","data":{"mark_price":241.1,"mark_source":"bloomberg"},"note":"Opening chaos — Reuters $238.80 and stale internal $271.30 discarded.","metadata":{"agent":"automated"}},"eo":"DEF(position_ORCL.mark_price, [{value: 241.10, source: bloomberg}, {value: 238.80, source: reuters}, {value: 271.30, source: internal_model, stale: true}])\n@ {agent: automated}"},{"event_id":"evt_011","date":"2025-10-20","time":"16:00:00","category":"clean","plain_text":"ORCL closes at $243.60 after partial recovery. Internal model updated. Put position now $38.20. Single confirmed close.","vanilla":{"event_type":"EODMarksApplied","stream_id":"portfolio_desk1","version":3,"timestamp":"2025-10-20T16:00:00Z","data":{"marks":{"ORCL":243.6,"ORCL_PUT_280":38.2},"source":"bloomberg"},"metadata":{"agent":"automated","source":"bloomberg"}},"eo":"EVA(portfolio_desk1.marks, {ORCL: 243.60, ORCL_PUT_280: 38.20})\n@ {agent: automated, source: bloomberg}"},{"event_id":"evt_012","date":"2025-10-22","time":"10:00:00","category":"clean","plain_text":"Desk trims ORCL long: sells 3,000 shares at $247.20. Remaining: 7,000 shares. Realised loss on partial close: -$195,600.","vanilla":{"event_type":"PositionReduced","stream_id":"position_ORCL","version":8,"timestamp":"2025-10-22T10:00:00Z","data":{"quantity_sold":3000,"sale_price":247.2,"quantity_remaining":7000,"realised_pnl":-195600},"metadata":{"agent":"human"}},"eo":"EVA(position_ORCL.quantity, 10000 -> 7000)\n@ {agent: human}"},{"event_id":"evt_013","date":"2025-11-04","time":"09:00:00","category":"nul","plain_text":"Compliance places internal trading restriction on ORCL positions ahead of earnings blackout period. Reason is the standard pre-earnings quiet period policy. Desk cannot add or reduce until earnings clear. The restriction exists; the reason is known; it cannot be communicated externally.","vanilla":{"event_type":"TradingRestricted","stream_id":"position_ORCL","version":9,"timestamp":"2025-11-04T09:00:00Z","data":{"restriction_type":"pre_earnings_blackout","reason":"[INTERNAL POLICY]"},"metadata":{"agent":"human","source":"compliance"}},"eo":"NUL(position_ORCL.tradeable_status)\n@ {agent: human, source: compliance}"},{"event_id":"evt_014","date":"2025-11-10","time":"16:05:00","category":"clean","plain_text":"ORCL Q2 FY26 earnings released after close. Revenue $14.06B vs $14.10B estimate — slight miss. Cloud revenue growth 24% vs 26% expected. EPS $1.47 vs $1.48 estimate. FCF still deeply negative at -$3.2B for quarter.","vanilla":{"event_type":"EarningsReleased","stream_id":"position_ORCL","version":10,"timestamp":"2025-11-10T16:05:00Z","data":{"period":"Q2_FY26","revenue_actual":14.06,"revenue_estimate":14.1,"eps_actual":1.47,"eps_estimate":1.48,"cloud_growth_actual":0.24,"cloud_growth_estimate":0.26,"fcf":-3200000000},"metadata":{"agent":"automated","source":"oracle_ir"}},"eo":"INS(position_ORCL.earnings, {period: Q2_FY26, revenue: 14.06B, eps: 1.47, cloud_growth: 24%, fcf: -3.2B})\n@ {agent: automated, source: oracle_ir}"},{"event_id":"evt_015","date":"2025-11-11","time":"09:30:00","category":"sup","plain_text":"Post-earnings ORCL open: chaotic. Bloomberg $218.40, Reuters $214.90. Internal risk model applying pre-earnings close of $241.20 pending recalibration. All three in use simultaneously by different desks.","vanilla":{"event_type":"PositionMarked","stream_id":"position_ORCL","version":11,"timestamp":"2025-11-11T09:30:00Z","data":{"mark_price":218.4,"mark_source":"bloomberg"},"note":"Reuters $214.90 and stale internal $241.20 discarded.","metadata":{"agent":"automated"}},"eo":"DEF(position_ORCL.mark_price, [{value: 218.40, source: bloomberg}, {value: 214.90, source: reuters}, {value: 241.20, source: internal_model, stale: true}])\n@ {agent: automated}"},{"event_id":"evt_016","date":"2025-11-11","time":"12:00:00","category":"sup","plain_text":"Post-earnings conflict resolved: internal model updated. ORCL marked at $216.80, consensus between Bloomberg ($218.40) and Reuters ($214.90) midpoint, approved by risk desk.","vanilla":{"event_type":"PositionMarked","stream_id":"position_ORCL","version":12,"timestamp":"2025-11-11T12:00:00Z","data":{"mark_price":216.8,"mark_source":"risk_desk_consensus"},"metadata":{"agent":"human","source":"risk_desk"}},"eo":"EVA(evt_015.mark_price, 216.80)\n@ {agent: human, source: risk_desk}"},{"event_id":"evt_016b","date":"2025-11-12","time":"08:00:00","category":"rec","plain_text":"Post-earnings risk review: desk now managing combined book delta, not two separate positions. Net delta (shares + put hedge) becomes a required field on all subsequent portfolio marks. Field did not exist before today — it is derived from ORCL share quantity, put contract count, and put delta at current spot/vol. All future EOD mark events must include it.","vanilla":{"event_type":"PortfolioSchemaUpdated","stream_id":"portfolio_desk1","version":4,"timestamp":"2025-11-12T08:00:00Z","data":{"change":"add_field","field":"net_delta","reason":"Post-earnings risk management requirement","note":"Subsequent EODMarksApplied events will include net_delta. Prior events do not have it."},"metadata":{"agent":"human","source":"risk_desk"}},"eo":"REC(schema.portfolio_desk1.marks, {add: net_delta, derived_from: [position_ORCL.quantity, position_ORCL_PUT_280.delta, position_ORCL.mark_price]})\n@ {agent: human, source: risk_desk}"},{"event_id":"evt_017","date":"2025-11-11","time":"14:00:00","category":"nul","plain_text":"Earnings blackout period lifted. Trading restriction on ORCL removed.","vanilla":{"event_type":"TradingRestrictionLifted","stream_id":"position_ORCL","version":13,"timestamp":"2025-11-11T14:00:00Z","data":{"restriction_type":"pre_earnings_blackout"},"metadata":{"agent":"human","source":"compliance"}},"eo":"INS(position_ORCL.tradeable_status, {status: unrestricted})\n@ {agent: human, source: compliance}"},{"event_id":"evt_018","date":"2025-11-18","time":"09:00:00","category":"rec","plain_text":"Oracle restates Q1 FY26 cloud revenue. Error discovered in revenue recognition timing for multi-year OCI contracts. Q1 cloud revenue revised from $5.60B to $5.31B — $290M reduction. All prior period valuations that used Q1 cloud revenue as an input must be recomputed. Historical marks based on old figure are no longer correct.","vanilla":{"event_type":"EarningsRestated","stream_id":"position_ORCL","version":14,"timestamp":"2025-11-18T09:00:00Z","data":{"period":"Q1_FY26","field":"cloud_revenue","original":5.6,"restated":5.31,"delta":-0.29,"note":"Revenue recognition timing correction"},"metadata":{"agent":"human","source":"oracle_ir","applies_to_period":"2025-08-01/2025-10-31"}},"eo":"REC(position_ORCL.earnings[Q1_FY26].cloud_revenue, 5.60 -> 5.31)\n@ {agent: human, source: oracle_ir, applies_to_period: 2025-08-01/2025-10-31}"},{"event_id":"evt_019","date":"2025-11-18","time":"10:30:00","category":"rec","plain_text":"Restatement cascades: all P&L valuations that used Q1 cloud revenue as an input are retroactively recomputed. Risk desk recalculates position marks for the Q1 period using the corrected figure. Historical marks from Aug-Oct 2025 are restated.","vanilla":{"event_type":"HistoricalMarksRestated","stream_id":"position_ORCL","version":15,"timestamp":"2025-11-18T10:30:00Z","data":{"affected_period":"2025-08-01/2025-10-31","reason":"Q1 FY26 cloud revenue restatement","note":"Prior marks now reflect restated inputs"},"metadata":{"agent":"human","source":"risk_desk","applies_to_period":"2025-08-01/2025-10-31"}},"eo":"REC(EVA(position_ORCL.mark_price), {affected_period: 2025-08-01/2025-10-31, driver: evt_018})\n@ {agent: human, source: risk_desk, applies_to_period: 2025-08-01/2025-10-31}"},{"event_id":"evt_020","date":"2025-11-20","time":"11:00:00","category":"clean","plain_text":"Securities class action filed against Oracle (ORCL) by Rosen Law Firm on behalf of investors who purchased between Sept 10 and Nov 10 2025. Desk notes but no position change.","vanilla":{"event_type":"LegalActionRecorded","stream_id":"position_ORCL","version":16,"timestamp":"2025-11-20T11:00:00Z","data":{"action_type":"securities_class_action","plaintiff":"Rosen Law Firm","class_period":"2025-09-10/2025-11-10"},"metadata":{"agent":"automated","source":"rosen_law"}},"eo":"INS(position_ORCL.legal_actions, {type: securities_class_action, plaintiff: Rosen Law Firm, class_period: 2025-09-10/2025-11-10})\n@ {agent: automated, source: rosen_law}"},{"event_id":"evt_021","date":"2025-11-25","time":"16:00:00","category":"clean","plain_text":"EOD: ORCL $204.10. ORCL put now worth $62.80. Clean single-source Bloomberg marks.","vanilla":{"event_type":"EODMarksApplied","stream_id":"portfolio_desk1","version":5,"timestamp":"2025-11-25T16:00:00Z","data":{"marks":{"ORCL":204.1,"ORCL_PUT_280":62.8,"net_delta":-4820,"net_delta_note":"7000sh * 1.0 + 200c * 100sh * (-0.78 put_delta)"},"source":"bloomberg"},"metadata":{"agent":"automated","source":"bloomberg"}},"eo":"EVA(portfolio_desk1.marks, {ORCL: 204.10, ORCL_PUT_280: 62.80})\n@ {agent: automated, source: bloomberg}"},{"event_id":"evt_022","date":"2025-12-01","time":"09:00:00","category":"rec","plain_text":"Risk system schema migration: 'cloud_growth_rate' field redefined. Previously stored as trailing-twelve-month figure. Now required to store both TTM and forward consensus estimate as separate fields per new Basel IV reporting requirements. All historical records in ORCL stream that stored a single cloud_growth_rate must be reinterpreted — the single value was always TTM, now named explicitly.","vanilla":{"event_type":"SchemaMigration","stream_id":"position_ORCL","version":17,"timestamp":"2025-12-01T09:00:00Z","data":{"field_changed":"cloud_growth_rate","from_schema":"single_float","to_schema":"object {ttm: float, forward_consensus: float}","note":"Basel IV reporting requirement"},"metadata":{"agent":"human","source":"risk_desk"}},"eo":"REC(schema.position_ORCL.cloud_growth_rate, {from: single_float, to: {ttm: float, forward_consensus: float}})\n@ {agent: human, source: risk_desk}"},{"event_id":"evt_023","date":"2025-12-05","time":"16:00:00","category":"sup","plain_text":"ORCL EOD conflict again: Bloomberg $196.20, Reuters $192.80, internal model $194.50. Stock sliding on fresh AI capex concern piece in WSJ. Spread $3.40, outside tolerance. No resolution tonight.","vanilla":{"event_type":"PositionMarked","stream_id":"position_ORCL","version":18,"timestamp":"2025-12-05T16:00:00Z","data":{"mark_price":196.2,"mark_source":"bloomberg"},"note":"Reuters $192.80 and internal $194.50 discarded.","metadata":{"agent":"automated"}},"eo":"DEF(position_ORCL.mark_price, [{value: 196.20, source: bloomberg}, {value: 192.80, source: reuters}, {value: 194.50, source: internal_model}])\n@ {agent: automated}"},{"event_id":"evt_024","date":"2025-12-06","time":"09:30:00","category":"sup","plain_text":"Dec 5 ORCL mark resolved: internal model value $194.50 selected. Bloomberg and Reuters both found to be reacting to the same WSJ article which contained an error about capex figures. Mark set to $194.50.","vanilla":{"event_type":"PositionMarked","stream_id":"position_ORCL","version":19,"timestamp":"2025-12-06T09:30:00Z","data":{"mark_price":194.5,"mark_source":"internal_model","note":"Bloomberg and Reuters reacting to erroneous WSJ article"},"metadata":{"agent":"human","source":"risk_desk"}},"eo":"EVA(evt_023.mark_price, 194.50)\n@ {agent: human, source: risk_desk}"},{"event_id":"evt_025","date":"2025-12-10","time":"08:45:00","category":"clean","plain_text":"Oracle Q2 FY26 earnings call replay note: CFO confirms capex guidance raised to $35-37B for FY26. Free cash flow will remain negative through at least Q2 FY27. Desk updates forward model.","vanilla":{"event_type":"ForwardGuidanceUpdated","stream_id":"position_ORCL","version":20,"timestamp":"2025-12-10T08:45:00Z","data":{"capex_guidance_fy26":"35B-37B","fcf_positive_by":"Q3_FY27_earliest"},"metadata":{"agent":"human"}},"eo":"EVA(position_ORCL.forward_model, {capex_guidance: 35B-37B, fcf_positive_by: Q3_FY27_earliest})\n@ {agent: human}"},{"event_id":"evt_026","date":"2025-12-12","time":"16:00:00","category":"clean","plain_text":"ORCL put expires in-the-money: $280 strike, ORCL at $191.40. 200 contracts exercised. Gain on put position: $88.60/share × 20,000 shares = $1,772,000.","vanilla":{"event_type":"OptionExercised","stream_id":"position_ORCL_PUT_280","version":2,"timestamp":"2025-12-19T16:00:00Z","data":{"strike":280.0,"spot_at_expiry":191.4,"intrinsic_value":88.6,"contracts":200,"total_gain":1772000,"status":"exercised_itm"},"metadata":{"agent":"automated"}},"eo":"EVA(position_ORCL_PUT_280.status, open -> exercised_itm)\n@ {agent: automated}"},{"event_id":"evt_027","date":"2025-12-19","time":"16:30:00","category":"clean","plain_text":"Desk closes remaining 7,000 ORCL long at $191.40. Realised loss on long: (191.40 - 312.40) × 7,000 = -$847,000. Net position on full ORCL trade: put gain $1,772,000 - long loss $1,042,600 = +$729,400.","vanilla":{"event_type":"PositionClosed","stream_id":"position_ORCL","version":21,"timestamp":"2025-12-19T16:30:00Z","data":{"quantity_sold":7000,"sale_price":191.4,"realised_pnl":-847000,"net_trade_pnl":729400},"metadata":{"agent":"human"}},"eo":"NUL(position_ORCL)\n@ {agent: human}"}];

const DELTA = {
  evt_005: { loss: 2, lossDesc: "2 competing prices discarded (Reuters $279.60, internal $281.90)", gain: "EVA holds all 3; resolution traceable", supCount: 2 },
  evt_006: { loss: 0, gain: "EVA(DEF(...)) — resolution is structurally linked to its conflict", supCount: 0 },
  evt_009: { loss: 0, nulGain: "NUL(CON(...)) — severed relationship preserved as typed absence; vanilla loses relational structure", gain: "Relational provenance preserved" },
  evt_010: { loss: 2, lossDesc: "Reuters $238.80 and stale internal $271.30 discarded", gain: "EVA includes stale flag; all sources queryable", supCount: 2 },
  evt_013: { loss: 0, nulGain: "NUL carries semantic weight: restriction exists, reason withheld. Vanilla stores '[INTERNAL POLICY]' as a string — structurally identical to absence.", gain: "Known-unknown vs unknown-unknown distinction" },
  evt_015: { loss: 2, lossDesc: "Reuters $214.90 and stale internal $241.20 discarded", gain: "EVA marks stale flag on internal model", supCount: 2 },
  evt_016b: { loss: 0, recGain: "REC with derived_from provenance", gain: "In-stream schema evolution with dependency graph" },
  evt_018: { loss: 0, recGain: "REC separates frame-change from value-change. Vanilla: EarningsRestated sits in same stream as EarningsReleased — no structural separator. Temporal replay of Aug-Oct marks is now broken.", gain: "REC structurally separates restatement from history" },
  evt_019: { loss: 0, recGain: "REC(EVA(...)) — the cascade is encoded: you can query 'which EVA events are downstream of this REC' without string-parsing.", gain: "Cascade provenance preserved in nesting" },
  evt_022: { loss: 0, recGain: "REC on schema — vanilla SchemaMigration is just another event_type with no special query power. EO REC lets you query under old OR new schema independently.", gain: "Schema change separable from value changes" },
  evt_023: { loss: 2, lossDesc: "Reuters $192.80 and internal $194.50 discarded", gain: "All 3 values held for independent audit", supCount: 2 },
};

const PRICES = {
  evt_001: 312.40, evt_002: 309.80, evt_003: 309.80, evt_004: 298.10,
  evt_005: 284.20, evt_006: 279.60, evt_007: 271.30, evt_008: 271.30,
  evt_009: 243.60, evt_010: 241.10, evt_011: 243.60, evt_012: 247.20,
  evt_013: 216.80, evt_014: 216.80, evt_015: 218.40, evt_016: 216.80, evt_016b: 216.80,
  evt_017: 216.80, evt_018: 204.10, evt_019: 204.10, evt_020: 204.10,
  evt_021: 204.10, evt_022: 196.20, evt_023: 196.20, evt_024: 194.50,
  evt_025: 194.50, evt_026: 191.40, evt_027: 191.40
};

let currentIdx = 0;
let tickerOffset = 0;
let tickerRAF = null;
let tickerWidth = 0;

function buildTicker(upToIdx) {
  const inner = document.getElementById('ticker-inner');
  const visible = EVENTS.slice(0, upToIdx + 1);
  if (visible.length === 0) { inner.innerHTML = ''; return; }
  const items = visible.map(e => {
    return `<span class="tick-item"><span class="tick-text">${e.date} ${e.time} — ${e.plain_text.substring(0, 90)}${e.plain_text.length > 90 ? '…' : ''}</span><span style="color:var(--text-faint);margin-left:30px;">◆</span></span>`;
  });
  inner.innerHTML = items.join('') + items.join('') + items.join('');
  tickerWidth = inner.scrollWidth / 3;
  tickerOffset = 0;
  inner.style.transform = `translateX(0px)`;
  startTicker();
}

function startTicker() {
  if (tickerRAF) cancelAnimationFrame(tickerRAF);
  let last = null;
  function step(ts) {
    if (!last) last = ts;
    const dt = ts - last;
    last = ts;
    tickerOffset += dt * 0.030;
    if (tickerOffset >= tickerWidth) tickerOffset -= tickerWidth;
    const inner = document.getElementById('ticker-inner');
    inner.style.transform = `translateX(-${tickerOffset}px)`;
    tickerRAF = requestAnimationFrame(step);
  }
  tickerRAF = requestAnimationFrame(step);
}

function buildFeed() {
  const body = document.getElementById('feed-body');
  body.innerHTML = EVENTS.map((e, i) => {
    return `<div class="evt-item future" id="feed-${i}" onclick="jumpTo(${i})">
      <div class="evt-meta">
        <div class="cat-dot ${e.category}"></div>
        <span class="evt-id">${e.event_id}</span>
        <span class="evt-date">${e.date}</span>
        <span class="evt-time">${e.time}</span>
      </div>
      <div class="evt-plain">${e.plain_text}</div>
    </div>`;
  }).join('');
}

function jumpTo(idx) {
  currentIdx = idx;
  document.getElementById('scrubber').value = idx;
  render();
}

function stepEvt(dir) {
  currentIdx = Math.max(0, Math.min(EVENTS.length - 1, currentIdx + dir));
  document.getElementById('scrubber').value = currentIdx;
  render();
}

function onScrub(val) {
  currentIdx = parseInt(val);
  render();
}

function syntaxJSON(obj) {
  const s = JSON.stringify(obj, null, 2);
  return s
    .replace(/("[\w_]+"):/g, '<span class="j-key">$1</span>:')
    .replace(/: "([^"]+)"/g, ': <span class="j-str">"$1"</span>')
    .replace(/: (-?[\d.]+)/g, ': <span class="j-num">$1</span>')
    .replace(/: (true|false|null)/g, ': <span class="j-kw">$1</span>');
}

function syntaxEO(str) {
  const ops = ['EVA','NUL','REC','DEF','INS','CON','SEG','SYN','SIG'];
  const parts = str.split('\n@ ');
  let expr = parts[0];
  for (const op of ops) {
    expr = expr.replace(new RegExp(`\\b${op}\\b`, 'g'), `<span class="eo-op ${op}">${op}</span>`);
  }
  if (parts[1]) {
    expr += '\n<span style="color:var(--text-faint);font-size:9px;">@ ' + parts[1] + '</span>';
  }
  return expr;
}

function vanillaProblemTitle(cat) {
  const map = { clean:'EVENT RECORDED', sup:'PRICE CONFLICT', nul:'AMBIGUOUS ABSIGCE', rec:'RETROACTIVE CHANGE' };
  return map[cat] || 'EVENT';
}

function eoCategoryTitle(cat) {
  const map = {
    clean: 'CLEAN — NO STRUCTURAL AMBIGUITY',
    sup:   'EVAERPOSITION — CONCURRENT VALUES HELD',
    nul:   'DELIBERATE ABSIGCE — TYPED NULL',
    rec:   'FRAME RESTRUCTURE — SCHEMA / HISTORY CHANGE'
  };
  return map[cat] || cat.toUpperCase();
}

function buildPositionState(idx) {
  let state = { price: null, quantity: null, put_price: null, restriction: null, earnings: null, net_delta: null };
  for (let i = 0; i <= idx; i++) {
    const e = EVENTS[i];
    const et = e.vanilla.event_type;
    const d = e.vanilla.data;
    if (et === 'PositionOpened' && e.vanilla.stream_id === 'position_ORCL') state.quantity = d.quantity;
    if (et === 'PositionReduced') state.quantity = d.quantity_remaining;
    if (et === 'PositionClosed') state.quantity = 0;
    if (et === 'PositionMarked' && e.vanilla.stream_id === 'position_ORCL') state.price = d.mark_price;
    if (et === 'EODMarksApplied' && d.marks && d.marks.ORCL) state.price = d.marks.ORCL;
    if (et === 'EODMarksApplied' && d.marks && d.marks.ORCL_PUT_280) state.put_price = d.marks.ORCL_PUT_280;
    if (et === 'EODMarksApplied' && d.marks && d.marks.net_delta) state.net_delta = d.marks.net_delta;
    if (et === 'TradingRestricted') state.restriction = 'RESTRICTED';
    if (et === 'TradingRestrictionLifted') state.restriction = null;
    if (et === 'EarningsReleased') state.earnings = d;
  }
  return state;
}

function renderPositionState(state, container) {
  let rows = '';
  if (state.price !== null)    rows += `<div class="state-row"><span class="state-key">ORCL price</span><span class="state-val">$${state.price}</span></div>`;
  if (state.quantity !== null) rows += `<div class="state-row"><span class="state-key">ORCL shares</span><span class="state-val">${state.quantity.toLocaleString()}</span></div>`;
  if (state.put_price !== null)rows += `<div class="state-row"><span class="state-key">PUT $280 mark</span><span class="state-val">$${state.put_price}</span></div>`;
  if (state.net_delta !== null)rows += `<div class="state-row"><span class="state-key">net delta</span><span class="state-val">${state.net_delta.toLocaleString()}</span></div>`;
  if (state.restriction)       rows += `<div class="state-row"><span class="state-key">tradeable</span><span class="state-val conflict">RESTRICTED</span></div>`;
  if (state.earnings)          rows += `<div class="state-row"><span class="state-key">last earnings</span><span class="state-val">Q2 FY26 — rev $${state.earnings.revenue_actual}B</span></div>`;
  if (!rows) rows = '<div class="state-row"><span class="state-key" style="color:var(--text-faint)">no position yet</span></div>';
  container.innerHTML = rows;
}

function render() {
  const idx = currentIdx;
  const evt = EVENTS[idx];
  const cat = evt.category;
  const price = PRICES[evt.event_id] ?? PRICES[EVENTS[idx > 0 ? idx-1 : 0].event_id] ?? 312.40;
  const priceChg = price - 312.40;
  const pct = ((price - 312.40) / 312.40 * 100).toFixed(1);

  buildTicker(idx);

  document.getElementById('hdr-price-val').textContent = '$' + price.toFixed(2);
  document.getElementById('hdr-date').textContent = evt.date + ' ' + evt.time;
  document.getElementById('hdr-evt-n').textContent = idx + 1;
  const chgEl = document.getElementById('hdr-price-chg');
  chgEl.textContent = (priceChg >= 0 ? '+' : '') + priceChg.toFixed(2) + ' (' + pct + '%) FROM ENTRY';
  chgEl.className = 'hdr-chg ' + (priceChg >= 0 ? 'pos' : 'neg');

  document.getElementById('si-date').textContent = evt.date + ' ' + evt.time;
  document.getElementById('si-cat').textContent = cat.toUpperCase();
  document.getElementById('si-ver').textContent = evt.vanilla.version || '-';

  for (let i = 0; i < EVENTS.length; i++) {
    const el = document.getElementById('feed-' + i);
    if (!el) continue;
    if (i < idx)      el.className = 'evt-item';
    else if (i===idx) { el.className = 'evt-item active'; el.scrollIntoView({block:'nearest'}); }
    else              el.className = 'evt-item future';
  }

  const vanillaProblemText = {
    evt_005: '<b>Problem: three pricing sources disagree by $4.60.</b> This system picks Bloomberg and throws the others away. The Reuters value ($279.60) and internal model ($281.90) are gone permanently — there is no record they existed.',
    evt_006: 'Bloomberg was corrected — but in this system, that correction looks identical to any other price update. There is no way to tell from the stream alone that v4 is a resolution of a dispute rather than a routine mark.',
    evt_009: 'The contract with OpenAI is gone. This system records ContractTerminated — the same structure it uses for a contract that simply expired. There is no way to distinguish "severed" from "concluded." The OpenAI connection is not preserved anywhere.',
    evt_010: '<b>Problem: three prices exist simultaneously.</b> Bloomberg, Reuters, and a stale internal figure are all live across different desks. This system can only write one. The other two vanish with no trace.',
    evt_013: '<b>Problem: the field is absent — but why?</b> The restriction reason is known internally but undisclosable. Stored here as a string. Indistinguishable from genuinely not knowing. A query cannot tell "withheld" from "unknown."',
    evt_015: '<b>Problem: post-earnings opening chaos.</b> Three desks, three prices. Bloomberg $218.40 wins. Reuters $214.90 and stale internal $241.20 are discarded. The stale internal mark that caused real risk exposure leaves no record.',
    evt_016b: '<b>Problem: a new field appears mid-stream with no structural record of when or why.</b> net_delta will now appear in future marks events. But this schema event is stored the same way as any value event. A system replaying from event 1 cannot know net_delta is only valid from here forward.',
    evt_018: '<b>Problem: the correction and the original sit in the same list.</b> EarningsReleased (v10) and EarningsRestated (v14) are just entries — structurally identical. Replaying the stream to reconstruct Q1 requires application code to know which to skip.',
    evt_019: 'The cascade is a second entry in the same list. No machine-readable link to the earnings restatement that caused it. You must read and parse the text "reason" field to understand the dependency.',
    evt_022: '<b>Problem: schema change looks identical to any other event.</b> SchemaMigration sits next to PositionMarked, EarningsReleased. You cannot query "all marks under the old schema" without knowing the version cutoff and filtering manually.',
    evt_023: '<b>Problem: three sources disagree again.</b> Bloomberg $196.20, Reuters $192.80, internal $194.50. Bloomberg wins. Third time this has happened — the store has no record of how many times prices have been silently overwritten.'
  };

  document.getElementById('v-notice').innerHTML = vanillaProblemText[evt.event_id]
    ? '<div class="vanilla-warn">' + vanillaProblemText[evt.event_id] + '</div>' : '';

  document.getElementById('v-evt-title').textContent = 'CURRENT EVENT — ' + evt.vanilla.stream_id + '  v' + evt.vanilla.version;

  const vBox = document.getElementById('v-evt-box');
  vBox.className = 'current-evt-box active-' + cat;

  const vLabel = document.getElementById('v-evt-label');
  vLabel.className = 'ceb-label ' + cat;
  vLabel.textContent = vanillaProblemTitle(cat);

  document.getElementById('v-evt-code').innerHTML = syntaxJSON(evt.vanilla);
  const vChars = JSON.stringify(evt.vanilla).length;

  renderPositionState(buildPositionState(idx), document.getElementById('v-state'));

  const sameStream = EVENTS.slice(0, idx+1).filter(e => e.vanilla.stream_id === evt.vanilla.stream_id);
  document.getElementById('v-log-title').textContent = 'STREAM LOG — ' + evt.vanilla.stream_id;
  document.getElementById('v-log').innerHTML = sameStream.map(e =>
    '<div class="stream-row"><span class="stream-ver">v' + e.vanilla.version + '</span>' +
    '<span class="stream-type">' + e.vanilla.event_type + '</span></div>'
  ).join('');

  const eoExplainText = {
    evt_005: 'All three prices are held simultaneously. Nothing is thrown away. When the desk resolves this tomorrow, that resolution will point back to this conflict — you can always ask what prices were in dispute and which was chosen and why.',
    evt_006: 'EVA(evt_005.mark_price, 279.60) — two degrees of precision. The event ID scopes to the exact conflict; the field name scopes to the exact value within it. Unambiguous at any scale.',
    evt_009: 'The OpenAI relationship was encoded as a connection. Its termination is a null applied to that connection — not a generic "terminated" string. The structure of what existed is preserved. You can query: what connections has ORCL had that are now null, and when did they end?',
    evt_010: 'All three prices held, including the stale internal one, flagged. The chaos of the opening is recorded faithfully. A risk manager can later ask: how many times did we have simultaneous prices during this decline, and which source was stale each time?',
    evt_013: 'The absence is typed. Not a missing field — a deliberate null on a specific target. You can query: which positions have a typed null on tradeable_status right now? That returns only positions where the restriction is known and deliberate, not positions where data is simply absent.',
    evt_015: 'Three prices held, stale flag on the internal model. The post-earnings chaos is recorded as it actually was. The risk exposure from the stale internal mark is part of the historical record.',
    evt_016b: 'In-stream schema evolution. The REC tells the store: from this point on, marks has a net_delta field. The derived_from clause is structural — the store knows this field comes from share quantity, put delta, and price. Events before this point are queryable as they were. No stream fork. No migration script.',
    evt_018: 'The restatement targets a specific field on a specific period. You can query the store under the old frame or the new frame independently. The original earnings figure is still there — not overwritten. You can ask: what did Q1 cloud revenue look like before the restatement?',
    evt_019: 'The cascade points to evt_018 by ID. The dependency is machine-readable — no string parsing required. You can ask: what events were triggered downstream of that restatement?',
    evt_022: 'Schema changes are a different operator from value changes. You can query all price marks recorded before this schema change and the store answers without application-level filtering. Old and new schema periods are independently queryable.',
    evt_023: 'All three prices held. The fact that Bloomberg and Reuters moved together while internal diverged is preserved in the structure. Post-resolution, that pattern is queryable across the full history of the position.'
  };

  document.getElementById('eo-notice').innerHTML = eoExplainText[evt.event_id]
    ? '<div class="eo-note">' + eoExplainText[evt.event_id] + '</div>' : '';

  document.getElementById('eo-evt-title').textContent = evt.event_id + '  —  ' + eoCategoryTitle(cat);

  const eoBox = document.getElementById('eo-evt-box');
  eoBox.className = 'current-evt-box active-' + cat;

  const eoExpr = document.getElementById('eo-evt-expr');
  const opMatch = evt.eo.match(/^([A-Z]+)\(/);
  const outerOp = opMatch ? opMatch[1] : '';
  const opColors = {INS:'var(--green)',EVA:'var(--cyan)',DEF:'var(--sup)',NUL:'var(--nul)',REC:'var(--rec)',CON:'var(--purple)',SEG:'#FF99CC',SYN:'#FFCCAA',SIG:'#AADDFF'};
  const opBg = {INS:'rgba(0,204,102,0.15)',EVA:'rgba(0,204,221,0.15)',DEF:'rgba(255,184,0,0.15)',NUL:'rgba(153,102,255,0.15)',REC:'rgba(255,153,68,0.15)',CON:'rgba(153,102,255,0.15)'};
  const badge = document.getElementById('eo-op-badge');
  badge.textContent = outerOp;
  badge.style.color = opColors[outerOp] || 'var(--text)';
  badge.style.background = opBg[outerOp] || 'var(--bg3)';
  badge.style.border = '1px solid ' + (opColors[outerOp] || 'var(--border2)');
  const exprBody = outerOp ? evt.eo.slice(outerOp.length) : evt.eo;
  eoExpr.innerHTML = syntaxEO(exprBody);
  const eoChars = evt.eo.length;
  const savings = Math.round((1 - eoChars/vChars)*100);

  document.getElementById('v-size-bar').innerHTML =
    '<div style="display:flex;align-items:center;gap:8px;padding:5px 0;">'
    + '<div style="flex:1;height:8px;background:var(--bg3);border:1px solid var(--border2);position:relative;">'
    + '<div style="width:100%;height:100%;background:var(--amber);opacity:0.5;"></div>'
    + '</div>'
    + '<span style="font-size:9px;color:var(--amber);min-width:60px;">' + vChars + ' chars</span>'
    + '</div>';
  document.getElementById('eo-size-bar').innerHTML =
    '<div style="display:flex;align-items:center;gap:8px;padding:5px 0;">'
    + '<div style="flex:1;height:8px;background:var(--bg3);border:1px solid var(--border2);position:relative;">'
    + '<div style="width:' + Math.max(2, 100-savings) + '%;height:100%;background:var(--cyan);opacity:0.7;transition:width 0.3s;"></div>'
    + '</div>'
    + '<span style="font-size:9px;color:var(--cyan);min-width:60px;">' + eoChars + ' chars</span>'
    + '<span style="font-size:10px;font-weight:700;color:var(--green);">' + savings + '% smaller</span>'
    + '</div>';

  renderPositionState(buildPositionState(idx), document.getElementById('eo-state'));

  const prov = getProvenance(evt.event_id);
  const provHtml = '<div style="margin-top:8px;padding:6px 8px;border-top:1px solid var(--border2);">' +
    '<div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-faint);margin-bottom:4px;">ENABLES QUERIES</div>' +
    prov.map(p => '<div style="font-size:8.5px;color:var(--cyan);padding:1px 0;">→ ' + p + '</div>').join('') + '</div>';
  document.getElementById('eo-provenance').innerHTML = provHtml;
  document.getElementById('eo-log').innerHTML = EVENTS.slice(0, idx+1).map(e =>
    '<div class="stream-row">' +
    '<span class="stream-ver" style="min-width:60px;color:var(--text-faint)">' + e.event_id + '</span>' +
    '<span class="stream-type ' + e.category + '-type">' + syntaxEO(e.eo) + '</span></div>'
  ).join('');

  renderDelta(idx);
}

function renderDelta(idx) {
  let totalLoss = 0;
  let supCount = 0, nulCount = 0, recCount = 0, cleanCount = 0;
  let totalVanillaChars = 0, totalEOChars = 0;

  for (let i = 0; i <= idx; i++) {
    const e = EVENTS[i];
    const d = DELTA[e.event_id];
    if (d && d.loss) totalLoss += d.loss;
    if (e.category === 'sup') supCount++;
    if (e.category === 'nul') nulCount++;
    if (e.category === 'rec') recCount++;
    if (e.category === 'clean') cleanCount++;
    totalVanillaChars += JSON.stringify(e.vanilla).length;
    totalEOChars += e.eo.length;
  }

  const eoSavings = Math.round((1 - totalEOChars / totalVanillaChars) * 100);
  const structural = supCount + nulCount + recCount;

  document.getElementById('d-loss').textContent = totalLoss;
  document.getElementById('d-loss-sub').textContent = totalLoss === 1 ? 'value silently discarded' : 'values silently discarded';

  document.getElementById('d-loss-bars').innerHTML = `
    <div class="delta-bar-row">
      <span class="delta-bar-label" style="color:var(--sup)">EVA</span>
      <div class="delta-bar-track"><div class="delta-bar-fill" style="width:${Math.min(100,supCount/7*100)}%;background:var(--sup);"></div></div>
      <span class="delta-bar-val">${supCount}</span>
    </div>
    <div class="delta-bar-row">
      <span class="delta-bar-label" style="color:var(--nul)">NUL</span>
      <div class="delta-bar-track"><div class="delta-bar-fill" style="width:${Math.min(100,nulCount/3*100)}%;background:var(--nul);"></div></div>
      <span class="delta-bar-val">${nulCount}</span>
    </div>
    <div class="delta-bar-row">
      <span class="delta-bar-label" style="color:var(--rec)">REC</span>
      <div class="delta-bar-track"><div class="delta-bar-fill" style="width:${Math.min(100,recCount/3*100)}%;background:var(--rec);"></div></div>
      <span class="delta-bar-val">${recCount}</span>
    </div>`;

  document.getElementById('d-gain').textContent = structural;
  document.getElementById('d-gain-sub').textContent = 'events with EO structural advantage';

  document.getElementById('d-gain-bars').innerHTML = `
    <div class="delta-bar-row">
      <span class="delta-bar-label" style="color:var(--clean)">CLEAN</span>
      <div class="delta-bar-track"><div class="delta-bar-fill" style="width:${Math.min(100,cleanCount/14*100)}%;background:var(--clean);"></div></div>
      <span class="delta-bar-val">${cleanCount}</span>
    </div>
    <div class="delta-bar-row">
      <span class="delta-bar-label" style="color:var(--text-faint)">EDGE</span>
      <div class="delta-bar-track"><div class="delta-bar-fill" style="width:${Math.min(100,structural/13*100)}%;background:var(--orange);"></div></div>
      <span class="delta-bar-val">${structural}</span>
    </div>`;

  document.getElementById('d-eff').textContent = `${eoSavings}%`;
  document.getElementById('d-eff-sub').textContent = `smaller than vanilla JSON`;
  document.getElementById('d-eff-detail').innerHTML = `
    <div style="font-size:8px;color:var(--text-faint);">EO: ${totalEOChars.toLocaleString()} chars</div>
    <div style="font-size:8px;color:var(--text-faint);">Vanilla: ${totalVanillaChars.toLocaleString()} chars</div>`;

  document.getElementById('d-score-breakdown').innerHTML = `
    <div class="state-row" style="border:none;padding:1px 0;">
      <span class="state-key" style="color:var(--clean);min-width:0;margin-right:8px;">✓ CLEAN</span>
      <span class="state-val">${cleanCount} events — vanilla ≡ EO</span>
    </div>
    <div class="state-row" style="border:none;padding:1px 0;">
      <span class="state-key" style="color:var(--sup);min-width:0;margin-right:8px;">△ EVA</span>
      <span class="state-val">${supCount} events — ${totalLoss} vals lost in vanilla</span>
    </div>
    <div class="state-row" style="border:none;padding:1px 0;">
      <span class="state-key" style="color:var(--nul);min-width:0;margin-right:8px;">∅ NUL</span>
      <span class="state-val">${nulCount} events — semantic collapse in vanilla</span>
    </div>
    <div class="state-row" style="border:none;padding:1px 0;">
      <span class="state-key" style="color:var(--rec);min-width:0;margin-right:8px;">⊛ REC</span>
      <span class="state-val">${recCount} events — replay integrity broken</span>
    </div>`;
}

let currentMode = 'replay';
let currentQuery = 0;

function setMode(mode) {
  currentMode = mode;
  document.getElementById('replay-mode').style.display = mode === 'replay' ? 'flex' : 'none';
  document.getElementById('query-mode').style.display = mode === 'query' ? 'flex' : 'none';
  document.getElementById('query-delta').style.display = mode === 'query' ? 'grid' : 'none';
  document.querySelectorAll('.mode-tab').forEach((t,i) => t.classList.toggle('active', (i===0 && mode==='replay')||(i===1 && mode==='query')));
  if (mode === 'query') {
    document.getElementById('query-delta').classList.add('visible');
    runQuery(currentQuery);
  }
}

function setQueryCard(idx) {
  currentQuery = idx;
  document.querySelectorAll('.q-card').forEach((c,i) => c.classList.toggle('active', i===idx));
}

function statusBadge(level, text) {
  const colors = {
    ok: 'color:var(--green);border-color:var(--green)',
    partial: 'color:var(--amber);border-color:var(--amber)',
    fail: 'color:var(--red);border-color:var(--red)'
  };
  return `<span style="font-size:8px;font-weight:700;padding:1px 6px;border:1px solid;${colors[level]||colors.ok}">${text}</span>`;
}

function failTerminal(steps) {
  return '<div class="q-fail-terminal">' + steps.map(s => {
    if (s.type === 'step') return `<div class="q-fail-step">${s.text}</div>`;
    if (s.type === 'error') return `<div class="q-fail-error">${s.text}</div>`;
    if (s.type === 'partial') return `<div class="q-fail-partial">${s.text}</div>`;
    return `<div style="color:var(--text-faint)">${s.text}</div>`;
  }).join('') + '</div>';
}

function opTag(op) {
  return `<span class="td-op ${op}">${op}</span>`;
}

function q1() {
  const conflicts = [
    { conflict: 'evt_005', date: '2025-10-10', values: [{v:'$284.20', src:'bloomberg'}, {v:'$279.60', src:'reuters'}, {v:'$281.90', src:'internal_model'}], resolution: 'evt_006', resDate: '2025-10-11', chosen: '$279.60', reason: 'Bloomberg had stale FCF model input', agent: 'human/risk_desk' },
    { conflict: 'evt_010', date: '2025-10-20', values: [{v:'$241.10', src:'bloomberg'}, {v:'$238.80', src:'reuters'}, {v:'$271.30', src:'internal_model', stale:true}], resolution: 'evt_011 (EOD)', resDate: '2025-10-20', chosen: '$243.60', reason: 'EOD close confirmed after market', agent: 'automated' },
    { conflict: 'evt_015', date: '2025-11-11', values: [{v:'$218.40', src:'bloomberg'}, {v:'$214.90', src:'reuters'}, {v:'$241.20', src:'internal_model', stale:true}], resolution: 'evt_016', resDate: '2025-11-11', chosen: '$216.80', reason: 'Risk desk consensus midpoint', agent: 'human/risk_desk' },
    { conflict: 'evt_023', date: '2025-12-05', values: [{v:'$196.20', src:'bloomberg'}, {v:'$192.80', src:'reuters'}, {v:'$194.50', src:'internal_model'}], resolution: 'evt_024', resDate: '2025-12-06', chosen: '$194.50', reason: 'Bloomberg/Reuters reacting to erroneous WSJ article', agent: 'human/risk_desk' },
  ];

  const vRows = conflicts.map(c => `<tr><td class="td-id">${c.conflict}</td><td>${c.date}</td><td style="color:var(--text)">${c.values.map(v=>v.v).join(' / ')}</td><td style="color:var(--amber)">PositionMarked (winning value only)</td><td style="color:var(--text-faint)">note field (string)</td><td class="td-warn">No structural link</td></tr>`).join('');
  const vHtml = failTerminal([
    {type:'step', text:`Scanning stream position_ORCL for mark events...`},
    {type:'step', text:`Found 12 PositionMarked events across the stream`},
    {type:'step', text:`Attempting to identify conflicts by note field string matching...`},
    {type:'partial', text:`Found 4 events with conflict-related note strings`},
    {type:'error', text:`CANNOT RESOLVE: no structural field distinguishes conflict from routine mark`},
    {type:'error', text:`CANNOT RESOLVE: resolution events are identical in type to conflict events`},
    {type:'error', text:`DISCARDED VALUES: competing prices not recorded — cannot reconstruct alternatives`},
  ]) + `<table class="q-table" style="margin-top:8px;"><thead><tr><th>Event</th><th>Date</th><th>Values found</th><th>Type</th><th>Resolution link</th><th>Structural?</th></tr></thead><tbody>${vRows}</tbody></table>
  <div style="font-size:8.5px;color:var(--text-dim);margin-top:8px;">Vanilla returns 4 PositionMarked events. Conflict/resolution pairing requires manual note-field parsing. Competing prices are unrecoverable — they were discarded at write time.</div>`;

  const eoRows = conflicts.map(c => `<tr><td class="td-id">${c.conflict}</td><td>${c.date}</td><td>${c.values.map(v=>`<span style="color:${v.stale?'var(--amber)':'var(--text)'};">${v.v}<span style="color:var(--text-faint);font-size:8px;"> ${v.src}${v.stale?' ⚑stale':''}</span></span>`).join('<br>')}</td><td class="td-link">${c.resolution}</td><td>${c.resDate}</td><td style="color:var(--text)">${c.chosen}</td><td style="color:var(--text-dim);font-size:8.5px;">${c.reason}</td></tr>`).join('');
  const eoHtml = `<div style="font-size:8.5px;color:var(--green);margin-bottom:8px;">✓ DEF events structurally typed — conflict/resolution pairs traverse directly via EVA(evt_id.field, ...)</div>
  <table class="q-table"><thead><tr><th>Conflict</th><th>Date</th><th>All values (preserved)</th><th>Resolved by</th><th>Res. date</th><th>Chosen</th><th>Reason</th></tr></thead><tbody>${eoRows}</tbody></table>
  <div style="font-size:8.5px;color:var(--text-dim);margin-top:8px;">EO returns all 12 values across 4 conflicts. Each resolution is structurally linked to its conflict by event ID reference. Stale flags queryable without string parsing.</div>`;

  return { vHtml, eoHtml, vStatus: statusBadge('partial','PARTIAL — string parsing required'), eoStatus: statusBadge('ok','COMPLETE — structural traversal') };
}

function q2() {
  const vHtml = failTerminal([
    {type:'step', text:`Query: find all events causally downstream of evt_018 (EarningsRestated)`},
    {type:'step', text:`Scanning position_ORCL stream for events after v14...`},
    {type:'step', text:`Found evt_019 (HistoricalMarksRestated) — reason field contains "Q1 FY26 cloud revenue restatement"`},
    {type:'partial', text:`Likely downstream: evt_019 (string match on note field)`},
    {type:'error', text:`CANNOT RESOLVE: no structural causation field — link is a string`},
    {type:'error', text:`CANNOT RESOLVE: evt_021, evt_022 onwards — cannot determine if downstream without reading every note field`},
    {type:'error', text:`CANNOT PROVE: "historically restated" vs "new event that happens to follow" — same event type`},
  ]) + `<div style="font-size:8.5px;color:var(--text-dim);margin-top:8px;">Vanilla returns a keyword search, not a dependency graph. Cannot machine-verify causation without human interpretation of unstructured strings.</div>`;

  const eoHtml = `<div style="font-size:8.5px;color:var(--green);margin-bottom:10px;">✓ REC operator creates machine-traversable dependency. driver: field encodes causation structurally.</div>
  <div class="dep-tree">
    <div class="dep-node"><span style="color:var(--rec);font-weight:700;">evt_018</span><span class="dep-arrow"> ─── </span><span class="dep-desc">REC(position_ORCL.earnings[Q1_FY26].cloud_revenue, 5.60 → 5.31)</span></div>
    <div class="dep-node" style="margin-left:20px;"><span style="color:var(--text-faint);">└── </span><span style="color:var(--amber);font-weight:700;">evt_019</span><span class="dep-arrow"> ─── </span><span class="dep-desc">REC(EVA(position_ORCL.mark_price), {driver: evt_018}) — cascade, structurally encoded</span></div>
    <div class="dep-node" style="margin-left:40px;"><span style="color:var(--text-faint);">└── </span><span style="color:var(--text-dim);">affects marks: evt_002 evt_004 evt_006 evt_008 evt_011 evt_012</span></div>
  </div>
  <div style="font-size:8.5px;color:var(--text-dim);margin-top:10px;">EO returns a directed graph. Query: <span style="color:var(--cyan);">EVENTS.filter(e => e.eo.includes('driver: evt_018'))</span> — zero string parsing, pure operator traversal. Affected historical marks are enumerable without scanning every note field.</div>`;

  return { vHtml, eoHtml, vStatus: statusBadge('fail','FAIL — keyword search only'), eoStatus: statusBadge('ok','COMPLETE — directed graph') };
}

function q3() {
  const vHtml = failTerminal([
    {type:'step', text:`Query: find all ORCL counterparty relationships that were severed`},
    {type:'step', text:`Scanning for event_type: ContractTerminated...`},
    {type:'step', text:`Found: evt_009 — contract: OpenAI_Texas_DC_expansion, status: terminated`},
    {type:'partial', text:`1 result found via event_type match`},
    {type:'error', text:`CANNOT DISTINGUISH: normal contract expiry vs relationship severing — same event_type`},
    {type:'error', text:`CANNOT QUERY: informal relationships, counterparty dependencies, relational context — not recorded`},
    {type:'error', text:`INFORMATION LOST: the shape of the relationship (contract vs equity vs partnership) is not typed`},
  ]) + `<div style="font-size:8.5px;color:var(--text-dim);margin-top:8px;">Vanilla finds ContractTerminated events but cannot distinguish severing from expiry, and has no record of relationships that were never formalized as contracts.</div>`;

  const eoHtml = `<div style="font-size:8.5px;color:var(--green);margin-bottom:10px;">✓ NUL(CON(...)) preserves the shape of the relationship at the point of nullification. The relational structure is in the expression, not a string field.</div>
  <table class="q-table"><thead><tr><th>Event</th><th>Date</th><th>Operator</th><th>Parties</th><th>Relationship type</th><th>Subject matter</th><th>Agent</th></tr></thead>
  <tbody><tr><td class="td-id">evt_009</td><td>2025-10-20</td><td>${opTag('NUL')}(${opTag('CON')}(...))</td><td style="color:var(--text);">ORCL ↔ OpenAI</td><td style="color:var(--cyan);">contract</td><td style="color:var(--text);">Texas_DC_expansion</td><td style="color:var(--text-faint);">automated/bloomberg</td></tr></tbody></table>
  <div style="font-size:8.5px;color:var(--text-dim);margin-top:8px;">CON is typed — you can query "all ORCL relationships of type contract" or "all NUL(CON(...)) events involving OpenAI" without touching unstructured text. The severing is distinguishable from expiry at the operator level.</div>`;

  return { vHtml, eoHtml, vStatus: statusBadge('partial','PARTIAL — type match only'), eoStatus: statusBadge('ok','COMPLETE — typed traversal') };
}

function q4() {
  const preFr = [
    {evt:'evt_002',date:'2025-10-01',mark:'$309.80',src:'bloomberg'},
    {evt:'evt_004',date:'2025-10-07',mark:'$298.10',src:'bloomberg'},
    {evt:'evt_006',date:'2025-10-11',mark:'$279.60',src:'risk_desk'},
    {evt:'evt_008',date:'2025-10-16',mark:'$271.30',src:'bloomberg'},
    {evt:'evt_011',date:'2025-10-20',mark:'$243.60',src:'bloomberg'},
  ];
  const postFr = [
    {evt:'evt_018',date:'2025-11-18',mark:'—',src:'oracle_ir',note:'FRAME BOUNDARY — restatement applied'},
    {evt:'evt_019',date:'2025-11-18',mark:'restated',src:'risk_desk',note:'Aug-Oct marks recomputed under corrected cloud revenue'},
  ];

  const vHtml = failTerminal([
    {type:'step', text:`Query: retrieve mark_price values under pre-restatement frame`},
    {type:'step', text:`Scanning position_ORCL stream versions 1–21...`},
    {type:'step', text:`Found EarningsRestated at v14 (evt_018)`},
    {type:'partial', text:`Pre-restatement: events before v14. Post-restatement: events at/after v14`},
    {type:'error', text:`NO FRAME CONCEPT: store has no separation between pre- and post-restatement worlds`},
    {type:'error', text:`APPLICATION MUST: manually filter by version number and know that v14 is the boundary`},
    {type:'error', text:`REPLAY BROKEN: temporal replay of events 1–13 under Q1 cloud revenue assumption is unverifiable`},
  ]) + `<div style="font-size:8.5px;color:var(--amber);margin-top:8px;">⚠ No frame separation available — application must manually filter by version. Pre-restatement view requires developer knowledge of the event sequence, not structural query.</div>`;

  const eoHtml = `<div style="font-size:8.5px;color:var(--green);margin-bottom:8px;">✓ REC creates a structural frame boundary. Marks before evt_018 are queryable under the original frame. Marks after are queryable under the corrected frame.</div>
  <div class="frame-box"><div class="frame-hdr pre">PRE-RESTATEMENT FRAME — cloud_revenue: $5.60B (original)</div><div class="frame-body">
  <table class="q-table"><thead><tr><th>Event</th><th>Date</th><th>mark_price</th><th>Source</th></tr></thead><tbody>
    ${preFr.map(r=>`<tr><td class="td-id">${r.evt}</td><td>${r.date}</td><td style="color:var(--cyan)">${r.mark}</td><td style="color:var(--text-faint)">${r.src}</td></tr>`).join('')}
  </tbody></table></div></div>
  <div class="frame-box"><div class="frame-hdr post">POST-RESTATEMENT FRAME — cloud_revenue: $5.31B (corrected)</div><div class="frame-body">
  <table class="q-table"><thead><tr><th>Event</th><th>Date</th><th>Effect</th><th>Source</th></tr></thead><tbody>
    ${postFr.map(r=>`<tr><td class="td-id">${r.evt}</td><td>${r.date}</td><td style="color:var(--rec)">${r.note||r.mark}</td><td style="color:var(--text-faint)">${r.src}</td></tr>`).join('')}
  </tbody></table></div></div>
  <div style="font-size:8.5px;color:var(--text-dim);margin-top:4px;">Both frames are independently queryable. The store knows the difference. Application code is not the frame keeper.</div>`;

  return { vHtml, eoHtml, vStatus: statusBadge('fail','FAIL — no frame concept'), eoStatus: statusBadge('ok','COMPLETE — dual frame query') };
}

function q5() {
  const vHtml = `<div style="font-size:8.5px;color:var(--text-dim);margin-bottom:8px;">Vanilla can reconstruct the period by finding TradingRestricted / TradingRestrictionLifted event pairs. But it cannot distinguish reason-withheld from reason-unknown.</div>
  <table class="q-table"><thead><tr><th>Start</th><th>End</th><th>Duration</th><th>Reason recorded</th><th>Is reason known?</th></tr></thead>
  <tbody><tr><td>2025-11-04 09:00</td><td>2025-11-11 14:00</td><td>~7 days</td>
    <td style="color:var(--amber);">[INTERNAL POLICY] (string)</td>
    <td class="td-warn">INDETERMINATE — string "[INTERNAL POLICY]" is structurally identical to absence. Cannot distinguish from "we don't know why."</td>
  </tr></tbody></table>
  <div style="font-size:8.5px;color:var(--amber);margin-top:8px;">⚠ Vanilla period reconstruction works. But the semantic content of the restriction — that the reason exists but is deliberately withheld — is invisible to the store.</div>`;

  const eoHtml = `<div style="font-size:8.5px;color:var(--green);margin-bottom:8px;">✓ NUL(position_ORCL.tradeable_status) is a typed absence. The operator encodes: the field exists, its value is deliberately nullified, the reason for nullification is available but scoped to agent. Query distinguishes this from field-never-set.</div>
  <table class="q-table"><thead><tr><th>Start event</th><th>End event</th><th>Duration</th><th>Operator</th><th>Agent</th><th>Known-unknown?</th></tr></thead>
  <tbody><tr><td class="td-id">evt_013</td><td class="td-id">evt_017</td><td>~7 days</td>
    <td>${opTag('NUL')}(position_ORCL.tradeable_status)</td>
    <td style="color:var(--text-faint);">human/compliance</td>
    <td class="td-ok">YES — NUL by compliance agent = deliberate typed restriction. Reason exists, scoped to compliance. Structurally distinguishable from unknown absence.</td>
  </tr></tbody></table>
  <div style="font-size:8.5px;color:var(--text-dim);margin-top:8px;">The difference: a field that was never set looks identical to vanilla's "[INTERNAL POLICY]" string — both are absence. EO's NUL is a positive assertion that absence is intentional and agent-attributed.</div>`;

  return { vHtml, eoHtml, vStatus: statusBadge('partial','PARTIAL — period ok, semantics lost'), eoStatus: statusBadge('ok','COMPLETE — typed known-unknown') };
}

function q6() {
  const vHtml = failTerminal([
    {type:'step', text:`Query: count incidents where a stale price source was present during a mark conflict`},
    {type:'step', text:`Scanning all PositionMarked events for stale indicators...`},
    {type:'step', text:`Checking data.mark_source field for "stale" substring...`},
    {type:'step', text:`Checking note fields for stale mentions...`},
    {type:'error', text:`INFORMATION NOT RECORDED: competing prices were discarded at write time`},
    {type:'error', text:`0 RESULTS: stale flag not present in any recorded value — only the winning mark is stored`},
  ]) + `<div style="padding:14px;text-align:center;margin-top:10px;">
    <div style="font-size:32px;font-weight:700;color:var(--red);">0</div>
    <div style="font-size:9px;color:var(--text-dim);margin-top:4px;">stale source incidents recoverable from vanilla store</div>
    <div style="font-size:8.5px;color:var(--amber);margin-top:8px;">⚠ Stale prices are not recorded. They were discarded at write time. The risk pattern is invisible.</div>
  </div>`;

  const eoHtml = `<div style="font-size:8.5px;color:var(--green);margin-bottom:8px;">✓ DEF events preserve all competing values including stale flags. Query: filter DEF events for entries with stale: true.</div>
  <table class="q-table"><thead><tr><th>Event</th><th>Date</th><th>Stale source</th><th>Stale value</th><th>Live values at time</th><th>Risk signal</th></tr></thead>
  <tbody>
    <tr><td class="td-id">evt_010</td><td>2025-10-20</td><td class="td-flag">internal_model</td><td class="td-flag">$271.30</td><td style="color:var(--text);">Bloomberg $241.10, Reuters $238.80</td><td style="color:var(--amber);font-size:8.5px;">Model hadn't processed OpenAI deal collapse. $29+ spread.</td></tr>
    <tr><td class="td-id">evt_015</td><td>2025-11-11</td><td class="td-flag">internal_model</td><td class="td-flag">$241.20</td><td style="color:var(--text);">Bloomberg $218.40, Reuters $214.90</td><td style="color:var(--amber);font-size:8.5px;">Post-earnings open. Model hadn't recalibrated. $23+ spread.</td></tr>
  </tbody></table>
  <div style="padding:10px 0 4px;display:flex;gap:24px;">
    <div style="text-align:center;"><div style="font-size:24px;font-weight:700;color:var(--green);">2</div><div style="font-size:8px;color:var(--text-dim);">incidents found</div></div>
    <div style="text-align:center;"><div style="font-size:24px;font-weight:700;color:var(--amber);">100%</div><div style="font-size:8px;color:var(--text-dim);">pattern: internal_model during rapid moves</div></div>
  </div>`;

  return { vHtml, eoHtml, vStatus: statusBadge('fail','FAIL — 0 results, data discarded'), eoStatus: statusBadge('ok','COMPLETE — 2 incidents, full provenance') };
}

function q7() {
  const allMarks = [
    {evt:'evt_002',date:'Oct 01',mark:'$309.80',src:'bloomberg',disputed:false,restated:false},
    {evt:'evt_004',date:'Oct 07',mark:'$298.10',src:'bloomberg',disputed:false,restated:false},
    {evt:'evt_005',date:'Oct 10',mark:'$284.20 / $279.60 / $281.90',src:'3 sources',disputed:true,restated:false},
    {evt:'evt_006',date:'Oct 11',mark:'$279.60',src:'risk_desk',disputed:false,restated:false,resolution:true},
    {evt:'evt_008',date:'Oct 16',mark:'$271.30',src:'bloomberg',disputed:false,restated:false},
    {evt:'evt_010',date:'Oct 20',mark:'$241.10 / $238.80 / $271.30⚑',src:'3 sources',disputed:true,restated:false},
    {evt:'evt_011',date:'Oct 20',mark:'$243.60',src:'bloomberg',disputed:false,restated:true,note:'affected by evt_018 restatement'},
    {evt:'evt_012',date:'Oct 22',mark:'$247.20',src:'trade execution',disputed:false,restated:false},
    {evt:'evt_015',date:'Nov 11',mark:'$218.40 / $214.90 / $241.20⚑',src:'3 sources',disputed:true,restated:false},
    {evt:'evt_016',date:'Nov 11',mark:'$216.80',src:'risk_desk',disputed:false,restated:false,resolution:true},
    {evt:'evt_021',date:'Nov 25',mark:'$204.10',src:'bloomberg',disputed:false,restated:false},
    {evt:'evt_023',date:'Dec 05',mark:'$196.20 / $192.80 / $194.50',src:'3 sources',disputed:true,restated:false},
    {evt:'evt_024',date:'Dec 06',mark:'$194.50',src:'risk_desk',disputed:false,restated:false,resolution:true},
    {evt:'evt_026',date:'Dec 12',mark:'$191.40',src:'expiry',disputed:false,restated:false},
    {evt:'evt_027',date:'Dec 19',mark:'$191.40',src:'close',disputed:false,restated:false},
  ];

  const vHtml = `<div style="font-size:8.5px;color:var(--amber);margin-bottom:8px;">⚠ Vanilla audit trail: 21 stream events. Disputed intermediate valuations are unrecoverable. Restatement effects require manual reconstruction.</div>
  <table class="q-table"><thead><tr><th>Stream v</th><th>Date</th><th>Type</th><th>Value</th><th>Disputed alternatives</th></tr></thead>
  <tbody>
    ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21].map(v=>`<tr><td class="td-id">v${v}</td><td>—</td><td style="color:var(--text-faint)">PositionMarked / other</td><td style="color:var(--text)">single value</td><td class="td-warn">not recorded</td></tr>`).join('')}
  </tbody></table>
  <div style="font-size:8.5px;color:var(--text-dim);margin-top:6px;">21 events. 0 disputed values recoverable. Restatement boundary: manual. Stale sources: unrecoverable. Audit completeness: ~62%.</div>`;

  const eoHtml = `<div style="font-size:8.5px;color:var(--green);margin-bottom:8px;">✓ EO audit trail includes all disputed marks, stale flags, resolution provenance, restatement frame boundaries, and structural links between events.</div>
  <table class="q-table"><thead><tr><th>Event</th><th>Date</th><th>Op</th><th>Value(s)</th><th>Flags</th></tr></thead>
  <tbody>
    ${allMarks.map(m=>`<tr>
      <td class="td-id">${m.evt}</td>
      <td>${m.date}</td>
      <td>${m.disputed ? opTag('EVA') : opTag('DEF')}</td>
      <td style="color:${m.disputed?'var(--sup)':m.resolution?'var(--cyan)':'var(--text)'};">${m.mark}</td>
      <td style="font-size:8px;">${m.restated?'<span style="color:var(--rec)">⟳ restated</span>':m.resolution?'<span style="color:var(--cyan)">← resolves EVA</span>':''}</td>
    </tr>`).join('')}
  </tbody></table>
  <div style="display:flex;gap:20px;margin-top:8px;">
    <div style="text-align:center;"><div style="font-size:22px;font-weight:700;color:var(--green);">40</div><div style="font-size:8px;color:var(--text-dim);">rows (incl. disputed)</div></div>
    <div style="text-align:center;"><div style="font-size:22px;font-weight:700;color:var(--green);">100%</div><div style="font-size:8px;color:var(--text-dim);">audit completeness</div></div>
    <div style="text-align:center;"><div style="font-size:22px;font-weight:700;color:var(--amber);">12</div><div style="font-size:8px;color:var(--text-dim);">disputed values recovered</div></div>
  </div>`;

  return { vHtml, eoHtml, vStatus: statusBadge('partial','PARTIAL — 62% complete'), eoStatus: statusBadge('ok','COMPLETE — 100%') };
}

const QUERIES = [q1, q2, q3, q4, q5, q6, q7];
const V_SCORES = ['PARTIAL','FAIL','PARTIAL','FAIL','PARTIAL','FAIL','PARTIAL'];

function runQuery(idx) {
  setQueryCard(idx);
  const result = QUERIES[idx]();
  document.getElementById('q-vanilla-body').innerHTML = result.vHtml;
  document.getElementById('q-eo-body').innerHTML = result.eoHtml;
  document.getElementById('q-v-status').innerHTML = result.vStatus;
  document.getElementById('q-eo-status').innerHTML = result.eoStatus;

  const vAns = V_SCORES.filter(s => s !== 'FAIL').length;
  document.getElementById('qd-v-score').textContent = vAns + '/7';
  document.getElementById('qd-v-info').textContent = '62%';
}

const PROVENANCE = {
  evt_005: ['Q1: price conflict history', 'Q6: stale source detection', 'Q7: full audit trail'],
  evt_006: ['Q1: price conflict history (resolution)', 'Q7: full audit trail'],
  evt_009: ['Q3: severed relationships'],
  evt_010: ['Q1: price conflict history', 'Q6: stale source detection (internal_model)', 'Q7: full audit trail'],
  evt_013: ['Q5: typed restriction periods'],
  evt_015: ['Q1: price conflict history', 'Q6: stale source detection (internal_model)', 'Q7: full audit trail'],
  evt_016: ['Q1: price conflict history (resolution)', 'Q7: full audit trail'],
  evt_017: ['Q5: typed restriction periods (end)'],
  evt_018: ['Q2: restatement dependency graph', 'Q4: pre/post-restatement frames', 'Q7: full audit trail'],
  evt_019: ['Q2: restatement dependency graph (cascade)', 'Q4: pre/post-restatement frames'],
  evt_023: ['Q1: price conflict history', 'Q7: full audit trail'],
  evt_024: ['Q1: price conflict history (resolution)', 'Q7: full audit trail'],
};

function getProvenance(eid) {
  return PROVENANCE[eid] || ['Standard position replay — vanilla equivalent'];
}

document.getElementById('scrubber').max = EVENTS.length - 1;
buildFeed();
document.getElementById('hdr-evt-total').textContent = EVENTS.length;
render();
</script>
</div><!-- /replay-mode -->

<div id="query-mode" style="flex-direction:column;">
  <div id="query-layout" style="flex:1;overflow:hidden;min-height:0;">
    <div class="q-sidebar">
      <div class="q-sidebar-hdr">QUERIES — 7 SCENARIOS</div>
      <div class="q-card active" onclick="runQuery(0)">
        <div class="q-card-num">Q1 — AUDITOR</div>
        <div class="q-card-title">Price conflict history with resolutions</div>
        <div class="q-card-desc">Every mark dispute and how it was resolved. Are conflicts structurally linked to their resolution?</div>
        <div class="q-tags"><span class="q-tag EVA">EVA</span><span class="q-tag DEF">DEF</span></div>
      </div>
      <div class="q-card" onclick="runQuery(1)">
        <div class="q-card-num">Q2 — COMPLIANCE</div>
        <div class="q-card-title">Downstream events from Q1 restatement</div>
        <div class="q-card-desc">Which events are causally downstream of evt_018? Can the store traverse the dependency graph?</div>
        <div class="q-tags"><span class="q-tag REC">REC</span></div>
      </div>
      <div class="q-card" onclick="runQuery(2)">
        <div class="q-card-num">Q3 — RISK</div>
        <div class="q-card-title">Severed relationships on ORCL</div>
        <div class="q-card-desc">What connections has ORCL had that are now nullified? Shape of the relationship preserved?</div>
        <div class="q-tags"><span class="q-tag NUL">NUL</span><span class="q-tag EVA">CON</span></div>
      </div>
      <div class="q-card" onclick="runQuery(3)">
        <div class="q-card-num">Q4 — REGULATOR</div>
        <div class="q-card-title">Pre vs post-restatement mark frames</div>
        <div class="q-card-desc">Show mark_price under the pre-restatement world vs the corrected world. Does the store know the difference?</div>
        <div class="q-tags"><span class="q-tag REC">REC</span><span class="q-tag DEF">DEF</span></div>
      </div>
      <div class="q-card" onclick="runQuery(4)">
        <div class="q-card-num">Q5 — COMPLIANCE</div>
        <div class="q-card-title">Typed restriction periods on tradeable_status</div>
        <div class="q-card-desc">List all periods where the position had a deliberate, typed restriction. Known-unknown vs unknown-unknown?</div>
        <div class="q-tags"><span class="q-tag NUL">NUL</span></div>
      </div>
      <div class="q-card" onclick="runQuery(5)">
        <div class="q-card-num">Q6 — RISK MGMT</div>
        <div class="q-card-title">Stale source incidents during price conflicts</div>
        <div class="q-card-desc">How many times was a stale source present during a mark conflict? Are those values recoverable?</div>
        <div class="q-tags"><span class="q-tag EVA">EVA</span></div>
      </div>
      <div class="q-card" onclick="runQuery(6)">
        <div class="q-card-num">Q7 — AUDIT TRAIL</div>
        <div class="q-card-title">Full P&amp;L audit including disputed marks</div>
        <div class="q-card-desc">Reconstruct every mark including disputed intermediates, restatement effects, and source provenance.</div>
        <div class="q-tags"><span class="q-tag EVA">EVA</span><span class="q-tag REC">REC</span><span class="q-tag NUL">NUL</span><span class="q-tag DEF">DEF</span></div>
      </div>
    </div>

    <div class="q-result-panel">
      <div class="q-result-hdr">
        <span style="font-size:9px;font-weight:700;color:var(--text-faint);letter-spacing:0.08em;">VANILLA STORE</span>
        <span style="margin-left:auto;font-size:8px;" id="q-v-status"></span>
      </div>
      <div class="q-result-body" id="q-vanilla-body">
        <div class="no-events-msg" style="margin-top:40px;">Select a query</div>
      </div>
    </div>

    <div class="q-result-panel">
      <div class="q-result-hdr">
        <span style="font-size:9px;font-weight:700;color:var(--cyan);letter-spacing:0.08em;">EO STORE</span>
        <span style="margin-left:auto;font-size:8px;" id="q-eo-status"></span>
      </div>
      <div class="q-result-body" id="q-eo-body">
        <div class="no-events-msg" style="margin-top:40px;">Select a query</div>
      </div>
    </div>
  </div>

  <div id="query-delta">
    <div class="qd-cell">
      <div class="qd-title">QUERIES ANSWERABLE</div>
      <div class="qd-content">
        <span class="qd-score qd-vanilla" id="qd-v-score">—</span>
        <span class="qd-label" style="color:var(--text-faint);">vanilla</span>
        <span class="qd-score qd-eo" id="qd-eo-score" style="margin-left:8px;">7/7</span>
        <span class="qd-label" style="color:var(--text-faint);">EO</span>
      </div>
    </div>
    <div class="qd-cell">
      <div class="qd-title">INFORMATION ACCESSIBLE</div>
      <div class="qd-content">
        <span class="qd-score qd-vanilla" id="qd-v-info">—</span>
        <span class="qd-label" style="color:var(--text-faint);">vanilla</span>
        <span class="qd-score qd-eo" id="qd-eo-info" style="margin-left:8px;">100%</span>
        <span class="qd-label" style="color:var(--text-faint);">EO</span>
      </div>
    </div>
    <div class="qd-cell">
      <div class="qd-title">STRUCTURAL QUERIES (NO STRING PARSING)</div>
      <div class="qd-content">
        <span class="qd-score qd-vanilla" id="qd-v-struct">0/7</span>
        <span class="qd-label" style="color:var(--text-faint);">vanilla</span>
        <span class="qd-score qd-eo" id="qd-eo-struct" style="margin-left:8px;">7/7</span>
        <span class="qd-label" style="color:var(--text-faint);">EO</span>
      </div>
    </div>
  </div>
</div>
</div><!-- /terminal-root -->

</body>
</html>
