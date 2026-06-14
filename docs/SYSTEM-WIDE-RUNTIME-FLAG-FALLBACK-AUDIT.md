# SubZeroMetrix — System-Wide Runtime Default, Feature-Flag & Fallback Audit

> Scope: every feature flag, env-var branch, fallback/legacy component, and runtime gate affecting
> the public site, Metrix product, commercial systems, data/account systems, resources, and
> compliance surfaces. Not legal advice. No legally-held system was activated.

## 1. Executive finding

The homepage legacy-by-default defect (`page.tsx` selected the homepage via the default-OFF
`presentation_shell` flag, so an unset environment rendered the legacy homepage) was the **only**
true instance of the "launch-approved experience hidden / reverted to legacy by default" pattern. It
is **already corrected** on this branch (commit `273bc66`): `HomeExperience` is now the default and
the legacy homepage is reachable only via an explicit rollback env var, independent of any
commercial flag.

A full sweep of all 14 registry flags, all direct `process.env` branches, both `Legacy*`
components, and every conditional route render found **no additional defects**. All other gated
surfaces are either additive enhancements (safe when OFF), intentionally legal/payment-held
(fail-closed), or dormant registry entries that gate nothing. There is no middleware and no
flag-driven dynamic-import/redirect indirection.

This audit commit adds a system-wide **runtime-default regression suite** that proves the actual
default selection (not mere component existence) so the pattern cannot recur.

## 2. Complete runtime-control inventory

### A. Feature flags (registry `src/lib/featureFlags.ts`; ALL default OFF; server-evaluated; `NEXT_PUBLIC_FF_<NAME>` override; malformed → false)

| Flag | Used at | OFF behavior | ON behavior | Classification |
| --- | --- | --- | --- | --- |
| `presentation_shell` | `results/page.tsx:287`, `dashboard/page.tsx:363` | no extra panel (page renders normally) | adds subordinate CanonicalSummaryPanel | SAFE-DISABLED (additive; no longer the homepage selector) |
| `public_resource_directory` | `resources/page.tsx:29` | LegacyResourcesPage (current prod) | new verification-gated directory (empty/verified-only) | LEGAL-REVIEW-BLOCKED (R2/R3) |
| `tracked_resource_redirects` | `resources/go/[resourceId]/route.ts:44` | 404 | verified outbound redirect | LEGAL-REVIEW-BLOCKED / SAFE-DISABLED |
| `lifetime_offer_presentation` | `pricing/PricingTiers.tsx:137` | Founding block hidden | Founding offer shown (counter still unknown) | LEGAL-REVIEW-BLOCKED (R9/scarcity) |
| `approved_pricing_presentation` | `pricing/page.tsx:29`, `sitemap.ts:42` | `/pricing` 404; not in sitemap | `/pricing` presentation (no checkout) | LEGAL-REVIEW-BLOCKED (R8) |
| `live_approved_checkout` | `api/checkout/route.ts:62`, `api/webhook/route.ts:106` | legacy `/unlock` path only; webhook entitlement block inert | approved checkout + entitlement provisioning | CONFIGURATION-REQUIRED + LEGAL-REVIEW-BLOCKED (R8, migration 005, account identity) |
| `expanded_resource_catalog` | _none_ | n/a | n/a | DEPRECATED-REMOVE (dormant; gates nothing) |
| `verified_launch_resources` | _none_ | n/a | n/a | DEPRECATED-REMOVE (dormant) |
| `new_content_surfaces` | _none_ (content routes are default-live) | n/a | n/a | DEPRECATED-REMOVE (dormant) |
| `general_business_starter` | _none as a gate_ (only a `context=` analytics label) | n/a | n/a | DEPRECATED-REMOVE (dormant gate) |
| `spanish_discovery` | _none as a gate_ (only a `context=` label) | n/a | n/a | DEPRECATED-REMOVE (dormant gate) |
| `partner_vendor_pages` | _none_ | n/a | n/a | DEPRECATED-REMOVE (dormant) |
| `referral_sharing` | _none_ | n/a | n/a | DEPRECATED-REMOVE (dormant) |
| `customer_proof_feedback` | _none_ | n/a | n/a | DEPRECATED-REMOVE (dormant) |

