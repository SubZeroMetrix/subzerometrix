import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { buildOpenGraph, buildTwitter, breadcrumbJsonLd } from '@/lib/seo'
import AccountDataPrivacyControls from '@/components/AccountDataPrivacyControls'

const TITLE = 'Manage my data'
const DESCRIPTION =
  'Export or delete your own synced SubZeroMetrix™ progress data, or clear data saved on this device. These controls affect only your own data.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/account/privacy' },
  robots: { index: false, follow: false },
  openGraph: buildOpenGraph({ title: 'Manage my data | SubZeroMetrix™', description: DESCRIPTION, path: '/account/privacy' }),
  twitter: buildTwitter({ title: 'Manage my data | SubZeroMetrix™', description: DESCRIPTION }),
}

export default function AccountPrivacyPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Manage my data', path: '/account/privacy' },
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
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-1">Privacy & Data</p>
        <h1 className="font-display text-3xl tracking-wider text-brand-white leading-tight">MANAGE MY DATA</h1>
      </div>

      <div className="px-5 py-6 max-w-2xl mx-auto">
        <AccountDataPrivacyControls />
      </div>
    </main>
  )
}
