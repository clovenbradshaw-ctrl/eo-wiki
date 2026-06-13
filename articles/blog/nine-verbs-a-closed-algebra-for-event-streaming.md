# Nine Verbs: A Closed Algebra for Event Streaming

**Record ID:** blog:nine-verbs-a-closed-algebra-for-event-streaming  
**DB ID:** 45  
**Status:** draft  
**Updated:** 2026-03-26T22:16:46.802Z  

---

# Nine Verbs for All of Data

In 2015, Martin Kleppmann observed that "people in different fields use different vocabulary to refer to the same thing," and that "I think this is mainly because the techniques originated in different communities of people, and people seem to often stick within their own community and not look at what their neighbours are doing." He was describing the fragmented landscape of event streaming, event sourcing, complex event processing, and reactive systems — all of which process sequences of changes, all of which use different words for it, and none of which agree on a shared vocabulary for what kinds of changes exist.

A decade later, the fragmentation has only deepened. The architecture is mature. Kafka handles transport and ordering at planetary scale. Debezium captures row-level changes from database write-ahead logs. CloudEvents, which graduated as a CNCF project in January 2024, standardizes the event envelope — the metadata wrapper that makes events portable across services and platforms. The infrastructure works. What remains unstandardized is the thing inside the envelope: the classification of what kind of change an event represents.

The CloudEvents spec is explicit about this. The `type` field — the attribute that should carry the semantic meaning of the event — has its format defined as "producer defined." The spec's README states plainly that "the lack of a common way of describing events means developers must constantly re-learn how to consume events" and that "this also limits the potential for libraries, tooling and infrastructure to aide the delivery of event data across environments." The specification standardizes everything around the event and deliberately leaves the event's meaning to each implementer.

The result is that every team reinvents a domain-specific set of event names — `CustomerUpdated`, `OrderArchived`, `InvoiceSynced` — that cannot survive schema evolution, cannot be replayed across service boundaries, and cannot be compared across systems. Overeem, Spoor, Jansen, and Brinkkemper, in the most comprehensive empirical study of event sourcing in production (25 engineers, 19 systems, up to 1.1 billion events), found that "the data schema is not explicitly defined at all, but is implicitly encoded in the source code." They identified schema evolution as one of the most prominent engineering challenges in event sourcing, and documented five different coping tactics — none of which worked in all scenarios.

At the root of this is a verb problem. Every one of these systems classifies changes using CRUD: Create, Read, Update, Delete. Four verbs for all possible data transformations. But UPDATE alone conflates a typo correction, a customer relocation, a schema migration, a category reclassification, and a silent conflict overwrite. They all arrive downstream as the same verb, and downstream consumers cannot distinguish them without re-examining the data.

Greg Young identified this in the domain-driven design context, in writing as early as 2010. "Is there a difference between 'Correcting an Address' and 'Relocating the Customer'?" he asked. "It likely will be if the domain in question is for a telephone company that sends the yellow pages to a customer when they move to a new location." His broader point was sharper: "If I don't store intent there are an entire series of questions I can no longer ask the data."

The conventional response has been to let each domain define its own intent vocabulary — `AddressCorrection` vs. `CustomerRelocated` — and leave the mapping to application developers. This works within a single bounded context. It breaks the moment events cross service boundaries, survive schema changes, or need to be compared across systems. The vocabulary is not portable because it was never standardized.

EO proposes that the verb set is not infinite, and that standardizing it is not just possible but architecturally necessary. There are precisely nine transformation types — nine operators that compose to build any conceivable data transformation, and into which any complex transformation, in any domain, can be decomposed.

---

## Why these nine

This proposal comes out of EO, but its claim here is straightforward: there are nine and only nine canonical kinds of change.

That number is not arbitrary. It comes from crossing two independent questions, each with three exhaustive answers.

First: *where* does a transformation operate? It can operate on existence, on structure, or on significance. A change can affect whether something is there, how things are separated or connected, or what those things mean. These are dependency-ordered: structure presupposes existence, and significance presupposes structure.

Second: *how* does a transformation act? It can differentiate, relate, or generate. It can separate, connect, or produce.

Three domains crossed with three modes yields nine operators. Each operator names one unique combination of where a transformation occurs and how it acts.

