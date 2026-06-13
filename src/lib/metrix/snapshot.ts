// ─────────────────────────────────────────────────────────────────────────────
// metrix/snapshot — Module 8: evaluate the canonical Metrix Profile (orchestrator)
// ─────────────────────────────────────────────────────────────────────────────
// THE CANONICAL EVALUATOR. One assessment → one evaluation → one versioned snapshot.
// It calls the single scoring kernel (metrixReport.buildStarterScore) EXACTLY ONCE and
// composes the focused modules around it. No consumer should score independently — they
// read this snapshot (see readModel.toMetrixScore). Stays modular: this file only wires
// the pure modules together; it contains no scoring math of its own.
//
// Determinism: with the same normalized inputs + version constants + EvaluateOptions
// (profileId, now), the produced snapshot is byte-identical.
// ─────────────────────────────────────────────────────────────────────────────

import { buildStarterScore } from '../metrixReport'
import { EMPTY_INTAKE, type QuickIntake } from '../intake'
import type { RawAnswers } from '../scoring'
import {
  PROFILE_SCHEMA_VERSION, SCORING_VERSION, RULESET_VERSION,
  type MetrixProfileSnapshot, type EvaluateOptions, type NormalizedAssessment,
} from './profileTypes'
import { normalizeAssessment } from './normalize'
import { deriveProfileSignals } from './signals'
import { calculateReadiness } from './readiness'
import { deriveCriticalFlagCandidates } from './criticalFlags'
import { deriveConstraintCandidates } from './constraints'
import { derivePrioritySeed } from './priority'
import { deriveRoadmapSeed } from './roadmapSeed'
import { deriveProfileQuality } from './quality'

function newProfileId(): string {
  const g = globalThis as unknown as { crypto?: { randomUUID?: () => string } }
  if (g.crypto?.randomUUID) return `mp_${g.crypto.randomUUID()}`
  return `mp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

// Rebuild the QuickIntake shape the kernel expects from the normalized subset.
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

export function evaluateMetrixProfile(
  rawAnswers: RawAnswers,
  intake: QuickIntake | null,
  opts: EvaluateOptions = {},
): MetrixProfileSnapshot {
  const createdAt = opts.now ?? new Date().toISOString()
  const normalized = normalizeAssessment(rawAnswers, intake)
  const signals = deriveProfileSignals(normalized)

  // The ONE scoring call. Everything downstream is a pure projection of this result.
  const score = buildStarterScore(normalized.rawAnswers, intakeForKernel(normalized))

  const readiness = calculateReadiness(score)
  const constraintCandidates = deriveConstraintCandidates(readiness)
  const prioritySeed = derivePrioritySeed(score)

  return {
    profileId: opts.profileId ?? newProfileId(),
    assessmentId: opts.assessmentId ?? null,
    userId: opts.userId ?? null,
    profileSchemaVersion: PROFILE_SCHEMA_VERSION,
    scoringVersion: SCORING_VERSION,
    rulesetVersion: RULESET_VERSION,
    createdAt,
    source: opts.source ?? 'assessment',
    businessContext: {
      trade: normalized.trade,
      region: normalized.region,
      stage: score.stage,
      stageGroup: score.stageGroup,
    },
    normalizedAnswers: normalized,
    signals,
    readiness,
    criticalFlagCandidates: deriveCriticalFlagCandidates(normalized, signals),
    constraintCandidates,
    prioritySeed,
    profileQuality: deriveProfileQuality(signals, createdAt, createdAt),
    roadmapSeed: deriveRoadmapSeed(prioritySeed, constraintCandidates),
    ...(opts.legacySource ? { legacySource: opts.legacySource } : {}),
  }
}
