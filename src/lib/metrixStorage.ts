// ─────────────────────────────────────────────────────────────────────────────
// MetrixStorage — DEVICE-ONLY local storage helpers (Mega-Phase 1: data/model only)
// ─────────────────────────────────────────────────────────────────────────────
// Browser localStorage helpers ONLY. This is device-only persistence:
//   • No Supabase.
//   • No cookies.
//   • No auth.
//   • No cross-device sync (that is a LATER, cloud-account phase).
// Every function is SSR-safe: it no-ops when window/localStorage is unavailable.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixHistoryState, MetrixProfileSnapshot } from './metrixHistory'

// Device-only storage keys (mirror the existing szm_* localStorage convention).
export const METRIX_STORAGE_KEYS = {
  history: 'szm_metrix_history',
  profile: 'szm_metrix_profile',
} as const

// True only in a browser with a usable localStorage (guards SSR + private mode).
function isBrowserStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

// Safe JSON parse — never throws; returns null on missing or malformed data.
export function safeJsonParse<T>(raw: string | null): T | null {
  if (raw === null) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

// ── MetrixHistory (device-only) ───────────────────────────────────────────────
export function loadLocalMetrixHistory(): MetrixHistoryState | null {
  if (!isBrowserStorageAvailable()) return null
  return safeJsonParse<MetrixHistoryState>(window.localStorage.getItem(METRIX_STORAGE_KEYS.history))
}

export function saveLocalMetrixHistory(state: MetrixHistoryState): void {
  if (!isBrowserStorageAvailable()) return
  try {
    window.localStorage.setItem(METRIX_STORAGE_KEYS.history, JSON.stringify(state))
  } catch {
    // storage unavailable / quota exceeded — non-fatal, device-only data
  }
}

export function clearLocalMetrixHistory(): void {
  if (!isBrowserStorageAvailable()) return
  try {
    window.localStorage.removeItem(METRIX_STORAGE_KEYS.history)
  } catch {
    // non-fatal
  }
}

// ── MetrixProfile snapshot (device-only) ──────────────────────────────────────
export function loadLocalMetrixProfile(): MetrixProfileSnapshot | null {
  if (!isBrowserStorageAvailable()) return null
  return safeJsonParse<MetrixProfileSnapshot>(window.localStorage.getItem(METRIX_STORAGE_KEYS.profile))
}

export function saveLocalMetrixProfile(profile: MetrixProfileSnapshot): void {
  if (!isBrowserStorageAvailable()) return
  try {
    window.localStorage.setItem(METRIX_STORAGE_KEYS.profile, JSON.stringify(profile))
  } catch {
    // non-fatal
  }
}

export function clearLocalMetrixProfile(): void {
  if (!isBrowserStorageAvailable()) return
  try {
    window.localStorage.removeItem(METRIX_STORAGE_KEYS.profile)
  } catch {
    // non-fatal
  }
}
