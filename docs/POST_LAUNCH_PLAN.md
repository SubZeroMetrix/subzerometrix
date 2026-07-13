# Post-Launch Plan

*See [`30-60-90_DAY_PLAN.md`](./30-60-90_DAY_PLAN.md) for the timed roadmap this plan feeds into. Governed by [`PRODUCT_PHILOSOPHY.md`](./PRODUCT_PHILOSOPHY.md)'s continuous-improvement principle.*

## Immediate Post-Launch (first 7 days)

- Monitor Vercel Analytics daily for real traffic patterns.
- Monitor `mcc_leads` in the isolated Supabase project daily — this is currently the only visibility into leads (no admin UI, no email notification yet — see `LAUNCH_RISK_REGISTER.md` L-3, L-9).
- Watch Vercel logs for any unexpected errors (`vercel logs www.subzerometrix.com`), per the pattern already established in `DEPLOYMENT.md`.
- Confirm Search Console / Bing Webmaster begin showing real indexing data once submitted.

## Resolve Remaining Launch Risks

Work through `LAUNCH_RISK_REGISTER.md` in severity order: L-1 (legal) and L-5 (commercial funnel cross-repo verification) first, then L-2/L-3/L-4 (SEO consoles, email, accessibility), then L-6 through L-10.

## Continuous Improvement Loop

Per `PRODUCT_PHILOSOPHY.md`: product and content decisions post-launch should be driven by real, observed evidence (actual traffic behavior, actual lead patterns, actual support questions) — not speculation about what might help. This is the same evidence-over-assertion discipline used to build the site itself.

## What This Plan Does Not Cover

Anything inside `command-center` (the MCC product application) is out of this repository's scope and should be tracked in that repository's own post-launch documentation.
