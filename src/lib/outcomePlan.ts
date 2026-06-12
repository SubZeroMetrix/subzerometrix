// ─────────────────────────────────────────────────────────────────────────────
// outcomePlan — 7 / 30 / 90-day execution plan engine (Mega-Phase 4A)
// ─────────────────────────────────────────────────────────────────────────────
// PLANNING/EXPLANATION ONLY. Turns the existing Starter MetrixScore™ + Quick Intake
// into a clear execution plan across three windows. It reuses the existing action
// generator (pathActions) and connects steps to existing Tier 2 tools by id/name.
// It does NOT change scoring or roadmap logic — it sequences and frames what the
// app already recommends.
//
// Honest framing: outcomes are conditional ("if you complete these"), never
// guaranteed, predictive, or benchmarked.
// ─────────────────────────────────────────────────────────────────────────────

import { type MetrixCategory, type MetrixScore } from './metrixEngine'
import type { QuickIntake } from './intake'
import { generateActions, type PathAction } from './pathActions'
import { getTier2Tool } from './tier2Tools'
import { getNextScoreImprovementLevers } from './scoreExplanation'

export type OutcomePlanWindow = '7-day' | '30-day' | '90-day'

export interface OutcomePlanStep {
  id: string
  title: string
  detail: string
  category: MetrixCategory
  window: OutcomePlanWindow
  estimatedTime: string | null
  difficulty: string | null
  impact: string | null
  toolId: string | null
  toolName: string | null
}

export interface OutcomePlanPriority {
  category: MetrixCategory
  label: string
  why: string
  firstAction: string
}

export interface OutcomePlanWindowPlan {
  window: OutcomePlanWindow
  label: string
  steps: OutcomePlanStep[]
  expectedOutcome: string
  riskReduced: string
}

export interface OutcomePlan {
  priority: OutcomePlanPriority
  nextBestAction: OutcomePlanStep | null
  sevenDay: OutcomePlanWindowPlan
  thirtyDay: OutcomePlanWindowPlan
  ninetyDay: OutcomePlanWindowPlan
  tools: { id: string; name: string }[]
  reassessmentRecommendation: string
}

// Map each MetrixScore category to an EXISTING Tier 2 tool (ids from tier2Tools.ts).
// people_leadership has no direct Tier 2 tool yet, so it is intentionally omitted.
const CATEGORY_TO_TOOL: Partial<Record<MetrixCategory, string>> = {
  business_foundation: 'business_setup_checklist',
  financial_control: 'pricing_readiness_checklist',
  sales_marketing: 'gbp_checklist',
  operations: 'weekly_business_review_template',
  customer_experience: 'review_request_script',
  growth_risk: 'vendor_setup_tracker',
}

function toolForCategory(category: MetrixCategory): { id: string; name: string } | null {
  const id = CATEGORY_TO_TOOL[category]
  if (!id) return null
  const tool = getTier2Tool(id)
  return tool ? { id: tool.id, name: tool.title } : null
}

function toStep(action: PathAction, window: OutcomePlanWindow): OutcomePlanStep {
  const tool = toolForCategory(action.category)
  return {
    id: action.id,
    title: action.title,
    detail: action.whyItMatters,
    category: action.category,
    window,
    estimatedTime: action.estimatedTime,
    difficulty: action.difficulty,
    impact: action.impact,
    toolId: tool ? tool.id : null,
    toolName: tool ? tool.name : null,
  }
}

