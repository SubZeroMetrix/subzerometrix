import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { buildOpenGraph, buildTwitter, breadcrumbJsonLd } from '@/lib/seo'
import GrowthRoadmap from '@/components/GrowthRoadmap'

const TITLE = 'Customer Growth Roadmap'
const DESCRIPTION =
  'Diagnose your real growth constraint — leads, conversion, capacity, retention, brand, pricing, or sales process — and get a prioritized, trade-aware customer-growth roadmap. Educational only.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/growth' },
  openGraph: buildOpenGraph({ title: 'Customer Growth Roadmap | SubZeroMetrix™', description: DESCRIPTION, path: '/growth' }),
  twitter: buildTwitter({ title: 'Customer Growth Roadmap | SubZeroMetrix™', description: DESCRIPTION }),
}

export default function GrowthPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Customer Growth Roadmap', path: '/growth' },
  ])

  return (
    <main className="min-h-dvh bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="px-5 pt-5 pb-4 border-b border-brand-blue/40"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)' }}>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs tracking-wide">Dashboard</span>
        </Link>
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-1">Contractor Growth Engine</p>
        <h1 className="font-display text-3xl tracking-wider text-brand-white leading-tight">CUSTOMER GROWTH ROADMAP</h1>
        <p className="text-[12px] text-brand-silver leading-relaxed mt-2 max-w-prose">
          For launched contractors who want more customers. We find your real constraint — not just
          "buy more leads" — and prioritize the highest-impact next moves. Educational only; your
          numbers stay on this device.
        </p>
      </div>

      <div className="px-5 py-6 max-w-2xl mx-auto">
        <GrowthRoadmap />
      </div>
    </main>
  )
}
