import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema } from '@/lib/seo'
import { NewsletterSignupForm } from '@/components/NewsletterSignupForm'

export const metadata = buildMetadata({
  title: 'Newsletters',
  description: 'Two free publications: Pinellas Contractor Field Notes (local) and the Modern Trades CRM Growth & Systems Brief (national). Unsubscribe anytime.',
  path: '/newsletter',
})

export default function NewsletterHubPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Newsletter', url: '/newsletter' },
  ])

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="section-container max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-electric">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">Newsletter</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Newsletters</p>
        <h1 className="text-headline text-gray-900 mb-4">Two Free Publications</h1>
        <p className="text-lg text-gray-500 mb-12">
          Pick one or both. Each is a standalone publication with its own subscribe -- subscribing to one does not
          subscribe you to the other. Unsubscribe anytime from the link in every email or from your{' '}
          <Link href="/newsletter/preferences" className="text-brand-electric underline">preference center</Link>.
        </p>

        <div className="space-y-8">
          <div className="card-panel">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-2">Local -- Pinellas County</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pinellas Contractor Field Notes</h2>
            <p className="text-sm text-gray-600 mb-6">
              Local contractor operations notes for St. Petersburg, Clearwater, Largo, Palm Harbor, and greater
              Pinellas County -- from The Modern Trades Mentor. Occasional, practical, no fluff.
            </p>
            <NewsletterSignupForm publication="pinellas-field-notes" />
          </div>

          <div className="card-panel">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-cyan mb-2">National -- Any Trade</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Modern Trades CRM Growth & Systems Brief</h2>
            <p className="text-sm text-gray-600 mb-6">
              CRM and follow-up systems, missed-call recovery, estimate follow-up, customer reactivation, reviews and
              referrals, and workflow automation for service-business owners nationally.
            </p>
            <NewsletterSignupForm publication="growth-systems-brief" />
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-10">
          We store your email and which publication(s) you chose so we can send them and let you manage your
          preferences. We don&apos;t sell your email. See our{' '}
          <Link href="/privacy" className="text-brand-electric underline">privacy policy</Link>.
        </p>
      </div>
    </div>
  )
}
