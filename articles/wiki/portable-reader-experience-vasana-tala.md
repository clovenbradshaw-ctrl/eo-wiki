# Portable Reader Experience: Vasana, Tala, and What a Reader Carries Between Books

**Record ID:** wiki:portable-reader-experience-vasana-tala  
**DB ID:** 100  
**Tags:** 301  
**Keywords:** vasana, tala, rhythm prior, experience prior, cross-work transfer, narrative rhythm  
**Status:** published  
**Updated:** 2026-09-28T00:00:00.000Z  

---

*A prior trained on nothing but Pride and Prejudice has never opened Frankenstein — and it predicts Frankenstein's own mention rhythm at 91.6% of Frankenstein's own self-knowledge. That number is measured, checked into the repository, and reproducible from a script that takes three Gutenberg texts as arguments.*

---

## Two halves of one wheel

"We never read Frankenstein as our first book." That line, from the header of `native/eval/narrative-rhythm-prior.mjs:2-3`, is the whole argument in one sentence. A reader who has read before carries something into the next book that a reader on their first book does not. The EO Reader sediments exactly two such things, in two kernel modules that deliberately mirror each other's shape:

- **`native/kernel/experience-priors.js`** (Handle: Vasana) — *which* structural forms recur: relation vocabulary, network topology signatures, terrain/stance/operator expectations.
- **`native/kernel/rhythm-priors.js`** (Handle: Tala) — *when* an admitted being, once mentioned, is expected to be mentioned again.

The module headers name the doctrine directly. `experience-priors.js:11-13` situates itself inside "THE WHEEL" (`native/docs/THE-WHEEL.md`): "these are the VOID's — the earned and received, the character the hub carries into the next read; Vasana is the wheel's own figure, the re-formed prior that primes the next ground." `rhythm-priors.js:24-25` names its own half of the same wheel: "rhythm is the FOLD's pacing — the rim's WHEN, the interval at which a being is re-admitted to the fold." Vasana names *which*; Tala names *when*. Neither knows the other exists at the code level — `rhythm-priors.js:27-33` states plainly that the module is "deliberately written to experience-priors.js's OWN conventions, so the two halves compose rather than compete," with zero imports between them — but they compose through a third, small function that does nothing but hold both without touching either: `composeExperience()` (`rhythm-priors.js:229-254`).

This is not the only place in eoreader7 that carries the "Vasana"/"Tala" naming pair. `native/docs/THE-PRIORS-SURVEY.md:29-36` catalogs six distinct mechanisms the codebase calls a "prior," and flags that only three of the six — Vasana, Tala, and `prior-query.js`'s Bayes — carry a personified Handle and a README entry at all; the other three (closed-class linguistic register, the `live_priors` corpus toggle, and the correction-rule ledger) are real, working, undocumented-as-a-family code. The survey's own honesty is worth repeating here rather than smoothing over: "who is the archon in charge of priors" had no answer, "the concept was real in five separate places and named as a whole in none of them" (`THE-PRIORS-SURVEY.md:45-47`). Vasana and Tala are the two members of that family that are both named *and* the ones this article is about.

## Vasana: which structures recur

`deriveExperiencePrior()` (`experience-priors.js:74-199`) takes a set of already-completed readings and produces exactly four kinds of memory:

1. **Relation vocabulary** — every hyperedge relation the reading regarded as lexically eligible (`edge.meta?.compositionStanding?.eligible === false` is explicitly excluded, line 100 — noise does not become familiarity merely by appearing often), counted by occurrence and by *work support* (how many separate books it recurred in).
2. **Network patterns** — a structural signature (`networkSignature()`, lines 36-45: topology, cycle rank, branching referent count, edge count, referent count) rather than any specific referent, so the memory is "this shape of relational network recurs," not "this character recurs."
3. **Terrain expectations** — which of the nine terrains (Void through Paradigm) the reader's *effective* terrain state populated, deliberately read from `effectiveTerrainState ?? terrainState` (line 108) rather than the raw graph index alone, "or prior experience would systematically forget exactly the higher-order forms it had earned."
4. **Stance and operator expectations** — occurrence counts over the nine stances and nine operators, tallied from `reading.fold?.transformationObjects`.

