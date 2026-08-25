import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, webPageSchema } from '@/lib/seo'
import { EstimateFollowUpPriorityCalculator } from '@/components/resources/EstimateFollowUpPriorityCalculator'
import { TrackedCta } from '@/components/TrackedCta'

export const metadata = buildMetadata({
  title: 'Estimate Follow-Up Priority Calculator',
  description:
    'Score which open estimates need follow-up first based on age, customer response, urgency, and value. A free, real calculator -- nothing entered is sent to a server or stored.',
  path: '/resources/tools/estimate-follow-up-priority-calculator',
})

export default function EstimateFollowUpPriorityCalculatorPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Estimate Follow-Up Priority Calculator', url: '/resources/tools/estimate-follow-up-priority-calculator' },
  ])
  const webPage = webPageSchema({
    name: 'Estimate Follow-Up Priority Calculator',
    description: 'Score which open estimates need follow-up first based on age, customer response, urgency, and value.',
    path: '/resources/tools/estimate-follow-up-priority-calculator',
  })

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />

      <div className="section-container max-w-2xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-electric">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link href="/resources" className="hover:text-brand-electric">Resources</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">Estimate Follow-Up Priority Calculator</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Free Tool</p>
        <h1 className="text-headline text-gray-900 mb-4">Estimate Follow-Up Priority Calculator</h1>
        <p className="text-lg text-gray-500 mb-10">
          When multiple estimates are open at once, this scores which ones need attention first based on age,
          customer response, urgency, and value -- not just which came in most recently.
        </p>

        <EstimateFollowUpPriorityCalculator />

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-10 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Stop scoring this by hand</h2>
          <p className="text-sm text-gray-500 mb-6">
            Modern Trades CRM tracks estimate follow-up automatically instead of a manual calculator -- sold
            nationally, independent of any consulting engagement.
          </p>
          <TrackedCta href="/modern-trades-crm" event="modern_trades_crm_click" source="estimate-priority-calculator" className="btn-primary inline-block">
            See Modern Trades CRM
          </TrackedCta>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Related: <Link href="/resources/business-operations" className="text-brand-electric underline">Business Operations</Link>{' '}
          &middot; <Link href="/resources/electrical" className="text-brand-electric underline">Electrical</Link>{' '}
          &middot; <Link href="/resources/plumbing" className="text-brand-electric underline">Plumbing</Link>
        </p>
      </div>
    </div>
  )
}
