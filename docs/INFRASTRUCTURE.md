# Infrastructure

## Services

| Service | Role | Status |
|---------|------|--------|
| GitHub | Source code at SubZeroMetrix/subzerometrix | Active |
| Vercel | Hosting and deployment | Linked (preview deployment) |
| Supabase | Database, auth, RLS | Migration ready (not yet applied) |
| Stripe | Future SubZero Metrix products | Foundation only (test mode) |
| VPS | Not currently required | Reserved for future use |

## GitHub

- Organization: SubZeroMetrix
- Repository: subzerometrix
- **Default/production branch (verified 2026-07-13 via `gh api repos/.../subzerometrix` and `git ls-remote --symref origin HEAD`): `major-build-1`.** `main` was deleted from the remote at some point after commit `6cf8b4a` (merge-base of the two branches) — it survives only as a stale local ref. This was a deliberate branch-model change (a full platform pivot: trades platform -> affiliate comparison site -> Metrix Command Center landing page, all built as commits on `major-build-1`), not an accident.
- Recommended release flow given this reality: short-lived feature branches -> Vercel preview -> owner review -> PR merged into `major-build-1` (the de facto production branch). Do not recreate `main` unless there's a concrete reason to split release management from the default branch — none has surfaced.
- Rollback tag: pre-major-build-1

## Vercel

- Linked project: subzerometrix
- Framework: Next.js
- Build command: `next build`
- Output directory: `.next`
- Environment variables set in Vercel dashboard

## Supabase

- Migration files: `0001_affiliate_platform_init.sql`, `0002_affiliate_program_extensions.sql`. A third, `0003_mcc_leads.sql` (Metrix Command Center landing-page lead capture), exists in the repo but is **NOT yet applied** — see identity audit below.
- RLS enabled on all tables
- Public read policies on product/category/comparison tables
- No public write access to editorial data
- Service-role key used server-side only

### ⚠️ Unresolved database identity — verified 2026-07-13 (read-only audit, OWNER DECISION NEEDED)

This repo's `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`) and the linked Supabase CLI project both point at project ref **`vzbcunnrkexnmspeiwiu`** ("SubZeroMetrix's Project", org `kleijfslsmvgghomqvox`, created 2026-06-13 — the *earliest* of the four projects in this org). This is confirmed to be a **different, distinct project** from MCC production (`lnfokebqcdlzgnvcxmub`, "command-center", created 2026-06-30) — no MCC ref appears anywhere in this repo, and MCC's own `.env` points only at its own ref.

However, a read-only introspection (Supabase REST OpenAPI spec, service role, no writes) on 2026-07-13 found this project is **not a clean landing-only database**:
- 561 real tables/views (not the 1,608 first reported — that figure was total REST-exposed *paths*, which bundles tables/views with RPC function endpoints; 1,047 of the 1,608 are `/rpc/*` function paths, 561 are actual tables/views).
- Table names match MCC's own application schema exactly (`buster_*`, `scout_*`, `pulse_*`, `crm_*`, `forge_*`, `governance_*`, `agent_*`, `executive_*`, `cc_*`, etc.), and this repo's own `docs/MAJOR-BUILD-2-REPORT.md` states only 2 migrations were applied as of that report — meaning the other ~187 migrations worth of MCC-pattern schema landed here through some other process, not through this repo's migration files.
- Spot-checked row counts confirm this is **not dead/empty legacy schema** — `agent_registry` has 9 rows, `crm_customer_timeline` has 20 rows (both real data, checked read-only via `count=exact`, no rows fetched or modified). This repo's own `lead_signups` table (the real affiliate lead table) has 0 rows, confirming no leads have been captured on this site yet either way.
- Given `vzbcunnrkexnmspeiwiu` predates MCC's dedicated project (`lnfokebqcdlzgnvcxmub`) by 17 days, the most likely explanation is that it briefly served as MCC's shared/default database during early development before MCC was given its own dedicated project on 2026-06-30, and the legacy schema/data were never cleaned out afterward.

**Classification: (c) shared legacy infrastructure — not proven safe for new landing-page lead data as-is.**

**Recommended path (not yet implemented):** provision a dedicated, purpose-built Supabase project for the SubZeroMetrix landing site (new, empty project — cleanest option), or at minimum prove `vzbcunnrkexnmspeiwiu`'s legacy MCC-pattern tables are safely inert/archived before writing new PII (lead names/emails/phone numbers) into the same project. Do not treat shared infrastructure as acceptable without an explicit owner decision — mixing landing-page lead PII with a database that has held real MCC-pattern customer/agent data is a data-governance risk, not just a naming inconvenience.

**OWNER NEEDED:**
1. Confirm what `vzbcunnrkexnmspeiwiu` actually is / was, and whether the 561 MCC-pattern tables with live rows can be safely archived or must be preserved.
2. Decide: new dedicated Supabase project for the landing site, or continue using `vzbcunnrkexnmspeiwiu` after cleanup/isolation is proven.
3. Only after that decision: apply `supabase/migrations/0003_mcc_leads.sql` to the approved destination.

Migration `0003_mcc_leads.sql` is additive-only (new table, new indexes, RLS enabled, no public policies -- service-role/API-route access only, matching the existing `lead_signups` pattern) and does not touch or reference any existing table. It has not been applied anywhere.

## Stripe

- Used for future SubZero Metrix products only
- NOT used for affiliate commissions
- Webhook handler at `/api/webhooks/stripe`
- Signature verification required
- Live mode activation blocked until pricing/tax/refund terms approved

## VPS

No VPS is currently required. The architecture supports future VPS deployment for:
- Background workers
- Analytics aggregation
- Email queue processing
