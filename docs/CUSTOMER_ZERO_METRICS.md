# Customer Zero Metrics & Executive Dashboard

*Governed by [`ENGINEERING_CONSTITUTION.md`](./ENGINEERING_CONSTITUTION.md)'s evidence-over-assertion principle. Every KPI below is marked by whether it is currently measurable from real, confirmed systems, or not yet — no invented numbers appear anywhere in this document.*

## KPI Framework

| KPI | Measurable today? | Real source |
|---|---|---|
| Visitors | YES (infrastructure only — near-zero real volume so far) | Vercel Analytics, this repo, live since this session's earlier pass |
| Leads | YES | `mcc_leads` (isolated Supabase, this repo) + `lead_signups` (affiliate platform) — both real tables, currently near-zero real rows |
| Qualified Leads | NOT YET DEFINED | No qualification-scoring system confirmed in `command-center` this pass — see `CUSTOMER_ZERO.md`'s Phase 2 |
| Trials | YES (product-side, `command-center`) | Real Stripe Checkout with `trial_period_days: 7`, confirmed real code this session; no live trial count reviewed this pass (would require CRM data access beyond this read-only pass's scope) |
| Paid Customers | YES (product-side, `command-center`) | `crm/customers` route real; real customer count not reviewed this pass |
| Conversion Rate | NOT YET COMPUTABLE | Requires real Visitor→Lead→Trial→Customer volume; current volume is too low/unverified to produce a meaningful rate — do not fabricate one |
| CAC | NOT YET COMPUTABLE | Requires real marketing spend data; none confirmed tracked yet |
| LTV | NOT YET COMPUTABLE | Requires real customer-retention history over time; company is too early-stage for this to exist yet |
| Churn | NOT YET COMPUTABLE | Same reason as LTV |
| Feature Requests | PARTIAL | `known-gaps` route exists in `command-center`; not confirmed as a formal feature-request intake system |
| Bugs | PARTIAL | Same — `known-gaps` is the closest real artifact found this pass |
| Release Velocity | YES | `command-center`'s own build/commit history is real and extensively documented (per its own `BUILD_HISTORY.md`, referenced in prior sessions); this repo's `DEPLOYMENT.md` five-stage process provides real release tracking for the marketing site |
| SEO Growth | PARTIAL | Search Console/Bing not yet verified (see `LAUNCH_RISK_REGISTER.md` L-2) — no real ranking/indexing trend data exists yet to report |
| AI Traffic | NOT YET COMPUTABLE | No AI-referral tracking confirmed; `llms.txt`/AI crawler allowlist are real (see `AI_DISCOVERABILITY_AUDIT.md`) but downstream traffic attribution isn't wired |
| Organic Traffic | PARTIAL | Vercel Analytics is real and live; organic-specific segmentation not confirmed reviewed this pass |

**Honest summary**: This company is early-stage enough that several standard SaaS KPIs (CAC, LTV, Churn, Conversion Rate) are not yet meaningfully computable — not because the systems to compute them don't exist, but because there isn't yet enough real volume/history to produce a non-fabricated number. This document names that gap rather than inventing a placeholder metric.

## Executive Dashboard — What the CEO Should See First Every Morning

Grounded in the real, confirmed "Business Command Bar" on `command-center`'s `/runtime` page (live-verified this pass, not invented):

1. **Pipeline Value** ($, real, computed from CRM data)
2. **Revenue At Risk** ($, real, shown only when non-zero — confirmed conditional rendering in the real code)
3. **Overdue Follow-Ups** (count, real, styled as a warning when non-zero)
4. **Jobs Today** (count, real)
5. **Estimates Waiting** (count, real)
6. **Recovery Cases** (count, real)
7. **Customers** (count, real)
8. **Open Approvals** (count, real, styled as a warning when non-zero)
9. **"Waiting on You"** — a real, count-badged task inbox showing the top 5 items needing a decision, each with a single real action link

**Target extension (not yet built)**: a SubZeroMetrix-side row (real Vercel Analytics traffic delta, real new-lead count since last view) alongside the above — consolidating both repos' real signals into one first-look surface, per `CUSTOMER_ZERO.md`'s Phase 2. Not claimed as existing today.

## Cross-Reference Validation

Checked against `COMPANY_CONSTITUTION.md` (no contradiction — this document's honesty about unmeasurable KPIs directly reflects the "truth over hype" core value), `ENGINEERING_CONSTITUTION.md` (Definition of Done requires proof, not assertion — this document supplies proof or explicitly withholds a claim), `PRODUCT_PHILOSOPHY.md` (evidence over hype), `LAUNCH_READINESS.md` (Analytics category already correctly notes "zero real traffic data yet, too new" — consistent with this document, not contradicted), `FOUNDER_PROFILE.md` (no conflict), and the real `command-center` architecture as directly observed this pass.
