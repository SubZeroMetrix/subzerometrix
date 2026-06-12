// ─────────────────────────────────────────────────────────────────────────────
// foundationBuilderSync — Account-2I: Foundation Builder sync READINESS
// ─────────────────────────────────────────────────────────────────────────────
// Cloud-ready, local-first sync plumbing for the FUTURE Product-5 Guided Business
// Foundation Builder. The Foundation Builder feature/UI is NOT built yet, so there is
// no live local data source today — these readers return [] and the sync backs up
// nothing and claims nothing. When Product-5 adds the local data model, this helper
// will sync it with no further wiring. It targets exactly three tables:
//   • cloud_sync_foundation_builder_progress ← future FoundationChecklistItem[]
//   • cloud_sync_vendor_tool_tracker         ← future VendorToolItem[]
//   • cloud_sync_launch_readiness_progress   ← future LaunchReadinessItem[]
//
// PRIVACY MODEL
//   • These are the user's OWN setup notes — low-risk, no PII expected. Notes are free
//     text, so an item is SKIPPED (kept local-only) if its note or reference URL looks
//     like a secret/credential. Vendor references store a URL/label only — NEVER
//     credentials, passwords, or API keys.
//   • Does NOT sync partner interest, customer feedback, growth analytics, or any other
//     surface. Only the three Foundation Builder tables above.
//
// HONESTY + SAFETY GUARANTEES (same pattern as Account-2D..2H)
//   • SSR/build safe; browser Supabase client is null on the server.
//   • Never throws into the UI for expected failures — returns an honest status.
//   • Never deletes or mutates local data. Local items stay the source of truth.
//   • Returns 'synced_to_account' ONLY after a confirmed successful Supabase write.
//   • Signed out → 'sign_in_to_back_up'; not configured → 'saved_on_device'; missing
//     table/migration or write failure → 'sync_unavailable', local intact.
//   • Writes use the anon client + the user's session JWT (RLS-enforced); the
//     service-role key is never used here.
// ─────────────────────────────────────────────────────────────────────────────

import { getBrowserSupabase, isSupabaseConfigured } from './supabaseClient'
import { getCurrentAccountUser } from './accountAuth'
import { safeJsonParse } from './metrixStorage'
import {
  FOUNDATION_BUILDER_KEYS,
  type FoundationChecklistItem,
  type VendorToolItem,
  type LaunchReadinessItem,
} from './foundationBuilder'
import type { SyncStatus } from './syncContracts'

// Re-export the canonical model keys/types so existing sync consumers are unaffected.
export { FOUNDATION_BUILDER_KEYS }
export type { FoundationChecklistItem, VendorToolItem, LaunchReadinessItem }

// The three Foundation Builder tables (created in migration 002).
const FOUNDATION_TABLE = 'cloud_sync_foundation_builder_progress'
const VENDOR_TABLE = 'cloud_sync_vendor_tool_tracker'
const LAUNCH_TABLE = 'cloud_sync_launch_readiness_progress'

const MAX_SAFE_VALUE_LEN = 2000 // notes can be longer; we only screen for secrets

export type FoundationBuilderSyncStatus = SyncStatus

export interface FoundationBuilderSyncResult {
  status: FoundationBuilderSyncStatus
  foundationWritten: number
  vendorWritten: number
  launchWritten: number
  written: number
  skipped: number
  total: number
  lastSyncedAt: string | null
  error?: string
}

