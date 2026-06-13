# Metrix Canonical Audit (SZM-0)

**Authoritative SZM-0 decision document.** Checkpoint `948c9cc` (+ this doc). Method:
documentation-only repository inspection. Evidence tags: **[code]** = proven in source, **[doc]** =
documentation-only, **[inferred]** = deduced from call chains, **[unverified]** = cannot be proven
from the repo.

This document consolidates and stands alone over the SZM-0 audit in `docs/SYSTEM/*`
(system-logic-inventory, assessment, metrixscore-calculation, path-selection, roadmap-generation,
owner-working-guide). It closes the evidence gaps those left open (tests, active cloud writers,
checkout, anonymous→account behavior). No application source was modified.

---

## A. Executive finding

1. **Live scoring/profile-producing paths: TWO.** [code]
   - **Engine 1** — `src/lib/scoring.ts:calculateScores` (7-question sum→band). Written to
     `szm_score` and Supabase `assessments`.
   - **Engine 2** — `src/lib/metrixEngine.ts:scoreAssessment` via
     `src/lib/metrixReport.ts:buildStarterScore` (21-criterion, stage-weighted). The number shown on
     `/results`, `/dashboard`, `/report`; snapshotted into `szm_metrix_history` and synced to
     `cloud_sync_score_history`.
2. **Stored vs displayed CAN differ — and do.** [code] The Supabase `assessments` row + `szm_score`
   hold Engine 1's `overall`/`band`; every page displays Engine 2's `overall`/risk level. Same
   answers → two different numbers and two different label vocabularies (bands vs risk levels).
3. **Score, priority and roadmap are NOT one connected system.** [code]
   - Priority/first-actions (`pathActions.ts`) DO derive from Engine 2 risks + intake.
   - But the **dashboard route**, **Foundation Builder**, and **Growth Engine** do **not** read the
     score; routing is driven by Foundation completion + presence of Growth inputs, and the two tools
     run on their own independent stores. `contractorNeeds.ts` (needs mapping) is wired to nothing.
4. **Is it safe to extend before consolidation? No — extend only behind a canonical boundary.** [inferred]
   Adding features now risks compounding the dual-engine divergence, the advisory-path-vs-actual-route
   contradiction, and the unversioned `szm_*` blobs. There are **zero tests** to catch regressions.
   Section I/J define the minimum safe boundary to build behind.

---

## B. Complete call graph — one assessment submission

