// ─────────────────────────────────────────────────────────────────────────────
// pricing/foundingAvailability — Wave 7 CP11: Founding Lifetime counter integrity
// ─────────────────────────────────────────────────────────────────────────────
// The ONLY place a "remaining founding spots" number may be computed. Its job is to make fake
// scarcity structurally impossible:
//
//   • Remaining is derived ONLY from a count of COMPLETED, eligible, verified purchases.
//   • Checkout starts / pending sessions / abandoned carts are never counted (there is no input
//     for them — the only numeric input is `completedVerifiedPurchases`).
//   • The number can never be manually set, inflated, or decremented to manufacture urgency.
//   • If no authoritative inventory source is available (or it is unreliable / malformed), the
//     result is `unknown` with NO number — the UI shows the truth, not a guess.
//   • A live counter is "active" only when a reliable source produced a real number.
//
// No Stripe/DB I/O happens here. The caller passes an explicit, already-resolved inventory
// reading. In Wave 7 no reliable source is wired (live payments are OFF), so the default is
// `unknown` and the live counter stays inactive — exactly as required.
// ─────────────────────────────────────────────────────────────────────────────

import { FOUNDING_SEAT_LIMIT } from './pricingPlans'

export type FoundingAvailabilityStatus = 'available' | 'sold_out' | 'unknown'

/**
 * An authoritative reading of Founding Lifetime inventory. The caller is responsible for only
 * ever populating `completedVerifiedPurchases` from settled, eligible purchases and for setting
 * `reliable: false` whenever the backing source is unavailable, stale, or untrusted.
 */
export interface FoundingInventorySource {
  /** Count of COMPLETED, eligible, verified purchases. Never checkout starts or pending sessions. */
  completedVerifiedPurchases: number
  /** Whether the backing source is authoritative and trustworthy right now. */
  reliable: boolean
  /** Optional timestamp of the reading (informational only). */
  asOf?: string
}

export interface FoundingAvailability {
  status: FoundingAvailabilityStatus
  totalSeats: number
  /** Remaining seats — a real number ONLY when known. `null` when unknown (never fabricated). */
  remaining: number | null
  /** True only when a reliable source yielded a real remaining count. */
  liveCounterActive: boolean
  /** Truthful, ready-to-render message. Safe to show whether or not the counter is active. */
  display: string
}

function isNonNegativeInteger(n: unknown): n is number {
  return typeof n === 'number' && Number.isInteger(n) && Number.isFinite(n) && n >= 0
}

/**
 * Resolve Founding Lifetime availability from an inventory reading. With no source, an
 * unreliable source, or a malformed count, returns a truthful `unknown` result with no number
 * and no active live counter.
 */
export function resolveFoundingAvailability(
  source?: FoundingInventorySource | null,
  totalSeats: number = FOUNDING_SEAT_LIMIT,
): FoundingAvailability {
  const base = { totalSeats } as const

  // No authoritative data → tell the truth; never invent a number.
  if (!source || source.reliable !== true || !isNonNegativeInteger(source.completedVerifiedPurchases)) {
    return {
      ...base,
      status: 'unknown',
      remaining: null,
      liveCounterActive: false,
      display: `Limited to the first ${totalSeats} verified purchasers. Remaining availability is confirmed at checkout.`,
    }
  }

  // Clamp into [0, totalSeats]: a verified count can never push remaining below zero or above the cap.
  const sold = Math.min(source.completedVerifiedPurchases, totalSeats)
  const remaining = Math.max(0, totalSeats - sold)

  if (remaining <= 0) {
    return {
      ...base,
      status: 'sold_out',
      remaining: 0,
      liveCounterActive: true,
      display: `All ${totalSeats} founding memberships have been claimed.`,
    }
  }

  return {
    ...base,
    status: 'available',
    remaining,
    liveCounterActive: true,
    display: `${remaining} of ${totalSeats} founding memberships remaining.`,
  }
}

/**
 * The availability used by the presentation surface today. No reliable inventory source is wired
 * in Wave 7 (live payments are OFF), so this is intentionally `unknown` and the live counter is
 * inactive. Wiring a real source is gated to Wave 10A cloud-sync validation.
 */
export const FOUNDING_AVAILABILITY: FoundingAvailability = resolveFoundingAvailability(null)
