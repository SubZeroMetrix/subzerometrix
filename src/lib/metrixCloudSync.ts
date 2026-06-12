// ─────────────────────────────────────────────────────────────────────────────
// metrixCloudSync — REAL account upserts for Metrix retention (Mega-Phase 3C)
// ─────────────────────────────────────────────────────────────────────────────
// Writes local retention history to the per-user metrix_* tables (see
// supabase/migrations/001_metrix_account_sync.sql) when, and only when, a real
// account user is signed in. RLS enforces ownership; writes go through the anon
// client + the user's session JWT (never the service-role key).
//
// HONESTY GUARANTEES
//   • Never throws during SSR/build (browser client is null on the server).
//   • Returns honest statuses; never claims 'synced' unless a write succeeded.
//   • If the tables are not applied yet, returns 'migration_required'.
//   • Never deletes local data. Row presence in the table IS the synced state
//     (the local model has no per-row sync flag yet — documented in the plan).
// ─────────────────────────────────────────────────────────────────────────────

import { getBrowserSupabase } from './supabaseClient'
import { getCurrentAccountUser } from './accountAuth'
import { METRIX_CLOUD_TABLES } from './metrixCloudSchema'
import { loadLocalMetrixHistory } from './metrixStorage'
import type {
  MetrixProfileSnapshot,
  MetrixScoreSnapshot,
  ActionProgressSnapshot,
  ReassessmentEvent,
} from './metrixHistory'
import type { ManualKpiSnapshot } from './metrixKpis'
import type { ReminderPreference } from './metrixReminders'

export type CloudSyncStatus =
  | 'unavailable'        // no browser Supabase client (server, missing env)
  | 'signed_out'         // no signed-in account user
  | 'no_local_history'   // nothing to sync
  | 'migration_required' // target table does not exist yet
  | 'synced'             // confirmed write
  | 'partial_error'      // some parts synced, some failed
  | 'error'              // write failed

export interface CloudSyncResult {
  status: CloudSyncStatus
  written: number
  total: number
  error?: string
}

export type CloudSyncReadiness = 'unavailable' | 'signed_out' | 'ready'

// Last status surfaced to UI (sync read). Honest: starts null until a sync runs.
let lastStatus: CloudSyncStatus | null = null
export function getLastCloudSyncStatus(): CloudSyncStatus | null {
  return lastStatus
}
function remember(result: CloudSyncResult): CloudSyncResult {
  lastStatus = result.status
  return result
}

function nowIso(): string {
  return new Date().toISOString()
}

async function resolveContext(): Promise<{ ok: true; userId: string } | { ok: false; status: CloudSyncStatus }> {
  const supabase = getBrowserSupabase()
  if (!supabase) return { ok: false, status: 'unavailable' }
  const user = await getCurrentAccountUser()
  if (!user) return { ok: false, status: 'signed_out' }
  return { ok: true, userId: user.id }
}

function messageOf(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const m = (err as { message?: unknown }).message
    if (typeof m === 'string') return m
  }
  return 'Unknown error'
}

// Classify a Postgrest error: a missing table → migration_required, else error.
function classifyError(err: { code?: string; message?: string } | null, total: number): CloudSyncResult {
  const code = err?.code ?? ''
  const message = err?.message ?? ''
  if (code === '42P01' || /does not exist|schema cache|could not find the table|find the table/i.test(message)) {
    return { status: 'migration_required', written: 0, total, error: message }
  }
  return { status: 'error', written: 0, total, error: message }
}

// Generic upsert of pre-built rows into a table, conflict on (account_user_id, client_id).
async function upsertRows(table: string, rows: Record<string, unknown>[], total: number): Promise<CloudSyncResult> {
  if (rows.length === 0) return { status: 'no_local_history', written: 0, total: 0 }
  const supabase = getBrowserSupabase()
  if (!supabase) return { status: 'unavailable', written: 0, total }
  try {
    const { error } = await supabase
      .from(table)
      .upsert(rows, { onConflict: 'account_user_id,client_id' })
    if (error) return classifyError(error, total)
    return { status: 'synced', written: rows.length, total }
  } catch (e) {
    return { status: 'error', written: 0, total, error: messageOf(e) }
  }
}

