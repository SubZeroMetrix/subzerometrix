import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Running a Roofing Business: Estimates, Storm Leads, and Follow-Up',
  description:
    'A practical look at the operational gaps that cost roofing businesses money -- storm-lead response time, estimate follow-up, insurance-claim coordination, and where governed AI genuinely helps.',
  path: '/resources/roofing',
})

export default function RoofingPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Roofing', url: '/resources/roofing' },
  ])
  const article = articleSchema({
    headline: 'Running a Roofing Business: Estimates, Storm Leads, and Follow-Up',
    description: 'Operational gaps that cost roofing businesses money, and where governed AI helps.',
    path: '/resources/roofing',
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
          <span className="text-gray-900">Roofing</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Roofing</p>
        <h1 className="text-headline text-gray-900 mb-4">Running a Roofing Business: Estimates, Storm Leads, and Follow-Up</h1>
        <p className="text-sm text-gray-600 mb-10">
          A practical operations guide from the SubZero Metrix team. This covers business operations, not roofing
          materials or installation practice &mdash; for technical and code questions, defer to a licensed roofer.
        </p>

        <div className="prose-content">
          <p>
            Roofing has a lead-flow pattern most trades don&apos;t deal with: storm events create a sudden spike of
            inbound interest, all at once, all time-sensitive. The businesses that convert the most storm leads
            aren&apos;t necessarily the ones with the best crews &mdash; they&apos;re the ones who respond fastest and
            follow up most consistently while the homeowner is still comparing three or four contractors at once.
          </p>

          <h2>Storm-Lead Response Time</h2>
          <p>
            After a storm, homeowners are typically fielding calls and knocks from multiple roofers within days.
            The first contractor to actually show up and deliver a clear estimate usually has a real advantage &mdash;
            but that advantage evaporates fast if there&apos;s no organized follow-up after the first conversation.
          </p>

          <h2>Insurance-Claim Coordination</h2>
          <p>
            A large share of roofing jobs run through an insurance claim, which adds a second timeline the
            homeowner is tracking alongside your own. Estimates, adjuster meetings, and approval delays all create
            natural gaps where a job can quietly stall if nobody on your side is tracking where each claim actually
            stands.
          </p>

          <h2>Estimate Follow-Up</h2>
          <p>
            A roofing estimate is a major expense for most homeowners, and it&apos;s common for them to go quiet
            while they gather more quotes. Without a system flagging which estimates have gone cold, follow-up
            becomes whatever the sales team remembers to do between jobs &mdash; which means the estimates that need
            the most attention are often the ones that get none.
          </p>

          <h2>Reviews After a Long Project</h2>
          <p>
            Roofing jobs take longer than most service calls, and by the time a project wraps, the moment for
            asking for a review has often already passed in the homeowner&apos;s mind. Asking right at project
            close &mdash; not weeks later &mdash; consistently gets better response rates.
          </p>

          <h2>Where Metrix Command Center Helps</h2>
          <p>
            Metrix Command Center surfaces aging estimates, overdue follow-ups, and customers who&apos;ve gone
            quiet, with an AI team that recommends the next action grounded in your real data. Every recommendation
            requires your explicit approval before anything reaches a customer.
          </p>

          <h2>Where It Does Not Replace Professional Judgment</h2>
          <p>
            Metrix Command Center doesn&apos;t evaluate roof condition, materials, or code compliance, and it
            doesn&apos;t handle insurance-claim adjudication. It organizes the business side &mdash; follow-ups,
            estimates, and scheduling &mdash; so real opportunities don&apos;t get lost in the noise of a storm season.
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
