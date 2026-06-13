import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { buildOpenGraph, buildTwitter, breadcrumbJsonLd } from '@/lib/seo'
import SupportedTrades from '@/components/SupportedTrades'
import EmailCaptureForm from '@/components/EmailCaptureForm'

const TITLE = 'Supported Trades'
const DESCRIPTION =
  'The trades SubZeroMetrix™ supports for business readiness and startup — HVAC, electrical, plumbing, roofing, construction, handyman, landscaping, cleaning, painting, and solar — with one honest startup consideration each.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/trades' },
  openGraph: buildOpenGraph({ title: 'Supported Trades | SubZeroMetrix™', description: DESCRIPTION, path: '/trades' }),
  twitter: buildTwitter({ title: 'Supported Trades | SubZeroMetrix™', description: DESCRIPTION }),
}

export default function TradesPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Supported Trades', path: '/trades' },
  ])

  return (
    <main className="min-h-dvh bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="px-5 pt-5 pb-4 border-b border-brand-blue/40"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)' }}>
        <Link href="/learn" className="inline-flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs tracking-wide">Learn</span>
        </Link>
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-1">SubZeroMetrix™</p>
        <h1 className="font-display text-3xl tracking-wider text-brand-white leading-tight">SUPPORTED TRADES</h1>
        <p className="text-[12px] text-brand-silver leading-relaxed mt-2 max-w-prose">
          SubZeroMetrix™ provides its deepest readiness and startup guidance for contractors,
          tradespeople, home-service, construction, and field-service businesses. It does not offer
          equal depth for unrelated industries.
        </p>
      </div>

      <div className="px-5 py-6 max-w-2xl mx-auto space-y-5">
        <SupportedTrades heading="Trades we support" />

        <section className="space-y-2.5">
          <Link href="/start"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[13px] font-semibold tracking-wide uppercase bg-brand-accent text-white active:scale-[0.98] transition-all touch-target">
            Check your business readiness <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="flex flex-wrap gap-2">
            <Link href="/foundation-builder" className="flex-1 text-center py-2.5 rounded-xl text-[12px] font-semibold glass text-brand-white touch-target">
              Foundation Builder
            </Link>
            <Link href="/learn/start-a-trade-business" className="flex-1 text-center py-2.5 rounded-xl text-[12px] font-semibold glass text-brand-white touch-target">
              Start a trade business
            </Link>
          </div>
        </section>

        <EmailCaptureForm sourcePage="/trades" sourceIntent="supported trades overview"
          heading="Trade-specific startup guidance" />

        <p className="text-[10px] text-brand-silver/50 leading-relaxed border-t border-brand-blue/30 pt-4">
          SubZeroMetrix™ is an educational business-readiness platform from The Modern Trades Mentor LLC.
          This is general education — not legal, tax, financial, or licensing advice. Verify requirements
          with official state and local sources.
        </p>
      </div>
    </main>
  )
}
