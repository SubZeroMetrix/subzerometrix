'use client'

import { useState, useEffect } from 'react'
import { Map, Zap, UserCog, Clock, Gauge, TrendingUp, CheckCircle2, Circle } from 'lucide-react'
import clsx from 'clsx'
import type { MetrixScore } from '@/lib/metrixEngine'
import type { QuickIntake } from '@/lib/intake'
import {
  ROADMAP_OPTIONS, generateActions, pathSummary,
  type PathMode, type RoadmapGoalId, type PathAction,
} from '@/lib/pathActions'

const STORAGE_KEY = 'szm_path_complete'

const MODE_TABS: { id: PathMode; label: string; icon: typeof Map }[] = [
  { id: 'recommended', label: 'Recommended', icon: Map },
  { id: 'fastest',     label: 'Fastest Win', icon: Zap },
  { id: 'owner',       label: "Owner's Choice", icon: UserCog },
]

function diffColor(d: PathAction['difficulty']): string {
  return d === 'Easy' ? '#1D9E75' : d === 'Moderate' ? '#EF9F27' : '#E05A4E'
}
function impactColor(i: PathAction['impact']): string {
  return i === 'High' ? '#4A90D9' : i === 'Medium' ? '#A8B8CC' : '#6B7A8F'
}

export default function ChoosePathSection({
  starter, intake,
}: { starter: MetrixScore; intake: QuickIntake | null }) {
  const [mode, setMode] = useState<PathMode>('recommended')
  const [goalId, setGoalId] = useState<RoadmapGoalId>('stabilize')
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  // Load completed actions from local storage (MVP persistence)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setCompleted(new Set(JSON.parse(raw) as string[]))
    } catch {}
  }, [])

  function toggle(id: string) {
    setCompleted(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next))) } catch {}
      return next
    })
  }

  const summary = pathSummary(mode, starter, goalId)
  const actions = generateActions(mode, starter, intake, goalId)
  const doneCount = actions.filter(a => completed.has(a.id)).length

  return (
    <section className="mt-6 mb-8">
      <div className="flex items-center gap-2 mb-1">
        <Map className="w-5 h-5 text-brand-accent" />
        <h2 className="font-display text-2xl tracking-wider text-brand-white">CHOOSE YOUR PATH</h2>
      </div>
      <p className="text-[11px] text-brand-silver/60 mb-4">
        Pick a direction and get your first 3–5 moves. Check them off as you go.
      </p>

      {/* Mode selector */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {MODE_TABS.map(t => {
          const active = mode === t.id
          const Icon = t.icon
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setMode(t.id)}
              className={clsx(
                'flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl text-[11px] font-medium transition-all touch-target border',
                active
                  ? 'bg-brand-accent border-brand-accent text-white shadow-glow-blue'
                  : 'glass border-transparent text-brand-silver hover:text-brand-white'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="leading-tight text-center">{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* Owner's Choice → core roadmap options */}
      {mode === 'owner' && (
        <div className="space-y-2 mb-4">
          {ROADMAP_OPTIONS.map(g => {
            const active = goalId === g.id
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoalId(g.id)}
                className={clsx(
                  'w-full text-left px-4 py-3 rounded-xl text-sm transition-all touch-target border',
                  active
                    ? 'bg-brand-accent/15 border-brand-accent text-brand-white'
                    : 'glass border-transparent text-brand-silver hover:text-brand-white hover:border-brand-silver/30'
                )}
              >
                <span className="font-medium block leading-snug">{g.label}</span>
                <span className="text-[11px] text-brand-silver/70 leading-relaxed">{g.blurb}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Selected path summary */}
      <div className="glass rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[14px] font-semibold text-brand-white leading-snug">{summary.label}</span>
          <span className="font-mono text-[10px] text-brand-silver flex-shrink-0">{doneCount}/{actions.length} done</span>
        </div>
        <p className="text-[11px] text-brand-silver/70 leading-relaxed mt-0.5">{summary.description}</p>
      </div>

      {/* First actions */}
      <div className="space-y-3">
        {actions.map((a, i) => {
          const done = completed.has(a.id)
          return (
            <div
              key={a.id}
              className="rounded-xl overflow-hidden"
              style={{
                border: done ? '1px solid rgba(29,158,117,0.4)' : '1px solid rgba(168,184,204,0.15)',
                background: done ? 'rgba(29,158,117,0.05)' : 'rgba(10,22,40,0.5)',
                opacity: done ? 0.75 : 1,
              }}
            >
              <div className="flex items-start gap-3 p-4">
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => toggle(a.id)}
                  aria-label={done ? 'Mark as not done' : 'Mark as done'}
                  className="flex-shrink-0 mt-0.5 touch-target"
                >
                  {done
                    ? <CheckCircle2 className="w-5 h-5" style={{ color: '#1D9E75' }} />
                    : <Circle className="w-5 h-5 text-brand-silver/40" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <span className="font-mono text-[10px] text-brand-accent mt-0.5 flex-shrink-0">{i + 1}</span>
                    <h3 className={clsx('text-[14px] font-semibold leading-snug', done ? 'text-brand-silver line-through' : 'text-brand-white')}>
                      {a.title}
                    </h3>
                  </div>
                  <p className="text-[12px] text-brand-silver leading-relaxed mb-2.5">{a.whyItMatters}</p>

                  {/* Meta badges */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] text-brand-silver/80">
                      <Clock className="w-3 h-3" /> {a.estimatedTime}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: diffColor(a.difficulty) }}>
                      <Gauge className="w-3 h-3" /> {a.difficulty}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: impactColor(a.impact) }}>
                      <TrendingUp className="w-3 h-3" /> {a.impact} impact
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
