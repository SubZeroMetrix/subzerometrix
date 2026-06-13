// ─────────────────────────────────────────────────────────────────────────────
// MetrixReport — bridge + copy helpers for the report's Starter MetrixScore
// ─────────────────────────────────────────────────────────────────────────────
// Derives a "Starter" stage-adjusted MetrixScore from data the app already has
// (the completed assessment's RawAnswers + the Quick Intake), then provides the
// human-friendly copy the report renders (risk language, first action, paths).
//
// It is a PREVIEW/bridge: the full 21-criterion assessment does not exist in the
// UI yet, so only the criteria we can infer are answered — which is why the
// engine reports a partial "profile completion %". No scoring, persistence,
// Stripe, or Supabase logic is touched here.
// ─────────────────────────────────────────────────────────────────────────────

import type { RawAnswers } from './scoring'
import type { QuickIntake, BusinessStage } from './intake'
import {
  scoreAssessment,
  type AssessmentResponse,
  type AnswerChoice,
  type MetrixScore,
  type MetrixCategory,
  type RecommendedPath,
} from './metrixEngine'
import { challengeCategory, goalCategory } from './pathActions'

// ── Mapping helpers (existing answer → Likert choice) ─────────────────────────
function cashFromFinancial(fin: string): AnswerChoice | undefined {
  switch (fin) {
    case 'over_25k':     return 'strong_documented'
    case 'k10_25':       return 'needs_improvement'
    case 'k2_10':        return 'started_inconsistent'
    case 'under_2k':     return 'not_started'
    case 'need_funding': return 'not_started'
    case 'not_sure':     return 'not_sure'
    default:             return undefined
  }
}

function runwayFromFinancial(fin: string): AnswerChoice | undefined {
  switch (fin) {
    case 'over_25k':     return 'strong_documented'
    case 'k10_25':       return 'needs_improvement'
    case 'k2_10':        return 'started_inconsistent'
    case 'under_2k':     return 'not_started'
    case 'need_funding': return 'not_started'
    case 'not_sure':     return 'not_sure'
    default:             return undefined
  }
}

function leadFromPlan(plan: string): AnswerChoice | undefined {
  switch (plan) {
    case 'existing_base': return 'strong_documented'
    case 'referrals':     return 'needs_improvement'
    case 'gbp_local':     return 'needs_improvement'
    case 'word_of_mouth': return 'started_inconsistent'
    case 'social':        return 'started_inconsistent'
    case 'paid_ads':      return 'started_inconsistent'
    case 'flyers':        return 'started_inconsistent'
    case 'no_plan':       return 'not_started'
    default:              return undefined
  }
}

