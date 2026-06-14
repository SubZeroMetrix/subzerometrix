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
  selectProgressiveQuestions, hasProgressiveQuestions, filterQuestionCandidates,
  type ProgressiveQuestionOptions,
} from './progressiveQuestions'
export { explainPriorityDetail, type ExplainOptions } from './priorityExplanation'
export {
  deriveProfileIntelligence, deriveReassessmentTriggers, deriveOutcomeDefinitions, deriveProfileHistory,
  type ProfileIntelligenceOptions,
} from './profileIntelligence'
// ── Wave 3: Ten-Trade Contractor Intelligence (additive canonical adapter; no new engine) ──
export {
  CANONICAL_TRADE_IDS, TRADE_REGISTRY, resolveTrade, isSupportedTrade,
  type CanonicalTradeId, type TradeSupportStatus, type TradeRegistryEntry, type ResolvedTrade,
} from './trades'
export {
  TRADE_INTELLIGENCE_VERSION,
  type TradeIntelligence, type ContractorDimension, type ContractorDimensionId,
  type DimensionIntensity, type TradeInsight, type ResourceCategory, type ResourceCategoryKind,
  type CanonicalTradeRef,
} from './tradeIntelligenceTypes'
export {
  DIMENSION_LABELS, TRADE_MODIFIERS,
  type TradeModifier, type TradeQuestionTemplate,
} from './tradeModifiers'
export {
  deriveTradeIntelligence, type TradeIntelligenceOptions,
} from './tradeIntelligence'
// ── Wave 4: Six-State Licensing, Jurisdiction & Trusted Routing (additive adapter; no new engine) ──
export {
  LICENSING_INTELLIGENCE_VERSION, LICENSING_REVIEWED_DATE, LICENSING_FRESHNESS_WINDOW_DAYS,
  type CanonicalStateId, type StateSupportStatus, type StateCoverageStatus,
  type StateRegistryEntry, type StateAuthorityRef, type ResolvedState,
  type SourceType, type JurisdictionLevel, type FreshnessStatus, type CorrectionStatus,
  type LicensingSource, type FreshnessVerdict,
  type AuthorityLevel, type JurisdictionComplexity, type PathwayCoverage, type TradeStatePathway,
  type RoutingCategoryId, type RoutingCategory,
  type CorrectionIssueType, type CorrectionReportInput, type CorrectionReport,
  type LicensingPathwayStatus, type LicensingRequirementItem, type VerificationStep,
  type LicensingIntelligence,
} from './licensingTypes'
export {
  CANONICAL_STATE_IDS, STATE_REGISTRY, resolveState, isSupportedState,
} from './states'
export {
  LICENSING_SOURCES, getLicensingSource, getPathwaySources, sourceId,
} from './licensingSources'
export {
  dayDiff, computeNextReviewDate, evaluateFreshness, isSourceStale, rollupFreshness,
} from './sourceFreshness'
export {
  LICENSING_PATHWAYS, getPathway, allPathways, pathwayKey,
} from './licensingPathways'
export {
  ROUTING_CATALOG, getRoutingCategory, getRoutingCategories, getSpecialistCategories,
} from './licensingRouting'
export {
  buildCorrectionReport,
} from './licensingCorrections'
export {
  deriveLicensingIntelligence, type LicensingIntelligenceOptions,
} from './licensingIntelligence'
// ── Wave 5: Foundation, Growth, Resource & Partner Integration (additive; no new engine) ──
export {
  ACTION_MODEL_VERSION, EMPTY_OUTCOME,
  type CanonicalAction, type CanonicalActionSource, type CanonicalActionCategory,
  type ActionCompletionStatus, type ActionSourcePriority, type ActionOwner,
  type CanonicalEvidence, type CanonicalEvidenceState,
  type CanonicalOutcome, type CanonicalOutcomeType, type VerificationStatus,
  type CanonicalActionProvenance, type ActionProgressLinkage,
} from './actionTypes'
export {
  projectPriorityActions, projectFoundationActions, projectGrowthActions, collectCanonicalActions,
  type CollectActionsInput,
} from './actionModel'
export {
  RESOURCE_REGISTRY_VERSION, RESOURCE_REVIEWED_DATE, RESOURCE_FRESHNESS_WINDOW_DAYS,
  type CanonicalResource, type CanonicalResourceCategory, type CanonicalResourceProvenance,
  type ResourceSourceKind, type ResourcePlacement,
  type ResourceRelationshipStatus, type ResourceAffiliateStatus, type ResourceSponsorshipStatus,
} from './resourceTypes'
export {
  RESOURCE_REGISTRY, allResources, getResourceById, getResourceBySourceId,
  getResourcesByCategory, getResourcesForPlacement,
} from './resourceRegistry'
export {
  RECOMMENDATION_VERSION, deriveResourceRecommendations,
  type ResourceRecommendationOptions, type ResourceRecommendationResult,
  type RecommendedResource, type ResourceApplicability, type ResourceHelpfulness,
  type RecommendationConfidence, type RecommendationDisclosure,
} from './resourceRecommendations'
export {
  ATTRIBUTION_VERSION, buildAttributionContext,
  trackRecommendationImpression, trackRecommendationOpen,
  trackRecommendationOutboundClick, trackRecommendationFeedback,
  type AttributionContext, type AttributionOptions,
} from './resourceAttribution'
export {
  RESOURCE_FEEDBACK_VERSION, RESOURCE_FEEDBACK_KEY, RESOURCE_FEEDBACK_TYPES,
  recordResourceFeedback, getResourceFeedback, getHelpfulnessMap,
  getCompletedResourceIds, clearResourceFeedback,
  type ResourceFeedbackType, type ResourceFeedbackEntry,
} from './resourceFeedback'
// ── Wave 6: Preservation, Migration & Interface Architecture (additive; no new engine) ──
export {
  RESOURCE_ECOSYSTEM_VERSION, ECOSYSTEM_CATEGORIES, NON_PUBLIC_VERIFICATION_STATUSES,
  defaultEcosystemExtension,
  type EcosystemResource, type EcosystemCategory, type EcosystemVerificationStatus,
  type EcosystemReferralStatus, type EcosystemResellerStatus, type EcosystemIntegrationStatus,
  type LaunchCategory, type EcosystemReviewMeta, type EcosystemLaunchMeta,
  type EcosystemRelationshipMeta, type EcosystemOperationsMeta,
} from './resourceEcosystem'
export {
  evaluatePublicEligibility, isPublicEligible, isDirectLinkEligible, isRegulatoryAuthority,
  requiresDisclosure, publicEligibleResources, launchReadyResources, hasVerificationEvidence,
  disclosureRenderable, publicationApproved,
  type PublicEligibility, type VerificationBlockReason,
} from './resourceVerification'
// NOTE: resourceLinkAudit (large evidence dataset) is intentionally NOT re-exported here, to keep
// it out of client bundles. Import it directly from '@/lib/metrix/resourceLinkAudit' (audit/tests).
export {
  RESOURCE_REDIRECT_VERSION, RESOURCE_REDIRECT_BASE, buildRedirectPath,
  resolveRedirect, contextCarriesPrivateData,
  type RedirectContext, type RedirectResolution, type RedirectStatus, type OutboundEventPayload,
} from './resourceRedirects'
export {
  RESOURCE_DIRECTORY_VERSION, RECOMMENDATION_ACTIONS, buildDirectoryView, toRecommendationCard,
  type DirectoryFilter, type DirectoryEntry, type RecommendationAction, type RecommendationCardView,
} from './resourceDirectory'
export {
  PUBLISHED_ECOSYSTEM_CATALOG, getPublishedEcosystemCatalog,
} from './ecosystemCatalog'
export {
  CANONICAL_PRESENTATION_VERSION, buildCanonicalPresentation,
  type CanonicalPresentation, type CanonicalPresentationInput,
  type ScoreView, type PriorityView as PresentationPriorityView, type ActionsView,
  type ConfidenceView, type LifecycleSummary, type TradeSummary, type LicensingSummary,
  type BuilderSummary, type SyncView, type PresentationSyncStatus, type SupportView,
  type DisclosureView,
} from './canonicalPresentation'
