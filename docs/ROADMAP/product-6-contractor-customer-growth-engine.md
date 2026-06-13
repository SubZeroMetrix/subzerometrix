# Product-6 — Contractor Customer Growth Engine

**Status:** MVP built. Owner/operator: **The Modern Trades Mentor LLC**. Branding:
**SubZeroMetrix™**, **MetrixScore™** (™). User-facing name: **Customer Growth Roadmap**.

An outcome engine (not a tips library) for launched contractors who can't grow because of
customers, brand, sales structure, retention, or cross-sell. Core loop:
**Growth inputs → Constraint diagnosis → Prioritized roadmap (Do now/next/later) → Channels →
Cross-sell → KPIs.**

## Architecture

- **`src/lib/growthEngine.ts`** — typed model + pure logic: `diagnoseGrowth()`,
  `buildGrowthRoadmap()`, constraint/channel/cross-sell/social/KPI data, `recommendChannels()`,
  and a local-first storage contract (`szm_growth_engine`). No cloud sync wired (no migration);
  local-first only.
- **`src/components/GrowthRoadmap.tsx`** — the UI (diagnosis, collapsible inputs, grouped
  actions, channels, cross-sell, social rhythm, KPIs).
- **`src/app/growth/page.tsx`** — `/growth` route; dashboard entry card added.

## Growth-constraint model

Distinguishes **seven** constraints (does NOT diagnose everyone as a lead problem):
`lead`, `conversion`, `capacity`, `retention`, `brand`, `pricing`, `sales_process`. Capacity is
checked first — a full-capacity contractor is never told to just buy more leads. Diagnosis is
evidence-based from inputs (monthly leads, response time, missed calls, booking/close rate,
average ticket, follow-up process, repeat rate, referrals, reviews, GBP completeness, recurring
revenue, at-capacity). Output: primary constraint + secondary + strongest existing capability +
a cautious plain-language summary + a data-confidence note when key metrics are untracked.

## Channel matrix

Constraint-aware recommendations (not every channel to everyone): when the constraint is
conversion/sales/capacity, it says **fix the funnel before adding channels**. Covers local
discovery (GBP/local SEO, Local Services Ads, directories), reviews+referrals, and
existing-customer reactivation. Foundational local channels always shown; paid/LSA only once the
funnel is ready.

## Sales system

Action library per constraint includes: recover missed calls + slow responses first, same-day +
multi-touch estimate follow-up, good/better/best options, tighten the booking/sales
conversation, track lost reasons. KPIs: leads, response time, booking rate, close rate, average
ticket, follow-up completion.

## Retention / reactivation

Post-job follow-up + consent-first review/referral asks; reactivate lapsed customers + unsold
estimates; offer maintenance plans / service agreements. KPIs: repeat-customer rate, referrals,
reviews, customers on a plan.

## Cross-sell matrix (trade-aware, customer-beneficial)

`CROSS_SELL` covers all 10 trades (HVAC maintenance/IAQ/thermostats…, electrical panels/EV/
generators…, plumbing water heaters/treatment…, roofing inspections/gutters…, construction
phased/remodel…, handyman bundles…, landscaping recurring/irrigation…, cleaning recurring/deep…,
painting maintenance/cabinets…, solar monitoring/storage…). Offered only when genuinely helpful —
**no pressure, no deceptive or unnecessary selling.**

## Local brand & social

Brand actions (GBP, listings, reviews, neighborhood visibility). Social: a repeatable monthly
rhythm (Week 1 education → 2 before/after → 3 credibility → 4 seasonal reminder) — a practical
contractor planner, not an influencer system.

## Stage & trade behavior

Stage-aware (`pre_launch` … `growth_stage`) so the system is useful through year three and beyond;
trade-aware via shared logic + the trade-specific cross-sell map (no duplicated full system per
trade). Trade is read from the existing intake; stage is selectable.

## Local-first / cloud

Inputs persist to `szm_growth_engine` (device-local, SSR-safe). No cloud sync wired in the MVP
(no migration, no false sync claims). A future phase may add it via the Account-2 architecture.

## Guardrails honored

No guaranteed customer/revenue claims; no fabricated ROI; no automatic ad purchasing; no
unsolicited messaging/spam; no deceptive cross-sell; no fake reviews/gating; no legal/tax/
licensing advice; neutral vendor stance; no new third-party tracking/dependency; no payment/
Stripe/report-gating/DEV_UNLOCK/scoring changes.

## Future

KPI history + trend; tie growth-KPI movement to re-scoring; optional account-backed sync;
deeper trade-specific channel economics; estimate/lost-reason pipeline tracking.
