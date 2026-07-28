import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Running an Appliance Repair Business: Callback Trust and Follow-Up',
  description:
    'A practical look at the operational gaps that cost appliance repair businesses money -- callback trust, parts-delay communication, estimate follow-up, and where governed AI genuinely helps.',
  path: '/resources/appliance-repair',
})

export default function ApplianceRepairPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Appliance Repair', url: '/resources/appliance-repair' },
  ])
  const article = articleSchema({
    headline: 'Running an Appliance Repair Business: Callback Trust and Follow-Up',
    description: 'Operational gaps that cost appliance repair businesses money, and where governed AI helps.',
    path: '/resources/appliance-repair',
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
          <span className="text-gray-900">Appliance Repair</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Appliance Repair</p>
        <h1 className="text-headline text-gray-900 mb-4">Running an Appliance Repair Business: Callback Trust and Follow-Up</h1>
        <p className="text-sm text-gray-600 mb-10">
          A practical operations guide from the SubZero Metrix team. This covers business operations, not
          appliance diagnostics or repair technique.
        </p>

        <div className="prose-content">
          <p>
            Appliance repair has a unique trust problem: parts delays are common and largely outside your control,
            but customers experience them as your company going silent. The businesses that keep customers longest
            aren&apos;t the ones who never hit a parts delay &mdash; they&apos;re the ones who communicate through it.
          </p>

          <h2>Parts-Delay Communication</h2>
          <p>
            A repair that&apos;s waiting on a backordered part can sit for days or weeks. Without a proactive update,
            the customer assumes they&apos;ve been forgotten and often calls a competitor for a replacement appliance
            before the part even arrives.
          </p>

          <h2>Callback and Warranty Tracking</h2>
          <p>
            A repair that fails shortly after service is the moment a customer decides whether they trust you again
            or not. A fast, well-tracked callback response protects the relationship; a callback that falls through
            the cracks usually ends it.
          </p>

          <h2>Diagnostic-to-Repair Estimate Follow-Up</h2>
          <p>
            Many jobs start with a diagnostic visit and a separate repair-or-replace decision. A customer who needs
            time to decide between an expensive repair and a new appliance is easy to lose if nobody follows up
            before they default to just buying new.
          </p>

          <h2>Recurring Maintenance for Commercial Accounts</h2>
          <p>
            Restaurants and other commercial accounts with refrigeration and cooking equipment are strong
            candidates for recurring maintenance contracts &mdash; but that opportunity has to be offered explicitly
            after a repair, not assumed to be obvious.
          </p>

          <h2>Where Metrix Command Center Helps</h2>
          <p>
            Metrix Command Center flags parts-delayed jobs that need a customer update, tracks diagnostic estimates
            awaiting a decision, and surfaces recurring-maintenance opportunities for commercial accounts, with an
            AI team that recommends the next action. Every recommendation requires your explicit approval before
            anything reaches a customer.
          </p>

          <h2>Where It Does Not Replace Professional Judgment</h2>
          <p>
            Metrix Command Center doesn&apos;t diagnose appliance faults or make repair-versus-replace
            recommendations. It organizes the business side &mdash; communication, follow-up, and recurring
            opportunities &mdash; so trust doesn&apos;t erode during a delay you don&apos;t control.
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
