# Coding: Python and EO

**Record ID:** wiki:coding-python-and-eo  
**DB ID:** 40  
**Tags:** 401  
**Keywords:** python, primitives  
**Status:** draft  
**Updated:** 2026-03-26T22:16:38.657Z  

---

## Why Python?

Python is one of the most widely used programming languages on earth. It is also, from an EO perspective, a useful test case because its designers made the language-level verb set unusually explicit. Python's grammar is small and its philosophy — "there should be one obvious way to do it" — means the primitives are relatively easy to enumerate.

The deeper question: **does a programming language's verb inventory exhibit the same structural asymmetries that EO finds in natural languages?**

The short answer is yes — and the pattern of poverty is identical.

---

## Three Levels of "Verb" in Python

Before mapping anything, a crucial **SEG** must be drawn. Python has three distinct layers that all feel like "verbs," but they are structurally different.

### Language Primitives

These are baked into the grammar. The parser has a specific rule for each one. They cannot be redefined from within Python. You cannot `del` the `=` operator. You cannot replace `if`. These are the **Ground** of the language — the conditions that make everything else possible, but which cannot be addressed by the tools they support.

### Builtins and Standard Library

`print`, `len`, `open`, `sorted`, `range`, `type`. These feel primitive because they are always available, but they are functions — Python objects like any other. You can replace them:

```
print = lambda x: None  # print now does nothing
```

These are **Figure** — specific, nameable, replaceable, built on top of the ground.

### Dunder Methods

`__init__`, `__add__`, `__getattr__`, `__enter__`. These are operator hooks that let you redefine what the primitives *mean* for your objects. They sit between Ground and Figure: they let you change what the primitives do to your objects, but only within rules the primitives set. This is as close to **REC** as Python gets — supervised self-modification.

The test for which level something belongs to is simple: **can you replace it from within the language?** If no, it is a primitive. If yes, it is a function. If it lets you redefine a primitive's behavior within constraints, it is a dunder.

---

## The Primitives

Restricting to language-level grammar — constructs the parser recognizes and the interpreter executes as hardwired operations:

| Primitive | What It Does |
| --- | --- |
| `=`, `+=`, `-=`, etc. | Bind a name to a value (assignment) |
| `del` | Unbind a name or remove an item |
| `def`, `class`, `lambda` | Create callable objects and types |
| `import` | Connect to another module's namespace |
| `if`/`elif`/`else`, `match`/`case` | Partition execution based on a distinction |
| `for`, `while`, `break`, `continue` | Repeat, modify repetition |
| `return`, `yield`, `yield from` | Send a value back (and exit or pause) |
| `raise`, `try`/`except`/`finally` | Create and handle exceptions |
| `with`/`as` | Enter and exit a managed scope |
| `async`, `await` | Mark and pause concurrent operations |
| `pass` | Explicitly do nothing |
| `is`, `in`, `not`, `and`, `or` | Boolean and identity operators |
| Comprehension syntax | `[x for x in y]` — arguably its own primitive, not mere sugar over `for` + `append` |

That is roughly **25 keywords** performing about **12 distinct operations**: bind, unbind, define, connect, branch, iterate, return/yield, raise/catch, scope, pause, do-nothing, and compare.

Everything else — every `print`, `len`, `open`, `sorted`, `range`, `type`, `list`, `dict` — is furniture. Built from those 12 and replaceable.

---

## A Note on "Primitive"

The mapping above uses a working definition: **a primitive is a language construct that is part of the grammar itself, cannot be redefined from within the language, and cannot be decomposed into other constructs within the language.**

These three criteria do not fully agree with each other.

**Part of the grammar** is the tightest criterion. It means the parser has a rule for it. By this test, `if`, `for`, `def`, `=`, `del` are all primitives. `print` is not. Clean.

**Cannot be redefined** is where things get messy. You *can* override `+` via `__add__`. You *can* override `in` via `__contains__`. You *can* override attribute access via `__getattr__`. The dispatch mechanism is primitive; the behavior is not.

**Cannot be decomposed** complicates the count. `for` decomposes into `while` plus iterator protocol. `with` decomposes into `try`/`finally` plus dunder calls. By this criterion, Python has fewer primitives than the table above suggests.

There is also the formal computer-science definition rooted in Turing completeness: what is the minimal set of operations needed to compute anything computable? By that test, Python needs roughly 3.

Which definition you choose is itself a **SEG** operation. The boundary determines what you can see.

---

## Mapping to the Nine Operators

### NUL (∅) — Recognize Absence

