# Why CRUD is SHIT

**Record ID:** wiki:why-crud-is-shit  
**DB ID:** 63  
**Tags:** 101  
**Keywords:** CRUD  
**Status:** published  
**Updated:** 2026-05-16T01:25:52.808Z  

---

**Semantic Homogeneity in Transformation (SHIT)**

Every transformation has three independently describable aspects: *what kind of act* occurred, *what kind of thing* was affected, and *at what grain of resolution* the transformation landed. Natural language keeps these separable — verbs carry the act, nouns carry the target, and adverbs, prepositions, and result clauses carry the resolution. "She cleared the old phone number from the record" tells you the act (definition), the target (a specific value — an Entity), and the resolution (Clearing — the trajectory from a populated state to an empty one).

CRUD gives you one word per transformation. That word carries a lossy version of the act and nothing at all about the target or the resolution. It is a 1D compression of a 3D description: **Semantic Homogeneity in Transformation**.

This article names the damage, diagnoses its structural origin, and presents the alternative.

## Part I: Why CRUD Stinks

### The three faces of transformation

Emergent Ontology describes every transformation using three independent projections, called **faces**:

**The Act Face** — what kind of transformation occurred. Nine operator types: NUL (observation), SIG (attention), INS (instantiation), SEG (segmentation), CON (connection), SYN (synthesis), DEF (definition), EVA (evaluation), REC (recontextualization). The Act Face answers: *what happened?*

**The Site Face** — what kind of thing was transformed. Nine terrain types: Void, Entity, Kind, Field, Link, Network, Atmosphere, Lens, Paradigm. The Site Face answers: *what was the target?*

**The Stance Face** — at what grain the transformation landed. Nine stances: Clearing, Dissecting, Unraveling, Tending, Binding, Cultivating, Making, Composing, Forging. The Stance Face answers: *how did it resolve?*

A well-described transformation carries all three. "She cleared the old phone number" = DEF (Act) targeting an Entity (Site) that resolved as Clearing (Resolution) — a trajectory from populated to empty. Three dimensions. Three independent pieces of information. All recoverable from a natural-language sentence.

### What CRUD carries

CRUD has four words: Create, Read, Update, Delete. Each carries a lossy version of the Act Face and nothing else.

| CRUD verb Act Face information Site Face information Stance Face information |
| --- |
| CREATE | Roughly: instantiation | None | None |
| READ | Roughly: observation | None | None |
| UPDATE | None — seven operator types collapsed into one | None | None |
| DELETE | None — four operator types collapsed into one | None | None |

CREATE and READ preserve a coarse Act signal. UPDATE and DELETE preserve nothing — the verb is so overloaded that even the Act dimension is unrecoverable.

No CRUD verb carries Site information. "An UPDATE happened" says nothing about whether the target was a specific value (Entity), a relationship (Link), an ambient condition (Atmosphere), or a schema (Paradigm).

No CRUD verb carries Resolution information. "An UPDATE happened" says nothing about whether the transformation was Dissecting (a value cut from its predecessor), Clearing (a value released), Binding (a relationship held to its target), or Forging (a new structure produced).

One dimension, lossy. Two dimensions, absent entirely. The audit log is a sequence of 1D labels describing 3D events.

### What natural language carries

Natural language keeps the three faces separable through different parts of speech:

> "The case manager **cut** the client's old phone number and **set** the new one."

1. **Act Face (verb):** DEF — a definition was made
2. **Site Face (noun phrase):** "the client's phone number" — Entity (a specific bounded particular)
3. **Stance Face (manner):** "cut the old, set the new" — Dissecting (differentiating this value from the prior one)

> "The schema was **restructured** to accommodate multiple housing statuses."

1. **Act Face (verb):** REC — the frame was changed
2. **Site Face (noun phrase):** "the schema" — Paradigm (Significance × Pattern)
3. **Stance Face (manner):** "restructured to accommodate" — Forging (producing new integrated structure)

> "They **cleared** the old address when the client moved."

1. **Act Face (verb):** DEF — a definition was made (to empty)
2. **Site Face (noun phrase):** "the old address" — Entity → Void (the Site Face trajectory moves from Figure to Ground)
3. **Stance Face (manner):** "cleared" — Clearing (the trajectory from populated to empty)

Natural language is verbose but three-dimensional. It uses different words, phrases, and constructions to keep Act, Site, and Resolution separable. The listener can reconstruct all three faces from a well-formed sentence. From "UPDATE," the listener can reconstruct nothing.

