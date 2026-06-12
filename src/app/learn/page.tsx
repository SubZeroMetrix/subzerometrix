import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'
import { buildOpenGraph, buildTwitter, breadcrumbJsonLd } from '@/lib/seo'
import { getPublicResources } from '@/lib/publicResources'

const TITLE = 'Learn'
const DESCRIPTION =
  'Free, practical guides for starting and growing a contractor, trades, or service business — readiness, setup checklists, and how the SubZeroMetrix™ MetrixScore™ works.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/learn' },
  openGraph: buildOpenGraph({ title: 'Learn | SubZeroMetrix™', description: DESCRIPTION, path: '/learn' }),
  twitter: buildTwitter({ title: 'Learn | SubZeroMetrix™', description: DESCRIPTION }),
}

export default function LearnIndexPage() {
  const resources = getPublicResources()
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Learn', path: '/learn' },
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
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-1">SubZeroMetrix™ · Learn</p>
        <h1 className="font-display text-3xl tracking-wider text-brand-white leading-tight">PRACTICAL GUIDES</h1>
        <p className="text-[12px] text-brand-silver leading-relaxed mt-2 max-w-prose">
          Field-tested guides for contractors, tradespeople, and service businesses. Educational only — we route you
          to official sources for legal, tax, and licensing.
        </p>
      </div>

      <div className="px-5 py-6 max-w-2xl mx-auto space-y-3">
        {resources.map(r => (
          <Link key={r.slug} href={`/learn/${r.slug}`}
            className="glass rounded-2xl p-4 block active:scale-[0.99] transition-all touch-target">
            <div className="flex items-start justify-between gap-3">
              <span className="flex items-start gap-2.5 min-w-0">
                <BookOpen className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-brand-white">{r.title}</span>
                  <span className="block text-[11px] text-brand-silver/70 leading-relaxed mt-0.5">{r.description}</span>
                </span>
              </span>
              <ArrowRight className="w-4 h-4 text-brand-silver flex-shrink-0 mt-1" />
            </div>
          </Link>
        ))}

        <div className="pt-2 flex flex-wrap gap-2">
          <Link href="/business-readiness" className="flex-1 text-center py-2.5 rounded-xl text-[12px] font-semibold glass text-brand-white touch-target">
            Business readiness
          </Link>
          <Link href="/resources" className="flex-1 text-center py-2.5 rounded-xl text-[12px] font-semibold glass text-brand-white touch-target">
            Contractor resources
          </Link>
        </div>
      </div>
    </main>
  )
}