`pass` is the cleanest NUL in any mainstream programming language. It is a deliberate, syntactically required marker of "nothing happens here." It is not ignorance or omission — it is an explicit operation that says: absence is intended.

`del` is partial NUL. It removes a binding. But Python does not distinguish between "value was deleted," "value was never set," and "value is unknown." This is the same critique EO levels at SQL's NULL: three distinct operations collapsed into one.

`None` is a value pretending to be an absence. It is a Figure masquerading as Ground. You can assign it, compare it, pass it to functions — it behaves like any other object. Real absence in Python is a `NameError`, which is to say, the language can only represent true absence as a crash.

### SIG (○) — Register Difference

`is`**, **`in`**, **`not`**, **`==`, and the comparison operators. These draw the first distinction: *this* is not *that*.

`if`**/**`elif`**/**`else` and `match`**/**`case`: branching is fundamentally "a difference was registered, now act on it." The distinction precedes the action.

`and`**, **`or`: combine distinctions.

### INS (●) — Create Instance

`=` (assignment), `def`, `class`, `lambda`. These bring something into existence — a binding, a function, a type.

This is the gravity well, just as in natural language. The EO cross-linguistic study found that one cell — Generating × Existence × Figure, i.e., "making things" — contains 399 of 1,192 English verbs. Most of what programmers *do* is instantiate. Most Python code is INS.

### SEG (|) — Draw Boundary

**Scope rules.** `def` and `class` create namespaces. `import` creates module boundaries.

**Indentation** — Python's most distinctive syntactic feature — is *literally a boundary drawn in whitespace*. Where other languages use braces or keywords, Python makes the partition visible as spatial structure.

`try`**/**`except` partitions execution into normal and exceptional paths.

`with` creates a bounded context with explicit entry and exit.

### CON (⋈) — Connect Across Boundary

`import` reaches across module boundaries to bind names from one namespace into another.

`.` (attribute access) reaches across object boundaries.

`return` and `yield` connect the inside of a function to its caller.

**Function calling itself** — `f(x)` — is CON: sending a value across a scope boundary and receiving one back.

Note that `import` is both SEG and CON — it creates a boundary (the module is separate) and crosses it (names are brought in). This dual character is structurally expected: CON requires prior SEG.

### SYN (△) — Merge Into Emergent Whole

**This is where Python gets thin.**

**Comprehensions** may be the closest: `[f(x) for x in items if pred(x)]` merges iteration, transformation, and filtering into something that is not easily reducible to its parts without loss of clarity. But this is weak SYN — it is syntactic convenience more than genuine emergence.

`class`** with inheritance** does SYN — the child class is a genuine merge of parent behaviors, not merely concatenation. Method resolution order produces a whole that exceeds the sum of its bases.

But in general, Python does not have native facilities for producing emergent wholes. SYN in Python is almost always constructed at the library level, not the language level.

### DEF (⊢) — Establish What Holds

**Augmented assignment:** `+=`, `-=`, `*=`, etc. The frame (the variable, the object, the container) persists; the value changes.

**Mutation in general** — `list.append()`, `dict[key] = value` — is EVA. This is most of what running programs actually do, line by line.

`raise` can be read as EVA on the execution frame: the normal flow is replaced by the exception flow, but the program structure persists.

### EVA (⊨) — Render Judgment

**Almost completely absent.**

Python forces resolution. `if`/`else` makes you choose. The type system makes you choose. A variable is one type at a time. A condition is `True` or `False`.

The closest approximations are temporal:

- `try`**/**`except` briefly holds "this might work or might fail" until execution collapses it to one outcome.
- **Generators with **`yield` hold "running and paused" simultaneously — the function's state persists while control is elsewhere.
- `async`**/**`await` holds "started but not finished" as a stable, handleable condition.

But none of these are true EVA. Python cannot represent "this is simultaneously A and B" as a first-class, stable state. The contradiction must always be resolved.

### REC (⊛) — Change the Frame Itself

**Metaclasses** (`class Meta(type)`) let you change what `class` means.

**Dunder methods** let you redefine what `+`, `.`, `[]`, `in` do for your objects.

**Decorators** modify what `def` produces before it is bound to its name.

`exec`** and **`eval` let Python rewrite and run itself.

These are all REC, but constrained. You can only revise the frame using mechanisms the frame provides. Python permits *supervised self-modification* — REC on a leash.

---

## The Distribution