// ── Row builders (snake_case; match the migration columns) ────────────────────
function profileRow(p: MetrixProfileSnapshot, userId: string): Record<string, unknown> {
  return {
    account_user_id: userId,
    client_id: p.id,
    trade: p.trade,
    region: p.region,
    business_stage: p.businessStage ?? null,
    years_in_business: p.yearsInBusiness,
    revenue_range: p.revenueRange,
    team_size: p.teamSize,
    main_goal: p.mainGoal,
    biggest_challenge: p.biggestChallenge,
    confidence: p.confidence,
    profile_completion: p.profileCompletion,
    created_at: p.createdAt,
    updated_at: nowIso(),
  }
}

function scoreRow(s: MetrixScoreSnapshot, userId: string): Record<string, unknown> {
  return {
    account_user_id: userId,
    client_id: s.id,
    source: s.source,
    overall: s.overall,
    categories: s.categories,
    risk_level: s.riskLevel,
    risk_label: s.riskLabel,
    profile_completion: s.profileCompletion,
    trade: s.trade,
    region: s.region,
    business_stage: s.businessStage ?? null,
    main_goal: s.mainGoal,
    biggest_challenge: s.biggestChallenge,
    assessed_at: s.createdAt,
    created_at: s.createdAt,
    updated_at: nowIso(),
  }
}

function actionRow(a: ActionProgressSnapshot, userId: string): Record<string, unknown> {
  return {
    account_user_id: userId,
    client_id: a.id,
    completed_action_ids: a.completedActionIds,
    completed_count: a.completedCount,
    total_actions: a.totalActions,
    source: a.source,
    recorded_at: a.createdAt,
    created_at: a.createdAt,
    updated_at: nowIso(),
  }
}

function reassessmentRow(e: ReassessmentEvent, userId: string): Record<string, unknown> {
  return {
    account_user_id: userId,
    client_id: e.id,
    reason: e.reason,
    previous_score_snapshot_id: e.previousScoreSnapshotId,
    new_score_snapshot_id: e.newScoreSnapshotId,
    score_delta: e.scoreDelta,
    note: e.note,
    occurred_at: e.createdAt,
    created_at: e.createdAt,
    updated_at: nowIso(),
  }
}

function kpiRow(k: ManualKpiSnapshot, userId: string): Record<string, unknown> {
  const values: Record<string, number> = {}
  for (const [key, value] of Object.entries(k.values)) {
    if (typeof value === 'number') values[key] = value
  }
  return {
    account_user_id: userId,
    client_id: k.id,
    period_label: k.periodLabel,
    values,
    note: k.note,
    recorded_at: k.createdAt,
    created_at: k.createdAt,
    updated_at: nowIso(),
  }
}

function reminderPrefRow(r: ReminderPreference, userId: string): Record<string, unknown> {
  return {
    account_user_id: userId,
    client_id: `pref_${r.type}`,
    type: r.type,
    enabled: r.enabled,
    cadence: r.cadence,
    priority: r.priority,
    updated_at: nowIso(),
  }
}

// ── Per-table sync functions ──────────────────────────────────────────────────
export async function syncMetrixProfileToAccount(profile: MetrixProfileSnapshot | null): Promise<CloudSyncResult> {
  const ctx = await resolveContext()
  if (!ctx.ok) return remember({ status: ctx.status, written: 0, total: profile ? 1 : 0 })
  if (!profile) return remember({ status: 'no_local_history', written: 0, total: 0 })
  return remember(await upsertRows(METRIX_CLOUD_TABLES.profiles, [profileRow(profile, ctx.userId)], 1))
}

export async function syncScoreSnapshotsToAccount(snapshots: MetrixScoreSnapshot[]): Promise<CloudSyncResult> {
  const ctx = await resolveContext()
  if (!ctx.ok) return remember({ status: ctx.status, written: 0, total: snapshots.length })
  return remember(await upsertRows(METRIX_CLOUD_TABLES.scoreSnapshots, snapshots.map(s => scoreRow(s, ctx.userId)), snapshots.length))
}

export async function syncActionProgressToAccount(snapshots: ActionProgressSnapshot[]): Promise<CloudSyncResult> {
  const ctx = await resolveContext()
  if (!ctx.ok) return remember({ status: ctx.status, written: 0, total: snapshots.length })
  return remember(await upsertRows(METRIX_CLOUD_TABLES.actionProgress, snapshots.map(a => actionRow(a, ctx.userId)), snapshots.length))
}

