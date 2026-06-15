// ─────────────────────────────────────────────────────────────────────────────
// entitlements/customerState — Wave 8 CP5: neutral customer-facing entitlement state (pure)
// ─────────────────────────────────────────────────────────────────────────────
// Maps an entitlement record's technical status + time window to a small, NEUTRAL presentation
// state for an account UI. These labels are technical access states only and assert NO legal
// conclusion (renewal, cancellation, or refund rights). Pure; the evaluation time is always
// supplied explicitly. See entitlements.ts for the underlying status→access rule.
// ─────────────────────────────────────────────────────────────────────────────

import { isEntitlementActiveAt, parseIsoMs } from './entitlements'
import type { EntitlementRecord } from './types'

export type CustomerEntitlementState =
  | 'active' // currently grants access and continues
  | 'ending' // currently grants access but is canceled (will not continue past expiresAt)
  | 'pending' // not yet active
  | 'inactive' // valid but not within its access window right now
  | 'ended' // access has ended (expired / refunded / disputed / revoked)

/**
 * The neutral presentation state for a single entitlement at a timestamp. Returns 'inactive' for an
 * unusable/invalid record so the UI never over-states access.
 */
export function customerEntitlementState(
  rec: EntitlementRecord,
  evaluatedAtIso: string,
): CustomerEntitlementState {
  if (isEntitlementActiveAt(rec, evaluatedAtIso)) {
    return rec.status === 'canceled' ? 'ending' : 'active'
  }
  switch (rec.status) {
    case 'pending':
      return 'pending'
    case 'expired':
    case 'refunded':
    case 'disputed':
    case 'revoked':
    case 'canceled':
      return 'ended'
    default: {
      // status 'active' (or other) but outside its window: past the end → ended; before the
      // start → inactive (scheduled).
      const endMs = rec.expiresAt != null ? parseIsoMs(rec.expiresAt) : null
      const evalMs = parseIsoMs(evaluatedAtIso)
      if (endMs !== null && evalMs !== null && evalMs >= endMs) return 'ended'
      return 'inactive'
    }
  }
}

/** Whether any of a customer's entitlements currently grants access. */
export function hasActiveEntitlement(records: readonly EntitlementRecord[], evaluatedAtIso: string): boolean {
  return Array.isArray(records) && records.some(r => isEntitlementActiveAt(r, evaluatedAtIso))
}
