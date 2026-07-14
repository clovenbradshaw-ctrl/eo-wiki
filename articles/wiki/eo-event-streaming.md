# EO Event Streaming

**Record ID:** wiki:eo-event-streaming  
**DB ID:** 20  
**Keywords:** operators, schema, field, event, operator  
**Status:** draft  
**Updated:** 2026-07-14T00:00:00.000Z  

---

EO provides a closed, nine-operator vocabulary for classifying data transformations. This article covers EO's relationship to existing event sourcing architectures, activity stream standards, and change data capture systems, and describes how EO functions as a semantic layer applicable to any of these systems.

---

## 1. Background: The Semantic Gap in Event Standards

Existing event and activity stream standards address delivery, transport, envelope standardization, and capture. None standardize transformation type — the classification of what kind of change occurred.

| Standard | Primary Scope | Unspecified |
| --- | --- | --- |
| CloudEvents (CNCF) | Event envelope | type field semantics |
| W3C ActivityStreams 2.0 | Social/graph activity vocabulary | Change type within Update |
| Debezium / CDC | Row-level database change capture | Semantic classification of change |
| Apache Kafka | Event transport and ordering | Event vocabulary |
| EventStore / Axon | Append-only log, replay-to-state | Domain-independent change types |
| OpenTelemetry | Observability spans/traces | Data mutation semantics |

This gap is structural, not incidental. Event systems are designed to be domain-agnostic, which means they deliberately leave vocabulary to implementers. EO is a candidate to fill that vocabulary slot in a portable, domain-independent way.

---

## 2. The CRUD Problem

The CRUD model (Create / Read / Update / Delete) provides four verbs for all possible data transformations. These verbs are insufficient for semantic classification because they conflate structurally distinct operations:

UPDATE conflates:

- Field value mutation (a value changed within a stable type)
- Category boundary crossing (a value changed such that the entity now belongs to a different class)
- Conflict introduction (two sources disagree; one overwrote the other)
- Schema migration (the interpretive frame of the field changed)
- Soft restore (a previously nulled field was re-instantiated)

Each of these has different implications for replay, audit, cross-system reconciliation, and downstream consumers. Emitting them all as UPDATE means downstream systems cannot distinguish them without re-examining the data.

DELETE conflates:

- Explicit absence (the entity existed and was removed)
- Archival (the entity was moved out of the active set)
- Soft delete (a flag was set; the record remains)
- Boundary exclusion (the record was filtered out of a view)

INSERT conflates:

- First instantiation (an entity that did not exist now exists)
- Re-instantiation (a previously nulled field was filled)
- Conflict resolution (one value was chosen over another)

EO separates these by assigning distinct operators to each transformation type.

---

## 3. The EO Operator Set

EO defines nine primitive transformation operators. They are organized into three triads by domain — Existence, Structure, Significance — and are dependency-ordered: each operator's preconditions are satisfied by its predecessors.

Helix ordering: NUL → SIG → INS → SEG → CON → SYN → DEF → EVA → REC

| # | Operator | Glyph | Greek | Triad | Function |
| --- | --- | --- | --- | --- | --- |
| 1 | NUL | ∅ | ν | Existence | Recognize and record absence; explicit null marker |
| 2 | SIG | ○ | σ | Existence | Direct attention; register a signal |
| 3 | INS | ● | α | Existence | Instantiate a concrete entity under a type; mint the entity's anchor |
| 4 | SEG | ｜ | κ | Structure | Establish a boundary or partition |
| 5 | CON | ⋈ | ε | Structure | Create a relationship between entities |
| 6 | SYN | △ | η | Structure | Produce a derived whole; aggregate |
| 7 | DEF | ⊢ | δ | Significance | Establish what holds within a stable interpretive frame |
| 8 | EVA | ⊨ | ψ | Significance | Render judgment by testing a particular against a general |
| 9 | REC | ⊛ | Ω | Significance | Transform the interpretive frame itself |

### Operator Definitions

**NUL** — Records absence as an explicit, representable state. Distinguishes three cases that database NULL conflates: (a) the value does not exist, (b) the type has not been assigned, (c) an instance has not been created. All deletion in EO is SEG(NUL(target)): nothing is removed; it is replaced by explicit nullity with context.

**SIG** — Directs attention — registers that something matters right now. SIG is ephemeral salience: the spotlight, not the foundation. It does not create enduring structure and does not carry values. On the second pass, after REC has transformed the system's ground, SIG produces a CLM (claim) — a distinction that knows it is choosing.

**INS** — Instantiates a concrete entity under a designated type. INS is the only operator that creates entities, and it is the only operator that mints anchors — content-addressed hashes that give each entity a frame-independent, immutable identity. Corresponds to INSERT in the non-conflated case: a first occurrence, not a re-instantiation or overwrite. Other operators that appear to produce new entities (SEG partitioning a collection into two, SYN merging entities into a whole) do so through nested INS operations. The anchor-minting responsibility belongs to INS alone.

**SEG** — Draws a boundary or partition. Corresponds to WHERE, GROUP BY, FILTER, PARTITION. Also appears in compound operations: EVA(SEG(target)) is the correct classification for an UPDATE that causes the entity to cross a category boundary (e.g., status change from active to premium).

**CON** — Creates a relationship between entities. Corresponds to JOIN, foreign key assignment, graph edge creation.

