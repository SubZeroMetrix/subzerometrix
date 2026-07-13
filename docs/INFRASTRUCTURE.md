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
- **Full release process, including the mandatory five-stage verification (COMMITTED / PUSHED / VERCEL DEPLOYED / PRODUCTION ALIASED / LIVE VERIFIED) and the stale-alias safeguard: see `docs/DEPLOYMENT.md`.** A GitHub commit-status "success" is stage 3 only — it does not prove the production domain is serving that commit (a real 2026-07-13 incident: `4c4297a` showed deployed-successfully on GitHub while `www.subzerometrix.com` still served an older build).

## Vercel

- Linked project: `sub-zero-metrix/subzerometrix`
- Production domain: `www.subzerometrix.com` (apex `subzerometrix.com` 308-redirects to it), DNS configured and verified live 2026-07-13
- Framework: Next.js
- Build command: `next build`
- Output directory: `.next`
- Environment variables set in Vercel dashboard (Production + Preview) — see `.env.example`
- `.vercel/` (local project-link metadata) is gitignored, never committed

## Supabase

- Migration files: `0001_affiliate_platform_init.sql`, `0002_affiliate_program_extensions.sql` — applied to this repo's shared affiliate-site project (`vzbcunnrkexnmspeiwiu`), which remains this repo's linked CLI project and continues to serve `lead_signups`, `contact_submissions`, `affiliate_links`/`affiliate_click_events` (`/go/[slug]`), and the admin CMS.
- `0003_mcc_leads.sql` — **RESOLVED 2026-07-13.** Applied instead to a brand-new, dedicated, isolated project, **`SubZeroMetrixLandingPage`** (ref `sskgceffpkiuxjhlyjjr`, created 2026-07-13), owner-provisioned specifically to close the identity gap below. Verified clean before and after apply (`supabase migration list --linked` showed zero prior migrations; post-apply shows exactly `0001` local==remote, no drift). `src/app/api/mcc-lead/route.ts` now uses a second, dedicated client (`createMccLeadsAdminClient()` in `src/lib/supabase/admin.ts`), reading new env vars `MCC_LEADS_SUPABASE_URL`/`MCC_LEADS_SUPABASE_SERVICE_ROLE_KEY` — the app's primary `NEXT_PUBLIC_SUPABASE_URL`/keys are untouched, so `/go/[slug]` and the admin CMS pages (which depend on the shared project) are unaffected.
- RLS enabled on all tables
- Public read policies on product/category/comparison tables
- No public write access to editorial data
- Service-role key used server-side only

### Resolved: landing-page database identity — 2026-07-13

This repo's `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`) and the linked Supabase CLI project both point at project ref **`vzbcunnrkexnmspeiwiu`** ("SubZeroMetrix's Project", org `kleijfslsmvgghomqvox`, created 2026-06-13 — the *earliest* of the four projects in this org). This is confirmed to be a **different, distinct project** from MCC production (`lnfokebqcdlzgnvcxmub`, "command-center", created 2026-06-30) — no MCC ref appears anywhere in this repo, and MCC's own `.env` points only at its own ref.

However, a read-only introspection (Supabase REST OpenAPI spec, service role, no writes) on 2026-07-13 found this project is **not a clean landing-only database**:
- 561 real tables/views (not the 1,608 first reported — that figure was total REST-exposed *paths*, which bundles tables/views with RPC function endpoints; 1,047 of the 1,608 are `/rpc/*` function paths, 561 are actual tables/views).
- Table names match MCC's own application schema exactly (`buster_*`, `scout_*`, `pulse_*`, `crm_*`, `forge_*`, `governance_*`, `agent_*`, `executive_*`, `cc_*`, etc.), and this repo's own `docs/MAJOR-BUILD-2-REPORT.md` states only 2 migrations were applied as of that report — meaning the other ~187 migrations worth of MCC-pattern schema landed here through some other process, not through this repo's migration files.
- Spot-checked row counts confirm this is **not dead/empty legacy schema** — `agent_registry` has 9 rows, `crm_customer_timeline` has 20 rows (both real data, checked read-only via `count=exact`, no rows fetched or modified). This repo's own `lead_signups` table (the real affiliate lead table) has 0 rows, confirming no leads have been captured on this site yet either way.
- Given `vzbcunnrkexnmspeiwiu` predates MCC's dedicated project (`lnfokebqcdlzgnvcxmub`) by 17 days, the most likely explanation is that it briefly served as MCC's shared/default database during early development before MCC was given its own dedicated project on 2026-06-30, and the legacy schema/data were never cleaned out afterward.

**Resolution:** owner provisioned a new, dedicated Supabase project (`SubZeroMetrixLandingPage`, `sskgceffpkiuxjhlyjjr`) rather than cleaning up or reusing `vzbcunnrkexnmspeiwiu`. `0003_mcc_leads.sql` applied there only. `vzbcunnrkexnmspeiwiu`'s legacy MCC-pattern schema (561 tables/views, 1,047 RPCs, live rows in some tables per the 2026-07-13 forensic audit) was left completely untouched — its origin remains only LIKELY-explained (see the forensic audit session notes), not fully proven, and it is out of scope for this repo to clean up unilaterally.

**Still open, not urgent:** no admin view exists yet for the new `mcc_leads` table (leads are retrievable via direct Supabase query/dashboard on `sskgceffpkiuxjhlyjjr` only, no `/admin/mcc-leads` UI built). No owner-notification email is wired for new submissions.

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