For event streaming, that theoretical derivation is less important than the practical test. A taxonomy earns credibility by covering the cases that matter. The claim here is that every data-transformation verb in common use — whether in CRUD systems, event sourcing, schema evolution, or stream processing — can be decomposed into one of these nine operators or into a composition of them. The usefulness of the set is the evidence for its completeness.

The nine operators are organized in three triads, each addressing a different layer of what a transformation can do.

---

### EXISTENCE — whether things are

`NUL` — Record absence. Not "missing data" but an explicit, representable state: this value was cleared, this field has never been populated, this type has not been assigned. SQL has one NULL for all three. NUL distinguishes them. *Closest standard equivalent:* DELETE, but without destroying the record. Soft-delete with semantic precision — the system knows why something is absent.

`SIG` — Designate signal from noise. Before classification, before schema, there is the act of declaring that something counts — that this, out of everything the system could track, is worth tracking. A write-ahead log contains every change to every row. The decision about which changes to capture is SIG. A sensor array produces continuous data; the decision about which readings constitute events is SIG. *Closest standard equivalent:* none, precisely because most systems treat this decision as configuration rather than as a first-class operation. Debezium's connector configuration — which tables, which columns, which operations to capture — is a SIG decision, but it happens outside the event stream. SIG makes the act of designating salience an explicit, auditable event in the stream itself.

`INS` — Instantiate. Bring a concrete entity into existence under a designation that SIG has marked as signal. The only operator that creates entities and the only one that mints anchors — content-addressed identifiers that give each entity a permanent, frame-independent identity. *Closest standard equivalent:* INSERT, in the simple case — a genuine first occurrence, not a re-instantiation or overwrite.

### STRUCTURE — how things connect

`SEG` — Draw a boundary. Partition a collection, split a record, establish the line between inside and outside. *No direct CRUD equivalent.* Database partitioning, table splitting, the moment a microservice boundary is drawn through what was previously one data model.

`CON` — Connect across a boundary. Create a relationship between entities that SEG has separated. *Closest standard equivalent:* Foreign keys. JOIN. The data-sharing agreement between two agencies. Any operation that links things that were previously independent.

`SYN` — Merge into a whole. Produce a derived entity that cannot be decomposed back into its parts without losing what made it coherent. *Closest standard equivalent:* Aggregate functions, materialized views, record merges. The key distinction: SYN produces something that exceeds its inputs.

### SIGNIFICANCE — what things mean

`EVA` — Change a value within a stable frame. The email address changed. The status field changed. The interpretive context — what an email address is, what a status means — did not. *Closest standard equivalent:* UPDATE, but only the simple case. Most of what systems emit as UPDATE is EVA. The rest is one of the other eight operators wearing UPDATE's name.

`DEF` — Hold multiple incompatible values simultaneously. Two agencies report different addresses for the same client. Neither is wrong. SIG designated both as signal — both sources count, both readings matter — and demoting either to noise would destroy information the system was built to preserve. Last-write-wins performs exactly that destruction. DEF holds both as a representable, queryable state. *No standard equivalent.* This is the operator most existing systems cannot express. CRDTs approximate it with multi-value registers but treat superposition as a temporary condition awaiting resolution. DEF treats it as data.

`REC` — Change the frame itself. Not "the value changed" but "what the value means changed." A schema migration. A reclassification from domestic to international that reinterprets every field on the record. A policy change that retroactively alters how historical data is read. *Closest standard equivalent:* Schema migration, event versioning, upcasting — except in most systems these happen out-of-band and are never recorded in the event log. REC makes frame transformation a first-class stream event.

---

## Common operations, decomposed

Most systems emit a handful of verbs. Here is what those verbs actually contain when you open them up.

**INSERT a new customer record:**

```
INS(customer:blake, {name: "Blake", email: "blake@example.com"})
```

Straightforward. One operator, one event.

**UPDATE a customer's email address:**

```
EVA(customer:blake.email, "blake@newdomain.com")
```

A value changed. The frame did not. This is the simple case — and the only case CRUD's UPDATE should cover.

**UPDATE a customer's status from "standard" to "premium":**

```
EVA(SEG(customer:blake.status), "premium")
```

This is not the same as changing an email. The customer crossed a category boundary. The EVA contains a SEG because the mutation moved the entity from one partition to another. A downstream billing system needs to know the difference. CRUD cannot tell it.

**DELETE a customer record:**

```
SEG(NUL(customer:blake))
```

