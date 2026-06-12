// ─────────────────────────────────────────────────────────────────────────────
// assessmentHistorySync — Account-2D: assessment / MetrixScore™ history sync
// ─────────────────────────────────────────────────────────────────────────────
// The FIRST active cloud-sync flow. It syncs ONLY the two lowest-risk, structured,
// non-PII, non-free-text entities:
//   • cloud_sync_assessment_history  ← local MetrixProfileSnapshot[] (szm_metrix_*)
//   • cloud_sync_score_history       ← local MetrixScoreSnapshot[]
// These hold business-readiness selections (trade, region, stage, revenue band, score,
// categories) — NOT names, emails, phones, or free text. No other surface is synced.
//
// HONESTY + SAFETY GUARANTEES
//   • SSR/build safe: the browser Supabase client is null on the server.
//   • Never throws into the UI for expected failures — returns an honest status.
//   • Never deletes or mutates local data. Local storage stays the source of truth.
//   • Returns 'synced_to_account' ONLY after a confirmed successful Supabase write.
//   • If signed out → 'sign_in_to_back_up' (or 'saved_on_device' when Supabase is not
//     configured at all). If the table/migration is missing or a write fails →
//     'sync_unavailable'. Local data is always left intact.
//   • Writes go through the anon client + the user's session JWT (RLS-enforced); the
//     service-role key is never used here.
// ─────────────────────────────────────────────────────────────────────────────

import { getBrowserSupabase, isSupabaseConfigured } from './supabaseClient'
import { getCurrentAccountUser } from './accountAuth'
import { loadLocalMetrixHistory } from './metrixStorage'
import type { MetrixScoreSnapshot, MetrixProfileSnapshot } from './metrixHistory'
import { reconcileByIdNewestWins, type ReconcileResult, type TimestampedRecord } from './syncConflict'
import type { SyncStatus } from './syncContracts'

// Only these two tables — the lowest-risk, non-PII, non-free-text entities.
const ASSESSMENT_TABLE = 'cloud_sync_assessment_history'
const SCORE_TABLE = 'cloud_sync_score_history'

// Reuse the shared four-label status vocabulary.
export type AssessmentSyncStatus = SyncStatus

export interface AssessmentSyncResult {
  status: AssessmentSyncStatus
  assessmentWritten: number
  scoreWritten: number
  total: number
  lastSyncedAt: string | null
  error?: string
}

