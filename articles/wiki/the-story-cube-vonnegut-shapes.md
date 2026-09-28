# The Story Cube: Vonnegut's Eight Shapes, Made Taxonomically Complete

**Record ID:** wiki:the-story-cube-vonnegut-shapes  
**DB ID:** 98  
**Tags:** 301  
**Keywords:** fortune curve, story shapes, topological equivalence, trajectory taxonomy, cube algebra, vonnegut  
**Status:** published  
**Updated:** 2026-09-28T00:00:00.000Z  

---

*A story is a curve of fortune, not a heap of events — Vonnegut's own claim. The cube's claim is stronger and colder: there are exactly twenty-seven curves, and you can derive their names from a table that has nothing to do with fiction.*

[The EO capacity ground](/the-eo-phase-space-cube) ends its own article with a list of things it admits it cannot yet do. Two of them, quoted directly:

> "Do systems in different domains (biological, social, linguistic, computational) show characteristic trajectory signatures that are domain-specific, and can topological equivalence between trajectories be formally defined?" (`the-eo-phase-space-cube.md:277`)

> "The framework does not currently have a formal method for determining topological equivalence between trajectories, but it names the question: are there a small number of canonical trajectory shapes that recur across domains?" (`the-eo-phase-space-cube.md:197`, restated at `:209` as "an open empirical question")

`native/organs/vonnegut.js` and `native/organs/story-shapes.js` are eoreader7's actual attempt at exactly this, built for one domain only — the shape of an essay's argument — and they answer the question more precisely than either article knew to ask it. The short version: yes, there is a small closed set of canonical trajectory shapes, and it is derivable rather than authored. The honest version, which the rest of this article earns by tracing the arithmetic, is that the taxonomy is real and the classifier that would let you test two trajectories for equivalence is currently much narrower than the taxonomy it claims kinship with.

## The reader's fortune curve

Kurt Vonnegut's well-known lecture on the shapes of stories plotted a protagonist's fortune against time and named the recurring shapes: man-in-hole, boy-meets-girl, from-bad-to-worse, "which way is up." `vonnegut.js` reuses the geometry for a different quantity. For an essay, the y-axis is not luck — it is the reader's *conviction*, operationalized as a running count of distinct material claims the piece has stated so far:

```
native/organs/vonnegut.js:36    const carried = new Set(); // claim keys the piece has already stated
native/organs/vonnegut.js:51    if (!carried.has(key)) { carried.add(key); newConviction++; }
native/organs/vonnegut.js:60-66 allCarried.push(carried.size); curve.push({ ..., conviction: carried.size, ... });
```

`fortuneCurve()` walks the document's sections in order and, for each one, checks which of the caller-supplied `materialPropositions` first become textually supported (label and object both present, normalized) in that section. Every hit is added to `carried` — a `Set` that is only ever grown, never pruned — and each section's `conviction` is the Set's running size. This is mechanical and auditable in exactly the sense `nine-instructions.md` asks the whole EVA triad to be: no LLM judgment call decides whether a section "feels" convincing, a substring match against a name+object pair does.

`storyShape()` then classifies the resulting curve into `man-in-hole`, `rags-to-riches`, `flatline`, `from-bad-to-worse`, or `mixed`, using only four scalars read off the curve — `start`, `end`, `dip`, `peak` — plus the total count of new claims (`totalNew`). This is the piece a reader would recognize as "Vonnegut" from the Handle table: `README.md:369` credits it as "Fortune curves; the 27-operator arc, taxonomically complete," and the archon compendium entry's own gloss closes with the same line this article opens with: "A story is a curve of fortune, not a heap of events" (`native/organs/archon-compendium.js:784`).

## From eight shapes to twenty-seven cells

`story-shapes.js` generalizes the idea past the eight Vonnegut named. Its header states the move plainly: "EO's cube is richer: 3 domains × 3 modes = 9 operators, each × 3 grains = 27 cells, and EVERY cell names a distinct arc a piece can trace" (`native/organs/story-shapes.js:3-4`). The `STORY_SHAPES` table that results is built like this:

