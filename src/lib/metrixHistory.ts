// ─────────────────────────────────────────────────────────────────────────────
// MetrixHistory — retention foundation models (Mega-Phase 1: data/model only)
// ─────────────────────────────────────────────────────────────────────────────
// The data/model foundation that turns SubZeroMetrix™ from a one-time report into
// a progress-over-time engine: saved score snapshots, profile snapshots,
// reassessment events, action progress, manual KPIs, and in-app reminders.
//
// LOCAL-FIRST: every snapshot carries storageMode 'local_device' today. Cloud
// account sync is a LATER phase (no auth/Supabase here). NOTHING is persisted,
// scored, or wired to UI in this file — it is types + pure helpers only.
//
// Import graph is one-directional to avoid cycles:
//   metrixReminders (standalone)  ─┐
//   metrixKpis      (standalone)  ─┤→ metrixHistory →(types only) metrixStorage
//   intake / metrixEngine (types) ─┘
// ─────────────────────────────────────────────────────────────────────────────

import type { BusinessStage } from './intake'
import type { MetrixCategory } from './metrixEngine'
import type { ReminderEvent } from './metrixReminders'
import type { ManualKpiSnapshot } from './metrixKpis'

// Re-export the reminder + KPI surfaces so metrixHistory is the single retention
// entry point for callers.
export type { ReminderEvent } from './metrixReminders'
export type { ManualKpiSnapshot } from './metrixKpis'
export { createReminderEvent } from './metrixReminders'
export { createManualKpiSnapshot } from './metrixKpis'

// ── Shared enums ──────────────────────────────────────────────────────────────
// Where a snapshot lives. local_device = this browser only (today). cloud_account
// = synced to a saved account (a LATER phase once auth/persistence exist).
export type RetentionStorageMode = 'local_device' | 'cloud_account'

export type SnapshotSource =
  | 'initial_assessment'
  | 'reassessment'
  | 'manual_save'
  | 'imported'

export type ReassessmentReason =
  | 'scheduled'
  | 'user_initiated'
  | 'milestone_completed'
  | 'profile_updated'
  | 'other'

// ── Snapshot / event shapes ───────────────────────────────────────────────────
export interface MetrixCategorySnapshot {
  category: MetrixCategory
  score: number
}

export interface MetrixScoreSnapshot {
  id: string
  createdAt: string                          // ISO timestamp
  source: SnapshotSource
  storageMode: RetentionStorageMode
  overall: number
  categories: MetrixCategorySnapshot[]
  riskLevel: string | null
  riskLabel: string | null
  profileCompletion: number | null
  // Profile context captured at the moment of the snapshot.
  trade: string | null
  region: string | null
  businessStage: BusinessStage | '' | null
  mainGoal: string | null
  biggestChallenge: string | null
}

export interface MetrixProfileSnapshot {
  id: string
  createdAt: string
  storageMode: RetentionStorageMode
  trade: string | null
  region: string | null
  businessStage: BusinessStage | '' | null
  yearsInBusiness: string | null
  revenueRange: string | null
  teamSize: string | null
  mainGoal: string | null
  biggestChallenge: string | null
  confidence: string | null
  profileCompletion: number | null
}

export interface ReassessmentEvent {
  id: string
  createdAt: string
  storageMode: RetentionStorageMode
  reason: ReassessmentReason
  previousScoreSnapshotId: string | null
  newScoreSnapshotId: string | null
  scoreDelta: number | null
  note: string | null
}

export interface ActionProgressSnapshot {
  id: string
  createdAt: string
  storageMode: RetentionStorageMode
  completedActionIds: string[]
  completedCount: number
  totalActions: number | null
  source: string | null      // which surface produced it (path / foundation / growth)
}

export interface MetrixHistoryState {
  version: number
  storageMode: RetentionStorageMode
  updatedAt: string
  scoreSnapshots: MetrixScoreSnapshot[]
  profileSnapshots: MetrixProfileSnapshot[]
  reassessmentEvents: ReassessmentEvent[]
  actionProgressSnapshots: ActionProgressSnapshot[]
  kpiSnapshots: ManualKpiSnapshot[]
  reminderEvents: ReminderEvent[]
}

