# Traffic Engine — Master Execution Roadmap

*The single execution plan tying together [`SEO_CONTENT_ARCHITECTURE.md`](./SEO_CONTENT_ARCHITECTURE.md), [`CONTENT_CALENDAR.md`](./CONTENT_CALENDAR.md), [`AI_DISCOVERABILITY_AUDIT.md`](./AI_DISCOVERABILITY_AUDIT.md), and [`LINK_AND_DISTRIBUTION_STRATEGY.md`](./LINK_AND_DISTRIBUTION_STRATEGY.md). Cross-referenced against [`COMPANY_CONSTITUTION.md`](./COMPANY_CONSTITUTION.md), [`BRAND_CONSTITUTION.md`](./BRAND_CONSTITUTION.md), [`PRODUCT_PHILOSOPHY.md`](./PRODUCT_PHILOSOPHY.md), [`ENGINEERING_CONSTITUTION.md`](./ENGINEERING_CONSTITUTION.md), [`LAUNCH_READINESS.md`](./LAUNCH_READINESS.md), and [`FOUNDER_PROFILE.md`](./FOUNDER_PROFILE.md) — no contradictions found; this plan explicitly defers to `LAUNCH_READINESS.md`'s existing CRITICAL blockers (legal, commercial funnel) and does not compete with or delay them, per `COMPANY_CONSTITUTION.md`'s "future ideas do not delay launch" principle. Planning only — no pages built, no billing/auth/lead-flow/legal/pricing/production infrastructure touched.*

## Resource Center Design

- **Guides** — long-form pillar/cluster content per `SEO_CONTENT_ARCHITECTURE.md` and `CONTENT_CALENDAR.md`.
- **Calculators** — real, functional, user-input-driven tools (e.g., missed-follow-up revenue impact, trial-to-value ROI) — no fabricated benchmark data, calculations only from what the user enters.
- **Checklists** — genuinely useful, downloadable, standalone value (e.g., seasonal maintenance checklist) — not thin lead-gen bait.
- **Templates** — real, usable document templates (e.g., new-customer onboarding SOP) — same standard.
- **SOPs** — standard operating procedure templates drawing on the founder's real facilities/operations background — genuine expertise, not generic filler.
- **Downloadable resources** — PDF/document versions of the above, gated behind the existing lead-capture form only where it adds real value (a calculator doesn't need gating; an in-depth template pack might, at the founder's discretion) — never gate content that isn't worth the trade.
- **ROI tools** — connect real product economics (disclosed pricing, real trial terms) to a user's own numbers — never a generic, unverifiable ROI claim.

## Google / Search Engine Preparation

Per `LAUNCH_RISK_REGISTER.md` L-2 (already tracked, not duplicated here):
- **Search Console**: verify ownership, submit sitemap, monitor coverage — still not started as of `LAUNCH_READINESS.md`'s last audit.
- **Bing Webmaster Tools**: same, still not started.
- **IndexNow**: infrastructure already exists in this repo (`src/lib/indexnow.ts`, `.well-known/indexnow`) — confirm it fires correctly once new resource-center pages start publishing; do not build new IndexNow infrastructure, use what's already there.
- **Image SEO**: every resource-center image needs real, descriptive alt text (per the accessibility standard already established this session) and appropriately sized/optimized files via `next/image`, consistent with existing homepage practice.
- **Video SEO**: not applicable until real video content exists (see `LINK_AND_DISTRIBUTION_STRATEGY.md`'s YouTube section — sequenced later, not fabricated ahead of real content).
- **Sitemap strategy**: `sitemap.ts` currently lists a handful of static routes. Once `/resources/*` pages exist, the sitemap must be extended to include them (dynamically generated from real published content, not a hardcoded speculative list).
- **Indexing strategy**: new pillar/cluster pages should be indexable by default (matching the homepage's `robots: index, follow` pattern), submitted via IndexNow on publish, and monitored via Search Console coverage reports for actual indexing status — not assumed.

## Conversion Opportunities

Every resource-center page should offer a real, non-intrusive path back to the product: contextual links to the relevant homepage section (`#features`, `#buster`, `#trust`, `#pricing`), and the existing lead-capture form reused (not duplicated) where a genuine "want help with this" moment exists (e.g., end of a calculator result). No new lead-capture mechanism should be built without going through the same isolated-database discipline already established for `mcc_leads` — see `INFRASTRUCTURE.md`. No fabricated urgency, no pop-ups, no dark patterns, per `BRAND_CONSTITUTION.md`.

## Execution Roadmap

### Phase 1 — Foundation (CRITICAL/HIGH)
- **CRITICAL**: Resolve `LAUNCH_READINESS.md`'s existing CRITICAL blockers (legal review, commercial funnel live test) — this traffic-engine work must never be prioritized ahead of those, per `COMPANY_CONSTITUTION.md`.
- **HIGH**: Search Console + Bing Webmaster verification (already tracked as L-2, executed here as part of this foundation).
- **HIGH**: Wire `websiteSchema()` into the homepage (small, real, currently-missing fix identified in `AI_DISCOVERABILITY_AUDIT.md`).
- **HIGH**: Build the resource hub structure and the single Launch Window pillar (AI for Contractors) per `CONTENT_CALENDAR.md`.

### Phase 2 — First 90 Days Content (HIGH/MEDIUM)
- **HIGH**: Publish HVAC and Facility Management pillars — the founder's strongest authenticity assets, highest ROI per `CONTENT_CALENDAR.md`'s prioritization rule.
- **HIGH**: Build the first real calculator tool (missed-follow-up revenue impact).
- **MEDIUM**: Publish Business Operations and Mechanical pillars.
- **MEDIUM**: First downloadable checklist/template.
- **MEDIUM**: Extend `sitemap.ts` to include newly published resource pages.

### Phase 3 — Expansion (MEDIUM)
- **MEDIUM**: Electrical and Plumbing pillars, sequenced later specifically to allow time for real subject-matter input rather than generic content.
- **MEDIUM**: Add `BreadcrumbList` schema now that `/resources/*` exists.
- **MEDIUM**: Begin partnership/distribution outreach per `LINK_AND_DISTRIBUTION_STRATEGY.md`, now that real content exists to point to.
- **LOW**: First ROI calculator tied to disclosed pricing.

### Phase 4 — Authority & Optimization (MEDIUM/LOW)
- **MEDIUM**: Evidence-driven reprioritization of remaining content based on real Search Console/Analytics data, per `PRODUCT_PHILOSOPHY.md`'s continuous-improvement principle.
- **LOW**: Podcast/guest-article/PR outreach, once a real content library and traffic history exist to support the pitch.
- **LOW**: YouTube channel consideration, only with real, non-placeholder video content ready.
- **LOW**: Annual content audit process, formalized as a recurring practice.

## Explicit Non-Blockers

None of Phase 2-4 above may delay or compete with `LAUNCH_READINESS.md`'s existing CRITICAL items, per `COMPANY_CONSTITUTION.md` and `GO_LIVE_CRITERIA.md`'s explicit non-blocker principle already established.
