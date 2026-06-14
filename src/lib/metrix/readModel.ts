// ─────────────────────────────────────────────────────────────────────────────
// metrix/readModel — Canonical read model → legacy MetrixScore shape
// ─────────────────────────────────────────────────────────────────────────────
// Consumers may FORMAT the canonical snapshot for display but may NOT recompute a
// competing score. This adapter rehydrates the exact `MetrixScore` shape that existing
// components (OutcomeBriefing, RoadmapProgressCard, pathActions.generateActions, etc.)
// already accept — sourced entirely from the stored snapshot, with NO scoring. It is the
// bridge that lets pages stop calling buildStarterScore directly. Pure.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixScore } from '../metrixEngine'
import type {
  MetrixProfileSnapshot, MetrixPriority, CriticalGate,
  BlockedRecommendation, NextBestQuestion, ProfileQuality,
  CompletionPath, ActionStep, NextUpItem, PriorityProgress,
} from './profileTypes'

// ── SZM-2: canonical read accessors (pure passthroughs — NO recomputation) ─────
// Consumers may format these for display; they must not recompute priority/gates.

/** The single active primary Metrix Priority. */
export function getMetrixPriority(s: MetrixProfileSnapshot): MetrixPriority {
  return s.metrixPriority
}
/** Ranked secondary priorities (never compete with the primary in the UI). */
export function getSecondaryPriorities(s: MetrixProfileSnapshot): MetrixPriority[] {
  return s.secondaryPriorities ?? []
}
/** Triggered (active) critical gates. */
export function getActiveCriticalGates(s: MetrixProfileSnapshot): CriticalGate[] {
  return (s.criticalGates ?? []).filter(g => g.status === 'triggered')
}
/** Possible/unknown gates (need evidence; drive next-best-questions). */
export function getPossibleGates(s: MetrixProfileSnapshot): CriticalGate[] {
  return (s.criticalGates ?? []).filter(g => g.status === 'possible' || g.status === 'unknown')
}
/** Growth/marketing recommendations suppressed by an active blocking gate. */
export function getBlockedRecommendations(s: MetrixProfileSnapshot): BlockedRecommendation[] {
  return s.blockedRecommendations ?? []
}
/** Ranked progressive-profiling question candidates. */
export function getNextBestQuestions(s: MetrixProfileSnapshot): NextBestQuestion[] {
  return s.nextBestQuestions ?? []
}
/** Profile/evidence quality (coverage / evidence / freshness). */
export function getProfileQuality(s: MetrixProfileSnapshot): ProfileQuality {
  return s.profileQuality
}

export interface PriorityExplanation {
  title: string
  requiredOutcome: string
  rationale: string
  firstAction: string
  reasonCodes: string[]
  evidenceStatus: MetrixPriority['evidenceStatus']
}
/** A display-ready explanation of the primary priority (reason codes + evidence status). */
export function getPriorityExplanation(s: MetrixProfileSnapshot): PriorityExplanation {
  const p = s.metrixPriority
  return {
    title: p.title,
    requiredOutcome: p.requiredOutcome,
    rationale: p.rationale,
    firstAction: p.firstAction,
    reasonCodes: p.reasonCodes,
    evidenceStatus: p.evidenceStatus,
  }
}

// ── SZM-2A: completion-path / action-step / next-up / progress accessors ───────
/** All valid completion paths for the primary priority. */
export function getCompletionPaths(s: MetrixProfileSnapshot): CompletionPath[] {
  return s.completionPaths ?? []
}
/** The single recommended completion path (null if none defensible). */
export function getRecommendedCompletionPath(s: MetrixProfileSnapshot): CompletionPath | null {
  const id = s.recommendedCompletionPathId
  return id ? (s.completionPaths ?? []).find(p => p.pathId === id) ?? null : null
}
/** Ordered action steps for the primary priority (the recommended path's steps). */
export function getPrimaryActionSteps(s: MetrixProfileSnapshot): ActionStep[] {
  return s.primaryActionSteps ?? []
}
/** The immediate first action step. */
export function getFirstActionStep(s: MetrixProfileSnapshot): ActionStep | null {
  return (s.primaryActionSteps ?? [])[0] ?? null
}
/** Bounded (≤3) ranked next-up priorities (non-active). */
export function getNextUpPriorities(s: MetrixProfileSnapshot): NextUpItem[] {
  return s.nextUpPriorities ?? []
}
/** Safe initial action-progress for the primary priority. */
export function getPriorityProgress(s: MetrixProfileSnapshot): PriorityProgress {
  return s.priorityProgress
}

export function toMetrixScore(snapshot: MetrixProfileSnapshot): MetrixScore {
  const r = snapshot.readiness
  return {
    overall: r.overall,
    riskLevel: r.riskLevel,
    riskLabel: r.riskLabel,
    stage: snapshot.businessContext.stage,
    stageGroup: snapshot.businessContext.stageGroup,
    categories: r.categories,
    strengths: r.strengths,
    risks: r.risks,
    progress: r.progress,
    recommendedPath: snapshot.prioritySeed.path,
    generatedAt: snapshot.createdAt,
  }
}