```
/start  saveIntake()  → szm_intake (session+local)                         intake.ts:163
   │
/assessment  (7 questions + lead step; answers in React state only)        assessment/page.tsx:90
   │  handleNext()/handleBack() — no per-step persistence (refresh loses progress)  :166,201
   ▼ handleSubmit(finalAnswers)                                            assessment/page.tsx:227
   1. question collection      QUESTIONS Q1..Q7                            questions.ts:177
   2. normalization            RawAnswers (single/checkbox/location/lead)  scoring.ts:19
   3. SCORE — Engine 1         calculateScores(finalAnswers)               scoring.ts:155
        → ScoreResult{overall,band,categoryScores(7),report{risks,actions,resources,builderPath}}
   4. signal derivation        risks/actions/resources (Engine-1 only)     scoring.ts:220-294
   5. local persistence        szm_score = JSON(ScoreResult)               assessment/page.tsx:232-233
   6. cloud persistence        supabase.from('assessments').insert{...}    assessment/page.tsx:247-269
        → szm_assessment_id = inserted.id (best-effort, non-fatal)         :275
   ▼ router.push('/results')
/results  useEffect                                                        results/page.tsx:55
   - read szm_score → ScoreResult (else redirect /assessment)             :58-59
   - loadIntake()                                                          :66
   - recordAssessmentSnapshot(parsed, intake)  → Engine-2 snapshot→history results/page.tsx:71 → metrixRetention.ts:117
   - DISPLAY = buildStarterScore(answers,intake) (Engine 2)               results/page.tsx:102
   - actions = generateActions('recommended',starter,intake,'stabilize')  :104 → pathActions.ts:173
   - getAssessmentSyncReadiness()→canSync→syncAssessmentHistoryToAccount() :76-90  (cloud, Account-2D)
   - free next step: Foundation primary / Growth secondary (STATIC)       :268-286
   - bottom CTA → /unlock
/unlock  → POST /api/checkout {scoreData,assessmentId,tierId}             api/checkout/route.ts:43
   → Stripe session, success_url=/report?session_id=…
/report  verify-session(session_id)→paid? ; read szm_score               report/page.tsx:700-708
   - header = buildStarterScore (Engine 2)                                :807
   - paid roadmap = buildPersonalizedRoadmap(Engine-1 categoryScores)     :806-814 (legacy)
   - completion sets szm_foundation_complete / szm_growth_complete        :712-719
/dashboard
   - read szm_score; DISPLAY buildStarterScore (Engine 2)                 dashboard/page.tsx:80,215
   - recordAssessmentSnapshot + recordActionProgress (local history)      :92-97
   - generateActions → currentAction; estimatePotential → momentum        :216,220
   - foundationStats (szm_foundation_builder) + loadGrowthInputs          :178-189
   - PRIORITY/ROADMAP ROUTING: primaryCta from Foundation/Growth state    :246-251
   - 4 cloud-sync effects (assessment/kpi/feedback/growth)                :102-175
reassessment/reload
   - re-take = /start again → new szm_score (overwrite) + new snapshot    dashboard:434 "Recheck"
   - recordAssessmentSnapshot idempotent per result.completedAt           metrixRetention.ts:125
   - prior snapshot → ReassessmentEvent + delta                           :174-186
   - in-assessment refresh = total progress loss (no mid-flow persist)    assessment/page.tsx (no writer)
```

---

## C. Stored-versus-displayed comparison

| Consumer | Value read | Storage source | Calc function | Fallback | Displayed | Can disagree? |
|---|---|---|---|---|---|---|
| Assessment submit | answers | React state | `calculateScores` (E1) | `?? 0`/`?? []` per field | (writes only) | — |
| `assessments` table | E1 `overall_score`,`band`,`category_scores` | client insert | E1 | row absent if Supabase off | (stored) | **vs E2 everywhere** [code] |
| `/results` | `szm_score` (E1) | local/session | **E2** `buildStarterScore` | redirect `/assessment` | E2 overall, risk, strengths, path | **Yes — shows E2, not the E1 it read** [code] |
| `/report` | `szm_score` (E1) | local/session | header **E2**; body **E1** `buildPersonalizedRoadmap` | LOCKED / SCORE NOT FOUND | E2 header + E1 roadmap | **Yes — two engines on one page** [code] |
| `/dashboard` | `szm_score` (E1) | local/session | **E2** `buildStarterScore` + retention | empty state → `/start` | E2 score/risk + local history | **Yes** [code] |
| `szm_metrix_history` | snapshot of E2 | local | `recordAssessmentSnapshot`→E2 | empty state | previous→current delta | matches E2; **differs from E1** [code] |
| `cloud_sync_score_history` | E2 snapshot | Supabase upsert | `syncAssessmentHistoryToAccount` (E2 payload) | `sync_unavailable` | (backup; future hydrate) | matches E2; **cloud also has E1 in `assessments`** [code] |
| Foundation Builder | `szm_foundation_builder` | local | `getFoundationCompletionStats` | default checklist | % complete | independent of score [code] |
| Growth Engine | `szm_growth_engine` | local | `diagnoseGrowth`/`buildGrowthRoadmap` | empty form | constraint + actions | independent of score [code] |
| Export (Foundation CSV/PDF) | `szm_foundation_builder` | local | `foundationItemsToCsv`/`…PrintableHtml` | — | downloaded file | reflects builder only [code] |

