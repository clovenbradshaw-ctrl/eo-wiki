# Identity Alternatives and the Corroboration Floor

**Record ID:** wiki:identity-alternatives-and-the-corroboration-floor  
**DB ID:** 101  
**Tags:** 301  
**Keywords:** identity, coreference, corroboration floor, canonicalization, witness, recanonicalization  
**Status:** published  
**Updated:** 2026-09-28T00:00:00.000Z  

---

*A hypothesis that two names are the same thing is not evidence. It is a place evidence can be dropped — and the floor decides which of those places gets to rewrite what was already read.*

## The question this is not answering

[Identity as a Change Log](/identity-as-a-change-log) asks what makes an entity *this* entity across time — the persistence question, answered there by log-primary identity: the entity is its append-only history, not a snapshot. This article asks a different, narrower question that the same word "identity" gets used for in coreference and entity resolution: given two *different names* encountered in the same read — "Rowan" and "the hooded courier," "the creature" and "Justine" — are they the *same* referent? That is not a persistence claim. It is a claim about reference, and `native/kernel/identity.js` (Handle: Ise — "the same shrine persists through total periodic rebuilding," `identity.js:10`) is where EOReader7 answers it, mechanically, on the record.

The two questions compose rather than compete: log identity says what an entity's history is once you know which occurrences belong to it; identity alternatives are how the reader decides which occurrences to fold together in the first place. Get the second wrong and the first is computing the wrong entity's log.

## What an identity alternative actually is

`identityAlternative()` (`identity.js:29-42`) constructs a frozen `EOIdentityAlternative@1` record: two normalized forms (`left`, `right`, sorted for a stable pairing so "Rowan"/"the hooded courier" and "the hooded courier"/"Rowan" collide on one id), a `standing`, and two evidence lists — `supportRefs` and `attackRefs` — each a set of witness references, not a count baked into the object. In the code today the `standing` field only ever comes out `live_hypothesis` (open, still accumulating evidence either way) or `distinct` (an attack has split it) — those are the only two values either call site in `deriveIdentityRevision` ever constructs. A third value, `refused`, is checked for defensively everywhere a caller reads `standing` (`identity.js:55`, `:239`, `:262`, and the text adapter's own guard), but nothing in the current kernel or its text adapter ever assigns it to an alternative — the guard is future-proofing, not a state the mechanism produces today. Nothing in this schema asserts sameness. It proposes it, on the record, with a name for every piece of evidence that bears on the proposal.

The two ways evidence arrives are typed apart deliberately, and the header comment says why (`identity.js:190-195`):

> *"Support never proves sameness: it opens/strengthens a live alternative via CON. Attack is constitutive contradiction: SEG separates the forms and DEF records refusal of the prior identity reading."*

`deriveIdentityRevision()` (`identity.js:196-281`) is the single door both directions pass through. A support (`identity.js:235-256`) either opens a fresh alternative or appends a new witness ref to an existing one's `supportRefs`, and emits a `CON` operation — connection, not assertion. An attack (`identity.js:258-278`) does something structurally different: it does not merely add to `attackRefs` and leave the standing alone. It emits `SEG` (segregating the two forms back into distinct referents) *and* `DEF` (formally excluding the prior reading, recorded as an `EOExclusion@1` targeting the old alternative's id). Sameness is provisional and additive; contradiction is constitutive and terminal for that reading. An attacked alternative does not go back to `live_hypothesis` if later evidence favors it again — a fresh alternative would have to be opened, because the old one has been refused, on the record, by name.

## From alternative to canonical edge — and back

An `EOIdentityAlternative@1` by itself changes nothing about the graph. What it feeds is `canonicalizeHyperedge()` (`identity.js:60-81`): for every participant in a raw `EOHyperedge@1`, it looks up which live alternatives mention that participant's value and unions in every name on the other side, producing an `alternatives` array per participant. "Rowan carried the token" and "the hooded courier crossed the square" become, once the identity between them is live, two edges whose shared participant carries `alternatives: ["rowan", "the hooded courier"]` — queryable as one entity without either raw edge being touched.

