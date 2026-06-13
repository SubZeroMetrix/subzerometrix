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
