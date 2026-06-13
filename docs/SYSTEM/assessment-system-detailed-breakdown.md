# Assessment System — Detailed Breakdown

**Checkpoint:** `948c9cc` · Method: code inspection. Evidence: **[code]** unless noted.

---

## 1. Overview of what the assessment is

The live assessment is **7 questions + 1 lead-capture step**, defined in `src/lib/questions.ts`
and rendered by `src/app/assessment/page.tsx`. On submit it runs **Engine 1**
(`scoring.ts:calculateScores`), stores the result in `szm_score`, best-effort inserts a row into the
Supabase `assessments` table, and routes to `/results`. [code]

A separate **Quick Intake** (`/start`, `src/lib/intake.ts`) is captured *before* the assessment and
stored in `szm_intake`. Intake does **not** feed Engine 1 at all; it partially feeds the *displayed*
Engine 2 score (stage, team size, main goal, biggest challenge, confidence). [code]

---

## 2. Complete question inventory (live assessment)

All point values are the `score` field on each option in `questions.ts`. "Affects overall" below
refers to **Engine 1** (the stored score). The **displayed** score (Engine 2) consumes these answers
very differently — see column "Engine 2 use" and the MetrixScore breakdown doc.

### Q1 — `business_type` (`questions.ts:44`)
- **Wording:** "What type of trade or service business are you starting or running?"
- **Category label:** Business Type · **Variant:** single · **maxPoints:** 10
- **Options/values:** hvac/electrical/plumbing/roofing/solar/construction/handyman/landscaping/cleaning/painting = **10**; other = **7**
- **Engine 1:** sets `businessClarity` (= option score). Affects overall. Also selects `BUILDER_PATHS` + `PLATFORM_ROUTES`.
- **Engine 2 use:** **none directly** — trade is taken from intake, not this answer, for personalization. [code]
- **Stage detection:** no · **Needs mapping:** no (taxonomy disconnected) · **Path selection:** indirectly (trade copy)
- **Trade/state:** drives trade platform routing.

### Q2 — `location` (`questions.ts:67`)
- **Wording:** "Where are you planning to operate?"
- **Variant:** location (state required, city optional) · **maxPoints:** 10
- **Engine 1:** `locationClarity` = state+city → 10, state only → 7, city only → 3, none → 0 (`scoring.ts:161-163`).
- **Engine 2 use:** none (region comes from intake). [code]
- **State-specific:** state value later drives `/report` `STATE_RESOURCES` and Foundation Builder `LAUNCH_STATE_RESOURCES` lookups.

### Q3 — `stage` (`questions.ts:78`)
- **Wording:** "Where does your business stand right now?"
- **Variant:** single · **maxPoints:** 15
- **Options/values:** thinking=4, planning=8, launched_u6=10, months_6_12=12, over_1yr=13, reset=7
- **Engine 1:** `stageReadiness` = option score. Affects overall.
- **Engine 2 use:** **stage is the single most important input** — it selects the stage-weight table and the recommended path (`metrixEngine.ts:111-141, 233`). Note Engine 2 prefers the **intake** stage; falls back to this answer (`metrixReport.ts:141`).
- **Stage detection:** this is the closest thing to stage detection — it is a **self-reported** stage, not inferred. [code]

### Q4 — `setup_steps` (`questions.ts:96`)
- **Wording:** "Which foundation steps have you completed?"
- **Variant:** checkbox (multi) · **maxPoints:** 20 (capped) · **noneOptionId:** `none_yet`
- **Options/values:** biz_name=2, entity_reg=3, ein=3, bank=3, insurance=3, license_res=3, website=1, gbp=2, none_yet=0
- **Engine 1:** `setupReadiness` = sum of checked, `min(20, …)`; `none_yet` zeroes it (`scoring.ts:170-182`). Drives several risks/actions/resources (insurance, online presence, banking).
- **Engine 2 use:** **heavily** — maps to 5 of the 21 criteria: `entity_registration`, `licensing_insurance`, `banking_separation`, `online_presence`, `brand_consistency` (`metrixReport.ts:94-116`).
- This is the highest-leverage question for the displayed score.

### Q5 — `financial` (`questions.ts:118`)
- **Wording:** "How prepared are you financially to launch or grow?"
- **Variant:** single · **maxPoints:** 20
- **Options/values:** under_2k=4, k2_10=10, k10_25=16, over_25k=20, need_funding=6, not_sure=3
- **Engine 1:** `financialReadiness` = option score; `need_funding`/`not_sure` flag funding dependency → risks/actions.
- **Engine 2 use:** maps to `cash_flow` AND `financial_runway` (same mapping both, `metrixReport.ts:28-50, 106, 135`).

### Q6 — `customer_plan` (`questions.ts:136`)
- **Wording:** "How do you plan to get your first — or next — customers?"
- **Variant:** single · **maxPoints:** 15
- **Options/values:** word_of_mouth=10, gbp_local=12, social=7, paid_ads=6, flyers=8, referrals=13, existing_base=15, no_plan=0
- **Engine 1:** `customerReadiness`; `no_plan` (0) triggers "no customer plan" risk/action.
- **Engine 2 use:** maps to `lead_generation` (`metrixReport.ts:52-64, 110`).

