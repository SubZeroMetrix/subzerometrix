'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowLeft, ArrowRight, TrendingUp, Target, AlertTriangle,
  Wrench, FileCheck, ChevronDown, ChevronUp, ExternalLink,
  BarChart3, Map, Shield, Lightbulb,
} from 'lucide-react'
import { getTradeBySlug, type KPI, type Benchmark, type TradeConfig } from '@/lib/tradeData'
import { affiliateUrl, AFFILIATE_PARTNERS } from '@/lib/affiliates'

// ── Score mini-ring ────────────────────────────────────────────────────────────
function MiniRing({ value, max, color, label }: {
  value: string; max?: string; color: string; label: string
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-1"
        style={{ background: `${color}20`, border: `2px solid ${color}60` }}>
        <span className="text-[11px] font-bold leading-tight text-center" style={{ color }}>
          {value}
        </span>
      </div>
      <span className="text-[9px] text-brand-silver/70 text-center leading-tight">{label}</span>
      {max && <span className="text-[9px] text-brand-silver/40">target: {max}</span>}
    </div>
  )
}

// ── KPI card ──────────────────────────────────────────────────────────────────
function KPICard({ kpi, accent }: { kpi: KPI; accent: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-sm overflow-hidden mb-2"
      style={{ border: `1px solid ${open ? accent + '50' : 'rgba(168,184,204,0.15)'}`, background: 'rgba(10,22,40,0.5)' }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left">
        <div>
          <p className="text-[13px] font-semibold text-brand-white">{kpi.label}</p>
          <p className="text-[10px] font-mono" style={{ color: accent }}>Target: {kpi.targetRange}</p>
        </div>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-brand-silver/50 flex-shrink-0" />
              : <ChevronDown className="w-3.5 h-3.5 text-brand-silver/50 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[12px] text-brand-silver leading-relaxed pt-3 mb-3">{kpi.description}</p>
          <div className="mb-3 px-3 py-2 rounded-sm text-[11px]"
            style={{ background: 'rgba(224,90,78,0.08)', border: '1px solid rgba(224,90,78,0.25)', color: '#E05A4E' }}>
            ⚠ Watch out if below: {kpi.warningBelow}
          </div>
          <p className="font-mono text-[9px] tracking-widest uppercase mb-2" style={{ color: accent }}>
            How to improve
          </p>
          <div className="space-y-1.5">
            {kpi.improvementTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-brand-silver/40 text-[10px] flex-shrink-0 mt-0.5">—</span>
                <span className="text-[11px] text-brand-silver leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Benchmark card ────────────────────────────────────────────────────────────
function BenchmarkCard({ benchmark, accent, isActive }: {
  benchmark: Benchmark
  accent: string
  isActive: boolean
}) {
  return (
    <div className="rounded-sm p-4 mb-3"
      style={{
        border: isActive ? `1.5px solid ${accent}60` : '1px solid rgba(168,184,204,0.12)',
        background: isActive ? `${accent}08` : 'rgba(10,22,40,0.4)',
      }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[13px] font-semibold text-brand-white">{benchmark.stage}</p>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm"
          style={{ background: `${accent}20`, color: accent }}>
          {benchmark.revenueRange}
        </span>
      </div>
      <p className="text-[10px] text-brand-silver/60 mb-2">{benchmark.employees}</p>
      <div className="space-y-1 mb-3">
        {benchmark.keyMetrics.map((m, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-brand-silver/40 text-[10px] flex-shrink-0 mt-0.5">•</span>
            <span className="text-[11px] text-brand-silver leading-relaxed">{m}</span>
          </div>
        ))}
      </div>
      <div className="px-3 py-2 rounded-sm" style={{ background: `${accent}12`, border: `1px solid ${accent}30` }}>
        <p className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: accent }}>Next move</p>
        <p className="text-[11px] text-brand-white leading-relaxed">{benchmark.nextMove}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function TradePlatformPage() {
  const params = useParams()
  const slug = params.trade as string
  const trade = getTradeBySlug(slug)

  const [activeTab, setActiveTab] = useState<'overview' | 'kpis' | 'benchmarks' | 'phases' | 'tools' | 'licensing'>('overview')
  const [phaseOpen, setPhaseOpen] = useState<string | null>(null)

  if (!trade) {
    return (
      <div className="min-h-dvh bg-brand-navy flex flex-col items-center justify-center px-5 text-center">
        <div className="mb-6 w-16 h-16 rounded-sm flex items-center justify-center"
          style={{ background: 'rgba(74,144,217,0.1)', border: '1px solid rgba(74,144,217,0.3)' }}>
          <AlertTriangle className="w-8 h-8 text-brand-accent" />
        </div>
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-accent mb-3">Platform unavailable</p>
        <h1 className="font-display text-3xl text-brand-white tracking-wider mb-3">
          Trade not recognized
        </h1>
        <p className="text-brand-silver text-sm leading-relaxed max-w-xs mb-6">
          The URL <code className="text-brand-accent/80 text-xs">/{params.trade}</code> does not
          match a known trade platform. Use the links below to find the right one.
        </p>
        <Link href="/platform-ecosystem"
          className="flex items-center gap-2 px-6 py-3 rounded-sm text-sm font-semibold text-white mb-4 transition-all"
          style={{ background: '#4A90D9' }}>
          View all trade platforms →
        </Link>
        <Link href="/assessment"
          className="text-[12px] text-brand-silver hover:text-brand-white transition-colors underline underline-offset-2">
          Or take the free MetrixScore™ to find your platform
        </Link>
      </div>
    )
  }

  const accent = trade.accentColor

  const tabStyle = (tab: typeof activeTab) => ({
    flex: 1, padding: '10px 4px', fontSize: '11px', fontWeight: 500,
    textAlign: 'center' as const,
    borderBottom: activeTab === tab ? `2px solid ${accent}` : '2px solid transparent',
    background: activeTab === tab ? `${accent}10` : 'transparent',
    color: activeTab === tab ? accent : '#A8B8CC',
    cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' as const,
  })

  return (
    <main className="min-h-dvh bg-brand-navy">

      {/* Header */}
      <div className="px-5 pt-6 pb-8 border-b"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)', borderColor: `${accent}30` }}>

        {/* Nav */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/platform-ecosystem"
            className="flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[12px]">All Platforms</span>
          </Link>
          <span className="font-display text-base tracking-widest text-brand-white">
            SUBZERO<span className="text-brand-accent">METRIX</span>
          </span>
        </div>

        {/* Brand */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
            style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}>
            <svg width="22" height="22" viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <line x1="40" y1="8" x2="40" y2="72" stroke={accent} strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="8" y1="40" x2="72" y2="40" stroke={accent} strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="14" y1="14" x2="66" y2="66" stroke={accent} strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="66" y1="14" x2="14" y2="66" stroke={accent} strokeWidth="3.5" strokeLinecap="round"/>
              <circle cx="40" cy="40" r="8" fill="#0A1628" stroke={accent} strokeWidth="2.5"/>
              <circle cx="40" cy="40" r="4" fill={accent}/>
            </svg>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase mb-0.5" style={{ color: accent }}>
              {trade.tradeName} Platform
            </p>
            <h1 className="font-display text-3xl tracking-widest text-brand-white leading-none">
              {trade.name.toUpperCase()}
            </h1>
          </div>
        </div>

        <p className="text-[14px] text-brand-silver leading-relaxed mb-4">{trade.tagline}</p>
        <p className="text-[12px] text-brand-silver/70 leading-relaxed">{trade.description}</p>

        {/* Quick disclaimer */}
        <div className="mt-4 px-3 py-2 rounded-sm text-[10px] text-brand-silver/60 leading-relaxed"
          style={{ background: 'rgba(74,144,217,0.06)', border: '1px solid rgba(74,144,217,0.15)' }}>
          Educational platform — benchmarks and KPIs reflect industry patterns, not guaranteed outcomes. Always verify licensing and compliance requirements with your state licensing board.
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex overflow-x-auto border-b border-brand-blue/30 sticky top-0 z-20 no-scrollbar"
        style={{ background: '#0A1628' }}>
        <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>Overview</button>
        <button style={tabStyle('kpis')} onClick={() => setActiveTab('kpis')}>KPIs</button>
        <button style={tabStyle('benchmarks')} onClick={() => setActiveTab('benchmarks')}>Benchmarks</button>
        {trade.tradePhases.length > 0 && (
          <button style={tabStyle('phases')} onClick={() => setActiveTab('phases')}>Phases</button>
        )}
        <button style={tabStyle('tools')} onClick={() => setActiveTab('tools')}>Tools</button>
        <button style={tabStyle('licensing')} onClick={() => setActiveTab('licensing')}>Licensing</button>
      </div>

      <div className="px-5 max-w-md mx-auto pb-16">

        {/* ── OVERVIEW TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="mt-6">

            {/* Industry insight */}
            <div className="mb-6 rounded-sm p-5"
              style={{ background: `${accent}08`, border: `1px solid ${accent}30` }}>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4" style={{ color: accent }} />
                <p className="font-mono text-[9px] tracking-widest uppercase" style={{ color: accent }}>
                  Field insight
                </p>
              </div>
              <p className="text-[13px] text-brand-silver leading-relaxed">{trade.industryInsight}</p>
            </div>

            {/* Unique risks */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-brand-accent" />
                <h2 className="font-display text-xl tracking-wider text-brand-white">
                  {trade.tradeName.toUpperCase()} BUSINESS RISKS
                </h2>
              </div>
              <div className="space-y-2">
                {trade.uniqueRisks.map((risk, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-sm px-4 py-3"
                    style={{ background: 'rgba(224,90,78,0.07)', border: '1px solid rgba(224,90,78,0.2)' }}>
                    <span className="font-mono text-[10px] text-brand-silver/40 flex-shrink-0 mt-0.5">0{i + 1}</span>
                    <span className="text-[12px] text-brand-silver leading-relaxed">{risk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KPI preview */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-brand-accent" />
                  <h2 className="font-display text-xl tracking-wider text-brand-white">KEY METRICS</h2>
                </div>
                <button onClick={() => setActiveTab('kpis')}
                  className="text-[11px] flex items-center gap-1" style={{ color: accent }}>
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {trade.kpis.slice(0, 4).map(kpi => (
                  <div key={kpi.id} className="rounded-sm p-3"
                    style={{ background: 'rgba(13,43,92,0.4)', border: '1px solid rgba(168,184,204,0.12)' }}>
                    <p className="text-[11px] font-semibold text-brand-white mb-1 leading-tight">{kpi.label}</p>
                    <p className="text-[10px] font-mono" style={{ color: accent }}>{kpi.targetRange}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA to roadmap */}
            <div className="rounded-sm p-5 text-center"
              style={{ background: 'rgba(74,144,217,0.08)', border: '1px solid rgba(74,144,217,0.25)' }}>
              <p className="text-[13px] text-brand-white font-semibold mb-1">
                Get your {trade.tradeName} roadmap
              </p>
              <p className="text-[11px] text-brand-silver leading-relaxed mb-4">
                Take the free MetrixScore™ assessment to get a personalized roadmap
                built for your trade, stage, and state.
              </p>
              <Link href="/assessment"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-sm text-[12px] font-semibold tracking-wide uppercase text-white transition-all"
                style={{ background: accent }}>
                Get My MetrixScore — Free <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* ── KPIS TAB ─────────────────────────────────────────────────────── */}
        {activeTab === 'kpis' && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-brand-accent" />
              <h2 className="font-display text-xl tracking-wider text-brand-white">KEY PERFORMANCE INDICATORS</h2>
            </div>
            <p className="text-[12px] text-brand-silver leading-relaxed mb-5">
              These are the metrics that matter most for a {trade.tradeName} business.
              Tap any KPI to see what it means, what the target is, and how to improve it.
            </p>
            {trade.kpis.map(kpi => (
              <KPICard key={kpi.id} kpi={kpi as NonNullable<typeof trade>['kpis'][0]} accent={accent} />
            ))}
            <div className="mt-4 px-4 py-3 rounded-sm text-[10px] text-brand-silver/60 leading-relaxed"
              style={{ background: 'rgba(74,144,217,0.06)', border: '1px solid rgba(74,144,217,0.15)' }}>
              Benchmarks reflect industry patterns across {trade.tradeName} businesses. Your results will vary based on market, experience, pricing, and operations. Track your own numbers first, then compare to targets.
            </div>
          </div>
        )}

        {/* ── BENCHMARKS TAB ───────────────────────────────────────────────── */}
        {activeTab === 'benchmarks' && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-brand-accent" />
              <h2 className="font-display text-xl tracking-wider text-brand-white">REVENUE BENCHMARKS</h2>
            </div>
            <p className="text-[12px] text-brand-silver leading-relaxed mb-5">
              What a healthy {trade.tradeName} business typically looks like at each revenue stage,
              and the single most impactful move to reach the next level.
            </p>
            {trade.benchmarks.map((b, i) => (
              <BenchmarkCard key={b.stage} benchmark={b} accent={accent} isActive={i === 1} />
            ))}
            <div className="mt-4 px-4 py-3 rounded-sm text-[10px] text-brand-silver/60 leading-relaxed"
              style={{ background: 'rgba(239,159,39,0.06)', border: '1px solid rgba(239,159,39,0.2)' }}>
              Revenue ranges are general guidelines based on industry patterns. Market rates, cost structures, and regional factors all affect where your business falls. These are reference points, not guarantees.
            </div>
          </div>
        )}

        {/* ── PHASES TAB ───────────────────────────────────────────────────── */}
        {activeTab === 'phases' && trade.tradePhases.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <Map className="w-4 h-4 text-brand-accent" />
              <h2 className="font-display text-xl tracking-wider text-brand-white">SCALING PHASES</h2>
            </div>
            <p className="text-[12px] text-brand-silver leading-relaxed mb-5">
              Trade-specific growth phases for {trade.tradeName} businesses beyond the foundation.
            </p>
            {trade.tradePhases.map(phase => (
              <div key={phase.id} className="rounded-sm overflow-hidden mb-4"
                style={{ border: `1px solid ${phaseOpen === phase.id ? accent + '50' : 'rgba(168,184,204,0.15)'}`, background: 'rgba(10,22,40,0.5)' }}>
                <button
                  onClick={() => setPhaseOpen(phaseOpen === phase.id ? null : phase.id)}
                  className="w-full flex items-start justify-between px-4 py-4 text-left">
                  <div>
                    <p className="text-[13px] font-semibold text-brand-white mb-0.5">{phase.title}</p>
                    <p className="text-[11px] text-brand-silver/70">{phase.subtitle}</p>
                  </div>
                  {phaseOpen === phase.id
                    ? <ChevronUp className="w-4 h-4 text-brand-silver/50 flex-shrink-0 mt-1" />
                    : <ChevronDown className="w-4 h-4 text-brand-silver/50 flex-shrink-0 mt-1" />}
                </button>

                {phaseOpen === phase.id && (
                  <div className="px-4 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="pt-3 mb-4 px-3 py-2 rounded-sm text-[11px] text-brand-silver leading-relaxed"
                      style={{ background: 'rgba(74,144,217,0.07)', border: '1px solid rgba(74,144,217,0.2)' }}>
                      <strong className="text-brand-white">When:</strong> {phase.when}
                    </div>
                    {phase.steps.map((step, i) => (
                      <div key={i} className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                            style={{ background: `${accent}25`, color: accent }}>
                            {i + 1}
                          </div>
                          <p className="text-[13px] font-semibold text-brand-white">{step.title}</p>
                        </div>
                        <p className="text-[12px] text-brand-silver leading-relaxed mb-2 pl-7">{step.description}</p>
                        <div className="ml-7 rounded-sm p-3"
                          style={{ background: 'rgba(29,158,117,0.07)', border: '1px solid rgba(29,158,117,0.25)' }}>
                          <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: '#1D9E75' }}>
                            DIY approach
                          </p>
                          <p className="text-[11px] text-brand-silver leading-relaxed mb-1">{step.diyOption}</p>
                          <p className="text-[10px] text-brand-silver/50">Cost: {step.estimatedCost}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── TOOLS TAB ────────────────────────────────────────────────────── */}
        {activeTab === 'tools' && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-4 h-4 text-brand-accent" />
              <h2 className="font-display text-xl tracking-wider text-brand-white">TOOLS & RESOURCES</h2>
            </div>
            <p className="text-[12px] text-brand-silver leading-relaxed mb-2">
              Tools used by {trade.tradeName} businesses. Listed by fit and business need.
            </p>
            <p className="text-[10px] text-brand-silver/50 mb-5">
              Tool recommendations are provided for educational purposes. SubZeroMetrix may pursue
              affiliate or vendor relationships in the future, but current recommendations should be
              evaluated independently based on fit, pricing, support, and business needs.{' '}
              <Link href="/affiliate-disclosure" className="text-brand-accent hover:underline">Learn more →</Link>
            </p>

            {/* Group by category */}
            {Array.from(new Set(trade.tools.map(t => t.category))).map(cat => {
              const catTools = trade.tools.filter(t => t.category === cat)
              return (
                <div key={cat} className="mb-6">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver mb-3">{cat}</p>
                  <div className="space-y-2">
                    {catTools.map(tool => {
                      const partner = tool.affiliateId
                        ? AFFILIATE_PARTNERS.find(p => p.id === tool.affiliateId)
                        : null
                      const href = partner ? affiliateUrl(partner) : tool.url

                      return (
                        <div key={tool.name} className="rounded-sm p-4"
                          style={{ background: 'rgba(13,43,92,0.4)', border: '1px solid rgba(168,184,204,0.12)' }}>
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-[13px] font-semibold text-brand-white">{tool.name}</span>
                            {tool.isFree && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium"
                                style={{ background: 'rgba(29,158,117,0.15)', color: '#1D9E75' }}>
                                Free option
                              </span>
                            )}
                            <span className="text-[10px] text-brand-silver/50 ml-auto">{tool.priceRange}</span>
                          </div>
                          <p className="text-[11px] text-brand-silver leading-relaxed mb-2">{tool.description}</p>
                          <p className="text-[11px] text-brand-silver/70 mb-3">
                            <strong className="text-brand-white/80">Best for:</strong> {tool.bestFor}
                          </p>
                          <a href={href} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[11px] hover:underline underline-offset-2"
                            style={{ color: accent }}>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            Visit {tool.name}
                          </a>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            <div className="mt-2 px-4 py-3 rounded-sm text-[10px] text-brand-silver/60 leading-relaxed"
              style={{ background: 'rgba(74,144,217,0.06)', border: '1px solid rgba(74,144,217,0.15)' }}>
              SubZeroMetrix is an education and referral platform. We do not endorse, guarantee, or sell any of these tools. Evaluate each based on your specific needs and budget.
            </div>
          </div>
        )}

        {/* ── LICENSING TAB ────────────────────────────────────────────────── */}
        {activeTab === 'licensing' && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <FileCheck className="w-4 h-4 text-brand-accent" />
              <h2 className="font-display text-xl tracking-wider text-brand-white">
                {trade.tradeName.toUpperCase()} LICENSING
              </h2>
            </div>
            <p className="text-[12px] text-brand-silver leading-relaxed mb-2">
              Official licensing requirements for {trade.tradeName} contractors in our 6 target states.
            </p>
            <div className="mb-5 px-3 py-2.5 rounded-sm text-[10px] text-brand-silver/70 leading-relaxed"
              style={{ background: 'rgba(239,159,39,0.07)', border: '1px solid rgba(239,159,39,0.2)' }}>
              ⚠ Requirements change. Always verify directly with your state licensing board before operating. City and county requirements may layer on top of state requirements.
            </div>

            <div className="space-y-3">
              {trade.licenseRequirements.map(req => (
                <div key={req.state} className="rounded-sm p-4"
                  style={{ background: 'rgba(13,43,92,0.4)', border: '1px solid rgba(168,184,204,0.12)' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[13px] font-semibold text-brand-white">{req.state}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-sm"
                      style={{
                        background: req.examRequired ? 'rgba(74,144,217,0.15)' : 'rgba(29,158,117,0.15)',
                        color: req.examRequired ? '#4A90D9' : '#1D9E75',
                      }}>
                      {req.examRequired ? 'Exam required' : 'No state exam'}
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-silver/70 mb-2">{req.board}</p>
                  <p className="text-[11px] text-brand-silver leading-relaxed mb-3">{req.notes}</p>
                  <a href={req.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[11px] text-brand-accent hover:underline underline-offset-2">
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    {req.board} — Official site
                    <span className="text-brand-silver/40 ml-auto text-[9px]">Official</span>
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-5 px-4 py-3 rounded-sm text-[10px] text-brand-silver/60 leading-relaxed"
              style={{ background: 'rgba(74,144,217,0.06)', border: '1px solid rgba(74,144,217,0.15)' }}>
              SubZeroMetrix is not a legal or licensing advisor. These links go directly to official government licensing boards. Always consult the board directly and consider consulting a local attorney for licensing questions specific to your situation.
            </div>
          </div>
        )}

        {/* Footer disclaimer */}
        <div className="mt-6 p-4 rounded-sm"
          style={{ background: 'rgba(13,43,92,0.2)', border: '1px solid rgba(168,184,204,0.08)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-3.5 h-3.5 text-brand-silver/60" />
            <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver/50">Platform disclaimer</p>
          </div>
          <p className="text-[10px] text-brand-silver/60 leading-relaxed">
            {trade.name} is an educational platform. Content reflects general industry patterns and does not constitute legal, financial, licensing, insurance, or tax advice. Benchmarks and KPIs are not guarantees of any outcome. Always consult qualified professionals for decisions specific to your business.
          </p>
        </div>

      </div>
    </main>
  )
}
