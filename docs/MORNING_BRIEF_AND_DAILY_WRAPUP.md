# Morning Brief & Daily Wrap-Up — Permanent Specification

*Governed by [`CUSTOMER_PROMISE.md`](./CUSTOMER_PROMISE.md)'s Honest AI principle. Grounded in a read-only audit of `command-center`'s real, already-shipped `daily-reports` and `runtime` routes — not invented. Every claim below about what currently exists is directly evidenced; every item marked "not yet real" is stated as such.*

## What Buster Should Do Every Morning

Based on the real, confirmed "Business Command Bar" (on `/runtime`) and Morning Report (`/daily-reports`, generates 5:00am per its own live label) in `command-center`, the honest current + target scope:

| Item | Current status |
|---|---|
| Overnight changes | REAL — Morning Report shows real follow-ups due/overdue as of generation time |
| Traffic | NOT YET WIRED into Buster's daily report — Vercel Analytics exists on the SubZeroMetrix side (this repo) but is not confirmed integrated into `command-center`'s daily reporting |
| Leads | NOT YET WIRED — `mcc_leads`/`lead_signups` are not confirmed as inputs to the Morning Report this pass |
| Opportunities | REAL — Business Command Bar's Pipeline Value, Revenue At Risk, Recovery Cases tiles are real, computed data |
| Product issues | PARTIAL — `known-gaps` route exists; not confirmed as an automated Morning Report input |
| SEO | NOT YET WIRED |
| AI discoverability | NOT YET WIRED |
| Documentation drift | NOT YET WIRED — this repo's own `DOCUMENTATION_INDEX.md` is the closest real analog, maintained manually this session, not yet automated into any daily report |
| Deployment health | PARTIAL — `command-center` has its own deployment/release history tracking; not confirmed as a Morning Report input |
| Roadmap priorities | PARTIAL — `known-gaps` and this repo's `30-60-90_DAY_PLAN.md`/`TRAFFIC_ENGINE_ROADMAP.md` exist as real artifacts, not yet consolidated into one daily surface |

**Honest summary**: Buster's real, shipped Morning Report today covers overdue/due follow-ups (CRM-side). Traffic, leads, SEO, AI discoverability, documentation drift, and deployment health are real systems that exist *somewhere* (mostly in this repo, some in `command-center`) but are **not yet consolidated into Buster's daily report**. This specification names the target state; it does not claim that state already exists.

## Daily Executive Brief — Permanent Specification

**What exists today (real)**: `command-center`'s `/daily-reports` Morning Report — generates 5:00am, shows real follow-ups due/overdue, empty-state honest when nothing exists ("Nothing due or overdue this morning").

**Target specification** (not yet built — Phase 2/3 per `CUSTOMER_ZERO.md`): a single consolidated brief combining the real CRM data already in the Morning Report with SubZeroMetrix-side signals (new leads since last brief, real Vercel Analytics traffic delta, any real SEO/indexing status change) — genuinely useful because every number is real, with an explicit "nothing to report" state for every section rather than an omitted or fabricated one, matching the existing Morning Report's own honesty pattern ("nothing here is scheduled or emailed yet" — its own words, confirmed live in the code).

## End of Day Report — Permanent Specification

**What exists today (real)**: `command-center`'s `/daily-reports` End-of-Day Report — generates 4:00pm, reports real completed-follow-up counts, real sent-message counts, real approval-decision counts, and a real "tomorrow" preview (due-follow-up count or an honest "nothing scheduled yet").

**Target specification**: extend the same real, honest pattern to cover product-release activity (was anything shipped today — real commit/deploy data, per `DEPLOYMENT.md`'s five-stage process) and, once wired, the SubZeroMetrix-side lead/traffic delta for the day. No fabricated "engagement" metrics, no invented sentiment — only real counts, with an honest zero shown as zero.

## Explicit Non-Claims

Per this task's instruction not to invent unfinished systems: **no scheduling or email delivery of either report is confirmed to exist** — `command-center`'s own Daily Reports page states this directly ("nothing here is scheduled or emailed yet"). This document does not claim otherwise. Any future automation of delivery is Phase 3 work, not yet designed here.