### B. Direct environment-variable branches

| Env var | Used at | Scope | Unset behavior | Classification |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_USE_LEGACY_HOMEPAGE` | `home/homepageMode.ts` → `page.tsx` | public (client-readable) | **HomeExperience (default)** | DEFAULT-LIVE / EXPLICIT-ROLLBACK-ONLY |
| `STRIPE_SECRET_KEY` | checkout/webhook/verify-session | server | 503 (fail closed) | CONFIGURATION-REQUIRED |
| `STRIPE_WEBHOOK_SECRET` | webhook | server | 503 (fail closed) | CONFIGURATION-REQUIRED |
| `SUPABASE_SERVICE_ROLE_KEY` | webhook/track-click/postback | server | skip write (non-fatal) | CONFIGURATION-REQUIRED |
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` | supabaseClient/assessment | public | null client → local-only, truthfully unsynced | CONFIGURATION-REQUIRED |
| `DEV_UNLOCK` (+`NODE_ENV`) | verify-session | server | inert in production (`NODE_ENV==='production'`) | EXPLICIT-ROLLBACK (dev-only) |
| `RESEND_API_KEY` | email-trigger | server | email skipped gracefully | CONFIGURATION-REQUIRED |
| `NEXT_PUBLIC_APP_URL` | seo/checkout/email | public | falls back to request origin / canonical host | CONFIGURATION-REQUIRED |
| `NODE_ENV` | analytics | server | dev-only console sink | n/a |

### C. Fallback / legacy components

| Component | Selected when | Status |
| --- | --- | --- |
| `LegacyHomeExperience` | `NEXT_PUBLIC_USE_LEGACY_HOMEPAGE` truthy (rollback only) | EXPLICIT-ROLLBACK-ONLY (fixed `273bc66`) |
| `LegacyResourcesPage` | `public_resource_directory` OFF (default) | SAFE/REQUIRED fallback (directory legal-held) |
| Local-storage data fallback | Supabase env absent | SAFE-DISABLED (truthful "not synced", never faked) |

## 3. Preview vs Production configuration comparison

The Vercel CLI is not installed and the Vercel project env API is not reachable from this
environment, so **actual Vercel Preview/Production variable values could not be enumerated here**
(dashboard access required). What is determinable:

- **Required state for the corrected homepage:** `NEXT_PUBLIC_USE_LEGACY_HOMEPAGE` must be **unset
  (or not truthy)** in BOTH Preview and Production → approved homepage. (It is absent from the repo,
  `vercel.json`, and `.env.example`.)
- **Historical inference:** the original defect proved `NEXT_PUBLIC_FF_PRESENTATION_SHELL` was unset
  in Preview (else the approved homepage would have shown). This is now **moot** — the homepage no
  longer reads any feature flag.
- **Repository defaults vs deployment:** `vercel.json` defines no environment variables; `.env.example`
  lists Supabase/Stripe/Resend/app-url/postback only — **no `NEXT_PUBLIC_FF_*` and no homepage var**,
  so repository defaults govern unless a dashboard override exists.
- **Action for the operator:** confirm in the Vercel dashboard that no `NEXT_PUBLIC_FF_*`,
  `NEXT_PUBLIC_USE_LEGACY_HOMEPAGE`, or `DEV_UNLOCK` is set in Production; and that Stripe/Supabase
  server secrets exist only where intended. No secret values are reproduced here.

## 4. Default-runtime behavior matrix (key launch-critical paths)

| Path | Default runtime | Proven by |
| --- | --- | --- |
| `/` homepage | HomeExperience (approved) | `wave8-runtime-defaults`, `wave8-homepage-default` |
| `/state/[state]` ×6 | live (no flag) | `wave8-runtime-defaults` |
| `/platform/[trade]` ×10 | live (no flag) | `wave8-runtime-defaults` |
| `/learn/[slug]`, `/es`, `/general-business-starter` | live (no flag) | source audit |
| `/pricing` | 404 (held, R8) | `wave8-cp1a`, `wave8-cp6` |
| `/api/checkout` | legacy tiers only; approved path OFF | `wave8-cp6`, `wave8-runtime-defaults` |
| Founding availability | `unknown` (no number) | `wave8-cp4`, `wave8-runtime-defaults` |
| Resources directory | LegacyResourcesPage (held) | source audit |
| Outbound analytics | suppressed unless consent granted | `wave6`/`wave7` + `wave8-runtime-defaults` |
| Cloud sync (no env) | local-only, truthfully unsynced | `wave8-runtime-defaults` |

