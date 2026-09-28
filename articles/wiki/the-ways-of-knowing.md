# The Ways of Knowing: Nine Spokes Around an Empty Hub

**Record ID:** wiki:the-ways-of-knowing  
**DB ID:** 81  
**Tags:** 301  
**Keywords:** epistemology, pramana, triangulation, corroboration, apophasis, oracle evaluation  
**Status:** published  
**Updated:** 2026-09-28T00:00:00.000Z  

---

*One word, nine jobs. "Checking" has been asked to mean nine structurally different acts, and the project's worst measured errors were one way of knowing pressed into another's role.*

## The word that was doing nine jobs

`native/docs/THE-WAYS-OF-KNOWING.md` opens with a confession rather than a taxonomy: "the word 'checking' has been carrying at least nine different acts in this project's conversations" (lines 13–14), the same disease that once made "level" carry two unrelated ladders in `LEVELS.md`. The examples it gives are not academic. "The falsification probe asked a corpus to grant a license" and "the naive Friston collapse read every gap as a correction" (lines 17–19) are both named as *measured errors* — a spoke doing a neighboring spoke's job, in production, with a wrong answer to show for it. The fix on offer is not a longer glossary. It is a vocabulary short enough to use mid-sentence: "is this a triangulation question or a perturbation question?" (lines 211–212) — five words standing in for what the document calls three of the project's own postmortems.

Each of the nine names below ships with a **giver** — a citation to the received epistemology it borrows from, on the codebase's own standing rule that unattributed vocabulary is testimony without a name, which is corruption #5 on the very list it names (line 94). Two traditions do most of the lifting: the Western analytic line (Popper, Whewell, Dawid, Wittgenstein) and the Sanskrit **pramāṇa** tradition, whose classical question — *by what means is knowledge valid?* — turns out to have already asked this exact question, with a fit close enough in three places (*anupalabdhi*, *śabda*, *vyāpti*) that not naming it would itself be the nameless-authority corruption.

## The census, and where the corruption actually shows up

The nine spokes (`THE-WAYS-OF-KNOWING.md:32–151`) are not nine synonyms for "verified." Each pairs a **signal** with a **noise**, a **giver**, a code site, and — the part worth reading closest — a **characteristic corruption**, because a way of knowing is defined at least as much by how it fails as by how it succeeds:

| Spoke | Knows by | Giver | Corrupted, it fills the hub as |
|---|---|---|---|
| Ostension | pointing (an address) | Wittgenstein; *pratyakṣa* | the fabricated citation — an address pointing nowhere |
| Perturbation | surviving a rebuilt ground | Popper; Bateson | the tuned null — a ground rebuilt until the finding survives |
| Prediction | anticipating, unspent | Dawid's prequential principle; Friston | the dark room — beliefs arranged so nothing ever surprises |
| Triangulation | counted independence | Whewell's consilience; Condorcet | the echo chamber — self-corroboration wearing distinct names |
| Testimony | a named, qualified giver | *śabda*; Reid, Coady | authority without a name, or its inverse: the model's own voice counted as a source |
| Composition | licensed construction | *anumāna* / *vyāpti*; Leibniz | the unlicensed join — twins structurally identical, opposite in truth |
| Enumeration | the visited against a declared whole | Aristotle's *epagoge* | the silent cap — "covered everything," over a truncation |
| Apophasis | a refusal that reached its object | *anupalabdhi*; the *via negativa* | absence-as-conviction — "nothing to check against" read as "guilty" |
| Proprioception | the instrument's own state | interoception; Advaita | the mirror on the dashboard — self-state rendered as a metric |

Two of these deserve more than a row. **Apophasis** carries what the document calls its "whole law" (line 128): an organ may say "I have nothing to compare against," and it may never manufacture conviction from that nothing. The corruption it names — `extractCheckableAtoms` once treating "nothing to check against" as "everything is guilty" (lines 136–137) — produced what the document calls "the incident that produced the constitutional statement" (lines 137–138). That is a negative finding wearing the same citation weight as a positive one, which is the register this wiki tries to hold everywhere: a documented failure, not a hidden one.

