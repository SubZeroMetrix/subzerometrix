import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Running a Garage Door Business: Emergency Calls and Estimate Follow-Up',
  description:
    'A practical look at the operational gaps that cost garage door repair and installation businesses money -- emergency response, estimate follow-up, and where governed AI genuinely helps.',
  path: '/resources/garage-door-repair',
})

export default function GarageDoorPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Garage Door Repair', url: '/resources/garage-door-repair' },
  ])
  const article = articleSchema({
    headline: 'Running a Garage Door Business: Emergency Calls and Estimate Follow-Up',
    description: 'Operational gaps that cost garage door businesses money, and where governed AI helps.',
    path: '/resources/garage-door-repair',
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
          <span className="text-gray-900">Garage Door Repair</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Garage Door Repair</p>
        <h1 className="text-headline text-gray-900 mb-4">Running a Garage Door Business: Emergency Calls and Estimate Follow-Up</h1>
        <p className="text-sm text-gray-600 mb-10">
          A practical operations guide from the SubZero Metrix team. This covers business operations, not garage
          door mechanics or installation practice.
        </p>

        <div className="prose-content">
          <p>
            Garage door service splits cleanly into two very different jobs: same-day emergency repairs (a door
            stuck shut, a broken spring) and planned replacement or upgrade estimates. Treating both with the same
            follow-up process usually shortchanges one of them &mdash; emergencies need speed, estimates need
            patience.
          </p>

          <h2>Emergency Response Speed</h2>
          <p>
            A stuck or broken garage door is an urgent, high-anxiety problem for most homeowners. The company that
            answers fastest and gives a clear arrival window usually wins the job regardless of price &mdash; slow or
            vague response loses jobs that were otherwise easy wins.
          </p>

          <h2>Replacement and Upgrade Estimates</h2>
          <p>
            Full door replacement is a considered purchase, not an emergency one, and homeowners often take weeks
            to decide. An estimate that goes unfollowed becomes a lost sale exactly the way it would in any other
            trade &mdash; the customer simply moves on once nobody re-engages them.
          </p>

          <h2>Recurring Maintenance Opportunities</h2>
          <p>
            Annual spring and cable inspections are a natural recurring-revenue opportunity that&apos;s easy to miss
            if nobody flags it at the close of a repair job. A customer who just had an emergency fixed is a strong
            candidate for a maintenance plan that prevents the next one.
          </p>

          <h2>Reviews After Fast Resolution</h2>
          <p>
            A homeowner whose garage door got fixed quickly is genuinely relieved and receptive to a review request
            right at job close &mdash; that window closes fast once the inconvenience is forgotten.
          </p>

          <h2>Where Metrix Command Center Helps</h2>
          <p>
            Metrix Command Center tracks aging replacement estimates, flags maintenance-plan opportunities after
            repair jobs, and prompts review requests at the right moment, with an AI team that recommends the next
            action. Every recommendation requires your explicit approval before anything reaches a customer.
          </p>

          <h2>Where It Does Not Replace Professional Judgment</h2>
          <p>
            Metrix Command Center doesn&apos;t diagnose door or opener issues or recommend repair versus replacement.
            It organizes the business side &mdash; follow-ups, maintenance opportunities, and reviews &mdash; so
            estimates and recurring revenue don&apos;t fall through the cracks.
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
          Related: <Link href="/resources/business-operations/dispatch-and-scheduling" className="text-brand-electric underline">Dispatch and Scheduling</Link>{' '}
          &middot; <Link href="/resources/business-operations" className="text-brand-electric underline">Business Operations</Link>{' '}
          &middot; <Link href="/resources/ai-for-contractors" className="text-brand-electric underline">AI for Contractors</Link>
        </p>
      </div>
    </div>
  )
}
