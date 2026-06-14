// ─────────────────────────────────────────────────────────────────────────────
// entitlements/disclosures — Wave 8 CP5: checkout disclosure assembly + consent guard (pure)
// ─────────────────────────────────────────────────────────────────────────────
// Assembles the disclosures a checkout surface must show, and guards what may enter analytics.
//
// IMPORTANT (legal/compliance stop gate): this module authors NO new customer-facing legal,
// pricing, refund, subscription, or scarcity copy. It only COMPOSES already-approved wording from
// pricingPlans.ts (each plan's scopeNotes + the shared PRICING_DISCLOSURES) and exposes structural
// requirements (Terms/Privacy must be linked; paid plans require explicit consent). Final wording
// and the auto-renewal / refund / cancellation representations remain pending QUALIFIED LEGAL
// REVIEW and are not finalized here.
// ─────────────────────────────────────────────────────────────────────────────

import { getPricingPlan, PRICING_DISCLOSURES, type PlanId } from '../pricing/pricingPlans'

export interface CheckoutDisclosures {
  planId: PlanId
  /** Plan-specific approved scope notes (verbatim from the approved model). */
  planDisclosures: string[]
  /** Shared approved pricing disclosures (verbatim from the approved model). */
  generalDisclosures: string[]
  /** Terms and Privacy must be linked at checkout. */
  requiresTermsLink: boolean
  requiresPrivacyLink: boolean
  termsHref: string
  privacyHref: string
  /** Any paid plan requires explicit, affirmative consent before purchase. */
  requiresExplicitConsent: boolean
}

/**
 * The disclosures required for a plan's checkout, composed from approved data only. Returns null
 * for an unknown plan. The free plan requires no purchase consent.
 */
export function requiredCheckoutDisclosures(planId: PlanId): CheckoutDisclosures | null {
  const plan = getPricingPlan(planId)
  if (!plan) return null
  const isPaid = plan.billingKind !== 'free'
  return {
    planId: plan.id,
    planDisclosures: [...plan.scopeNotes],
    generalDisclosures: [...PRICING_DISCLOSURES],
    requiresTermsLink: true,
    requiresPrivacyLink: true,
    termsHref: '/terms',
    privacyHref: '/privacy',
    requiresExplicitConsent: isPaid,
  }
}

// ── Analytics consent / no-sensitive-data guard ──────────────────────────────────────
// Only these non-PII descriptors may travel into analytics or URLs for a checkout. No email, name,
// customer id, payment/transaction ref, amount, or any raw provider field is ever allowed.
export const CHECKOUT_ANALYTICS_ALLOW_LIST = [
  'plan_id',
  'product_key',
  'checkout_model',
  'mode',
  'currency',
] as const

const FORBIDDEN_ANALYTICS_KEY_SUBSTRINGS = [
  'email',
  'name',
  'customer',
  'payment',
  'transaction',
  'card',
  'token',
  'secret',
  'amount',
  'ref',
] as const

type SafeValue = string | number | boolean

/** Whether a payload is safe for checkout analytics: only allow-listed keys, primitive values. */
export function isCheckoutAnalyticsPayloadSafe(input: unknown): boolean {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return false
  const allow = new Set<string>(CHECKOUT_ANALYTICS_ALLOW_LIST)
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!allow.has(key)) return false
    const lower = key.toLowerCase()
    if (FORBIDDEN_ANALYTICS_KEY_SUBSTRINGS.some(bad => lower.includes(bad))) return false
    const t = typeof value
    if (t !== 'string' && t !== 'number' && t !== 'boolean') return false
  }
  return true
}

/**
 * Strip a payload down to only the allow-listed, primitive, non-PII checkout descriptors. The
 * result always passes isCheckoutAnalyticsPayloadSafe. Pure; never throws.
 */
export function sanitizeCheckoutAnalyticsPayload(input: unknown): Record<string, SafeValue> {
  const out: Record<string, SafeValue> = {}
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return out
  const allow = new Set<string>(CHECKOUT_ANALYTICS_ALLOW_LIST)
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!allow.has(key)) continue
    const lower = key.toLowerCase()
    if (FORBIDDEN_ANALYTICS_KEY_SUBSTRINGS.some(bad => lower.includes(bad))) continue
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      out[key] = value
    }
  }
  return out
}
