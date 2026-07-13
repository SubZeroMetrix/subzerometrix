# Roadmap Generation — Detailed Breakdown

**Checkpoint:** `948c9cc` · Method: code inspection. Evidence **[code]**.

There are **four separate "roadmap"-like systems**. None of them is dynamically generated from
scratch; all are **catalog selection + filtering + ordering**. They do not share state.

| System | File | Driven by | Output |
|---|---|---|---|
| First-Actions ("Choose Your Path") | `pathActions.ts` | Engine 2 risks + intake | 3–5 `PathAction` cards (`/results`, `/dashboard`, `/report`) |
| Foundation Builder | `foundationBuilder.ts` | trade + state; user-driven | 24 core + 10 trade checklist steps (`/foundation-builder`) |
| Customer Growth Engine | `growthEngine.ts` | its own input form | constraint diagnosis → do-now/next/later actions (`/growth`) |
| Legacy paid roadmap | `roadmap.ts` + `growthPhases.ts` etc. | Engine 1 `ScoreResult` | 12-phase roadmap content (`/report`, paid) |

---

## 1. First-Actions generator (`pathActions.ts:generateActions`) [code]

- **Type:** template **selection**, not generation. `ACTION_CATALOG` holds **2 fixed actions per
  category** (14 total). Each action has title, whyItMatters, estimatedTime, difficulty, impact,
  category. [code] `pathActions.ts:46-103`
- **Trigger:** Engine 2 `score.risks` (lowest categories) + intake `biggestChallenge`/`mainGoal`.
- **Modes** (`PathMode`): `recommended` (used live with goal `'stabilize'`), `fastest`, `owner`.
  Live calls: `/results` uses `generateActions('recommended', starter, intake, 'stabilize').slice(0,3)`;
  `/dashboard` uses the full list. [code] `results/page.tsx:104`, `dashboard/page.tsx:216`
- **Selection logic** (`recommended`/`owner`, `:194-213`): both actions of the **focus** category
  first (depth), then one action from each subsequent priority category (challenge → goal → risk
  order), deduped, capped at 5.
- **`fastest` mode** sorts risk-area actions by `ease + impact` quick-win score (`:182-190`). Not used
  on the live pages reviewed.
- **Completion:** the consuming component stores completed action ids in `szm_path_complete`; the
  dashboard counts them as "MetrixMomentum" actions completed. Completion does **NOT** change any
  score. [code] `dashboard/page.tsx:219`

| Action id | Title | Category | Difficulty/Impact |
|---|---|---|---|
| bf_entity / bf_banking | Register entity / Open business bank acct | business_foundation | Easy/High |
| fc_pricing / fc_books | Pricing with real margins / Start bookkeeping | financial_control | Moderate-Easy/High-Med |
| sm_gbp / sm_referral | Claim GBP / Referral ask | sales_marketing | Easy/High-Med |
| op_schedule / op_checklist | Scheduling system / Job checklist | operations | Moderate-Easy/Med |
| cx_reviews / cx_followup | Ask for reviews / After-job follow-up | customer_experience | Easy/High-Med |
| pl_roles / pl_onboard | Roles & responsibilities / Onboarding checklist | people_leadership | Moderate/Med |
| gr_reserve / gr_plan | Cash reserve / Growth milestone | growth_risk | Moderate-Easy/High-Med |

---

## 2. Foundation Builder (`foundationBuilder.ts`) — **fully functional** [code]

- **Entry:** `/foundation-builder`, or dashboard card, or `/results` primary CTA. No score/auth gate.
- **Catalog:** `FOUNDATION_STEP_DEFINITIONS` = **24 core steps** (no `trade`) + **10 trade-specific
  licensing steps** (one per trade). 5 sections → 14 categories → steps. [code] `:190-256`
- **Trade filtering:** `getFoundationStepDefinitionsForTrade(trade)` = all core + that trade's steps;
  no trade/`other`/unknown → core only (`normalizeFoundationTrade`). [code] `:434-444`
- **Per-step fields:** priority (critical/high/medium/low), estimatedTime, `defaultStage`
  (start_here/do_this_next/later), `officialSourceReminder` (legal/tax/licensing flag).
- **Workflow:** stage lanes `start_here → do_this_next → later → done/blocked`; status
  not_started/in_progress/done/blocked kept in sync by `setFoundationItemStage`. [code] `:464-484`
- **Completion / progress:** `getFoundationCompletionStats` → completed/total/percent/blocked;
  `getNextFoundationItem` → next open item by stage order → priority → createdAt. [code]
- **Persistence:** `szm_foundation_builder` (local). Cloud: Account-2I sync helper
  (`foundationBuilderSync.ts`) — owner-only, confirmed-write-only. [code]
- **State resources:** `getFoundationStateResources(state, category)` returns federal EIN/GBP +
  launch-state entity/tax/licensing links (`LAUNCH_STATE_RESOURCES`, 6 states). Other states → federal
  only + "verify your state" fallback. **Educational starting points; no advice/completeness claim.** [code] `:712-803`
- **Export:** CSV (`foundationItemsToCsv`, anti-formula-injection) + printable HTML
  (`foundationItemsToPrintableHtml`, HTML-escaped). [code] `:643-710`
