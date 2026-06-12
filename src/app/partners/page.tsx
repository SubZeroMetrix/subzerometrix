import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Info } from 'lucide-react'
import { buildOpenGraph, buildTwitter, breadcrumbJsonLd } from '@/lib/seo'
import {
  getPartnerDistributionChannels, getPartnerResourceAssets, getPartnerDisclosureText,
  PARTNER_CONTACT_EMAIL,
} from '@/lib/partnerDistribution'
import PartnerInterestForm from '@/components/PartnerInterestForm'
import ShareReferralCard from '@/components/ShareReferralCard'
import GrowthEventTracker from '@/components/GrowthEventTracker'

const TITLE = 'Partners'
const DESCRIPTION =
  'How trade associations, vendors, suppliers, educators, coaches, and communities can share SubZeroMetrix™ as a free educational business-readiness resource. Sharing implies no endorsement unless confirmed.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/partners' },
  openGraph: buildOpenGraph({ title: 'Partners | SubZeroMetrix™', description: DESCRIPTION, path: '/partners' }),
  twitter: buildTwitter({ title: 'Partners | SubZeroMetrix™', description: DESCRIPTION }),
}

export default function PartnersPage() {
  const channels = getPartnerDistributionChannels()
  const assets = getPartnerResourceAssets()
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Partners', path: '/partners' },
  ])

  return (
    <main className="min-h-dvh bg-brand-navy">
      <GrowthEventTracker milestone="public_page_viewed" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="px-5 pt-5 pb-4 border-b border-brand-blue/40"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)' }}>
        <Link href="/" className="inline-flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs tracking-wide">Home</span>
        </Link>
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-1">Partners & Distribution</p>
        <h1 className="font-display text-3xl tracking-wider text-brand-white leading-tight">SHARE SUBZEROMETRIX™</h1>
        <p className="text-[12px] text-brand-silver mt-2 leading-relaxed">{DESCRIPTION}</p>
      </div>

      <div className="px-5 max-w-md mx-auto w-full pb-12 pt-6 space-y-4">

        <div className="rounded-2xl p-4 flex items-start gap-2"
          style={{ background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.25)' }}>
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EFB967' }} />
          <p className="text-[12px] text-brand-silver leading-relaxed">{getPartnerDisclosureText()}</p>
        </div>

        <section className="glass rounded-2xl p-5">
          <h2 className="font-display text-base tracking-wide text-brand-white mb-2">Who this is for</h2>
          <p className="text-[13px] text-brand-silver leading-relaxed">
            Trade associations, suppliers and vendors, manufacturers and distributors, coaches and
            consultants, trade schools, communities, media, software vendors, and local business
            networks who want to share a free, educational business-readiness resource with
            contractors, tradespeople, and service-business owners.
          </p>
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="font-display text-base tracking-wide text-brand-white mb-2">How partners can share</h2>
          <p className="text-[12px] text-brand-silver leading-relaxed mb-3">
            Share SubZeroMetrix™ as a free, educational resource — no endorsement is implied unless we
            confirm one together.
          </p>
          <div className="space-y-2">
            {channels.map(c => (
              <div key={c.type} className="flex items-start gap-2">
                <span className="text-brand-accent/70 text-[10px] mt-1 flex-shrink-0">—</span>
                <span className="text-[12px] text-brand-silver leading-snug">
                  <span className="text-brand-white">{c.label}:</span> {c.howTheyShare}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="font-display text-base tracking-wide text-brand-white mb-2">Resources you can share</h2>
          <div className="space-y-1.5">
            {assets.map(a => (
              <Link key={a.id} href={a.path} className="flex items-center justify-between gap-2 text-[12px] text-brand-accent hover:underline underline-offset-2">
                <span>{a.label}</span>
                <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* Active local-device partner interest form */}
        <PartnerInterestForm />

        {/* Share this with your network (manual share only) */}
        <ShareReferralCard context="partners" />

        <section className="glass rounded-2xl p-5">
          <h2 className="font-display text-base tracking-wide text-brand-white mb-2">Contact</h2>
          <p className="text-[13px] text-brand-silver leading-relaxed">
            To formally explore distribution, email{' '}
            <a href={`mailto:${PARTNER_CONTACT_EMAIL}`} className="text-brand-accent underline underline-offset-2">{PARTNER_CONTACT_EMAIL}</a>.
            SubZeroMetrix™ is owned and operated by The Modern Trades Mentor LLC.
          </p>
        </section>

        <p className="text-[10px] text-brand-silver/50 leading-relaxed">
          Educational only. Not legal, tax, financial, or licensing advice. SubZeroMetrix™ and
          MetrixScore™ are trademarks of The Modern Trades Mentor LLC.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {[['About', '/about'], ['Resources', '/resources'], ['Disclaimer', '/disclaimer']].map(([label, href]) => (
            <Link key={href} href={href} className="text-[12px] text-brand-accent hover:underline underline-offset-2">{label}</Link>
          ))}
        </div>
      </div>
    </main>
  )
}