> There is **no shareable "result" export of the score itself** — only Foundation Builder
> CSV/PDF. `ShareReferralCard` shares an invite, not a result payload. [code] `results/page.tsx:393`

---

## D. Complete writers and readers

**Assessment writer:** `assessment/page.tsx:handleSubmit` (only place a new assessment is created). [code]

**Score writers (2 engines):**
- E1 `scoring.ts:calculateScores` → `szm_score` + Supabase `assessments`. [code]
- E2 `metrixEngine.ts:scoreAssessment` (via `metrixReport.ts:buildStarterScore`) — recomputed on
  every consumer render; snapshot persisted by `metrixRetention.ts:recordAssessmentSnapshot`. [code]

**Profile writers:** `metrixRetention.ts:recordAssessmentSnapshot` →
`metrixStorage.ts:saveLocalMetrixProfile` (`szm_metrix_profile`) + `saveLocalMetrixHistory`
(`szm_metrix_history`); marker `szm_metrix_last_recorded_at`. [code]

**Recalculation paths:** E2 is recomputed live in `results`, `dashboard`, `report`, and inside
`metrixRetention`, `estimatePotential`, `pathActions` — i.e., **independent recalculation in 4+ call
sites** (no single cached canonical object). [code] — a core SZM-0 risk.

**Local-storage writers:** `intake.saveIntake`, `assessment/page.tsx`, `metrixStorage.save*`,
`growthEngine.saveGrowthInputs`, `FoundationBuilderChecklist`(→`szm_foundation_builder`),
`roadmapProgress`(`szm_path_complete`), `report/page.tsx`(`szm_foundation_complete`,
`szm_growth_complete`), `growthAnalytics`, `customerProof`, `feedback`, `partnerInterestSync`. [code]

**Cloud writers (ACTIVE):** `assessmentHistorySync.ts:syncAssessmentHistoryToAccount` — the **first
and only proven active cloud write**: upserts E2 profile+score snapshots to
`cloud_sync_assessment_history` / `cloud_sync_score_history` (anon client + user JWT, RLS-enforced;
`onConflict: 'user_id,local_id'`). [code] Plus `assessment/page.tsx` insert to `assessments`. [code]
Other helpers (`roadmapKpiSync`, `customerFeedbackSync`, `growthAnalyticsSync`,
`foundationBuilderSync`, `partnerInterestSync`) are imported and called from pages; their wiring depth
beyond Account-2D is **[unverified]** here — `syncContracts.ts` still declares `cloudWriteWired:false`
for all entities, which **contradicts** the live Account-2D writer and is stale doc-in-code. [code]

**Score readers:** `results`, `dashboard`, `report`, `unlock` (`szm_score`); `metrixRetention`,
`metrixProfileProgression`, `scoringInfluenceMap` (read for derivations/maps). [code]

**Profile readers:** `dashboard`, `results` (retention view); `metrixRetention.getRetentionView`. [code]

**Roadmap readers:** `pathActions.generateActions` consumers (`results`, `dashboard`, `report` Choose
Path); `foundationBuilder` consumers; `growthEngine` consumers. [code]

**Progress readers:** `dashboard` (`szm_path_complete`, `szm_foundation_builder`, `szm_growth_engine`);
`report` (`szm_foundation_complete`, `szm_growth_complete`). [code]

**Legacy adapter / fallback:** `metrixReport.ts:buildStarterResponse` is the **adapter** that maps E1
`RawAnswers` + intake → E2 partial 21-criterion response. `safeJsonParse` (`metrixStorage.ts:26`) is
the malformed-data fallback for `szm_metrix_*`; ad-hoc `try/catch JSON.parse` guards the rest. [code]

---

## E. Persistence and schema map

