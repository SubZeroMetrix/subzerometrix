# Go-Live Criteria

*The formal launch gate. Governed by [`COMPANY_CONSTITUTION.md`](./COMPANY_CONSTITUTION.md)'s Definition of Success and [`ENGINEERING_CONSTITUTION.md`](./ENGINEERING_CONSTITUTION.md)'s Definition of Done. See [`LAUNCH_READINESS.md`](./LAUNCH_READINESS.md) and [`LAUNCH_RISK_REGISTER.md`](./LAUNCH_RISK_REGISTER.md) for supporting detail.*

The site is technically already live and publicly reachable at `www.subzerometrix.com` — this document defines when it is ready to be actively promoted/announced as launched, not when the URL merely resolves.

## Must Pass (CRITICAL — launch cannot be announced with any of these unresolved)

- [x] **L-1 — RESOLVED:** owner confirmed attorney review of `/terms` and `/privacy` content has been completed and approved; draft markers removed. See `LAUNCH_RISK_REGISTER.md` L-1.
- [x] Lead capture fully isolated, tested end-to-end, no cross-contamination with MCC production or the legacy shared Supabase project. *(Verified this session.)*
- [x] Live site serves the current, correct code (five-stage release process passing). *(Verified this session.)*
- [ ] **L-5 — OWNER ACTION REQUIRED:** commercial funnel is TECHNICALLY VERIFIED at the code level (real Stripe checkout, real founder-code/cap enforcement, real idempotent webhook, real entitlement-gated billing portal — all confirmed via read-only audit of `command-center` this pass), but no live end-to-end test was run (no confirmed test-mode credential, `STRIPE_SECRET_KEY` not set locally) and production Stripe mode was not verified. A real signup test inside `command-center` is still required.

## Should Pass (HIGH — strongly recommended before active promotion, not a hard block)

- [ ] Search Console + Bing Webmaster verified and sitemap submitted.
- [ ] Email provider configured, owner notified on new leads.
- [ ] Accessibility independently verified (keyboard nav, screen reader, contrast).

## Nice to Have (MEDIUM/LOW — do not block launch)

- [ ] Real product screenshot/dashboard preview.
- [ ] Core Web Vitals measured.
- [ ] Admin UI for leads.
- [ ] Formal support SLA.

## Explicit Non-Blockers

Per `COMPANY_CONSTITUTION.md`'s principle that future ideas do not delay launch (see `30-60-90_DAY_PLAN.md`): contractor/trade-specific landing pages, a resource center/blog, comparison-page expansion, and any additional product marketing pages are explicitly **not** required for go-live.

## Current Gate Status

**BLOCKED — narrowed further.** L-1 is now RESOLVED (owner-confirmed attorney sign-off). L-5 remains open: technically de-risked (see `LAUNCH_RISK_REGISTER.md`) but still needs a live end-to-end checkout test executed inside `command-center`, which this repo cannot perform. That single remaining Must-Pass item should be checked off, or explicitly and knowingly waived by the founder in writing, before this site is actively promoted as launched.
