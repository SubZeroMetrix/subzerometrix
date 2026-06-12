// ─────────────────────────────────────────────────────────────────────────────
// roadmapKpiSync — Account-2E: roadmap action progress + manual KPI sync
// ─────────────────────────────────────────────────────────────────────────────
// The SECOND active cloud-sync flow. It syncs ONLY two structured, low-risk,
// non-PII entities, following the same local-first, confirmed-write-only pattern as
// assessmentHistorySync (Account-2D):
//   • cloud_sync_roadmap_action_progress ← szm_path_complete (completed action ids)
//   • cloud_sync_kpi_entries             ← local ManualKpiSnapshot[] (user's own numbers)
// It does NOT sync customer feedback, partner interest, growth analytics, or Foundation
// Builder data, and it never syncs names/emails/phones/secrets/credentials.
//
// NOTE: KPI snapshots may carry a free-text `note`. It is the contractor's own private
// device-local note and is low-risk by design — users are guided not to put customer or
// private info there. No PII fields exist in either entity.
//
// HONESTY + SAFETY GUARANTEES (identical to Account-2D)
//   • SSR/build safe; the browser Supabase client is null on the server.
//   • Never throws into the UI for expected failures — returns an honest status.
//   • Never deletes or mutates local data. Local storage stays the source of truth.
//   • Returns 'synced_to_account' ONLY after a confirmed successful Supabase write.
//   • Signed out → 'sign_in_to_back_up' (or 'saved_on_device' when Supabase is not
//     configured). Missing table/migration or write failure → 'sync_unavailable',
//     local data intact.
//   • Writes use the anon client + the user's session JWT (RLS-enforced); the
//     service-role key is never used here.
// ─────────────────────────────────────────────────────────────────────────────

import { getBrowserSupabase, isSupabaseConfigured } from './supabaseClient'
import { getCurrentAccountUser } from './accountAuth'
import { loadLocalMetrixHistory } from './metrixStorage'
import { getCompletedActionIds } from './roadmapProgress'
import type { ManualKpiSnapshot } from './metrixKpis'
import type { SyncStatus } from './syncContracts'

// Only these two tables — structured, low-risk, non-PII.
const ROADMAP_TABLE = 'cloud_sync_roadmap_action_progress'
const KPI_TABLE = 'cloud_sync_kpi_entries'

// A stable local id for the single roadmap-progress row (upsert replaces, never dupes).
const ROADMAP_LOCAL_ID = 'roadmap_progress_current'

export type RoadmapKpiSyncStatus = SyncStatus

export interface RoadmapKpiSyncResult {
  status: RoadmapKpiSyncStatus
  roadmapWritten: number
  kpiWritten: number
  total: number
  lastSyncedAt: string | null
  error?: string
}

export interface RoadmapKpiSyncReadiness {
  status: RoadmapKpiSyncStatus // what to show before/without a write attempt
  canSync: boolean             // true only when supabase + a signed-in user exist
  signedIn: boolean
  supabaseAvailable: boolean
}

function nowIso(): string {
  return new Date().toISOString()
}

function messageOf(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const m = (err as { message?: unknown }).message
    if (typeof m === 'string') return m
  }
  return 'Unknown error'
}

function isMissingTable(err: { code?: string; message?: string } | null): boolean {
  const code = err?.code ?? ''
  const message = err?.message ?? ''
  return code === '42P01' || /does not exist|schema cache|could not find the table|find the table/i.test(message)
}

// Structured, non-PII payload: opaque completed-action ids + a count. No free text.
function roadmapRow(completedActionIds: string[], userId: string): Record<string, unknown> {
  return {
    user_id: userId,
    local_id: ROADMAP_LOCAL_ID,
    sync_source: 'account',
    payload: {
      completedActionIds,
      completedCount: completedActionIds.length,
      updatedAt: nowIso(),
      source: 'roadmap_progress',
    },
    updated_at: nowIso(),
  }
}

// KPI snapshot: the user's own numbers + an optional low-risk note. No PII fields.
function kpiRow(k: ManualKpiSnapshot, userId: string): Record<string, unknown> {
  return {
    user_id: userId,
    local_id: k.id,
    sync_source: 'account',
    payload: {
      id: k.id,
      createdAt: k.createdAt,
      periodLabel: k.periodLabel,
      values: k.values,
      note: k.note,
    },
    updated_at: nowIso(),
  }
}

interface UpsertOutcome {
  written: number
  missingTable: boolean
  error?: string
}