export async function syncReassessmentEventsToAccount(events: ReassessmentEvent[]): Promise<CloudSyncResult> {
  const ctx = await resolveContext()
  if (!ctx.ok) return remember({ status: ctx.status, written: 0, total: events.length })
  return remember(await upsertRows(METRIX_CLOUD_TABLES.reassessmentEvents, events.map(e => reassessmentRow(e, ctx.userId)), events.length))
}

export async function syncManualKpisToAccount(snapshots: ManualKpiSnapshot[]): Promise<CloudSyncResult> {
  const ctx = await resolveContext()
  if (!ctx.ok) return remember({ status: ctx.status, written: 0, total: snapshots.length })
  return remember(await upsertRows(METRIX_CLOUD_TABLES.kpiSnapshots, snapshots.map(k => kpiRow(k, ctx.userId)), snapshots.length))
}

export async function syncReminderPreferencesToAccount(prefs: ReminderPreference[]): Promise<CloudSyncResult> {
  const ctx = await resolveContext()
  if (!ctx.ok) return remember({ status: ctx.status, written: 0, total: prefs.length })
  return remember(await upsertRows(METRIX_CLOUD_TABLES.reminderPreferences, prefs.map(p => reminderPrefRow(p, ctx.userId)), prefs.length))
}

// ── Readiness + whole-history adoption ────────────────────────────────────────
export async function getCloudSyncReadiness(): Promise<CloudSyncReadiness> {
  const supabase = getBrowserSupabase()
  if (!supabase) return 'unavailable'
  const user = await getCurrentAccountUser()
  return user ? 'ready' : 'signed_out'
}

export interface AdoptionSummary {
  status: CloudSyncStatus
  totalWritten: number
  parts: Record<string, CloudSyncResult>
}

/**
 * One-time local→cloud adoption: push the device's full MetrixHistory into the
 * account. Idempotent (upsert on client_id). Does NOT delete or alter local data.
 * Returns 'signed_out' / 'unavailable' / 'no_local_history' / 'migration_required'
 * honestly; 'synced' only when every part wrote successfully.
 */
export async function adoptLocalMetrixHistoryToAccount(
  reminderPrefs: ReminderPreference[] = [],
): Promise<AdoptionSummary> {
  const ctx = await resolveContext()
  if (!ctx.ok) {
    lastStatus = ctx.status
    return { status: ctx.status, totalWritten: 0, parts: {} }
  }

  const state = loadLocalMetrixHistory()
  const hasAnything = state
    ? state.scoreSnapshots.length > 0 ||
      state.profileSnapshots.length > 0 ||
      state.actionProgressSnapshots.length > 0 ||
      state.reassessmentEvents.length > 0 ||
      state.kpiSnapshots.length > 0
    : false
  if (!state || (!hasAnything && reminderPrefs.length === 0)) {
    lastStatus = 'no_local_history'
    return { status: 'no_local_history', totalWritten: 0, parts: {} }
  }

  const latestProfile = state.profileSnapshots.length > 0
    ? state.profileSnapshots[state.profileSnapshots.length - 1]
    : null

  const parts: Record<string, CloudSyncResult> = {
    profile: await syncMetrixProfileToAccount(latestProfile),
    scoreSnapshots: await syncScoreSnapshotsToAccount(state.scoreSnapshots),
    actionProgress: await syncActionProgressToAccount(state.actionProgressSnapshots),
    reassessmentEvents: await syncReassessmentEventsToAccount(state.reassessmentEvents),
    kpiSnapshots: await syncManualKpisToAccount(state.kpiSnapshots),
    reminderPreferences: await syncReminderPreferencesToAccount(reminderPrefs),
  }

  const results = Object.values(parts)
  const totalWritten = results.reduce((sum, r) => sum + r.written, 0)
  const statuses = results.map(r => r.status)

  let status: CloudSyncStatus
  if (statuses.includes('migration_required')) {
    status = 'migration_required'
  } else if (statuses.includes('error')) {
    status = totalWritten > 0 ? 'partial_error' : 'error'
  } else if (totalWritten > 0) {
    status = 'synced'
  } else {
    status = 'no_local_history'
  }

  lastStatus = status
  return { status, totalWritten, parts }
}
