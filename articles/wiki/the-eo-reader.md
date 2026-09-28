# The EO Reader: EO Implemented

**Record ID:** wiki:the-eo-reader  
**DB ID:** 73  
**Tags:** 301  
**Keywords:** eo reader, implementation, holon, event log, effect system, provenance  
**Status:** published  
**Updated:** 2026-09-28T00:00:00.000Z  

---

*For most of its life EO was a framework with an anecdote for evidence. The **EO Reader** (`eoreader`) is the framework running as software: a document-reading and research instrument whose behavior can be cited module by module. This article is the map. The two companion articles — [Signal from Noise](/signal-from-noise) and [The Evidence](/the-evidence) — are the parts that matter most for grounding EO's claims about meaning.*

*Version history, honestly: 4.2 ("the holonic refactor," this article's prior framing) gave way to a 6.1 line that was itself frozen and retired on 2026-09-15. **EOReader 7 is the current line.** It began from the frozen 6.1 snapshot, commit `e20e441d3cdfb735d605c75037e6d73892e707c0`; nothing in v7's `native/` tree imports the legacy surface, a boundary pinned by its own conformance test (`README.md`; `LEGACY-EOREADER6.1.md`).*

*Citations below are paths into the `eoreader7` source tree — `native/kernel/`, `native/organs/`, `native/adapters/`. They are references, not hyperlinks — the point is that each claim in this article resolves to code you can open.*

---

## The one fact

> The append-only event log is the source of truth. Everything you see is a recomputed **projection** of it. (`README.md`; `src/core/log.js`, `src/core/project.js`)

There is no wall-clock and no mutable store of record. Every event in the log is one of the nine operators, addressed as `operator(Site, Resolution)` at read time. Re-projecting the same log is byte-identical; a retraction is a `SEG` event, never an erasure; nothing derived is ever persisted — the graph, spans, and mentions are always rebuilt by replay (`src/persist/`). This is [The Integral Model](/the-integral-model) made concrete: state as the integral of a typed-transformation log.

## The body: kernel, organs, adapters — and a sibling surface

EOReader 7 is a from-scratch native rewrite, not a continuation of 4.2's "holonic refactor." The 4.2-era directory layout described in earlier versions of this article — `core/frame/organs/perceiver/surfer/enactor/model/turn/weave/rooms/metabolism/murmur`, each a holon with its own `eo-contract.js` manifest, mechanically merged and coverage-tested — no longer exists in this tree, and this pass found no direct successor to that per-organ contract-enforcement mechanism (see [Holons](/holons) for what a closer look at the replacement found).

What eoreader7 owns instead is **kernel, adapters, organs, and evals**; **the-fold** owns the surface. The-fold is a separate sibling repository that depends on eoreader7, never the reverse (`README.md:234-248`; `LEGACY-EOREADER6.1.md:28-31`). `native/organs/index.js` is the one seam the-fold's surface imports through — every organ it calls is exported from there, and only from there, under explicit names (`native/organs/index.js:1-12`).

Each organ or kernel module carries a "Handle" — a historical or biological namesake disclosed in a `// Handle: …` line at the top of the file, indexed in one canonical table (Amendment XVII). A few examples: `organs/corroboration.js` (Handle: Bukhari) — "stands only on independent chains; shared chain = one witness"; `kernel/witness.js` (Handle: Thymus) — "nomination is not admission"; `organs/pathos.js` (Handle: Abhinavagupta) — the felt shape of a reading, gated by strain (`README.md:250-266`).

Two design principles recur across the codebase — **the low sets the possibility for the high, the high sets the probability for the low** — though this pass found no dedicated architecture document stating them directly (the 4.2-era `src/architecture` docs this article previously cited do not carry over). The wording persists inside the Handle table's own entry for `organs/martial.js` (Handle: Martial): "holon-aware (low sets possibility for high, high probability for low)" (`README.md:374`).

## The deepest invariant: two doors

Every event enters through a **door**. Perceiver-door events are **exafference** — the witnessed world, `canWitness === true`. Enactor-door events are **reafference** — the system's own output, `canWitness === false` **by type, not by flag** (`src/core/provenance.js`). Reflections, murmur nominations, inferred connections, and code-organ findings all ride the enactor door at band `void`; only a human witness act can promote them. *You cannot tickle yourself; the voice cannot corroborate itself through the user's mouth.* This is the mechanism the wiki's [Experience Engine](/the-experience-engine) described as the Given/Meant boundary — with one amendment the implementation earned: inferences **do** reach the graph, distinguishable, with a measured `factsAdded: 0` audit. The firewall was never "keep interpretation off the graph"; it is "keep it distinguishable on the graph." Full treatment in [The Two Doors](/the-two-doors).

*Citation note, 2026-09-28: `src/core/provenance.js` is a 4.2-era path. This pass grepped the whole eoreader7 `native/` tree for `canWitness` and found no hits, so no successor implementing a "canWitness-by-type" law under that name is confirmed. README's own "Priors and witness" paragraph — "Priors may condition orientation, nominate perceptions, and focus interrogation. They cannot become witness merely by being prior" — and `kernel/witness.js` (Handle: Thymus, "Nomination is not admission") are the same shape and a plausible lead, but they are flagged here as unconfirmed, not re-cited as the mechanism (`README.md:210-212, 285`).*

## What it actually does — behavioral commitments, asserted pending re-citation

*Citation note, 2026-09-28: the module paths below (`src/rooms/reader/app.js`, `src/surfer/fold/deep-reading.js`, `src/organs/in/acoustic.js`, `src/murmur/link/`, `src/rooms/research/driver.js`, and their sibling test files) are 4.2-era and resolve into neither eoreader7's `native/` tree nor the-fold's current flat repo-root layout. A sample of the-fold's own module census — `app.js`, `fold.js`, `void-loop.js`, among others — confirms a flat file layout with no `rooms/`, `surfer/`, or `murmur/` directories (`native/docs/THE-MODULE-CENSUS.md`, rows 376, 396, 429, 456, 474). The bullets below are kept as design-principle statements pending a fresh citation pass against the-fold's current repository; none should be read as a live module citation until re-verified.*

Each of these was, in the 4.2 architecture, a decision the reader made differently from an ordinary chatbot, with a test pinning it. Whether each still holds, and exactly where it now lives, has not been re-verified this session:

- **Ask is record-only.** The "Ask the record" surface was designed never to reach the web to answer; on an empty record it says so and offers nothing.
- **The search box ingests, it does not answer.** A query was designed to open a dedicated search topic first, rather than answering directly.
- **The reader reads at rest.** When idle, the design intends it to surf the held document to the place of most interest, fold it, and reflect — habituating so it never ruminates. `organs/pathos.js` (Handle: Abhinavagupta) — "the felt shape of a reading, for whom — surprise/tension/release gated by strain" (`README.md:311-312`; exported at `native/organs/index.js:110-115`) is a lead for where this behavior now lives, not a confirmed match.
- **Audio is a Listen surface with a living transcript.** The design intends transcript edits and redactions to be non-destructive events, nothing overwritten.
- **Murmur points; it never asserts.** The design intends a recognized recurrence to stay a firewalled candidate connection until a promotion gate corroborates it against the actual document text.
- **Research tries to be wrong.** The design intends a fraction of a study's searches to be seeded as disproof queries, always drained. *A research tool that only ever makes you more confident is not researching — it is collecting.*

### Reading competency audit (2026-09-23) — saving the appearances, applied to itself

The reading route actually live on every session turn measures **0.9% recall / 18.5% precision** on core subject–verb–object extraction, against **74.0% recall / 73.7% precision** for an already-built, already-validated trained UD parser that sits unwired. A scrambled-word-order null confirms the 74% figure reflects real grammatical reading rather than chance (p = 1.9×10⁻⁴³) (`README.md:469-481`).

This is a [saving-the-appearances](/ancient-astronomy-eo-saving-the-appearances) instance applied to the reader's own central claim: the live behavior and the validated capability are not the same thing, and the gap between them was measured and left on the record rather than smoothed over.

### Two dated subsystems not yet reflected above (2026-09-19, 2026-09-20)

- **Ant-swarm auto-routes hard-meaning material to a no-model fallback.** A turn whose meaning is hard to emerge — garble, truncation, encoding failure, notation density, a pointed-at void — is auto-routed to the capacity-swarm even when Heimdall is refusing model loads, because the swarm needs no model and so is never gated by one. What it learns is preserved: a standing rule is written to an append-only ledger and applied by name alongside each turn's own re-derivation, never in place of it (`native/eval/lavar/hard-meaning.mjs`; `swarm-server.mjs::runSwarmTurn`; `content-rules.mjs`; `README.md:407-431`).
- **Heimdall is an out-of-process hive-mind admission and homeostasis gate.** A fleet of watchers, each in its own process, watches itself and its peers and raises to the operator before terminating anything; termination is always the operator's explicit sign-off, never a silent kill (`native/heimdall/self-health.mjs`, `peer-mesh.mjs`, `fleet.mjs`; `README.md:432-446`).

## Why this matters for the framework

The wiki's persistent weakness has been asserting in the indicative what was never tested. The EO Reader supplies the missing evidence leg — and, crucially, it supplies it exactly where the framework's older proof could not reach. [Nine Instructions](/nine-instructions) shows that EO's relational-algebra closure result certifies only the Existence and Structure operators; the **Significance triad** (assert / evaluate / restructure) is where the reader's distinctive machinery lives, and it is grounded not by proof but by measurement. How that measurement works is [Signal from Noise](/signal-from-noise); what it has actually shown — including the negatives left honestly on the record — is [The Evidence](/the-evidence).

---

### See also

- [Nine Instructions](/nine-instructions) — why the reader is best understood as a compiler, not an ontology
- [Signal from Noise](/signal-from-noise) — the measurement doctrine, with module citations
- [The Evidence](/the-evidence) — what the reader has measured, negatives included
- [The Two Doors](/the-two-doors) · [Deep Reading](/deep-reading) · [Going and Looking](/going-and-looking)
- [The Integral Model](/the-integral-model) · [The Experience Engine](/the-experience-engine) — the specifications it implements