```js
// native/organs/story-shapes.js:18,26-38
import { cellOf, OPERATOR_CHAIN, DOMAINS, MODES, GRAINS } from "../kernel/cube.js";
export const STORY_SHAPES = OPERATOR_CHAIN.flatMap((op) => GRAINS.map((grain) => {
  const c = cellOf(op, grain);
  const shape = shapeOf(op, grain);
  return { cell: `${op}·${grain}`, op, grain, domain: c.domain, mode: c.mode,
           terrain: c.terrain, stance: c.stance, name: shape.name, arc: shape.arc };
}));
```

Two things are worth checking rather than taking on faith. First, `OPERATOR_CHAIN`, `DOMAINS`, `GRAINS`, and `cellOf` are imported from `native/kernel/cube.js`, not restated — the same file whose own comment at `cube.js:68-85` explains why: a prior hand-written `OPERATOR_ORDER` had drifted from the tables it was supposedly copying, and "the burden was on the divergence, and it was not met" (`cube.js:85`). `story-shapes.js` does not repeat that mistake; it derives its 27 rows from the kernel's own `cellOf(op, grain)` and its own iteration order (`DOMAINS.flatMap(d => MODES.map(...))`, `cube.js:87-91`), which happens to walk NUL → SIG → INS → SEG → CON → SYN → DEF → EVA → REC — exactly the helix order the-eo-phase-space-cube.md states at line 124. So the 27 named shapes are not just complete; they are listed in canonical dependency order, for free, because the enumeration walks the kernel's own chain rather than a second copy of it.

Second, this is the *real*, shipped Ground/Figure/Pattern cube, not the numeric Condition/Particular/Regularity overlay the-eo-phase-space-cube.md's own 2026-09-28 editorial note flags as a "speculative layer on top of the implemented Ground/Figure/Pattern trichotomy" with "no counterpart in the shipped kernel" (`the-eo-phase-space-cube.md:18`). `story-shapes.js` never touches that overlay. Its 27 cells are `cellOf`'s 27 cells, plain strings, the ones `cube.js`'s own `GRAINS` constant names. This article's answer to the open question is grounded in the implementation the wiki has already confirmed exists, not in the transcendental-coordinate layer the wiki has already flagged as unconfirmed.

Each of the 27 rows gets a hand-written name and one-line arc from `shapeOf()` (`story-shapes.js:48-82`) — "The Thesis" for DEF·Figure ("one answer declared, held to — Vonnegut's single-spine arc"), "The Recurrence" for SIG·Pattern, "The Revision" for REC·Pattern, and so on through all nine operators at all three grains. This part is not derived from anything mechanical — it is curated prose glued onto a derived skeleton, and it is honest about that split: the *cells* are computed, the *names* are authored.

## The curated bridge, and where it stops being consulted

`VONNEGUT_EIGHT` (`story-shapes.js:117-126`) is the reverse mapping: Vonnegut's original eight shapes, each pinned to one or two of the 27 cells. Man-in-Hole is `["DEF·Figure", "EVA·Figure"]` — the thesis dips, the test climbs out. Boy-Meets-Girl is `["CON·Figure", "REC·Figure"]` — bind, lose, retract, bind again. Cinderella is `["NUL·Ground", "SYN·Figure"]` — cleared off, then recognized. Which-Way-Is-Up is declared with `cells: []` — no spine at all, by the table's own doctrine: a piece that argues nothing traces no cell.

This table is a genuine bridge between the reader-facing eight and the cube's 27, and it is the right shape for the job the-eo-phase-space-cube.md's open question asks about: a small, named, closed set of trajectory-shape *types*, independent of subject matter, so that a legal brief and a lab notebook that both trace "bind, lose, retract, bind again" are — under this operational definition — topologically equivalent trajectories, exactly the concept the phase-space article names at line 195 but does not formalize.

But `classifyArc()` — the function that actually reads a real document's fortune curve and assigns it a cell (`story-shapes.js:141-169`) — never looks at `VONNEGUT_EIGHT`. (`VONNEGUT_EIGHT` is exported and mentioned once in a comment inside `classifyArc`, but no code anywhere in the module — or in eoreader7's one call site for either function, `proxy-runner.mjs:8822` — ever reads the constant itself.) It re-derives its own, smaller, independent mapping from the curve's raw movement:

