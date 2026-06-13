# EO Notation

**Record ID:** wiki:eo-notation  
**DB ID:** 16  
**Tags:** 201  
**Keywords:** register, operator, polish notation, lukasiewicz  
**Status:** published  
**Updated:** 2026-03-26T22:20:29.564Z  

---

# EO Operator Notation

EO Operator Notation is the formal syntax for expressing transformations in EO. It extends Polish notation (operation-first syntax) with ontological typing on arguments, register marking on operators, and hierarchical grain targeting on paths.

The notation uses a single vocabulary of three symbols — `+`, `−`, `*` — applied at every structural level: arguments, operators, and grain positions within dot paths. A fourth symbol — `_` — marks syntactic traversal without ontological participation, and appears only in dot paths.

The system is progressive. Any slot may be left unmarked. An unmarked slot is not empty — it holds all three positions (−/+/*) in implicit superposition. Marking a slot narrows it. Resolution increases by determination, not by switching systems.

## 0. What This Notation Does

Every EO expression encodes a transformation. The notation captures three things simultaneously:

- **What kind** of transformation (operator identity)
- **What is being transformed and through what** (target and operand, with ontological type)
- **At what reflexive altitude** the act occurs (register)

These three levels are not separate systems layered on top of each other. They use the same vocabulary — `−`, `+`, `*` — applied in different structural positions. The notation is made of the same triadic logic it describes. Ground, Figure, and Pattern are not just what it talks about. They are what it is built from.

The design principle: start unmarked, determine as needed. A fully unmarked expression holds all positions simultaneously. A fully specified expression has collapsed each axis to a single value. Both are the same system at different resolutions.

---

## 1. The Basic Expression

```
operator(target, operand)
```

| Position | Question | Structural Role |
| --- | --- | --- |
| Operator | What kind of transformation? | Figure (active element) |
| Target | What is being transformed? | Ground (substrate acted on) |
| Operand | Through what means? | Pattern (mediating principle) |

The three positions correspond to the framework's central trichotomy: **Figure – Ground – Pattern**.

With full marking:

```
operator±*(target±*, operand±*)
```

`±*` on the operator = register. `±*` on each argument = ontological type. All markings are optional. Unmarked slots hold all three positions in implicit superposition — they are not empty, they are full.

---

## 2. Progressive Activation

Determination narrows gradually. Each additional marker collapses one axis from superposition to a single value:

```
ε(Maria, program)              — all type/register axes in superposition
ε(Maria+, program)             — target collapsed to Figure; operand still in superposition
ε(Maria+, program−)            — both arguments determined
ε*(Maria+, program−)           — register collapsed to Pattern
```

No step here replaces the previous one. `ε(Maria, program)` is not the simplified version of `ε*(Maria+, program−)`. It is an expression where every type and register axis holds all three positions simultaneously. The unmarked form is not less — it is more. It contains every possibility that marking would narrow.

This is not training wheels followed by the real thing. It is one system with a gradient of determination.

### Worked Example: 反者道之動

*"Reversal is the movement of the Way."* — Tao Te Ching, Chapter 40

Five characters. Four levels of determination:

```
δ(道, 反)
```

The Way alternates through reversal. EVA — same entity, different state. The most open reading: 道 and 反 are both unmarked, holding all three ontological positions simultaneously. The Way is Ground and Figure and Pattern at once. Reversal is Ground and Figure and Pattern at once. This is not vagueness. It is fullness. It is what the Tao *is*.

Now narrow:

```
δ(道−, 反*)
```

The Way *as ground* — ambient, substrate, the condition of everything — alternates *through reversal as pattern* — the relational, mediating dynamic. Two axes collapsed. The expression now says something specific about how these entities are construed in this transformation.

Now nest:

```
Ω(δ(道−, 反*))
```

REC wrapping EVA. Read inside-out: *the Way alternates through reversal, and that alternation is itself recursively recognized as the fundamental motion.* Nesting reveals mechanism. A flat `δ` says "something changed state." Wrapping it in `Ω` says "that state-change IS the self-generating principle."

Now add register:

```
Ω+(δ*(道−, 反*))
```

REC at figure register (examining its own framework), wrapping EVA at pattern register (the act includes awareness of its own conditions). Laozi is not making a naïve observation. He is doing philosophy — an act that examines its own conditions. The register says so.

Four expressions. Each determines one more axis. The progression *enacts the verse* — each step returns to the same two words (道, 反) and finds more there. The deepening is the reversal.

And the verse's second line — 弱者道之用, *weakness is the function of the Way* — is the notation's own principle: the unmarked slot, holding everything, is what makes progressive determination possible. Without the ability to hold all positions at once, every expression would be maximally determined from the start. The fullness of the unmarked is 弱. And 弱者道之用.

**Core rule:** An unmarked slot is not underspecified. It is an expression where the axis holds all positions simultaneously. Marking narrows. The notation breathes — it is as determined or as open as the situation requires.

---

## 3. The One Vocabulary: −, +, *

Three symbols do work at every structural level of the notation. The same marks appear in different positions with different functions, because the same triadic logic operates at every level.

| Position | `−` | `+` | `*` |
| --- | --- | --- | --- |
| **On arguments** (type) | Ground: ambient, substrate, condition | Figure: bounded, discrete, particular | Pattern: relational, mediating, dynamic |
| **On operators** (register) | Ground register: act without reflexive awareness | Figure register: act examines its own framework | Pattern register: act includes its own conditions |
| **In dot paths** (grain) | Ground: substrate/schema at this level | Figure: specific entity at this level | Pattern: relational space across entities at this level |

This is not coincidence. It is the framework's central claim instantiated in its own syntax: the same trichotomy applies at every structural level because that is what EO claims about reality.

The `−`/`+`/`*` vocabulary is supplemented by one additional symbol:

| Symbol | Meaning | Where it appears |
| --- | --- | --- |
| `_` | Not participating (syntactic traversal only) | Dot paths only — where syntax requires a character but the level does not enter the expression's meaning |

In the type system and register system, the unmarked state is implicit superposition — all three positions held at once. In a dot path, you cannot leave a segment blank — `customer..email` is not parseable. The underscore `_` is structurally different from unmarked. Unmarked holds everything. `_` holds nothing. The level is passed through syntactically without ontological participation.

---

## 4. Ontological Type (Marking Arguments)

Each argument — target and operand — may be typed:

| Marker | Name | Meaning |
| --- | --- | --- |
| `+` | Figure | Specific, bounded, discrete |
| `−` | Ground | Ambient, substrate, condition |
| `*` | Pattern | Relational, mediating, dynamic |
| unmarked | — | Implicit superposition of all three positions |

Markers are postfix:

```
ε(Maria+, program−)
```

Read: *Connect Maria (as figure) to program (as ground).*

**Type markers specify how an entity is construed in this operation. They do not describe intrinsic essence.** Maria is not inherently Figure or Ground. She is construed as one or the other depending on the transformation being expressed.

### One Operator, Nine Realities

Using CON (ε) with the same two nouns:

| Expression | Target Type | Operand Type | Meaning | Explanation |
| --- | --- | --- | --- | --- |
| `ε(Maria+, program+)` | Figure | Figure | Assignment | Two discrete particulars are linked. A specific person connected to a specific institutional unit. |
| `ε(Maria+, program*)` | Figure | Pattern | Participation | A bounded individual connected into an active relational system — processes, norms, dynamics. |
| `ε(Maria+, program−)` | Figure | Ground | Immersion | A specific individual connected into an ambient holding condition or environment. |
| `ε(Maria*, program+)` | Pattern | Figure | Evaluation | Maria treated as relational dynamics, connected to a specific institutional structure for comparison. |
| `ε(Maria*, program*)` | Pattern | Pattern | Pattern Coupling | Two dynamic relational systems connected. Interaction at the level of structure-to-structure. |
| `ε(Maria*, program−)` | Pattern | Ground | Contextual Reorganization | A relational system connects to a holding environment that allows its patterns to shift. |
| `ε(Maria−, program+)` | Ground | Figure | Structural Mismatch | A complex life-context connected to a bounded institutional unit; the unit may be too narrow. |
| `ε(Maria−, program*)` | Ground | Pattern | Field–System Interface | An ambient lived context encounters an organized relational system. Friction may occur. |
| `ε(Maria−, program−)` | Ground | Ground | Co-Presence | Two ambient conditions come into proximity. Atmospheric rather than transactional. |

Same operator. Same nouns. Only type differs.

---

## 5. Register (Marking Operators)

Register marks the reflexive altitude of the act itself. Applied to the operator:

| Marker | Register | Meaning |
| --- | --- | --- |
| unmarked | — | Implicit superposition of all three registers |
| `−` | Ground register | Act occurs without reflexive awareness |
| `*` | Pattern register | Act includes its own conditions/provenance |
| `+` | Figure register | Act examines its own framework |

**Unmarked ≠ ground.** Unmarked holds all three registers in superposition. Ground register must be written explicitly to collapse to ground alone:

```
σ−(patient+, diabetic*)       — brute designation (ground register determined)
σ(patient+, diabetic*)        — register in superposition (all three held)
```

These are different expressions. The first has collapsed register to ground — the act happens without reflexive awareness. The second holds all three registers simultaneously — the act's reflexive altitude is undetermined.

### Examples

| Expression | Meaning |
| --- | --- |
| `σ(patient+, diabetic*)` | Designation (register unspecified) |
| `σ−(patient+, diabetic*)` | Brute designation — labeling without examining the act of labeling |
| `σ*(patient+, diabetic*)` | Situated designation — labeling that includes awareness of its own conditions |
| `σ+(patient+, diabetic*)` | Framework-questioning designation — labeling that examines the system of labels |

Register is optional unless reflexivity matters.

---

## 6. Determination and Superposition

Every slot in an EO expression exists on a gradient of determination — from holding all positions to holding one.

### The Gradient

| State | What it is | What it holds |
| --- | --- | --- |
| unmarked | Implicit superposition | All three positions (−/+/*) simultaneously |
| `∥` between values | Explicit superposition | A specified subset (e.g., +∥− = Figure and Ground, not Pattern) |
| single marker | Determined | One position |
| `_` | Non-participation | Nothing — syntactic traversal only (dot paths) |

Determination is not binary (on/off). It is a narrowing:

```
Maria       — implicit superposition: Ground and Figure and Pattern
Maria+∥−    — explicit superposition: Figure and Ground, not Pattern
Maria+      — determined: Figure
```

Each step narrows. The unmarked form is the fullest — it contains every possibility. The determined form is the most specific — it has collapsed to one. Explicit superposition is between: the field has been partially narrowed to a specified subset.

### Unmarked Is Not Empty

This is the critical principle. An unmarked slot is not a gap, not an absence, not "axis off." It is a slot holding all three positions at once. `ε(Maria, program)` does not mean "connect Maria to program, with type unspecified." It means "connect Maria-as-Ground-Figure-and-Pattern to program-as-Ground-Figure-and-Pattern." The expression is maximally full, not minimally specified.

This is why marking *narrows* rather than *adds*. When you write `ε(Maria+, program)`, you have collapsed Maria from three positions to one. Program remains in superposition. You have not added information to an empty slot. You have determined what was previously held open.

### Explicit Superposition: ∥

The `∥` symbol marks post-determination multiplicity — a slot that has been narrowed to a specific subset:

```
Maria+∥−                      — Figure and Ground simultaneously (not Pattern)
σ−∥*(...)                     — ground and pattern register (not figure)
customer.123∥456.email         — two specific records simultaneously
```

Explicit superposition differs from unmarked because it *excludes*. `Maria+∥−` has ruled out Pattern. Unmarked `Maria` has ruled out nothing.

### The `_` Exception

In dot paths only, a fourth state exists: non-participation. The underscore `_` means the grain level is traversed syntactically but does not enter the expression's meaning at all. It is not superposition — it holds no positions. It is the path passing through a level without that level being part of what is expressed.

```
customer._.email               — record grain does not participate
```

This differs from `customer.*.email` (record grain in Pattern position) and from an unmarked noun like `Maria` (all positions held). The `_` is genuinely empty where unmarked is genuinely full.

### Summary

The notation has three modes of indeterminacy, not one:

- **Unmarked** — holds everything (implicit superposition, all three)
- **∥** — holds a specified subset (explicit superposition, two of three)
- `_` — holds nothing (non-participation, dot paths only)

And one mode of determinacy:

- **Single marker** — holds one position (collapsed)

---

## 7. Targeting: Dot Notation and Grain

The target and operand in an EO expression are not just nouns. They are resolvable paths in a hierarchy.

### The Dot Path

```
customer.123.email
```

Each segment resolves one grain level. Each dot is a grain boundary. The depth of the path determines the grain of the expression:

| Path | Grain |
| --- | --- |
| `system` | System |
| `customers` | Collection |
| `customer.123` | Record |
| `customer.123.email` | Field |

### Grain Levels

The same nine operators apply at every grain level, but they mean different things at each:

| Operator | Field | Record | Collection | System |
| --- | --- | --- | --- | --- |
| NUL | Field cleared | Record removed | Collection dropped | Namespace removed |
| SIG | Field typed | Record classified | Collection schema'd | Namespace designated |
| INS | Field populated | Record created | Collection created | Namespace created |
| SEG | Multi-value split | Record split | Collection partitioned | System sharded |
| CON | Field→field ref | Record→record link | Collection→collection | System→system |
| SYN | Values merged | Records merged | Collections merged | Systems merged |
| EVA | Value changed | Record state changed | Config changed | System config changed |
| DEF | Field has conflicts | Record has conflicts | Collection conflicts | System conflicts |
| REC | Field reinterpreted | Record reframed | Schema migrated | System reframed |

Same nine types. Different scope. The operator is the same. The grain determines its concrete semantics.

### Grain Markers in Paths

Each segment in a dot path can take the same `−`/`+`/`*`/`_` vocabulary as every other position in the notation. The segment resolves — or does not resolve — that grain level:

| Segment | Meaning |
| --- | --- |
| `123` or `email` | **Figure (**`+`**)** — a specific, resolved entity at this grain. The default when a concrete identifier is present. |
| `*` | **Pattern** — the relational space across entities at this grain. Not "any record" as a logical quantifier, but "the record level construed as a mediating structure." |
| `−` | **Ground** — the substrate or schema at this grain. Not a specific entity, not the space across entities, but the structural condition that enables entities to exist at this level. |
| `_` | **Non-participation** — this grain level is traversed syntactically but does not participate in the expression's meaning. Holds no positions. |

Note: in type and register slots, an *unmarked* position holds all three in implicit superposition. In a dot path, there is no unmarked state — every segment must contain a character. The `_` is NOT the dot-path equivalent of unmarked. Unmarked holds everything. `_` holds nothing. They are opposites.

### Examples

```
customer.123.email             — fully resolved: specific collection, specific record, specific field
customer.*.email               — record grain as Pattern: the email field across the relational space of records
customer._.email               — record grain non-participating: the email field, record level traversed but not part of the meaning
customer.−.email               — record grain as Ground: the email field at the schema/substrate level
```

The distinction between `*` and `_` is critical. `customer.*.email` construes the record level as a relational, mediating space — you are looking *across* records. That is an ontological claim. `customer._.email` makes no claim about the record level at all — the path passes through it structurally but that level does not enter the expression. One is full (Pattern). The other is empty (non-participation).

### Why * Is Not a Collision

The `*` symbol in a dot path and the `*` symbol in the type system are not a namespace conflict. They are the same operation at different structural levels.

What does `*` mean in the type system? Construe this entity as relational, mediating, dynamic.

What does a programmer mean when they write `*` in a path? Traverse the relational space across instances at this level.

The programmer's wildcard and EO's Pattern marker point at the same cognitive operation. The wildcard has always been a grain-level Pattern construal — it just didn't have a name for it. Both notations discovered the same thing. EO recognizes what the wildcard has always been doing.

### Mapping to Familiar Operations

| EO Grain Path | Familiar Operation | What's Happening |
| --- | --- | --- |
| `customer.123.email` | `SELECT email FROM customers WHERE id = 123` | Figure at record grain — get this one |
| `customer.*.email` | `SELECT email FROM customers` | Pattern at record grain — traverse the relational space |
| `customer.−.email` | `DESCRIBE customers.email` | Ground at record grain — what is this field? what type? what constraints? |
| `customer._.email` | *(no SQL equivalent)* | Record grain non-participating — the field, without the record level entering the expression |

Three of these are familiar operations that SQL expresses with entirely different commands. EO uses one path with different grain markers because it recognizes these as the same structural trichotomy applied at a different level.

---

## 8. Cross-Grain Expressions

By default, target and operand in an expression live at the same grain. When both paths resolve to the same hierarchy depth, the expression is same-grain:

```
ε(customer.123, team.5)        — record to record (same grain)
```

When target and operand paths resolve to different depths, the expression is cross-grain:

```
REC(program.housing.funding_model, client.maria.household_type)
```

System-grain target, field-grain operand. Read: *the funding model was reframed through a single household classification field.*

### Why Cross-Grain Matters

The operand position is Pattern — the mediating principle, the through-which. Mediating principles do not always live at the same grain as the thing being transformed. The most significant transformations are precisely the ones where they don't.

Cross-grain expressions capture **vertical causation** — how a transformation at one level is mediated by an entity at another level. Without cross-grain, you can describe what happened at each level separately. With cross-grain, you can express *what connected them*.

### Cross-Grain with Grain Markers

The full vocabulary — `+`, `−`, `*`, `_` — is available at every grain segment, enabling precise cross-grain expressions:

**Field transformed through system-level schema:**

```
REC(customer._.diagnosis, schema.v2)
```

The diagnosis field (record grain non-participating — `_` means that level doesn't enter the expression) is reframed through a system-level schema change.

**Collection partitioned through a field-level attribute:**

```
SEG(customers, customer.*.status)
```

The customer collection is segmented through the status field, with record grain construed as Pattern (the relational space across records).

**System reframed through a single anomalous record:**

```
REC(program.classification_schema, patient.789)
```

A system-level classification is reframed through a single record-grain entity. This is how paradigm shifts actually work — a single particular collapses a general frame.

### Querying Cross-Grain Patterns

With `_` at non-participating grains, cross-grain becomes a queryable structural pattern:

```
REC(program._.funding_model, client._.household_type)
```

Both paths traverse their middle grains without participating in them. This doesn't ask about a specific program or a specific client. It asks: *where in the system do field-level household classifications mediate program-level funding reframes?* That is a query about the shape of vertical causation — a structural pattern that becomes addressable once cross-grain is in the notation.

### Same-Grain as Default

Cross-grain is activated by path depth mismatch. No additional marker is needed — the paths themselves signal the cross-grain relationship. When grains match, the expression is same-grain. When they differ, the expression is cross-grain. Progressive activation: cross-grain only appears when the phenomenon requires it.

---

## 9. Nesting: Horizontal and Vertical

Operators compose in two dimensions: horizontally (at the same grain) and vertically (across grains).

### Horizontal Nesting

Operators compose by wrapping. Read inside-out:

```
ν(ε(Maria+, program+))        — Disconnection: nullify a connection
κ(η(team−, project*))         — Segment a synthesis
Ω(σ(carbon+, commodity*))     — Recursively recognize a designation
```

9 ⤫ 9 = 81 two-deep compositions. Type distinctions alter meaning at every level:

```
ν(ε(Maria+, program+))        — Disconnection
ν(ε(Maria−, program−))        — Alienation
ν(ε(Maria*, program*))        — Estrangement
```

Same operator nesting. Different types. Different realities.

**Nesting is the diagnosis.** Flat operators name symptoms. Nested operators reveal mechanisms.

### Vertical Nesting

A higher-grain operation decomposes into lower-grain operations. This is the containment relationship — how changes at one level break down into changes at the levels beneath:

```
EVA(customer.123)
 └─ EVA(customer.123.email)
 └─ NUL(customer.123.status)
 └─ INS(customer.123.title)
```

Record-level EVA contains field-level EVA + NUL + INS. The higher-grain operator is not a summary — it is a real operation at record grain that *contains* real operations at field grain.

Vertical nesting enables scoped queries:

```
"What changed?"                → system level
"What changed in customers?"   → collection level
"What changed in customer 123?" → record level
"What happened to customer.123.email?" → field level
```

Each query returns operators at the appropriate grain. Drill down for detail. Roll up for summary.

### Combined: Horizontal + Vertical

A fully specified transformation can nest both horizontally and vertically:

```
REC(program.housing.funding_model, client.maria.household_type)    — cross-grain, horizontal
 └─ EVA(program.housing.stats)                                     — vertical decomposition
     └─ EVA(caseload.worker_5)
     └─ EVA(client.maria.benefits)
         └─ EVA(client.maria.eligibility)
```

The top-level expression captures the cross-grain mediation (what caused what across scale). The vertical nesting captures the decomposition (what happened at each level). Together they provide both the causal structure and the operational detail.

---

## 10. The Nine Operators (Reference)

| Code | Glyph | Greek | Triad | Mode | Function |
| --- | --- | --- | --- | --- | --- |
| NUL | ∅ | ν | Existence | Differentiating | Withdraw determination |
| SIG | ⊡ | σ | Existence | Relating | Direct attention; register signal |
| INS | △ | α | Existence | Generating | Instantiate a particular |
| SEG | | | κ | Structure | Differentiating | Partition, draw boundary |
| CON | ⤫ | ε | Structure | Relating | Establish connection |
| SYN | ∨ | η | Structure | Generating | Synthesize into whole |
| EVA | ∿ | δ | Significance | Differentiating | Shift state |
| DEF | ∥ | ψ | Significance | Relating | Hold multiplicity |
| REC | ⊛ | Ω | Significance | Generating | Recursive revision |

Helix ordering:

```
ν → σ → α → κ → ε → η → δ → ψ → Ω
```

Three-letter codes, practitioner glyphs, and Greek symbols are interchangeable. Use three-letter codes in discourse, practitioner glyphs in applied work and claim schemas, Greek symbols in algebraic and formal contexts.

Full operator definitions, biological grounding, and dependency arguments live on the Operators page. This table is for reference within notation contexts only.

---

## 11. Relationship to Natural Language Grammar

EO makes explicit what natural languages encode implicitly.

| Linguistic Role | EO Marker |
| --- | --- |
| Proto-agent | `+` |
| Proto-patient | `−` |
| Instrument / mediator | `*` |

Natural languages bind these roles to case morphology, word order, and voice systems. EO separates ontological typing from all of these, making the construal independent of the surface grammar that carries it.

Unlike SQL — which has no grammar position for ontological type — and unlike natural language — which conflates type with syntactic role — EO gives ontological construal its own explicit marking system. The same transformation on the same entities means something different depending on how those entities are typed, and the notation makes that difference visible.

---

## 12. Full Specification Summary

### Syntax

```
operator(register?)(target(type?), operand(type?))
```

Expanded:

```
operator±*(target±*, operand±*)
```

All `±*` optional.

### Operators

```
ν  σ  α  κ  ε  η  δ  ψ  Ω
NUL SIG INS SEG CON SYN EVA DEF REC
```

### Register

| Marker | Meaning |
| --- | --- |
| unmarked | Implicit superposition (all three registers held) |
| `−` | Ground register |
| `*` | Pattern register |
| `+` | Figure register |

### Type

| Marker | Meaning |
| --- | --- |
| unmarked | Implicit superposition (all three types held) |
| `+` | Figure |
| `−` | Ground |
| `*` | Pattern |

### Grain (Dot Path Segments)

| Segment | Meaning |
| --- | --- |
| identifier | Figure (resolved entity) |
| `*` | Pattern (relational space across entities) |
| `−` | Ground (substrate/schema) |
| `_` | Non-participation (traversed without meaning) |

### Superposition

```
∥
```

Valid in any slot: type, register, or grain segment.

### Parsing Rules

1. Type markers bind to nouns (postfix).
2. Register markers bind to operators (postfix).
3. Grain markers occupy segments between dots.
4. Unmarked slots hold all three positions in implicit superposition.
5. Unmarked ≠ ground. Unmarked ≠ empty. Unmarked = full.
6. Same-grain is default; cross-grain is activated by path depth mismatch.
7. Vertical nesting uses containment (`contains` / `└─`) to decompose across grain.
8. `_` in dot paths is non-participation — structurally opposite to unmarked.

### The One Vocabulary

| Symbol | On Arguments | On Operators | In Dot Paths |
| --- | --- | --- | --- |
| `+` | Figure (bounded, particular) | Figure register (framework-examining) | Resolved entity at this grain |
| `−` | Ground (ambient, substrate) | Ground register (unreflective) | Substrate/schema at this grain |
| `*` | Pattern (relational, dynamic) | Pattern register (self-including) | Relational space at this grain |
| unmarked | Implicit DEF (all three held) | Implicit DEF (all three held) | *(no unmarked state — use *`_`* for non-participation)* |
| `_` | *(not applicable)* | *(not applicable)* | Non-participation (traversed, no meaning) |
| ∥ | Explicit DEF (specified subset) | Explicit DEF (specified subset) | Explicit DEF (specified subset) |

One vocabulary. Three structural levels. Determination as narrowing. Unmarked is full. `_` is empty.

---

*Revision History*

- **v2.0**: Full restructure. Added: Progressive Activation with Tao Te Ching worked example (§2), The One Vocabulary (§3), Determination and Superposition correcting unmarked semantics (§6), Targeting and Grain with `−`/`+`/`*`/`_` grain markers (§7), Cross-Grain Expressions (§8), Horizontal and Vertical Nesting (§9). Corrected unmarked from "axis not activated" to "implicit superposition of all three positions." Distinguished `_` (non-participation, dot paths only) from unmarked (full superposition). Unified grain markers with type vocabulary. Operator table updated to SIG (from DES), EVA glyph to ⊨, REC glyph to ⊛.
- **v1.5**: Global replace ⊕ → ∥. Global replace θ → σ. Global replace DES → SIG.
- **v1.0**: Initial publication.