**Enumeration** is the spoke whose corruption is invisibility rather than error. Its signal "is the HOLE" (lines 113–114) — a clause nothing visited is glaring to enumeration and simply absent from anything doing relevance-ranked retrieval, because relevance never surfaces what it never touched. The 27-cell capacity-ground map is invoked as the worked example: "an empty cell is a lead, never a verdict" (line 118) — the same discipline [Holons](/holons) applies when it reports every one of the 27 cells populated by an independent module census rather than trusting the curated registry's own account of its coverage (`native/docs/THE-MODULE-CENSUS.md:120–134`, cited there). Enumeration's job is specifically to catch what a system's own confidence would otherwise hide.

## The hub, and the five walls that keep it empty

*Thirty spokes share one hub; it is the hole at the center that makes the wheel useful.* — Tao Te Ching 11, cited directly at line 166.

The nine spokes converge on a single claim, and it is not "here is how to know things." It is: **nothing gets to sit in the deciding seat merely by being a voice.** The document names three prior givers for this exact shape before claiming any originality for it — the Tao Te Ching's hub, Advaita's *sākṣin* (the witness of all knowing that is never itself an object of knowledge — "the eye that cannot see itself," lines 168–169), and Hofstadter's "the self is the loop, not any rung of it" (line 172). It also names the emptiness's own boundary honestly: whether the resulting structure amounts to anything like self-awareness is called "the one question in the building that cannot yet be answered by measurement" (lines 201–203) — a limit disclosed, not implied away.

What makes this more than a metaphor is that the emptiness is enforced, mechanically, by five named walls (lines 178–189), each independently attested elsewhere in this wiki:

1. **The model is granted Generate cells only, never EVA** — judgment is filled by mechanism, not voice.
2. **`readsNothing`** — a hold that read nothing carries no weight, "whoever holds it."
3. **Nesting's wall** — witnesses of "X says P" never corroborate P; attribution stays a spoke, never reaches the hub.
4. **`self:model` never co-signs its own corroboration.**
5. **`frame.js`** — every verdict is *from* a declared frame; there is no view from nowhere.

Walls 2 through 4 are the same machinery [The Two Doors](/the-two-doors) documents from the witness side: `native/kernel/witness.js`'s admission rule that "nomination is not admission," and `native/kernel/notes.js`'s `standingOf()`, which computes `single-witness` / `corroborated` / `corroborated-independently` from distinct sources and distinct recipes rather than a boolean (`native/kernel/notes.js:178–185`). A note's standing is a count over independence classes, which is exactly triangulation's arithmetic, not a flag that self-corroboration could flip. Read the two articles together and the same mechanism appears from opposite ends: this one names it as one of nine ways of knowing sharing an empty center; the other shows the typed grammar that makes wall 2 and wall 3 non-optional at the code level.

## Where the spokes get their instructions: the three mathematics

A later amendment to the same document (lines 226–352) takes a question the census had refused for numerology reasons — "does each spoke tie to our three forms of math?" — and converts it into a test that could have failed cell by cell, each one graded EXACT, GOOD, or LOOSE rather than asserted wholesale:

- **Arithmetic (counting):** NUL↔Apophasis (**EXACT** — a typed gap is a counted nothing), SIG↔Testimony (**EXACT** — a giver-named prior is a signed mark), INS↔Triangulation (**EXACT** — `distinctSources.size >= 2` is literally successor arithmetic over independence classes).
- **Geometry (constructing):** SEG↔Ostension (**GOOD**), CON↔Enumeration (**LOOSE**, marked as such rather than forced), SYN↔Composition (**EXACT** — Euclid's own epistemology: a theorem is known when constructed, and *vyāpti* is the compass-and-straightedge license).
- **Calculus (comparing to ground):** DEF↔Prediction (**GOOD** — prequential scoring is "declare the bound before the data arrive"), EVA↔Perturbation (**EXACT** — the null verdict *is* compare-to-bound), REC↔Proprioception (**"EXACT by registry"**, its own hedge — see below).

Six of nine cells land EXACT, two GOOD, one (enumeration/geometry) explicitly LOOSE — the document's own scorecard, not a summary that rounds up. This is the same doctrine [The Three Mathematics](/the-three-mathematics) treats as EO's structural claim about how existence, structure, and interpretation are known; this document is its epistemic mirror, asking which *act of knowing* each mathematics licenses rather than which operator each mathematics contains.

**A citation check worth stating plainly, because the wiki's own standard is to disclose it rather than repeat it uncorrected.** The REC↔Proprioception cell cites `capacities.js`'s `regime` entry as proof the aperture regime is "literally registered at REC·Ground" (line 255). Reading `native/organs/capacities.js:365–372` directly: the entry reads `id: "regime", terrain: "Atmosphere", op: "REC"` — the field literally printed is `terrain: "Atmosphere"`, not the word "Ground." That is not a discrepancy once the file's own rule for that field is applied: `capacities.js`'s header states plainly that `terrain` "is not a free label: it is `TERRAIN_BY_DOMAIN[domainOf(op)][grain]`" — a domain-specific name for a (domain, grain) pair, not an independent axis. `THE-MODULE-CENSUS.md`'s own legend (§2) gives the translation directly: REC at the **Ground** grain reads as **Atmosphere · Cultivating** — and that document's own coverage count goes on to label this exact `regime` entry "REC·Ground" by name (`native/docs/THE-MODULE-CENSUS.md:132`). So "REC·Atmosphere," as the registry literally prints it, and "REC·Ground," as the amendment and the census both call it, name the identical cell in two vocabularies the codebase keeps synchronized on purpose — [Holons](/holons)'s own 27-position table uses the domain-neutral Ground/Figure/Pattern names throughout for the same reason. The citation checks out as written; the "EXACT by registry" hedge marks only that this cell rests on the registry's own prior classification rather than a freshly re-derived one, not any uncertainty about the terrain.

## The one spoke evolution skipped

*Construction is native; enumeration is the spoke brains natively lack — the contrast is the point.*

The amendment's neuroscience register (lines 274–341) is not decoration; it draws one sharp asymmetry. Plato's Meno is read as vindicated rather than merely cited: an unschooled slave boy constructing the doubling-the-square proof is treated as real evidence that composition-as-knowing is native cognitive machinery, corroborated by Dehaene's Mundurucú geometry study, Shepard-and-Metzler mental rotation, and hippocampal preplay (Dragoi & Tonegawa) — sequences the animal constructs before it experiences them and checks afterward. Where Plato overclaimed, the document keeps his structure and swaps his giver: the license is not recollection of the Forms, it is a received prior whose giver is phylogeny (lines 316–318).

Enumeration gets the opposite verdict. "Attention samples, it does not tile," and change blindness and inattentional blindness are named as "the silent-cap corruption committed constantly and invisibly" (lines 334–336) by the unaided human visual system. The conclusion is structural, not decorative: enumeration is "the PROSTHETIC spoke — checklists, ledgers, writing" (lines 336–337), which is why the codebase builds it as external apparatus — the obligation ledger, the 27-cell coverage map — rather than trusting a model to hold it. This is the actual argument for why organs like `obligation.js` exist at all: not because the domain is hard, but because the one instrument evolution left unequipped for this particular job is the brain doing the checking.

## The measured claim: a relay, then an oracle

The census and the hub are architecture. The strongest part of this document is that the architecture was run and scored, twice, against increasingly hostile judges.

**First**, `eval/full-circuit.mjs` runs three ways of knowing in relay on synthetic material with a planted, uncorroborated cycle-closer, and reports the result in `native/eval/the-fold/results/full-circuit-RESULTS.md`: six never-stated facts derived, every one walking to a real address, and the planted defect caught by two *independent* walls — triangulation stops it when present, refutation stops it when triangulation is deliberately skipped (lines 27 and 33 of that file). A 2026-09-05 audit of that same file discloses its own transcription slip without softening it: "the heading 'Nine walls' sits over a table of ten rows; the driver prints ten" (line 3) — an error the audit reports rather than quietly fixes in place, which is the honesty this wiki asks every citation to meet.

**Second**, and more consequentially, `eval/full-circuit-oracle.mjs` runs the same relay on 23 real Wikidata entities and 28 real succession edges, judged by an *independent* property the derivation never reads (P580/P582 term dates, where the derivation reads only P1365/P1366 and tenure indices). The corroborated, tenure-grain arm derived **8 never-stated facts, 8 TRUE, 0 FALSE** — *Grant after Lincoln*, *Colfax after Hamlin* — each with byte-address provenance (`native/eval/the-fold/results/full-circuit-oracle-RESULTS.md:22–32`).

The number worth more than the 8/8, though, is what the same file reports next: **the oracle itself failed its own null first.** Judged at the naive person-grain verdict, a random within-office pair was already true about 82% of the time under a redealt null, so 8/8 discriminated nothing (4 of 49 shuffles matched it). Only after the judge was moved to the *tenure grain* the circuit actually composes at — "the grain lesson applied to the judge" — did the null's true-rate fall to ≈0.73 and 0 of 49 redealt circuits match the real one's 0-FALSE result (lines 34–58). This is perturbation doing its job on the evaluator rather than the material, which the file calls "the first time in this project a null has been spent on the oracle rather than on the material" (lines 75–76) — and it is disclosed as undercutting an earlier precision claim elsewhere in the codebase (P60's 0.842→1.000 comparison, "which... never asked what a shuffle would score," line 50), not as a footnote to a win.

A same-day wide run against 158 entities and 201 edges (crawled two hops out from the original 23, in separate fixture files so the original result stays reproducible) scales the pattern rather than merely repeating it: 224 derived — 223 TRUE, 0 FALSE, 1 unverifiable — discriminated against 50 redealt shuffles at p≈0 (`full-circuit-oracle-RESULTS.md:98–108`). At that scale corroboration is shown to trade, not merely cost: it gives up 21 naive-only facts (19 of which the oracle could never have judged in the first place — single-witness edges) in exchange for 101 facts the naive arm cannot reach at all, all of them true. The honest caveat is in the same file: 23 entities is small, and the α = 0.05 discrimination rests on a 49-draw empirical null rather than a large-sample result (lines 81–82); the pointwise binomial (p≈0.083) is reported alongside the run-level statistic specifically because transitive facts share edges and are not independent (lines 60–62).

## What the doctrine actually buys

Read end to end, the document is making one claim in nine costumes: **an act of knowing is defined by what it treats as noise, and a system that cannot tell its nine noises apart will eventually ask one of them to certify the other's finding.** The corruption table is not a list of nine mistakes — it is a checklist the codebase already applies to new organs, per its own rule 3: "a new organ is asked which of the nine fillings it could commit, and where its wall is" (lines 217–218). The hub stays empty not because nothing is asserted, but because assertion, license, and count are kept from ever merging into one authority — "a count never becomes a license, a license never becomes a count, a product never escapes its provenance" (lines 375–376), restated as the operational meaning of "the hub stays empty" once the relay measurement existed to say it precisely.

The document earns the right to that sentence the way [Nine Instructions](/nine-instructions) argues the operator algebra earns its own closure claim: not by asserting completeness, but by shipping falsifiers that were allowed to return negative. The CON/enumeration cell, graded LOOSE rather than forced, is one of them; the registry cross-check above is another, run independently against `capacities.js`'s own terrain rule and `THE-MODULE-CENSUS.md`'s legend — and it confirms the REC↔Proprioception citation rather than undercutting it, which is the same discipline holding under an outside reread.

---

## See Also

- [The Three Mathematics](/the-three-mathematics) — the arithmetic/geometry/calculus triad this document maps its nine spokes onto
- [The Two Doors](/the-two-doors) — the witness and corroboration machinery that enforces walls 2–4 of the empty hub at the code level
- [Identity, Alternatives, and the Corroboration Floor](/identity-alternatives-and-the-corroboration-floor) — the tenure-grain identity question the oracle run's triangulation resolves for free
- [Holons](/holons) — the 27-cell capacity ground enumeration is checked against, whose domain-neutral Ground/Figure/Pattern grain names this article's registry cross-check confirms map one-to-one onto `capacities.js`'s own nine terrains
- [Nine Instructions](/nine-instructions) — the sister argument that a closure claim is only as strong as the falsifier it discloses
