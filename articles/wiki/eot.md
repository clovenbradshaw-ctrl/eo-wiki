# EOT: The Text of Experience

**Record ID:** wiki:eot  
**DB ID:** 80  
**Tags:** 201  
**Keywords:** eot, notation, wire format, locus, sense, provenance, ingestion  
**Status:** published  
**Updated:** 2026-09-28T00:00:00.000Z  

---

*[EO Notation](/eo-notation) describes a syntax for writing operators. **EOT** — EO Text — is that syntax as a working wire format inside the [EO Reader](/the-eo-reader): the single surface every one of ~17 sense organs lowers onto, and the thing the [code organ](/the-eo-reader) reads a program into. This is where "the operator is carried by the surface syntax" ([Nine Instructions](/nine-instructions)) stops being an aspiration and becomes a parser.*

---

## The draft-to-rich pipeline

**(2026-09-28 revision.)** An EOT record is built in three schema-versioned, pure stages — no model call required for any of them:

- **EOTDraft@1** (`native/the-fold/eot-draft.js`) recursively segments a piece into witnessed spans along its own holarchy — whole, parts, points — before any sentence-level parse runs. Every node carries the exact bytes it came from.
- **EOTRich@1** (`native/kernel/eot-rich.js`) turns a Universal Dependencies annotation of a span into a two-layer record (below).
- **EOTEnrichment@1** (`native/kernel/eot-enrich.js`) adds three fields no single sentence states — referent, evidence, and ground — computed from records EOTRich@1 already built.

## Surface and meaning

The rich record's central move is its split into two layers (`native/kernel/eot-rich.js` header). **Surface** is the exact bytes, in the exact order, every line kept — lossless by construction, so any later loss stays checkable. **Meaning** is the EOT proper: content words only, as nodes; function words a language spends on case, determination, tense, mood, subordination, and coordination are **absorbed** as cube-addressed markers on the node they serve (the `ABSORBED` relation set: `case, det, aux, cop, mark, cc, clf`; punctuation is surface-only). Every relation between content nodes, and every feature value, carries its own cube address. The meaning layer holds no word order and no token index — node identities are deliberately permuted so nothing downstream can recover surface order by reading an id.

`native/the-fold/eot-notation.js`'s `notationOf()` (lines 70–96) renders one record's meaning as a tree read from its root — this is EOT as it is actually emitted today, distinct from the ±/*/∥ proposal of [EO Notation](/eo-notation):

```
reach  CON·Figure  Tense=Past@REC·Pattern
  nsubj @SEG·Figure   steamboat  SIG·Figure  Number=Plur@SIG·Pattern
  obj   @SEG·Figure   Nashville  SIG·Figure
  obl   @SEG·Ground   1819       DEF·Figure
```

Each line is a node's lemma, its cube-addressed word class, and any cube-addressed feature or absorbed marker; nesting under a relation label (`nsubj`, `obj`, `obl`, …) shows how the tree was assembled from the source annotation.

## The honest gap: two reading routes

Producing this tree from raw English depends on a trained parser (`native/adapters/text/english-parser.js`) that is measured but **unwired**: 95.2 UPOS / 81.2 UAS / 77.0 LAS held-out. The reading route actually live on every `session.reader` turn is a different, positional reader (`native/adapters/text/relations-positional.js`), and the two are far apart: 0.9% recall / 18.5% precision for the live route against 74.0% recall / 73.7% precision for the unwired parser — confirmed to be real grammatical reading rather than a scoring artifact by a scrambled-word-order null (p = 1.9×10⁻⁴³) (README.md, "Reading competency audit," 2026-09-23). Without the parser's model file, `notationOf()`'s caller falls back to the draft's raw spans and says so; the pipeline never depends on the tree to produce a piece.

---

### See also

- [EO Notation](/eo-notation) — the syntax EOT implements
- [Nine Instructions](/nine-instructions) — why a syntax that carries the operator escapes Schank's fate
- [The Two Doors](/the-two-doors) — the provenance every EOT line carries
- [The EO Reader](/the-eo-reader) · [Signal from Noise](/signal-from-noise)
