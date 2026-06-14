'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Loader2, Thermometer, Shield, CheckCircle2, AlertTriangle,
  Map, Lightbulb, Clock, Gauge, TrendingUp, ArrowRight, ArrowLeft, Layers,
} from 'lucide-react'
import type { ScoreResult } from '@/lib/scoring'
import {
  loadIntake, stageLabel, tradeLabel, goalLabel, challengeLabel,
  yearsLabel, revenueLabel, teamLabel, type QuickIntake,
} from '@/lib/intake'
import { explainRisk } from '@/lib/metrixReport'
import { getCanonicalProfile, toMetrixScore } from '@/lib/metrix'
import { generateActions, type PathAction } from '@/lib/pathActions'
import { recordAssessmentSnapshot, type RetentionView } from '@/lib/metrixRetention'
import OutcomeBriefing from '@/components/OutcomeBriefing'
import RoadmapProgressCard from '@/components/RoadmapProgressCard'
import MetrixPriorityExperience from '@/components/MetrixPriorityExperience'
import ReassessmentPanel from '@/components/ReassessmentPanel'
import ProfileIntelligenceCard from '@/components/ProfileIntelligenceCard'
import TradeIntelligenceCard from '@/components/TradeIntelligenceCard'
import LicensingIntelligenceCard from '@/components/LicensingIntelligenceCard'
import ResourceRecommendations from '@/components/ResourceRecommendations'
import ShareReferralCard from '@/components/ShareReferralCard'
import GrowthEventTracker from '@/components/GrowthEventTracker'
import SyncStatusBadge from '@/components/SyncStatusBadge'
import CanonicalSummaryPanel from '@/components/CanonicalSummaryPanel'
import { isFeatureEnabled } from '@/lib/featureFlags'
import { getAssessmentSyncReadiness, syncAssessmentHistoryToAccount } from '@/lib/assessmentHistorySync'
import type { SyncStatus } from '@/lib/syncContracts'

function riskColor(level: string): string {
  switch (level) {
    case 'high':     return '#E05A4E'
    case 'elevated': return '#EF9F27'
    case 'moderate': return '#4A90D9'
    default:         return '#1D9E75'
  }
}
function severityColor(sev: string): string {
  return sev === 'high' ? '#E05A4E' : sev === 'moderate' ? '#EF9F27' : '#4A90D9'
}
function diffColor(d: PathAction['difficulty']): string {
  return d === 'Easy' ? '#1D9E75' : d === 'Moderate' ? '#EF9F27' : '#E05A4E'
}
function impactColor(i: PathAction['impact']): string {
  return i === 'High' ? '#4A90D9' : i === 'Medium' ? '#A8B8CC' : '#6B7A8F'
}

