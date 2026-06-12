// ─────────────────────────────────────────────────────────────────────────────
// MetrixCloudSchema — account/cloud schema + local→cloud mappers (Mega-Phase 3)
// ─────────────────────────────────────────────────────────────────────────────
// CLOUD-READY FOUNDATION ONLY. This file defines what account-synced retention
// data WILL look like and how to shape local-device models into account payloads.
//
// It does NOT:
//   • write to any database,
//   • import the Supabase client,
//   • implement auth,
//   • claim cloud sync is active.
//
// There is no auth/session in the app yet, so nothing here is persisted. These are
// pure types + pure transforms used to prepare data the day account sync ships.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  MetrixProfileSnapshot,
  MetrixScoreSnapshot,
  ActionProgressSnapshot,
  ReassessmentEvent,
} from './metrixHistory'
import type { ManualKpiSnapshot } from './metrixKpis'
import type { ReminderPreference } from './metrixReminders'

// ── Table names (future Supabase tables; not created yet) ─────────────────────
export const METRIX_CLOUD_TABLES = {
  profiles: 'metrix_profiles',
  scoreSnapshots: 'metrix_score_snapshots',
  actionProgress: 'metrix_action_progress',
  reassessmentEvents: 'metrix_reassessment_events',
  kpiSnapshots: 'metrix_kpi_snapshots',
  reminderPreferences: 'metrix_reminder_preferences',
} as const

export type MetrixCloudTable = (typeof METRIX_CLOUD_TABLES)[keyof typeof METRIX_CLOUD_TABLES]

// ── Storage status ────────────────────────────────────────────────────────────
// local_only  → device-only (today's reality for every user)
// cloud_ready → a payload has been shaped for sync but not yet written
// synced      → confirmed written to the account (future)
// sync_error  → a sync attempt failed (future)
export type CloudStorageStatus = 'local_only' | 'cloud_ready' | 'synced' | 'sync_error'

// ── Account record base ───────────────────────────────────────────────────────
// Every account record links to a future auth user and keeps the local id as an
// idempotency key so a local snapshot maps to exactly one cloud row.
export interface AccountRecordBase {
  accountUserId: string        // future auth.users id (RLS owner)
  clientId: string             // the originating local snapshot/event id
  storageStatus: CloudStorageStatus
  createdAt: string            // original local createdAt (ISO)
  updatedAt: string            // when this payload was last shaped (ISO)
  syncedAt: string | null      // set only after a confirmed write (future)
}

export interface AccountMetrixProfile extends AccountRecordBase {
  trade: string | null
  region: string | null
  businessStage: string | null
  yearsInBusiness: string | null
  revenueRange: string | null
  teamSize: string | null
  mainGoal: string | null
  biggestChallenge: string | null
  confidence: string | null
  profileCompletion: number | null
}

export interface AccountScoreSnapshot extends AccountRecordBase {
  source: string
  overall: number
  categories: { category: string; score: number }[]
  riskLevel: string | null
  riskLabel: string | null
  profileCompletion: number | null
  trade: string | null
  region: string | null
  businessStage: string | null
  mainGoal: string | null
  biggestChallenge: string | null
  assessedAt: string
}

export interface AccountActionProgress extends AccountRecordBase {
  completedActionIds: string[]
  completedCount: number
  totalActions: number | null
  source: string | null
  recordedAt: string
}

export interface AccountReassessmentEvent extends AccountRecordBase {
  reason: string
  previousScoreSnapshotId: string | null
  newScoreSnapshotId: string | null
  scoreDelta: number | null
  note: string | null
  occurredAt: string
}

export interface AccountManualKpiSnapshot extends AccountRecordBase {
  periodLabel: string | null
  values: Record<string, number>
  note: string | null
  recordedAt: string
}

export interface AccountReminderPreference extends AccountRecordBase {
  type: string
  enabled: boolean
  cadence: string
  priority: string
}