Every one of these four carries the same standing field: `memoryStanding(workSupport)` returns `"recurrent_cross_work_memory"` at two or more works and `"single_work_memory"` otherwise (line 23). The module's own comment is explicit about what that threshold is for and is not for: "A single earlier work is enough to leave a memory. Cross-work recurrence strengthens that memory; it does not decide whether the memory exists" (lines 68-69). `minRelationWorkSupport` and `minNetworkWorkSupport` default to 1 for exactly this reason — they are export/pruning knobs, not evidence floors.

The sharpest single artifact of Vasana is `evaluateNetworkAgainstExperience()` (lines 352-382), which takes a network the reader has just earned in the *current* reading and checks it against the carried prior, returning one of three typed standings: `prior_supported_recurrent_form` (matched, and matched more than once before), `prior_supported_single_exposure` (matched, but only once before), or `prior_strained_by_novel_form` (no match at all — the current structure is new to this reader). That third value is a disclosed negative case built into the vocabulary itself: novelty is not hidden, it is named.

## Tala: when a being returns

`rhythm-priors.js` measures a narrower thing extremely precisely: the gap, in mention count, between one admission of a referent and its next. `readingGaps()` (lines 70-85) pools every referent's inter-mention gaps from `reading.fold.graphEntries`, reading the mention's position off `entry.encounterRef` (content-addressed, current era) or falling back to the legacy `text:{pos}` witness string or `mention:{pos}:{slug}` id (lines 55-67 — three format generations are still read, none silently dropped).

The pooled gaps are not kept as a raw list. They are bucketed into a **histogram** — `gap -> {count, works}` — specifically so that merging priors from several books later is exact: "a histogram, not a raw gap list: merging must union evidence across works without either re-scanning readings or letting one long book's gap count dominate a short one's" (lines 93-96). `medianFromHistogram()` (lines 102-116) recovers the median directly from the bucketed counts, and that median — `medianGap` — is the whole prior's single load-bearing number. The docstring for `deriveRhythmPrior` states its epistemic status without hedging: "`medianGap` is a declared standard summary of the pooled gaps, never a tuned threshold: no value of it was ever chosen by checking what it did to a target's score" (lines 122-126), citing eoreader6.1's own rule against tuning a parameter against a golden score. The same "one work is enough" regime Vasana declares is registered a second time, independently, for Tala: `native/assemblies.js:150` sets `minWorkSupport: { value: 1, giver: "native/kernel/rhythm-priors.js", basis: "same one-work rule, for pooled gap buckets" }` inside the `ATMOSPHERE` assembly (`native/assemblies.js:139-157`) that both modules are registered under.

Scoring is mechanical in both directions. `scoreRhythmExpectations()` (lines 256-275) walks a target reading's own gaps and counts a gap as *fulfilled* when it is at or under the carried `medianGap`, *violated* otherwise — "Mechanical both ways — the target decides, never the prior" (line 260).

## The transfer measurement, read from the actual result file

The claim that gives this article its reason to exist is checked into `native/eval/results/narrative-rhythm-transfer.json`, produced by `native/eval/narrative-rhythm-prior.mjs`. The driver reads three real Project Gutenberg texts through the perceiver's own mention stream — Pride and Prejudice (`gutenberg:1342`), Hamlet (`gutenberg:1524`), and Frankenstein (`gutenberg:84`) — and pre-registers three predictions *before* any target run (lines 26-40 of the script), the same "misses reported as misses" discipline the wiki's other pages describe for EVA. The measured priors:

| Prior | medianGap | gapCount | Quartiles |
|---|---|---|---|
| Novel (Pride and Prejudice) | 12 | 4,893 | [4, 12, 43] |
| Play (Hamlet) | 7 | 903 | [4, 7, 29] |
| Self (Frankenstein — comparison only, never carried) | 15 | 557 | [5, 15, 57] |

Scored against Frankenstein's own ordered mention stream (`scores.ordered` in the result file):

- Novel prior: 261/557 fulfilled — **fulfilmentRate 0.46858** (46.9%).
- Play prior: 192/557 fulfilled — fulfilmentRate 0.34470 (34.5%).
- Self prior: 285/557 fulfilled — fulfilmentRate 0.51167 (51.2%).

0.46858 / 0.51167 = **0.9158** — a novel-prior learned purely from Pride and Prejudice scores Frankenstein's own mention stream at 91.6% of Frankenstein's own self-prior, which is where the pitch's rounded "92%" comes from; both numbers are honest, the file has the fourth digit. The play prior transfers far worse: 0.34470 / 0.51167 = 0.674, only 67.4% of self — and this is itself a pre-registered finding, not a failure to hide. Prediction (3) in the driver's own comment asked whether the play prior would carry "a different medianGap" than the novel prior, and it does (7 vs. 12): "the abstraction has a measurable boundary (novel-rhythm ≠ play-rhythm)." Rhythm transfers within the kind *novel*; it transfers more weakly across the novel/play boundary. Both outcomes were declared findings in advance, and the weaker one is reported here exactly as measured, not smoothed into the headline number.

Prediction (1) — ordered beats shuffled under any prior, because coherent narrative is bursty — also holds cleanly. The `shuffled#0` / `shuffled#1` runs (`scores.shuffled#0`, `scores.shuffled#1`) collapse the novel prior's fulfilment rate to 0.14802 and 0.14136 respectively. 0.46858 / 0.14136 ≈ 3.3×, matching the module's own comment ("~3.3x its order-destroyed null," `rhythm-priors.js:20-21`) almost exactly against the second shuffle draw, and a comparable ~3.2× against the first — a permutation that destroys narrative order destroys the rhythm expectation along with it, for every prior tested, not just the one that happens to transfer best.

Two disclosures belong beside the headline number rather than after it. First, the assembly this was measured on is named in the script itself: "this driver runs the PERCEIVER ONLY... The fold/revision/identity tier is NOT exercised; wiring the rhythm prior into kernel expectations on the fold is the named next step once the transfer question is answered here" (`narrative-rhythm-prior.mjs:42-46`). The 91.6% transfer is real and reproducible, but it was measured on the mention stream alone, not the full reading pipeline that a live `composeExperience`-conditioned read would run. Second, `native/eval/the-fold/unwired-organs.mjs:10` — a driver built specifically to surface capability that exists and is called by nothing — lists `experience-priors cross-work memory` under the heading "nobody, still," as of that driver's own writing. Both halves are demonstrated end-to-end by named eval drivers (`native/eval/experienced-new-book.mjs`, `native/eval/lavar/build-work-prior.mjs`, `native/eval/lavar/prime-with-field.mjs`) and exported from `native/kernel/index.js:18,20`; neither is shown wired into a production reading organ the way the next section's mechanism is.

## Sockeye: the same "return" phenomenon, held to one book

`native/kernel/return-curve.js` (Handle: Sockeye) measures a structurally adjacent but deliberately narrower thing than Tala. Where Tala pools the raw gap-since-last-mention across an arbitrary number of separate works into one portable histogram, `returnCurve()` (lines 48-95) works inside a single reading and keeps the *form* a return took — "form" being a caller-supplied label (pronoun, full name, a four-note musical fragment, an over-the-shoulder shot; the module is deliberately medium-blind, lines 16-23). Gaps are binned dyadically (`binFloorOf`, line 37: `1 << floor(log2(gap))`), and for each form the module reports its `majorityWindow` — the widest bin ceiling at which that form is the strict majority of returns (lines 81-86). Forms are *discovered* from the events, never declared in advance.

