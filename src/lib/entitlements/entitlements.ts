// ─────────────────────────────────────────────────────────────────────────────
// entitlements/entitlements — Wave 8 CP1: pure entitlement domain helpers
// ─────────────────────────────────────────────────────────────────────────────
// Deterministic, side-effect-free domain logic over EntitlementRecord. NO I/O, NO Stripe, NO
// Supabase, NO route enforcement, NO Date.now(). Every time-based helper receives the evaluation
// timestamp explicitly so results are reproducible and testable.
//
// ACCESS TIME-WINDOW RULE (technical, not a customer-facing legal rule):
//   startsAt is INCLUSIVE, expiresAt is EXCLUSIVE  →  startsAt <= evaluatedAt < expiresAt
//   where startsAt = record.activatedAt. A record with no expiresAt has no upper time bound.
//
// STATUS → ACCESS RULE (neutral technical model, asserts no legal right):
//   Only `active` and `canceled` are access-permitting (still subject to the time window above).
//   `canceled` keeps access until the existing expiresAt (a subscription stops renewing but the
//   already-granted window is honored) — this is a technical access rule, NOT a statement of
//   cancellation or refund rights. `pending`, `expired`, `revoked`, `refunded`, and `disputed`
//   never grant access regardless of the time window.
// ─────────────────────────────────────────────────────────────────────────────

import {
  ENTITLEMENT_CAPABILITIES,
  ENTITLEMENT_PRODUCT_KEYS,
  ENTITLEMENT_SCHEMA_VERSION,
  ENTITLEMENT_SOURCES,
  ENTITLEMENT_STATUSES,
  ROADMAP_PASS_BUILD_ACCESS_DAYS,
  type EntitlementCapability,
  type EntitlementMetadata,
  type EntitlementProductKey,
  type EntitlementRecord,
  type EntitlementSource,
  type EntitlementStatus,
} from './types'

const MS_PER_DAY = 86_400_000

// Statuses that may grant access (still gated by the time window). See header rule.
const ACCESS_PERMITTING_STATUSES: ReadonlySet<EntitlementStatus> = new Set<EntitlementStatus>([
  'active',
  'canceled',
])

// Conservative deny-list for metadata keys that must never carry sensitive values. Matched as a
// case-insensitive substring so e.g. `card_last4` or `customer_password` are rejected outright.
const FORBIDDEN_METADATA_KEY_SUBSTRINGS = [
  'card',
  'cvv',
  'cvc',
  'pan',
  'iban',
  'account_number',
  'routing',
  'password',
  'secret',
  'token',
  'ssn',
  'apikey',
  'api_key',
] as const

// ── small pure parsers / guards ──────────────────────────────────────────────────