- **Spanish UI:** chrome-only translation (`getFoundationUiCopy('es')`); step content stays English. [code]
- **Connection to score:** **NONE.** Completing foundation steps does not change the MetrixScore or
  feed re-scoring. The dashboard only reads completion % to choose its CTA. [code]

---

## 3. Customer Growth Engine (`growthEngine.ts`) — **fully functional, self-contained** [code]

- **Entry:** `/growth`, dashboard card, `/results` secondary CTA. No score/auth gate.
- **Inputs (own form, all optional):** trade, stage, monthlyLeads, responseMinutes, missedCallsWeekly,
  bookingRatePct, closeRatePct, avgTicket, followUpProcess, repeatCustomerPct, referralsMonthly,
  reviewCount, gbpComplete, recurringRevenue, atCapacity, marketingTracked, per-field confidence. [code] `:31-49`
- **Constraint diagnosis** (`diagnoseGrowth`, `:155-235`) — distinguishes 7 constraints. Exact triggers:

| Constraint | Trigger [code] |
|---|---|
| **capacity** | `atCapacity === true` → severity high (checked FIRST so a full shop is never told to "buy more leads") |
| **sales_process** | any of: response >30 min, missedCalls ≥3, bookingRate <50, followUpProcess===false (score = count → sev) |
| **conversion** | closeRate <35 (sev high if <20) |
| **lead** | monthlyLeads <10 AND not at capacity (sev high if <5) |
| **brand** | gbpComplete===false and/or reviewCount <10 |
| **retention** | repeatCustomerPct <20 and/or referralsMonthly <2 and/or recurringRevenue===false |
| **pricing** | 0 < avgTicket <250 → severity medium |

- **Ranking** (`:208-214`): sort by severity, then fixed order
  `capacity → sales_process → conversion → lead → retention → brand → pricing`. `primary` =
  findings[0]; `secondary` = next up to 3.
- **Multiple constraints:** all detected constraints contribute actions; `buildGrowthRoadmap`
  (`:279-295`) gathers actions for primary + secondary, dedupes, sorts by bucket
  (do_now/do_next/later) then priority. [code]
- **Actions:** `actionsForConstraint` — fixed 2–3 actions per constraint, capacity-first wording. [code] `:238-276`
- **Channels** (`recommendChannels`, `:298-316`): if primary is sales_process/conversion/capacity →
  "fix the funnel before adding channels"; always GBP + reviews/referrals; lead/brand → LSA +
  directories; retention → reactivation. [code]
- **Cross-sell** (`CROSS_SELL`): trade-aware list for all 10 trades; generic fallback. [code] `:111-125`
- **Strongest capability / data-confidence note:** positive signal + "several metrics not tracked"
  caveat when ≥3 fields are `not_tracked`. [code] `:217-228`
- **KPIs:** static `GROWTH_KPIS` (10). · **Persistence:** `szm_growth_engine` (local). [code]
- **Connection to score:** **NONE.** It reads neither `szm_score` nor the assessment answers and does
  not write back to the MetrixScore. [code]

---

## 4. Legacy paid roadmap (`/report`, paid) [code]

- Gated by `verify-session` (`paid===true`). Reads `szm_score` (Engine 1) + intake. [code] `report/page.tsx:700-708`
- Header tiles re-use **Engine 2** `buildStarterScore`; the deep roadmap content uses **Engine 1's**
  `result.categoryScores` + `buildPersonalizedRoadmap` (`roadmap.ts`) and phase content
  (`growthPhases.ts`, `salesPlaybooks.ts`, `financialSystemsRoadmap.ts`, `marketingAssets.ts`,
  `vendorCategories.ts`). [code] `report/page.tsx:14-22, 806-814`
- Tabs: score / roadmap / resources; phase sub-tabs overview/90day/tools/sales/upgrade. Completed
  steps/tabs stored in `szm_foundation_complete` / `szm_growth_complete` (report-local sets, distinct
  from the Foundation Builder's `szm_foundation_builder`). [code] `:683-719`
- Fix-3 removed the dead "Unlock the Full Execution Module" CTA + "coming soon" footnotes; remaining
  locked-preview relabeled "What deeper execution work covers" (no purchase/timing claim). [code]

---

## Generation method summary

| Question | Answer |
|---|---|
| Dynamically generated? | No — all four are **catalog selection + filter + sort** |
| Selected from templates? | **Yes** (ACTION_CATALOG, FOUNDATION_STEP_DEFINITIONS, actionsForConstraint, roadmap phases) |
| Ordered by priority? | Yes (bucket/priority/stage order) |
| Score-triggered? | First-Actions yes (Engine 2 risks); Foundation/Growth **no** |
| Answer/stage-triggered? | First-Actions (risks+stage); Foundation (trade+state); Growth (own inputs) |
| Trade/state-triggered? | Foundation (trade steps + state resources); Growth (cross-sell) |
| User-selected? | Foundation steps + Growth inputs are user-driven; `owner` action mode is user-goal-driven |
| Completion affects future scoring? | **No** anywhere — completion is tracked for momentum/progress display only |
