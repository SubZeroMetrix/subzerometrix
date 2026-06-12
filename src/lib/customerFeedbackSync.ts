// ─────────────────────────────────────────────────────────────────────────────
// customerFeedbackSync — Account-2F: customer feedback / proof sync (PRIVACY-GATED)
// ─────────────────────────────────────────────────────────────────────────────
// The THIRD active cloud-sync flow, and the FIRST that touches a free-text field.
// It backs up a user's OWN private feedback records to their OWN account ONLY, and
// ONLY through a conservative privacy gate. It syncs exactly one table:
//   • cloud_sync_customer_feedback ← local CustomerFeedbackRecord[] (szm_customer_feedback)
//
// It does NOT sync partner interest, growth analytics, Foundation Builder, vendor
// tracker, or launch readiness data. It NEVER publishes a testimonial, posts a review,
// routes feedback to a public page, or creates any incentive — this is a private,
// account-scoped backup of the user's own words.
//
// PRIVACY GATE (conservative; not a full DLP system)
//   • Consent metadata (testimonial / case-study / contact-later flags) is PRESERVED in
//     the payload, never stripped and never transformed into a public testimonial.
//   • A record is SKIPPED (kept local-only) when it is malformed, missing its consent
//     metadata, or its free-text comment appears to contain obvious secrets/credentials
//     (password, API key, secret, token, private key, credit card, SSN/social security,
//     bank account, or SSN/card-like digit runs).
//   • Skipped records are counted in the result so we never imply "all feedback synced".
//
// HONESTY + SAFETY GUARANTEES (same pattern as Account-2D/2E)
//   • SSR/build safe; browser Supabase client is null on the server.
//   • Never throws into the UI for expected failures — returns an honest status.
//   • Never deletes or mutates local data. Local feedback stays the source of truth.
//   • Returns 'synced_to_account' ONLY after a confirmed successful Supabase write.
//   • Signed out → 'sign_in_to_back_up'; not configured → 'saved_on_device'; missing
//     table/migration or write failure → 'sync_unavailable', local intact.
//   • Writes use the anon client + the user's session JWT (RLS-enforced); the
//     service-role key is never used here.
// ─────────────────────────────────────────────────────────────────────────────

import { getBrowserSupabase, isSupabaseConfigured } from './supabaseClient'
import { getCurrentAccountUser } from './accountAuth'
import { getCustomerFeedbackLocal, type CustomerFeedbackRecord } from './customerProof'
import type { SyncStatus } from './syncContracts'

// Only this table — the user's own private feedback backup.
const FEEDBACK_TABLE = 'cloud_sync_customer_feedback'

export type CustomerFeedbackSyncStatus = SyncStatus

export interface CustomerFeedbackSyncResult {
  status: CustomerFeedbackSyncStatus
  written: number
  skipped: number   // records kept local-only by the privacy gate
  total: number
  lastSyncedAt: string | null
  error?: string
}

export interface CustomerFeedbackSyncReadiness {
  status: CustomerFeedbackSyncStatus
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
// Conservative skip patterns for obvious secrets / sensitive identifiers in free text.
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

function commentLooksSensitive(comment: string | null | undefined): boolean {
  if (!comment) return false
  return SENSITIVE_PATTERNS.some(re => re.test(comment))
}

// Consent metadata must be present (the record's own testimonial/case-study/contact flags).
function hasConsentMetadata(r: CustomerFeedbackRecord): boolean {
  return typeof r.testimonialInterest === 'boolean'
    && typeof r.caseStudyInterest === 'boolean'
    && typeof r.contactLaterOk === 'boolean'
}

export type FeedbackEligibility =
  | { eligible: true }
  | { eligible: false; reason: 'malformed' | 'missing_consent_metadata' | 'sensitive_comment' }

/** Whether a feedback record may be backed up to the account (privacy gate). */
export function getFeedbackEligibility(r: CustomerFeedbackRecord): FeedbackEligibility {
  if (!r || typeof r.id !== 'string' || typeof r.createdAt !== 'string') {
    return { eligible: false, reason: 'malformed' }
  }
  if (!hasConsentMetadata(r)) {
    return { eligible: false, reason: 'missing_consent_metadata' }
  }
  if (commentLooksSensitive(r.comment)) {
    return { eligible: false, reason: 'sensitive_comment' }
  }
  return { eligible: true }
}

// Payload preserves consent flags; never publishes, never makes public.
function feedbackRow(r: CustomerFeedbackRecord, userId: string): Record<string, unknown> {
  return {
    user_id: userId,
    local_id: r.id,
    sync_source: 'account',
    payload: {
      id: r.id,
      createdAt: r.createdAt,
      trigger: r.trigger,
      score: r.score,
      comment: r.comment,
      // Consent metadata preserved verbatim — private backup only, never published.
      testimonialInterest: r.testimonialInterest,
      caseStudyInterest: r.caseStudyInterest,
      contactLaterOk: r.contactLaterOk,
    },
    updated_at: nowIso(),
  }
}

/** Honest readiness without attempting a write. Never throws; SSR-safe. */
export async function getCustomerFeedbackSyncReadiness(): Promise<CustomerFeedbackSyncReadiness> {
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
 * Back up eligible feedback records to the account. Records that fail the privacy gate
 * are kept local-only and counted in `skipped`. Returns 'synced_to_account' only after a
 * confirmed write of at least one eligible record. Never deletes local data.
 */
export async function syncCustomerFeedbackToAccount(): Promise<CustomerFeedbackSyncResult> {
  const base: CustomerFeedbackSyncResult = {
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

  const records = getCustomerFeedbackLocal()
  const total = records.length
  if (total === 0) return { ...base, status: 'saved_on_device', total: 0 }

  const eligible: CustomerFeedbackRecord[] = []
  let skipped = 0
  for (const r of records) {
    if (getFeedbackEligibility(r).eligible) eligible.push(r)
    else skipped += 1
  }

  // Nothing eligible — keep everything local; honest device-local status.
  if (eligible.length === 0) {
    return { ...base, status: 'saved_on_device', total, skipped }
  }

  try {
    const { error } = await supabase
      .from(FEEDBACK_TABLE)
      .upsert(eligible.map(r => feedbackRow(r, user.id)), { onConflict: 'user_id,local_id' })
    if (error) {
      const status: CustomerFeedbackSyncStatus = 'sync_unavailable'
      return { ...base, status, total, skipped, error: error.message }
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
 * Read the user's synced feedback back from the account (future cross-device hydrate).
 * Read-only; never writes or deletes. Returns [] on any expected failure.
 */
export async function loadCustomerFeedbackFromAccount(): Promise<unknown[]> {
  const supabase = getBrowserSupabase()
  if (!supabase) return []
  const user = await getCurrentAccountUser()
  if (!user) return []
  try {
    const { data, error } = await supabase.from(FEEDBACK_TABLE).select('payload').eq('user_id', user.id)
    if (error) return []
    return (data ?? []).map(row => (row as { payload: unknown }).payload)
  } catch {
    return []
  }
}

/** A non-scary, user-facing message for a given sync status. */
export function getCustomerFeedbackSyncErrorMessage(status: CustomerFeedbackSyncStatus): string | null {
  switch (status) {
    case 'sync_unavailable':
      return 'Feedback backup is not available right now. Your feedback is still saved on this device.'
    case 'sign_in_to_back_up':
      return 'Your feedback is saved on this device. Sign in later to back it up to your account.'
    case 'saved_on_device':
    case 'synced_to_account':
    default:
      return null
  }
}
