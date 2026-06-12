// ─────────────────────────────────────────────────────────────────────────────
// MetrixAccountSync — account-sync eligibility + preparation (Mega-Phase 3B)
// ─────────────────────────────────────────────────────────────────────────────
// Now wired to REAL account identity via ./accountAuth (Supabase magic-link auth).
// Synchronous reads use accountAuth's last-known cache, never a faked state:
//   • getCurrentAccountUser() returns the cached signed-in account user, or null,
//   • canUseAccountSync() is true only when a real account user is present,
//   • getAccountSyncStatus() → unavailable / local_only / account_available / error,
//   • prepare*ForSync() return null unless a real account user exists.
//
// PREPARATION ONLY — this module still does NOT write to Supabase or any database.
// Cloud history writes are the NEXT phase. Nothing here claims sync is active.
// ─────────────────────────────────────────────────────────────────────────────

import {
  mapProfileToCloud,
  mapScoreSnapshotToCloud,
  mapActionProgressToCloud,
  mapReassessmentToCloud,
  mapManualKpiToCloud,
  mapReminderPreferenceToCloud,
  type AccountMetrixProfile,
  type AccountScoreSnapshot,
  type AccountActionProgress,
  type AccountReassessmentEvent,
  type AccountManualKpiSnapshot,
  type AccountReminderPreference,
} from './metrixCloudSchema'
import type {
  MetrixProfileSnapshot,
  MetrixScoreSnapshot,
  ActionProgressSnapshot,
  ReassessmentEvent,
  MetrixHistoryState,
} from './metrixHistory'
import type { ManualKpiSnapshot } from './metrixKpis'
import type { ReminderPreference } from './metrixReminders'
import { getCachedAccountUser, getCachedAuthStatus, type AccountUser } from './accountAuth'

// Re-export so this module stays the single retention/sync entry point.
export type { AccountUser }

// How eligible the user is for account sync right now — honest, never faked.
export type AccountSyncEligibility = 'unavailable' | 'local_only' | 'account_available' | 'error'

/** The signed-in account user (from accountAuth's last-known cache), or null. */
export function getCurrentAccountUser(): AccountUser | null {
  return getCachedAccountUser()
}

/** True only when a real signed-in account user is present. */
export function canUseAccountSync(): boolean {
  return getCurrentAccountUser() !== null
}

/** Honest sync eligibility from the real auth status. Cloud writes still do NOT exist. */
export function getAccountSyncStatus(): AccountSyncEligibility {
  switch (getCachedAuthStatus()) {
    case 'unavailable': return 'unavailable'
    case 'error':       return 'error'
    case 'signed_in':   return 'account_available'
    case 'signed_out':  return 'local_only'
    default:            return 'local_only'
  }
}

// ── Prepare-for-sync wrappers (return null when there is no account) ───────────
export function prepareProfileForSync(
  profile: MetrixProfileSnapshot,
): AccountMetrixProfile | null {
  const user = getCurrentAccountUser()
  return user ? mapProfileToCloud(profile, user.id) : null
}

export function prepareScoreSnapshotForSync(
  snapshot: MetrixScoreSnapshot,
): AccountScoreSnapshot | null {
  const user = getCurrentAccountUser()
  return user ? mapScoreSnapshotToCloud(snapshot, user.id) : null
}

export function prepareActionProgressForSync(
  snapshot: ActionProgressSnapshot,
): AccountActionProgress | null {
  const user = getCurrentAccountUser()
  return user ? mapActionProgressToCloud(snapshot, user.id) : null
}

export function prepareReassessmentForSync(
  event: ReassessmentEvent,
): AccountReassessmentEvent | null {
  const user = getCurrentAccountUser()
  return user ? mapReassessmentToCloud(event, user.id) : null
}

export function prepareManualKpiForSync(
  snapshot: ManualKpiSnapshot,
): AccountManualKpiSnapshot | null {
  const user = getCurrentAccountUser()
  return user ? mapManualKpiToCloud(snapshot, user.id) : null
}

export function prepareReminderPreferencesForSync(
  prefs: ReminderPreference[],
): AccountReminderPreference[] | null {
  const user = getCurrentAccountUser()
  if (!user) return null
  return prefs.map(p => mapReminderPreferenceToCloud(p, user.id))
}

// ── Whole-history preparation (convenience) ───────────────────────────────────
export interface AccountSyncPayload {
  accountUserId: string
  profile: AccountMetrixProfile | null
  scoreSnapshots: AccountScoreSnapshot[]
  actionProgress: AccountActionProgress[]
  reassessmentEvents: AccountReassessmentEvent[]
  kpiSnapshots: AccountManualKpiSnapshot[]
  reminderPreferences: AccountReminderPreference[]
}

/**
 * Shape an entire local MetrixHistory into an account payload. Returns null when
 * there is no signed-in account (today: always null). Does NOT write anything.
 */
export function prepareHistoryForSync(
  state: MetrixHistoryState,
  reminderPrefs: ReminderPreference[] = [],
): AccountSyncPayload | null {
  const user = getCurrentAccountUser()
  if (!user) return null

  const profileSnapshots = state.profileSnapshots
  const latestProfile = profileSnapshots.length > 0
    ? profileSnapshots[profileSnapshots.length - 1]
    : null

  return {
    accountUserId: user.id,
    profile: latestProfile ? mapProfileToCloud(latestProfile, user.id) : null,
    scoreSnapshots: state.scoreSnapshots.map(s => mapScoreSnapshotToCloud(s, user.id)),
    actionProgress: state.actionProgressSnapshots.map(a => mapActionProgressToCloud(a, user.id)),
    reassessmentEvents: state.reassessmentEvents.map(e => mapReassessmentToCloud(e, user.id)),
    kpiSnapshots: state.kpiSnapshots.map(k => mapManualKpiToCloud(k, user.id)),
    reminderPreferences: reminderPrefs.map(p => mapReminderPreferenceToCloud(p, user.id)),
  }
}
