# Organic Discovery Foundation — Growth-1 (Built)

**Status:** Built. This is the first real technical SEO / discovery foundation for
SubZeroMetrix™. It is the *foundation only* — no bulk state/trade SEO pages, no
Growth-2 AI answer-engine pages, and no referral/review/partner systems are built
yet (those remain on `growth-engine-roadmap.md`).

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™** (™, not ®).

## What Growth-1 built

- **`src/lib/seo.ts`** — site metadata constants (`SITE_URL`, default title/template,
  brand-safe default description), `canonicalUrl()`, Open Graph / Twitter builders,
  and an Organization JSON-LD helper.
- **`src/lib/marketStates.ts`** — six-state source of truth (FL, CO, TX, AZ, OH, NC),
  each with general/contractor/readiness keywords and **safe, non-claiming** official-
  resource + disclaimer notes.
- **`src/lib/searchIntentKeywords.ts`** — search-intent source of truth across the 10
  intent types, with `supportedNow` honesty flags and per-keyword guardrails.
- **`src/app/sitemap.ts`** — App Router sitemap of **real public routes only**.
- **`src/app/robots.ts`** — crawl rules that allow public pages and keep private/paid/
  stateful routes + the API out of the index.
- **`src/app/layout.tsx`** — `metadataBase`, title template, brand-safe default
  description, OG/Twitter defaults, index/follow robots default, and Organization
  structured data.

## Six-state foundation

FL · CO · TX · AZ · OH · NC — recorded in `marketStates.ts` with slugs for future
`/state/<slug>/...` pages. **No specific licensing claims** — state content must
direct users to official state/local sources for licensing, registration, insurance,
tax, and permitting.

## Keyword / search-intent source of truth

`searchIntentKeywords.ts` covers: `general_business_startup`, `state_business_startup`,
`trade_business_startup`, `service_business_startup`, `readiness_assessment`,
`pricing_readiness`, `lead_generation`, `first_hire`, `vendor_setup`,
`future_vertical_discovery`. Contractor/trade/service intent is `supportedNow: true`;
broad non-trade intent is `supportedNow: false` (discovery + honest routing only).

## Sitemap strategy

Included (real, public): `/`, `/start`, `/resources`, `/platform-ecosystem`, `/terms`,
`/privacy`, `/disclaimer`, `/affiliate-disclosure`, `/cancellation`, and the 10 real
trade platform pages (`/platform/<branded-slug>` — heat, volt, flow, roof, clean,
ground, fix, paint, sun, build) generated from `TRADE_CONFIGS`.

Excluded: `/report`, `/dashboard`, `/unlock`, `/results`, `/assessment`, the PWA
`/install` helper, API routes, and redirect-only URLs.

## Robots strategy

Allow `/`; disallow `/api/`, `/dashboard`, `/report`, `/unlock`, `/results`. Sitemap
+ host advertised. No legitimate search/AI crawler is blocked. **No hidden AI prompt
instructions.**

## Metadata strategy

`metadataBase` set to the canonical origin; title template (`%s | SubZeroMetrix™`);
brand-safe default description (educational, not advice); OG + Twitter defaults;
index/follow default; Organization JSON-LD. No keyword stuffing.

## Public resource / tool pages — BUILT (Growth-7)

The `/learn` engine (`src/lib/publicResources.ts` + `src/components/ResourcePageView.tsx` +
`/learn` index and `/learn/[slug]`) ships a small curated set of standalone educational
pages with canonical + OG/Twitter metadata and Breadcrumb + FAQPage JSON-LD, added to
`sitemap.ts`. Curated (not mass-generated); no thin/doorway pages; honest scope note
(strongest for contractors/trades). See `growth-engine-roadmap.md` § Public Tool / Resource
Page Engine.

## Future plans (NOT built here)

- **Structured data:** expand JSON-LD (WebSite, HowTo) on future resource/state pages.
- **More Learn pages / state pages:** add only with real, distinct content.
- **Broad "how to start a business" layer:** general/state/service/readiness pages that
  route into the assessment, with an honest scope note for non-trade visitors
  (see `growth-engine-roadmap.md`).

## Guardrails (enforced)

- No doorway pages, no thin/duplicate pages.
- No fake backlinks, no fake reviews.
- No keyword stuffing.
- No hidden AI prompt injection.
- No guaranteed ranking, lead, or business-success claims.
- No claim that AI platforms will recommend us.
- No claim of full support for every business type.
- No official licensing/legal/tax/financial advice — direct users to official sources.
