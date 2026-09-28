# Bayes: Asking First — The Meaning-Potential Cascade

**Record ID:** wiki:bayes-meaning-potential-cascade  
**DB ID:** 104  
**Tags:** 301  
**Keywords:** prior-query.js, meaning potential, Halliday register, fallback vs default, calibrated inference, genre voice  
**Status:** published  
**Updated:** 2026-09-28T00:00:00.000Z  

---

*A prior may condition orientation, nominate perceptions, and focus interrogation. It cannot become witness merely by being prior. It also cannot become the essay — not without asking first.*

## The failure that named the organ

On 2026-09-17 a request to "write me a sonnet" came back as a cited paragraph of dolphin facts. The proximate cause was small and mechanical: `native/kernel/register.js`'s `VOICE_BY_FIELD` table — the closed set of write-voice instructions keyed by genre — had no `lyric` entry, so `writeVoiceFor()` fell through to `VOICE_BY_FIELD.exposition` (`register.js:216`, `VOICE_BY_FIELD[f] ?? VOICE_BY_FIELD.exposition`), and a small model followed those instructions literally: *"OPEN THE PIECE WITH A THESIS... ANSWER WITH THE MATERIAL'S OWN FACTS"* (`register.js:180–181`). The model did exactly what it was told. What it was told was an essay's instructions, handed to a sonnet.

The patch was one line — an entry keyed `lyric` was added to `VOICE_BY_FIELD` (`register.js:202–205`, commit `c787901` per `native/docs/THE-PRIORS-SURVEY.md:16`) — and it was necessary. But the house's own retrospective (`native/docs/THE-PRIORS-SURVEY.md`, standing: *nomination*, i.e. a reading of the codebase rather than a law) flagged the fix as the wrong **shape**, not the wrong content: *"we shouldn't have an organ for a specific modality like that, maybe a prior"* (`THE-PRIORS-SURVEY.md:18–19`, restating the flag verbatim). Hand-writing one more paragraph of instructions per genre, keyed by a closed field name, is the same move that produced the bug — it just produced a correct instance of it this time. The interesting finding wasn't that a template needed a new branch. It was that **the house already had a mechanism whose entire job was to check for a real prior before anyone hand-wrote anything**, and the sonnet request never reached it.

## What the cascade actually is

`native/kernel/prior-query.js` — Handle: **Bayes**, "after asking what is already believed before generating from nothing" (`prior-query.js:13–14`) — is that mechanism. `queryMeaningPotential(register, opts)` (`prior-query.js:69–107`) runs a fixed, ordered query over every prior family the house has for a genre, medium, or shape, before anything is generated from nothing:

1. **The genre sidecar** — `FortunePrior@1` (`native/kernel/fortune-prior.js`), the record's own accumulated staging per genre × medium × shape (`prior-query.js:75–88`).
2. **Genre-tagged `NeedPrior@1` files** — the genre's meaning-cells and works (`prior-query.js:90–94`).
3. **`ReadingPriors@1` / `FoldReadingPrior@1`** — axioms of how text is read at all (`prior-query.js:96–98`).
4. **The record's own seams** — always available, the generic staged pipeline derived from the material itself (`prior-query.js:100–101`).
5. **The web hunt** — genre material fetched and appended, never assumed, gated on the egress being open (`prior-query.js:103–104`).

Every stage that fires is named with its own provenance in the returned `evidence` array — `"FortunePrior@1 (sidecar)"`, `"NeedPrior@1 (need-prior-eng-narrative.json)"`, and so on — rather than folded into an opaque score. That is the load-bearing design decision: the cascade is legible about *which* prior spoke, so a caller (or an auditor) can tell the difference between "the genre sidecar has sixteen readings of this" and "nothing fired but the web hunt is open." The file's own header states the discipline as an invariant, not a suggestion: *"the query is OPEN — a new prior family is registered, never a new branch"* (`prior-query.js:10–11`).

The order is not decorative. Stage 1 is the record's *own* accumulated evidence of how this exact genre stages; stage 5 is the least-grounded fallback, gated on network access. A caller that wants the strongest available evidence for a genre gets it by walking the list in order and stopping where it finds real support — which is also, not coincidentally, the order of *how much this house has already learned* about the genre in question.

## Fallback, not default

The distinction the sonnet incident actually turned on is stated in `proxy-runner.mjs`, at the one live call site that wires the cascade into composition planning:

> `// THE MEANING POTENTIAL STAGES, NOT THE TEMPLATE (Halliday, 2026-09-14): when the register names a genre, the void consults the whole prior cascade (sidecar → genre priors → reading priors → the record's seams) BEFORE the essay template. The template is the fallback for an empty meaning potential, never the default for a registered genre.` (`proxy-runner.mjs:5680–5684`)

