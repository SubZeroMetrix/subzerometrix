# SZM-1 — Canonical Metrix Profile Engine (implementation note)

**Branch:** `feature/metrix-launch-rebuild` · Builds on `docs/ARCHITECTURE/metrix-canonical-audit.md`.
This records what SZM-1 actually changed. No branding/pricing/checkout/lifecycle changes.

## Canonical writer
- **`evaluateMetrixProfile(rawAnswers, intake, opts)`** in `src/lib/metrix/snapshot.ts` — the one
  authoritative evaluation. Calls the single scoring kernel (`metrixReport.buildStarterScore`) **exactly
  once** and composes the pure modules around it.
- **`getCanonicalProfile(...)` + `persistMetrixProfile(...)`** in `src/lib/metrix/persist.ts` — the one
  persistence path (`localStorage` key `szm_metrix_canonical`); evaluate-once / read-many.
- Persisted at the source in `src/app/assessment/page.tsx:handleSubmit` (additive; raw answers + the
  Engine-1 `szm_score` log are still written unchanged).

## Canonical snapshot type
`MetrixProfileSnapshot` in `src/lib/metrix/profileTypes.ts` — versioned
(`profileSchemaVersion`/`scoringVersion`/`rulesetVersion` = 1), with ids, source, businessContext,
normalizedAnswers (raw answers preserved), signals, readiness, criticalFlagCandidates,
constraintCandidates, prioritySeed, profileQuality (coverage / evidence quality / freshness — **no
confidence %**), roadmapSeed, optional legacySource.

## Module boundaries (each a small pure file)
`normalize.ts` · `signals.ts` · `readiness.ts` · `criticalFlags.ts` · `constraints.ts` · `priority.ts`
· `roadmapSeed.ts` · `quality.ts` · `snapshot.ts` (orchestrator) · `persist.ts` · `legacyAdapter.ts` ·
`readModel.ts` (`toMetrixScore`) · `reconcile.ts` · `index.ts` (public API).

## Canonical readers converted (no longer recompute a competing score)
- `src/app/results/page.tsx`, `src/app/report/page.tsx`, `src/app/dashboard/page.tsx` — now
  `toMetrixScore(getCanonicalProfile(answers, intake))`.
- `src/lib/metrixRetention.ts` — assessment/score **history + cloud-sync source** now reads the
  canonical profile.
- `toMetrixScore` rehydrates the exact legacy `MetrixScore` shape, so downstream components
  (OutcomeBriefing, RoadmapProgressCard, `pathActions.generateActions`) are unchanged.
- Share/export: `ShareReferralCard` shares an invite (no score) and Foundation CSV/PDF is
  independent — no score recomputation there.

## Legacy compatibility adapters retained
- `adaptLegacyScoreResult` (`legacyAdapter.ts`) — detects a stored Engine-1 `ScoreResult`, preserves
  raw answers, re-evaluates through the canonical pipeline, marks `source='legacy_szm_score'` +
  `legacySource{engine:'engine1', originalOverall, originalBand}`. Does **not** claim the new ruleset
  produced the old number.
- `adaptLegacyHistorySnapshot` — read-model-only mapping of Engine-2 history snapshots (no raw
  answers → no re-eval), marked `legacy_history`.
- `isLegacyScoreResult` — structural detector (rejects malformed input).

## Retained legacy functions (not authoritative live writers)
- **`scoring.ts:calculateScores` (Engine 1):** retained ONLY as the Supabase `assessments` log writer
  and as the input to the legacy paid roadmap (`buildPersonalizedRoadmap`) in `/report`. No page
  displays its number. **Removal condition:** when the `assessments` log + paid roadmap are migrated to
  canonical fields.
- **`metrixReport.ts:buildStarterScore` / `metrixEngine.ts:scoreAssessment`:** retained as the internal
  scoring kernel called *only* by the canonical evaluator (no page calls them directly anymore).
  **Removal condition:** when scoring is reimplemented natively inside the metrix modules.
- **`metrixReport.ts:estimatePotential`:** retained for the dashboard "+X possible gain" projection;
  uses the same kernel (its `current` equals the canonical overall — not a competing display score).
- **Not live consumers (left untouched, deferred):** `scoringInfluenceMap.ts`,
  `metrixProfileProgression.ts` (neither is imported by any page/component).

## Test framework introduced
- **Node’s built-in runner** (`node:test` + `node:assert/strict`) — **zero new dependencies**.
- Pure TS engine/adapter/contract tests compiled with `tsc -p tsconfig.test.json` to gitignored
  `dist/metrix-tests`, run via `node --test`.
- Script: `npm run test`. Tests: `src/lib/metrix/__tests__/canonical.test.ts` — **14 passing**
  (legacy result, Engine-1↔canonical disagreement, determinism, version fields, legacy szm_score
  loading, missing data, malformed data, shared-read-model consistency, persist/reload, cloud
  contract, and 4 reconciliation cases incl. 11/12/13).

## Cloud-contract correction
`syncContracts.ts` now reports `cloudWriteWired: true` for `assessment_history` and
`metrix_score_history` — the two entities `assessmentHistorySync.ts` (Account-2D) actively writes to
`cloud_sync_assessment_history` / `cloud_sync_score_history`. All other entities stay `false`.
`getSyncReadinessSummary().anyCloudSyncLive` is now `true` (count 2). A focused test asserts this.
No sync behavior changed. **Remaining uncertainty (documented):** whether migrations 001/002/003 are
applied in production, the live success of those writes, and the wiring depth of the other
`cloud_sync_*` helpers — all `[unverified]` from the repo.

## Anonymous → account reconciliation (bounded)
`reconcile.ts:reconcileCanonicalProfiles(local, cloud[])` — additive by default, deterministic dedup by
`assessmentId`/`profileId`, **never overwrites a newer or more-complete record**, returns an explicit
`{ resolved, action, reason, additive, conflicts }`. **Bounded limitation (documented):** there is no
canonical cloud table in the proven schema (and migrations are out of SZM-1 scope), so canonical cloud
persistence is **deferred**; the live sign-in path does not touch `szm_metrix_canonical`, so local
stays authoritative by construction. The reconciler is the tested forward primitive for when a
canonical cloud table exists.

## Explicitly deferred (post-SZM-1)
Final critical-gate **policy** (only candidate structure exists now); wiring `contractorNeeds` into the
UI; action→re-scoring feedback loop; canonical cloud table + live anonymous→account cloud merge;
retiring Engine-1 / native scoring reimplementation; predictive scoring, ML, benchmarks, evidence
registry, advanced outcome tracking; Start It / Build It / Grow It lifecycle behavior.
