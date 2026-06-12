import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Info } from 'lucide-react'
import { buildOpenGraph, buildTwitter, breadcrumbJsonLd } from '@/lib/seo'
import { getGeneralBusinessStarterPackage } from '@/lib/generalBusinessStarter'
import ShareReferralCard from '@/components/ShareReferralCard'

const TITLE = 'General Business Starter'
const DESCRIPTION =
  'A free, educational starter framework for anyone researching how to start a business — setup, finances, pricing, customers, operations, and a 30-day action plan. SubZeroMetrix™ is strongest for contractors, trades, and service businesses.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/general-business-starter' },
  openGraph: buildOpenGraph({ title: 'General Business Starter | SubZeroMetrix™', description: DESCRIPTION, path: '/general-business-starter' }),
  twitter: buildTwitter({ title: 'General Business Starter | SubZeroMetrix™', description: DESCRIPTION }),
}

export default function GeneralBusinessStarterPage() {
  const pkg = getGeneralBusinessStarterPackage()
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'General Business Starter', path: '/general-business-starter' },
  ])

  return (
    <main className="min-h-dvh bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="px-5 pt-5 pb-4 border-b border-brand-blue/40"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)' }}>
        <Link href="/" className="inline-flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs tracking-wide">Home</span>
        </Link>
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-1">Starter Framework</p>
        <h1 className="font-display text-3xl tracking-wider text-brand-white leading-tight">
          GENERAL BUSINESS STARTER
        </h1>
        <p className="text-[12px] text-brand-silver mt-2 leading-relaxed">
          A free, educational starter framework for anyone researching how to start a business.
          Use it to understand the basics, then go deeper where it fits.
        </p>
      </div>

      <div className="px-5 max-w-md mx-auto w-full pb-12 pt-6 space-y-4">

        {/* Honesty / scope note */}
        <div className="rounded-2xl p-4 flex items-start gap-2"
          style={{ background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.25)' }}>
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EFB967' }} />
          <p className="text-[12px] text-brand-silver leading-relaxed">{pkg.scopeNote}</p>
        </div>

        {/* Sections (checklist + 30-day plan) */}
        {pkg.sections.map(section => (
          <section key={section.id} className="glass rounded-2xl p-5">
            <h2 className="font-display text-base tracking-wide text-brand-white mb-1">{section.title}</h2>
            <p className="text-[11px] text-brand-silver/70 leading-relaxed mb-3">{section.intro}</p>
            <div className="space-y-2.5">
              {section.items.map(item => (
                <div key={item.id}>
                  <p className="text-[13px] font-semibold text-brand-white leading-snug">{item.label}</p>
                  <p className="text-[11px] text-brand-silver leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Next-step routing */}
        <section className="glass rounded-2xl p-5">
          <h2 className="font-display text-base tracking-wide text-brand-white mb-3">Your next step</h2>
          <div className="space-y-3">
            {pkg.routing.map(rec => (
              <Link key={rec.audience} href={rec.recommendedPath}
                className="block rounded-xl px-3 py-3"
                style={{ background: 'rgba(74,144,217,0.08)', border: '1px solid rgba(74,144,217,0.22)' }}>
                <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-brand-accent block mb-0.5">{rec.audience}</span>
                <span className="text-[13px] font-semibold text-brand-white">{rec.cta}</span>
                <span className="text-[11px] text-brand-silver block mt-0.5 leading-relaxed">{rec.note}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Share this starter guide (manual share only) */}
        <ShareReferralCard context="general_business_starter" />

        {/* Primary CTAs */}
        <div className="space-y-2">
          <Link href="/start"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl text-sm font-semibold tracking-wide uppercase bg-brand-accent text-white shadow-glow-blue active:scale-[0.98] transition-all touch-target">
            Take the SubZeroMetrix™ assessment <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/business-readiness"
              className="flex items-center justify-center text-center py-3 px-3 rounded-xl text-[12px] font-medium glass text-brand-silver hover:text-brand-white transition-colors touch-target">
              Explore business readiness
            </Link>
            <Link href="/resources"
              className="flex items-center justify-center text-center py-3 px-3 rounded-xl text-[12px] font-medium glass text-brand-silver hover:text-brand-white transition-colors touch-target">
              View contractor resources
            </Link>
          </div>
        </div>

        {/* Disclaimer + nav links */}
        <p className="text-[10px] text-brand-silver/60 leading-relaxed pt-1">{pkg.disclaimer}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {[['Start', '/start'], ['Business readiness', '/business-readiness'], ['Resources', '/resources'], ['About', '/about'], ['Disclaimer', '/disclaimer']].map(([label, href]) => (
            <Link key={href} href={href} className="text-[12px] text-brand-accent hover:underline underline-offset-2">
              {label}
            </Link>
          ))}
        </div>
        <p className="text-[10px] text-brand-silver/50 leading-relaxed">
          SubZeroMetrix™ and MetrixScore™ are trademarks of The Modern Trades Mentor LLC.
        </p>
      </div>
    </main>
  )
}