That untouched-ness is load-bearing and it is enforced, not just claimed. The raw `EOHyperedge@1` a sentence produced is never edited; `recanonicalizationOperations()` (`identity.js:157-187`) only ever emits a fresh `EOCanonicalHyperedge@1` as a new graph entry — `REC`, at grain `Figure` — recording `from` the old canonical projection `to` the new one as an explicit `consequence.relation_recanonicalized`. `identity-revision.test.js` pins this directly: after an attack splits an identity, "historical witness stays raw and unchanged. Only the current canonical projection changes; the earlier Fold still remembers the earlier reading." The mechanism this produces — every relation a value stands in gets re-derived, in fold order, whenever an identity touching that value changes standing — is expensive enough that the module carries its own performance note: an early version re-scanned the whole fold per touched edge per sentence, profiled at 13% of the read on 480 KB of *War and Peace* and growing 24× for 2× the sentences (`identity.js:83-94`); the shipped version rides an incrementally-maintained index (`edgeIndex`, `identity.js:96-133`) keyed by participant value, by fold position, and by current canonical, exactly so recanonicalization stays affordable at book scale.

## The floor: what gates projection, not what gates existence

This is the mechanism the pitch for this article is actually about, and it is small, recent, and load-bearing. `meetsFloor()` (`identity.js:152-153`) is two lines:

```js
const meetsFloor = (alternative, floor) =>
  !Number.isFinite(floor) || (alternative.supportRefs ?? []).length >= floor;
```

`recanonicalizationOperations()` filters which alternatives are allowed to participate in `canonicalizeHyperedge()`'s projection by this predicate (`identity.js:159`) — but the filtering is scoped to *projection only*. The alternative itself is never touched: it stays on the fold, live, attackable, and its `supportRefs` keep accumulating whether or not it currently clears the floor. A caller declares the floor through `deriveIdentityRevision`'s `canonicalizationFloor` parameter, which the function validates as "a positive integer — how much corroboration licenses canonical projection is never a fraction or a guess" (`identity.js:196-198`); passing nothing at all reproduces the pre-floor behavior byte-for-byte, which `identity-revision.test.js` pins as its own regression case ("no floor, no expectations — byte-identical to before").

The module's own comment states the rationale as a citation to a specific measured result, not as a design intuition (`identity.js:142-151`):

> *"Rationale, measured (native/eval/results/understanding-scoreboard-RESULTS.md, second amendment): every surviving FALSE identity belief on the Frankenstein coref golden stood on exactly one support — single-witness testimony rewriting the canonical past is the precise failure a corroboration floor exists for."*

That number is real and it is worth re-deriving rather than trusting secondhand. The negative control lives in `native/eval/anchoring-precision.mjs`, run against the committed golden `pg84-frankenstein.coref.json`. Its structure is a genuine negative control, not a hand-picked example: the golden's creature entry lists eight surfaces that all denote one being — "the creature," "the monster," "the wretch," "the fiend," "the dæmon," "the being," "the devil," "my creation" — and that being is unnamed throughout the novel (nested first-person narration never gives him a proper name). Any binding of a creature descriptor to a *named* character is therefore false by construction, no judgment call required. Measured on the full novel (`native/eval/results/anchoring-precision-frankenstein.json`):

| | count |
|---|---|
| creature-descriptor occurrences | 94 |
| falsely bound (raw evidence stream) | 15 (16.0%) |
| surviving false beliefs at end of read | 6 |
| self-corrected to `distinct` by the mechanism's own attacks | 7 of 13 |

And the six survivors, listed in full in the result file's `finalBelief.survivingFalse`, each carry `support: 1` — `elizabeth ↔ the wretch`, `elizabeth ↔ the creature`, `felix ↔ the devil`, `felix ↔ the fiend`, `henry ↔ the dæmon`, `ingolstadt ↔ my creation`. Every one of them, no exceptions, stands on exactly one uncorroborated witness. That is the finding the pitch names, and it checks out against the raw result JSON rather than only the prose summary.

Running the same golden with `canonicalizationFloor: 2` declared (the third amendment in `understanding-scoreboard-RESULTS.md`) does not remove any of those six false alternatives from the fold — they are still there, still `live_hypothesis`, still single-witness. What changes is `projectedFalseCanonicals: []` in the committed precision JSON: zero of the ninety-four occurrences reach a canonical edge under the floor. The false belief is quarantined from the graph the rest of the reader queries, without the evidence record being touched, deleted, or overridden — which is exactly the two-track behavior `meetsFloor` and the untouched-raw-edge invariant were built to produce together.