export default function ResultsPage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [intake, setIntake] = useState<QuickIntake | null>(null)
  const [retention, setRetention] = useState<RetentionView | null>(null)
  // Account-2D: assessment/score history backup status. Defaults device-local; only
  // becomes 'synced_to_account' after a confirmed write. Failures are swallowed.
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('saved_on_device')
  const [syncedAt, setSyncedAt] = useState<string | null>(null)

  useEffect(() => {
    let parsed: ScoreResult | null = null
    try {
      const raw = sessionStorage.getItem('szm_score') ?? localStorage.getItem('szm_score')
      if (!raw) { router.replace('/assessment'); return }
      parsed = JSON.parse(raw) as ScoreResult
      setResult(parsed)
    } catch {
      router.replace('/assessment')
      return
    }
    const loadedIntake = loadIntake()
    setIntake(loadedIntake)
    setLoaded(true)
    // Save a local-device MetrixScore™ + MetrixProfile™ snapshot (idempotent per assessment).
    if (parsed) {
      try { setRetention(recordAssessmentSnapshot(parsed, loadedIntake).view) } catch {}
    }
  }, [router])

  // Resolve assessment/score history backup status (additive; never blocks the page).
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const readiness = await getAssessmentSyncReadiness()
        if (readiness.canSync) {
          const result = await syncAssessmentHistoryToAccount()
          if (!cancelled) { setSyncStatus(result.status); setSyncedAt(result.lastSyncedAt) }
        } else if (!cancelled) {
          setSyncStatus(readiness.status)
        }
      } catch {
        // Expected-failure safe: keep the device-local default.
      }
    })()
    return () => { cancelled = true }
  }, [])

  if (!loaded || !result) return (
    <div className="min-h-dvh bg-brand-navy flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
      <p className="text-brand-silver text-sm">Preparing your snapshot…</p>
    </div>
  )

  const answers     = result.answers
  // Canonical read: one evaluation, persisted once, read here (no competing score).
  const profile     = getCanonicalProfile(answers, intake)
  const starter     = toMetrixScore(profile)
  const strengths   = starter.strengths.filter(s => s.score > 0)
  const actions     = generateActions('recommended', starter, intake, 'stabilize').slice(0, 3)
  const firstName   = result.leadName || ''
  const rColor      = riskColor(starter.riskLevel)

  // MetrixProfile™ context (display-only — does not change the score)
  const tradeName  = intake?.trade ? tradeLabel(intake.trade) : ''
  const regionName = intake?.region || ''
  const profileLine =
    tradeName && regionName ? `Built around your ${tradeName} business profile in ${regionName}.`
    : tradeName             ? `Built around your ${tradeName} business profile.`
    : regionName            ? `Built around your contracting business in ${regionName}.`
    : ''
  // Grouped by the field's honest role today: what shapes the Starter score,
  // what personalizes the roadmap, and what is saved as context for later.
  type Pill = { label: string; value: string }
  const pillGroups: { heading: string; note: string; pills: Pill[] }[] = (intake ? [
    {
      heading: 'Score inputs',
      note: 'Shape your Starter MetrixScore™ today',
      pills: [
        { label: 'Stage', value: intake.stage ? stageLabel(intake.stage) : '' },
        { label: 'Team',  value: intake.teamSize ? teamLabel(intake.teamSize) : '' },
      ],
    },
    {
      heading: 'Roadmap priority',
      note: 'Personalize your roadmap order and focus — not your score',
      pills: [
        { label: 'Trade',             value: tradeName },
        { label: 'Region',            value: regionName },
        { label: 'Main goal',         value: intake.mainGoal ? goalLabel(intake.mainGoal) : '' },
        { label: 'Biggest challenge', value: intake.biggestChallenge ? challengeLabel(intake.biggestChallenge) : '' },
      ],
    },
    {
      heading: 'Profile context',
      note: 'Saved now; helps your score get more accurate as your MetrixProfile™ grows',
      pills: [
        { label: 'Years',   value: intake.yearsInBusiness ? yearsLabel(intake.yearsInBusiness) : '' },
        { label: 'Revenue', value: intake.revenueRange ? revenueLabel(intake.revenueRange) : '' },
      ],
    },
  ] : [])
    .map(g => ({ ...g, pills: g.pills.filter(p => p.value) }))
    .filter(g => g.pills.length > 0)

  return (
    <main className="min-h-dvh bg-brand-navy flex flex-col">
      <GrowthEventTracker milestone="results_viewed" />

      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-brand-blue/40"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)' }}>
        <Link href="/" className="inline-flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs tracking-wide">Home</span>
        </Link>
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-1">Your Starter Snapshot</p>
        <h1 className="font-display text-3xl tracking-wider text-brand-white leading-none">
          {firstName ? `${firstName.toUpperCase()},` : ''} HERE&apos;S WHERE YOU STAND
        </h1>
        {profileLine && (
          <p className="text-[12px] text-brand-silver mt-2 leading-relaxed">{profileLine}</p>
        )}
      </div>

      <div className="flex-1 px-5 max-w-md mx-auto w-full pb-10 pt-6 space-y-6">

        {/* Score · Stage · Completion */}
        <div className="flex items-center gap-2 mb-1">
          <Thermometer className="w-5 h-5 text-brand-accent" />
          <h2 className="font-display text-2xl tracking-wider text-brand-white">STARTER METRIXSCORE™</h2>
        </div>
        <div className="glass rounded-2xl p-5 space-y-5">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="px-1">
              <div className="font-display text-3xl leading-none text-brand-white">{starter.overall}</div>
              <div className="font-mono text-[8px] tracking-[0.15em] uppercase text-brand-silver mt-1">Starter / 100</div>
            </div>
            <div className="px-1 border-x border-brand-blue/30">
              <div className="text-[13px] font-semibold leading-tight text-brand-white">{stageLabel(starter.stage) || '—'}</div>
              <div className="font-mono text-[8px] tracking-[0.15em] uppercase text-brand-silver mt-1">MetrixStage</div>
            </div>
            <div className="px-1">
              <div className="font-display text-3xl leading-none text-brand-white">{starter.progress.completion}%</div>
              <div className="font-mono text-[8px] tracking-[0.15em] uppercase text-brand-silver mt-1">Profile</div>
            </div>
          </div>

          {/* Previous vs current (local-device history, when a reassessment exists) */}
          {retention?.previous && retention.latest && (
            <p className="text-[11px] text-center text-brand-silver/70">
              Since your last check:{' '}
              <span className="text-brand-white">{retention.previous.overall}</span> →{' '}
              <span className="text-brand-white">{retention.latest.overall}</span>{' '}
              <span style={{ color: retention.latest.overall - retention.previous.overall >= 0 ? '#3FBE93' : '#E05A4E' }}>
                ({retention.latest.overall - retention.previous.overall >= 0 ? '+' : ''}
                {retention.latest.overall - retention.previous.overall})
              </span>
            </p>
          )}

          {/* Risk language */}
          <div className="rounded-xl px-4 py-3"
            style={{ background: `${rColor}14`, border: `1px solid ${rColor}3a` }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: rColor }} />
              <span className="font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color: rColor }}>
                Risk: {starter.riskLabel}
              </span>
            </div>
            <p className="text-[12px] text-brand-silver leading-relaxed">{explainRisk(starter)}</p>
          </div>

          {/* Top strengths */}
          {strengths.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#1D9E75' }} />
                <span className="font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color: '#3FBE93' }}>Top Strengths</span>
              </div>
              <div className="space-y-2">
                {strengths.map(s => (
                  <div key={s.category} className="flex items-center gap-3">
                    <span className="flex-1 text-[12px] text-brand-silver leading-snug">{s.label}</span>
                    <div className="w-16 progress-track h-1.5 flex-shrink-0">
                      <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: '#1D9E75' }} />
                    </div>
                    <span className="font-mono text-[11px] text-brand-white w-7 text-right flex-shrink-0">{s.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top risk areas */}
          {starter.risks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#EF9F27' }} />
                <span className="font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color: '#EFB967' }}>Top Risk Areas</span>
              </div>
              <div className="space-y-2">
                {starter.risks.map(r => {
                  const c = severityColor(r.severity)
                  return (
                    <div key={r.category} className="flex items-center gap-3">
                      <span className="flex-1 text-[12px] text-brand-silver leading-snug">{r.label}</span>
                      <div className="w-16 progress-track h-1.5 flex-shrink-0">
                        <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: c }} />
                      </div>
                      <span className="font-mono text-[11px] text-brand-white w-7 text-right flex-shrink-0">{r.score}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Wave 7 CP4: canonical-adapter summary (subordinate; flag-gated, OFF by default).
            Sources score/confidence/freshness/sync from buildCanonicalPresentation — no recompute,
            no competing priority CTA. */}
        {isFeatureEnabled('presentation_shell') && (
          <CanonicalSummaryPanel snapshot={profile} syncStatus={syncStatus} syncedAt={syncedAt} />
        )}

        {/* SZM-2B: interactive Metrix Priority experience (read-only, from the canonical snapshot) */}
        <MetrixPriorityExperience snapshot={profile} />

        {/* Wave 2: profile intelligence — lifecycle, completeness, explainability (display-only adapter) */}
        <ProfileIntelligenceCard snapshot={profile} />

        {/* Wave 3: trade context — trade-specific strengths/risks/recurring revenue (display-only; subordinate) */}
        <TradeIntelligenceCard snapshot={profile} variant="full" />

        {/* Wave 4: licensing & jurisdiction — verify-before-action, official-source-backed (display-only; subordinate) */}
        <LicensingIntelligenceCard snapshot={profile} variant="full" />

        {/* Wave 5: optional, profile-aware resource suggestions (display-only; subordinate to the priority CTA) */}
        <ResourceRecommendations snapshot={profile} placement="results" limit={3} />

        {/* Wave 1: explicit, user-triggered reassessment (never auto-rescores on load) */}
        <ReassessmentPanel snapshot={profile} answers={answers} intake={intake} />

        {/* Why this score? + next improvement lever (explanation only) */}
        <OutcomeBriefing score={starter} intake={intake} variant="results" />

        {/* Fix-3: prominent free next-step paths (Foundation primary, Growth secondary) */}
        <section className="glass rounded-2xl p-5">
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver mb-2">Your next step (free)</p>
          <Link href="/foundation-builder"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[13px] font-bold tracking-wide uppercase bg-brand-accent text-white active:scale-[0.98] transition-all touch-target">
            Build your business foundation <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[11px] text-brand-silver/70 leading-relaxed mt-2">
            Track the real-world setup steps — identity, legal, licensing, banking, brand, and launch —
            for your trade and state.
          </p>
          <Link href="/growth"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[12px] font-semibold glass text-brand-white active:scale-[0.98] transition-all touch-target mt-3">
            Already launched? Open the Customer Growth Roadmap <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <p className="text-[11px] text-brand-silver/70 leading-relaxed mt-2">
            For working contractors who want more customers — find your real growth constraint and the
            highest-impact next moves. Educational only; no guaranteed results.
          </p>
        </section>

        {/* Roadmap progress (light preview) */}
        <RoadmapProgressCard score={starter} intake={intake} variant="results" />

        {/* MetrixProfile™ context */}
        {pillGroups.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-brand-accent" />
              <h2 className="font-display text-xl tracking-wider text-brand-white">YOUR METRIXPROFILE™</h2>
            </div>
            <div className="glass rounded-2xl p-5 space-y-4">
              <p className="text-[12px] text-brand-silver leading-relaxed">
                Here&apos;s how each detail you shared is being used right now. Some shape your Starter
                MetrixScore™, some personalize your roadmap, and the rest are saved as context for later.
              </p>
              {pillGroups.map(g => (
                <div key={g.heading}>
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-accent">{g.heading}</span>
                    <span className="text-[10px] text-brand-silver/60 leading-snug">{g.note}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {g.pills.map(p => (
                      <span key={p.label} className="text-[11px] px-3 py-1.5 rounded-sm leading-snug"
                        style={{ background: 'rgba(168,184,204,0.1)', color: '#C8D4E0' }}>
                        <span className="text-brand-silver/60">{p.label}:</span> {p.value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Progressive MetrixScore™ explanation */}
        <div className="glass-light rounded-xl px-4 py-3">
          <p className="text-[12px] text-brand-silver leading-relaxed">
            Your Starter MetrixScore™ gives you a fast snapshot based on your current profile depth.
            As your MetrixProfile™ grows — more answers, deeper roadmap sections, and tracked actions
            over time — your score becomes more accurate and more useful.
          </p>
          <p className="text-[11px] text-brand-silver/60 leading-relaxed mt-2">
            Some fields help us personalize your roadmap today; deeper scoring uses more of your profile
            in Pro. Nothing here is a final, benchmarked, or predictive score — it&apos;s a starting point
            that improves as you do.
          </p>
        </div>

        {/* Recommended path preview */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Map className="w-5 h-5 text-brand-accent" />
            <h2 className="font-display text-xl tracking-wider text-brand-white">RECOMMENDED PATH</h2>
          </div>
          <div className="rounded-2xl p-5"
            style={{ background: 'rgba(74,144,217,0.1)', border: '1px solid rgba(74,144,217,0.3)' }}>
            <h3 className="text-[15px] font-semibold text-brand-white mb-1">{starter.recommendedPath.label}</h3>
            <p className="text-[12px] text-brand-silver leading-relaxed">{starter.recommendedPath.rationale}</p>
          </div>
        </section>

        {/* First 3 actions */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-brand-accent" />
            <h2 className="font-display text-xl tracking-wider text-brand-white">YOUR FIRST 3 MOVES</h2>
          </div>
          <div className="space-y-3">
            {actions.map((a, i) => (
              <div key={a.id} className="rounded-xl p-4"
                style={{ background: 'rgba(10,22,40,0.5)', border: '1px solid rgba(168,184,204,0.15)' }}>
                <div className="flex items-start gap-2 mb-1">
                  <span className="font-mono text-[10px] text-brand-accent mt-0.5 flex-shrink-0">{i + 1}</span>
                  <h3 className="text-[14px] font-semibold leading-snug text-brand-white">{a.title}</h3>
                </div>
                <p className="text-[12px] text-brand-silver leading-relaxed mb-2.5 pl-4">{a.whyItMatters}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pl-4">
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
            ))}
          </div>
        </section>

        {/* Save note (no working save yet — Phase B) */}
        <div className="glass-light rounded-xl px-4 py-3">
          <p className="text-[11px] text-brand-silver leading-relaxed">
            Your Starter Snapshot is saved on this device. Visit your{' '}
            <Link href="/dashboard" className="text-brand-accent underline underline-offset-2">dashboard</Link>{' '}
            to track progress and reassess over time. Cloud account sync is coming later.
          </p>
          {/* Account-2D: assessment history backup status — device-local until a confirmed write */}
          <SyncStatusBadge status={syncStatus} lastSyncedAt={syncedAt} entityType="assessment_history" compact className="mt-2" />
        </div>

        {/* Share / invite another contractor (manual share only) */}
        <ShareReferralCard context="results" />

        {/* Primary CTA */}
        <div>
          <Link href="/unlock"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl text-sm font-semibold tracking-wide uppercase bg-brand-accent text-white shadow-glow-blue active:scale-[0.98] transition-all touch-target">
            Unlock Full Roadmap <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-center text-[10px] text-brand-silver mt-3 leading-relaxed">
            Full 12-phase roadmap, financial &amp; sales systems, tool library, and progress tracking.
          </p>
        </div>
      </div>
    </main>
  )
}
