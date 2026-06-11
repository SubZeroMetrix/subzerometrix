// ─────────────────────────────────────────────────────────────────────────────
// Education Content Map — single source of truth (Phase 1.6B: data/model only)
// ─────────────────────────────────────────────────────────────────────────────
// Catalogs every SubZeroMetrix™ educational asset, tier value, operating-system
// pillar, build status, future score variables, and progressive MetrixScore™
// input groups. No UI, auth, payment, Stripe, Supabase, or scoring is wired here.
// Existing content is referenced by source file at a high level — never duplicated.
//
// Product loop this supports: Diagnose → Prioritize → Choose → Act → Track →
// Improve → Re-score. MetrixScore™ stays ONE progressive framework across tiers.
// ─────────────────────────────────────────────────────────────────────────────

import type { TierId, FeatureKey } from './membershipTiers'
import type { MetrixCategory } from './metrixEngine'

// ── Operating-system pillars ──────────────────────────────────────────────────
export type OperatingSystemPillarId =
  | 'foundation_system'
  | 'financial_control_system'
  | 'pricing_profit_system'
  | 'sales_conversion_system'
  | 'marketing_lead_system'
  | 'operations_delivery_system'
  | 'customer_retention_system'
  | 'recurring_revenue_system'
  | 'people_training_system'
  | 'risk_compliance_system'
  | 'growth_scaling_system'

export interface OperatingSystemPillar {
  id: OperatingSystemPillarId
  label: string
  purpose: string
}

export const OPERATING_SYSTEM_PILLARS: OperatingSystemPillar[] = [
  { id: 'foundation_system',         label: 'Foundation System',          purpose: 'Entity setup, licensing, business structure, insurance, basic readiness.' },
  { id: 'financial_control_system',  label: 'Financial Control System',   purpose: 'Banking, bookkeeping, cash flow, break-even, job costing, tax reserve, margin control.' },
  { id: 'pricing_profit_system',     label: 'Pricing & Profit System',    purpose: 'Pricing readiness, overhead recovery, minimum job price, margin targets, financing readiness.' },
  { id: 'sales_conversion_system',   label: 'Sales Conversion System',    purpose: 'Lead handling, call scripts, estimate follow-up, objection handling, close rate improvement.' },
  { id: 'marketing_lead_system',     label: 'Marketing & Lead System',    purpose: 'Google Business Profile, lead source tracking, referral systems, local marketing, social plan.' },
  { id: 'operations_delivery_system',label: 'Operations & Delivery System',purpose: 'Scheduling, dispatch, first-time fix, callbacks, service workflow, field tools.' },
  { id: 'customer_retention_system', label: 'Customer Retention System',  purpose: 'Repeat customers, review requests, follow-up, reactivation, customer experience.' },
  { id: 'recurring_revenue_system',  label: 'Recurring Revenue System',   purpose: 'Maintenance agreements, service memberships, renewals, tune-up conversion, predictable revenue.' },
  { id: 'people_training_system',    label: 'People & Training System',   purpose: 'First hire readiness, role clarity, training, technician scorecards, leadership routines.' },
  { id: 'risk_compliance_system',    label: 'Risk & Compliance System',   purpose: 'Safety, insurance, documentation, licensing renewal, cybersecurity, access control.' },
  { id: 'growth_scaling_system',     label: 'Growth & Scaling System',    purpose: 'Growth phases, scaling discipline, manager readiness, advanced systems, future value.' },
]

// ── Asset taxonomy ────────────────────────────────────────────────────────────
export type ContentCategory =
  | 'foundation' | 'financial' | 'pricing' | 'sales' | 'marketing'
  | 'operations' | 'customer_experience' | 'recurring_revenue' | 'people'
  | 'risk_compliance' | 'growth' | 'vendor_tools' | 'scoring' | 'cross_cutting'

export type ContentType =
  | 'education' | 'checklist' | 'script' | 'template' | 'worksheet'
  | 'calculator' | 'tracker' | 'playbook' | 'framework' | 'guide'
  | 'system' | 'roadmap' | 'dashboard' | 'vendor_library' | 'data'

export type BuildStatus = 'built' | 'partially_built' | 'preview_only' | 'missing' | 'future'

export type LaunchTiming = 'pre_launch' | 'soon_after_launch' | 'post_launch'

export type ContractorStage = 'startup' | 'early' | 'growth' | 'scale' | 'any'

// Future scoring-input registry (NOT wired into scoring — Step 6).
export type ScoreVariableId =
  | 'lead_source_tracking' | 'lead_response_time' | 'estimate_followup_process'
  | 'close_rate_tracked' | 'average_ticket_known' | 'callback_rate_tracked'
  | 'first_time_fix_tracked' | 'gross_margin_known' | 'break_even_known'
  | 'job_costing_process' | 'monthly_cash_review' | 'maintenance_agreement_offer'
  | 'maintenance_agreement_count' | 'repeat_customer_rate' | 'review_request_process'
  | 'referral_process' | 'customer_reactivation_process' | 'scheduling_dispatch_process'
  | 'technician_scorecard' | 'first_hire_readiness' | 'training_process'
  | 'safety_compliance_checklist' | 'cyber_access_controls'

export interface EducationAssetCore {
  id: string
  title: string
  description: string
  category: ContentCategory
  businessCategory: MetrixCategory | 'any'   // recommended business (MetrixScore) category
  pillar: OperatingSystemPillarId
  contentType: ContentType
  tierAccess: TierId                          // minimum tier that unlocks it
  buildStatus: BuildStatus
  sourceLocation: string                      // file ref, or 'not built'
  relatedFeatureKey?: FeatureKey
  recommendedStage: ContractorStage
  scoreRelated: boolean
  supportsProgressiveScore: boolean
  potentialScoreVariables?: ScoreVariableId[] // score vars it could influence later
  potentialProgressiveInputs?: string[]       // progressive inputs it could unlock later
  launchTiming: LaunchTiming
  displayBullets: string[]                    // short bullets for future tier UI
  implementationNotes?: string
}

// ── Copyright & source-safety layer ───────────────────────────────────────────
export type SourceType =
  | 'internal_original' | 'government' | 'official_resource' | 'vendor_resource'
  | 'industry_reference' | 'third_party_article' | 'future_original'
export type CopyrightRisk = 'low' | 'medium' | 'high'
export type SourceUse =
  | 'direct_link_only' | 'inspiration_only' | 'original_content' | 'public_resource_reference'

export interface CopyrightSafety {
  sourceUrls: string[]
  sourceType: SourceType
  attributionNeeded: boolean
  attributionText?: string
  copyrightRisk: CopyrightRisk
  sourceUse: SourceUse
  originalContentRequired: boolean
  doNotCopy: boolean
  legalNote?: string
  evidenceNotes?: string
}

export interface EducationAsset extends EducationAssetCore, CopyrightSafety {}

