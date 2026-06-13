# How the SubZeroMetrix™ Decision System Works — Owner's Working Guide

**Checkpoint:** `948c9cc` · Method: code inspection (read-only). Evidence **[code]**.
Companion docs: [system-logic-inventory](system-logic-inventory.md) ·
[assessment](assessment-system-detailed-breakdown.md) ·
[metrixscore](metrixscore-calculation-detailed-breakdown.md) ·
[path-selection](path-selection-decision-tree.md) ·
[roadmap-generation](roadmap-generation-detailed-breakdown.md).

---

## The two-minute explanation

A tradesperson answers a **7-question assessment** about their business (trade, location, stage,
what they've set up, money, how they get customers, biggest blocker). We turn that into a
**MetrixScore™ out of 100** with a risk level and a recommended path, plus a short list of first
moves. From there they can use two free tools — a **Foundation Builder** checklist (get your business
legally set up) and a **Customer Growth Roadmap** (find your real growth bottleneck) — and optionally
buy a **$9.99 full report**. Everything saves on their device; signing in (magic link) just backs it
up to the cloud. Today the score is a **readiness snapshot**, not a performance or credit measure, and
the two tools run on their own data rather than the score.

## The ten-minute detailed explanation

1. **Quick Intake (`/start`)** captures soft context (stage, trade, region, revenue band, team size,
   goal, challenge, confidence) → `szm_intake`. It does **not** feed the stored score. [code]
2. **Assessment (`/assessment`)** — 7 questions + name/email. On submit, **Engine 1**
   (`scoring.ts`) computes a 0–100 score + band, saves it to `szm_score`, and best-effort writes a
   Supabase `assessments` row. [code]
3. **Results (`/results`)** reads `szm_score` but **re-computes and displays Engine 2**
   (`metrixEngine.ts` via `buildStarterScore`) — a stage-weighted score across 7 categories inferred
   from the same answers + intake. Shows score, risk, strengths, top risks, recommended path, first 3
   moves, and free next-step links. [code]
4. **Dashboard (`/dashboard`)** shows the Engine 2 score, local score history/momentum, and a single
   primary CTA chosen from **Foundation/Growth progress** (not the score). [code]
5. **Foundation Builder (`/foundation-builder`)** — a real, working setup checklist (24 core + 10
   trade steps), trade/state-aware, with CSV/PDF export. Independent of the score. [code]
6. **Customer Growth Roadmap (`/growth`)** — a real, working constraint diagnoser (7 constraints)
   that runs on its own input form. Independent of the score. [code]
7. **Unlock/Report (`/unlock` → `/report`)** — Stripe $9.99 checkout; the report is server-gated by
   `verify-session` and shows the legacy 12-phase paid roadmap. [code]
8. **Accounts (`/account/privacy`)** — magic-link sign-in adds owner-only cloud backup + export/delete.
   Local-first; sign-in is never forced. [code]

### Key terminology
- **MetrixScore™** — the displayed 0–100 readiness number (Engine 2). **MetrixStage** — the
  self-reported business stage. **MetrixProfile™** — the saved context + its completion %.
  **MetrixMomentum** — count of completed roadmap actions (display only). **Starter** — signals the
  score is a partial/preview profile, not a full 21-criterion assessment.

### What the MetrixScore means / does not mean
- **Means:** an inferred, stage-weighted readiness snapshot, strongest on **setup completion**,
  **self-reported stage**, and **financial comfort**.
- **Does NOT mean:** business performance, profitability, creditworthiness, benchmarking against
  peers, or a prediction of success. No revenue/close-rate/lead/retention data reaches it. The UI says
  so explicitly. [code]

---

## Score interpretation (bands & thresholds) — and the inconsistency

**Engine 1 bands** (stored, `scoring.ts:74-108`): 0–39 High Risk · 40–59 Foundation Stage · 60–79
Launch Ready · 80–100 Growth Ready.
**Engine 2 risk levels** (displayed, `metrixEngine.ts:214-219`): <40 high · <60 elevated · <75
moderate · ≥75 low.

> **Consistency risk:** the same user gets an Engine-1 band ("Foundation Stage") in storage/Supabase
> and an Engine-2 risk level ("Elevated Risk") on screen, derived from two different numbers. A score
> of 62 is "Launch Ready" in Engine 1 but "moderate risk" in Engine 2 — and the two engines won't
> even produce 62 from the same answers. Verify which number any report/email/support quotes. [code]

---

## Stage detection

There is **no inference engine** — stage is **self-reported** (assessment Q3 and/or intake stage,
same id set). Engine 2 maps it to a stage *group* (early/establishing/growth/reset) that sets the
weight table and the advisory path. The Growth Engine has its own separate `GrowthStage` enum
(pre_launch…growth_stage) used only inside `/growth`. The "capacity/lead/sales/retention-constrained"
states are **not** business stages — they are Growth-Engine constraint findings computed from
`/growth` inputs. [code]

---

## Needs-mapping system — status: **DOCUMENTATION-ONLY / DISCONNECTED**

`contractorNeeds.ts` defines a 22-entry taxonomy (`CONTRACTOR_NEEDS`) mapping each need to a
MetrixScore category, how it's discovered (`assessment`/`growth_engine`/`foundation_builder`/
`not_discovered`), and which feature addresses it. It exposes `getUndiscoveredNeeds` and
`getDirectionForCategory`. **No page or component imports it** (confirmed by repo-wide search — only
referenced in itself and docs). It currently changes **nothing**: not the score, not categories, not
the roadmap, not dashboard CTAs, not the report. It is a future architecture layer. [code]

