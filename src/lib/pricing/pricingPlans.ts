// ─────────────────────────────────────────────────────────────────────────────
// pricing/pricingPlans — Wave 7 CP11: approved pricing presentation (DISPLAY ONLY)
// ─────────────────────────────────────────────────────────────────────────────
// The single source of truth for how SubZeroMetrix™ pricing is PRESENTED. Pure data +
// typed helpers. This module wires NO Stripe, checkout, webhook, entitlement, subscription,
// refund, or environment behavior — the live payment path (/unlock + /api/checkout) is
// untouched and unaffected. It only describes the approved offer so a flag-gated presentation
// surface can render it truthfully.
//
// INVARIANTS (tested):
//   • Prices match the approved model exactly (Free / $19 / $39mo / $79mo / $649).
//   • The Roadmap Pass is a one-time purchase that NEVER auto-converts to a subscription
//     and includes a fixed 30-day Build access window.
//   • One-time, monthly subscription, invitation-only, and lifetime offers are each clearly
//     distinguished by typed fields — not by copy alone.
//   • No annual plan, financing, discount, fabricated savings, or guaranteed-outcome field
//     exists anywhere in the model.
//   • Founding Lifetime is seat-limited to the first 100 verified purchasers, includes NO
//     human coaching, and implies NO ownership/partnership/future-product/third-party-service
//     entitlement.
//   • Pricing is commercially neutral: it never influences MetrixScore™, priority, licensing,
//     pathways, ordering, or recommendation relevance (this module is not imported by the
//     canonical engine).
// ─────────────────────────────────────────────────────────────────────────────

export type PlanId =
  | 'initial_direction'
  | 'roadmap_pass'
  | 'build'
  | 'growth'
  | 'founding_lifetime'

/** How a plan is billed. Distinguishes the commercial mechanics, not just the label. */
export type BillingKind = 'free' | 'one_time' | 'subscription' | 'lifetime'

/** How access is obtained. `invitation` means the plan cannot be self-purchased. */
export type AccessGate = 'open' | 'purchase' | 'invitation'

/** A fixed, included access window granted by a one-time purchase (e.g. Roadmap Pass → Build). */
export interface IncludedAccess {
  plan: PlanId
  days: number
  label: string
}

export interface PricingPlan {
  id: PlanId
  name: string
  /** Whole-dollar price in cents. 0 for the free plan. Authoritative numeric value. */
  priceCents: number
  /** Human price label, e.g. 'Free', '$19', '$39'. No fabricated "was/now" savings. */
  priceLabel: string
  billingKind: BillingKind
  /** Short cadence label, e.g. 'Free', 'One-time', 'Per month'. */
  cadenceLabel: string
  accessGate: AccessGate
  /** True only for the monthly subscription plans. One-time/lifetime never auto-renew. */
  autoRenews: boolean
  invitationOnly: boolean
  seatLimited: boolean
  seatLimit: number | null
  summary: string
  whoFor: string
  includes: string[]
  /** Non-null only for the Roadmap Pass (included 30-day Build access). */
  includedAccess: IncludedAccess | null
  /** Truthful boundaries shown with the plan (esp. Founding Lifetime scope). */
  scopeNotes: string[]
  ctaLabel: string
  displayOrder: number
  // Explicit truth flags — the model can structurally never offer these. Tested.
  readonly hasAnnualOption: false
  readonly hasFinancing: false
  readonly guaranteesOutcome: false
  readonly hasFabricatedSavings: false
}

/** Total Founding Lifetime seats (first 100 verified purchasers). */
export const FOUNDING_SEAT_LIMIT = 100

// Shared "no false claims" flags applied to every plan.
const TRUTH_FLAGS = {
  hasAnnualOption: false,
  hasFinancing: false,
  guaranteesOutcome: false,
  hasFabricatedSavings: false,
} as const

// Founding Lifetime scope — the exact boundaries required by the approved offer. These are
// not disclaimers used to cure a misleading claim; the offer itself is described accurately.
export const FOUNDING_LIFETIME_SCOPE: string[] = [
  'Lifetime access applies only to the SubZeroMetrix™ software entitlement defined in this membership.',
  'No human coaching, consulting, or done-for-you services are included.',
  'No ownership, equity, partnership, or profit-sharing in SubZeroMetrix™ or The Modern Trades Mentor LLC.',
  'No entitlement to unreleased future products, separately sold platforms, or unlimited third-party services.',
  'Limited to the first 100 verified purchasers. No annual plans are offered.',
]

