// ─────────────────────────────────────────────────────────────────────────────
// metrix/progressStore — device-local priority-progress persistence (SZM-2E, SSR-safe)
// ─────────────────────────────────────────────────────────────────────────────
// REAL device-local storage for one active priority-progress record + a bounded history
// archive. No cloud here (see progressSync). One active record at a time (the user works one
// priority); when the canonical priority changes, the old record is archived and a fresh
// active record starts — old completed steps never count for a new priority.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixProfileSnapshot } from './profileTypes'
import {
  type PersistedPriorityProgress, resetIfPriorityChanged,
} from './progressRecord'

export const PRIORITY_PROGRESS_KEY = 'szm_priority_progress'

interface ProgressBlob {
  active: PersistedPriorityProgress | null
  archive: PersistedPriorityProgress[]
}
const EMPTY_BLOB: ProgressBlob = { active: null, archive: [] }

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function loadProgressBlob(): ProgressBlob {
  if (!hasStorage()) return { ...EMPTY_BLOB }
  try {
    const raw = window.localStorage.getItem(PRIORITY_PROGRESS_KEY)
    if (!raw) return { ...EMPTY_BLOB }
    const parsed = JSON.parse(raw) as ProgressBlob
    return parsed && typeof parsed === 'object'
      ? { active: parsed.active ?? null, archive: Array.isArray(parsed.archive) ? parsed.archive : [] }
      : { ...EMPTY_BLOB }
  } catch {
    return { ...EMPTY_BLOB }
  }
}

function saveProgressBlob(blob: ProgressBlob): void {
  if (!hasStorage()) return
  try {
    window.localStorage.setItem(PRIORITY_PROGRESS_KEY, JSON.stringify(blob))
  } catch {
    // storage unavailable / quota — non-fatal, device-only data
  }
}

/**
 * Resume-or-create the active progress record for the snapshot's current priority. When the
 * priority changed, archives the old record and starts fresh (persisted immediately). On a
 * matching priority, returns the resumed record WITHOUT churning storage.
 */
export function getActiveProgress(snapshot: MetrixProfileSnapshot, now: string): PersistedPriorityProgress {
  const blob = loadProgressBlob()
  const res = resetIfPriorityChanged(blob.active, snapshot, now)
  if (res.changed) {
    const archive = res.archived ? [...blob.archive, res.archived].slice(-20) : blob.archive
    saveProgressBlob({ active: res.active, archive })
  }
  return res.active
}

/** Persist a mutated active record (keeps the existing archive). */
export function persistProgress(record: PersistedPriorityProgress): void {
  const blob = loadProgressBlob()
  saveProgressBlob({ active: record, archive: blob.archive })
}

/** Read-only history archive (older priority records). */
export function getProgressArchive(): PersistedPriorityProgress[] {
  return loadProgressBlob().archive
}
