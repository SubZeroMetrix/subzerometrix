# SubZeroMetrix™ — System Logic Inventory

**Generated:** 2026-06-13 · **Checkpoint:** `948c9cc` · Method: code inspection (read-only).
Evidence tags: **[code]** = confirmed in source, **[doc]** = documentation-only, **[inferred]** =
deduced from call chains. No application code was changed to produce this document.

This is the index for the detailed breakdowns:
- [assessment-system-detailed-breakdown.md](assessment-system-detailed-breakdown.md)
- [metrixscore-calculation-detailed-breakdown.md](metrixscore-calculation-detailed-breakdown.md)
- [path-selection-decision-tree.md](path-selection-decision-tree.md)
- [roadmap-generation-detailed-breakdown.md](roadmap-generation-detailed-breakdown.md)
- [subzerometrix-owner-working-guide.md](subzerometrix-owner-working-guide.md)

---

## 0. The single most important architectural fact

**There are TWO scoring engines, and the one that computes the stored/Supabase score is NOT the
one shown to the user.** [code]

| | Engine 1 — "v2" | Engine 2 — "Starter" (displayed) |
|---|---|---|
| File | `src/lib/scoring.ts` → `calculateScores()` | `src/lib/metrixEngine.ts` → `scoreAssessment()` via `src/lib/metrixReport.ts` → `buildStarterScore()` |
| Input | 7 assessment answers + lead | Same 7 answers + Quick Intake, **re-mapped** into a partial 21-criterion Likert profile |
| Output | `overall` 0–100, 4 bands (`High Risk`/`Foundation Stage`/`Launch Ready`/`Growth Ready`), 7 raw category points, risks/actions/resources | `overall` 0–100, 4 risk levels (`high`/`elevated`/`moderate`/`low`), 7 different categories, strengths, risks, recommended path |
| Where stored | `szm_score` (localStorage + sessionStorage) + Supabase `assessments` table | **Not stored as the headline**; recomputed live each render; a snapshot copy is stored in `szm_metrix_history` |
| Where displayed | Nowhere as the headline number (its `answers`/`leadName` are reused) | `/results`, `/dashboard`, `/report` headline "STARTER METRIXSCORE™" |

Engine 1's `overall`/`band` is written to `szm_score` and to Supabase, but `/results`, `/dashboard`,
and `/report` all re-derive and display Engine 2's number. The two numbers differ for the same user.

---

## 1. Routes (`src/app`)

| Route | File | Role | Evidence |
|---|---|---|---|
| `/start` | `start/page.tsx` | Quick Intake capture (stage/trade/region/etc.) → `szm_intake` | [code] |
| `/assessment` | `assessment/page.tsx` | 7 questions + lead step; runs Engine 1; writes `szm_score`, `szm_assessment_id`, Supabase `assessments` | [code] |
| `/results` | `results/page.tsx` | Reads `szm_score`; **displays Engine 2** score, risk, strengths, path, first 3 actions; free next-step section | [code] |
| `/unlock` | `unlock/page.tsx` | Reads `szm_score`, `szm_assessment_id`; starts Stripe checkout ($9.99) | [code] |
| `/report` | `report/page.tsx` | Gated by `verify-session`; Engine 2 header + Engine 1 legacy paid roadmap (`buildPersonalizedRoadmap`) | [code] |
| `/dashboard` | `dashboard/page.tsx` | Engine 2 score + retention + Foundation/Growth progress; primary CTA from Foundation/Growth state | [code] |
| `/foundation-builder` | `foundation-builder/page.tsx` | Guided setup checklist (own `szm_foundation_builder` store) | [code] |
| `/growth` | `growth/page.tsx` | Customer Growth Engine (own `szm_growth_engine` store) | [code] |
| `/account/privacy` | `account/privacy/page.tsx` | Magic-link sign-in + export/delete hub | [code] |
| `/learn`, `/learn/[slug]`, `/trades`, `/resources`, `/platform/[trade]`, `/es/*` | various | Public SEO/content | [code] |
| `/api/verify-session` | `api/verify-session/route.ts` | Server-trusted Stripe payment check | [code] |
| `/api/checkout`, `/api/webhook`, `/api/email-trigger`, `/api/track-click`, `/api/postback/[vendor]` | `api/*` | Checkout, Stripe webhook, Resend trigger, click/postback tracking | [code] |

---

