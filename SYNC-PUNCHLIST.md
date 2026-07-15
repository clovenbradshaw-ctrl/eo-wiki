# Wiki ⇄ EO Reader 4.2 Sync Punch List

*Prepared 2026-07-13 from a deep reading of `clovenbradshaw-ctrl/eoreader4.2` (all 49 design docs, the full `src/` tree, tests, and probes) against all 69 wiki articles.*

**The headline:** the wiki does not mention the EO Reader anywhere (grep for `eoreader` returns zero hits). Its only implementation trace is one anonymized anecdote in *The Experience Engine* ("a reading engine implementing this specification induced the attribution verb 'says'…"), self-graded as "a proposal carrying one data point." Meanwhile 4.2 is a full working implementation with 140+ engine-behavior tests, dated eval batteries (2026-07), and — most importantly for the wiki — a family of concrete, citable **signal-from-noise mechanisms** that turn EO's asserted claims into measured physics. Several wiki articles are now contradicted; many more can be upgraded from "asserted" to "grounded, with a module citation."

Priorities: **P0** = wiki says something now false or internally contradicted; **P1** = high-value grounding upgrade or flagship net-new article; **P2** = worthwhile but deferrable; **P3** = mechanical hygiene.

---

## Progress log (2026-07-14)

**Naming:** the implementation is the **EO Reader** (`eoreader`). New articles use this name.

**A reframing became the centerpiece.** An audio essay ("Nine Instructions") reframed the whole operator algebra as a *row-based algebraic effect system in capability-passing style over a closed semantic alphabet* — proven ground everywhere except the closure claim, which is Schank's claim (Conceptual Dependency) and must be defended as such. Its sharpest technical point folds directly into A1/A2: EO cites **Codd's proof** (Existence/Structure) for a claim about the **Significance triad** (DEF/EVA/REC), which the proof does not reach — but which the EO Reader now *grounds by measurement*. This is now the spine the net-new articles hang from.

**Landed and pushed on this branch:**
- **Wave 1 correctness (A1 + parts of the sweep):** the "ARI ≈ 0.05 confirmed independence" overstatement corrected to the framework's own v2 finding (≈ 0.185, mixed) in `emergent-ontology-eo` and `ground-figure-pattern`; a "what this test does and does not certify" caveat added to `the-triads` (Codd reaches Existence/Structure, not Significance); the helix "1,295 fail / only one survives" claim reconciled with `the-triads`; the collapsed find/replace sentence ("the capacity ground and the capacity ground…") fixed.
- **Nine net-new articles** (the reframing spine): `nine-instructions` (flagship reframing), `the-eo-reader` (C1), `signal-from-noise` (C2), `the-evidence` (C3), `the-two-doors` (C4), `deep-reading` (C5), `going-and-looking` (C6), `the-model-is-the-leaf` (C14), `eot` (C13). All internal links resolve; all cite modules by path (and, where measured, `path:line`).

**Also landed (second/third pass, 2026-07-14):**
- **A2 (DEF/EVA)** — reconciled to `src/core/operators.js`: fixed the position swap in `the-27-phase-posts` (DEF at Mode 0, EVA at Mode 1) and the swapped/stale semantics in `emergent-ontology-eo` and `the-triads`; `the-nine-operators` was already canonical.
- **A3 (glyphs, partial)** — internal-consistency fixes in `the-nine-operators` (CON glyph, Greek DEF/EVA). *Still open:* full glyph-set canonicalization across the decal-notation pages (`the-27-phase-posts` still uses a non-canonical base set — needs a decal-notation reconciliation).
- **A4** — `the-def-eva-rec-loop`: added the depicted/enacted two-register split; purged the retired "DES".
- **A5** — published `sig` (appearing/registration); retired "Distinction" in `the-nine-operators`.
- **D1** — replaced the duplicate-body `canonical-examples-the-resolution-face` with the real Stance face (Mode × Object, the nine stances from `src/core/cube.js`); exemplar tables marked pending rather than borrowed.

