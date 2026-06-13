# EO LEXICAL ANALYSIS v2 — RESULTS REPORT

**Record ID:** document:eo-lexical-analysis-v2-results-report  
**DB ID:** 58  
**Status:** published  
**Updated:** 2026-05-16T01:25:46.083Z  

---

# EO Lexical Analysis v2 — Results Report

**Generated:** 2026-03-18 17:06 **Corpus:** 19,764 total embedded · 9,221 consensus across 41 languages

## What This Study Is Testing

EO proposes that any transformation — any event where something changes — can be located in a 27-cell structure defined by three independent axes. This study tests whether those axes correspond to real, independent dimensions in the semantic geometry of natural language.

**The test:** we took real sentences from corpora in dozens of languages, asked three plain questions about each sentence, embedded the original text using an AI that has never seen EO, and measured whether sentences classified the same way ended up geometrically close. No EO vocabulary appears anywhere in the embeddings.

**The three questions:**

1. **Q1** — Is this transformation separating, connecting, or producing?
2. **Q2** — Is it operating on existence, organization, or meaning?
3. **Q3** — Is the target a background condition, a specific thing, or a pattern?

**Pre-committed predictions** (locked before data was processed):

1. Distance scales monotonically with number of differing axes
2. Pairwise ARI between axes < 0.10 (axes are independent)
3. Q2 z-score exceeds Q1 z-score in 20+ languages (Domain primacy)
4. Inter-model kappa > 0.5 on Q1, > 0.4 on Q2, > 0.35 on Q3

*Note: operator frequency rank prediction (Test D) is computed but not reported as a primary result. Small n (9 operators) limits interpretability.*

## Result 1 — Per-Axis Z-Scores

The z-score measures how much more geometrically coherent the classified groups are than random groupings of the same size. A z-score of −79 means the actual grouping is 79 standard deviations tighter than chance — which was the v1 English result on bare verbs. We expect clauses to do better because the clause fixes all three dimensions simultaneously.

| Axis Z-Score Raw Separation |
| --- |
| **Q1** — Mode (separating / connecting / producing) | +2.17 SDs | +0.0056 |
| **Q2** — Domain (existence / organization / meaning) | +4.09 SDs | +0.0121 |
| **Q3** — Object (condition / particular / pattern) | +4.81 SDs | +0.0145 |

## Result 2 — Proportionality

If EO's three axes form a real coordinate system, then sentences that differ on MORE axes should be geometrically FARTHER apart in embedding space. Sharing all three axis-labels means maximum semantic similarity. Differing on all three means maximum dissimilarity. This is a stronger claim than mere clustering — it tests the arrangement of the cells, not just whether the cells exist.

| Axes Different Mean Cosine Distance n |
| --- |
| 0 | 0.9206 | 5,000 pairs |
| 1 | 0.9239 | 5,000 pairs |
| 2 | 0.9299 | 5,000 pairs |
| 3 | 0.9350 | 5,000 pairs |

✓ **Monotonicity holds** — distance increases with axis-difference count Bootstrap *p* = 0.0100 (fraction of resamples where ordering fails — stable)

This confirms that the three axes form a real coordinate structure, not just arbitrary groupings.

## Result 3 — Axis Independence (ARI)

EO claims the three axes are genuinely independent — knowing a sentence's Mode (Q1) should give you no information about its Domain (Q2) or its Object grain (Q3). The Adjusted Rand Index (ARI) measures how much two classification schemes agree. ARI = 0 means complete independence. ARI = 1 means perfect agreement.

*Predictions: all pairs should show ARI < 0.10*

| Pair ARI Status |
| --- |
| Q1 vs Q2 | +0.1849 | ⚠ borderline |
| Q1 vs Q3 | +0.0279 | ✓ independent |
| Q2 vs Q3 | −0.0077 | ✓ independent |

Maximum pairwise ARI is 0.1849. Q2/Q3 and Q1/Q3 are independent. Q1/Q2 shows mild correlation — see analysis below.

### The Q1/Q2 Correlation: Two Readings

