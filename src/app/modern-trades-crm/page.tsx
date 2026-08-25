import Link from 'next/link'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { TrackedCta } from '@/components/TrackedCta'

export const metadata = buildMetadata({
  title: 'Modern Trades CRM',
  description: 'Modern Trades CRM is an affiliated national CRM product for contractors — lead capture, pipeline, and follow-up. TMT consulting is optional and not required to purchase or use it.',
  path: '/modern-trades-crm',
})

export default function ModernTradesCrmPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Modern Trades CRM', url: '/modern-trades-crm' },
  ])

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="section-container max-w-3xl">
        <p className="text-label text-brand-electric mb-3">Affiliated national product</p>
        <h1 className="text-headline text-gray-900 mb-6">Modern Trades CRM</h1>
        <p className="text-lg text-gray-500 mb-8">
          A CRM built around the follow-up workflows this site talks about — lead capture, pipeline visibility, and
          estimate follow-up — for contractors and service businesses nationally.
        </p>

        <div className="card-panel bg-amber-50 border-amber-300 mb-10">
          <p className="text-sm text-amber-800">
            <strong>Status:</strong> Modern Trades CRM&apos;s production build is in progress. This page describes the
            intended product honestly rather than claiming features, pricing, or a live checkout that don&apos;t yet
            exist. A direct signup or purchase link will be added here once one is verified and live.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What it&apos;s for</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Lead capture from calls, forms, and messages in one pipeline</li>
            <li>Tracking estimates through to a won/lost outcome instead of letting them go stale</li>
            <li>Following up with dormant customers on a schedule instead of by memory</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What it doesn&apos;t claim</h2>
          <p className="text-gray-600 mb-3">
            Until independently verified in production, this page does not claim Modern Trades CRM includes a
            proprietary priority engine, cross-client learning, automatic business diagnosis, autonomous outcome
            optimization, or accounting/field-service-management integrations. It is a CRM, not a complete
            field-service-management platform.
          </p>
        </section>

        <div className="card-panel text-center">
          <p className="text-gray-700 mb-4">
            <strong>Modern Trades CRM is an affiliated national CRM product. TMT consulting is optional and is not
            required to purchase or use it.</strong>
          </p>
          <TrackedCta
            href="/contact?subject=Modern+Trades+CRM+interest"
            event="modern_trades_crm_click"
            source="crm-page"
            className="btn-primary"
          >
            Request early access
          </TrackedCta>
          <p className="mt-3 text-xs text-gray-400">No live checkout yet -- this sends an interest request, not a purchase.</p>
        </div>

        <p className="mt-10 text-sm text-gray-500">
          Want help finding where you actually need this first? <Link href="/revenue-leak-check" className="text-brand-electric underline underline-offset-2">Run the Revenue Leak Check</Link>.
        </p>
      </div>
    </div>
  )
}
