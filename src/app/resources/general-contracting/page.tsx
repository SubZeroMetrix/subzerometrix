import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Running a General Contracting or Remodeling Business: Where Jobs Stall',
  description:
    'A practical look at the operational gaps that cost general contractors and remodelers money -- estimate follow-up, change-order tracking, subcontractor coordination, and where governed AI genuinely helps.',
  path: '/resources/general-contracting',
})

export default function GeneralContractingPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'General Contracting', url: '/resources/general-contracting' },
  ])
  const article = articleSchema({
    headline: 'Running a General Contracting or Remodeling Business: Where Jobs Stall',
    description: 'Operational gaps that cost general contracting and remodeling businesses money, and where governed AI helps.',
    path: '/resources/general-contracting',
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
          <span className="text-gray-900">General Contracting</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">General Contracting</p>
        <h1 className="text-headline text-gray-900 mb-4">Running a General Contracting or Remodeling Business: Where Jobs Stall</h1>
        <p className="text-sm text-gray-600 mb-10">
          A practical operations guide from the SubZero Metrix team. This covers business operations, not
          construction methods, permitting, or code compliance &mdash; defer technical questions to a licensed
          contractor or engineer.
        </p>

        <div className="prose-content">
          <p>
            Remodeling and general contracting projects are long, multi-stage, and full of natural pause points &mdash;
            a bid under review, a permit in process, a change order awaiting sign-off. Each pause is a place a job
            can quietly stall if nobody is actively tracking it, and stalled jobs are where cash flow and customer
            trust both erode.
          </p>

          <h2>Bid and Estimate Follow-Up</h2>
          <p>
            A homeowner comparing bids from multiple contractors often takes weeks to decide. The contractor who
            stays visible with a genuine, well-timed follow-up &mdash; not a pushy one &mdash; has a real edge over
            one who submits a bid and goes quiet until the phone rings.
          </p>

          <h2>Change-Order Tracking</h2>
          <p>
            Change orders are where scope, price, and timeline all shift at once, and they&apos;re also where
            miscommunication does the most damage. A change order that&apos;s verbally agreed to but never formally
            tracked is a dispute waiting to happen once the final invoice doesn&apos;t match what the customer
            remembers agreeing to.
          </p>

          <h2>Subcontractor and Schedule Coordination</h2>
          <p>
            A remodel depends on multiple trades showing up in the right order &mdash; framing before electrical,
            electrical before drywall. A schedule that exists only in one person&apos;s head breaks the moment that
            person is unavailable, and the customer is the one who feels the resulting delay.
          </p>

          <h2>Project Close and Reviews</h2>
          <p>
            By the time a months-long remodel wraps, the momentum for a review or referral request has usually
            faded from the customer&apos;s mind. Asking right at final walkthrough &mdash; while the finished result
            is still fresh &mdash; gets meaningfully better response than asking weeks later.
          </p>

          <h2>Where Metrix Command Center Helps</h2>
          <p>
            Metrix Command Center surfaces aging bids, tracks estimates awaiting a decision, and flags customers
            who&apos;ve gone quiet, with an AI team that recommends the next action grounded in your real data.
            Every recommendation requires your explicit approval before anything reaches a customer.
          </p>

          <h2>Where It Does Not Replace Professional Judgment</h2>
          <p>
            Metrix Command Center doesn&apos;t manage construction scheduling logic, permitting, or code compliance.
            It organizes the business side &mdash; follow-ups, estimates, and customer communication &mdash; so a
            long project doesn&apos;t lose track of the customer relationship along the way.
          </p>
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-12 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">See if this matches your business</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/resources/tools/estimate-follow-up-priority-calculator" className="btn-primary inline-block">
              Try the Estimate Priority Calculator
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
