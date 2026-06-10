// ─────────────────────────────────────────────────────────────────────────────
// MetrixScore — Stage-Adjusted Scoring Engine (v1)
// ─────────────────────────────────────────────────────────────────────────────
// Pure, deterministic scoring engine. No React / Next / Supabase / Stripe deps.
//
// This is a NEW, standalone engine. It does NOT replace src/lib/scoring.ts
// (which powers the live assessment → report → Supabase flow) and is not yet
// wired into the UI or persistence. It scores a stage-aware, Likert-style
// readiness profile across seven categories.
// ─────────────────────────────────────────────────────────────────────────────

import type { BusinessStage } from './intake'

// ── Answer choices ────────────────────────────────────────────────────────────
export type AnswerChoice =
  | 'not_started'
  | 'started_inconsistent'
  | 'needs_improvement'
  | 'strong_documented'
  | 'not_sure'

export const ANSWER_LABELS: Record<AnswerChoice, string> = {
  not_started:          'Not started',
  started_inconsistent: 'Started but inconsistent',
  needs_improvement:    'In place but needs improvement',
  strong_documented:    'Strong and documented',
  not_sure:             'Not sure',
}

// Fraction of full credit each answer earns toward a category (0–1).
// "Not sure" earns no credit and additionally lowers score confidence.
const ANSWER_FRACTION: Record<AnswerChoice, number> = {
  not_started:          0.0,
  started_inconsistent: 0.34,
  needs_improvement:    0.67,
  strong_documented:    1.0,
  not_sure:             0.0,
}

// ── Categories ────────────────────────────────────────────────────────────────
export type MetrixCategory =
  | 'business_foundation'
  | 'financial_control'
  | 'sales_marketing'
  | 'operations'
  | 'customer_experience'
  | 'people_leadership'
  | 'growth_risk'

export const CATEGORY_LABELS: Record<MetrixCategory, string> = {
  business_foundation: 'Business Foundation',
  financial_control:   'Financial Control',
  sales_marketing:     'Sales & Marketing',
  operations:          'Operations',
  customer_experience: 'Customer Experience',
  people_leadership:   'People & Leadership',
  growth_risk:         'Growth & Risk',
}

export const CATEGORIES: MetrixCategory[] = [
  'business_foundation',
  'financial_control',
  'sales_marketing',
  'operations',
  'customer_experience',
  'people_leadership',
  'growth_risk',
]

// ── Criteria catalog (3 per category, 21 total) ───────────────────────────────
export interface Criterion {
  id: string
  category: MetrixCategory
  label: string
}

export const CRITERIA: Criterion[] = [
  // Business Foundation
  { id: 'entity_registration', category: 'business_foundation', label: 'Business entity registered (LLC, etc.)' },
  { id: 'licensing_insurance', category: 'business_foundation', label: 'Licensing & insurance in place' },
  { id: 'banking_separation',  category: 'business_foundation', label: 'Separate business banking' },
  // Financial Control
  { id: 'bookkeeping',         category: 'financial_control', label: 'Bookkeeping & expense tracking' },
  { id: 'pricing_strategy',    category: 'financial_control', label: 'Pricing & margin strategy' },
  { id: 'cash_flow',           category: 'financial_control', label: 'Cash-flow planning' },
  // Sales & Marketing
  { id: 'lead_generation',     category: 'sales_marketing', label: 'Consistent lead generation' },
  { id: 'online_presence',     category: 'sales_marketing', label: 'Online presence (GBP, website)' },
  { id: 'brand_consistency',   category: 'sales_marketing', label: 'Consistent branding & messaging' },
  // Operations
  { id: 'scheduling_workflow', category: 'operations', label: 'Scheduling & job workflow' },
  { id: 'job_documentation',   category: 'operations', label: 'Job documentation & estimates' },
  { id: 'supply_inventory',    category: 'operations', label: 'Supply & inventory management' },
  // Customer Experience
  { id: 'communication',       category: 'customer_experience', label: 'Customer communication & follow-up' },
  { id: 'reviews_reputation',  category: 'customer_experience', label: 'Reviews & reputation management' },
  { id: 'warranty_service',    category: 'customer_experience', label: 'Warranty & after-service' },
  // People & Leadership
  { id: 'hiring_process',      category: 'people_leadership', label: 'Hiring & onboarding process' },
  { id: 'training_standards',  category: 'people_leadership', label: 'Training & quality standards' },
  { id: 'delegation_roles',    category: 'people_leadership', label: 'Clear roles & delegation' },
  // Growth & Risk
  { id: 'financial_runway',    category: 'growth_risk', label: 'Financial runway / reserves' },
  { id: 'risk_contingency',    category: 'growth_risk', label: 'Risk & contingency planning' },
  { id: 'growth_strategy',     category: 'growth_risk', label: 'Documented growth strategy' },
]