// ── The approved plans ───────────────────────────────────────────────────────────
export const PRICING_PLANS: Record<PlanId, PricingPlan> = {
  initial_direction: {
    id: 'initial_direction',
    name: 'Initial Direction',
    priceCents: 0,
    priceLabel: 'Free',
    billingKind: 'free',
    cadenceLabel: 'Free',
    accessGate: 'open',
    autoRenews: false,
    invitationOnly: false,
    seatLimited: false,
    seatLimit: null,
    summary: 'A fast, honest read on where your contracting business stands today — no account or payment required.',
    whoFor: 'Anyone who just wants to know their starting point before going deeper.',
    includes: [
      'Starter MetrixScore™ and stage',
      'Top strengths and risk areas',
      'A preview of your recommended direction',
      'No account or payment required',
    ],
    includedAccess: null,
    scopeNotes: [],
    ctaLabel: 'Get my Initial Direction',
    displayOrder: 1,
    ...TRUTH_FLAGS,
  },

  roadmap_pass: {
    id: 'roadmap_pass',
    name: 'Personalized Action Roadmap Pass',
    priceCents: 1900,
    priceLabel: '$19',
    billingKind: 'one_time',
    cadenceLabel: 'One-time',
    accessGate: 'purchase',
    autoRenews: false,
    invitationOnly: false,
    seatLimited: false,
    seatLimit: null,
    summary: 'A one-time purchase for your full personalized action roadmap. Includes 30 days of Build access. This is not a subscription and does not renew automatically.',
    whoFor: 'Contractors who want their full roadmap and a month to put it to work — without committing to a recurring plan.',
    includes: [
      'Your full personalized action roadmap',
      'Prioritized first actions and risk explanations',
      '30 days of Build access included',
      'One-time payment — no subscription, no automatic renewal',
    ],
    includedAccess: { plan: 'build', days: 30, label: '30 days of Build access included' },
    scopeNotes: [
      'This is a one-time purchase. It does not start a subscription and will not bill you again.',
      'After the included 30 days of Build access end, Build does not renew unless you choose to start it.',
    ],
    ctaLabel: 'Get the Roadmap Pass',
    displayOrder: 2,
    ...TRUTH_FLAGS,
  },

  build: {
    id: 'build',
    name: 'Build',
    priceCents: 3900,
    priceLabel: '$39',
    billingKind: 'subscription',
    cadenceLabel: 'Per month',
    accessGate: 'purchase',
    autoRenews: true,
    invitationOnly: false,
    seatLimited: false,
    seatLimit: null,
    summary: 'A monthly membership for contractors actively building — saved progress, the full roadmap, and ongoing tools.',
    whoFor: 'Contractors who want continuous access while they execute, month to month.',
    includes: [
      'Saved MetrixProfile™ and progress',
      'Full member dashboard and roadmap',
      'Action tracking and reassessments',
      'Practical contractor templates and tools',
    ],
    includedAccess: null,
    scopeNotes: [
      'Build is a monthly subscription that renews until you cancel. Cancel anytime.',
    ],
    ctaLabel: 'Start Build',
    displayOrder: 3,
    ...TRUTH_FLAGS,
  },

  growth: {
    id: 'growth',
    name: 'Growth',
    priceCents: 7900,
    priceLabel: '$79',
    billingKind: 'subscription',
    cadenceLabel: 'Per month',
    accessGate: 'invitation',
    autoRenews: true,
    invitationOnly: true,
    seatLimited: false,
    seatLimit: null,
    summary: 'An invitation-only monthly membership for established contractors. Access is by invitation and cannot be purchased directly.',
    whoFor: 'Established contractors invited into deeper growth support.',
    includes: [
      'Everything in Build',
      'Deeper growth-stage guidance as released',
      'Invitation-only access',
    ],
    includedAccess: null,
    scopeNotes: [
      'Growth is invitation-only. It is not available for direct self-checkout.',
      'When active, Growth is a monthly subscription that renews until you cancel.',
    ],
    ctaLabel: 'By invitation only',
    displayOrder: 4,
    ...TRUTH_FLAGS,
  },

  founding_lifetime: {
    id: 'founding_lifetime',
    name: 'Founding Lifetime Membership',
    priceCents: 64900,
    priceLabel: '$649',
    billingKind: 'lifetime',
    cadenceLabel: 'One-time',
    accessGate: 'purchase',
    autoRenews: false,
    invitationOnly: false,
    seatLimited: true,
    seatLimit: FOUNDING_SEAT_LIMIT,
    summary: 'A one-time founding payment for lifetime access to the defined SubZeroMetrix™ software entitlement. Limited to the first 100 verified purchasers.',
    whoFor: 'Founding members who want long-term access to the readiness system and updates released to lifetime members.',
    includes: [
      'Lifetime access to the included SubZeroMetrix™ software entitlement',
      'Saved MetrixProfile™ history and reassessments',
      'Platform updates released to lifetime members',
      'Founder status',
    ],
    includedAccess: null,
    scopeNotes: FOUNDING_LIFETIME_SCOPE,
    ctaLabel: 'Become a Founding Member',
    displayOrder: 5,
    ...TRUTH_FLAGS,
  },
}

/** All plans in display order. */
export const PRICING_PLAN_LIST: PricingPlan[] = Object.values(PRICING_PLANS).sort(
  (a, b) => a.displayOrder - b.displayOrder,
)

/** Look up a plan by id. */
export function getPricingPlan(id: PlanId): PricingPlan | undefined {
  return PRICING_PLANS[id]
}

/** Monthly subscription plans (Build, Growth). */
export function subscriptionPlans(): PricingPlan[] {
  return PRICING_PLAN_LIST.filter(p => p.billingKind === 'subscription')
}

/** One-time (non-recurring) priced plans (Roadmap Pass, Founding Lifetime). */
export function oneTimePlans(): PricingPlan[] {
  return PRICING_PLAN_LIST.filter(p => p.billingKind === 'one_time' || p.billingKind === 'lifetime')
}

/** Invitation-only plans (Growth). */
export function invitationOnlyPlans(): PricingPlan[] {
  return PRICING_PLAN_LIST.filter(p => p.invitationOnly)
}

// Shared, presentation-level disclosures. Plain-language statements of fact, kept here so the UI
// renders the same wording everywhere. These distinguish the offer types; they do not "cure" any
// misleading claim, because the offers above are described accurately.
export const PRICING_DISCLOSURES: string[] = [
  'Prices are in U.S. dollars. Applicable taxes may apply at checkout.',
  'The Roadmap Pass is a one-time purchase and does not start a subscription or renew automatically.',
  'Build and Growth are monthly subscriptions that renew until cancelled. Growth is invitation-only.',
  'Founding Lifetime Membership is a one-time payment limited to the first 100 verified purchasers.',
  'No annual plans, financing, or guaranteed business outcomes are offered. Educational use only.',
]