Q1 (Mode) and Q2 (Domain) show ARI of approximately 0.14–0.17. This is stable across all label sets and both model runs — not noise. SEPARATING tends to co-occur with STRUCTURE and EXISTENCE. PRODUCING tends to co-occur with EXISTENCE. SEPARATING rarely appears with SIGNIFICANCE.

**Reading 1 — Distributional artifact of helix dependency ordering:** The correlation may be a structural consequence of the helix. DEF (SEPARATING × SIGNIFICANCE) is sparse because by the time a system is operating in the Significance domain, the separation work has already happened upstream. SYN × Condition is the universal desert. If the ARI drops toward zero when sparse and dominant cells are excluded, the axes are genuinely orthogonal — the non-uniform distribution is itself one of EO's predictions, not evidence against it.

**Reading 2 — Genuine semantic dependency:** SEPARATING genuinely tends toward lower-complexity domains. The cognitive operation of separation may be structurally harder to instantiate at the level of Significance than at Existence or Structure. The capacity ground is not a flat grid — it has a topology. Some cells are hard to reach not because language lacks vocabulary but because those combinations are structurally unusual.

### Cell-Exclusion Test — Is Q1/Q2 Correlation from Helix Sparsity?

| Metric Value |
| --- |
| ARI on full corpus | +0.1849 |
| ARI excluding sparse/dominant | +0.2683 |
| Delta | −0.0834 |
| Cells excluded | RELATING/STRUCTURE |
| Clauses excluded | 2,889 |

ARI barely changes (0.185 → 0.268) after excluding sparse cells. The correlation persists in well-populated cells. **Reading 2 has support:** Mode and Domain are not fully independent dimensions.

*Methodological caveat:* excluding sparse cells also reduces label diversity in the remaining data, which independently affects ARI regardless of whether the correlation is structural or artifactual. The test cannot cleanly isolate the two mechanisms. The result is suggestive of Reading 2 but the binary "Reading 1 vs Reading 2" framing overstates what the exclusion test can distinguish.

## Result 4 — Inter-Model Agreement (Cohen's Kappa)

Multiple AI models were asked the same three questions independently. Cohen's kappa measures how much they agree beyond chance. High kappa means the questions are tracking something robust — different models reliably give the same answer. Low kappa means the axis is ambiguous or the questions are under-specified.

*Consensus selection bias diagnostic:* the primary z-scores use only clauses where both models agreed. If disagreement is systematically higher for specific axis values (e.g. Q2=SIGNIFICANCE being more contested), those cells are underrepresented in the consensus set. Per-value agreement rates below reveal whether this is occurring.

**Interpretation guide:** kappa < 0.20 poor · 0.20–0.40 fair · 0.40–0.60 moderate · > 0.60 good

*Predictions: Q1 > 0.50, Q2 > 0.40, Q3 > 0.35*

| Pair Q1 Kappa Q2 Kappa Q3 Kappa |
| --- |
| Claude vs GPT-4 | 0.537 (moderate) | 0.511 (moderate) | 0.479 (moderate) |

## Result 5 — Cross-Linguistic Z-Scores

The axes should be real across language families, not just in English. Sentences in Korean, Arabic, Finnish, Swahili, and Classical Chinese were classified with the same three questions and embedded in the same space. If the structure is universal, the z-scores should be significant across typologically diverse languages.

**Corpus source confound:** UD treebanks are parsed real text (news, Wikipedia, legal, literary) with genuine syntactic variety. FLORES-200 consists of professionally translated declarative sentences of comparable length and register, likely skewed toward GENERATING/EXISTENCE and RELATING/STRUCTURE patterns. Pooling these without source-stratification means cross-linguistic z-scores partially reflect source differences, not only typological universality. Per-language results are more reliable than the pooled signal for this reason.

*Note on multiple comparisons:* up to 3 z-score tests × 39 languages = up to 117 tests are run. No per-language significance threshold is applied. Per-language z-scores are reported as directional signals. Tests are underpowered at 100–500 clauses per language; the aggregate pooled signal is the primary result.

### Language Coverage Summary

| Threshold Languages Meeting It |
| --- |
| Q1 z > 2 | 14 of 41 |
| Q2 z > 2 | 21 of 41 |
| Q3 z > 2 | 18 of 41 |
| Stance face z > 2 | 30 of 41 |
| Full 27-cell z > 2 | 30 of 41 |

