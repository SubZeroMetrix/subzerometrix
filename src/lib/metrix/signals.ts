// ─────────────────────────────────────────────────────────────────────────────
// metrix/signals — Module 2: derive profile signals (pure)
// ─────────────────────────────────────────────────────────────────────────────
// Maps normalized answers → the criterion-level choice set (the 21-criterion map).
// Reuses the SINGLE existing mapping kernel (metrixReport.buildStarterResponse) so
// there is exactly one place that knows how answers become criterion signals — no
// competing derivation. Pure.
// ─────────────────────────────────────────────────────────────────────────────

import { buildStarterResponse } from '../metrixReport'
import { EMPTY_INTAKE, type QuickIntake } from '../intake'
import type { NormalizedAssessment, ProfileSignals } from './profileTypes'

// Rebuild the QuickIntake shape the mapping kernel expects from the normalized subset.
function intakeForKernel(n: NormalizedAssessment): QuickIntake | null {
  if (!n.intake) return null
  return {
    ...EMPTY_INTAKE,
    stage: n.intake.stage,
    trade: n.intake.trade ?? '',
    region: n.intake.region ?? '',
    teamSize: n.intake.teamSize ?? '',
    mainGoal: n.intake.mainGoal ?? '',
    biggestChallenge: n.intake.biggestChallenge ?? '',
    confidence: n.intake.confidence ?? '',
    yearsInBusiness: n.intake.yearsInBusiness ?? '',
    revenueRange: n.intake.revenueRange ?? '',
  }
}

export function deriveProfileSignals(normalized: NormalizedAssessment): ProfileSignals {
  const response = buildStarterResponse(normalized.rawAnswers, intakeForKernel(normalized))
  const choices = response.answers
  const values = Object.values(choices)
  return {
    choices,
    answeredCount: values.length,
    notSureCount: values.filter(c => c === 'not_sure').length,
  }
}
