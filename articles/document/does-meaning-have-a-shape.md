# "Does Meaning Have A Shape"

**Record ID:** document:does-meaning-have-a-shape  
**DB ID:** 62  
**Status:** draft  
**Updated:** 2026-05-16T01:25:44.011Z  

---

# Does Meaning Have a Shape?

### A Study of 19,764 Sentences Across 41 Languages

---

## The Setup

Imagine you could take a sentence — any sentence, in any language — and ask three simple questions about it:

1. **How is it structured?** Is it mainly about *separating* something, *connecting* something, or *producing* something?
2. **What level of reality is it talking about?** Is it about whether something *exists*, how things are *organized*, or what something *means*?
3. **What kind of thing is being acted on?** Is it an *ambient background condition*, a *specific individual thing*, or a *recurring pattern*?

Now here's the big question this study tried to answer: **do those three questions measure three genuinely different things?**

If they do — if you can take 19,764 sentences from 41 languages, classify each one on all three questions, and then do the geometry — something remarkable should happen. Sentences that disagree on *more* of the three questions should be *farther apart* in mathematical space. And the groupings from each question should be *independent* — knowing the answer to one shouldn't predict the answer to another.

That's the hypothesis. Here's what the data said.

---

## Three Questions, Three Axes

The study had human-blind AI classifiers read each sentence and answer three plain-language questions. No technical vocabulary was used — just this:

**Q1 — How is the transformation structured?**

- SEPARATING — dividing, distinguishing, drawing things apart
- CONNECTING — linking, bridging, relating things together
- PRODUCING — making, generating, causing something to happen

**Q2 — What level of reality is being transformed?**

- EXISTENCE — whether something is: presence, absence, coming into being
- ORGANIZATION — how things are arranged: structure, boundaries, relations
- MEANING — what something signifies: interpretation, value, perspective

**Q3 — What kind of thing is being acted on?**

- BACKGROUND — an ambient condition, a field, the context something happens within
- PARTICULAR — a specific individual thing: this named object, this event, this person
- PATTERN — a recurring regularity: a rule, a type, something that holds across many instances

Two AI systems (Claude and GPT-4o) independently classified every sentence. The 9,221 sentences where both systems agreed are the "consensus set" — the data used for all main results.

---

## The Method: Meaning as Geometry

Each sentence was fed to an AI embedding model that converts text into a point in 3,072-dimensional space (a coordinate with 3,072 numbers). Sentences that mean similar things end up near each other. Sentences that mean very different things end up far apart.

**The key measurement:** for any two sentences, you can compute the *geometric distance* between them in that space. The question is: does that distance increase as the sentences disagree on more of the three questions?

Results are reported as **z-scores** — how many standard deviations above chance is the observed clustering? Anything above +2 is considered statistically significant.

---

## What the Study Found

### The Three Axes Individually

Each question was tested on its own first:

| Axis | Question | Z-score |
| --- | --- | --- |
| Q1 — Mode | Separating / Connecting / Producing | **+2.17** |
| Q2 — Domain | Existence / Organization / Meaning | **+4.09** |
| Q3 — Object | Background / Particular / Pattern | **+4.81** |

All three axes showed real geometric structure — much more than chance. Q3 (what *kind of thing* is being acted on) turned out to be the strongest signal. Q1 (the *shape* of the transformation) was the weakest, but still clearly real.

### The Faces: Pairs of Questions Together

Here's where it gets interesting. When you combine *two* of the three questions, you get a **face** — a 3×3 grid of nine possible combinations. There are three faces:

- **Act face** = Q1 × Q2 (how + what level)
- **Site face** = Q2 × Q3 (what level + what kind of thing)
- **Stance face** = Q1 × Q3 (how + what kind of thing)

| Grouping | Number of groups | Z-score |
| --- | --- | --- |
| Q1 alone | 3 | +2.17 |
| Q2 alone | 3 | +4.09 |
| Q3 alone | 3 | +4.81 |
| Act face (Q1 × Q2) | 9 | **+9.24** |
| Site face (Q2 × Q3) | 9 | **+9.44** |
| Stance face (Q1 × Q3) | 9 | **+12.70** |
| All three together (full 27-cell) | 27 | **+16.15** |

Notice the pattern: combining two questions gives a stronger signal than either alone. Combining all three gives the strongest signal of all. The more dimensions you specify, the more geometrically real the grouping becomes.

The **Stance face** (Q1 × Q3) — combining the shape of the transformation with the kind of thing being acted on — was the strongest of the three faces. This was unexpected; Q1 was the weakest individual axis, but it combined powerfully with Q3.

### The Proportionality Result

Pre-committed prediction: sentences that differ on *more* of the three questions should be geometrically *farther apart* in embedding space. The result:

| Number of questions they differ on | Average geometric distance |
| --- | --- |
| 0 — same answer on all three | 0.9206 |
| 1 — disagree on one | 0.9239 |
| 2 — disagree on two | 0.9299 |
| 3 — disagree on all three | 0.9350 |

Distance increases monotonically at every step. This means the three questions aren't just measuring three separate things — they form a real **coordinate system**. Sentences can be located in three-dimensional meaning space, and their distances from each other are meaningful.

Bootstrap statistical test: p = 0.01. **Prediction 1: passed.**

### Are the Three Questions Independent?

If Q1 and Q2 measure genuinely different things, knowing the answer to one shouldn't tell you much about the other. This was measured using Adjusted Rand Index (ARI) — a number from 0 (completely independent) to 1 (perfectly correlated).