**localStorage keys:** `szm_intake`, `szm_score`, `szm_assessment_id`, `szm_metrix_history`,
`szm_metrix_profile`, `szm_metrix_last_recorded_at`, `szm_path_complete`, `szm_foundation_builder`,
`szm_vendor_tracker`(declared), `szm_launch_readiness`(declared), `szm_foundation_complete`,
`szm_growth_engine`, `szm_growth_complete`, `szm_growth_events`, `szm_customer_feedback`,
`szm_partner_interest`, `szm_feedback`, `szm_install_dismissed`, `szm_proof_dismissed`. [code]

**sessionStorage keys:** `szm_intake`, `szm_score` (both mirrored to localStorage). [code]
`intake.ts:168-169`, `assessment/page.tsx:232-233`, read at `results:58`/`report:707`/`dashboard:80`.

**Supabase tables referenced:**
- `assessments` — inserted by `assessment/page.tsx:248`. **No migration in repo** → **[unverified]**
  columns/RLS.
- `cloud_sync_assessment_history`, `cloud_sync_score_history` — written by `assessmentHistorySync.ts`;
  schema+RLS in `002_cloud_sync_progress_records.sql`. [code]
- 8 further `cloud_sync_*` tables (roadmap_action_progress, kpi_entries, customer_feedback,
  partner_interest, growth_events, foundation_builder_progress, vendor_tool_tracker,
  launch_readiness_progress) — schema+RLS in 002; write-wiring beyond 2D **[unverified]**. [code]
- `metrix_*` structured tables — `001_metrix_account_sync.sql` (owner-only RLS). Used by
  `metrixAccountSync`/`metrixCloudSync` (reconciliation target; not the active history writer). [code]
- `marketing_subscriptions` — `003`; INSERT-only; unrelated to scoring. [code]

**Migrations proving tables:** 001 (metrix_*), 002 (cloud_sync_*), 003 (marketing). **`assessments`
has none.** [code]

**API routes:** `/api/checkout` (Stripe session; reads client `scoreData`/`assessmentId`/`tierId`;
tiers basic 999 / pro 1999 / platform 2900; default `pro`), `/api/verify-session` (server-trusted
paid check), `/api/webhook`, `/api/email-trigger`, `/api/track-click`, `/api/postback/[vendor]`. [code]

**Server actions:** none — all server logic is in `app/api/*` route handlers. [inferred]

**Anonymous persistence:** all `szm_*` local; the `assessments` insert uses the **anon key** and runs
for anonymous users (no auth). [code] `assessment/page.tsx:236-246`

**Account persistence:** owner-only `cloud_sync_*` via session JWT (Account-2D). [code]

**Anonymous-to-account migration:** **no dedicated migration step.** On sign-in, the existing
dashboard/results effects call `syncAssessmentHistoryToAccount`, which **additively upserts** the
device's local snapshots to the account keyed by `user_id,local_id`. There is no "claim prior
anonymous cloud rows" step (anonymous writes carry no `user_id`). Cross-device hydrate +
`reconcileByIdNewestWins` provide a **recommendation only**, never overwriting local. [code]
`assessmentHistorySync.ts:165,260`

**Assessment history:** `szm_metrix_history` (E2 snapshots + reassessment events) → optional
`cloud_sync_score_history`. The E1 `assessments` rows are a separate, append-only server log. [code]

**Progress storage:** Foundation (`szm_foundation_builder`), roadmap actions (`szm_path_complete`),
growth (`szm_growth_engine`), report tabs (`szm_foundation_complete`/`szm_growth_complete`). [code]

**Sync failure behavior:** every sync returns an honest `SyncStatus`; missing migration/table →
`sync_unavailable`; signed-out → `sign_in_to_back_up`; no Supabase → `saved_on_device`; **local data
is never deleted or mutated**, `synced_to_account` only after a confirmed write. [code]
`assessmentHistorySync.ts:146-223`

---

## F. Needs and roadmap connection map