// ── Stage-adjusted category weights ───────────────────────────────────────────
type StageGroup = 'early' | 'establishing' | 'growth' | 'reset'

function stageGroup(stage: BusinessStage | ''): StageGroup {
  switch (stage) {
    case 'thinking':
    case 'planning':     return 'early'
    case 'launched_u6':
    case 'months_6_12':  return 'establishing'
    case 'over_1yr':     return 'growth'
    case 'reset':        return 'reset'
    default:             return 'establishing'
  }
}

// Higher weight = matters more to the overall score at that stage.
const STAGE_WEIGHTS: Record<StageGroup, Record<MetrixCategory, number>> = {
  early: {
    business_foundation: 2.0, financial_control: 1.5, sales_marketing: 1.2,
    operations: 0.8, customer_experience: 0.8, people_leadership: 0.5, growth_risk: 1.0,
  },
  establishing: {
    business_foundation: 1.3, financial_control: 1.5, sales_marketing: 1.5,
    operations: 1.3, customer_experience: 1.2, people_leadership: 0.8, growth_risk: 1.0,
  },
  growth: {
    business_foundation: 0.8, financial_control: 1.3, sales_marketing: 1.4,
    operations: 1.3, customer_experience: 1.2, people_leadership: 1.4, growth_risk: 1.5,
  },
  reset: {
    business_foundation: 1.5, financial_control: 1.6, sales_marketing: 1.2,
    operations: 1.2, customer_experience: 1.0, people_leadership: 0.9, growth_risk: 1.3,
  },
}

// ── Result types ──────────────────────────────────────────────────────────────
export type RiskLevel = 'high' | 'elevated' | 'moderate' | 'low'
export type RiskSeverity = 'high' | 'moderate' | 'low'
export type ConfidenceLabel = 'High' | 'Medium' | 'Low'

export interface MetrixCategoryScore {
  category: MetrixCategory
  label: string
  score: number        // 0–100
  weight: number       // stage-adjusted weight applied to overall
  answered: number     // criteria answered (incl. "not sure")
  total: number        // criteria in this category
  notSure: number      // criteria answered "not sure"
}

export interface MetrixStrength {
  category: MetrixCategory
  label: string
  score: number
}

export interface MetrixRisk {
  category: MetrixCategory
  label: string
  score: number
  severity: RiskSeverity
}

export interface MetrixProfileProgress {
  completion: number          // % of criteria answered (0–100)
  confidence: number          // % of criteria answered with a confident (non-"not sure") choice
  confidenceLabel: ConfidenceLabel
  answered: number
  total: number
  notSure: number
}

export interface RecommendedPath {
  id: 'foundation' | 'stabilize' | 'scale' | 'rebuild'
  label: string
  focusCategory: MetrixCategory | null
  focusLabel: string
  rationale: string
}

// Aligns with the "AssessmentResponse" concept from the data-model spec.
export interface AssessmentResponse {
  stage: BusinessStage | ''
  answers: Record<string, AnswerChoice>  // criterionId → choice
}

