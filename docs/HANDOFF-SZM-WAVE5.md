# SubZeroMetrix Wave 5 Handoff

## Status

* Wave 5 complete on branch `feature/metrix-wave5-foundation-growth-resources`.
* Branch pushed. **PR NOT opened** (await explicit merge instruction).
* Built on `main` at `daaa4eb` (Wave 4 merged). Working tree clean after commit.

## Objective

Wave 5 adds **one additive, deterministic integration layer** that unifies the existing
Foundation Builder, Customer Growth Engine, and the three resource sources (vendor catalog,
affiliate registry, educational guides) onto the canonical Metrix pipeline — plus a
profile-aware recommendation adapter, privacy-safe attribution, optional helpfulness/outcome
feedback, and partner-revenue readiness. It creates **no** competing score, priority, gate,
path, profile, progress, reassessment, trade-intelligence, licensing-intelligence, or
recommendation-ranking engine. Every existing engine is **wrapped**, not replaced.

## Key Architectural Decision

The codebase already contained mature, working systems for nearly every Wave 5 subsystem
(`foundationBuilder.ts`, `growthEngine.ts`/`growthPhases.ts`, `vendorCategories.ts`,
`affiliates.ts`, `publicResources.ts`, `tracking.ts`, `analytics.ts`, `feedback.ts`,
`partnerDistribution.ts`). Per the hard guardrails (no duplicate engines), Wave 5 is a
**canonical adapter layer** in `src/lib/metrix/` (matching the Wave 2–4 pattern) that projects
and consolidates these, plus the genuinely-new recommendation/attribution/feedback adapters.

## Completed Capabilities

### Canonical action / evidence / outcome model (`actionTypes.ts`, `actionModel.ts`)
* ONE `CanonicalAction` shape (id, category, source priority/path, trade/state/lifecycle
  applicability, prerequisites, blocked, completion status, evidence, notes, timestamps,
  owner, progress linkage, outcome type/value, verification status, provenance,
  resource associations).
* Pure read-only projections — `projectPriorityActions`, `projectFoundationActions`,
  `projectGrowthActions`, `collectCanonicalActions` (deduped, priority-first).
* Original step/item/action ids preserved verbatim in `sourceId`. No storage replaced.

### Foundation Builder + Growth Engine integration
* Foundation checklist items + Growth roadmap actions project into the canonical action model
  and feed the recommendation adapter's `currentActions`. Growth actions are always
  subordinate and never falsely completed. No duplicate checklist/progress engine.

### Canonical resource/vendor registry (`resourceTypes.ts`, `resourceRegistry.ts`)
* ONE `CanonicalResource[]` consolidating the vendor catalog, affiliate partners, and
  educational guides. A tool that is both a catalog vendor and an affiliate partner is
  **merged into a single record** (vendor entry enriched with factual affiliate status) — never
  presented twice. All vendor/partner/slug ids preserved. Commercial fields stored separately.

### Recommendation adapter (`resourceRecommendations.ts`)
* `deriveResourceRecommendations(...)` — deterministic, defensive, bounded, deduped.
* Relevance uses ONLY fit signals; relationship/affiliate/sponsorship status is **never** a
  ranking input. Deterministic order: relevance desc, then `resourceId` asc.
* Trade/state explicit-mismatch exclusion; lifecycle/priority/freshness boosts; helpfulness
  signal honored. Dismissed + completed + negatively-rated resources suppressed. Safe fallback.
* Output carries **no** competing score/priority field — it links into the canonical pipeline.

### Attribution + feedback (`resourceAttribution.ts`, `resourceFeedback.ts`)
* Consent-aware, allow-listed, non-PII attribution funnel (impression → open → outbound → feedback)
  routed through the existing `trackEvent` sink. Existing `/api/track-click` + `referral_clicks`
  remain the source of truth for outbound affiliate clicks — not duplicated.
* Optional device-local helpfulness/outcome feedback (`szm_resource_feedback`). Never affects
  MetrixScore. No testimonials/reviews/review-pressure. Deletion coverage via `clearResourceFeedback`.

### UI (`ResourceRecommendations.tsx`)
* Display-only, subordinate card wired into `dashboard` and `results` (where the canonical
  snapshot is already loaded and Wave 2–4 cards live). Shows why-recommended, applicability,
  freshness, disclosure (when required), optional helpful/dismiss. No homepage redesign.

## Files Added

* `src/lib/metrix/actionTypes.ts`
* `src/lib/metrix/actionModel.ts`
* `src/lib/metrix/resourceTypes.ts`
* `src/lib/metrix/resourceRegistry.ts`
* `src/lib/metrix/resourceRecommendations.ts`
* `src/lib/metrix/resourceAttribution.ts`
* `src/lib/metrix/resourceFeedback.ts`
* `src/components/ResourceRecommendations.tsx`
* `src/lib/metrix/__tests__/wave5-foundation-growth-resources.test.ts`
* `docs/HANDOFF-SZM-WAVE5.md`

## Files Updated (additive only)

* `src/lib/metrix/index.ts` — surfaced the Wave 5 public API
* `src/lib/analytics.ts` — added 4 Wave 5 funnel event names (existing names preserved)
* `src/app/dashboard/page.tsx` — `<ResourceRecommendations placement="dashboard">`
* `src/app/results/page.tsx` — `<ResourceRecommendations placement="results">`

## Validation

* Tests: **180/180 pass** (157 prior + 23 Wave 5)
* TypeScript (`tsc --noEmit`): clean
* Lint (`next lint`): no warnings/errors
* Production build: succeeds
* Commercial-neutrality, privacy-safe-analytics, dedup, canonical-id-preservation, and
  duplicate-engine reviews: clean. Scoped diff: 4 additive edits + 10 new files.

## Commercial-neutrality + canonical-preservation confirmation

* No commercial relationship alters MetrixScore, Metrix Priority, licensing applicability,
  regulatory guidance, pathway ordering, or recommendation-quality ranking (tested).
* Canonical scoring, priority, gates, paths, profile, progress, reassessment, trade
  intelligence, licensing intelligence, auth, cloud sync, Stripe, pricing, and payments were
  **not** replaced or modified.

## Known Limitations / Future Work

* Recommendation placement is scoped to `dashboard` + `results` (where the snapshot is loaded).
  The registry already supports `foundation_builder`/`growth_engine`/`roadmap` placements; wiring
  those surfaces requires client-side snapshot loading on those pages (deferred).
* Resource feedback is device-local; an account-sync adapter (mirroring `foundationBuilderSync`)
  is not yet wired (storage shape is sync-ready).
* No new cloud tables introduced. Attribution events are emitted only when `trackingConsent` is
  explicitly granted by the host surface (default off).
