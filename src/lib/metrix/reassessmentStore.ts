// ─────────────────────────────────────────────────────────────────────────────
// metrix/reassessmentStore — device-local reassessment history (SZM-2F, SSR-safe)
// ─────────────────────────────────────────────────────────────────────────────
// REAL device-local storage for the bounded list of completed reassessments. No cloud
// here and NO invented cloud table — this mirrors the device-local progress store and
// stays authoritative on-device until a proven account table exists. Malformed/legacy
// blobs degrade to an empty list rather than throwing.
// ─────────────────────────────────────────────────────────────────────────────

import type { ReassessmentRecord } from './reassessment'

export const REASSESSMENT_HISTORY_KEY = 'szm_reassessment_history'
const MAX_RECORDS = 20

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

/** Read the bounded reassessment history (oldest → newest). Never throws. */
export function loadReassessmentHistory(): ReassessmentRecord[] {
  if (!hasStorage()) return []
  try {
    const raw = window.localStorage.getItem(REASSESSMENT_HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ReassessmentRecord[]) : []
  } catch {
    return []
  }
}

/** Persist the bounded reassessment history (keeps only the most recent records). */
export function saveReassessmentHistory(history: ReassessmentRecord[]): void {
  if (!hasStorage()) return
  try {
    const bounded = Array.isArray(history) ? history.slice(-MAX_RECORDS) : []
    window.localStorage.setItem(REASSESSMENT_HISTORY_KEY, JSON.stringify(bounded))
  } catch {
    // storage unavailable / quota — non-fatal, device-only data
  }
}

/** The most recent reassessment record (for "what changed last time"), or null. */
export function getLatestReassessment(): ReassessmentRecord | null {
  const history = loadReassessmentHistory()
  return history.length > 0 ? history[history.length - 1] : null
}
