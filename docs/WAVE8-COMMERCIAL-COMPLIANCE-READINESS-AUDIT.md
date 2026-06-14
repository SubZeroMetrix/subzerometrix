# SubZeroMetrix — Wave 8 Commercial & Compliance Readiness Audit

> **Audit / planning only.** No application code was modified for this document. Nothing
> recommended here is legal advice. Items with legal or authoritative-source uncertainty are
> labeled and remain **blocked/disabled (fail-safe)** until resolved.

---

## 1. Release-health result

Run once on unchanged `main` (post Build C merge):

| Check | Command | Result |
| --- | --- | --- |
| Tests | `npm test` | ✅ **320 / 320 pass**, 0 fail, 0 skipped (~5.0s) |
| Types | `npm run typecheck` (`tsc --noEmit`) | ✅ clean |
| Lint | `npm run lint` (`next lint`) | ✅ no warnings or errors |
| Build | `npm run build` (`next build`) | ✅ compiled; all routes generated |
| Whitespace | `git diff --check` | ✅ clean |
| Tree | `git status --short` | ✅ clean (no output) |

**Compliance invariants confirmed (code + test backed):**

- All 12 feature flags default **OFF** (`featureFlags.ts`; tested). Flags gate only new surfaces;
  never scoring/priority/gate/pathway/recommendation logic.
- Approved pricing is **presentation-only** — `/pricing` 404s unless `presentation_shell` is on;
  `PricingTiers` wires no checkout (only the free plan CTA → `/start`).
- **Live Stripe unchanged** — `/unlock` + `/api/checkout` still serve the prior legacy tiers; no
  new model wiring.
- **Legacy `/unlock` isolated** — separate price map (`TIER_PRICES`), separate page; the approved
  model never routes into it.
- **Founding Lifetime shows no fabricated availability** — `FOUNDING_AVAILABILITY` resolves to
  `unknown` (no number, inactive counter); `lifetime_offer_presentation` flag OFF.
- **88 published / 20 held reconciles** — `publishedLaunchCatalog.ts` = 88 `resourceId`s;
  `resourceLinkAudit.ts` `ACTIVATED_COUNT = 88`, `testedCount = 108` (20 not activatable).
- **Held resources remain unpublished** — published catalog gated; tested.
- **Canonical redirect intact** — `/resources/go/[resourceId]` fails safe (404) unless flag on +
  verified+active record; query stripped; status-leak-free.
- **Consent/analytics unchanged** — outbound analytics consent-gated, allow-listed, query-stripped
  (tested); `analytics.ts` is a no-op stub (no network).
- **No route / canonical ID / storage key / migration / RLS / cloud-sync regression** — schema and
  migrations untouched; preservation tests pass.
- **No human-coaching language**; **no duplicate Metrix engine** (single engine via
  `src/lib/metrix/index.ts`).

**STOP GATE: not triggered.** Main is synchronized, tree clean, all checks pass, no flag defaults
ON, Stripe unchanged, pricing not publicly active, held resources private, no non-consented
tracking, no schema/route drift. No legally-uncertain behavior has been implemented (it remains
held/disabled).

## 2. Main and merge commit hashes

- **Build C PR:** #14 — `feature/metrix-wave7-full-site-ux-discovery` → `main` (**merged**).
- **Merge commit:** `1ad6758`
- **Current `main` HEAD:** `1ad6758` (local `main` == `origin/main`, fast-forwarded from `ae97915`).
- **Wave 7 CP11–CP13 present:** `3135523` (CP11 pricing/founding), `8762249` (CP12 a11y/perf),
  `350947b` (CP13 quality/preservation audit) — all on `main`, none reverted.

## 3. Current implementation inventory

**Approved pricing model (display only):**
- `src/lib/pricing/pricingPlans.ts` — source of truth: Free / `$19` one-time Roadmap Pass (incl.
  30-day Build, never auto-renews) / `$39`/mo Build / `$79`/mo Growth (invitation-only) / `$649`
  Founding Lifetime (one-time, 100-seat). Truth flags: no annual/financing/fabricated-savings/
  guaranteed-outcome. `PRICING_DISCLOSURES` + `FOUNDING_LIFETIME_SCOPE`.
