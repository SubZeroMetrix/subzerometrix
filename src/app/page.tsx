'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { ArrowRight, ChevronDown, CheckCircle2, AlertTriangle, BarChart3, FileText, Compass, Shield, ExternalLink, Map, TrendingUp, Zap } from 'lucide-react'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function Reveal({ children, delay = 0, className = '' }: {
  children?: React.ReactNode; delay?: number; className?: string; key?: string | number
}) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`reveal-block ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function IceCrystal({ size = 56, accent = '#C8D4E0' }: { size?: number; accent?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <line x1="40" y1="6" x2="40" y2="74" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="6" y1="40" x2="74" y2="40" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="68" y2="68" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="68" y1="12" x2="12" y2="68" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="6" x2="33" y2="16" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="40" y1="6" x2="47" y2="16" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="40" y1="74" x2="33" y2="64" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="40" y1="74" x2="47" y2="64" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="6" y1="40" x2="16" y2="33" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="6" y1="40" x2="16" y2="47" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="74" y1="40" x2="64" y2="33" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="74" y1="40" x2="64" y2="47" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <circle cx="40" cy="40" r="7" fill="#0A1628" stroke={accent} strokeWidth="2" />
      <circle cx="40" cy="40" r="3.5" fill={accent} />
      <circle cx="40" cy="6" r="3" fill={accent} opacity="0.8" />
      <circle cx="40" cy="74" r="3" fill={accent} opacity="0.8" />
      <circle cx="6" cy="40" r="3" fill={accent} opacity="0.8" />
      <circle cx="74" cy="40" r="3" fill={accent} opacity="0.8" />
      <circle cx="12" cy="12" r="2.5" fill={accent} opacity="0.6" />
      <circle cx="68" cy="68" r="2.5" fill={accent} opacity="0.6" />
      <circle cx="68" cy="12" r="2.5" fill={accent} opacity="0.6" />
      <circle cx="12" cy="68" r="2.5" fill={accent} opacity="0.6" />
    </svg>
  )
}

function ScoreMeter({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 44, circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(168,184,204,0.12)" strokeWidth="8" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl text-brand-white leading-none">{score}</span>
          <span className="text-[8px] text-brand-silver tracking-wider">/100</span>
        </div>
      </div>
      <span className="text-[10px] text-brand-silver tracking-widest uppercase mt-2 font-mono text-center leading-tight">{label}</span>
    </div>
  )
}

function Rule() {
  return <div className="w-10 h-px bg-brand-accent my-6" />
}

const TRADES = [
  { name: 'HVAC',              platform: 'HeatMetrix',   accent: '#EF9F27' },
  { name: 'Electrical',        platform: 'VoltMetrix',   accent: '#378ADD' },
  { name: 'Plumbing',          platform: 'FlowMetrix',   accent: '#1D9E75' },
  { name: 'Roofing',           platform: 'RoofMetrix',   accent: '#D85A30' },
  { name: 'Solar',             platform: 'SunMetrix',    accent: '#639922' },
  { name: 'Construction',      platform: 'BuildMetrix',  accent: '#7F77DD' },
  { name: 'Handyman',          platform: 'FixMetrix',    accent: '#888780' },
  { name: 'Landscaping',       platform: 'GroundMetrix', accent: '#3B6D11' },
  { name: 'Cleaning Services', platform: 'CleanMetrix',  accent: '#5DCAA5' },
  { name: 'Painting',          platform: 'PaintMetrix',  accent: '#C084FC' },
]

const ROADMAP_STAGES = [
  {
    step: '01',
    temp: 'Sub-Zero',
    color: '#4A90D9',
    bg: 'rgba(74,144,217,0.08)',
    title: 'Starting from zero',
    desc: 'No license, no entity, no systems. The roadmap walks you through every foundation step â€” in order, with the exact tools and links to complete each one.',
    items: ['Business formation & legal setup', 'Trade licensing by state', 'Insurance & liability coverage', 'Business banking & EIN'],
  },
  {
    step: '02',
    temp: 'Cold',
    color: '#85B7EB',
    bg: 'rgba(133,183,235,0.08)',
    title: 'Early operation',
    desc: 'Revenue is coming in but margins are unclear and everything feels chaotic. The roadmap shows you what to fix first so growth doesn\'t outpace your foundation.',
    items: ['Job costing & real pricing', 'First customer systems', 'Cash flow management', 'Google Business & local visibility'],
  },
  {
    step: '03',
    temp: 'Warming Up',
    color: '#EF9F27',
    bg: 'rgba(239,159,39,0.08)',
    title: 'Stabilizing & building',
    desc: 'You have momentum. The roadmap shifts focus to systems, first hires, and turning your operation from reactive to repeatable.',
    items: ['Hiring & onboarding your first team', 'Scheduling & operations systems', 'Marketing that compounds', 'Profit margin targets by trade'],
  },
  {
    step: '04',
    temp: 'Superheated',
    color: '#E24B4A',
    bg: 'rgba(226,75,74,0.08)',
    title: 'Scale & exit ready',
    desc: 'The roadmap evolves with you â€” benchmarking your KPIs against top performers in your trade, building leadership, and making your business valuable enough to sell.',
    items: ['Trade-specific KPI benchmarks', 'Leadership & management layer', 'Exit readiness scoring', 'Platform-level AI coaching'],
  },
]

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col bg-brand-navy overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-5 py-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(to bottom, rgba(10,22,40,0.97) 0%, rgba(10,22,40,0) 100%)' }}>
        <div className="flex items-center gap-3">
          <IceCrystal size={28} accent="#C8D4E0" />
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-widest text-brand-white">
              SUBZERO<span className="text-brand-accent">METRIX</span>
            </span>
            <span className="text-[8px] tracking-[0.22em] text-brand-silver uppercase">by The Modern Trades Mentor</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard"
            className="text-[11px] font-medium tracking-widest uppercase px-3 py-2 rounded-sm text-brand-silver hover:text-brand-white transition-all touch-target">
            Dashboard
          </Link>
          <Link href="/start"
            className="text-[11px] font-medium tracking-widest uppercase px-4 py-2 rounded-sm border border-brand-accent/60 text-brand-accent hover:bg-brand-accent hover:text-white transition-all touch-target">
            Start Free
          </Link>
        </div>
      </nav>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          HERO
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="relative grid-lines min-h-dvh flex flex-col justify-center px-5 pt-28 pb-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(74,144,217,0.14) 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 max-w-md mx-auto w-full">
          <div className="flex justify-center mb-6 crystal-pulse"
            style={{ opacity: 0, animation: 'fadeIn 0.5s 0.05s forwards, crystalPulse 3s ease-in-out 0.6s infinite' }}>
            <IceCrystal size={64} accent="#C8D4E0" />
          </div>

          <div className="flex items-center justify-center gap-2.5 mb-5"
            style={{ opacity: 0, animation: 'fadeIn 0.5s 0.2s forwards' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent blink" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver">MetrixScoreâ„¢ Assessment</span>
          </div>

          <h1 className="font-display leading-none text-brand-white mb-4 text-center"
            style={{ fontSize: 'clamp(2.8rem, 13vw, 4.2rem)', letterSpacing: '0.04em',
                     opacity: 0, animation: 'fadeIn 0.6s 0.3s forwards' }}>
            KNOW WHERE YOU STAND.<br />BUILD FROM THERE.
          </h1>

          <div className="mb-5" style={{ opacity: 0, animation: 'fadeIn 0.5s 0.4s forwards' }}>
            <div className="temp-bar w-full mb-1.5" />
            <div className="flex justify-between">
              <span className="font-mono text-[8px] tracking-wider text-brand-silver/50 uppercase">Sub-Zero</span>
              <span className="font-mono text-[8px] tracking-wider text-brand-silver/50 uppercase">Superheated</span>
            </div>
          </div>

          <p className="text-brand-silver leading-relaxed mb-8 text-[15px] text-center"
            style={{ opacity: 0, animation: 'fadeIn 0.6s 0.45s forwards' }}>
            Whether you&apos;re thinking about starting, already running, or ready to grow â€”
            the MetrixScoreâ„¢ tells you exactly where your business stands and gives you
            a personalized roadmap to get to the next level.
          </p>

          <div style={{ opacity: 0, animation: 'fadeIn 0.6s 0.6s forwards' }}>
            <Link href="/start"
              className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-sm text-[13px] font-semibold tracking-[0.12em] uppercase bg-brand-accent text-white hover:bg-brand-mid transition-all active:scale-[0.98] touch-target mb-2"
              style={{ boxShadow: '0 0 40px rgba(74,144,217,0.25)' }}>
              Get My MetrixScoreâ„¢ â€” It&apos;s Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-center text-[11px] text-brand-silver/60 tracking-wide">
              4 minutes. Free to start. For every trade and service business.
            </p>
          </div>

          <div className="mt-10 steel-border rounded-sm p-4"
            style={{ background: 'rgba(13,43,92,0.35)', opacity: 0, animation: 'fadeIn 0.6s 0.75s forwards' }}>
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-brand-silver/50 mb-4 text-center">Example temperatures</p>
            <div className="grid grid-cols-3 gap-4">
              <ScoreMeter score={22} label="Sub-Zero" color="#4A90D9" />
              <ScoreMeter score={54} label="Cold" color="#85B7EB" />
              <ScoreMeter score={81} label="Hot" color="#E8593C" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40">
          <ChevronDown className="w-4 h-4 text-brand-silver animate-bounce" />
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SECTION 1 â€” THE PERSONAL ROADMAP (HERO FEATURE)
          This is the big sell â€” make it impossible to miss
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="px-5 py-20"
        style={{ background: 'linear-gradient(180deg, #0A1628 0%, #0D2B5C 50%, #0A1628 100%)' }}>
        <div className="max-w-md mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(74,144,217,0.2)', border: '1px solid rgba(74,144,217,0.4)' }}>
                <Map className="w-5 h-5 text-brand-accent" />
              </div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-accent">
                Your personal roadmap to success
              </p>
            </div>

            <h2 className="font-display text-brand-white leading-none mb-4"
              style={{ fontSize: 'clamp(2.2rem, 10vw, 3.2rem)', letterSpacing: '0.04em' }}>
              FROM FIRST IDEA TO SUPERHEATED BUSINESS â€” WE WALK WITH YOU.
            </h2>
            <Rule />
            <p className="text-brand-silver text-[16px] leading-relaxed mb-3">
              SubZeroMetrix doesn&apos;t hand you a score and wish you luck.
              It gives you a <strong className="text-brand-white">step-by-step personal roadmap</strong> built
              around your exact trade, your current stage, and the specific gaps holding you back.
            </p>
            <p className="text-brand-silver text-[16px] leading-relaxed mb-8">
              Whether you haven&apos;t started yet or you&apos;re already running a crew â€”
              the roadmap shows you what to do first, what to ignore for now,
              and which tools will move your temperature the fastest.
            </p>
          </Reveal>

          {/* Roadmap stage cards */}
          <div className="space-y-3 mb-10">
            {ROADMAP_STAGES.map(({ step, temp, color, bg, title, desc, items }, i) => (
              <Reveal key={step} delay={i * 80}>
                <div className="rounded-sm p-5"
                  style={{ background: bg, border: `1px solid ${color}30` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-[10px] font-semibold"
                      style={{ background: `${color}25`, color, border: `1px solid ${color}50` }}>
                      {step}
                    </div>
                    <div>
                      <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color }}>{temp}</span>
                      <p className="text-[13px] font-semibold text-brand-white leading-tight">{title}</p>
                    </div>
                  </div>
                  <p className="text-[13px] text-brand-silver leading-relaxed mb-3">{desc}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {items.map(item => (
                      <div key={item} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color }} />
                        <span className="text-[11px] text-brand-silver leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Big callout */}
          <Reveal delay={320}>
            <div className="rounded-sm p-6 text-center"
              style={{ background: 'rgba(74,144,217,0.1)', border: '1.5px solid rgba(74,144,217,0.35)' }}>
              <TrendingUp className="w-8 h-8 text-brand-accent mx-auto mb-3" />
              <p className="font-display text-2xl text-brand-white tracking-wider mb-2">
                YOUR ROADMAP GROWS WITH YOU
              </p>
              <p className="text-brand-silver text-[14px] leading-relaxed mb-5">
                Every 90 days you retake the assessment. Your temperature rises.
                Your roadmap updates. The guidance gets deeper as your business gets stronger â€”
                all the way from your first idea to a business that runs without you.
              </p>
              <Link href="/start"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-sm text-[13px] font-semibold tracking-[0.1em] uppercase bg-brand-accent text-white hover:bg-brand-mid transition-all active:scale-[0.98] touch-target"
                style={{ boxShadow: '0 0 32px rgba(74,144,217,0.3)' }}>
                Get My Personal Roadmap â€” Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SECTION 2 â€” THE COLD TRUTH
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="px-5 py-16 slash-divider"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)' }}>
        <div className="max-w-md mx-auto">
          <Reveal>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-accent mb-3">The cold truth</p>
            <h2 className="font-display text-brand-white leading-none mb-4"
              style={{ fontSize: 'clamp(2rem, 9vw, 2.8rem)', letterSpacing: '0.04em' }}>
              MOST BUSINESSES DON&apos;T FAIL FROM ONE BIG MISTAKE
            </h2>
            <Rule />
            <p className="text-brand-silver text-[15px] leading-relaxed mb-5">
              They freeze from a slow accumulation of small gaps â€” pricing that doesn&apos;t cover real costs,
              customers built entirely on word of mouth with no system, paperwork that was never done right,
              and a budget that ran out before revenue got consistent.
            </p>
            <p className="text-brand-silver text-[15px] leading-relaxed">
              The problem isn&apos;t effort. It&apos;s operating without a temperature reading â€” without knowing
              if your foundation is solid or cracking under the surface. SubZeroMetrix was built to give
              you that reading, and the roadmap to fix it.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-8 space-y-3">
              {[
                'Spent money on tools and ads before having consistent customers',
                'Priced jobs on gut feel instead of actual cost-per-job',
                'Built a business on favors instead of a repeatable lead system',
                'Never formalized the legal and financial foundation â€” and paid for it',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 accent-line pl-3">
                  <span className="text-brand-silver text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SECTION 3 â€” HOW IT WORKS
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="px-5 py-16">
        <div className="max-w-md mx-auto">
          <Reveal>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-accent mb-3">The process</p>
            <h2 className="font-display text-brand-white leading-none mb-4"
              style={{ fontSize: 'clamp(2rem, 9vw, 2.8rem)', letterSpacing: '0.04em' }}>
              HOW METRIXSCOREâ„¢ WORKS
            </h2>
            <Rule />
          </Reveal>

          <div className="space-y-4 mt-2">
            {[
              {
                num: '01', icon: Compass, color: '#4A90D9',
                title: 'Answer 7 focused questions',
                desc: 'Your trade, location, stage, setup status, finances, customer plan, and biggest blocker. No jargon. Honest answers only.',
              },
              {
                num: '02', icon: BarChart3, color: '#EF9F27',
                title: 'Get your temperature reading',
                desc: 'Your MetrixScoreâ„¢ is calculated instantly across six areas. You see your band â€” Sub-Zero, Cold, Warm, Hot, or Superheated â€” and exactly which areas are holding you back.',
              },
              {
                num: '03', icon: Map, color: '#1D9E75',
                title: 'Unlock your personal roadmap',
                desc: 'Your roadmap is built specifically for your trade, your stage, and your gaps â€” with prioritized action steps, curated tools, and guidance that walks with you from day one to scale.',
              },
            ].map(({ num, icon: Icon, color, title, desc }) => (
              <Reveal key={num}>
                <div className="flex gap-4 steel-border rounded-sm p-5"
                  style={{ background: 'rgba(10,22,40,0.5)' }}>
                  <div className="flex-shrink-0 w-9 h-9 rounded-sm flex items-center justify-center"
                    style={{ background: `${color}20` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-widest text-brand-silver/40 uppercase mb-1">{num}</p>
                    <p className="text-sm font-semibold text-brand-white mb-1.5">{title}</p>
                    <p className="text-[13px] text-brand-silver leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <Link href="/start"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-sm text-[13px] font-semibold tracking-[0.1em] uppercase bg-brand-accent text-white hover:bg-brand-mid transition-all active:scale-[0.98] mt-8 touch-target">
              Start My MetrixScore <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SECTION 4 â€” WHAT YOUR REPORT INCLUDES
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="px-5 py-16 slash-divider-up"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)' }}>
        <div className="max-w-md mx-auto">
          <Reveal>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-accent mb-3">Full report</p>
            <h2 className="font-display text-brand-white leading-none mb-4"
              style={{ fontSize: 'clamp(2rem, 9vw, 2.8rem)', letterSpacing: '0.04em' }}>
              WHAT YOUR REPORT INCLUDES
            </h2>
            <Rule />
          </Reveal>

          <div className="space-y-4">
            {[
              { icon: BarChart3,    color: '#4A90D9', title: 'Full temperature breakdown',  desc: 'Your exact score, band, and plain-language reading of what it means for your specific situation.' },
              { icon: Map,          color: '#EF9F27', title: 'Your personal roadmap',       desc: 'Step-by-step priorities built for your trade and stage â€” not generic advice. What to do first, second, and next.' },
              { icon: AlertTriangle,color: '#E05A4E', title: 'Top risk areas addressed',   desc: 'Your three biggest gaps explained clearly with the specific moves that close each one.' },
              { icon: FileText,     color: '#1D9E75', title: 'Curated resource links',      desc: 'Tools and partners matched to your exact gaps â€” finance, insurance, software, marketing. Only what you actually need.' },
              { icon: Zap,          color: '#C084FC', title: 'Trade-specific guidance',     desc: 'Every recommendation is filtered through your trade. An HVAC roadmap looks nothing like a cleaning services roadmap.' },
              { icon: Shield,       color: '#C8D4E0', title: 'Trade platform routing',      desc: 'As your score rises, you\'re guided toward the deeper platform built for your specific trade.' },
            ].map(({ icon: Icon, color, title, desc }, i) => (
              <Reveal key={title} delay={i * 60}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-sm flex items-center justify-center mt-0.5"
                    style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-white mb-0.5">{title}</p>
                    <p className="text-[13px] text-brand-silver leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={360}>
            <Link href="/start"
              className="flex items-center justify-center gap-3 w-full py-4 mt-8 rounded-sm text-[13px] font-semibold tracking-[0.1em] uppercase bg-brand-accent text-white hover:bg-brand-mid transition-all active:scale-[0.98] touch-target"
              style={{ boxShadow: '0 0 32px rgba(74,144,217,0.2)' }}>
              Start My MetrixScoreâ„¢ â€” Free <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SECTION 5 â€” THE 10 PLATFORMS
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="px-5 py-16">
        <div className="max-w-md mx-auto">
          <Reveal>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-accent mb-3">Platform ecosystem</p>
            <h2 className="font-display text-brand-white leading-none mb-4"
              style={{ fontSize: 'clamp(2rem, 9vw, 2.8rem)', letterSpacing: '0.04em' }}>
              ONE SYSTEM. EVERY TRADE.
            </h2>
            <Rule />
            <p className="text-brand-silver text-[15px] leading-relaxed mb-6">
              Every trade starts at the same foundation and grows into its own platform.
              As your MetrixScoreâ„¢ rises, your trade-specific experience unlocks â€”
              with deeper benchmarks, AI coaching, and KPI tracking built for your work.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {TRADES.map(({ name, platform, accent }) => (
                <div key={name} className="rounded-sm p-3 text-center steel-border"
                  style={{ background: `${accent}0d` }}>
                  <div className="flex justify-center mb-1.5">
                    <svg width="20" height="20" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                      <line x1="40" y1="8" x2="40" y2="72" stroke={accent} strokeWidth="3" strokeLinecap="round" />
                      <line x1="8" y1="40" x2="72" y2="40" stroke={accent} strokeWidth="3" strokeLinecap="round" />
                      <line x1="14" y1="14" x2="66" y2="66" stroke={accent} strokeWidth="3" strokeLinecap="round" />
                      <line x1="66" y1="14" x2="14" y2="66" stroke={accent} strokeWidth="3" strokeLinecap="round" />
                      <circle cx="40" cy="40" r="6" fill="#0A1628" stroke={accent} strokeWidth="2" />
                      <circle cx="40" cy="40" r="3" fill={accent} />
                      <circle cx="40" cy="8" r="2.5" fill={accent} opacity="0.8" />
                      <circle cx="40" cy="72" r="2.5" fill={accent} opacity="0.8" />
                      <circle cx="8" cy="40" r="2.5" fill={accent} opacity="0.8" />
                      <circle cx="72" cy="40" r="2.5" fill={accent} opacity="0.8" />
                    </svg>
                  </div>
                  <p className="text-[9px] font-mono tracking-wider" style={{ color: accent }}>{platform}</p>
                  <p className="text-[10px] text-brand-silver mt-0.5 leading-tight">{name}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={160}>
            <Link href="/platform-ecosystem"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-sm steel-border text-[12px] font-medium tracking-widest uppercase text-brand-silver hover:text-brand-white hover:border-brand-silver/40 transition-all">
              Explore the platform ecosystem <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SECTION 6 â€” CREDIBILITY
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="px-5 py-16"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)' }}>
        <div className="max-w-md mx-auto">
          <Reveal>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-accent mb-3">The foundation</p>
            <h2 className="font-display text-brand-white leading-none mb-4"
              style={{ fontSize: 'clamp(2rem, 9vw, 2.8rem)', letterSpacing: '0.04em' }}>
              BUILT FROM REAL FIELD EXPERIENCE
            </h2>
            <Rule />
            <p className="text-brand-silver text-[15px] leading-relaxed mb-5">
              The Modern Trades Mentor is built on hands-on work in HVAC, mechanical service,
              field operations, and technician leadership â€” including time managing crews, handling
              contractor operations, and watching what separates businesses that heat up from
              ones that stay frozen.
            </p>
            <p className="text-brand-silver text-[15px] leading-relaxed">
              SubZeroMetrix is not a generic business quiz with a trades label slapped on it.
              The questions, scoring, and roadmap are structured around the actual patterns
              that show up in trades businesses at every temperature level.
            </p>
          </Reveal>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          FINAL CTA
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="px-5 py-16">
        <div className="max-w-md mx-auto text-center">
          <Reveal>
            <div className="flex justify-center mb-6">
              <IceCrystal size={52} accent="#4A90D9" />
            </div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-4">Find your temperature</p>
            <h2 className="font-display text-brand-white leading-none mb-4"
              style={{ fontSize: 'clamp(2.2rem, 10vw, 3.5rem)', letterSpacing: '0.04em' }}>
              YOUR ROADMAP IS<br />WAITING.
            </h2>
            <p className="text-brand-silver text-[15px] leading-relaxed mb-8">
              Free to start. No account required. Takes four minutes.<br />
              For anyone starting, running, or rebuilding a trades or service business.
            </p>
            <Link href="/start"
              className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-sm text-[13px] font-semibold tracking-[0.12em] uppercase bg-brand-accent text-white hover:bg-brand-mid transition-all active:scale-[0.98] touch-target"
              style={{ boxShadow: '0 0 40px rgba(74,144,217,0.25)' }}>
              Get My MetrixScoreâ„¢ â€” It&apos;s Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-5 pt-12 pb-10 border-t" style={{ borderColor: 'rgba(168,184,204,0.1)' }}>
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <IceCrystal size={28} accent="#A8B8CC" />
            <div>
              <div className="font-display text-xl tracking-widest text-brand-white">
                SUBZERO<span className="text-brand-accent">METRIX</span>
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-brand-silver">by The Modern Trades Mentor</p>
            </div>
          </div>

          <div className="mb-6 p-4 rounded-sm steel-border" style={{ background: 'rgba(13,43,92,0.2)' }}>
            <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver mb-2">Affiliate & Resource Disclosure</p>
            <p className="text-[12px] text-brand-silver/70 leading-relaxed">
              Some links in reports and resources may be affiliate links. We may receive a commission
              if you sign up or purchase through them, at no extra cost to you. Affiliate relationships
              do not influence MetrixScoreâ„¢ results or roadmap recommendations.
            </p>
            <Link href="/affiliate-disclosure"
              className="inline-flex items-center gap-1 text-[11px] text-brand-accent mt-2 hover:underline">
              Full disclosure <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="mb-8 p-4 rounded-sm steel-border" style={{ background: 'rgba(13,43,92,0.2)' }}>
            <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver mb-2">Disclaimer</p>
            <p className="text-[12px] text-brand-silver/70 leading-relaxed">
              SubZeroMetrix provides educational scoring and informational content only. Nothing here
              constitutes legal, financial, tax, insurance, licensing, or lending advice.
              No business outcomes are guaranteed. Always consult qualified professionals.
            </p>
            <Link href="/disclaimer"
              className="inline-flex items-center gap-1 text-[11px] text-brand-accent mt-2 hover:underline">
              Full disclaimer <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
            {[
              ['Resources', '/resources'],
              ['Get the App', '/install'],
              ['Platform Ecosystem', '/platform-ecosystem'],
              ['Privacy Policy', '/privacy'],
              ['Terms of Service', '/terms'],
              ['Cancellation & Refunds', '/cancellation'],
              ['Affiliate Disclosure', '/affiliate-disclosure'],
              ['Disclaimer', '/disclaimer'],
            ].map(([label, href]) => (
              <Link key={href} href={href}
                className="text-[11px] tracking-wide text-brand-silver/60 hover:text-brand-silver transition-colors">
                {label}
              </Link>
            ))}
          </nav>

          <p className="text-[11px] text-brand-silver/40 leading-relaxed">
            Â© {new Date().getFullYear()} SubZeroMetrix Â· The Modern Trades Mentor<br />
            Educational purposes only. Not legal, financial, or licensing advice.
          </p>
        </div>
      </footer>
    </main>
  )
}

