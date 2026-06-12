'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Loader2, Thermometer, Shield, Map, Lightbulb, TrendingUp,
  CheckCircle2, Target, ClipboardList, ArrowRight, ArrowLeft,
  History, RefreshCw, Bell,
} from 'lucide-react'
import type { ScoreResult } from '@/lib/scoring'
import { loadIntake, stageLabel, type QuickIntake } from '@/lib/intake'
import { buildStarterScore, estimatePotential } from '@/lib/metrixReport'
import { generateActions } from '@/lib/pathActions'
import { recordAssessmentSnapshot, recordActionProgress, getRetentionView, type RetentionView } from '@/lib/metrixRetention'
import { RETENTION_COPY } from '@/lib/metrixHistory'
import OutcomeBriefing from '@/components/OutcomeBriefing'
import RoadmapProgressCard from '@/components/RoadmapProgressCard'
import BusinessOutcomeTracker from '@/components/BusinessOutcomeTracker'
import ProgressReviewCard from '@/components/ProgressReviewCard'
import CustomerProofPrompt from '@/components/CustomerProofPrompt'
import GrowthEventTracker from '@/components/GrowthEventTracker'
import GrowthAnalyticsSummary from '@/components/GrowthAnalyticsSummary'

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
  const [retention, setRetention] = useState<RetentionView | null>(null)

  useEffect(() => {
    let parsed: ScoreResult | null = null
    try {
      const raw = sessionStorage.getItem('szm_score') ?? localStorage.getItem('szm_score')
      if (raw) { parsed = JSON.parse(raw) as ScoreResult; setResult(parsed) }
    } catch {}
    const loadedIntake = loadIntake()
    setIntake(loadedIntake)
    let completedIds: string[] = []
    try {
      const pc = localStorage.getItem(PATH_COMPLETE_KEY)
      if (pc) { completedIds = JSON.parse(pc) as string[]; setCompleted(new Set(completedIds)) }
    } catch {}
    setLoaded(true)
    // Local retention loop (device-only): record snapshot + action progress, then read the view.
    if (parsed) {
      try {
        recordAssessmentSnapshot(parsed, loadedIntake)
        recordActionProgress(completedIds, null, 'dashboard_path')
        setRetention(getRetentionView())
      } catch {}
    }
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

  // Local retention view (device-only MetrixScore™ history)
  const lastAssessed = retention?.summary.lastAssessedAt
    ? new Date(retention.summary.lastAssessedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })
    : null
  const prevOverall = retention?.summary.previousOverall ?? null
  const curOverall = retention?.summary.latestOverall ?? null
  const scoreDelta = retention?.summary.scoreDelta ?? null
  const reminder = retention?.reassessmentReminder ?? null
  const nextCheckIn = reminder?.dueAt
    ? new Date(reminder.dueAt).toLocaleDateString('en-US', { dateStyle: 'medium' })
    : null

  return (
    <main className="min-h-dvh bg-brand-navy">
      <GrowthEventTracker milestone="dashboard_viewed" />

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
          <Stat label="MetrixScore™" value={`${starter.overall}`} sub="/ 100" />
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

        {/* ── Roadmap progress (execution engine) ───────────────────── */}
        <RoadmapProgressCard score={starter} intake={intake} variant="dashboard" />

        {/* ── What to work on (next best action + 7-day plan) ───────── */}
        <OutcomeBriefing score={starter} intake={intake} variant="dashboard" />

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

        {/* ── Your Progress (local-device MetrixScore™ history) ─────── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <History className="w-5 h-5 text-brand-accent" />
            <h2 className="font-display text-xl tracking-wider text-brand-white">YOUR PROGRESS</h2>
          </div>
          <div className="glass rounded-2xl p-5 space-y-4">
            {lastAssessed && (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-brand-silver/70">Last assessed</span>
                <span className="text-[12px] text-brand-white font-medium">{lastAssessed}</span>
              </div>
            )}
            {prevOverall !== null && curOverall !== null ? (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-brand-silver/70">Previous → current</span>
                <span className="text-[13px] font-semibold text-brand-white">
                  {prevOverall} → {curOverall}
                  {scoreDelta !== null && (
                    <span className="ml-1.5 text-[11px]" style={{ color: scoreDelta >= 0 ? '#3FBE93' : '#E05A4E' }}>
                      ({scoreDelta >= 0 ? '+' : ''}{scoreDelta})
                    </span>
                  )}
                </span>
              </div>
            ) : (
              <p className="text-[11px] text-brand-silver/70 leading-relaxed">
                This is your first check. Reassess later to see your previous vs current MetrixScore™ here.
              </p>
            )}
            <Link href="/start"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[13px] font-semibold tracking-wide uppercase bg-brand-accent text-white active:scale-[0.98] transition-all touch-target">
              <RefreshCw className="w-4 h-4" /> Recheck My Score
            </Link>
            <p className="text-center text-[10px] text-brand-silver/50">{RETENTION_COPY.localOnly}</p>
          </div>
        </section>

        {/* ── Stay on track (in-app accountability nudge) ───────────── */}
        {reminder && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-5 h-5" style={{ color: '#EFB967' }} />
              <h2 className="font-display text-xl tracking-wider text-brand-white">STAY ON TRACK</h2>
            </div>
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.25)' }}>
              <p className="text-[13px] font-semibold text-brand-white mb-1">{reminder.title}</p>
              <p className="text-[12px] text-brand-silver leading-relaxed">{reminder.detail}</p>
              {nextCheckIn && (
                <p className="text-[11px] text-brand-silver/60 mt-2">Suggested next check-in: {nextCheckIn}</p>
              )}
              <p className="text-[10px] text-brand-silver/50 mt-2">
                In-app reminder only — no emails or texts are sent.
              </p>
            </div>
          </section>
        )}

        {/* ── Business Outcome Tracker (real manual KPI input) ──────── */}
        <BusinessOutcomeTracker />

        {/* ── Progress Review (digest) ──────────────────────────────── */}
        <ProgressReviewCard score={starter} intake={intake} />

        {/* Low-pressure, consent-first feedback (no public posting) */}
        <CustomerProofPrompt trigger="dashboard_returned" />

        {/* Device-local activity summary (no cloud, no business-result claims) */}
        <GrowthAnalyticsSummary />

        {/* ── Footer links ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/start" className="text-[12px] text-brand-accent hover:underline underline-offset-2">
            Update my answers
          </Link>
          <Link href="/unlock" className="inline-flex items-center gap-1.5 text-[12px] text-brand-silver hover:text-brand-white transition-colors">
            Full report <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <p className="text-center text-[9px] text-brand-silver/40 mt-6 leading-relaxed">
          SubZeroMetrix™ and MetrixScore™ are owned by The Modern Trades Mentor LLC.
        </p>
      </div>
    </main>
  )
}
