// ─────────────────────────────────────────────────────────────────────────────
// metrix/priorityProgress — safe initial action-progress (SZM-2A, pure)
// ─────────────────────────────────────────────────────────────────────────────
// Derives the minimum progress model for later UI + cloud sync. THIS PHASE ONLY derives a
// safe initial state — no mutation APIs, no persistence, no cloud/localStorage writes. A
// freshly evaluated profile starts not_started, with no path falsely selected, no steps
// falsely completed, deterministic 0% completion, and reassessmentEligible=false until the
// completion criteria are met.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixPriority, ActionStep, PriorityProgress } from './profileTypes'

export function deriveInitialProgress(
  priority: MetrixPriority,
  primaryActionSteps: ActionStep[],
): PriorityProgress {
  const totalRequiredSteps = primaryActionSteps.filter(s => !s.optional).length
  return {
    priorityId: priority.priorityId,
    status: 'not_started',
    selectedPathId: null,         // recommended ≠ selected; user has not chosen yet
    completedStepIds: [],
    totalRequiredSteps,
    completionPercent: 0,
    evidenceStatus: priority.evidenceStatus,
    startedAt: null,
    completedAt: null,
    reassessmentEligible: false,  // only true once completion criteria are satisfied
  }
}
