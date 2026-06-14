// ─────────────────────────────────────────────────────────────────────────────
// metrix/priorityView — read-only view model for the interactive priority UX (SZM-2B)
// ─────────────────────────────────────────────────────────────────────────────
// Formats the canonical snapshot into a display-ready view model. It READS ONLY from the
// canonical read-model accessors — it never scores, derives gates, selects priority, or
// builds completion paths. Pure + deterministic, so the UI is a thin renderer and the
// presentation is testable without a DOM.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  MetrixProfileSnapshot, EvidenceStatus, PathType, CostBand, EffortBand,
  PathRiskLevel, QuestionImpact, GateSeverity,
} from './profileTypes'
import {
  getMetrixPriority, getCompletionPaths, getRecommendedCompletionPath,
  getPrimaryActionSteps, getNextUpPriorities, getNextBestQuestions, getBlockedRecommendations,
} from './readModel'

const EVIDENCE_LABEL: Record<EvidenceStatus, string> = {
  evidence_backed: 'Based on your answers',
  partial_evidence: 'Partly inferred — confirm to sharpen',
  low_evidence: 'Low confidence — add a few details',
  no_evidence: 'Not yet measured',
}
const PATH_TYPE_LABEL: Record<PathType, string> = {
  guided_diy: 'Do it yourself (guided)',
  tool_assisted: 'With a tool',
  specialist_assisted: 'With a specialist',
  official_authority: 'Through the official authority',
  prerequisite_first: 'Handle a prerequisite first',
  not_ready: 'Not recommended yet',
}
const COST_LABEL: Record<CostBand, string> = {
  free: 'Free', low: 'Low cost', moderate: 'Moderate cost', high: 'Higher cost', varies: 'Cost varies', unknown: 'Cost unknown',
}
const EFFORT_LABEL: Record<EffortBand, string> = {
  quick: 'Quick', short: 'Short', moderate: 'Moderate', extended: 'Extended', unknown: 'Effort unknown',
}
const IMPACT_LABEL: Record<QuestionImpact, string> = {
  changes_priority: 'Could change your top priority',
  confirms_gate: 'Could confirm this priority',
  refines_roadmap: 'Could refine your plan',
  improves_confidence: 'Could raise confidence in this recommendation',
}

export type PriorityViewState = 'missing' | 'legacy' | 'ready'

export interface PathView {
  pathId: string
  pathType: PathType
  pathTypeLabel: string
  title: string
  description: string
  bestFor: string
  recommended: boolean
  recommendationReason: string
  notRecommendedWhen: string
  effortLabel: string
  costLabel: string
  riskLevel: PathRiskLevel
  prerequisites: string[]
  actionStepCount: number
}
export interface StepView {
  stepId: string
  order: number
  title: string
  instruction: string
  purpose: string
  completionCriteria: string
  evidenceRequested: string[]
  isFirst: boolean
  blocking: boolean
  optional: boolean
  effortLabel: string
}
export interface NextUpView {
  priorityId: string
  title: string
  requiredOutcome: string
  activationCondition: string
  blockedBy: string | null
  rank: number
}
export interface QuestionView {
  questionKey: string
  reason: string
  impactLabel: string
  urgency: string
}
export interface PriorityHeadView {
  title: string
  rationale: string
  requiredOutcome: string
  evidenceLabel: string
  severity: GateSeverity
  isStrongOperator: boolean
  blockedWarning: string | null
}
export interface PriorityView {
  state: PriorityViewState
  priority: PriorityHeadView | null
  recommendedPathId: string | null
  paths: PathView[]            // recommended path first
  firstAction: StepView | null
  actionSteps: StepView[]
  nextUp: NextUpView[]         // ≤3, non-active
  topQuestion: QuestionView | null
}

const EMPTY: PriorityView = {
  state: 'missing', priority: null, recommendedPathId: null, paths: [],
  firstAction: null, actionSteps: [], nextUp: [], topQuestion: null,
}

function toStep(s: import('./profileTypes').ActionStep): StepView {
  return {
    stepId: s.stepId, order: s.order, title: s.title, instruction: s.instruction, purpose: s.purpose,
    completionCriteria: s.completionCriteria, evidenceRequested: s.evidenceRequested,
    isFirst: s.order === 1, blocking: s.blocking, optional: s.optional, effortLabel: EFFORT_LABEL[s.estimatedEffort],
  }
}

export function buildPriorityView(snapshot: MetrixProfileSnapshot | null): PriorityView {
  if (!snapshot) return EMPTY

  const priority = getMetrixPriority(snapshot)
  if (priority.priorityId === 'priority_unknown') {
    return { ...EMPTY, state: 'legacy' }
  }

  const blocked = getBlockedRecommendations(snapshot)
  const recommended = getRecommendedCompletionPath(snapshot)
  // Recommended path first, then the rest in catalog order (stable).
  const paths: PathView[] = [...getCompletionPaths(snapshot)]
    .sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0))
    .map(p => ({
      pathId: p.pathId,
      pathType: p.pathType,
      pathTypeLabel: PATH_TYPE_LABEL[p.pathType],
      title: p.title,
      description: p.description,
      bestFor: p.bestFor,
      recommended: p.recommended,
      recommendationReason: p.recommendationReason,
      notRecommendedWhen: p.notRecommendedWhen,
      effortLabel: EFFORT_LABEL[p.estimatedEffort],
      costLabel: COST_LABEL[p.estimatedCostBand],
      riskLevel: p.riskLevel,
      prerequisites: p.prerequisites,
      actionStepCount: p.actionSteps.length,
    }))

  const steps = getPrimaryActionSteps(snapshot).map(toStep)
  const q = getNextBestQuestions(snapshot)[0] ?? null

  return {
    state: 'ready',
    priority: {
      title: priority.title,
      rationale: priority.rationale,
      requiredOutcome: priority.requiredOutcome,
      evidenceLabel: EVIDENCE_LABEL[priority.evidenceStatus],
      severity: priority.severity,
      isStrongOperator: priority.sourceGateIds.length === 0,
      blockedWarning: blocked.length > 0
        ? `Hold growth work (like "${blocked[0].label.toLowerCase()}") until this priority is resolved.`
        : null,
    },
    recommendedPathId: recommended?.pathId ?? null,
    paths,
    firstAction: steps[0] ?? null,
    actionSteps: steps,
    nextUp: getNextUpPriorities(snapshot).slice(0, 3).map(n => ({
      priorityId: n.priorityId, title: n.title, requiredOutcome: n.requiredOutcome,
      activationCondition: n.activationCondition, blockedBy: n.blockedBy, rank: n.rank,
    })),
    topQuestion: q ? { questionKey: q.questionKey, reason: q.reason, impactLabel: IMPACT_LABEL[q.expectedDecisionImpact], urgency: q.urgency } : null,
  }
}
