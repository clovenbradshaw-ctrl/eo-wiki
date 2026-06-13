# The Integral Model

**Record ID:** wiki:the-integral-model  
**DB ID:** 71  
**Status:** published  
**Updated:** 2026-04-21T00:43:05.718Z  

---

*This article is about the database model in information science. For the philosophical lineage sharing the term "integral" — Wilber's Integral Theory, Gebser's consciousness structures, Aurobindo, Spiral Dynamics — see [The Integral Lineage](/the-integral-lineage).*

The **integral model** is a [database model](https://en.wikipedia.org/wiki/Database_model) in [information science](https://en.wikipedia.org/wiki/Information_science), proposed by [Experiential Ontology](/emergent-ontology) (EO). It is an approach to managing data in which state is computed as the integral of an [append-only log](https://en.wikipedia.org/wiki/Event_sourcing) of typed transformations — the accumulation of operator events up to a chosen position — rather than stored and updated in place. A database organized in terms of the integral model is called an [Experience Engine](/experience-engine).

The name follows the convention of Codd's [relational model](https://en.wikipedia.org/wiki/Relational_model): each model is named after the mathematical object it treats as primitive. The relational model takes its name from the *relation* (a set of tuples). The integral model takes its name from the *integral* (state produced by accumulating typed transformations over a sequence). The primitives sit at different complexity orders — a relation is a set, an integral is an operation on a sequence — and the naming makes the asymmetry visible.

The integral model is proposed as a level of complexity above the relational model. Relational operations are reachable from inside the integral model as one thing its operators can do; the reverse does not hold. Relational algebra has no primitive for holding simultaneous contradictory states, treating frame changes as first-class events, or producing observer-indexed projections of state.

This article introduces the model, locates it relative to the relational model in the complexity hierarchy, specifies the architecture, and derives the consequences that follow from the substrate change.

## The naming

"Integral" lands on four registers simultaneously, all four doing work.

**Integral as in integration.** Events are the differential; replay is integration. The fold across the log is an integration operator in the strict calculus sense — it sums typed infinitesimals (operator events) across a domain (the log interval) to produce a total (the [Horizon](/experience-engine)). Where the relational model stores state as primary and computes change as a diff between snapshots, the integral model stores change as primary and computes state as the accumulated integral.

**Integral as in whole.** The relational model is a 2D projection of EO's 3×3×3 capacity ground — one face, badly drawn. The integral model is the solid. Integral in the sense of *integral domain*, *integral whole*, *integral part-of-something-larger*. Relational is a slice; integral is the ground from which the slice was taken.

**Integral as in native.** Provenance, frame history, conflict-as-data, satisfaction-as-logged-datum — all structurally integral to the substrate rather than bolted on with prosthetics. You do not add an audit log; audit is integral. You do not add temporality; temporality is integral. The fifty years of relational evolution that produced triggers, change-data-capture, bi-temporal columns, and event-sourcing layers are the system trying to make integral what the substrate refuses to accommodate.

**Integral as in integrity.** The substrate makes honesty structural rather than enforced. An append-only log cannot be rewritten without breaking the hash chain; an INS that mints a fresh anchor cannot be cloned without violating identity; a [DEF](/operators/def) that holds two simultaneous values cannot silently collapse without a logged resolution. Data integrity becomes a property of the substrate rather than a discipline imposed on top of it.

## A level of complexity above

The integral model sits one order of hierarchical complexity above the relational model. Its primitive — the typed transformation — takes relations as possible operands and produces relations as possible outputs, which means the entire relational algebra is reachable from inside the integral model as one thing its operators can do. The reverse does not hold: relational algebra has no primitive capable of holding simultaneous contradictory states ([DEF](/operators/def)), treating frame changes as first-class events ([REC](/operators/rec)), or producing observer-indexed projections ([Horizon](/experience-engine)). The relational model is what the integral model looks like when the higher-order operators are suppressed and only the Structure triad acts on stored state.

The shift is a frame change that places the relational model inside a larger structure, not an extension or a refinement at the same level. What was previously the substrate becomes one kind of object the new substrate operates on.

| Relational modelIntegral model |
| --- |
| Primitive | Relation (dyadic tuple) | Transformation (triadic operator) |
| Stored | State | Change |
| Computed | Change (as differential) | State (as accumulated integral) |
| Atomic fact | A row is true now | An operator fired at position *n* |
| Identity | Primary key | Content-addressed anchor |
| Update | Overwrite in place | Append event; replay forward |
| Audit | Bolted-on trigger | Integral to substrate |
| Conflict | Resolved on write | Held as data; resolved downstream |
| Time-travel | Snapshot table or CDC layer | Integral evaluated at prior position |
| Schema change | Migration (destructive) | REC (non-destructive; old frame retrievable) |

Codd named the relational model after the object it treats as atomic. The integral model takes its name the same way. What licenses the naming is not a symmetry between the two models but a complexity step: the integral is a higher-order operation than the relation, and the model named after it operates at the corresponding order.

## The three-tier stack

The integral model is organized into three strictly separated tiers. Every legitimate operation lives in exactly one of them; violations of the separation are the primary failure mode the architecture is designed to prevent.

### Given-Log

Append-only. Primary. Records what was *observed*, not what happened — the distinction is epistemological, and the architecture enforces it. Every entry is a phenomenon with full provenance: who observed, how, when, from where, under what frame.

The log contains operator events drawn from the vocabulary of [the nine operators](/the-nine-operators), with the exception of [NUL](/operators/nul), which is the identity function and emits nothing. The other eight — SIG, INS, SEG, CON, SYN, DEF, EVA, REC — are the only entries the log admits. Every entry is a state-changing transformation; replay reconstructs state.

The log is append-only as a commitment, not as a technical constraint. People *can* edit it. Doing so violates the honesty commitment the integral model is built around. The constraint is ethical, enforced by the hash chain and the provenance graph, but the substrate does not prevent a motivated actor from rewriting history. What the substrate does prevent is *silent* rewriting — a forged log produces a visible integrity break.

### Meant-Graph

Interpretations over the Given-Log. Each interpretation carries an explicit window — grain, bounds, framework — and traces to the log entries that ground it. No free-floating claims. If a Meant-Graph node cannot be traced to Given-Log evidence through the provenance function, it is an ungrounded assertion and violates Rule 7.

The Meant-Graph is where domain knowledge lives. The log records that an observation was made; the graph records what it means within a frame. Reframing is a REC on the graph, not a rewrite of the log. Because the graph's nodes carry window provenance, a REC on the graph does not invalidate prior interpretations — it supersedes them under an explicit frame change, and the prior frame remains queryable.

### Horizon

The current-state projection from a given position. The Horizon is not stored. It is computed by integrating the log up to a chosen point and filtering through a Meant-Graph lens. What the relational model calls *the database* is, in the integral model, one Horizon among many.

Horizons are perspectival. There is no God's-eye view. Two Horizons over the same Given-Log from different positions may legitimately disagree about what is currently the case, and the disagreement is *not* a consistency bug — it is the substrate correctly representing that availability depends on position. Rule 4 (Perspectivality) encodes this as a structural invariant.

The Horizon is a query, not a data structure. It produces no log entry when evaluated; reading is not writing. This dissolves the read/write distinction that CRUD treats as fundamental. There are emissions (operators appended to the log) and projections (horizons computed at read time), and nothing in between.

## The Significance triad as model theory

The integral model's Significance triad — DEF, EVA, REC — takes its glyphs directly from [model theory](https://en.wikipedia.org/wiki/Model_theory), and the glyphs carry their meaning across the substitution.

1. **DEF ⊢ — entailment.** The axiom-setting move. `T ⊢ φ` in model theory says φ is provable from theory T. DEF in the integral model fixes T — what types are admissible, what derivations follow, what the frame will treat as valid. DEF is a Ground operation in the Significance triad because it sets the ground the rest of the triad operates on.
2. **EVA ⊨ — satisfaction.** A relation, not a procedure. `M ⊨ φ` in model theory says the structure M makes φ true. EVA in the integral model records, per candidate state, whether the state satisfies the theory DEF has fixed. EVA is a Figure operation because it figures against the ground DEF set.
3. **REC ⊛ — frame restructure.** Both ⊢ and ⊨ presuppose a fixed theory. REC changes T. After REC, old models may no longer satisfy and old theorems may no longer derive. REC is a Pattern operation because it modifies the pattern under which ground and figure relate.

The 7 → 8 → 9 ordering is exactly: axioms → satisfaction → frame change. The relational model writes none of the three to the log. UPDATE conflates all three into a single verb and discards the distinction. The integral model emits all three as separate events with independent provenance, and every domain question that turns on "was this an EVA or a REC?" becomes answerable rather than lost.

## The wave fold

The integral model's characteristic computational signature is a **wave fold** — a fold over the Given-Log whose accumulator can carry a superposition state forward, collapsing only at projection. The pattern is not imposed on the substrate. It falls out of three commitments already listed above:

1. The Given-Log is primary. Derived state is a fold over log events; the accumulator is M-state.
2. DEF is first-class. M-state can carry `n ≥ 2` simultaneously valid values without forcing resolution on write.
3. The Horizon is projection, not mutation. Collapse happens at read, never at emit.

Combine the three and M-state is necessarily wave-shaped: superposition carried forward through an append-only fold, resolved only at measurement. The Greek letter ψ was chosen as DEF's letter precisely because the wave function is the canonical instance of this pattern; the quantum connection was recognized as structural rather than metaphorical. Strip any of the three commitments and the wave fold disappears with them, and what remains is CRUD with a nine-operator vocabulary on top rather than the integral model.

The [helix](/helix) itself is a second instance of the same signature. Three turns through the same three Mode positions at climbing Domain coordinates (−1, +1, √2) form a covering space over the 3×3 grid. Each turn carries accumulator state from the prior turn into the next; the Significance triad is the Existence triad re-encountered with Structure-mediated awareness in the carry. Same fiber, different base. Wave character in the repetition; fold character in the carry.

## Structural consequences

The substrate change produces behaviors that are either impossible or expensive in the relational model and either automatic or cheap in the integral model.

**Replay is deterministic.** A logged DEF followed by a logged EVA against the same target replays to the same Horizon regardless of when the replay is run. The integral of the log at position *n* is a pure function of the log prefix ending at *n*. Reproducibility is a property of the substrate.

**Conflict is data.** Multiple DEFs on the same target under stable identity sit in the log as a held conflict. Resolution is a downstream DEF or EVA with its own provenance. The system's awareness that it held two contradictory values — and for how long, and in which frames — is queryable rather than destroyed.

**No-cloning and no-deleting follow structurally.** Identity equals log prefix plus append-only plus INS-mints-fresh. An entity's trajectory cannot be copied — cloning the log duplicates the identity and violates uniqueness. An entity's history cannot be erased — the append-only commitment makes the log monotonic. These are not features; they are theorems.

**Schema independence.** Operators are transformation-typed, not domain-named. A field rename is a REC on the Meant-Graph, not a rewrite of the log. The log's operator classification survives arbitrary renames, restructurings, and reframings. Migrations stop being destructive events.

**Time-travel is free.** The Horizon evaluated at any prior position yields the Horizon as it was. No snapshot table, no CDC layer, no temporal extension. Time-travel is the substrate's default mode of operation, and "current" is one query among many.

**Windowed interpretation.** Every Meant-Graph node carries a window. The same Given-Log admits multiple simultaneous windows — a clinical window and an administrative window over the same patient record can produce different Horizons without either being wrong. The relational model has no substrate-level way to represent this; the integral model has no substrate-level way to avoid it.

## Relationship to prior art

The integral model inherits heavily from existing work and claims novelty only at a few specific points.

**From Codd (1970).** Views, parameterized queries, query containment, and the ANSI/SPARC three-level architecture (external schema / conceptual schema / internal schema) map almost directly onto the three-tier stack. Codd's internal schema corresponds to the Given-Log, his conceptual schema to the Meant-Graph, and his external schema to the Horizon. What Codd did not enforce was the separation between observation and interpretation, which the integral model treats as a substrate-level invariant (Rules 1–3).

**From event sourcing (Fowler, Young, 2000s).** Append-only logs, replay-to-state derivation, immutable events. The Given-Log inherits this architecture directly. What event sourcing did not have was a closed operator algebra — events in event-sourced systems are open-vocabulary and domain-named, which makes them non-portable across domains and schema-coupled. The integral model closes the vocabulary at nine.

**From Git.** Immutable commits (Given-Log), branchable state (Meant-Graph), checked-out views (Horizon), content-addressed identity (anchors). The structural parallel is close enough that Git can be read as a single-domain implementation of the integral model avant la lettre.

**What is genuinely new.** The enforcement of the Given/Meant separation as a substrate invariant. The closed nine-operator algebra as a substrate vocabulary. The model-theoretic ordering of the Significance triad (DEF → EVA → REC as ⊢ → ⊨ → ⊛). The phenomenal address and windowed interpretation as structural components of every datum. The claim that these together constitute a substrate one order of hierarchical complexity above the relational model.

## Status

The integral model is the architectural expression of EO. It is currently implemented in [EO///DB](https://github.com/clovenbradshaw-ctrl) (React/Vite/TypeScript PWA with IndexedDB and Matrix E2EE sync), in provEO's spreadsheet view, and in nl-explorer's investigative document reader. None of these implementations is feature-complete against the full architecture; they are domain-specific instantiations that validate parts of the substrate under real workloads.

The name "integral model" was adopted on 2026-04-20. Prior materials in this wiki describe components of the architecture — the Given-Log, the Meant-Graph, the Horizon, the nine operators, the helix — without naming the whole. This article is the first to name it.

The complexity-above claim relative to the relational model has not been formally proved. The structural consequences listed above are derivable from the substrate definitions and have been validated by construction in implementation. The peer-reviewed status of the framework overall remains unchanged: not peer-reviewed.