**Also landed (later 2026-07-14):** **A6** (Experience Engine repaired — HTML corruption, tables, dangling `eo-compliance-spec`, recursion witness named). **A3-glyphs** — the full operator glyph set canonicalized to `src/core/operators.js` (`∅ ○ ● ｜ ⋈ △ ⊢ ⊨ ⊛`) across every carrier (`the-27-phase-posts`, `the-nine-operators`, `ins`, `eo-notation` incl. its swapped DEF/EVA rows, `eo-event-streaming`, `quantum-weirdness`, `eo-in-60-min`, `mhc-and-eo`, `the-pythagorean-theorem`, and the `operator-naming` rationale + superseded-glyph history). **D3** (Paraxoc → Paradox).

**Naming — important:** recorded that **EO expands to three: Existential, Emergent, and Experiential Ontology** (flagship intro). This makes the "Emergent vs Experiential" variance across the wiki *intentional multiplicity*, so the D2 normalization sweep is **withdrawn** — the expansions are interchangeable by design and should not be flattened.

**Still open:** A9–A15 and the B-series grounding upgrades; net-new C7/C9–C12/C15; remaining Part D hygiene (`test-page`/empty-stub deletions — need confirmation before deleting; the archived lexical-report duplicate).

---

## Part A — Contradictions & supersessions (edit existing articles)

### A1. ~~"ARI ≈ 0.05 confirmed independence"~~ — **P0**
`wiki/emergent-ontology-eo` and `wiki/ground-figure-pattern` both claim "Empirical research… has confirmed that the three axes are statistically independent (ARI ≈ 0.05)." The wiki's own v2 report (`document/eo-lexical-analysis-v2-results-report`) records Q1/Q2 ARI = **0.185** and marks the independence prediction **failed**; coordinate-geometry step-ratio predictions were also not met. The reader treats the v2 numbers as Tier-0 canon (`eoreader4.2/docs/prompt-as-site.md` cites them directly). Fix both articles to match the report's honest reading; while there, reconcile the inconsistent corpus figures (1,192 verbs vs 32,289 verbs vs 19,764 clauses — v1 verb study vs v2 clause study, cite each as what it is).

### A2. DEF/EVA grid position and semantics — **P0**
- Grid: `wiki/the-27-phase-posts` puts EVA at Mode 0 and DEF at Mode 1 — swapped relative to `wiki/the-nine-operators`. The implementation settles it: `src/core/cube.js` fixes the alias direction **SUP → EVA, ALT → DEF** by cube geometry, and its own doc records that earlier prose had it backwards and was corrected *to match the shipped data*. Align every grid-bearing page (`the-nine-operators`, `the-27-phase-posts`, `the-triads`, `emergent-ontology-eo`, canonical-example pages) to one canonical layout matching `src/core/operators.js:24-34`.
- Semantics: DEF is variously "hold contradictions/superposition," "fixed type," "value field," and "alternation" across four articles. The implementation's settled meaning: **a judgment is a DEF carrying its witness** — a DEF without one is malformed (`src/core/def.js`, `src/core/cut.js:92-133`). EVA = evaluate/test with strain accumulation. Pick this and propagate.

### A3. Operator glyph/symbol chaos — **P0** (bundled with A2)
INS ● vs △; CON ⤫ vs ⋈; EVA ⊨ vs ∿; DEF ⊢ vs ∥ across published pages. Declare one canonical symbol set on `the-nine-operators`, note the retired alternates in the naming-history article (A9).