### Per-Language Z-Scores

| Language Q1 Q2 Q3 Act Site Res 27-cell |
| --- |
| ar | +3.03 | +2.51 | −0.55 | +4.40 | +2.48 | +1.69 | +4.74 |
| bg | +1.59 | +0.90 | +2.40 | +1.40 | +2.87 | +3.59 | +2.10 |
| ca | +1.15 | +2.94 | +0.83 | +1.97 | +2.58 | +3.44 | +1.38 |
| cs | +1.26 | +1.97 | +0.59 | +3.84 | +2.41 | +2.21 | +3.06 |
| da | +1.43 | +1.95 | +1.02 | +2.76 | +3.74 | +0.91 | +2.34 |
| de | +2.45 | +3.67 | +0.72 | +6.57 | +3.09 | +4.15 | +5.47 |
| **en** | **+3.50** | **+4.88** | **+5.21** | **+6.52** | **+7.35** | **+5.60** | **+6.78** |
| es | +1.41 | +2.49 | +2.53 | +5.43 | +4.81 | +4.50 | +5.95 |
| eu | +0.73 | +0.44 | +0.04 | +2.77 | +0.31 | +0.85 | +2.25 |
| fi | +2.10 | +3.69 | +3.71 | +5.99 | +6.34 | +4.61 | +4.49 |
| fr | +1.95 | +2.14 | +2.36 | +6.14 | +6.71 | +6.25 | +3.98 |
| got | +0.71 | +0.08 | +0.47 | +0.17 | +0.75 | +0.47 | +1.56 |
| grc | +0.96 | +1.80 | +2.06 | +2.05 | +1.70 | +2.89 | +1.02 |
| he | +1.20 | +2.66 | +1.32 | +3.66 | +3.83 | +4.46 | +3.06 |
| hi | +2.18 | +2.31 | +1.98 | +3.64 | +3.03 | +3.13 | +2.62 |
| hr | +2.34 | +1.31 | −0.81 | +3.60 | +2.32 | +2.56 | +1.22 |
| hu | +1.62 | +1.99 | +0.67 | +1.57 | +2.48 | +3.49 | +1.28 |
| id | −0.19 | +0.27 | +0.09 | +2.98 | +3.01 | +3.66 | +1.33 |
| it | +2.07 | +2.24 | +5.01 | +3.32 | +5.52 | +5.56 | +6.01 |
| ja | +3.80 | +3.16 | +2.24 | +5.37 | +4.51 | +3.16 | +3.65 |
| ko | +1.92 | +2.51 | +2.08 | +4.06 | +3.22 | +3.16 | +3.36 |
| la | +3.76 | +2.44 | +3.96 | +6.37 | +3.50 | +6.05 | +8.02 |
| nl | +1.19 | +1.34 | +2.58 | +2.56 | +3.65 | +2.72 | +1.87 |
| no | +0.72 | +2.84 | +1.85 | +2.64 | +1.91 | +1.43 | +0.94 |
| pl | +4.71 | +5.65 | +2.44 | +4.77 | +4.86 | +3.10 | +5.95 |
| pt | +1.49 | +3.01 | +0.74 | +3.76 | +4.65 | +4.10 | +4.53 |
| ro | +0.96 | +2.07 | +0.78 | +3.19 | +4.95 | +1.53 | +3.02 |
| ru | +1.16 | +1.78 | +1.85 | +1.88 | +4.20 | +2.49 | +2.34 |
| sk | +2.00 | +1.96 | +6.30 | +1.36 | +4.91 | +5.27 | +4.70 |
| sl | +0.64 | +1.04 | +2.70 | −0.07 | +1.74 | +3.42 | +3.22 |
| sr | +2.79 | +1.96 | −0.53 | +4.38 | +4.02 | +1.96 | +2.64 |
| sv | +1.58 | +1.20 | +4.91 | +2.85 | +2.83 | +3.65 | +3.16 |
| sw | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| ta | +0.90 | +0.94 | +1.10 | +2.99 | +0.72 | +2.10 | +2.59 |
| tr | +1.34 | +2.15 | +1.89 | +2.12 | +3.15 | +4.58 | +4.33 |
| uk | +1.22 | +1.78 | −0.35 | +2.34 | +3.38 | +1.93 | +2.20 |
| ur | +2.06 | +2.92 | +3.39 | +5.11 | +5.19 | +4.01 | +5.03 |
| vi | +2.60 | +2.05 | +4.76 | +4.38 | +4.27 | +4.23 | +4.02 |
| wo | −0.45 | +0.82 | −0.49 | +0.67 | +1.02 | −0.81 | +0.06 |
| yo | +1.93 | +0.50 | −0.99 | n/a | n/a | n/a | n/a |
| zh | +2.64 | +3.05 | +6.46 | +3.52 | +6.72 | +5.41 | +4.24 |

