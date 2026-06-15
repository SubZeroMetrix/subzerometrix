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
- Ending commit: the CP6 commit (preservation gate + this audit + risk register).

## 3. Internal checkpoint commits

- CP1 `a0ec35c` — dependency map & acceptance criteria
- CP2 `f85f487` — single canonical trade/state source reader + profile-integrity regression
- CP3 `0f3d13e` — foundation completion + cloud-sync truthfulness lock
- CP4 `1477ee0` — resource accounting, neutrality, SEO/structured-data integrity lock
- CP5 `3004483` — accessibility, contrast token, build-health lock
- CP6 _(this commit)_ — consolidated launch-readiness gate + completion audit + risk register

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

## 4b. Files changed by checkpoint

- CP1: `docs/WAVE9-COMPLETION-AUDIT.md` (new)
- CP2: `src/lib/metrix/profileSources.ts` (new), `src/lib/metrix/licensingIntelligence.ts`,
  `src/lib/metrix/tradeIntelligence.ts`, `src/lib/metrix/__tests__/wave9-canonical-trade-integrity.test.ts` (new)
- CP3: `src/lib/metrix/__tests__/wave9-execution-cloudsync.test.ts` (new)
- CP4: `src/lib/metrix/__tests__/wave9-growth-discovery-resource.test.ts` (new)
- CP5: `src/lib/metrix/__tests__/wave9-quality-accessibility.test.ts` (new)
- CP6: `src/lib/metrix/__tests__/wave9-launch-readiness-gate.test.ts` (new),
  `docs/WAVE9-COMPLETION-AUDIT.md`, `docs/LAUNCH-RISK-REGISTER.md`

## 6. Tests & validation

Full suite green at CP6: **`npm test` 462/462 pass**, `tsc --noEmit` clean, `next lint` clean,
`next build` compiled, `git diff --check` clean, working tree clean. Targeted suites run after each
checkpoint. New Wave 9 suites: canonical-trade-integrity, execution-cloudsync, growth-discovery-
resource, quality-accessibility, launch-readiness-gate.

## 7. Preservation results

No preservation breach. Canonical IDs, routes, storage keys, migrations 001–005, owner-scoped RLS,
resource accounting, consent model, analytics allow-list, and the single Metrix engine are intact.
The only source change (CP2) extracted a duplicated reader into one shared module — behavior-
preserving (all prior licensing/trade tests still pass).

## 8. Runtime-default results

Approved homepage default; legacy rollback-only (`NEXT_PUBLIC_USE_LEGACY_HOMEPAGE`); missing env
selects no outdated experience; held systems fail closed; no umbrella flag activates unrelated
systems. Locked by `wave8-runtime-defaults` + `wave9-launch-readiness-gate`.

## 9. Trade / state coverage

All **10** trades first-class (`hvac, electrical, plumbing, handyman, landscaping, painting,
roofing, solar, construction, cleaning`) — each resolves + has a registry entry. All **6** state
routes (`FL, CO, TX, AZ, OH, NC`) default-live with provenance/verify-before-action framing.

## 10. Cloud-sync implementation status

Contracts + migrations present; sync state truthful (`isSupabaseConfigured()` false without env; no
fabricated "synced"); export/delete governance via entity contracts. **Hosted cross-session/cross-
device success is NOT claimed — reserved for Wave 10A validation.**

## 11. Resource accounting

88 published / 20 held = 108 tested. Published catalog is verification-eligible only (held isolated);
ordering commercial-neutral; outbound analytics consent-gated; regulated-category notices retained.

## 12. Commercial activation status

All commercial systems remain **default-OFF / fail-closed**: approved pricing presentation,
approved checkout, live Stripe provisioning, and Founding offer/counter are disabled. Legacy
`/unlock` tiers unchanged; Stripe returns 503 without config; founding availability `unknown`; no
fake scarcity. Entitlements canonical and server-authoritative (client flags cannot grant access).

## 13. Legal / compliance holds

- Payment/subscription/refund/cancellation/scarcity wording — **QUALIFIED LEGAL REVIEW REQUIRED**.
- Founding scarcity + "lifetime" representation — **QUALIFIED LEGAL REVIEW REQUIRED**; counter
  **SAFE TO KEEP DISABLED** until a verified completed-purchase source exists.
- Commercial/regulated resource listings (R2) & licensing-authority listings (R3) — **HELD**.
- Non-consented aggregate click measurement (R1) — **BLOCKED**.
- All other Wave 9 work is **TECHNICAL IMPLEMENTATION READY** and does not implicate the above.

## 14. Saved final-audit issues (non-blocking; for Wave 10A/10B)

- Optional sections populate real canonical answers / honest incomplete states — verified clean and
  locked (CP2/CP3); kept on the watchlist for qualitative review.
- General visual/usability refinements found during review — recorded for the final visual audit.
- Recommended cleanup (non-blocking): remove dormant DEPRECATED-REMOVE feature flags
  (`expanded_resource_catalog`, `verified_launch_resources`, `new_content_surfaces`,
  `general_business_starter`, `spanish_discovery`, `partner_vendor_pages`, `referral_sharing`,
  `customer_proof_feedback`) — they gate nothing and default OFF.

## 15. Wave 10A blockers (manual / hosted)

Hosted cross-device cloud-sync validation; manual assistive-technology + real-device a11y review;
manual source-to-claim review for state licensing; manual review of the 20 held resources; live
Stripe + approved-checkout activation (apply migration 005, wire `account_user_id`); verified
Founding completed-purchase source; real-person usability + contractor qualitative review.

## 16. Wave 10B blockers (final)

Final qualified legal go/no-go on payment/subscription/refund/scarcity wording and regulated
listings; final production launch decision.

## 17. Go/no-go recommendation for entering Wave 10A

**GO.** Wave 9 completes and regression-locks the automated, implementation-level launch-critical
systems. No data-integrity defect remains (the flagged Electrical-default concern was verified
absent and locked). All held commercial/compliance systems remain disabled and fail-closed;
preservation and runtime defaults are intact; validation is fully green. Remaining work is
explicitly manual/hosted/legal and belongs to Wave 10A/10B.
