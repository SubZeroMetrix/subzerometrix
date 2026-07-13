# Go-Live Criteria

*The formal launch gate. Governed by [`COMPANY_CONSTITUTION.md`](./COMPANY_CONSTITUTION.md)'s Definition of Success and [`ENGINEERING_CONSTITUTION.md`](./ENGINEERING_CONSTITUTION.md)'s Definition of Done. See [`LAUNCH_READINESS.md`](./LAUNCH_READINESS.md) and [`LAUNCH_RISK_REGISTER.md`](./LAUNCH_RISK_REGISTER.md) for supporting detail.*

The site is technically already live and publicly reachable at `www.subzerometrix.com` — this document defines when it is ready to be actively promoted/announced as launched, not when the URL merely resolves.

## Must Pass (CRITICAL — launch cannot be announced with any of these unresolved)

- [ ] **L-1 resolved:** Legal review of combined domain content (Terms/Privacy/Affiliate Disclosure vs. actual current MCC + affiliate content and data flows) completed, or explicit founder acceptance of risk recorded.
- [x] Lead capture fully isolated, tested end-to-end, no cross-contamination with MCC production or the legacy shared Supabase project. *(Verified this session.)*
- [x] Live site serves the current, correct code (five-stage release process passing). *(Verified this session.)*
- [ ] Commercial funnel (this page → `mcc.subzerometrix.com/signup` → real billing) verified end-to-end, including the `command-center` side. *(Out of this repo's scope — must be confirmed against `command-center`'s own readiness.)*

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

**BLOCKED.** One CRITICAL item (L-1, legal review) and one CRITICAL item outside this repo's direct control (commercial-funnel cross-repo verification) remain open. All Must-Pass items should be checked off, or explicitly and knowingly waived by the founder in writing, before this site is actively promoted as launched.