// Global content policy — original-first, link-for-reference, no third-party copying.
export const CONTENT_COPYRIGHT_POLICY = {
  summary: 'SubZeroMetrix™ educational assets are intended to be original contractor-readiness guidance.',
  points: [
    'SubZeroMetrix™ educational assets are intended to be original contractor-readiness guidance.',
    'Source links are used for user reference and credibility.',
    'Third-party content should not be copied, republished, screenshotted, or reproduced without permission.',
    'Facts, concepts, and general business systems may inform original SubZeroMetrix™ tools, but wording, templates, images, tables, and proprietary materials must remain original or properly licensed.',
    'Affiliate, partner, or endorsement claims should not be made unless confirmed.',
  ],
} as const

// Per-asset overrides. Source URLs are added ONLY where the URL is canonical and
// already used in existing app code (roadmap.ts / resources) — never fabricated.
// State resources and the vendor library are collections of many URLs, so they
// keep sourceUrls empty (no single canonical link). All URLs are user-reference
// links only — they do not authorize copying any external content.
const SAFETY_OVERRIDES: Record<string, Partial<CopyrightSafety>> = {
  gov_free_resources: {
    sourceType: 'government',
    sourceUrls: [
      'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online',
      'https://www.sba.gov/business-guide',
      'https://www.score.org',
    ],
  },
  state_resources: { sourceType: 'official_resource' },
  vendor_library:  { sourceType: 'vendor_resource' },
  business_setup_checklist: {
    sourceUrls: [
      'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online',
      'https://www.sba.gov/business-guide',
    ],
  },
  gbp_checklist: { sourceUrls: ['https://business.google.com'] },
  pricing_readiness_checklist: {
    sourceUrls: [
      'https://www.score.org/resource/article/how-price-your-services',
      'https://www.sba.gov/business-guide/manage-your-business/manage-your-finances',
    ],
    evidenceNotes: 'Use as original SubZeroMetrix™ guidance informed by common small-business pricing and financial planning practices.',
  },
  break_even_calculator: {
    sourceUrls: ['https://www.sba.gov/business-guide/manage-your-business/manage-your-finances'],
    evidenceNotes: 'Use as original SubZeroMetrix™ guidance informed by common small-business financial planning practices.',
  },
  cyber_security_checklist: {
    sourceUrls: ['https://www.nist.gov/cybersecurity'],
    evidenceNotes: 'Direct-link reference only; build as an original checklist informed by general small-business cybersecurity practices.',
  },
}

const TOOL_CONTENT_TYPES: ContentType[] = ['checklist', 'script', 'template', 'worksheet', 'calculator', 'tracker']

