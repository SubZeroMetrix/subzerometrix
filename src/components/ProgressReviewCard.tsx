'use client'

// ─────────────────────────────────────────────────────────────────────────────
// ProgressReviewCard — one-glance progress digest (Mega-Phase 4C)
// ─────────────────────────────────────────────────────────────────────────────
// Read-only digest that ties together score movement, roadmap progress, action
// completion, and manual KPI movement, plus an honest next-step. Device-local
// reads only; no scoring/roadmap changes, no cloud writes, no growth promises.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { ClipboardCheck, RefreshCw, Target } from 'lucide-react'
import type { MetrixScore } from '@/lib/metrixEngine'
import type { QuickIntake } from '@/lib/intake'
import { getRetentionView } from '@/lib/metrixRetention'
import { getRoadmapProgress, getCompletedActionIds } from '@/lib/roadmapProgress'
import { calculateKpiProgressSummary, getKpiPriorityRecommendations } from '@/lib/kpiProgress'

interface ReviewData {
  scoreLine: string
  roadmapPercent: number
  completedActions: number
  totalActions: number
  kpiMessage: string
  nextOutcome: string | null
}

export default function ProgressReviewCard({
  score, intake,
}: { score: MetrixScore; intake: QuickIntake | null }) {
  const [data, setData] = useState<ReviewData | null>(null)

  useEffect(() => {
    const retention = getRetentionView()
    const roadmap = getRoadmapProgress(score, intake, getCompletedActionIds())
    const kpi = calculateKpiProgressSummary()
    const recs = getKpiPriorityRecommendations(1)

    const prev = retention.summary.previousOverall
    const cur = retention.summary.latestOverall
    const scoreLine =
      prev !== null && cur !== null
        ? `${prev} → ${cur} (${cur - prev >= 0 ? '+' : ''}${cur - prev})`
        : cur !== null
        ? `${cur} (first check)`
        : `${score.overall}`

    setData({
      scoreLine,
      roadmapPercent: roadmap.percent,
      completedActions: roadmap.completedActions,
      totalActions: roadmap.totalActions,
      kpiMessage: kpi.hasHistory ? kpi.message : 'No numbers tracked yet — add them in the Business Outcome Tracker.',
      nextOutcome: recs[0] ? recs[0].label : null,
    })
  }, [score, intake])

  if (!data) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <ClipboardCheck className="w-5 h-5 text-brand-accent" />
        <h2 className="font-display text-xl tracking-wider text-brand-white">PROGRESS REVIEW</h2>
      </div>
      <div className="glass rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-brand-silver/70">MetrixScore™ change</span>
          <span className="text-[12px] text-brand-white font-medium">{data.scoreLine}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-brand-silver/70">Roadmap progress</span>
          <span className="text-[12px] text-brand-white font-medium">
            {data.roadmapPercent}% · {data.completedActions}/{data.totalActions} moves
          </span>
        </div>
        <div className="pt-1">
          <span className="text-[11px] text-brand-silver/70">Outcome trend</span>
          <p className="text-[12px] text-brand-silver leading-relaxed mt-0.5">{data.kpiMessage}</p>
        </div>
        {data.nextOutcome && (
          <div className="flex items-start gap-2 pt-1">
            <Target className="w-3.5 h-3.5 text-brand-accent flex-shrink-0 mt-0.5" />
            <span className="text-[12px] text-brand-silver leading-snug">
              <span className="text-brand-white">Next outcome to focus:</span> {data.nextOutcome}
            </span>
          </div>
        )}
        <div className="flex items-start gap-2 pt-2 border-t border-white/10">
          <RefreshCw className="w-3.5 h-3.5 text-brand-accent flex-shrink-0 mt-0.5" />
          <span className="text-[11px] text-brand-silver leading-relaxed">
            Reassess after completing your next actions to see your updated MetrixScore™. Progress saved on this device.
          </span>
        </div>
      </div>
    </section>
  )
}