export interface AssessmentSyncReadiness {
  status: AssessmentSyncStatus // what to show before/without a write attempt
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

// A missing table / unapplied migration → treat as sync_unavailable (not a hard error).
function isMissingTable(err: { code?: string; message?: string } | null): boolean {
  const code = err?.code ?? ''
  const message = err?.message ?? ''
  return code === '42P01' || /does not exist|schema cache|could not find the table|find the table/i.test(message)
}

// Structured, non-PII payloads. These objects contain business-readiness selections and
// scores only — no names, emails, phones, or free text.
function assessmentRow(p: MetrixProfileSnapshot, userId: string): Record<string, unknown> {
  return {
    user_id: userId,
    local_id: p.id,
    sync_source: 'account',
    payload: {
      id: p.id,
      createdAt: p.createdAt,
      trade: p.trade,
      region: p.region,
      businessStage: p.businessStage ?? null,
      yearsInBusiness: p.yearsInBusiness,
      revenueRange: p.revenueRange,
      teamSize: p.teamSize,
      mainGoal: p.mainGoal,
      biggestChallenge: p.biggestChallenge,
      confidence: p.confidence,
      profileCompletion: p.profileCompletion,
    },
    updated_at: nowIso(),
  }
}

function scoreRow(s: MetrixScoreSnapshot, userId: string): Record<string, unknown> {
  return {
    user_id: userId,
    local_id: s.id,
    sync_source: 'account',
    payload: {
      id: s.id,
      createdAt: s.createdAt,
      source: s.source,
      overall: s.overall,
      categories: s.categories,
      riskLevel: s.riskLevel,
      riskLabel: s.riskLabel,
      profileCompletion: s.profileCompletion,
      trade: s.trade,
      region: s.region,
      businessStage: s.businessStage ?? null,
      mainGoal: s.mainGoal,
      biggestChallenge: s.biggestChallenge,
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
 * Honest readiness without attempting a write. Decides which status the badge should
 * show by default. Never throws; SSR-safe.
 */
export async function getAssessmentSyncReadiness(): Promise<AssessmentSyncReadiness> {
  const supabaseAvailable = isSupabaseConfigured() && getBrowserSupabase() !== null
  if (!supabaseAvailable) {
    // No account path at all — local device is the whole story.
    return { status: 'saved_on_device', canSync: false, signedIn: false, supabaseAvailable: false }
  }
  const user = await getCurrentAccountUser()
  if (!user) {
    return { status: 'sign_in_to_back_up', canSync: false, signedIn: false, supabaseAvailable: true }
  }
  // Signed in + Supabase available: a backup is possible, but nothing is synced until a
  // confirmed write — so the honest pre-write status is still device-local.
  return { status: 'saved_on_device', canSync: true, signedIn: true, supabaseAvailable: true }
}

/**
 * Perform the actual backup of assessment + score history to the account. Returns a
 * confirmed 'synced_to_account' ONLY when a write succeeded. Never deletes local data.
 */
export async function syncAssessmentHistoryToAccount(): Promise<AssessmentSyncResult> {
  const base: AssessmentSyncResult = {
    status: 'saved_on_device',
    assessmentWritten: 0,
    scoreWritten: 0,
    total: 0,
    lastSyncedAt: null,
  }

  const supabase = getBrowserSupabase()
  if (!supabase) {
    // Not configured / server — local only, no account path.
    return { ...base, status: 'saved_on_device' }
  }

  const user = await getCurrentAccountUser()
  if (!user) {
    return { ...base, status: 'sign_in_to_back_up' }
  }

  const state = loadLocalMetrixHistory()
  const profiles = state?.profileSnapshots ?? []
  const scores = state?.scoreSnapshots ?? []
  const total = profiles.length + scores.length
  if (total === 0) {
    // Nothing to back up yet — honest device-local state.
    return { ...base, status: 'saved_on_device', total: 0 }
  }

  const assessmentOutcome = await upsertRows(
    ASSESSMENT_TABLE,
    profiles.map(p => assessmentRow(p, user.id)),
  )
  const scoreOutcome = await upsertRows(
    SCORE_TABLE,
    scores.map(s => scoreRow(s, user.id)),
  )

  const written = assessmentOutcome.written + scoreOutcome.written
  const missingTable = assessmentOutcome.missingTable || scoreOutcome.missingTable
  const error = assessmentOutcome.error ?? scoreOutcome.error

  if (missingTable) {
    // Migration 002 not applied yet — fail safe, keep local intact.
    return { ...base, status: 'sync_unavailable', total, error }
  }
  if (written === 0) {
    return { ...base, status: 'sync_unavailable', total, error }
  }

  return {
    status: 'synced_to_account',
    assessmentWritten: assessmentOutcome.written,
    scoreWritten: scoreOutcome.written,
    total,
    lastSyncedAt: nowIso(),
    error,
  }
}

export interface AccountAssessmentHistory {
  assessmentHistory: unknown[]
  scoreHistory: unknown[]
}

/**
 * Read the user's synced assessment + score history back from the account (cross-device
 * hydrate, future use). Read-only; never writes or deletes. Returns empty arrays on any
 * expected failure (signed out, missing table, offline).
 */
export async function loadAssessmentHistoryFromAccount(): Promise<AccountAssessmentHistory> {
  const empty: AccountAssessmentHistory = { assessmentHistory: [], scoreHistory: [] }
  const supabase = getBrowserSupabase()
  if (!supabase) return empty
  const user = await getCurrentAccountUser()
  if (!user) return empty
  try {
    const [a, s] = await Promise.all([
      supabase.from(ASSESSMENT_TABLE).select('payload').eq('user_id', user.id),
      supabase.from(SCORE_TABLE).select('payload').eq('user_id', user.id),
    ])
    return {
      assessmentHistory: a.error ? [] : (a.data ?? []).map(r => (r as { payload: unknown }).payload),
      scoreHistory: s.error ? [] : (s.data ?? []).map(r => (r as { payload: unknown }).payload),
    }
  } catch {
    return empty
  }
}

/**
 * Account-2J: newest-wins reconciliation of local assessment + score history against the
 * account (by id, using createdAt). Returns a RECOMMENDATION only — never overwrites local.
 * Conflict rule: tie/local-newer keeps local; cloud-newer/cloud-only flags a hydrate.
 */
export async function reconcileAssessmentHistoryFromAccount(
  local: TimestampedRecord[],
): Promise<ReconcileResult<TimestampedRecord>> {
  const cloud = await loadAssessmentHistoryFromAccount()
  const flat = [
    ...(cloud.assessmentHistory as TimestampedRecord[]),
    ...(cloud.scoreHistory as TimestampedRecord[]),
  ]
  return reconcileByIdNewestWins(local, flat)
}

/** A non-scary, user-facing message for a given sync status. */
export function getAssessmentSyncErrorMessage(status: AssessmentSyncStatus): string | null {
  switch (status) {
    case 'sync_unavailable':
      return 'Account backup is not available right now. Your history is still saved on this device.'
    case 'sign_in_to_back_up':
      return 'Your history is saved on this device. Sign in later to back it up to your account.'
    case 'saved_on_device':
    case 'synced_to_account':
    default:
      return null
  }
}
