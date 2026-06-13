// ─────────────────────────────────────────────────────────────────────────────
// metrix/constraints — Module 5: constraint candidates (pure)
// ─────────────────────────────────────────────────────────────────────────────
// Ranks the readiness model's weakest categories into ordered constraint candidates.
// These seed prioritization and the roadmap; they are NOT the Growth Engine's runtime
// constraint diagnosis (that system stays isolated by design). Pure.
// ─────────────────────────────────────────────────────────────────────────────

import type { ReadinessIndicators, ConstraintCandidate } from './profileTypes'

export function deriveConstraintCandidates(readiness: ReadinessIndicators): ConstraintCandidate[] {
  return readiness.risks.map((r, i) => ({
    category: r.category,
    label: r.label,
    score: r.score,
    severity: r.severity,
    rank: i + 1,
  }))
}
