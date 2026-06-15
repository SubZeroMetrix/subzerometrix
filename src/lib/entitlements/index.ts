// ─────────────────────────────────────────────────────────────────────────────
// entitlements — Wave 8 CP1: canonical commercial entitlement domain (barrel)
// ─────────────────────────────────────────────────────────────────────────────
// Single import surface for the entitlement domain. Pure types + helpers only — no I/O, no Stripe,
// no Supabase, no route enforcement, no pricing-UI activation. See ./types and ./entitlements for
// the design invariants and the technical access rules.
// ─────────────────────────────────────────────────────────────────────────────

export * from './types'
export * from './entitlements'
