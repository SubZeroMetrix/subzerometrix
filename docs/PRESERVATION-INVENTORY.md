# SubZeroMetrix — Preservation Inventory (Wave 6)

> **Purpose.** The authoritative, human-readable catalog of everything Waves 1–5 expose that
> the full-site rebuild (Wave 7+) **must carry forward unchanged**. The machine-readable
> source of truth lives in `src/lib/preservation/` and is enforced by
> `src/lib/metrix/__tests__/wave6-preservation-architecture.test.ts`. If a route, canonical ID,
> storage key, cloud table, or analytics event is dropped or renamed, those tests fail.

- **Inventory version:** 1
- **Branch:** `feature/metrix-wave6-preservation-migration-architecture`
- **Machine-readable:** `src/lib/preservation/inventory.ts` (`PRESERVATION_INVENTORY`, `validateInventory()`)

---

## 1. Routes & pages

All routes below are marked `preserve: true`. None may be removed without a preserved legacy
alias / redirect. Full list: `ROUTE_INVENTORY`.

| Group | Routes |
| --- | --- |
| Public / marketing | `/`, `/about`, `/start`, `/assessment`, `/business-readiness`, `/partners`, `/install`, `/unlock` |
| Results | `/results`, `/report` |
| Dashboard (auth) | `/dashboard`, `/foundation-builder`, `/growth`, `/account/privacy` |
| Content / SEO | `/learn`, `/learn/[slug]`, `/trades`, `/platform/[trade]`, `/platform-ecosystem`, `/contractor-builders`, `/general-business-starter`, `/resources` |
| Spanish discovery | `/es`, `/es/como-empezar-un-negocio`, `/es/preparacion-empresarial` |
| Legal / disclosure | `/privacy`, `/terms`, `/disclaimer`, `/cancellation`, `/affiliate-disclosure` |
| API | `/api/checkout`, `/api/webhook`, `/api/verify-session`, `/api/track-click`, `/api/postback/[vendor]`, `/api/email-trigger` |
| System / SEO | `/sitemap.xml`, `/robots.txt`, `/llms.txt` |
| **New (Wave 6, gated)** | `/resources/go/[resourceId]` — tracked redirect, flag-gated OFF, dormant |

**Dynamic params:** `learn/[slug]`, `platform/[trade]`, `api/postback/[vendor]`,
`resources/go/[resourceId]`.

**Stripe routes (`/api/checkout`, `/api/webhook`) are UNCHANGED in Wave 6.**

## 2. Canonical IDs

17 stable id kinds (`CANONICAL_ID_INVENTORY`). Each preserves the original id verbatim.

| Kind | Pattern | Owner |
| --- | --- | --- |
| profile | `mp_<seed>` | `metrix/snapshot.ts` |
| assessment | `szm_assessment_id` (uuid) | `intake.ts` |
| score | MetrixScore (0–100, derived) | `metrix/readModel.ts` |
| priority | domain key | `metrix/metrixPriority.ts` |
| gate | gate id | `metrix/gates.ts` |
| path / step | path id / step id | `metrix/completionPaths.ts` |
| action | `<source>:<sourceId>` | `metrix/actionModel.ts` |
| question | question id | `questions.ts` |
| trade | `CanonicalTradeId` | `metrix/trades.ts` |
| state | 2-letter `CanonicalStateId` | `metrix/states.ts` |
| resource | `<source>:<sourceId>` | `metrix/resourceRegistry.ts` |
| vendor | `vendor.id` | `vendorCategories.ts` |
| referral | referral id | `referralEngine.ts` |
| partner | `partner.id` | `affiliates.ts` |
| analytics_event | snake_case event | `analytics.ts` |
| consent_record | host-granted consent flag | `tracking.ts` |

## 3. Storage & persistence

23 device-local `szm_*` keys (`STORAGE_KEY_INVENTORY`). Keys are append-only; malformed/missing
values degrade to safe defaults (`safeJsonParse`). Each key that reconciles with the cloud names
its `cloud_sync_*` table.

**12 cloud tables** (`CLOUD_TABLE_INVENTORY`), migrations 002 (10 tables) + 004 (2 tables), all
`owner_only` RLS (`auth.uid() = user_id`), all export- and delete-covered:

```
cloud_sync_assessment_history        cloud_sync_partner_interest
cloud_sync_score_history             cloud_sync_growth_events
cloud_sync_roadmap_action_progress   cloud_sync_foundation_builder_progress
cloud_sync_kpi_entries               cloud_sync_vendor_tool_tracker
cloud_sync_customer_feedback         cloud_sync_launch_readiness_progress
cloud_sync_priority_progress (004)   cloud_sync_reassessment_history (004)
```

Sync status values, reconciliation, offline fallback, and migration versions are owned by the
existing sync modules (`metrixCloudSync`, `progressSync`, `reassessmentSync`, each `*Sync.ts`).

## 4. Analytics & consent

23 events (`ANALYTICS_EVENT_INVENTORY`), exactly mirroring the `AnalyticsEvent` union in
`analytics.ts`. **No event carries PII** (`carriesPii: false`, test-enforced). The four
`recommendation_*` events are **consent-gated** (emitted only when the host grants consent).

Prohibited in any payload: raw answers, emails, names, notes, financial data, licensing details,
profile data, or unnecessary identifiers.

## 5. SEO & discovery

`SEO_SURFACE_INVENTORY`: metadata, Open Graph, JSON-LD structured data (`seo.ts`),
`sitemap.ts`, `robots.ts`, `llms.txt`, canonical URLs, Spanish discovery (`/es/*` +
`spanishDiscovery.ts`), and `next.config.js` redirects (legacy aliases — preserve all).

## 6. Exports & deletion

`EXPORT_DELETION_INVENTORY`: account cloud export/delete across all 12 tables
(`accountDataPrivacy`), device-local clear, Foundation Builder export (CSV/HTML),
action/evidence/outcome export, resource-interaction (device-local) export, and reassessment
history. Auth-account deletion remains admin-assisted (`AUTH_ACCOUNT_DELETION_SUPPORTED = false`).

---

## Guarantees enforced by tests

- No duplicate routes / storage keys / cloud tables / analytics events / id kinds.
- Every cloud table is export- and delete-covered with `owner_only` RLS.
- Every storage key's `cloudTable` reference resolves to a real table.
- No analytics event carries PII.
- Every route is `preserve: true`.
