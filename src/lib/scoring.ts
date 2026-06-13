// ─────────────────────────────────────────────────────────────────────────────
// Scoring engine — SubZeroMetrix MetrixScore v2
// ─────────────────────────────────────────────────────────────────────────────
import { QUESTIONS } from './questions'

// ── Answer shape ─────────────────────────────────────────────────────────────
// Each question stores answers differently:
//   single   → string (optionId)
//   checkbox → string[] (array of optionIds)
//   location → { state: string; city: string }
//   lead     → { firstName: string; email: string }
export type SingleAnswer = string
export type CheckboxAnswer = string[]
export type LocationAnswer = { state: string; city: string }
export type LeadAnswer = { firstName: string; email: string }

export type AnswerValue = SingleAnswer | CheckboxAnswer | LocationAnswer | LeadAnswer

export type RawAnswers = {
  business_type?: SingleAnswer
  location?: LocationAnswer
  stage?: SingleAnswer
  setup_steps?: CheckboxAnswer
  financial?: SingleAnswer
  customer_plan?: SingleAnswer
  blocker?: SingleAnswer
  lead?: LeadAnswer
}

// ── Score band ───────────────────────────────────────────────────────────────
export type ScoreBand = 'High Risk' | 'Foundation Stage' | 'Launch Ready' | 'Growth Ready'

// ── Category scores ──────────────────────────────────────────────────────────
export interface CategoryScores {
  businessClarity: number // max 10
  locationClarity: number // max 10
  stageReadiness: number // max 15
  setupReadiness: number // max 20
  financialReadiness: number // max 20
  customerReadiness: number // max 15
  blockerSeverity: number // max 10
}

// ── Report data ──────────────────────────────────────────────────────────────
export interface ReportData {
  risks: string[] // top 3 risk labels
  actions: string[] // 5 recommended actions
  resources: string[] // resource category names
  builderPath: string // contractor-specific builder path suggestion
}

// ── Full result ───────────────────────────────────────────────────────────────
export interface ScoreResult {
  overall: number
  band: ScoreBand
  bandLabel: string
  bandMessage: string
  categoryScores: CategoryScores

  // Named convenience fields used by unlock/report UI
  businessType: string
  location: string
  stage: string
  biggestBlocker: string
  leadName: string
  leadEmail: string

  report: ReportData
  answers: RawAnswers
  completedAt: string
}

// ── Band config ───────────────────────────────────────────────────────────────
const BAND_CONFIG: Array<{
  min: number
  max: number
  band: ScoreBand
  bandMessage: string
}> = [
  {
    min: 0,
    max: 39,
    band: 'High Risk',
    bandMessage:
      'Your business is running Sub-Zero. Critical foundation gaps need to be addressed before you invest more time or money. The roadmap tells you exactly where to start.',
  },
  {
    min: 40,
    max: 59,
    band: 'Foundation Stage',
    bandMessage:
      'Your business is running Cold. The foundation has been started but key gaps are creating risk. The roadmap focuses on closing those gaps before you scale.',
  },
  {
    min: 60,
    max: 79,
    band: 'Launch Ready',
    bandMessage:
      'Your business is warming up. Solid structure in place — the roadmap focuses on consistency, customer flow, and protecting what you have built.',
  },
  {
    min: 80,
    max: 100,
    band: 'Growth Ready',
    bandMessage:
      'Your business is running Hot. Strong foundation, solid numbers. The roadmap focuses on systems, scale, and maximising what is already working.',
  },
]

// ── Approved risks ────────────────────────────────────────────────────────────
const RISKS = {
  setupGaps: 'Setup gaps',
  lowCapital: 'Low capital or unclear startup cost',
  noCustomerPlan: 'No clear customer acquisition path',
  licensingUnclear: 'Licensing or compliance uncertainty',
  fundingDependency: 'Funding or credit dependency',
  pricingUncertain: 'Pricing uncertainty',
  noInsurance: 'Insurance not started',
  weakOnline: 'Weak online presence',
  systemsGap: 'Software and systems gap',
}

// ── Approved next actions ─────────────────────────────────────────────────────
const ACTIONS = {
  verifyRequirements: 'Verify state and local requirements through official sources.',
  separateFinances: 'Separate personal and business finances.',
  estimateCosts: 'Estimate startup costs before buying tools, software, equipment, or ads.',
  firstCustomerPlan: 'Build a simple first-customer plan before spending heavily on marketing.',
  pricingPlan: 'Create a basic pricing and cash-flow plan.',
  reviewInsurance: 'Review insurance requirements with a qualified provider.',
  fundingChecklist: 'Start a funding readiness checklist before applying for capital.',
  googlePresence: 'Build or improve your Google Business Profile and local online presence.',
  simpleSoftware: 'Choose simple software only after your workflow is clear.',
  removeTopRisk: 'Prioritize the next step that removes the biggest risk first.',
}

