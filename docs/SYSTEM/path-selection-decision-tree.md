# Path-Selection Decision Tree

**Checkpoint:** `948c9cc` · Method: code inspection. Evidence **[code]**.

There is **no single central "path engine."** Path selection is split across three independent
layers that can disagree. This document maps each and states which wins.

---

## Layer 1 — Engine 2 "recommendedPath" (advisory label only)

`metrixEngine.ts:233-238` chooses a path **id from the stage group only**:

```
stage thinking/planning  → early        → 'foundation'  "Foundation Builder Path"
stage launched_u6/6_12   → establishing → 'stabilize'   "Stabilize & Systemize Path"
stage over_1yr           → growth       → 'scale'       "Scale & Optimize Path"
stage reset              → reset        → 'rebuild'     "Reset & Rebuild Path"
```

- This is **display copy** shown on `/results` ("RECOMMENDED PATH") and `/dashboard` ("Current
  Roadmap"). It does **not** route the user anywhere — there is no link tied to this id. [code]
- It is driven by **self-reported stage**, not by the score. A high-scoring "planning" user still
  gets "Foundation Builder Path"; a low-scoring "over_1yr" user still gets "Scale & Optimize."

## Layer 2 — `/results` free next-step (static, not state-driven)

`results/page.tsx:268-286` always renders the same two CTAs, regardless of score/stage: [code]
```
Primary  → /foundation-builder   "Build your business foundation"
Secondary→ /growth               "Already launched? Open the Customer Growth Roadmap"
```
Foundation is **always** primary here (ambiguity-safe). The score/stage does **not** change which is
primary. [code]

## Layer 3 — `/dashboard` primary CTA (the only state-driven router)

`dashboard/page.tsx:246-251` is the one place real stored state changes the route: [code]
```
foundationIncomplete = !foundationStats || foundationStats.completed < foundationStats.total
primaryCta =
  foundationIncomplete                       → /foundation-builder  "Continue your business foundation"
  else if hasGrowthProgress                  → /growth              "Continue your customer growth roadmap"
  else                                       → /growth              "Open your customer growth roadmap"
```
Where `hasGrowthProgress` = any non-`trade` field present in `szm_growth_engine` (`:184-185`).
**It does not read the score or the recommended path** — it reads Foundation checklist completion and
the presence of Growth-engine inputs. [code]

---

## Combined decision tree (as actually implemented)

```
Has szm_score?
├── No
│   ├── /dashboard  → "NO METRIXSCORE YET" → /start (Start Assessment)      [dashboard:199-211]
│   └── /results    → redirect to /assessment                               [results:59]
└── Yes
    ├── /results (always):
    │     headline = Engine 2 score/risk/strengths/path (advisory)
    │     primary next step = Foundation (static), secondary = Growth (static)
    │     bottom CTA = /unlock (paid report)
    │
    ├── /dashboard primary CTA (state-driven):
    │     Foundation checklist incomplete → /foundation-builder
    │     else + szm_growth_engine has data → /growth ("Continue …")
    │     else → /growth ("Open …")
    │
    └── /unlock → Stripe checkout → /report?session_id=…
          verify-session paid===true ? render paid report : "REPORT LOCKED" → /unlock
```

Growth constraint diagnosis (`/growth`) is a **fourth, independent** decision made entirely from the
Growth Engine's own inputs (`growthEngine.ts:diagnoseGrowth`), not from the assessment. See the
roadmap-generation doc.

---

## Required data per destination

| Destination | Requires | Fallback if missing |
|---|---|---|
| `/results` | `szm_score` | redirect `/assessment` [code] |
| `/dashboard` | `szm_score` (else empty state) | "Start Assessment" → `/start` |
| `/foundation-builder` | nothing (defaults a checklist; trade from intake) | general core checklist |
| `/growth` | nothing (own form) | empty form, "add a few numbers" prompt |
| `/report` | `verify-session` paid + `szm_score` | "REPORT LOCKED" / "SCORE NOT FOUND" |

---

## Conflict analysis — which system wins

| Signal | Where it lives | Influence | Wins? |
|---|---|---|---|
| Engine 2 `recommendedPath` (stage) | `/results`, `/dashboard` labels | display only | **No routing power** |
| Engine 2 score / risk | headline tiles | display only | No routing power |
| `/results` next-step | static | always Foundation-primary | Wins on `/results` |
| Dashboard CTA | Foundation + Growth stored state | actual route | **Wins on `/dashboard`** |
| Growth constraint | `/growth` inputs | actual `/growth` content | Wins on `/growth` |
| Stored progress (`szm_foundation_builder`, `szm_growth_engine`) | local | dashboard CTA label/route | Drives dashboard |
| Signed-in vs signed-out | auth | **no effect on path** — local-first; sign-in only adds backup | Never gates routing |

**Verdict:** when layers disagree, **the dashboard's Foundation/Growth-progress logic is the only one
that changes where the user actually goes.** The Engine-2 recommended path is advisory text that can
contradict the dashboard route (e.g., Engine 2 says "Scale & Optimize Path" while the dashboard sends
the user to `/foundation-builder` because their Foundation checklist is unfinished). [code] — a real
inconsistency to be aware of, documented in the consistency audit.

### Notable gaps / risks
- **No score- or stage-based routing.** A "growth-stage" self-report never routes to `/growth` by
  itself; only the presence of Foundation completion + Growth-engine data does. (This was a
  deliberate Fix-3 choice: "do not guess growth-stage from a completed Foundation checklist.") [code]
- The advisory `recommendedPath` and the actual dashboard route are computed from **different inputs**
  (stage vs. Foundation completion), so they routinely describe different journeys. [code]
- `/results` never branches on data, so a fully-established contractor still sees "Build your business
  foundation" as the primary free step. [code]
