# 30-60-90 Day Plan

*See [`POST_LAUNCH_PLAN.md`](./POST_LAUNCH_PLAN.md) and [`LAUNCH_RISK_REGISTER.md`](./LAUNCH_RISK_REGISTER.md). Per `COMPANY_CONSTITUTION.md`: future ideas do not delay launch — this plan explicitly separates Launch Critical from Post Launch from Future Ideas at every horizon.*

## 30 Days

**Launch Critical**
- Resolve `LAUNCH_RISK_REGISTER.md` L-1 (legal review) and L-5 (commercial-funnel cross-repo verification) if not already resolved before initial launch.
- Verify Search Console + Bing Webmaster, submit sitemap (L-2).
- Configure email provider, wire owner lead-notification (L-3).

**Post Launch**
- Run a real accessibility pass (keyboard, screen reader, contrast) — L-4.
- Run real Core Web Vitals measurement — L-6.
- Monitor early lead-capture volume and any spam patterns against the current in-memory rate limiter (L-7) — escalate only if real abuse is observed.

**Future Ideas** (explicitly not scheduled yet)
- Real product screenshots once available (L-8).
- Admin UI for leads (L-9).

## 60 Days

**Post Launch**
- Review first 30 days of real Analytics/lead data; use it to inform any copy or CTA adjustments — evidence-driven, per `PRODUCT_PHILOSOPHY.md`.
- Formalize a support response-time commitment if volume justifies it (L-10).

**Future Ideas**
- Trust/security content expansion, if real customer questions reveal a gap not already covered.

## 90 Days

**Post Launch**
- Reassess `LAUNCH_READINESS.md`'s category scores against real evidence accumulated since launch — update honestly, not aspirationally.

**Future Ideas**
- Admin UI for leads (if not already built at 30/60 days).
- Comparison-page or resource-center content, only if real SEO/traffic data supports it — not before.

## 6 Months

**Future Ideas**
- Contractor/trade-specific landing pages, only where real search-demand evidence justifies each one (avoid programmatic-SEO sprawl, per the earlier homepage audit's explicit risk finding).
- Expanded integrations, only as actually shipped in the MCC product itself (`command-center`), never advertised ahead of real availability.

## 12 Months

**Future Ideas**
- Reassess the full `LAUNCH_READINESS.md` dashboard as a full re-audit, the same rigor as this one — not a status carried forward by assumption.

## Hard Rule

No item in any "Future Ideas" row above may be pulled forward to block or delay a Launch Critical or Post Launch item at an earlier horizon. This is a direct application of `COMPANY_CONSTITUTION.md`'s principle that speculative scope does not get to compete with real, scoped work.