// ── Builder paths by business type ───────────────────────────────────────────
const BUILDER_PATHS: Record<string, string> = {
  hvac:          'HeatMetrix Platform — licensing, maintenance agreements, and seasonal demand planning',
  electrical:    'VoltMetrix Platform — licensing compliance, EV charger revenue, and commercial pipeline',
  plumbing:      'FlowMetrix Platform — service area setup, flat-rate pricing, and emergency response',
  roofing:       'RoofMetrix Platform — storm restoration, insurance claims, and solar-ready roofing',
  solar:         'SunMetrix Platform — lead-to-install funnel, battery storage upsell, and incentives',
  construction:  'BuildMetrix Platform — bid win rate, change order capture, and subcontractor mix',
  handyman:      'FixMetrix Platform — ticket size optimization, repeat customers, and service packaging',
  landscaping:   'GroundMetrix Platform — recurring contracts, route efficiency, and seasonal balance',
  cleaning:      'CleanMetrix Platform — client retention, recurring revenue, and specialty niches',
  painting:      'PaintMetrix Platform — estimating, crew management, referral systems, and recurring clients',
  other:         'SubZeroMetrix Core Platform — operational foundation and local market growth',
}

// ─────────────────────────────────────────────────────────────────────────────
// Main scoring function
// ─────────────────────────────────────────────────────────────────────────────
export function calculateScores(answers: RawAnswers): ScoreResult {
  // ── Category 1: Business clarity ──────────────────────────────────────────
  const businessOpt = QUESTIONS[0].options?.find((o) => o.id === answers.business_type)
  const businessClarity = businessOpt?.score ?? 0

  // ── Category 2: Location clarity ──────────────────────────────────────────
  const hasState = !!answers.location?.state?.trim()
  const hasCity = !!answers.location?.city?.trim()
  const locationClarity = hasState && hasCity ? 10 : hasState ? 7 : hasCity ? 3 : 0

  // ── Category 3: Stage readiness ────────────────────────────────────────────
  const stageOpt = QUESTIONS[2].options?.find((o) => o.id === answers.stage)
  const stageReadiness = stageOpt?.score ?? 0

  // ── Category 4: Setup readiness ────────────────────────────────────────────
  const setupIds = answers.setup_steps ?? []
  const isNone = setupIds.includes('none_yet')

  let setupReadiness = 0

  if (!isNone) {
    for (const id of setupIds) {
      const opt = QUESTIONS[3].options?.find((o) => o.id === id)
      if (opt) setupReadiness += opt.score
    }
  }

  setupReadiness = Math.min(20, setupReadiness)

  // ── Category 5: Financial readiness ───────────────────────────────────────
  const finOpt = QUESTIONS[4].options?.find((o) => o.id === answers.financial)
  const financialReadiness = finOpt?.score ?? 0

  // ── Category 6: Customer acquisition readiness ────────────────────────────
  const custOpt = QUESTIONS[5].options?.find((o) => o.id === answers.customer_plan)
  const customerReadiness = custOpt?.score ?? 0

  // ── Category 7: Blocker severity ──────────────────────────────────────────
  const blockerOpt = QUESTIONS[6].options?.find((o) => o.id === answers.blocker)
  const blockerSeverity = blockerOpt?.score ?? 0

  // ── Lead completion bonus ─────────────────────────────────────────────────
  // The category max is already 100. This adds a small completion bonus and then
  // normalizes the total back to 100 so the MetrixScore remains 0–100.
  const emailScore =
    answers.lead?.email?.includes('@') && answers.lead?.firstName?.trim() ? 10 : 0

  const categoryScores: CategoryScores = {
    businessClarity,
    locationClarity,
    stageReadiness,
    setupReadiness,
    financialReadiness,
    customerReadiness,
    blockerSeverity,
  }

  const rawSum = Object.values(categoryScores).reduce((a, b) => a + b, 0) + emailScore
  const maxRaw = 110
  const overall = Math.min(100, Math.round((rawSum / maxRaw) * 100))

  // ── Band ──────────────────────────────────────────────────────────────────
  const bandConfig = BAND_CONFIG.find((b) => overall >= b.min && overall <= b.max) ?? BAND_CONFIG[0]

  // ── Risk identification ───────────────────────────────────────────────────
  const risks: string[] = []
  const needsFunding = answers.financial === 'need_funding' || answers.financial === 'not_sure'

  if (setupReadiness < 8) risks.push(RISKS.setupGaps)
  if (financialReadiness <= 4) risks.push(RISKS.lowCapital)
  if (needsFunding) risks.push(RISKS.fundingDependency)
  if (customerReadiness === 0) risks.push(RISKS.noCustomerPlan)

  if (answers.blocker === 'licensing' || answers.blocker === 'legal_setup') {
    risks.push(RISKS.licensingUnclear)
  }

  if (answers.blocker === 'pricing') risks.push(RISKS.pricingUncertain)
  if (!setupIds.includes('insurance') && !isNone) risks.push(RISKS.noInsurance)
  if (!setupIds.includes('gbp') && !setupIds.includes('website') && !isNone) {
    risks.push(RISKS.weakOnline)
  }
  if (answers.blocker === 'software') risks.push(RISKS.systemsGap)

  // Deduplicate and take top 3.
  // Array.from avoids TypeScript target/downlevelIteration issues with Set spreading.
  const topRisks = Array.from(new Set(risks)).slice(0, 3)

  // ── Action selection ───────────────────────────────────────────────────────
  const actions: string[] = []

  const addAction = (action: string) => {
    if (!actions.includes(action) && actions.length < 5) {
      actions.push(action)
    }
  }

  if (answers.blocker === 'licensing' || answers.blocker === 'legal_setup') {
    addAction(ACTIONS.verifyRequirements)
  }

  if (!setupIds.includes('bank') && !isNone) addAction(ACTIONS.separateFinances)
  if (financialReadiness <= 4 || needsFunding) addAction(ACTIONS.estimateCosts)
  if (customerReadiness === 0) addAction(ACTIONS.firstCustomerPlan)
  if (answers.blocker === 'pricing') addAction(ACTIONS.pricingPlan)
  if (!setupIds.includes('insurance') && !isNone) addAction(ACTIONS.reviewInsurance)
  if (needsFunding) addAction(ACTIONS.fundingChecklist)
  if (!setupIds.includes('gbp') && !isNone) addAction(ACTIONS.googlePresence)
  if (answers.blocker === 'software') addAction(ACTIONS.simpleSoftware)

  // Always fill to 5 with approved generic actions.
  addAction(ACTIONS.removeTopRisk)
  addAction(ACTIONS.separateFinances)
  addAction(ACTIONS.estimateCosts)
  addAction(ACTIONS.firstCustomerPlan)
  addAction(ACTIONS.pricingPlan)

  const finalActions = actions.slice(0, 5)

  // ── Resources ──────────────────────────────────────────────────────────────
  const resources: string[] = []

  resources.push('Business setup')
  resources.push('Business banking')

  if (financialReadiness < 10) resources.push('Credit readiness')
  if (needsFunding) resources.push('Funding readiness')
  if (!setupIds.includes('insurance')) resources.push('Insurance')
  if (!setupIds.includes('website')) resources.push('Website / domain')
  if (!setupIds.includes('gbp')) resources.push('Google Business Profile')

  resources.push('Bookkeeping')

  if (answers.blocker === 'software') resources.push('CRM / software')
  if (stageReadiness >= 10) resources.push('Scheduling')
  if (customerReadiness < 10) resources.push('Marketing')

  // Deduplicate and take top 6.
  // Array.from avoids TypeScript target/downlevelIteration issues with Set spreading.
  const finalResources = Array.from(new Set(resources)).slice(0, 6)

  // ── Builder path ──────────────────────────────────────────────────────────
  const builderPath = BUILDER_PATHS[answers.business_type ?? ''] ?? BUILDER_PATHS.other

  // ── Convenience label lookups ─────────────────────────────────────────────
  const businessType = businessOpt?.label ?? ''
  const stageLabel = stageOpt?.label ?? ''
  const blockerLabel = blockerOpt?.label ?? ''
  const locationStr = [answers.location?.city, answers.location?.state].filter(Boolean).join(', ')
  const leadName = answers.lead?.firstName ?? ''
  const leadEmail = answers.lead?.email ?? ''

  return {
    overall,
    band: bandConfig.band,
    bandLabel: bandConfig.band,
    bandMessage: bandConfig.bandMessage,
    categoryScores,
    businessType,
    location: locationStr,
    stage: stageLabel,
    biggestBlocker: blockerLabel,
    leadName,
    leadEmail,
    report: {
      risks: topRisks,
      actions: finalActions,
      resources: finalResources,
      builderPath,
    },
    answers,
    completedAt: new Date().toISOString(),
  }
}

export function getBandColor(band: ScoreBand): string {
  const colors: Record<ScoreBand, string> = {
    'High Risk': '#E05A4E',
    'Foundation Stage': '#4A90D9',
    'Launch Ready': '#EF9F27',
    'Growth Ready': '#A8B8CC',
  }

  return colors[band]
}

// ─────────────────────────────────────────────────────────────────────────────
// Bounded NON-SCORING utilities (SZM-1A)
// ─────────────────────────────────────────────────────────────────────────────
// These do NOT run the Engine-1 calculation. They expose the band thresholds and the
// builder-path catalog as pure lookups so the canonical → legacy projection can present
// a band/builder-path derived from the CANONICAL score without re-running calculateScores.

/** Map an already-computed (canonical) overall score onto the display band thresholds. */
export function bandFromScore(overall: number): { band: ScoreBand; bandMessage: string } {
  const cfg = BAND_CONFIG.find((b) => overall >= b.min && overall <= b.max) ?? BAND_CONFIG[0]
  return { band: cfg.band, bandMessage: cfg.bandMessage }
}

/** The builder-path blurb for a business-type id (pure catalog lookup). */
export function builderPathForType(businessType: string): string {
  return BUILDER_PATHS[businessType] ?? BUILDER_PATHS.other
}