The call itself is guarded: `queryMeaningPotential` fires only `if (runMode === "projection" && prelimShape?.register?.field?.field && !isCode)` (`proxy-runner.mjs:5692`), i.e. only when the turn is actually producing a composed artifact and the register has already resolved a named field. `register.js`'s `VOICE_BY_FIELD` — the essay/exposition voice among them — is meant to be the layer underneath that cascade, consulted only once the cascade has nothing left to say for the genre. The sonnet request never triggered that ordering at all: it went straight to `writeVoiceFor()`, which has no memory of the cascade and no way to know a `lyric` prior existed one function call away in the very sidecar `queryMeaningPotential` already reads (`prior-query.js:25–26`, "though this exact cascade... sits one function call away"). The bug was not that the template was wrong. It was that the discipline that would have found the sidecar's `lyric` entry — or discovered that none existed and legitimately fallen through — was bypassed rather than exhausted.

Downstream of the cascade, the same non-override discipline holds by construction: when a *discovered* framing (see below) is available, it is spliced onto the declared `VOICE_BY_FIELD` instructions as an appended exemplar, never a replacement —

```js
const voice = discoveredVoice ? {
  opening: (t) => `${baseVoice.opening(t)}\n\nWrite in this voice — an exemplar to continue, never to repeat:\n"${String(discoveredVoice.opening ?? "").slice(0, 400)}"`,
  body: (t) => `${baseVoice.body(t)}\n\nWrite in this voice — an exemplar to continue, never to repeat:\n"${String(discoveredVoice.body ?? "").slice(0, 400)}"`,
} : baseVoice;
```
(`proxy-runner.mjs:6442–6449`)

`baseVoice.opening(t)` — the declared instruction — always runs first; a discovered exemplar is appended text, never a substitute clause. This matters directly for the audit below: it means a bad discovered exemplar degrades the prompt (an extra, possibly misleading quotation) without ever silently overriding the genre's own declared discipline.

## The audit's own negative finding

Here the article has to hold a claim the survey holds, rather than a cleaner one. `THE-PRIORS-SURVEY.md` checked the sidecar Bayes actually reads against the real corpus rather than asserting a count, and reports 16 accumulated `FortunePrior@1` entries: 9 tagged "narrative prose," 3 "narrative," 2 "historical," 1 "exposition," and exactly **1 "lyric"** (`THE-PRIORS-SURVEY.md`, the concrete-finding section). `need-priors/` held one file total, for narrative — no lyric `NeedPrior@1` existed. So even a disciplined cascade, run correctly, would have found in the sidecar exactly one lyric data point to work with.

The survey then checked what that one entry actually contained, rather than crediting its label. It carries a `.framing` field whose recipe reads *"discovered framing — the LLM's trajectory through meaning space, REC'd as footprints"* — meaning `native/kernel/discovery.js`'s live path had already run for this genre: no reusable framing existed at the time, so the LLM was tasked to propose one on the spot (`discoverFraming`, `discovery.js:24–29`) and the result was appended via `appendFraming` (`discovery.js:191`). Read directly, the discovered opening is:

> *"The rain falls on the cracked asphalt, each drop a tiny drumbeat against the silence."*

