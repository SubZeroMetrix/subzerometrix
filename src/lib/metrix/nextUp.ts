// ─────────────────────────────────────────────────────────────────────────────
// metrix/nextUp — bounded next-up priority queue (SZM-2A, pure)
// ─────────────────────────────────────────────────────────────────────────────
// Derives ≤3 NON-active next-up priorities from the existing ranked secondary
// priorities. Deterministic, deduped, never equally urgent (densely re-ranked), and it
// reassures the user the system understands the larger plan without creating overload.
// Blocked-growth secondaries are flagged with `blockedBy` (not silently promoted).
// ─────────────────────────────────────────────────────────────────────────────

import type { MetrixPriority, NextUpItem, CriticalGate } from './profileTypes'

export function buildNextUp(secondary: MetrixPriority[], gates: CriticalGate[]): NextUpItem[] {
  const blockingGate = gates.find(g => g.status === 'triggered' && g.blocksGrowth) ?? null
  const seen = new Set<string>()
  const items: NextUpItem[] = []

  for (const p of secondary) {
    if (seen.has(p.priorityId)) continue       // dedupe
    seen.add(p.priorityId)
    const isDemand = p.domain === 'customer_path' || p.domain === 'growth'
    const blockedBy = isDemand && blockingGate ? blockingGate.id : null
    items.push({
      priorityId: p.priorityId,
      title: p.title,
      requiredOutcome: p.requiredOutcome,
      activationCondition: blockedBy
        ? `After "${blockingGate!.title}" is resolved`
        : 'After your current priority is complete',
      blockedBy,
      rank: items.length + 1,                  // dense 1..3 — never equally urgent
      reason: p.rationale,
    })
    if (items.length >= 3) break               // bounded
  }
  return items
}
