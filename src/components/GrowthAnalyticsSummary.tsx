'use client'

// ─────────────────────────────────────────────────────────────────────────────
// GrowthAnalyticsSummary — device-local activity summary (Growth-6)
// ─────────────────────────────────────────────────────────────────────────────
// Summarizes locally-stored activation milestones for THIS DEVICE. No business-
// result claims, no benchmarking, no cloud sync, no PII. Renders nothing if empty.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'
import {
  getGrowthEventsLocal, getActivationMilestoneLabel, getGrowthAnalyticsDisclosureText,
  type ActivationMilestone,
} from '@/lib/growthAnalytics'

interface MilestoneCount {
  milestone: ActivationMilestone
  label: string
  count: number
}

export default function GrowthAnalyticsSummary() {
  const [items, setItems] = useState<MilestoneCount[]>([])

  useEffect(() => {
    const counts = new Map<ActivationMilestone, number>()
    for (const event of getGrowthEventsLocal()) {
      if (event.milestone) counts.set(event.milestone, (counts.get(event.milestone) ?? 0) + 1)
    }
    setItems(
      Array.from(counts, ([milestone, count]) => ({
        milestone, label: getActivationMilestoneLabel(milestone), count,
      })),
    )
  }, [])

  if (items.length === 0) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-5 h-5 text-brand-accent" />
        <h2 className="font-display text-xl tracking-wider text-brand-white">YOUR ACTIVITY</h2>
      </div>
      <div className="glass rounded-2xl p-5 space-y-2">
        {items.map(item => (
          <div key={item.milestone} className="flex items-center justify-between">
            <span className="text-[12px] text-brand-silver leading-snug">{item.label}</span>
            <span className="font-mono text-[11px] text-brand-white">{item.count}</span>
          </div>
        ))}
        <p className="text-[10px] text-brand-silver/50 leading-relaxed pt-2 border-t border-white/10">
          {getGrowthAnalyticsDisclosureText()}
        </p>
      </div>
    </section>
  )
}
