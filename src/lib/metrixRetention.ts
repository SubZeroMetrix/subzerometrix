// ─────────────────────────────────────────────────────────────────────────────
// MetrixRetention — local-device retention orchestration (Mega-Phase 2)
// ─────────────────────────────────────────────────────────────────────────────
// Glue between the displayed Starter MetrixScore™ and the retention foundation
// models. It records local-device snapshots of the user's score + profile,
// builds MetrixScore™ history, creates reassessment events on re-takes, and
// tracks action progress — all on THIS DEVICE only (no auth, no cloud, no sync).
//
// It does NOT change scoring math: it reads buildStarterScore() (the same value
// shown on /results, /dashboard, /report) and stores a snapshot of it.
//
// Import direction stays one-way: pages → metrixRetention → (metrixReport,
// metrixHistory, metrixStorage, metrixReminders). None of those import back.
// ─────────────────────────────────────────────────────────────────────────────

import type { ScoreResult } from './scoring'
import type { QuickIntake } from './intake'
import type { MetrixScore } from './metrixEngine'
import { buildStarterScore } from './metrixReport'
import {
  createScoreSnapshot,
  createProfileSnapshot,
  createReassessmentEvent,
  createActionProgressSnapshot,
  createEmptyMetrixHistoryState,
  addScoreSnapshot,
  addReassessmentEvent,
  addActionProgressSnapshot,
  getLatestScoreSnapshot,
  getPreviousScoreSnapshot,
  getHistorySummary,
  calculateScoreDelta,
  calculateCategoryDeltas,
  type MetrixHistoryState,
  type MetrixScoreSnapshot,
  type MetrixCategorySnapshot,
  type CategoryDelta,
  type MetrixHistorySummary,
  type ActionProgressSnapshot,
} from './metrixHistory'
import {
  loadLocalMetrixHistory,
  saveLocalMetrixHistory,
  saveLocalMetrixProfile,
} from './metrixStorage'
import { createReassessmentReminder, type ReminderEvent } from './metrixReminders'

// Marker so each completed assessment records exactly one snapshot, no matter how
// many times /results or /dashboard re-mount. Device-only.
const LAST_RECORDED_KEY = 'szm_metrix_last_recorded_at'

function readMarker(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(LAST_RECORDED_KEY)
  } catch {
    return null
  }
}

function writeMarker(value: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(LAST_RECORDED_KEY, value)
  } catch {
    // non-fatal
  }
}

function categoriesFromStarter(score: MetrixScore): MetrixCategorySnapshot[] {
  return score.categories
    .filter(c => c.answered > 0)
    .map(c => ({ category: c.category, score: c.score }))
}

// ── Read model for UI ─────────────────────────────────────────────────────────
export interface RetentionView {
  hasHistory: boolean
  summary: MetrixHistorySummary
  latest: MetrixScoreSnapshot | null
  previous: MetrixScoreSnapshot | null
  categoryDeltas: CategoryDelta[]
  reassessmentReminder: ReminderEvent | null   // in-app nudge only
}

function buildView(state: MetrixHistoryState): RetentionView {
  const latest = getLatestScoreSnapshot(state)
  const previous = getPreviousScoreSnapshot(state)
  return {
    hasHistory: state.scoreSnapshots.length > 0,
    summary: getHistorySummary(state),
    latest,
    previous,
    categoryDeltas: latest ? calculateCategoryDeltas(previous, latest) : [],
    reassessmentReminder: latest ? createReassessmentReminder(latest.createdAt, 90) : null,
  }
}

/** Load the current local retention view (device-only). */
export function getRetentionView(): RetentionView {
  return buildView(loadLocalMetrixHistory() ?? createEmptyMetrixHistoryState('local_device'))
}

// ── Recording ─────────────────────────────────────────────────────────────────
export interface RetentionRecordResult {
  isNew: boolean
  isReassessment: boolean
  scoreDelta: number | null
  view: RetentionView
}