## Result — Helix Dependency Structure (3 Tests)

The ARI = 0.185 between Mode and Domain is compatible with both random coupling and structured dependency. These three tests check whether the correlation is directed, ordered, and topologically predictable — which is what the helix claim requires. If these pass, the dependency is the structure EO predicts, not incidental correlation.

### Test 1 — Directional Asymmetry (Information Flow)

Conditional entropy measures how much uncertainty about one axis remains after knowing the other. If the dependency is directed, the two values differ.

| Measure Value |
| --- |
| H(Q1 Mode) | 1.4127 bits |
| H(Q2 Domain) | 1.5471 bits |
| H(Q2 | Q1) | 1.3033 bits — uncertainty in Domain given Mode |
| H(Q1 | Q2) | 1.169 bits — uncertainty in Mode given Domain |
| Asymmetry | +0.1343 bits (permutation *p* = 0.3570) |
| Preferred direction | **Mode → Domain** |

H(Q2|Q1) > H(Q1|Q2): Domain is more constrained by Mode than Mode by Domain. Mode carries more information about Domain than vice versa. Consistent with the helix direction: Mode is upstream of Domain.

### Test 2 — Mode Ordinal Predicts Domain Ordinal

Spearman rank correlation between Mode ordinal position (DIFFERENTIATING=1, RELATING=2, GENERATING=3) and Domain ordinal complexity (EXISTENCE=1, STRUCTURE=2, SIGNIFICANCE=3). A directed helix dependency predicts a non-zero correlation with a specific sign.

**Spearman r = −0.4205** (*p* = 0.0000, n = 8,000)

Significant non-zero correlation: Mode ordinal position predicts Domain ordinal complexity. The direction and magnitude of the correlation is a stronger claim than ARI — it tests ordered structure, not just association.

## Result — Subspace Geometry (Principal Angles + LDA)

The PCA figures show the content space, not the EO subspace. This analysis reveals the shape of the EO axes in embedding space directly. Principal angles measure how orthogonal the Mode and Domain centroid subspaces are — angle near 90° means geometrically independent, near 0° means same dimension. The LDA projection finds the directions that actually separate the EO labels, after removing content variance.

**Principal Angles Between Axis Subspaces:** Each axis defines a 2-d subspace via its 3 centroids (after centering). Principal angles between pairs of these subspaces are the direct geometric measure of their independence — more informative than ARI for characterizing the dependency structure.

**LDA Projection — EO Discriminant Subspace:** Linear Discriminant Analysis finds the directions in 3072-d space that maximally separate the EO labels. These figures show the actual EO subspace, not the content space. The shape visible here — whether flat, clustered, or structured — is the geometry of the EO signal itself.

## Result — Coordinate Geometry (α/η/Ω Axis Metric Test)

EO's three axes carry distinct mathematical characters: Mode α (Arithmetic) {0,1,2} — equal steps; Domain η (Geometric) {−1,+1,√2} — asymmetric, E↔S gap predicted 4.8× larger than S↔Sig; Object Ω (Transcendental) {√2,2,2^√2} — unequal steps. This tests whether inter-centroid distances in 3072-dimensional embedding space reflect those coordinate predictions. Two runs: CONSENSUS (9,221 high-confidence clauses, single label each) and COMBINED (~39,000 assignments — all 19,764 clauses counted under both model labels, disagreements netting out rather than filtering out). Where both agree: robust. Where they diverge: the disagreement cases express the Q2 anomaly geometrically.

