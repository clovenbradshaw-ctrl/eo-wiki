# Nine Instructions: EO Is an Effect System, Not an Ontology

**Record ID:** wiki:nine-instructions  
**DB ID:** 72  
**Tags:** 301  
**Keywords:** effect system, schank, codd, compiler, closure, capability, defeat conditions, conceptual dependency  
**Status:** published  
**Updated:** 2026-07-14T00:00:00.000Z  

---

*This article reframes EO's central claim. It argues that the operator algebra is best understood not as a metaphysics but as an engineering artifact with sixty years of proven ancestry — and that seeing it that way makes its one genuinely novel bet **sharper, smaller, and much harder to knock down**. It is written to be defensible to a hostile reader.*

---

## The intuition, and its real name

The motivating complaint is old and correct: in an ordinary application you have indefinitely many particular cases, and you rethink the logic for every one. Put a fixed set of operations in the middle — everything *lowers* into it, everything *lifts* out of it — and you write **N + M pieces of logic instead of N × M**. N lowerings, M passes. This is the N-by-M collapse, and it is the single most reliable win in the history of software: it is what every compiler does.

The second half of the intuition — *if these things nest, they need uniform ways to interact* — also has a name: the **uniform interface**. It is why Unix pipes compose into things their authors never imagined; it is the constraint at the center of how the web works; it is Christopher Alexander's claim that the same patterns hold at the scale of a region and a doorknob; and, most precisely, it is Stafford Beer's **Viable System Model** — five functions recurring *identically* at every level of recursion, so a viable system contains viable systems and is contained in one.

None of this is new, and that is the good news. Koestler's *holon* is from 1967; Simon's two-watchmakers parable from 1962; Beer and Alexander are contemporaries of both. The two laws at the front of EO's coder's manual — *the cube* and *the watchmaker* (see [Holons](/holons)) — are a paper and a book older than personal computing. That they still hold is not an embarrassment. It is a **load test** passed. Sixty years of people leaning on that ground, and it has not given.

So the intuition is right. The useful question is not *whether it works* but **which part is actually doing the work** — and that has a sharper answer than one might expect.

## Take the metaphysics off and see what is left

Delete every philosophical claim from the framework. No von Neumann ordinals, no Peirce, no transcendental coordinate. Look only at what the kernel mechanically does:

- Every part declares a set of operations it is **permitted** to perform.
- That set gets **narrower** going down — a view can never do more than the room it draws from.
- It gets **unioned** going up — an application's permissions are the computed sum of its parts', not a fresh declaration.
- Any attempt to **widen** a permission must be explicit and logged.
- The kernel **refuses, statically**, to let a part perform an operation it did not declare.

That is not an ontology. **That is an effect system** — in the precise, forty-year-old, programming-language-theory sense.

An *algebraic effect* is an operation a computation is permitted to perform, tracked in the computation's own type (Plotkin & Power; later Plotkin & Pretnar). A function's type says not only what it returns but **what it is allowed to do on the way**. The set of permitted effects is a *row*; one row fitting inside another is **subeffecting**; computing an outer permission set as the union of inner ones is **effect inference**; a computation that performs an effect it never declared is the discipline's signature failure — the **unhandled effect**.

Map it straight across:

| EO contract system | Effect-system name |
|---|---|
| Contract narrows downward | Subeffecting |
| App contract envelopes upward | Effect inference |
| Logged widening | Row extension |
| Kernel rejection of an undeclared op | Unhandled effect |
| Authority never ambient; a part only attenuates what it was given | Object-capability security |

The honest structural diagnosis: **EO's contract system is a row-based algebraic effect system in capability-passing style, over a closed semantic alphabet, with an added coherence check and a typed rejection vocabulary.**

Every clause in that sentence is standard, well-proven, and safe — **except one.** Ordinary effect systems track *computational* effects (I/O, state, exceptions) and their entire selling point is that the effects are **user-definable**: you add one whenever your domain needs it. EO does the opposite. It says: *nine, closed, forever.* That single inversion is the whole bet. Everything else is somebody else's proven ground.

