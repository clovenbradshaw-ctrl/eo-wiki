# The Model Is the Leaf

**Record ID:** wiki:the-model-is-the-leaf  
**DB ID:** 79  
**Tags:** 301  
**Keywords:** llm, model, contract, capability, prompt, site, defamation firewall, injection  
**Status:** published  
**Updated:** 2026-09-28T00:00:00.000Z  

---

*Where a conventional AI application puts the language model at the center and arranges everything around it, the [EO Reader](/the-eo-reader) puts it at the bottom of the tree — a contracted part with the narrowest possible grant of authority. "The model proposes, the kernel disposes."*

---

## The mouth is walled, not staged

*Historical note: earlier drafts of this section described the prompt itself as a projection over classified "bands" (`src/model/bands.js`), with a measured Ground-row over-representation (×10.7 over the corpus gradient) checked by a `prompt-checkpoint.js` gate (`docs/prompt-as-site.md`). None of `bands.js`, `prompt-checkpoint.js`, or `docs/prompt-as-site.md` exist anywhere in eoreader7 — checked repo-wide, including the `native/legacy-ported/` compatibility folder. That apparatus is retired here as a 4.2-era claim pending re-audit, not carried forward as current.*

The current mechanism does not classify the prompt's terrain; it walls off what the model is shown, before it ever speaks. Two disciplines, both in `native/organs/firewall.js`:

- **No apparatus vocabulary.** A closed, declared list of nouns that name a part of the instrument rather than anything in the world — "prompt," "passage," "retrieval," "chunk," "citation," and a dozen more — is checked out of every model-facing string by `assertModelFacing`, run against the real exported prompt constants and the real output of the fact-block builder. The rule exists because it was measured failing: five runs on 2026-08-27 against real fetched Wikipedia and gemma2:2b produced "The prompt specifically identifies Hannibal Hamlin as Lincoln's vice president" — the model was not answering the question, it was describing its own input, because the system prompts it read said "the prompt" and "the passages" to it directly, sometimes while also instructing it not to. Telling a model not to do the thing while naming the thing to it does not work; the fix removes the vocabulary rather than instructing around it.
- **No addresses in view.** `strikeAddresses`/`mouthFacing` strip every bracketed (`[pg2554.txt#a-b]`) or bare (`h.txt#0-75`) address out of anything the model is shown, applied once at the mouth's own door. The rule, restated by the user on 2026-09-07: "it's just liable to lie with it" — an address in the model's view is an address it will write, whether or not it is the right one.

## The classification is post-hoc, and the model is never asked to cite

*Historical note: earlier drafts described a `MODEL_CONTRACT` — a `{ops, terrains, stances}` capability grant withholding DEF/EVA/REC and Entity terrain, bound by `docs/model-as-contracted-part.md` and re-cited mechanically by `src/enactor/ground/bind.js`. None of these exist in eoreader7 — checked repo-wide, including `native/legacy-ported/`. The object is retired as a 4.2-era claim pending re-audit; the discipline it aimed at is intact, but the mechanism enforcing it has moved from a grant the model carries to a wall around its input and a classifier over its output.*

Every sentence of a rendered answer is classified onto one of two grounds, after the draft exists, by `native/organs/provenance.js`: **material** (the sentence carries or earned an address into the bytes) or **model** (the sentence stands on what the model is, in its own voice). Both are legitimate; what is not legitimate is their rendering alike — "measured and shown never render alike." Orthogonal to the ground is a stripe: a sentence on either ground that commits to a figure or a name the material does not contain is drawing on the model's own authority, and is typed as such regardless of which ground it otherwise sits on.

The model is never asked to produce its own citations. `native/organs/cite.js`'s `attribute` and `coverage` attach an address to a sentence mechanically, after the fact, only when the sentence's overlap with an offered passage beats a null built from passages the turn never offered it — an instruction is the wrong tool for getting a small model to cite consistently, so the address is attached rather than requested.

The typing is externalized per sentence in `native/organs/output-holograph.js`'s `EOHolographOutput@1` schema (dated 2026-09-16): each sentence of generated prose is tagged `material` (carrying the ground fact's byte ref) or `self:model` ("the mouth's own prose"), toward the stated design goal that "any arbitrary content generated with 100% of its inspiration explicit" lets "the holograph [identify] what was the model vs what was us."

Where the old contract's security property was "prompt-injection blast radius is bounded by the output alphabet," the current one is narrower but measured: a model handed no addresses cannot forge one, and a model handed no apparatus vocabulary cannot narrate the machine reading to it — not because either move is forbidden, but because neither word is in the room.

## The empirical case for the demotion

Keeping the model a leaf is not an aesthetic preference; it is a measured result. On the judgment battery, a **deterministic** scorer agreed with hand labels **19/20 (95 %)** while a local 7B **LLM judge** agreed **20/39 (51 %)** — and 17 of its 19 disagreements were *invented* failures ([The Evidence](/the-evidence)). A model asked to be the judge reverts to its priors and confabulates. So the reader's endgame, stated in its own docs, is that the model is *"only ever a ranker in a sandbox, and the sandbox is the whole invention."*

This inverts the wiki's older framing (e.g. in [The Nine Operators](/the-nine-operators)) of LLMs as a NUL-degraded technology to be prompted into doing EO. The reader does not prompt a model into EO. It builds EO as a kernel and hands the model the smallest job it can be trusted with.

The epigraph above — "the model proposes, the kernel disposes" — is not only this article's own gloss. `VISION.md` (regenerated 2026-09-27 from the project's own live end-state ledger) states the same split in the reader's current voice: "The model is the mouth — it renders what the structure has already, mechanically, licensed; it never supplies content the structure hasn't earned" (under "What it can do"), and, under "What it can never claim to do": "Never let a model act as a groundless oracle... it may never be the thing a judgment rests on with nothing checking it." The kernel/mouth split this article describes is not a wiki metaphor placed on top of the reader; it is the reader's own standing constitution.

---

### See also

- [Nine Instructions](/nine-instructions) — the contract as an effect system / capability
- [The EO Reader](/the-eo-reader) — where the model sits in the body
- [Signal from Noise](/signal-from-noise) · [The Evidence](/the-evidence)
- [MVP: Minimum Viable Prompt](/mvp-minimum-viable-prompt) — the prompt-era proxy this supersedes