It does usefully record the **coverage gaps** — needs nothing currently asks about: `need-sops`
(SOPs/quality/callbacks), `need-hiring`, `need-leadership`, `need-tech` (all `not_discovered`). [code]

---

## Dashboard decision logic (`/dashboard`)

- **Empty state:** no `szm_score` → "NO METRIXSCORE YET" → `/start`. [code]
- **Primary CTA:** Foundation checklist incomplete → `/foundation-builder`; else → `/growth`
  (label changes if `szm_growth_engine` has data). **Score-independent.** [code] `:246-251`
- **Display:** Engine 2 score/profile%/risk tiles; current path label (advisory); current action
  (first incomplete `pathActions` action); next profile section (least-answered category);
  MetrixMomentum (completed count + projected gain via `estimatePotential`); local score history
  (previous→current delta from `szm_metrix_history`); 90-day reassessment nudge; Foundation + Growth
  cards. [code]
- **Verdict:** the dashboard's *recommendation* (CTA) is connected to **Foundation/Growth stored
  flags**, while its *numbers* are connected to the assessment via Engine 2. The two are not the same
  source. [code]

## Results-page decision logic (`/results`)

- **Data source:** `szm_score` (else redirect `/assessment`) + `szm_intake`. Displays Engine 2.
- **Missing/malformed data:** JSON parse failure → redirect `/assessment`; safe. [code] `:55-65`
- **Foundation vs Growth:** **static** — Foundation always primary, Growth always secondary; not
  data-driven. [code] `:268-286`
- Intake fields are honestly grouped as "Score inputs" (stage, team), "Roadmap priority" (trade,
  region, goal, challenge), "Profile context" (years, revenue) — reflecting their real role. [code]

## Report logic (`/report`)

- **Free vs paid:** entire report gated; `verify-session` must return `paid===true`. `DEV_UNLOCK` is
  double-gated (`=== 'true' && NODE_ENV !== 'production'`). [code]
- **Score data:** Engine 2 header + Engine 1 `categoryScores`/`buildPersonalizedRoadmap` for the deep
  roadmap. Trade/state personalization via intake + `STATE_RESOURCES`. [code]
- **Generated from live logic or separate presentation?** Mixed: the headline is live Engine 2; the
  paid 12-phase content is largely **static catalog content** keyed off Engine 1 categories. [code]

---

## Storage & data lifecycle (device-local unless noted)