> **This is not a hypothetical.** The EO Reader ([EO Implemented](/the-eo-reader)) ships this effect system. Each holon carries an `eo-contract.js` manifest declaring its `{ops, terrains, stances}`; `core/contracts.js` merges every manifest into an application-level envelope (effect inference); contracts narrow toward the leaves (subeffecting); a widening is a logged `!REC` (row extension); and `tests/contracts.test.js` proves 100 % contract coverage and cube coherence on every run — a part performing an undeclared op is a build-time failure, not a runtime surprise. The model itself is handed the narrowest grant of all: a `MODEL_CONTRACT` **without** DEF/EVA/REC (the defamation firewall — it may *render* a logged judgment, never *originate* one) and **without** the Entity terrain (PII protection as an address the model does not possess). See [The Model Is the Leaf](/the-model-is-the-leaf). EO did not describe an effect system. It **built** one, and then forgot to call it that.

## Two graveyards and one palace

Three traditions have made a closure claim of this shape. Their fates diverge, and the reason they diverge is the most useful thing in this article.

**The graveyard, headstone: Roger Schank.** In 1969 Schank's *Conceptual Dependency* proposed that every human action verb decomposes into ~eleven primitive acts — physical transfer, abstract transfer of possession, mental transfer of information, mental construction, grasp, ingest, speak, attend — each instantiated with role fillers (agent, object, source, destination). *A small closed set of language-independent primitives; everything decomposes into combinations; you aim targets at the operators; canonical form so that synonymous sentences collapse to one structure.* **That is EO's claim, made in 1969, with very nearly EO's operator count.** EO's evidence — 32,000+ verbs across 41 languages ([Lexical Analysis](/lexical-analysis)) — is a *Schankian move performed with better tools.*

It died. Not because Schank was a fool — he was among the sharpest in the field — but for four specific reasons, and all four must be heard:

1. **The primitive set kept needing exceptions.** Every new domain surfaced a verb that would not decompose; you distorted the verb or quietly added a primitive.
2. **Decomposition threw away what mattered.** *Give* and *sell* are both "abstract transfer of possession." The difference between them is the entire subject matter of commerce.
3. **The mapping problem was the hard problem.** Getting from actual English to the primitives had no theory. The framework named a destination and no road.
4. **It never left the micro-world.** Every demonstration was hand-built.

Schank has company in the graveyard: Wierzbicka & Goddard's ~65 universal semantic primes (forty years defended, used by no one building anything); Jackendoff; Dowty; Fillmore's cases; Halliday's process types; Rhetorical Structure Theory's two dozen discourse relations — which *do* nest recursively, exactly as EO wants, and which no one ever closed. Intellectually enormous; practically thin.

**The palace, one architect: Codd, 1970.** Six operations — select, project, union, difference, product, rename — and relational algebra ate the world. Every database is its descendant. Same shape of claim. One man is a footnote; the other founded a trillion-dollar industry. The difference is not intelligence and not luck.

## Why Codd won

Codd's closure claim was **relative to a precisely defined target class** and it was **provable.** He did not say *six operators for all of reality.* He said: here is exactly the class of queries expressible in first-order logic over relations, and here is the proof my six express precisely that class and nothing more. **Relational completeness is a theorem.** You can check it, attack it, and — decisively — *build* on it, because you know exactly where the ground ends and the swamp begins.

Schank said *all of meaning*: uncheckable, unfalsifiable, unbuildable-upon, because you never learn you have walked off the edge until you are already falling.

And here is the sentence a hostile reader will reach first, so EO should reach it first:

> **EO currently makes Schank's claim while citing Codd's proof.**

