// ─────────────────────────────────────────────────────────────────────────────
// Membership Tiers — single source of truth (Phase 1: data/model only)
// ─────────────────────────────────────────────────────────────────────────────
// Pure data + typed helpers. No auth, payment, Stripe, Supabase, report gating,
// or UI is wired here. MetrixScore™ is ONE progressive framework across all
// tiers — tiers change profile completeness, saved progress, and score history,
// never the scoring system itself.
// ─────────────────────────────────────────────────────────────────────────────

export type TierId = 'free_snapshot' | 'pro_roadmap' | 'lifetime_founder'

// Access levels (shared vocabulary across access dimensions)
export type AccessLevel = 'none' | 'preview' | 'local' | 'core' | 'full' | 'lifetime'

export type MetrixScoreDepth = 'starter' | 'expanded' | 'deepest'
export type ProfileCompletionDepth = 'partial' | 'full' | 'full_plus_future'
export type ScoreHistoryAccess = 'none' | 'while_active' | 'lifetime'

// Feature keys used by canAccessFeature(). One consistent vocabulary.
export type FeatureKey =
  // Free Starter Snapshot
  | 'starter_score'
  | 'metrix_stage'
  | 'profile_completion'
  | 'top_strengths'
  | 'top_risks'
  | 'path_preview'
  | 'first_actions'
  | 'tool_categories'
  | 'feedback_box'
  | 'browser_snapshot'
  // Pro Roadmap Membership
  | 'saved_profile'
  | 'saved_score'
  | 'member_dashboard'
  | 'full_roadmap'
  | 'path_selection'
  | 'action_tracking'
  | 'twelve_phase_roadmap'
  | 'financial_systems_roadmap'
  | 'sales_playbooks'
  | 'social_starter_plan'
  | 'tool_library'
  | 'risk_explanations'
  | 'category_score_detail'
  | 'reassessment'
  | 'core_templates'
  | 'score_history'
  | 'cross_device_profile'
  // Founding Lifetime Membership
  | 'lifetime_access'
  | 'lifetime_reassessments'
  | 'long_term_risk_tracking'
  | 'full_roadmap_library'
  | 'all_future_templates'
  | 'advanced_phases'
  | 'future_trade_modules'
  | 'priority_features'
  | 'founder_badge'
  | 'vendor_comparison_guides'
  | 'lifetime_toolkit_updates'

export interface MembershipTier {
  id: TierId
  label: string
  positioning: string
  pricePositioning: string
  whoFor: string
  included: string[]
  locked: string[]
  dashboardAccess: AccessLevel
  roadmapAccess: AccessLevel
  templateAccess: AccessLevel
  reassessmentAccess: AccessLevel
  progressTrackingAccess: AccessLevel
  futureUpdateAccess: AccessLevel
  metrixScoreDepth: MetrixScoreDepth
  profileCompletionDepth: ProfileCompletionDepth
  scoreHistoryAccess: ScoreHistoryAccess
  features: FeatureKey[]
  ctaLabel: string
  displayOrder: number
  isPublic: boolean   // true = no login/payment required (free tier)
  isPaid: boolean     // true = requires payment (or a valid promo code)
  lifetimeDisclaimer?: string
}

// ── Feature sets (progressive — each paid tier builds on the one below) ────────
const FREE_FEATURES: FeatureKey[] = [
  'starter_score', 'metrix_stage', 'profile_completion', 'top_strengths',
  'top_risks', 'path_preview', 'first_actions', 'tool_categories',
  'feedback_box', 'browser_snapshot',
]

const PRO_ADDED: FeatureKey[] = [
  'saved_profile', 'saved_score', 'member_dashboard', 'full_roadmap',
  'path_selection', 'action_tracking', 'twelve_phase_roadmap',
  'financial_systems_roadmap', 'sales_playbooks', 'social_starter_plan',
  'tool_library', 'risk_explanations', 'category_score_detail',
  'reassessment', 'core_templates', 'score_history', 'cross_device_profile',
]