| System | File | Classification | Evidence |
|---|---|---|---|
| `contractorNeeds` | `contractorNeeds.ts` | **Documentation-only / unused** — imported by no page/component | [code] repo-wide search |
| Growth Engine | `growthEngine.ts` | **Live but isolated** — fully works, reads only its own `szm_growth_engine`, never the score | [code] |
| Foundation Builder | `foundationBuilder.ts` | **Live but isolated** — fully works, trade/state-aware, never reads/writes the score | [code] |
| Action generation | `pathActions.ts` | **Live and connected (to E2)** — derives from `score.risks` + intake | [code] |

**Do assessment results currently drive…?**

| Output | Driven by assessment? | Mechanism / Evidence |
|---|---|---|
| Primary **need** | **No** | `contractorNeeds` not wired [code] |
| Primary **priority** (focus category) | **Yes (E2)** | `metrixEngine.ts:315` + challenge/goal tiebreak `metrixReport.ts:153` |
| Dashboard **CTA** | **No** | Foundation completion + Growth-input presence `dashboard/page.tsx:246-251` |
| **Foundation** pathway | **No** | trade from intake; steps independent of score [code] |
| **Growth** pathway | **No** | own input form; independent of score [code] |
| **Generated actions** | **Yes (E2)** | `generateActions` ← `score.risks` `pathActions.ts:173` |
| **Roadmap order** | **Partly (E2)** | First-Actions ordered by focus/risk; Foundation/Growth ordered by their own rules [code] |

**Net:** the assessment drives **priority labels and the first-actions list** (via E2). It does **not**
drive routing, Foundation, Growth, or needs. The visible "system" is three islands sharing a header
number.

---

## G. Historical compatibility risks

| Case | Current behavior [code] | Risk on a future scoring-version change |
|---|---|---|
| Existing `szm_score` records | Parsed as `ScoreResult`; E2 recomputed from `.answers` each load | If E2 mapping or `RawAnswers` shape changes, old records re-score differently with no version tag |
| Incomplete assessments | Cannot exist persisted — `szm_score` only written on full submit; mid-flow refresh discards | New "save draft" feature would need a schema that doesn't exist |
| Anonymous users | Full local flow; anon `assessments` insert | No `user_id`; can't be reclaimed into an account later |
| Account users | Additive upsert of E2 snapshots; newest-wins recommendation | `local_id` collisions across re-takes rely on snapshot ids; reconcile is advisory only |
| Legacy score shapes | No `version` field on `szm_score` or snapshots | **No adapter exists** — a shape change silently degrades via `?? 0`/`safeJsonParse` |
| Historical reports | `/report` always recomputes from current `szm_score` + current code | A pricing/engine change retroactively changes what a past buyer would see |
| Growth Engine records | `szm_growth_engine` free-form `GrowthInputs`; tolerant parse | Adding required fields needs defensive defaults |
| Foundation progress | `szm_foundation_builder` array of items by stable id; `withTradeSteps` appends missing | Renaming a step `id` orphans saved completion |
| Missing/malformed data | `safeJsonParse`→null; ad-hoc try/catch; numeric `?? 0` | Silent zeros can produce misleading low scores (Persona A ≈ 2) |
| Future scoring-version changes | **No versioning anywhere** | Highest compatibility risk — see I |

---

## H. Existing tests and required characterization fixtures

**Existing tests: NONE.** No `*.test.*`/`*.spec.*` files, no `__tests__`/`tests` dir, no
jest/vitest/playwright config or dependency; `package.json` scripts are `dev/build/start/lint/
typecheck/check` only (`check` = typecheck+lint+build). [code]

**Required pre-refactor characterization fixtures (author BEFORE SZM-1):**