### What UPDATE actually conflates

UPDATE is one verb. It covers at least five structurally distinct operations — and the conflation is worse than a count suggests, because each operation differs on *all three faces*:

| What happened Act Site trajectory Resolution What CRUD says |
| --- |
| A field value changed | DEF | Entity → Entity | Dissecting | UPDATE |
| An entity crossed a category boundary | DEF(SEG) | Entity → Kind | Cultivating | UPDATE |
| Two sources disagreed; one was silently picked | EVA suppressed | Entity ∥ Entity | (suppressed) | UPDATE |
| The interpretive frame changed | REC | Paradigm → Paradigm | Forging | UPDATE |
| A previously cleared field was repopulated | INS | Void → Entity | Making | UPDATE |

Five different Acts. Four different Site trajectories. Four different Resolutions. One verb.

### What DELETE actually conflates

| What happened Act Site trajectory Resolution What CRUD says |
| --- |
| A value was set to empty | DEF | Entity → Void | Clearing | DELETE |
| A status changed; record persists (archive) | DEF | Entity → Entity | Dissecting | DELETE |
| A record was excluded from a view | SEG | Entity → (excluded) | Dissecting | DELETE |
| A schema element was removed | REC | Paradigm → Void | Clearing | DELETE |

Four different Acts. Three different Site trajectories. Two different Resolutions. One verb.

### What INSERT actually contains

| What happened Act Site trajectory Resolution What CRUD says |
| --- |
| A new entity comes into existence | INS | ∅ → Entity | Making | INSERT |
| A previously cleared field was repopulated | DEF | Void → Entity | Dissecting | INSERT |
| A conflict was resolved by picking one value | EVA suppressed | Entity ∥ Entity → Entity | (suppressed) | INSERT |

INSERT is the least broken of the three mutation verbs, but it still conflates genuine creation with re-population and conflict resolution — operations that differ on all three faces.

### What READ actually is

READ is the odd verb out. The other three are mutations. READ observes. CRUD bundles observation with three mutation verbs as though they were peers, because CRUD is organized around the lifecycle of a tuple — and from the tuple's perspective, "I was looked at" feels like an event alongside "I was created" and "I was changed."

From a transformation algebra's perspective, observation is not a peer of mutation. It is the *precondition*. The capacity to encounter something without changing it — the pass-through, the identity function on state — is the ground on which all transformation stands.

### Why only four?

CRUD is organized around the **lifecycle of a tuple**. The tuple is the protagonist. The four verbs mark phases of the protagonist's biography: appearance (CREATE), observation (READ), persistence-through-change (UPDATE), disappearance (DELETE).

That's a 1D trajectory through a 3D space. The one dimension it preserves — badly — is the Act dimension. The two dimensions it loses entirely are Site and Resolution. From the tuple's perspective, there is no Site (the tuple doesn't know what kind of thing it is) and no Resolution (the tuple doesn't know at what grain it was affected). All the tuple can see is: *I appeared, I was looked at, I changed, I disappeared.*

Seven operators absorbed into one lifecycle phase (UPDATE). Four operators absorbed into another (DELETE). The 3D structure of transformation is invisible from the 1D lifecycle trajectory.

### The three destructions

CRUD's four verbs produce three systematic destructions, one per face:

**Act collapse.** Nine operator types compressed into four labels. The information that distinguishes a definition from an evaluation from a segmentation from a recontextualization is destroyed at the moment of emission.

**Site erasure.** Zero information about what kind of thing was affected. Was it a specific value (Entity)? A relationship (Link)? A schema (Paradigm)? An ambient condition (Atmosphere)? The verb cannot say. Every target looks the same.

**Resolution erasure.** Zero information about how the transformation landed. Was a value cut from its predecessor (Dissecting)? Released (Clearing)? Was a new structure forged (Forging)? A relationship held (Binding)? The verb cannot say. Every resolution looks the same.

The result is **Semantic Homogeneity in Transformation**: all change looks the same on all three dimensions that matter.

And this explains the comments field. The caseworker writes three-dimensional natural language into the comments field because the system only offers one-dimensional verbs. The overflow isn't about missing operators alone. It's about missing dimensions. The system can't hold what the caseworker knows because it literally lacks the dimensionality to express it.

## Part II: The Nine Operators

### Derivation

The nine operators fall out of two independent questions, each with three exhaustive answers.