async function upsertRows(table: string, rows: Record<string, unknown>[]): Promise<UpsertOutcome> {
  if (rows.length === 0) return { written: 0, missingTable: false }
  const supabase = getBrowserSupabase()
  if (!supabase) return { written: 0, missingTable: false, error: 'Supabase unavailable' }
  try {
    const { error } = await supabase.from(table).upsert(rows, { onConflict: 'user_id,local_id' })
    if (error) {
      return { written: 0, missingTable: isMissingTable(error), error: error.message }
    }
    return { written: rows.length, missingTable: false }
  } catch (e) {
    return { written: 0, missingTable: false, error: messageOf(e) }
  }
}

/**
 * Honest readiness without attempting a write. Never throws; SSR-safe.
 */
export async function getRoadmapKpiSyncReadiness(): Promise<RoadmapKpiSyncReadiness> {
  const supabaseAvailable = isSupabaseConfigured() && getBrowserSupabase() !== null
  if (!supabaseAvailable) {
    return { status: 'saved_on_device', canSync: false, signedIn: false, supabaseAvailable: false }
  }
  const user = await getCurrentAccountUser()
  if (!user) {
    return { status: 'sign_in_to_back_up', canSync: false, signedIn: false, supabaseAvailable: true }
  }
  return { status: 'saved_on_device', canSync: true, signedIn: true, supabaseAvailable: true }
}

/**
 * Back up roadmap action progress + KPI entries to the account. Returns a confirmed
 * 'synced_to_account' ONLY when a write succeeded. Never deletes local data.
 */
export async function syncRoadmapKpiProgressToAccount(): Promise<RoadmapKpiSyncResult> {
  const base: RoadmapKpiSyncResult = {
    status: 'saved_on_device',
    roadmapWritten: 0,
    kpiWritten: 0,
    total: 0,
    lastSyncedAt: null,
  }

  const supabase = getBrowserSupabase()
  if (!supabase) return { ...base, status: 'saved_on_device' }

  const user = await getCurrentAccountUser()
  if (!user) return { ...base, status: 'sign_in_to_back_up' }

  const completedActionIds = getCompletedActionIds()
  const kpiSnapshots = loadLocalMetrixHistory()?.kpiSnapshots ?? []
  const roadmapRows = completedActionIds.length > 0 ? [roadmapRow(completedActionIds, user.id)] : []
  const total = roadmapRows.length + kpiSnapshots.length
  if (total === 0) {
    return { ...base, status: 'saved_on_device', total: 0 }
  }

  const roadmapOutcome = await upsertRows(ROADMAP_TABLE, roadmapRows)
  const kpiOutcome = await upsertRows(KPI_TABLE, kpiSnapshots.map(k => kpiRow(k, user.id)))

  const written = roadmapOutcome.written + kpiOutcome.written
  const missingTable = roadmapOutcome.missingTable || kpiOutcome.missingTable
  const error = roadmapOutcome.error ?? kpiOutcome.error

  if (missingTable || written === 0) {
    return { ...base, status: 'sync_unavailable', total, error }
  }

  return {
    status: 'synced_to_account',
    roadmapWritten: roadmapOutcome.written,
    kpiWritten: kpiOutcome.written,
    total,
    lastSyncedAt: nowIso(),
    error,
  }
}

export interface AccountRoadmapKpiProgress {
  roadmapProgress: unknown[]
  kpiEntries: unknown[]
}

/**
 * Read the user's synced roadmap progress + KPI entries back from the account (future
 * cross-device hydrate). Read-only; never writes or deletes. Returns empty arrays on any
 * expected failure (signed out, missing table, offline).
 */
export async function loadRoadmapKpiProgressFromAccount(): Promise<AccountRoadmapKpiProgress> {
  const empty: AccountRoadmapKpiProgress = { roadmapProgress: [], kpiEntries: [] }
  const supabase = getBrowserSupabase()
  if (!supabase) return empty
  const user = await getCurrentAccountUser()
  if (!user) return empty
  try {
    const [r, k] = await Promise.all([
      supabase.from(ROADMAP_TABLE).select('payload').eq('user_id', user.id),
      supabase.from(KPI_TABLE).select('payload').eq('user_id', user.id),
    ])
    return {
      roadmapProgress: r.error ? [] : (r.data ?? []).map(row => (row as { payload: unknown }).payload),
      kpiEntries: k.error ? [] : (k.data ?? []).map(row => (row as { payload: unknown }).payload),
    }
  } catch {
    return empty
  }
}

/** A non-scary, user-facing message for a given sync status. */
export function getRoadmapKpiSyncErrorMessage(status: RoadmapKpiSyncStatus): string | null {
  switch (status) {
    case 'sync_unavailable':
      return 'Account backup is not available right now. Your progress is still saved on this device.'
    case 'sign_in_to_back_up':
      return 'Your progress is saved on this device. Sign in later to back it up to your account.'
    case 'saved_on_device':
    case 'synced_to_account':
    default:
      return null
  }
}
