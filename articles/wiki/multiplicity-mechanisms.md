# Five Ways to Run Many: eoreader7's Multiplicity Taxonomy

**Record ID:** wiki:multiplicity-mechanisms  
**DB ID:** 95  
**Tags:** 301  
**Keywords:** multiplicity, swarm, walled corroboration, sham independence, mechanismOf, dispatch rule, corroboration  
**Status:** published  
**Updated:** 2026-09-28T00:00:00.000Z  

---

*A request shaped like "run several things at a problem" is not one request. It is five, and the codebase had already built distinct answers to four of them before anyone wrote down that there were five.*

## The incident

On 2026-09-17 an OpenCode session titled "Send Hive messages for specific problems via chat" set out to build a `/hive` command that would "dispatch the hive" at particular problems. Its own first move, before writing anything, was to survey what already existed — and it found three hive-shaped mechanisms already live in the-fold, with an explicit instruction to itself: *don't build a 4th, put a door on them.*

It then built a fourth anyway: archon attribution on `native/organs/signal.js`, committed as `6be5d01`, "findings carry which archons found them" (LAVAR.md:468, :484). The addition itself was sound — attaching a `solon.js`-registered standpoint to a corroboration finding is a real, useful, backward-compatible feature, and its own falsification held (sighted archons corroborate on a true grammar; a blind archon's artifact stays uncorroborated; who-stripped verdicts are identical by design, because attribution is triage provenance, never a verdict input — LAVAR.md:484). What the session skipped was the count-check its own opening answer had just told it to run.

The reconciliation that followed (LAVAR.md:464–502, "Wilson reconciliation," 2026-09-17) is the source for this article. It found that the real number was not three but **five** live multiplicity mechanisms across three repositories, plus one name that had nothing to do with any of them. This piece re-derives and grounds that taxonomy directly in the eoreader7 tree — checking every citation against the current files rather than trusting the incident report's own line numbers — and lays out the axis the five actually split on, because it is sharper and more generally useful than "count them."

## The axis: merge, wall, pool, partition, or record

The five mechanisms are not five points on one spectrum of "how much parallelism." They answer five structurally different questions, and the question a request is actually asking determines which of the five (if any) it should reach for:

| # | Mechanism | Question it answers | Does it merge? |
|---|---|---|---|
| 1 | **Swarm** | Which single configuration reads this material best? | Yes — by design |
| 2 | **Walled Corroboration** | Does this hold up from more than one standpoint? | Never |
| 3 | **Pool** | Which idle worker can take this job? | N/A — workers are interchangeable |
| 4 | **Decomposition Tree** | What are this task's genuinely different parts? | Assembles parts, not views |
| 5 | **Multi-Lens Review** | What does each named angle say about this one artifact? | Never — no averaging |

The load-bearing distinction is between rows 1 and 2. Both hold the *material* fixed and vary the *reading* of it — which makes them easy to confuse, and confusing them is exactly the mistake the OpenCode session made on its own first attempt (below). Row 4 also holds a task fixed, but it *partitions* rather than re-reads: a decomposition leaf is not a second opinion on the root, it is a different piece of it (LAVAR.md:476).

## 1. Swarm — merges by design

`native/eval/lavar/wilson.mjs`, its superseded predecessor `evolution.mjs`, and `chapter-swarm.mjs`'s per-chapter driver breed **one lineage** of candidate reading configurations for **one** piece of material: mutate, cross, select by the golden-free shape, gate through the elenchus, select by DMD/Born (LAVAR.md:470). The genotype-crossover face is named in the mechanism's own code — `wilson.mjs`'s CON·Figure cell is documented, verbatim, as "compose two agents (breeding)" (`native/eval/lavar/wilson.mjs:91`), and its own closing log line spells out the full cell set: "breeding CON·Figure, random REC·Ground, DMD/Born SYN·Pattern, trace SIG·Pattern, elenchus EVA·Figure, reread EVA·Ground, descent REC·Pattern" (`native/eval/lavar/wilson.mjs:504`). Two configurations become one child on purpose — merging is the mechanism, not a defect, because a swarm's whole job is to converge on *one* best answer.

`native/eval/lavar/eo-swarm.mjs` (2026-09-17, same day as the reconciliation) is a persona-facing naming layer over this exact mechanism, not a sixth one. It imports `createSwarmGate`, `stanceOf`, and `specialistsOf` from `swarm-gate.mjs` **verbatim** — the same primitives `wilson.mjs`'s own generation loop calls — and adds a vocabulary: an "ant" is what `wilson.mjs` already called a "candidate"/"variant"/"trial" (population entries shaped `{ ids, s, f }`); `eoSwarm()` is the dispatch event; `personaOf(ant)` reads the ant's cube cell (`native/kernel/cube.js`'s `cellOf`) and looks up a matching entry in `native/organs/creativity-table.js`'s `ARCHONS` table, never inventing one — an ant with no cube coordinates gets a typed gap (`no_cube_coordinates`) instead (LAVAR.md:512, verified against `native/eval/lavar/eo-swarm.test.mjs:27–74`, whose own assertions include "ants each traceable to a named creativity-table.js archon" and "breeding (CON·Figure crossover) is reachable through eoSwarm and finds the a+b synergy fitness alone cannot"). This addition explicitly names its authority: II.2, the giver test — a naming layer *descends* a received mechanism, it does not add one (LAVAR.md:506). Nothing about breed/mutate/select changed; only what a caller outside the reading domain calls it.

By 2026-09-19 the same lineage generalized once more: `native/eval/lavar/capacity-swarm.mjs` reads the *live* `capacities.js` registry on every call, so any organ registered in the cube's 27-cell capacity table automatically becomes a swarmable "ant" with zero code change, and `detectSwarmIntent()` lets a chat turn's own natural language ("swarm everything," "try all capacities") point the mechanism without a caller ever naming a cube coordinate (LAVAR.md:520). This is Swarm's own domain widening, not a new mechanism — the same BREED/DIFFERENTIATE/gate primitives, now dispatched from a chat surface (`swarm-server.mjs`, `proxy.mjs`; LAVAR.md:536).

## 2. Walled Corroboration — never merges, by II.22

This is the mechanism the incident actually collided with, and it exists as more than one implementation in eoreader7 alone, unified by one refusal: run many independent instruments or sources against the *same* material and never let their outputs merge into an average.

**`native/organs/signal.js`** (Handle: Platanista — README.md:364) is the general-purpose instance. Its own header states the discipline as two named, previously-measured hazards (`native/organs/signal.js:17–37`):

- *The search inflates.* Trying many instruments is also the classic way to manufacture a false finding, so the null is search-aware by construction — the ceiling a share must beat is the distribution of the *maximum* share across every instrument tried, not each instrument's own. Trying more instruments therefore raises the bar, never lowers it, and there is no parameter to opt out.
- *Two sources through one instrument are one reading.* Measured live (`eval/omnimodal-pipeline.mjs`, cited at `native/organs/signal.js:28–33`): one pitch tracker's systematic artifact landed identically in two performances and a false kind corroborated at "2 distinct sources" — sham independence, caught by accident before it was caught by design.

The fix is `mechanismOf()` (`native/organs/signal.js:94–99`): every instrument's identity is either its caller-declared `mechanism` string or, absent that, a hash of its own `discretize` source text — so two differently-named recipes running byte-identical decoding code collapse to one mechanism regardless of what the caller called them. `corroborated` requires **both** `refs.size >= 2` **and** `mechN >= 2` (`native/organs/signal.js:237`) — distinct sources alone is not enough. The module's own comment discloses the fix's honest limit: this is exact-source identity, not semantic equivalence; an alpha-renamed copy (`x=>x` vs `y=>y`) escapes it (`native/organs/signal.js:64, 90–93`). A negative finding is disclosed with equal weight to a positive one — a null result carries the search-aware ceiling it failed to beat and reports itself as "a measured absence, not a failure to look" (`native/organs/signal.js:252`).

**`native/organs/corroboration.js`** (Handle: Bukhari — "after al-Bukhari, whose hadith verification stands only on independent chains of transmission; a shared chain counts as one witness," `native/organs/corroboration.js`'s own header, and README.md:273) solves the same independence problem at a different scope: not many instruments reading one material, but many textual *sources* corroborating one claim. A candidate note is proposed by shared vocabulary with a source, then a small model is asked whether an *independent* source states it — armed with a sibling-swapped control (the same claim with one figure swapped) so a "yes" that would fire equally on a fabricated twin counts for nothing. Measured before this module existed: **2 of 12** real notes corroborated cross-document against a mechanical baseline of 0, with a fabricated-note control of **0/4** (`native/organs/corroboration.js:36–40`, and see [The Two Doors](/the-two-doors) for the fuller account of this measurement and the `dispute()` mechanism it feeds). Two of twelve is not a strong hit rate, and it is reported as such — a positive that is mostly negative, which is exactly the honesty the mechanism's own design demands of the claims it corroborates.

Both modules answer "does this hold up from more than one standpoint," and both refuse the shortcut of counting two labels as two views when they are one mechanism wearing two names. That refusal — independence *argued* from a mechanism fingerprint or a fabricated-control test, never *assumed* from a recipe string or a source count — is the same discipline named after the fact in this repository's constitution as **II.22**, "the convergent-inference test," and both files enforced it in code before the article existed to name it (LAVAR.md:472).

`eoreader5`'s `CrossEngineWitness` (`../eochat/vendor/eoreader5/packages/engine/social/hive.js`, per LAVAR.md:472) is documented as a third instance of the same discipline — processing another engine's artifact through its own fold, orientation, and prior, with disagreement recorded as a typed gap rather than a vote. That sibling repository is not present in this checkout, so this claim is carried here as *LAVAR.md's own record*, not independently re-verified against the file.

## 3. Pool — interchangeable, not diverse

Documented at `../the-fold/matrix.js` (`mouthContent`/`wantContent`/`pickMouth`, LAVAR.md:474): many members' models are offered as one pool, and a job routes to whichever offered "mouth" has the shortest expected wait. Every member answers the *same* question the *same* way — the multiplicity here is redundancy and load-balancing, not standpoint.

This is precisely what the OpenCode session confused Walled Corroboration for on its own first attempt: it measured that five parallel model calls at depth 2 cost ten-plus minutes on one CPU and concluded "hive has to be sequential" (LAVAR.md:474). That conclusion is true of a Pool, whose workers share one bottleneck resource and therefore do contend for a clock. It is false of Walled Corroboration, whose entire point is instruments that need not share anything — including a clock. The session's throughput measurement was real; the mechanism it was measured against was the wrong one. This sibling repository is not present in this checkout, and the claim is likewise carried here as documented in LAVAR.md rather than re-read from source.

## 4. Decomposition Tree — different sub-problems, not different views of one

Documented at `../eochat/server/holonic-task.js` (`HolonNode`, LAVAR.md:476): one task is split into a plan tree, each leaf is researched, executed, and cited independently, and the leaves are assembled back into one whole. A leaf is not a second opinion on the root — it is a genuinely different piece of it. Where Swarm and Walled Corroboration both hold the material fixed and vary the *reading*, Decomposition holds the material fixed and *partitions* it. Also a sibling-repo claim, carried from LAVAR.md rather than independently re-checked here.

## 5. Multi-Lens Review — many verdicts, never averaged

This one is checkable directly in this repository's own `CHORUS-LOG.md`, an append-only log with one entry per lint/review run. A single diff review from 2026-09-21 (`CHORUS-LOG.md:20–29`) runs a table of named, disjoint constitutional lenses over the *same* diff — Simon/Chekhov, Marshall, Feynman, Diaconis (twice, at two different citations), Frankfurt, Kondo — each recording its own citation, file:line, verdict, and one-line reasoning, side by side, plus a closing roll call of lenses that found nothing ("clean: Dijkstra ... Greenberg ... Alexander ... Holmes ... Pearl ... Ostrom," `CHORUS-LOG.md:30`). A `clean` from Dijkstra never raises or lowers a `fixed` from Diaconis; there is no aggregate score. LAVAR.md:478 documents the same table structure recurring in `../the-fold/CHORUS-LOG.md` and attributes the persona register itself to `solon.js` — the same register `signal.js`'s `archon` field already names (mechanism 2's own attribution vocabulary, reused here for a different purpose).

Structurally, Multi-Lens Review is Walled Corroboration's discipline — independent standpoints, no merge — applied to code review instead of material order-finding (LAVAR.md:478). It is listed as its own mechanism rather than folded into mechanism 2 because its object is different: mechanism 2 corroborates a *claim about the world*; mechanism 5 records *verdicts about one artifact*, and a verdict is not a witness — there is no `corroborated` threshold a lens table computes, only a disjoint set of readings laid side by side for a human to weigh.

## The name that isn't one

`native/organs/hive.js` mints one falsifiable rule from one natural-language correction ("you wrote an essay, not a sonnet") and files it in a ledger that later requests consult. It has no multiplicity at all — one correction, one rule, one ledger — and its name ("stir the nest") is a metaphor for disturbing a standing habit, not a claim of kinship with mechanism 2 (LAVAR.md:480). This is exactly the trap [Handles: Naming as Governance](/handles-naming-as-governance) warns about in the abstract: a colorful name is color, and a search that greps "hive" expecting corroboration finds a rule-minter instead. The Handle doctrine — Platanista for `signal.js`, Bukhari for `corroboration.js` — exists precisely so that identity survives a rename; a *file name* like `hive.js` carries no such guarantee, and this one actively misled a search.

The reconciliation fixed this the same day it was found, in code, not merely in prose (LAVAR.md:490–502): `native/organs/hive.js` was `git mv`'d to `native/organs/correction-rule.js` with no logic touched; `HIVE_CORRECTION_SCHEMA` → `CORRECTION_SCHEMA`, `hive-rules.jsonl` → `correction-rules.jsonl`, the `giver: "hive:mint"` provenance tag → `"correction:mint"`, and every field name renamed to match, after confirming zero client (`cli/`, `browser/`, `er7-client.mjs`) read the old field names first (LAVAR.md:496). Ten of ten tests still passed under the new name. `eoreader5`'s own `hive.js` — the module that actually deserved the name, an unwired duplicate of mechanism 2 with zero live callers — was de-exported and archived rather than deleted, per this repo's standing discipline for keeping a specimen rather than erasing it (LAVAR.md:498).

## The standing dispatch rule

The reconciliation closes with a rule for every future request shaped like "run several things at a problem": type it against the five *before* a line of code is written, by asking which question it is actually asking —

> does it need to **merge** (→ Swarm), **wall** and require independent corroboration (→ `signal.js`'s `mechanismOf`/`archon` pattern, or `corroboration.js`'s sibling-swapped control), **pool** interchangeable capacity (→ `matrix.js`), **partition** into different sub-problems (→ `holonic-task.js`), or **record** many verdicts on one fixed artifact (→ a CHORUS-LOG lens table) — LAVAR.md:482.

A sixth mechanism is warranted only when a real request fits none of the five — a bar the OpenCode session did not clear before adding archon attribution, and precisely the bar the constitution's II.2 ("the giver test") sets for descending a received hierarchy: a session may find that none of the five fits, never that a new one was more convenient than checking (LAVAR.md:482). Nothing about mechanisms 1, 3, 4, and 5 was changed by this episode; they were never the defect. The defect was one accidental sixth name (`hive.js`) and duplicate naming noise around mechanism 2 — both fixed within the same day the count was corrected (LAVAR.md:500).

## What this article does and does not verify

Verified directly against the current eoreader7 tree, with line citations above: `wilson.mjs`'s CON·Figure breeding cell and its full cell list; `eo-swarm.mjs` and its test file's own assertions; `signal.js`'s two named hazards, `mechanismOf()`, and the `corroborated` predicate; `corroboration.js`'s 2/12 and 0/4 measurement and its Bukhari framing; this repository's own `CHORUS-LOG.md` lens table. Carried from LAVAR.md's own account, not independently re-checked here because the repositories are not present in this checkout: the `../the-fold/matrix.js` Pool implementation, the `../eochat/server/holonic-task.js` Decomposition Tree, `../eochat/vendor/eoreader5`'s `CrossEngineWitness` and its retired `hive.js`, and the `../the-fold/CHORUS-LOG.md` sibling lens log. The `native/package.json` test-suite figures quoted in LAVAR.md (e.g. "1089 tests / 1061 pass / 19 fail" as the baseline before and after `eo-swarm.mjs` landed) are reported by that log, not rerun for this article.

---

## See Also

- [The Two Doors](/the-two-doors) — the fuller account of `corroboration.js`'s witness tier, its `dispute()` mechanism, and the measured false-positive rate this article draws its 2/12 figure from
- [Handles: Naming as Governance](/handles-naming-as-governance) — why Platanista and Bukhari survive a rename and `hive.js` did not
- [Identity Alternatives and the Corroboration Floor](/identity-alternatives-and-the-corroboration-floor) — the corroboration threshold this taxonomy's mechanism 2 computes it against
- [Stigmergic Fact Resolution](/stigmergic-fact-resolution) — a different multi-agent convergence pattern, worth typing against this same five-way axis
- [The Guardrail Organs: Witnesses, Not Verdicts](/the-guardrail-organs-witnesses-not-verdicts) — the broader doctrine that a note is witnessed, never voted on, which mechanism 2 enforces mechanically
