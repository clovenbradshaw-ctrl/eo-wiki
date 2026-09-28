# Kleene-Up: Finding by Address, Not by Pattern

**Record ID:** wiki:kleene-up-physics-of-finding  
**DB ID:** 93  
**Tags:** 301  
**Keywords:** kleeneUp, needle and anchor, regex eviction, verbatim snip, drift refusal, sha256 provenance, THE SEAM  
**Status:** published  
**Updated:** 2026-09-28T00:00:00.000Z  

---

*A regex is a guess about a shape, asked in advance of the bytes it will run against. An address is a measurement, taken after them. kleeneUp is the doctrine that finding belongs to the second category, and that a codebase which forgets this will eventually match the wrong fifteenth vice president.*

---

## The physics, stated where it lives

`native/kernel/kleene-up.js` opens with a paragraph that is really the whole article in miniature (lines 8–16):

> "The byte field is the ground. A needle is a verbatim string with a measured position (or positions) in that field; an anchor is the address (c0, c1) where the needle's bytes actually sit; a window is the span AROUND the anchor — the encounter, not the needle alone... A needle is verified by its own bytes (sha256), a snip is reproducible from its address, and an absence is a typed result, never a guess."

Four nouns do all the work: **needle** (a verbatim string), **anchor** (the `{c0, c1}` byte range it actually occupies), **window** (the span around the anchor that a reader is shown, never the needle in isolation), and **snip** (the verbatim cut at a permanent address, sha256-stamped). Nothing in that vocabulary describes a shape. Everything in it describes a measurement already taken. That is the entire bet, and it is worth stating plainly before the mechanism, because the mechanism is otherwise easy to mistake for "a regex library with extra steps."

The file's own comment names why the distinction matters (lines 18–25): regex finding is "a pattern over the text; the pattern is the finder's guess about the shape, and it can silently match the wrong shape." Its two examples are concrete rather than hypothetical: a `"15th vice president"` pattern that also matches the phrase sitting inside an unrelated sentence, and a `/wik/i` host check that also matches "wiki" inside a path. Physics finding replaces the guess with an assertion that can only be checked, never argued: *this needle, at this offset, in this window — or not*, in which case the absence is itself the finding.

## Three walls, stated so they are not mistaken for missing features

The header names its own limits before anyone else can (lines 27–45), and the discipline of stating a wall as a wall rather than smuggling it in as an oversight is worth preserving verbatim:

- **STRING-BOUND.** Finding is by bytes. A synonym, a paraphrase, a different needle expressing the same fact — none of it is found, and the kernel "refuses to infer the relation... semantic equivalence is the model's and the caller's, never this file's." Case-folding is the *only* normalization it performs, and it is mechanical and reversible: `foldedIndex()` (kernel lines 69–75) lower-cases the field for the comparison but returns a monotone offset map so that every address handed back points at the *original* bytes, case and all.
- **GRAMMAR-BOUND.** A regex that parses — splitting on whitespace, matching a sentence boundary, a character class, a quantifier, a capture group — is grammar, not finding, and kleeneUp does not claim jurisdiction over it. `reduceRegex` names this kind `structural` and leaves it alone.
- **ADDRESS-BOUND.** An address is "a birth, not a spelling": a needle located at `(c0, c1)` is re-findable there, and a snip cut there is the same bytes every time — until it isn't, at which point the address is drifted ground and the cut is refused, never silently re-found.

That last wall is the one with teeth, and it is worth following into the code before anything else, because it is where the doctrine stops being a metaphor.

## The address-bound wall has a test, and the test has a name for what it prevents

`snipAt(field, at, { verify })` (kernel lines 194–206) cuts the bytes at an address and, when handed the needle the address was originally measured for, checks the cut against it. A mismatch does not return a best-effort answer — it returns `gap: REFUSALS.drifted.gap` with an explicit basis: *"the bytes at 4..9 are 'SLOW', not the needle 'quick' the address was measured for — drifted, refused."* The kernel's own test file states the falsifying case directly (`native/tests/kleene-up.test.mjs:187–196`): an address measured against `"the quick brown fox"` is re-run against the edited string `"the SLOW brown fox"` at the *same offsets*. `snipAt` refuses. Re-finding `"slow"` gives a live address that snips cleanly — "that is the fix, not a re-match." The distinction is exact: an address that no longer holds its claim is refused; a fresh measurement that finds something real is not a workaround, it is the discipline working as designed.

This is not a new idea for readers of [The Two Doors](/the-two-doors) — it is the same idea, one layer down. `witness.js`'s `sameAnchor(candidate.anchor, encounter.anchor)` refuses a candidate that is not anchored to the actual encounter; `snipAt`'s `verify` parameter refuses a cut whose address no longer holds the bytes it claims. Both mechanisms say the same sentence in different registers: *an address is not evidence by itself — the bytes have to still be there.* Nomination is not admission at the reading layer; measurement is not permanent at the byte layer. kleeneUp is the two-doors doctrine applied to source code instead of source text.