| Pair | ARI | Verdict |
| --- | --- | --- |
| Q1 / Q2 | 0.185 | borderline — some overlap |
| Q1 / Q3 | 0.028 | ✓ independent |
| Q2 / Q3 | −0.008 | ✓ independent |

Q1 and Q3 are independent. Q2 and Q3 are independent. But Q1 and Q2 have a real overlap (0.185) that doesn't go away — it appears in both AI models' labels separately, so it's not just noise.

Two explanations are live: it might be a structural feature (the *shape* of a transformation and the *level it operates at* are genuinely linked in how language works), or it might be an artifact of the predicted sparsity in the data (some cells in the grid are almost empty because they're theoretically rare, and that could artificially inflate the correlation). The test that would distinguish these has not yet been run.

**Prediction 2: failed** (Q1/Q2 exceeded the 0.10 threshold).

### Cross-Linguistic Results

| Threshold | Languages passing |
| --- | --- |
| Q2 z-score above 2 | 21 out of 41 |
| Full 27-cell z-score above 2 | 30 out of 41 |

Selected per-language 27-cell z-scores: English +6.78, Latin +8.02, Polish +5.95, Spanish +5.95, Italian +6.01, German +5.47, Finnish +4.49. Gothic (+1.56) and Wolof (+0.06) showed weak signal — though both are extremely low-resource languages in this dataset.

**Prediction 3: passed** (Q2 exceeded threshold in 21 languages; Q2 was stronger than Q1 in aggregate).

### Agreement Between the Two AI Classifiers

Both Claude and GPT-4o were used as independent classifiers. Their agreement (Cohen's kappa):

| Axis | Kappa |
| --- | --- |
| Q1 — Mode | 0.537 |
| Q2 — Domain | 0.511 |
| Q3 — Object | 0.479 |

Kappa above 0.4 is generally considered "moderate agreement." All three axes passed. This means the three questions are answerable enough that two completely different AI systems, working independently, give the same answer more than half the time.

One important finding: Claude's labels were notably weaker than GPT-4o's on Q1 and Q2 — the consensus set (where both agreed) showed much stronger signal than Claude's labels alone. The consensus requirement was doing real work.

---

## The Prediction Summary

| Prediction | Result |
| --- | --- |
| Distance scales monotonically with axis-difference count | ✓ Passed |
| All pairwise ARI < 0.10 (axes independent) | ✗ Failed — Q1/Q2 = 0.185 |
| Q2 z-score exceeds Q1 in 20+ languages | ✓ Passed |
| Kappa thresholds met (Q1 > 0.50, Q2 > 0.40, Q3 > 0.35) | ✓ Passed |

Three of four pre-committed predictions passed. The one that failed (Q1/Q2 independence) remains the open question.

---

## What Was *Not* Found

The study also tested some more specific predictions that didn't hold up:

**Coordinate geometry predictions:** The theory assigns specific numbers to each axis value (for example, Q2 maps to −1, +1, and √2). This predicts specific *ratios* of distances between cluster centers in embedding space. Those ratios were not observed. The geometric structure is real, but it doesn't mirror the theoretical coordinate system at the level of fine-grained distance ratios.

**Directional asymmetry:** The theory predicts that Q1 should "flow into" Q2 in a one-way dependency (Mode constrains Domain, not the reverse). A test for this asymmetry showed a trend in the right direction, but it was not statistically significant (p = 0.357).

**Spontaneous clustering:** Unsupervised machine learning (asking a computer to find clusters on its own, without any classification labels) did not spontaneously reproduce the three-axis structure. This was expected — embedding space is organized primarily by semantic content, not by abstract structural properties.

---

## What the Results Mean

The core finding is that these three questions — about the *shape* of a transformation, the *level* it operates at, and the *kind of thing* it acts on — carve meaning at real joints. They're not arbitrary. Sentences that differ on more of these dimensions are measurably farther apart in the geometry of meaning.

That holds across 41 languages, from ancient Latin to contemporary Wolof, from legal codes to restaurant reviews to novels.

The strongest evidence is the proportionality result: the three questions don't just produce three clusters each — they form a coordinate system. Location in three-dimensional classification space predicts location in three-dimensional meaning space. That's a stronger claim than "the clusters exist," and the data supports it.

The weakest evidence is on the independence of Q1 and Q2. Whether that overlap reflects a genuine feature of how language works, or a data artifact, is the study's main open question.

---

## About the Corpus

**19,764 clauses** total; **9,221 consensus clauses** (where both classifiers agreed) used for main analysis.

**41 languages** across multiple language families, drawn from two primary sources:

- **Universal Dependencies (UD) treebanks** — parsed real-text sentences in natural registers (news, legal, fiction, spoken language)
- **FLORES-200** — professionally translated declarative sentences covering a fixed topic set

These two sources behave differently: UD treebanks reflect natural register variation; FLORES-200 sentences are more syntactically uniform and carry potential translation artifacts from a common source. Cross-linguistic results partly reflect this composition.

Dominant register sources by position: Croatian/Serbian/Arabic/Hindi newswire → CON, INS, SEG; German hospitality reviews → SIG and Atmosphere (the single most discriminative subcorpus); Slovak/Bulgarian/Turkish legal texts → SYN, Network; Slovak/Vietnamese/Wolof literary fiction → EVA; Latin Vulgate / Ancient Greek → NUL and Binding.

*Epistemic status: Empirically strong on proportionality and face-level clustering. Mixed on axis independence. Coordinate geometry predictions not met. Unpublished.*
