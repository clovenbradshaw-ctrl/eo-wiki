# The Evidence: What the EO Reader Has Measured

**Record ID:** wiki:the-evidence  
**DB ID:** 75  
**Tags:** 301  
**Keywords:** evidence, evaluation, falsifier, churn, weld, judgment, results, negatives  
**Status:** published  
**Updated:** 2026-07-14T00:00:00.000Z  

---

*This is the honest results page. EO's oldest stated standard is [saving the appearances](/ancient-astronomy-eo-saving-the-appearances) — contain every observation without remainder — so applying it to EO itself means reporting the measurements that failed alongside the ones that held. The [EO Reader](/the-eo-reader) is built with pre-registered falsifiers that are allowed to return negative, and do. What follows is drawn from the reader's dated evaluation records and the tests that pin them; each entry cites where it lives in `eoreader4.2`.*

---

## Where the framework's proof stops, the measurements begin

[Nine Instructions](/nine-instructions) makes the structural point: EO's relational-algebra closure result certifies the Existence and Structure operators but is silent on the **Significance triad** — evaluate (EVA), restructure (REC), and the "free" operations of a query algebra, observe (NUL) and attend (SIG). Those are exactly the operators the results below instrument. Proof for the query-algebra neighborhood; falsifier-gated measurement for the significance neighborhood.

## Churn: quality lives in a reading, not in the text

Can the system tell developing prose from prose that just repeats itself?

- Flow features over Existence + Structure: correlation **≈ 0** with quality — the structural channel is *blind* to whether writing is good.
- The model reading its **own** Bayesian-surprise peaks and articulating significance, then measuring how much it repeats itself: **r = +0.84** with an independent churn measure; separation nearly clean (every pure-churn output has repeating reflections, every developing output at zero).

Conclusion the reader draws: *quality is dense only in a **reading** — churn is the reader saying the same thing twice.* Honest edge: the signal is bimodal, not graded, and was measured with a small (0.5B) model. (`docs/deep-reading-churn-2026-07.md`; `src/surfer/fold/audit.js`)

## The self-read weld: catching drift the birth gate can't

Before a generated paragraph becomes the prior for the next, it is re-read through the grounder (`src/weave/longgen/weld.js:68-112`). Measured against five modelled drift modes (n = 90):

- The naive birth gate caught **0.0 %** — "the gap is real and total."
- A weld built from existing organs caught cross-document splice **95.8 %**, number drift **87.5 %**, off-fold splice **75 %**, at **0.0 % false positives**.
- Two blind spots are on the record, not hidden: negation-flip (+1.1, invisible to every read-only organ) and entity-swap (0 as shipped).

(`docs/self-read-weld-measurement.md`)

## Judgment: confident-wrongness, not fluency

The judgment scoreboard "scores DEFs as DEFs": never fluency, never a verdict against a frozen gold answer. **Correct suspension counts as correct; confident guessing is the counted failure.** Headline metrics are the confident-wrong rate per grain and the overturn rate between a partial and a full read (`src/metabolism/defscore.js`; `tools/judgment-battery.mjs`; `docs/judgment-eval-battery-2026-07.md`).

The meta-finding that shapes the whole architecture: a **deterministic** scorer agreed with hand labels **19/20 (95 %)** while a local 7B **LLM judge** agreed **20/39 (51 %)** — and 17 of its 19 disagreements were *invented* failures. This is the empirical case for keeping the model a [leaf](/the-model-is-the-leaf) and the kernel the judge.

## Reflecting before writing: net-negative until it wasn't

Does letting the reader reflect before it writes actually help? First result: **net-negative unconditionally** — reflection made outputs worse on average. Then, with a surprise **decomposition** added to the reflect prompt plus a restatement guard, the sign **flipped**: the churning baseline was pulled from 0.349 toward 0.09, while a clean baseline came out **byte-identical** (the guards correctly rejected everything — a no-op on already-good prose). *It is the combination — a real reaction plus reject-unless-genuine — that flips the sign.* Caveat honestly stated: n = 2 churning topics. (`docs/deep-reading-gen-battery-2026-07.md`)

## The build that was refused

The strongest signal of the discipline: a proposed feature — treating answer length as a property of the field rather than the user's adverbs — was gated behind three pre-registered falsifiers. F2 came back **negative** (the richer predictor did worse than the simpler one), F1/F3 inconclusive, **so nothing was built**. The framework changed nothing because no empirical gate licensed a change. (`docs/length-is-a-property-of-the-field.md`)

## Code as an EO reading

Lowering a codebase to EOT and reading defects off the dependency order (`docs/code-organ.md`):

- Multi-language benchmark: **18/18** planted defects flagged across JavaScript, Go, and Rust with **0 false positives** on clean twins — versus **1/18** for the standard toolchain (`go vet` + `rustc` + `node --check`).
- Self-read: the whole `src/` tree (≈ 460 files, ≈ 156k EOT lines) folds in ≈ 3 s with **zero error-grade findings**; the first issue it ever found was in itself.

## The monologue firewall held

Across every deep-reading run, the audit that strips inferences and re-projects the graph reports the firewall **INTACT — 0 facts added to any record** (`src/surfer/fold/audit.js`). The inner voice can be graded helping / ruminating / echoing / idle / noise / unsafe, and an unsafe monologue — one that leaked into the witnessed record — scores 0 however eloquently it reads. It never has.

## The lexical studies, told straight

The empirical grounding that predates the reader, reported without the overstatement the wiki elsewhere carried (now corrected — see [Emergent Ontology](/emergent-ontology-eo)):

- **Empirically strong:** proportionality of the operator distribution, and face-level clustering.
- **Mixed:** axis independence — the v2 study measured an inter-axis Adjusted Rand Index of **≈ 0.185**, low but short of a clean independence result.
- **Not met:** the coordinate-geometry step-ratio predictions.

The corpus figures cited variously across the wiki are two different studies: a v1 verb inventory (~32,000 verbs, 41 languages) and a v2 clause study (19,764 clauses, 9,221 consensus). See [The Lexical Analysis](/lexical-analysis) and the v2 results report.

---

## How to read this page

Nothing here is "EO is proven." The honest summary is narrower and stronger: *a working system, built on EO's operator algebra, discriminates signal from noise on several concrete tasks at rates far above its tool floor and its own naive baselines — and it records where it does not.* That is a second evidence leg beside the lexical studies, measured rather than asserted, with the failures kept in view. It is the most EO-consistent thing the project has produced: a framework that [licenses its own defeat](/nine-instructions) and then goes looking for it.

---

### See also

- [Signal from Noise](/signal-from-noise) — the primitives these results ride on
- [The EO Reader](/the-eo-reader) — the system measured here
- [Nine Instructions](/nine-instructions) — why measurement is the right evidence for the Significance triad
- [The Lexical Analysis](/lexical-analysis) — the other evidence leg