### A4. `the-def-eva-rec-loop` — superseded by the two-register split — **P0**
The article conflates what 4.2 says the log must never conflate: the **depicted** loop (transformation classified in the text; timeless) vs the **enacted** loop (the reading's own act of establishing/testing/restructuring frames; temporal, order-constitutive). Implementation: `src/core/enacted/loop.js` (strain accumulator, leaky integrator 0.9, IMPULSE vs ACCUMULATION frame breaks, refractory=3) with a register firewall (`enactor/enact` `assertSingleRegister`). Also purge the leftover retired operator name "**DES**" from this article. Rewrite around the two registers, with Piaget (assimilation/accommodation) and Lakatos (protective belt) framing from `docs/significance-loop.md`.

### A5. SIG: "Distinction" → "appearing/registration" — **P0**
The draft `wiki/sig` already argues the rename; `the-nine-operators` (published) still says "Distinction." The implementation's SIG is *attribute/registration* (`src/core/operators.js`). Publish `sig`, update `the-nine-operators`, log the rename in A9.

### A6. `the-experience-engine` — the spec has been outrun — **P0**
The single most important edit. This is the newest wiki page (2026-06-13) and the spec the reader implements, but:
- It carries **one** induced convention as its only evidence ("empirically suggestive on a single witness"). 4.2 now supplies a defeasible convention ledger (`src/core/conventions/` — DEF learn / EVA test / REC defeat-or-reinstate, priors carry support=3 head starts and can *lose*), measured firewall audits (`factsAdded: 0`), and dated eval batteries. Replace the anonymous anecdote with named, versioned, citable evidence.
- Its Given/Meant boundary is refined by the implementation into the **door/canWitness type law** — and amended: the firewall was never "keep inferences off the graph"; it is "keep them *distinguishable* on the graph" ("impact without laundering," `docs/monologue-significance.md`; `src/core/provenance.js`). Update the Rules discussion accordingly.
- Mechanical: fix the raw-HTML corruption at ~line 35 and the collapsed table headers; resolve the dangling reference to `wiki:eo-compliance-spec` (see C12); state the storage architecture 4.2 actually chose (append-only log + replay-rebuilt projections, `src/core/log.js`, `src/core/project.js`, `src/persist/`).

### A7. Surprisal → Bayesian surprise — **P0** where it appears, **P1** sweep
Wherever the wiki grounds significance/salience in surprisal or information content, 4.2 explicitly demotes surprisal to a novelty channel: the significance quantity is **D_KL(posterior ‖ prior)** over the figure field — "TV-snow is maximally improbable yet inert" (`src/core/surprise.js:63`, `src/perceiver/reading.js:203-244`). Sweep `eo-in-60-min`, `lexical-analysis`, and any salience-adjacent text.

### A8. The desert cell: from empirical emptiness to enforced law — **P1**
The wiki reports SYN·Ground as an empirical emptiness (0.6% of clauses; empty across 41 languages). 4.2 promotes it to a **normative, structurally enforced prohibition**: "you may *dwell* in the Void but never *fabricate* from it" — barred forever by the constitution (`src/metabolism/constitution.js:124` `permitsCell`), unsamplable at token level in the coder (`src/coder/mask.js`), the confabulation guard app-wide (`src/core/cube.js` `coherence`), and ported to code analysis (`void-binding` legal-to-hold vs `fabrication` illegal-to-use, `src/organs/code/issues.js`). Update `the-eo-phase-space-cube`, `the-27-phase-posts`, and the lexical pages; feeds C7.

### A9. `operator-naming-in-emergent-ontology` — make it the rename registry — **P1**
Four overlapping vocabularies now exist (phasepost/form, cube/capacity ground, Distinction/appearing, DES→SIG, SUP→EVA/ALT→DEF, Significance/Interpretation domain dual-naming). Extend this article into the canonical terminology registry recording each rename, its date, and its reason — then fix the shrapnel it documents (see Part D).

### A10. LLM framing inverted — **P1**
`the-nine-operators` frames LLMs as NUL-degraded technology; `mvp-minimum-viable-prompt` positions a system prompt as the way to make an LLM "do EO." 4.2 inverts the architecture: **the model is the leaf** — a contracted part with the narrowest `{ops, terrains, stances}` grant (no DEF/EVA/REC = the defamation firewall; no Entity terrain = PII protection as an address the model doesn't have; `docs/model-as-contracted-part.md`, `src/model/`), and the empirical result that a deterministic scorer agreed with hand labels 19/20 (95%) while a local 7B LLM judge agreed 20/39 (51%), 17 of its 19 disagreements invented (`docs/judgment-eval-battery-2026-07.md`). Update both articles; retire or reposition `mvp-minimum-viable-prompt` as a historical artifact superseded by the contract approach.

### A11. `holons` — extend to the operational definition — **P1**
Add 4.2's six operational criteria (one entrance, boundary, own tests, swappable, whole at its own scale, survives interruption — Koestler's watchmakers made mechanical, `docs/holons.md`) and the organ-as-cube-cell-contract move (`src/metabolism/organ.js`), with the enforcement story: `src/core/contracts.js` merges every holon manifest and `tests/contracts.test.js` proves 100% coverage, cube coherence, and "no desert cell" on every run.

### A12. `ancient-astronomy-eo-saving-the-appearances` — extend to causation — **P2**
4.2 applies the Ptolemaic standard to causal claims specifically: the engine never produces "X causes Y," only "the reader *reads* a passage as proposing that a source *claims* X causes Y," with no upgrade path from accidental to essential stance without a design/intervention (`docs/dag-corpus.md`, `src/surfer/dag/`). Add a section; cross-link from C9.

### A13. `quantum-weirdness-in-eo-contained-but-not-tamed` — the Born rule is now operational — **P2**
The article maps quantum frameworks onto the cube speculatively. 4.2 *uses* the Born rule as its noise gate: squared projection P = |⟨T|s⟩|² for thread salience (`src/surfer/salience.js`), murmur steer collapse P = s·d (`src/murmur/steer/collapse.js:36` — "squaring is the noise gate"), the 27-cell chorus governor (`src/weave/chorus/born.js` — "squaring suppresses weak projections quadratically — the signal-from-noise step"), and the self-reaction validate stage (`src/enactor/ground/validate.js`). Also the density-operator machinery (`src/core/spectral.js`: signed ρ so contradiction *interferes*, von Neumann entropy, commutator as paradigm incommensurability). Add an "operational uses" section — with the honest caveat these are borrowed mathematics, not a derivation of QM.

### A14. `notes-on-nul-refinement` — resolve it — **P1**
The article self-flags: "Not yet integrated… Requires review against the Experience Engine specification." The implementation *is* that review, and it settled a richer picture than either proposal: NUL as hold/read (`src/core/operators.js`), **typed absence with an address** (not-in-corpus / reference-void / unstated-relation, `src/turn/judgments.js:211-230`; `answerFromVoid` receipts), the **three NULs kept apart** for causal absence (not-looked / looked-null / no-null-found, `docs/dag-corpus.md`), and INDETERMINATE as a first-class held verdict (`src/core/verdicts.js:22-28`). Rewrite the note as "how it resolved," update `nul` and `the-nine-operators` to match, and mark the losing branches superseded.

### A15. `the-integral-model` — the instance exists — **P1**
"A database organized this way is called an Experience Engine" is no longer hypothetical: 4.2 *is* one (append-only log as sole truth, `src/core/log.js`; everything visible a recomputed projection, `src/core/project.js`; retraction as a SEG event, nothing unwritten; derived state never persisted, always replay-rebuilt, `src/persist/`). The reachability claims (relational operations from inside the integral model) are now demonstrable — cite `src/rooms/data/query.js` (tables answered by computing) as a worked case.

---

## Part B — Grounding upgrades (wiki asserted it; the reader now evidences it)

Each of these keeps the article's claim but adds an "as implemented / as measured" leg with module citations.

### B1. The measurement claims: `the-measurement-paraxoc`, `emanon`, `protogon`, `holons` — **P1**
"Measurement transforms the entity" and "attempts to quantify confidence produce indices which become objects of speculation" are now instrumentable claims. Concrete hooks: classification as measurement with **no-commit as the honest output** (`src/perceiver/classify/` — commit only past a margin floor, hash-embedder firewall → all no-commit); the ontological asterisk holding identity open (`src/core/asterisk.js:145` — name labels can't be their own identity evidence); coref that must survive subtraction of talker warmth (`src/perceiver/parse/coref.js:228`). Also resolve (or explicitly pose) the open question from `language-is-a-projection`: entity types as trajectory signatures over Given-Log windows. And fix the title typo — it's "Paradox," not "Paraxoc" (title + index.json).

### B2. `eo-event-streaming` + `blog/nine-verbs-a-closed-algebra-for-event-streaming` — **P1**
Both pitch EO as the missing semantic layer for event streaming with no working artifact. Now citable: the EOT surface syntax with operator recovery and provenance-load-bearing ingestion (`src/organs/ingest/eot.js`, `eot-emit.js`), 17+ modality organs lowering onto one log through the nine operators (`src/organs/in/`), and the EO-contract-tagged event architecture throughout. The blog post should end by pointing at the reader.

### B3. `ins`, `rec`, `scope`, `eo-notation`, `decal-notation` — check formal specs against code — **P2**
`ins`'s `INS(target, operand)` anchor-minting spec, `rec`'s fixed-point/bounded-recursion semantics ("no operator targets the operator layer"), `scope`'s nine reference types, and the notation pages are all now checkable against `src/core/` (log.js seals `eo:{notation,terrain,stance,address}` at emit; `OPERATOR_ALIASES` migrate stale vocab; the one-act law — INS once per grain per turn). Update each to match what shipped, or mark divergences as aspirational explicitly. Note REC's implemented restraint: REC fires only on accumulated strain, never a single anomaly (`src/core/enacted/loop.js`).

### B4. The intro ladder: `eo-in-5-min`, `eo-in-15-min`, `eo-in-60-min` — **P1**
Each has (or should have) a "tested against reality" section currently resting on the lexical study alone. Add the implementation as the second evidence leg — two or three sentences each, pointing at the flagship article (C1) and the evidence index (C13). Also fix the duplicated Rule-9 paragraph in `eo-in-15-min`, and update the "honest objections" sections: some acknowledged gaps (e.g. "no clean operator address for no-cloning") now have implementation answers (identity-as-log made mechanical — `src/core/provenance.js` reload-as-read-back).

### B5. `identity-as-a-change-log` — **P2**
"Entity = its Given-Log; copying incoherent" now has mechanical form: `reenter/restoreOnReload` makes reloaded prior-self content read-back (never fresh world), the commitment ledger records every claim as relay vs authored with corrections beside (never over) what they correct (`src/enactor/ledger.js`), and supersession walks basis chains so a REC unsettles every dependent claim (`src/core/supersede.js:132`).

### B6. `degrees-of-freedom` — **P3**
The "Level 4?" speculation has a candidate answer in organ-level evolution: the system rewriting its own body plan under a frozen constitution (`docs/organ-level-evolution.md`). One paragraph.

### B7. `experiment/eo-terminal` — supersede — **P2**
The in-browser "EO vs Vanilla event store benchmark" predates the reader and is the repo's only executable artifact. Archive it with a pointer to EO Reader 4.2, or replace with a linked live demo.

---

## Part C — Net-new articles

Ordered by leverage. C1–C3 are the spine the user asked for: grounding EO in the demonstrated ability to discern signal from noise, with module citations.

### C1. **"The EO Reader: EO Implemented"** — **P1, flagship**
The article the see-also link "Experience Engines — systems built on the operator algebra" has always pointed at and never had. Content: what it is (document-chat over an append-only event log; everything visible a recomputed projection); the holonic body (faculties: core / frame / organs / perceiver / surfer / enactor / model / turn / weave / rooms / metabolism / murmur — each holon one entrance + its own EO contract, enforced by `tests/contracts.test.js`); the two principles in code ("the low sets the possibility for the high; the high sets the probabilities for the low"); the model as the leaf; the behavioral commitments now shipped (Ask is record-only; search ingests into a search topic; the at-rest deep reader; the audio Listen surface with a non-destructive transcript fold; the murmur that points but never asserts). Version it (4.2), date it, link the repo.

### C2. **"Signal from Noise: EO's Measurement Doctrine"** — **P1, the centerpiece**
The article that grounds EO's epistemics in demonstrated mechanism. Thesis: everywhere the reader needs a cut, it derives the threshold from the material's own chance background — *no chosen bar* — and abstention is the honest output when meaning can't be measured. The four load-bearing primitives, each with its citation:
1. **The derived void-null** — `src/core/voidnull.js:113` (`deriveNull`: fit the noise mode of the field's own non-cohering background, cut at the extreme-value quantile z = Φ⁻¹((1−α)^(1/N)), leave-one-out so a candidate never raises its own bar, abstains below 4 samples). Consumed by edge pruning, surf arrest, answerability, the speech gate, route crosstalk nulls, chorus signal cuts, prompt ground-inflation checks.
2. **The ONE surprise, two channels** — `src/core/surprise.js:63`: Bayesian surprise (D_KL, belief *moved*) as the significance quantity vs surprisal as mere novelty ("TV-snow is maximally improbable yet inert"). Pointed at the web it is curiosity (`src/turn/research.js`); pointed at the self it detects retreads (`src/surfer/salience.js:123`).
3. **The Born gate** — squared projection as the noise step: thread salience `|⟨T|s⟩|²`, murmur collapse P = s·d ("0.3·0.3 → 0.09 stays a private mutter"), the chorus governor, the validate self-reaction ("a single strong 'this is wrong' outweighs several faint 'seems okay's, quadratically").
4. **Corroboration as provenance, never content** — `src/enactor/ground/corroboration.js:82-107`: same-voice is an identity fact (id / content-hash / registrable-host / byline); the bar of two is a definition, not a tuned number; cross-modal (≥2 root origins, ≥2 senses) is the top rung, with derivation folding so a transcript never counts as a second witness (`docs/multimodal-eot-foundation.md`).
Close with the doctrine sentences the docs repeat: "propose, measure, act only past chance"; "the witness does not decide."

### C3. **"The Evidence: What the Reader Has Measured"** — **P1**
An honest evidence index — EO's "saving the appearances" standard applied to itself, negatives on the record:
- Churn detection: model reading its own surprise peaks correlates **r = +0.84** with independent churn measure; flow features ~0 — "quality lives in the Significance axis, dense only in a *reading*" (`docs/deep-reading-churn-2026-07.md`).
- The self-read weld: birth gate caught **0.0%** of five modelled drift modes (n=90); the weld built from existing organs catches cross-doc splice 95.8%, number drift 87.5%, off-fold splice 75%, at 0.0% false positives; two named blind spots on record (negation +1.1, entity-swap 0) (`docs/self-read-weld-measurement.md`, `src/weave/longgen/weld.js:68-112`).
- Judgment battery: confident-wrong rate + overturn rate as the headline metrics; **correct suspension scores as correct**; deterministic scorer 95% vs LLM judge 51% agreement with hand labels (`docs/judgment-eval-battery-2026-07.md`, `src/metabolism/defscore.js`).
- Reflection generation: net-negative unconditionally, sign flipped by restatement guards + surprise decomposition — "it is the combination (real reaction + reject-unless-genuine) that flips the sign" (`docs/deep-reading-gen-battery-2026-07.md`).
- The refused build: length-as-field-property falsifiers F1/F2/F3 came back negative/inconclusive, **so nothing was changed** (`docs/length-is-a-property-of-the-field.md`) — the discipline itself is the point.
- Code organ: 18/18 planted defects flagged across JS/Go/Rust with 0 false positives on clean twins, vs 1/18 for the standard toolchain; self-read of its own 460-file body in ~3s, zero error-grade findings (`docs/code-organ.md`).
- Monologue audit: verdicts helping/ruminating/echoing/idle/noise/unsafe; "across every run the firewall is INTACT — 0 facts added to any record" (`src/surfer/fold/audit.js`).
Plus the lexical v1/v2 studies with their honest mixed verdict (this page becomes the one place the ARI story is told straight).

### C4. **"The Two Doors: Witness and Firewall"** — **P1**
The provenance type law — the deepest recurring invariant and currently absent from the wiki. Perceiver door = exafference (world; can witness) vs enactor door = reafference (self; `canWitness === false` **by type, not flag** — `src/core/provenance.js`). "You cannot tickle yourself; the voice cannot corroborate itself through the user's mouth." The amendment to the Experience Engine's Given/Meant reading: inferences DO reach the graph, distinguishable, with measured `factsAdded: 0` ("impact without laundering"). Search as the door between them: the grounding gap *is* the query; a search converts reafference into exafference (`docs/web-search.md`).

### C5. **"Deep Reading: What the Machine Does at Rest"** — **P1**
Idle cognition made safe: the at-rest loop (surf to the place of most interest, fold, reflect — `src/surfer/fold/deep-reading.js`), habituation as the rumination cure, the median-band governor, reflection as an *enacted EVA* at band void, the nested loops (metacognition reads the reflections, never itself; cross-connections echo / bears-on / analogy via Weisfeiler–Lehman structure-mapping — `src/surfer/fold/weave.js`), and the monologue audit that grades the inner voice on the system's own claims. This is the EO answer to "what is thinking, mechanically?"

### C6. **"Going and Looking: Research That Tries to Be Wrong"** — **P1**
"A research tool that only ever makes you more confident is not researching — it is collecting." The disproof stance (~⅓ of searches seeded as falsification queries, always drained), the watchable stop rule (per-document gain, quiet countdown), reframe → `staleAfterRec` re-check of earlier answers, the curiosity walk leashed by Born-rule saliency ("a page is often surprising precisely because it has wandered off-topic"), and the corroboration walk whose honest terminal is "I couldn't find an independent source; treat it as single-source" (`src/rooms/research/driver.js`, `src/turn/research.js`, `src/turn/corroborate.js:76-165`).

### C7. **"Dwell, Never Fabricate: The Void as Law"** — **P2**
The desert cell's promotion from finding to constitution (see A8), the dwell/fabricate distinction ported across domains (code: `void-binding` vs `fabrication`; fitness: the Void-respect term rewarding only the held thread that *later binds* — "the investigator, not the clerk… un-gameable, because faking it requires actually predicting the future"), and typed absence with an address.

### C8. Operator pages for **DEF, EVA, SEG, CON, SYN** — **P1 (DEF, EVA), P2 (rest)**
The two most contested operators have no pages; the implementation finally gives them stable content. DEF: judgment-carrying-witness, cut decomposition, the judgment log (`src/core/def.js`, `cut.js`). EVA: strain, bands, the enacted loop, four-verdict fact-check (`src/core/enacted/loop.js`, `src/enactor/factcheck/`). CON: "the central operator — what makes a citation hold a claim to a source" (`src/core/operators.js`), the dialectical stance (accidental/essential/generative, no upgrade path). SEG: retraction-not-erasure, transcript redaction as SEG. SYN: union-find merges, mutual-nearest-neighbour equivalence, and its Ground-grain prohibition.

### C9. **"The Two Cursors: Narration Is Not Causation"** — **P2**
The discourse DAG vs the asserted DAG; the three-remove boundary ("the reader reads a passage as proposing that a source claims X causes Y"); the three NULs of causal absence; Pearl's distinguishing-evidence adjudication where "the silence is the finding" (`src/surfer/dag/`, `docs/dag-corpus.md`).

### C10. **"The Chorus: Nine Temperaments, One Basis"** — **P2**
The nine operators as a *generative basis* for cognitive temperaments — the cast is a basis, not a bag of archetypes; folk archetypes as convex mixtures; consensus across independently-forked surfers as a signal lift the noise null can't provide; the source commons; the diversity floor and the collusion falsifier ("high internal cooperation + low external validation = the wrong room wearing success's face") (`src/surfer/lineup/`, `docs/cooperative-graph-surfers.md`).

### C11. **"Evolution on the Cube"** — **P2**
Organ = contract claiming one cube cell; the desert as unexpressed phenotype; organogenesis (duplication / recombination / symbiotic fuse) under three gates; the four freeze bands ("the tell that a rule belongs in the constitution: a self-interested population would weaken it"); selection as editor, the commons as habitat; lift-not-level fitness with the two-frozen-model transfer falsifier (`src/metabolism/`, `docs/organ-level-evolution.md`, `docs/evolutionary-engine.md`).

### C12. **"The EO Compliance Specification"** — **P2**
`the-experience-engine` cites `wiki:eo-compliance-spec` as a required sibling; it has never existed. It can now be *derived from working artifacts*: the holon contract system (`src/core/contracts.js` + `eo-contract.js` per holon), the coherence guard, the Nine Rules as they are actually enforced, and the checkpoint taxonomy (`src/coder/checkpoint.js` — every defect with face, address, fix, and earliest detection point). Alternatively: de-reference it from the Experience Engine article. Writing it is better.

### C13. **"EOT: The Text of Experience"** — **P2**
The wire format exists and is load-bearing: EOT surface syntax with operator recovery, provenance-load-bearing ingestion, the `^locus` trailer (W3C Media Fragments riding events), the sense axis, `!EVA` checkpoints, honest `skipped` reporting (`src/organs/ingest/eot.js`, `docs/multimodal-eot-foundation.md`, `docs/eo-for-coders.md`). Supersedes/absorbs parts of `eo-notation`.

### C14. **"The Model Is the Leaf"** — **P2**
Prompt-as-Site (the prompt has terrains; Ground-row inflation measured at ×10.7 over the corpus gradient — "the accretion pathology"; the steer occupies the desert cell: "you cannot instruct Cultivating") and model-as-contracted-part (the defamation firewall; injection blast radius bounded by the output alphabet; "the model proposes, the kernel disposes") (`docs/prompt-as-site.md`, `docs/model-as-contracted-part.md`, `src/model/bands.js`, `src/model/prompt-checkpoint.js:126`).

### C15. **"The 101/201/301 Reading Guide"** — **P3**
One short page explaining the course-tag taxonomy readers currently have to infer.

---

## Part D — Mechanical hygiene (one sweep, single PR)

1. **`canonical-examples-the-resolution-face`** is byte-for-byte identical to the Site-face article (verified by diff) — the Resolution/Stance face has no real canonical-examples page. Write it or stub it honestly. **P0** (it's silently wrong).
2. Rename shrapnel: "The capacity ground and the capacity ground are the same object viewed from different angles" (`emergent-ontology-eo`); "Emergent" vs "Experiential" disagreeing across slugs/titles/bodies; cube-article title/keyword mismatches; `why-crud-is-shit` still says "Emergent Ontology." Fix after A9 declares canon. **P1**
3. "Paraxoc" → "Paradox" (title + `index.json`). **P1**
4. Broken/dangling references: `wiki:eo-compliance-spec` (→ C12), "Formal Proof," "Technical Handbook," "[Frame]", "Experience Engines" see-also (→ C1), `/experience-engines` vs `/experience-engine` link styles. **P1**
5. `eo-s-empirical-lexical-analysis-report` (archived ASCII dump) — delete or redirect to the document version. **P2**
6. `test-page` ("123456") — delete. `experiment/eo-cube` and `experiment/test` — populate or retire. `page/home.md` — populate or formally retire (currently an archived `*No content.*` stub behind the SPA front page). **P2**
7. Collapsed table headers (`| ComponentDomainQuestion |` pattern) in `the-experience-engine`, `the-three-faces-of-emergent-ontology`, others. **P2**
8. Status hygiene: 14 drafts include core pages (`sig`, `nul`, `scope`, `lexical-analysis`, `eo-in-15/60-min`) that published pages depend on; `notes-on-nul-refinement` is *published* while self-declared unintegrated. Reconcile as A5/A14/B4 land. **P2**

---

## Suggested sequencing

1. **Wave 1 (correctness):** A1, A2+A3, A4, A5, D1 — stop the wiki saying false or self-contradicting things.
2. **Wave 2 (the spine):** C1 → C2 → C3 → C4, plus A6 (Experience Engine update) — the implementation becomes citable, and every later edit can link into it.
3. **Wave 3 (grounding sweeps):** A7–A15, B1–B7, C5, C6, C8(DEF/EVA).
4. **Wave 4 (expansion + hygiene):** remaining C articles, Part D sweep.

A note on register: the reader's own docs model the right voice — every claim either carries a citation (module path, measured number, dated battery) or is marked as proposal. The wiki's weakest habit is asserting in the indicative what has never been tested; the strongest thing this sync can do is import 4.2's discipline along with its results — including the negatives (F1/F2/F3 refused, flow blind to quality, the weld's named blind spots). "Saving the appearances" applied to EO itself.