**SYN** — Produces a derived whole not reducible to its components. Corresponds to aggregation (SUM, COUNT, GROUP), merge operations, materialized views.

**EVA** — Renders judgment by testing a particular against a general. DEF establishes the terms; EVA assesses whether something satisfies them. In data systems, EVA is the projection rule that determines what a consumer sees when multiple DEFs exist on the same path — latest-wins, priority ordering, show-all-by-source. The rule itself is a first-class logged event; changing the rule is another EVA. The history of evaluation criteria lives in the log alongside the DEFs it judges.

**DEF** — Establishes what holds within a stable interpretive frame. Sets terms, defines values, determines what follows. DEF is the workhorse value-setting operator — a diagnosis established, a status changed, a measurement recorded. Corresponds to UPDATE in the simple case — what UPDATE should have been: a typed, logged, provenance-carrying value change. When two sources write competing values, multiple DEFs coexist in the log; judging between them is the job of EVA, not DEF.

**REC** — Transforms the interpretive frame itself. Corresponds to schema migration, pivot operations, identity restructuring. REC bends the linear helix into a spiral: the second pass operates at an enriched register.

### 3.1 The Existence Triad as Identity Architecture

The three Existence operators map onto a two-register identity system:

**NUL → makes the space.** Before anything can be identified, there must be the capacity for absence — a slot that can be empty. NUL establishes the conditions for identity without producing any.

**SIG → produces the sign.** The first distinction. "This is *this* and not *that.*" The human-readable, frame-dependent name. SIG draws the difference that makes a referent addressable. Signs are meaningful, mutable, and bound to the active frame.

**INS → produces the anchor.** The moment something crosses from potential into the particular, the system mints a content-addressed hash — opaque, immutable, frame-independent. The anchor is the entity's identity. It does not tell you what something is. It tells you that it exists and has never been altered.

Every event in the log — regardless of operator type — receives a UUID. That is the *event's* identity: "this transformation happened." The anchor is the *entity's* identity: "this thing now exists." The UUID is bookkeeping. The anchor is ontology.

### 3.2 EO and Codd's Null Problem

The relationship between EO and Codd's relational model is not one of extension or replacement — it is one of structural diagnosis. EO explains precisely why Codd's NULL is insufficient, why his 1990 attempt to fix it was correct but incomplete, and what the full solution requires.

**Codd's original NULL.** In Codd's 1970 relational model, NULL is a philosophically honest marker: it represents the limit of the system's knowledge. A NULL value means "I do not know." It is not a value; it is the absence of a value, and three-valued logic (true / false / unknown) was introduced to handle it correctly in queries.

This is epistemically sound. The problem is that NULL collapses three structurally distinct absences into one undifferentiated token.

**Three kinds of absence.** EO's Existence triad — NUL, SIG, INS — maps exactly onto three kinds of absence that database NULL conflates:

| EO operator | What is absent | Example |
| --- | --- | --- |
| NUL | The value does not exist. Absence itself is the fact. | A sensor that failed to report. The gap is meaningful. |
| SIG (unmarked) | No type or category has been assigned. The schema has a slot but it has not been named. | A field added to a schema whose semantics have not yet been decided. |
| INS (negative) | The type exists and the slot is defined, but no instance has been created. | An optional field that has simply never been filled. |

These are not equivalent epistemic states. A sensor failure (NUL) is different from a field whose semantics are undecided (unmarked SIG) is different from a field that hasn't been filled yet (negative INS). Conflating them produces queries that return misleading results — a WHERE email IS NULL sweep treats all three as identical, triggering different downstream handling for what are structurally different situations.

**Codd's 1990 proposal and its rejection.** Codd recognized part of this problem. In his 1990 paper *The Relational Model for Database Management: Version 2*, he proposed replacing the single NULL with two distinct markers: A-mark ("missing but applicable") and I-mark ("missing but inapplicable").

This is a correct diagnosis of the NUL / INS distinction: A-mark corresponds roughly to negative INS (the slot exists and could be filled), and I-mark corresponds roughly to NUL (the question itself does not apply). The database industry rejected both markers, kept the single NULL, and spent four decades writing application-layer workarounds to handle cases that Codd had already identified as structurally distinct.

**Why Codd didn't go far enough.** Codd's two-marker proposal maps onto the NUL / INS distinction but does not capture the SIG case: the slot exists and the question applies, but the type or category of what should go there has not been designated. This is a pre-instantiation absence: not "we don't know the value" but "we haven't yet decided what kind of value this field receives."

In event stream terms: when a new field is added to a schema but its semantics are pending a policy decision, every existing record has that field in a SIG-unmarked state. It is not NULL in Codd's sense (the question does apply and the answer will exist). It is not A-mark (there is no value in the world waiting to be collected — the category hasn't been defined yet). It is specifically the absence of designation, which is a third and distinct epistemic state.

EO's full decomposition requires all three:

```
NUL(customer:123.preferred_contact)     — field is explicitly absent; this customer
                                           has no preferred contact and this is known

SIG-unmarked(customer:123.risk_tier)    — field added in schema v3; semantics
                                           pending policy committee; not yet a
                                           designatable category

INS-negative(customer:123.middle_name)  — optional field; type is defined (string);
                                           simply not provided
```