- `src/lib/pricing/foundingAvailability.ts` — scarcity-integrity: remaining derived only from
  `completedVerifiedPurchases`; no reliable source wired ⇒ `unknown`, counter inactive.
- `src/app/pricing/page.tsx` (flag `presentation_shell`), `src/components/pricing/PricingTiers.tsx`
  (founding sub-gated by `lifetime_offer_presentation`).

**Live payment path (legacy, unchanged):**
- `src/app/unlock/page.tsx` — tiers `basic $9.99` / `pro $19.99` / `platform $29` (recurring).
- `src/app/api/checkout/route.ts` — `TIER_PRICES` (server-side amounts), creates Stripe Checkout
  session (`payment` or `subscription`), 503 if `STRIPE_SECRET_KEY` missing.
- `src/app/api/webhook/route.ts` — verifies signature; on `checkout.session.completed` marks
  `assessments.paid` and inserts a `purchases` row (Supabase service role).
- `src/app/api/verify-session/route.ts` — server confirms `payment_status === 'paid'`; `DEV_UNLOCK`
  bypass non-prod only; no provider error leaked to client.

**Data layer:** `supabase/schema.sql` (`assessments`, `purchases` — RLS on, no public read),
`schema_v4_additions.sql`, `schema_v5_tracking.sql`, migrations `001`–`004` (metrix profiles +
cloud-sync tables, all owner-scoped RLS `auth.uid() = user_id`/`account_user_id`).

**Resource directory:** verification + neutrality gating
(`resourceVerification.ts`: eligibility reads zero commercial fields; disclosure fail-closed via
`publicationApproved`), `resourceLinkAudit.ts` (108 tested / 88 activated), flags
`public_resource_directory`, `verified_launch_resources`, `tracked_resource_redirects` all OFF.

**Analytics/consent:** `analytics.ts` (no-op stub), outbound consent gate + allow-list +
query-strip (tested in `wave7-resource-redirect-feedback` / `resource-directory`).

## 4. Dependency map (launch-critical commercial + compliance)

```
APPROVED PRICING (truth)            LEGACY LIVE PAYMENT (separate prices)
pricingPlans.ts ──────────┐         unlock/page.tsx ── api/checkout (TIER_PRICES)
foundingAvailability.ts   │              │ creates Stripe session
   │ (display only)        │              ▼
   ▼                       │         Stripe Checkout
/pricing (flag) ─ PricingTiers          │ checkout.session.completed
                           │              ▼
   ✗ NO LINK ──────────────┘         api/webhook ── Supabase: assessments.paid, purchases.insert
                                          ▲ (no idempotency / no entitlement / no subscription / no refund)
                                     api/verify-session ── gates /report access

FOUNDING COUNT  →  needs authoritative completed-verified-purchase source  →  foundingAvailability
ENTITLEMENTS    →  (DOES NOT EXIST)  →  required for Roadmap-Pass 30-day window, Build/Growth sub state, Lifetime
RESOURCE DIR    →  resourceVerification (neutral) + disclosure(fail-closed) + flags OFF  →  /resources, /resources/go
CONSENT/ANALYTICS → consent gate + allow-list + query-strip  →  outbound + funnel events
```

**Core gap:** the approved model (`$0/$19/$39mo/$79mo/$649`) and the live checkout
(`$9.99/$19.99/$29mo`) are two disconnected price sources. Wave 8 must reconcile them and build the
entitlement layer that neither path currently has.

## 5. Exact files likely to require changes