const LIFETIME_ADDED: FeatureKey[] = [
  'lifetime_access', 'lifetime_reassessments', 'long_term_risk_tracking',
  'full_roadmap_library', 'all_future_templates', 'advanced_phases',
  'future_trade_modules', 'priority_features', 'founder_badge',
  'vendor_comparison_guides', 'lifetime_toolkit_updates',
]

const PRO_FEATURES: FeatureKey[] = [...FREE_FEATURES, ...PRO_ADDED]
const LIFETIME_FEATURES: FeatureKey[] = [...PRO_FEATURES, ...LIFETIME_ADDED]

// Core Tier 2 tools/templates (also released to Lifetime members).
export const PRO_CORE_TOOLS: string[] = [
  'Business Setup Checklist',
  'Pricing Readiness Checklist',
  'Google Business Profile Checklist',
  'Lead Follow-Up Checklist',
  'Service Agreement Starter Checklist',
  'Sales Call Script',
  'Review Request Script',
  'Financing Conversation Script',
  'Weekly Business Review Template',
  'Vendor Setup Tracker',
]

// Safe lifetime language — do not promise unlimited consulting or every future service.
export const LIFETIME_DISCLAIMER =
  'Founding Lifetime Members receive lifetime access to the SubZeroMetrix™ platform ' +
  'features included in their membership, including saved MetrixProfile™ access, ' +
  'MetrixScore™ reassessments, roadmap progress tracking, and future platform updates ' +
  'released to lifetime members.'