// Team size (from intake) is a reasonable proxy for People & Leadership maturity.
function fromTeamSize(team: string): AnswerChoice | undefined {
  switch (team) {
    case 'just_me': return 'not_started'
    case '2_3':     return 'started_inconsistent'
    case '4_10':    return 'needs_improvement'
    case 'over_10': return 'strong_documented'
    default:        return undefined
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Build a partial AssessmentResponse from existing data, then score it.
// ─────────────────────────────────────────────────────────────────────────────
export function buildStarterResponse(
  answers: RawAnswers,
  intake: QuickIntake | null,
): AssessmentResponse {
  const setup = answers.setup_steps ?? []
  const has = (id: string) => setup.includes(id)
  const fin = answers.financial ?? ''
  const plan = answers.customer_plan ?? ''
  const blocker = answers.blocker ?? ''
  const team = intake?.teamSize ?? ''

  const a: Record<string, AnswerChoice> = {}
  const set = (id: string, v: AnswerChoice | undefined) => { if (v) a[id] = v }

  // ── Business Foundation ─────────────────────────────────────────────────────
  set('entity_registration',
    has('entity_reg') ? 'strong_documented'
    : has('biz_name') ? 'started_inconsistent'
    : 'not_started')
  set('licensing_insurance',
    has('insurance') && has('license_res') ? 'strong_documented'
    : has('insurance') || has('license_res') ? 'needs_improvement'
    : 'not_started')
  set('banking_separation', has('bank') ? 'strong_documented' : 'not_started')

  // ── Financial Control ───────────────────────────────────────────────────────
  set('cash_flow', cashFromFinancial(fin))
  if (blocker === 'pricing') set('pricing_strategy', 'not_started')

  // ── Sales & Marketing ───────────────────────────────────────────────────────
  set('lead_generation', leadFromPlan(plan))
  set('online_presence',
    has('gbp') && has('website') ? 'strong_documented'
    : has('gbp') || has('website') ? 'needs_improvement'
    : 'not_started')
  if (blocker === 'branding') set('brand_consistency', 'not_started')
  else if (has('website')) set('brand_consistency', 'started_inconsistent')

  // ── Operations ──────────────────────────────────────────────────────────────
  if (blocker === 'software') set('scheduling_workflow', 'not_started')

  // ── People & Leadership (from intake team size) ─────────────────────────────
  // Solo operators with no team-growth goal should NOT be scored on People &
  // Leadership. "just_me" otherwise maps every criterion to "not_started" (0),
  // which wrongly makes this category dominate the risk focus and first actions
  // before the owner even has a team. Leave it unanswered/excluded for them.
  const teamGrowthGoal = (intake?.mainGoal ?? '') === 'hire_scale'

  if (team !== 'just_me' || teamGrowthGoal) {
    set('hiring_process', fromTeamSize(team))
    set('training_standards', fromTeamSize(team))
    set('delegation_roles', fromTeamSize(team))
  }

  // ── Growth & Risk ───────────────────────────────────────────────────────────
  set('financial_runway', runwayFromFinancial(fin))
  set('risk_contingency', has('insurance') ? 'needs_improvement' : 'not_started')
  if (intake?.mainGoal) {
    set('growth_strategy', intake.confidence === 'high' ? 'needs_improvement' : 'started_inconsistent')
  }

  const stage = (intake?.stage || (answers.stage as BusinessStage) || '') as BusinessStage | ''
  return { stage, answers: a }
}

export function buildStarterScore(answers: RawAnswers, intake: QuickIntake | null): MetrixScore {
  const score = scoreAssessment(buildStarterResponse(answers, intake))
  return applyChallengeTiebreak(score, intake)
}

// When the lowest-scoring categories tie, prefer the one matching the user's
// stated biggest challenge or main goal as the focus. Keeps the recommended
// path and first action pointed at what the owner told us actually matters.
function applyChallengeTiebreak(score: MetrixScore, intake: QuickIntake | null): MetrixScore {
  if (score.risks.length < 2) return score
  const lowest = score.risks[0].score
  const tied = score.risks.filter(r => r.score === lowest)
  if (tied.length < 2) return score

  // Tie-break priority: biggest challenge first, then main goal, then default order.
  const chal = challengeCategory(intake)
  const goal = goalCategory(intake)
  const promote =
    (chal ? tied.find(r => r.category === chal) : undefined) ??
    (goal ? tied.find(r => r.category === goal) : undefined)
  if (!promote || promote.category === score.risks[0].category) return score

  const risks = [promote, ...score.risks.filter(r => r !== promote)]
  const focus = risks[0]
  return {
    ...score,
    risks,
    recommendedPath: {
      ...score.recommendedPath,
      focusCategory: focus.category,
      focusLabel: focus.label,
      rationale: `At your stage, start with ${focus.label} — your lowest-scoring area and biggest near-term risk.`,
    },
  }
}

// NOTE (SZM-1A): estimatePotential() was moved to the canonical engine
// (src/lib/metrix/potential.ts → estimatePotentialFromSnapshot). It sourced the displayed
// CURRENT score by recomputing scoreAssessment(), which duplicated the live score. The
// canonical version reads `current` from the persisted snapshot and only runs the kernel
// for the hypothetical PROJECTED what-if.

// ─────────────────────────────────────────────────────────────────────────────
// Copy helpers
// ─────────────────────────────────────────────────────────────────────────────
function joinWords(words: string[]): string {
  if (words.length === 0) return ''
  if (words.length === 1) return words[0]
  return words.slice(0, -1).join(', ') + ' and ' + words[words.length - 1]
}

// Helpful, non-judgmental risk language.
export function explainRisk(score: MetrixScore): string {
  const weakest = score.risks.map(r => r.label).slice(0, 2)
  if (score.riskLevel === 'low') {
    return weakest.length > 0
      ? `Your current risk is low — your foundation is solid. Your biggest upside is in ${joinWords(weakest)}, where small improvements compound the fastest.`
      : 'Your current risk is low — your foundation is solid. Keep reinforcing what is already working.'
  }
  const word = score.riskLevel === 'elevated' ? 'elevated' : score.riskLevel
  if (weakest.length === 0) {
    return `Your current risk is ${word} mostly because your profile is still incomplete. Answer a few more areas to sharpen your score.`
  }
  return `Your current risk is ${word} because your weakest areas right now are ${joinWords(weakest)}. That is exactly where building strength moves your score the fastest — it is a starting point, not a verdict on whether you can succeed.`
}

// A single, concrete first step keyed to the top risk / focus area.
const FIRST_ACTION_BY_CATEGORY: Record<MetrixCategory, string> = {
  business_foundation: 'Register your business entity and open a separate business bank account.',
  financial_control:   'Set up simple bookkeeping and a basic pricing and cash-flow plan.',
  sales_marketing:     'Claim your Google Business Profile and set up one reliable lead source.',
  operations:          'Put one repeatable scheduling and job-tracking workflow in place.',
  customer_experience: 'Create a simple after-job follow-up and review-request routine.',
  people_leadership:   'Write down clear roles and a basic onboarding checklist before your next hire.',
  growth_risk:         'Build a small cash reserve and document your next growth milestone.',
}

export function firstAction(score: MetrixScore): string {
  const focus = score.recommendedPath.focusCategory
  if (!focus) return 'Complete more of your profile to unlock a precise first step.'
  return FIRST_ACTION_BY_CATEGORY[focus]
}

// ── Path catalog (mirrors the engine's path ids) ──────────────────────────────
export interface PathOption {
  id: RecommendedPath['id']
  label: string
  blurb: string
}

const PATH_CATALOG: Record<RecommendedPath['id'], PathOption> = {
  foundation: { id: 'foundation', label: 'Foundation Builder Path',     blurb: 'Lock in the legal, financial, and setup basics before you scale.' },
  stabilize:  { id: 'stabilize',  label: 'Stabilize & Systemize Path',  blurb: 'Tighten operations, pricing, and customer flow so growth holds.' },
  scale:      { id: 'scale',      label: 'Scale & Optimize Path',       blurb: 'Build the people, systems, and reserves to grow without breaking.' },
  rebuild:    { id: 'rebuild',    label: 'Reset & Rebuild Path',        blurb: 'Fix the highest-risk gaps first and rebuild on a stable base.' },
}

// The other path archetypes a user could consider, recommended one removed.
export function alternativePaths(score: MetrixScore): PathOption[] {
  return (Object.keys(PATH_CATALOG) as RecommendedPath['id'][])
    .filter(id => id !== score.recommendedPath.id)
    .map(id => PATH_CATALOG[id])
}
