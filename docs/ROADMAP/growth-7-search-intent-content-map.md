# Growth-7 — Search-Intent & Public Content Map

**Status:** Built (engine + initial page set). Owner/operator: **The Modern Trades Mentor
LLC**. Branding: **SubZeroMetrix™**, **MetrixScore™** (™, not ®).

The reusable public discovery engine helps SubZeroMetrix™ appear for high-value searches
about starting, launching, organizing, and growing **contractor, trade, home-service,
construction, and field-service** businesses — without thin, doorway, or spam pages.

## Page architecture

- **Model:** `src/lib/publicResources.ts` — typed `PublicResource` (slug, title/metaTitle,
  description, audience, `intent` (primary) + `secondaryIntents`, `contentType`,
  `tradeApplicability`/`stateApplicability`, `supportedTrades`/`supportedStates`,
  `updatedAt` (last reviewed), `indexable`, `published`, `structuredDataType`, sections,
  `whatWeSupport`, `showSupportedTrades`, disclaimer, CTAs, related, FAQ, keywords) +
  `SUPPORTED_TRADES` dataset.
- **Renderer:** `src/components/ResourcePageView.tsx` (reusable server component) +
  `src/components/SupportedTrades.tsx` (reusable supported-trades callout).
- **Routing:** `/learn` (index), `/learn/[slug]` (`generateStaticParams` over the curated,
  published set — no mass generation; `generateMetadata` with canonical/OG/Twitter and a
  noindex fallback when `indexable === false`), and `/trades` (supported-trades overview).

## Initial pages launched

| Route | Primary intent | Type |
|---|---|---|
| `/learn/starting-a-contractor-business` | How to start a contractor business | guide |
| `/learn/contractor-startup-checklist` | Contractor startup checklist | checklist |
| `/learn/metrixscore-overview` | What is the MetrixScore™? | overview |
| `/learn/foundation-builder-guide` | Business foundation builder | tool explainer |
| `/learn/start-a-trade-business` | How to start a trade business (technician → owner) | guide |
| `/learn/start-a-home-service-business` | How to start a home-service business | guide |
| `/learn/contractor-business-readiness` | Am I ready to start a contractor business? | overview |
| `/trades` | Supported trades overview | collection |
| `/foundation-builder` *(existing)* | Foundation Builder tool | tool |
| `/business-readiness`, `/resources`, `/general-business-starter` *(existing)* | readiness / resources | — |

One page owns one primary intent; close variants ("company" vs "business", singular/plural)
are handled on the same page via `secondaryIntents` — never separate pages.

## Search-intent groups covered / prepared

- **A. Business-starting** (how to start a contractor/trade/home-service/service business,
  technician→owner, startup checklist, first steps, requirements, cost, while employed).
- **B. Business setup** (entity/EIN, licensing, insurance, bonding, permits, banking,
  bookkeeping, domain/email/website, GBP, service area) — routed to official sources.
- **C. Financial readiness** (startup budget, pricing, labor rate, margin, estimating, job
  costing) — educational, routed to a tax/accounting professional for advice.
- **D. Operations** (dispatch/scheduling, CRM/field-service software, invoicing, SOPs,
  service agreements, recurring revenue, hiring vs subcontractor education).
- **E. Sales & marketing** (getting customers, local SEO, GBP, reviews, referrals,
  follow-up, close rate, average ticket).
- **F. Growth & management** (first employee, KPIs, margins, capacity, retention).
- **G. Readiness & risk** (am-I-ready, readiness assessment, what am I missing, MetrixScore™).
- **H. State & local** (state-aware content prepared via `supportedStates`; launch states:
  FL, CO, TX, AZ, OH, NC) — **no city/county pages**, no name-swap pages.

## Supported trades (normalized)

HVAC, Electrical, Plumbing, Roofing, General Contractor/Construction, Handyman/Home Repair,
Landscaping/Lawn Care, Cleaning, Painting, Solar — each with one honest startup
consideration in `SUPPORTED_TRADES`; requirements vary by state/locality (verify officially).

## Future expansion (prepared, NOT launched)

- **Dedicated trade pages** (e.g. `/start-an-hvac-business`) — launch only when each has
  unique startup costs, licenses/certs + official sources, insurance/bonding, tools,
  estimating/pricing, scheduling/PM, hiring, customer types, recurring revenue, common
  mistakes, software categories, launch checklist, FAQs, and CTA. The model already
  supports `supportedTrades` and trade-specific applicability.
- **State pages** (e.g. `starting-a-contractor-business-in-florida`) — launch only with
  unique official agencies (SOS, DOR, licensing board), registration info, and local
  verification. `supportedStates` + the Foundation Builder `getFoundationStateResources`
  routing are ready. No duplicated generic text.
- **Trade × state combinations** — prepared, not generated en masse.

## Internal-linking plan

Guides ↔ checklist ↔ readiness ↔ MetrixScore™ overview ↔ `/start` (assessment) ↔
`/foundation-builder` ↔ `/resources` ↔ `/trades` ↔ existing `/business-readiness`. Every
page carries descriptive internal links and breadcrumbs.

## Conversion paths

CTAs: "Check your business readiness", "Open the Foundation Builder", "See supported
trades", "See what your business may be missing", "Browse contractor resources". No
"guaranteed success", "instant approval", "no risk", "secret formula", or fake urgency.

## Anti-doorway / thin-content rules

- Curated only — **no mass generation**, no name-swap pages, no city/county pages.
- Each page has genuine, distinct standalone content (multiple sections + honest
  "what we support" + often an FAQ).
- `indexable`/`published` flags keep incomplete pages out of `generateStaticParams`,
  the sitemap, and the index (noindex).
- No fake reviews/ratings/stats/backlinks/expert claims; no misleading schema (FAQPage
  JSON-LD only when visible FAQs exist).

## Content quality standard

Honest scope (strongest for trades/contractors/home-service — **not** equal for every
industry; explicitly not for restaurants/retail/software/healthcare depth). No legal/tax/
licensing/insurance/financing/accounting/employment advice — route to official federal,
state, and local sources. MetrixScore™ stated as educational readiness, **not** a credit
score, lending, underwriting, or a guarantee.

## Measurement plan (privacy-safe; future)

Prepare to measure via the existing device-local, non-PII analytics (`growthAnalytics`):
page viewed, primary intent, selected trade/state, CTA clicked, assessment started,
Foundation Builder started, resource link clicked. No third-party trackers, pixels, or
cookies.

## Growth-8 handoff

Next: **Growth-8 — Email Capture / Nurture Foundation** (privacy-safe, consent-first). The
public pages give Growth-8 honest entry points (assessment, Foundation Builder) without
aggressive capture.