| File | Likely Wave 8 change |
| --- | --- |
| `src/app/api/checkout/route.ts` | Replace `TIER_PRICES` with approved `PlanId` mapping; mode per `billingKind`; block `growth` (invitation) + (until ready) `founding_lifetime`; pass `plan_id` metadata. |
| `src/app/unlock/page.tsx` (and/or new checkout entry) | Migrate to approved plans, or redirect to a single approved checkout entry; remove legacy tier copy. |
| `src/app/api/webhook/route.ts` | Idempotency (event id / `stripe_session_id` unique); entitlement creation + expiry (Roadmap 30-day Build); subscription lifecycle (`customer.subscription.updated/deleted`, `invoice.payment_failed`); refund (`charge.refunded`); founding-count increment. |
| `src/app/api/verify-session/route.ts` | Return entitlement/plan, not just `paid`. |
| `src/lib/pricing/foundingAvailability.ts` (caller) | Wire authoritative `FoundingInventorySource` from settled purchases (keep `reliable:false` until validated). |
| **NEW** `supabase/migrations/005_*.sql` | `entitlements` + `subscriptions` tables, `purchases` idempotency/unique constraint + `plan_id`/`founding_seat`, owner-scoped RLS. |
| **NEW** `src/lib/pricing/entitlements.ts` | Pure entitlement-resolution helpers (plan → grants, expiry, active-state) mirroring the `pricingPlans` discipline. |
| `src/lib/featureFlags.ts` | Add a `live_approved_checkout` flag (default OFF) gating the migrated path. |
| `src/components/pricing/PricingTiers.tsx` | Activate paid CTAs only behind the new flag once checkout migrated. |

## 6. Acceptance criteria for Wave 8 implementation

1. Single approved price source; legacy `TIER_PRICES` removed or quarantined; no divergent live
   prices reachable.
2. Roadmap Pass = one-time, grants exactly 30 days Build, **never** creates a subscription / never
   auto-renews; verified by test.
3. Build/Growth = monthly subscriptions with correct renew/cancel state; Growth not
   self-purchasable (invitation gate enforced server-side).
4. Founding Lifetime = one-time; remaining count only from settled verified purchases; `unknown`
   when source unreliable; never below 0 / above 100.
5. Webhook is idempotent (duplicate Stripe deliveries cause no duplicate entitlement/purchase).
6. Entitlement creation, expiry, subscription change, failed-payment, and refund/reversal each have
   defined, tested behavior.
7. Purchase audit record written for every settled purchase; no sensitive data in URLs or analytics.
8. All disclosures (pricing, no-auto-renew, refund, invitation-only, founding scarcity, Terms/
   Privacy, educational-vs-professional) present at checkout.
9. Every new behavior flag-gated **OFF**; existing routes/scoring/RLS/cloud-sync unchanged.
10. `npm test` / typecheck / lint / build all green; new tests for every invariant above.

## 7. Preservation requirements (must remain unchanged)

- Canonical MetrixProfile™ architecture and the single Metrix engine (`src/lib/metrix/index.ts`).
- All **10** trade pathways; all **6** state routes (`/state/[state]`: fl, co, tx + 3).
- Resource catalog IDs and status (88 published / 20 held); held records stay private.
- All 12 feature flags default OFF; existing storage keys; migrations `001`–`004`; owner-scoped RLS.
- Cloud-sync interfaces; consent behavior; analytics allow-list/query-strip; public routes.
- Pricing remains presentation-only until the migration flag is deliberately enabled.
- Wave 10A and Wave 10B launch blockers (below) carried forward.

## 8. Legal/compliance classifications

| Item | Classification |
| --- | --- |
| Migrate live checkout to approved model (`$0/$19/$39mo/$79mo/$649`) | **TECHNICAL IMPLEMENTATION READY** (build behind OFF flag) |
| Entitlement / subscription / webhook idempotency / refund handling | **TECHNICAL IMPLEMENTATION READY** |
| Subscription, no-auto-renew, refund, cancellation **disclosure wording** | **QUALIFIED LEGAL REVIEW REQUIRED** (auto-renewal/“negative option” + state rules) |
| Founding Lifetime scarcity + “lifetime” representation | **QUALIFIED LEGAL REVIEW REQUIRED**; counter stays **SAFE TO KEEP DISABLED** until a verified source exists |
| Invitation-only Growth representation | **QUALIFIED LEGAL REVIEW REQUIRED** (truthful availability) |
| Publishing commercial/regulated provider listings (R2) | **QUALIFIED LEGAL REVIEW REQUIRED** — keep HELD |
| Publishing licensing-authority listings (R3) | **AUTHORITATIVE-SOURCE REVIEW REQUIRED** — keep HELD |
| Non-consented aggregate click measurement (R1) | **QUALIFIED LEGAL REVIEW REQUIRED** — keep BLOCKED |
| Resource-feedback cloud sync export/deletion (R6) | **TECHNICAL IMPLEMENTATION READY** (later wave) |
| Educational-vs-professional-advice boundary | **SAFE TO KEEP DISABLED** of any advice; retain educational framing |
| Payment data flow / retention / export / deletion duties | **QUALIFIED LEGAL REVIEW REQUIRED** for retention windows |

