// ─────────────────────────────────────────────────────────────────────────────
// growthAnalyticsSync — Account-2H: privacy-safe growth analytics sync
// ─────────────────────────────────────────────────────────────────────────────
// The FIFTH active cloud-sync flow. It backs up a user's OWN device-local activation
// events to their OWN account ONLY, as PRIVACY-SAFE, AGGREGATE fields, and syncs
// exactly one table:
//   • cloud_sync_growth_events ← local GrowthActivationRecord[] (szm_growth_events)
//
// PRIVACY MODEL (strict, defense-in-depth)
//   • The synced payload is a WHITELIST of structured, non-PII fields only:
//     eventName, createdAt, path (pathname), source, channel, language, locale,
//     milestone. The free-form `metadata` map is NEVER synced (dropped entirely).
//   • As a second layer, an event is SKIPPED (kept local-only) if its path or any
//     metadata value looks like free text or obvious PII (email, sensitive keyword,
//     or an unusually long string). Skipped events are counted.
//   • NO names, emails, phones, company, notes, feedback, partner interest, Foundation
//     Builder, vendor tracker, or launch readiness data. NO third-party analytics,
//     cookies, pixels, or retargeting — this is a private account backup, nothing else.
//
// HONESTY + SAFETY GUARANTEES (same pattern as Account-2D..2G)
//   • SSR/build safe; browser Supabase client is null on the server.
//   • Never throws into the UI for expected failures — returns an honest status.
//   • Never deletes or mutates local data. Local events stay the source of truth.
//   • Returns 'synced_to_account' ONLY after a confirmed successful Supabase write.
//   • Signed out → 'sign_in_to_back_up'; not configured → 'saved_on_device'; missing
//     table/migration or write failure → 'sync_unavailable', local intact.
//   • Writes use the anon client + the user's session JWT (RLS-enforced); the
//     service-role key is never used here.
// ─────────────────────────────────────────────────────────────────────────────

import { getBrowserSupabase, isSupabaseConfigured } from './supabaseClient'
import { getCurrentAccountUser } from './accountAuth'
import { getGrowthEventsLocal, type GrowthActivationRecord } from './growthAnalytics'
import { reconcileByIdNewestWins, type ReconcileResult, type TimestampedRecord } from './syncConflict'
import type { SyncStatus } from './syncContracts'

// Only this table — the user's own privacy-safe, aggregate activity backup.
const GROWTH_TABLE = 'cloud_sync_growth_events'

// Max length for a structured tag value before we treat it as free text and skip.
const MAX_SAFE_VALUE_LEN = 64

export type GrowthAnalyticsSyncStatus = SyncStatus

export interface GrowthAnalyticsSyncResult {
  status: GrowthAnalyticsSyncStatus
  written: number
  skipped: number   // events kept local-only by the privacy gate
  total: number
  lastSyncedAt: string | null
  error?: string
}

