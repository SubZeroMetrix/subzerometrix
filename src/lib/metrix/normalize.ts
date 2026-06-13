// ─────────────────────────────────────────────────────────────────────────────
// metrix/normalize — Module 1: normalize assessment answers (pure)
// ─────────────────────────────────────────────────────────────────────────────
// Produces a single normalized shape from the raw assessment answers + Quick Intake.
// RAW ANSWERS ARE PRESERVED VERBATIM (never mutated). Intake is reduced to the stable
// subset the engine uses, so the same inputs always normalize identically.
// ─────────────────────────────────────────────────────────────────────────────

import type { RawAnswers } from '../scoring'
import type { QuickIntake, BusinessStage } from '../intake'
import type { NormalizedAssessment, NormalizedIntake } from './profileTypes'

function s(v: string | undefined | null): string | null {
  const t = (v ?? '').trim()
  return t === '' ? null : t
}

export function normalizeIntake(intake: QuickIntake | null): NormalizedIntake | null {
  if (!intake) return null
  return {
    stage: (intake.stage ?? '') as BusinessStage | '',
    trade: s(intake.trade),
    region: s(intake.region),
    teamSize: s(intake.teamSize),
    mainGoal: s(intake.mainGoal),
    biggestChallenge: s(intake.biggestChallenge),
    confidence: s(intake.confidence),
    yearsInBusiness: s(intake.yearsInBusiness),
    revenueRange: s(intake.revenueRange),
  }
}

export function normalizeAssessment(
  rawAnswers: RawAnswers,
  intake: QuickIntake | null,
): NormalizedAssessment {
  const ni = normalizeIntake(intake)
  // Stage precedence mirrors the existing engine: intake stage first, then the
  // in-assessment stage answer. (metrixReport.ts:buildStarterResponse)
  const stage = (ni?.stage || (rawAnswers.stage as BusinessStage) || '') as BusinessStage | ''
  return {
    rawAnswers,                       // preserved exactly
    intake: ni,
    stage,
    trade: ni?.trade ?? s(rawAnswers.business_type) ?? null,
    region: ni?.region ?? s(rawAnswers.location?.state) ?? null,
  }
}
