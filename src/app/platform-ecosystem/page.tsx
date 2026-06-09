import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const PLATFORMS: {
  id: string
  name: string
  trade: string
  accent: string
  desc: string
  badge?: string
  slug?: string
}[] = [
  {
    id: 'foundation',
    name: 'Foundation Metrix',
    trade: 'Entry — All Trades',
    accent: '#4A90D9',
    desc: 'Pre-launch readiness assessment. The universal starting point for every business owner before they spend, hire, or scale.',
    badge: 'Start Here',
  },
  {
    id: 'hvac',
    slug: 'heat',
    name: 'HeatMetrix',
    trade: 'HVAC',
    accent: '#EF9F27',
    desc: 'Maintenance agreements, seasonal revenue smoothing, smart system upsells, and truck utilization benchmarks.',
  },
  {
    id: 'electrical',
    slug: 'volt',
    name: 'VoltMetrix',
    trade: 'Electrical',
    accent: '#378ADD',
    desc: 'Panel upgrades, EV charger revenue modeling, apprentice pipeline tracking, and solar-electrical crossover.',
  },
  {
    id: 'plumbing',
    slug: 'flow',
    name: 'FlowMetrix',
    trade: 'Plumbing',
    accent: '#1D9E75',
    desc: 'Emergency vs scheduled mix, flat-rate pricing setup, drain and repiping diversification, and commercial contracts.',
  },
  {
    id: 'roofing',
    slug: 'roof',
    name: 'RoofMetrix',
    trade: 'Roofing',
    accent: '#D85A30',
    desc: 'Storm restoration, insurance claim tracking, solar-ready roofing upsells, and crew surge capacity planning.',
  },
  {
    id: 'solar',
    slug: 'sun',
    name: 'SunMetrix',
    trade: 'Solar',
    accent: '#639922',
    desc: 'Lead-to-install funnel, battery storage upsell, incentive navigation, and financing attach rate.',
  },
  {
    id: 'construction',
    slug: 'build',
    name: 'BuildMetrix',
    trade: 'Construction & Remodeling',
    accent: '#7F77DD',
    desc: 'Bid win rate, change order capture, subcontractor vs in-house mix, and material cost escalation tracking.',
  },
  {
    id: 'handyman',
    slug: 'fix',
    name: 'FixMetrix',
    trade: 'Handyman Services',
    accent: '#888780',
    desc: 'Average ticket size, repeat customer rate, job mix analysis, and specialization opportunity scoring.',
  },
  {
    id: 'landscaping',
    slug: 'ground',
    name: 'GroundMetrix',
    trade: 'Landscaping & Lawn Care',
    accent: '#3B6D11',
    desc: 'Recurring contract ratio, route density, seasonal revenue balance, and equipment utilization tracking.',
  },
  {
    id: 'cleaning',
    slug: 'clean',
    name: 'CleanMetrix',
    trade: 'Cleaning Services',
    accent: '#5DCAA5',
    desc: 'Client churn rate, recurring vs one-time revenue split, revenue per cleaner, and specialty niche margins.',
  },
  {
    id: 'painting',
    slug: 'paint',
    name: 'PaintMetrix',
    trade: 'Painting',
    accent: '#C084FC',
    desc: 'Estimating accuracy, crew efficiency, repeat client development, referral systems, and material margin tracking.',
  },
]

const TEMPERATURE_STAGES = [
  { label: 'Sub-Zero',    range: '0–25',   color: '#4A90D9', desc: 'Critical foundation gaps. Start with the roadmap.' },
  { label: 'Cold Start',  range: '26–50',  color: '#85B7EB', desc: 'Revenue coming in but margins unclear. Systems missing.' },
  { label: 'Warming Up',  range: '51–70',  color: '#EF9F27', desc: 'Stabilizing. Trade platform unlocks.' },
  { label: 'Pressurized', range: '71–85',  color: '#E8593C', desc: 'Growing with confidence. Scale focus.' },
  { label: 'Superheated', range: '86–100', color: '#E24B4A', desc: 'Peak performance. Exit-ready.' },
]