// ── Launch-safe copy (clear local-only vs future cloud framing) ───────────────
export const RETENTION_COPY = {
  localOnly:
    'Saved on this device only. Cloud account sync is coming later.',
  historyFoundation:
    'Your MetrixScore™ history builds here as you reassess over time.',
  progressTracking:
    'Track your progress and check items off as you complete them.',
  reassessOverTime:
    'Reassess periodically to see how your readiness changes over time.',
  noCloudYet:
    'A saved cloud account and cross-device sync are planned for a later release.',
} as const

// ── Internal utilities (no external deps) ─────────────────────────────────────
function nowIso(): string {
  return new Date().toISOString()
}

function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function sortByCreatedDesc<T extends { createdAt: string }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0))
}

// ── Factories ─────────────────────────────────────────────────────────────────
export interface ScoreSnapshotInput {
  overall: number
  categories?: MetrixCategorySnapshot[]
  riskLevel?: string | null
  riskLabel?: string | null
  profileCompletion?: number | null
  trade?: string | null
  region?: string | null
  businessStage?: BusinessStage | '' | null
  mainGoal?: string | null
  biggestChallenge?: string | null
  source?: SnapshotSource
  storageMode?: RetentionStorageMode
}

export function createScoreSnapshot(input: ScoreSnapshotInput): MetrixScoreSnapshot {
  return {
    id: genId('score'),
    createdAt: nowIso(),
    source: input.source ?? 'manual_save',
    storageMode: input.storageMode ?? 'local_device',
    overall: input.overall,
    categories: input.categories ? [...input.categories] : [],
    riskLevel: input.riskLevel ?? null,
    riskLabel: input.riskLabel ?? null,
    profileCompletion: input.profileCompletion ?? null,
    trade: input.trade ?? null,
    region: input.region ?? null,
    businessStage: input.businessStage ?? null,
    mainGoal: input.mainGoal ?? null,
    biggestChallenge: input.biggestChallenge ?? null,
  }
}

export interface ProfileSnapshotInput {
  trade?: string | null
  region?: string | null
  businessStage?: BusinessStage | '' | null
  yearsInBusiness?: string | null
  revenueRange?: string | null
  teamSize?: string | null
  mainGoal?: string | null
  biggestChallenge?: string | null
  confidence?: string | null
  profileCompletion?: number | null
  storageMode?: RetentionStorageMode
}

export function createProfileSnapshot(input: ProfileSnapshotInput): MetrixProfileSnapshot {
  return {
    id: genId('profile'),
    createdAt: nowIso(),
    storageMode: input.storageMode ?? 'local_device',
    trade: input.trade ?? null,
    region: input.region ?? null,
    businessStage: input.businessStage ?? null,
    yearsInBusiness: input.yearsInBusiness ?? null,
    revenueRange: input.revenueRange ?? null,
    teamSize: input.teamSize ?? null,
    mainGoal: input.mainGoal ?? null,
    biggestChallenge: input.biggestChallenge ?? null,
    confidence: input.confidence ?? null,
    profileCompletion: input.profileCompletion ?? null,
  }
}

export interface ReassessmentEventInput {
  reason: ReassessmentReason
  previousScoreSnapshotId?: string | null
  newScoreSnapshotId?: string | null
  scoreDelta?: number | null
  note?: string | null
  storageMode?: RetentionStorageMode
}

export function createReassessmentEvent(input: ReassessmentEventInput): ReassessmentEvent {
  return {
    id: genId('reassess'),
    createdAt: nowIso(),
    storageMode: input.storageMode ?? 'local_device',
    reason: input.reason,
    previousScoreSnapshotId: input.previousScoreSnapshotId ?? null,
    newScoreSnapshotId: input.newScoreSnapshotId ?? null,
    scoreDelta: input.scoreDelta ?? null,
    note: input.note ?? null,
  }
}

export interface ActionProgressInput {
  completedActionIds: string[]
  totalActions?: number | null
  source?: string | null
  storageMode?: RetentionStorageMode
}

export function createActionProgressSnapshot(input: ActionProgressInput): ActionProgressSnapshot {
  const ids = [...(input.completedActionIds ?? [])]
  return {
    id: genId('actions'),
    createdAt: nowIso(),
    storageMode: input.storageMode ?? 'local_device',
    completedActionIds: ids,
    completedCount: ids.length,
    totalActions: input.totalActions ?? null,
    source: input.source ?? null,
  }
}

