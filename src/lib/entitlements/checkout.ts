// ─────────────────────────────────────────────────────────────────────────────
// entitlements/checkout — Wave 8 CP2: approved-model checkout intent (pure)
// ─────────────────────────────────────────────────────────────────────────────
// Pure mapping from an approved PlanId (the presentation source of truth, pricingPlans.ts) to the
// neutral Stripe-session shape a checkout route would need. NO Stripe SDK, NO network, NO env, NO
// route wiring here — this only describes a truthful, server-authoritative intent so the live route
// can build a session behind the default-OFF `live_approved_checkout` flag without ever trusting a
// client-sent amount.
//
// SELF-SERVICE RULES (commercial-protection invariants, tested):
//   • Free plans have no checkout (no payment required).
//   • Growth is invitation-only → never self-purchasable.
//   • Founding Lifetime is purchasable ONLY when an availability gate confirms a remaining seat
//     (the caller passes the already-resolved result; this module never invents availability).
//   • Roadmap Pass and Build are self-purchasable.
//   • Amounts/modes are derived from pricingPlans.ts — never hardcoded a second time, so they can
//     never diverge from the approved model.
// ─────────────────────────────────────────────────────────────────────────────

import {
  getPricingPlan,
  type PlanId,
  type PricingPlan,
} from '../pricing/pricingPlans'

export type CheckoutMode = 'payment' | 'subscription'

export interface ApprovedCheckoutLineItem {
  currency: 'usd'
  /** Truthful product name shown at checkout. */
  productName: string
  /** Truthful product description (the approved plan summary). */
  productDescription: string
  /** Server-authoritative amount in cents (from pricingPlans — never client-sent). */
  unitAmount: number
  /** 'month' for subscriptions; null for one-time / lifetime payments. */
  recurringInterval: 'month' | null
}

export interface ApprovedCheckoutIntent {
  planId: PlanId
  mode: CheckoutMode
  lineItem: ApprovedCheckoutLineItem
}

/** Why a plan cannot be self-purchased through the approved checkout. */
export type CheckoutBlockReason =
  | 'unknown_plan'
  | 'no_payment_required' // free plan
  | 'invitation_only' // Growth
  | 'requires_founding_availability' // Founding Lifetime with no confirmed remaining seat

export type ApprovedCheckoutResult =
  | { ok: true; intent: ApprovedCheckoutIntent }
  | { ok: false; reason: CheckoutBlockReason }

export interface ApprovedCheckoutOptions {
  /**
   * Whether a Founding Lifetime seat is confirmed available. Required to build a Founding checkout
   * intent. The caller must derive this from completed-purchase-backed inventory (Wave 8 CP4); this
   * module never fabricates availability. Defaults to false (fail safe).
   */
  foundingSeatAvailable?: boolean
}

/** The Stripe checkout mode implied by a plan's billing kind. */
export function checkoutModeForPlan(plan: PricingPlan): CheckoutMode {
  return plan.billingKind === 'subscription' ? 'subscription' : 'payment'
}

/** Whether a plan can ever be self-purchased (ignoring transient availability). */
export function isSelfPurchasable(planId: PlanId): boolean {
  const plan = getPricingPlan(planId)
  if (!plan) return false
  if (plan.billingKind === 'free') return false
  if (plan.invitationOnly) return false
  return plan.accessGate === 'purchase'
}

/**
 * Build the approved checkout intent for a plan, or a typed block reason. Amounts and mode come
 * straight from the approved model. Founding Lifetime requires `foundingSeatAvailable === true`.
 * Pure; never throws.
 */
export function buildApprovedCheckoutIntent(
  planId: PlanId,
  opts: ApprovedCheckoutOptions = {},
): ApprovedCheckoutResult {
  const plan = getPricingPlan(planId)
  if (!plan) return { ok: false, reason: 'unknown_plan' }
  if (plan.billingKind === 'free') return { ok: false, reason: 'no_payment_required' }
  if (plan.invitationOnly) return { ok: false, reason: 'invitation_only' }
  if (plan.accessGate !== 'purchase') return { ok: false, reason: 'invitation_only' }

  // Founding Lifetime: only purchasable when a confirmed seat exists (never invented here).
  if (plan.seatLimited && opts.foundingSeatAvailable !== true) {
    return { ok: false, reason: 'requires_founding_availability' }
  }

  const mode = checkoutModeForPlan(plan)
  return {
    ok: true,
    intent: {
      planId: plan.id,
      mode,
      lineItem: {
        currency: 'usd',
        productName: plan.name,
        productDescription: plan.summary,
        unitAmount: plan.priceCents,
        recurringInterval: mode === 'subscription' ? 'month' : null,
      },
    },
  }
}

/** The set of plan ids that are self-purchasable today (excludes free/invitation). */
export function selfPurchasablePlanIds(): PlanId[] {
  return (['initial_direction', 'roadmap_pass', 'build', 'growth', 'founding_lifetime'] as PlanId[]).filter(
    isSelfPurchasable,
  )
}