| Operator | Python Representation | Density |
| --- | --- | --- |
| **NUL** | `pass`, partial `del`, impoverished `None` | Thin — one value doing triple duty |
| **SIG** | Comparisons, boolean operators, branching | Solid |
| **INS** | Assignment, `def`, `class`, `lambda` | Heavy — the gravity well |
| **SEG** | Scope, indentation, `try`/`except`, `with` | Solid |
| **CON** | `import`, `.`, `return`, function calls | Solid |
| **SYN** | Comprehensions, class inheritance | Weak |
| **EVA** | Augmented assignment, mutation | Heavy |
| **DEF** | Temporal approximations only | Nearly empty |
| **REC** | Metaclasses, dunders, decorators, `exec` | Present but constrained |

---

## The Structural Prediction

This distribution matches exactly what EO predicts from the cross-linguistic evidence.

The **Existence triad** (NUL, SIG, INS) is present but with NUL impoverished — just as natural languages have thin vocabularies for absence.

The **Structure triad** (SEG, CON, SYN) is solid in its first two operators and weak in SYN — the same pattern found in institutional data systems where merging into genuine wholes is the hardest operation.

The **Significance triad** (DEF, EVA, REC) is heavy in DEF (state change — the workhorse of computation), nearly empty in EVA, and present-but-leashed in REC. This mirrors the universal EVA/REC poverty found across all 27 natural languages in the cross-linguistic study (0–5% of verb inventories).

Python's designers did not choose this distribution. The poverty is upstream of design. A programming language, like a natural language, can only express the transformations its speakers (or designers) have cognitive access to. The EVA/REC gap is not a deficiency in Python. It is a reflection of a species-wide structural constraint: we build languages — formal or natural — in our own image, and our image is thin where contradictions and frame-revision are concerned.

---

## Implications

### Libraries as Operator Recovery

Every Python library is, from this perspective, an attempt to recover expressiveness that the base language's verb poverty cannot hold.

- **Event sourcing frameworks** recover append-only NUL (preserving what was, rather than overwriting).
- **Type systems** (mypy, Pydantic) add richer SIG at the cost of heavier SEG.
- **ORMs** attempt CON between Python objects and database rows — and struggle precisely because the verb sets of Python and SQL do not align.
- **State machines** formalize EVA into explicit transition graphs.
- **CRDTs and conflict-resolution libraries** attempt DEF — holding contradictory states from distributed systems without premature resolution.
- **Metaclass frameworks** and **AST transformers** extend REC.

The library ecosystem is not arbitrary accretion. It has structure, and that structure maps to the operators the base language underserves.

### The `None` Problem

Python's `None` is a case study in NUL collapse. A function that returns `None` might mean:

- The operation succeeded but produced no value (deliberate absence — **NUL as clearing**).
- The operation could not find what was requested (meaningful unknown — **NUL as held absence**).
- The developer forgot to write a return statement (never set — **no operation was emitted**).

These are three distinct EO operations with different audit trails and different downstream consequences. Python collapses them into one value. The entire `Optional[T]` discourse in Python typing — and the `None`-checking burden that pervades Python codebases — is a symptom of this collapse.

### `pass` as the Purest Primitive

`pass` may be the most philosophically interesting keyword in Python. It is required by the grammar in certain positions (empty function bodies, empty class definitions, empty branches) and it does nothing. Its sole purpose is to mark that nothing was an intentional choice. It is **NUL** operating at the syntactic level — the deliberate withdrawal of prior determination that makes new code possible. Every `pass` is a placeholder that says: *the absence here is not an error. It is a decision.*

---

## Open Questions

1. **Does the mapping hold for other languages?** Rust's ownership system adds richer SEG/CON primitives. Haskell's type system deepens SIG. Prolog's unification might constitute native DEF. Each language's deviations from the Python pattern should be diagnostic.
2. **Is the 12-to-9 compression real?** Python's ~12 primitive operations were mapped onto 9 EO operators. Is this a genuine structural reduction, or does it require collapsing distinctions that matter?
3. **Can a language be designed with all nine operators natively represented?** What would a programming language with first-class DEF look like? With genuine NUL that distinguishes its three readings? With native SYN that is not reducible to concatenation?
4. **The dunder boundary:** Dunder methods are the richest site for REC in Python, but they operate within rules set by the interpreter. Is there a meaningful formal distinction between "REC within a frame's permission structure" and "full REC"? Does this correspond to a distinction EO should track?

---

## See Also

- [[The Nine Operators]]
- [[The Helix]]
- [[SQL's Three NULLs]] — the parallel analysis for database systems
- [[DEF/REC Poverty]] — the cross-linguistic evidence for universal thinness in the Significance triad

---

*Page drafted March 2026. The Python-to-EO mapping has not been formally verified and should be treated as a worked application, not a proof. The analysis of primitives follows a working definition (grammar-level, non-replaceable) that is itself debatable — see the section on definitions above.*