| Fixture | Purpose | Anchor |
|---|---|---|
| Identical-input determinism | same `RawAnswers`+intake → identical E2 output | `scoreAssessment`, `buildStarterScore` |
| Stored-vs-displayed consistency | document/lock current E1↔E2 divergence so consolidation is intentional | `calculateScores` vs `buildStarterScore` |
| Legacy profile loading | old `szm_score`/`szm_metrix_history` blobs still load | `safeJsonParse`, results/dashboard load |
| Assessment persistence | submit writes `szm_score` + (mock) `assessments`; mid-flow has no draft | `handleSubmit` |
| Report consistency | header(E2) vs body(E1) on `/report` for fixed input | `report/page.tsx` |
| Dashboard consistency | CTA selection across Foundation/Growth states | `dashboard:246-251` |
| Conflicting score engines | golden values for the 3 personas (E1 vs E2) | both engines |
| Incomplete data | partial answers → defined, non-throwing output | both engines |
| Malformed data | corrupt `szm_*` → safe fallback, no crash | `safeJsonParse`, page guards |
| Anonymous→account migration | sign-in upserts local snapshots; local untouched; reconcile advisory | `syncAssessmentHistoryToAccount`, `reconcile…` |
| Foundation progress | complete/block/export round-trips | `foundationBuilder` helpers |
| Growth Engine isolation | constraints unaffected by score; capacity-first | `diagnoseGrowth` |

A test runner (vitest recommended for Next/TS) must be added as part of SZM-1 setup — but **adding it
is itself a dependency/config change excluded by this doc's guardrails**, so it belongs to SZM-1, not
SZM-0.

---

## I. Minimum canonical profile boundary (recommended)

Introduce ONE canonical pipeline, kept **modular** (separate pure modules, not a monolith):

```
raw answers (RawAnswers + intake)
  → normalize()            // pure: validate/coerce, one shape
  → deriveSignals()        // pure: the 21-criterion (or successor) signal set
  → readinessIndicators()  // pure: per-category readiness
  → criticalGates()        // pure: hard blockers (e.g., unlicensed trade) — boolean gates
  → rankConstraints()      // pure: ordered priorities (merges assessment + optional growth signals)
  → metrixPriority()       // pure: the single "focus" + rationale
  → roadmapSeed()          // pure: ordered action/route seed (NOT full content)
  → MetrixProfileSnapshot v=N   // the ONE canonical stored object
  → persist()              // one writer, local-first + optional cloud
  → all consumers READ the snapshot (no recompute)
```

- **Canonical writer:** a single `buildMetrixProfile(answers, intake)` + `persistMetrixProfile()` —
  the only functions allowed to compute or store a profile. [inferred]
- **Canonical stored object:** `MetrixProfileSnapshot { version, generatedAt, inputsHash, overall,
  categories, riskLevel, priority{focus,rationale}, gates[], constraints[], roadmapSeed[], stage,
  completion }`. Supersedes today's split between `szm_score`(E1) and `szm_metrix_history`(E2). [inferred]
- **Module boundaries:** `normalize` / `signals` / `readiness` / `gates` / `rank` / `priority` /
  `roadmapSeed` / `persist` each in its own file; the orchestrator composes them. Prohibit any other
  module from calling `scoreAssessment`/`buildStarterScore` directly. [inferred]
- **Version fields:** `version` (integer) + `inputsHash` on every snapshot. [inferred]
- **Compatibility adapter:** `adaptLegacyProfile(raw)` upgrades pre-version `szm_score`/snapshots into
  `MetrixProfileSnapshot` (filling `version`, recomputing once). [inferred]
- **Permitted derived outputs (read-only off the snapshot):** display score/risk, priority text,
  first-actions list, dashboard CTA, report header. [inferred]
- **Prohibited:** any consumer independently recomputing a score (today `results`/`dashboard`/`report`/
  `retention` each recompute E2 — that must collapse to one). [code → target]

---

## J. Minimum pre-launch implementation (SZM-1 scope, limited)

1. Canonical profile **types** (`MetrixProfileSnapshot` + module interfaces).
2. **One authoritative evaluation path** (`buildMetrixProfile`) — internally the existing E2 logic,
   refactored into the modules above; E1's distinct number is retired from display/canonical storage.
3. **One authoritative persistence path** (`persistMetrixProfile`) — local-first, reusing the existing
   Account-2D cloud writer for the snapshot.
