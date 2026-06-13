// ─────────────────────────────────────────────────────────────────────────────
// metrix/profileTypes — Canonical Metrix Profile types + version constants (SZM-1)
// ─────────────────────────────────────────────────────────────────────────────
// The ONE canonical, versioned snapshot produced by a single assessment evaluation.
// Pure types + version constants only — no logic, no React/Next/Supabase. Every live
// consumer (results, report, dashboard, history sync) reads THIS model rather than
// recomputing a competing score.
//
// Determinism contract: given the same normalized inputs AND the same
// profileSchemaVersion + scoringVersion + rulesetVersion, the derived content
// (readiness, constraints, priority seed, roadmap seed, quality) is identical.
// Only the metadata envelope (ids, createdAt) varies and is injectable for tests.
// ─────────────────────────────────────────────────────────────────────────────

import type { RawAnswers } from '../scoring'
import type { BusinessStage, QuickIntake } from '../intake'
import type {
  AnswerChoice, MetrixCategory, MetrixCategoryScore, MetrixStrength, MetrixRisk,
  MetrixProfileProgress, RecommendedPath, RiskLevel, RiskSeverity,
} from '../metrixEngine'

// ── Version constants (bump deliberately; adapters key off these) ──────────────
export const PROFILE_SCHEMA_VERSION = 2  // SZM-2: added critical gates + Metrix Priority + questions
export const SCORING_VERSION = 1         // scoring math unchanged
export const RULESET_VERSION = 2         // SZM-2: critical-gate + priority policy

export type StageGroup = 'early' | 'establishing' | 'growth' | 'reset'

export type ProfileSource =
  | 'assessment'         // freshly evaluated from a completed assessment
  | 'reassessment'       // a later re-take
  | 'legacy_szm_score'   // adapted from a stored Engine-1 ScoreResult (raw answers preserved)
  | 'legacy_history'     // adapted (read-model only) from a stored Engine-2 history snapshot

// ── Business context (display + routing context; not a score input by itself) ──
export interface BusinessContext {
  trade: string | null
  region: string | null
  stage: BusinessStage | ''
  stageGroup: StageGroup
}

// ── 1. Normalized assessment (raw answers ALWAYS preserved verbatim) ───────────
export interface NormalizedIntake {
  stage: BusinessStage | ''
  trade: string | null
  region: string | null
  teamSize: string | null
  mainGoal: string | null
  biggestChallenge: string | null
  confidence: string | null
  yearsInBusiness: string | null
  revenueRange: string | null
}

export interface NormalizedAssessment {
  rawAnswers: RawAnswers             // preserved exactly as captured
  intake: NormalizedIntake | null    // preserved subset of QuickIntake
  stage: BusinessStage | ''
  trade: string | null
  region: string | null
}

// ── 2. Profile signals (the criterion-level choices derived from answers) ──────
export interface ProfileSignals {
  choices: Record<string, AnswerChoice>   // criterionId → choice (the 21-criterion map)
  answeredCount: number
  notSureCount: number
}

// ── 3. Readiness indicators (derived presentation score + per-category) ────────
// `progress` is a backward-compat passthrough of the kernel's profile-progress object
// (used to rehydrate the legacy MetrixScore shape). The NEW, clean data-quality concept
// lives in ProfileQuality and intentionally exposes no confidence percentage.
export interface ReadinessIndicators {
  overall: number                    // derived for PRESENTATION (single source of truth)
  riskLevel: RiskLevel
  riskLabel: string
  categories: MetrixCategoryScore[]
  strengths: MetrixStrength[]
  risks: MetrixRisk[]
  progress: MetrixProfileProgress    // compat passthrough (not the canonical quality model)
}

// ── 4. Critical-flag candidates (STRUCTURE for SZM-2; not final gate policy) ───
export type CriticalFlagSeverity = 'blocker_candidate' | 'watch'
export interface CriticalFlagCandidate {
  id: string
  label: string
  category: MetrixCategory
  severity: CriticalFlagSeverity
  basis: string                      // why it was flagged (explainable)
}

// ── 5. Constraint candidates (ranked weak areas; seed for prioritization) ──────
export interface ConstraintCandidate {
  category: MetrixCategory
  label: string
  score: number
  severity: RiskSeverity
  rank: number
}

// ── 6. Priority seed (the single focus + explainable rationale + path) ─────────
export interface PrioritySeed {
  focusCategory: MetrixCategory | null
  focusLabel: string
  rationale: string
  path: RecommendedPath              // {id,label,focusCategory,focusLabel,rationale}
}

// ── 7. Roadmap seed (ordered category seed only — NOT full action content) ─────
export interface RoadmapSeedStep {
  order: number
  category: MetrixCategory
  reason: 'priority_focus' | 'dependency' | 'constraint' | 'foundation_default'
}
export interface RoadmapSeed {
  steps: RoadmapSeedStep[]
}

// ── SZM-2: Critical gates ──────────────────────────────────────────────────────
export type GateDomain =
  | 'licensing' | 'entity' | 'insurance' | 'banking' | 'financial_visibility'
  | 'pricing' | 'customer_path' | 'capacity' | 'quality' | 'owner_dependency'
  | 'data_quality' | 'growth'

