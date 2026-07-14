import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, webPageSchema } from '@/lib/seo'
import { ReferralInterestForm } from '@/components/care/ReferralInterestForm'

export const metadata = buildMetadata({
  title: 'Refer Someone or Explore a Partnership',
  description: 'Let us know you’re interested in referring a business or exploring a partnership with Metrix Command Center. No payouts or commissions are set up yet.',
  path: '/customer-care/refer',
})

export default function ReferPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Customer Care Center', url: '/customer-care' },
    { name: 'Refer or Partner', url: '/customer-care/refer' },
  ])
  const webPage = webPageSchema({
    name: 'Refer Someone or Explore a Partnership',
    description: 'Submit referral or partner interest.',
    path: '/customer-care/refer',
  })

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />

      <div className="section-container max-w-xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-electric">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link href="/customer-care" className="hover:text-brand-electric">Customer Care Center</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">Refer or Partner</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Referrals &amp; Partnerships</p>
        <h1 className="text-headline text-gray-900 mb-6">Know a business that could use this?</h1>
        <p className="text-lg text-gray-500 mb-10">
          Tell us you&apos;re interested and we&apos;ll follow up. Referral rewards and formal partner terms
          are not yet available — this is an interest form, not an active program.
        </p>

        <ReferralInterestForm />
      </div>
    </div>
  )
}
