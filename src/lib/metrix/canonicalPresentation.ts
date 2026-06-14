// ─────────────────────────────────────────────────────────────────────────────
// metrix/canonicalPresentation — Wave 6: one presentation-layer adapter (contract)
// ─────────────────────────────────────────────────────────────────────────────
// ONE read-only projection that lets dashboard, results, roadmap, resource, and the future
// directory surfaces consume canonical data through a single presentation-safe contract —
// WITHOUT reimplementing business logic and WITHOUT competing with any canonical engine.
//
// It reads the stored MetrixProfileSnapshot via the existing readModel accessors (no scoring,
// no priority recomputation) and composes optional, already-derived intelligence (lifecycle,
// trade, licensing), already-built recommendation cards, and sync/foundation/growth summaries
// supplied by the caller. It NEVER recomputes them. Pure, defensive; never throws.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixProfileSnapshot } from './profileTypes'
import type { LifecycleStage } from './lifecycle'
import type { RecommendationCardView } from './resourceDirectory'
import {
  toMetrixScore, getMetrixPriority, getPriorityExplanation, getProfileQuality,
  getPrimaryActionSteps, getPriorityProgress, getActiveCriticalGates,
} from './readModel'

export const CANONICAL_PRESENTATION_VERSION = 1

// ── Presentation-safe sub-views ──────────────────────────────────────────────────
export interface ScoreView {
  overall: number
  riskLevel: string
  riskLabel: string
  stage: string
  generatedAt: string
}

export interface PriorityView {
  priorityId: string
  title: string
  requiredOutcome: string
  firstAction: string
  domainCategory: string
  evidenceStatus: string
  reasonCodes: string[]
}

export interface ActionsView {
  primarySteps: { id: string; label: string }[]
  completed: number
  total: number
  activeGateCount: number
}

export interface ConfidenceView {
  coverageLevel: string
  coverageAnswered: number
  coverageTotal: number
  evidenceQuality: string
  freshnessCategory: string
  freshnessBasisDate: string
  notSureCount: number
}

// Optional, caller-supplied summaries for surfaces whose canonical adapters live elsewhere.
// They are passed through verbatim; this adapter never derives them.
export interface LifecycleSummary { stage: LifecycleStage | null; confidence: string | null }
export interface TradeSummary { tradeId: string | null; supported: boolean }
export interface LicensingSummary { state: string | null; supported: boolean; freshness: string | null }
export interface BuilderSummary { completed: number; total: number; blocked: number }

export type PresentationSyncStatus =
  | 'synced' | 'pending' | 'offline' | 'conflict' | 'local_only' | 'unknown'
export interface SyncView {
  status: PresentationSyncStatus
  lastSyncedAt: string | null
  cloudWired: boolean
}

// Why a surface might show a degraded/unsupported state instead of full intelligence.
export interface SupportView {
  profileComplete: boolean
  tradeSupported: boolean
  stateSupported: boolean
  incompleteReasons: string[]
}

export interface DisclosureView {
  affiliateDisclosureRequired: boolean   // any recommended card requires disclosure
  count: number
}

export interface CanonicalPresentation {
  version: number
  score: ScoreView
  priority: PriorityView
  actions: ActionsView
  confidence: ConfidenceView
  lifecycle: LifecycleSummary
  trade: TradeSummary
  licensing: LicensingSummary
  foundation: BuilderSummary | null
  growth: BuilderSummary | null
  recommendations: RecommendationCardView[]
  sync: SyncView
  support: SupportView
  disclosures: DisclosureView
}

export interface CanonicalPresentationInput {
  snapshot: MetrixProfileSnapshot
  lifecycle?: LifecycleSummary | null
  trade?: TradeSummary | null
  licensing?: LicensingSummary | null
  foundation?: BuilderSummary | null
  growth?: BuilderSummary | null
  recommendations?: RecommendationCardView[] | null
  sync?: SyncView | null
}

const DEFAULT_SYNC: SyncView = { status: 'unknown', lastSyncedAt: null, cloudWired: false }

/**
 * Build the unified presentation contract from the canonical snapshot + optional, already-
 * derived summaries. Reads canonical data only; recomputes nothing. Never throws.
 */
export function buildCanonicalPresentation(input: CanonicalPresentationInput): CanonicalPresentation {
  const snap = input.snapshot
  const score = toMetrixScore(snap)
  const priority = getMetrixPriority(snap)
  const explain = getPriorityExplanation(snap)
  const quality = getProfileQuality(snap)
  const steps = getPrimaryActionSteps(snap)
  const progress = getPriorityProgress(snap)

  const recommendations = Array.isArray(input.recommendations) ? input.recommendations : []
  const disclosureCards = recommendations.filter(r => r.disclosureRequired)

  const profileComplete = snap.businessContext.stage !== ''
  const tradeSupported = input.trade?.supported ?? false
  const stateSupported = input.licensing?.supported ?? false
  const incompleteReasons: string[] = []
  if (!profileComplete) incompleteReasons.push('assessment_stage_unknown')
  if (input.trade && !tradeSupported) incompleteReasons.push('trade_unsupported')
  if (input.licensing && !stateSupported) incompleteReasons.push('state_unsupported')

  return {
    version: CANONICAL_PRESENTATION_VERSION,
    score: {
      overall: score.overall,
      riskLevel: score.riskLevel,
      riskLabel: score.riskLabel,
      stage: String(score.stage ?? ''),
      generatedAt: score.generatedAt,
    },
    priority: {
      priorityId: priority.priorityId,
      title: priority.title,
      requiredOutcome: priority.requiredOutcome,
      firstAction: priority.firstAction,
      domainCategory: priority.domainCategory,
      evidenceStatus: explain.evidenceStatus,
      reasonCodes: priority.reasonCodes ?? [],
    },
    actions: {
      primarySteps: steps.map(s => ({ id: s.stepId, label: s.title })),
      completed: progress.completedStepIds?.length ?? 0,
      total: steps.length,
      activeGateCount: getActiveCriticalGates(snap).length,
    },
    confidence: {
      coverageLevel: quality.coverage.level,
      coverageAnswered: quality.coverage.answered,
      coverageTotal: quality.coverage.total,
      evidenceQuality: quality.evidenceQuality,
      freshnessCategory: quality.dataFreshness.category,
      freshnessBasisDate: quality.dataFreshness.basisDate,
      notSureCount: quality.notSureCount,
    },
    lifecycle: input.lifecycle ?? { stage: null, confidence: null },
    trade: input.trade ?? { tradeId: null, supported: false },
    licensing: input.licensing ?? { state: null, supported: false, freshness: null },
    foundation: input.foundation ?? null,
    growth: input.growth ?? null,
    recommendations,
    sync: input.sync ?? DEFAULT_SYNC,
    support: { profileComplete, tradeSupported, stateSupported, incompleteReasons },
    disclosures: {
      affiliateDisclosureRequired: disclosureCards.length > 0,
      count: disclosureCards.length,
    },
  }
}
