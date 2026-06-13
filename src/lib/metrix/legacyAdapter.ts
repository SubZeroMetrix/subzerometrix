// ─────────────────────────────────────────────────────────────────────────────
// metrix/legacyAdapter — Module 10: adapt legacy records into the canonical model
// ─────────────────────────────────────────────────────────────────────────────
// Two explicit, bounded adapters:
//   • adaptLegacyScoreResult — for a stored Engine-1 `ScoreResult` (the szm_score blob).
//     It PRESERVES the raw answers and re-evaluates them through the one canonical
//     pipeline, marking source='legacy_szm_score' + legacySource{engine:'engine1',…}. It
//     does NOT pretend the new ruleset produced the OLD number — the original E1 overall/
//     band are carried in legacySource, and the canonical readiness is the freshly derived
//     value from the preserved answers.
//   • adaptLegacyHistorySnapshot — for a stored Engine-2 history snapshot (no raw answers).
//     A READ-MODEL-ONLY mapping (no re-evaluation possible); marked source='legacy_history'
//     with empty signals/flags. Bounded by what the old record actually contains.
// Neither adapter rewrites or deletes the original record.
// ─────────────────────────────────────────────────────────────────────────────

import type { ScoreResult } from '../scoring'
import type { QuickIntake } from '../intake'
import { CATEGORY_LABELS, type MetrixCategory, type RiskLevel } from '../metrixEngine'
import type { MetrixScoreSnapshot } from '../metrixHistory'
import {
  PROFILE_SCHEMA_VERSION, SCORING_VERSION, RULESET_VERSION,
  type MetrixProfileSnapshot, type EvaluateOptions, type LegacySourceMeta,
} from './profileTypes'
import { evaluateMetrixProfile } from './snapshot'

/** Structural detector for a stored Engine-1 ScoreResult (the szm_score shape). */
export function isLegacyScoreResult(value: unknown): value is ScoreResult {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.overall === 'number' &&
    typeof v.band === 'string' &&
    typeof v.categoryScores === 'object' && v.categoryScores !== null &&
    typeof v.answers === 'object' && v.answers !== null
  )
}

/**
 * Adapt a stored Engine-1 ScoreResult into a canonical snapshot by re-evaluating its
 * PRESERVED raw answers through the canonical pipeline. Marks legacy provenance.
 */
export function adaptLegacyScoreResult(
  scoreResult: ScoreResult,
  intake: QuickIntake | null,
  opts: EvaluateOptions = {},
): MetrixProfileSnapshot {
  const legacySource: LegacySourceMeta = {
    engine: 'engine1',
    originalOverall: typeof scoreResult.overall === 'number' ? scoreResult.overall : null,
    originalBand: scoreResult.band ?? null,
    originalCompletedAt: scoreResult.completedAt ?? null,
    note: 'Canonical readiness was derived now from the preserved raw answers; the original Engine-1 overall/band are retained for reference and are NOT the canonical score.',
  }
  return evaluateMetrixProfile(scoreResult.answers, intake, {
    ...opts,
    source: opts.source ?? 'legacy_szm_score',
    now: opts.now ?? scoreResult.completedAt ?? undefined,
    legacySource,
  })
}

/**
 * Read-model-only mapping of a stored Engine-2 history snapshot (no raw answers, so no
 * re-evaluation). Fills what the old record provides; unknown structure fields are zeroed
 * and the record is clearly marked legacy_history.
 */
export function adaptLegacyHistorySnapshot(snap: MetrixScoreSnapshot): MetrixProfileSnapshot {
  const categories = (snap.categories ?? []).map(c => ({
    category: c.category as MetrixCategory,
    label: CATEGORY_LABELS[c.category as MetrixCategory] ?? String(c.category),
    score: c.score,
    weight: 0,
    answered: 0,
    total: 3,
    notSure: 0,
  }))
  const createdAt = snap.createdAt ?? new Date().toISOString()
  return {
    profileId: `mp_legacy_${snap.id}`,
    assessmentId: null,
    userId: null,
    profileSchemaVersion: PROFILE_SCHEMA_VERSION,
    scoringVersion: SCORING_VERSION,
    rulesetVersion: RULESET_VERSION,
    createdAt,
    source: 'legacy_history',
    businessContext: {
      trade: snap.trade ?? null,
      region: snap.region ?? null,
      stage: (snap.businessStage ?? '') as MetrixProfileSnapshot['businessContext']['stage'],
      stageGroup: 'establishing',
    },
    normalizedAnswers: {
      rawAnswers: {},                 // not available in a history snapshot
      intake: null,
      stage: (snap.businessStage ?? '') as MetrixProfileSnapshot['businessContext']['stage'],
      trade: snap.trade ?? null,
      region: snap.region ?? null,
    },
    signals: { choices: {}, answeredCount: 0, notSureCount: 0 },
    readiness: {
      overall: snap.overall,
      riskLevel: (snap.riskLevel ?? 'elevated') as RiskLevel,
      riskLabel: snap.riskLabel ?? '',
      categories,
      strengths: [],
      risks: [],
      progress: {
        completion: snap.profileCompletion ?? 0,
        confidence: 0,
        confidenceLabel: 'Low',
        answered: 0,
        total: 21,
        notSure: 0,
      },
    },
    criticalFlagCandidates: [],
    constraintCandidates: [],
    prioritySeed: { focusCategory: null, focusLabel: '', rationale: '', path: { id: 'foundation', label: '', focusCategory: null, focusLabel: '', rationale: '' } },
    profileQuality: {
      coverage: { answered: 0, total: 21, level: 'minimal' },
      evidenceQuality: 'inferred',
      dataFreshness: { basisDate: createdAt, category: 'fresh' },
      notSureCount: 0,
    },
    roadmapSeed: { steps: [] },
    // SZM-2 fields — not derivable from a history snapshot (no raw answers); truthful empties.
    criticalGates: [],
    metrixPriority: {
      priorityId: 'priority_unknown',
      title: 'Priority not available for legacy record',
      requiredOutcome: 'Re-take the assessment to generate a current Metrix Priority.',
      rationale: 'Historical snapshot without raw answers; a current priority cannot be derived.',
      domain: 'data_quality',
      domainCategory: 'business_foundation',
      severity: 'informational',
      sourceGateIds: [],
      sourceConstraintIds: [],
      reasonCodes: ['legacy_record'],
      dependencies: [],
      blockedRecommendations: [],
      firstAction: 'Re-take the assessment.',
      completionCriteria: 'A current snapshot exists.',
      reassessmentTrigger: 'On next assessment.',
      evidenceStatus: 'no_evidence',
      rulesetVersion: RULESET_VERSION,
      rank: 1,
    },
    secondaryPriorities: [],
    blockedRecommendations: [],
    nextBestQuestions: [],
    legacySource: {
      engine: 'engine2',
      originalOverall: snap.overall,
      originalBand: snap.riskLabel ?? null,
      originalCompletedAt: createdAt,
      note: 'Read-model mapping of a stored Engine-2 history snapshot; raw answers are unavailable so it cannot be re-evaluated.',
    },
  }
}
