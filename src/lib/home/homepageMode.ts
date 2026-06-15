// ─────────────────────────────────────────────────────────────────────────────
// home/homepageMode — Wave 8 fix: public homepage default + rollback-only switch
// ─────────────────────────────────────────────────────────────────────────────
// The NEW HomeExperience ("Start it. Build it. Grow it." / "FIND THE NEXT BUSINESS MOVE THAT
// MATTERS MOST.") is the DEFAULT public homepage. The previous LegacyHomeExperience is reachable
// ONLY via an explicit rollback env var.
//
// This is intentionally SEPARATE from the commercial FEATURE_FLAGS registry (whose members all
// default OFF). The public homepage must NOT depend on any commercial feature flag, and a missing /
// unset environment must always render the new experience — so the switch is inverted: the env var
// turns the legacy homepage ON, it does not turn the new one on.
//
//   NEXT_PUBLIC_USE_LEGACY_HOMEPAGE unset / false / anything-non-truthy → HomeExperience (default)
//   NEXT_PUBLIC_USE_LEGACY_HOMEPAGE = true | 1 | on | yes | enabled     → LegacyHomeExperience
// ─────────────────────────────────────────────────────────────────────────────

export const LEGACY_HOMEPAGE_ENV_VAR = 'NEXT_PUBLIC_USE_LEGACY_HOMEPAGE'

function truthy(v: string | undefined): boolean {
  if (typeof v !== 'string') return false
  const s = v.trim().toLowerCase()
  return s === '1' || s === 'true' || s === 'on' || s === 'yes' || s === 'enabled'
}

/**
 * Whether the legacy homepage should be served. Defaults to false (→ HomeExperience) whenever the
 * rollback env var is unset or not truthy. `env` is injectable for testing. Never throws.
 */
export function isLegacyHomepageEnabled(
  env: Record<string, string | undefined> = typeof process !== 'undefined' ? process.env : {},
): boolean {
  return truthy(env[LEGACY_HOMEPAGE_ENV_VAR])
}
