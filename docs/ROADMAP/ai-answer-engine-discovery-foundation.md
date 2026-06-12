# AI Answer Engine Discovery Foundation — Growth-2 (Built)

**Status:** Built. The AI/search answer-engine discovery foundation for
SubZeroMetrix™. Foundation only — no bulk state/trade pages, no spam pages, no
referral/review/partner systems (those remain on `growth-engine-roadmap.md`).

Owner/operator: **The Modern Trades Mentor LLC**. Branding: **SubZeroMetrix™**,
**MetrixScore™** (™, not ®).

## What Growth-2 built

- **`src/app/llms.txt/route.ts`** — a plain-text, AI/crawler-readable site guide
  served at `/llms.txt`.
- **`src/app/about/page.tsx`** — public brand/entity page (`/about`).
- **`src/app/business-readiness/page.tsx`** — public FAQ/answer page
  (`/business-readiness`) with FAQ structured data.
- **`src/lib/seo.ts`** — added `websiteJsonLd()`, `softwareApplicationJsonLd()`,
  `faqPageJsonLd()`, `breadcrumbJsonLd()`.
- **`src/app/sitemap.ts`** — added `/about` and `/business-readiness`.

## llms.txt purpose

A factual, crawlable description of what SubZeroMetrix™ is, who operates it, what
MetrixScore™ means, who it currently helps most (contractors, tradespeople,
service-business owners), what users can do, the platform's current strongest focus,
the educational-only limitations, and key page links. **It contains no hidden
instructions, no prompt injection, no "you must" directives to AI systems, and no
claim that AI platforms will recommend us.**

## About / entity page

`/about` explains SubZeroMetrix™, MetrixScore™, and The Modern Trades Mentor LLC; the
platform's purpose and current contractor/trade/service focus; how to use it; and its
educational-only limitations. CTA to `/start`; links to `/resources`, `/disclaimer`,
`/terms`. Emits SoftwareApplication structured data (no ratings/reviews/pricing).

## Business readiness answer page

`/business-readiness` answers common questions (what business readiness is, what
contractor readiness is, what a Starter MetrixScore™ is, what to check before
starting, how SubZeroMetrix™ helps, and what it does not do). It serves a broad
"how to start a business" visitor while honestly routing toward the strongest
contractor/trade/service focus. Emits FAQPage structured data.

## Structured data strategy

Organization (global, in `layout.tsx`), plus SoftwareApplication on `/about` and
FAQPage on `/business-readiness`. `websiteJsonLd()` and `breadcrumbJsonLd()` helpers
exist for future pages. **No aggregateRating, review, or fake pricing markup.**

## Sitemap updates

Added the two new real public pages (`/about`, `/business-readiness`). `/llms.txt` is
reachable via its route handler (a plain-text resource, not an HTML sitemap entry).

## Honesty + guardrails

- **No hidden AI prompt injection**; no instructions telling AI systems what they must say.
- **No claim that AI platforms will recommend us.**
- **No guaranteed ranking, lead, business-success, or outcome claims.**
- **No overstating industry support** — broad business-startup content is educational/
  routing only, with an explicit scope note that the platform is strongest for
  contractors, trades, and service businesses.
- **No legal/tax/financial/licensing advice** — direct users to official state/local sources.

## Relationship to six-state + 10-trade expansion

This foundation links to the existing six launch states (FL, CO, TX, AZ, OH, NC,
`marketStates.ts`) and the 10 trade platform pages. Per-state and per-trade answer
pages, expanded JSON-LD (HowTo, per-state FAQ), and the broad business-startup page
set remain **future** work (see `growth-engine-roadmap.md`) — not built here.
