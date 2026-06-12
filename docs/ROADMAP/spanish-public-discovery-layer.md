# Spanish Public Discovery Layer — Spanish-1 (Built)

**Status:** Built (public discovery only). Spanish entry pages exist so Spanish-
speaking visitors can understand SubZeroMetrix™ and route into the assessment. This
is **not** a full platform translation.

Owner/operator: **The Modern Trades Mentor LLC**. Brand names are never translated:
**SubZeroMetrix™**, **MetrixScore™**.

## What Spanish-1 built

- **`src/lib/spanishDiscovery.ts`** — neutral U.S. Spanish copy source of truth
  (scope note, disclaimer, "not fully translated" note, the general-starter sections +
  routing, and the readiness FAQs); helpers `getSpanishDiscoveryPages`,
  `getSpanishBusinessStarterCopy`, `getSpanishContractorReadinessCopy`,
  `getSpanishScopeNote`, `getSpanishDisclaimerNote`.
- **`src/app/es/page.tsx`** — Spanish landing (`/es`).
- **`src/app/es/como-empezar-un-negocio/page.tsx`** — Spanish general business starter.
- **`src/app/es/preparacion-empresarial/page.tsx`** — Spanish business readiness + FAQ
  structured data.
- **`src/app/sitemap.ts`** — added `/es`, `/es/como-empezar-un-negocio`,
  `/es/preparacion-empresarial`.
- **`src/app/llms.txt/route.ts`** — added a factual Spanish-pages mention.

Spanish pages set `lang="es"` on the page wrapper for a clear language signal.

## What is NOT translated yet

The assessment engine, paid report, dashboard, checkout, legal/disclaimer system,
scoring logic, roadmap logic, and most tools remain in English. The Spanish pages
state this honestly and link to the English assessment and legal pages.

## Target audience

Spanish-speaking contractors, tradespeople, service-business owners, and broad
"how to start a business" visitors.

## Scope limits

- Educational only — not legal, tax, financial, or licensing advice.
- No claim that the full platform is available in Spanish.
- No claim of official state guidance — routes users to official sources.
- Neutral U.S. Spanish; brand names untranslated.

## Growth Engine coverage (public discovery layer only)

Spanish-1 supports the Growth Engine strategy at the discovery layer. Mapping (see
`getSpanishGrowthCoverage()` in `spanishDiscovery.ts`):

| Growth area | Spanish support |
|---|---|
| Organic Discovery Foundation | built — Spanish pages in sitemap, metadata, canonical |
| AI Answer Engine Discovery | built — Spanish FAQ structured data + llms.txt mention |
| Broad "how to start a business" intent | built — Spanish general starter page |
| Contractor/trade/service startup intent | built — honest routing into the assessment |
| Product-led sharing / referral | future — Spanish share/referral copy planned |
| Customer proof / review | future — Spanish review/testimonial prompts planned |
| Partner / community outreach | future — Spanish partner/community pages planned |
| Analytics segmentation | foundation_ready — `locale = es-US`, future Spanish fields defined |

Each Spanish page already carries Spanish metadata, canonical URL, Open Graph with
`locale = es_US`, and (on the readiness page) Spanish FAQ structured data.

## Suggested future Spanish routes (planned, NOT built)

`/es/lista-para-iniciar-un-negocio` · `/es/contratistas` · `/es/negocios-de-servicios`
(defined in `FUTURE_SPANISH_ROUTES`). Add to the sitemap only when the real pages exist.

## Future Spanish analytics fields (defined, not wired)

`language` · `locale` · `spanish_page_viewed` · `spanish_starter_viewed` ·
`spanish_readiness_viewed` · `routed_to_assessment_from_spanish` ·
`spanish_share_created` · `spanish_review_prompt_answered` · `spanish_partner_lead`
(in `FUTURE_SPANISH_ANALYTICS_FIELDS`).

## Future Spanish expansion phases (planned, not built)

- **Spanish-2** — Starter Assessment + Results in Spanish.
- **Spanish-3** — Report / Dashboard in Spanish.
- **Spanish-4** — Customer Proof / Referral / Partner outreach in Spanish.

## Guardrails

- Educational only; no legal/tax/financial/licensing advice.
- No claim the full platform is Spanish yet.
- Direct users to official sources for requirements.
- Neutral U.S. Spanish.
- A professional Spanish review is recommended before any legal or high-risk copy is
  translated in later phases.