4. **Historical compatibility adapter** (`adaptLegacyProfile`) for existing `szm_score`/history.
5. **Deterministic characterization tests** (Section H) + a test runner.
6. **Convert existing consumers** (`results`, `report`, `dashboard`) to READ the snapshot instead of
   recomputing.
7. **Critical-gate-ready** structure (gates[] present, even if initially empty).
8. **Explainable-priority-ready** output (`priority.rationale` already exists in E2 — preserve it).

---

## K. Explicit post-launch deferrals

Predictive success/failure models; automatic learning; automated scoring-weight changes; industry
benchmarks; complete outcome intelligence; full evidence registry; advanced lifecycle intelligence;
any integration not required to canonicalize (e.g., wiring the remaining `cloud_sync_*` writers,
activating `contractorNeeds` in the UI, action→re-scoring feedback loop). [scope]

---

## L. Exact SZM-1 file scope

**Created (new):**
- `src/lib/metrix/profileTypes.ts` (canonical `MetrixProfileSnapshot` + module interfaces)
- `src/lib/metrix/normalize.ts`, `signals.ts`, `readiness.ts`, `gates.ts`, `rank.ts`, `priority.ts`,
  `roadmapSeed.ts`, `persist.ts`, `buildMetrixProfile.ts` (orchestrator)
- `src/lib/metrix/legacyAdapter.ts`
- `src/lib/metrix/__tests__/*` characterization fixtures + a test config (vitest)

**Modified (read-from-canonical):**
- `src/app/results/page.tsx`, `src/app/report/page.tsx`, `src/app/dashboard/page.tsx`
- `src/lib/metrixRetention.ts` (snapshot from canonical object, not recompute)

**Temporarily adapted (kept, then thinned):**
- `src/lib/metrixReport.ts` (`buildStarterScore` becomes a thin re-export/shim during migration)
- `src/lib/metrixEngine.ts` (logic absorbed into `signals`/`readiness`; kept as internal impl)

**Deprecated later (post-canonical, not in SZM-1):**
- `src/lib/scoring.ts` Engine-1 display/storage role (keep only if `assessments` log still needs it);
  `src/lib/contractorNeeds.ts` either wired or removed.

**Deliberately untouched in SZM-1:**
- `questions.ts` (question content/ids), all `supabase/migrations/*`, `api/checkout`,
  `api/verify-session`, `api/webhook`, Stripe/payment gating, `foundationBuilder.ts`, `growthEngine.ts`
  (isolated systems — connect later), RLS, `marketing_subscriptions`, auth/email.

---

## M. Open questions (cannot be proven from the repository)

1. **`assessments` table** schema, columns, and RLS — no migration in repo. [unverified]
2. Whether migrations 001/002/003 are **applied in production**, and whether `cloud_sync_*` writes
   actually succeed live. [unverified]
3. Whether the non-2D sync helpers (`roadmapKpiSync`, `customerFeedbackSync`, `growthAnalyticsSync`,
   `foundationBuilderSync`, `partnerInterestSync`) perform **real** cloud writes or remain readiness-
   only — `syncContracts.ts` says unwired, but 2D proves the pattern is live; per-helper depth not
   traced here. [unverified]
4. **Pricing source of truth:** `/unlock`+`/results` advertise **$9.99**, but `/api/checkout` defaults
   to `tierId='pro'` = **$19.99**; which tier `/unlock` actually sends is **[unverified]** from this
   pass. [code → needs unlock trace]
5. Production env presence of `STRIPE_SECRET_KEY`, Supabase keys, `RESEND_API_KEY`, `DEV_UNLOCK`. [unverified]
6. Whether any external/legacy `szm_score` blobs already exist in the wild with a different shape
   (affects the adapter's required cases). [unverified]
7. The intended **canonical engine** decision (retire E1's number, or reconcile) — a product call, not
   provable from code. [open]

---

### Validation
`git status --short` + `git diff --check` run; only this documentation file added; no source touched.
