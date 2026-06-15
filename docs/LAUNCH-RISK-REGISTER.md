# SubZeroMetrix — Launch Risk Register (Wave 7)

> Open items that must be resolved by **authoritative-source verification or qualified legal/
> compliance review** before the affected behavior may be enabled. Nothing here is legal advice.
> While an item is unresolved, the affected behavior stays **blocked or disabled** (fail-safe).

| # | Item | Area | Status | Fail-safe in effect | Resolution needed before enabling |
| --- | --- | --- | --- | --- | --- |
| R1 | **Non-consented aggregate click measurement** | Privacy law / consent | **BLOCKED** | No non-consented counter exists; navigation works without consent; reports cover consented (tracked) clicks only, labeled as *tracked* traffic (not total). | Qualified review that a cookieless, identifier-free aggregate counter is permissible for the target jurisdictions, using **no** cookies, ad IDs, fingerprinting, profile linkage, cross-session identity, unnecessary IP retention, personal-data payload, or third-party ad analytics. |
| R2 | **Publishing commercial / regulated provider listings** (banking, insurance, lending, legal-formation) | Advertising/endorsement, consumer protection, regulated categories | **HELD** | 72 healthy commercial records remain `held_for_review`; catalog empty; flags OFF. | Legal review of educational-listing presentation for regulated categories; confirmation of required disclosures and non-endorsement framing. |
| R3 | **Publishing licensing-authority listings** | Professional licensing / unauthorized practice | **HELD** | Licensing records held; verify-before-action language retained; existing licensing intelligence unchanged. | Confirmation that directory listings of licensing authorities add no advice/guarantee and stay reference-only. |
| R4 | **Flipping the catalog-emptiness invariant** (any activation) | Architecture / safety | **HELD** | Published catalog empty; enforced by 4 test suites; activation requires an explicit, reviewed step. | Owner sign-off + legal clearance (R1–R3) before any record is activated. |
| R5 | **Accessibility of the live directory at scale** | Accessibility | OPEN (deferred to CP12) | Directory built with semantic forms/labels/focus/aria-live; not yet activated. | CP12 accessibility audit before public enablement. |
| R6 | **Resource-feedback cloud sync** | Data export/deletion | OPEN (interim limitation) | Feedback is device-local; export = `getResourceFeedback`, delete = `clearResourceFeedback`; covered locally. | Build the planned cloud-sync table + export/delete coverage in a later wave. |
| R7 | **Blocked/failed/mismatch curated links** | Data quality | OPEN | 20 of 108 (14 blocked, 4 × 404, 2 domain-mismatch) are not activatable; held. | Manual re-verification / URL correction before those specific records can be considered. |

**Build A outcome:** safe technical verification completed; all legally-uncertain or
architecturally-gated behavior remains blocked/disabled pending the resolutions above.

## Build C addendum (CP11–CP13)

| # | Item | Area | Status | Fail-safe in effect | Resolution needed before enabling |
| --- | --- | --- | --- | --- | --- |
| R5 | Accessibility of the live directory at scale | Accessibility | **AUTOMATED PORTION DONE (CP12)** | Reduced-motion, touch targets, visible focus, skip-link/landmark, labeled filters + aria-live shipped and tested. | Manual assistive-technology + real-device review → **Wave 10A**. |
| R8 | **Live checkout vs approved pricing divergence** | Payments / consumer protection | **HELD (presentation only)** | `/pricing` is flag-gated (404 in prod) and presents the approved model with no purchase wiring; `/unlock` + `/api/checkout` unchanged at prior tiers; only the free plan has an active CTA. | Wave 10A: activate live Stripe and migrate `/unlock` checkout to the approved model ($0/$19/$39mo/$79mo/$649) before enabling the pricing flag in production. |
| R9 | **Founding Lifetime live availability counter** | Scarcity / consumer protection | **INACTIVE (truthful unknown)** | Counter derives only from completed verified purchases; with no reliable source it returns `unknown` (no number, no live counter) — no fake scarcity possible. | Wire a verified-completed-purchase source (Wave 10A) before activating any live remaining-count. |

**Build C outcome:** pricing presented truthfully behind default-OFF flags with no live-payment
change; a11y/perf/responsive automated quality completed; the automated Wave 7 audit passed. All
hosted, manual, and qualified-review items above remain launch blockers (Wave 10A).

## Wave 8 + Wave 9 addendum

| # | Item | Area | Status | Fail-safe in effect | Resolution needed before enabling |
| --- | --- | --- | --- | --- | --- |
| R8 | Live checkout vs approved pricing divergence | Payments / consumer protection | **HELD** | `approved_pricing_presentation` + `live_approved_checkout` default OFF; `/pricing` 404s; legacy `/unlock` tiers unchanged; Stripe 503 without config | Wave 10A: apply migration 005, wire `account_user_id`, activate approved checkout; qualified legal review of payment wording |
| R9 | Founding Lifetime live availability counter | Scarcity / consumer protection | **INACTIVE (truthful unknown)** | Counter derives only from completed verified purchases; no reliable source → `unknown` | Wave 10A: wire a verified completed-purchase source before any live count |
| R10 | Hosted cross-device cloud-sync success | Data integrity / truthfulness | **NOT CLAIMED** | `isSupabaseConfigured()` truthful; no fabricated "synced" state | Wave 10A: hosted cross-session/cross-device validation |
| R11 | Canonical trade source consistency | Recommendation integrity | **RESOLVED (Wave 9 CP2)** | Single shared `profileSources` reader; no silent Electrical default; regression-locked | None — locked by tests |

**Wave 9 outcome:** canonical Metrix data/profile integrity, ten trades, six states, foundation +
cloud-sync truthfulness, resource accounting (88/20), growth/discovery/SEO, commercial preservation,
accessibility, and runtime defaults are completed and regression-locked. No data-integrity defect
remains. All hosted, manual, and qualified-legal items above remain Wave 10A/10B blockers.

## Business Brand Foundation planning addendum (audit only — not built)

> Surfaced by `docs/BUSINESS-BRAND-FOUNDATION-SYSTEM-AUDIT.md`. These remain HELD/disabled until
> reviewed; nothing is implemented or activated. Educational, verify-before-act framing applies.

| # | Item | Area | Status | Resolution needed before enabling |
| --- | --- | --- | --- | --- |
| B1 | Business-name legal clearance / trademark availability | Legal | **NEEDS-AUTH-SOURCE + QUALIFIED LEGAL** | Route to official state/USPTO search; never assert "clear/available" |
| B2 | Review incentives / gating / fake or employee reviews | Platform/consumer | **SAFE TO KEEP DISABLED + PLATFORM-TERMS** | Google/Nextdoor/Angi terms + FTC review rules |
| B3 | SMS/email marketing, call recording | Privacy/consumer | **QUALIFIED LEGAL** | TCPA/consent/state recording law before any automation |
| B4 | Customer/employee photo + job-detail usage | Privacy | **QUALIFIED LEGAL** | Explicit consent + privacy controls |
| B5 | "Best/#1/guaranteed" superiority claims | Advertising | **SAFE TO KEEP DISABLED** | No unsupported claims; disclaimers do not cure |
| B6 | Paid-lead / financing / platform profitability claims | Platform/consumer | **PLATFORM-TERMS + QUALIFIED LEGAL** | User-input calculators only; no asserted outcomes |

**Brand Foundation audit outcome:** ~25% present / ~20% user-facing / ~15% canonical-connected;
recommend a shared-framework, non-competing-score domain build, default-OFF, with B1–B6 held.