// Full engine output (the "MetrixScore").
export interface MetrixScore {
  overall: number
  riskLevel: RiskLevel
  riskLabel: string
  stage: BusinessStage | ''
  stageGroup: StageGroup
  categories: MetrixCategoryScore[]
  strengths: MetrixStrength[]
  risks: MetrixRisk[]
  progress: MetrixProfileProgress
  recommendedPath: RecommendedPath
  generatedAt: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function round(n: number): number {
  return Math.round(n)
}

function riskLevelFromScore(overall: number): { level: RiskLevel; label: string } {
  if (overall < 40) return { level: 'high',     label: 'High Risk' }
  if (overall < 60) return { level: 'elevated', label: 'Elevated Risk' }
  if (overall < 75) return { level: 'moderate', label: 'Moderate Risk' }
  return { level: 'low', label: 'Low Risk' }
}

function severityFromScore(score: number): RiskSeverity {
  if (score < 34) return 'high'
  if (score < 60) return 'moderate'
  return 'low'
}

function confidenceLabel(confidence: number): ConfidenceLabel {
  if (confidence >= 75) return 'High'
  if (confidence >= 45) return 'Medium'
  return 'Low'
}

const PATH_CONFIG: Record<StageGroup, { id: RecommendedPath['id']; label: string }> = {
  early:        { id: 'foundation', label: 'Foundation Builder Path' },
  establishing: { id: 'stabilize',  label: 'Stabilize & Systemize Path' },
  growth:       { id: 'scale',      label: 'Scale & Optimize Path' },
  reset:        { id: 'rebuild',    label: 'Reset & Rebuild Path' },
}

// ─────────────────────────────────────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────────────────────────────────────
export function scoreAssessment(response: AssessmentResponse): MetrixScore {
  const group = stageGroup(response.stage)
  const weights = STAGE_WEIGHTS[group]

  // ── Per-category scoring ────────────────────────────────────────────────────
  const categories: MetrixCategoryScore[] = CATEGORIES.map(category => {
    const crits = CRITERIA.filter(c => c.category === category)
    let fractionSum = 0
    let answered = 0
    let notSure = 0

    for (const crit of crits) {
      const choice = response.answers[crit.id]
      if (!choice) continue
      answered += 1
      if (choice === 'not_sure') notSure += 1
      fractionSum += ANSWER_FRACTION[choice]
    }

    const score = answered > 0 ? round((fractionSum / answered) * 100) : 0

    return {
      category,
      label: CATEGORY_LABELS[category],
      score,
      weight: weights[category],
      answered,
      total: crits.length,
      notSure,
    }
  })

  // ── Overall (weighted across answered categories) ───────────────────────────
  const answeredCategories = categories.filter(c => c.answered > 0)
  const weightTotal = answeredCategories.reduce((sum, c) => sum + c.weight, 0)
  const weightedSum = answeredCategories.reduce((sum, c) => sum + c.score * c.weight, 0)
  const overall = weightTotal > 0 ? round(weightedSum / weightTotal) : 0

  // ── Risk level ──────────────────────────────────────────────────────────────
  const { level: riskLevel, label: riskLabel } = riskLevelFromScore(overall)

  // ── Strengths (top 3) & risks (bottom 3) among answered categories ──────────
  const byScoreDesc = [...answeredCategories].sort((a, b) => b.score - a.score)
  const byScoreAsc  = [...answeredCategories].sort((a, b) => a.score - b.score)

  const strengths: MetrixStrength[] = byScoreDesc.slice(0, 3).map(c => ({
    category: c.category, label: c.label, score: c.score,
  }))

  const risks: MetrixRisk[] = byScoreAsc.slice(0, 3).map(c => ({
    category: c.category, label: c.label, score: c.score, severity: severityFromScore(c.score),
  }))

  // ── Profile progress (completion + score confidence) ────────────────────────
  const total = CRITERIA.length
  const answeredTotal = categories.reduce((sum, c) => sum + c.answered, 0)
  const notSureTotal  = categories.reduce((sum, c) => sum + c.notSure, 0)
  const confidentAnswers = answeredTotal - notSureTotal
  const completion = round((answeredTotal / total) * 100)
  const confidence = round((confidentAnswers / total) * 100)

  const progress: MetrixProfileProgress = {
    completion,
    confidence,
    confidenceLabel: confidenceLabel(confidence),
    answered: answeredTotal,
    total,
    notSure: notSureTotal,
  }

  // ── Recommended roadmap path ────────────────────────────────────────────────
  const cfg = PATH_CONFIG[group]
  const focus = risks[0] ?? null
  const recommendedPath: RecommendedPath = {
    id: cfg.id,
    label: cfg.label,
    focusCategory: focus ? focus.category : null,
    focusLabel: focus ? focus.label : '',
    rationale: focus
      ? `At your stage, start with ${focus.label} — your lowest-scoring area and biggest near-term risk.`
      : 'Complete the assessment to receive a focused starting point.',
  }

  return {
    overall,
    riskLevel,
    riskLabel,
    stage: response.stage,
    stageGroup: group,
    categories,
    strengths,
    risks,
    progress,
    recommendedPath,
    generatedAt: new Date().toISOString(),
  }
}
