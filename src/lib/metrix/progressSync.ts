// ─────────────────────────────────────────────────────────────────────────────
// metrix/progressSync — cloud-sync contract + reconciliation for priority progress (SZM-2E)
// ─────────────────────────────────────────────────────────────────────────────
// TRUTHFUL by construction. There is NO proven `cloud_sync_priority_progress` table in the
// confirmed schema (migration 002 has 10 cloud_sync_* tables; none for priority progress),
// so canonical cloud storage for this entity is NOT supported yet. This module therefore:
//   • reports an honest sync status (never 'synced_to_account', because no confirmed write
//     path exists); signed-in users see 'sync_unavailable', not a fake success;
//   • provides a typed, tested reconciler ready for when a real table is wired.
// It performs NO network writes and invents NO tables/columns. Wiring requires a future
// `cloud_sync_priority_progress` migration + a write helper (out of scope here).
// ─────────────────────────────────────────────────────────────────────────────

import { getBrowserSupabase, isSupabaseConfigured } from '../supabaseClient'
import { getCurrentAccountUser } from '../accountAuth'
import type { SyncStatus } from '../syncContracts'
import type { PersistedPriorityProgress } from './progressRecord'

// No confirmed cloud table for priority progress → cloud writes are NOT wired.
export const PRIORITY_PROGRESS_CLOUD_WIRED = false

export interface PriorityProgressSyncReadiness {
  status: SyncStatus
  canSync: boolean
  signedIn: boolean
  supabaseAvailable: boolean
  cloudWired: boolean
}

/**
 * Honest readiness without attempting a write. Never reports 'synced_to_account' — there is
 * no confirmed table, so the best a signed-in user gets is 'sync_unavailable' (local intact).
 */
export async function getPriorityProgressSyncReadiness(): Promise<PriorityProgressSyncReadiness> {
  const supabaseAvailable = isSupabaseConfigured() && getBrowserSupabase() !== null
  if (!supabaseAvailable) {
    return { status: 'saved_on_device', canSync: false, signedIn: false, supabaseAvailable: false, cloudWired: false }
  }
  const user = await getCurrentAccountUser()
  if (!user) {
    return { status: 'sign_in_to_back_up', canSync: false, signedIn: false, supabaseAvailable: true, cloudWired: false }
  }
  // Signed in, Supabase available — but no proven priority-progress table exists.
  return { status: 'sync_unavailable', canSync: false, signedIn: true, supabaseAvailable: true, cloudWired: false }
}

// ── Reconciliation (pure; ready for when cloud is wired) ────────────────────────
export type ProgressReconcileAction = 'no_account' | 'adopted_account' | 'kept_local' | 'merged' | 'kept_local_conflict'

export interface ProgressReconcileResult {
  resolved: PersistedPriorityProgress | null
  action: ProgressReconcileAction
  reason: string
  conflicts: string[]
}

function timeOf(r: PersistedPriorityProgress): number {
  const t = Date.parse(r.updatedAt)
  return Number.isNaN(t) ? 0 : t
}
function sameIdentity(a: PersistedPriorityProgress, b: PersistedPriorityProgress): boolean {
  return a.profileId === b.profileId && a.priorityId === b.priorityId
}

/**
 * Merge anonymous (local) and account progress by profile/priority identity:
 *   • union valid completed steps (never lose completion);
 *   • keep the NEWEST valid path selection;
 *   • never overwrite newer/more-complete progress with older data;
 *   • preserve provenance and return an explicit result.
 */
export function reconcilePriorityProgress(
  local: PersistedPriorityProgress | null,
  account: PersistedPriorityProgress | null,
): ProgressReconcileResult {
  if (!account) return { resolved: local, action: 'no_account', reason: 'No account progress to reconcile.', conflicts: [] }
  if (!local) return { resolved: { ...account, source: 'account' }, action: 'adopted_account', reason: 'No local progress; adopted account copy.', conflicts: [] }
  if (!sameIdentity(local, account)) {
    return { resolved: local, action: 'kept_local_conflict', reason: 'Account progress is for a different priority; kept local.', conflicts: ['identity_mismatch'] }
  }

  const completedStepIds = Array.from(new Set([...local.completedStepIds, ...account.completedStepIds]))
  const newer = timeOf(account) > timeOf(local) ? account : local
  const conflicts: string[] = []
  if (local.selectedPathId !== account.selectedPathId) conflicts.push('path_selection_differs')

  const evidenceStates: Record<string, import('./progressRecord').EvidenceState> = { ...local.evidenceStates }
  for (const [k, v] of Object.entries(account.evidenceStates)) {
    if (v === 'provided') evidenceStates[k] = 'provided'        // "provided" wins (more complete)
    else if (!(k in evidenceStates)) evidenceStates[k] = v
  }

  const resolved: PersistedPriorityProgress = {
    ...newer,
    completedStepIds,                                            // union — never lose completion
    selectedPathId: newer.selectedPathId,                       // newest valid selection
    evidenceStates,
    startedAt: [local.startedAt, account.startedAt].filter(Boolean).sort()[0] ?? newer.startedAt,
    completedAt: local.completedAt ?? account.completedAt ?? null,
    updatedAt: timeOf(local) >= timeOf(account) ? local.updatedAt : account.updatedAt,
    source: 'account',
  }
  return { resolved, action: 'merged', reason: 'Merged local + account progress (union of completed steps, newest selection).', conflicts }
}