| Data | Key / table | Created | Read | Deleted | Cloud |
|---|---|---|---|---|---|
| Quick Intake | `szm_intake` | `/start` | results/report/dashboard, Engine 2 | account delete / device clear | future |
| Assessment score (Engine 1) | `szm_score` + Supabase `assessments` | `/assessment` submit | results/report/dashboard/unlock | device clear (local); Supabase row persists | row already cloud (no RLS migration in repo) |
| Assessment id | `szm_assessment_id` | submit | `/unlock` | device clear | no |
| Score history (Engine 2) | `szm_metrix_history` | results/dashboard mount | dashboard/results | account/device delete | Account-2D owner-only |
| Current profile | `szm_metrix_profile` | retention | retention | delete | sync |
| Roadmap actions done | `szm_path_complete` | ChoosePath | dashboard/report | delete | Account-2E |
| Foundation checklist | `szm_foundation_builder` | Foundation Builder | dashboard/foundation | delete | Account-2I |
| Growth inputs | `szm_growth_engine` | `/growth` | growth + dashboard CTA | delete | future |
| Report-local completion | `szm_foundation_complete`, `szm_growth_complete` | `/report` | `/report` | device clear | no |
| Growth events | `szm_growth_events` | growthAnalytics | dashboard | delete | Account-2H |
| Paid status | (none persisted) | — | per-visit `verify-session` | — | server-trusted only |

- **Stale-data risk:** `szm_score` (Engine 1) and `szm_metrix_history` (Engine 2 snapshots) can drift
  if the user re-takes only one path; Engine 1 ↔ Engine 2 already disagree. No schema versioning on
  `szm_*` blobs — a future shape change risks `safeJsonParse` returning partial objects (guarded, but
  fields may be missing). [code]
- **Signed-out:** everything works locally. **Signed-in:** adds owner-only cloud backup
  (confirmed-write-only "Synced to your account"). Sign-in never deletes local data. [code]

---

## Reassessment & continuous improvement

| Capability | Status |
|---|---|
| Re-take assessment | **Implemented** — dashboard "Recheck My Score" / "Update my answers" → `/start` [code] |
| Preserve old scores | **Implemented (device)** — `szm_metrix_history` snapshots [code] |
| Compare over time | **Implemented (device)** — previous→current delta on results/dashboard [code] |
| Reassessment reminder | **Implemented (device)** — in-app 90-day nudge, no email/SMS [code] |
| Update score from completed actions | **Missing** — completing Foundation/Growth/roadmap actions does NOT change the score [code] |
| Automatic re-scoring | **Missing** |
| Outcome tracking | **Partial** — manual KPI input (`BusinessOutcomeTracker`) stored locally; not fed into score |
| Momentum scoring | **Prototype** — count of completed actions only (display) |
| Benchmarking / peer trends | **Missing / explicitly disclaimed** |

The intended loop **Assessment → Score → Roadmap → Action → Tracking → Outcome → Re-scoring** exists
only up to "Roadmap"; **Action/Tracking are recorded but do not re-score**, and the Outcome→Re-scoring
link is absent. Re-scoring happens only when the user manually re-takes the assessment. [code]

---

## Consistency & logic audit (findings — not fixed, documented)

1. **Dual score engines, different displayed vs stored numbers** (Engine 1 stored, Engine 2 shown).
   Highest-impact inconsistency. [code]
2. **Advisory path vs actual route disagree** — Engine 2 `recommendedPath` (stage-based) can say
   "Scale & Optimize" while the dashboard routes to `/foundation-builder`. [code]
3. **Two state-resource datasets** with different URLs for the same 6 states: `stateResources.ts`
   (`/report`) vs `LAUNCH_STATE_RESOURCES` in `foundationBuilder.ts` (e.g., CO SoS `sos.state.co.us`
   vs `coloradosos.gov`). Maintenance/consistency risk. [code]
4. **`contractorNeeds.ts` dead-ended** — full taxonomy imported by nothing. [code]
5. **In-assessment refresh loses progress** — answers are never persisted mid-flow. [code]
6. **`financial` answer double-counts** in Engine 2 (cash_flow + financial_runway identical). [code]
7. **Engine 2 Starter score can read alarmingly low** for legitimate pre-launch users (Persona A ≈ 2)
   because only inferable criteria are scored (all 0) and favorable defaults are excluded. [code]
