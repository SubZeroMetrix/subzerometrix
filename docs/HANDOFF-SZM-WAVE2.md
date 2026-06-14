# SZM Wave 2 — Profile Intelligence Handoff

**Base:** `main` @ `899e91a` (Merge PR #8, Wave 2). Synced with `origin/main`, working tree clean.

> Authored after the fact: the Wave 2 code shipped in PR #8 but its handoff doc was never
> written. This documents the merged Wave 2 layer so Wave 3 (ten-trade intelligence) can build
> on it. It reflects the code as merged — not a plan.

## What Wave 2 added

Wave 2 is an **additive, deterministic intelligence layer** derived *on top of* the one
canonical snapshot (`MetrixProfileSnapshot` from `evaluateMetrixProfile`). It introduces **no
second score, gate, priority, path, profile, or reassessment engine** — every module is a pure
projection that reads the snapshot and never recomputes scoring/gate/priority/path policy.

### New canonical modules (`src/lib/metrix/`)

- **`lifecycle.ts`** — one canonical business lifecycle stage (`LIFECYCLE_VERSION = 1`):
  `Explore · Side Hustle · Prepare · Launch · Stabilize · Grow · Scale · Recover`. Pure
  projection of `businessContext.stage` + already-derived signals (setup progress, revenue/
  customer signal, readiness, gates). `assessLifecycle`, `deriveLifecycleStage`,
  `deriveStageConfidence`, `detectStageTransition`. Degrades safely on malformed/legacy input
  (defaults to `Explore`).
- **`intelligenceTypes.ts`** — pure types only (`INTELLIGENCE_VERSION = 1`):
  `ProfileIntelligence`, `ProfileCompleteness`, `EvidenceConfidence`, `KnownFact`,
  `ImportantUnknown`, `ProfileRisk/Need/Gap`, `ProfileVersions`, `ProfileHistoryPoint`,
  `ReassessmentSignal`, `OutcomeDefinition`, `PriorityExplanationDetail`,
  `ExplainGateInvolvement`. Names deliberately avoid clashing with canonical types.
- **`profileCompleteness.ts`** — `deriveCompleteness` (honest answered/total ratio reusing
  `profileQuality.coverage`, **not** a fabricated confidence %), `deriveEvidenceConfidence`
  (categorical; never `high` while evidence is inferred-only), `deriveKnownFacts`,
  `deriveImportantUnknowns`, `deriveRisks`, `deriveNeeds`, `deriveGaps`. All pure projections
  of the snapshot's intake, gates, constraints, and next-best-questions.
- **`progressiveQuestions.ts`** — `selectProgressiveQuestions` / `hasProgressiveQuestions`.
  **Filters and bounds** the canonical `snapshot.nextBestQuestions` (already ranked by the
  engine); it does not generate a new question engine. Dedupes by `questionKey`, skips
  answered (present in raw answers) and dismissed candidates, preserves question IDs and raw
  answers, bounds to `limit` (default 3). Returns few or none.
- **`priorityExplanation.ts`** — `explainPriorityDetail` builds the rich, explainable
  `PriorityExplanationDetail` (title, required outcome, why selected, inputs/rules, gate
  involvement, missing info, evidence status/confidence, completeness, what-could-change,
  what-stayed-unchanged). Reads the canonical priority verbatim; the "unchanged" lines come
  only from a supplied reassessment diff.
- **`profileIntelligence.ts`** — the single composer `deriveProfileIntelligence(snapshot, opts)`
  returning the composite `ProfileIntelligence`. Also `deriveReassessmentTriggers`,
  `deriveOutcomeDefinitions`, `deriveProfileHistory`. Deterministic and defensive (never throws
  on `{}` / legacy input).

### Display-only UI (canonical adapter consumers; never evaluate/score)

- **`src/components/ProfileIntelligenceCard.tsx`** — full intelligence card on `/results`
  (lifecycle, completeness/confidence, known facts, important unknowns, "why this priority").
  Rendered at `src/app/results/page.tsx:274`. Renders nothing when the snapshot is null/legacy
  or has no `metrixPriority`.
- **`src/components/DashboardIntelligenceSummary.tsx`** — quiet, **subordinate** lifecycle/
  profile strip on `/dashboard` (stage, completeness %, evidence confidence, single
  worth-confirming item, quiet link back to `/results`). Rendered at
  `src/app/dashboard/page.tsx:347`. Intentionally low-emphasis so it never competes with the
  dashboard's dominant next-action CTA.

### Public API

All Wave 2 exports are surfaced from `src/lib/metrix/index.ts` under the
`// ── Wave 2: Profile Intelligence ──` section. Live consumers import from `@/lib/metrix`.

## Architecture invariants Wave 2 preserved (and Wave 3 must too)

- **One canonical evaluator** — `evaluateMetrixProfile` (`snapshot.ts`) is the only authoritative
  evaluation; the single scoring kernel (`buildStarterScore`) is called exactly once.
- **Intelligence reads, never recomputes** — completeness mirrors `profileQuality.coverage`;
  the priority explanation equals `snapshot.metrixPriority` verbatim; questions filter
  `snapshot.nextBestQuestions`. No competing numeric score is introduced.
- **Honest confidence** — categorical (`high|medium|low`), never `high` on inferred-only data;
  completeness is a real answered/total ratio, not a fabricated percentage.
- **Deterministic + defensive** — identical snapshot ⇒ identical intelligence; every adapter
  tolerates malformed/legacy snapshots without throwing.
- **Versioned** — `LIFECYCLE_VERSION = 1`, `INTELLIGENCE_VERSION = 1`; profile envelope stays
  `PROFILE_SCHEMA_VERSION = 3`, `SCORING_VERSION = 1`, `RULESET_VERSION = 3` (unchanged by Wave 2).
- **No storage/analytics/consent/sync changes** — Wave 2 added no tables, keys, or events.

## Canonical trade representation (relevant to Wave 3)

Trade is carried on the snapshot as `businessContext.trade` and `normalizedAnswers.trade`
(`string | null`, from intake `trade` ⇒ else raw `business_type`). The canonical trade IDs are
already fixed in `src/lib/intake.ts` `TRADE_OPTIONS` and `src/lib/tradeData.ts`:
`hvac · electrical · plumbing · roofing · solar · construction · handyman · landscaping ·
cleaning · painting` (+ `other`). **Wave 3 must reuse these IDs** — note "General Contracting /
Construction" maps to the existing `construction` ID (do not invent `general_contracting`).
`tradeData.ts` already holds rich, field-tested per-trade reference content (KPIs, benchmarks,
phases, tools, unique risks) usable as source material.

## Tests

`src/lib/metrix/__tests__/profile-intelligence.test.ts` — deterministic coverage for all
lifecycle stages, transitions, completeness, evidence confidence, known/unknown,
next-best-question ranking/dedupe/answered-suppression, priority explanation, unchanged vs.
meaningful reassessment, malformed/legacy safety, version/history preservation, identical-input
determinism, and "intelligence reads the canonical priority/score, never recomputes."

Run with `npm run test` (compiles `tsconfig.test.json` → `dist/metrix-tests`, runs `node --test`).

## Known limitations (carried into Wave 3 and beyond)

- **No trade-specific intelligence yet** — Wave 2 is trade-agnostic. `tradeApplicability` /
  `stateApplicability` on completion paths remain `[]`. **This is Wave 3's job.**
- **No state/licensing/jurisdiction logic** — deferred to Wave 4 (60 trade-state pathways).
- **`externalResourceIds` empty** — no real providers/affiliates wired into the canonical layer.
- **Priority-progress cloud sync still device-local** (carried from Wave 1; reconciler ready,
  no `cloud_sync_priority_progress` table).

## Next: Wave 3 — Ten-Trade Contractor Intelligence

Build the canonical contractor-intelligence layer for the 10 launch trades (HVAC, Electrical,
Plumbing, Handyman, Landscaping, Painting, Roofing, Solar, Construction/General Contracting,
Cleaning) as **one additive, deterministic intelligence layer** on top of the existing snapshot +
Wave 2 intelligence — a trade registry, shared contractor-business dimensions, explicit
per-trade modifiers, a pure `deriveTradeIntelligence(...)` adapter, trade-aware progressive
questions (reusing the Wave 2 framework), and display-only results/dashboard integration. No new
score/gate/priority/path/reassessment engine; no Wave 4 state/licensing logic.

## Status at handoff

At `899e91a` (Wave 2 merged): **134/134 Metrix tests passing** · TypeScript ✅. Working tree
clean, `main` == `origin/main`.
</content>
</invoke>
