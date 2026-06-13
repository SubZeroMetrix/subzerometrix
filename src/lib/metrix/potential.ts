// ─────────────────────────────────────────────────────────────────────────────
// metrix/potential — score-headroom projection from the canonical snapshot
// ─────────────────────────────────────────────────────────────────────────────
// Supersedes metrixReport.estimatePotential. The displayed CURRENT score comes from the
// canonical snapshot (no competing recompute); only the hypothetical PROJECTED score runs
// the scoring kernel on improved signals — a clearly-labelled what-if, not the live score.
// Pure.
// ─────────────────────────────────────────────────────────────────────────────

import { scoreAssessment, CRITERIA, type AnswerChoice } from '../metrixEngine'
import type { MetrixProfileSnapshot } from './profileTypes'

export interface PotentialEstimate {
  current: number
  projected: number
  improvement: number
}

export function estimatePotentialFromSnapshot(snapshot: MetrixProfileSnapshot): PotentialEstimate {
  const current = snapshot.readiness.overall // canonical (the live score is read, not recomputed)
  const riskCats = new Set(snapshot.constraintCandidates.map(c => c.category))
  const improved: Record<string, AnswerChoice> = { ...snapshot.signals.choices }
  for (const id of Object.keys(improved)) {
    const crit = CRITERIA.find(c => c.id === id)
    if (crit && riskCats.has(crit.category)) improved[id] = 'strong_documented'
  }
  // What-if simulation only (raising weak-area criteria to "strong"); not the user's score.
  const projected = scoreAssessment({ stage: snapshot.businessContext.stage, answers: improved }).overall
  return { current, projected, improvement: Math.max(0, projected - current) }
}