### Q7 — `blocker` (`questions.ts:156`)
- **Wording:** "What is the single biggest thing freezing your progress right now?"
- **Variant:** single · **maxPoints:** 10
- **Options/values:** legal_setup=3, licensing=2, funding=3, credit=3, insurance=4, pricing=6, customers=4, branding=8, software=7, confidence=5
- **Engine 1:** `blockerSeverity` = option score (**higher = less severe**, counterintuitively); also gates several risks/actions (licensing, pricing, software).
- **Engine 2 use:** conditionally sets `pricing_strategy` (if pricing), `brand_consistency` (if branding), `scheduling_workflow` (if software) to `not_started` (`metrixReport.ts:107, 115, 119`).

### Lead step (`assessment/page.tsx:448`)
- **Fields:** First name (required), Email (required, must contain `@`).
- **Engine 1:** adds a **+10 "emailScore"** completion bonus when both present (`scoring.ts:199-200`), folded into the `maxRaw=110` normalization.
- **Engine 2 use:** none. Lead name/email are display + Supabase only.

---

## 3. Answer-processing logic (`assessment/page.tsx`)

- **Component state:** `answers: RawAnswers` plus per-question working state (`singleSel`, `checkboxSel`, `locState`, `locCity`, `leadName`, `leadEmail`). [code]
- **Validation / required:** `canContinue()` (`:137`) — single: 1 selected; checkbox: ≥1; location: state required (city optional); lead: name non-empty + email contains `@`. Every question is effectively **required to advance** (the Continue button disables). [code]
- **Checkbox "none" logic:** selecting `none_yet` clears others; selecting a real option clears `none_yet` (`:290-303`). [code]
- **Navigation:** `handleNext`/`handleBack` save current working state into `answers` and pre-load the next/prev step's saved value. Back from step 0 → `/start`. [code]
- **Submission:** `handleSubmit` (`:227`) runs `calculateScores`, writes `szm_score` to **both** session+localStorage, then best-effort Supabase insert (only if `NEXT_PUBLIC_SUPABASE_URL` + anon key present; failures `console.warn`, non-fatal), stores returned id in `szm_assessment_id`, routes to `/results`. [code]
- **Missing answers / defaults:** Engine 1 uses `?? 0` for any unmatched option, `?? []` for setup; so partial/garbage answers degrade to 0 rather than throwing (`scoring.ts:158,167,186,190,194`). [code]

### Refresh / recovery behavior — **finding**
In-progress answers live **only in React state + a ref** (`answersRef`). There is **no localStorage
persistence during the assessment** — a mid-assessment page refresh **loses all progress** and
restarts at step 0 with `answers = {}`. Only on final submit is anything persisted. [code]
The restoration effect (`:112-134`) restores from in-memory `answersRef.current`, which is empty after
a reload.

---

## 4. What is stored after submit

| Target | Content | Engine |
|---|---|---|
| `szm_score` (session + local) | full `ScoreResult` JSON | Engine 1 |
| `szm_assessment_id` (local) | Supabase row id (if insert succeeded) | — |
| Supabase `assessments` row | lead, business_type, state, city, stage, setup_steps, financial, customer_plan, blocker, `overall_score`, `band`, `score_label`, `category_scores`, `report_json`, `answers_json`, `completed_at` | Engine 1 |
| `szm_metrix_history` / `szm_metrix_profile` | Engine 2 snapshot (written later, on `/results` + `/dashboard` mount via `recordAssessmentSnapshot`) | Engine 2 |

---

## 5. Duplicate / overlapping / unused observations

- **Duplicate stage capture:** Q3 `stage` and intake `stage` (`STAGE_OPTIONS`) share the same id set; Engine 2 prefers intake, Engine 1 uses Q3 (`intake.ts:8-16`, `metrixReport.ts:141`). [code]
- **Q1 `business_type` is unused by the displayed score** — trade personalization reads intake `trade`, not Q1. A user can answer HVAC in Q1 but leave intake trade blank and get no trade-aware Engine-2 personalization. [code]
- **Q2 `location` is unused by the displayed score**; region comes from intake. [code]
- **`financial` double-maps** to both `cash_flow` and `financial_runway` in Engine 2 (one answer drives two criteria identically) (`metrixReport.ts:106,135`). [code]
- **Engine 1's full output (band, risks, actions, resources) is computed and stored but never shown** on `/results`/`/dashboard` (Engine 2 replaced the headline). It still powers the legacy paid roadmap in `/report`. [code]
- **`blocker` scoring is inverted-feeling:** higher points = *less* foundational severity (branding=8, licensing=2), which is intentional for Engine 1's "readiness" sum but can read as counterintuitive. [code]

## 6. Important success factors NOT assessed

The 7 questions never directly ask about: actual revenue, profit/margin, close rate, lead response
time, repeat/referral rate, reviews, capacity vs. demand, team/hiring, SOPs/quality, or technology
stack. Those are either (a) inferred crudely by Engine 2 from setup checkboxes + intake, (b)
collected separately in the Growth Engine (`/growth`), or (c) listed as **`not_discovered` gaps** in
`contractorNeeds.ts` (`need-sops`, `need-hiring`, `need-leadership`, `need-tech`). [code]