The floor of 2 is not invented for this measurement. It is `organs/asserted.js`'s `WITNESS_FLOOR` (`asserted.js:126`, `export const WITNESS_FLOOR = 2`) — the same threshold `standingOf()` already uses to type a note `corroborated` versus `single-witness` (`asserted.js:129`) — reused here with the giver named rather than re-derived, exactly the discipline [The Two Doors](/the-two-doors) documents for witness typing generally: a bare, untyped claim of sufficiency is refused; a typed, attributed threshold is reused, not re-guessed.

Corroboration is not free of an order effect, and the measurement discloses that plainly rather than papering over it. At floor 2, past-recanonicalizing REC operations drop from 55 (unfloored) to 11 on the ordered read, versus 2 and 1 on two shuffled controls — a raw separation of 2.6–4.6× tightening to 5.5–11× once the floor is applied, because earning a *second independent* witness for the *same* pairing is itself an order-dependent event: coherent narrative re-visits a descriptor-referent association, and shuffled text mostly does not. But a later, pre-registered amendment to the same evaluation found the opposite result for raw fulfillment counts: at book scale, fulfilled-expectation counts do *not* separate ordered from shuffled (59 vs. 68/59) — the order signal turned out to live specifically in the conjunction of corroboration *and* touching an edge already canonicalized, not in corroboration volume alone. The floor's win on precision (0-of-94 projected) and its miss on raw fulfillment-count separation are both reported in the same document; neither is quietly dropped.

## Expectations ride the same lifecycle, gated by the same floor

When a floor is declared, `deriveIdentityRevision` opens a second kind of record alongside the identity alternative itself: an `EOExpectation@1` (Handle: Bharata, `native/kernel/expectations.js:10`) predicting that corroboration will arrive. `expectFor()` (`identity.js:213-225`) opens one only for a *new* alternative that starts below the floor — "corroboration expected: X <-> Y," grounded in the alternative's own id, emitted as `INS` via `openExpectation`. From there the same evidence stream that feeds the identity mechanism transitions the expectation: a support below the floor strengthens it (`identity.js:250-253`), a support that reaches the floor fulfills it (checked at `identity.js:250` against `canonicalizationFloor ?? Infinity`), and an attack violates it (`identity.js:276`) — all `EVA` operations via `expectationTransition`, never `REC` unless a reframe is declared. `identity-revision.test.js` pins this end to end under the test named "open below floor, fulfilled at floor, violated on attack" — a result `native/eval/results/understanding-scoreboard-RESULTS.md`'s fourth amendment reports as pinned across "6/6 kernel tests." With no floor declared, zero expectations are opened ("no floor, no expectations — byte-identical to before"), matching the byte-identical guarantee elsewhere in the module. The floor is what turns "fulfilled" into a mechanical fact — a count crossing a declared integer — rather than a judgment call about when enough is enough.

## What is still unmeasured, said plainly

The precision evaluation covers only the golden's annotated creature class — 94 occurrences out of 1,758 total descriptor bindings the anchoring pass produced on the same novel; the remaining bindings ("my father," "the stranger," scene furniture) are reported as *uncovered volume*, explicitly never as clean. The floor also does nothing about the raw evidence stream's over-generation — 1,639 alternatives opened from 3,392 sentences, a number the same result document calls "a lot" and declines to tune against this golden, since tuning the floor against the very golden used to justify it would be circular. And the shuffle-null comparisons throughout rest on two shuffle draws, which the source document repeatedly says license a direction ("order matters") and not an effect size. The floor is a real, measured fix for one precisely named failure — single-witness testimony reaching the canonical graph — not a general precision mechanism, and the module's own comments do not claim more than that.

*An alternative is a door left open on purpose. The floor does not close the door. It decides which doors the rest of the house is allowed to walk through.*

## See Also

- [Identity as a Change Log](/identity-as-a-change-log) — the companion question: not whether two names are the same referent, but what makes one referent the same thing across time
- [The Two Doors](/the-two-doors) — the witness-typing discipline (`corroborated` vs. `single-witness`, `WITNESS_FLOOR`) this article's floor reuses rather than reinvents
- [Frege's Referent: Alias Equivalence Class](/freges-referent-alias-equivalence-class) — the referent/alias distinction that identity alternatives operationalize as evidence rather than assumption
- [The Guardrail Organs: Witnesses, Not Verdicts](/the-guardrail-organs-witnesses-not-verdicts) — the broader family of mechanisms that record evidence without adjudicating it
- [Stigmergic Fact Resolution](/stigmergic-fact-resolution) — how corroboration accumulates across a fold more generally
