// ─────────────────────────────────────────────────────────────────────────────
// entitlements/session — Wave 8 CP4: privacy-safe checkout-session summary (pure)
// ─────────────────────────────────────────────────────────────────────────────
// Turns the minimal, already-retrieved Stripe session shape into a privacy-safe entitlement
// summary the verify-session route can return to the browser. It reads ONLY payment status and the
// approved plan id from metadata — never email, name, amount, customer id, or any raw provider
// field — so no sensitive or personal data can travel in the API response. Pure; never throws.
// ─────────────────────────────────────────────────────────────────────────────

import { intendedCapabilities, type EntitlementCapability, type EntitlementProductKey } from './types'
import { productKeyForPlan } from './provisioning'
import { getPricingPlan, type PlanId } from '../pricing/pricingPlans'

/** The minimal session fields this summary reads. Intentionally narrow. */
export interface CheckoutSessionLike {
  payment_status?: string | null
  metadata?: Record<string, string | null | undefined> | null
}

export interface SessionEntitlementSummary {
  /** True only when Stripe reports the session paid. */
  paid: boolean
  /** Approved plan id from metadata, or null (legacy/unknown). */
  planId: PlanId | null
  /** Canonical product key for the plan, or null. */
  productKey: EntitlementProductKey | null
  /** Capabilities the plan intends to grant (empty for unknown/legacy). */
  capabilities: EntitlementCapability[]
}

function isPlanId(v: unknown): v is PlanId {
  return typeof v === 'string' && getPricingPlan(v as PlanId) !== undefined
}

/**
 * Summarize a checkout session into a privacy-safe entitlement view. Only the plan/product and
 * paid flag are exposed — no PII or payment detail.
 */
export function summarizeCheckoutSession(session: CheckoutSessionLike | null | undefined): SessionEntitlementSummary {
  const paid = session?.payment_status === 'paid'
  const rawPlan = session?.metadata?.plan_id
  const planId = isPlanId(rawPlan) ? rawPlan : null
  const productKey = planId ? productKeyForPlan(planId) : null
  const capabilities = productKey && productKey !== 'initial_direction' ? intendedCapabilities(productKey) : []
  return { paid, planId, productKey, capabilities }
}
