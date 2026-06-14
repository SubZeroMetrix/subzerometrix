// ─────────────────────────────────────────────────────────────────────────────
// entitlements/types — Wave 8 CP1: canonical commercial entitlement domain types
// ─────────────────────────────────────────────────────────────────────────────
// The single, versioned type vocabulary for commercial access in SubZeroMetrix™. This module is
// pure data + types only — NO Stripe, checkout, webhook, Supabase, route-guard, pricing-UI, or
// analytics behavior is wired here or anywhere in Wave 8 CP1. It describes *what an entitlement
// is* so later checkpoints can persist and enforce it.
//
// DESIGN INVARIANTS:
//   • Internal product keys are canonical and provider-agnostic — they are NOT Stripe product or
//     price IDs. External provider references are optional, opaque, and never become identity.
//   • Capabilities represent ACCESS, not marketing plans. One product may grant several.
//   • Status and source are neutral technical states. They carry NO legal conclusion (renewal,
//     cancellation/refund rights, retention duties, scarcity, etc.) — those are deferred and must
//     be resolved by qualified review, not encoded here.
//   • The record is schema-versioned; an unknown future version must fail safely (treated as
//     unsupported), never silently accepted.
// ─────────────────────────────────────────────────────────────────────────────

/** Current entitlement record schema version. Bump only with a migration + helper update. */
export const ENTITLEMENT_SCHEMA_VERSION = 1 as const

// ── Canonical product keys ──────────────────────────────────────────────────────
// Provider-agnostic. NEVER a Stripe product/price id. Closed set.
export const ENTITLEMENT_PRODUCT_KEYS = [
  'initial_direction',
  'roadmap_pass',
  'build_monthly',
  'growth_monthly',
  'founding_lifetime',
] as const
export type EntitlementProductKey = (typeof ENTITLEMENT_PRODUCT_KEYS)[number]

// ── Capability keys ─────────────────────────────────────────────────────────────
// Access primitives, not plans. A product grants one or more of these. Closed set.
export const ENTITLEMENT_CAPABILITIES = [
  'initial_direction',
  'personalized_roadmap',
  'build_access',
  'growth_access',
  'founding_lifetime_access',
] as const
export type EntitlementCapability = (typeof ENTITLEMENT_CAPABILITIES)[number]

// ── Status ──────────────────────────────────────────────────────────────────────
// Neutral technical lifecycle states. Names imply NO legal consequence. Closed set.
export const ENTITLEMENT_STATUSES = [
  'pending',
  'active',
  'expired',
  'canceled',
  'revoked',
  'refunded',
  'disputed',
] as const
export type EntitlementStatus = (typeof ENTITLEMENT_STATUSES)[number]

// ── Source ──────────────────────────────────────────────────────────────────────
// How the entitlement originated. `administrative` and `promotion` must NEVER count toward
// Founding Lifetime completed-purchase inventory. Closed set.
export const ENTITLEMENT_SOURCES = [
  'purchase',
  'subscription',
  'promotion',
  'administrative',
  'migration',
] as const
export type EntitlementSource = (typeof ENTITLEMENT_SOURCES)[number]

/**
 * Safe, non-sensitive metadata. Flat map of primitives only — never nested objects, arrays, card
 * data, bank data, raw webhook payloads, tokens, secrets, passwords, or unnecessary PII.
 */
export type EntitlementMetadata = Record<string, string | number | boolean>

/**
 * The canonical, versioned entitlement record.
 *
 * Timestamps are ISO-8601 UTC strings (the project's canonical date format). The lifecycle
 * timestamps below are descriptive markers only — they do NOT by themselves assert any legal
 * outcome. External references are optional opaque strings and must never be treated as the
 * owner's canonical identity.
 */
export interface EntitlementRecord {
  /** Stable internal entitlement id (provider-agnostic). */
  id: string
  /** Schema version this record was written against. */
  schemaVersion: number
  /** Canonical owner/account id (internal identity — never an external provider ref). */
  ownerId: string
  /** Canonical product key. */
  product: EntitlementProductKey
  /** Capabilities this record grants while active. */
  capabilities: EntitlementCapability[]
  /** How the entitlement originated. */
  source: EntitlementSource
  /** Neutral technical status. */
  status: EntitlementStatus
  /** When the record was created (ISO-8601 UTC). */
  createdAt: string
  /** When access begins (inclusive). `null` until activated. */
  activatedAt: string | null
  /** When access ends (exclusive). `null`/absent = no time bound. */
  expiresAt?: string | null
  /** Lifecycle markers — descriptive only, no legal conclusion inferred. */
  canceledAt?: string | null
  revokedAt?: string | null
  refundedAt?: string | null
  disputedAt?: string | null
  /** Optional opaque external references (e.g. payment provider). Never canonical identity. */
  externalProvider?: string | null
  externalCustomerRef?: string | null
  externalTransactionRef?: string | null
  externalSubscriptionRef?: string | null
  /** Optional safe, non-sensitive metadata. */
  metadata?: EntitlementMetadata | null
}

// ── Product → capability intent ─────────────────────────────────────────────────
// The INTENDED capabilities each product represents. This is reference intent; actual records may
// split time-bounded grants across multiple records (e.g. the Roadmap Pass 30-day Build window).
export const PRODUCT_CAPABILITY_INTENT: Readonly<
  Record<EntitlementProductKey, readonly EntitlementCapability[]>
> = Object.freeze({
  initial_direction: ['initial_direction'],
  roadmap_pass: ['personalized_roadmap', 'build_access'],
  build_monthly: ['build_access'],
  growth_monthly: ['build_access', 'growth_access'],
  founding_lifetime: ['build_access', 'growth_access', 'founding_lifetime_access'],
})

/** The intended capabilities for a product key (a fresh array copy; safe to mutate). */
export function intendedCapabilities(product: EntitlementProductKey): EntitlementCapability[] {
  const intent = PRODUCT_CAPABILITY_INTENT[product]
  return intent ? [...intent] : []
}

/** Roadmap Pass includes a bounded Build access window of this many days. */
export const ROADMAP_PASS_BUILD_ACCESS_DAYS = 30 as const