/**
 * Record a local-device snapshot of the current Starter MetrixScore™ + profile.
 * Idempotent per completed assessment (keyed on result.completedAt). On a NEW
 * assessment after a prior one, also records a ReassessmentEvent with the delta.
 */
export function recordAssessmentSnapshot(
  result: ScoreResult,
  intake: QuickIntake | null,
): RetentionRecordResult {
  let state = loadLocalMetrixHistory() ?? createEmptyMetrixHistoryState('local_device')
  const completedAt = result.completedAt ?? ''

  // Already recorded this assessment — return the current view unchanged.
  if (completedAt !== '' && readMarker() === completedAt && state.scoreSnapshots.length > 0) {
    return {
      isNew: false,
      isReassessment: state.reassessmentEvents.length > 0,
      scoreDelta: getHistorySummary(state).scoreDelta,
      view: buildView(state),
    }
  }

  const starter = buildStarterScore(result.answers, intake)
  const prior = getLatestScoreSnapshot(state)

  const snapshot = createScoreSnapshot({
    overall: starter.overall,
    categories: categoriesFromStarter(starter),
    riskLevel: starter.riskLevel,
    riskLabel: starter.riskLabel,
    profileCompletion: starter.progress.completion,
    trade: intake?.trade ?? null,
    region: intake?.region ?? null,
    businessStage: starter.stage,
    mainGoal: intake?.mainGoal ?? null,
    biggestChallenge: intake?.biggestChallenge ?? null,
    source: prior ? 'reassessment' : 'initial_assessment',
  })
  state = addScoreSnapshot(state, snapshot)

  // Current MetrixProfile™ snapshot — kept both in history and in the single
  // "current profile" slot for quick local reads.
  const profileSnapshot = createProfileSnapshot({
    trade: intake?.trade ?? null,
    region: intake?.region ?? null,
    businessStage: intake?.stage ?? starter.stage,
    yearsInBusiness: intake?.yearsInBusiness ?? null,
    revenueRange: intake?.revenueRange ?? null,
    teamSize: intake?.teamSize ?? null,
    mainGoal: intake?.mainGoal ?? null,
    biggestChallenge: intake?.biggestChallenge ?? null,
    confidence: intake?.confidence ?? null,
    profileCompletion: starter.progress.completion,
  })
  state = {
    ...state,
    profileSnapshots: [...state.profileSnapshots, profileSnapshot],
    updatedAt: new Date().toISOString(),
  }

  let scoreDelta: number | null = null
  let isReassessment = false
  if (prior) {
    isReassessment = true
    scoreDelta = calculateScoreDelta(prior, snapshot)
    state = addReassessmentEvent(
      state,
      createReassessmentEvent({
        reason: 'user_initiated',
        previousScoreSnapshotId: prior.id,
        newScoreSnapshotId: snapshot.id,
        scoreDelta,
      }),
    )
  }

  saveLocalMetrixHistory(state)
  saveLocalMetrixProfile(profileSnapshot)
  if (completedAt !== '') writeMarker(completedAt)

  return { isNew: true, isReassessment, scoreDelta, view: buildView(state) }
}

/**
 * Record local action progress (completed action ids). Deduplicated against the
 * latest snapshot so re-mounts do not pile up identical entries.
 */
export function recordActionProgress(
  completedActionIds: string[],
  totalActions: number | null,
  source: string,
): ActionProgressSnapshot | null {
  let state = loadLocalMetrixHistory() ?? createEmptyMetrixHistoryState('local_device')
  const arr = state.actionProgressSnapshots
  const latest = arr.length > 0 ? arr[arr.length - 1] : null
  const keyOf = (ids: string[]) => [...ids].sort().join('|')

  if (latest && latest.source === source && keyOf(latest.completedActionIds) === keyOf(completedActionIds)) {
    return latest
  }

  const snapshot = createActionProgressSnapshot({ completedActionIds, totalActions, source })
  state = addActionProgressSnapshot(state, snapshot)
  saveLocalMetrixHistory(state)
  return snapshot
}
