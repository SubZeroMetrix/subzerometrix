# Launch Status

**Version:** Landing Page V1
**Status:** PRODUCTION
**Frozen:** This document marks the transition of this repository from active feature development to maintenance mode. See "Maintenance Mode" below for what still qualifies as in-scope work.

## Architecture Summary

Next.js 14 (App Router) + TypeScript + Tailwind, deployed on Vercel. The repository serves two distinct, historically-separate products from one domain:

1. **Metrix Command Center marketing/lead-capture** (the homepage and everything under `/help`, `/buster`, `/customer-care`, `/resources`) — the primary product this V1 build cycle focused on. Includes an embedded Buster retrieval assistant (deterministic, source-cited, no LLM), a Help Center, Customer Care request/qualification/referral flows, and an admin view for all of it.
2. **An independent affiliate software-comparison platform** (`/tools`, `/compare`, `/reviews`, `/guides`) — pre-existing, largely untouched during this build cycle, still live and functioning.

The actual Metrix Command Center product (CRM, billing, Buster's full product surface) lives in a separate repository (`command-center`) and is explicitly out of scope for this repository — this domain only markets it and captures leads for it.

## Production URLs

- **Primary:** https://www.subzerometrix.com
- **Product handoff:** https://mcc.subzerometrix.com (separate repo/deployment, not this one)

## Repository

`C:\Users\HP\subzerometrix` — GitHub-hosted, branch `major-build-1` is the active production branch deployed to Vercel.

## Deployment Workflow

1. `npm run lint` && `npx tsc --noEmit` && `npm run build` — all must pass locally first.
2. Commit only the intentional files for the change (never `git add -A` — this repo has standing unrelated WIP files that must never be swept into a commit).
3. `git push origin major-build-1`.
4. `vercel --prod` — explicit production deploy (do not rely on any automatic/preview deploy as proof of production state).
5. `vercel inspect www.subzerometrix.com --json` — confirm the live alias's deployment ID matches the one just deployed. This step is mandatory; a prior incident in this project's history involved the alias silently serving a stale deployment.
6. Live-verify the actual change (route smoke test at minimum; Lighthouse for anything touching a public page's markup/performance).

## Environment Variable Inventory (names only)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used in metadata/sitemap fallbacks |
| `NEXT_PUBLIC_SUPABASE_URL` | Main Supabase project — admin authentication + legacy affiliate CMS data |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Main Supabase project, browser-safe key |
| `SUPABASE_SERVICE_ROLE_KEY` | Main Supabase project, server-only |
| `MCC_LEADS_SUPABASE_URL` | Isolated landing-page project — all new submission/content tables |
| `MCC_LEADS_SUPABASE_SERVICE_ROLE_KEY` | Isolated landing-page project, server-only |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Inert scaffold for a future, unrelated SubZero Metrix product — not used by anything live on this domain today |
| `EMAIL_PROVIDER` / `EMAIL_PROVIDER_API_KEY` / `EMAIL_LIST_ID` | Pre-existing, never wired to a real provider — dead configuration, predates this build cycle |
| `RESEND_API_KEY` | Owner notification emails (leads, customer-care, qualification, referral, written help feedback) — **not currently configured** |
| `ANALYTICS_PROVIDER` / `NEXT_PUBLIC_ANALYTICS_ID` | Pre-existing, unreferenced by any code — dead configuration |
| `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` | Search-engine ownership verification meta tags — delivery mechanism is correctly wired; **codes not yet configured** |
| `AFFILIATE_CLICK_SIGNING_SECRET` | Affiliate platform, pre-existing |
| `CONTACT_EMAIL` | Documented, not referenced in code as of this freeze |
| `ADMIN_EMAIL_ALLOWLIST` | Comma-separated list of emails permitted admin access; defaults to `info@subzerometrix.com` if unset — enforced server-side on every `/api/admin/*` route |

## Supabase Responsibilities

Three distinct projects are in play. Isolation between them is a hard, repeatedly-verified rule — never mix data or credentials across these:

- **`sskgceffpkiuxjhlyjjr`** ("SubZeroMetrixLandingPage") — the isolated project this build cycle's new work lives in: `mcc_leads`, `help_articles`, `help_feedback`, `customer_care_requests`, `qualification_responses`, `referral_partner_interest`, `landing_events`, `buster_questions`. All RLS-enabled, no public policies — every write/read goes through a server-side route using the service-role key.
- **`vzbcunnrkexnmspeiwiu`** ("SubZeroMetrix's Project") — the main/shared project. Serves two purposes: (1) admin authentication for every `/admin/*` page (Supabase Auth, email-allowlist-gated), and (2) the affiliate platform's own data (products, `lead_signups`, `contact_submissions`, affiliate links). This project also contains a large amount of unexplained legacy schema unrelated to either purpose (documented in `docs/INFRASTRUCTURE.md`) — never assume a table here is safe to use without checking its actual schema first.
- **`lnfokebqcdlzgnvcxmub`** ("command-center") — MCC production. Never touched by this repository.

## Known Accepted Risks

- **Next.js 14.2.35 has 2 known CVEs** (one moderate, one high) with no available 14.x patch — the only fix is a major v16 migration, explicitly deferred as out of scope for a maintenance-mode repository absent a demonstrated exploit path against this site's actual usage.
- **No Content-Security-Policy header.** Other security headers (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS) are present and correct. Adding a CSP safely requires dedicated violation-testing infrastructure not built out yet.
- **Buster's retrieval is deterministic keyword/concept-overlap matching, not vector-embedding semantic search** — accurately documented as such everywhere it's described (code comments, `llms.txt`). No LLM or embeddings API credential is configured in this environment; this was a deliberate, disclosed architectural choice, not a limitation to silently work around later without reconsidering the no-hallucination guarantee it currently provides.
- **`EMAIL_PROVIDER`/`ANALYTICS_PROVIDER` env vars are dead configuration** (documented, never wired to a real integration) — predates this build cycle, left as-is rather than removed, since their removal wasn't in scope and doesn't affect anything live.

## Owner-Only Operational Tasks

None of the following can be completed by an AI agent without the actual account access involved:

1. Add a real `RESEND_API_KEY` (Resend account + verified sending domain) so owner notification emails actually deliver.
2. Obtain real `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` codes from Google Search Console / Bing Webmaster Tools, add them to Vercel, then submit `https://www.subzerometrix.com/sitemap.xml` in both.
3. Confirm in the Supabase dashboard (`vzbcunnrkexnmspeiwiu` → Authentication → Providers) whether public email signup is enabled — if it is, the admin allowlist is the only thing standing between a self-registered account and the admin panel.
4. Periodically check `/admin/submissions` and `/admin/buster` for real customer activity — there is no owner-notification fallback if `RESEND_API_KEY` remains unconfigured.

## Post-Launch Maintenance Policy

**This repository is in maintenance mode as of this freeze.** Future work is limited to:

- Verified bugs
- Security issues
- Legal/compliance changes
- Accessibility issues
- Production incidents
- Customer-driven improvements (i.e., changes justified by real submitted feedback/questions logged in `/admin/submissions` or `/admin/buster`, not speculative new features)

**New product features belong in MCC** (the `command-center` repository), not here. This repository's job is to market that product and capture leads for it — not to grow its own feature surface indefinitely.
