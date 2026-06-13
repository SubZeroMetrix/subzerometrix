// ─────────────────────────────────────────────────────────────────────────────
// metrix/roadmapSeed — Module 7: roadmap seed derived from the Metrix Priority (SZM-2)
// ─────────────────────────────────────────────────────────────────────────────
// Ordered CATEGORY seed only (no action copy). The FIRST step always supports the primary
// Metrix Priority; then its dependency gates; then remaining constraints. Growth work is
// SUPPRESSED while a blocking gate is active (growthBlocked). Downstream renderers consume
// this without recomputing priority. Pure.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixCategory } from '../metrixEngine'
import type {
  MetrixPriority, CriticalGate, ConstraintCandidate, RoadmapSeed, RoadmapSeedStep,
} from './profileTypes'
import { GATE_DOMAIN_CATEGORY } from './gates'

export function deriveRoadmapSeed(
  priority: MetrixPriority,
  gates: CriticalGate[],
  constraints: ConstraintCandidate[],
  growthBlocked: boolean,
): RoadmapSeed {
  const steps: RoadmapSeedStep[] = []
  const seen = new Set<MetrixCategory>()
  let order = 1

  // 1 — the primary priority's domain category always leads.
  steps.push({ order: order++, category: priority.domainCategory, reason: 'priority_focus' })
  seen.add(priority.domainCategory)

  // 2 — dependency gates that must resolve alongside the primary.
  for (const depId of priority.dependencies) {
    const g = gates.find(x => x.id === depId)
    if (!g) continue
    const c = GATE_DOMAIN_CATEGORY[g.domain]
    if (!seen.has(c)) { steps.push({ order: order++, category: c, reason: 'dependency' }); seen.add(c) }
  }

  // 3 — remaining constraints; growth_risk suppressed while a blocking gate is active.
  for (const c of constraints) {
    if (seen.has(c.category)) continue
    if (growthBlocked && c.category === 'growth_risk') continue
    steps.push({ order: order++, category: c.category, reason: 'constraint' })
    seen.add(c.category)
  }

  if (steps.length === 0) {
    steps.push({ order: 1, category: 'business_foundation', reason: 'foundation_default' })
  }
  return { steps }
}