> A disclaimer is not treated as a cure for misleading or unsupported behavior. Where wording is
> uncertain, the behavior stays disabled until reviewed.

## 9. Feature-flag activation requirements

- New `live_approved_checkout` (default OFF) — enable only after checkout migration + entitlement
  tests pass AND payment-disclosure legal review clears.
- `presentation_shell` — keep OFF in prod until `/pricing` reflects the live-purchasable model.
- `lifetime_offer_presentation` — enable only after Founding counter has a verified source AND
  scarcity/lifetime wording legal review clears.
- Resource flags (`public_resource_directory`, `verified_launch_resources`,
  `tracked_resource_redirects`) — remain OFF pending R1–R4 resolutions.
- No flag flips to ON within Wave 8 implementation without the matching review above.

## 10. Launch blockers

- **R8 — Live checkout vs approved pricing divergence** (Payments/consumer protection) — Wave 10A.
- **R9 — Founding Lifetime live availability counter** (needs verified source) — Wave 10A.
- **R1 — Non-consented aggregate click measurement** — BLOCKED pending qualified review.
- **R2 / R3 — Commercial & licensing-authority listings** — HELD pending legal/authoritative review.
- **R5 — Live-directory accessibility (manual AT/device review)** — Wave 10A.
- **R6 — Resource-feedback cloud sync** export/deletion — later wave.
- **R7 — 20 of 108 curated links** (blocked/404/mismatch) — manual re-verification before activation.
- **NEW — No entitlement/subscription model** exists; required before any approved paid plan can be
  honored.
- Payment-disclosure wording (auto-renew/refund/cancellation) — qualified legal review.

## 11. Recommended internal checkpoints for one controlled Wave 8 build

- **CP1 — Entitlement schema & helpers (no live wiring):** migration `005` (`entitlements`,
  `subscriptions`, `purchases` constraints + RLS) + pure `entitlements.ts`; tests only. Flags OFF.
- **CP2 — Approved checkout session creation (flag-gated):** map approved plans in
  `/api/checkout`, block invitation/founding, behind `live_approved_checkout` (OFF). Legacy path
  intact.
- **CP3 — Webhook integrity:** idempotency + entitlement creation + 30-day Roadmap window +
  subscription lifecycle + failed-payment + refund; purchase audit. Tests.
- **CP4 — Founding source + verify-session entitlement read:** wire authoritative count
  (`reliable:false` until validated); return entitlement from verify-session. Counter stays
  `unknown` until source proven.
- **CP5 — Disclosure & consent surfacing:** render all required checkout disclosures + Terms/Privacy
  links; confirm no sensitive data in URLs/analytics. (Wording pending legal review.)
- **CP6 — Preservation & readiness audit:** full test/type/lint/build, flag-OFF verification,
  legal/compliance sign-off checklist; produce Wave 8 completion audit. No flags flipped.

## 12. Proposed Wave 8 branch name

`feature/metrix-wave8-commercial-entitlement-foundation`

## 13. Proposed first implementation checkpoint

**CP1 — Entitlement schema & pure helpers (no live payment wiring).** Lowest-risk, highest-leverage
start: it introduces the missing entitlement/subscription data model and pure resolution logic
(mirroring the tested `pricingPlans` discipline) behind no behavior change, unblocking CP2–CP4 while
keeping every flag OFF and the legacy live path untouched.
