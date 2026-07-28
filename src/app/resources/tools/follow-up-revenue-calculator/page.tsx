import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, webPageSchema } from '@/lib/seo'
import { FollowUpRevenueCalculator } from '@/components/resources/FollowUpRevenueCalculator'
import { MCC_SIGNUP_URL } from '@/content/mcc-pricing'

export const metadata = buildMetadata({
  title: 'Follow-Up Revenue Calculator',
  description:
    'Estimate how much revenue is sitting in open estimates and overdue follow-ups. A free, real calculator -- your numbers stay in your browser, nothing is stored or tracked.',
  path: '/resources/tools/follow-up-revenue-calculator',
})

export default function FollowUpRevenueCalculatorPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Follow-Up Revenue Calculator', url: '/resources/tools/follow-up-revenue-calculator' },
  ])
  const webPage = webPageSchema({
    name: 'Follow-Up Revenue Calculator',
    description: 'Estimate revenue sitting in open estimates and overdue follow-ups.',
    path: '/resources/tools/follow-up-revenue-calculator',
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
          <span className="text-gray-900">Follow-Up Revenue Calculator</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Free Tool</p>
        <h1 className="text-headline text-gray-900 mb-4">Follow-Up Revenue Calculator</h1>
        <p className="text-lg text-gray-500 mb-10">
          Estimate how much revenue is realistically sitting in your open estimates and overdue follow-ups right
          now. Enter your own numbers -- nothing here uses industry averages or assumptions about your business.
        </p>

        <FollowUpRevenueCalculator />

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-10 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Stop tracking this manually</h2>
          <p className="text-sm text-gray-500 mb-6">
            Metrix Command Center surfaces overdue follow-ups and aging estimates automatically, with a governed AI
            team that recommends the next action.
          </p>
          <a href={MCC_SIGNUP_URL} className="btn-primary inline-block">Start Free Trial</a>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Related: <Link href="/#product-proof" className="text-brand-electric underline">See what a real recommendation looks like</Link>{' '}
          &middot; <Link href="/resources/hvac" className="text-brand-electric underline">HVAC</Link>{' '}
          &middot; <Link href="/resources/facility-management" className="text-brand-electric underline">Facility Management</Link>
        </p>
      </div>
    </div>
  )
}
