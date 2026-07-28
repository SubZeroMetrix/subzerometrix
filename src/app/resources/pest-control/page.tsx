import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Running a Pest Control Business: Recurring Service Plans and Callback Follow-Up',
  description:
    'A practical look at the operational gaps that cost pest control businesses money -- recurring plan renewals, callback tracking, and where governed AI genuinely helps.',
  path: '/resources/pest-control',
})

export default function PestControlPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Pest Control', url: '/resources/pest-control' },
  ])
  const article = articleSchema({
    headline: 'Running a Pest Control Business: Recurring Service Plans and Callback Follow-Up',
    description: 'Operational gaps that cost pest control businesses money, and where governed AI helps.',
    path: '/resources/pest-control',
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
          <span className="text-gray-900">Pest Control</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Pest Control</p>
        <h1 className="text-headline text-gray-900 mb-4">Running a Pest Control Business: Recurring Service Plans and Callback Follow-Up</h1>
        <p className="text-sm text-gray-600 mb-10">
          A practical operations guide from the SubZero Metrix team. This covers business operations, not pest
          treatment methods or product application &mdash; defer technical questions to a licensed pest control
          professional.
        </p>

        <div className="prose-content">
          <p>
            Pest control is a recurring-service business almost by default &mdash; quarterly treatments, seasonal
            plans, one-time jobs that should convert into ongoing service. The businesses that grow steadily are
            the ones that treat every one-time job as a recurring-plan opportunity and keep renewal dates visible,
            not the ones with the biggest one-time job volume.
          </p>

          <h2>Converting One-Time Jobs to Recurring Plans</h2>
          <p>
            A customer who called for a one-time ant or wasp problem is a strong candidate for a quarterly plan &mdash;
            but only if someone actually makes that offer before the truck leaves the driveway. Left to chance,
            most one-time customers stay one-time customers simply because nobody asked.
          </p>

          <h2>Callback Tracking</h2>
          <p>
            Pest issues sometimes require a callback if the first treatment doesn&apos;t fully resolve the problem.
            Customers who call back and don&apos;t get a fast, clear response are the ones most likely to leave a
            negative review or churn entirely &mdash; callbacks are a trust-critical moment, not a routine one.
          </p>

          <h2>Renewal and Re-Treatment Scheduling</h2>
          <p>
            Recurring plans only generate revenue if the scheduled visits actually happen on time. A quarterly
            treatment that slips by a few weeks without anyone noticing is exactly the kind of gap that makes a
            customer question whether the plan is worth renewing at all.
          </p>

          <h2>Reviews at the Right Moment</h2>
          <p>
            The best moment to ask for a review is right after a visible pest problem gets resolved &mdash; when
            relief is fresh &mdash; not during a routine quarterly visit where nothing dramatic happened. Timing the
            ask to the moment of actual customer relief consistently gets a better response.
          </p>

          <h2>Where Metrix Command Center Helps</h2>
          <p>
            Metrix Command Center flags one-time jobs as recurring-plan opportunities, tracks upcoming renewal and
            re-treatment dates, and surfaces overdue callbacks, with an AI team that recommends the next action.
            Every recommendation requires your explicit approval before anything reaches a customer.
          </p>

          <h2>Where It Does Not Replace Professional Judgment</h2>
          <p>
            Metrix Command Center doesn&apos;t diagnose pest issues or recommend treatment methods. It organizes the
            business side &mdash; renewals, callbacks, and follow-ups &mdash; so recurring revenue and customer
            trust don&apos;t depend on any one person remembering to follow through.
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