## 2. Core scoring / decision files (`src/lib`)

| File | Key exports | Role | Connected? |
|---|---|---|---|
| `questions.ts` | `QUESTIONS` (Q1–Q7), `TOTAL_QUESTIONS`, `PLATFORM_ROUTES`, `getQuestion` | The 7 live assessment questions + option point values | **Live** [code] |
| `scoring.ts` | `calculateScores`, `RawAnswers`, `ScoreResult`, `BAND_CONFIG`, `getBandColor` | Engine 1; writes `szm_score` + Supabase | **Live (stored)**, not displayed as headline [code] |
| `metrixEngine.ts` | `scoreAssessment`, `CRITERIA` (21), `CATEGORIES` (7), `STAGE_WEIGHTS`, `ANSWER_FRACTION`, `MetrixScore` | Engine 2; the displayed score | **Live (displayed)** [code] |
| `metrixReport.ts` | `buildStarterResponse`, `buildStarterScore`, `estimatePotential`, `explainRisk`, `firstAction`, `alternativePaths` | Bridge: maps 7 answers + intake → 21-criterion partial response, scores via Engine 2 | **Live** [code] |
| `intake.ts` | `QuickIntake`, `STAGE_OPTIONS`, `loadIntake`/`saveIntake`, label lookups, `INTAKE_STORAGE_KEY` | Pre-assessment context; **does not feed Engine 1**; partially feeds Engine 2 (stage, team, goal, challenge) | **Live** [code] |
| `pathActions.ts` | `generateActions`, `ACTION_CATALOG` (14), `ROADMAP_OPTIONS`, `focusCategoryForMode`, `challengeCategory`, `goalCategory` | Selects 3–5 first actions from Engine 2 risks + intake | **Live** [code] |
| `metrixRetention.ts` | `recordAssessmentSnapshot`, `recordActionProgress`, `getRetentionView` | Local-device score history + reassessment deltas (no cloud) | **Live (device)** [code] |
| `metrixHistory.ts` | snapshot/delta model, `MetrixHistoryState` | Pure history model used by retention | **Live (device)** [code] |
| `metrixStorage.ts` | `safeJsonParse`, `loadLocal*`/`saveLocal*`, `METRIX_STORAGE_KEYS` | Device-only localStorage helpers | **Live** [code] |
| `metrixReminders.ts` | `createReassessmentReminder` | In-app 90-day reassessment nudge (no email/SMS) | **Live (device)** [code] |
| `foundationBuilder.ts` | `FOUNDATION_STEP_DEFINITIONS` (24 core + 10 trade), completion stats, export CSV/HTML, `LAUNCH_STATE_RESOURCES` | Foundation Builder data model + helpers | **Live** [code] |
| `growthEngine.ts` | `diagnoseGrowth`, `buildGrowthRoadmap`, `CROSS_SELL`, `GROWTH_KPIS`, `loadGrowthInputs`/`saveGrowthInputs` | Customer Growth Engine; 7-constraint diagnosis; own input store | **Live (self-contained)** [code] |
| `contractorNeeds.ts` | `CONTRACTOR_NEEDS` (22), `getUndiscoveredNeeds`, `getDirectionForCategory` | Needs taxonomy + gap map | **DISCONNECTED — imported by no page/component** [code] |
| `scoringInfluenceMap.ts` | influence map of `szm_score`/`szm_intake` fields | Self-documenting audit map | **Doc-in-code; not a runtime input** [inferred] |
| `metrixProfileProgression.ts` | profile progression model reading `szm_score`/`szm_intake`/completion flags | Progression/forecasting helpers | [code] |
| `stateResources.ts` | `STATE_RESOURCES` (6 states) | State links used by `/report` | **Live** [code] |
| `roadmap.ts`, `roadmapFocus.ts`, `growthRoadmap.ts`, `growthPhases.ts`, `salesPlaybooks.ts`, `financialSystemsRoadmap.ts`, `marketingAssets.ts`, `vendorCategories.ts` | various | Legacy paid-report (Engine 1) roadmap content | **Live in `/report` paid view** [code] |
| `scoreExplanation.ts` | explanation copy | "Why this score" text for `OutcomeBriefing` | [code] |

---

## 3. Storage keys (localStorage / sessionStorage, all `szm_*`)