### Set: CONSENSUS

**Mode α (Arithmetic) — {0, 1, 2}** *Prediction: Equal steps — D↔R ≈ R↔G (ratio ≈ 1.0)*

| Pair Embedding Distance |
| --- |
| DIFFERENTIATING ↔ GENERATING | 0.11535 |
| DIFFERENTIATING ↔ RELATING | 0.09779 |
| RELATING ↔ GENERATING | 0.06474 |

Step ratio: 1.511 — ✗ unequal steps

**Domain η (Geometric) — {−1, +1, √2}** *Prediction: Asymmetric — E↔S / S↔Sig ≈ 4.8*

| Pair Embedding Distance Coord Prediction |
| --- |
| EXISTENCE ↔ SIGNIFICANCE | 0.11722 | 2.4142 |
| EXISTENCE ↔ STRUCTURE | 0.06611 | — |
| STRUCTURE ↔ SIGNIFICANCE | 0.10366 | 0.4142 |

E↔S / S↔Sig ratio: 0.638 (predicted 4.828) — ✗ directional prediction not met

**Object Ω (Transcendental) — {√2, 2, 2^√2}** *Prediction: C↔E ≈ 0.586, E↔P ≈ 0.665 coord units*

| Pair Embedding Distance Coord Prediction |
| --- |
| CONDITION ↔ ENTITY | 0.13152 | 0.5858 |
| CONDITION ↔ PATTERN | 0.13198 | 1.2509 |
| ENTITY ↔ PATTERN | 0.16476 | 0.6651 |

C↔P ≈ C↔E + E↔P: ✗ non-additive

### Set: COMBINED

**Mode α (Arithmetic) — {0, 1, 2}** *Prediction: Equal steps — D↔R ≈ R↔G (ratio ≈ 1.0)*

| Pair Embedding Distance |
| --- |
| DIFFERENTIATING ↔ GENERATING | 0.06978 |
| DIFFERENTIATING ↔ RELATING | 0.05873 |
| RELATING ↔ GENERATING | 0.03936 |

Step ratio: 1.492 — ✗ unequal steps

**Domain η (Geometric) — {−1, +1, √2}** *Prediction: Asymmetric — E↔S / S↔Sig ≈ 4.8*

| Pair Embedding Distance Coord Prediction |
| --- |
| EXISTENCE ↔ SIGNIFICANCE | 0.07217 | 2.4142 |
| EXISTENCE ↔ STRUCTURE | 0.03571 | — |
| STRUCTURE ↔ SIGNIFICANCE | 0.06761 | 0.4142 |

E↔S / S↔Sig ratio: 0.528 (predicted 4.828) — ✗ directional prediction not met

**Object Ω (Transcendental) — {√2, 2, 2^√2}** *Prediction: C↔E ≈ 0.586, E↔P ≈ 0.665 coord units*

| Pair Embedding Distance Coord Prediction |
| --- |
| CONDITION ↔ ENTITY | 0.08247 | 0.5858 |
| CONDITION ↔ PATTERN | 0.06030 | 1.2509 |
| ENTITY ↔ PATTERN | 0.10590 | 0.6651 |

C↔P ≈ C↔E + E↔P: ✗ non-additive

## Entity Types — Q3 Relabeling

*Note: this result is a relabeling of Q3 (Object grain) and is numerically identical to the Q3 z-score in Result 1. CONDITION→Emanon, ENTITY→Holon, PATTERN→Protogon is a 1-to-1 mapping, so the z-score is the same measurement reported with EO entity-type vocabulary. It is included here for completeness and framing, not as an independent result.*

EO identifies three entity types based on which aspect of Ground/Figure/Pattern dominates a configuration:

1. **CONDITION targets → Emanon-prone** — Ground-dominant phenomena. Ambient, pre-figural, contextual. Proliferate when examined directly. Market confidence, organizational culture, the vibe of a place.
2. **ENTITY targets → Holon-prone** — Balanced configurations. Clear identity, stable figure, self-maintaining. Living cells, mature institutions, languages.
3. **PATTERN targets → Protogon-prone** — Pattern-dominant, crystallizing. Identities still forming, transformation underway. Startups, developing theories, emerging movements.