export interface FoundationBuilderSyncReadiness {
  status: FoundationBuilderSyncStatus
  canSync: boolean
  signedIn: boolean
  supabaseAvailable: boolean
  /** True once a local Foundation Builder data source exists (Product-5). False today. */
  localModelExists: boolean
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

// SSR-safe local reader. Returns [] today (no Foundation Builder data exists yet).
function readLocalArray<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    const parsed = safeJsonParse<T[]>(window.localStorage.getItem(key))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// ── Privacy gate (secret/credential screening for free-text fields) ───────────
const SENSITIVE_PATTERNS: RegExp[] = [
  /\bpassword\b/i,
  /\bapi[\s_-]?key\b/i,
  /\bsecret\b/i,
  /\btoken\b/i,
  /\bprivate\s+key\b/i,
  /\bcredit\s*card\b/i,
  /\bssn\b/i,
  /\bsocial\s+security\b/i,
  /\bbank\s+account\b/i,
  /\b\d{3}-\d{2}-\d{4}\b/,        // SSN-like
  /\b\d{15,16}\b/,               // card-like digit run
]

function looksSensitive(value: string | null | undefined): boolean {
  if (!value) return false
  if (value.length > MAX_SAFE_VALUE_LEN) return true
  return SENSITIVE_PATTERNS.some(re => re.test(value))
}

export type FoundationItemEligibility =
  | { eligible: true }
  | { eligible: false; reason: 'malformed' | 'sensitive_content' }

/** Whether an item's id/timestamp are valid and its free text holds no secrets. */
export function getFoundationItemEligibility(
  item: { id?: unknown; createdAt?: unknown; note?: string | null; referenceUrl?: string | null },
): FoundationItemEligibility {
  if (!item || typeof item.id !== 'string' || typeof item.createdAt !== 'string') {
    return { eligible: false, reason: 'malformed' }
  }
  if (looksSensitive(item.note) || looksSensitive(item.referenceUrl ?? null)) {
    return { eligible: false, reason: 'sensitive_content' }
  }
  return { eligible: true }
}

function genericRow(item: Record<string, unknown>, userId: string): Record<string, unknown> {
  return {
    user_id: userId,
    local_id: item.id,
    sync_source: 'account',
    payload: item,
    updated_at: nowIso(),
  }
}

/** Honest readiness without attempting a write. Never throws; SSR-safe. */
export async function getFoundationBuilderSyncReadiness(): Promise<FoundationBuilderSyncReadiness> {
  const localModelExists =
    readLocalArray(FOUNDATION_BUILDER_KEYS.foundation).length > 0 ||
    readLocalArray(FOUNDATION_BUILDER_KEYS.vendorTracker).length > 0 ||
    readLocalArray(FOUNDATION_BUILDER_KEYS.launchReadiness).length > 0

  const supabaseAvailable = isSupabaseConfigured() && getBrowserSupabase() !== null
  if (!supabaseAvailable) {
    return { status: 'saved_on_device', canSync: false, signedIn: false, supabaseAvailable: false, localModelExists }
  }
  const user = await getCurrentAccountUser()
  if (!user) {
    return { status: 'sign_in_to_back_up', canSync: false, signedIn: false, supabaseAvailable: true, localModelExists }
  }
  return { status: 'saved_on_device', canSync: true, signedIn: true, supabaseAvailable: true, localModelExists }
}

async function upsert(table: string, rows: Record<string, unknown>[]): Promise<{ written: number; missingTable: boolean; error?: string }> {
  if (rows.length === 0) return { written: 0, missingTable: false }
  const supabase = getBrowserSupabase()
  if (!supabase) return { written: 0, missingTable: false, error: 'Supabase unavailable' }
  try {
    const { error } = await supabase.from(table).upsert(rows, { onConflict: 'user_id,local_id' })
    if (error) return { written: 0, missingTable: isMissingTable(error), error: error.message }
    return { written: rows.length, missingTable: false }
  } catch (e) {
    return { written: 0, missingTable: false, error: messageOf(e) }
  }
}

/**
 * Back up Foundation Builder progress (+ vendor tracker + launch readiness) to the
 * account once a local data model exists. Today the readers return [] (Product-5 not
 * built), so this returns 'saved_on_device' with nothing written — cloud-ready, no claim.
 * Eligible items only; never deletes local data.
 */
export async function syncFoundationBuilderToAccount(): Promise<FoundationBuilderSyncResult> {
  const base: FoundationBuilderSyncResult = {
    status: 'saved_on_device',
    foundationWritten: 0,
    vendorWritten: 0,
    launchWritten: 0,
    written: 0,
    skipped: 0,
    total: 0,
    lastSyncedAt: null,
  }

  const supabase = getBrowserSupabase()
  if (!supabase) return { ...base, status: 'saved_on_device' }

  const user = await getCurrentAccountUser()
  if (!user) return { ...base, status: 'sign_in_to_back_up' }

  const foundation = readLocalArray<FoundationChecklistItem>(FOUNDATION_BUILDER_KEYS.foundation)
  const vendor = readLocalArray<VendorToolItem>(FOUNDATION_BUILDER_KEYS.vendorTracker)
  const launch = readLocalArray<LaunchReadinessItem>(FOUNDATION_BUILDER_KEYS.launchReadiness)
  const total = foundation.length + vendor.length + launch.length
  if (total === 0) {
    // No local Foundation Builder data yet (Product-5 not built) — nothing to back up.
    return { ...base, status: 'saved_on_device', total: 0 }
  }

  let skipped = 0
  const pickEligible = <T extends { id?: unknown; createdAt?: unknown; note?: string | null; referenceUrl?: string | null }>(items: T[]): T[] => {
    const out: T[] = []
    for (const it of items) {
      if (getFoundationItemEligibility(it).eligible) out.push(it)
      else skipped += 1
    }
    return out
  }

  const fEligible = pickEligible(foundation)
  const vEligible = pickEligible(vendor)
  const lEligible = pickEligible(launch)
  if (fEligible.length + vEligible.length + lEligible.length === 0) {
    return { ...base, status: 'saved_on_device', total, skipped }
  }

  const fOut = await upsert(FOUNDATION_TABLE, fEligible.map(i => genericRow(i as unknown as Record<string, unknown>, user.id)))
  const vOut = await upsert(VENDOR_TABLE, vEligible.map(i => genericRow(i as unknown as Record<string, unknown>, user.id)))
  const lOut = await upsert(LAUNCH_TABLE, lEligible.map(i => genericRow(i as unknown as Record<string, unknown>, user.id)))

  const written = fOut.written + vOut.written + lOut.written
  const missingTable = fOut.missingTable || vOut.missingTable || lOut.missingTable
  const error = fOut.error ?? vOut.error ?? lOut.error
  if (missingTable || written === 0) {
    return { ...base, status: 'sync_unavailable', total, skipped, error }
  }

  return {
    status: 'synced_to_account',
    foundationWritten: fOut.written,
    vendorWritten: vOut.written,
    launchWritten: lOut.written,
    written,
    skipped,
    total,
    lastSyncedAt: nowIso(),
  }
}

export interface AccountFoundationBuilder {
  foundation: unknown[]
  vendor: unknown[]
  launch: unknown[]
}

/**
 * Read the user's synced Foundation Builder data back from the account (future
 * cross-device hydrate). Read-only; never writes or deletes. Returns empty arrays on any
 * expected failure.
 */
export async function loadFoundationBuilderFromAccount(): Promise<AccountFoundationBuilder> {
  const empty: AccountFoundationBuilder = { foundation: [], vendor: [], launch: [] }
  const supabase = getBrowserSupabase()
  if (!supabase) return empty
  const user = await getCurrentAccountUser()
  if (!user) return empty
  try {
    const [f, v, l] = await Promise.all([
      supabase.from(FOUNDATION_TABLE).select('payload').eq('user_id', user.id),
      supabase.from(VENDOR_TABLE).select('payload').eq('user_id', user.id),
      supabase.from(LAUNCH_TABLE).select('payload').eq('user_id', user.id),
    ])
    return {
      foundation: f.error ? [] : (f.data ?? []).map(r => (r as { payload: unknown }).payload),
      vendor: v.error ? [] : (v.data ?? []).map(r => (r as { payload: unknown }).payload),
      launch: l.error ? [] : (l.data ?? []).map(r => (r as { payload: unknown }).payload),
    }
  } catch {
    return empty
  }
}

/** A non-scary, user-facing message for a given sync status. */
export function getFoundationBuilderSyncErrorMessage(status: FoundationBuilderSyncStatus): string | null {
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
