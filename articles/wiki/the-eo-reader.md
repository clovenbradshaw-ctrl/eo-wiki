# The EO Reader: EO Implemented

**Record ID:** wiki:the-eo-reader  
**DB ID:** 73  
**Tags:** 301  
**Keywords:** eo reader, implementation, holon, event log, effect system, provenance  
**Status:** published  
**Updated:** 2026-07-14T00:00:00.000Z  

---

*For most of its life EO was a framework with an anecdote for evidence. The **EO Reader** (`eoreader`, current line 4.2, "the holonic refactor") is the framework running as software: a document-reading and research instrument whose every faculty is an EO contract, and whose behavior can be cited module by module. This article is the map. The two companion articles — [Signal from Noise](/signal-from-noise) and [The Evidence](/the-evidence) — are the parts that matter most for grounding EO's claims about meaning.*

*Citations below are paths into the `eoreader4.2` source tree. They are references, not hyperlinks — the point is that each claim in this article resolves to code you can open.*

---

## The one fact

> The append-only event log is the source of truth. Everything you see is a recomputed **projection** of it. (`README.md`; `src/core/log.js`, `src/core/project.js`)

There is no wall-clock and no mutable store of record. Every event in the log is one of the nine operators, addressed as `operator(Site, Resolution)` at read time. Re-projecting the same log is byte-identical; a retraction is a `SEG` event, never an erasure; nothing derived is ever persisted — the graph, spans, and mentions are always rebuilt by replay (`src/persist/`). This is [The Integral Model](/the-integral-model) made concrete: state as the integral of a typed-transformation log.

## The body: faculties and holons

