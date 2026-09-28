# The Two Doors: Witness and Firewall

**Record ID:** wiki:the-two-doors  
**DB ID:** 76  
**Tags:** 301  
**Keywords:** provenance, exafference, reafference, firewall, canWitness, doors, witness  
**Status:** published  
**Updated:** 2026-09-28T00:00:00.000Z  

---

*The deepest invariant in the [EO Reader](/the-eo-reader), and the one the older wiki never named. Every event enters the log through one of two doors, and which door it came through is a fact about the event that can never be forged.*

---

## The law

*Historical note: earlier drafts of this section named a literal `canWitness` boolean cited to `src/core/provenance.js`. No such field, and no file at that path, exists anywhere in eoreader7 — checked repo-wide, including `native/legacy-ported/provenance/index.js`, the closest surviving analog. That framing is retired here as a 4.2-era claim, not carried forward.*

The doctrine survives in a stronger, differently-shaped form. `README.md` states it directly, under its own heading:

> **Priors and witness.** Priors may condition orientation, nominate perceptions, and focus interrogation. They cannot become witness merely by being prior.

A prior — an expectation, a hypothesis, context handed in ahead of time — can point a reading somewhere and shape what gets looked at. It cannot, by itself, become the thing the reading stands on. That distinction is enforced mechanically at the boundary where a nominated candidate becomes an admitted observation: `native/kernel/witness.js` (Handle: Thymus — "the organ where a candidate is presented and selected, not admitted on presentation alone: nomination is not admission"). Its `witness()` function admits a candidate only when it carries real evidence anchored to the actual encounter (`sameAnchor(candidate.anchor, encounter.anchor)`); everything else is refused, by default with the reason "no evidence" or "anchor mismatch." A refused candidate is not simply dropped, either — `witnessVerbose()`, shipped alongside `witness()` on 2026-09-14, additionally returns the refused set with its typed reason, so a caller that wants to keep the record of what was proposed and declined can.

## Why witness is typed, not flagged

*Historical note: earlier drafts grounded this in a monologue audit — `src/surfer/fold/audit.js`, `factsAdded: 0` — that does not exist in eoreader7; a repo-wide search for `factsAdded` returns zero hits. Retired as a 4.2-era claim, pending a re-audit against the current codebase.*

The current mechanism does not use a flag at all; it uses a typed grammar. `native/kernel/notes.js`'s ledger (Handle: Arokin) strings a witness as `[kind:]<ref>[#address][~recipe]`: the source is the ref alone; an optional `kind:` prefix declares *how* the witness was earned (`testimony:` for a model-corroborated vote; a bare witness with no declared kind reads as a mechanical `sighting`). `kindOfWitness()` reads that prefix back out, and a note's overall standing (`standingOf()`) is computed from distinct sources and distinct recipes — `single-witness`, `corroborated` (two-plus sources through one instrument), or `corroborated-independently` (two-plus sources *and* two-plus instruments) — never a boolean. `attest()` lets a testimony vote attach to an existing note, but only when the witness string is itself typed: an untyped bare string is refused outright, because "a bare string could be mistaken for a mechanical re-sighting." A flag can be flipped; this grammar has to be spelled out, and a caller that tries to skip the typing is refused at the door.

## Challenge sits in front of the witness door

This stage is not in the prior wiki text. `README.md` names an eighth stage of the reading cycle, sitting before witness:

> `Challenge` is constitutive but non-evidentiary: candidate interpretations are always challengeable before witness. Without a challenger the stage is identity-preserving.

`native/kernel/perturbation-challenger.js` ships the first real challenger for that stage — deliberately not a second model call. The sibling engine's own measurement of a model-as-witness puts its likelihood ratio at 1.0 ("a likelihood ratio of 1.0 moves belief by exactly nothing, however confident the prose"), so a challenger built from a second model call would inherit the same emptiness dressed as adversarial review. Instead it is a structural null-check: it re-runs the *same* extraction on a perturbed (shuffled) version of the *same* material and keeps only the candidates still nominated afterward. "A candidate the material itself supports keeps reappearing under any reshuffling of that material; a candidate that is an artifact of the one specific arrangement... vanishes the moment it is destroyed." Its own header quotes `witness.js`'s Thymus doctrine directly, one stage up: "a candidate a perceiver PROPOSES is not yet a candidate the reading should KEEP." The module ships real, tested, and importable; as of this writing no production call site wires it in — a disclosed gap, not an oversight.

## Search is the door between the doors, with a measured toll

*Historical note: earlier drafts cited `src/enactor/connect/promote.js` and `src/surfer/fold/significance.js` for a mechanism promoting reader-inferred edges into the graph with their provenance attached. Neither file, nor any successor matching that description, exists in eoreader7 — no found successor after a repo-wide search. Retired as a 4.2-era claim pending re-audit; the concern it addressed (impact without laundering — an inference should be able to reach the record *distinguishably*, without being mistaken for what it is not) is the same concern the contest mechanism below now actually enforces.*

The consequence survives, and it is now measured. `native/organs/corroboration.js` (Handle: Bukhari — "after al-Bukhari, whose hadith verification stands only on independent chains of transmission; a shared chain counts as one witness") is the door's own witness tier: a candidate note is proposed by shared vocabulary with a source, then a small model is asked whether an independent source states it, armed with a sibling-swapped control so a "yes" that would fire equally on a fabricated twin counts for nothing. Measured live before this module existed: 2 of 12 real notes corroborated cross-document against a mechanical baseline of 0, with a fabricated-note control of 0/4.

A "contradicts" verdict does not convict the original note. Lamport's point, made mechanical: at two sources you can see a disagreement but not who is wrong. It lands instead as a new, named act on `notes.js`'s ledger — `dispute()` — typed `CON·Figure·CONTESTED`, carrying the disputing source and the decider sentence's own address in that source's bytes. The note stays live and stays premise-eligible; nothing about its existing witness set moves. What changes is that the disagreement is now on the record rather than dying with the run that found it — available to `contestedSearch`'s own ranking of where a genuine third source might settle it. This is the door between the doors kept honest with a real toll: a search earns either a "states" (through `attest`) or a "contradicts" (through `dispute`) against a measured fabricated-control false-positive rate of zero, never a free upgrade from guess to fact.

---

### See also

- [The EO Reader](/the-eo-reader) · [Signal from Noise](/signal-from-noise) · [The Evidence](/the-evidence)
- [Deep Reading](/deep-reading) — what runs safely behind the firewall
- [The Experience Engine](/the-experience-engine) — the boundary this refines
