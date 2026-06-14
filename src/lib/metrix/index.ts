// ─────────────────────────────────────────────────────────────────────────────
// metrix — Canonical Metrix Profile engine: public API (SZM-1)
// ─────────────────────────────────────────────────────────────────────────────
// The one authoritative evaluation + persistence + read-model surface. Live consumers
// import from here; they read the canonical snapshot and never recompute a competing score.
// ─────────────────────────────────────────────────────────────────────────────

export * from './profileTypes'
export { normalizeAssessment, normalizeIntake } from './normalize'
export { deriveProfileSignals } from './signals'
export { calculateReadiness } from './readiness'
export { deriveCriticalFlagCandidates } from './criticalFlags'
export { deriveConstraintCandidates } from './constraints'
export { derivePrioritySeed, prioritySeedFromPriority } from './priority'
export { deriveRoadmapSeed } from './roadmapSeed'
export { deriveCriticalGates, GATE_DOMAIN_CATEGORY } from './gates'
export { selectMetrixPriority, DOMAIN_BASE_TIER, type PrioritySelection } from './metrixPriority'
export { deriveNextBestQuestions } from './nextBestQuestions'
export { buildCompletionPaths, type CompletionPathResult } from './completionPaths'
export { buildNextUp } from './nextUp'
export { deriveInitialProgress } from './priorityProgress'
export {
  buildPriorityView,
  type PriorityView, type PriorityViewState, type PathView, type StepView,
  type NextUpView, type QuestionView, type PriorityHeadView,
} from './priorityView'
export {
  PROGRESS_SCHEMA_VERSION, createProgressRecord, recompute, selectPath, toggleStep,
  setEvidence, resetIfPriorityChanged, canCompleteStep,
  type PersistedPriorityProgress, type EvidenceState, type PriorityChangeResult,
} from './progressRecord'
export {
  PRIORITY_PROGRESS_KEY, getActiveProgress, persistProgress, getProgressArchive, loadProgressBlob,
} from './progressStore'
export {
  PRIORITY_PROGRESS_CLOUD_WIRED, PRIORITY_PROGRESS_TABLE, progressLocalId,
  getPriorityProgressSyncReadiness, reconcilePriorityProgress,
  syncPriorityProgressToAccount, adoptPriorityProgressFromAccount,
  type PriorityProgressSyncReadiness, type ProgressReconcileResult, type ProgressReconcileAction,
  type PriorityProgressSyncResult,
  type ProgressSyncClient, type ProgressSyncQuery, type ProgressSyncUser, type ProgressSyncDeps,
} from './progressSync'
export {
  REASSESSMENT_CLOUD_WIRED, REASSESSMENT_TABLE,
  syncReassessmentHistoryToAccount, loadReassessmentHistoryFromAccount,
  type ReassessmentSyncResult,
} from './reassessmentSync'
export { deriveProfileQuality, freshnessCategory } from './quality'
export { evaluateMetrixProfile } from './snapshot'
export {
  REASSESSMENT_SCHEMA_VERSION, reassessProfile, diffSnapshots,
  type ReassessmentResult, type ReassessmentDiff, type ReassessmentRecord,
  type ReassessmentStatus, type ReassessmentTrigger, type ReassessOptions,
} from './reassessment'
export {
  REASSESSMENT_HISTORY_KEY, loadReassessmentHistory, saveReassessmentHistory, getLatestReassessment,
} from './reassessmentStore'
export { getCanonicalProfile, loadMetrixProfile, persistMetrixProfile, CANONICAL_PROFILE_KEY } from './persist'
export {
  toMetrixScore,
  getMetrixPriority, getSecondaryPriorities, getActiveCriticalGates, getPossibleGates,
  getBlockedRecommendations, getNextBestQuestions, getProfileQuality, getPriorityExplanation,
  getCompletionPaths, getRecommendedCompletionPath, getPrimaryActionSteps, getFirstActionStep,
  getNextUpPriorities, getPriorityProgress,
  type PriorityExplanation,
} from './readModel'
export { estimatePotentialFromSnapshot, type PotentialEstimate } from './potential'
export {
  projectCanonicalToLegacyScoreResult, projectCanonicalToLegacyAssessmentRow, type LeadData,
} from './legacyProjection'
export {
  isLegacyScoreResult, adaptLegacyScoreResult, adaptLegacyHistorySnapshot,
} from './legacyAdapter'
export {
  reconcileCanonicalProfiles,
  type ReconciliationResult, type ReconcileAction, type ReconcileConflict,
} from './reconcile'
// ── Wave 2: Profile Intelligence (additive canonical adapters; no new engine) ──
export {
  LIFECYCLE_VERSION, LIFECYCLE_STAGE_ORDER, LIFECYCLE_STAGE_LABELS,
  assessLifecycle, deriveLifecycleStage, deriveStageConfidence, detectStageTransition,
  type LifecycleStage, type LifecycleAssessment, type StageConfidence,
  type StageTransition, type StageDirection,
} from './lifecycle'
export {
  INTELLIGENCE_VERSION,
  type ProfileIntelligence, type ProfileCompleteness, type EvidenceConfidence,
  type KnownFact, type ImportantUnknown, type ProfileRisk, type ProfileNeed, type ProfileGap,
  type ProfileVersions, type ProfileHistoryPoint, type ReassessmentSignal,
  type OutcomeDefinition, type PriorityExplanationDetail, type ExplainGateInvolvement,
} from './intelligenceTypes'
export {
  deriveCompleteness, deriveEvidenceConfidence, deriveKnownFacts,
  deriveImportantUnknowns, deriveRisks, deriveNeeds, deriveGaps,
} from './profileCompleteness'
export {
  selectProgressiveQuestions, hasProgressiveQuestions, type ProgressiveQuestionOptions,
} from './progressiveQuestions'
export { explainPriorityDetail, type ExplainOptions } from './priorityExplanation'
export {
  deriveProfileIntelligence, deriveReassessmentTriggers, deriveOutcomeDefinitions, deriveProfileHistory,
  type ProfileIntelligenceOptions,
} from './profileIntelligence'
