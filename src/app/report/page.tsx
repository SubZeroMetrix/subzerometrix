'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight, CheckCircle2, AlertCircle, TrendingUp, AlertTriangle,
  BookOpen, Shield, Loader2, Map, ExternalLink, ChevronDown,
  ChevronUp, Lightbulb, DollarSign, TriangleAlert, Thermometer,
} from 'lucide-react'
import { getBandColor, type ScoreResult } from '@/lib/scoring'
import { PLATFORM_ROUTES } from '@/lib/questions'
import { affiliateUrl, AFFILIATE_PARTNERS, type AffiliateCategory } from '@/lib/affiliates'
import { buildPersonalizedRoadmap, URGENCY_CONFIG, type RoadmapPhase, type ComputedRoadmapItem, type UrgencyLevel } from '@/lib/roadmap'
import { roadmapFocus, pathReason } from '@/lib/roadmapFocus'
import { SCORE_IMPACT_PER_TAB } from '@/lib/growthRoadmap'
import { getGrowthPhases } from '@/lib/growthPhases'
import { getVendorsForPhase } from '@/lib/vendorCategories'
import { getPlaybooksForPhase, type SalesPlaybook } from '@/lib/salesPlaybooks'
import { getFlyersByIds, getRoadPathsForPhase, SOCIAL_STARTER_PLAN } from '@/lib/marketingAssets'
import { getFinancialPathsForPhase, type FinancialPath } from '@/lib/financialSystemsRoadmap'
import { STATE_RESOURCES } from '@/lib/stateResources'
import { loadIntake, goalLabel, challengeLabel, stageLabel, type QuickIntake } from '@/lib/intake'
import { buildStarterScore, explainRisk, firstAction, alternativePaths } from '@/lib/metrixReport'
import ChoosePathSection from '@/components/ChoosePathSection'
import OutcomeBriefing from '@/components/OutcomeBriefing'
import RoadmapProgressCard from '@/components/RoadmapProgressCard'
import ProgressReviewCard from '@/components/ProgressReviewCard'
import CustomerProofPrompt from '@/components/CustomerProofPrompt'
import GrowthEventTracker from '@/components/GrowthEventTracker'
import FeedbackBox from '@/components/FeedbackBox'
import { trackEvent } from '@/lib/analytics'

// ── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 58, circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 136 136">
        <circle cx="68" cy="68" r={r} fill="none" stroke="rgba(168,184,204,0.1)" strokeWidth="9" />
        <circle cx="68" cy="68" r={r} fill="none" stroke={color} strokeWidth="9"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl text-brand-white leading-none">{score}</span>
        <span className="font-mono text-[9px] tracking-widest text-brand-silver uppercase">/100</span>
      </div>
    </div>
  )
}