8. **Q1 trade & Q2 location are unused by the displayed score** (Engine 2 uses intake instead);
   a user who skips intake trade gets no trade-aware Engine-2 personalization. [code]
9. **Two "foundation complete" stores** — `szm_foundation_builder` (real builder) vs
   `szm_foundation_complete` (report tab progress) are unrelated. [code]
10. **Supabase `assessments` table has no migration in-repo** — its RLS/columns can't be verified from
    the repo; insert is best-effort/non-fatal. [code]

No dead UI routes, no fabricated benchmarks, no credit-score terminology, and paid gating is sound
(verified in the launch-readiness pass). The inconsistencies above are **internal logic/clarity**
issues, not security or payment issues.

---

## System-strength assessment (against the product philosophy)

| Layer | Rating | Why [code] |
|---|---|---|
| **Assessment** | Mostly implemented | 7 working questions; but startup-weighted and refresh-fragile |
| **Score** | Partially implemented | Two engines; displayed score is a *partial inference*, not full 21-criterion |
| **Roadmap** | Mostly implemented | Foundation + Growth are real and good; First-Actions is solid; all catalog-based |
| **Action** | Partially implemented | Users can complete steps/actions locally |
| **Tracking** | Partially implemented | Local history, deltas, manual KPI input, reminders |
| **Outcome** | Prototype | Manual outcome/KPI entry exists, not connected to score |
| **Re-scoring** | Missing (auto) / Implemented (manual re-take) | No action→score feedback loop |
| **Needs mapping** | Documentation-only | Taxonomy exists, wired to nothing |
| **Cloud sync** | Mostly implemented | Owner-only, confirmed-write-only, additive |
| **Payment/report gating** | Fully implemented | Server-trusted verify-session; double-gated dev unlock |

**What the MetrixScore actually measures today:** primarily **business setup completion** + **self-
reported stage** + **financial comfort** — i.e., *startup readiness*. It does **not** measure business
performance, momentum, real risk, growth capability, or operational maturity (those are either
unmeasured or live separately in the Growth Engine). [code]

---

## Five most important limitations
1. **Two scoring engines** produce different stored vs displayed numbers — confusing and a data-
   integrity risk.
2. **The score is a startup-readiness snapshot, not performance** — and is partial by design
   (completion ~45–67%).
3. **Roadmaps don't feed back into the score** — completing work never improves the number; the loop
   is open.
4. **Needs mapping is disconnected** — the richest gap→action logic isn't wired to anything users see.
5. **Foundation/Growth/Score are three islands** — they don't share state, so the dashboard routes on
   one signal while displaying another.

## Five highest-value future improvements
1. **Pick one engine** (or formally make Engine 2 the single source and stop storing Engine 1's
   number) so stored == displayed.
2. **Close the loop:** let Foundation/Growth/action completion update the score (re-scoring), turning
   "Starter" into a living MetrixProfile.
3. **Wire `contractorNeeds.ts`** into results/dashboard so gaps explicitly route to Foundation/Growth/
   resources.
4. **Persist in-assessment answers** to localStorage per step (fix the refresh-loses-progress gap).
5. **Unify the two state-resource datasets** and reconcile the advisory path with the actual dashboard
   route so they never contradict.

---

## How to describe it to each audience
- **Developers:** "Engine 1 stores, Engine 2 displays; Foundation/Growth/Needs are independent
  modules; routing is dashboard-state-driven; everything is local-first with owner-only cloud sync."
- **Contractors:** "Answer 7 questions, get a readiness score and a clear first move, then use the
  free Foundation and Growth tools."
- **Investors:** "Working assessment → readiness score → guided tools, local-first with paid report;
  the re-scoring/outcome loop and needs-driven personalization are the next build phase."
- **Partners:** "Trade- and state-aware foundation + growth tooling for 10 trades and 6 launch states."
- **Attorneys:** "Educational only, no advice; explicit disclaimers; no credit-score terminology;
  consent-first data; owner-only data access; verify state resources are framed as starting points."
- **Beta testers:** "Re-take to see deltas; note that the score won't move when you complete tasks yet
  — that's expected today."
