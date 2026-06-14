# SubZeroMetrix — Wave 8 Completion Audit (CP6)

> Consolidated Wave 8 commercial entitlement foundation. **Foundation only:** every new behavior
> ships behind a default-OFF flag, the legacy live checkout is untouched, and nothing legally
> uncertain has been activated. Nothing here is legal advice.

## Checkpoints & commits (branch `feature/metrix-wave8-commercial-entitlement-foundation`)

| CP | Commit | Summary |
| --- | --- | --- |
| (audit) | `16eb22c` | Wave 8 commercial/compliance readiness audit |
| CP1 | `34b6d24` | Entitlement domain foundation (types + pure helpers) |
| CP1A | `67773f1` | Decouple approved pricing presentation from homepage activation |
| CP2 | `45c6a73` | Approved-model checkout foundation (flag-gated) |
| CP3 | `e1a8ed8` | Webhook + entitlement integrity (pure logic + additive migration 005) |
| CP4 | `08163bb` | Founding inventory counting + session verification |
| CP5 | `2969424` | Checkout disclosures, consent guard, customer states |
| CP6 | _this commit_ | Red-team + preservation audit + final validation |

## What was built (all additive, all default-OFF)

- **`src/lib/entitlements/`** — pure domain: `types`, `entitlements` (validity / active-at /
  capability / 30-day grant / effective-access / founding eligibility), `checkout` (plan→Stripe
  intent), `provisioning` (derive records, idempotency, lifecycle transitions, row mapping),
  `foundingInventory` (candidate counting), `session` (privacy-safe summary), `disclosures`
  (composed-from-approved + analytics guard), `customerState` (neutral UI states).
- **`supabase/migrations/005_commercial_entitlements.sql`** — additive `commercial_entitlements`
  (owner-scoped RLS) + `processed_webhook_events` (service-role-only idempotency ledger).
- **Flag-gated route extensions** — `/api/checkout` (approved path behind `live_approved_checkout`),
  `/api/webhook` (guarded, non-fatal entitlement block behind the same flag), `/api/verify-session`
  (additive privacy-safe plan summary), `/pricing` + `sitemap` (moved to `approved_pricing_presentation`).
- **Two new flags**, both default OFF: `approved_pricing_presentation`, `live_approved_checkout`.

## Final validation results

| Check | Result |
| --- | --- |
| `npm test` | ✅ 406 / 406 pass, 0 fail (320 pre-Wave-8 + 86 new) |
| `npm run typecheck` | ✅ clean |
| `npm run lint` | ✅ see CP6 run |
| `npm run build` | ✅ see CP6 run |
| `git diff --check` | ✅ clean |
| Preservation (wave6/wave7 suites) | ✅ pass within the 406 (12 cloud_sync tables unchanged; routes/ids/keys intact) |

## Red-team / preservation invariants locked (wave8-cp6 test)

- Every feature flag defaults OFF (incl. the 2 new flags).
- **Legacy live checkout prices unchanged** (basic 999 / pro 1999 / platform 2900); approved path
  strictly flag-gated; `TIER_PRICES` preserved.
- Approved checkout amounts can never diverge from `pricingPlans`.
- **Founding availability stays `unknown`** — no quantity exposed (R9 fail-safe).
- Webhook: signature verification + legacy `purchases` insert preserved; entitlement block is
  flag-gated, additive, non-fatal; idempotency ledger referenced.
- Migration 005 additive + RLS-protected; no `drop table`, no alteration of existing tables; the
  idempotency ledger has no public policy.
- The canonical metrix engine never imports the entitlement domain (commercial neutrality).
- No human-coaching / advice language in the entitlement domain.

## Legal / compliance classifications (deferred, held)

- **Auto-renewal / refund / cancellation / subscription disclosure wording** — QUALIFIED LEGAL
  REVIEW REQUIRED. CP5 authors NO new legal copy; it only composes already-approved wording. States
  like `canceled` are neutral technical access states, not legal representations.
- **Founding Lifetime scarcity + "lifetime" representation** — QUALIFIED LEGAL REVIEW; live counter
  stays SAFE TO KEEP DISABLED until a verified completed-purchase source exists.
- **Invitation-only Growth representation** — QUALIFIED LEGAL REVIEW; Growth is structurally not
  self-purchasable.
- **R1 non-consented click measurement / R2 commercial listings / R3 licensing listings** — remain
  BLOCKED / HELD.
- **Account identity for entitlement attribution** — webhook provisioning is a safe no-op until an
  account id flows through checkout metadata (TECHNICAL IMPLEMENTATION READY; depends on auth wiring).

## Feature-flag activation requirements (all OFF today)

- `approved_pricing_presentation` — enable only after checkout is migrated AND pricing-disclosure
  legal review clears (R8).
- `live_approved_checkout` — enable only after migration 005 is applied, account identity flows to
  the webhook, and payment-disclosure legal review clears.
- `lifetime_offer_presentation` — enable only after a verified founding source + scarcity wording
  review.

## Launch blockers carried forward (Wave 10A / legal)

- Apply migration 005 to the project before enabling live approved checkout.
- Wire account identity (`account_user_id`) into checkout metadata for entitlement attribution.
- Verified completed-purchase source for the Founding counter (R9).
- Qualified legal review of payment/subscription/refund/scarcity wording.
- Manual a11y/device review (R5); R1/R2/R3 unchanged.

## Preservation confirmation

Canonical Metrix engine, all 10 trade pathways, all 6 state routes, 88 published / 20 held resource
accounting, canonical resource redirects, all 14 feature flags default OFF, storage keys, migrations
001–004 + RLS, cloud-sync interfaces, consent + analytics behavior, public routes, and pricing
presentation (now correctly decoupled) are all unchanged. Live Stripe behavior is unchanged.