/** Parse an ISO timestamp to epoch ms, or null if missing/blank/unparseable. Never throws. */
export function parseIsoMs(value: unknown): number | null {
  if (typeof value !== 'string' || value.trim() === '') return null
  const ms = Date.parse(value)
  return Number.isFinite(ms) ? ms : null
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

function isOptionalIsoOrNullish(v: unknown): boolean {
  if (v === undefined || v === null) return true
  return parseIsoMs(v) !== null
}

/** Whether a schema version is one this build understands. Unknown versions are unsupported. */
export function isSupportedSchemaVersion(version: unknown): boolean {
  return version === ENTITLEMENT_SCHEMA_VERSION
}

function isValidCapabilityList(v: unknown): v is EntitlementCapability[] {
  return (
    Array.isArray(v) &&
    v.every(c => (ENTITLEMENT_CAPABILITIES as readonly string[]).includes(c as string))
  )
}

/** Whether a metadata bag is safe: flat primitives only, and no sensitive-looking keys. */
export function isSafeMetadata(meta: unknown): meta is EntitlementMetadata {
  if (meta === undefined || meta === null) return true
  if (typeof meta !== 'object' || Array.isArray(meta)) return false
  for (const [key, value] of Object.entries(meta as Record<string, unknown>)) {
    const lower = key.toLowerCase()
    if (FORBIDDEN_METADATA_KEY_SUBSTRINGS.some(bad => lower.includes(bad))) return false
    const t = typeof value
    if (t !== 'string' && t !== 'number' && t !== 'boolean') return false
    if (t === 'number' && !Number.isFinite(value as number)) return false
  }
  return true
}

// ── structural validity ──────────────────────────────────────────────────────────

/**
 * Whether a value is a structurally usable entitlement record for THIS schema version. An unknown
 * schema version returns false (unsupported), never silently valid. Pure; never throws.
 */
export function isValidEntitlementRecord(rec: unknown): rec is EntitlementRecord {
  if (typeof rec !== 'object' || rec === null) return false
  const r = rec as Record<string, unknown>

  if (!isSupportedSchemaVersion(r.schemaVersion)) return false
  if (!isNonEmptyString(r.id)) return false
  if (!isNonEmptyString(r.ownerId)) return false
  if (!(ENTITLEMENT_PRODUCT_KEYS as readonly string[]).includes(r.product as string)) return false
  if (!(ENTITLEMENT_STATUSES as readonly string[]).includes(r.status as string)) return false
  if (!(ENTITLEMENT_SOURCES as readonly string[]).includes(r.source as string)) return false
  if (!isValidCapabilityList(r.capabilities)) return false

  if (parseIsoMs(r.createdAt) === null) return false
  // activatedAt is required as a field but may be explicitly null (not yet activated).
  if (!('activatedAt' in r) || !(r.activatedAt === null || parseIsoMs(r.activatedAt) !== null)) {
    return false
  }
  // Optional lifecycle timestamps: when present must be null or parseable ISO.
  if (!isOptionalIsoOrNullish(r.expiresAt)) return false
  if (!isOptionalIsoOrNullish(r.canceledAt)) return false
  if (!isOptionalIsoOrNullish(r.revokedAt)) return false
  if (!isOptionalIsoOrNullish(r.refundedAt)) return false
  if (!isOptionalIsoOrNullish(r.disputedAt)) return false

  if (!isSafeMetadata(r.metadata)) return false

  return true
}

// ── time-based access evaluation ──────────────────────────────────────────────────

/**
 * Whether an entitlement is active at the supplied evaluation timestamp. Applies both the
 * status→access rule and the inclusive-start / exclusive-end time window. Invalid records or an
 * invalid evaluation timestamp fail safely (false).
 */
export function isEntitlementActiveAt(rec: unknown, evaluatedAtIso: string): boolean {
  if (!isValidEntitlementRecord(rec)) return false
  const evalMs = parseIsoMs(evaluatedAtIso)
  if (evalMs === null) return false

  if (!ACCESS_PERMITTING_STATUSES.has(rec.status)) return false

  // Must have begun: startsAt = activatedAt, inclusive.
  const startMs = parseIsoMs(rec.activatedAt)
  if (startMs === null) return false
  if (evalMs < startMs) return false

  // expiresAt is exclusive when present.
  if (rec.expiresAt != null) {
    const endMs = parseIsoMs(rec.expiresAt)
    if (endMs === null) return false
    if (evalMs >= endMs) return false
  }
  return true
}

/**
 * Whether an entitlement grants a specific capability at the supplied timestamp. Requires the
 * record to be active at that time AND to list the capability. Fails safely.
 */
export function entitlementGrantsCapabilityAt(
  rec: unknown,
  capability: EntitlementCapability,
  evaluatedAtIso: string,
): boolean {
  if (!isEntitlementActiveAt(rec, evaluatedAtIso)) return false
  return (rec as EntitlementRecord).capabilities.includes(capability)
}

/**
 * The exclusive expiration timestamp for a bounded grant: start + durationDays. Returns null when
 * the start is unparseable or durationDays is not a positive integer (fail safe). UTC ISO output.
 */
export function computeExpiration(startIso: string, durationDays: number): string | null {
  const startMs = parseIsoMs(startIso)
  if (startMs === null) return null
  if (!Number.isInteger(durationDays) || durationDays <= 0) return null
  return new Date(startMs + durationDays * MS_PER_DAY).toISOString()
}

// ── combined / effective access across records ────────────────────────────────────

export interface EffectiveAccess {
  /** The evaluation timestamp these results were computed for (echoed back). */
  evaluatedAt: string
  /** All capabilities granted by at least one active record, sorted & deduped. */
  capabilities: EntitlementCapability[]
  /** Per-capability granted flag (every capability key present). */
  granted: Record<EntitlementCapability, boolean>
  /**
   * Per-capability effective end (exclusive): the latest expiresAt among the active records that
   * grant it, or null when any granting active record is unbounded. null also means "not granted"
   * is impossible to distinguish from "unbounded" here — always read `granted` first.
   */
  effectiveUntil: Record<EntitlementCapability, string | null>
  /** Ids of the records that were active at evaluation time. */
  activeRecordIds: string[]
}

/**
 * Combine multiple entitlement records into the set of capabilities active at a timestamp. Pure;
 * ignores invalid/inactive records. A non-array input yields an empty set.
 */
export function effectiveCapabilitiesAt(
  records: readonly unknown[],
  evaluatedAtIso: string,
): Set<EntitlementCapability> {
  const out = new Set<EntitlementCapability>()
  if (!Array.isArray(records)) return out
  for (const rec of records) {
    if (!isEntitlementActiveAt(rec, evaluatedAtIso)) continue
    for (const cap of (rec as EntitlementRecord).capabilities) {
      if ((ENTITLEMENT_CAPABILITIES as readonly string[]).includes(cap)) out.add(cap)
    }
  }
  return out
}

/**
 * Resolve the effective access result when records overlap. The union of capabilities is granted;
 * for each capability the effective end is the LATEST expiry among contributing active records (or
 * null if any contributor is unbounded). This is how an overlapping Build window + Build month
 * resolve to the later end. Deterministic for a fixed timestamp.
 */
export function resolveEffectiveAccess(
  records: readonly unknown[],
  evaluatedAtIso: string,
): EffectiveAccess {
  const granted = {} as Record<EntitlementCapability, boolean>
  // Track the max bounded end and whether any active contributor is unbounded — kept separate so a
  // bounded record actually extends the end (a single `null` field would conflate "unset" with
  // "unbounded").
  const hasUnbounded = {} as Record<EntitlementCapability, boolean>
  const maxEndMs = {} as Record<EntitlementCapability, number | null>
  for (const cap of ENTITLEMENT_CAPABILITIES) {
    granted[cap] = false
    hasUnbounded[cap] = false
    maxEndMs[cap] = null
  }

  const activeRecordIds: string[] = []
  const list = Array.isArray(records) ? records : []

  for (const rec of list) {
    if (!isEntitlementActiveAt(rec, evaluatedAtIso)) continue
    const r = rec as EntitlementRecord
    activeRecordIds.push(r.id)
    const endMs = r.expiresAt != null ? parseIsoMs(r.expiresAt) : null
    for (const cap of r.capabilities) {
      if (!(ENTITLEMENT_CAPABILITIES as readonly string[]).includes(cap)) continue
      granted[cap] = true
      if (endMs === null) {
        hasUnbounded[cap] = true // unbounded contributor → capability has no effective end
      } else if (maxEndMs[cap] === null || endMs > (maxEndMs[cap] as number)) {
        maxEndMs[cap] = endMs
      }
    }
  }

  const effectiveUntil = {} as Record<EntitlementCapability, string | null>
  for (const cap of ENTITLEMENT_CAPABILITIES) {
    effectiveUntil[cap] =
      hasUnbounded[cap] || maxEndMs[cap] === null ? null : new Date(maxEndMs[cap] as number).toISOString()
  }

  const capabilities = ENTITLEMENT_CAPABILITIES.filter(c => granted[c])
  return { evaluatedAt: evaluatedAtIso, capabilities, granted, effectiveUntil, activeRecordIds }
}

// ── grant builders (pure constructors — no id generation, no Date.now) ─────────────

export interface BaseGrantParams {
  /** Caller-supplied stable id. */
  id: string
  ownerId: string
  /** Activation timestamp (ISO-8601 UTC). Also the default createdAt. */
  activatedAt: string
  source?: EntitlementSource
  createdAt?: string
  externalProvider?: string | null
  externalCustomerRef?: string | null
  externalTransactionRef?: string | null
  externalSubscriptionRef?: string | null
  metadata?: EntitlementMetadata | null
}

function applyExternalRefs(rec: EntitlementRecord, p: BaseGrantParams): EntitlementRecord {
  const out: EntitlementRecord = { ...rec }
  if (p.externalProvider != null) out.externalProvider = p.externalProvider
  if (p.externalCustomerRef != null) out.externalCustomerRef = p.externalCustomerRef
  if (p.externalTransactionRef != null) out.externalTransactionRef = p.externalTransactionRef
  if (p.externalSubscriptionRef != null) out.externalSubscriptionRef = p.externalSubscriptionRef
  if (p.metadata != null) out.metadata = p.metadata
  return out
}

/**
 * Build the Roadmap Pass bounded Build-access grant: `build_access` for exactly
 * ROADMAP_PASS_BUILD_ACCESS_DAYS (30) days from the explicit activation timestamp, with an
 * exclusive expiresAt. This grant never includes recurring billing — it is a fixed one-time
 * window. Pure; the produced record is structurally valid when given valid inputs.
 */
export function createRoadmapPassBuildAccessGrant(params: BaseGrantParams): EntitlementRecord {
  const createdAt = params.createdAt ?? params.activatedAt
  const expiresAt = computeExpiration(params.activatedAt, ROADMAP_PASS_BUILD_ACCESS_DAYS)
  const base: EntitlementRecord = {
    id: params.id,
    schemaVersion: ENTITLEMENT_SCHEMA_VERSION,
    ownerId: params.ownerId,
    product: 'roadmap_pass',
    capabilities: ['build_access'],
    source: params.source ?? 'purchase',
    status: 'active',
    createdAt,
    activatedAt: params.activatedAt,
    expiresAt,
  }
  return applyExternalRefs(base, params)
}

/**
 * Build the persistent Roadmap Pass `personalized_roadmap` grant (no time bound). The roadmap
 * itself is the one-time deliverable; the separate 30-day Build window is created by
 * createRoadmapPassBuildAccessGrant. Pure.
 */
export function createRoadmapPassRoadmapGrant(params: BaseGrantParams): EntitlementRecord {
  const createdAt = params.createdAt ?? params.activatedAt
  const base: EntitlementRecord = {
    id: params.id,
    schemaVersion: ENTITLEMENT_SCHEMA_VERSION,
    ownerId: params.ownerId,
    product: 'roadmap_pass',
    capabilities: ['personalized_roadmap'],
    source: params.source ?? 'purchase',
    status: 'active',
    createdAt,
    activatedAt: params.activatedAt,
    expiresAt: null,
  }
  return applyExternalRefs(base, params)
}

/**
 * Build the full set of entitlement records a Roadmap Pass purchase produces: a persistent
 * personalized_roadmap grant plus the bounded 30-day Build-access window. Caller supplies a
 * distinct id for each. This is the canonical demonstration of one product → multiple records
 * with different lifetimes; it wires nothing.
 */
export function createRoadmapPassEntitlements(
  params: BaseGrantParams & { buildAccessId: string },
): EntitlementRecord[] {
  const roadmap = createRoadmapPassRoadmapGrant({ ...params, id: params.id })
  const build = createRoadmapPassBuildAccessGrant({ ...params, id: params.buildAccessId })
  return [roadmap, build]
}

// ── Founding Lifetime completed-purchase inventory eligibility (pure) ──────────────

/** Why a record must NOT contribute to Founding Lifetime completed-purchase inventory. */
export type FoundingInventoryExclusionReason =
  | 'invalid_record'
  | 'not_founding_product'
  | 'non_purchase_source'
  | 'status_not_completed_purchase'
  | 'missing_transaction_reference'

/**
 * Return the reason a record is excluded from Founding Lifetime completed-purchase inventory, or
 * null when it is an eligible candidate. CONSERVATIVE BY DESIGN: a record counts ONLY when it is a
 * valid `founding_lifetime` record, sourced from a real `purchase` (never administrative /
 * promotional / subscription / migration), currently in the `active` completed state, AND carries
 * a non-empty external transaction reference. Pending, canceled, expired, refunded, disputed, and
 * revoked records never count. This helper computes eligibility only — it never produces a live
 * remaining quantity (none is computed or exposed in CP1).
 */
export function foundingInventoryExclusionReason(
  rec: unknown,
): FoundingInventoryExclusionReason | null {
  if (!isValidEntitlementRecord(rec)) return 'invalid_record'
  if (rec.product !== 'founding_lifetime') return 'not_founding_product'
  if (rec.source !== 'purchase') return 'non_purchase_source'
  if (rec.status !== 'active') return 'status_not_completed_purchase'
  if (!isNonEmptyString(rec.externalTransactionRef)) return 'missing_transaction_reference'
  return null
}

/**
 * Whether a record is an eligible candidate for completed-purchase-backed Founding Lifetime
 * inventory. True only when foundingInventoryExclusionReason returns null.
 */
export function isFoundingInventoryCandidate(rec: unknown): boolean {
  return foundingInventoryExclusionReason(rec) === null
}
