'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Loader2, Thermometer, Shield, Map, Lightbulb, TrendingUp,
  CheckCircle2, Target, ClipboardList, ArrowRight, ArrowLeft,
} from 'lucide-react'
import type { ScoreResult } from '@/lib/scoring'
import { loadIntake, stageLabel, type QuickIntake } from '@/lib/intake'
import { buildStarterScore, estimatePotential } from '@/lib/metrixReport'
import { generateActions } from '@/lib/pathActions'

const PATH_COMPLETE_KEY = 'szm_path_complete'

function riskColor(level: string): string {
  switch (level) {
    case 'high':     return '#E05A4E'
    case 'elevated': return '#EF9F27'
    case 'moderate': return '#4A90D9'
    default:         return '#1D9E75'
  }
}

// Small stat tile
function Stat({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="glass rounded-2xl p-4 text-center">
      <div className="font-display text-3xl leading-none" style={{ color: color ?? '#FFFFFF' }}>{value}</div>
      {sub && <div className="text-[10px] text-brand-silver/70 mt-0.5">{sub}</div>}
      <div className="font-mono text-[8px] tracking-[0.15em] uppercase text-brand-silver mt-2">{label}</div>
    </div>
  )
}

export default function DashboardPage() {
  const [loaded, setLoaded] = useState(false)
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [intake, setIntake] = useState<QuickIntake | null>(null)
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('szm_score') ?? localStorage.getItem('szm_score')
      if (raw) setResult(JSON.parse(raw))
    } catch {}
    setIntake(loadIntake())
    try {
      const pc = localStorage.getItem(PATH_COMPLETE_KEY)
      if (pc) setCompleted(new Set(JSON.parse(pc) as string[]))
    } catch {}
    setLoaded(true)
  }, [])

  if (!loaded) return (
    <div className="min-h-dvh bg-brand-navy flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
      <p className="text-brand-silver text-sm">Loading your dashboard…</p>
    </div>
  )

  // ── Empty state — no assessment yet ─────────────────────────────────────────
  if (!result) return (
    <div className="min-h-dvh bg-brand-navy flex flex-col items-center justify-center px-5 text-center">
      <Thermometer className="w-12 h-12 text-brand-silver mb-4" />
      <h1 className="font-display text-3xl text-brand-white tracking-wider mb-3">NO METRIXSCORE YET</h1>
      <p className="text-brand-silver text-sm mb-6 max-w-xs leading-relaxed">
        Take the free assessment to generate your MetrixScore and unlock your dashboard.
      </p>
      <Link href="/start"
        className="flex items-center gap-2 px-6 py-3 rounded-sm bg-brand-accent text-white text-sm font-semibold tracking-wide uppercase">
        Start Assessment <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )

  // ── Derive everything from the Starter MetrixScore ──────────────────────────
  const answers   = result.answers
  const starter   = buildStarterScore(answers, intake)
  const actions   = generateActions('recommended', starter, intake, 'stabilize')
  const currentAction = actions.find(a => !completed.has(a.id)) ?? null
  const actionsDone   = actions.filter(a => completed.has(a.id)).length
  const totalDone     = completed.size
  const potential     = estimatePotential(answers, intake)

  // Next profile section to complete: least-answered category, weight as tiebreak
  const incomplete = [...starter.categories]
    .filter(c => c.answered < c.total)
    .sort((a, b) => (a.answered - b.answered) || (b.weight - a.weight))
  const nextSection = incomplete[0] ?? null

  const firstName = result.leadName || ''
  const rColor = riskColor(starter.riskLevel)

  return (
    <main className="min-h-dvh bg-brand-navy">

      {/* Header */}
      <div className="px-5 pt-6 pb-6 border-b border-brand-blue/40"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)' }}>
        <Link href="/" className="inline-flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs tracking-wide">Home</span>
        </Link>
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-1">Your Dashboard</p>
        <h1 className="font-display text-3xl tracking-wider text-brand-white leading-none">
          {firstName ? `${firstName.toUpperCase()}'S` : 'YOUR'} PROGRESS
        </h1>
      </div>

      <div className="px-5 max-w-md mx-auto pb-16 pt-6 space-y-6">

        {/* ── Top stats ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          <Stat label="MetrixScore" value={`${starter.overall}`} sub="/ 100" />
          <Stat label="Profile" value={`${starter.progress.completion}%`} sub="complete" />
          <Stat label="Risk" value={starter.riskLabel.split(' ')[0]} color={rColor} />
        </div>

        {/* ── Current focus ─────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-brand-accent" />
            <h2 className="font-display text-xl tracking-wider text-brand-white">CURRENT FOCUS</h2>
          </div>

          <div className="glass rounded-2xl p-5 space-y-4">
            {/* Current roadmap */}
            <div className="flex items-start gap-3">
              <Map className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-brand-silver block mb-0.5">Current Roadmap</span>
                <span className="text-[14px] font-semibold text-brand-white leading-snug">{starter.recommendedPath.label}</span>
                <span className="text-[11px] text-brand-silver block mt-0.5">Stage: {stageLabel(starter.stage) || '—'}</span>
              </div>
            </div>

            {/* Current action */}
            <div className="flex items-start gap-3 rounded-xl px-3 py-3"
              style={{ background: 'rgba(74,144,217,0.1)', border: '1px solid rgba(74,144,217,0.25)' }}>
              <Lightbulb className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-brand-accent block mb-0.5">Current Action</span>
                {currentAction ? (
                  <>
                    <span className="text-[13px] font-semibold text-brand-white leading-snug">{currentAction.title}</span>
                    <span className="text-[11px] text-brand-silver block mt-0.5">
                      {currentAction.estimatedTime} · {currentAction.difficulty} · {currentAction.impact} impact
                    </span>
                  </>
                ) : (
                  <span className="text-[13px] font-semibold text-brand-white leading-snug">
                    All current actions complete — nice work. Pick a new path in your report.
                  </span>
                )}
              </div>
            </div>

            {/* Next profile section */}
            <div className="flex items-start gap-3">
              <ClipboardList className="w-4 h-4 text-brand-silver flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-brand-silver block mb-0.5">Next Profile Section</span>
                <span className="text-[13px] font-medium text-brand-white leading-snug">
                  {nextSection ? nextSection.label : 'Profile complete — every section answered.'}
                </span>
                {nextSection && (
                  <span className="text-[11px] text-brand-silver block mt-0.5">
                    {nextSection.answered}/{nextSection.total} answered
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── MetrixMomentum ────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5" style={{ color: '#3FBE93' }} />
            <h2 className="font-display text-xl tracking-wider text-brand-white">METRIXMOMENTUM</h2>
          </div>

          <div className="rounded-2xl p-5"
            style={{ background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)' }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#1D9E75' }} />
                <div>
                  <div className="font-display text-2xl leading-none text-brand-white">{totalDone}</div>
                  <div className="text-[10px] text-brand-silver/80 mt-0.5">Actions completed</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Thermometer className="w-5 h-5 flex-shrink-0 text-brand-accent" />
                <div>
                  <div className="font-display text-2xl leading-none text-brand-white">{starter.progress.completion}%</div>
                  <div className="text-[10px] text-brand-silver/80 mt-0.5">Profile complete</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Target className="w-5 h-5 flex-shrink-0" style={{ color: '#EFB967' }} />
                <div>
                  <div className="text-[13px] font-semibold leading-tight text-brand-white">
                    {starter.recommendedPath.focusLabel || '—'}
                  </div>
                  <div className="text-[10px] text-brand-silver/80 mt-0.5">Current priority</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-5 h-5 flex-shrink-0" style={{ color: '#4A90D9' }} />
                <div>
                  <div className="font-display text-2xl leading-none text-brand-white">
                    +{potential.improvement}
                  </div>
                  <div className="text-[10px] text-brand-silver/80 mt-0.5">Possible score gain</div>
                </div>
              </div>
            </div>

            {potential.improvement > 0 && (
              <p className="text-[11px] text-brand-silver leading-relaxed mt-4 pt-3 border-t border-white/10">
                Strengthen your weak areas and your MetrixScore could climb from{' '}
                <span className="text-brand-white font-semibold">{potential.current}</span> to about{' '}
                <span className="font-semibold" style={{ color: '#3FBE93' }}>{potential.projected}</span>.
              </p>
            )}
          </div>
        </section>

        {/* ── Footer links ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/start" className="text-[12px] text-brand-accent hover:underline underline-offset-2">
            Update my answers
          </Link>
          <Link href="/unlock" className="inline-flex items-center gap-1.5 text-[12px] text-brand-silver hover:text-brand-white transition-colors">
            Full report <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