```js
// native/organs/story-shapes.js:153-157
const visited = [];
if (rose && curve.length >= 2) { visited.push("DEF·Figure", "EVA·Figure"); }
if (peak > start + 1 && curve.length >= 3) visited.push("INS·Figure");
if (fell) visited.push("REC·Pattern");
if (!visited.length) visited.push("NUL·Ground");
```

So the module that is billed, in its own file header, as making all 27 cells reachable as a *classification target* actually offers a live classifier that can only ever nominate four: `DEF·Figure`, `INS·Figure`, `REC·Pattern`, or the `NUL·Ground` default. Boy-Meets-Girl, Cinderella, Creation, and Journey — four of Vonnegut's own eight — are declared in `VONNEGUT_EIGHT` but are structurally unreachable through `classifyArc`, because the fortune curve it reads carries no information about binding, recognition, or a crossed extent — only a cumulative count.

## What the classifier can actually tell you

That four-way reduction is itself generous. Trace the arithmetic in `vonnegut.js` and it collapses further, to two.

`fortuneCurve()`'s `carried` Set (`vonnegut.js:36`) is never cleared and never has anything removed from it — every section either adds to it or leaves it unchanged. That means the `conviction` sequence `storyShape()` receives is monotonically non-decreasing by construction: `curve[i+1].conviction >= curve[i].conviction` always holds, for any document, because a running Set's size cannot shrink. Two consequences follow mechanically from `storyShape()`'s own branch logic (`vonnegut.js:96-117`):

- `falling = end < start && !flatline` (`vonnegut.js:100`) can never be true, since `end >= start` always. **`from-bad-to-worse` is dead code** given how `fortuneCurve` actually computes conviction — reachable only if some caller hand-built a curve with a decreasing conviction sequence and fed it to `storyShape` directly, bypassing `fortuneCurve` entirely, which no call site in this codebase does (the one production call site, `proxy-runner.mjs:8822`, always chains `classifyArc(storyShape(...))`).
- `monotoneRise`'s own pairwise non-decreasing check (`vonnegut.js:98`) is *vacuously true* for the same reason, which collapses its condition to exactly `manInHole`'s condition (`end > start + 1 && totalNew >= 2`). Since `manInHole` is checked first in the `if`/`else if` chain (`vonnegut.js:103-108`), **`rags-to-riches` is also unreachable** whenever it would otherwise apply — `man-in-hole` wins the tie every time.

I confirmed this directly rather than leaving it as a claim about code I merely read. A five-line synthetic document engineered to be a textbook steady climb — one brand-new, non-restated claim per section, nothing recapitulated, no dip anywhere — was run against the real module:

```
curve conviction sequence: [ 1, 2, 3, 4, 5 ]
storyShape() result: shape: man-in-hole   (start 1, end 5, totalNew 5)
classifyArc() spine: DEF·Figure ("The Thesis")
```