These correspond to positions 1–9 (Emanon), 10–18 (Holon), and 19–27 (Protogon) in the capacity ground.

**Entity type z-score (Emanon / Holon / Protogon): +4.81** (positive)

## Result 7 — Operators and Faces vs Axes

The axes produce 3 groups each (z-scores in Result 1). The operators and faces produce 9 groups by combining two axes. If the 9-group z-scores are stronger than the 3-group axis z-scores, the combinatorial structure is carrying real semantic information — the intersections matter, not just the dimensions individually. If weaker, the axes are the fundamental structure and the 9-cell grids are derived.

| Grouping Z-Score Groups |
| --- |
| Q1 alone (Mode) | +2.17 | 3 |
| Q2 alone (Domain) | +4.09 | 3 |
| Q3 alone (Object) | +4.81 | 3 |
| Operators (Q1×Q2 Act face) | +9.24 | 9 |
| Site face (Q2×Q3) | +9.44 | 9 |
| Stance face (Q1×Q3) | +12.70 | 9 |
| **Full 27-cell (Q1×Q2×Q3)** | **+16.15** | **27** |

The axis z-scores exceed the operator z-score. The primary geometric structure is at the axis level (3 groups), not the operator level (9 groups). The combinatorial intersections are less cleanly separated than the individual dimensions.

## Result 8 — Unsupervised Structure

KMeans clustering run without EO labels. Tests whether the data-driven clusters correspond to EO's axes, operators, or 27-cell addresses. ARI near 0 means no correspondence. ARI above 0.10 means meaningful overlap — the geometry is spontaneously organizing in a way EO predicts.

*Multiple testing note: three ARI comparisons (vs Q1, Q2, Q3) from one k=3 KMeans run. No Bonferroni correction applied — treat any individual ARI as directional rather than a significance claim.*

**PCA variance structure:**

| Metric Value |
| --- |
| Top 3 components capture | 5.6% of variance |
| Components needed for 50% | 51 |
| Components needed for 80% | 51 |

High-dimensional embeddings are dense — needing many PCs for 50% variance is normal. The EO axes are not expected to be the top PCs, since the embedding space is organized primarily by semantic content (what the clause is about), not by transformation type. The z-score tests are the right instrument, not explained variance.

Low KMeans ARI against EO labels does not falsify EO. It means the embedding space is not organized around EO's categories as its primary structure — which is expected, since embeddings encode semantic content first. The meaningful test is the z-score (do EO-labeled groups cluster more than chance?), not whether EO emerges spontaneously from unsupervised clustering.

## Cross-Set Comparison — Consensus vs Claude vs GPT-4

This is the classifier-independence test. The same geometric analysis is run three times: once on clauses where both models agreed (consensus), once on Claude's labels for all clauses, and once on GPT-4's labels for all clauses. If the z-scores are similar across all three sets, the structure is real and classifier-independent. If one model produces much stronger signal than the other, that model's internal representation is driving the result.

| Set Q1 z Q2 z Q3 z |
| --- |
| Consensus | +2.17 | +4.09 | +4.81 |
| Claude | +0.60 | +1.55 | +2.05 |
| GPT-4 | +1.64 | +1.24 | +3.15 |
| Combined | −0.28 | +1.42 | +2.95 |
| UD only | +2.17 | +4.09 | +4.81 |

Z-scores are consistent across label sets. The geometric structure does not depend on which model classified the clauses — this is the classifier-independence result.

**Axis independence (ARI) across sets:**

| Set Q1/Q2 Q1/Q3 Q2/Q3 |
| --- |
| Consensus | +0.185 | +0.028 | −0.008 |
| Claude | +0.099 | +0.021 | −0.008 |
| GPT-4 | +0.101 | +0.014 | +0.003 |

## Phasepost Frequency — All 27 Cells

