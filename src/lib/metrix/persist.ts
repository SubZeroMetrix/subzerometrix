// ─────────────────────────────────────────────────────────────────────────────
// metrix/persist — Module 9: persist + reload the canonical snapshot (SSR-safe)
// ─────────────────────────────────────────────────────────────────────────────
// One canonical local store: `szm_metrix_canonical`. getCanonicalProfile is the single
// entry every live consumer uses — it returns the persisted snapshot when it matches the
// current assessment + schema version, otherwise it evaluates ONCE and persists. This is
// how "evaluate once, read many" holds: pages read this, they never run a second engine.
// Never throws into the UI; never deletes raw answers.
// ─────────────────────────────────────────────────────────────────────────────

import type { RawAnswers } from '../scoring'
import type { QuickIntake } from '../intake'
import { PROFILE_SCHEMA_VERSION, type MetrixProfileSnapshot, type EvaluateOptions } from './profileTypes'
import { evaluateMetrixProfile } from './snapshot'

export const CANONICAL_PROFILE_KEY = 'szm_metrix_canonical'

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function loadMetrixProfile(): MetrixProfileSnapshot | null {
  if (!hasStorage()) return null
  try {
    const raw = window.localStorage.getItem(CANONICAL_PROFILE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as MetrixProfileSnapshot
    return parsed && typeof parsed === 'object' && Array.isArray(parsed.readiness?.categories)
      ? parsed
      : null
  } catch {
    return null
  }
}

export function persistMetrixProfile(snapshot: MetrixProfileSnapshot): void {
  if (!hasStorage()) return
  try {
    window.localStorage.setItem(CANONICAL_PROFILE_KEY, JSON.stringify(snapshot))
  } catch {
    // storage unavailable / quota — non-fatal, device-only data
  }
}

function sameAssessment(snapshot: MetrixProfileSnapshot, rawAnswers: RawAnswers): boolean {
  try {
    return JSON.stringify(snapshot.normalizedAnswers.rawAnswers) === JSON.stringify(rawAnswers)
  } catch {
    return false
  }
}

/**
 * The canonical read/evaluate entry. Returns a persisted snapshot when it matches the
 * current answers + schema version; otherwise evaluates once and persists. Pure inputs →
 * deterministic content (persistence is the only side effect, and it is idempotent).
 */
export function getCanonicalProfile(
  rawAnswers: RawAnswers,
  intake: QuickIntake | null,
  opts: EvaluateOptions = {},
): MetrixProfileSnapshot {
  const existing = loadMetrixProfile()
  if (
    existing &&
    existing.profileSchemaVersion === PROFILE_SCHEMA_VERSION &&
    sameAssessment(existing, rawAnswers)
  ) {
    return existing
  }
  const snapshot = evaluateMetrixProfile(rawAnswers, intake, opts)
  persistMetrixProfile(snapshot)
  return snapshot
}