Further probes — a document with a gain of exactly 1 (curve `[0, 1]`, `storyShape` reports `mixed`, not `man-in-hole`); a document whose claims never match the text at all; and a one-sentence document — confirmed the reduction is total: given real `fortuneCurve` output, `classifyArc`'s spine cell is a strict binary. It is `DEF·Figure` whenever the piece's closing conviction exceeds its opening conviction at all — even by exactly one claim, even when `storyShape()` itself reports `mixed` rather than `man-in-hole` — and `NUL·Ground` otherwise, full stop. (`INS·Figure` is pushed alongside `DEF·Figure` in the large-gain case but never displaces it as the reported spine, because a non-decreasing sequence's peak is always its own final value — `peak === end`, always — so the `INS·Figure` condition can never fire without the `DEF·Figure` condition already having fired first. The same monotonicity that kills `from-bad-to-worse` in `vonnegut.js` also means `fell` can never be true here, so `REC·Pattern` is equally unreachable in practice.) No test file in `native/tests` or `native/conformance` exercises this behavior directly — the only test referencing the Handle at all is a compendium coverage spot-check that `archonOf("vonnegut")` returns a record (`native/conformance/ethos-compendium.test.mjs:58-72`, "vonnegut" at line 67), which asserts the archon is *named*, not that its classifier behaves as its own comments describe. What is stated here as fact (the monotonic invariant, the branch collapse, the `DEF·Figure`/`NUL·Ground` binary) is traced from the source and then re-confirmed by direct execution against the shipped module, not asserted from the comments alone; what would need a larger corpus to confirm — how often real essays actually land on each side of that binary — is not claimed here.

There is one more place the declared taxonomy and the running classifier disagree on doctrine, not just coverage. `VONNEGUT_EIGHT` states outright that Which-Way-Is-Up has `cells: []` — "no spine cell... the essay that argues nothing" (`story-shapes.js:122`). `classifyArc`'s actual fallback, for that exact case, assigns a real cell anyway: `NUL·Ground`, "The Clearing" (`story-shapes.js:157`, confirmed empirically for both a true-flatline document and a too-short one-sentence document). The taxonomy's own doctrine says a spineless piece should get no cell; the classifier that implements it gives every piece a cell, including the ones it should, by the taxonomy's own account, leave unaddressed.

## Answering the cube's own question, honestly

So: are there canonical trajectory shapes, and is there a formal method for topological equivalence? `story-shapes.js` gives a real, structural yes to the first half — 27 named cells, derived rather than authored, walked in the kernel's own helix order, with an explicit reader-facing subset of eight — which is a substantive answer the-eo-phase-space-cube.md did not have on hand when it posed the question at lines 197, 209, and 277. Two documents that land on the same cell are, by this operational definition, tracing the same shape regardless of subject matter, which is exactly Vonnegut's own point (the curve is the story; the content is incidental) generalized past fiction.

The second half — a formal method for testing that equivalence — exists as code (`classifyArc`) but is currently far coarser than the taxonomy it sits beside. It can place a document's spine at only two of the 27 cells the table names, given how conviction is actually computed today; the other 25, including four of Vonnegut's own eight shapes, are declared but not reachable by any document `fortuneCurve` can score. That is not a reason to discard the approach — the taxonomy's derivation (import the kernel's own tables, never restate them) is exactly the discipline `nine-instructions.md` asks the rest of the framework to hold itself to, and getting a real, checkable two-way classifier for free from a Set's size is a smaller, sturdier claim than "27 shapes, measured" would have been. It is a reason to record, plainly, that the open question the-eo-phase-space-cube.md names is answered in principle and only partially in practice — which is the same asserted-versus-measured discipline `the-two-doors.md` applies to its own retired claims, applied here to a claim that is still live in the tree rather than retired from it.

## The Handle is color, not the doctrine

Vonnegut is an apt Handle for this pair of modules — the lecture on the shapes of stories is genuinely the right conceptual ancestor for a fortune curve, and the archon compendium's credit line ("stories are fortune curves: the shape of a life's fortunes over time," `archon-compendium.js:786`) is accurate. But the interesting claim here is not that a novelist's idea got borrowed for essays. It is that `story-shapes.js` demonstrates a specific, checkable discipline — deriving a complete taxonomy from a kernel's own enumeration order rather than typing it out by hand — and then, one function later, quietly fails to hold its own classifier to that same discipline, falling back to a hand-coded four-way (in practice two-way) switch instead of consulting the very table it sits beside. The Handle names the metaphor. The cube's own arithmetic, traced through `carried.size` and an `if`/`else if` chain, is where the actual finding lives.

---

## See Also

- [The EO capacity ground](/the-eo-phase-space-cube) — the article whose own stated open question about canonical trajectory shapes and topological equivalence this piece traces directly into shipped code
- [Holons](/holons) — the same 27-cell Ground/Figure/Pattern space this article's `STORY_SHAPES` table walks, described from the capacity-ground side
- [The Cube as a Universal Grammar](/the-cube-as-a-universal-grammar) — another consumer of `native/kernel/cube.js`'s cells as a derivation target rather than a restated table
- [Handles: Naming as Governance](/handles-naming-as-governance) — why Vonnegut is the right Handle for these two files, and why the Handle is never the argument
- [Nine Instructions: EO Is an Effect System, Not an Ontology](/nine-instructions) — the "derive, never restate" discipline this article shows `story-shapes.js` mostly, not fully, holding itself to