That is narrative prose — a noir scene-opening. No line breaks, no meter, no declared rhyme discipline. **The one "lyric" prior this house discovered that day was not actually lyric-shaped**, and the survey says so without softening it: `discoverFraming` accepts any well-formed JSON proposal from the model with no check that the content actually exhibits the genre it claims to (`discovery.js`'s own header: *"the framing must be JSON; a malformed proposal is refused, never half-adopted"* — malformed, not genre-inappropriate). Because `framingFor` reuses the *last* footprint for a genre rather than merging across several, a mis-shaped exemplar like this one would have stood ready to be handed to the next lyric request as "an exemplar to continue" — until a better entry overwrote it, or the gap that let it in was closed structurally. The survey's own record shows the cheap half of that already happened: the narrative-prose "lyric" entry was removed from the sidecar as a direct follow-up to the survey, and `framingFor(sidecar, {genre: "lyric"})` now honestly returns `null` again, verified live — so this specific exemplar is no longer sitting in the sidecar waiting to be served. What the survey is explicit remains open is the mechanism, not the instance: `discoverFraming`/`applyDiscovered` still accept any well-formed JSON with no check that a proposal's shape actually matches the genre it claims, so nothing structurally stops a future discovery run from writing the same mistake back in. And even while the bad entry stood, it survived inside the non-override discipline just described: `applyDiscovered` only ever appends an exemplar after the declared `lyric` voice's own instructions run first (`register.js:202–205`), so the damage it could have done was bounded to "misleading extra text," never "silently replaces the poem's discipline with prose." The fix, the flaw, and the fix's own limit sit in the same file, and the survey names all three.

## What Bayes is not

The Handle's own header comment draws the line before anyone else can draw it against the module: *"NOT a claim of calibrated probability: this module never computes a posterior or a likelihood ratio"* (`prior-query.js:14–15`), citing the sibling organ that already refused to invent one. `native/organs/corroboration.js` (Handle: Bukhari) states the house-wide discipline directly: it runs "SPRT's shape — two boundaries, walk until crossed — without SPRT's calibrated likelihood ratios, because the witness's true `p(yes|true)`/`p(yes|false)` have not been measured and inventing them would be worse than unit steps" (`corroboration.js:152–155`). Bayes's name personifies *asking first*, not *computing a posterior*. The one "lyric" data point above is exactly the case this discipline is written to survive: a single accumulated example is not a distribution, and the survey is explicit that treating it as one would be "exactly the invented-ratio failure" the house's own numbered doctrine forbids (`THE-PRIORS-SURVEY.md`, citing "II.10 — an invented ratio is a change of units that fails invisibly").

This is also, structurally, the same boundary `README.md` states for priors generally, one door over from Bayes: *"Priors may condition orientation, nominate perceptions, and focus interrogation. They cannot become witness merely by being prior."* A genre prior earns the right to shape a *voice*; it never earns the right to become the *record* of what happened, and Bayes's cascade — an ordered *query*, never a silent substitution — is built to keep those two things from being confused with each other, the same discipline the witness door enforces one layer down at the level of evidence rather than genre. (See [The Two Doors](/the-two-doors).)

## A disclosed, unwired extension

`prior-query.js` also ships `queryMeaningPotentialWithResonance` (`prior-query.js:144–160`), a sixth, genuinely orthogonal contributor: which `live_priors` content categories resonate with a void's declared *topic* — what it's about — by embedding similarity, as opposed to stages 1–3's substring match on genre alone (how a genre stages). Its own header is explicit about why it is a new function rather than a change to `queryMeaningPotential` itself: that function is called *synchronously* by its one known production site, and `queryMeaningPotentialWithResonance` is `async` (`prior-query.js:118–124`). Wiring it into `proxy-runner.mjs`'s composition planning would require making that call site await-aware — named in the source as "a disclosed, real, deliberately unattempted next step — not silently implied done" (`prior-query.js:123–124`). Omitting the `topic` argument degrades it to exactly `queryMeaningPotential`'s own output, pinned by `prior-query.test.mjs`; an unreachable embedding service degrades the same way, caught silently, matching the posture every other stage in the cascade already holds toward a missing corpus.

## The shape of the doctrine

Bayes is not interesting because a Handle personifies Thomas Bayes over an organ that does not compute Bayesian anything — that naming choice is color, and the module's own comment heads off the mistake before a reader can make it. What is actually doctrinal here is narrower and more useful: a five-stage, explicitly ordered, individually-named query that must be exhausted before a hand-written template is allowed to speak, wired at exactly one guarded call site (`proxy-runner.mjs:5692`), with a written invariant distinguishing *fallback* from *default* (`proxy-runner.mjs:5683–5684`), a non-override composition rule that keeps a discovered exemplar from replacing a declared voice even when the exemplar is wrong (`proxy-runner.mjs:6442–6449`), and a self-audit that found its own best example of the prior it queries to be mis-shaped and said so in writing rather than quietly discarding the finding. The discipline the sonnet incident violated wasn't "have a lyric template." It was "ask before you write" — and the article's own subject is the one place in the house where that asking has a name, an order, and a paper trail of at least one place it still fails.

## See Also

- [The Two Doors: Witness and Firewall](/the-two-doors) — the sibling doctrine that a prior may nominate and orient but never become witness by itself
- [Handles: Naming as Governance](/handles-naming-as-governance) — what a `// Handle:` line is actually doing, and why Bayes's is a disclaimer as much as a name
- [The Story Cube: Vonnegut Shapes](/the-story-cube-vonnegut-shapes) — `FortunePrior@1`'s own conviction-curve classifier, the sidecar Bayes queries first
- [The Guardrail Organs: Witnesses, Not Verdicts](/the-guardrail-organs-witnesses-not-verdicts) — Bukhari's refusal to invent a likelihood ratio, the discipline Bayes's own header cites
- [The Three Mathematics](/the-three-mathematics) — II.10, the invented-ratio failure the priors survey explicitly declines to commit