**Question 1: Where does the transformation operate?**

It operates on **existence** (whether things are), on **structure** (how things connect), or on **significance** (what things mean). These three domains are dependency-ordered: structure presupposes existence, significance presupposes structure.

**Question 2: How does the transformation act?**

It **differentiates** (separates, distinguishes), **relates** (connects, binds), or **generates** (produces, synthesizes).

Three domains × three modes = nine operators. Each names a unique combination of where a transformation occurs and how it acts. The algebra is closed: every possible transformation decomposes into these nine, and no operator can be removed without losing expressiveness. This closure is computationally verified against Codd's relational algebra.

### The operators

#### Existence — whether things are

**NUL** (∅) — *Non-transformation.* The system encounters something and does not change it. State in, same state out. The identity function. NUL is observation — the ground capacity that makes all subsequent transformation meaningful. NUL does not produce enduring log entries because it does not change state. It is what CRUD calls READ, recognized as the precondition for transformation rather than a peer of it.

**SIG** (○) — *Attention.* Direct focus. "This one matters right now." SIG is ephemeral — a spotlight, not a foundation. It does not create enduring structure and does not carry values. SIG sets the subject of the sentence: everything that follows predicates on it until attention shifts. Like NUL, SIG does not produce enduring log entries.

**INS** (●) — *Instantiation.* Establish *that* a thing is — create enduring identity. INS does not establish *what* a thing is (that is DEF). INS mints anchors — content-addressed identifiers that give each entity a stable, frame-independent address. INS is the threshold: every operator from INS onward produces enduring log entries, because every operator from INS onward carries the capacity to mint identity.

#### Structure — how things connect

**SEG** (｜) — *Segmentation.* Draw a boundary. Partition, filter, split, establish the line between inside and outside. SEG is also the fundamental query operator: filtering is boundary-drawing.

**CON** (⋈) — *Connection.* Create a relationship across a boundary that SEG has established. In queries, CON is the JOIN.

**SYN** (△) — *Synthesis.* Produce a derived whole that exceeds the sum of its parts. No CRUD verb for this. A merge is not an INSERT and not an UPDATE. It is its own kind of change. In queries, SYN is GROUP BY.

#### Significance — what things mean

**DEF** (⊢) — *Definition.* Establish what holds within a stable interpretive frame. Set terms, define values, determine what follows. DEF is the workhorse: a diagnosis established, a status changed, a measurement recorded, a value set. The glyph is ⊢ (entailment). When a DEF resolves to Void on the Site Face — the value moves from populated to empty — that's what natural language calls "clearing." The act is still DEF. The clearing is the Site Face trajectory, not the operator.

**EVA** (⊨) — *Evaluation.* Render judgment by testing a particular against a general. DEF establishes the terms; EVA assesses whether something satisfies them. The glyph is ⊨ (the satisfaction relation). An immune cell testing a molecule against its self/non-self definition is performing EVA. In data systems, EVA is the projection rule that determines what the Horizon shows when multiple DEFs exist on the same path.

**REC** (⊛) — *Recontextualization.* Transform the interpretive frame itself. Not a change within the frame but a change of the frame. A caterpillar is not a butterfly with different features — it is a different kind of thing. REC fires when DEF's terms and EVA's judgments prove inadequate — when the problem is not the content or the assessment but the frame within which both operate.

### Absence is a trajectory, not an operator

When a field is cleared, three things are true simultaneously — one per face:

1. **Act Face:** DEF fired. A definition was made.
2. **Site Face:** The terrain moved from Entity to Void. The *result* is emptiness.
3. **Stance Face:** The stance is Clearing. The grain of engagement is letting go.

"Cleared" is not a state stored in the log. It is a **trajectory read off the log** — the movement from a DEF that resolved to Entity (a populated value) to a DEF that resolved to Void (an empty slot). The app observes two log entries and names the movement:

| Log trajectory Site Face movement What the app calls it |
| --- |
| No DEF → DEF at Entity | ∅ → Entity | "Populated" — first binding |
| DEF at Entity → DEF at Entity | Entity → Entity | "Rebound" — new value at same path |
| DEF at Entity → DEF at Void | Entity → Void | "Cleared" — binding released |
| DEF at Entity → DEF at Kind | Entity → Kind | "Generalized" — value replaced by a rule |

All DEF. All the same operator. The distinctions are Site Face trajectories — what the target looks like before and after. The app reads them, names them, never stores the names.