// Derive copyright/source-safety fields deterministically from each asset.
// No source URLs are fabricated — they default to [] and are flagged as missing.
function applyCopyrightSafety(a: EducationAssetCore): EducationAsset {
  const o = SAFETY_OVERRIDES[a.id] ?? {}
  const isTool = TOOL_CONTENT_TYPES.includes(a.contentType)

  const sourceType: SourceType =
    o.sourceType ?? ((a.buildStatus === 'missing' || a.buildStatus === 'future') ? 'future_original' : 'internal_original')

  const isExternal =
    sourceType === 'government' || sourceType === 'official_resource' ||
    sourceType === 'vendor_resource' || sourceType === 'industry_reference' ||
    sourceType === 'third_party_article'

  const originalContentRequired = o.originalContentRequired ?? (sourceType === 'future_original' || isTool)
  const copyrightRisk: CopyrightRisk = o.copyrightRisk ?? (sourceType === 'third_party_article' ? 'medium' : 'low')
  const sourceUse: SourceUse = o.sourceUse ?? (
    sourceType === 'internal_original' || sourceType === 'future_original' ? 'original_content'
    : sourceType === 'government' || sourceType === 'official_resource' ? 'public_resource_reference'
    : sourceType === 'vendor_resource' ? 'direct_link_only'
    : 'inspiration_only'
  )
  const doNotCopy = o.doNotCopy ?? (isExternal || originalContentRequired)
  const attributionNeeded = o.attributionNeeded ?? isExternal
  const sourceUrls = o.sourceUrls ?? []
  const attributionText = o.attributionText ?? (isExternal
    ? 'Source linked for user reference; all SubZeroMetrix™ guidance is original.'
    : undefined)
  const legalNote = o.legalNote ?? (
    copyrightRisk === 'high' ? 'Needs rewrite or permission before publication.'
    : originalContentRequired ? 'Build as original SubZeroMetrix™ content; do not copy third-party templates, wording, tables, or images.'
    : isExternal ? 'Link only — do not reproduce source content, wording, tables, or screenshots.'
    : undefined
  )
  const evidenceNotes = o.evidenceNotes ?? (
    originalContentRequired ? 'Build as original SubZeroMetrix™ content; any source links are for user reference only.'
    : isExternal ? 'Direct-link reference only; do not copy external content, wording, tables, or images.'
    : undefined
  )

  return {
    ...a, sourceUrls, sourceType, attributionNeeded, attributionText,
    copyrightRisk, sourceUse, originalContentRequired, doNotCopy, legalNote, evidenceNotes,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EDUCATION ASSETS
// ─────────────────────────────────────────────────────────────────────────────
const EDUCATION_ASSETS_BASE: EducationAssetCore[] = [

  // ── Existing content (Step 3) — referenced, not duplicated ──────────────────
  {
    id: 'starter_metrixscore', title: 'Starter MetrixScore™',
    description: 'Stage-adjusted readiness score from quick intake + starter assessment.',
    category: 'scoring', businessCategory: 'any', pillar: 'foundation_system', contentType: 'system',
    tierAccess: 'free_snapshot', buildStatus: 'built', sourceLocation: 'src/lib/metrixReport.ts, src/lib/metrixEngine.ts',
    relatedFeatureKey: 'starter_score', recommendedStage: 'any', scoreRelated: true, supportsProgressiveScore: true,
    launchTiming: 'pre_launch', displayBullets: ['Your readiness score, 0–100', 'Stage-adjusted, not a generic quiz'],
  },
  {
    id: 'starter_results_education', title: 'Starter Results Education',
    description: 'Free results page: risk language, path preview, first 3 actions, MetrixProfile™ context.',
    category: 'cross_cutting', businessCategory: 'any', pillar: 'foundation_system', contentType: 'education',
    tierAccess: 'free_snapshot', buildStatus: 'built', sourceLocation: 'src/app/results/page.tsx',
    relatedFeatureKey: 'path_preview', recommendedStage: 'any', scoreRelated: true, supportsProgressiveScore: true,
    launchTiming: 'pre_launch', displayBullets: ['Top risks explained plainly', 'Your first 3 moves'],
  },
  {
    id: 'choose_your_path', title: 'Choose Your Path + First Actions',
    description: 'Recommended / fastest-win / owner-choice path selection and 3–5 generated actions.',
    category: 'cross_cutting', businessCategory: 'any', pillar: 'growth_scaling_system', contentType: 'system',
    tierAccess: 'free_snapshot', buildStatus: 'built', sourceLocation: 'src/lib/pathActions.ts, src/components/ChoosePathSection.tsx',
    relatedFeatureKey: 'path_selection', recommendedStage: 'any', scoreRelated: true, supportsProgressiveScore: true,
    launchTiming: 'pre_launch', displayBullets: ['Pick your direction', 'Action-by-action guidance'],
  },
  {
    id: 'personalized_roadmap', title: 'Personalized Needs-First Roadmap',
    description: 'Education-before-vendor roadmap (~11 items): why it matters, DIY path, gov resources, vendor options.',
    category: 'cross_cutting', businessCategory: 'any', pillar: 'foundation_system', contentType: 'roadmap',
    tierAccess: 'pro_roadmap', buildStatus: 'built', sourceLocation: 'src/lib/roadmap.ts',
    relatedFeatureKey: 'full_roadmap', recommendedStage: 'any', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'pre_launch', displayBullets: ['Step-by-step, education first', 'DIY path always shown'],
  },
  {
    id: 'growth_phases_12', title: '12 Growth Phases',
    description: '12 contractor growth phases with 30/60/90 plans, KPIs, common mistakes, and impact framing.',
    category: 'growth', businessCategory: 'growth_risk', pillar: 'growth_scaling_system', contentType: 'roadmap',
    tierAccess: 'pro_roadmap', buildStatus: 'built', sourceLocation: 'src/lib/growthPhases.ts',
    relatedFeatureKey: 'twelve_phase_roadmap', recommendedStage: 'any', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'pre_launch', displayBullets: ['Full 12-phase roadmap', '30/60/90-day plans'],
  },
  {
    id: 'financial_systems_roadmap', title: 'Financial Systems Roadmap',
    description: 'Banking, bookkeeping, and finance paths with startup/growing/scaling steps and what-to-measure.',
    category: 'financial', businessCategory: 'financial_control', pillar: 'financial_control_system', contentType: 'roadmap',
    tierAccess: 'pro_roadmap', buildStatus: 'built', sourceLocation: 'src/lib/financialSystemsRoadmap.ts',
    relatedFeatureKey: 'financial_systems_roadmap', recommendedStage: 'any', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'pre_launch', displayBullets: ['Banking → bookkeeping → margin', 'Stage-by-stage steps'],
  },
  {
    id: 'sales_playbooks', title: 'Sales Strategy Playbooks',
    description: '10 structured sales playbooks with scripts, steps, key principles, and success metrics.',
    category: 'sales', businessCategory: 'sales_marketing', pillar: 'sales_conversion_system', contentType: 'playbook',
    tierAccess: 'pro_roadmap', buildStatus: 'built', sourceLocation: 'src/lib/salesPlaybooks.ts',
    relatedFeatureKey: 'sales_playbooks', recommendedStage: 'any', scoreRelated: false, supportsProgressiveScore: false,
    potentialScoreVariables: ['close_rate_tracked', 'estimate_followup_process'],
    launchTiming: 'pre_launch', displayBullets: ['Booking, objections, follow-up', 'Field-tested scripts'],
  },
  {
    id: 'social_starter_plan', title: 'Social Media Starter Plan',
    description: '30-day social content program (weekly themes + posts) for contractor visibility.',
    category: 'marketing', businessCategory: 'sales_marketing', pillar: 'marketing_lead_system', contentType: 'template',
    tierAccess: 'pro_roadmap', buildStatus: 'built', sourceLocation: 'src/lib/marketingAssets.ts',
    relatedFeatureKey: 'social_starter_plan', recommendedStage: 'any', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'pre_launch', displayBullets: ['30 days of posts', 'Weekly themes ready to use'],
  },
  {
    id: 'flyer_concepts', title: 'Flyer & Direct-Mail Concepts',
    description: '14 flyer concepts with headlines, offers, captions, and distribution notes.',
    category: 'marketing', businessCategory: 'sales_marketing', pillar: 'marketing_lead_system', contentType: 'template',
    tierAccess: 'pro_roadmap', buildStatus: 'built', sourceLocation: 'src/lib/marketingAssets.ts',
    recommendedStage: 'any', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'pre_launch', displayBullets: ['14 ready flyer concepts', 'Door-hanger to social'],
  },
  {
    id: 'road_paths', title: 'Referral / Upsell / Cross-Sell Road Paths',
    description: 'Step-by-step road paths for referrals, upsells, and cross-sells.',
    category: 'recurring_revenue', businessCategory: 'customer_experience', pillar: 'recurring_revenue_system', contentType: 'playbook',
    tierAccess: 'pro_roadmap', buildStatus: 'built', sourceLocation: 'src/lib/marketingAssets.ts',
    recommendedStage: 'growth', scoreRelated: false, supportsProgressiveScore: false,
    potentialScoreVariables: ['referral_process', 'repeat_customer_rate'],
    launchTiming: 'pre_launch', displayBullets: ['Turn jobs into referrals', 'Upsell + cross-sell paths'],
  },
  {
    id: 'vendor_library', title: 'Tool & Vendor Research Library',
    description: '22 categories, ~157 vendors with honest descriptions, cost notes, and DIY-first framing.',
    category: 'vendor_tools', businessCategory: 'any', pillar: 'operations_delivery_system', contentType: 'vendor_library',
    tierAccess: 'pro_roadmap', buildStatus: 'built', sourceLocation: 'src/lib/vendorCategories.ts',
    relatedFeatureKey: 'tool_library', recommendedStage: 'any', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'pre_launch', displayBullets: ['157 vendors, 22 categories', 'Educational, not affiliate-driven'],
  },
  {
    id: 'trade_benchmarks', title: 'Trade-Specific Benchmarks & KPIs',
    description: 'Per-trade benchmarks, KPIs, stage tables, and industry insight on public platform pages.',
    category: 'growth', businessCategory: 'any', pillar: 'growth_scaling_system', contentType: 'data',
    tierAccess: 'free_snapshot', buildStatus: 'built', sourceLocation: 'src/lib/tradeData.ts, src/app/platform/[trade]/page.tsx',
    recommendedStage: 'any', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'pre_launch', displayBullets: ['Know your trade benchmarks', 'Stage-by-stage KPIs'],
  },
  {
    id: 'state_resources', title: 'State Licensing & Formation Resources',
    description: 'Per-state licensing, formation, tax, and insurance resource links.',
    category: 'foundation', businessCategory: 'business_foundation', pillar: 'foundation_system', contentType: 'data',
    tierAccess: 'pro_roadmap', buildStatus: 'built', sourceLocation: 'src/lib/stateResources.ts',
    recommendedStage: 'startup', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'pre_launch', displayBullets: ['Your state requirements', 'Official links, verified'],
  },
  {
    id: 'risk_explanations', title: 'Risk Area Explanations',
    description: 'Plain-language explanation of why each top risk area matters and where to start.',
    category: 'cross_cutting', businessCategory: 'any', pillar: 'risk_compliance_system', contentType: 'education',
    tierAccess: 'free_snapshot', buildStatus: 'built', sourceLocation: 'src/lib/metrixReport.ts',
    relatedFeatureKey: 'risk_explanations', recommendedStage: 'any', scoreRelated: true, supportsProgressiveScore: false,
    launchTiming: 'pre_launch', displayBullets: ['Your risks, explained', 'Not a verdict — a starting point'],
  },
  {
    id: 'dashboard_progress', title: 'Dashboard Progress & Momentum',
    description: 'Current score, completion %, current action, risk level, and possible score gain.',
    category: 'cross_cutting', businessCategory: 'any', pillar: 'growth_scaling_system', contentType: 'dashboard',
    tierAccess: 'free_snapshot', buildStatus: 'built', sourceLocation: 'src/app/dashboard/page.tsx',
    relatedFeatureKey: 'member_dashboard', recommendedStage: 'any', scoreRelated: true, supportsProgressiveScore: true,
    launchTiming: 'pre_launch', displayBullets: ['See your momentum', 'Possible score gain'],
  },
  {
    id: 'gov_free_resources', title: 'Government & Free Resources',
    description: 'Curated IRS/SBA/SCORE/state links and free starting points.',
    category: 'foundation', businessCategory: 'business_foundation', pillar: 'foundation_system', contentType: 'data',
    tierAccess: 'free_snapshot', buildStatus: 'built', sourceLocation: 'src/app/resources/page.tsx',
    recommendedStage: 'startup', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'pre_launch', displayBullets: ['Free official resources', 'EIN, SBA, SCORE'],
  },

  // ── Tier 2 core tools (Step 4) ──────────────────────────────────────────────
  {
    id: 'business_setup_checklist', title: 'Business Setup Checklist',
    description: 'Ordered checklist: EIN → entity → license → bank → insurance → contract → tax savings.',
    category: 'foundation', businessCategory: 'business_foundation', pillar: 'foundation_system', contentType: 'checklist',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built (guidance in src/lib/roadmap.ts legal phase)',
    relatedFeatureKey: 'core_templates', recommendedStage: 'startup', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: [], launchTiming: 'pre_launch',
    displayBullets: ['Every setup step in order', 'Checkbox + official links'],
    implementationNotes: 'Package from roadmap.ts legal-foundation items (ein, entity, license, bank, insurance).',
  },
  {
    id: 'pricing_readiness_checklist', title: 'Pricing Readiness Checklist',
    description: 'Loaded hourly cost, overhead %, material markup, labor rate, minimum job price, margin target.',
    category: 'pricing', businessCategory: 'financial_control', pillar: 'pricing_profit_system', contentType: 'checklist',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built (guidance in src/lib/roadmap.ts pricing item)',
    relatedFeatureKey: 'core_templates', recommendedStage: 'early', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['gross_margin_known', 'break_even_known'], launchTiming: 'pre_launch',
    displayBullets: ['Know your real minimum price', 'Stop guessing on margin'],
  },
  {
    id: 'gbp_checklist', title: 'Google Business Profile Checklist',
    description: 'Claim, categories, service area, hours, photos, reviews target, posts, Q&A.',
    category: 'marketing', businessCategory: 'sales_marketing', pillar: 'marketing_lead_system', contentType: 'checklist',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built (guidance in src/lib/roadmap.ts gbp item)',
    relatedFeatureKey: 'core_templates', recommendedStage: 'early', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['lead_source_tracking'], launchTiming: 'pre_launch',
    displayBullets: ['Rank in local search', 'Highest-ROI free marketing'],
  },
  {
    id: 'lead_followup_checklist', title: 'Lead Follow-Up Checklist',
    description: 'Capture every lead, response-time SLA, follow-up cadence, missed-call text, review/referral ask.',
    category: 'sales', businessCategory: 'sales_marketing', pillar: 'sales_conversion_system', contentType: 'checklist',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built (guidance in src/lib/roadmap.ts customers item)',
    relatedFeatureKey: 'core_templates', recommendedStage: 'early', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['lead_response_time', 'estimate_followup_process'], launchTiming: 'pre_launch',
    displayBullets: ['Stop losing leads', 'Response-time SLA built in'],
  },
  {
    id: 'service_agreement_checklist', title: 'Service Agreement Starter Checklist',
    description: 'Scope, price, payment terms, change orders, warranty, cancellation, liability, signatures.',
    category: 'recurring_revenue', businessCategory: 'business_foundation', pillar: 'recurring_revenue_system', contentType: 'checklist',
    tierAccess: 'pro_roadmap', buildStatus: 'partially_built', sourceLocation: 'partial (mentions in growthPhases.ts / roadmap.ts)',
    relatedFeatureKey: 'core_templates', recommendedStage: 'early', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['maintenance_agreement_offer'], launchTiming: 'soon_after_launch',
    displayBullets: ['Protect every job in writing', 'Agreement essentials covered'],
  },
  {
    id: 'sales_call_script', title: 'Sales Call Script',
    description: 'Inbound call answering and booking script (printable, standalone).',
    category: 'sales', businessCategory: 'sales_marketing', pillar: 'sales_conversion_system', contentType: 'script',
    tierAccess: 'pro_roadmap', buildStatus: 'partially_built', sourceLocation: 'src/lib/salesPlaybooks.ts (phone-booking playbook — needs packaging)',
    relatedFeatureKey: 'core_templates', recommendedStage: 'any', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['close_rate_tracked'], launchTiming: 'pre_launch',
    displayBullets: ['Book more calls', 'Word-for-word script'],
    implementationNotes: 'Substantially exists in salesPlaybooks.ts — repackage as a standalone printable artifact.',
  },
  {
    id: 'review_request_script', title: 'Review Request Script',
    description: 'Timing, in-person ask, text + email templates, link, response handling.',
    category: 'customer_experience', businessCategory: 'customer_experience', pillar: 'customer_retention_system', contentType: 'script',
    tierAccess: 'pro_roadmap', buildStatus: 'partially_built', sourceLocation: 'src/lib/salesPlaybooks.ts (referral/follow-up — needs packaging)',
    relatedFeatureKey: 'core_templates', recommendedStage: 'any', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['review_request_process'], launchTiming: 'pre_launch',
    displayBullets: ['Get more reviews', 'Ask at the right moment'],
  },
  {
    id: 'financing_conversation_script', title: 'Financing Conversation Script',
    description: 'When to offer, monthly-vs-total framing, objection handling, partner hand-off.',
    category: 'pricing', businessCategory: 'financial_control', pillar: 'pricing_profit_system', contentType: 'script',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built (financing guidance scattered in vendorCategories.ts)',
    relatedFeatureKey: 'core_templates', recommendedStage: 'growth', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'soon_after_launch', displayBullets: ['Close bigger tickets', 'Monthly-payment framing'],
  },
  {
    id: 'weekly_business_review_template', title: 'Weekly Business Review Template',
    description: 'Revenue/jobs, cash position, AR, leads, close rate, callbacks, #1 priority.',
    category: 'operations', businessCategory: 'operations', pillar: 'operations_delivery_system', contentType: 'template',
    tierAccess: 'pro_roadmap', buildStatus: 'preview_only', sourceLocation: 'preview only (financialSystemsRoadmap.ts upgradePreview)',
    relatedFeatureKey: 'core_templates', recommendedStage: 'early', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['monthly_cash_review', 'close_rate_tracked', 'callback_rate_tracked'], launchTiming: 'pre_launch',
    displayBullets: ['Run your week on numbers', '10-minute owner routine'],
  },
  {
    id: 'vendor_setup_tracker', title: 'Vendor Setup Tracker',
    description: 'Chosen tool per category, setup status, cost, renewal date, login owner.',
    category: 'vendor_tools', businessCategory: 'operations', pillar: 'operations_delivery_system', contentType: 'tracker',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built (library exists: src/lib/vendorCategories.ts)',
    relatedFeatureKey: 'core_templates', recommendedStage: 'growth', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'soon_after_launch', displayBullets: ['Track every tool you run', 'Renewals + logins in one place'],
  },

  // ── High-priority Pro additions (Step 5) ────────────────────────────────────
  {
    id: 'score_improvement_guide', title: 'Score Improvement Guide',
    description: 'How to raise your MetrixScore™ by category — the highest-leverage moves first.',
    category: 'scoring', businessCategory: 'any', pillar: 'growth_scaling_system', contentType: 'guide',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built (logic in metrixReport.estimatePotential)',
    relatedFeatureKey: 'category_score_detail', recommendedStage: 'any', scoreRelated: true, supportsProgressiveScore: true,
    launchTiming: 'pre_launch', displayBullets: ['Raise your score on purpose', 'Category-by-category playbook'],
    implementationNotes: 'Reinforces the progressive-score promise directly; derive from estimatePotential + category gaps.',
  },
  {
    id: 'job_costing_worksheet', title: 'Job Costing Starter Worksheet',
    description: 'Estimate-vs-actual cost per job: materials, labor, subs, overhead allocation.',
    category: 'financial', businessCategory: 'financial_control', pillar: 'financial_control_system', contentType: 'worksheet',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built',
    recommendedStage: 'growth', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['job_costing_process', 'gross_margin_known'], launchTiming: 'soon_after_launch',
    displayBullets: ['Know profit per job', 'Estimate vs actual'],
  },
  {
    id: 'break_even_calculator', title: 'Break-Even Calculator',
    description: 'Fixed costs ÷ contribution margin → break-even revenue and billable-hour target.',
    category: 'financial', businessCategory: 'financial_control', pillar: 'financial_control_system', contentType: 'calculator',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built',
    recommendedStage: 'early', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['break_even_known'], launchTiming: 'soon_after_launch',
    displayBullets: ['Know your break-even number', 'How much you must bill'],
  },
  {
    id: 'marketing_roi_tracker', title: 'Marketing ROI Tracker',
    description: 'Spend, leads, jobs, and revenue by channel to find what actually works.',
    category: 'marketing', businessCategory: 'sales_marketing', pillar: 'marketing_lead_system', contentType: 'tracker',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built',
    recommendedStage: 'growth', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['lead_source_tracking'], launchTiming: 'soon_after_launch',
    displayBullets: ['Stop wasting ad spend', 'ROI by channel'],
  },
  {
    id: 'customer_retention_checklist', title: 'Customer Retention Checklist',
    description: 'Follow-up cadence, seasonal touchpoints, review + referral asks, reactivation triggers.',
    category: 'customer_experience', businessCategory: 'customer_experience', pillar: 'customer_retention_system', contentType: 'checklist',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built',
    recommendedStage: 'growth', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['repeat_customer_rate'], launchTiming: 'soon_after_launch',
    displayBullets: ['Keep customers coming back', 'Turn one job into many'],
  },
  {
    id: 'maintenance_agreement_checklist', title: 'Maintenance Agreement Starter Checklist',
    description: 'Offer structure, pricing, visit cadence, member benefits, renewal process.',
    category: 'recurring_revenue', businessCategory: 'growth_risk', pillar: 'recurring_revenue_system', contentType: 'checklist',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built',
    recommendedStage: 'growth', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['maintenance_agreement_offer', 'maintenance_agreement_count'], launchTiming: 'soon_after_launch',
    displayBullets: ['Build predictable revenue', 'Launch your first agreement'],
  },
  {
    id: 'service_call_followup_script', title: 'Service Call Follow-Up Script',
    description: 'Post-job check-in that drives reviews, referrals, and repeat work.',
    category: 'customer_experience', businessCategory: 'customer_experience', pillar: 'customer_retention_system', contentType: 'script',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built',
    recommendedStage: 'any', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['review_request_process', 'repeat_customer_rate'], launchTiming: 'soon_after_launch',
    displayBullets: ['One call, three wins', 'Reviews + referrals + repeat'],
  },
  {
    id: 'review_generation_system', title: 'Review Generation System',
    description: 'Systematic review collection: timing, channels, templates, response handling.',
    category: 'customer_experience', businessCategory: 'customer_experience', pillar: 'customer_retention_system', contentType: 'system',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built (vendor support: reviews category)',
    recommendedStage: 'growth', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['review_request_process'], launchTiming: 'soon_after_launch',
    displayBullets: ['Reviews on autopilot', 'Win the next job before quoting'],
  },
  {
    id: 'lead_source_tracker', title: 'Lead Source Tracker',
    description: 'Log every lead by source to learn which channels convert to booked jobs.',
    category: 'marketing', businessCategory: 'sales_marketing', pillar: 'marketing_lead_system', contentType: 'tracker',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built',
    recommendedStage: 'early', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['lead_source_tracking', 'close_rate_tracked'], launchTiming: 'soon_after_launch',
    displayBullets: ['Know where leads come from', 'Double down on what works'],
  },
  {
    id: 'customer_reactivation_checklist', title: 'Customer Reactivation Checklist',
    description: 'Identify dormant customers and win them back with timed, relevant outreach.',
    category: 'customer_experience', businessCategory: 'customer_experience', pillar: 'customer_retention_system', contentType: 'checklist',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built',
    recommendedStage: 'growth', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['customer_reactivation_process'], launchTiming: 'soon_after_launch',
    displayBullets: ['Wake up past customers', 'Revenue you already earned'],
  },
  {
    id: 'callback_reduction_checklist', title: 'Callback Reduction Checklist',
    description: 'Pre-departure quality checks that cut warranty callbacks and protect margin.',
    category: 'operations', businessCategory: 'operations', pillar: 'operations_delivery_system', contentType: 'checklist',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built',
    recommendedStage: 'growth', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['callback_rate_tracked', 'first_time_fix_tracked'], launchTiming: 'soon_after_launch',
    displayBullets: ['Fewer callbacks', 'Protect your margin'],
  },
  {
    id: 'first_time_fix_checklist', title: 'First-Time Fix Readiness Checklist',
    description: 'Truck stock, diagnostics, and prep that raise first-visit completion.',
    category: 'operations', businessCategory: 'operations', pillar: 'operations_delivery_system', contentType: 'checklist',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built',
    recommendedStage: 'growth', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['first_time_fix_tracked'], launchTiming: 'soon_after_launch',
    displayBullets: ['Fix it on the first trip', 'Happier customers, lower cost'],
  },
  {
    id: 'gross_margin_worksheet', title: 'Gross Margin Review Worksheet',
    description: 'Margin by job type and service line to find where the profit really is.',
    category: 'financial', businessCategory: 'financial_control', pillar: 'financial_control_system', contentType: 'worksheet',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built',
    recommendedStage: 'growth', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['gross_margin_known'], launchTiming: 'soon_after_launch',
    displayBullets: ['Find your real margin', 'By job type and service line'],
  },
  {
    id: 'monthly_cash_review_template', title: 'Monthly Cash Review Template',
    description: 'Cash position, reserves, AR/AP, tax set-aside, and runway in one monthly view.',
    category: 'financial', businessCategory: 'financial_control', pillar: 'financial_control_system', contentType: 'template',
    tierAccess: 'pro_roadmap', buildStatus: 'missing', sourceLocation: 'not built',
    recommendedStage: 'growth', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['monthly_cash_review'], launchTiming: 'soon_after_launch',
    displayBullets: ['See your runway', 'Never get surprised by cash'],
  },

  // ── Lifetime / future premium additions (Step 5) ────────────────────────────
  {
    id: 'quarterly_business_review_framework', title: 'Quarterly Business Review Framework',
    description: 'Quarterly owner review of scorecards, finances, pipeline, and goals.',
    category: 'growth', businessCategory: 'growth_risk', pillar: 'growth_scaling_system', contentType: 'framework',
    tierAccess: 'lifetime_founder', buildStatus: 'future', sourceLocation: 'not built',
    relatedFeatureKey: 'advanced_phases', recommendedStage: 'scale', scoreRelated: true, supportsProgressiveScore: true,
    launchTiming: 'post_launch', displayBullets: ['Run quarterly like a CEO', 'Tie review to your score'],
  },
  {
    id: 'customer_lifetime_value_tracker', title: 'Customer Lifetime Value Tracker',
    description: 'Track repeat revenue and LTV by customer cohort over time.',
    category: 'recurring_revenue', businessCategory: 'customer_experience', pillar: 'customer_retention_system', contentType: 'tracker',
    tierAccess: 'lifetime_founder', buildStatus: 'future', sourceLocation: 'not built',
    recommendedStage: 'scale', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['repeat_customer_rate'], launchTiming: 'post_launch',
    displayBullets: ['Know what a customer is worth', 'Invest where it pays back'],
  },
  {
    id: 'recurring_revenue_growth_tracker', title: 'Recurring Revenue Growth Tracker',
    description: 'Agreement count, renewal rate, and recurring revenue trend over time.',
    category: 'recurring_revenue', businessCategory: 'growth_risk', pillar: 'recurring_revenue_system', contentType: 'tracker',
    tierAccess: 'lifetime_founder', buildStatus: 'future', sourceLocation: 'not built',
    recommendedStage: 'scale', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['maintenance_agreement_count'], launchTiming: 'post_launch',
    displayBullets: ['Grow predictable revenue', 'Track renewals + churn'],
  },
  {
    id: 'technician_performance_scorecard', title: 'Technician Performance Scorecard',
    description: 'Per-tech metrics: revenue, close rate, callbacks, reviews, first-time fix.',
    category: 'people', businessCategory: 'people_leadership', pillar: 'people_training_system', contentType: 'tracker',
    tierAccess: 'lifetime_founder', buildStatus: 'future', sourceLocation: 'not built',
    recommendedStage: 'scale', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['technician_scorecard'], launchTiming: 'post_launch',
    displayBullets: ['Coach your team on numbers', 'Spot top + struggling techs'],
  },
  {
    id: 'risk_reduction_dashboard', title: 'Risk Reduction Dashboard',
    description: 'Track risk-area scores trending down over time as you close gaps.',
    category: 'risk_compliance', businessCategory: 'growth_risk', pillar: 'risk_compliance_system', contentType: 'dashboard',
    tierAccess: 'lifetime_founder', buildStatus: 'future', sourceLocation: 'not built',
    relatedFeatureKey: 'long_term_risk_tracking', recommendedStage: 'scale', scoreRelated: true, supportsProgressiveScore: true,
    launchTiming: 'post_launch', displayBullets: ['Watch risk shrink over time', 'Proof your work is paying off'],
  },
  {
    id: 'hiring_readiness_system', title: 'Hiring Readiness System',
    description: 'First-hire readiness, role definition, onboarding, and 90-day ramp.',
    category: 'people', businessCategory: 'people_leadership', pillar: 'people_training_system', contentType: 'system',
    tierAccess: 'lifetime_founder', buildStatus: 'future', sourceLocation: 'not built (thin coverage in growthPhases.ts)',
    recommendedStage: 'growth', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['first_hire_readiness', 'training_process'], launchTiming: 'post_launch',
    displayBullets: ['Hire without the chaos', 'First hire to first 90 days'],
  },
  {
    id: 'cyber_security_checklist', title: 'Cyber / Data Security Checklist',
    description: 'Account access, password hygiene, backups, and customer-data protection.',
    category: 'risk_compliance', businessCategory: 'growth_risk', pillar: 'risk_compliance_system', contentType: 'checklist',
    tierAccess: 'lifetime_founder', buildStatus: 'future', sourceLocation: 'not built',
    recommendedStage: 'scale', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['cyber_access_controls'], launchTiming: 'post_launch',
    displayBullets: ['Lock down your accounts', 'Protect customer data'],
  },
  {
    id: 'exit_readiness_module', title: 'Exit Readiness / Business Value Module',
    description: 'What makes a contracting business sellable and how to build transferable value.',
    category: 'growth', businessCategory: 'growth_risk', pillar: 'growth_scaling_system', contentType: 'guide',
    tierAccess: 'lifetime_founder', buildStatus: 'future', sourceLocation: 'not built',
    recommendedStage: 'scale', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'post_launch', displayBullets: ['Build a business that sells', 'Value beyond your own labor'],
  },
  {
    id: 'vendor_comparison_guides', title: 'Vendor Comparison Guides',
    description: 'Head-to-head guides per category (FSM, accounting, insurance, financing).',
    category: 'vendor_tools', businessCategory: 'operations', pillar: 'operations_delivery_system', contentType: 'guide',
    tierAccess: 'lifetime_founder', buildStatus: 'future', sourceLocation: 'not built (library: vendorCategories.ts)',
    relatedFeatureKey: 'vendor_comparison_guides', recommendedStage: 'growth', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'post_launch', displayBullets: ['Pick the right tool faster', 'Honest head-to-head guides'],
  },
  {
    id: 'trade_specific_advanced_modules', title: 'Trade-Specific Advanced Modules',
    description: 'Deeper readiness modules per trade (HVAC, electrical, plumbing, etc.).',
    category: 'growth', businessCategory: 'any', pillar: 'growth_scaling_system', contentType: 'system',
    tierAccess: 'lifetime_founder', buildStatus: 'future', sourceLocation: 'not built (base: tradeData.ts)',
    relatedFeatureKey: 'future_trade_modules', recommendedStage: 'scale', scoreRelated: true, supportsProgressiveScore: true,
    launchTiming: 'post_launch', displayBullets: ['Built for your trade', 'Released to lifetime members'],
  },
  {
    id: 'sop_library', title: 'SOP Library',
    description: 'Standard operating procedures for common contractor workflows.',
    category: 'operations', businessCategory: 'operations', pillar: 'operations_delivery_system', contentType: 'system',
    tierAccess: 'lifetime_founder', buildStatus: 'future', sourceLocation: 'not built',
    recommendedStage: 'scale', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'post_launch', displayBullets: ['Systemize the work', 'Run without you on every job'],
  },
  {
    id: 'owner_operating_rhythm', title: 'Owner Operating Rhythm',
    description: 'Daily/weekly/monthly owner routines that keep the business on track.',
    category: 'operations', businessCategory: 'people_leadership', pillar: 'growth_scaling_system', contentType: 'framework',
    tierAccess: 'lifetime_founder', buildStatus: 'future', sourceLocation: 'not built',
    recommendedStage: 'scale', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'post_launch', displayBullets: ['Run the business on rhythm', 'Daily → weekly → monthly'],
  },
  {
    id: 'maintenance_agreement_growth_system', title: 'Maintenance Agreement Growth System',
    description: 'Scale agreements: conversion at point of sale, renewals, and member retention.',
    category: 'recurring_revenue', businessCategory: 'growth_risk', pillar: 'recurring_revenue_system', contentType: 'system',
    tierAccess: 'lifetime_founder', buildStatus: 'future', sourceLocation: 'not built',
    recommendedStage: 'scale', scoreRelated: true, supportsProgressiveScore: true,
    potentialScoreVariables: ['maintenance_agreement_count'], launchTiming: 'post_launch',
    displayBullets: ['Scale recurring revenue', 'Convert + renew systematically'],
  },
  {
    id: 'department_scorecards', title: 'Department Scorecards',
    description: 'Scorecards for sales, ops, and service to manage a multi-person business.',
    category: 'people', businessCategory: 'people_leadership', pillar: 'people_training_system', contentType: 'tracker',
    tierAccess: 'lifetime_founder', buildStatus: 'future', sourceLocation: 'not built',
    recommendedStage: 'scale', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'post_launch', displayBullets: ['Manage by numbers', 'Every department accountable'],
  },
  {
    id: 'leadership_rhythm_system', title: 'Leadership Rhythm System',
    description: 'Meeting cadence, one-on-ones, and accountability rhythms for a growing team.',
    category: 'people', businessCategory: 'people_leadership', pillar: 'people_training_system', contentType: 'framework',
    tierAccess: 'lifetime_founder', buildStatus: 'future', sourceLocation: 'not built',
    recommendedStage: 'scale', scoreRelated: false, supportsProgressiveScore: false,
    launchTiming: 'post_launch', displayBullets: ['Lead a team on rhythm', 'Meetings that actually work'],
  },
  {
    id: 'business_value_readiness_tracker', title: 'Business Value Readiness Tracker',
    description: 'Track the drivers of transferable business value over the long term.',
    category: 'growth', businessCategory: 'growth_risk', pillar: 'growth_scaling_system', contentType: 'tracker',
    tierAccess: 'lifetime_founder', buildStatus: 'future', sourceLocation: 'not built',
    recommendedStage: 'scale', scoreRelated: true, supportsProgressiveScore: true,
    launchTiming: 'post_launch', displayBullets: ['Build long-term value', 'Track what buyers pay for'],
  },
]

// Enriched export — every asset carries copyright/source-safety fields.
export const EDUCATION_ASSETS: EducationAsset[] = EDUCATION_ASSETS_BASE.map(applyCopyrightSafety)

// ─────────────────────────────────────────────────────────────────────────────
// Future score-variable registry (Step 6) — NOT wired into scoring
// ─────────────────────────────────────────────────────────────────────────────
export interface FutureScoreVariable {
  id: ScoreVariableId
  label: string
  pillar: OperatingSystemPillarId
  businessCategory: MetrixCategory
}

export const FUTURE_SCORE_VARIABLES: FutureScoreVariable[] = [
  { id: 'lead_source_tracking',        label: 'Lead source tracking exists',        pillar: 'marketing_lead_system',     businessCategory: 'sales_marketing' },
  { id: 'lead_response_time',          label: 'Lead response time',                 pillar: 'sales_conversion_system',   businessCategory: 'sales_marketing' },
  { id: 'estimate_followup_process',   label: 'Estimate follow-up process',         pillar: 'sales_conversion_system',   businessCategory: 'sales_marketing' },
  { id: 'close_rate_tracked',          label: 'Close rate tracked',                 pillar: 'sales_conversion_system',   businessCategory: 'sales_marketing' },
  { id: 'average_ticket_known',        label: 'Average ticket known',               pillar: 'pricing_profit_system',     businessCategory: 'financial_control' },
  { id: 'callback_rate_tracked',       label: 'Callback rate tracked',              pillar: 'operations_delivery_system',businessCategory: 'operations' },
  { id: 'first_time_fix_tracked',      label: 'First-time fix rate tracked',        pillar: 'operations_delivery_system',businessCategory: 'operations' },
  { id: 'gross_margin_known',          label: 'Gross margin known',                 pillar: 'financial_control_system',  businessCategory: 'financial_control' },
  { id: 'break_even_known',            label: 'Break-even revenue known',           pillar: 'financial_control_system',  businessCategory: 'financial_control' },
  { id: 'job_costing_process',         label: 'Job costing process exists',         pillar: 'financial_control_system',  businessCategory: 'financial_control' },
  { id: 'monthly_cash_review',         label: 'Monthly cash review exists',         pillar: 'financial_control_system',  businessCategory: 'financial_control' },
  { id: 'maintenance_agreement_offer', label: 'Maintenance agreement offer exists', pillar: 'recurring_revenue_system',  businessCategory: 'growth_risk' },
  { id: 'maintenance_agreement_count', label: 'Maintenance agreement count tracked',pillar: 'recurring_revenue_system',  businessCategory: 'growth_risk' },
  { id: 'repeat_customer_rate',        label: 'Repeat customer rate tracked',       pillar: 'customer_retention_system', businessCategory: 'customer_experience' },
  { id: 'review_request_process',      label: 'Review request process exists',      pillar: 'customer_retention_system', businessCategory: 'customer_experience' },
  { id: 'referral_process',            label: 'Referral process exists',            pillar: 'customer_retention_system', businessCategory: 'customer_experience' },
  { id: 'customer_reactivation_process',label: 'Customer reactivation process exists',pillar: 'customer_retention_system',businessCategory: 'customer_experience' },
  { id: 'scheduling_dispatch_process', label: 'Scheduling/dispatch process exists', pillar: 'operations_delivery_system',businessCategory: 'operations' },
  { id: 'technician_scorecard',        label: 'Technician performance scorecard exists',pillar: 'people_training_system',businessCategory: 'people_leadership' },
  { id: 'first_hire_readiness',        label: 'First hire readiness',               pillar: 'people_training_system',    businessCategory: 'people_leadership' },
  { id: 'training_process',            label: 'Training process exists',            pillar: 'people_training_system',    businessCategory: 'people_leadership' },
  { id: 'safety_compliance_checklist', label: 'Safety/compliance checklist exists', pillar: 'risk_compliance_system',    businessCategory: 'growth_risk' },
  { id: 'cyber_access_controls',       label: 'Cybersecurity/account access controls exist',pillar: 'risk_compliance_system',businessCategory: 'growth_risk' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Progressive MetrixScore™ input groups by tier (Step 7) — NOT wired into scoring
// ─────────────────────────────────────────────────────────────────────────────
export const PROGRESSIVE_SCORE_INPUTS: Record<TierId, string[]> = {
  free_snapshot: [
    'intake', 'starter assessment', 'business stage', 'main goal', 'biggest challenge',
    'starter setup readiness', 'financial readiness', 'customer acquisition readiness',
  ],
  pro_roadmap: [
    'expanded financial controls', 'pricing readiness', 'lead tracking', 'sales process',
    'operations process', 'customer retention', 'recurring revenue readiness',
    'tool/vendor setup', 'action completion', 'reassessment answers',
  ],
  lifetime_founder: [
    'score history', 'reassessment history', 'action completion trends', 'risk reduction trends',
    'recurring revenue growth', 'customer retention trends', 'vendor/tool performance tracking',
    'team growth/readiness', 'quarterly business review data', 'trade-specific advanced modules',
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers (Step 8) — simple, safe
// ─────────────────────────────────────────────────────────────────────────────
export function getEducationAssets(): EducationAsset[] {
  return EDUCATION_ASSETS
}
export function getEducationAssetsByTier(tierId: TierId): EducationAsset[] {
  return EDUCATION_ASSETS.filter(a => a.tierAccess === tierId)
}
export function getEducationAssetsByPillar(pillarId: OperatingSystemPillarId): EducationAsset[] {
  return EDUCATION_ASSETS.filter(a => a.pillar === pillarId)
}
export function getEducationAssetsByStatus(status: BuildStatus): EducationAsset[] {
  return EDUCATION_ASSETS.filter(a => a.buildStatus === status)
}
export function getPreLaunchEducationAssets(): EducationAsset[] {
  return EDUCATION_ASSETS.filter(a => a.launchTiming === 'pre_launch')
}
export function getTier2ToolAssets(): EducationAsset[] {
  return EDUCATION_ASSETS.filter(a => TIER2_CORE_TOOL_ASSET_IDS.includes(a.id))
}
export function getLifetimeEducationAssets(): EducationAsset[] {
  return EDUCATION_ASSETS.filter(a => a.tierAccess === 'lifetime_founder')
}
export function getScoreRelatedEducationAssets(): EducationAsset[] {
  return EDUCATION_ASSETS.filter(a => a.scoreRelated)
}
export function getBuiltEducationAssets(): EducationAsset[] {
  return EDUCATION_ASSETS.filter(a => a.buildStatus === 'built')
}
export function getMissingEducationAssets(): EducationAsset[] {
  return EDUCATION_ASSETS.filter(a => a.buildStatus === 'missing')
}
export function getFutureScoreVariables(): FutureScoreVariable[] {
  return FUTURE_SCORE_VARIABLES
}
export function getProgressiveScoreInputsByTier(tierId: TierId): string[] {
  return PROGRESSIVE_SCORE_INPUTS[tierId] ?? []
}

// ── Copyright / source-safety helpers ──────────────────────────────────────────
export function getAssetsByCopyrightRisk(risk: CopyrightRisk): EducationAsset[] {
  return EDUCATION_ASSETS.filter(a => a.copyrightRisk === risk)
}
export function getAssetsRequiringOriginalContent(): EducationAsset[] {
  return EDUCATION_ASSETS.filter(a => a.originalContentRequired)
}
export function getAssetsMissingSourceUrls(): EducationAsset[] {
  return EDUCATION_ASSETS.filter(a => a.sourceUrls.length === 0)
}
export function getAssetsUsingThirdPartyReferences(): EducationAsset[] {
  return EDUCATION_ASSETS.filter(a =>
    a.sourceType === 'third_party_article' ||
    a.sourceType === 'industry_reference' ||
    a.sourceType === 'vendor_resource')
}
export function getPublicResourceAssets(): EducationAsset[] {
  return EDUCATION_ASSETS.filter(a =>
    a.sourceType === 'government' || a.sourceType === 'official_resource')
}

// ─────────────────────────────────────────────────────────────────────────────
// Build-status summary constants (Step 9)
// ─────────────────────────────────────────────────────────────────────────────
export const TIER2_CORE_TOOL_ASSET_IDS: string[] = [
  'business_setup_checklist', 'pricing_readiness_checklist', 'gbp_checklist',
  'lead_followup_checklist', 'service_agreement_checklist', 'sales_call_script',
  'review_request_script', 'financing_conversation_script',
  'weekly_business_review_template', 'vendor_setup_tracker',
]

export const PRE_LAUNCH_MUST_HAVE_ASSET_IDS: string[] = [
  'business_setup_checklist', 'pricing_readiness_checklist', 'gbp_checklist',
  'lead_followup_checklist', 'sales_call_script', 'review_request_script',
  'weekly_business_review_template', 'score_improvement_guide',
]

export const SOON_AFTER_LAUNCH_ASSET_IDS: string[] = EDUCATION_ASSETS
  .filter(a => a.launchTiming === 'soon_after_launch').map(a => a.id)

export const LIFETIME_FUTURE_ASSET_IDS: string[] = EDUCATION_ASSETS
  .filter(a => a.tierAccess === 'lifetime_founder').map(a => a.id)

export const SCORE_IMPROVEMENT_ASSET_IDS: string[] = EDUCATION_ASSETS
  .filter(a => a.scoreRelated && a.supportsProgressiveScore && a.buildStatus !== 'built').map(a => a.id)

// Operating systems with no built standalone artifact yet (mostly recurring revenue,
// customer retention, people/training, risk/compliance depth).
export const MISSING_OPERATING_SYSTEM_ASSET_IDS: string[] = EDUCATION_ASSETS
  .filter(a => (a.buildStatus === 'missing' || a.buildStatus === 'future') &&
    (a.contentType === 'system' || a.contentType === 'framework')).map(a => a.id)

export const FUTURE_SCORE_VARIABLE_IDS: ScoreVariableId[] = FUTURE_SCORE_VARIABLES.map(v => v.id)
