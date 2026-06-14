# Wave 7 — CP13 Automated Completion & Red-Team Audit

> Scope: the **automated and code-level** Wave 7 audit. It does **not** claim completion of any
> Wave 10A manual or hosted validation, and it is **not** legal approval. Items requiring a person,
> a hosted environment, or qualified counsel are carried in the Wave 10A blocker register below and
> remain launch blockers.

Branch: `feature/metrix-wave7-full-site-ux-discovery` · Audit date: 2026-06-14

## Red-team review — findings

| Check | Result |
| --- | --- |
| Duplicate canonical engines (score/profile/priority/path/progress) | None. CP4 routes results/dashboard through the single `buildCanonicalPresentation` read path; no recompute. |
| Duplicate consent / analytics systems | None added. Tracking reuses Wave 5 `trackEvent` + existing consent gate. |
| Route / ID / storage-key / cloud-table / RLS drift | None. Preservation inventory + migration map tests green; only **additive** routes (`/state/[state]`, `/resource-directory-disclosure`, `/pricing`). |
| Unsafe migrations | None. No migration changes in Wave 7. |
| Unregistered events / private-data exposure | None. Outbound payload is PII-free and consent-gated; context guard rejects private keys. |
| Raw external-link bypass / unverified publication | None. All outbound via canonical redirect; only `live_link_confirmed` records publish. |
| Resource-count mismatch | Reconciled exactly (below). |
| Commercial influence on intelligence | None. Pricing module is **not imported** by the canonical engine (enforced by test). Eligibility/ordering read health/verification only. |
| Unsupported legal/licensing / structured-data claims | None. JSON-LD carries no ratings/reviews/offers; state pages stay verify-before-action. |
| Fake reviews / testimonials / partners / outcomes / scarcity | None. Founding counter is integrity-gated → `unknown` (no number) today. |
| Misleading pricing | Addressed (CP11): one-time vs subscription vs invitation vs lifetime are structurally distinguished; no annual/financing/fabricated-savings/guarantee fields exist. |
| Inaccessible critical flows | Improved (CP12): reduced-motion, touch targets, focus, skip-link/landmark, labeled filters, aria-live. Manual AT review → Wave 10A. |
| Feature flags defaulting ON | None. All flags default OFF (enforced). |
| Indexing of private routes | None. `ROBOTS_DISALLOW` covers private/stateful routes; `/pricing` 404s + sitemap entry both flag-gated. |
| Missing export/delete registration | None new. Resource feedback is device-local (export/delete covered); cloud-sync table deferred (R6). |

## Resource accounting (exact)

- **108** curated records accounted for (`RESOURCE_LAUNCH_IMPORT.length === 108`).
- **88** approved-for-publication / currently published (`getPublishedEcosystemCatalog().length === 88`).
- **20** held for review (`held_for_review`).
- Link audit: **88** healthy of **108** tested; **20** not activatable (14 blocked/403, 4×404, 2 domain-mismatch) remain held.
- **No** 2,063-item master backlog imported.
- Canonical IDs preserved (namespaced `vendor|affiliate|guide:`; reuse/merge keep the import-map canonical id).
- Educational / non-affiliate status preserved (`relationship/affiliate/sponsorship = none` on all 88).
- Consented tracking only; non-consented aggregate tracking still disabled (R1).
- Clicks remain distinct from leads/customers/sales/revenue.

No intentional correction changed the totals this build; the 108 / 88 / 20 split is unchanged.

## State & licensing status

- All six URLs remain generated via `generateStaticParams`: `/state/fl`, `/state/co`, `/state/tx`, `/state/az`, `/state/oh`, `/state/nc`.
- Automated presence confirmed: provenance/authorities, reviewed date, freshness messaging, state-vs-local uncertainty, verify-before-action language, correction-reporting path, educational/not-professional-advice boundaries.
- Source-to-claim **manual** licensing review is **NOT** done here → Wave 10A.

## Legal / compliance automated gate

Reviewed in code/copy: consumer-protection framing (federal + six states), privacy/consent/tracking,
advertising/endorsement disclosures, educational positioning, accessibility, email/SMS consent,
payments/subscriptions/refunds/scarcity, data retention/export/delete, professional licensing and
unauthorized-practice boundaries, education-vs-advice separation. **Unresolved items stay disabled or
held** (see register). This is not legal approval.

## Feature-flag state

All 12 flags default **OFF** (production behavior unchanged). New surfaces (`/pricing`, directory,
states, founding offer) are preview-only via `NEXT_PUBLIC_FF_*`.

## Payment behavior

Unchanged. CP11 added **presentation only**: no live Stripe, no checkout/webhook/entitlement/refund/
subscription/env change. `/unlock` + `/api/checkout` are byte-for-byte untouched. The approved
pricing model is **not** wired to live checkout — see L1 below.

## Wave 10A blocker register (carried forward — remain launch blockers)

1. Hosted Vercel/Supabase cloud-sync validation.
2. Sign-in / save / refresh / cross-session / cross-device restore testing.
3. Hosted export/delete verification.
4. Real-person usability review.
5. Contractor qualitative review across all 10 trades.
6. Source-to-claim licensing review.
7. Manual review of all 6 state URLs.
8. Manual review of the 20 held resource links.
9. Browser/device manual checks.
10. Full-system end-to-end manual review (action → evidence → progress → outcome → reassessment).
11. Live Stripe activation + migrating `/unlock` checkout to the approved pricing model (**L1**).

## Build-C limitations

- **L1 — pricing/checkout divergence:** the live `/unlock` + `/api/checkout` flow still uses the
  prior tiers ($9.99 / $19.99 / $29). The approved model ($0 / $19 / $39mo / $79mo / $649) is
  presentation-only and intentionally does **not** route into live checkout. Aligning live payments
  to the approved model is deferred to Wave 10A (do not enable the pricing presentation flag in
  production until then).
- Founding Lifetime live counter is intentionally inactive (no reliable inventory source) and shows
  truthful unknown availability until a verified-purchase source is wired (Wave 10A).