// ── Category bar ──────────────────────────────────────────────────────────────
function CategoryBar({ label, score, max, color }: { key?: string; label: string; score: number; max: number; color: string }) {
  const pct = Math.round((score / max) * 100)
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-brand-silver">{label}</span>
        <span className="font-mono text-xs text-brand-white">
          {score}<span className="text-brand-silver">/{max}</span>
        </span>
      </div>
      <div className="progress-track h-1.5">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

// ── Roadmap item card — education first, vendors last ─────────────────────────
function RoadmapItemCard({
  item, index, completed, onToggleComplete,
}: {
  key?: string
  item: ComputedRoadmapItem
  index: number
  completed: boolean
  onToggleComplete: () => void
}) {
  const [open, setOpen] = useState(index === 0)
  const [showVendors, setShowVendors] = useState(false)
  const uc = URGENCY_CONFIG[item.computedUrgency]

  return (
    <div className="rounded-sm overflow-hidden mb-3"
      style={{
        border: completed
          ? '1px solid rgba(29,158,117,0.4)'
          : `1px solid ${open ? uc.color + '50' : 'rgba(168,184,204,0.15)'}`,
        background: completed ? 'rgba(29,158,117,0.05)' : 'rgba(10,22,40,0.5)',
        opacity: completed ? 0.72 : 1,
      }}>

      {/* Header */}
      <button onClick={() => setOpen((o: boolean) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold"
          style={{
            background: completed ? 'rgba(29,158,117,0.2)' : uc.bg,
            color: completed ? '#1D9E75' : uc.color,
            border: `1px solid ${completed ? '#1D9E75' : uc.color}40`,
          }}>
          {completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : index + 1}
        </div>
        <span className="flex-1 text-[13px] font-semibold text-brand-white leading-snug pr-2">{item.title}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {item.focusPriority && !completed && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-sm hidden sm:block"
              style={{ background: 'rgba(239,159,39,0.14)', color: '#EFB967', border: '1px solid rgba(239,159,39,0.35)' }}>
              Focus area
            </span>
          )}
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-sm hidden sm:block"
            style={{ background: uc.bg, color: uc.color }}>
            {completed ? 'Done' : uc.label}
          </span>
          {open ? <ChevronUp className="w-3.5 h-3.5 text-brand-silver/50" />
                : <ChevronDown className="w-3.5 h-3.5 text-brand-silver/50" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>

          {/* 1. Why it matters — always first */}
          <div className="pt-3 mb-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Lightbulb className="w-3 h-3 text-brand-accent flex-shrink-0" />
              <span className="font-mono text-[9px] tracking-widest uppercase text-brand-accent">Why this matters</span>
            </div>
            <p className="text-[12px] text-brand-silver leading-relaxed">{item.whyItMatters}</p>
          </div>

          {/* 2. What to look for */}
          <div className="mb-4 px-3 py-2.5 rounded-sm"
            style={{ background: 'rgba(74,144,217,0.07)', border: '1px solid rgba(74,144,217,0.2)' }}>
            <p className="font-mono text-[9px] tracking-widest uppercase text-brand-accent mb-1">What to look for</p>
            <p className="text-[11px] text-brand-silver leading-relaxed">{item.whatToLookFor}</p>
          </div>

          {/* 3. Cost range */}
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-3.5 h-3.5 text-brand-silver/60 flex-shrink-0" />
            <span className="text-[11px] text-brand-silver">
              <strong className="text-brand-white">Cost range: </strong>{item.estimatedCostRange}
            </span>
          </div>

          {/* 4. Common mistakes */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <TriangleAlert className="w-3 h-3 text-yellow-500/70 flex-shrink-0" />
              <span className="font-mono text-[9px] tracking-widest uppercase text-yellow-500/70">Common mistakes to avoid</span>
            </div>
            <div className="space-y-1.5">
              {item.commonMistakes.map((m, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-yellow-500/50 text-[10px] flex-shrink-0 mt-0.5">—</span>
                  <span className="text-[11px] text-brand-silver/80 leading-relaxed">{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. DIY option — always shown */}
          <div className="mb-4 rounded-sm p-3"
            style={{ background: 'rgba(29,158,117,0.07)', border: '1px solid rgba(29,158,117,0.25)' }}>
            <p className="font-mono text-[9px] tracking-widest uppercase mb-1.5"
              style={{ color: '#1D9E75' }}>
              Do it yourself
            </p>
            <p className="text-[12px] font-medium text-brand-white mb-1">{item.diyOption.title}</p>
            <p className="text-[11px] text-brand-silver leading-relaxed mb-2">{item.diyOption.description}</p>
            <div className="space-y-1">
              {item.diyOption.resources.map((r: { label: string; url: string }) => (
                <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] hover:underline underline-offset-2"
                  style={{ color: '#1D9E75' }}>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  {r.label}
                  <span className="text-brand-silver/40 ml-auto text-[9px]">Free/official</span>
                </a>
              ))}
            </div>
          </div>

          {/* 6. Vendor options — after all education, opt-in reveal */}
          {item.vendorOptions.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => setShowVendors((v: boolean) => !v)}
                className="flex items-center gap-2 text-[11px] text-brand-silver/70 hover:text-brand-silver transition-colors mb-2">
                {showVendors ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {showVendors ? 'Hide vendor options' : `See ${item.vendorOptions.length} vendor option${item.vendorOptions.length > 1 ? 's' : ''} that may help`}
              </button>

              {showVendors && (
                <div className="space-y-2">
                  {/* Disclosure — before vendors, every time */}
                  <p className="text-[9px] text-brand-silver/50 leading-relaxed px-1 pb-1"
                    style={{ borderBottom: '1px solid rgba(168,184,204,0.1)' }}>
                    Tool recommendations are provided for educational purposes. SubZeroMetrix may
                    pursue affiliate or vendor relationships in the future, but current recommendations
                    should be evaluated independently based on fit, pricing, support, and business needs.{' '}
                    <Link href="/affiliate-disclosure" className="text-brand-accent hover:underline">
                      Learn more →
                    </Link>
                  </p>

                  {item.vendorOptions.map(vendor => {
                    const partner = vendor.affiliateId
                      ? AFFILIATE_PARTNERS.find(p => p.id === vendor.affiliateId)
                      : null
                    const href = partner ? affiliateUrl(partner) : vendor.url

                    return (
                      <div key={vendor.name} className="rounded-sm p-3"
                        style={{ background: 'rgba(13,43,92,0.4)', border: '1px solid rgba(168,184,204,0.12)' }}>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[13px] font-medium text-brand-white">{vendor.name}</span>
                          {vendor.isFree && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium"
                              style={{ background: 'rgba(29,158,117,0.15)', color: '#1D9E75' }}>
                              Free option
                            </span>
                          )}
                          <span className="text-[10px] text-brand-silver/60 ml-auto">{vendor.priceRange}</span>
                        </div>
                        <p className="text-[11px] mb-0.5 leading-relaxed"
                          style={{ color: '#1D9E75' }}>
                          ✓ Good fit if: {vendor.bestFor}
                        </p>
                        <p className="text-[11px] text-brand-silver/60 mb-2 leading-relaxed">
                          ✗ Skip if: {vendor.notFor}
                        </p>
                        <a href={href} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] text-brand-accent hover:underline underline-offset-2">
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          Visit {vendor.name}
                        </a>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* State-gated notice */}
          {item.stateLinked && (
            <div className="mb-3 px-3 py-2 rounded-sm text-[10px] text-brand-silver/70 leading-relaxed"
              style={{ background: 'rgba(239,159,39,0.07)', border: '1px solid rgba(239,159,39,0.2)' }}>
              Requirements vary by city and county. Always verify with your local county clerk
              or city business office — state rules are the floor, not the ceiling.
            </div>
          )}

          {/* Mark complete */}
          <button onClick={onToggleComplete}
            className="w-full py-2 rounded-sm text-[11px] font-medium transition-all"
            style={{
              background: completed ? 'rgba(29,158,117,0.15)' : 'rgba(168,184,204,0.07)',
              border: `1px solid ${completed ? 'rgba(29,158,117,0.4)' : 'rgba(168,184,204,0.2)'}`,
              color: completed ? '#1D9E75' : '#A8B8CC',
            }}>
            {completed ? '✓ Completed — click to undo' : 'Mark as complete'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Phase group ───────────────────────────────────────────────────────────────
function PhaseGroup({
  phase, completedSteps, onToggleComplete,
}: {
  key?: string
  phase: RoadmapPhase
  completedSteps: Set<string>
  onToggleComplete: (id: string) => void
}) {
  const doneCount = phase.items.filter(i => completedSteps.has(i.id)).length

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-display text-base tracking-wider text-brand-white">
          {phase.title}
        </h3>
        {doneCount > 0 && (
          <span className="text-[10px] font-mono text-brand-silver/50">
            {doneCount}/{phase.items.length} done
          </span>
        )}
      </div>
      <p className="text-[11px] text-brand-silver/60 mb-3">{phase.subtitle}</p>
      {phase.items.map((item, i) => (
        <RoadmapItemCard
          key={item.id}
          item={item}
          index={i}
          completed={completedSteps.has(item.id)}
          onToggleComplete={() => onToggleComplete(item.id)}
        />
      ))}
    </div>
  )
}

// ── Playbook accordion card ───────────────────────────────────────────────────
function PlaybookCard({ pb, bandColor }: { pb: SalesPlaybook; bandColor: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-sm overflow-hidden"
      style={{ background: 'rgba(13,43,92,0.4)', border: '1px solid rgba(168,184,204,0.12)' }}>

      {/* Header — always visible */}
      <button className="w-full flex items-start justify-between gap-2 p-3 text-left"
        onClick={() => setOpen(!open)}>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[12px] font-semibold text-brand-white">{pb.title}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-mono uppercase tracking-wide"
              style={{ background: 'rgba(74,144,217,0.12)', color: '#7BB3D9' }}>
              {pb.scenario.replace(/-/g, ' ')}
            </span>
          </div>
          <p className="text-[10px] text-brand-silver/70 leading-relaxed">{pb.summary}</p>
        </div>
        <span className="flex-shrink-0 mt-0.5">
          {open
            ? <ChevronUp className="w-3.5 h-3.5" style={{ color: bandColor }} />
            : <ChevronDown className="w-3.5 h-3.5 text-brand-silver/40" />}
        </span>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Why it works */}
          <div className="pt-2.5">
            <p className="font-mono text-[8px] tracking-widest uppercase text-brand-silver/40 mb-1">Why It Works</p>
            <p className="text-[10px] text-brand-silver/80 leading-relaxed">{pb.whyItWorks}</p>
          </div>

          {/* Step-by-step */}
          <div>
            <p className="font-mono text-[8px] tracking-widest uppercase text-brand-silver/40 mb-1.5">Step-by-Step Path</p>
            <div className="space-y-2">
              {pb.steps.map(step => (
                <div key={step.stepNumber} className="rounded-sm px-2.5 py-2"
                  style={{ background: 'rgba(168,184,204,0.04)', border: '1px solid rgba(168,184,204,0.08)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-mono text-[9px] flex-shrink-0" style={{ color: bandColor }}>
                      {step.stepNumber}.
                    </span>
                    <span className="text-[10px] font-semibold text-brand-white leading-snug">{step.title}</span>
                  </div>
                  {step.script && (
                    <p className="text-[9px] text-brand-silver/70 leading-relaxed italic mb-1">
                      &ldquo;{step.script}&rdquo;
                    </p>
                  )}
                  <p className="text-[9px] text-brand-silver/50 leading-relaxed">{step.notes}</p>
                  {step.avoidThis && (
                    <p className="text-[9px] mt-1 leading-relaxed" style={{ color: '#EF9F27' }}>
                      Avoid: {step.avoidThis}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Common mistakes */}
          <div>
            <p className="font-mono text-[8px] tracking-widest uppercase text-brand-silver/40 mb-1.5">Common Mistakes</p>
            <div className="space-y-1">
              {pb.commonMistakes.map((m, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-[10px] flex-shrink-0 mt-0.5" style={{ color: '#EF9F27' }}>—</span>
                  <p className="text-[10px] text-brand-silver/70 leading-relaxed">{m}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What to measure */}
          <div className="rounded-sm px-3 py-2"
            style={{ background: 'rgba(29,158,117,0.07)', border: '1px solid rgba(29,158,117,0.2)' }}>
            <p className="font-mono text-[8px] tracking-widest uppercase mb-1" style={{ color: '#1D9E75' }}>
              What to Measure
            </p>
            <p className="text-[10px] text-brand-silver leading-relaxed">{pb.successMetric}</p>
          </div>

          {/* Upgrade preview */}
          <div className="rounded-sm px-3 py-2"
            style={{ background: 'rgba(239,159,39,0.07)', border: '1px solid rgba(239,159,39,0.2)' }}>
            <p className="font-mono text-[8px] tracking-widest uppercase mb-1.5" style={{ color: '#EF9F27' }}>
              🔒 Full Module Preview
            </p>
            <div className="space-y-0.5">
              {pb.lockedContent.split('·').filter(s => s.trim()).map((item, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-brand-silver/30 text-[9px] flex-shrink-0 mt-0.5">·</span>
                  <p className="text-[9px] text-brand-silver/50 leading-relaxed">{item.trim()}</p>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-brand-silver/30 mt-2">
              Coming soon — full scripts, templates &amp; training guides
            </p>
          </div>

        </div>
      )}
    </div>
  )
}

// ── Social Starter Plan section (Phase 10 only) ───────────────────────────────
function SocialStarterPlanSection({ bandColor }: { bandColor: string }) {
  const [openWeek, setOpenWeek] = useState<number | null>(1)

  const HOW_TO_START = [
    { step: 1, action: 'Claim and complete Google Business Profile', detail: 'Add your trade, service area, phone, hours, and at least 5 job photos. This is your most important free marketing asset.' },
    { step: 2, action: 'Post proof of real work', detail: 'Upload a clean photo of a completed job to Google and Facebook today. The work speaks for itself.' },
    { step: 3, action: 'Capture before/after photos with permission', detail: 'Ask verbally at every job: "Mind if I grab a before/after for our social?" Most customers say yes immediately.' },
    { step: 4, action: 'Post one helpful maintenance tip per week', detail: 'Trade tips get saved and shared by homeowners. One post per week builds authority without selling.' },
    { step: 5, action: 'Turn good reviews into social proof', detail: 'Screenshot 5-star reviews and post them to Facebook and Instagram. Add a short thank-you line. Reviews as content build trust without effort.' },
    { step: 6, action: 'Film simple jobsite clips', detail: '30 seconds: what the problem was, what you did, what it looks like now. No editing. Post to Reels, TikTok, and YouTube Shorts.' },
    { step: 7, action: 'Use seasonal reminders', detail: 'Pre-summer AC, pre-winter heat, spring plumbing, fall electrical. Seasonal content generates real calls from homeowners already thinking about it.' },
    { step: 8, action: 'Track calls and messages from social', detail: 'Ask every new caller "how did you find us?" After 90 days you\'ll know which platforms are actually driving business.' },
  ]

  const PLATFORMS = [
    { name: 'Google Business Profile', icon: '🔍', why: 'Highest-converting for trades. Shows in local search. Post job photos and updates weekly.' },
    { name: 'Facebook', icon: '👥', why: 'Best for local community reach. Homeowners aged 35–65 use it daily. Before/after posts travel.' },
    { name: 'Instagram', icon: '📸', why: 'Finished jobs, team introductions, before/after photos. Strong visual trust-builder.' },
    { name: 'TikTok / Reels', icon: '🎬', why: 'Short jobsite videos get massive organic reach. Trades content performs extremely well here.' },
    { name: 'YouTube Shorts', icon: '▶️', why: 'Searchable and stays discoverable for years. One 60-second how-to clip keeps working.' },
    { name: 'LinkedIn', icon: '💼', why: 'Commercial credibility for property managers and builders. Post project highlights and certifications.' },
  ]

  const FILM_TIPS = [
    'Always ask for verbal permission before filming a customer\'s property',
    'Clean up the work area before filming — the photo is part of your presentation',
    'Landscape for longer installs; portrait/vertical for Reels and TikTok',
    'Film in natural daylight whenever possible — no ring light needed',
    'Show your logo or truck in the background when you can',
    'Film the problem first, then the solution — two-part clips tell a story',
  ]

  const NOT_TO_POST = [
    'Code violations or dangerous conditions before they are fixed',
    'Customer names or addresses without clear permission',
    'Negative comments about competitors or other contractors',
    'Unsafe work practices — even framed as humor',
    'Unfinished work or messy job sites',
    'Pricing that will conflict with your actual quotes',
  ]

  return (
    <div className="space-y-5">
      <div>
        <p className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: bandColor }}>
          30-Day Social Media Starter Plan
        </p>
        <p className="text-[11px] text-brand-silver/70 leading-relaxed">
          Four weeks, three posts per week. No paid ads, no agency, no elaborate setup — just a repeatable habit using real job content.
        </p>
      </div>

      {/* Week accordions */}
      <div className="space-y-2">
        {SOCIAL_STARTER_PLAN.map(week => {
          const isOpen = openWeek === week.weekNumber
          return (
            <div key={week.weekNumber} className="rounded-sm overflow-hidden"
              style={{
                border: `1px solid ${isOpen ? bandColor + '50' : 'rgba(168,184,204,0.13)'}`,
                background: 'rgba(10,22,40,0.5)',
              }}>
              <button
                className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                onClick={() => setOpenWeek(isOpen ? null : week.weekNumber)}>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-brand-silver/40 tracking-widest">WEEK {week.weekNumber}</span>
                  <span className="text-[12px] font-semibold text-brand-white">{week.theme}</span>
                </div>
                {isOpen
                  ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" style={{ color: bandColor }} />
                  : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 text-brand-silver/40" />}
              </button>
              {isOpen && (
                <div className="px-3 pb-3 space-y-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[10px] text-brand-silver/50 pt-2 leading-relaxed italic">{week.goal}</p>
                  {week.posts.map(post => (
                    <div key={post.dayNumber} className="rounded-sm p-2.5"
                      style={{ background: 'rgba(13,43,92,0.4)', border: '1px solid rgba(168,184,204,0.1)' }}>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-[8px] text-brand-silver/40 tracking-widest">DAY {post.dayNumber}</span>
                        <span className="text-[11px] font-semibold text-brand-white">{post.theme}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-sm"
                          style={{ background: 'rgba(74,144,217,0.12)', color: '#7BB3D9' }}>
                          {post.contentType}
                        </span>
                      </div>
                      <p className="text-[9px] text-brand-silver/40 mb-1.5">{post.platform.join(' · ')}</p>
                      <p className="text-[10px] text-brand-silver leading-relaxed mb-1.5 italic">
                        &ldquo;{post.caption.length > 180 ? post.caption.slice(0, 177) + '…' : post.caption}&rdquo;
                      </p>
                      <p className="text-[9px] font-medium" style={{ color: bandColor }}>CTA: {post.callToAction}</p>
                      {post.notes && (
                        <p className="text-[9px] text-brand-silver/40 mt-1 leading-relaxed">{post.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* How to start path */}
      <div>
        <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver/50 mb-2">How to Start</p>
        <div className="space-y-1.5">
          {HOW_TO_START.map(item => (
            <div key={item.step} className="flex items-start gap-2.5 rounded-sm px-3 py-2"
              style={{ background: 'rgba(13,43,92,0.3)', border: '1px solid rgba(168,184,204,0.08)' }}>
              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                style={{ background: `${bandColor}20`, color: bandColor }}>
                {item.step}
              </span>
              <div>
                <p className="text-[11px] font-medium text-brand-white leading-snug">{item.action}</p>
                <p className="text-[10px] text-brand-silver/60 leading-relaxed mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform guide */}
      <div>
        <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver/50 mb-2">Where to Post</p>
        <div className="grid grid-cols-2 gap-2">
          {PLATFORMS.map(p => (
            <div key={p.name} className="rounded-sm p-2.5"
              style={{ background: 'rgba(13,43,92,0.3)', border: '1px solid rgba(168,184,204,0.1)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base leading-none">{p.icon}</span>
                <span className="text-[10px] font-medium text-brand-white leading-tight">{p.name}</span>
              </div>
              <p className="text-[9px] text-brand-silver/50 leading-relaxed">{p.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filming tips + what not to post */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-sm p-3"
          style={{ background: 'rgba(29,158,117,0.07)', border: '1px solid rgba(29,158,117,0.25)' }}>
          <p className="font-mono text-[9px] tracking-widest uppercase mb-2" style={{ color: '#1D9E75' }}>Filming Tips</p>
          <div className="space-y-1">
            {FILM_TIPS.map((tip, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-[10px] flex-shrink-0 mt-0.5" style={{ color: '#1D9E75' }}>·</span>
                <p className="text-[10px] text-brand-silver/70 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-sm p-3"
          style={{ background: 'rgba(239,159,39,0.07)', border: '1px solid rgba(239,159,39,0.25)' }}>
          <p className="font-mono text-[9px] tracking-widest uppercase mb-2" style={{ color: '#EF9F27' }}>What Not to Post</p>
          <div className="space-y-1">
            {NOT_TO_POST.map((item, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-[10px] flex-shrink-0 mt-0.5" style={{ color: '#EF9F27' }}>—</span>
                <p className="text-[10px] text-brand-silver/70 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Financial Path Card ───────────────────────────────────────────────────────
function FinancialPathCard({ path, bandColor }: { path: FinancialPath; bandColor: string }) {
  const [open, setOpen] = useState(false)
  const stageColor: Record<string, string> = { startup: '#4A90D9', growing: '#EF9F27', scaling: '#1D9E75' }
  return (
    <div className="rounded-sm overflow-hidden"
      style={{ background: 'rgba(13,43,92,0.4)', border: '1px solid rgba(168,184,204,0.12)' }}>
      <button className="w-full flex items-start justify-between gap-2 p-3 text-left"
        onClick={() => setOpen(!open)}>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm leading-none">{path.icon}</span>
            <span className="text-[12px] font-semibold text-brand-white">{path.title}</span>
          </div>
          <p className="text-[10px] text-brand-silver/60 leading-relaxed">{path.whyItMatters}</p>
        </div>
        <span className="flex-shrink-0 mt-0.5">
          {open
            ? <ChevronUp className="w-3.5 h-3.5" style={{ color: bandColor }} />
            : <ChevronDown className="w-3.5 h-3.5 text-brand-silver/40" />}
        </span>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="pt-2.5 rounded-sm px-3 py-2"
            style={{ background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)' }}>
            <p className="font-mono text-[8px] tracking-widest uppercase mb-1" style={{ color: '#1D9E75' }}>First Action</p>
            <p className="text-[10px] text-brand-white leading-relaxed">{path.firstAction}</p>
          </div>
          <div>
            <p className="font-mono text-[8px] tracking-widest uppercase text-brand-silver/40 mb-1.5">By Stage</p>
            <div className="space-y-1.5">
              {path.stages.map(s => (
                <div key={s.stage} className="rounded-sm px-2.5 py-2"
                  style={{ background: `${stageColor[s.stage]}0d`, border: `1px solid ${stageColor[s.stage]}30` }}>
                  <p className="text-[10px] font-medium mb-1" style={{ color: stageColor[s.stage] }}>{s.stageLabel}</p>
                  <div className="space-y-0.5">
                    {s.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-[9px] flex-shrink-0 mt-0.5" style={{ color: stageColor[s.stage] }}>·</span>
                        <p className="text-[10px] text-brand-silver/70 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-[8px] tracking-widest uppercase text-brand-silver/40 mb-1">What to Measure</p>
            <div className="space-y-0.5">
              {path.whatToMeasure.map((m, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="flex-shrink-0 mt-0.5 text-[9px]" style={{ color: bandColor }}>·</span>
                  <p className="text-[10px] text-brand-silver/70 leading-relaxed">{m}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-[8px] tracking-widest uppercase text-brand-silver/40 mb-1">What to Avoid</p>
            <div className="space-y-0.5">
              {path.whatToAvoid.map((a, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="flex-shrink-0 mt-0.5 text-[10px]" style={{ color: '#EF9F27' }}>—</span>
                  <p className="text-[10px] text-brand-silver/70 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-sm px-3 py-2"
            style={{ background: 'rgba(239,159,39,0.06)', border: '1px solid rgba(239,159,39,0.18)' }}>
            <p className="font-mono text-[8px] tracking-widest uppercase mb-1" style={{ color: '#EF9F27' }}>🔒 Full Module Preview</p>
            <p className="text-[10px] text-brand-silver/50 leading-relaxed">{path.upgradePreview}</p>
            <p className="text-[9px] text-brand-silver/30 mt-1">Coming soon — templates, checklists &amp; calculators</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function ReportContent() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [verifying, setVerifying] = useState(true)
  const [paid, setPaid] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [completedGrowthTabs, setCompletedGrowthTabs] = useState<Set<string>>(new Set())
  const [activeGrowthTabId, setActiveGrowthTabId] = useState('')
  const [activePhaseSubTab, setActivePhaseSubTab] = useState<'overview' | '90day' | 'tools' | 'sales' | 'upgrade'>('overview')
  const [activeTab, setActiveTab] = useState<'score' | 'roadmap' | 'resources'>('score')
  const [intake, setIntake] = useState<QuickIntake | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) { setVerifying(false); setVerifyError('No payment session found.'); return }

    fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`)
      .then(r => r.json())
      .then(d => { if (d.paid === true) setPaid(true); else setVerifyError(d.error ?? 'Payment could not be verified.') })
      .catch(() => setVerifyError('Could not verify payment. Please contact support.'))
      .finally(() => setVerifying(false))

    try {
      const raw = sessionStorage.getItem('szm_score') ?? localStorage.getItem('szm_score')
      if (raw) setResult(JSON.parse(raw))
    } catch {}

    try {
      const fc = localStorage.getItem('szm_foundation_complete')
      if (fc) setCompletedSteps(new Set(JSON.parse(fc) as string[]))
    } catch {}

    try {
      const gc = localStorage.getItem('szm_growth_complete')
      if (gc) setCompletedGrowthTabs(new Set(JSON.parse(gc) as string[]))
    } catch {}

    // Read the pre-assessment Quick Intake (supplementary context, optional)
    setIntake(loadIntake())
  }, [searchParams])

  // Analytics placeholder — fires once when the report mounts
  useEffect(() => { trackEvent('report_view') }, [])

  if (verifying) return (
    <div className="min-h-dvh bg-brand-navy flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
      <p className="text-brand-silver text-sm">Verifying payment…</p>
    </div>
  )

  if (!paid) return (
    <div className="min-h-dvh bg-brand-navy flex flex-col items-center justify-center px-5 text-center">
      <AlertCircle className="w-12 h-12 text-brand-silver mb-4" />
      <h1 className="font-display text-4xl text-brand-white tracking-wider mb-3">REPORT LOCKED</h1>
      <p className="text-brand-silver text-sm mb-6 max-w-xs leading-relaxed">
        {verifyError || 'Payment verification is required to view this report.'}
      </p>
      <Link href="/unlock" className="px-6 py-3 rounded-sm bg-brand-accent text-white text-sm font-semibold tracking-wide uppercase">
        Go to Unlock
      </Link>
    </div>
  )

  if (!result) return (
    <div className="min-h-dvh bg-brand-navy flex flex-col items-center justify-center px-5 text-center">
      <AlertCircle className="w-12 h-12 text-brand-silver mb-4" />
      <h1 className="font-display text-3xl text-brand-white tracking-wider mb-3">SCORE NOT FOUND</h1>
      <p className="text-brand-silver text-sm mb-6 max-w-xs leading-relaxed">
        Payment confirmed but your assessment data was not found in this browser session.
        This can happen if you switched devices. Contact support with your payment confirmation email.
      </p>
      <Link href="/" className="text-brand-accent underline underline-offset-2 text-sm">Return to homepage</Link>
    </div>
  )

  const bandColor  = getBandColor(result.band)
  const firstName  = result.leadName || ''
  const { report, answers } = result
  const bizType    = answers?.business_type ?? 'other'
  const platform   = PLATFORM_ROUTES[bizType] ?? PLATFORM_ROUTES['other']
  const userState  = answers?.location?.state ?? ''
  const stateData  = STATE_RESOURCES[userState] ?? null

  // Starter MetrixScore — stage-adjusted preview from existing answers + intake
  const starter        = buildStarterScore(answers, intake)
  const starterStrengths = starter.strengths.filter(s => s.score > 0)
  const altPaths       = alternativePaths(starter)

  // ── MetrixScore™ reconciliation (display-only) ──────────────────────────────
  // The user-facing headline score is the unified Starter MetrixScore™ — the same
  // value shown on /results and /dashboard. The old `result` (scoring.ts) object is
  // kept ONLY for the legacy paid roadmap (buildPersonalizedRoadmap) and the old
  // category breakdown below. No scoring logic is changed here; a future phase should
  // migrate the roadmap/breakdown to the unified engine.
  const headerScoreColor =
    starter.riskLevel === 'high'     ? '#E05A4E'
    : starter.riskLevel === 'elevated' ? '#EF9F27'
    : starter.riskLevel === 'moderate' ? '#4A90D9'
    : '#1D9E75'
  const headerProjected: number | null = completedGrowthTabs.size > 0
    ? parseFloat(Math.min(100, starter.overall + completedGrowthTabs.size * SCORE_IMPACT_PER_TAB).toFixed(1))
    : null

  // Build the personalized roadmap. Intake (biggest challenge + main goal) drives
  // focus tagging + within-tier ordering only — never the score, phases, or urgency.
  const roadmapPhases  = buildPersonalizedRoadmap(result, intake)
  const roadmapReason  = pathReason(roadmapFocus(intake))
  const allItems       = roadmapPhases.flatMap(p => p.items)
  const totalItems     = allItems.length
  const completedCount = completedSteps.size
  const progressPct    = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0

  const mustDoNow = allItems.filter(i => (i as { computedUrgency?: UrgencyLevel }).computedUrgency === 'must-do-now').length

  const growthPhases = getGrowthPhases()
  const projectedScore: number | null = completedGrowthTabs.size > 0
    ? parseFloat(Math.min(100, starter.overall + completedGrowthTabs.size * SCORE_IMPACT_PER_TAB).toFixed(1))
    : null

  // SCORE BREAKDOWN reflects the unified Starter MetrixScore™ categories (display-only).
  // Legacy result.categoryScores + paid roadmap logic are untouched — buildPersonalizedRoadmap
  // reads `result` internally. A future phase can fully migrate the roadmap to the new engine.
  const categories: { label: string; score: number; max: number }[] =
    starter.categories
      .filter(c => c.answered > 0)
      .map(c => ({ label: c.label, score: c.score, max: 100 }))

  const tabStyle = (tab: typeof activeTab) => ({
    flex: 1, paddingTop: '12px', paddingBottom: '12px', fontSize: '12px', fontWeight: 500,
    textAlign: 'center' as const,
    borderBottom: activeTab === tab ? `2px solid ${bandColor}` : '2px solid transparent',
    background: activeTab === tab ? `${bandColor}10` : 'transparent',
    color: activeTab === tab ? bandColor : '#A8B8CC',
    cursor: 'pointer', transition: 'all 0.15s',
  })

  const toggleStep = (id: string) => {
    setCompletedSteps((prev: Set<string>) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      try { localStorage.setItem('szm_foundation_complete', JSON.stringify(Array.from(next))) } catch {}
      return next
    })
  }

  const toggleGrowthTab = (id: string) => {
    setCompletedGrowthTabs(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      try { localStorage.setItem('szm_growth_complete', JSON.stringify(Array.from(next))) } catch {}
      return next
    })
  }

  return (
    <main className="min-h-dvh bg-brand-navy">
      <GrowthEventTracker milestone="report_viewed" />

      {/* Header */}
      <div className="px-5 pt-6 pb-8 text-center border-b border-brand-blue/40"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)' }}>
        <span className="font-display text-xl tracking-widest text-brand-white">
          SUBZERO<span className="text-brand-accent">METRIX</span>
        </span>
        <div className="mt-3">
          <Link href="/dashboard"
            className="inline-flex items-center text-[11px] font-medium tracking-widest uppercase px-4 py-2 rounded-sm border border-brand-accent/60 text-brand-accent hover:bg-brand-accent hover:text-white transition-all touch-target">
            Dashboard
          </Link>
        </div>
        <div className="mt-5">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-2">Full MetrixScore™ Report</p>
          <h1 className="font-display text-4xl tracking-wider text-brand-white leading-none mb-1">
            {firstName ? `${firstName.toUpperCase()}'S` : 'YOUR'} REPORT
          </h1>
          <p className="text-brand-silver text-xs">
            {new Date(result.completedAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
          </p>
        </div>

        <div className="mt-6 inline-flex flex-col items-center glass rounded-3xl px-10 py-6">
          <ScoreRing score={starter.overall} color={headerScoreColor} />
          <span className="mt-4 inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
            style={{ background: `${headerScoreColor}22`, color: headerScoreColor, border: `1px solid ${headerScoreColor}55` }}>
            {starter.riskLabel}
          </span>
          <p className="text-brand-silver text-xs mt-3 max-w-[220px] leading-relaxed text-center">
            {explainRisk(starter)}
          </p>
          {headerProjected !== null && (
            <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-sm"
              style={{ background: `${headerScoreColor}15`, border: `1px solid ${headerScoreColor}30` }}>
              <TrendingUp className="w-3 h-3 flex-shrink-0" style={{ color: headerScoreColor }} />
              <span className="font-mono text-[10px] text-brand-silver/70">Projected:</span>
              <span className="font-display text-base" style={{ color: headerScoreColor }}>{headerProjected}</span>
              <span className="font-mono text-[9px] text-brand-silver/50">after {completedGrowthTabs.size} action{completedGrowthTabs.size !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Snapshot pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {[result.businessType && { label: result.businessType },
            result.location     && { label: result.location },
            result.stage        && { label: result.stage }]
            .filter(Boolean)
            .map((item, i) => (
              <span key={i} className="text-[11px] px-3 py-1 rounded-sm font-mono"
                style={{ background: 'rgba(168,184,204,0.1)', color: '#A8B8CC' }}>
                {(item as { label: string }).label}
              </span>
            ))}
        </div>

        {/* Quick Intake context (from /start) — goal & focus, when provided */}
        {intake && (intake.mainGoal || intake.biggestChallenge) && (
          <>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {intake.mainGoal && (
                <span className="text-[11px] px-3 py-1 rounded-sm font-mono"
                  style={{ background: 'rgba(74,144,217,0.12)', color: '#7FB0E8' }}>
                  Goal: {goalLabel(intake.mainGoal)}
                </span>
              )}
              {intake.biggestChallenge && (
                <span className="text-[11px] px-3 py-1 rounded-sm font-mono"
                  style={{ background: 'rgba(239,159,39,0.12)', color: '#EFB967' }}>
                  Focus: {challengeLabel(intake.biggestChallenge)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-brand-silver/60 mt-2 max-w-[280px] mx-auto leading-relaxed">
              Your goal &amp; focus personalize your roadmap order — they don&apos;t change your score.
            </p>
          </>
        )}
      </div>

      {/* Tab nav */}
      <div className="flex border-b border-brand-blue/40 sticky top-0 z-20"
        style={{ background: '#0A1628' }}>
        <button style={tabStyle('score')} onClick={() => setActiveTab('score')}>Score</button>
        <button style={tabStyle('roadmap')} onClick={() => setActiveTab('roadmap')}>
          Roadmap {completedCount > 0 ? `(${completedCount}/${totalItems})` : mustDoNow > 0 ? `(${mustDoNow} now)` : ''}
        </button>
        <button style={tabStyle('resources')} onClick={() => setActiveTab('resources')}>Resources</button>
      </div>

      <div className="px-5 max-w-md mx-auto pb-16">

        {/* ── SCORE TAB ────────────────────────────────────────────── */}
        {activeTab === 'score' && (
          <>
            {/* ── Starter MetrixScore — stage-adjusted preview ─────────── */}
            <section className="mt-6 mb-8">
              <div className="flex items-center gap-2 mb-1">
                <Thermometer className="w-5 h-5 text-brand-accent" />
                <h2 className="font-display text-2xl tracking-wider text-brand-white">STARTER METRIXSCORE™</h2>
              </div>
              <p className="text-[11px] text-brand-silver/60 mb-4">
                A stage-adjusted preview based on what you&apos;ve shared so far.
              </p>

              <div className="glass rounded-2xl p-5 space-y-5">

                {/* Score · MetrixStage · Profile completion */}
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

                {/* Risk language — helpful, not a verdict */}
                <div className="rounded-xl px-4 py-3"
                  style={{ background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.22)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#EFB967' }} />
                    <span className="font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color: '#EFB967' }}>
                      Risk: {starter.riskLabel}
                    </span>
                  </div>
                  <p className="text-[12px] text-brand-silver leading-relaxed">{explainRisk(starter)}</p>
                </div>

                {/* Top 3 strengths */}
                {starterStrengths.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#1D9E75' }} />
                      <span className="font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color: '#3FBE93' }}>Top Strengths</span>
                    </div>
                    <div className="space-y-2">
                      {starterStrengths.map(s => (
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

                {/* Top 3 risk areas */}
                {starter.risks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#EF9F27' }} />
                      <span className="font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color: '#EFB967' }}>Top Risk Areas</span>
                    </div>
                    <div className="space-y-2">
                      {starter.risks.map(r => {
                        const c = r.severity === 'high' ? '#E05A4E' : r.severity === 'moderate' ? '#EF9F27' : '#4A90D9'
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

                {/* Recommended path + first action */}
                <div className="rounded-xl p-4"
                  style={{ background: 'rgba(74,144,217,0.1)', border: '1px solid rgba(74,144,217,0.3)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Map className="w-3.5 h-3.5 flex-shrink-0 text-brand-accent" />
                    <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-accent">Recommended Path</span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-brand-white mb-1">{starter.recommendedPath.label}</h3>
                  <p className="text-[12px] text-brand-silver leading-relaxed mb-3">{starter.recommendedPath.rationale}</p>
                  <div className="flex items-start gap-2 rounded-lg px-3 py-2.5"
                    style={{ background: 'rgba(10,22,40,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-brand-accent" />
                    <div>
                      <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-brand-accent block mb-0.5">First action</span>
                      <span className="text-[12px] text-brand-white leading-snug">{firstAction(starter)}</span>
                    </div>
                  </div>
                </div>

                {/* Alternative paths */}
                {altPaths.length > 0 && (
                  <div>
                    <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-brand-silver/70 block mb-2">Alternative Paths</span>
                    <div className="space-y-2">
                      {altPaths.map(p => (
                        <div key={p.id} className="rounded-lg px-3 py-2.5"
                          style={{ background: 'rgba(168,184,204,0.06)', border: '1px solid rgba(168,184,204,0.14)' }}>
                          <span className="text-[12px] font-medium text-brand-white block leading-snug">{p.label}</span>
                          <span className="text-[11px] text-brand-silver/70 leading-relaxed">{p.blurb}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ── Choose Your Path — roadmap options + first actions ────── */}
            <ChoosePathSection starter={starter} intake={intake} />

            {/* Score explanation + 30/90-day execution plan (explanation only) */}
            <OutcomeBriefing score={starter} intake={intake} variant="report" />

            {/* Roadmap progress + tool recommendations tied to the roadmap */}
            <div className="mt-6 mb-8">
              <RoadmapProgressCard score={starter} intake={intake} variant="report" />
            </div>

            {/* Progress review digest (device-local reads only) */}
            <div className="mb-8">
              <ProgressReviewCard score={starter} intake={intake} />
            </div>

            {/* Low-pressure, consent-first feedback (no public posting) */}
            <div className="mb-8">
              <CustomerProofPrompt trigger="report_viewed" />
            </div>

            <section className="mt-6 mb-8">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-brand-accent" />
                <h2 className="font-display text-2xl tracking-wider text-brand-white">SCORE BREAKDOWN</h2>
              </div>
              <p className="text-[11px] text-brand-silver/60 mb-4">
                How your Starter MetrixScore™ breaks down by category focus area.
              </p>
              <div className="glass rounded-2xl p-5">
                {categories.map(c => (
                  <CategoryBar key={c.label} label={c.label} score={c.score} max={c.max} color={bandColor} />
                ))}
              </div>
            </section>

            {report.risks.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-brand-accent" />
                  <h2 className="font-display text-2xl tracking-wider text-brand-white">TOP RISK AREAS</h2>
                </div>
                <div className="space-y-2">
                  {report.risks.map((risk: string, i: number) => (
                    <div key={risk} className="flex items-start gap-3 glass rounded-xl p-4 border-l-2"
                      style={{ borderColor: bandColor }}>
                      <span className="font-mono text-[10px] text-brand-silver/50 mt-0.5 flex-shrink-0">0{i + 1}</span>
                      <span className="text-sm text-brand-white leading-snug">{risk}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-brand-accent" />
                <h2 className="font-display text-2xl tracking-wider text-brand-white">YOUR TRADE PLATFORM</h2>
              </div>
              <div className="glass rounded-2xl p-5 border-l-2" style={{ borderColor: platform.accentColor }}>
                <p className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: platform.accentColor }}>
                  {platform.name} — {result.businessType || 'your trade'}
                </p>
                <p className="text-sm text-brand-white leading-relaxed mb-2">{report.builderPath}</p>
                <p className="text-[12px] text-brand-silver leading-relaxed">
                  As your MetrixScore™ rises, {platform.name} unlocks deeper guidance
                  built specifically for {result.businessType || 'your trade'} businesses.
                </p>
              </div>
            </section>

            <button onClick={() => setActiveTab('roadmap')}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-sm bg-brand-accent text-white text-[13px] font-semibold tracking-wide uppercase hover:bg-brand-mid transition-all mb-3">
              View Your Personalized Roadmap <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* ── ROADMAP TAB ──────────────────────────────────────────── */}
        {activeTab === 'roadmap' && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <Map className="w-5 h-5 text-brand-accent" />
              <h2 className="font-display text-2xl tracking-wider text-brand-white">YOUR ROADMAP</h2>
            </div>

            {/* Platform philosophy statement */}
            <p className="text-brand-silver text-[12px] leading-relaxed mb-5">
              This roadmap shows what your business needs next, why it matters, what it costs,
              how to do it yourself, and — where relevant — tools that may help. Work through
              the phases in order. Every recommendation is based on your score, trade, state,
              and budget.
            </p>

            {/* Progress */}
            <div className="glass rounded-sm p-4 mb-5">
              <div className="flex justify-between text-[11px] text-brand-silver mb-2">
                <span>Your progress</span>
                <span>{completedCount} of {totalItems} steps complete</span>
              </div>
              <div className="progress-track h-2">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%`, background: bandColor }} />
              </div>
              {mustDoNow > 0 && completedCount < totalItems && (
                <p className="text-[10px] text-brand-silver/60 mt-2">
                  {mustDoNow} step{mustDoNow > 1 ? 's' : ''} marked &quot;Do this now&quot; — start there.
                </p>
              )}
              {progressPct === 100 && (
                <p className="text-[11px] mt-2 text-center font-medium" style={{ color: bandColor }}>
                  🎯 Roadmap complete — time to reassess!
                </p>
              )}
            </div>

            {/* State notice */}
            {userState && (
              <div className="mb-5 px-4 py-3 rounded-sm text-[11px] text-brand-silver/80 leading-relaxed"
                style={{ background: 'rgba(74,144,217,0.07)', border: '1px solid rgba(74,144,217,0.2)' }}>
                <span className="text-brand-accent font-medium">State context: {userState}.</span>
                {' '}State-specific links are included in relevant steps below. Requirements also vary by
                city and county — verify locally before operating.
              </div>
            )}

            {/* Why this path — honest, ordering-only explanation from stated goal/challenge */}
            {roadmapReason && roadmapPhases.length > 0 && (
              <div className="rounded-sm p-3 mb-4 text-[11px] leading-relaxed"
                style={{ background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.25)', color: '#C8D4E0' }}>
                <span className="font-mono text-[9px] tracking-widest uppercase mr-1.5" style={{ color: '#EFB967' }}>
                  Roadmap priority
                </span>
                {roadmapReason}
              </div>
            )}

            {/* Phases */}
            {roadmapPhases.length === 0 ? (
              <div className="text-center py-10 text-brand-silver/60 text-sm">
                Great news — no critical gaps found. Continue to the Resources tab for tools
                to help you scale.
              </div>
            ) : (
              roadmapPhases.map(phase => (
                <PhaseGroup
                  key={phase.id}
                  phase={phase}
                  completedSteps={completedSteps as Set<string>}
                  onToggleComplete={toggleStep}
                />
              ))
            )}

            {/* Reassessment nudge */}
            <div className="rounded-sm p-5 mt-4"
              style={{ background: `${bandColor}10`, border: `1px solid ${bandColor}30` }}>
              <p className="text-[12px] text-brand-white font-semibold mb-1">90-day reassessment</p>
              <p className="text-[11px] text-brand-silver leading-relaxed mb-3">
                Complete your roadmap steps, then retake the assessment in 90 days to see
                your updated temperature and revised priorities.
              </p>
              <Link href="/assessment" className="text-[11px] font-medium" style={{ color: bandColor }}>
                Retake assessment → free
              </Link>
            </div>

            {/* ── GROWTH ROADMAP ───────────────────────────────────── */}
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-1">
                <Thermometer className="w-5 h-5 text-brand-accent" />
                <h2 className="font-display text-2xl tracking-wider text-brand-white">GROWTH ROADMAP</h2>
              </div>
              <p className="text-brand-silver text-[12px] leading-relaxed mb-5">
                12 phases of contractor growth. Select any phase to see your 30/60/90 plan,
                recommended tools, and sales guidance. Mark phases complete as you execute them.
              </p>

              {/* Growth progress */}
              <div className="glass rounded-sm p-4 mb-5">
                <div className="flex justify-between text-[11px] text-brand-silver mb-2">
                  <span>Phases marked complete</span>
                  <span>{completedGrowthTabs.size} of {growthPhases.length}</span>
                </div>
                <div className="progress-track h-1.5">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${growthPhases.length > 0 ? Math.round((completedGrowthTabs.size / growthPhases.length) * 100) : 0}%`,
                      background: bandColor,
                    }} />
                </div>
                {projectedScore !== null && (
                  <p className="text-[10px] text-brand-silver/60 mt-2">
                    Original: {starter.overall} → Projected:{' '}
                    <span style={{ color: bandColor }}>{projectedScore}</span>
                    {' '}(+{(projectedScore - starter.overall).toFixed(1)} pts)
                  </p>
                )}
              </div>

              {/* Phase grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {growthPhases.map(phase => {
                  const isActive = phase.id === activeGrowthTabId
                  const isDone = completedGrowthTabs.has(phase.id)
                  return (
                    <button key={phase.id}
                      onClick={() => { setActiveGrowthTabId(phase.id); setActivePhaseSubTab('overview') }}
                      className="rounded-sm p-2 text-left transition-all"
                      style={{
                        background: isDone ? 'rgba(29,158,117,0.1)' : isActive ? `${bandColor}18` : 'rgba(168,184,204,0.06)',
                        border: `1px solid ${isDone ? 'rgba(29,158,117,0.4)' : isActive ? bandColor + '60' : 'rgba(168,184,204,0.13)'}`,
                      }}>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono text-brand-silver/40">{String(phase.phaseNumber).padStart(2, '0')}</span>
                        <span className="text-[12px]">{phase.icon}</span>
                      </div>
                      <p className="text-[10px] font-medium leading-snug"
                        style={{ color: isDone ? '#1D9E75' : isActive ? bandColor : '#A8B8CC' }}>
                        {phase.shortTitle}
                      </p>
                      {isDone && <CheckCircle2 className="w-3 h-3 mt-1" style={{ color: '#1D9E75' }} />}
                    </button>
                  )
                })}
              </div>

              {/* Active phase detail panel */}
              {activeGrowthTabId && (() => {
                const phase = growthPhases.find(p => p.id === activeGrowthTabId)
                if (!phase) return null
                const isDone = completedGrowthTabs.has(phase.id)
                const phaseVendors = getVendorsForPhase(phase.recommendedVendorIds)
                const phasePlaybooks = getPlaybooksForPhase(phase.id)
                const phaseFlyerConcepts = getFlyersByIds(phase.relatedFlyerIds)
                const phaseRoadPaths = getRoadPathsForPhase(phase.id)
                const phaseFinancialPaths = getFinancialPathsForPhase(phase.id)

                const subTabStyle = (tab: typeof activePhaseSubTab) => ({
                  flex: 1,
                  paddingTop: '9px',
                  paddingBottom: '9px',
                  fontSize: '10px',
                  fontWeight: 500 as const,
                  textAlign: 'center' as const,
                  borderBottom: activePhaseSubTab === tab ? `2px solid ${bandColor}` : '2px solid transparent',
                  background: activePhaseSubTab === tab ? `${bandColor}12` : 'transparent',
                  color: activePhaseSubTab === tab ? bandColor : '#A8B8CC',
                  cursor: 'pointer' as const,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap' as const,
                })

                return (
                  <div key={phase.id} className="rounded-sm overflow-hidden mb-4"
                    style={{
                      border: isDone ? '1px solid rgba(29,158,117,0.4)' : `1px solid ${bandColor}40`,
                      background: 'rgba(10,22,40,0.6)',
                    }}>

                    {/* Phase header */}
                    <div className="px-4 pt-3 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <div>
                          <span className="font-mono text-[9px] text-brand-silver/40 tracking-widest">PHASE {phase.phaseNumber}</span>
                          <h3 className="font-display text-lg tracking-wider text-brand-white leading-snug">{phase.title.toUpperCase()}</h3>
                        </div>
                        <span className="text-2xl flex-shrink-0 mt-1">{phase.icon}</span>
                      </div>
                      <p className="text-[11px] text-brand-silver/60 leading-relaxed">{phase.mainBusinessProblem}</p>
                    </div>

                    {/* Sub-tab nav */}
                    <div className="flex" style={{ borderBottom: '1px solid rgba(13,43,92,0.8)', overflowX: 'auto', scrollbarWidth: 'none' }}>
                      {([
                        { id: 'overview' as const, label: 'Basic Roadmap' },
                        { id: '90day' as const, label: 'How To Execute' },
                        { id: 'tools' as const, label: 'Recommended Tools' },
                        { id: 'sales' as const, label: 'Marketing Asset Ideas' },
                        { id: 'upgrade' as const, label: 'Upgrade Preview' },
                      ]).map(st => (
                        <button key={st.id} style={subTabStyle(st.id)} onClick={() => setActivePhaseSubTab(st.id)}>
                          {st.label}
                        </button>
                      ))}
                    </div>

                    {/* Sub-tab content */}
                    <div className="px-4 py-4">

                      {/* OVERVIEW */}
                      {activePhaseSubTab === 'overview' && (
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Lightbulb className="w-3 h-3 text-brand-accent flex-shrink-0" />
                              <span className="font-mono text-[9px] tracking-widest uppercase text-brand-accent">Why this matters</span>
                            </div>
                            <p className="text-[12px] text-brand-silver leading-relaxed">{phase.whyItMatters}</p>
                          </div>
                          <div>
                            <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver/50 mb-2">Signs you&apos;re here</p>
                            <div className="space-y-1.5">
                              {phase.symptoms.map((s, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="text-brand-accent/60 text-[10px] flex-shrink-0 mt-0.5">—</span>
                                  <span className="text-[11px] text-brand-silver/80 leading-relaxed">{s}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="px-3 py-2.5 rounded-sm"
                            style={{ background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.3)' }}>
                            <p className="font-mono text-[9px] tracking-widest uppercase mb-1.5" style={{ color: '#1D9E75' }}>Immediate action</p>
                            <p className="text-[12px] text-brand-white leading-relaxed font-medium">{phase.immediateAction}</p>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <DollarSign className="w-3 h-3 text-brand-accent flex-shrink-0" />
                                <p className="font-mono text-[9px] tracking-widest uppercase text-brand-accent">Sales impact</p>
                              </div>
                              <p className="text-[11px] text-brand-silver leading-relaxed">{phase.salesImpact}</p>
                            </div>
                            <div>
                              <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver/50 mb-1">Financial impact</p>
                              <p className="text-[11px] text-brand-silver leading-relaxed">{phase.financialImpact}</p>
                            </div>
                          </div>
                          <div>
                            <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver/50 mb-2">What to measure</p>
                            <div className="space-y-1">
                              {phase.whatToMeasure.map((m, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="text-brand-accent/50 text-[10px] flex-shrink-0 mt-0.5">·</span>
                                  <span className="text-[11px] text-brand-silver/80 leading-relaxed">{m}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="px-3 py-2.5 rounded-sm"
                            style={{ background: 'rgba(74,144,217,0.07)', border: '1px solid rgba(74,144,217,0.2)' }}>
                            <p className="font-mono text-[9px] tracking-widest uppercase text-brand-accent mb-1.5">Key guidance</p>
                            <p className="text-[11px] text-brand-silver leading-relaxed">{phase.basicVisibleGuidance}</p>
                          </div>
                        </div>
                      )}

                      {/* 90-DAY PLAN */}
                      {activePhaseSubTab === '90day' && (
                        <div className="space-y-4">
                          {([
                            { label: '30-Day Plan', steps: phase.thirtyDayPlan, color: '#1D9E75' },
                            { label: '60-Day Plan', steps: phase.sixtyDayPlan, color: '#4A90D9' },
                            { label: '90-Day Plan', steps: phase.ninetyDayPlan, color: '#EF9F27' },
                          ] as const).map(({ label, steps, color }) => (
                            <div key={label}>
                              <p className="font-mono text-[9px] tracking-widest uppercase mb-2" style={{ color }}>{label}</p>
                              <div className="space-y-2">
                                {steps.map((step, i) => (
                                  <div key={i} className="rounded-sm px-3 py-2.5"
                                    style={{ background: `${color}0D`, border: `1px solid ${color}25` }}>
                                    <p className="text-[12px] font-semibold text-brand-white mb-1 leading-snug">{step.action}</p>
                                    <p className="text-[11px] text-brand-silver/80 leading-relaxed">{step.detail}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* TOOLS */}
                      {activePhaseSubTab === 'tools' && (
                        <div className="space-y-3">
                          {phaseVendors.length === 0 ? (
                            <p className="text-[11px] text-brand-silver/60">No specific tool recommendations for this phase.</p>
                          ) : (
                            <>
                              <p className="text-[9px] text-brand-silver/50 leading-relaxed px-1 pb-2"
                                style={{ borderBottom: '1px solid rgba(168,184,204,0.1)' }}>
                                Tool recommendations are educational. Evaluate each tool independently for fit, pricing, and support.{' '}
                                <Link href="/affiliate-disclosure" className="text-brand-accent hover:underline">Learn more →</Link>
                              </p>
                              {phaseVendors.map(v => (
                                <div key={v.id} className="rounded-sm p-3"
                                  style={{ background: 'rgba(13,43,92,0.4)', border: '1px solid rgba(168,184,204,0.12)' }}>
                                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <span className="text-[13px] font-medium text-brand-white">{v.name}</span>
                                    {v.freeOption && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium"
                                        style={{ background: 'rgba(29,158,117,0.15)', color: '#1D9E75' }}>Free option</span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-brand-silver/50 mb-1">{v.tagline}</p>
                                  <p className="text-[11px] text-brand-silver leading-relaxed mb-2">{v.costNote}</p>
                                  <a href={v.websiteUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-[11px] text-brand-accent hover:underline underline-offset-2">
                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                    Visit {v.name}
                                  </a>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      )}

                      {/* MARKETING ASSET IDEAS */}
                      {activePhaseSubTab === 'sales' && (
                        <div className="space-y-5">

                          {/* Social Starter Plan — Phase 10 only */}
                          {phase.id === 'brand-social-media' && (
                            <SocialStarterPlanSection bandColor={bandColor} />
                          )}

                          {/* Sales Playbooks */}
                          {phasePlaybooks.length > 0 && (
                            <div>
                              <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver/50 mb-2">Sales Playbooks</p>
                              <div className="space-y-3">
                                {phasePlaybooks.map(pb => (
                                  <PlaybookCard key={pb.id} pb={pb} bandColor={bandColor} />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Flyer Concepts */}
                          {phaseFlyerConcepts.length > 0 && (
                            <div>
                              <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver/50 mb-2">Flyer &amp; Campaign Concepts</p>
                              <div className="space-y-3">
                                {phaseFlyerConcepts.map(flyer => (
                                  <div key={flyer.id} className="rounded-sm p-3"
                                    style={{ background: 'rgba(13,43,92,0.4)', border: '1px solid rgba(168,184,204,0.12)' }}>
                                    <p className="text-[12px] font-semibold text-brand-white mb-0.5">{flyer.title}</p>
                                    <p className="text-[11px] text-brand-accent/80 mb-2 italic">&ldquo;{flyer.headline}&rdquo;</p>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                      <div className="rounded-sm px-2 py-1.5"
                                        style={{ background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)' }}>
                                        <p className="font-mono text-[8px] uppercase text-brand-silver/40 mb-0.5">Offer idea</p>
                                        <p className="text-[10px] text-brand-silver">{flyer.offer}</p>
                                      </div>
                                      <div className="rounded-sm px-2 py-1.5"
                                        style={{ background: 'rgba(74,144,217,0.07)', border: '1px solid rgba(74,144,217,0.15)' }}>
                                        <p className="font-mono text-[8px] uppercase text-brand-silver/40 mb-0.5">Upsell tie-in</p>
                                        <p className="text-[10px] text-brand-silver">{flyer.upsellTieIn}</p>
                                      </div>
                                    </div>
                                    <p className="text-[10px] text-brand-silver/60 leading-relaxed">{flyer.doorHangerNote}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Sales Road Paths */}
                          {phaseRoadPaths.length > 0 && (
                            <div>
                              <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver/50 mb-2">Sales Road Paths</p>
                              <div className="space-y-3">
                                {phaseRoadPaths.map(rp => (
                                  <div key={rp.id} className="rounded-sm p-3"
                                    style={{ background: 'rgba(13,43,92,0.4)', border: '1px solid rgba(168,184,204,0.12)' }}>
                                    <p className="text-[12px] font-semibold text-brand-white mb-1">{rp.title}</p>
                                    <p className="text-[11px] text-brand-silver leading-relaxed mb-2">{rp.summary}</p>
                                    <div className="space-y-1.5">
                                      {rp.steps.slice(0, 4).map(step => (
                                        <div key={step.stepNumber} className="flex items-start gap-2">
                                          <span className="text-brand-accent/50 font-mono text-[9px] flex-shrink-0 mt-0.5">{step.stepNumber}.</span>
                                          <div>
                                            <p className="text-[11px] font-medium text-brand-white leading-snug">{step.action}</p>
                                            <p className="text-[10px] text-brand-silver/60 leading-relaxed">{step.timing}</p>
                                          </div>
                                        </div>
                                      ))}
                                      {rp.steps.length > 4 && (
                                        <p className="text-[9px] text-brand-silver/40 pl-4">+{rp.steps.length - 4} more steps in the full module</p>
                                      )}
                                    </div>
                                    <div className="mt-2 rounded-sm px-3 py-2"
                                      style={{ background: 'rgba(74,144,217,0.07)', border: '1px solid rgba(74,144,217,0.2)' }}>
                                      <p className="font-mono text-[9px] text-brand-accent tracking-widest mb-0.5">SUCCESS METRIC</p>
                                      <p className="text-[10px] text-brand-silver">{rp.successMetric}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Financial Systems Roadmap */}
                          {phaseFinancialPaths.length > 0 && (
                            <div>
                              <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver/50 mb-2">Financial Systems Roadmap</p>
                              <div className="space-y-3">
                                {phaseFinancialPaths.map(fp => (
                                  <FinancialPathCard key={fp.id} path={fp} bandColor={bandColor} />
                                ))}
                              </div>
                            </div>
                          )}

                          {phasePlaybooks.length === 0 && phaseFlyerConcepts.length === 0 && phaseRoadPaths.length === 0 && phaseFinancialPaths.length === 0 && (
                            <p className="text-[11px] text-brand-silver/60">No marketing assets assigned to this phase.</p>
                          )}

                        </div>
                      )}

                      {/* UPGRADE PREVIEW */}
                      {activePhaseSubTab === 'upgrade' && (
                        <div>
                          <div className="rounded-sm p-4 mb-4"
                            style={{ background: 'rgba(239,159,39,0.07)', border: '1px solid rgba(239,159,39,0.2)' }}>
                            <p className="font-mono text-[9px] tracking-widest uppercase text-yellow-500/70 mb-2">Upgrade Module Preview</p>
                            <p className="text-[13px] font-semibold text-brand-white mb-3">{phase.upgradeModuleTitle}</p>
                            <div className="space-y-1.5">
                              {phase.lockedUpgradePreview.split('·').map((item, i) => (
                                item.trim() ? (
                                  <div key={i} className="flex items-start gap-2">
                                    <span className="text-yellow-500/50 text-[10px] flex-shrink-0 mt-0.5">🔒</span>
                                    <span className="text-[11px] text-brand-silver/60 leading-relaxed">{item.trim()}</span>
                                  </div>
                                ) : null
                              ))}
                            </div>
                          </div>
                          <button className="w-full py-3 rounded-sm text-[12px] font-semibold tracking-wide uppercase transition-all"
                            style={{ background: `${bandColor}20`, border: `1px solid ${bandColor}50`, color: bandColor }}>
                            Unlock the Full Execution Module
                          </button>
                          <p className="text-[9px] text-brand-silver/40 text-center mt-2">Coming soon — scripts, templates, calculators, SOPs</p>
                        </div>
                      )}

                      {/* Score lift + complete button */}
                      <div className="flex items-center gap-3 pt-4 mt-4"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="flex items-center gap-1.5 text-[10px] text-brand-silver/50">
                          <TrendingUp className="w-3 h-3" />
                          <span>+{phase.completionImpactScore} projected pts when complete</span>
                        </div>
                        <button onClick={() => toggleGrowthTab(phase.id)}
                          className="ml-auto px-4 py-2 rounded-sm text-[11px] font-medium transition-all"
                          style={{
                            background: isDone ? 'rgba(29,158,117,0.15)' : 'rgba(168,184,204,0.07)',
                            border: `1px solid ${isDone ? 'rgba(29,158,117,0.4)' : 'rgba(168,184,204,0.2)'}`,
                            color: isDone ? '#1D9E75' : '#A8B8CC',
                          }}>
                          {isDone ? '✓ Complete — undo' : 'Mark complete'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        )}

        {/* ── RESOURCES TAB ────────────────────────────────────────── */}
        {activeTab === 'resources' && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-brand-accent" />
              <h2 className="font-display text-2xl tracking-wider text-brand-white">RESOURCES</h2>
            </div>

            {/* Platform trust statement */}
            <div className="mb-5 p-4 rounded-sm"
              style={{ background: 'rgba(74,144,217,0.07)', border: '1px solid rgba(74,144,217,0.2)' }}>
              <p className="text-[11px] text-brand-silver leading-relaxed">
                <strong className="text-brand-white">How this works:</strong> SubZeroMetrix
                helps you understand what business systems you may need and connects you with
                tools and providers that may fit your situation. Final decisions, quotes,
                approvals, and professional advice come from the licensed provider or professional.
                {' '}<Link href="/affiliate-disclosure" className="text-brand-accent hover:underline">
                  Affiliate disclosure →
                </Link>
              </p>
            </div>

            {/* Resource tags from scoring engine */}
            <div className="glass-light rounded-2xl p-5 mb-5">
              <p className="text-[11px] text-brand-silver mb-3 leading-relaxed">Focus areas based on your gaps:</p>
              <div className="flex flex-wrap gap-2">
                {report.resources.map((r: string) => (
                  <span key={r} className="text-[11px] px-3 py-1.5 rounded-full font-medium"
                    style={{ background: `${bandColor}20`, color: bandColor, border: `1px solid ${bandColor}35` }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* State-specific official links */}
            {stateData ? (
              <div className="glass rounded-2xl p-5 mb-5">
                <p className="font-mono text-[10px] tracking-widest uppercase text-brand-silver mb-4">
                  Official {userState} government resources
                </p>
                <div className="space-y-3">
                  {[
                    { label: stateData.formationLabel, url: stateData.formationUrl, cat: 'Business formation' },
                    { label: stateData.licensingLabel, url: stateData.licensingUrl, cat: 'Trade licensing' },
                    { label: `${userState} Dept of Revenue — Sales tax`, url: stateData.taxUrl, cat: 'Tax registration' },
                    { label: `${userState} insurance requirements`, url: stateData.insuranceUrl, cat: 'Insurance' },
                    { label: `${userState} Small Business Dev Center (free)`, url: stateData.sbdcUrl, cat: 'Free support' },
                  ].map(({ label, url, cat }) => (
                    <a key={url} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex items-start gap-3 group">
                      <ExternalLink className="w-3.5 h-3.5 text-brand-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-mono text-brand-silver/50 block">{cat}</span>
                        <span className="text-[13px] text-brand-accent group-hover:underline underline-offset-2">{label}</span>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="mt-4 px-3 py-2.5 rounded-sm text-[10px] text-brand-silver/70 leading-relaxed"
                  style={{ background: 'rgba(239,159,39,0.07)', border: '1px solid rgba(239,159,39,0.2)' }}>
                  Always verify requirements with your local county clerk and city business office.
                  City and county rules layer on top of state requirements.
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-5 mb-5">
                <p className="font-mono text-[10px] tracking-widest uppercase text-brand-silver mb-3">Federal resources</p>
                <div className="space-y-3">
                  {[
                    { label: 'Apply for EIN — IRS.gov (free)', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online' },
                    { label: 'SBA: Start a business guide', url: 'https://www.sba.gov/business-guide/10-steps-start-your-business' },
                    { label: 'SCORE: Free business mentoring', url: 'https://www.score.org' },
                  ].map((r: { label: string; url: string }) => (
                    <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[13px] text-brand-accent hover:underline underline-offset-2">
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                      {r.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ── Affiliate partner cards ─────────────────────────────── */}
            {(() => {
              const resourceGroups: { label: string; categories: AffiliateCategory[] }[] = [
                { label: 'Get Customers',           categories: ['marketing', 'review-management', 'email-sms'] },
                { label: 'Job & Field Management',  categories: ['field-software', 'estimating-software'] },
                { label: 'Money & Bookkeeping',     categories: ['bookkeeping', 'banking', 'funding-credit'] },
                { label: 'Formation & Protection',  categories: ['formation', 'insurance'] },
              ]
              return (
                <div className="mb-6">
                  <p className="font-mono text-[10px] tracking-widest uppercase text-brand-silver mb-4">Tool Recommendations</p>
                  {resourceGroups.map(group => {
                    const partners = AFFILIATE_PARTNERS.filter(p => group.categories.includes(p.category))
                    if (partners.length === 0) return null
                    return (
                      <div key={group.label} className="mb-5">
                        <p className="text-[11px] font-semibold text-brand-white/60 uppercase tracking-widest mb-3 pb-1.5"
                          style={{ borderBottom: '1px solid rgba(13,43,92,0.8)' }}>
                          {group.label}
                        </p>
                        <div className="space-y-2.5">
                          {partners.map(partner => {
                            const url = affiliateUrl(partner)
                            const tradeMatch = partner.tradeRelevance.includes(bizType)
                            return (
                              <div key={partner.id} className="rounded-sm p-3.5"
                                style={{ background: 'rgba(13,43,92,0.4)', border: '1px solid rgba(168,184,204,0.12)' }}>
                                <div className="flex items-start justify-between gap-2 mb-1.5 flex-wrap">
                                  <span className="text-[13px] font-semibold text-brand-white">{partner.name}</span>
                                  <div className="flex gap-1.5 flex-wrap">
                                    {partner.freeOption && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium"
                                        style={{ background: 'rgba(29,158,117,0.15)', color: '#1D9E75' }}>Free option</span>
                                    )}
                                    {tradeMatch && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-sm"
                                        style={{ background: 'rgba(74,144,217,0.15)', color: '#4A90D9' }}>Your trade</span>
                                    )}
                                  </div>
                                </div>
                                <p className="text-[11px] text-brand-silver leading-relaxed mb-2">{partner.desc}</p>
                                {partner.requiresDisclosure && (
                                  <p className="text-[10px] text-brand-silver/40 leading-relaxed mb-2">
                                    {partner.regulatedActivity === 'insurance'
                                      ? 'Insurance products provided by licensed carriers. SubZeroMetrix is a referral source only.'
                                      : 'Banking products offered by licensed financial institutions. SubZeroMetrix is a referral source only.'}
                                  </p>
                                )}
                                <a href={url} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-[11px] text-brand-accent hover:underline underline-offset-2">
                                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                  Visit {partner.name}
                                </a>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}

            <Link href="/resources"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl glass text-brand-silver hover:text-brand-white text-sm font-medium transition-all mb-3">
              Browse all resources <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/platform-ecosystem"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-brand-accent text-white text-sm font-semibold tracking-wide uppercase hover:bg-brand-mid transition-all">
              Explore Platform Ecosystem <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Feedback — all tabs */}
        <FeedbackBox context={{
          score: result.overall,
          band: result.band,
          email: result.leadEmail,
          stage: stageLabel(starter.stage),
        }} />

        {/* Disclaimer — all tabs */}
        <div className="glass-light rounded-2xl p-4 mb-6 mt-4">
          <p className="text-[10px] text-brand-silver leading-relaxed">
            <strong className="text-brand-white">Educational Use Only.</strong>{' '}
            SubZeroMetrix helps you understand what business systems you may need and connects
            you with tools and providers. This is not legal, financial, tax, insurance, licensing,
            or lending advice. All final decisions, applications, quotes, and approvals come from
            licensed providers or qualified professionals.
          </p>
        </div>
      </div>

      <footer className="border-t border-brand-blue px-5 py-6 text-center">
        <p className="text-[10px] text-brand-silver">© {new Date().getFullYear()} SubZeroMetrix™ · The Modern Trades Mentor LLC</p>
        <p className="text-[9px] text-brand-silver/60 mt-1">SubZeroMetrix™ and MetrixScore™ are owned by The Modern Trades Mentor LLC.</p>
        <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
          {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Cancellation', '/cancellation'],
            ['Disclaimer', '/disclaimer'], ['Affiliates', '/affiliate-disclosure']].map(([l, h]) => (
            <Link key={h} href={h} className="text-[10px] text-brand-silver hover:text-brand-white transition-colors">{l}</Link>
          ))}
        </nav>
      </footer>
    </main>
  )
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh bg-brand-navy flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
        <p className="text-brand-silver text-sm">Loading report…</p>
      </div>
    }>
      <ReportContent />
    </Suspense>
  )
}