export function createEmptyMetrixHistoryState(
  storageMode: RetentionStorageMode = 'local_device',
): MetrixHistoryState {
  return {
    version: 1,
    storageMode,
    updatedAt: nowIso(),
    scoreSnapshots: [],
    profileSnapshots: [],
    reassessmentEvents: [],
    actionProgressSnapshots: [],
    kpiSnapshots: [],
    reminderEvents: [],
  }
}

// ── Immutable state updates ───────────────────────────────────────────────────
export function addScoreSnapshot(
  state: MetrixHistoryState,
  snapshot: MetrixScoreSnapshot,
): MetrixHistoryState {
  return { ...state, scoreSnapshots: [...state.scoreSnapshots, snapshot], updatedAt: nowIso() }
}

export function addReassessmentEvent(
  state: MetrixHistoryState,
  event: ReassessmentEvent,
): MetrixHistoryState {
  return { ...state, reassessmentEvents: [...state.reassessmentEvents, event], updatedAt: nowIso() }
}

export function addActionProgressSnapshot(
  state: MetrixHistoryState,
  snapshot: ActionProgressSnapshot,
): MetrixHistoryState {
  return {
    ...state,
    actionProgressSnapshots: [...state.actionProgressSnapshots, snapshot],
    updatedAt: nowIso(),
  }
}

export function addManualKpiSnapshot(
  state: MetrixHistoryState,
  snapshot: ManualKpiSnapshot,
): MetrixHistoryState {
  return { ...state, kpiSnapshots: [...state.kpiSnapshots, snapshot], updatedAt: nowIso() }
}

// ── Queries / deltas ──────────────────────────────────────────────────────────
export function getLatestScoreSnapshot(state: MetrixHistoryState): MetrixScoreSnapshot | null {
  return sortByCreatedDesc(state.scoreSnapshots)[0] ?? null
}

export function getPreviousScoreSnapshot(state: MetrixHistoryState): MetrixScoreSnapshot | null {
  return sortByCreatedDesc(state.scoreSnapshots)[1] ?? null
}

export function calculateScoreDelta(
  previous: MetrixScoreSnapshot | null,
  next: MetrixScoreSnapshot | null,
): number | null {
  if (!previous || !next) return null
  return next.overall - previous.overall
}

export interface CategoryDelta {
  category: MetrixCategory
  previous: number | null
  current: number
  delta: number | null
}

export function calculateCategoryDeltas(
  previous: MetrixScoreSnapshot | null,
  next: MetrixScoreSnapshot,
): CategoryDelta[] {
  return next.categories.map(c => {
    const prior = previous?.categories.find(p => p.category === c.category)
    return {
      category: c.category,
      previous: prior ? prior.score : null,
      current: c.score,
      delta: prior ? c.score - prior.score : null,
    }
  })
}

export interface MetrixHistorySummary {
  storageMode: RetentionStorageMode
  scoreSnapshotCount: number
  reassessmentCount: number
  firstAssessedAt: string | null
  lastAssessedAt: string | null
  latestOverall: number | null
  previousOverall: number | null
  scoreDelta: number | null
  totalCompletedActions: number
}

export function getHistorySummary(state: MetrixHistoryState): MetrixHistorySummary {
  const ordered = sortByCreatedDesc(state.scoreSnapshots)
  const latest = ordered[0] ?? null
  const previous = ordered[1] ?? null
  const oldest = ordered[ordered.length - 1] ?? null
  const latestActions = sortByCreatedDesc(state.actionProgressSnapshots)[0] ?? null

  return {
    storageMode: state.storageMode,
    scoreSnapshotCount: state.scoreSnapshots.length,
    reassessmentCount: state.reassessmentEvents.length,
    firstAssessedAt: oldest ? oldest.createdAt : null,
    lastAssessedAt: latest ? latest.createdAt : null,
    latestOverall: latest ? latest.overall : null,
    previousOverall: previous ? previous.overall : null,
    scoreDelta: calculateScoreDelta(previous, latest),
    totalCompletedActions: latestActions ? latestActions.completedCount : 0,
  }
}