Nothing is destroyed. The absence is recorded (NUL), and a boundary is drawn excluding the entity from the active set (SEG). The record persists in the log. The deletion is an event, not an erasure.

**UPDATE where two sources disagree:**

```
DEF(customer:blake.address, ["123 Main St (DHS)", "456 Oak Ave (VA)"])
```

Neither value is wrong. Both are authoritative. Last-write-wins would silently destroy one. DEF holds both. Query: "show all records in superposition" — impossible in SQL, native here.

**Schema migration — add a field to all customer records:**

```
REC(schema.customers, v3.2)
```

The interpretive frame changed. Every downstream query now operates under the new schema. The old schema is not overwritten — it is whatever was in the stream before this operator. Historical replay uses the chain of REC events to know which frame applied at which time.

**Merge two duplicate customer records into one:**

```
SYN(customer:blake, [customer:blake-001, customer:blake-002])
```

No CRUD verb for this. The merged record is not an INSERT (nothing new was created) or an UPDATE (neither source record was modified). It is a synthesis — a derived whole that exceeds its parts.

**Split an orders table into customers and orders during normalization:**

```
SEG(orders, [customers, orders]) → CON(orders.customer_id, customers.id)
```

First draw the boundary, then connect across it. Two operators, dependency-ordered. Reversing the sequence — connecting before separating — is not just bad practice, it is structurally incoherent. The dependency ordering catches it.

**Assign a schema to a previously untyped data stream:**

```
SIG(stream:raw-events, schema:customer-v1)
```

The stream now has a designation: these events count, and they count as this kind of thing. Downstream consumers know what to expect. The act of designating salience is itself an event in the log, not metadata applied after the fact.

---

## Quantum gate operations, decomposed

If nine operators can classify customer record updates, that's useful. If they can classify quantum gate operations — a domain whose verbs look nothing like CRUD — that's a stronger signal.

Quantum computing uses a vocabulary like Hadamard, CNOT, phase rotation, measurement, and error correction. At first glance it feels completely alien to database operations. But open the gates up and look at the transformation underneath.

**A qubit initialized to the |0⟩ state:**

```
INS(qubit:q0, {state: |0⟩})
```

Underneath that INS is an implicit SIG — the decision that *this* degree of freedom in the physical system is the one you're going to treat as a qubit. The rest of the quantum noise in the environment is not signal. That designation is literally what qubit initialization is: marking which part of the Hilbert space the system will pay attention to.

**A Hadamard gate places the qubit into superposition** — it now simultaneously holds |0⟩ and |1⟩:

```
DEF(qubit:q0.state, [|0⟩, |1⟩])
```

SIG designated this qubit as signal. DEF says both of its incompatible states are signal too — neither can be demoted to noise without losing information. Collapsing either one is a destructive act, which is exactly what measurement does.

**Entangling two qubits with a CNOT gate** creates a dependency between systems that were previously independent:

```
CON(qubit:q0, qubit:q1, {gate: CNOT})
```

**Measurement** collapses the superposition into a definite classical value:

```
EVA(DEF(qubit:q0.state), |1⟩)
```

**A Bell pair** — the canonical entangled state — appears as a small composition log:

```
1  INS(qubit:q0, {state: |0⟩})
2  INS(qubit:q1, {state: |0⟩})
3  DEF(qubit:q0.state, [|0⟩, |1⟩])
4  CON(qubit:q0, qubit:q1, {gate: CNOT})
5  SYN(register:bell-pair, [qubit:q0, qubit:q1])
```

Line 5 matters. After entanglement, the system is no longer just two connected qubits. It becomes a new composite entity — the Bell pair — whose state cannot be decomposed back into independent qubits without destroying what made it coherent. That's SYN.

Decoherence — where the environment destroys quantum information without asking permission — is NUL on the coherence, then EVA on the residual state. Error correction detects corruption and reinterprets qubit states under a corrected frame — that's REC.

Quantum gates are domain-specific names. The underlying transformation types are not. Hadamard is DEF. CNOT is CON. Measurement is EVA on a DEF. Bell-state preparation ends with SYN. Nine operators, no extensions required.

---

## The log is the query

There is a property of this notation that is easy to miss and hard to overstate.

EO operators are written in prefix notation — the operator comes first, then its arguments. `EVA(customer:blake.email, "new@example.com")`. This is Polish notation, the same convention used by Lisp, by spreadsheet formulas, and by every RPN calculator ever built. It is not a stylistic choice. It means the log entry is already a function call.

