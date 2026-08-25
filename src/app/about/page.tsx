import { buildMetadata } from '@/lib/seo'
import Link from 'next/link'

export const metadata = buildMetadata({
  title: 'About & Ownership',
  description: 'SubZeroMetrix.com is owned and published by SubZeroMetrix LLC. Who runs it, what it does, and how Modern Trades CRM and The Modern Trades Mentor are affiliated.',
  path: '/about',
})

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SubZero Metrix',
  legalName: 'SubZeroMetrix LLC',
  url: 'https://www.subzerometrix.com',
  founder: { '@type': 'Person', name: 'Richard Fritzke' },
}

export default function AboutPage() {
  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <div className="section-container max-w-3xl">
        <p className="text-label text-brand-electric mb-3">About</p>
        <h1 className="text-headline text-gray-900 mb-8">About SubZero Metrix</h1>

        <div className="prose-content space-y-8">
          <section id="ownership" className="card-panel">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Ownership &amp; affiliations</h2>
            <p className="text-gray-600">
              SubZeroMetrix.com is owned and published by <strong>SubZeroMetrix LLC</strong>. It publishes original
              contractor revenue-leak research and a free self-assessment (the Revenue Leak Check), written and
              reviewed by Richard Fritzke.
            </p>
            <p className="text-gray-600 mt-3">
              <strong>Modern Trades CRM</strong> and <strong>The Modern Trades Mentor</strong> are affiliated
              offerings, not independent third parties. Where this site recommends either one, that&apos;s a
              disclosed affiliation. TMT consulting is optional and is not required to use Modern Trades CRM.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">What this site does</h2>
            <p className="text-gray-600">
              SubZero Metrix publishes research and a free assessment on where contractor revenue actually leaks —
              missed calls, stalled estimates, dormant customers, callback cost, follow-up gaps, and owner-dependent
              processes. The goal is to help a contractor identify the strongest, most defensible opportunity first,
              not to sell a scoring product.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">What this site doesn&apos;t claim</h2>
            <p className="text-gray-600">
              The methodology described on this site (Contractor Business Profile, Evidence Ledger, Revenue Leak
              Signals, Priority Selection) is a research framework, not a claim of a live autonomous AI system,
              cross-client learning model, or proprietary signal graph already in production. Where a capability
              isn&apos;t verified and shipped, this site says so rather than implying it exists.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Who runs this</h2>
            <p className="text-gray-600">Written and reviewed by Richard Fritzke, 26 years in HVAC/R and facilities operations leadership.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
            <p className="text-gray-600">
              Questions, corrections, or feedback? <Link href="/contact" className="text-brand-electric underline underline-offset-2">Contact us</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
