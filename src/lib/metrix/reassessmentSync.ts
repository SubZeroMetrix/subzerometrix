// ─────────────────────────────────────────────────────────────────────────────
// metrix/reassessmentSync — cloud-sync activation for reassessment history (SZM Wave 1)
// ─────────────────────────────────────────────────────────────────────────────
// Backs up the bounded device-local reassessment history (ReassessmentRecord[]) to the
// account-owned, RLS-protected `cloud_sync_reassessment_history` table (migration 004), and
// reads it back for cross-device continuity. Same honesty + safety model as progressSync:
//   • 'synced_to_account' only after a confirmed write; local stays authoritative;
//   • signed out → 'sign_in_to_back_up'; not configured → 'saved_on_device'; error/missing
//     table / offline → 'sync_unavailable';
//   • upsert by (user_id, local_id=record.id) → idempotent, never duplicates;
//   • anon client + session JWT (RLS-enforced); never the service-role key; SSR/build safe.
// ─────────────────────────────────────────────────────────────────────────────

import { getBrowserSupabase, isSupabaseConfigured } from '../supabaseClient'
import { getCurrentAccountUser } from '../accountAuth'
import type { SyncStatus } from '../syncContracts'
import type { ReassessmentRecord, ReassessmentTrigger } from './reassessment'
import {
  type ProgressSyncClient, type ProgressSyncUser, type ProgressSyncDeps,
} from './progressSync'

export const REASSESSMENT_CLOUD_WIRED = true
export const REASSESSMENT_TABLE = 'cloud_sync_reassessment_history'

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

function reassessmentRow(r: ReassessmentRecord, userId: string, now: string): Record<string, unknown> {
  return {
    user_id: userId,
    local_id: r.id,
    sync_source: 'account',
    profile_id: r.profileId,
    trigger: r.trigger,
    previous_overall: r.previousOverall,
    new_overall: r.newOverall,
    score_delta: r.scoreDelta,
    previous_priority_id: r.previousPriorityId,
    new_priority_id: r.newPriorityId,
    priority_changed: r.priorityChanged,
    reassessed_at: r.reassessedAt,
    schema_version: r.schemaVersion,
    payload: r,
    updated_at: now,
  }
}

function coerceReassessment(payload: unknown): ReassessmentRecord | null {
  if (!payload || typeof payload !== 'object') return null
  const p = payload as Partial<ReassessmentRecord>
  if (typeof p.id !== 'string' || typeof p.profileId !== 'string') return null
  return {
    id: p.id,
    reassessedAt: typeof p.reassessedAt === 'string' ? p.reassessedAt : nowIso(),
    profileId: p.profileId,
    trigger: (p.trigger ?? 'profile_change') as ReassessmentTrigger,
    previousOverall: typeof p.previousOverall === 'number' ? p.previousOverall : 0,
    newOverall: typeof p.newOverall === 'number' ? p.newOverall : 0,
    scoreDelta: typeof p.scoreDelta === 'number' ? p.scoreDelta : 0,
    previousPriorityId: p.previousPriorityId ?? '',
    newPriorityId: p.newPriorityId ?? '',
    priorityChanged: p.priorityChanged === true,
    newlyTriggeredGateIds: Array.isArray(p.newlyTriggeredGateIds) ? p.newlyTriggeredGateIds : [],
    newlyClearedGateIds: Array.isArray(p.newlyClearedGateIds) ? p.newlyClearedGateIds : [],
    schemaVersion: typeof p.schemaVersion === 'number' ? p.schemaVersion : 1,
  }
}

async function resolveDeps(deps: ProgressSyncDeps): Promise<{ supabase: ProgressSyncClient | null; user: ProgressSyncUser | null }> {
  const supabase = (deps.supabase ?? (isSupabaseConfigured() ? (getBrowserSupabase() as unknown as ProgressSyncClient | null) : null)) ?? null
  if (!supabase) return { supabase: null, user: null }
  const user = deps.user ?? (await getCurrentAccountUser())
  return { supabase, user: user ?? null }
}

export interface ReassessmentSyncResult {
  status: SyncStatus
  written: number
  lastSyncedAt: string | null
  error?: string
}

/**
 * Back up reassessment history records to the account. Upserts by (user_id, local_id) so a
 * re-sync REPLACES rather than duplicates. Returns 'synced_to_account' only after a confirmed
 * write; never deletes/mutates local data.
 */
export async function syncReassessmentHistoryToAccount(
  records: ReassessmentRecord[],
  deps: ProgressSyncDeps = {},
): Promise<ReassessmentSyncResult> {
  const now = deps.now ?? nowIso()
  const base: ReassessmentSyncResult = { status: 'saved_on_device', written: 0, lastSyncedAt: null }

  const { supabase, user } = await resolveDeps(deps)
  if (!supabase) return base
  if (!user) return { ...base, status: 'sign_in_to_back_up' }

  const rows = (Array.isArray(records) ? records : []).filter(r => r && typeof r.id === 'string')
  if (rows.length === 0) return { ...base, status: 'saved_on_device' }

  try {
    const { error } = await supabase
      .from(REASSESSMENT_TABLE)
      .upsert(rows.map(r => reassessmentRow(r, user.id, now)), { onConflict: 'user_id,local_id' })
    if (error) return { ...base, status: 'sync_unavailable', error: error.message }
  } catch (e) {
    return { ...base, status: 'sync_unavailable', error: messageOf(e) }
  }

  return { status: 'synced_to_account', written: rows.length, lastSyncedAt: now }
}

/** Read the user's reassessment history back from the account (read-only). */
export async function loadReassessmentHistoryFromAccount(deps: ProgressSyncDeps = {}): Promise<ReassessmentRecord[]> {
  const { supabase, user } = await resolveDeps(deps)
  if (!supabase || !user) return []
  try {
    const { data, error } = await supabase.from(REASSESSMENT_TABLE).select('payload').eq('user_id', user.id)
    if (error || !data) return []
    return data
      .map(r => coerceReassessment((r as { payload?: unknown }).payload))
      .filter((r): r is ReassessmentRecord => r !== null)
  } catch {
    return []
  }
}