There is a second falsifying test worth naming because it is the concrete version of the header's abstract "15th vice president" warning (`native/tests/kleene-up.test.mjs:171–185`). Over the sentence *"James Polk served as vice president under Van Buren. The vice presidency was different then,"* a regex `/\bvice president\b/` cannot distinguish the sentence that is actually about the office from the sentence that merely mentions its noun form — both spans satisfy the pattern. `findNeedle` and `findNeedles`, by contrast, measure `"vice president"` and `"vice presidency"` as two *different* needles occupying two different byte ranges; the test asserts both are found, in field order, as distinct addresses. The regex sees one shape twice; the needle set sees two facts, correctly, because it was never asking about shape.

## The four kinds a pattern earns

`reduceRegex(source, {flags})` (kernel lines 208–323) is the classifier the rest of kleeneUp is built on, and its comment states the discipline explicitly: the classification is "a MEASUREMENT of the pattern's own grammar, never an opinion about the caller's intent." Every regex literal in the sweep earns exactly one of four names:

| Kind | What it is | What kleeneUp does with it |
|---|---|---|
| `literal` | One verbatim needle, metacharacters only punctuation escapes (`Dr\.\s*Smith`) | Migratable — becomes a `findNeedles` call |
| `semantic` | A word class: `\b`-bounded literals in alternation (`(?:hamlet\|macbeth)`) | Migratable — becomes a needle *set* over the tokenized field |
| `structural` | Parses or sanitizes: character classes, `\d \w \s`, quantifiers, anchors, captures, splits | Left alone, disclosed — grammar is not finding |
| `typed_gap` | Backreferences, lookaround, or a dynamically constructed source | Named as a gap, never silently kept or guessed at |

Two details keep this honest rather than merely tidy. First, the comment that names the classifier's own construction: "The classifier is a hand scanner, not a regex — a regex-eviction archon that classifies regexes with a fragile regex would be hoist by its own petard" (kernel lines 224–225). The function `branchSafe` walks a branch character by character rather than testing it against a meta-pattern (kernel lines 232–247). Second, the classifier *does* contain real regex literals of its own — `/\\([1-9])|\(\?[=!<]/` to detect backreferences and lookaround (line 303), `/^\(\?:/` and `/\)$/` to detect a non-capturing wrapper (line 312) — and this is not a quiet contradiction of the doctrine. Those patterns parse the *pattern's own syntax*, not a data field; under the walls stated above that is squarely `structural` work, the kind kleeneUp never claimed as its territory in the first place. The doctrine survives contact with its own implementation.

## What the sweep actually measured, and what it did not scan

`kleeneup-report.json` (schema `KleeneUpReport@1`, run `2026-09-21T16:48:13.367Z`) is a real, checked-in artifact, and its counts hold up against the numbers reported in `README.md`'s own kleeneUp section and against a re-run of the scanner:

- **444** files scanned, **1,786** regex occurrences named
- **651** `literal` + **98** `semantic` = **749 migratable**
- **1,008** `structural` (kept, disclosed)
- **29** `typed_gap` (named, not silently dropped)

Those numbers are exact — 749 is not a round estimate, it is `651 + 98` computed from the same report. But the honest scope of that "444 files" is narrower than "the codebase" would suggest, and the sweep script says so about itself. `scripts/kleene-up.mjs` reports `scanned: ["native", "cli"]` and, before it ever walks a directory, excludes a fixed list of roots by name (`SKIP_DIRS`, lines 29–33): `node_modules`, `.git`, `documents`, `moral-shadows`, `canon`, `legacy-eoreader6.1`, `state`, `goldens`, `.github`, `eval`, `plans`, `priors`, `the-fold`, `interpretation`, `memory`, `adapters`, `conformance`. `native/the-fold/` alone holds 149 of the ~1,408 `.js`/`.mjs` files under `native/` — roughly a tenth of the tree — none of which this particular sweep's regex census touches. The script's own header discloses the second limit as plainly: it is "a SURVEY, not a parser: it reads line-wise and can miss a regex that spans lines or misread a division sign as a literal — a named limitation, never a silent one" (`scripts/kleene-up.mjs:10–12`). 1,786 is a real, reproducible count of a defined and disclosed subset of the tree, not a claim about every regex literal that exists in eoreader7 — and the sweep says which subset, in its own output, rather than leaving that inference to the reader.