This module is wired into production, not only eval. `native/adapters/text/accessibility.js` reads a text's own pronoun/descriptor/name mention stream through `returnCurve()` (line 41) and produces `writerDecay()` — an activation window and a writer-reliance measure on undecaying identity at extreme gaps. The same "prior conditions, material decides" discipline Vasana and Tala both hold at the cross-work grain shows up here at a single-book grain, explicitly: `accessibility.js:11-14` states "a reading starts from a genre-level curve if one is supplied (a prior, giver named) and is superseded by the material's own curve once it holds more returns than the prior — the supersession is REPORTED, never silent." Sockeye is the smaller, single-axis cousin of the doctrine this article is otherwise about, and it is the one of the three return-shaped mechanisms actually called from a live NL organ rather than only from eval drivers.

## Priors that condition, and are never witness

Every object either module produces carries the same three fields, verbatim: `standing: "defeasible_experience_prior"`, `witnessed: false`, `admissible: false`. `composeExperience()`'s output — `EOReaderExperience@1` — carries them too. This is not incidental boilerplate; it is the same law [The Two Doors](/the-two-doors) states for intra-reading candidates, applied one level up, to memory that crosses a book boundary entirely: *"Priors may condition orientation, nominate perceptions, and focus interrogation. They cannot become witness merely by being prior."* Vasana's file header states the same rule in its own vocabulary: "a rhythm memory is never witness for the next reading: it opens an expectation, and the target's own mention stream decides it" (`rhythm-priors.js:35-37`).

`native/eval/experienced-new-book.mjs` makes this concrete rather than aspirational. It composes both halves into one carried memory, then builds a Hyperlexicon of relation-composition candidates from the new book's own graph; experience *nominates* every candidate whose relation form the reader has recurrently met before (`remembered = ... filter(r => r.recurrent)`, line 158), but only the single best-supported nomination whose both sides are cross-work memories is explicitly **given** an affordance with a named giver (lines 172-179). Every other nomination — however well witnessed inside the new book — is left as a candidate or withheld, with its reason attached: "experience nominated candidates; only the single explicitly GIVEN affordance licensed composition... every other adjacency, however well witnessed, is withheld with its reason attached" (line 242). A reader's accumulated memory gets to point, never to conclude on its own say-so.

## Why this is a real transfer result, not just an architecture claim

It would be easy to read Vasana and Tala as two more well-commented kernel modules that *could* transfer, by design, without ever checking whether they do. The narrative-rhythm-transfer measurement forecloses that reading for the WHEN half specifically: a prior with zero access to Frankenstein's text scores Frankenstein's own mention stream within single digits of what Frankenstein's own self-prior scores, on a metric (median-gap fulfilment) that a permutation of the same material destroys by a factor of three. That is cross-work transfer measured against its own order-destroyed control, not merely asserted from the shape of the code. The honest remainder — a perceiver-only harness, a weaker transfer from a different genre, and a memory mechanism eval drivers exercise more than production organs currently do — belongs in the same paragraph as the 92%, not in a footnote three pages later.

---

## See Also

- [The Two Doors](/the-two-doors) — the witness law ("priors condition, never testify") that Vasana and Tala both hold at the cross-book grain
- [Holons](/holons) — the Handle-and-seam discipline this article follows, and the same honesty about a measured coverage gap between doctrine and current wiring
- [Bayes: The Meaning-Potential Cascade](/bayes-meaning-potential-cascade) — the third named member of the same "prior" family, surveyed alongside Vasana and Tala in `THE-PRIORS-SURVEY.md`
- [The Guardrail Organs: Witnesses, Not Verdicts](/the-guardrail-organs-witnesses-not-verdicts) — the same nominate-not-conclude discipline applied to corroboration and dispute
- [The Experience Engine](/the-experience-engine) — the Given-Log/Meant-Graph vocabulary this article's mechanisms instantiate at the level of one reader's accumulated memory
