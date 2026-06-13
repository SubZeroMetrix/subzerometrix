// ─────────────────────────────────────────────────────────────────────────────
// metrix/readiness — Module 3: readiness indicators (pure)
// ─────────────────────────────────────────────────────────────────────────────
// Maps the evaluated kernel MetrixScore into the canonical readiness model. It does
// NOT compute a score — the single scoring kernel (metrixEngine.scoreAssessment via
// metrixReport.buildStarterScore) already did. This is a structural projection so the
// snapshot owns the one authoritative readiness/overall value.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixScore } from '../metrixEngine'
import type { ReadinessIndicators } from './profileTypes'

export function calculateReadiness(score: MetrixScore): ReadinessIndicators {
  return {
    overall: score.overall,
    riskLevel: score.riskLevel,
    riskLabel: score.riskLabel,
    categories: score.categories,
    strengths: score.strengths,
    risks: score.risks,
    progress: score.progress,
  }
}