One more scope note, because it changes what "kleeneUp" refers to when someone searches the tree for the name: `native/the-fold/kleeneup.js` is a *different tool that happens to share the name*. Its own header calls it "THE REGEX-REMOVAL PATROL... the user's archon," and its doctrine is not address-vs-pattern at all — it is closed-list-vs-open-shape: an alternation like `dr|mr|mrs|ms` enumerates a *table* (author's vocabulary of titles) and should be a `Set`, where a regex is only the right tool for describing an actual shape (any digit, any letter). It reports `alternation-list`, `abbreviation-guard`, `number-alternation`, `char-class-token`, and `lookaround` findings, and — like the physics kernel — it "never edits — it names." The two modules are siblings in temperament (both measure, both disclose, both refuse to auto-rewrite) but they are answering different questions, and conflating them because they share a filename fragment would be exactly the kind of naming-multiplicity failure the wiki has already had to name once, at the operator-naming layer and again at organ-ownership layer (see [Holons](/holons)'s account of the 2026-09-25 archon-registry incident). Two registries, two `kleeneup.js`-shaped files, and — per that same discipline — "a miss in one registry is not a miss in both."

## `verbatim-snip.js`: the doctrine paying rent

The clearest demonstration that this is not academic plumbing is `native/organs/verbatim-snip.js`, and its own header states the stakes without hedging (lines 1–13): when someone asks for a work's own words verbatim, "the answer is not composed — it is SNIPPED. The mouth must never generate a quotation from its weights: a generated 'quote' is an invention wearing a source's name." Before the 2026-09-21 migration this organ used word-class regexes (`QUOTE_VERB`, `EXACTNESS`, `QUOTE_ME_FRAME`, `EXACT_TEXT_OF`) and `match`-style regexes to find the quoted works themselves. The header records what replaced them plainly: "the old... regexes are gone; what they did is now MEASUREMENT" (lines 17–26).

The migration is not cosmetic — it changes *where* two different kinds of needle get measured, and the file is explicit about the distinction because it matters mechanically:

- **Single words** (`quote`, `verbatim`, `hamlet`) are measured against a *tokenized* field, via `tokensOf()`'s whitespace/punctuation split (lines 96–97) and `hasWord()`'s `tokens.includes(word)` (line 98). This is what gives the check a real word boundary — a `"cite"` token is not silently satisfied by `"cited"` or `"recite"` — without the old `\b` regex escape doing that job.
- **Multi-word phrases** (`"quote me"`, `"word for word"`) are measured as needles in the *folded raw field* at their byte addresses, via `findNeedles(folded, phrases, {all:false})` (line 101), imported directly from the kernel (line 43).

`QUOTABLE_WORKS` (lines 106–113) states the doctrine's payoff in its own comment: "a work is a NEEDLE (measured at its byte address in the ask), not a pattern: 'shakespeare' is found, never `/shakespeare/i`'d." The set is deliberately small — four entries, all Wikisource-backed public domain — and adding a fifth is "wiring its source, never... letting the model reach for one" (line 105). An ask for an unwired author does not fall back to a guess; `snipShape()` returns `gap: "no_source_wired"` (line 196), a typed refusal rather than an invented quotation.

The cut itself, `cutSnip()` (lines 210–230), is positional, not semantic: it skips scaffolding lines by a fixed list of `BOILERPLATE_RES` patterns (Wikisource nav arrows, disambiguation frames, version-list rows) and then takes the opening lines under a 600-character budget — "no selection by meaning." Those boilerplate regexes are the one place real regex literals survive inside this organ, and the header names why that is not a relapse: they parse the fetched page's own layout, which is exactly the `structural` exemption the kernel's walls carve out — "parsing is not finding, and kleeneUp does not claim it" (lines 25–26). `formatQuote()` (lines 237–245) then wraps the cut bytes in a visual `❝` marker and a provenance line naming the source, so a reader can tell at a glance the block was snipped, not written.

