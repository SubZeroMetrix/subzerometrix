# SZM Wave 1 — Restart Handoff

**Base:** `main` @ `03d9710` (Merge PR #5, SZM-2E). Synced with `origin/main`, working tree clean.

## Completed SZM-2E functionality

- **Device-local priority-progress persistence** — versioned `PersistedPriorityProgress`
  (`PROGRESS_SCHEMA_VERSION=1` + canonical `RULESET_VERSION`) stored in `szm_priority_progress`
  (SSR-safe), one active record + bounded history archive, resume-or-create on load.
- **Path selection & step completion** — choose a completion path; complete/uncomplete the
  ordered action steps (interactive checklist).
- **Blocking-step enforcement** — a later step cannot be completed until the earlier blocking
  step is done (`canCompleteStep`); blocked steps no-op and show a hint.
- **Progress % + reassessment eligibility** — completion % from required steps only; status
  `not_started → in_progress → ready_for_review → completed`; `reassessmentEligible` exposed
  with a "Ready to reassess" banner. **No automatic re-scoring is triggered.**
- **Priority-change archival** — when the canonical priority changes, the old record is
  archived and a fresh active record starts; old completed steps never count for a new
  priority; stale step ids are pruned safely.
- **Truthful cloud-sync readiness** — adapter reports `saved_on_device` / `sign_in_to_back_up`
  / `sync_unavailable`, never a false `synced_to_account`; `PRIORITY_PROGRESS_CLOUD_WIRED=false`.
- **Reconciler ready (pure, tested)** — `reconcilePriorityProgress` unions completed steps,
  keeps the newest valid path selection, never overwrites newer/more-complete data; ready for
  when a real cloud table exists.
- **Interactive UI** on `/results` via `MetrixPriorityExperience` (read-only over the canonical
  snapshot + the progress lib).

## Current canonical architecture decisions

- **One canonical evaluator:** `evaluateMetrixProfile` is the only authoritative evaluation
  entry; pages reach it via `getCanonicalProfile`. No page/component recomputes scoring,
  gates, priority ranking, or completion paths.
- **Engine 1 retired** from all live evaluation/write/decision paths; retained only for
  characterization tests + historical shape. `buildStarterScore`/`scoreAssessment` remain the
  internal scoring kernel called only by the evaluator.
- **Versioned canonical snapshot** carries: readiness/score, critical gates, one active Metrix
  Priority (+ ranked secondaries), blocked recommendations, next-best questions, completion
  paths (one recommended) + ordered action steps, next-up queue, and initial progress.
  Current versions: `PROFILE_SCHEMA_VERSION=3`, `RULESET_VERSION=3`, `SCORING_VERSION=1`.
- **Read-model only for consumers** — UI reads via `readModel`/`buildPriorityView`; legacy
  `szm_score` and Supabase rows are produced by canonical→legacy projections (no Engine 1).
- **Truthful sync posture** — only proven `cloud_sync_*` tables (migration 002) are written
  (Account-2D history). No tables/columns are invented.

## Known limitation

**Priority progress is device-local only because there is no cloud table.** Migration 002
defines 10 `cloud_sync_*` tables but **none for priority progress**. Per the no-invented-schema
rule, SZM-2E did not add or overload a table; signed-in users see `sync_unavailable` (local
stays authoritative). Activating cloud sync requires a future `cloud_sync_priority_progress`
migration + a write helper; the typed adapter and reconciler are already in place.

## Remaining Wave 1 work

- **SZM-2F — Reassessment loop:** when `reassessmentEligible`, let the user reassess so
  completed work updates the canonical score/priority/gates (no silent auto-rescore).
- **Priority-progress cloud sync:** add the `cloud_sync_priority_progress` migration + write
  helper, then wire the existing reconciler and flip the adapter to a real `synced_to_account`.
- **Tier-2 progressive questions:** capture capacity/quality/owner-workload so those gates can
  become first-class (currently `possible`/`unknown`).
- **Ten-trade / six-state decision & licensing intelligence:** trade/state-specific completion
  paths and official-resource routing (currently general; `tradeApplicability`/
  `stateApplicability` are `[]`).
- **Verified resource registry:** real DIY/tool/specialist/authority options
  (`externalResourceIds` currently empty — no providers/affiliates).
- **Dashboard reuse / per-path step tracking / richer evidence capture** (deferred from SZM-2B/2E).

## Exact restart task

**BEGIN SZM-2F — REASSESSMENT LOOP.** Base `main` @ `03d9710` (clean, synced). Create branch
`feature/metrix-reassessment-loop`. When a priority's progress is `reassessmentEligible`, offer
an explicit user-triggered reassessment that re-runs `evaluateMetrixProfile` on updated answers
and transitions to the next priority — preserving history, never auto-rescoring, never changing
scoring/gate/priority-ranking/path policy, and keeping all 93 tests green.

## Current test/build status

At `03d9710` (verified pre-merge on the SZM-2E branch, no code changes since merge):
**93/93 tests passing · TypeScript ✅ · lint ✅ (no warnings/errors) · production build ✅ (46 pages).**
