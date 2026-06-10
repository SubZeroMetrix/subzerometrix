// ─────────────────────────────────────────────────────────────────────────────
// Feedback — "Did this result feel accurate?" capture (MVP, local storage)
// ─────────────────────────────────────────────────────────────────────────────
// Stored locally only. There is no Supabase `feedback` table in the schema, and
// adding one is out of scope here, so test-user feedback is persisted in the
// browser (key: szm_feedback) with enough context (score, band, email) to be
// useful. Swap saveFeedback() for a Supabase insert later if a table is added.
// ─────────────────────────────────────────────────────────────────────────────

export type AccuracyRating = 'very' | 'mostly' | 'somewhat' | 'not'

export const ACCURACY_OPTIONS: { value: AccuracyRating; label: string }[] = [
  { value: 'very',     label: 'Very accurate' },
  { value: 'mostly',   label: 'Mostly accurate' },
  { value: 'somewhat', label: 'Somewhat accurate' },
  { value: 'not',      label: 'Not accurate' },
]

export interface FeedbackContext {
  score?: number
  band?: string
  email?: string
  stage?: string
}

export interface FeedbackEntry extends FeedbackContext {
  rating: AccuracyRating
  whatMissing: string
  submittedAt: string
}

export const FEEDBACK_STORAGE_KEY = 'szm_feedback'

export function saveFeedback(entry: FeedbackEntry): void {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY)
    const list: FeedbackEntry[] = raw ? (JSON.parse(raw) as FeedbackEntry[]) : []
    list.push(entry)
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(list))
  } catch {
    // storage unavailable (private mode, etc.) — non-fatal
  }
}

export function loadFeedback(): FeedbackEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as FeedbackEntry[]) : []
  } catch {
    return []
  }
}
