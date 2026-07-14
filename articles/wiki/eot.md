# EOT: The Text of Experience

**Record ID:** wiki:eot  
**DB ID:** 80  
**Tags:** 201  
**Keywords:** eot, notation, wire format, locus, sense, provenance, ingestion  
**Status:** published  
**Updated:** 2026-07-14T00:00:00.000Z  

---

*[EO Notation](/eo-notation) describes a syntax for writing operators. **EOT** — EO Text — is that syntax as a working wire format inside the [EO Reader](/the-eo-reader): the single surface every one of ~17 sense organs lowers onto, and the thing the [code organ](/the-eo-reader) reads a program into. This is where "the operator is carried by the surface syntax" ([Nine Instructions](/nine-instructions)) stops being an aspiration and becomes a parser.*

---

## Surface syntax with operator recovery

An EOT line carries its operator in its punctuation, and the ingester recovers the operator from the surface — it never has to *infer* which operator a natural-language sentence meant (`src/organs/ingest/eot.js`). This is the escape from the mapping problem that killed Schank's primitives (see [Nine Instructions](/nine-instructions)): you do not guess the road from English to the operators, because the notation *is* the road.

Two disciplines make it trustworthy rather than merely parseable:

- **Provenance is load-bearing.** A model's note enters through the enactor door (`canWitness:false`); an external import enters through the perceiver door. The door is part of the line, not metadata bolted on afterward (see [The Two Doors](/the-two-doors)).
- **Nothing inert is emitted silently.** A malformed line becomes a diagnostic, never a dropped fact; the emitter reports what it `skipped` and why (`src/organs/ingest/eot-emit.js`). Honesty about coverage is built into the format.

## Carrying *where* and *which sense*

Multimodal reading forced two additions to the format (`docs/multimodal-eot-foundation.md`):

- **The `^locus` trailer.** A third trailer sigil beside `@agent` and `~ts`, carrying a W3C Media Fragment (an image region `#xywh=…`, a document block `#page=N`) as an **opaque string** the core never resolves — only the organ that minted it can open it. Because a fragment contains `#` (EOT's own comment sigil), the locus rides *quoted*, round-tripping byte-exact. The geometry that used to live only on a document's spans now rides the event, so it survives serialization and compositing.
- **The sense axis.** Each event knows which door of the world it came through — sight, hearing, tabular, structural, text (`senseOfModality`). This is what lets two senses **corroborate** the same fact, and it is distinct from *modality* (already taken for realis/irrealis mood).

Together these give the witness ladder its top rung: **cross-modal** corroboration (≥2 root origins across ≥2 senses), with a derivation fold so a transcript of a recording is not miscounted as a second, independent witness. See [Signal from Noise](/signal-from-noise).

## The checkpoint is in the language

Because the surface is typed, defects are properties of the *sentence*, catchable without running anything: a grain-mixed event, a reference before its instantiation, an import of a name never exported. The EOT coder makes these unsamplable at emission (`src/coder/`), and the checkpoint reads the rest off the algebra with a face, an address, and a fix — the *"a grain-mixed event is a sentence the language should not be able to say"* discipline ([Nine Instructions](/nine-instructions); `docs/eo-for-coders.md`). EOT is where EO's claim to be a checkable notation, rather than a suggestive one, is cashed out.

---

### See also

- [EO Notation](/eo-notation) — the syntax EOT implements
- [Nine Instructions](/nine-instructions) — why a syntax that carries the operator escapes Schank's fate
- [The Two Doors](/the-two-doors) — the provenance every EOT line carries
- [The EO Reader](/the-eo-reader) · [Signal from Noise](/signal-from-noise)