export interface GrowthAnalyticsSyncReadiness {
  status: GrowthAnalyticsSyncStatus
  canSync: boolean
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

// ── Privacy gate ──────────────────────────────────────────────────────────────
const SENSITIVE_PATTERNS: RegExp[] = [
  /\S+@\S+\.\S+/,                // email-like
  /\bpassword\b/i,
  /\bapi[\s_-]?key\b/i,
  /\bsecret\b/i,
  /\btoken\b/i,
  /\bprivate\s+key\b/i,
  /\bssn\b/i,
  /\bsocial\s+security\b/i,
  /\bbank\s+account\b/i,
  /\b\d{3}-\d{2}-\d{4}\b/,       // SSN-like
  /\b\d{15,16}\b/,              // card-like digit run
]

function valueLooksUnsafe(value: string): boolean {
  if (value.length > MAX_SAFE_VALUE_LEN) return true // long → likely free text
  return SENSITIVE_PATTERNS.some(re => re.test(value))
}

export type GrowthEventEligibility =
  | { eligible: true }
  | { eligible: false; reason: 'malformed' | 'unsafe_path' | 'unsafe_metadata' }

/** Whether an event is safe to back up (structured, non-PII, no free text). */
export function getGrowthEventEligibility(e: GrowthActivationRecord): GrowthEventEligibility {
  if (!e || typeof e.id !== 'string' || typeof e.createdAt !== 'string') {
    return { eligible: false, reason: 'malformed' }
  }
  if (typeof e.path === 'string' && valueLooksUnsafe(e.path)) {
    return { eligible: false, reason: 'unsafe_path' }
  }
  // Defense in depth: even though metadata is dropped from the payload, skip the whole
  // event if any metadata value looks like free text or PII.
  if (e.metadata && typeof e.metadata === 'object') {
    for (const v of Object.values(e.metadata)) {
      if (typeof v === 'string' && valueLooksUnsafe(v)) {
        return { eligible: false, reason: 'unsafe_metadata' }
      }
    }
  }
  return { eligible: true }
}

// Whitelisted, non-PII, aggregate payload. `metadata` is intentionally NOT included.
function growthRow(e: GrowthActivationRecord, userId: string): Record<string, unknown> {
  return {
    user_id: userId,
    local_id: e.id,
    sync_source: 'account',
    payload: {
      eventName: e.eventName,
      createdAt: e.createdAt,
      path: e.path,
      source: e.source,
      channel: e.channel,
      language: e.language,
      locale: e.locale,
      milestone: e.milestone,
      // metadata is deliberately omitted — privacy-safe aggregate fields only.
    },
    updated_at: nowIso(),
  }
}

/** Honest readiness without attempting a write. Never throws; SSR-safe. */
export async function getGrowthAnalyticsSyncReadiness(): Promise<GrowthAnalyticsSyncReadiness> {
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
 * Back up privacy-safe activation events to the account. Events that fail the privacy
 * gate are kept local-only and counted in `skipped`. Returns 'synced_to_account' only
 * after a confirmed write of ≥1 eligible event. Never deletes local data.
 */
export async function syncGrowthAnalyticsToAccount(): Promise<GrowthAnalyticsSyncResult> {
  const base: GrowthAnalyticsSyncResult = {
    status: 'saved_on_device',
    written: 0,
    skipped: 0,
    total: 0,
    lastSyncedAt: null,
  }

  const supabase = getBrowserSupabase()
  if (!supabase) return { ...base, status: 'saved_on_device' }

  const user = await getCurrentAccountUser()
  if (!user) return { ...base, status: 'sign_in_to_back_up' }

  const events = getGrowthEventsLocal()
  const total = events.length
  if (total === 0) return { ...base, status: 'saved_on_device', total: 0 }

  const eligible: GrowthActivationRecord[] = []
  let skipped = 0
  for (const e of events) {
    if (getGrowthEventEligibility(e).eligible) eligible.push(e)
    else skipped += 1
  }

  if (eligible.length === 0) {
    return { ...base, status: 'saved_on_device', total, skipped }
  }

  try {
    const { error } = await supabase
      .from(GROWTH_TABLE)
      .upsert(eligible.map(e => growthRow(e, user.id)), { onConflict: 'user_id,local_id' })
    if (error) {
      return { ...base, status: 'sync_unavailable', total, skipped, error: error.message }
    }
  } catch (e) {
    return { ...base, status: 'sync_unavailable', total, skipped, error: messageOf(e) }
  }

  return {
    status: 'synced_to_account',
    written: eligible.length,
    skipped,
    total,
    lastSyncedAt: nowIso(),
  }
}

/**
 * Read the user's synced activity back from the account (future cross-device hydrate).
 * Read-only; never writes or deletes. Returns [] on any expected failure.
 */
export async function loadGrowthAnalyticsFromAccount(): Promise<unknown[]> {
  const supabase = getBrowserSupabase()
  if (!supabase) return []
  const user = await getCurrentAccountUser()
  if (!user) return []
  try {
    const { data, error } = await supabase.from(GROWTH_TABLE).select('payload').eq('user_id', user.id)
    if (error) return []
    return (data ?? []).map(row => (row as { payload: unknown }).payload)
  } catch {
    return []
  }
}

/**
 * Account-2J: newest-wins reconciliation of local growth events against the account (by id,
 * using createdAt). Recommendation only — never overwrites local. Only privacy-safe events
 * passed the whitelist/skip gate before being written, so reconcile stays non-PII.
 */
export async function reconcileGrowthAnalyticsFromAccount(
  local: TimestampedRecord[],
): Promise<ReconcileResult<TimestampedRecord>> {
  const cloud = (await loadGrowthAnalyticsFromAccount()) as TimestampedRecord[]
  return reconcileByIdNewestWins(local, cloud)
}

/** A non-scary, user-facing message for a given sync status. */
export function getGrowthAnalyticsSyncErrorMessage(status: GrowthAnalyticsSyncStatus): string | null {
  switch (status) {
    case 'sync_unavailable':
      return 'Account backup is not available right now. Your activity is still saved on this device.'
    case 'sign_in_to_back_up':
      return 'Your activity is saved on this device. Sign in later to back it up to your account.'
    case 'saved_on_device':
    case 'synced_to_account':
    default:
      return null
  }
}
