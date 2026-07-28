import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Running a Landscaping Business: Recurring Contracts and Seasonal Follow-Up',
  description:
    'A practical look at the operational gaps that cost landscaping and lawn care businesses money -- recurring contract renewals, seasonal lead follow-up, and where governed AI genuinely helps.',
  path: '/resources/landscaping',
})

export default function LandscapingPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Landscaping', url: '/resources/landscaping' },
  ])
  const article = articleSchema({
    headline: 'Running a Landscaping Business: Recurring Contracts and Seasonal Follow-Up',
    description: 'Operational gaps that cost landscaping businesses money, and where governed AI helps.',
    path: '/resources/landscaping',
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
          <span className="text-gray-900">Landscaping</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Landscaping</p>
        <h1 className="text-headline text-gray-900 mb-4">Running a Landscaping Business: Recurring Contracts and Seasonal Follow-Up</h1>
        <p className="text-sm text-gray-600 mb-10">
          A practical operations guide from the SubZero Metrix team. This covers business operations, not
          horticultural or landscape-design practice.
        </p>

        <div className="prose-content">
          <p>
            Landscaping and lawn care run on recurring contracts more than almost any other trade &mdash; weekly
            mowing, seasonal cleanups, annual maintenance plans. The revenue is predictable in theory, but only if
            renewals actually get offered and lapsed customers actually get re-engaged before they quietly switch
            to a competitor.
          </p>

          <h2>Seasonal Lead Spikes</h2>
          <p>
            Spring brings a surge of new-customer inquiries all at once &mdash; cleanup requests, design
            consultations, new-contract signups. Without a system tracking which leads have been contacted and
            which are still waiting, the busiest season becomes the one where the most opportunities slip through.
          </p>

          <h2>Recurring Contract Renewals</h2>
          <p>
            An annual maintenance contract that lapses without a renewal conversation is a lost customer, not a
            paused one &mdash; most homeowners don&apos;t proactively call to renew, they just quietly hire whoever
            shows up next. Tracking upcoming renewal dates the same way you&apos;d track an open estimate is what
            keeps that revenue from leaking out one contract at a time.
          </p>

          <h2>Crew Scheduling Around Weather</h2>
          <p>
            Weather delays are routine in this trade, and every rescheduled visit is a moment where communication
            can either reassure a customer or quietly erode their confidence. A quick &ldquo;we&apos;re moving your
            service to Thursday&rdquo; message costs nothing and prevents a customer from wondering if they&apos;ve
            been forgotten.
          </p>

          <h2>Upsell Moments</h2>
          <p>
            A mowing customer who mentions wanting a patio, a fence, or a full redesign is describing a much larger
            job than the one you&apos;re currently billing for &mdash; but that comment only turns into revenue if
            someone captures it and follows up, rather than letting it pass as small talk during a routine visit.
          </p>

          <h2>Where Metrix Command Center Helps</h2>
          <p>
            Metrix Command Center tracks upcoming contract renewals, flags new leads that haven&apos;t been followed
            up, and surfaces upsell opportunities mentioned during service visits, with an AI team that recommends
            the next action. Every recommendation requires your explicit approval before anything reaches a
            customer.
          </p>

          <h2>Where It Does Not Replace Professional Judgment</h2>
          <p>
            Metrix Command Center doesn&apos;t design landscapes or make horticultural recommendations. It organizes
            the business side &mdash; renewals, follow-ups, and scheduling &mdash; so recurring revenue doesn&apos;t
            depend on any one person remembering to chase it.
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
          Related: <Link href="/resources/business-operations" className="text-brand-electric underline">Business Operations</Link>{' '}
          &middot; <Link href="/resources/ai-for-contractors" className="text-brand-electric underline">AI for Contractors</Link>
        </p>
      </div>
    </div>
  )
}
