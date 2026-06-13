// ─────────────────────────────────────────────────────────────────────────────
// metrix/roadmapSeed — Module 7: roadmap seed (pure)
// ─────────────────────────────────────────────────────────────────────────────
// Produces an ORDERED CATEGORY seed only — the priority focus first, then the ranked
// constraint categories. It deliberately does NOT contain action copy/content; the
// existing pathActions catalog formats that for display. This keeps the canonical
// snapshot a stable seed that downstream renderers consume without recomputing. Pure.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixCategory } from '../metrixEngine'
import type { PrioritySeed, ConstraintCandidate, RoadmapSeed, RoadmapSeedStep } from './profileTypes'

export function deriveRoadmapSeed(
  prioritySeed: PrioritySeed,
  constraints: ConstraintCandidate[],
): RoadmapSeed {
  const steps: RoadmapSeedStep[] = []
  const seen = new Set<MetrixCategory>()
  let order = 1

  if (prioritySeed.focusCategory) {
    steps.push({ order: order++, category: prioritySeed.focusCategory, reason: 'priority_focus' })
    seen.add(prioritySeed.focusCategory)
  }
  for (const c of constraints) {
    if (!seen.has(c.category)) {
      steps.push({ order: order++, category: c.category, reason: 'constraint' })
      seen.add(c.category)
    }
  }
  if (steps.length === 0) {
    steps.push({ order: 1, category: 'business_foundation', reason: 'foundation_default' })
  }
  return { steps }
}
