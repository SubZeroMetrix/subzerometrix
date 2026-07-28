import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Running a Security and Alarm Business: Monitoring Renewals and Install Follow-Up',
  description:
    'A practical look at the operational gaps that cost security and alarm installation businesses money -- monitoring-contract renewals, install estimate follow-up, and where governed AI genuinely helps.',
  path: '/resources/security-and-alarm',
})

export default function SecurityAndAlarmPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Security and Alarm', url: '/resources/security-and-alarm' },
  ])
  const article = articleSchema({
    headline: 'Running a Security and Alarm Business: Monitoring Renewals and Install Follow-Up',
    description: 'Operational gaps that cost security and alarm businesses money, and where governed AI helps.',
    path: '/resources/security-and-alarm',
    authorGrounded: false,
  })

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />

      <div className="section-container max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-electric">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link href="/resources" className="hover:text-brand-electric">Resources</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">Security and Alarm</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Security and Alarm</p>
        <h1 className="text-headline text-gray-900 mb-4">Running a Security and Alarm Business: Monitoring Renewals and Install Follow-Up</h1>
        <p className="text-sm text-gray-600 mb-10">
          A practical operations guide from the SubZero Metrix team. This covers business operations, not security
          system design or installation practice.
        </p>

        <div className="prose-content">
          <p>
            Security and alarm businesses run on two revenue streams that behave very differently: one-time
            installation jobs and recurring monitoring contracts. The installation sale gets most of the attention,
            but the monitoring contract is the one that actually compounds into long-term revenue &mdash; if it
            renews.
          </p>

          <h2>Monitoring Contract Renewals</h2>
          <p>
            A monitoring contract that lapses without a renewal call is a customer who&apos;s often still using the
            system but no longer paying for active monitoring &mdash; a quiet revenue leak that&apos;s easy to miss
            unless renewal dates are tracked as deliberately as new sales.
          </p>

          <h2>Install Estimate Follow-Up</h2>
          <p>
            A full home or business security system is a considered purchase, and prospects frequently compare
            multiple providers before committing. An estimate that goes unfollowed loses to whichever competitor
            stayed visible during the decision window.
          </p>

          <h2>Upgrade and Expansion Opportunities</h2>
          <p>
            An existing monitoring customer who mentions wanting cameras added, a new zone covered, or smart-home
            integration is describing new installation revenue &mdash; but that comment only becomes a sale if
            someone captures it and follows up rather than letting it pass during a routine service call.
          </p>

          <h2>False-Alarm and Service Call Follow-Up</h2>
          <p>
            A customer who had a false alarm or a service issue is at higher risk of cancelling their monitoring
            contract out of frustration. A prompt, clear follow-up after that kind of incident protects the
            relationship; silence after it tends to accelerate cancellation.
          </p>

          <h2>Where Metrix Command Center Helps</h2>
          <p>
            Metrix Command Center tracks upcoming monitoring renewals, flags aging install estimates, and surfaces
            upgrade opportunities mentioned during service calls, with an AI team that recommends the next action.
            Every recommendation requires your explicit approval before anything reaches a customer.
          </p>

          <h2>Where It Does Not Replace Professional Judgment</h2>
          <p>
            Metrix Command Center doesn&apos;t design security systems or evaluate coverage adequacy. It organizes
            the business side &mdash; renewals, follow-up, and upgrade opportunities &mdash; so recurring monitoring
            revenue doesn&apos;t quietly lapse.
          </p>
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-12 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">See if this matches your business</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/resources/tools/follow-up-revenue-calculator" className="btn-primary inline-block">
              Try the Follow-Up Revenue Calculator
            </Link>
            <Link href="/#pricing" className="btn-secondary inline-block">See Pricing</Link>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Related: <Link href="/resources/hvac/recurring-revenue" className="text-brand-electric underline">Recurring Revenue Patterns</Link>{' '}
          &middot; <Link href="/resources/business-operations" className="text-brand-electric underline">Business Operations</Link>{' '}
          &middot; <Link href="/resources/ai-for-contractors" className="text-brand-electric underline">AI for Contractors</Link>
        </p>
      </div>
    </div>
  )
}