This is a real, checked build, not a description of an intended one: `native/organs/verbatim-snip.test.mjs` runs ten tests — cross-lingual firing (FR/DE/ES/IT, "falsified 2026-09-17" per the file's own comment), the no-source-wired refusal, the positional and budget-bounded cut, the scaffolding skip — and all ten pass (`node --test native/organs/verbatim-snip.test.mjs`, run for this article: `# pass 10, # fail 0`). README's claim of "10/10 tests green" (line 34) checks out against a live run, not just against the file that asserts it. The kernel's own test suite, separately, runs 19 tests and also passes clean (`node --test native/tests/kleene-up.test.mjs`: `# pass 19, # fail 0`).

## Two honest limits, disclosed rather than smoothed over

The wiki's own account of [Holons](/holons) names `native/organs/index.js` as "THE SEAM" — "one entrance, one set of explicit named exports, through which every organ the-fold's surface calls must pass, 'and only from here.'" kleeneUp is a clean counterexample to "every," and the seam file says so about itself rather than leaving it to be discovered: kleene-up's kernel ground imports `node:crypto` for the needle digest, and a static re-export of anything that touches a Node built-in "killed the whole module graph on a static host" when it was tried with the sibling `what`/`anchors` organs (`native/organs/index.js:155–163`). kleene-up (2026-09-21) is placed "in the SAME split for the same reason... it is NOT statically re-exported here. Server-side consumers... import it by path; a static host never sees `node:crypto`" (lines 164–168). The holonic claim survives — kleeneUp is still whole at its own scale, testable and swappable independently — but the specific mechanical guarantee the seam usually provides (one entrance, always) does not apply to it, and the codebase names the exception instead of quietly violating its own rule.

The second limit is smaller and easy to miss, and it qualifies one of the wiki's own claims about the organ. `README.md`'s own kleeneUp section states that the organ's "ground is the Mozi three tests in the physics canon (`antistrauss-physics.txt`, mechanic `kleene-up`, sha256-verified)" (`README.md:27–29`) — language that reads as an independent verification; the organ file's own header (`native/organs/kleene-up.js:1–24`) makes no such claim in its own words, so the framing is README's gloss on the organ rather than the organ's self-description. Reading `antistrauss-physics.txt`'s own `mechanics` array shows the `kleene-up` entry (`id: "kleene-up"`, `organ: "native/organs/kleene-up.js"`) carries the *exact same* `canon`, `anchor: [362689, 362718]`, and `needle: "there must be three tests"` as the adjacent `grounding` entry, whose organ is `native/organs/grounding.js`. The two entries differ only in `id` and `organ` — the citation is shared with `grounding.js`, not independently re-derived for kleeneUp. This is not a fabrication (the Mozi text really does say what both entries quote, and the sha256 binding really is checked against the canon file at load, per `native/the-fold/antistrauss.mjs`), but it means the "grounded in the three tests" claim for kleeneUp specifically rides on a license borrowed from a neighboring organ rather than a citation cut fresh for this one. Small, and worth saying plainly rather than repeating README's framing unexamined.

## What this buys, in the vocabulary the wiki already has

`native/organs/kleene-up.js` places itself at cell `SIG · Figure` (line 32) — the organ "SIGNS the figure of the field: where the needle sits, in what window, cut at what address." Read against [Nine Instructions](/nine-instructions)'s account of the algebra, SIG is one of the operators a normal system leaves as "a boolean column and one-off code; never an operation, so never permissioned, never composed." kleeneUp is a small, concrete instance of hoisting exactly that: attention-to-a-byte-range becomes a typed, reproducible, sha256-anchored operation rather than a regex `.test()` call whose match span nobody can later audit. The header's own description of the organ as "a WITNESS, never a verdict" (line 9) is not incidental color — it is the same restraint [The Guardrail Organs](/the-guardrail-organs-witnesses-not-verdicts) documents elsewhere in the codebase: `auditField` (`native/organs/kleene-up.js:61–106`) names what a pattern *is* and whether its needles are present, and stops there. Nothing about `reduceRegex` or `findNeedles` decides whether a `structural` regex should be rewritten, or whether a migratable one is worth migrating; `scripts/kleene-up.mjs` "writes the manifest and the plan, it does not blind-rewrite files" (line 13). The eviction of Kleene's own machinery is, fittingly, never itself automated by a machine guessing at intent.

The claim this article can actually stand behind is narrower than "kleeneUp replaced regex" and stronger for being narrower: over a disclosed 444-file, native-plus-cli subset of eoreader7, 749 regex occurrences were independently classified as expressing a single verbatim needle or a small closed word-set rather than a shape, and at least one of them — `verbatim-snip.js`'s full quote-detection and quote-cutting pipeline — has actually made the crossing, verified by a passing test suite rather than by the comment above it.

---

## See Also

- [The Two Doors](/the-two-doors) — the same anchor-then-verify discipline (`sameAnchor`, nomination-is-not-admission) one layer up, at the reading boundary instead of the byte boundary
- [Holons](/holons) — `native/organs/index.js`'s seam, and why kleene-up is a disclosed exception to "every organ passes through here"
- [Nine Instructions](/nine-instructions) — SIG as a first-class, hoisted operation; the cell kleeneUp occupies in the algebra
- [The Guardrail Organs: Witnesses, Not Verdicts](/the-guardrail-organs-witnesses-not-verdicts) — the restraint kleeneUp's own header claims for itself, named and measured
- [Handles: Naming as Governance](/handles-naming-as-governance) — why two differently-doctrined files can both be called `kleeneup.js`, and why that is a risk to name rather than a coincidence to ignore
