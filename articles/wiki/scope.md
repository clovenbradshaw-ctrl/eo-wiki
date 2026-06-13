# Targeting and Scoping

**Record ID:** wiki:scope  
**DB ID:** 37  
**Status:** draft  
**Updated:** 2026-03-26T22:16:41.758Z  

---

Every EO operation has the form `OP(target, operand)`. The operator is fixed (one of nine). The operand is the material. The target is the thing being transformed. Two questions arise about the target position:

**Targeting** — *how* do you identify the target? Nine reference types, organized by Domain ⤫ Mode, describe the complete space of strategies for arriving at a target within a frame.

**Scoping** — *how broad* is the operation? The level in a hierarchy where the operator acts — field, record, collection, system — determines the reach of the transformation.

EO does not prescribe a single targeting syntax. It describes the complete space of how targets can be identified. Applications choose which reference strategies to implement. The framework maps the territory.

---

## Targeting: The Nine Reference Types

Identifying a target is itself a transformation — an act of resolving what the operator acts on from a field of possibilities. As such, it has a Domain (what kind of identification) and a Mode (how you perform it). This produces nine reference types, arranged in three triads.

### Existence References — Identifying by *Whether It Exists*

These references operate at the level of bare existence. They do not describe the target or locate it within a structure. They establish that there is (or isn't) a thing to point to.

**By absence (Differentiate ⤫ Existence).** Identifying the target by what is *not there*. The empty slot. The removed referral. The cleared field. In a log-based system, this is how you reference the targets of NUL events — the entity is defined by its having been withdrawn.

`clients.james.referrals.mental_health:null`

**By distinction (Relate ⤫ Existence).** The bare minimum of singling out. A type:instance pair — "a client, specifically James." No path through containers, no property filters, just the minimum viable reference that separates this thing from everything else.

`client:james`

**By anchor (Generating ⤫ Existence).** The content-addressed hash. The entity produces its own identifier from what it is. Frame-independent, immutable, opaque. This is INS-shaped reference — the anchor is minted at the moment of instantiation and never changes. When you need a reference that survives frame changes, reorganizations, and renaming, the anchor is the only option.

`@a3f2b7c9`

### Structure References — Identifying by *How Entities Connect*

These references operate at the level of relationship and arrangement. They locate the target within a web of connections — containment, linkage, or composition.

**By containment (Differentiate ⤫ Structure).** The hierarchical path. Each segment narrows by cutting through a boundary into a smaller container. This is what dot notation typically expresses, and it is SEG-shaped — each dot is a partition boundary you are crossing.

`dr_reyes.tuesday_clinic.patient_0471.dosage`

**By relationship (Relate ⤫ Structure).** Through a CON link. You do not know the target's ID or its position in a hierarchy. You know it is connected to something you already have by a specific relationship. Clinical systems use this constantly: "the client's emergency contact," "the referring provider," "James's sister."

`james->sister` `patient_0471->provider`

**By composition (Generating ⤫ Structure).** A derived reference. The target does not exist as a stored entity — it is generated from a computation across other entities. Aggregations, rollups, summary metrics. SYN-shaped reference: the target is a whole produced from parts.

`SUM(team_northwest.clients.*.sessions.count)` `AVG(provider.reyes.clients.*.outcomes.score)`

### Significance References — Identifying by *What Entities Mean*

These references operate at the level of significance. They pick out the target by its state, its properties, or its name — by what it means within the active frame.

**By state (Differentiate ⤫ Significance).** Filtering by current condition. DEF-shaped reference — you are identifying the target by which state it occupies. "The active ones." "The one that changed." "The open cases."

`clients[status=active]` `referrals[state=open]`

**By constraint (Relate ⤫ Significance).** Multiple simultaneous filters held together. EVA-shaped reference — you are holding multiple conditions under simultaneous evaluation and the target is their intersection. This is closest to SQL's WHERE clause, and it is Codd's great contribution: constraint-based, unordered, storage-independent identification.

`clients[age<18, provider=reyes, status=active]` `sessions[date=2024-03-12, type=intake, clinic=tuesday]`

**By name (Generating ⤫ Significance).** The human-assigned label. The sign someone produced within a frame to mean this thing. REC-shaped reference because the name is an artifact of how the system was organized — rename the client, the name changes, the anchor doesn't. Names are meaningful, portable, ambiguous, and political.

`"James Smith"` `"Northwest Team"`

---

## All Roads to the Same Target

The nine reference types are not competing alternatives. They are different strategies for arriving at the same place. A single target can be identified by any of them:

```
EVA(@a3f2b7c9, "stable")                                        — by anchor
EVA(dr_reyes.tuesday_clinic.patient_0471.housing, "stable")     — by containment
EVA(james->caseworker->caseload[type=housing], "stable")         — by link + filter
EVA(clients[name="james", provider="reyes"].housing, "stable")   — by constraint
```

All four reach the same target. The anchor is frame-independent. The containment path assumes a hierarchy. The link assumes a relationship graph. The constraint assumes queryable properties. Each makes different information explicit and leaves different information implicit.

EO does not prefer one over another. The application determines which reference types it supports, based on its data model, its users, and its frame. A clinical case management system might primarily use containment paths and relationship links. A financial reporting system might primarily use constraints and compositions. An audit log might use anchors exclusively. The framework describes what reference *is* — the application decides what reference *looks like*.

---

## Targeting as Instantiation

Targeting does more than find existing entities. A reference resolution can itself become the operand of an INS — crossing something from potential into the particular.

In the relational model, `SELECT * FROM clients WHERE status = 'active'` returns a result set. It is ephemeral. It exists for the duration of the query, then evaporates. It has no identity, no history, no anchor. Run the same query tomorrow, you get a different set — and there is no record that yesterday's set ever existed. You can save it as a VIEW, but a view is a saved query, not an entity. It has no anchor. It doesn't appear in the log.

EO can do something the relational model structurally cannot: collapse a reference resolution into a new entity.

```
INS(cohorts.active_march_2024, clients[status=active])
```

Now that set is an entity. It has an anchor. It is in the log. It has a birthday. Tomorrow's active clients are a *different* entity with a *different* anchor. The two can be compared, linked, differenced — because they are two things, not two runs of the same query.

The relational model can approximate this with `CREATE TABLE active_march AS SELECT...` but the copy loses its lineage. Where did this table come from? Which query produced it? Under which definition of "active"? If someone later changes the definition — a REC — the snapshot doesn't know it was made under the old frame.

EO's log preserves all of it. The INS records what was instantiated. The reference strategy is in the target position. The frame is in the context. If the definition of "active" later changes, the REC is a separate event, and you can query: "show me everything that was instantiated under the old definition."

This is the move the relational model can't make: the **instantiation of a reference resolution as a first-class entity with identity, provenance, and frame-awareness**. That is INS doing its job — crossing something from potential into the particular. The set was potential (it existed as a possible filtering). INS made it actual (it now has an anchor and a history).

Any of the nine reference types can serve as the source of an INS. A constraint-based reference instantiated as a cohort. A composition-based reference instantiated as a report. A relationship-based reference instantiated as a network snapshot. The reference resolves the target; INS makes it real.

---

## The Natural Language Parallel

Natural language uses multiple reference types fluidly, often within a single sentence:

*"The young patient in Dr. Reyes's Tuesday clinic had her anxiety medication dosage increased."*

"patient" — by distinction (type) "young" — by state (property filter) "in Dr. Reyes's Tuesday clinic" — by containment (hierarchical narrowing) "her" — by relationship (possessive link) "anxiety medication dosage" — by containment (nested narrowing)

No one navigates anywhere to understand that sentence. The listener chains multiple reference strategies — type, filter, containment, relationship — until the referent is identified. Every natural language does this. English uses adjectives, prepositional phrases, relative clauses, and possessives. Japanese uses particles. Arabic uses the *iḍāfa* construct. The syntactic tools differ. The operation is the same: apply reference strategies until the target is resolved, then say what happened to it.

### Translation Example

**Natural language:** "Maria updated James's housing status to stable, closed his mental health referral, and added a session note."

**EO translation (nested):**

```
EVA(session.maria.2024_03_12, contains: [
  EVA(clients.james.housing_status, "stable"),
  NUL(clients.james.referrals.mental_health),
  INS(clients.james.notes, {date: "2024-03-12", content: "..."})
])
```

The English "updated," "closed," and "added" are three different verbs doing three structurally different things — a state change (EVA), a removal (NUL), and a creation (INS). English lumps all of these under casual words like "changed." The operator pins the transformation type. The targeting pins *which* thing. The nesting pins the relationship between levels.

---

## Sign and Anchor

Any referent in EO can be held in two registers:

**The sign** is any human-readable reference — a dot path, a name, a constraint expression, a relationship chain. It is meaningful, mutable, and frame-dependent. The sign can float: what it points to might change if the frame is restructured. Signs are for reading.

**The anchor** is a content-addressed hash — an opaque, stable identifier derived from the content itself. It does not tell you what something is. It tells you that it exists and has never been altered. Anchors are for verifying.

Git uses exactly this architecture. `main` is a sign — a human-readable pointer that moves every time someone pushes a commit. `a3f2b7c9` is an anchor — a hash that never changes because it is derived from the content. The sign floats. The anchor holds. And Git tracks *when signs move* — that is the reflog, a record of every time a pointer changed what it pointed to.

The eight non-anchor reference types are all signs. The anchor is the one reference type that is frame-independent. The sign/anchor split means the name you use and the entity it refers to are decoupled. This matters in any system where names are political — which is to say, every system that involves humans.

### The Existence Triad as Identity Architecture

The sign/anchor distinction maps onto the Existence triad:

**NUL → makes the space.** Before anything can be identified, there must be the capacity for absence — a field that can be empty, a slot that can be unfilled. NUL establishes the conditions for identity without producing any.

**SIG → produces the sign.** The first distinction. "This is *this* and not *that.*" The human-readable pointer, the frame-dependent name. SIG draws the difference that makes a referent addressable.

**INS → produces the anchor.** The moment something crosses from potential into the particular — INS (Generating ⤫ Existence) — is the moment the system mints an anchor. INS is the only operator that creates anchors, because INS is the only operator that creates entities.

Other operators that appear to produce new entities do so through nested INS operations. SEG partitions a collection into two — each new partition receives its anchor through a contained INS. SYN merges entities into a whole — the merged whole receives its anchor through a contained INS. The anchor-minting responsibility belongs to INS alone; nesting handles the rest.

Every event in the log — regardless of operator type — receives a UUID. That is the *event's* identity: "this transformation happened." The anchor is the *entity's* identity: "this thing now exists." The UUID is bookkeeping. The anchor is ontology.

---

## Frame Dependence

The same entity can carry different signs in different frames. A therapist's clinical frame might target a referent as:

`j_smith.tuesday_session.minute_34.affect_state`

A hospital's administrative frame might target the same person as:

`outpatient.intake_2024.patient_7891.insurance_status`

Neither is more real than the other. Each identifies a referent within the frame's own ontology. Signs are frame-dependent — which is why the anchor exists as an invariant underneath them. Two frames may arrive at the same entity through entirely different reference strategies, and the framework does not require reconciliation between them. Reconciliation, when needed, is a CON operation — a first-class transformation, not a background assumption.

---

## Scoping: Hierarchical Level

In applied data contexts, scoping refers to the level in a hierarchy where an operator acts. The Change Operator Manual defines a fully classified change as having a type (which of the nine operators), a scope (what level in the hierarchy), a target (which identity at that level), and a decomposition (contained operators at lower levels).

The same operator type applies at every level. NUL at the field level means "field cleared." NUL at the record level means "record removed." NUL at the collection level means "table dropped." Same operator, different scope. The type tells you *what kind* of change occurred. The scope tells you *how broad* it was.

This produces the classification that CRUD cannot make. UPDATE tells you nothing about type — was it a value change, a clear, a reclassification? — and nothing about scope — record? field? something else? EO's Type ⤫ Scope matrix provides both dimensions simultaneously.

Typical levels in a data hierarchy:

`System → Database/Namespace → Collection/Table → Record/Row → Field/Cell → Value`

But the hierarchy is frame-dependent. In a clinical context, the levels might be:

`Practice → Clinician → Client → Session → Observation`

The operators are the same. The scoping levels are whatever the frame says exists.

---

## Targeting, Scoping, and the Object Axis

Neither targeting nor scoping should be confused with the Object axis of the phase space (specified by decal notation). The Object axis asks *what ontological category of thing* the operator is aimed at — a Ground condition, a Figure particular, or a Pattern regularity. Targeting asks *how the target is identified*. Scoping asks *at what hierarchical level*.

An EVA aimed at a Figure (DEF+) at the field level is a different event than an EVA aimed at a Figure (DEF+) at the system level. Both target a specific bounded entity. They differ in how broadly they reach. The Object axis specifies the *kind* of target. Targeting specifies *which* target. Scoping specifies the *breadth* of the operation.

All three are independent. A Ground-targeting operation (operator−) can be identified by any reference type, at any hierarchical level. Decal notation, targeting, and scoping answer three different questions about the same transformation.

---

## Historical Context

The history of data systems is a history of expanding targeting strategies:

**BC (before Codd).** IBM's IMS supported one reference type: containment paths. `HOSPITAL.WARD.PATIENT.DIAGNOSIS` was both the reference and the storage structure. Reorganize the storage, the reference breaks.

**AC (after Codd).** The relational model introduced constraint-based reference. `SELECT diagnosis FROM patients WHERE ward = 'cardiology'` identifies by properties, not position. Storage-independent. This was a liberation — but it also became a monoculture. SQL systems treat constraint-based reference as *the* way to identify targets, which makes relationship-based and composition-based references second-class citizens requiring JOINs and subqueries.

**EO.** The framework recognizes all nine reference types as equally legitimate strategies for arriving at a target. No syntax is prescribed. The application decides which to implement. The anchor provides a frame-independent invariant underneath whatever signs the application supports. BC freed data from paper. AC freed the query from the storage. EO frees targeting itself from any single strategy.

---

## Summary

**Targeting** is how you identify the target. Nine reference types, organized by Domain ⤫ Mode, describe the complete space:

Three by existence — absence, distinction, anchor. Three by structure — containment, relationship, composition. Three by interpretation — state, constraint, name.

All are signs except the anchor, which is the frame-independent invariant they ultimately resolve to. Applications choose which strategies to support. The framework maps the full space.

**Scoping** is how broad the operation reaches. The level in the hierarchy where the operator acts — field, record, collection, system — determines the scope. Same operator, same reference type, different breadth.

Together, targeting and scoping fully specify the target position in `OP(target, operand)`. The Object axis (decal notation) adds a third, independent dimension: the ontological category of the target. And any reference resolution can itself become the operand of an INS — collapsing a potential target into an actual entity with identity, provenance, and frame-awareness.

---

*See also: [Decal Notation], [The Nine Operators], [INS — Instantiation], [Experience Engine], [Degrees of Freedom], [Frame]*