In a standard event stream, all three of these arrive as NULL or as a missing field. The receiving system cannot distinguish them without out-of-band context. With EO operators, each is a distinct event with a distinct operator and distinct replay semantics.

**The four-stage degradation.** The trajectory from Łukasiewicz to modern data systems traces a progressive loss of epistemic precision:

- Łukasiewicz (1920) — three-valued logic introduced as a genuine ontological condition: the genuinely undetermined future is a third truth value, not a missing value
- Codd's NULL (1970) — the limit of representation; philosophically honest, marks the boundary of the system's knowledge
- SQL's NULL (1986–) — "missing data" awaiting collection; the ontological weight is gone; NULL becomes a clerical backlog item
- The mandatory field — NULL is prohibited; pick something, because an empty field triggers validation errors

Each step discards something essential. EO does not recover all of it — it does not restore Łukasiewicz's ontological third value as a first-class truth condition. But it does restore the structural differentiation that Codd's NULL collapsed, and it does so in a way that is directly applicable to event streams: every event that would have emitted NULL in a CDC or event sourcing system can instead emit the correct Existence-triad operator, with full downstream replay and audit implications.

**Practical consequences for event streams:**

*Replay ambiguity.* When replaying a log that contains NUL(customer:[123.email](http://123.email)), the replay engine cannot determine whether this means the field is genuinely absent (stop looking), the category is undecided (hold for schema decision), or the value simply hasn't been collected yet (prompt for input). The downstream behavior differs in each case; the log provides no basis for distinguishing them.

*Cross-source reconciliation failure.* When two sources both emit NULL for the same field, a reconciliation system cannot determine whether they agree (both know the field is absent) or are both in different states of ignorance (one has not collected the value; the other has designated the field as inapplicable). DEF is the correct operator when sources disagree; but two NULLs from different sources may not be agreement — they may be two different epistemic states that only appear identical because both encode to NULL.

*Schema evolution opacity.* When a field is added to a schema and all existing records receive NULL, the event log records nothing. With EO, adding the field emits a SIG event (the type is now designated), and the absence of values in existing records is correctly represented as negative-INS states, not NUL states — because the field now exists and the values are simply not yet instantiated, which is a different epistemic condition than the field not existing at all.

---

## 4. Operator Properties Relevant to Event Systems

**Completeness** — Every data change decomposes into combinations of the nine operators. No additional operator is needed to describe any transformation in any data system.

**Minimality** — No operator can be removed without losing the ability to describe some class of transformation. Removing DEF means conflict cannot be represented; removing REC means schema migration cannot be typed; removing NUL means absence cannot be distinguished from missingness.

**Replayability** — Operators are executable. A log of EO operators deterministically reconstructs any historical state when replayed in order. This property depends on operators being transformation-typed rather than domain-named: EVA(customer:[123.email](http://123.email)) is replayable; CustomerUpdated is not.

**Composability** — Operators nest. A record-level operator contains field-level operators in its payload, preserving causal structure. Operator pipelines are themselves composable; nesting makes hidden dependencies explicit.

**Schema independence** — Operators describe the kind of change that occurred, not the field name. Field renames and model evolution do not break replay because the operator classification remains valid across schema versions.

**Conflict as data** — DEF holds contradictory values from multiple sources without forcing resolution. This is structurally distinct from overwrite (EVA) and enables downstream systems to decide resolution policy rather than having it silently applied at capture time.

**Non-commutativity** — Operator order matters. SYN ∘ SEG ≠ SEG ∘ SYN. This reflects real system behavior and is a feature, not a limitation: it means operator logs carry the actual execution order, which is required for deterministic replay.

---

## 5. Target Addressing

EO events use the target position in `OP(target, operand)` to specify what is being transformed. Identifying a target is itself an act of reference — resolving what the operator acts on from within an active frame. EO does not prescribe a single addressing syntax. It describes the complete space of how targets can be identified, organized by the same Domain × Mode structure that generates the operators themselves.

### 5.1 The Nine Reference Types

Three reference domains — Existence, Structure, Significance — crossed with three modes produce nine ways to identify a target.

**Existence references — identifying by whether it exists:**

*By absence (Differentiating × Existence).* Identifying the target by what is not there. The empty slot. The removed referral.

```
customer:123.referrals.mental_health:null
```

*By distinction (Relating × Existence).* The bare minimum of singling out. A type:instance pair.

```
client:james
```

*By anchor (Generating × Existence).* The content-addressed hash. Frame-independent, immutable, opaque. The only reference type that survives frame changes, reorganizations, and renaming.

```
@a3f2b7c9
```

**Structure references — identifying by how things connect:**

*By containment (Differentiating × Structure).* The hierarchical path. Each segment narrows by cutting through a boundary into a smaller container. This is what dot notation expresses.

```
dr_reyes.tuesday_clinic.patient_0471.dosage
```

*By relationship (Relating × Structure).* Through a link. You know the target is connected to something you already have by a specific relationship.

```
james->sister
patient_0471->provider
```

*By composition (Generating × Structure).* A derived reference. The target is generated from a computation across other entities.

```
SUM(team_northwest.clients.*.sessions.count)
```

**Significance references — identifying by what things mean:**

*By state (Differentiating × Significance).* Filtering by current condition.

```
clients[status=active]
referrals[state=open]
```

*By constraint (Relating × Significance).* Multiple simultaneous filters. This is closest to SQL's WHERE clause.

```
clients[age<18, provider=reyes, status=active]
```

*By name (Generating × Significance).* The human-assigned label.

```
"James Smith"
"Northwest Team"
```

### 5.2 All Roads to the Same Target

A single target can be identified by any reference type:

```
EVA(@a3f2b7c9, "stable")                                        — by anchor
EVA(dr_reyes.tuesday_clinic.patient_0471.housing, "stable")     — by containment
EVA(james->caseworker->caseload[type=housing], "stable")         — by link + filter
EVA(clients[name="james", provider="reyes"].housing, "stable")   — by constraint
```

EO does not prefer one over another. The application determines which reference types it supports, based on its data model, its users, and its frame. The framework describes what reference *is* — the application decides what reference *looks like*.

### 5.3 Sign and Anchor in Event Streams

The eight non-anchor reference types are all **signs** — human-readable, frame-dependent, mutable. The anchor is the one reference type that is frame-independent.

In an event stream context, this split has direct architectural consequences:

- **Event-to-entity binding.** Every INS event mints an anchor. Subsequent events referencing that entity — via dot paths, constraints, relationships, or names — can be resolved to the anchor. The sign floats; the anchor holds.
- **Cross-system reconciliation.** Two systems using different dot paths for the same entity can be reconciled if both paths resolve to the same anchor. Without anchors, reconciliation requires heuristic matching on field values.
- **Schema survival.** When a REC renames a path, events before the REC carry the old signs. Events after carry the new signs. The anchor is unchanged. Replay resolves both to the same entity.

### 5.4 Dot Notation as Default Syntax

While EO supports the full space of reference types, dot notation (containment-path reference) is the most common syntax in practice and the default in code examples throughout this document.

```
customer:123                        — the entity itself
customer:123.email                  — a field on the entity
customer:123.address.city           — a nested field
org:456.members                     — a collection field
org:456.members.customer:123        — a specific member within a collection
report:789.sections.2.headline      — positionally addressed subfield
```

Address scope levels:

| Address form | Scope | Typical operators |
| --- | --- | --- |
| entity:id | Entity (record) | INS, NUL, REC, SIG |
| entity:id.field | Field | EVA, NUL, INS, EVA |
| entity:id.field.subfield | Sub-field | EVA, NUL |
| collection:id | Collection | SEG, SYN, INS |
| collection:id.entity:id | Member within collection | CON, NUL |

### 5.5 Addressing Superposed States

When a field is in DEF (multiple simultaneous values), each value is addressed by source:

```
customer:123.email∥crm          — email as asserted by crm source
customer:123.email∥billing      — email as asserted by billing source
customer:123.email              — the superposed state (unresolved)
```

### 5.6 Historical Context: BC / AC / EO

The history of data systems is a history of expanding reference strategies:

**BC (before Codd).** IBM's IMS supported one reference type: containment paths. `HOSPITAL.WARD.PATIENT.DIAGNOSIS` was both the reference and the storage structure. Reorganize the storage, the reference breaks.

**AC (after Codd).** The relational model introduced constraint-based reference. `SELECT diagnosis FROM patients WHERE ward = 'cardiology'` identifies by properties, not position. Storage-independent. This was a liberation — but it also became a monoculture. SQL systems treat constraint-based reference as *the* way to identify targets, making relationship-based and composition-based references second-class citizens requiring JOINs and subqueries.

**EO.** The framework recognizes all nine reference types as equally legitimate strategies for arriving at a target. No syntax is prescribed. The application decides which to implement. The anchor provides a frame-independent invariant underneath whatever signs the application supports. BC freed data from paper. AC freed the query from the storage. EO frees reference itself from any single strategy.

---

## 6. EO Is Not Schema-First: Operators as Claims, Not Ontological Commitments

A potential concern when introducing typed operators to an event stream is that typing reintroduces schema-first design — the requirement that the structure of data be fully specified before any data can be recorded. EO does not do this, and the distinction is architecturally important.

**The schema-first problem.** Schema-first systems require that you know the ontological status of a thing — what type it is, what fields it has, what relationships it participates in — before you can record anything about it. This is appropriate for well-understood, stable domains and produces problems in domains where understanding is evolving, where multiple parties hold different frameworks, or where the past needs to be reinterpreted in light of later knowledge.

**EO operators are observations of claims.** EO operators record what a system did — not what a thing is. The distinction is:

- A schema-first system says: customer:123 is an entity of type Customer with fields email, status, tier.
- An EO event log says: at time T, agent A performed SIG(customer:123, type="Customer") — a designation was applied, by someone, at a time, under a framework.

The SIG operator records that a claim was made. It does not assert that the claim is correct, final, or universally shared. The claim is revisable.

**Revision without rewriting history.** Because past events record claims rather than facts, revision does not require rewriting history. Instead, revision appends new operators that modify the shared terminology going forward.

Scenario: A system originally designated customer:123 as type=Individual. Later, based on new information, the correct designation is type=Business.

Schema-first response: Update the record. The history of it being Individual is lost unless a separate audit table was maintained.

EO response: Append a new event.

```
[
  {
    "op": "SIG", "target": "customer:123",
    "designation": "Individual",
    "agent": "crm-intake", "ts": "2024-01-15T09:00:00Z"
  },
  {
    "op": "EVA", "target": "customer:123.type",
    "from": "Individual", "to": "Business",
    "agent": "compliance-review", "ts": "2026-03-05T14:00:00Z",
    "reason": "LLC filing confirmed"
  }
]
```

The original SIG event is not altered. The EVA event records when, by whom, and why the claim changed. Both events are in the log. The history of the claim is the history.

**Revising shared terminology itself.** The deeper case is when not just a value but the terminology — the names used in dot-notation paths and designations — needs revision.

Scenario: A system has been using status=active/inactive for two years. A new policy distinguishes status=enrolled, status=waitlisted, and status=suspended.

EO handles this with a REC on the designation framework, followed by a SIG that introduces the new vocabulary, with full lineage back to the old:

```
{
  "op": "REC",
  "target": "vocabulary:status",
  "ts": "2026-03-05T00:00:00Z",
  "agent": "policy-revision-2026",
  "reason": "Status taxonomy expanded per policy update 2026-Q1",
  "contains": [
    {
      "op": "SIG", "target": "vocabulary:status",
      "old_terms": ["active", "inactive"],
      "new_terms": ["enrolled", "waitlisted", "suspended"],
      "mapping": {
        "active": ["enrolled", "waitlisted"],
        "inactive": ["suspended"]
      }
    }
  ]
}
```

Historical events that used status=active are not rewritten. They are interpreted through the vocabulary mapping on read, and the mapping event itself is a permanent part of the log.

**Dot notation addresses persist; terminology evolves.** The key architectural property is that addresses are stable (they point to things) while terminology is revisable (what we call those things). The address customer:123.status continues to identify the same target. The vocabulary applied to values at that address can evolve without breaking the address, because the address is a pointer and the terminology is a claim about what values mean.

This separates two concerns that schema-first systems conflate:

- **Reference** (what are we pointing at?) — handled by stable addresses and anchors
- **Significance** (what does it mean?) — handled by revisable SIG/DEF/REC on vocabulary

**Second-pass designation (CLM).** When a SIG occurs after a REC has transformed the system's frame — that is, a designation made with awareness that it is a claim, not a fact — this is called a CLM (claim). CLM is not a separate operator; it is SIG operating at a richer register: "I am designating this as X, and I know that designation is a choice I am making, not a discovery I am reporting."

CLM events carry implicit provenance: they record the designating agent's framework. Two agents can issue competing CLMs about the same target — both are preserved in the log, both are valid observations, and the DEF operator records their coexistence. Resolution, if desired, is a later event.

---

## 7. Comparison to Existing Systems

### 7.1 W3C ActivityStreams 2.0

ActivityStreams 2.0 defines a vocabulary of social graph activities: Create, Update, Delete, Follow, Like, Announce, Accept, Reject, and others. These are domain verbs, not transformation primitives. The Update type inherits full CRUD ambiguity and does not distinguish DEF, SEG, EVA, or REC.

What ActivityStreams gets right: actor/object/target/origin graph topology; rich social action vocabulary; JSON-LD context for semantic interoperability.

What EO adds: transformation type within Update (DEF vs. SEG vs. DEF vs. REC); replayability of state from activity log; cross-system reconciliation vocabulary (EVA for conflicts).

Integration pattern:

```
{
  "@context": "https://www.w3.org/ns/activitystreams",
  "type": "Update",
  "actor": { "type": "Person", "id": "https://example.com/users/alice" },
  "object": { "type": "Note", "id": "https://example.com/notes/1" },
  "eo:operators": [
    { "op": "EVA", "field": "content", "from": "original text", "to": "revised text" },
    { "op": "SEG", "field": "visibility", "boundary": "private→public" }
  ]
}
```

### 7.2 CloudEvents (CNCF)

CloudEvents standardizes event envelope fields: specversion, id, source, type, time, datacontenttype, dataschema, subject, data. The specification explicitly does not define the semantics of the type field or the data payload.

EO provides a principled, portable vocabulary for the type field.

| CloudEvents type | EO operator | Meaning |
| --- | --- | --- |
| EVA | EVA | Field value mutated |
| EVA(SEG(target)) |  | Mutation that crosses a category boundary |
| NUL | NUL | Absence recorded |
| SIG | SIG | Type/schema assigned |
| INS | INS | Entity instantiated |
| SEG | SEG | Boundary established or crossed |
| CON | CON | Relationship created |
| SYN | SYN | Aggregate or merge produced |
| DEF | DEF | Conflict state introduced |
| REC(EVA(target)) | REC containing DEF | Migration with field changes |
| REC | REC | Frame/schema transformed |

Standard EO compositional notation is used directly in the type field. Simple operations use the operator name alone; compound operations use nested notation: DEF(SEG(target)), REC(DEF(target), SEG(target)).

### 7.3 Change Data Capture

CDC systems (Debezium, AWS DMS, Fivetran, Maxwell) capture row-level changes from database write-ahead logs and emit INSERT, UPDATE, DELETE with before/after snapshots.

What CDC gets right: change-based capture (not state polling); before/after images for field-level inspection; low-latency streaming from database logs.

What EO adds: semantic classification on top of before/after images; disambiguation of UPDATE cases that CDC conflates; schema-independent vocabulary that survives field renames.

CDC → EO mapping:

| Scenario | CDC verb | EO operator | Notes |
| --- | --- | --- | --- |
| New entity, first occurrence | INSERT | INS | Standard case |
| Field previously null, now populated | INSERT/UPDATE | INS | Re-instantiation, not overwrite |
| Field value changed, category unchanged | UPDATE | EVA | Standard mutation |
| Field value changed, category boundary crossed | UPDATE | EVA(SEG(target)) | Boundary crossing nested inside mutation |
| Two sources wrote different values; one won silently | UPDATE | DEF | Conflict should have been preserved |
| Soft delete (status flag set) | UPDATE | EVA | Frame stable; value changed |
| Hard delete (row removed) | DELETE | SEG(NUL(target)) | Absence recorded; boundary excludes |
| Archival (moved to archive table) | DELETE + INSERT | SEG | Partition change; entity persists |
| Schema rename, data unchanged | — | REC | No data-level verb; frame changed |
| Mass update due to migration | UPDATE (×N) | REC(EVA(target), ...) | Outer frame is the migration |
| Merge of two records into one | — | SYN | No direct CRUD equivalent |
| Split of one record into two | — | SEG | No direct CRUD equivalent |

EO-enhanced CDC event:

```
{
  "source": "debezium.customers",
  "op": "u",
  "before": { "email": "a@x.com", "status": "active" },
  "after":  { "email": "b@x.com", "status": "premium" },
  "eo:operators": [
    { "op": "DEF", "field": "email", "from": "a@x.com", "to": "b@x.com" },
    { "op": "DEF(SEG(customer:123.status))", "from": "active", "to": "premium",
      "boundary": "standard-tier→premium-tier" }
  ]
}
```

### 7.4 Apache Kafka / Event Sourcing Frameworks

Event sourcing frameworks (Apache Kafka, EventStore, Axon, Akka Persistence) implement the correct architecture: append-only log, immutable events, state derived by replay. The gap is that event naming is left to domain conventions.

Domain-named events (CustomerUpdated, OrderPlaced, InvoiceDeleted) are not transformation types. When the domain model evolves, these names become legacy. They cannot be replayed without also maintaining a version registry and migration logic. Two events named CustomerUpdated from different service versions may describe structurally different changes.

What event sourcing gets right: append-only log as source of truth; state derived from replay; events are immutable; temporal queries via log position.

What EO adds: universal change vocabulary replacing domain-specific event names; schema-independent replay (operators survive model evolution); composition and nesting for causal structure; portability across service boundaries.

Before / after:

```
// Domain-named (not replayable across schema versions)
{ "type": "CustomerUpdated", "customerId": "123", "data": { ... } }

// EO-typed (replayable, schema-independent)
{
  "type": "EVA(customer:123.email)",
  "subject": "customer:123:email",
  "from": "old@example.com",
  "to": "new@example.com",
  "ts": "2026-03-05T12:00:00Z"
}
```

### 7.5 OpenTelemetry

OpenTelemetry covers traces, metrics, and logs for observability of system execution. It has no model for semantic change to data — this is deliberate; OTel's scope is execution behavior, not data mutation.

EO and OTel are complementary and non-overlapping. OTel answers: "what did the system do and how long did it take?" EO answers: "what changed in the data and what kind of change was it?" A complete observability stack may include both.

### 7.6 Git

Git stores snapshots and computes diffs on read. EO inverts this: operators (diffs) are stored; snapshots are computed on replay.

| Property | Git | EO |
| --- | --- | --- |
| Storage unit | Snapshot (commit) | Operator (diff) |
| Diff computation | On read | Stored at write time |
| Granularity | File-level | Field-level |
| Change vocabulary | Prose commit messages | Typed operators |
| Schema awareness | None | Full (operators survive schema evolution) |
| Conflict handling | Merge conflict markers | EVA operator (conflict as data) |
| Identity | Content-addressed hash (commit) | Content-addressed hash (anchor, minted by INS) |

Git is appropriate for document-level versioning with human-readable history. EO is appropriate for field-level data mutation with machine-replayable history. Both use content-addressed hashing for identity, but at different granularities: Git hashes commits and file trees; EO hashes entities at the moment of instantiation.

---

## 8. EO-Annotated Schema Patterns

**Minimal annotation (single operator field)**

```
{
  "type": "CustomerUpdated",
  "id": "evt-001",
  "ts": "2026-03-05T12:00:00Z",
  "eo_op": "EVA"
}
```

Minimum viable addition to an existing event schema. Enables operator-level filtering and aggregation without full decomposition.

**Field-level decomposition**

```
{
  "type": "CustomerUpdated",
  "id": "evt-001",
  "ts": "2026-03-05T12:00:00Z",
  "eo:operators": [
    { "op": "EVA", "field": "email",
      "from": "old@example.com", "to": "new@example.com" },
    { "op": "EVA(SEG(customer:123.status))",
      "from": "active", "to": "premium",
      "boundary": "standard-tier→premium-tier" }
  ]
}
```

Enables field-level replay, field-level audit, and boundary-crossing detection.

**Nested (causal structure preserved)**

```
{
  "op": "REC",
  "subject": "customer:123",
  "ts": "2026-03-05T12:00:00Z",
  "context": "schema-migration-v4",
  "contains": [
    { "op": "EVA", "field": "email",
      "from": "old@example.com", "to": "new@example.com" },
    { "op": "SEG", "field": "tier",
      "boundary": "standard→premium" },
    { "op": "NUL", "field": "legacy_code",
      "reason": "field-retired-v4" }
  ]
}
```

Full causal structure. The outer REC records that these changes occurred as part of a frame transformation. Inner operators are individually replayable. The nesting makes the dependency relationship explicit.

**EVA for conflict**

```
{
  "op": "DEF",
  "subject": "customer:123:email",
  "ts": "2026-03-05T12:00:00Z",
  "values": [
    { "value": "a@x.com", "source": "crm", "ts": "2026-03-05T11:59:00Z" },
    { "value": "b@x.com", "source": "billing", "ts": "2026-03-05T12:00:00Z" }
  ],
  "resolution": null
}
```

Conflict preserved as data. Downstream systems receive the DEF event and apply their own resolution policy.

---

## 9. Nesting and Causal Structure

EO operators nest by scope hierarchy. This structure is not cosmetic — it encodes causal relationships that flat event logs cannot represent.

Three scope levels:

```
TRANSACTION (named operation with shared context)
  └── RECORD-LEVEL operator (e.g., REC on customer:123)
        └── FIELD-LEVEL operators (DEF on email, SEG on tier)
```

Nesting rules:

- Record-level EVA may contain field-level EVA, NUL, INS
- Collection-level SEG may contain record-level NUL, INS, CON
- REC wraps any combination of operators when the frame transformation is the primary operation

**Dependency exposed by nesting.** A flat log of [EVA(email), SEG(tier), NUL(legacy_code)] cannot answer: "were these changes part of the same operation, or independent?" A nested structure REC(customer:123) { EVA, SEG, NUL } makes the dependency explicit: these three changes are consequences of a single frame transformation and must be replayed atomically.

**Partial replay.** Flat logs with hidden dependencies produce invalid state when replayed partially. Nesting makes dependencies explicit, enabling safe partial replay: any subtree of the nesting structure is safe to replay independently, because its dependencies are contained within the structure, not implicit in the sequence.

---

## 10. DEF: Conflict as Data

DEF is the most structurally distinctive operator relative to existing event systems. All current CDC and event sourcing systems treat multi-source conflict as a problem to be resolved at write time. EO treats conflict as a representable state.

The distinction matters because:

- **Resolution policy varies by consumer.** A CRM system and a billing system may apply different rules for resolving conflicting email addresses. If the conflict is resolved at capture, neither can apply its own policy.
- **Conflicts are themselves auditable events.** A compliance query may need to know not just the current value but whether there was ever a conflict and how it was resolved.
- **Silent overwrite destroys information.** If source A writes [a@x.com](mailto:a@x.com) and source B overwrites with [b@x.com](mailto:b@x.com), the final state contains no evidence that A ever wrote a different value.

EVA in practice:

```
Ingest from CRM:    customer:123:email = a@x.com   → EVA event
Ingest from billing: customer:123:email = b@x.com  → DEF event (conflict detected)
Resolution applied:  customer:123:email = b@x.com  → EVA event with source annotation
```

The DEF event is never deleted. It persists in the log as a record that a conflict occurred. The resolution EVA is a separate, subsequent event.

**Relationship to CRDTs.** Conflict-free Replicated Data Types (CRDTs) provide merge semantics that avoid conflict. EO's DEF is not a CRDT alternative; it is a complement. CRDTs prevent DEF by defining merge in advance. DEF is appropriate when merge policy cannot be defined in advance or when the conflict itself is meaningful data.

---

## 11. Storage Architectures

EO-based systems can be implemented under two broad storage strategies.

### 11.1 Dual-Database Architecture

The most common deployment pattern maintains two separate databases:

- **Event stream** — append-only log of all EO operators. This is the source of truth. It is never mutated; events are only appended.
- **Current state store** — a projected view of the current state of all entities, derived by replaying the event stream. This is a cache. It can be rebuilt from the event stream at any time.

```
Event Stream (source of truth)
  [INS customer:123] [EVA customer:123.email] [DEF customer:123.status] [REC customer:123]
         │
         │ replay (projection)
         ▼
Current State Store (derived view)
  { customer:123: { email: "b@x.com", status: <resolved>, ... } }
```

Advantages: fast reads from current state store; event stream remains authoritative; projections can be tuned per consumer; replay can rebuild projections after bugs or policy changes.

Disadvantages: two systems to maintain and synchronize; projection lag under high write load; projection logic must stay consistent with event schema.

When to use: Systems with high read frequency, latency requirements that cannot tolerate replay at query time, or multiple consumers with different access patterns.

### 11.2 Stream-Only Architecture

A stream-only system maintains only the event stream. Current state is computed by replaying the log on demand.

```
Event Stream (sole store)
  [INS customer:123] [EVA customer:123.email] [DEF customer:123.status] ...
         │
         │ replay on read
         ▼
  Computed current state (ephemeral, per-query)
```

Advantages: single source of truth with no synchronization concern; no projection lag; maximum temporal query flexibility; simpler operational model.

Disadvantages: read latency scales with log length unless indexed; requires efficient replay infrastructure; not suitable for high-frequency random reads without caching.

When to use: Systems where the event history is the primary product (audit systems, compliance records, provenance tracking), or where temporal queries are more important than current-state read latency.

### 11.3 What Replay Unlocks

**Point-in-time reconstruction.** Replay the log to any timestamp to see the exact state of any entity at that moment. No special audit tables, no prior instrumentation.

**Retroactive policy application.** If a policy changes, replay the log through the new policy to produce a corrected current state. The historical log is unchanged; the projection changes.

**Cross-source reconciliation.** DEF events record every conflict; resolution can be changed by re-projecting with different resolution policy.

**Causality tracing.** Because operators nest, replay can answer causal questions: not just "what is the current value?" but "what sequence of transformations produced it, by whom, under what authority?"

**Bug correction without data loss.** If an application bug caused incorrect EVA events, append a corrective REC event. The incorrect events remain in the log as a record that the error occurred. The projection reflects the correction going forward.

### 11.4 DEF, EVA, and REC in Existing Event Streaming Systems

The three Significance-triad operators — DEF, EVA, and REC — are structurally distinct from the Existence and Structure operators. The first six operators establish, populate, and organize entities. DEF, EVA, and REC operate on things that already exist, within or across interpretive frames. This distinction maps to a significant gap in most deployed event streaming systems.

**DEF in existing systems.** Most event sourcing frameworks emit domain events named after entities (CustomerUpdated) rather than change types. "Updated" is an undifferentiated container that may contain EVA, SEG, SIG, REC, or combinations. Consumers must re-derive the change type from before/after images, if available.

**EVA in existing systems.** Most event systems resolve conflicts at write time before a DEF state can be recorded. Last-writer-wins, source-priority rules, and merge strategies are applied at ingest, producing a single value. The conflict is discarded. Consumers cannot know it occurred, cannot audit how it was resolved, and cannot re-apply a different policy.

**REC in existing systems.** Frame transformation appears primarily as schema migration, handled out-of-band. Common patterns — upcasting, event versioning, stream reset — do not record the REC event itself as a first-class stream entry with explicit mapping. The log cannot answer: "when did the vocabulary change, and who authorized it?"

The practical consequence is that most event streaming systems are well-instrumented for the Existence and Structure triads and poorly instrumented for the Significance triad. EO's explicit representation of DEF, EVA, and REC as first-class stream events covers the portion of the transformation space that existing systems structurally omit.

---

## 12. Replay Architecture

EO's relationship to replay is the inverse of snapshot-based systems.

Snapshot-based systems:

```
events → apply domain logic → current state (stored)
current state → diff → changelog (computed on read or not at all)
```

EO-native systems:

```
operators (stored) → replay → any historical state (computed on read)
external source → diff → operators (computed at write, stored)
```

Replay completeness requirements:

| Property | Requirement | EO mechanism |
| --- | --- | --- |
| Completeness | Every change recorded | Nine operators cover all transformation types |
| Minimality | Finest meaningful grain | Field-level operators with nesting |
| Determinism | Same sequence → same state | Operators are executable, not descriptive |
| Composability | Groups can compress without semantic loss | Nesting preserves causal structure |

---

## 13. Adoption and Integration Paths

EO operates as an additive semantic layer. No existing infrastructure requires replacement.

**Level 0 — Single type field.** Add eo_op to existing event schemas. No structural change to pipelines. Enables operator-level filtering, monitoring, and aggregation.

```
{ "type": "CustomerUpdated", "eo_op": "EVA" }
```

**Level 1 — Field decomposition.** Add eo:operators array to existing events. Enables field-level audit, replay, and boundary-crossing detection.

**Level 2 — Nested operators.** Replace or augment domain event names with nested EO structures. Enables full causal structure, deterministic replay, and schema-independent history.

**Level 3 — EO-native log.** Use EO operators as the primary event vocabulary. Domain event names become optional annotations. The log is replay-safe by construction.

Compatibility notes:

- All four levels are backward-compatible with existing consumers. EO fields are additive.
- Levels 0–1 can be applied at the CDC layer (enriching Debezium output) without changes to producers.
- Levels 2–3 benefit from producer-side integration, where the application has access to the semantic context needed to classify compound operations correctly.

---

## 14. Anti-Patterns

**Using domain names as EO operators.** eo_op: "CustomerUpdated" is not an EO operator. EO operators are the nine primitives. Domain names are compositions to be decomposed into those primitives.

**Classifying all UPDATEs as EVA.** EVA is field mutation within a stable frame. UPDATEs that cross category boundaries are EVA(SEG(target)). UPDATEs due to schema migration are REC. UPDATEs from conflicting sources are DEF.

**Emitting DEF only on detected conflicts.** If two sources can write to the same field and no conflict detection is in place, overwrites are silent. DEF should be emitted whenever multi-source write is possible and the sources disagree, not only when a conflict detection system catches it.

**Treating nesting as optional formatting.** Flat lists of operators with correlation IDs are not equivalent to nested operators. Nesting encodes causal dependency; correlation IDs encode co-occurrence. A flat correlated list cannot be safely partially replayed; a nested structure can.

**Using REC for all schema changes.** REC is the frame transformation operator — it applies when the interpretive frame of data changes, not merely when a column is added. Adding a new nullable column is INS + SIG. Renaming a column and changing its semantics is REC. Adding an index is a structural operation with no EO representation at the data level.

**Conflating NUL with empty string or zero.** NUL records absence as an explicit state. An empty string is an EVA (the value changed to the empty string). A zero is an EVA (the value changed to zero). NUL applies when the field has no value, not when its value is a zero-like sentinel.
