# The Experience Engine

**Record ID:** wiki:the-experience-engine  
**DB ID:** 44  
**Status:** published  
**Updated:** 2026-06-13T21:59:33.980Z  

---

## Definition

The Experience Engine is a formal specification for systems that process raw experience into interpretation through perspectival context. It specifies what an honest record requires — one that preserves the distinction between what happened, how it connects, and what it means.

It is defined as a tuple:

> **𝓔** = (*G*, *S*, *M*, π, γ, σ)

where:

1. ***G*** is the **Given-Log**: what happened.
2. ***S*** is the **Structure-Lattice**: how what happened is connected.
3. ***M*** is the **Meant-Graph**: what it means.
4. **π** is the **provenance function**: maps interpretations to their grounding in raw experience.
5. **γ** is the **availability function**: maps positions in the Structure-Lattice to accessible entries and interpretations.
6. **σ** is the **supersession function**: maps position-interpretation pairs to interpretations they may override.

The three data structures correspond to the three domains of the capacity ground:

| ComponentDomainQuestion |
| --- |
| Given-Log (*G*) | Existence | *Whether things are* |
| Structure-Lattice (*S*) | Structure | *How things connect* |
| Meant-Graph (*M*) | Significance | *What things mean* |

The three functions collectively constitute the **Horizon** — the act of looking. The Horizon is not a data structure. It is a projection: an observation of a query run against *G*, *S*, and *M* from a position within *S*. Every observation instantiates a projection. There is no unmediated access.</p><h2>Truthfulness: What the Bar Guarantees</h2><p>The recursion has a corollary about reliability. The functions to the right of the bar need not be reliable. They may be approximate, lossy, even prone to fabrication, and the bar still holds, because the functions hold nothing. A function reads the stores, weighs, and returns a projection. It does not write. A projection that is wrong is a wrong reading, not a corrupted record. The given is untouched, and the next reading begins clean from the same stores.</p><p>This is what lets an honest system place a fallible projector to the right of the bar without surrendering the record to it. The projector may be a person, a heuristic, or a language model. It may propose, phrase, connect, and judge. It may not emit. The one discipline that keeps the system honest is that nothing crosses the bar leftward except by emission, and emission is reserved for what was given, not for what was inferred. A claim the projector cannot ground in a store is either bound to the store that carries it or marked absent. There is no third move.</p><p>Truthfulness is therefore not a property the functions achieve. It is a property the bar protects. The three Significance rules state the same thing from the interpretation side: the Meant-Graph is grounded (Rule 7, DEF), tested (Rule 8, EVA), and revisable (Rule 9, REC). Any single projection can be wrong and later superseded. What cannot happen, while the bar holds, is for a wrong projection to lower the integrity of the given it was projected from. Each reading is defeasible. The ground it reads is not.</p><p>A system built this way does not arrive at complete truthfulness. It approaches it. The record accumulates only witnessed emission, while the readings over that record are corrected without limit through the DEF to EVA to REC cycle. The asymptote is approached from below, and the bar is why the approach never reverses: no function-side error can become a store-side fact. Defeasibility keeps the door open at the top; the bar keeps the floor from sinking at the bottom. Between them the system can only grow more truthful over time, never less.

## The Given-Log (*G*)

### Specification

An append-only sequence of raw experience records. No record is ever edited, overwritten, or deleted. The log grows monotonically. Entries are typed operator emissions — INS through REC, the seven emitting operators. NUL and SIG do not produce Given-Log entries: NUL is the identity function on state, and SIG is ephemeral attention without enduring structure.

### Epistemic status: phenomena, not noumena

Every entry in the Given-Log is a **phenomenon** in the Kantian sense: an appearance of something to an observer operating within a particular frame, not the thing-in-itself. The log does not record reality as it is independent of observation. It records reality as it appeared — to a specific agent, in a specific mode, within a specific context, at a specific time.

This is why the record fields are not administrative metadata. They are the epistemic constitution of the entry:

1. **Anchor** — the content-addressed identifier minted by INS. Frame-independent.
2. **Timestamp** — when the observation occurred.
3. **Agent** — whose observation this is. No observation is observer-free.
4. **Mode of givenness** — how it was encountered: perceived, reported, measured, received.
5. **Phenomenal content** — what was observed.
6. **Context envelope** — the frame within which the observation makes sense.

These fields are not optional. An emission missing any of them is not a phenomenon and cannot enter G — it would be a context collapse.

### Three absence states

The log distinguishes three structurally distinct kinds of empty cell, detected by operator history on a path:

| StateDetectionWhat's in the log |
| --- |
| **Cleared** | Most recent DEF on this path has empty operand | `DEF(field, "")` with provenance |
| **Unknown** | INS exists for the field at schema level, no DEF for this entity | INS entry exists, no DEF entry |
| **Never-set** | No INS for this path in this context | The log is silent |

No NUL sub-types. No A-marks or I-marks. The log structure is the distinction. SQL collapses all three into a single NULL; Codd recognized two of them in 1990 and proposed A-mark and I-mark; the industry rejected both. The Experience Engine carries all three because they interact with the Structure-Lattice and the Meant-Graph differently and have different replay semantics.

## The Structure-Lattice (*S*)

### Specification

A partially ordered set of relationships between Given-Log entries. Encodes boundaries, connections, and irreducible composites. Simultaneously defines the space of valid observation positions: where an observer can stand determines what they can see, and where they can stand is determined by the structure.

### Mathematical character

A lattice — richer than a graph, which encodes only pairwise connections. The Structure-Lattice holds:

1. **Partitions** (SEG): boundaries that divide entries into regions.
2. **Joins** (CON): connections across boundaries.
3. **Composites** (SYN): irreducible wholes — higher-order relationships not decomposable into pairwise connections.

The partial ordering encodes refinement: a more specific position sees a subset of what a more general position sees.

The Structure-Lattice also defines the space of valid windows for Given-Log reads. A window is a bounded region of the lattice; its grain (SEG), connectivity (CON), and composite structure (SYN) determine what trajectory signatures are recoverable from it.

### The Horizon as position in the lattice

The structure of relationships between entries is the space of possible perspectives. These are not two things. Where you can stand to observe is determined by how the system is connected — the way the architecture of a building determines the possible viewpoints within it.

The three functions are operations within this lattice:

1. **γ** (availability): from this position, what is visible? Determined by lattice topology.
2. **π** (provenance): from this interpretation, what is the chain back to raw experience? A path through the lattice.
3. **σ** (supersession): from this position, which interpretations override which? Determined by lattice ordering and available evidence.

## The Meant-Graph (*M*)

### Specification

A mutable space of interpretations. Every interpretation carries:

1. A link to the Given-Log entries it is grounded in (via π)
2. A position in the Structure-Lattice from which it was produced
3. A window specification — the grain and bounds of the Given-Log read that produced it
4. Content (what the interpretation asserts)
5. Supersession relationships to other interpretations

Unlike the Given-Log, the Meant-Graph can be restructured. Interpretations can be added, superseded, recontextualized, and retired. The provenance chain must remain intact for audit.

### Mathematical character

Three-dimensional. Each interpretation occupies a position in the capacity ground — a coordinate specifying Mode (how it was derived), Domain (what domain it addresses), and Object (what it targets). The Meant-Graph is a populated capacity ground: the 27-cell space with interpretations at specific coordinates.

If DEF is operative, an interpretation may occupy a superposition of positions — holding multiple coordinates simultaneously without resolution.

Entity-type attributions (emanon, protogon, holon) live in the Meant-Graph, not the Given-Log. They are interpretations grounded in a window of raw experience, not properties of individual records.

## The Horizon