export default function PlatformEcosystemPage() {
  return (
    <main className="min-h-dvh bg-brand-navy">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-3 border-b border-white/10">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors touch-target"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="font-display text-base tracking-widest text-brand-white">
          SUBZERO<span className="text-brand-accent">METRIX</span>
        </span>
      </div>

      <div className="px-5 max-w-md mx-auto pb-20">

        {/* Hero */}
        <div className="pt-8 mb-10 text-center">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-accent mb-3">
            Platform Ecosystem
          </p>
          <h1
            className="font-display leading-none text-brand-white mb-4"
            style={{ fontSize: 'clamp(2.4rem, 11vw, 3.5rem)', letterSpacing: '0.04em' }}
          >
            ONE SYSTEM.<br />EVERY TRADE.
          </h1>
          <p className="text-brand-silver text-sm leading-relaxed">
            SubZeroMetrix is the temperature instrument for every trades and service business.
            Start with the free MetrixScore™. As your score rises, your trade-specific platform
            unlocks deeper benchmarks, AI coaching, and KPI tracking built for exactly what you do.
          </p>
        </div>

        {/* Temperature scale */}
        <div className="mb-10">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-3">
            The temperature scale
          </p>
          <div className="space-y-2">
            {TEMPERATURE_STAGES.map(({ label, range, color, desc }) => (
              <div
                key={label}
                className="flex gap-3 rounded-sm p-3"
                style={{
                  background: `${color}12`,
                  border: `1px solid ${color}25`,
                }}
              >
                <div className="flex-shrink-0 pt-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-brand-white">{label}</span>
                    <span
                      className="font-mono text-[10px]"
                      style={{ color }}
                    >
                      {range}°
                    </span>
                  </div>
                  <p className="text-xs text-brand-silver leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-10">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-3">
            How the ecosystem works
          </p>
          <div className="space-y-2">
            {[
              { num: '01', title: 'Take the free MetrixScore™ assessment', desc: 'Seven questions. Every business — every trade — starts here.' },
              { num: '02', title: 'Get your temperature reading', desc: 'Your score across six areas shows exactly where your business is running cold.' },
              { num: '03', title: 'Unlock your personalized roadmap', desc: 'Trade-specific action steps, resource links, and 90-day priorities.' },
              { num: '04', title: 'Graduate to your trade platform', desc: 'As your temperature rises, your platform unlocks deeper data and AI coaching.' },
            ].map(({ num, title, desc }) => (
              <div
                key={num}
                className="flex gap-4 rounded-sm p-4"
                style={{ background: 'rgba(10,22,40,0.5)', border: '1px solid rgba(168,184,204,0.15)' }}
              >
                <span className="font-mono text-[9px] tracking-widest text-brand-silver/40 flex-shrink-0 pt-0.5">
                  {num}
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-white mb-0.5">{title}</p>
                  <p className="text-xs text-brand-silver leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform cards */}
        <div className="mb-10">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-3">
            The 11 platforms
          </p>
          <div className="space-y-2">
            {PLATFORMS.map(({ id, name, trade, accent, desc, badge, slug }) => {
              const cardContent = (
                <>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-sm font-semibold text-brand-white">{name}</span>
                    <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: accent }}>
                      {trade}
                    </span>
                    {badge && (
                      <span className="text-[9px] font-medium px-2 py-0.5 rounded-sm"
                        style={{ background: `${accent}25`, color: accent }}>
                        {badge}
                      </span>
                    )}
                    {slug && (
                      <span className="ml-auto text-[10px]" style={{ color: accent }}>Open →</span>
                    )}
                  </div>
                  <p className="text-xs text-brand-silver leading-relaxed">{desc}</p>
                </>
              )
              const cardStyle = { background: `${accent}0d`, border: `1px solid ${accent}22` }
              const cardClass = "rounded-sm p-4 transition-all"
              return slug ? (
                <Link key={name} href={`/platform/${slug}`} className={`block ${cardClass}`} style={cardStyle}>
                  {cardContent}
                </Link>
              ) : (
                <div key={name} className={cardClass} style={cardStyle}>
                  {cardContent}
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div
          className="rounded-sm p-6 mb-6 text-center"
          style={{ background: 'rgba(13,43,92,0.35)', border: '1px solid rgba(168,184,204,0.15)' }}
        >
          <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-brand-silver mt-1 mb-1">
            Start here — always free
          </p>
          <p className="font-display text-2xl tracking-wider text-brand-white mb-2">
            FOUNDATION METRIX
          </p>
          <p className="text-xs text-brand-silver mb-5 leading-relaxed">
            Every journey starts with knowing your temperature. Four minutes. No account needed.
          </p>
          <Link
            href="/assessment"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-sm text-xs font-semibold tracking-[0.1em] uppercase bg-brand-accent text-white hover:bg-brand-mid transition-all touch-target"
          >
            Get My MetrixScore™ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="glass-light rounded-sm p-4">
          <p className="text-[10px] text-brand-silver/70 leading-relaxed">
            <strong className="text-brand-silver">Educational use only.</strong> SubZeroMetrix
            platforms provide educational scoring and informational content. Nothing constitutes legal,
            financial, licensing, or business advice. Trade platform features are in active development.
          </p>
        </div>

      </div>
    </main>
  )
}