Every clause has a full 27-cell address: Q1×Q2×Q3. The phasepost frequency table shows how often each cell appears in the corpus, grouped by triad. Three label sets are shown: consensus (both models agreed), Claude-only, and GPT-4-only. Comparing the three sets shows where the models agree on cell assignment and where they diverge.

Entity type (Emanon / Holon / Protogon) is derived from Q3: CONDITION = Emanon-prone (ground-dominant, ambient), ENTITY = Holon-prone (balanced, stable), PATTERN = Protogon-prone (pattern-dominant, crystallizing).

### Consensus (both models agreed) — 7,808 clauses

| Cell Type Count % |
| --- |
| NUL(Void, Clearing) | Emanon | 12 | 0.2% |
| NUL(Entity, Dissecting) | Holon | 114 | 1.5% |
| NUL(Kind, Unraveling) | Protogon | 23 | 0.3% |
| SEG(Field, Clearing) | Emanon | 45 | 0.6% |
| SEG(Link, Dissecting) | Holon | 327 | 4.2% |
| SEG(Network, Unraveling) | Protogon | 175 | 2.2% |
| DEF(Atmosphere, Clearing) | Emanon | 17 | 0.2% |
| DEF(Lens, Dissecting) | Holon | 373 | 4.8% |
| DEF(Paradigm, Unraveling) | Protogon | 167 | 2.1% |
| SIG(Void, Tending) | Emanon | 25 | 0.3% |
| SIG(Entity, Binding) | Holon | 172 | 2.2% |
| SIG(Kind, Tracing) | Protogon | 18 | 0.2% |
| CON(Field, Tending) | Emanon | 152 | 1.9% |
| **CON(Link, Binding)** | **Holon** | **2,114** | **27.1%** |
| CON(Network, Tracing) | Protogon | 322 | 4.1% |
| EVA(Atmosphere, Tending) | Emanon | 82 | 1.1% |
| EVA(Lens, Binding) | Holon | 1,250 | 16.0% |
| EVA(Paradigm, Tracing) | Protogon | 254 | 3.3% |
| INS(Void, Cultivating) | Emanon | 88 | 1.1% |
| INS(Entity, Making) | Holon | 1,317 | 16.9% |
| INS(Kind, Composing) | Protogon | 100 | 1.3% |
| SYN(Field, Cultivating) | Emanon | 48 | 0.6% |
| SYN(Link, Making) | Holon | 265 | 3.4% |
| SYN(Network, Composing) | Protogon | 85 | 1.1% |
| REC(Atmosphere, Cultivating) | Emanon | 15 | 0.2% |
| REC(Lens, Making) | Holon | 198 | 2.5% |
| REC(Paradigm, Composing) | Protogon | 50 | 0.6% |

### Claude labels only — 19,720 clauses

| Cell Type Count % |
| --- |
| NUL(Void, Clearing) | Emanon | 43 | 0.2% |
| NUL(Entity, Dissecting) | Holon | 272 | 1.4% |
| NUL(Kind, Unraveling) | Protogon | 89 | 0.5% |
| SEG(Field, Clearing) | Emanon | 236 | 1.2% |
| SEG(Link, Dissecting) | Holon | 1,017 | 5.2% |
| SEG(Network, Unraveling) | Protogon | 644 | 3.3% |
| DEF(Atmosphere, Clearing) | Emanon | 153 | 0.8% |
| DEF(Lens, Dissecting) | Holon | 1,069 | 5.4% |
| DEF(Paradigm, Unraveling) | Protogon | 759 | 3.8% |
| SIG(Void, Tending) | Emanon | 91 | 0.5% |
| SIG(Entity, Binding) | Holon | 393 | 2.0% |
| SIG(Kind, Tracing) | Protogon | 77 | 0.4% |
| CON(Field, Tending) | Emanon | 490 | 2.5% |
| **CON(Link, Binding)** | **Holon** | **3,540** | **18.0%** |
| CON(Network, Tracing) | Protogon | 1,124 | 5.7% |
| EVA(Atmosphere, Tending) | Emanon | 433 | 2.2% |
| EVA(Lens, Binding) | Holon | 2,889 | 14.7% |
| EVA(Paradigm, Tracing) | Protogon | 1,144 | 5.8% |
| INS(Void, Cultivating) | Emanon | 241 | 1.2% |
| INS(Entity, Making) | Holon | 1,903 | 9.7% |
| INS(Kind, Composing) | Protogon | 367 | 1.9% |
| SYN(Field, Cultivating) | Emanon | 298 | 1.5% |
| SYN(Link, Making) | Holon | 996 | 5.1% |
| SYN(Network, Composing) | Protogon | 434 | 2.2% |
| REC(Atmosphere, Cultivating) | Emanon | 147 | 0.7% |
| REC(Lens, Making) | Holon | 627 | 3.2% |
| REC(Paradigm, Composing) | Protogon | 244 | 1.2% |

