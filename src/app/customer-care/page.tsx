import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, webPageSchema } from '@/lib/seo'
import { CustomerCareForm } from '@/components/care/CustomerCareForm'

export const metadata = buildMetadata({
  title: 'Customer Care Center',
  description: 'Get help, report a problem, ask a question, or find the right next step — for website visitors, prospects, and Metrix Command Center customers.',
  path: '/customer-care',
})

export default function CustomerCarePage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Customer Care Center', url: '/customer-care' },
  ])
  const webPage = webPageSchema({
    name: 'Customer Care Center',
    description: 'Get help, report a problem, or find the right next step.',
    path: '/customer-care',
  })

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />

      <div className="section-container max-w-4xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-electric">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">Customer Care Center</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Customer Care Center</p>
        <h1 className="text-headline text-gray-900 mb-6">How can we help?</h1>
        <p className="text-lg text-gray-500 max-w-2xl mb-14">
          This is the public support center for website visitors, prospects, and anyone with a question about
          Metrix Command Center. Existing customer accounts are supported separately — see below.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Link href="/buster" className="card-panel hover:border-brand-electric/30 transition-colors">
            <h2 className="text-base font-bold text-gray-900 mb-2">Ask Buster</h2>
            <p className="text-sm text-gray-500 leading-relaxed">Get a real answer, sourced from our Help Center content — or browse it directly.</p>
          </Link>
          <Link href="/customer-care/qualify" className="card-panel hover:border-brand-electric/30 transition-colors">
            <h2 className="text-base font-bold text-gray-900 mb-2">Not sure Metrix is right for you?</h2>
            <p className="text-sm text-gray-500 leading-relaxed">Answer a few quick questions and we&apos;ll help you figure out the right next step.</p>
          </Link>
          <Link href="/customer-care/refer" className="card-panel hover:border-brand-electric/30 transition-colors">
            <h2 className="text-base font-bold text-gray-900 mb-2">Refer someone or explore a partnership</h2>
            <p className="text-sm text-gray-500 leading-relaxed">Let us know you&apos;re interested — no payouts or commissions are set up yet.</p>
          </Link>
          <div className="card-panel">
            <h2 className="text-base font-bold text-gray-900 mb-2">Billing and cancellation</h2>
            <p className="text-sm text-gray-500 leading-relaxed">Cancel anytime — access continues through the end of your billing period. See <Link href="/help/refund-policy" className="text-brand-electric underline">refund policy</Link>.</p>
          </div>
          <div className="card-panel">
            <h2 className="text-base font-bold text-gray-900 mb-2">Privacy and data requests</h2>
            <p className="text-sm text-gray-500 leading-relaxed">See our <Link href="/privacy" className="text-brand-electric underline">Privacy Policy</Link>, or submit a request using the form below.</p>
          </div>
          <div className="card-panel">
            <h2 className="text-base font-bold text-gray-900 mb-2">Existing Metrix account?</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              This site does not handle account support. Log in at{' '}
              <a href="https://mcc.subzerometrix.com/login" className="text-brand-electric underline">mcc.subzerometrix.com</a>{' '}
              for account-specific help.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit a request</h2>
        <CustomerCareForm />

        <p className="text-sm text-gray-500 mt-8 text-center">
          Prefer email? <a href="mailto:info@subzerometrix.com" className="text-brand-electric underline">info@subzerometrix.com</a>
        </p>
      </div>
    </div>
  )
}
