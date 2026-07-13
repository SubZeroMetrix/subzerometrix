# MetrixScore™ Needs-Mapping & Direction Audit (Build 3)

**Date:** 2026-06-13 · Owner/operator: **The Modern Trades Mentor LLC**. Branding:
**SubZeroMetrix™**, **MetrixScore™** (™). Audit + **non-breaking** additive logic only — **no
scoring-math change, no assessment-ID change** (per guardrails; proposed adjustments are
documented for a future dedicated scoring phase).

## Systems audited

- **Free Starter assessment** (`src/lib/scoring.ts`): 8 inputs — `business_type`, `location`,
  `stage`, `setup_steps`, `financial`, `customer_plan`, `blocker`, `lead` → `CategoryScores`
  (businessClarity, locationClarity, stageReadiness, setupReadiness, financialReadiness,
  customerReadiness, blockerSeverity) → band (High Risk / Foundation Stage / Launch Ready /
  Growth Ready).
- **MetrixScore™ engine** (`src/lib/metrixEngine.ts`): 7 categories — `business_foundation`,
  `financial_control`, `sales_marketing`, `operations`, `customer_experience`,
  `people_leadership`, `growth_risk`.
- **New direction map** (`src/lib/contractorNeeds.ts`): canonical 12-layer needs taxonomy,
  per-need score-category + discovery source + feature direction.

## 1. Canonical needs taxonomy (12 layers)

Foundation, Financial, Customer acquisition, Sales, Brand/reputation, Retention, Cross-sell,
Operations, Team/leadership, Technology/data, Capacity/scalability, Outcome intelligence —
encoded in `CONTRACTOR_NEEDS`, each tied to a MetrixScore™ category.

## 2. Question-to-need map (free assessment)

| Question | Target need(s) | Score category | Stage applicability | Signal |
|---|---|---|---|---|
| `business_type` | trade context | (all) | all | routing/context |
| `location` | service area / state | foundation | all | clarity + state routing |
| `stage` | startup readiness | foundation | all | stage weighting |
| `setup_steps` | entity/licensing/insurance/banking | business_foundation | pre-launch→new | setup completeness |
| `financial` | pricing/cash/financial readiness | financial_control | all | financial readiness |
| `customer_plan` | acquisition plan | sales_marketing | all | demand-generation clarity |
| `blocker` | self-reported primary constraint | growth_risk | all | risk signal |
| `lead` | contact (not scored) | — | all | identity for retention/email |

## 3. Coverage gaps (highest-value finding)

The free assessment is **startup-biased**. It discovers foundation, financial, and
acquisition-plan needs, but does **not** directly probe growth-stage needs:

- **Not discovered by any input historically:** SOPs/quality/callbacks, hiring/onboarding/
  training, owner delegation/leadership capacity, CRM/field-service/accounting tooling
  (`getUndiscoveredNeeds()` returns these).
- **Now discovered only by Product-6 Growth Engine (separate input, not the assessment):**
  lead response/missed calls, close rate/follow-up, reviews, repeat/referral, recurring/
  cross-sell, capacity, attribution.

**Effect:** an established contractor with leads but poor conversion, or one at full capacity,
is not distinguished by the 8-question assessment alone — Product-6 fills this, but the
assessment itself should eventually add stage-aware growth questions so direction is correct
from the first score.

## 4. Duplicated / weak signals

- `blocker` is a single self-reported field doing a lot of work; it can mislabel the real
  constraint (a user may report "leads" when the true issue is conversion). Product-6's
  evidence-based `diagnoseGrowth()` is a stronger constraint signal and should inform the
  report's direction.
- `businessClarity` / `locationClarity` are low-information for an operating contractor.

## 5. Score-category audit (no change made)

Current `CategoryScores` weights (businessClarity 10, locationClarity 10, stageReadiness 15,
setupReadiness 20, financialReadiness 20, customerReadiness 15, blockerSeverity 10) emphasize
**setup + financial** — appropriate for pre-launch, **under-weighted for growth-stage**
(no conversion/retention/capacity weighting). **Proposed (future phase, with rationale):**
stage-adjusted weighting so established contractors aren't over-scored on setup and
under-directed on conversion/retention. Not changed here to avoid destabilizing the launch
build and historical scores.

## 6. Constraint logic

Now provided by Product-6 `growthEngine.diagnoseGrowth()` — distinguishes lead vs. conversion
vs. capacity vs. retention vs. brand vs. pricing vs. sales-process, capacity-first, with
evidence and a strongest-capability positive. This is the constraint engine the assessment
`blocker` field cannot match alone.

## 7. Gap-to-action matrix

`contractorNeeds.getDirectionForCategory(category)` maps each MetrixScore™ category to the
feature(s) that act on it:

| Category | Direction |
|---|---|
| business_foundation | Foundation Builder |
| financial_control | Foundation Builder + Growth Engine (pricing) |
| sales_marketing | Growth Engine |
| operations | Foundation Builder + resources |
| customer_experience | Growth Engine (brand/retention) |
| people_leadership | resources (not yet a built feature) |
| growth_risk | Growth Engine + reassess |

**Checks:** no score gap is left with no action; capacity is not answered with "buy more leads"
(Growth Engine handles); foundation issues are sequenced before growth spend; **people_leadership
has no built feature yet** (directed to resources — a known gap for Fix-2/future).

## 8. Confidence & missing-data logic

Product-6 supports `DataConfidence` (`known | estimated | not_tracked | na`) and surfaces a
"lower-confidence because key metrics are not tracked" note. "Not tracked" is treated as a
useful readiness signal, not a failure. The free assessment does not yet carry confidence
flags — recommended for the future scoring phase.

## 9. Stage & trade coverage

Stage: the assessment captures `stage`; Product-6 captures a 6-level stage. Trade: consistent
10-trade taxonomy across intake / Foundation Builder / Growth Engine / public resources. Trade
modifiers (licensing, recurring-revenue, cross-sell, seasonality) live in Foundation Builder
(trade steps) + Growth Engine (cross-sell map) without duplicating the scoring system.

## 10. Changes made (this build)

- Added `src/lib/contractorNeeds.ts` (canonical taxonomy + discovery + gap-to-action direction).
  **Non-breaking, additive, no scoring-math or assessment-ID change.**
- No change to `scoring.ts` / `metrixEngine.ts` / saved-data structure → **historical scores and
  saved assessments are unaffected.**

## 11. Methodology limitations

The MetrixScore™ is an **educational business-readiness indicator** — not a credit score,
lending, underwriting, certification, or any validated predictive model. Weights are heuristic
and not statistically validated; benchmarking/outcome claims are not made (see Privacy Policy
de-identification section). "Not tracked" answers reduce confidence rather than manufacturing it.

## 12. Remaining future validation / Fix-2+ items

- Add stage-aware growth questions to the assessment (conversion, capacity, retention, brand)
  so direction is correct from the first score — with stable new IDs + fallback for saved data.
- Stage-adjusted category weighting (documented rationale required before any scoring change).
- A built people/leadership feature (currently directed to resources only).
- Confidence flags in the free assessment.

## 13. Contractor beta-testing plan

Recruit 2–3 contractors per trade across stages (pre-launch → established). Validate: does the
score's primary direction match their felt #1 constraint? Is the next action obvious and
practical? Does Product-6's diagnosis match reality? Capture mismatches to calibrate weights in
the future scoring phase before any math change ships.
