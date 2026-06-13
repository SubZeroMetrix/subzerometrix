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
import type { MetrixProfileSnapshot } from './profileTypes'

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
