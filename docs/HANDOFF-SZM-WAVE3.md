# SubZeroMetrix Wave 3 Handoff

## Status

* Wave 3 complete, merged, and synchronized to `main`.
* **PR #9** — merge commit `8590e3e` (`Merge pull request #9 from SubZeroMetrix/feature/metrix-wave3-trade-intelligence`).
* Feature branch `feature/metrix-wave3-trade-intelligence` deleted remotely (pruned locally).
* `main` == `origin/main` at `8590e3e`. Working tree clean.

## Objective

Wave 3 added **one additive, deterministic contractor-intelligence layer** for all 10 launch
trades — without creating a competing score, priority, gate, path, profile, progress, or
reassessment engine. It reads the canonical snapshot (+ the Wave 2 ProfileIntelligence) and
projects the resolved trade into richer, explainable, trade-aware advisory content.

## Supported Trades

* HVAC
* Electrical
* Plumbing
* Handyman Services
* Landscaping
* Painting
* Roofing
* Solar
* General Contracting / Construction
* Cleaning Services

(Canonical trade IDs reuse the existing `intake.ts` / `tradeData.ts` IDs; "General Contracting /
Construction" maps to the existing `construction` ID — no new IDs were introduced.)

## Completed Capabilities

* canonical typed trade registry (`TRADE_REGISTRY`, `CANONICAL_TRADE_IDS`)
* stable trade IDs and specific aliases (no generic substitutes); `resolveTrade` / `isSupportedTrade`
* shared contractor-business dimensions (19-dimension catalog, one reused label each)
* differentiated modifiers for all 10 trades (materially different operating/revenue/demand models)
* `deriveTradeIntelligence(...)` pure, deterministic, defensive adapter
* strengths
* risks
* important unknowns
* evidence needs
* operating constraints
* recurring-revenue opportunities
* owner-dependency indicators
* capacity considerations
* resource and specialist categories (categories only — no providers/URLs/affiliates)
* trade-aware progressive questions (reuse the one progressive-question filter)
* safe unsupported, malformed, missing, and legacy fallbacks (never throws)
* display-only results and dashboard integrations (subordinate; no competing CTA)
* regression personas for all 10 trades

## Canonical Architecture

Wave 3 remains **subordinate** to the canonical pipeline:

`Metrix Profile → MetrixScore → Metrix Priority → Completion Paths → Actions & Evidence → Metrix Progress → Reassessment`

Explicitly:

* **no new numeric score** — trade intelligence carries no score/overall/priority field
* **no independent priority override** — it can inform explanations/questions/routing only; a
  guardrail test proves it cannot replace the canonical priority
* **no duplicate question engine** — trade questions reuse the single `filterQuestionCandidates`
  (dedupe / answered-suppression / dismissed / bounded), cross-deduped against canonical questions
* **no state licensing engine** — none (reserved for Wave 4)
* **no duplicate canonical profile** — it reads the one `MetrixProfileSnapshot`, never re-creates it

## Files Added

* `src/lib/metrix/trades.ts`
* `src/lib/metrix/tradeIntelligenceTypes.ts`
* `src/lib/metrix/tradeModifiers.ts`
* `src/lib/metrix/tradeIntelligence.ts`
* `src/components/TradeIntelligenceCard.tsx`
* `src/lib/metrix/__tests__/trade-intelligence.test.ts`

## Files Updated

* `src/lib/metrix/progressiveQuestions.ts` (extracted reusable `filterQuestionCandidates`; `selectProgressiveQuestions` behavior unchanged)
* `src/lib/metrix/index.ts` (surfaced the Wave 3 public API)
* `src/app/results/page.tsx` (`<TradeIntelligenceCard variant="full">`)
* `src/app/dashboard/page.tsx` (`<TradeIntelligenceCard variant="compact">`)

`docs/HANDOFF-SZM-WAVE2.md` (the retroactive Wave 2 handoff) also landed with the Wave 3 PR.

## Validation

Final validation was completed on the Wave 3 branch before merge (no code changed since):

* Tests: **144/144 pass** (134 prior + 10 Wave 3)
* TypeScript (`tsc --noEmit`): clean
* Lint (`next lint`): no warnings/errors
* Production build: succeeds (44 pages)
* Duplicate-engine review, scoped diff review, clean working tree: all clean

**Do not rerun validation** unless code changes.

## Boundaries

* state licensing and jurisdiction logic remain **Wave 4**
* no 60 trade-state pathways yet
* no Stripe, pricing, checkout, or entitlement changes
* no homepage redesign
* no human coaching
* no predictive, benchmark, or outcome claims

## Wave 4 Entry Point

Next controlled build:

**Wave 4 — Six-State Licensing, Jurisdiction & Trusted Routing**

Launch states:

* Florida
* Colorado
* Texas
* Arizona
* Ohio
* North Carolina

Wave 4 must build 60 trade-state pathways with:

* official-source provenance
* reviewed dates
* state / local / work-scope applicability
* verify-before-action language
* stale-source handling
* authority and specialist routing
* unsupported-state fallback
* commercial neutrality

**Do not begin Wave 4 in this context.**