// ── Copy constants (honest, future-facing) ────────────────────────────────────
export const CLOUD_SYNC_COPY = {
  savedOnDevice: 'Saved on this device.',
  accountSyncAvailableWhenSignedIn: 'Account sync available when signed in.',
  crossDeviceRequiresAccount: 'Cross-device history requires account access.',
  cloudSyncComingOnline: 'Cloud sync coming online.',
} as const

// ── Internal utilities ────────────────────────────────────────────────────────
function nowIso(): string {
  return new Date().toISOString()
}

function baseFor(accountUserId: string, clientId: string, createdAt: string): AccountRecordBase {
  return {
    accountUserId,
    clientId,
    storageStatus: 'cloud_ready',
    createdAt,
    updatedAt: nowIso(),
    syncedAt: null,
  }
}

// ── Local → cloud mappers (pure transforms; no writes) ────────────────────────
export function mapProfileToCloud(
  profile: MetrixProfileSnapshot,
  accountUserId: string,
): AccountMetrixProfile {
  return {
    ...baseFor(accountUserId, profile.id, profile.createdAt),
    trade: profile.trade,
    region: profile.region,
    businessStage: profile.businessStage ?? null,
    yearsInBusiness: profile.yearsInBusiness,
    revenueRange: profile.revenueRange,
    teamSize: profile.teamSize,
    mainGoal: profile.mainGoal,
    biggestChallenge: profile.biggestChallenge,
    confidence: profile.confidence,
    profileCompletion: profile.profileCompletion,
  }
}

export function mapScoreSnapshotToCloud(
  snapshot: MetrixScoreSnapshot,
  accountUserId: string,
): AccountScoreSnapshot {
  return {
    ...baseFor(accountUserId, snapshot.id, snapshot.createdAt),
    source: snapshot.source,
    overall: snapshot.overall,
    categories: snapshot.categories.map(c => ({ category: c.category, score: c.score })),
    riskLevel: snapshot.riskLevel,
    riskLabel: snapshot.riskLabel,
    profileCompletion: snapshot.profileCompletion,
    trade: snapshot.trade,
    region: snapshot.region,
    businessStage: snapshot.businessStage ?? null,
    mainGoal: snapshot.mainGoal,
    biggestChallenge: snapshot.biggestChallenge,
    assessedAt: snapshot.createdAt,
  }
}

export function mapActionProgressToCloud(
  snapshot: ActionProgressSnapshot,
  accountUserId: string,
): AccountActionProgress {
  return {
    ...baseFor(accountUserId, snapshot.id, snapshot.createdAt),
    completedActionIds: [...snapshot.completedActionIds],
    completedCount: snapshot.completedCount,
    totalActions: snapshot.totalActions,
    source: snapshot.source,
    recordedAt: snapshot.createdAt,
  }
}

export function mapReassessmentToCloud(
  event: ReassessmentEvent,
  accountUserId: string,
): AccountReassessmentEvent {
  return {
    ...baseFor(accountUserId, event.id, event.createdAt),
    reason: event.reason,
    previousScoreSnapshotId: event.previousScoreSnapshotId,
    newScoreSnapshotId: event.newScoreSnapshotId,
    scoreDelta: event.scoreDelta,
    note: event.note,
    occurredAt: event.createdAt,
  }
}

export function mapManualKpiToCloud(
  snapshot: ManualKpiSnapshot,
  accountUserId: string,
): AccountManualKpiSnapshot {
  const values: Record<string, number> = {}
  for (const [key, value] of Object.entries(snapshot.values)) {
    if (typeof value === 'number') values[key] = value
  }
  return {
    ...baseFor(accountUserId, snapshot.id, snapshot.createdAt),
    periodLabel: snapshot.periodLabel,
    values,
    note: snapshot.note,
    recordedAt: snapshot.createdAt,
  }
}

export function mapReminderPreferenceToCloud(
  pref: ReminderPreference,
  accountUserId: string,
): AccountReminderPreference {
  return {
    ...baseFor(accountUserId, `pref_${pref.type}`, nowIso()),
    type: pref.type,
    enabled: pref.enabled,
    cadence: pref.cadence,
    priority: pref.priority,
  }
}
