// ─────────────────────────────────────────────────────────────────────────────
// metrix/legacyProjection — canonical → legacy compatibility projections (SZM-1A)
// ─────────────────────────────────────────────────────────────────────────────
// Lets the legacy `szm_score` (ScoreResult) contract and the Supabase `assessments` row
// keep working WITHOUT running Engine 1. Every value is derived from the canonical
// MetrixProfileSnapshot (or the preserved raw answers); calculateScores() is NEVER called.
// The band/builder-path come from the canonical overall via the bounded NON-scoring
// helpers (scoring.bandFromScore / builderPathForType). Raw answers are preserved verbatim.
// These rows are explicitly canonical-sourced (version fields are carried), NOT an original
// Engine-1 calculation.
// ─────────────────────────────────────────────────────────────────────────────

import {
  bandFromScore, builderPathForType,
  type ScoreResult, type CategoryScores, type RawAnswers, type ReportData,
} from '../scoring'
import { QUESTIONS } from '../questions'
import type { MetrixCategory } from '../metrixEngine'
import type { MetrixProfileSnapshot } from './profileTypes'

export interface LeadData {
  firstName: string
  email: string
}

function optionLabel(qIndex: number, id: string | undefined): string {
  if (!id) return ''
  return QUESTIONS[qIndex]?.options?.find(o => o.id === id)?.label ?? ''
}

function catScore(snapshot: MetrixProfileSnapshot, category: MetrixCategory): number {
  return snapshot.readiness.categories.find(c => c.category === category)?.score ?? 0
}

// Project canonical (0–100) category readiness into the Engine-1 CategoryScores scale.
// Only financial_control → financialReadiness, business_foundation → setupReadiness, and
// sales_marketing → customerReadiness affect the legacy paid roadmap (roadmap.ts); the rest
// are neutral placeholders (the on-screen category breakdown reads the canonical model).
function projectCategoryScores(snapshot: MetrixProfileSnapshot, answers: RawAnswers): CategoryScores {
  const bf = catScore(snapshot, 'business_foundation')
  const fc = catScore(snapshot, 'financial_control')
  const sm = catScore(snapshot, 'sales_marketing')
  const hasState = !!answers.location?.state?.trim()
  const hasCity = !!answers.location?.city?.trim()
  return {
    businessClarity: Math.round((bf / 100) * 10),
    locationClarity: hasState && hasCity ? 10 : hasState ? 7 : hasCity ? 3 : 0,
    stageReadiness: Math.round((bf / 100) * 15),
    setupReadiness: Math.round((bf / 100) * 20),       // → roadmap setup urgency
    financialReadiness: Math.round((fc / 100) * 20),   // → roadmap pricing/bookkeeping urgency
    customerReadiness: Math.round((sm / 100) * 15),    // → roadmap customer-plan urgency
    blockerSeverity: 5,
  }
}

const RESOURCE_BY_CATEGORY: Record<MetrixCategory, string> = {
  business_foundation: 'Business setup',
  financial_control: 'Bookkeeping & pricing',
  sales_marketing: 'Marketing & local presence',
  operations: 'Operations & scheduling',
  customer_experience: 'Reviews & follow-up',
  people_leadership: 'Hiring & roles',
  growth_risk: 'Cash reserves & growth planning',
}

function projectReport(snapshot: MetrixProfileSnapshot, answers: RawAnswers): ReportData {
  const constraints = snapshot.constraintCandidates
  const risks = constraints.slice(0, 3).map(c => c.label)
  const actions = constraints.slice(0, 5).map(c => `Strengthen ${c.label.toLowerCase()}.`)
  const resources = Array.from(new Set(constraints.map(c => RESOURCE_BY_CATEGORY[c.category])))
    .filter(Boolean)
    .slice(0, 6)
  if (resources.length === 0) resources.push('Business setup', 'Bookkeeping & pricing')
  return {
    risks: risks.length > 0 ? risks : ['Complete more of your profile to sharpen your risks.'],
    actions,
    resources,
    builderPath: builderPathForType(answers.business_type ?? ''),
  }
}

/**
 * Canonical → legacy `ScoreResult` (the `szm_score` carrier read by results/report/
 * dashboard/unlock). Canonical-derived; never runs calculateScores; preserves raw answers.
 */
export function projectCanonicalToLegacyScoreResult(
  snapshot: MetrixProfileSnapshot,
  answers: RawAnswers,
  lead: LeadData,
): ScoreResult {
  const overall = snapshot.readiness.overall
  const { band, bandMessage } = bandFromScore(overall)
  const location = [answers.location?.city, answers.location?.state].filter(Boolean).join(', ')
  return {
    overall,
    band,
    bandLabel: band,
    bandMessage,
    categoryScores: projectCategoryScores(snapshot, answers),
    businessType: optionLabel(0, answers.business_type),
    location,
    stage: optionLabel(2, answers.stage),
    biggestBlocker: optionLabel(6, answers.blocker),
    leadName: lead.firstName,
    leadEmail: lead.email,
    report: projectReport(snapshot, answers),
    answers,                                   // raw answers preserved verbatim
    completedAt: snapshot.createdAt,
  }
}

/**
 * Canonical → Supabase `assessments` row. Fills only the table's proven columns; carries the
 * canonical version + provenance inside `report_json` (jsonb) without inventing columns. Never
 * runs calculateScores; preserves raw answers.
 */
export function projectCanonicalToLegacyAssessmentRow(
  snapshot: MetrixProfileSnapshot,
  answers: RawAnswers,
  lead: LeadData,
): Record<string, unknown> {
  const overall = snapshot.readiness.overall
  const { band } = bandFromScore(overall)
  return {
    lead_name: lead.firstName,
    lead_email: lead.email,
    business_type: answers.business_type ?? '',
    state: answers.location?.state ?? '',
    city: answers.location?.city ?? '',
    stage: answers.stage ?? '',
    setup_steps: answers.setup_steps ?? [],
    financial: answers.financial ?? '',
    customer_plan: answers.customer_plan ?? '',
    blocker: answers.blocker ?? '',
    overall_score: overall,
    band,                                       // display band derived from the canonical score
    score_label: snapshot.readiness.riskLabel,  // canonical risk label
    category_scores: Object.fromEntries(snapshot.readiness.categories.map(c => [c.category, c.score])),
    report_json: {
      canonical: true,
      profileSchemaVersion: snapshot.profileSchemaVersion,
      scoringVersion: snapshot.scoringVersion,
      rulesetVersion: snapshot.rulesetVersion,
      source: snapshot.source,
      riskLevel: snapshot.readiness.riskLevel,
      riskLabel: snapshot.readiness.riskLabel,
      priorityFocus: snapshot.prioritySeed.focusCategory,
      priorityRationale: snapshot.prioritySeed.rationale,
      constraints: snapshot.constraintCandidates.map(c => ({ category: c.category, score: c.score, severity: c.severity })),
      roadmapSeed: snapshot.roadmapSeed.steps,
    },
    answers_json: answers,                      // raw answers preserved verbatim
    completed_at: snapshot.createdAt,
  }
}