/** The full 7/30/90-day plan, derived from the existing recommendations. */
export function getOutcomePlan(score: MetrixScore, intake: QuickIntake | null = null): OutcomePlan {
  const actions = generateActions('recommended', score, intake, 'stabilize')
  const levers = getNextScoreImprovementLevers(score, intake, 3)
  const topLever = levers[0]
  const nextLever = levers[1] ?? levers[0]
  const focusLabel = topLever ? topLever.label : (score.recommendedPath.focusLabel || 'your top readiness gap')
  const topRisk = score.risks[0]
  const riskLabel = topRisk ? topRisk.label : 'your top readiness risk'

  // Window assignment from the prioritised action list.
  const sevenSteps = actions.slice(0, 1).map(a => toStep(a, '7-day'))
  const thirtySteps = actions.slice(1, 3).map(a => toStep(a, '30-day'))
  const consolidation: OutcomePlanStep = {
    id: 'consolidate_reassess',
    title: 'Reassess and tackle your next readiness area',
    detail: `After your first 30 days, retake the free assessment to see your updated MetrixScore™, then focus next on ${nextLever ? nextLever.label : 'your next-lowest area'}.`,
    category: nextLever ? nextLever.category : (topRisk ? topRisk.category : 'business_foundation'),
    window: '90-day',
    estimatedTime: null,
    difficulty: null,
    impact: null,
    toolId: null,
    toolName: null,
  }
  const ninetySteps = [...actions.slice(3).map(a => toStep(a, '90-day')), consolidation]

  const sevenDay: OutcomePlanWindowPlan = {
    window: '7-day',
    label: 'Your 7-day starter plan',
    steps: sevenSteps,
    expectedOutcome: `Get moving on ${focusLabel} with one focused action this week.`,
    riskReduced: `Starts reducing your most pressing readiness gap: ${riskLabel}.`,
  }
  const thirtyDay: OutcomePlanWindowPlan = {
    window: '30-day',
    label: 'Your 30-day execution plan',
    steps: thirtySteps,
    expectedOutcome: `Put the core systems behind ${focusLabel} in place.`,
    riskReduced: 'Strengthens readiness in your weakest areas; reassess afterward to see your updated score.',
  }
  const ninetyDay: OutcomePlanWindowPlan = {
    window: '90-day',
    label: 'Your 90-day outcome target',
    steps: ninetySteps,
    expectedOutcome: 'Build a steadier operation and a stronger MetrixProfile™, then reassess.',
    riskReduced: 'Closes the gaps behind your current risk level as you complete each step.',
  }

  const priority: OutcomePlanPriority = {
    category: topLever ? topLever.category : (topRisk ? topRisk.category : 'business_foundation'),
    label: focusLabel,
    why: topLever ? topLever.rationale : 'This is your lowest-scoring readiness area right now.',
    firstAction: sevenSteps[0] ? sevenSteps[0].title : (topLever ? topLever.firstAction : 'Start with your top gap'),
  }

  // Unique tools referenced across the plan.
  const toolMap = new Map<string, string>()
  for (const step of [...sevenSteps, ...thirtySteps, ...ninetySteps]) {
    if (step.toolId && step.toolName) toolMap.set(step.toolId, step.toolName)
  }
  const tools = Array.from(toolMap, ([id, name]) => ({ id, name }))

  return {
    priority,
    nextBestAction: sevenSteps[0] ?? null,
    sevenDay,
    thirtyDay,
    ninetyDay,
    tools,
    reassessmentRecommendation:
      'Complete your 30-day plan, then retake the assessment (free) to see how your MetrixScore™ has changed.',
  }
}

export function getSevenDayPlan(score: MetrixScore, intake: QuickIntake | null = null): OutcomePlanWindowPlan {
  return getOutcomePlan(score, intake).sevenDay
}
export function getThirtyDayPlan(score: MetrixScore, intake: QuickIntake | null = null): OutcomePlanWindowPlan {
  return getOutcomePlan(score, intake).thirtyDay
}
export function getNinetyDayPlan(score: MetrixScore, intake: QuickIntake | null = null): OutcomePlanWindowPlan {
  return getOutcomePlan(score, intake).ninetyDay
}
export function getNextBestAction(score: MetrixScore, intake: QuickIntake | null = null): OutcomePlanStep | null {
  return getOutcomePlan(score, intake).nextBestAction
}
export function getReassessmentRecommendation(score: MetrixScore, intake: QuickIntake | null = null): string {
  return getOutcomePlan(score, intake).reassessmentRecommendation
}