The Horizon is the act of looking — a projection over (G, S, M) from a position in S. It produces no log entries because nothing changes. There are no reads and writes in the Experience Engine. There are **emissions** (operators INS through REC appended to G) and **projections** (the Horizon function computing what's visible from a position).

Querying is structural operators used as lenses, not as emissions:

| SQL clauseStructural lens |
| --- |
| `SELECT` | The Horizon function itself — the act of projecting |
| `WHERE` | SEG — boundary constraining what's visible |
| `JOIN` | CON — connection across which the projection reaches |
| `GROUP BY` | SYN — synthesis collapsing entities into aggregates |
| `HAVING` | SEG applied to a SYN — boundary on a synthesis |
| `ORDER BY` | SEG — positional partitioning of a sequence |

Operators inside emissions change state. Operators inside projections describe the geometry of observation. The difference is context, not operator.

### EVA-totality at projection

When multiple DEFs exist on the same path, the Horizon must apply an EVA rule to determine what the projection shows. Available strategies include `latest`, `all_by_source`, `priority`, `formula`, and `manual`. The rule itself is a first-class logged event; changing the rule is another EVA. A path with competing DEFs and no EVA cannot be projected — the system must surface the missing EVA rather than guess at resolution.

## The Nine Rules

Nine rules govern the system, organized in three triads that mirror the operator structure.

### Given-Conformant (Experiential Integrity)

**Rule 1 — Distinction.** Given and Meant are exhaustive and exclusive categories of typed events. Every record is either a typed operator emission in G or a typed interpretation in M grounded in G via π. Untyped data cannot enter the architecture. *Violation: Categorical Confusion.*

**Rule 2 — Impenetrability.** Given derives only from Given, and only through operator emission. No interpretation may fabricate raw experience; no path may reach G except by emitting one of the nine operators with its helix-prior dependencies already present in the log. *Violation: Confabulation / Bypass / Helix Skip.*

**Rule 3 — Ineliminability (The Anti-Gaslighting Axiom).** Raw experience persists through all operations. The Given-Log is append-only. The past actually happened. *Violation: Gaslighting.*

### Structure-Conformant (Perspectival Coherence)

**Rule 4 — Perspectivality (The Anti-Omniscience Axiom).** There is no God's-eye view. All availability is mediated by position in the Structure-Lattice, and every emission to G records the position from which it was made — agent, mode, frame, time, context envelope. Anonymous or default-positioned emissions are not phenomena and cannot enter G. *Violation: Context Collapse.*

**Rule 5 — Restrictivity.** Refinement only restricts availability. A more specific position sees a subset, never a superset. *Violation: Foreclosure Violation.*

**Rule 6 — Coherence.** Availability is consistent across overlapping positions. Where two positions both see a Given-Log entry, they agree on its existence. Where multiple DEFs exist on a path, projection from any position applies the same EVA rule. A path with competing DEFs and no EVA cannot be projected. *Violation: Perspectival Fracture.*

### Meant-Conformant (Interpretive Accountability)

**Rule 7 — Groundedness.** Every interpretation traces to raw experience through π. π is single-valued for any interpretation at a given position, preserved across REC, and composable along chains of interpretation. No free-floating interpretations and no ambiguously-grounded ones. *Violation: Ungrounded Assertion.*

**Rule 8 — Determinacy.** Meaning is what survives transformation under all legitimate operations — not essence, but equivalence class. No operation may eliminate competing observations from the equivalence class. Conflict between sources is preserved as DEF and resolved by EVA, never by silent overwrite at capture. *Violation: Semantic Drift / Silent Resolution.*

**Rule 9 — Defeasibility.** No interpretation in M is globally immune to supersession at runtime. ¬∃ m* immune to supersession holds at the M-layer. The integrity rules governing the architecture are themselves revisable, but only at the framework level through versioned specification REC, not through M-layer interpretation. The architecture eats its own dogfood — rule revision is itself an operator emission, just at the framework layer. *Violation: Dogmatism / Layer Confusion.*

## *Recursion: The Functions Are Themselves an Engine*

*The tuple presents π, γ, and σ as given. In any implementation they are not given. They are parameterized by conventions: which surfaces count as admissible, which tokens mark attribution, which boundaries segment a register, which sign a pronoun carries. These parameters are not constants of the medium, and they are not contents of G, S, or M. They are learned, they accumulate, and they are read through a frame.*

*The proposal: the governing functions of any Experience Engine are projections of another Experience Engine. The conventions live on their own append-only ledger. That ledger is a Given-Log whose entries are rule events, shipped seeds and induced deltas alike. Its Structure-Lattice is the pack structure: which buckets exist and how they merge, by accumulation and never by overwrite. Its Meant-Graph is the active ruleset, projected under the current frame. The outer engine's functions read their parameters from the inner engine's projection. Formally: for any 𝓔 = ⟨G, S, M | π, γ, σ⟩ there exists 𝓔′ such that π, γ, and σ are projections of 𝓔′.*

*Admission is the same at both levels. A convention enters the inner Given-Log the way an entity enters the outer one: sighted twice, then kept. The witness is small but exact. A reading engine implementing this specification induced the attribution verb “says” from the typography of the quote-attribution slot, basis `slot_sightings: 2`, and committed it to its rules ledger with full provenance. The admission gate operating one level up, on the reader's own rules. Nobody designed that symmetry in. It fell out of building both layers honestly.*

*The recursion does not regress without end. It terminates in the medium constants: parameters that are contents of no engine because they are the shape of the tuple itself. Everything above that floor is convention, and every convention can name the ledger event that admitted it.*

*This section is Rule 9 made mechanical. Rule 9 scopes rule revision to the framework layer through versioned ⊛REC. In implementation, that versioned ⊛REC is an ordinary emission into the inner engine's Given-Log. The architecture eats its own dogfood because both layers cook from the same recipe.*

**Epistemic status.* The correspondence between the three stores and the three triads is established by the reverse derivation of the operators from the tuple. The recursion clause is empirically suggestive on a single witness, the induced attribution verb above. The test that would move it: induce conventions across a multilingual corpus and check whether the inner engine exhibits the same triadic structure the outer one does. Until that test runs, this section is a proposal carrying one data point.*

## Implementation Surface

The integrity rules govern what the data must be. They do not, by themselves, prevent an implementation from exposing a low-level interface that bypasses the rules — a "raw write" path that appends to G without going through the operator algebra, or a query path that returns derived state without applying EVA at projection. This concern is handled by the **EO Compliance Specification** (`wiki:eo-compliance-spec`), a sibling document that governs the surface area an implementation may expose. The two layers are required together: integrity rules without compliance leave room for syntax-survives-while-semantics-erodes; compliance without integrity rules has nothing to enforce.

The cautionary precedent is Codd's. He published twelve rules in 1985 specifying what a relational system must do; the market preserved the syntax and quietly gutted the semantics. The Experience Engine treats this as a structural warning. The integrity rules are necessary; they are not sufficient on their own to prevent the same trajectory.

## Relationship to Prior Art

### What is standard

**Codd's relational model (1970).** Views, parameterized queries, query containment, and the ANSI/SPARC three-level architecture (external schema / conceptual schema / internal schema) provide the structural precedent. The internal schema corresponds to the Given-Log, the conceptual schema to the Structure-Lattice, and the external schema to the Horizon. Codd had the levels in the 1970s.

**Event sourcing (Fowler, Young).** Append-only logs, replay-to-state derivation, immutable events. The Given-Log inherits this architecture directly.

**Git.** Immutable commits, branchable state, checked-out views. The structural parallel is close: commits as INS-minted entries with content-addressed identity, branches as alternative Meant-Graph trajectories grounded in the same Given-Log.

### What is not standard

**Rules 1–3.** The enforced separation between raw experience and interpretation, the prohibition on fabrication of experience by interpretation, and the append-only commitment have no equivalent in the relational model. SQL permits UPDATE and DELETE on historical records. SQL permits a row representing an interpretation to be structurally indistinguishable from a row representing a measurement. The relational model does not enforce the Given/Meant distinction.

**Operator-completeness in Rule 1 and the architectural-bypass clause in Rule 2.** Codd's Rule 0 (a relational system must use its relational facilities, and only those) is the closest analog. The Experience Engine extends the principle: not just that the system uses operator emissions, but that nothing else can enter G. The closed nine-operator algebra is enforced as architecture, not described as math.

**The three NUL states.** Codd recognized two in 1990. The industry rejected both. The Experience Engine carries three, distinguished by operator history rather than by NUL sub-types.

**The phenomenal-address mandate in Rule 4.** No relational system requires position to be captured at write time. The Experience Engine treats observer position as constitutive of what the entry is — without it, the entry is not a phenomenon and cannot exist in G.

**EVA-totality in Rule 6.** Standard relational systems silently apply latest-wins or last-writer-wins at the storage layer. The Experience Engine surfaces missing EVA at projection rather than guessing.

**Conflict preservation in Rule 8.** Multi-source conflict resolution is treated as a capture-time concern in CDC and event-streaming systems. The Experience Engine treats conflict as data, preserves competing writes as DEF, and resolves them at projection via EVA. Silent resolution at capture is a Determinacy violation.

**Rule 9.** Defeasibility is encoded as a system invariant rather than stated as a methodological norm. Combined with the framework-layer scoping, the rules themselves are revisable through versioned REC without losing the anti-dogmatism commitment at the M-layer.

## Storage Architectures

Experience Engine systems can be implemented under two broad storage strategies.

### Dual-database architecture

The most common deployment pattern maintains two stores:

1. **Event stream** — append-only log of all operator emissions. Source of truth. Never mutated.
2. **Current state store** — a projected view of the current state of all entities, derived by replaying the event stream. This is a cache. It can be rebuilt from the event stream at any time.

Advantages: fast reads from current state store; event stream remains authoritative; projections can be tuned per consumer; replay can rebuild projections after bugs or policy changes.

Disadvantages: two systems to maintain; projection lag under high write load; projection logic must stay consistent with event schema.

When to use: systems with high read frequency, latency requirements that cannot tolerate replay at query time, or multiple consumers with different access patterns.

### Stream-only architecture

A stream-only system maintains only the event stream. Current state is computed by replaying the log on demand.

Advantages: single source of truth with no synchronization concern; no projection lag; maximum temporal query flexibility; simpler operational model.

Disadvantages: read latency scales with log length unless indexed; requires efficient replay infrastructure; not suitable for high-frequency random reads without caching.

When to use: systems where the event history is the primary product (audit systems, compliance records, provenance tracking), or where temporal queries are more important than current-state read latency.

### What replay unlocks

**Point-in-time reconstruction.** Replay the log to any timestamp to see the exact state of any entity at that moment. No special audit tables, no prior instrumentation.

**Retroactive policy application.** If an EVA rule changes, replay the log through the new rule to produce a corrected current state. The historical log is unchanged; the projection changes.

**Cross-source reconciliation.** DEF events record every conflict; resolution can be changed by re-projecting with different EVA policy.

**Causality tracing.** Because operators nest, replay can answer causal questions: not just "what is the current value?" but "what sequence of transformations produced it, by whom, under what authority?"

**Bug correction without data loss.** A faulty projection can be corrected by replaying the log with corrected projection logic. The Given-Log itself is never edited.

## Truth as Limit

The Experience Engine makes a claim that deserves its own section: truth in EO is not a value the system holds. It is a limit the system approaches.

Every Given-Log entry is a phenomenon — a situated observation from a specific position in a specific mode. The Meant-Graph accumulates interpretations grounded in those observations. As more observations arrive from more positions, frames are tested through DEF, and frames are restructured through REC, the Meant-Graph converges. The question is what it converges toward.

The answer is the limit that the sequence of situated observations defines — approached asymptotically, never occupied. The epsilon-delta definition applies: for any desired precision ε, there exists a depth of converging observation δ that gets within ε of the limit. The limit is real — it has mathematical existence — but no finite process reaches it.

The Given-Log's append-only immutability is not a truth-preservation guarantee. What cannot be erased is the fact that this observation occurred, from this position, in this mode. Whether the observation reflects observer-independent reality is not asserted, cannot be stored, and is not the system's concern. That adjudication belongs to the Meant-Graph, where it remains defeasible at runtime under Rule 9.
