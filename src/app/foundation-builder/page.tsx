import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { buildOpenGraph, buildTwitter, breadcrumbJsonLd } from '@/lib/seo'
import FoundationBuilderChecklist from '@/components/FoundationBuilderChecklist'

const TITLE = 'Foundation Builder'
const DESCRIPTION =
  'A guided, step-by-step business-foundation checklist for contractors and service businesses — track setup across identity, legal, tax, banking, licensing, brand, operations, and launch. Educational only; verify legal, tax, and licensing with official sources.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/foundation-builder' },
  openGraph: buildOpenGraph({ title: 'Foundation Builder | SubZeroMetrix™', description: DESCRIPTION, path: '/foundation-builder' }),
  twitter: buildTwitter({ title: 'Foundation Builder | SubZeroMetrix™', description: DESCRIPTION }),
}

export default function FoundationBuilderPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Foundation Builder', path: '/foundation-builder' },
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
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-1">Guided Business Foundation Builder</p>
        <h1 className="font-display text-3xl tracking-wider text-brand-white leading-tight">FOUNDATION BUILDER</h1>
        <p className="text-[12px] text-brand-silver leading-relaxed mt-2 max-w-prose">
          Track your real-world business setup, step by step. Move each step across Start here,
          Do this next, Later, Done, or Blocked. Saved on this device.
        </p>
      </div>

      <div className="px-5 py-6 max-w-2xl mx-auto">
        <FoundationBuilderChecklist />
      </div>
    </main>
  )
}
