# AI Discoverability Audit & Roadmap

*Governed by [`ENGINEERING_CONSTITUTION.md`](./ENGINEERING_CONSTITUTION.md) (evidence over assertion — every finding below was verified live, not assumed) and [`BRAND_CONSTITUTION.md`](./BRAND_CONSTITUTION.md) (claims policy). See [`SEO_CONTENT_ARCHITECTURE.md`](./SEO_CONTENT_ARCHITECTURE.md) for the content this feeds.*

## Current State (verified live, this pass)

| Signal | Status | Detail |
|---|---|---|
| `llms.txt` | LIVE, accurate | Correctly describes both products on this domain (fixed in an earlier pass this session — previously described only the affiliate platform) |
| `llms-full.txt` | LIVE, accurate | Includes MCC section plus full affiliate content listing |
| Organization schema | LIVE | On homepage |
| SoftwareApplication schema | LIVE | On homepage, includes both real `Offer` entries ($99/$39) |
| FAQPage schema | LIVE | On homepage, 13 real questions |
| WebSite schema | **NOT on homepage** | `websiteSchema()` exists in `lib/seo.ts` but is not called from `app/page.tsx` (only `organizationSchema()` and the local `softwareSchema`/`faqSchema` are) |
| BreadcrumbList schema | NOT PRESENT | Correctly absent — homepage is a single page, no breadcrumb trail exists yet; becomes relevant once `/resources/*` pages exist |
| Open Graph | LIVE | Complete (title/description/url/image/type) |
| Twitter Card | LIVE | Complete |
| Canonical URL | LIVE, correct | Points at `www.subzerometrix.com` (fixed earlier this session — previously pointed at the redirecting apex) |
| AI crawler policy (`robots.ts`) | LIVE | Explicit rules for `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot` (allowing broader content paths than the generic `*` rule) |
| Entity consistency | MOSTLY consistent | "SubZero Metrix LLC" (legal entity) vs. "SubZero Metrix" (brand) vs. "Metrix Command Center" (product) — used correctly in context throughout, no contradictions found this pass |

## Gaps Found

1. **`WebSite` schema not wired into the homepage** — exists as a function, never called. Real, small, honest fix (not built this pass — this document is planning only, per this task's "do not build pages" instruction covers content pages; this is a one-line schema wire-up that belongs in a future execution pass, not fabricated as done here).
2. **No `Person` schema for the founder** — appropriate once a real, honest founder bio/photo exists (see `LAUNCH_RISK_REGISTER.md` L-8 — no fabricated content). Do not add `Person` schema referencing content that doesn't exist yet.
3. **No `BreadcrumbList`** — not a gap today (single homepage), becomes required once `/resources/*` pillar/cluster pages are built (see `SEO_CONTENT_ARCHITECTURE.md`).
4. **No `HowTo` or `Article` schema** — will be needed once guide/checklist content exists; do not add prematurely to pages that don't exist.
5. **Semantic content structure** — the homepage's heading hierarchy (1×H1, multiple H2/H3) is sound; future resource pages must follow the same discipline (one H1, logical H2/H3 nesting, no skipped levels) — a structural rule for future content, not a current defect.

## AI Crawler Policy — current allow-list

`robots.ts` currently allows `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Googlebot`, `Bingbot`, and `*` broad access to public routes, disallowing `/api/`, `/admin/`, `/go/`. This is a sound, permissive-by-default policy consistent with wanting AI-search discoverability — no change recommended.

## Roadmap (planning only — see `TRAFFIC_ENGINE_ROADMAP.md` for phase sequencing)

- Wire `websiteSchema()` into the homepage (trivial, high-value, currently just an unused export).
- Add `BreadcrumbList` schema once `/resources/*` exists.
- Add `Article`/`HowTo` schema per guide/checklist page as those are actually built, matching real content — never speculative.
- Add `Person` schema for the founder only alongside a real, honest bio (never before).
- Re-audit entity consistency each time a new content section ships, since new pages are the most common source of drift.
