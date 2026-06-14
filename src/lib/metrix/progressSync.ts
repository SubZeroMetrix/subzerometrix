// ─────────────────────────────────────────────────────────────────────────────
// metrix/progressSync — cloud-sync activation + reconciliation for priority progress (SZM Wave 1)
// ─────────────────────────────────────────────────────────────────────────────
// TRUTHFUL by construction, now WIRED. Migration 004 adds the proven account-owned table
// `cloud_sync_priority_progress` (RLS owner-only), so this module:
//   • backs up the active local PersistedPriorityProgress to the user's account when
//     signed in, returning 'synced_to_account' ONLY after a confirmed Supabase write;
//   • reads it back for cross-device resume / sign-in adoption;
//   • reconciles local + account deterministically (union of completed steps, strongest
//     evidence, newest valid path, earliest start) so it never loses or stale-overwrites;
//   • stays local-first: signed out / offline / unavailable keep the device record intact
//     and report an honest status (saved_on_device / sign_in_to_back_up / sync_unavailable).
// Writes go through the browser anon client + the user's session JWT (RLS-enforced); the
// service-role key is NEVER used here. SSR/build safe (no client on the server).
// ─────────────────────────────────────────────────────────────────────────────

import { getBrowserSupabase, isSupabaseConfigured } from '../supabaseClient'
import { getCurrentAccountUser } from '../accountAuth'
import type { SyncStatus } from '../syncContracts'
import type { PersistedPriorityProgress, EvidenceState } from './progressRecord'

// Migration 004 created the proven table → cloud writes are wired.
export const PRIORITY_PROGRESS_CLOUD_WIRED = true
export const PRIORITY_PROGRESS_TABLE = 'cloud_sync_priority_progress'

// ── Minimal Supabase surface actually used here (the real client satisfies it
// structurally; tests inject a fake). Keeps the network glue testable without mocks. ──
export interface ProgressSyncQuery {
  upsert(rows: Record<string, unknown>[], opts: { onConflict: string }): Promise<{ error: { code?: string; message?: string } | null }>
  select(columns: string): { eq(column: string, value: string): Promise<{ data: Record<string, unknown>[] | null; error: { code?: string; message?: string } | null }> }
}
export interface ProgressSyncClient {
  from(table: string): ProgressSyncQuery
}
export interface ProgressSyncUser { id: string }
export interface ProgressSyncDeps {
  supabase?: ProgressSyncClient | null
  user?: ProgressSyncUser | null
  now?: string
}

export interface PriorityProgressSyncReadiness {
  status: SyncStatus
  canSync: boolean
  signedIn: boolean
  supabaseAvailable: boolean
  cloudWired: boolean
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
// A missing table / unapplied migration → treat as sync_unavailable (not a hard error).
function isMissingTable(err: { code?: string; message?: string } | null): boolean {
  const code = err?.code ?? ''
  const message = err?.message ?? ''
  return code === '42P01' || /does not exist|schema cache|could not find the table|find the table/i.test(message)
}

/** Stable cloud identity for a progress record (one row per profile+priority). */
export function progressLocalId(r: Pick<PersistedPriorityProgress, 'profileId' | 'priorityId'>): string {
  return `${r.profileId}::${r.priorityId}`
}

// Promote scalar columns + carry the full record in payload (preserving local shape/ids).
function progressRow(r: PersistedPriorityProgress, userId: string, now: string): Record<string, unknown> {
  return {
    user_id: userId,
    local_id: progressLocalId(r),
    sync_source: 'account',
    profile_id: r.profileId,
    priority_id: r.priorityId,
    selected_path_id: r.selectedPathId,
    status: r.status,
    completion_percent: r.completionPercent,
    reassessment_eligible: r.reassessmentEligible,
    schema_version: r.schemaVersion,
    ruleset_version: r.rulesetVersion,
    started_at: r.startedAt,
    completed_at: r.completedAt,
    record_updated_at: r.updatedAt,
    payload: r,
    updated_at: now,
  }
}

// Defensive coercion of a stored payload back into a record (malformed → null).
function coerceProgress(payload: unknown): PersistedPriorityProgress | null {
  if (!payload || typeof payload !== 'object') return null
  const p = payload as Partial<PersistedPriorityProgress>
  if (typeof p.profileId !== 'string' || typeof p.priorityId !== 'string') return null
  return {
    profileId: p.profileId,
    priorityId: p.priorityId,
    selectedPathId: p.selectedPathId ?? null,
    completedStepIds: Array.isArray(p.completedStepIds) ? p.completedStepIds : [],
    evidenceStates: (p.evidenceStates && typeof p.evidenceStates === 'object' ? p.evidenceStates : {}) as Record<string, EvidenceState>,
    status: p.status ?? 'not_started',
    completionPercent: typeof p.completionPercent === 'number' ? p.completionPercent : 0,
    startedAt: p.startedAt ?? null,
    updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : nowIso(),
    completedAt: p.completedAt ?? null,
    reassessmentEligible: p.reassessmentEligible === true,
    schemaVersion: typeof p.schemaVersion === 'number' ? p.schemaVersion : 1,
    rulesetVersion: typeof p.rulesetVersion === 'number' ? p.rulesetVersion : 0,
    source: 'account',
  }
}

/**
 * Honest readiness without attempting a write. Signed in + Supabase available → the badge
 * may show device-local until a confirmed write (canSync true). Never claims synced here.
 */
export async function getPriorityProgressSyncReadiness(deps: ProgressSyncDeps = {}): Promise<PriorityProgressSyncReadiness> {
  const supabase = deps.supabase ?? (isSupabaseConfigured() ? getBrowserSupabase() : null)
  if (!supabase) {
    return { status: 'saved_on_device', canSync: false, signedIn: false, supabaseAvailable: false, cloudWired: PRIORITY_PROGRESS_CLOUD_WIRED }
  }
  const user = deps.user ?? (await getCurrentAccountUser())
  if (!user) {
    return { status: 'sign_in_to_back_up', canSync: false, signedIn: false, supabaseAvailable: true, cloudWired: PRIORITY_PROGRESS_CLOUD_WIRED }
  }
  // Signed in + available: a backup is possible, but nothing is synced until a confirmed write.
  return { status: 'saved_on_device', canSync: true, signedIn: true, supabaseAvailable: true, cloudWired: PRIORITY_PROGRESS_CLOUD_WIRED }
}

// ── Reconciliation (pure) ───────────────────────────────────────────────────────
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
 *   • keep the NEWEST valid path selection; strongest ("provided") evidence wins;
 *   • earliest start date; never overwrite newer/more-complete progress with older data;
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

