// ─────────────────────────────────────────────────────────────────────────────
// metrix/progressRecord — versioned priority-progress record + deterministic ops (SZM-2E)
// ─────────────────────────────────────────────────────────────────────────────
// A persisted record of the user's progress on their ACTIVE Metrix Priority. Pure,
// deterministic operations only — no storage, no cloud, no scoring/gate/priority changes.
// Step tracking is against the canonical primary action steps; path SELECTION is recorded as
// a user preference. Reassessment-eligible is exposed but NO auto re-scoring is triggered.
// ─────────────────────────────────────────────────────────────────────────────

import {
  RULESET_VERSION,
  type MetrixProfileSnapshot, type ProgressStatus, type ActionStep,
} from './profileTypes'
import { getMetrixPriority, getPrimaryActionSteps, getCompletionPaths } from './readModel'

export const PROGRESS_SCHEMA_VERSION = 1

export type EvidenceState = 'pending' | 'provided'

export interface PersistedPriorityProgress {
  profileId: string
  priorityId: string
  selectedPathId: string | null
  completedStepIds: string[]
  evidenceStates: Record<string, EvidenceState>
  status: ProgressStatus
  completionPercent: number
  startedAt: string | null
  updatedAt: string
  completedAt: string | null
  reassessmentEligible: boolean
  schemaVersion: number
  rulesetVersion: number
  source: 'device' | 'account'
}

function requiredStepIds(snapshot: MetrixProfileSnapshot): string[] {
  return getPrimaryActionSteps(snapshot).filter(s => !s.optional).map(s => s.stepId)
}
function allStepIds(snapshot: MetrixProfileSnapshot): string[] {
  return getPrimaryActionSteps(snapshot).map(s => s.stepId)
}
function stepById(snapshot: MetrixProfileSnapshot, id: string): ActionStep | undefined {
  return getPrimaryActionSteps(snapshot).find(s => s.stepId === id)
}
// A step can be completed only once every EARLIER blocking step is complete.
export function canCompleteStep(record: PersistedPriorityProgress, snapshot: MetrixProfileSnapshot, stepId: string): boolean {
  const step = stepById(snapshot, stepId)
  if (!step) return false
  const blockersBefore = getPrimaryActionSteps(snapshot).filter(s => s.order < step.order && s.blocking).map(s => s.stepId)
  return blockersBefore.every(b => record.completedStepIds.includes(b))
}

export function createProgressRecord(snapshot: MetrixProfileSnapshot, now: string): PersistedPriorityProgress {
  return {
    profileId: snapshot.profileId,
    priorityId: getMetrixPriority(snapshot).priorityId,
    selectedPathId: null,                 // recommended is shown, but nothing falsely "selected"
    completedStepIds: [],
    evidenceStates: {},
    status: 'not_started',
    completionPercent: 0,
    startedAt: null,
    updatedAt: now,
    completedAt: null,
    reassessmentEligible: false,
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    rulesetVersion: RULESET_VERSION,
    source: 'device',
  }
}

// Recompute derived fields. Prunes stale step ids so historical/changed data is ignored safely.
export function recompute(record: PersistedPriorityProgress, snapshot: MetrixProfileSnapshot, now: string): PersistedPriorityProgress {
  const valid = new Set(allStepIds(snapshot))
  const completed = record.completedStepIds.filter(id => valid.has(id))
  const required = requiredStepIds(snapshot)
  const doneRequired = required.filter(id => completed.includes(id)).length
  const total = required.length
  const evidenceAllProvided = (snapshot.primaryActionSteps[0]?.evidenceRequested ?? [])
    .every(k => record.evidenceStates[k] === 'provided')

  let status: ProgressStatus
  if (total === 0) status = 'blocked'
  else if (doneRequired === 0 && !record.selectedPathId) status = 'not_started'
  else if (doneRequired < total) status = 'in_progress'
  else status = evidenceAllProvided ? 'completed' : 'ready_for_review'

  const completionPercent = total > 0 ? Math.round((doneRequired / total) * 100) : 0
  const reassessmentEligible = status === 'ready_for_review' || status === 'completed'
  return {
    ...record,
    completedStepIds: completed,
    status,
    completionPercent,
    reassessmentEligible,
    completedAt: status === 'completed' ? (record.completedAt ?? now) : null,
    updatedAt: now,
  }
}

function touchStart(record: PersistedPriorityProgress, now: string): PersistedPriorityProgress {
  return record.startedAt ? record : { ...record, startedAt: now }
}

/** Select/change the completion path (must be a valid path on this snapshot). */
export function selectPath(record: PersistedPriorityProgress, pathId: string, snapshot: MetrixProfileSnapshot, now: string): PersistedPriorityProgress {
  const valid = getCompletionPaths(snapshot).some(p => p.pathId === pathId)
  if (!valid) return record
  return recompute(touchStart({ ...record, selectedPathId: pathId }, now), snapshot, now)
}

/** Toggle a step. Completing is blocked when an earlier blocking step is incomplete. */
export function toggleStep(record: PersistedPriorityProgress, stepId: string, snapshot: MetrixProfileSnapshot, now: string): PersistedPriorityProgress {
  const isDone = record.completedStepIds.includes(stepId)
  if (isDone) {
    return recompute(touchStart({ ...record, completedStepIds: record.completedStepIds.filter(id => id !== stepId) }, now), snapshot, now)
  }
  if (!canCompleteStep(record, snapshot, stepId)) return record // prerequisite unmet → blocked, no-op
  return recompute(touchStart({ ...record, completedStepIds: [...record.completedStepIds, stepId] }, now), snapshot, now)
}

/** Mark an evidence key provided/pending. */
export function setEvidence(record: PersistedPriorityProgress, key: string, provided: boolean, snapshot: MetrixProfileSnapshot, now: string): PersistedPriorityProgress {
  return recompute(touchStart({ ...record, evidenceStates: { ...record.evidenceStates, [key]: provided ? 'provided' : 'pending' } }, now), snapshot, now)
}

export interface PriorityChangeResult {
  active: PersistedPriorityProgress
  archived: PersistedPriorityProgress | null   // old record kept as history when the priority changed
  changed: boolean
}

/**
 * If the canonical priority/profile/version no longer matches the record, archive the old
 * record and start a FRESH active record. Old completed steps never count for a new priority.
 */
export function resetIfPriorityChanged(record: PersistedPriorityProgress | null, snapshot: MetrixProfileSnapshot, now: string): PriorityChangeResult {
  const priorityId = getMetrixPriority(snapshot).priorityId
  const matches = !!record
    && record.profileId === snapshot.profileId
    && record.priorityId === priorityId
    && record.schemaVersion === PROGRESS_SCHEMA_VERSION
  if (matches) return { active: recompute(record!, snapshot, now), archived: null, changed: false }
  return { active: createProgressRecord(snapshot, now), archived: record ?? null, changed: !!record }
}