// ── Tiers ─────────────────────────────────────────────────────────────────────
export const MEMBERSHIP_TIERS: Record<TierId, MembershipTier> = {
  free_snapshot: {
    id: 'free_snapshot',
    label: 'Free Starter Snapshot',
    positioning: 'A fast, honest snapshot of where your contracting business stands today.',
    pricePositioning: 'Free. No account or payment required.',
    whoFor: 'Contractors who just completed the assessment and want an immediate read on their readiness before going deeper.',
    included: [
      'Starter MetrixScore™',
      'MetrixStage',
      'Profile completion %',
      'Top 3 strengths',
      'Top 3 risk areas',
      'Recommended path preview',
      'First 3 actions',
      'Basic tool category recommendations',
      'Feedback box',
      'Browser-local snapshot',
      'Save / unlock prompt',
    ],
    locked: [
      'Full roadmap phases',
      'Full dashboard saving',
      'Cross-device MetrixProfile™',
      'Full action tracking',
      'Templates, scripts & checklists',
      'Reassessment history',
      'MetrixScore™ history',
    ],
    dashboardAccess: 'local',
    roadmapAccess: 'preview',
    templateAccess: 'none',
    reassessmentAccess: 'none',
    progressTrackingAccess: 'local',
    futureUpdateAccess: 'none',
    metrixScoreDepth: 'starter',
    profileCompletionDepth: 'partial',
    scoreHistoryAccess: 'none',
    features: FREE_FEATURES,
    ctaLabel: 'See My Starter Snapshot',
    displayOrder: 1,
    isPublic: true,
    isPaid: false,
  },

  pro_roadmap: {
    id: 'pro_roadmap',
    label: 'Pro Roadmap Membership',
    positioning: 'A guided, saved business-building roadmap that grows more accurate as you complete your MetrixProfile™.',
    pricePositioning: 'Paid membership — billed monthly or annually. Positioned as a professional business-building system, not a one-off report.',
    whoFor: 'For contractors who want a guided roadmap, saved progress, and practical business-building tools after their Starter MetrixScore™.',
    included: [
      'Saved MetrixProfile™',
      'Saved MetrixScore™',
      'Full member dashboard',
      'Full recommended roadmap',
      'Path selection',
      'Action checklist tracking',
      'Full 12-phase roadmap',
      'Financial Systems Roadmap',
      'Sales Strategy Playbooks',
      'Social Media Starter Plan',
      'Tool recommendation library',
      'Risk explanations',
      'Category-level score detail',
      'Reassessment access',
      'Core templates, scripts & checklists',
    ],
    locked: [
      'Lifetime saved MetrixProfile™ access',
      'Lifetime MetrixScore™ reassessments & history',
      'Future trade-specific readiness modules',
      'Founder badge & priority feature access',
    ],
    dashboardAccess: 'full',
    roadmapAccess: 'full',
    templateAccess: 'core',
    reassessmentAccess: 'full',
    progressTrackingAccess: 'full',
    futureUpdateAccess: 'full',
    metrixScoreDepth: 'expanded',
    profileCompletionDepth: 'full',
    scoreHistoryAccess: 'while_active',
    features: PRO_FEATURES,
    ctaLabel: 'Unlock Pro Roadmap',
    displayOrder: 2,
    isPublic: false,
    isPaid: true,
  },

  lifetime_founder: {
    id: 'lifetime_founder',
    label: 'Founding Lifetime Membership',
    positioning: 'Lifetime access to the SubZeroMetrix™ readiness system, with saved history and future platform updates released to lifetime members.',
    pricePositioning: 'One-time founding payment for lifetime access. Premium, founder-level pricing.',
    whoFor: 'For founding contractors who want lifetime access to the SubZeroMetrix™ business readiness system, saved MetrixProfile™ history, long-term roadmap tracking, and future platform updates released to lifetime members.',
    included: [
      'Everything in Pro Roadmap Membership',
      'Lifetime saved MetrixProfile™ access',
      'Lifetime MetrixScore™ reassessments',
      'MetrixScore™ history over time',
      'Long-term risk reduction tracking',
      'Full roadmap library access',
      'All current and future contractor templates released to lifetime members',
      'Advanced roadmap phases as released',
      'Future trade-specific readiness modules released to lifetime members',
      'Priority access to new platform features',
      'Founder badge / status',
      'Early access to vendor/tool comparison guides',
      'Lifetime access to launch toolkit updates',
    ],
    locked: [],
    dashboardAccess: 'lifetime',
    roadmapAccess: 'lifetime',
    templateAccess: 'lifetime',
    reassessmentAccess: 'lifetime',
    progressTrackingAccess: 'lifetime',
    futureUpdateAccess: 'lifetime',
    metrixScoreDepth: 'deepest',
    profileCompletionDepth: 'full_plus_future',
    scoreHistoryAccess: 'lifetime',
    features: LIFETIME_FEATURES,
    ctaLabel: 'Become a Founding Member',
    displayOrder: 3,
    isPublic: false,
    isPaid: true,
    lifetimeDisclaimer: LIFETIME_DISCLAIMER,
  },
}

// ── Helpers (simple, typed) ────────────────────────────────────────────────────

/** Look up a single tier by id. */
export function getMembershipTier(tierId: TierId): MembershipTier | undefined {
  return MEMBERSHIP_TIERS[tierId]
}

/** Public tiers (no login/payment required) — i.e. the free tier — by display order. */
export function getPublicTiers(): MembershipTier[] {
  return tiersByOrder().filter(t => t.isPublic)
}

/** Paid tiers (require payment or a valid promo code) — by display order. */
export function getPaidTiers(): MembershipTier[] {
  return tiersByOrder().filter(t => t.isPaid)
}

/** Whether a given tier grants access to a feature. */
export function canAccessFeature(tierId: TierId, featureKey: FeatureKey): boolean {
  const tier = MEMBERSHIP_TIERS[tierId]
  return tier ? tier.features.includes(featureKey) : false
}

function tiersByOrder(): MembershipTier[] {
  return Object.values(MEMBERSHIP_TIERS).sort((a, b) => a.displayOrder - b.displayOrder)
}