| Key | Written by | Read by | Holds | Cloud? |
|---|---|---|---|---|
| `szm_intake` | `intake.saveIntake` (`/start`) | results/report/dashboard, Engine 2 | Quick Intake context | Future [code] |
| `szm_score` | `assessment/page.tsx:232-233` | results/report/dashboard/unlock | **Engine 1** `ScoreResult` | Future [code] |
| `szm_assessment_id` | `assessment/page.tsx:275` | `unlock` | Supabase row id for checkout | No [code] |
| `szm_metrix_history` | `metrixStorage` (via retention) | dashboard/results | Engine 2 snapshots + reassessment events | Account-2D sync [code] |
| `szm_metrix_profile` | `metrixStorage` | retention | current MetrixProfile snapshot | sync [code] |
| `szm_metrix_last_recorded_at` | `metrixRetention.ts:50` | retention | idempotency marker per assessment | No [code] |
| `szm_path_complete` | `ChoosePathSection`/`roadmapProgress` | dashboard/report | completed roadmap action ids | Account-2E sync [code] |
| `szm_foundation_builder` | `FoundationBuilderChecklist` | dashboard/foundation | Foundation checklist items | Account-2I sync [code] |
| `szm_vendor_tracker`, `szm_launch_readiness` | (future trackers) | — | declared keys, minimal use | [code]/[doc] |
| `szm_foundation_complete` | `/report` | `/report`, progression | completed foundation step ids (report's own set) | [code] |
| `szm_growth_engine` | `growthEngine.saveGrowthInputs` (`/growth`) | growth + dashboard CTA gate | Growth inputs | Future [code] |
| `szm_growth_complete` | `/report` | `/report`, progression | completed growth tab ids | [code] |
| `szm_growth_events` | `growthAnalytics` | dashboard | device-local activity events (no PII) | Account-2H sync [code] |
| `szm_customer_feedback` | `customerProof` | dashboard | consent-first feedback | Account-2F sync [code] |
| `szm_partner_interest` | `partnerInterestSync` | partners | partner interest | sync [code] |
| `szm_feedback` | `feedback.ts` | — | feedback box entries | [code] |
| `szm_install_dismissed`, `szm_proof_dismissed` | UI | UI | dismiss flags | No [code] |

---

## 4. Database (`supabase`)

| Object | Migration | RLS | Used by | Evidence |
|---|---|---|---|---|
| `assessments` table | **none in repo** (pre-existing/external) | unknown — not in 001–003 | `assessment/page.tsx` best-effort insert | [code] — table referenced, no migration file |
| `metrix_*` account-sync tables | `001_metrix_account_sync.sql` | owner-only (`auth.uid() = account_user_id`) CRUD | account sync helpers | [code] |
| `cloud_sync_*` (10 tables) | `002_cloud_sync_progress_records.sql` | owner-only CRUD | cloud sync helpers | [code] |
| `marketing_subscriptions` | `003_marketing_subscriptions.sql` | INSERT-only + consent CHECK; no select/update/delete | `emailCapture.ts` | [code] |

---

## 5. Key decision conditions (where the product "decides")

| Decision | File:line | Condition | Evidence |
|---|---|---|---|
| Overall band (Engine 1) | `scoring.ts:217` | `overall >= min && <= max` over `BAND_CONFIG` | [code] |
| Risk level (Engine 2) | `metrixEngine.ts:214-219` | `<40 high / <60 elevated / <75 moderate / else low` | [code] |
| Stage group → weights | `metrixEngine.ts:111-141` | thinking/planning=early; launched_u6/months_6_12=establishing; over_1yr=growth; reset=reset | [code] |
| Recommended path | `metrixEngine.ts:233-238` | path id = function of **stage group only** | [code] |
| Focus category | `metrixEngine.ts:315` + `metrixReport.ts:153` | lowest-scoring answered category, challenge/goal tiebreak | [code] |
| `/results` primary next step | `results/page.tsx:268-286` | Foundation primary (static), Growth secondary (static) | [code] |
| Dashboard primary CTA | `dashboard/page.tsx:246-251` | Foundation incomplete → Foundation; else Growth (label varies on `szm_growth_engine` presence) | [code] |
| Report access | `report/page.tsx:700-702,773` | `verify-session` returns `paid===true` | [code] |
| Growth constraint | `growthEngine.ts:155-235` | capacity-first, then sales-process/conversion/lead/brand/retention/pricing thresholds | [code] |
