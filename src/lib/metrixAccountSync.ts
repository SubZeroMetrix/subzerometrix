// ─────────────────────────────────────────────────────────────────────────────
// MetrixAccountSync — safe account-sync preparation (Mega-Phase 3)
// ─────────────────────────────────────────────────────────────────────────────
// PREPARATION ONLY. There is NO auth/session in the app yet, so:
//   • getCurrentAccountUser() always returns null today,
//   • canUseAccountSync() is always false today,
//   • every prepare*ForSync() returns null today,
//   • getAccountSyncStatus() reports 'local_only'.
//
// Nothing here writes to Supabase or any database, and nothing claims sync is
// active. These wrappers exist so that the day real account auth ships, the local
// retention models can be shaped into account payloads in one place — without any
// other part of the app changing.
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
  type CloudStorageStatus,
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

export interface AccountUser {
  id: string
  email: string | null
}

/**
 * The signed-in account user, or null. No auth exists yet, so this ALWAYS returns
 * null today. (Future: read from a real Supabase/auth session.)
 */
export function getCurrentAccountUser(): AccountUser | null {
  return null
}

/**
 * Whether account-based cloud sync can be used right now. Requires a signed-in
 * account AND a wired sync backend — both are future work, so this is false today.
 */
export function canUseAccountSync(): boolean {
  return getCurrentAccountUser() !== null
}

/** Honest current status. Always 'local_only' until auth + sync ship. */
export function getAccountSyncStatus(): CloudStorageStatus {
  return canUseAccountSync() ? 'cloud_ready' : 'local_only'
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
