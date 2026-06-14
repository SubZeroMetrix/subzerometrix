// ─────────────────────────────────────────────────────────────────────────────
// entitlements/foundingInventory — Wave 8 CP4: completed-purchase Founding counting (pure)
// ─────────────────────────────────────────────────────────────────────────────
// The ONLY bridge from entitlement records to the Founding Lifetime availability resolver. It
// counts strictly the records that pass isFoundingInventoryCandidate (valid + founding_lifetime +
// purchase source + active + real transaction ref) and feeds that count into the existing
// integrity-checked resolveFoundingAvailability.
//
// R9 FAIL-SAFE PRESERVED: a caller must EXPLICITLY assert `reliable: true` to produce a live count.
// Until an authoritative, validated inventory source exists, callers leave reliability false (the
// default) and the resolver returns `unknown` with NO number and NO active counter — exactly as
// shipped. This module never decrements, inflates, or invents a number, and it never counts
// pending / canceled / refunded / disputed / revoked / administrative / promotional records.
// ─────────────────────────────────────────────────────────────────────────────

import { isFoundingInventoryCandidate } from './entitlements'
import type { EntitlementRecord } from './types'
import {
  resolveFoundingAvailability,
  type FoundingAvailability,
  type FoundingInventorySource,
} from '../pricing/foundingAvailability'

/** Count the records that legitimately consume a Founding Lifetime seat. Pure. */
export function countFoundingInventory(records: readonly unknown[]): number {
  if (!Array.isArray(records)) return 0
  let n = 0
  for (const rec of records) if (isFoundingInventoryCandidate(rec)) n++
  return n
}

/**
 * Build a FoundingInventorySource from entitlement records. `reliable` defaults to false so the
 * resolver returns `unknown` unless the caller can vouch for the source being authoritative and
 * complete. The numeric input is ONLY the candidate count — never pending/abandoned sessions.
 */
export function foundingInventorySourceFromRecords(
  records: readonly EntitlementRecord[],
  reliable = false,
  asOf?: string,
): FoundingInventorySource {
  return {
    completedVerifiedPurchases: countFoundingInventory(records),
    reliable,
    ...(asOf ? { asOf } : {}),
  }
}

/**
 * Resolve Founding availability directly from entitlement records. Defaults to an UNKNOWN result
 * (no live counter) until a caller passes `{ reliable: true }` with an authoritative record set.
 */
export function resolveFoundingAvailabilityFromRecords(
  records: readonly EntitlementRecord[],
  opts: { reliable?: boolean; asOf?: string } = {},
): FoundingAvailability {
  return resolveFoundingAvailability(
    foundingInventorySourceFromRecords(records, opts.reliable ?? false, opts.asOf),
  )
}
