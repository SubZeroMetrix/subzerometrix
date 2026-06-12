// ─────────────────────────────────────────────────────────────────────────────
// partnerInterestSync — Account-2G: partner interest sync (HIGHEST PRIVACY CARE)
// ─────────────────────────────────────────────────────────────────────────────
// The FOURTH active cloud-sync flow, and the highest-PII surface. Partner interest
// records may contain name, company, email, website, and a free-text collaboration
// note. This helper backs up a user's OWN partner-interest records to their OWN
// account ONLY, behind a strict CONSENT GATE, and syncs exactly one table:
//   • cloud_sync_partner_interest ← local PartnerInterestSubmission[] (szm_partner_interest)
//
// It does NOT sync growth analytics, Foundation Builder, vendor/tool tracker, or
// launch readiness data. It performs no outreach, no CRM push, no public listing.
//
// CONSENT + PRIVACY GATE (conservative; not a full DLP system)
//   • A record is ELIGIBLE only when `consentToContact === true`. Without explicit
//     consent it is SKIPPED and kept local-only.
//   • A record is also SKIPPED when malformed or when its free-text note appears to
//     contain obvious secrets/credentials (password, API key, secret, token, private
//     key, credit card, SSN/social security, bank account, or SSN-/card-like digits).
//   • All fields (incl. consent) are preserved verbatim in the payload — private,
//     account-scoped backup only. Skipped records are counted so we never imply
//     "all partner interest synced".
//
// HONESTY + SAFETY GUARANTEES (same pattern as Account-2D/2E/2F)
//   • SSR/build safe; browser Supabase client is null on the server.
//   • Never throws into the UI for expected failures — returns an honest status.
//   • Never deletes or mutates local data. Local records stay the source of truth.
//   • Returns 'synced_to_account' ONLY after a confirmed successful Supabase write.
//   • Signed out → 'sign_in_to_back_up'; not configured → 'saved_on_device'; missing
//     table/migration or write failure → 'sync_unavailable', local intact.
//   • Writes use the anon client + the user's session JWT (RLS-enforced); the
//     service-role key is never used here.
// ─────────────────────────────────────────────────────────────────────────────

import { getBrowserSupabase, isSupabaseConfigured } from './supabaseClient'
import { getCurrentAccountUser } from './accountAuth'
import { getPartnerInterestLocal, type PartnerInterestSubmission } from './partnerDistribution'
import { reconcileByIdNewestWins, type ReconcileResult, type TimestampedRecord } from './syncConflict'
import type { SyncStatus } from './syncContracts'

// Only this table — the user's own private partner-interest backup.
const PARTNER_TABLE = 'cloud_sync_partner_interest'

export type PartnerInterestSyncStatus = SyncStatus

export interface PartnerInterestSyncResult {
  status: PartnerInterestSyncStatus
  written: number
  skipped: number   // records kept local-only by the consent/privacy gate
  total: number
  lastSyncedAt: string | null
  error?: string
}

export interface PartnerInterestSyncReadiness {
  status: PartnerInterestSyncStatus
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

// ── Consent + privacy gate ────────────────────────────────────────────────────
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

function noteLooksSensitive(note: string | null | undefined): boolean {
  if (!note) return false
  return SENSITIVE_PATTERNS.some(re => re.test(note))
}

export type PartnerEligibility =
  | { eligible: true }
  | { eligible: false; reason: 'malformed' | 'consent_required' | 'sensitive_note' }

/** Whether a partner-interest record may be backed up (consent + privacy gate). */
export function getPartnerEligibility(r: PartnerInterestSubmission): PartnerEligibility {
  if (!r || typeof r.id !== 'string' || typeof r.createdAt !== 'string') {
    return { eligible: false, reason: 'malformed' }
  }
  // Strict consent gate: never sync without explicit contact permission.
  if (r.consentToContact !== true) {
    return { eligible: false, reason: 'consent_required' }
  }
  if (noteLooksSensitive(r.collaborationNote)) {
    return { eligible: false, reason: 'sensitive_note' }
  }
  return { eligible: true }
}

// Payload preserves the record verbatim — private, account-scoped backup only.
function partnerRow(r: PartnerInterestSubmission, userId: string): Record<string, unknown> {
  return {
    user_id: userId,
    local_id: r.id,
    sync_source: 'account',
    payload: {
      id: r.id,
      createdAt: r.createdAt,
      name: r.name,
      company: r.company,
      channelType: r.channelType,
      website: r.website,
      email: r.email,
      collaborationNote: r.collaborationNote,
      consentToContact: r.consentToContact,
      status: r.status,
    },
    updated_at: nowIso(),
  }
}

/** Honest readiness without attempting a write. Never throws; SSR-safe. */
export async function getPartnerInterestSyncReadiness(): Promise<PartnerInterestSyncReadiness> {
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
 * Back up consented, eligible partner-interest records to the account. Records that fail
 * the consent/privacy gate are kept local-only and counted in `skipped`. Returns
 * 'synced_to_account' only after a confirmed write of ≥1 eligible record. Never deletes
 * local data.
 */
export async function syncPartnerInterestToAccount(): Promise<PartnerInterestSyncResult> {
  const base: PartnerInterestSyncResult = {
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

  const records = getPartnerInterestLocal()
  const total = records.length
  if (total === 0) return { ...base, status: 'saved_on_device', total: 0 }

  const eligible: PartnerInterestSubmission[] = []
  let skipped = 0
  for (const r of records) {
    if (getPartnerEligibility(r).eligible) eligible.push(r)
    else skipped += 1
  }

  // Nothing consented/eligible — keep everything local; honest device-local status.
  if (eligible.length === 0) {
    return { ...base, status: 'saved_on_device', total, skipped }
  }

  try {
    const { error } = await supabase
      .from(PARTNER_TABLE)
      .upsert(eligible.map(r => partnerRow(r, user.id)), { onConflict: 'user_id,local_id' })
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
 * Read the user's synced partner interest back from the account (future cross-device
 * hydrate). Read-only; never writes or deletes. Returns [] on any expected failure.
 */
export async function loadPartnerInterestFromAccount(): Promise<unknown[]> {
  const supabase = getBrowserSupabase()
  if (!supabase) return []
  const user = await getCurrentAccountUser()
  if (!user) return []
  try {
    const { data, error } = await supabase.from(PARTNER_TABLE).select('payload').eq('user_id', user.id)
    if (error) return []
    return (data ?? []).map(row => (row as { payload: unknown }).payload)
  } catch {
    return []
  }
}

/**
 * Account-2J: newest-wins reconciliation of local partner interest against the account
 * (by id, using createdAt). Recommendation only — never overwrites local. Only consented/
 * eligible records were ever written to the cloud, so reconcile cannot reintroduce skipped
 * (non-consented or sensitive) records.
 */
export async function reconcilePartnerInterestFromAccount(
  local: TimestampedRecord[],
): Promise<ReconcileResult<TimestampedRecord>> {
  const cloud = (await loadPartnerInterestFromAccount()) as TimestampedRecord[]
  return reconcileByIdNewestWins(local, cloud)
}

/** A non-scary, user-facing message for a given sync status. */
export function getPartnerInterestSyncErrorMessage(status: PartnerInterestSyncStatus): string | null {
  switch (status) {
    case 'sync_unavailable':
      return 'Account backup is not available right now. Your partner interest is still saved on this device.'
    case 'sign_in_to_back_up':
      return 'Your partner interest is saved on this device. Sign in later to back it up to your account.'
    case 'saved_on_device':
    case 'synced_to_account':
    default:
      return null
  }
}
