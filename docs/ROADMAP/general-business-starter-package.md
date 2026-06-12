# General Business Starter Information Package — Growth-2B (Foundation Built)

**Status:** Foundation built. A public, educational starter page exists at
`/general-business-starter`. Future improvements (per-state pages, interactive
checklist tracking, expanded analytics) remain on `growth-engine-roadmap.md`.

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™** (™, not ®).

## What Growth-2B built

- **`src/lib/generalBusinessStarter.ts`** — the educational package model: 9 sections
  (Business Setup Basics, Legal/Tax/Licensing Disclaimer Routing, Financial Readiness,
  Pricing & Revenue Basics, Customer Acquisition Basics, Operations & Systems Basics,
  First-Hire Readiness Basics, Vendor/Tool Readiness Basics, 30-Day Startup Action Plan)
  plus next-step routing recommendations; helpers `getGeneralBusinessStarterPackage`,
  `getGeneralBusinessStarterSections`, `getGeneralBusinessStarterChecklist`,
  `getGeneralBusinessRoutingRecommendation`.
- **`src/app/general-business-starter/page.tsx`** — the public page (`/general-business-starter`).
- **`src/app/sitemap.ts`** — added `/general-business-starter`.
- **`src/app/llms.txt/route.ts`** — added a factual mention of the package.

## Who it serves

Broad startup visitors arriving through "how to start a business", "business startup
checklist", and "business readiness assessment" search intent — including people not
in a currently supported contractor/trade category.

## Honest scope limits

Every surface carries the scope note:
> "SubZeroMetrix™ is currently strongest for contractors, tradespeople, and
> service-business owners. This general business starter package is educational and
> may be less industry-specific."

It is **educational only** — not legal, tax, financial, licensing, or compliance
advice, and it provides **no official state guidance**. It routes users to official
state/local/professional sources for legal, tax, licensing, insurance, registration,
and permitting requirements. **No claim of full support for every industry.**

## How it supports broad "how to start a business" traffic

A genuinely useful, crawlable framework (setup, legal routing, finances, pricing,
customers, operations, first hire, vendors, and a 30-day action plan) — not a thin or
doorway page — that gives value first and routes second.

## How it routes into contractor/trade/service readiness

A "Your next step" section sends contractors, tradespeople, and service-business
owners to the assessment (`/start`), points anyone wanting to learn to
`/business-readiness`, and offers other industries the general framework with the
honest scope note.

## Future analytics fields (not built yet)

`user_selected_industry` · `business_type` · `startup_stage` ·
`general_business_starter_viewed` · `general_business_checklist_started` ·
`general_business_checklist_completed` · `routed_to_contractor_path` ·
`routed_to_service_business_path` · `unsupported_industry_selected` ·
`future_vertical_interest`.

## Future vertical discovery purpose

Demand from broad/non-trade intent helps identify which verticals, states, and
service-business categories could become future expansion opportunities under The
Modern Trades Mentor LLC ecosystem.

## Guardrails

- Educational only; no legal/tax/financial/licensing advice; no official state guidance.
- No guaranteed business success; no guaranteed leads; no guaranteed rankings.
- No claim of full industry support; no fake industry expertise.
- No thin/duplicate pages; no doorway pages; no keyword stuffing.
- State-specific content (future) must direct users to official state/local sources.