The framework reports testing all 1,296 admissible operator orderings against Codd's functional-dependency closure criterion, eliminating 92 % as closure violations (see [The Three Triads](/the-triads)). Grant it entirely. But look at *which* operators that test touches. Codd's algebra is about **existence and structure** — instances, boundaries, joins, projections. It maps onto **instantiate, resplit, bond** and that neighborhood. It has:

- **no *evaluate* (EVA)** — there is no relational operator for rendering judgment against a definition;
- **no *learn-rule* (REC)** — schema migration is famously *outside* the relational algebra, the thing you do at 3 a.m. with a separate tool;
- **no *hold* (NUL)** and **no *attribute* (SIG)** — observation and attention are not operations in a query algebra; they are free, invisible.

So the proof certifies the operators nobody doubted, and leaves untouched the **Significance triad — assert, evaluate, restructure (DEF · EVA · REC)** — which is where *every interesting thing in the architecture lives.* The fold is assert–evaluate–restructure. The contract system is assert. The verifier is evaluate. Defeasibility is restructure. **EO's whole product is the triad its proof does not cover.**

That is not fatal. It may be a gap in the write-up, not the work. But it is the first thing a hostile reader finds, and they are right to find it, so **find it first.**

## The gap the proof leaves is exactly what the implementation fills

Here is the turn the original critique could not make, because it predates the evidence. **Codd's proof reaches Existence and Structure. The EO Reader's measurements reach Significance.** The two evidence legs, together, cover the nine — and the second leg is new as of 2026 (see [The Evidence](/the-evidence)):

- **EVA made measurable.** A judgment is scored not for fluency and not against a frozen gold answer, but for *confident-wrongness*: correct suspension counts as correct, confident guessing is the counted failure. A deterministic scorer agreed with hand labels 19/20 (95 %) where a local 7B LLM judge agreed 20/39 (51 %), 17 of its 19 disagreements invented. Evaluation is not "free and invisible" here — it is a first-class, contracted, logged, *audited* operation.
- **REC made observable.** Defeasible conventions are learned, tested, and *defeated-or-reinstated* on the record; a restructuring pays a supersession cost that unsettles every dependent claim. Schema change is no longer out of band — it is an event in the same log as the data.
- **NUL and SIG made first-class.** Observation and attention — the operations a query algebra cannot see — are the reader's most instrumented surfaces: the derived void-null decides what counts as signal without a hand-set threshold, and Bayesian surprise decides where attention goes (*"TV-snow is maximally improbable yet inert"*). See [Signal from Noise](/signal-from-noise).

So the response to "your proof only covers the boring operators" is not a defense. It is: **yes — and here is the second body of evidence, measured rather than proven, that covers the rest.** Proof for the query-algebra neighborhood; falsifier-gated measurement for the significance neighborhood. That is a stronger epistemic position than Codd alone and an incomparably stronger one than Schank.

## The reframe worth staking the argument on

Schank died on the mapping problem — arbitrary English to primitives, with no road. **EO does not have a mapping problem, because it built the road.** The notation recovers the operator from punctuation: the colon *is* instantiate, the arrow *is* bond, the dot-equals *is* assert ([EO Notation](/eo-notation); [EOT](/eot)). The system never *infers* which operator a sentence instantiates; the operator is carried by the surface syntax of a language EO controls. In the EO Reader, malformed EOT lines become diagnostics, never silent guesses, and provenance rides every event.

Which licenses the reframe:

> **EO has not built an ontology. It has built a compiler, and its intermediate representation happens to have nine instructions.**

This is a promotion, not a demotion. LLVM has an instruction set; it does not claim that set is the true instruction set of all possible computation. It claims something more modest and more useful: every source language lowers in, every target lifts out, every optimization pass is written *once*. That is the N-by-M collapse — the exact argument the framework already makes, now with the vocabulary. The compiler framing:

- makes the value proposition legible in one sentence;
- makes the completeness claim **bounded and checkable**;
- **survives being wrong about the number** — an IR that gains an instruction is Tuesday; an ontology that gains a tenth category was never an ontology;
- stops serious people from bouncing off silently.

