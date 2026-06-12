// ─────────────────────────────────────────────────────────────────────────────
// roadmapProgress — execution progress over the recommended actions (4B)
// ─────────────────────────────────────────────────────────────────────────────
// CALCULATION ONLY. Reads the existing recommended actions (generateActions) and
// the locally-saved completed action ids, then reports progress, the active phase,
// the next action, and a momentum message. It does NOT change scoring or roadmap
// definitions/logic — it measures progress over what the app already recommends.
//
// "Phases" here are the MetrixScore categories the recommended actions fall into,
// in the order the recommender prioritised them. Completion is device-local.
// ─────────────────────────────────────────────────────────────────────────────

import { CATEGORY_LABELS, type MetrixCategory, type MetrixScore } from './metrixEngine'
import type { QuickIntake } from './intake'
import { generateActions } from './pathActions'

const PATH_COMPLETE_KEY = 'szm_path_complete'

export interface RoadmapActionProgress {
  id: string
  title: string
  category: MetrixCategory
  categoryLabel: string
  completed: boolean
  estimatedTime: string | null
  difficulty: string | null
  impact: string | null
}

export type PhaseStatus = 'not_started' | 'in_progress' | 'complete'

export interface RoadmapPhaseProgress {
  category: MetrixCategory
  label: string
  total: number
  completed: number
  percent: number
  status: PhaseStatus
  actions: RoadmapActionProgress[]
}

export interface ActiveRoadmapPhase {
  category: MetrixCategory
  label: string
  percent: number
  nextActionId: string | null
  nextActionTitle: string | null
}

export interface RoadmapProgressSummary {
  totalActions: number
  completedActions: number
  percent: number
  phases: RoadmapPhaseProgress[]
  activePhase: ActiveRoadmapPhase | null
  nextAction: RoadmapActionProgress | null
  blockedAreas: { category: MetrixCategory; label: string }[]
  momentumMessage: string
  storageNote: string
}

/** Completed action ids saved locally on this device (szm_path_complete). */
export function getCompletedActionIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(PATH_COMPLETE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

function recommendedActions(score: MetrixScore, intake: QuickIntake | null) {
  return generateActions('recommended', score, intake, 'stabilize')
}

/** Per-phase (per-category) progress over the recommended actions. */
export function getPhaseProgress(
  score: MetrixScore,
  intake: QuickIntake | null,
  completedIds: string[],
): RoadmapPhaseProgress[] {
  const done = new Set(completedIds)
  const order: MetrixCategory[] = []
  const byCategory = new Map<MetrixCategory, RoadmapActionProgress[]>()

  for (const a of recommendedActions(score, intake)) {
    if (!byCategory.has(a.category)) {
      byCategory.set(a.category, [])
      order.push(a.category)
    }
    byCategory.get(a.category)!.push({
      id: a.id,
      title: a.title,
      category: a.category,
      categoryLabel: CATEGORY_LABELS[a.category],
      completed: done.has(a.id),
      estimatedTime: a.estimatedTime,
      difficulty: a.difficulty,
      impact: a.impact,
    })
  }

  return order.map(category => {
    const actions = byCategory.get(category)!
    const completed = actions.filter(a => a.completed).length
    const total = actions.length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    const status: PhaseStatus = completed === 0 ? 'not_started' : completed === total ? 'complete' : 'in_progress'
    return { category, label: CATEGORY_LABELS[category], total, completed, percent, status, actions }
  })
}

/** Areas currently holding the owner back — high-severity risk categories. */
export function getBlockedRoadmapAreas(score: MetrixScore): { category: MetrixCategory; label: string }[] {
  return score.risks
    .filter(r => r.severity === 'high')
    .map(r => ({ category: r.category, label: r.label }))
}

/** Honest execution-momentum message. No score-increase promises. */
export function getRoadmapMomentumMessage(completed: number, total: number): string {
  if (total === 0) return 'Your roadmap is ready — pick your first action to get started.'
  const pct = Math.round((completed / total) * 100)
  if (pct === 0) return 'You have not started yet — your next best action is ready below.'
  if (pct === 100) return 'All your current actions are complete — reassess to see your updated MetrixScore™.'
  if (pct < 50) return 'You are building execution momentum — keep going.'
  return 'Strong execution momentum — you are most of the way through your current moves.'
}

/** Full progress summary used by the UI. */
export function getRoadmapProgress(
  score: MetrixScore,
  intake: QuickIntake | null,
  completedIds: string[],
): RoadmapProgressSummary {
  const phases = getPhaseProgress(score, intake, completedIds)
  const totalActions = phases.reduce((sum, p) => sum + p.total, 0)
  const completedActions = phases.reduce((sum, p) => sum + p.completed, 0)
  const percent = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0

  let nextAction: RoadmapActionProgress | null = null
  for (const phase of phases) {
    const candidate = phase.actions.find(a => !a.completed)
    if (candidate) {
      nextAction = candidate
      break
    }
  }

  const activePhaseSource = phases.find(p => p.status !== 'complete') ?? null
  const activePhase: ActiveRoadmapPhase | null = activePhaseSource
    ? {
        category: activePhaseSource.category,
        label: activePhaseSource.label,
        percent: activePhaseSource.percent,
        nextActionId: nextAction ? nextAction.id : null,
        nextActionTitle: nextAction ? nextAction.title : null,
      }
    : null

  return {
    totalActions,
    completedActions,
    percent,
    phases,
    activePhase,
    nextAction,
    blockedAreas: getBlockedRoadmapAreas(score),
    momentumMessage: getRoadmapMomentumMessage(completedActions, totalActions),
    storageNote: 'Progress saved on this device.',
  }
}

export function getRoadmapCompletionPercent(
  score: MetrixScore,
  intake: QuickIntake | null,
  completedIds: string[],
): number {
  return getRoadmapProgress(score, intake, completedIds).percent
}

export function getActiveRoadmapPhase(
  score: MetrixScore,
  intake: QuickIntake | null,
  completedIds: string[],
): ActiveRoadmapPhase | null {
  return getRoadmapProgress(score, intake, completedIds).activePhase
}

export function getNextRoadmapAction(
  score: MetrixScore,
  intake: QuickIntake | null,
  completedIds: string[],
): RoadmapActionProgress | null {
  return getRoadmapProgress(score, intake, completedIds).nextAction
}
