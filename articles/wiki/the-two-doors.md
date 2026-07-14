# The Two Doors: Witness and Firewall

**Record ID:** wiki:the-two-doors  
**DB ID:** 76  
**Tags:** 301  
**Keywords:** provenance, exafference, reafference, firewall, canWitness, doors, witness  
**Status:** published  
**Updated:** 2026-07-14T00:00:00.000Z  

---

*The deepest invariant in the [EO Reader](/the-eo-reader), and the one the older wiki never named. Every event enters the log through one of two doors, and which door it came through is a fact about the event that can never be forged.*

---

## The law

- **Perceiver door — exafference.** The witnessed world: a source read from disk, a page fetched, a sentence the user typed. `canWitness === true`. It can ground a claim.
- **Enactor door — reafference.** The system's own output: a reflection, a murmur, an inferred connection, a generated paragraph, a code-organ finding. `canWitness === false` — **by type, not by flag** (`src/core/provenance.js`).

"Reafference" is borrowed from biology: the sensory consequences of your own action, which the nervous system must distinguish from sensation caused by the world, or it cannot tell perception from prediction. *You cannot tickle yourself.* The reader enforces the same distinction structurally: a piece of the system's own reasoning can never be laundered into evidence for itself, because `canWitness` is a property of the door it came through, not a boolean anyone can set.

## Why it is a *type*, not a flag

A flag can be flipped; a type cannot be argued with. Because me-ness is constitutive rather than annotated, the firewall is preserved by *composition* — the whole nest of idle cognition ([deep reading](/deep-reading), metacognition, cross-connections) can run unattended and none of it can enter the witnessed record, without the firewall being re-checked at each level. The monologue audit confirms this empirically: strip everything tagged as inference, re-project the graph, and the depicted facts are identical — `factsAdded: 0` across every run (`src/surfer/fold/audit.js`; see [The Evidence](/the-evidence)).

## The amendment the implementation earned

The wiki's [Experience Engine](/the-experience-engine) framed the Given/Meant boundary as *segregation*: keep interpretation out of the record. The reader found a better rule. Reader-inferred edges — *this contradicts that*, *this connects to that* — **do** reach the graph, promoted as real `CON` edges that **carry their enactor provenance with them** (`src/enactor/connect/promote.js`, `src/surfer/fold/significance.js`). The attention field moves; the witnessed record is byte-unchanged. The firewall was never "keep inferences off the graph." It is **"keep them distinguishable on the graph."** Impact without laundering.

## Search is the door between the doors

The most important consequence: an interpretation the system is uncertain about can be *converted* into a witness by going and looking. A search takes the engine's own guess (reafference) and fetches an external page that either corroborates it or does not (exafference). *The grounding gap is the query* — the unresolved span becomes the question to the world (`docs/web-search.md`). This is why the reader can hold a belief honestly and still improve it: the two doors are not a wall, they are a *turnstile* with a measured toll. See [Going and Looking](/going-and-looking).

---

### See also

- [The EO Reader](/the-eo-reader) · [Signal from Noise](/signal-from-noise) · [The Evidence](/the-evidence)
- [Deep Reading](/deep-reading) — what runs safely behind the firewall
- [The Experience Engine](/the-experience-engine) — the boundary this refines
