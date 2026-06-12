// ─────────────────────────────────────────────────────────────────────────────
// accountDataPrivacy — Account-2K: export / delete / privacy controls
// ─────────────────────────────────────────────────────────────────────────────
// Lets a SIGNED-IN user export or delete THEIR OWN synced rows across the ten
// cloud_sync_* tables. All access goes through the browser anon client + the user's
// session JWT, enforced by owner-only RLS (auth.uid() = user_id). The service-role key
// is NEVER used here, and there is no public/anonymous access.
//
// HONESTY + SAFETY
//   • Export reads only the user's own rows (RLS-scoped); returns JSON + per-table status.
//   • Delete removes only the user's own rows (RLS-scoped); per-table success is reported
//     honestly. "All deleted" is claimed ONLY when every requested table succeeds.
//   • Device-local data is preserved — clearing it is a SEPARATE, explicitly-confirmed
//     action (clearDeviceLocalSyncedData).
//   • The Supabase AUTH ACCOUNT itself cannot be deleted from the browser (that needs a
//     server-side admin mechanism). AUTH_ACCOUNT_DELETION_SUPPORTED is false → the UI
//     labels it future / admin-assisted.
//   • SSR-safe; never throws into the UI for expected failures.
// ─────────────────────────────────────────────────────────────────────────────

import { getBrowserSupabase } from './supabaseClient'
import { getCurrentAccountUser } from './accountAuth'

// The ten Account-2 cloud tables (migration 002).
export const CLOUD_SYNC_TABLES = [
  'cloud_sync_assessment_history',
  'cloud_sync_score_history',
  'cloud_sync_roadmap_action_progress',
  'cloud_sync_kpi_entries',
  'cloud_sync_customer_feedback',
  'cloud_sync_partner_interest',
  'cloud_sync_growth_events',
  'cloud_sync_foundation_builder_progress',
  'cloud_sync_vendor_tool_tracker',
  'cloud_sync_launch_readiness_progress',
] as const

// Deleting the sign-in account itself needs a server-side admin API (service-role),
// which is intentionally NOT available to the browser. Until a secure server endpoint
// exists, this stays false and the UI labels auth-account deletion as admin-assisted.
export const AUTH_ACCOUNT_DELETION_SUPPORTED = false

export type PrivacyOpStatus = 'ok' | 'partial' | 'unavailable' | 'signed_out' | 'error'

function messageOf(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const m = (err as { message?: unknown }).message
    if (typeof m === 'string') return m
  }
  return 'Unknown error'
}

// ── Export ──────────────────────────────────────────────────────────────────────
export interface AccountDataExport {
  status: PrivacyOpStatus
  exportedAt: string
  userId: string | null
  rowCounts: Record<string, number>
  tables: Record<string, unknown[]>
  errors: Record<string, string>
}

/** Export the signed-in user's own rows from every cloud_sync_* table. Read-only. */
export async function exportAccountData(): Promise<AccountDataExport> {
  const base: AccountDataExport = {
    status: 'unavailable', exportedAt: new Date().toISOString(), userId: null,
    rowCounts: {}, tables: {}, errors: {},
  }
  const supabase = getBrowserSupabase()
  if (!supabase) return base
  const user = await getCurrentAccountUser()
  if (!user) return { ...base, status: 'signed_out' }

  const tables: Record<string, unknown[]> = {}
  const rowCounts: Record<string, number> = {}
  const errors: Record<string, string> = {}
  for (const table of CLOUD_SYNC_TABLES) {
    try {
      const { data, error } = await supabase.from(table).select('*').eq('user_id', user.id)
      if (error) { errors[table] = error.message; tables[table] = []; rowCounts[table] = 0 }
      else { tables[table] = data ?? []; rowCounts[table] = (data ?? []).length }
    } catch (e) {
      errors[table] = messageOf(e); tables[table] = []; rowCounts[table] = 0
    }
  }
  const status: PrivacyOpStatus = Object.keys(errors).length === 0 ? 'ok' : 'partial'
  return { status, exportedAt: base.exportedAt, userId: user.id, rowCounts, tables, errors }
}

/** Pretty-printed JSON document for download. */
export function buildAccountDataExportJson(data: AccountDataExport): string {
  return JSON.stringify(
    {
      product: 'SubZeroMetrix',
      type: 'account_data_export',
      exportedAt: data.exportedAt,
      userId: data.userId,
      rowCounts: data.rowCounts,
      tables: data.tables,
      errors: data.errors,
    },
    null,
    2,
  )
}

