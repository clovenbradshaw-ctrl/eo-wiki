# Going and Looking: Research That Tries to Be Wrong

**Record ID:** wiki:going-and-looking  
**DB ID:** 78  
**Tags:** 301  
**Keywords:** research, disproof, falsification, curiosity, corroboration, stopping rule, saliency  
**Status:** published  
**Updated:** 2026-07-14T00:00:00.000Z  

---

*The [EO Reader](/the-eo-reader)'s research room is built on one sentence: **a research tool that only ever makes you more confident is not researching — it is collecting.** So it is built to try to be wrong.*

---

## The disproof stance

About a third of the searches in a study are seeded not to confirm the emerging reading but to **falsify** it — *go find the document that would exist only if this reading were wrong* (`disproofQueries`, `src/rooms/research/driver.js`). These disproof searches are always drained, even past the point where the confirming corpus is satisfied. A source found by a disproof search is traceable as such (the pin carries its `via`; claims carry `fromDisprove`), so the trail shows the reading survived an attempt on its life rather than merely accumulating agreement.

## The watchable stop rule

Research stops when it stops *learning*, and the stopping is legible: per-document information gain, a quiet-countdown, `quietNeeded` consecutive quiet documents before it halts (`src/rooms/research/project.js`). You can watch it decide it is done. And a mid-study **reframe** — the story changing — flags every earlier answer `staleAfterRec` for re-check, because an answer given under the old frame may no longer hold under the new one. The research report is a pure projection of an append-only event log; the claim-to-passage links are never severed.

## Curiosity, leashed

The multi-hop walk that follows leads is not a shotgun. It is **best-first over the one [surprise](/signal-from-noise)** — curiosity is that surprise pointed at freshly fetched pages, and `bayesBy` (which dimensions belief moved along) names the next leads (`src/turn/research.js`). But surprise alone wanders: *a page is often surprising precisely because it has gone off-topic* (the classic drift, X-Files → one actor → an unrelated film → metallurgy). So surprise is **leashed by saliency** — a Born-rule cosine against a topic frame frozen on the original question. A hop that strays below a self-calibrating fraction of the seed's saliency, for enough consecutive hops, ends the walk (`src/turn/research.js`, salience leash). Surprise pulls out; saliency pulls back.

## Corroboration with an honest terminal

When the answer rests on a single source, the reader goes looking for a second, distinct witness (`src/turn/corroborate.js`). A fetched page counts only if it *both* supports the answer's distinctive claim *and* is a distinct witness by provenance (not merely similar text — see [Signal from Noise](/signal-from-noise)). The walk has three terminals, and the third is the point: **FOUND** (a distinct witness), **DRY** (searched and found none — *"I couldn't find an independent source; treat it as single-source"*), or **SPENT**. "I looked and could not corroborate this" is a designed, honest output, not a failure to be hidden.

## Why it is EO

Going and looking is [search as the door between the two doors](/the-two-doors): it converts the engine's own reafferent guess into an exafferent witness, at a measured toll. It is [saving the appearances](/ancient-astronomy-eo-saving-the-appearances) as a method — the standard is to contain every observation, including the one that would break your reading, without remainder. A good search, the docs say, *hands you back a better silence.*

---

### See also

- [The Two Doors](/the-two-doors) — reafference converted to exafference
- [Signal from Noise](/signal-from-noise) — the curiosity metric and the corroboration bar
- [Deep Reading](/deep-reading) — the inward-facing sibling
- [The EO Reader](/the-eo-reader) · [The Evidence](/the-evidence)