And it costs nothing. The metaphysics can still be true. You simply need not bet the codebase on it.

## What the nine actually buy

Set the philosophy aside and ask the engineer's question: what do nine operators give that create-read-update-delete's four, or Codd's six, do not? The answer is precise and worth more than the ontology:

**Observation, attention, evaluation, and schema change become first-class, contracted, logged operations.** That is the product. Consider what those four are in a normal system:

- A **read** is invisible to the permission model — which is exactly why access logging is always bolted on, always incomplete, always the thing that fails the audit.
- **Attention** (flagging something as worth noticing) is a boolean column and one-off code; never an operation, so never permissioned, never composed.
- **Validation** is the single most duplicated, least auditable layer in all of software — living in DB constraints *and* the object mapper *and* the controller *and* the form *and* a cron job, none speaking the same language, no two agreeing.
- **Schema change** is out of band: different tool, different model, different log, different person, different night.

Hoisting those four into the algebra means validation happens **in one place, in one vocabulary, with one audit trail**, and the schema's history lives in the same event stream as the data's. Notice that this is *exactly the original complaint*: the logic being rethought every time **was validation**. The algebra's real gift is making evaluation a citizen. Everything else is scaffolding around that.

## Turn the knife on the handle

One last move, and it is the one EO should want said to itself. Ask what would **falsify nine** — in EO's own vocabulary, because the framework already contains the answer, and the answer is brutal and beautiful:

The nine-operator closure claim is a **Pattern-grain holon.** Therefore it can never reach *established.* Therefore it must carry declared **defeat conditions** at emission. Therefore, **by its own algebra, EO is forbidden from believing its algebra is settled.**

That is not a rhetorical trick; it is the framework applied to itself, and it is the highest compliment available — a framework that licenses its own defeat can do something a framework that does not cannot, and can never learn to do. So write the defeat conditions down:

- What observation would show the ninth operator is really two?
- What would show a tenth is needed?
- What recurring construct fails to lower into the nine without distorting it? (Schank's death-by-exception, stated as a test.)

If those cannot be answered, then *nine* is not a claim — it is a **frame.** Frames are enormously useful and they are not verified, and calling one verified is the fastest possible way to lose the one reader whose respect was the point. (This is the same discipline the implementation already practices: pre-registered falsifiers that are allowed to return negative, and do — see the refused length-as-field-property build in [The Evidence](/the-evidence).)

## Whose ground

Obvious things are usually old, and that is the good news: the ground under EO has been load-tested by sixty years of people leaning on it — Simon, Koestler, Beer, Alexander, Codd, and yes Schank, who leaned and went through. The task is to know **whose** ground it is, and to **cite Schank before someone cites him at you.** The paragraph that converts the greatest liability into the greatest credibility is short:

> *This claim has been made before. It failed for four specific reasons. Here is why the one that killed it — the mapping problem — cannot kill a system whose surface syntax carries the operator.*

Write that paragraph and a reader two seconds from closing the tab decides instead that this is the first person in fifty years to read the obituary carefully.

**Nine instructions. Not nine truths.** Nine instructions, closed over a domain you can actually name, in a compiler you actually built. That is smaller. And it is so much harder to knock down.

---

### See also

- [The EO Reader: EO Implemented](/the-eo-reader) — the effect system, running
- [The Model Is the Leaf](/the-model-is-the-leaf) — the capability contract handed to the LLM
- [Signal from Noise](/signal-from-noise) · [The Evidence](/the-evidence) — how the Significance triad is grounded
- [The Three Triads](/the-triads) · [The Nine Operators](/the-nine-operators) — the algebra being reframed
- [Influences and Lineage](/influences-and-lineage) — the sixty years of ancestry
- [Ancient Astronomy & EO: Saving the Appearances](/ancient-astronomy-eo-saving-the-appearances) — the completeness-as-coverage standard, applied to the framework itself
