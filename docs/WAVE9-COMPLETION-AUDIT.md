# SubZeroMetrix — Wave 9 Completion Audit

> Wave 9 = complete the remaining **automated, implementation-level, launch-critical** systems and
> LOCK them with regression tests before Wave 10A (manual/hosted review) and Wave 10B (final launch
> audit). Not legal advice. No legally-held system is activated. Work reserved for real-person
> usability, qualitative contractor review, manual source-to-claim review, cross-device human
> testing, and final legal/launch go/no-go remains a Wave 10A/10B blocker.

## 1. Wave 9 objective

Finish and regression-lock the canonical Metrix data/profile integrity, the ten trade pathways, the
six state routes, cloud-sync readiness (truthful, no fake sync), the Guided Foundation Builder, the
customer-growth foundation, the resource system (88/20, neutral, consent-aware), growth/discovery
& SEO foundations, commercial preservation (fail-closed), accessibility/performance/quality, and
runtime defaults — without absorbing Wave 10A/10B manual work.

## 2. Starting / ending commits

- Readiness branch merge into main (Phase 0): `679a93a` (PR #16).
- Wave 9 branch: `feature/metrix-wave9-launch-system-completion` from `679a93a`.
- Ending commit: _(filled at CP6)_.

## 3. Internal checkpoint commits

- CP1 — dependency map & acceptance criteria _(this commit)_
- CP2 — canonical trade/profile integrity (single source + regression) _(filled at CP6)_
- CP3 — execution / progress / foundation + cloud-sync truthfulness _(…)_
- CP4 — growth / discovery / resource completion _(…)_
- CP5 — accessibility / performance / quality _(…)_
- CP6 — preservation, red-team, Wave 9 completion audit + risk register _(…)_

## 4. Dependency map — current status of the 12 mandated systems

| # | System | Current status (entering Wave 9) | Wave 9 action |
| --- | --- | --- | --- |
| 1 | Canonical Metrix (Profile/Score/Priority/Roadmap/Progress/reassessment; single engine) | Built; single engine at `src/lib/metrix/index.ts` (`toMetrixScore`); no duplicate engine | Lock with red-team test (CP2/CP6) |
| 2 | Assessment & profile integrity (required + optional answers, canonical trade/state, no silent defaults, deterministic precedence, serialize/restore) | Sound: `resolveTrade` no default, honest empties, `optionLabel` no fallback; **duplicate `readTradeSource`** is a single-source risk | **Unify trade-source reader + regression tests** (CP2) |
| 3 | Ten trade pathways (HVAC, Electrical, Plumbing, Handyman, Landscaping, Painting, Roofing, Solar, General Contracting/Construction, Cleaning) | `CANONICAL_TRADE_IDS` = 10, first-class in `TRADE_REGISTRY` + `tradeData` | Lock all 10 (CP2) |
| 4 | Six state routes (FL, CO, TX, AZ, OH, NC) | `CANONICAL_STATE_IDS` = 6; `/state/[state]` default-live; provenance/review-date/verify-before-action/uncertainty/correction preserved | Lock all 6 (CP3) |
| 5 | Cloud-sync readiness (save/restore/sync-state/local fallback/conflict/export/delete; no fake sync) | Contracts + migrations 001–005; `isSupabaseConfigured()` truthful (false w/o env) | Lock truthfulness; **no hosted cross-device claim** (Wave 10A) |
| 6 | Guided Foundation Builder (steps, completion, sync readiness, honest local/cloud, export-ready) | Built (`foundationBuilder*`, migration cloud_sync_foundation_builder_progress) | Lock completion + honest status (CP3) |
| 7 | Customer growth foundation (acquisition→retention→reviews/referrals→reactivation→maintenance→cross/upsell→tracking) | Built (`growthEngine`, `growthPhases`, analytics sync) | Lock approved layer only; no predictive/fabricated benchmarks (CP3/CP4) |
| 8 | Resource system (88/20, canonical IDs, redirects, neutral ordering, commercial neutrality, consent-aware clicks, held isolation, regulated notices, no unsupported endorsements) | `ACTIVATED_COUNT`=88; published catalog verification-eligible only; neutrality + consent enforced | Lock accounting + neutrality + consent (CP4) |
| 9 | Growth/discovery & SEO (discovery pages, sitemap, robots, metadata, structured data, share, referral loops, acq/activation analytics; no spam/doorway/fake reviews/backlinks) | Built; sitemap/robots/llms.txt/structured data present | Lock SEO foundations + no-spam invariants (CP4) |
| 10 | Commercial preservation (approved pricing canonical, `/unlock` isolated, server-authoritative paid access, canonical entitlements, Stripe fail-closed, founding completed-purchase-backed, no fake scarcity, held legal wording) | Wave 8 foundation; all flags default OFF; founding `unknown` | Lock fail-closed + held (CP4/CP6) |
| 11 | Accessibility/performance/quality (keyboard, focus, semantics, contrast, reduced-motion, responsive, error/loading/empty states, build health) | Wave 7 CP12 + Wave 8 readability (`#C2CEDE`) | Lock a11y/quality invariants (CP5) |
| 12 | Runtime defaults (approved public default-live, legacy rollback-only, missing env safe, held fail-closed, no umbrella flag coupling) | Wave 8 fix + runtime-default suite | Lock (CP5/CP6) |

## 5. Acceptance criteria

1. Canonical trade is read from ONE shared source used by licensing AND trade intelligence; explicit
   trade (`businessContext.trade` → `normalizedAnswers.trade`) wins over legacy `business_type`.
2. An empty/unknown/unsupported trade resolves to `null` — never Electrical or any default.
3. Unanswered fields remain honestly empty/incomplete; no fabricated profile data.
4. All 10 trade ids resolve and have a registry entry + pathway; all 6 state routes resolve with
   provenance and verify-before-action framing.
5. Cloud-sync reports truthfully when unconfigured (no fake "synced"); export/delete contracts exist.
6. Resource accounting reconciles (88 published / 20 held); published set is verification-eligible
   only; ordering commercial-neutral; outbound analytics consent-gated.
7. Commercial systems remain default-OFF and fail-closed; founding stays `unknown`; no fake scarcity.
8. Runtime defaults: approved homepage default; legacy rollback-only; held systems fail closed.
9. Full validation green (test/typecheck/lint/build); preservation + runtime-default suites pass.
10. No preservation breach (canonical IDs, routes, storage keys, migrations, RLS, resource accounting,
    consent, analytics, no human coaching, no duplicate engine).

_Sections 6–17 are completed at CP6 after implementation and final validation._
