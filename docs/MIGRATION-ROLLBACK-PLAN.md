# SubZeroMetrix — Migration & Rollback Plan (Wave 6)

> **Purpose.** Define how the full-site rebuild (Wave 7+) ships behind feature flags with a
> tested, non-destructive path forward and a clean rollback for every surface. The legacy
> compatibility map is machine-readable in `src/lib/preservation/migrationMap.ts`
> (`MIGRATION_MAP`, `validateMigrationMap()`); the Wave 6 tests assert **no destructive,
> no data-loss** migration exists.

- **Migration map version:** 1
- **Hard rule:** No destructive migration without (1) dependency mapping, (2) a compatibility
  adapter, (3) a tested replacement, and (4) a rollback plan. Every row in `MIGRATION_MAP`
  satisfies this and is `destructive: false`, `dataLossRisk: 'none'`.

---

## 1. Legacy compatibility map (summary)

| Legacy data | Adapter | Fallback | Rollback |
| --- | --- | --- | --- |
| Score result / snapshot (engine1/2) | `legacyAdapter` + `legacyProjection` | re-derive from raw answers | legacy keys untouched |
| `szm_*` local records | `safeJsonParse` + per-module loaders | default state | append-only keys |
| Profile versions | `reconcile.reconcileCanonicalProfiles` | keep most complete + flag conflict | both retained until clean winner |
| Progress records | `progressRecord` + `progressSync` | reset on priority change, archive kept | `getProgressArchive` |
| Recommendation records | `resourceRegistry` + `resourceAttribution` | ignore unknown ids | `referral_clicks` unchanged |
| Old routes / aliases | `next.config.js` redirects + `ROUTE_INVENTORY` | 404 | config-only |
| Resource / vendor records | `resourceRegistry` + `defaultEcosystemExtension` | draft → not public-eligible | source registries unchanged |
| Analytics payloads | `analytics.trackEvent` (additive) | ignore extra fields | remove new names |
| Consent records | `tracking` consent gate | default NOT granted | read-only |
| Exports | `accountDataPrivacy.exportAccountData` | honest per-table status | read-only |

Full detail (source/target version, compatibility/fallback/rollback behavior, validation method)
is in `MIGRATION_MAP`.

## 2. Preview deployment workflow

1. Push the feature branch; Vercel builds a **preview deployment** automatically.
2. Preview env: all `NEXT_PUBLIC_FF_*` flags **unset** ⇒ everything defaults OFF ⇒ preview
   behaves exactly like production.
3. To exercise a new surface in preview, set the specific `NEXT_PUBLIC_FF_<FLAG>=on` env var on
   the preview deployment only (never production) and redeploy.
4. Database migrations are **never** auto-run by a preview; they are applied explicitly (below).

### Environment variables

- Existing: Supabase URL/anon key, Stripe keys — **unchanged**.
- New (all optional, default-off): `NEXT_PUBLIC_FF_PRESENTATION_SHELL`,
  `NEXT_PUBLIC_FF_PUBLIC_RESOURCE_DIRECTORY`, `NEXT_PUBLIC_FF_TRACKED_RESOURCE_REDIRECTS`,
  `NEXT_PUBLIC_FF_EXPANDED_RESOURCE_CATALOG`, `NEXT_PUBLIC_FF_VERIFIED_LAUNCH_RESOURCES`,
  `NEXT_PUBLIC_FF_NEW_CONTENT_SURFACES`, `NEXT_PUBLIC_FF_GENERAL_BUSINESS_STARTER`,
  `NEXT_PUBLIC_FF_SPANISH_DISCOVERY`, `NEXT_PUBLIC_FF_PARTNER_VENDOR_PAGES`,
  `NEXT_PUBLIC_FF_REFERRAL_SHARING`, `NEXT_PUBLIC_FF_CUSTOMER_PROOF_FEEDBACK`,
  `NEXT_PUBLIC_FF_LIFETIME_OFFER_PRESENTATION`.

## 3. Database migration sequencing

Wave 6 adds **no new tables, columns, constraints, indexes, or RLS policies.** When Wave 7
introduces a resource-verification/published-catalog table:

1. Apply the additive migration (new table, `owner_only` or read-only public RLS as appropriate)
   **before** flipping any resource flag.
2. Backfill verified records (Wave 7 data task) — never auto-mark `verified`.
3. Validate with `validateInventory()` + new table coverage in `accountDataPrivacy`.
4. Only then enable `verified_launch_resources` / `public_resource_directory`.

## 4. Feature-flag activation order (recommended)

1. `presentation_shell` (visual only; no data) →
2. `verified_launch_resources` (after records are verified) →
3. `public_resource_directory` →
4. `tracked_resource_redirects` →
5. `expanded_resource_catalog` →
6. content / partner / referral / proof / lifetime-offer surfaces as ready.

## 5. Rollback triggers & steps

**Triggers:** broken route, failed build, regression in scoring/priority/persistence, a redirect
reaching an unverified provider, a disclosure not rendering, or any analytics PII leak.

**Steps (each independent and non-destructive):**

| Surface | Rollback |
| --- | --- |
| New shell / content / partner / referral / proof / lifetime-offer | Set the flag env var to `off` (or unset) and redeploy. |
| Public directory | `public_resource_directory=off`. |
| Tracked redirects | `tracked_resource_redirects=off` ⇒ `/resources/go/*` returns 404. |
| Resource catalog | `expanded_resource_catalog=off` / `verified_launch_resources=off`; the published catalog is empty by default. |
| Route | Revert the route via redirect/config; `ROUTE_INVENTORY` guards removal. |
| Data | No destructive migration shipped ⇒ no data rollback needed; cloud rows and `szm_*` keys are untouched. |
| Analytics | New event names are additive ⇒ removing them reverts cleanly. |

**Stripe / payments are never touched** by any Wave 6 rollback.

## 6. Validation method

- `npm run typecheck` · `npm run lint` · `npm run build`
- `npm run test` (full suite, incl. `wave6-preservation-architecture.test.ts`)
- `validateInventory()` and `validateMigrationMap()` return `{ ok: true }`.