4.2 is "the holonic refactor" — the engine re-cut along faculty seams into a nested tree of [holons](/holons), each a directory with one entrance (`index.js`), its own `eo-contract.js` manifest, swappable, whole at its own scale (Koestler's watchmaker). The contracts are **mechanically enforced**: `src/core/contracts.js` merges every manifest and `tests/contracts.test.js` proves 100 % coverage, cube coherence, and "no desert cell" on every run. (This is the effect system diagnosed in [Nine Instructions](/nine-instructions): a manifest is a declared permission row, the merge is effect inference, the coverage test is the kernel refusing an undeclared operation.)

| Faculty | What it is |
|---|---|
| `core/` | The physics — operators, cube, faces, log, projection, the contract factory, and the two universal signal primitives (surprise, void-null) |
| `frame/` | The one interior spine — log / projection / active-path / bind — instantiated recursively on the generation axis |
| `organs/` | The modality membrane — ~17 sense organs (`in/`), renderers (`out/`), ingestion (`ingest/`), and code (`code/`), all lowering onto one log through the nine operators |
| `perceiver/` | Reading — text → event log → the three reading levels (parse / predict / credence / classify) |
| `surfer/` | Relating — navigation over what the reading maintains (retrieve / fold / flow / dag / reason / the nine-operator `lineup/` chorus) |
| `enactor/` | Gating — "nothing is asserted that the record can't witness" (ground / factcheck / veto / answer) |
| `model/` | **The leaf** — LLM backends, prompt, stream. Deliberately at the bottom of the tree. See [The Model Is the Leaf](/the-model-is-the-leaf) |
| `turn/` | The fold of ~19 auditable stages: route → converse → retrieve → fold → prompt → llm → bind → factcheck → veto → answer |
| `weave/` | Generation over a moving fold — longform, multi-prompt, the self-read weld |
| `rooms/` | The places the user stands — reader, workspace, research, doc, audit, archive, data |
| `metabolism/` | Evolution — no longer only tuning weights on a fixed body; it grows the body (organs as cube-cell contracts) |
| `murmur/` | The peripheral sense — drift/novelty/recognition geometry, a Born-rule steer, a tiny narrator, all behind a firewall where a murmur can never cite, ground, or reach the answer |

Two design principles recur in the code (`src/architecture` docs): **the low sets the possibility for the high** (core imports nothing; the parser's admission gate is a hard ceiling on what can ever be cited; the model can never invent a citation — the binder re-cites mechanically), and **the high sets the probabilities for the low** (the frame re-weights the projection; audit history shapes routing; the conversation fold carries stance forward).

## The deepest invariant: two doors

Every event enters through a **door**. Perceiver-door events are **exafference** — the witnessed world, `canWitness === true`. Enactor-door events are **reafference** — the system's own output, `canWitness === false` **by type, not by flag** (`src/core/provenance.js`). Reflections, murmur nominations, inferred connections, and code-organ findings all ride the enactor door at band `void`; only a human witness act can promote them. *You cannot tickle yourself; the voice cannot corroborate itself through the user's mouth.* This is the mechanism the wiki's [Experience Engine](/the-experience-engine) described as the Given/Meant boundary — with one amendment the implementation earned: inferences **do** reach the graph, distinguishable, with a measured `factsAdded: 0` audit. The firewall was never "keep interpretation off the graph"; it is "keep it distinguishable on the graph." Full treatment in [The Two Doors](/the-two-doors).

## What it actually does — behavioral commitments, shipped and tested

Each of these is a decision the reader makes differently from an ordinary chatbot, and each has a test pinning it:

- **Ask is record-only.** The "Ask the record" surface never reaches the web to answer; on an empty record it says so and offers nothing, even when the global mode is set to auto. The web pin is per-turn and never mutates the global. (`src/rooms/reader/app.js` `ask()`; `tests/ask-record-only.test.js`) The old confident-but-ungrounded mechanical answerers (who/confirm/smalltalk) were *retired from the live route* because they shipped claims past the veto layer.
- **The search box ingests, it does not answer.** A query opens a dedicated **search topic** first, makes it active, and files the fetched pages under it as ordinary sources — the opposite motion from Ask. An empty search topic is discarded, not stranded. (`src/rooms/reader/app.js` `searchTopic`)
- **The reader reads at rest.** When idle, it surfs the held document to the place of most interest, folds it, and reflects — habituating so it never ruminates, quiescing on its own. The whole lull collapses into one ticking "Reflected at rest — N notes so far" line so the activity log stays about actions. Reflections are firewalled (`canWitness:false`) and never touch the record. See [Deep Reading](/deep-reading). (`src/surfer/fold/deep-reading.js`; `src/rooms/reader/app.js` `deepTick`)
- **Audio is a Listen surface with a living transcript.** The transcript is a *pure fold* of an immutable heard baseline plus an append-only edit log; edits and redactions are non-destructive events (nothing is overwritten), and transcription runs only over windows the acoustic organ marked as signal above the noise floor. (`src/rooms/reader/transcript-edit.js`, `src/organs/in/acoustic.js`; `tests/transcript-edit.test.js`)
- **Murmur points; it never asserts.** A recognition that an earlier passage has recurred becomes a *reafferent candidate connection* on a read side-channel — never the log. Only a promotion gate, corroborating the two passages against the actual document text, writes a real `CON` edge; every other echo stays a firewalled margin note. (`src/murmur/link/`, `src/enactor/connect/promote.js`; `tests/murmur-connect-loop.test.js`)
- **Research tries to be wrong.** About a third of a study's searches are seeded as *disproof* queries ("go find the document that would exist only if this reading were wrong"), always drained; the stopping rule is watchable; a mid-study reframe flags earlier answers `staleAfterRec` for re-check. *A research tool that only ever makes you more confident is not researching — it is collecting.* See [Going and Looking](/going-and-looking). (`src/rooms/research/driver.js`)

## Why this matters for the framework

The wiki's persistent weakness has been asserting in the indicative what was never tested. The EO Reader supplies the missing evidence leg — and, crucially, it supplies it exactly where the framework's older proof could not reach. [Nine Instructions](/nine-instructions) shows that EO's relational-algebra closure result certifies only the Existence and Structure operators; the **Significance triad** (assert / evaluate / restructure) is where the reader's distinctive machinery lives, and it is grounded not by proof but by measurement. How that measurement works is [Signal from Noise](/signal-from-noise); what it has actually shown — including the negatives left honestly on the record — is [The Evidence](/the-evidence).

---

### See also

- [Nine Instructions](/nine-instructions) — why the reader is best understood as a compiler, not an ontology
- [Signal from Noise](/signal-from-noise) — the measurement doctrine, with module citations
- [The Evidence](/the-evidence) — what the reader has measured, negatives included
- [The Two Doors](/the-two-doors) · [Deep Reading](/deep-reading) · [Going and Looking](/going-and-looking)
- [The Integral Model](/the-integral-model) · [The Experience Engine](/the-experience-engine) — the specifications it implements
