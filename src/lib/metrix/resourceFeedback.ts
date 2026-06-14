// ─────────────────────────────────────────────────────────────────────────────
// metrix/resourceFeedback — Wave 5: optional helpfulness + outcome feedback
// ─────────────────────────────────────────────────────────────────────────────
// Lightweight, OPTIONAL, device-local feedback on recommended resources. It feeds future
// recommendation-quality improvement (helpfulness suppression / boost in the adapter) and
// voluntary outcome reporting — and NOTHING else.
//
// HARD RULES:
//   • Never affects MetrixScore, Metrix Priority, gates, paths, or progress.
//   • Never creates testimonials, reviews, review pressure, or public-facing claims.
//   • Privacy-safe: stores ids + an enum + an OPTIONAL short user note (the user's own text,
//     low-risk — never auto-published, never sent to analytics).
//   • SSR-safe: storage helpers no-op when window/localStorage is unavailable.
//   • Deletion coverage: clearResourceFeedback() removes everything.
// ─────────────────────────────────────────────────────────────────────────────

import { safeJsonParse } from '../metrixStorage'
import type { ResourceHelpfulness } from './resourceRecommendations'

export const RESOURCE_FEEDBACK_VERSION = 1
export const RESOURCE_FEEDBACK_KEY = 'szm_resource_feedback'

// Helpfulness + voluntary outcome signals. Mirrors the recommendation adapter's
// ResourceHelpfulness plus outcome/provider signals.
export type ResourceFeedbackType =
  | ResourceHelpfulness          // helpful | not_helpful | already_completed | not_relevant | broken | outdated
  | 'selected_provider'
  | 'outcome_achieved'
  | 'outcome_not_achieved'
  | 'follow_up_needed'

export const RESOURCE_FEEDBACK_TYPES: ResourceFeedbackType[] = [
  'helpful', 'not_helpful', 'already_completed', 'not_relevant', 'broken', 'outdated',
  'selected_provider', 'outcome_achieved', 'outcome_not_achieved', 'follow_up_needed',
]

export interface ResourceFeedbackEntry {
  resourceId: string
  type: ResourceFeedbackType
  note: string | null            // user's own optional text (low-risk; never published)
  createdAt: string
  storageMode: 'local_device'
  schemaVersion: number
}

const MAX_ENTRIES = 500
const MAX_NOTE = 500

function canUseStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

const isValidType = (t: unknown): t is ResourceFeedbackType =>
  typeof t === 'string' && (RESOURCE_FEEDBACK_TYPES as string[]).includes(t)

/** Load all stored feedback entries (most recent last). Defensive against malformed data. */
export function getResourceFeedback(): ResourceFeedbackEntry[] {
  if (!canUseStorage()) return []
  const raw = safeJsonParse<ResourceFeedbackEntry[]>(window.localStorage.getItem(RESOURCE_FEEDBACK_KEY))
  if (!Array.isArray(raw)) return []
  return raw.filter(e => e && typeof e.resourceId === 'string' && isValidType(e.type))
}

/**
 * Record a single feedback entry (idempotent per resourceId+type — the latest replaces an
 * existing same-type entry for the same resource). Returns the updated list. Never throws.
 */
export function recordResourceFeedback(
  resourceId: string, type: ResourceFeedbackType, note: string | null = null, now: string = new Date().toISOString(),
): ResourceFeedbackEntry[] {
  if (typeof resourceId !== 'string' || resourceId.length === 0 || !isValidType(type)) {
    return getResourceFeedback()
  }
  const entry: ResourceFeedbackEntry = {
    resourceId,
    type,
    note: typeof note === 'string' && note.trim() !== '' ? note.trim().slice(0, MAX_NOTE) : null,
    createdAt: now,
    storageMode: 'local_device',
    schemaVersion: RESOURCE_FEEDBACK_VERSION,
  }
  const existing = getResourceFeedback().filter(e => !(e.resourceId === resourceId && e.type === type))
  const next = [...existing, entry].slice(-MAX_ENTRIES)
  if (canUseStorage()) {
    try { window.localStorage.setItem(RESOURCE_FEEDBACK_KEY, JSON.stringify(next)) } catch { /* quota/SSR — non-fatal */ }
  }
  return next
}

/**
 * Build the helpfulness map the recommendation adapter consumes (`Record<resourceId,
 * ResourceHelpfulness>`). Only the helpfulness-class signals are surfaced — outcome/provider
 * signals never suppress or rank recommendations. The most recent helpfulness wins.
 */
export function getHelpfulnessMap(entries: ResourceFeedbackEntry[] = getResourceFeedback()): Record<string, ResourceHelpfulness> {
  const HELPFULNESS: ReadonlySet<string> = new Set<ResourceHelpfulness>([
    'helpful', 'not_helpful', 'already_completed', 'not_relevant', 'broken', 'outdated',
  ])
  const out: Record<string, ResourceHelpfulness> = {}
  for (const e of entries) {
    if (HELPFULNESS.has(e.type)) out[e.resourceId] = e.type as ResourceHelpfulness
  }
  return out
}

/** Resources the user marked as completed/already-done (suppressed in recommendations). */
export function getCompletedResourceIds(entries: ResourceFeedbackEntry[] = getResourceFeedback()): string[] {
  const ids = new Set<string>()
  for (const e of entries) {
    if (e.type === 'already_completed' || e.type === 'outcome_achieved' || e.type === 'selected_provider') ids.add(e.resourceId)
  }
  return Array.from(ids)
}

/** Deletion coverage — wipe all locally stored resource feedback. */
export function clearResourceFeedback(): void {
  if (!canUseStorage()) return
  try { window.localStorage.removeItem(RESOURCE_FEEDBACK_KEY) } catch { /* non-fatal */ }
}
