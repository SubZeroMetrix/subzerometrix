# SubZeroMetrix Wave 6 Handoff — Preservation, Migration & Interface Architecture

## Status

- Wave 6 complete on branch `feature/metrix-wave6-preservation-migration-architecture`.
- Branch pushed. **PR NOT opened** (await merge instruction).
- Additive, deterministic, non-destructive. No existing engine, route, storage, schema,
  analytics, consent, export, or Stripe surface was replaced or removed.

## Objective

Establish the preservation, migration, compatibility, and interface architecture to carry the app
from Waves 1–5 into the full-site rebuild (Wave 7+) — and stand up the Contractor Business
Resource Ecosystem architecture **without publishing any unverified providers.**

## Architectural decision

Wave 6 is an **architecture + inventory + contracts** layer. It **extends** the Wave 5 canonical
resource model rather than creating a parallel system, and it **reads** the canonical Metrix
pipeline rather than recomputing it. No new scoring/priority/gate/path/profile/progress/
reassessment/recommendation-ranking engine was created.

## Files added

**Preservation (machine-readable inventory):**
- `src/lib/preservation/inventoryTypes.ts`
- `src/lib/preservation/inventory.ts` (`PRESERVATION_INVENTORY`, `validateInventory()`)
- `src/lib/preservation/migrationMap.ts` (`MIGRATION_MAP`, `validateMigrationMap()`)
- `src/lib/preservation/index.ts`

**Resource ecosystem (extends Wave 5 canonical model):**
- `src/lib/metrix/resourceEcosystem.ts` — master `EcosystemResource`, verification lifecycle,
  29-category taxonomy, launch-set fields.
- `src/lib/metrix/resourceVerification.ts` — public-eligibility gating (verified+active only),
  commercial-neutral; disclosure computation; evidence guard.
- `src/lib/metrix/resourceRedirects.ts` — `/resources/go/[resourceId]` resolution, privacy-safe
  allow-listed payload, consent + flag gating, fail-safe.
- `src/lib/metrix/resourceDirectory.ts` — Directory vs. Recommendation contracts.
- `src/lib/metrix/ecosystemCatalog.ts` — published catalog (**empty by design**).
- `src/lib/metrix/canonicalPresentation.ts` — one presentation adapter (no recomputation).

**Feature flags:**
- `src/lib/featureFlags.ts` — 12 flags, all default OFF, env-overridable, rollback-ready.

**Route (gated, dormant):**
- `src/app/resources/go/[resourceId]/route.ts` — tracked redirect; 404 while flag-off / catalog-empty.

**Tests & docs:**
- `src/lib/metrix/__tests__/wave6-preservation-architecture.test.ts` (23 tests)
- `docs/PRESERVATION-INVENTORY.md`
- `docs/MIGRATION-ROLLBACK-PLAN.md`
- `docs/RESOURCE-ECOSYSTEM-ARCHITECTURE.md`
- `docs/HANDOFF-SZM-WAVE6.md` (this file)

## Files modified (additive only)

- `src/lib/metrix/index.ts` — surfaced the Wave 6 public API (`PriorityView` re-exported as
  `PresentationPriorityView` to avoid the existing `priorityView` name).

## Inventory coverage

- **Routes:** 39 inventoried (+1 new gated redirect), all `preserve: true`, dynamic params mapped.
- **Canonical IDs:** 17 kinds, unique + stable, originals preserved verbatim.
- **Storage:** 23 `szm_*` local keys; **12** `cloud_sync_*` tables (migrations 002 + 004), all
  `owner_only` RLS, all export/delete-covered.
- **Analytics:** 23 events mirroring `AnalyticsEvent`; none carry PII; 4 are consent-gated.
- **SEO:** metadata, OG, JSON-LD, sitemap, robots, llms.txt, canonical, Spanish discovery,
  legacy redirects.
- **Export/deletion:** account cloud + device-local + foundation/action/resource/reassessment.

## Verification gating behavior

Only `verified` + `active` + healthy (not broken/stale) records are public-eligible. A record
cannot be `verified` without evidence (owner + notes + reviewed date). Regulatory/licensing
authorities are directly linkable as reference data even when not commercially verified.

## Commercial neutrality (test-enforced)

Eligibility and ranking read **zero** commercial fields. Two fit-identical records differing only
in relationship/affiliate/referral/reseller/sponsorship status have identical eligibility; the
commercial one additionally **requires a disclosure.**

## Tracked redirect architecture

`/resources/go/[resourceId]`: resolves only verified+active; privacy-safe allow-listed payload
(no PII, query strings stripped); analytics only on consent; disclosures attached when required;
fails safe (404). **Dormant** in Wave 6 — flag `tracked_resource_redirects` OFF **and** published
catalog empty.

## Feature flags

12 flags (`presentation_shell`, `public_resource_directory`, `tracked_resource_redirects`,
`expanded_resource_catalog`, `verified_launch_resources`, `new_content_surfaces`,
`general_business_starter`, `spanish_discovery`, `partner_vendor_pages`, `referral_sharing`,
`customer_proof_feedback`, `lifetime_offer_presentation`). All default OFF; gate only new
surfaces; never alter scoring/priority/pathway/recommendation logic.

## Migration & rollback

`MIGRATION_MAP`: 10 legacy → canonical paths, all non-destructive, zero data-loss risk, each with
fallback + rollback + validation method. Full preview/rollback procedure in
`docs/MIGRATION-ROLLBACK-PLAN.md`. No DB migration shipped in Wave 6.

## Validation results

- **Tests:** **203/203 pass** (180 prior + 23 Wave 6).
- **TypeScript (`tsc --noEmit`):** clean.
- **Lint (`next lint`):** no warnings/errors.
- **Production build:** succeeds; `/resources/go/[resourceId]` registered (dynamic); all prior
  routes preserved.
- `validateInventory()` and `validateMigrationMap()` return `{ ok: true }`.
- Clean working tree at commit.

## Confirmations

- **No unverified providers were publicly activated** — the published catalog is empty.
- **No commercial relationship** alters scoring, priority, licensing guidance, pathway ordering,
  or recommendation relevance.
- **Canonical** scoring, priority, gates, paths, profile, progress, reassessment, trade
  intelligence, licensing intelligence, recommendations, auth, cloud sync, **Stripe, pricing,
  and payments were NOT replaced.**

## Known limitations / future work (Wave 7)

- The published ecosystem catalog is empty; curating the verified launch set (~50–100 records,
  with evidence) is a Wave 7 data task. **Do not auto-mark `verified`.**
- The public Directory UI and the wiring of `RecommendationCardView` into live surfaces are Wave 7.
- The tracked-redirect outbound event should be wired through the existing `/api/track-click`
  sink when records are verified (Wave 7).
- A resource-verification / published-catalog table (additive, RLS) is anticipated for Wave 7.

## Wave 7 entry point

**Wave 7 — Resource Directory UI, Verified Launch Set & Full-Site Presentation Rollout.**
Do not begin Wave 7 in this context.