  const evidenceStates: Record<string, EvidenceState> = { ...local.evidenceStates }
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

// ── Cloud read/write (wired) ────────────────────────────────────────────────────
async function resolveDeps(deps: ProgressSyncDeps): Promise<{ supabase: ProgressSyncClient | null; user: ProgressSyncUser | null }> {
  const supabase = (deps.supabase ?? (isSupabaseConfigured() ? (getBrowserSupabase() as unknown as ProgressSyncClient | null) : null)) ?? null
  if (!supabase) return { supabase: null, user: null }
  const user = deps.user ?? (await getCurrentAccountUser())
  return { supabase, user: user ?? null }
}

/** Read the account record matching a local record's identity (RLS scopes to the user). */
async function readAccountProgress(
  supabase: ProgressSyncClient,
  userId: string,
  localId: string,
): Promise<PersistedPriorityProgress | null> {
  try {
    const { data, error } = await supabase.from(PRIORITY_PROGRESS_TABLE).select('local_id,payload').eq('user_id', userId)
    if (error || !data) return null
    const row = data.find(r => (r as { local_id?: string }).local_id === localId)
    return row ? coerceProgress((row as { payload?: unknown }).payload) : null
  } catch {
    return null
  }
}

export interface PriorityProgressSyncResult {
  status: SyncStatus
  written: number
  action: ProgressReconcileAction | 'none'
  conflicts: string[]
  lastSyncedAt: string | null
  error?: string
}

/**
 * Back up the active local progress record to the account. Reads any existing account row
 * first and reconciles (stale-overwrite protection + deterministic merge), then upserts by
 * (user_id, local_id) so a re-sync REPLACES rather than duplicates. Returns
 * 'synced_to_account' only after a confirmed write. Never deletes/mutates local data.
 */
export async function syncPriorityProgressToAccount(
  record: PersistedPriorityProgress,
  deps: ProgressSyncDeps = {},
): Promise<PriorityProgressSyncResult> {
  const now = deps.now ?? nowIso()
  const base: PriorityProgressSyncResult = { status: 'saved_on_device', written: 0, action: 'none', conflicts: [], lastSyncedAt: null }

  const { supabase, user } = await resolveDeps(deps)
  if (!supabase) return base                                  // not configured / server — local only
  if (!user) return { ...base, status: 'sign_in_to_back_up' }

  const localId = progressLocalId(record)
  const existing = await readAccountProgress(supabase, user.id, localId)
  const reconciled = reconcilePriorityProgress(record, existing)
  const toWrite = reconciled.resolved ?? record

  try {
    const { error } = await supabase
      .from(PRIORITY_PROGRESS_TABLE)
      .upsert([progressRow(toWrite, user.id, now)], { onConflict: 'user_id,local_id' })
    if (error) {
      // Missing table (migration 004 unapplied) or any write error → fail safe, keep local.
      void isMissingTable(error)
      return { ...base, status: 'sync_unavailable', error: error.message, conflicts: reconciled.conflicts }
    }
  } catch (e) {
    return { ...base, status: 'sync_unavailable', error: messageOf(e) }
  }

  return {
    status: 'synced_to_account',
    written: 1,
    action: existing ? reconciled.action : 'no_account',
    conflicts: reconciled.conflicts,
    lastSyncedAt: now,
  }
}

/**
 * Load the account copy of a local record's identity and reconcile it with local (sign-in
 * adoption / cross-device resume). RECOMMENDATION only — the caller decides to persist
 * resolved. Never overwrites newer/more-complete local data.
 */
export async function adoptPriorityProgressFromAccount(
  local: PersistedPriorityProgress | null,
  deps: ProgressSyncDeps = {},
): Promise<ProgressReconcileResult> {
  const { supabase, user } = await resolveDeps(deps)
  if (!supabase || !user) {
    return { resolved: local, action: 'no_account', reason: 'No account session; kept local.', conflicts: [] }
  }
  if (!local) {
    // No local record to key off — nothing to adopt deterministically.
    return { resolved: null, action: 'no_account', reason: 'No local record to reconcile against.', conflicts: [] }
  }
  const account = await readAccountProgress(supabase, user.id, progressLocalId(local))
  return reconcilePriorityProgress(local, account)
}