// ── Delete (cloud) ────────────────────────────────────────────────────────────
export interface TableDeleteResult { table: string; ok: boolean; error?: string }

export interface AccountDataDeletion {
  status: PrivacyOpStatus
  userId: string | null
  results: TableDeleteResult[]
  allDeleted: boolean
  authAccountDeleted: false
  authAccountDeletionSupported: boolean
}

/**
 * Delete the signed-in user's own rows from every cloud_sync_* table (RLS owner-only).
 * Reports per-table success; `allDeleted` is true ONLY when every table succeeds. Does
 * NOT delete the auth account and does NOT touch device-local data.
 */
export async function deleteAccountData(): Promise<AccountDataDeletion> {
  const base: AccountDataDeletion = {
    status: 'unavailable', userId: null, results: [], allDeleted: false,
    authAccountDeleted: false, authAccountDeletionSupported: AUTH_ACCOUNT_DELETION_SUPPORTED,
  }
  const supabase = getBrowserSupabase()
  if (!supabase) return base
  const user = await getCurrentAccountUser()
  if (!user) return { ...base, status: 'signed_out' }

  const results: TableDeleteResult[] = []
  for (const table of CLOUD_SYNC_TABLES) {
    try {
      const { error } = await supabase.from(table).delete().eq('user_id', user.id)
      results.push(error ? { table, ok: false, error: error.message } : { table, ok: true })
    } catch (e) {
      results.push({ table, ok: false, error: messageOf(e) })
    }
  }
  const allDeleted = results.every(r => r.ok)
  const anyDeleted = results.some(r => r.ok)
  const status: PrivacyOpStatus = allDeleted ? 'ok' : anyDeleted ? 'partial' : 'error'
  return {
    status, userId: user.id, results, allDeleted,
    authAccountDeleted: false, authAccountDeletionSupported: AUTH_ACCOUNT_DELETION_SUPPORTED,
  }
}

// ── Device-local clear (separate, explicit) ─────────────────────────────────────
// The device-local keys that feed the synced flows. Cleared ONLY on a separate,
// explicit user confirmation — never as part of cloud export/delete.
export const DEVICE_LOCAL_SYNCED_KEYS = [
  'szm_metrix_profile',
  'szm_metrix_history',
  'szm_metrix_last_recorded_at',
  'szm_path_complete',
  'szm_customer_feedback',
  'szm_partner_interest',
  'szm_growth_events',
  'szm_foundation_builder',
  'szm_vendor_tracker',
  'szm_launch_readiness',
] as const

/** Remove the device-local synced-progress keys from THIS browser. Explicit action only. */
export function clearDeviceLocalSyncedData(): { cleared: string[] } {
  if (typeof window === 'undefined') return { cleared: [] }
  const cleared: string[] = []
  for (const key of DEVICE_LOCAL_SYNCED_KEYS) {
    try {
      if (window.localStorage.getItem(key) !== null) {
        window.localStorage.removeItem(key)
        cleared.push(key)
      }
    } catch {
      // storage unavailable — non-fatal
    }
  }
  return { cleared }
}

// ── Privacy copy ────────────────────────────────────────────────────────────────
export interface AccountPrivacyCopy {
  intro: string
  exportTitle: string
  exportDescription: string
  deleteTitle: string
  deleteDescription: string
  deleteConfirmLabel: string
  localTitle: string
  localDescription: string
  localConfirmLabel: string
  authAccountNote: string
}

export function getAccountPrivacyCopy(): AccountPrivacyCopy {
  return {
    intro: 'Manage the progress data SubZeroMetrix™ has backed up to your account. These controls affect only your own data.',
    exportTitle: 'Export my data',
    exportDescription: 'Download a JSON copy of your own synced rows from every cloud table. Read-only — nothing is changed or deleted.',
    deleteTitle: 'Delete my cloud data',
    deleteDescription: 'Permanently delete your own synced rows from every cloud table. This does not delete your sign-in account and does not remove data saved on this device.',
    deleteConfirmLabel: 'I understand this permanently deletes my synced cloud data.',
    localTitle: 'Clear data on this device',
    localDescription: 'Separately remove the Foundation Builder, assessment, roadmap, KPI, feedback, partner, and analytics data stored in this browser. This is optional and only affects this device.',
    localConfirmLabel: 'I understand this clears my saved progress on this device.',
    authAccountNote: 'Deleting your sign-in account itself is not automated yet — contact support for admin-assisted account deletion.',
  }
}
