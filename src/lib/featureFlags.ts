// ─────────────────────────────────────────────────────────────────────────────
// featureFlags — Wave 6: staged-rollout feature flags (safe defaults, rollback-ready)
// ─────────────────────────────────────────────────────────────────────────────
// ONE consolidated flag registry for the Wave 7+ full-site rebuild. Every flag DEFAULTS
// OFF and gates only NEW surfaces — existing routes, scoring, priority, and persistence are
// never affected by a flag. Flags can be flipped per-environment via NEXT_PUBLIC_FF_* env
// vars (e.g. NEXT_PUBLIC_FF_PUBLIC_RESOURCE_DIRECTORY=on) for preview/rollback, but the
// safe default is always the current production behavior.
//
// INVARIANTS (tested):
//   • Every flag defaults to false (off) — nothing unfinished is exposed by accident.
//   • Flags never alter scoring / priority / gate / pathway / recommendation-relevance logic.
//   • Reading an unknown flag is false, not an error. SSR-safe; never throws.
// ─────────────────────────────────────────────────────────────────────────────

export const FEATURE_FLAG_VERSION = 1

export const FEATURE_FLAGS = [
  'presentation_shell',          // new route-preserving app shell
  'public_resource_directory',   // public browse-able directory (Wave 7 UI)
  'tracked_resource_redirects',  // /resources/go/[resourceId] outbound redirects
  'expanded_resource_catalog',   // the full master ecosystem catalog (beyond launch set)
  'verified_launch_resources',   // the curated ~50–100 verified launch set
  'new_content_surfaces',        // new Learn / trade / state pages
  'general_business_starter',    // expanded General Business Starter
  'spanish_discovery',           // expanded Spanish discovery surfaces
  'partner_vendor_pages',        // partner / vendor pages
  'referral_sharing',            // referral / sharing features
  'customer_proof_feedback',     // customer proof + feedback surfaces
  'lifetime_offer_presentation', // lifetime-offer presentation (display only; NO Stripe change)
  'approved_pricing_presentation', // /pricing approved-model presentation (display only; held per R8 — decoupled from presentation_shell so the public homepage can activate without exposing pricing)
  'live_approved_checkout',        // Wave 8: live checkout on the APPROVED model in /api/checkout (held per R8; OFF keeps the legacy /unlock tiers untouched)
] as const

export type FeatureFlag = (typeof FEATURE_FLAGS)[number]

// Every flag is OFF by default. This map is the single source of truth for safe defaults.
export const FEATURE_FLAG_DEFAULTS: Readonly<Record<FeatureFlag, boolean>> = Object.freeze(
  FEATURE_FLAGS.reduce((acc, f) => {
    acc[f] = false
    return acc
  }, {} as Record<FeatureFlag, boolean>),
)

// Env var name for a flag, e.g. 'public_resource_directory' → 'NEXT_PUBLIC_FF_PUBLIC_RESOURCE_DIRECTORY'.
export function flagEnvVar(flag: FeatureFlag): string {
  return `NEXT_PUBLIC_FF_${flag.toUpperCase()}`
}

function truthy(v: string | undefined): boolean {
  if (typeof v !== 'string') return false
  const s = v.trim().toLowerCase()
  return s === '1' || s === 'true' || s === 'on' || s === 'yes' || s === 'enabled'
}

/**
 * Resolve a single flag. Precedence: explicit override → env var → safe default (false).
 * `env` is injectable for testing; defaults to process.env. Never throws.
 */
export function isFeatureEnabled(
  flag: FeatureFlag,
  override?: Partial<Record<FeatureFlag, boolean>>,
  env: Record<string, string | undefined> = typeof process !== 'undefined' ? process.env : {},
): boolean {
  if (!FEATURE_FLAGS.includes(flag)) return false
  if (override && typeof override[flag] === 'boolean') return override[flag] as boolean
  if (truthy(env[flagEnvVar(flag)])) return true
  return FEATURE_FLAG_DEFAULTS[flag]
}

/** Resolve all flags into a concrete map (defaults + env + override). */
export function resolveFeatureFlags(
  override?: Partial<Record<FeatureFlag, boolean>>,
  env: Record<string, string | undefined> = typeof process !== 'undefined' ? process.env : {},
): Record<FeatureFlag, boolean> {
  return FEATURE_FLAGS.reduce((acc, f) => {
    acc[f] = isFeatureEnabled(f, override, env)
    return acc
  }, {} as Record<FeatureFlag, boolean>)
}