// Bounded statuses — never claim "cleared" when required evidence is missing.
export type GateStatus = 'triggered' | 'possible' | 'cleared' | 'unknown' | 'not_applicable'
export type GateSeverity = 'blocking' | 'critical' | 'high' | 'moderate' | 'informational'
export type EvidenceStatus = 'evidence_backed' | 'partial_evidence' | 'low_evidence' | 'no_evidence'
export type GateSourceType = 'assessment' | 'intake' | 'derived'

export interface CriticalGate {
  id: string
  domain: GateDomain
  severity: GateSeverity
  status: GateStatus
  title: string
  explanation: string
  reasonCodes: string[]
  triggeringEvidence: string[]
  missingEvidence: string[]
  affectedStage: StageGroup | 'all'
  blocksGrowth: boolean
  blocksPaidWork: boolean
  blocksStageAdvance: boolean
  requiredOutcome: string
  resolutionPathIds: string[]
  evidenceStatus: EvidenceStatus
  sourceType: GateSourceType
  rulesetVersion: number
}

// ── SZM-2: Blocked recommendations (growth work suppressed by an active gate) ──
export interface BlockedRecommendation {
  id: string
  label: string
  reason: string
  blockedByGateId: string
}

// ── SZM-2: Metrix Priority (the single most important next outcome) ────────────
export interface MetrixPriority {
  priorityId: string
  title: string
  requiredOutcome: string
  rationale: string
  domain: GateDomain
  domainCategory: MetrixCategory
  severity: GateSeverity
  sourceGateIds: string[]
  sourceConstraintIds: string[]
  reasonCodes: string[]
  dependencies: string[]
  blockedRecommendations: string[]
  firstAction: string
  completionCriteria: string
  reassessmentTrigger: string
  evidenceStatus: EvidenceStatus
  rulesetVersion: number
  rank: number
}

// ── SZM-2: Next-best-question candidates (progressive profiling) ───────────────
export type QuestionUrgency = 'now' | 'soon' | 'later'
export type QuestionImpact = 'changes_priority' | 'confirms_gate' | 'refines_roadmap' | 'improves_confidence'
export type QuestionDataStatus = 'missing' | 'uncertain' | 'conflicting' | 'low_confidence'
export interface NextBestQuestion {
  candidateId: string
  questionKey: string
  evidenceKey: string
  reason: string
  relatedGateId: string | null
  expectedDecisionImpact: QuestionImpact
  urgency: QuestionUrgency
  blocking: boolean
  currentDataStatus: QuestionDataStatus
  rank: number
}

// ── Profile quality (coverage / evidence quality / freshness — NO confidence %) ─
export type CoverageLevel = 'minimal' | 'partial' | 'substantial'
export type EvidenceQuality = 'inferred' | 'self_reported' | 'mixed'
export type FreshnessCategory = 'fresh' | 'recent' | 'stale'
export interface ProfileQuality {
  coverage: { answered: number; total: number; level: CoverageLevel }
  evidenceQuality: EvidenceQuality
  dataFreshness: { basisDate: string; category: FreshnessCategory }
  notSureCount: number
}

// ── Legacy provenance metadata ─────────────────────────────────────────────────
export interface LegacySourceMeta {
  engine: 'engine1' | 'engine2'
  originalOverall: number | null
  originalBand: string | null
  originalCompletedAt: string | null
  note: string
}

// ── The canonical snapshot ─────────────────────────────────────────────────────
export interface MetrixProfileSnapshot {
  profileId: string
  assessmentId: string | null
  userId: string | null
  profileSchemaVersion: number
  scoringVersion: number
  rulesetVersion: number
  createdAt: string
  updatedAt?: string
  source: ProfileSource
  businessContext: BusinessContext
  normalizedAnswers: NormalizedAssessment
  signals: ProfileSignals
  readiness: ReadinessIndicators
  criticalFlagCandidates: CriticalFlagCandidate[]
  constraintCandidates: ConstraintCandidate[]
  prioritySeed: PrioritySeed
  profileQuality: ProfileQuality
  roadmapSeed: RoadmapSeed
  // ── SZM-2 additions ──────────────────────────────────────────────────────────
  criticalGates: CriticalGate[]
  metrixPriority: MetrixPriority        // exactly one active primary priority
  secondaryPriorities: MetrixPriority[] // ranked; never compete with the primary in the read model
  blockedRecommendations: BlockedRecommendation[]
  nextBestQuestions: NextBestQuestion[]
  legacySource?: LegacySourceMeta
}

// ── Evaluation options (ids/clock injectable for determinism) ──────────────────
export interface EvaluateOptions {
  profileId?: string
  assessmentId?: string | null
  userId?: string | null
  source?: ProfileSource
  now?: string                       // ISO; defaults to new Date() when omitted
  legacySource?: LegacySourceMeta
}

// Re-export for convenience to consumers of the canonical model.
export type { RawAnswers } from '../scoring'
export type { QuickIntake, BusinessStage } from '../intake'
export type { MetrixCategory, RiskLevel } from '../metrixEngine'