## 5. Legacy / fallback inventory

Two `Legacy*` components exist: `LegacyHomeExperience` (now rollback-only) and `LegacyResourcesPage`
(safe fallback while the directory is legal-held). No other legacy/deprecated runtime fallbacks, no
flag-driven dynamic imports, no middleware redirects.

## 6. Defects found

1. **Homepage legacy-by-default** (`src/app/page.tsx`) — launch-approved homepage hidden behind the
   default-OFF `presentation_shell` flag; unset env rendered legacy. **(Corrected — `273bc66`.)**

No other defects found.

## 7. Corrections made

- **Prior commit `273bc66`** (homepage fix): inverted the homepage selector to a dedicated
  rollback-only switch (`NEXT_PUBLIC_USE_LEGACY_HOMEPAGE`), making `HomeExperience` the default and
  removing the homepage's dependency on `presentation_shell`/any commercial flag.
- **This audit commit:** added `wave8-runtime-defaults.test.ts` (system-wide runtime-default
  regression suite) and this document. No additional runtime code changes were required.

## 8. Systems intentionally disabled (preserved, not activated)

- `/pricing` presentation (`approved_pricing_presentation`) — R8.
- Approved live checkout + webhook provisioning (`live_approved_checkout`) — R8 + migration 005 +
  account identity.
- Founding offer presentation & live counter (`lifetime_offer_presentation`) — R9.
- Public resource directory & tracked redirects (`public_resource_directory`,
  `tracked_resource_redirects`) — R2/R3.
- Each remains fail-closed; activation dependencies are documented above and in the Wave 8 audits.

## 9. Legal / compliance holds (unchanged)

Payment/subscription/refund/cancellation/scarcity wording, regulated & licensing resource listings,
non-consented measurement, retention/export/delete duties, and professional-advice boundaries all
remain held pending qualified review. No customer-facing legal conclusion was made. The homepage fix
involves no commercial, payment, privacy, or consent behavior.

## 10. Tests added

- `wave8-runtime-defaults.test.ts` — 14 assertions: approved-homepage default; legacy requires
  explicit rollback; homepage flag-independence; 6 state routes & 10 trade pathways default-live;
  pricing≠checkout independence; checkout 503 without Stripe config; `/unlock` not the approved path;
  Founding unknown; entitlement domain reads no flag/env; held resources unpublished; consent-gated
  analytics; truthful cloud-sync absence; singular Metrix engine.
- (Prior) `wave8-homepage-default.test.ts` — 9 assertions for the homepage selector + commercial
  independence.

## 11. Remaining Wave 10 hosted/manual validation items

- Confirm Vercel Preview/Production env vars in the dashboard (no stray `NEXT_PUBLIC_FF_*`,
  `NEXT_PUBLIC_USE_LEGACY_HOMEPAGE`, or `DEV_UNLOCK` in Production).
- Manual visual confirmation of the corrected preview homepage (reserved by the owner).
- Apply migration `005`; wire `account_user_id` into checkout metadata before live provisioning.
- Verified completed-purchase source for the Founding counter (R9); qualified legal review for R8/R9
  wording; manual a11y/device review (R5); R1/R2/R3 unchanged.
- Recommended cleanup (non-blocking): remove the dormant DEPRECATED-REMOVE flags in a future wave.

## 12. Go / no-go recommendation for merging PR #15

**GO (merge-ready) from a runtime-safety standpoint**, subject to the owner's reserved visual
confirmation of the corrected preview homepage. The homepage defect is fixed; no other defects
exist; all commercial/compliance systems remain default-OFF and fail-closed; preservation invariants
are intact and locked by tests (429/429). Merging activates nothing — every held system stays
disabled until its documented dependency and legal review are satisfied.