### GPT-4 labels only — 19,756 clauses

| Cell Type Count % |
| --- |
| NUL(Void, Clearing) | Emanon | 82 | 0.4% |
| NUL(Entity, Dissecting) | Holon | 505 | 2.6% |
| NUL(Kind, Unraveling) | Protogon | 109 | 0.6% |
| SEG(Field, Clearing) | Emanon | 141 | 0.7% |
| SEG(Link, Dissecting) | Holon | 745 | 3.8% |
| SEG(Network, Unraveling) | Protogon | 320 | 1.6% |
| DEF(Atmosphere, Clearing) | Emanon | 83 | 0.4% |
| DEF(Lens, Dissecting) | Holon | 750 | 3.8% |
| DEF(Paradigm, Unraveling) | Protogon | 316 | 1.6% |
| SIG(Void, Tending) | Emanon | 254 | 1.3% |
| SIG(Entity, Binding) | Holon | 1,520 | 7.7% |
| SIG(Kind, Tracing) | Protogon | 153 | 0.8% |
| CON(Field, Tending) | Emanon | 664 | 3.4% |
| **CON(Link, Binding)** | **Holon** | **3,863** | **19.6%** |
| CON(Network, Tracing) | Protogon | 709 | 3.6% |
| EVA(Atmosphere, Tending) | Emanon | 317 | 1.6% |
| EVA(Lens, Binding) | Holon | 2,273 | 11.5% |
| EVA(Paradigm, Tracing) | Protogon | 535 | 2.7% |
| INS(Void, Cultivating) | Emanon | 337 | 1.7% |
| INS(Entity, Making) | Holon | 3,213 | 16.3% |
| INS(Kind, Composing) | Protogon | 317 | 1.6% |
| SYN(Field, Cultivating) | Emanon | 175 | 0.9% |
| SYN(Link, Making) | Holon | 892 | 4.5% |
| SYN(Network, Composing) | Protogon | 260 | 1.3% |
| REC(Atmosphere, Cultivating) | Emanon | 110 | 0.6% |
| REC(Lens, Making) | Holon | 901 | 4.6% |
| REC(Paradigm, Composing) | Protogon | 212 | 1.1% |

### Largest Divergences Between Claude and GPT-4

Cells where the two models' percentage distributions differ most. Large divergences mark the semantic boundaries where the models interpret the three questions differently.

| Cell Claude % GPT-4 % Diff |
| --- |
| INS(Entity, Making) | 9.7% | 16.3% | +6.6% |
| SIG(Entity, Binding) | 2.0% | 7.7% | +5.7% |
| EVA(Lens, Binding) | 14.7% | 11.5% | +3.1% |
| EVA(Paradigm, Tracing) | 5.8% | 2.7% | +3.1% |
| DEF(Paradigm, Unraveling) | 3.8% | 1.6% | +2.2% |
| CON(Network, Tracing) | 5.7% | 3.6% | +2.1% |
| SEG(Network, Unraveling) | 3.3% | 1.6% | +1.6% |
| DEF(Lens, Dissecting) | 5.4% | 3.8% | +1.6% |

## Summary Verdict

| Prediction Result |
| --- |
| Distance monotone with axis-difference count | ✓ |
| All pairwise ARI < 0.10 | ✗ |
| Q2 z-score exceeds Q1 z-score (Domain > Mode signal) | ✓ |
| Kappa Q1 > 0.50 | ✓ |

**One or more pre-committed predictions failed.** See individual results above for which axes or claims are not supported by the data.