This dissolves the three-NULL problem. The three absence states are not stored markers but patterns in operator history:

| State What the log shows How the app detects it |
| --- |
| **Cleared** | DEF at Entity, then DEF at Void | Most recent DEF resolves to Void; a prior DEF resolved to Entity |
| **Unknown** | INS exists, no DEF | The slot was created but no value has been defined |
| **Never-set** | No INS | The slot doesn't exist. The question is meaningless |

Codd recognized in 1990 that one NULL was wrong and proposed two sub-types. The operator algebra dissolves the problem rather than subdividing it: the three states were always patterns in which operators had fired. You just couldn't see that from inside a system with four verbs and no log.

### The helix

The nine operators are dependency-ordered in a unique sequence — the **helix**:

> NUL → SIG → INS → SEG → CON → SYN → DEF → EVA → REC

Each position *contains* every capacity below it. NUL can encounter. SIG can encounter + direct attention. INS can encounter + direct attention + create enduring identity. And so on, up to REC, which can do everything.

This cumulative structure explains why NUL and SIG don't log (below INS — they lack the capacity to mint enduring identity), why every logged operation has an anchor (it's at position 3 or above), and why the helix is a dependency ordering on capacities rather than an execution sequence.

CRUD has no equivalent. Its four verbs are a bag with no ordering and no presupposition.

### The complete replacement

The nine operators don't annotate CRUD. They replace it. Every verb maps, with no remainder:

| CRUD verb Operator replacement What's gained |
| --- |
| **CREATE** | INS | Genuine instantiation. Permanent anchor. Distinguished from re-instantiation |
| **READ** | NUL / the Horizon function | Observation is the ground capacity. Querying is projection via SEG, CON, SYN as lenses |
| **UPDATE** | DEF, EVA, REC, SIG, SEG, CON, or SYN | Seven operators replace one verb. Each carries type information. Site and Resolution are preserved |
| **DELETE** | DEF with empty result, often composed with SEG | The *kind* of absence is preserved as a Site Face trajectory. No history erased |

An API built on this has seven emitting endpoints plus observation:

GET  /horizon/{target}          → Projection. No log entryPOST /ops/ins                   → instantiatePOST /ops/seg                   → draw / dissolve boundaryPOST /ops/con                   → connect / severPOST /ops/syn                   → merge / decomposePOST /ops/def                   → define value / clear valuePOST /ops/eva                   → evaluate / apply projection rulePOST /ops/rec                   → reframeGET for observation. POST for transformation. NUL is the GET itself. SIG is carried as session state — the agent's attention context.

### What the nine fix

| CRUD defect EO remedy |
| --- |
| **Act collapse** (nine types → four verbs) | Closed algebra of nine operators. Each transformation gets exactly one type |
| **Site erasure** (no information about target type) | Three-face notation preserves what kind of thing was affected. Site Face trajectories are readable from the log |
| **Resolution erasure** (no information about how it landed) | Stance Face stances are recoverable from Act + Site. Clearing, Binding, Forging, Cultivating — all distinguishable |
| **History erasure** (UPDATE overwrites, DELETE removes) | Append-only log. Every operator is an entry. Prior states reconstructed by replay |
| **Flat verb space** (no ordering, no presupposition) | Helix dependency ordering. Operators accumulate capacity |
| **No evaluation representation** (last-write-wins) | EVA applies projection rules. Multiple DEFs coexist in the log |
| **Schema changes outside the model** | REC makes frame transformation a first-class log entry |
| **No merge/split primitives** | SYN and SEG are operators, not workarounds |
| **Absence as NULL** (three kinds collapsed to one) | Absence is a Site Face trajectory. Cleared, Unknown, Never-set detected from operator history |
| **Observation conflated with mutation** | NUL is the ground capacity. Observation is the precondition, not a peer |

### The closure claim

The claim is not that nine operators are useful. The claim is that nine operators are **sufficient and necessary**. Every transformation — in any domain, in any system, at any scale — decomposes into one of these nine or a composition of them. And removing any single operator from the set produces a transformation that the remaining eight cannot express.

This is the domain-invariance claim. It is supported by the 3×3 derivation (three exhaustive domains × three exhaustive modes), by computational verification against the relational model, and by independent structural witnesses in developmental biology and cross-linguistic clause analysis. It has not been independently stress-tested by adversarial critics, and that remains the framework's most important next step.
