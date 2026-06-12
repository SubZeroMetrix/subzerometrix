'use client'

// ─────────────────────────────────────────────────────────────────────────────
// RoadmapProgressCard — execution progress + next action + tool (Mega-Phase 4B)
// ─────────────────────────────────────────────────────────────────────────────
// Presentational only. Reads device-local completed action ids and renders roadmap
// progress, the active phase, the next action, and the recommended Tier 2 tool for
// it. No scoring/roadmap-definition changes; progress is calculated, not stored new.
// One component, three variants so each page is a single-line insertion.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { ListChecks, Target, Wrench, TrendingUp } from 'lucide-react'
import type { MetrixScore } from '@/lib/metrixEngine'
import type { QuickIntake } from '@/lib/intake'
import { getRoadmapProgress, getCompletedActionIds } from '@/lib/roadmapProgress'
import { getToolsForAction } from '@/lib/actionToolMap'

type Variant = 'dashboard' | 'report' | 'results'

export default function RoadmapProgressCard({
  score, intake, variant,
}: { score: MetrixScore; intake: QuickIntake | null; variant: Variant }) {
  const [completedIds, setCompletedIds] = useState<string[]>([])

  useEffect(() => {
    setCompletedIds(getCompletedActionIds())
  }, [])

  const progress = getRoadmapProgress(score, intake, completedIds)
  const nextTool = progress.nextAction ? getToolsForAction(progress.nextAction.id)[0] ?? null : null
  const light = variant === 'results'

  return (
    <section className={light ? '' : 'space-y-3'}>
      {!light && (
        <div className="flex items-center gap-2 mb-1">
          <ListChecks className="w-5 h-5 text-brand-accent" />
          <h2 className={variant === 'report'
            ? 'font-display text-2xl tracking-wider text-brand-white'
            : 'font-display text-xl tracking-wider text-brand-white'}>
            ROADMAP PROGRESS
          </h2>
        </div>
      )}

      <div className="glass rounded-2xl p-5 space-y-4">
        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-brand-silver">
              {light ? 'Roadmap progress' : 'Execution progress'}
            </span>
            <span className="font-mono text-[11px] text-brand-white">
              {progress.completedActions}/{progress.totalActions} · {progress.percent}%
            </span>
          </div>
          <div className="progress-track h-1.5">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress.percent}%`, background: '#4A90D9' }} />
          </div>
          <p className="text-[11px] text-brand-silver/70 mt-2 leading-relaxed">{progress.momentumMessage}</p>
        </div>

        {/* Active phase + next action (skipped in light/results preview) */}
        {!light && progress.activePhase && (
          <div className="rounded-xl px-3 py-3" style={{ background: 'rgba(74,144,217,0.1)', border: '1px solid rgba(74,144,217,0.25)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
              <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-accent">
                Now working on: {progress.activePhase.label}
              </span>
            </div>
            {progress.nextAction ? (
              <>
                <p className="text-[13px] font-semibold text-brand-white leading-snug">{progress.nextAction.title}</p>
                {nextTool && (
                  <p className="inline-flex items-center gap-1 text-[10px] mt-1.5" style={{ color: '#7FB0E8' }}>
                    <Wrench className="w-3 h-3" /> Use: {nextTool.toolName}
                  </p>
                )}
              </>
            ) : (
              <p className="text-[13px] text-brand-white">This area is complete — nice work.</p>
            )}
          </div>
        )}

        {/* Light preview just shows the next action title */}
        {light && progress.nextAction && (
          <p className="text-[12px] text-brand-silver leading-relaxed">
            <span className="text-brand-white font-medium">Next:</span> {progress.nextAction.title}
          </p>
        )}

        {/* Report variant: a compact phase breakdown */}
        {variant === 'report' && progress.phases.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {progress.phases.map(p => (
              <div key={p.category} className="flex items-center gap-3">
                <span className="flex-1 text-[11px] text-brand-silver leading-snug">{p.label}</span>
                <div className="w-16 progress-track h-1.5 flex-shrink-0">
                  <div className="h-full rounded-full" style={{ width: `${p.percent}%`, background: '#4A90D9' }} />
                </div>
                <span className="font-mono text-[10px] text-brand-silver/70 w-12 text-right">{p.completed}/{p.total}</span>
              </div>
            ))}
          </div>
        )}

        {!light && (
          <p className="flex items-center gap-1.5 text-[10px] text-brand-silver/50">
            <TrendingUp className="w-3 h-3" /> {progress.storageNote}
          </p>
        )}
      </div>
    </section>
  )
}
