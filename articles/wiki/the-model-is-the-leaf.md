# The Model Is the Leaf

**Record ID:** wiki:the-model-is-the-leaf  
**DB ID:** 79  
**Tags:** 301  
**Keywords:** llm, model, contract, capability, prompt, site, defamation firewall, injection  
**Status:** published  
**Updated:** 2026-07-14T00:00:00.000Z  

---

*Where a conventional AI application puts the language model at the center and arranges everything around it, the [EO Reader](/the-eo-reader) puts it at the bottom of the tree — a contracted part with the narrowest possible grant of authority. "The model proposes, the kernel disposes."*

---

## The prompt is a Site, not a struct

A prompt is not an unstructured block of instructions; it is a projection over a catalog of **bands**, each declaring the [terrain](/the-nine-operators) it occupies (`src/model/bands.js`; `docs/prompt-as-site.md`). This is not decoration — it exposes a measurable pathology. A census of the reader's own instructional prose found its terrain distribution **inverts** the population gradient of natural language: the Ground row runs ~66 % of instruction characters against a corpus baseline of ~6 % — roughly **×10.7 over-represented**. Ground-row inflation is *the accretion pathology* of prompts, and now it has a checkpoint: `judgePrompt` scores it against the corpus gradient via a [derived null](/signal-from-noise) (`src/model/prompt-checkpoint.js`), the input-side mirror of the output-side veto.

There is a sharper diagnosis still. The instruction that tries to make the model *compose in a voice* occupies the **desert cell** — SYN at Ground, the one cell empty across 41 languages. *You cannot instruct Cultivating; you cultivate by arranging conditions.* An instruction placed there is on a patch treadmill against the mass of the actual material: the material always wins, because that is where the mass is.

## The model gets a capability contract

The model is handed a `MODEL_CONTRACT` — a narrow `{ops, terrains, stances}` grant (`docs/model-as-contracted-part.md`). Two clauses matter most:

- **No DEF/EVA/REC — the defamation firewall.** The model may *render* a judgment the kernel has already logged; it may never *originate* one. A verdict comes from the grounding machinery, not the talker's fluency.
- **No Entity terrain — PII protection as an address the model does not have.** The model cannot name a private individual because that terrain is simply not in its grant.

The security property falls out of the contract width, not a bolted-on filter: **prompt-injection blast radius is bounded by the output alphabet.** A document that tries to hijack the model can only make it emit within operators it was granted; it cannot manufacture a citation, because the model never writes citations — the binder re-cites mechanically (`src/enactor/ground/bind.js`). This is the [effect system](/nine-instructions) pointed at the least-trusted component: authority is attenuated, never amplified.

## The empirical case for the demotion

Keeping the model a leaf is not an aesthetic preference; it is a measured result. On the judgment battery, a **deterministic** scorer agreed with hand labels **19/20 (95 %)** while a local 7B **LLM judge** agreed **20/39 (51 %)** — and 17 of its 19 disagreements were *invented* failures ([The Evidence](/the-evidence)). A model asked to be the judge reverts to its priors and confabulates. So the reader's endgame, stated in its own docs, is that the model is *"only ever a ranker in a sandbox, and the sandbox is the whole invention."*

This inverts the wiki's older framing (e.g. in [The Nine Operators](/the-nine-operators)) of LLMs as a NUL-degraded technology to be prompted into doing EO. The reader does not prompt a model into EO. It builds EO as a kernel and hands the model the smallest job it can be trusted with.

---

### See also

- [Nine Instructions](/nine-instructions) — the contract as an effect system / capability
- [The EO Reader](/the-eo-reader) — where the model sits in the body
- [Signal from Noise](/signal-from-noise) · [The Evidence](/the-evidence)
- [MVP: Minimum Viable Prompt](/mvp-minimum-viable-prompt) — the prompt-era proxy this supersedes