`EVA(customer:blake.email, "new@example.com")` is not a description of what happened that then gets routed to a handler somewhere else. It is an executable instruction. The operator is the function. The target and operand are its arguments. Replaying the log is executing the program. Line by line:

```
1  INS(customer:blake, {name: "Blake", email: "blake@example.com"})
2  EVA(customer:blake.email, "blake@newdomain.com")
3  DEF(customer:blake.address, ["123 Main St", "456 Oak Ave"])
4  EVA(SEG(customer:blake.status), "premium")
5  REC(schema.customers, v3.2)
```

To get the current state of `customer:blake`, you replay — which means you execute — lines 1 through 5 in order. That is standard event sourcing. But because every line is a typed function call with explicit arguments, the log is also its own query language.

*"Show me every boundary crossing for customer:blake"* is not a query you write against a separate index. It is a filter: return every line where the outer function is EVA and the inner function is SEG, scoped to `customer:blake`. The query is a pattern match on the log itself.

*"Show me all records currently in superposition"* — return every entity whose most recent unresolved function call is DEF. No special audit table. No out-of-band metadata. The log already contains the answer because the operator is the classification.

*"Show me every frame change since January"* — filter for REC. *"Show me everything that was instantiated but never connected"* — find INS calls with no subsequent CON. *"Show me the full causal chain that produced the current state of this entity"* — replay the log for that entity's anchor and read the sequence. The sequence is the causal chain.

This works because the instruction set is closed. Nine functions. Not nine hundred. A conventional event sourcing system has an open-ended vocabulary — `CustomerCreated`, `CustomerRelocated`, `InvoiceVoided`, `SchemaV3Migration` — that grows with every feature, every service, every schema version. Every new event type is a new instruction the consumer must learn to handle. A consumer encountering an event type it has never seen either crashes or silently drops it.

With nine operators, the instruction set never grows. A consumer built today will correctly execute every event emitted by every service built ten years from now, because those future services will still emit the same nine functions. The domain-specific meaning — which customer, which email address — lives in the arguments. The transformation type — what kind of change — lives in the function name, and there are only nine of those, permanently. In practice, compositions stay shallow — most real transformations are depth 1 or 2, occasionally 3. The nesting is bounded not by a formal limit but by the dependency ordering between triads: you don't need existence operators inside significance operators, and the combinations that occur in practice are a small, predictable subset of the combinatorial space.

The entire event processor is:

```
for event in log:
    event.op(event.target, event.operand)
```

Read a line. Call the function. Move to the next line. That is eval on a closed instruction set. The conventional event sourcing architecture requires separate systems for the event store, the projection engine, the query index, and the audit log. EO collapses them — not through clever infrastructure, but because the vocabulary is small enough that storage, classification, and execution are the same act.

---

## What EO is not

EO does not replace Kafka. It does not replace Debezium. It does not replace CloudEvents or EventStore or Axon or any existing event infrastructure. Those systems handle transport, capture, envelope, and storage. EO provides the nine-word vocabulary that goes inside the envelope — the semantic layer that every one of those systems deliberately left to each implementer.

It is a candidate to fill the `type` field that CloudEvents left producer-defined. It is a candidate to replace the CRUD verbs that Debezium uses to classify changes. It is a candidate to standardize the event names that every event sourcing team reinvents from scratch.

The claim is strong, and it is testable: these nine operators, and no fewer, are sufficient to classify any data transformation an event stream can carry. Every `CustomerUpdated` your system emits is one of these nine types, or a composition of them. The question is whether you want that classification to be explicit, portable, and auditable — or implicit, application-specific, and lost the moment the schema changes.

---

## Try it

Theory is cheap. The question is whether nine operators actually hold up when you point them at real data.

There is a working demo — a database build driven entirely by EO event streaming — where you can watch the operators compose in practice. Records get instantiated, boundaries get drawn, values get altered, frames get changed, and the log stays readable throughout because every event is one of nine typed function calls. No `CustomerUpdated`. No `OrderArchived`. Just the operator, its target, and its operand, all the way down.

The demo is at [clovenbradshaw-ctrl.github.io/khora-demo](https://clovenbradshaw-ctrl.github.io/khora-demo). Walk through it. Try to find a transformation it can't express. That's the only test that matters.
