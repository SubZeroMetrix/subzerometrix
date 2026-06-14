// ─────────────────────────────────────────────────────────────────────────────
// metrix/progressiveQuestions — highest-value next questions only (Wave 2, pure)
// ─────────────────────────────────────────────────────────────────────────────
// Selects the few highest-value next questions from the canonical snapshot's already-
// ranked nextBestQuestions. It DOES NOT generate a new question engine — it filters and
// bounds the canonical candidates:
//   • highest-value first (the engine's rank, driven by stage/trade/state/priority/gates/
//     missing fields/evidence);
//   • prevents repeats (dedupe by questionKey) and irrelevant asks (already answered in raw
//     answers, or dismissed by the user);
//   • preserves raw answers + question IDs (never mutates; keeps candidateId/keys);
//   • returns few or none so initial value never depends on a long assessment.
// Deterministic and defensive against malformed/legacy snapshots.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixProfileSnapshot, RawAnswers, NextBestQuestion } from './profileTypes'

export interface ProgressiveQuestionOptions {
  limit?: number          // default 3
  dismissed?: string[]    // question/evidence/candidate ids the user has dismissed (UI state)
}

// Is a key already answered in the preserved raw answers? (non-empty value present)
function isAnswered(raw: RawAnswers, key: string): boolean {
  const v = (raw as Record<string, unknown>)[key]
  if (v == null) return false
  if (typeof v === 'string') return v.trim() !== ''
  if (Array.isArray(v)) return v.length > 0
  return true
}

/**
 * The bounded, deduped, relevant set of next-best questions to actually ask. Already ranked
 * by the canonical engine; this never re-scores or invents questions.
 */
export function selectProgressiveQuestions(
  s: MetrixProfileSnapshot,
  opts: ProgressiveQuestionOptions = {},
): NextBestQuestion[] {
  const limit = Math.max(0, opts.limit ?? 3)
  if (limit === 0) return []
  const dismissed = new Set(opts.dismissed ?? [])
  const raw = (s?.normalizedAnswers?.rawAnswers ?? {}) as RawAnswers
  const candidates = Array.isArray(s?.nextBestQuestions) ? s.nextBestQuestions : []

  const seen = new Set<string>()
  const out: NextBestQuestion[] = []
  for (const q of candidates) {
    if (!q || typeof q.questionKey !== 'string') continue
    if (seen.has(q.questionKey)) continue                                  // no repeats
    if (dismissed.has(q.candidateId) || dismissed.has(q.questionKey) || dismissed.has(q.evidenceKey)) continue
    if (isAnswered(raw, q.questionKey) || isAnswered(raw, q.evidenceKey)) continue  // not already answered
    seen.add(q.questionKey)
    out.push(q)
    if (out.length >= limit) break
  }
  return out
}

/** True when there is at least one high-value question worth surfacing right now. */
export function hasProgressiveQuestions(s: MetrixProfileSnapshot, opts: ProgressiveQuestionOptions = {}): boolean {
  return selectProgressiveQuestions(s, { ...opts, limit: opts.limit ?? 3 }).length > 0
}
