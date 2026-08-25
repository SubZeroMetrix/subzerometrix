import Link from 'next/link'
import { TrackedCta } from '@/components/TrackedCta'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Dispatch and Scheduling for Service Businesses: What to Automate, What to Keep Manual',
  description:
    'A practical breakdown of dispatch and scheduling for plumbing, HVAC, electrical, and other field service businesses -- what genuinely benefits from automation and what still needs a human dispatcher.',
  path: '/resources/business-operations/dispatch-and-scheduling',
})

export default function DispatchAndSchedulingPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Business Operations', url: '/resources/business-operations' },
    { name: 'Dispatch and Scheduling', url: '/resources/business-operations/dispatch-and-scheduling' },
  ])
  const article = articleSchema({
    headline: 'Dispatch and Scheduling for Service Businesses: What to Automate, What to Keep Manual',
    description: 'What genuinely benefits from dispatch automation and what still needs a human dispatcher.',
    path: '/resources/business-operations/dispatch-and-scheduling',
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
          <Link href="/resources/business-operations" className="hover:text-brand-electric">Business Operations</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">Dispatch and Scheduling</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Business Operations</p>
        <h1 className="text-headline text-gray-900 mb-4">Dispatch and Scheduling for Service Businesses: What to Automate, What to Keep Manual</h1>
        <p className="text-sm text-gray-600 mb-10">
          A practical operations guide from the SubZero Metrix team, applicable across plumbing, HVAC, electrical,
          and other field service trades.
        </p>

        <div className="prose-content">
          <p>
            Dispatch is where a service business&apos;s plan meets reality &mdash; the schedule that looked fine on
            paper has to absorb a same-day emergency call, a job that ran long, and a technician stuck in traffic,
            all in the same afternoon. The question isn&apos;t whether to use software for this; it&apos;s which
            parts of the decision genuinely benefit from automation and which parts still need a person who knows
            the territory, the technicians, and the customer.
          </p>

          <h2>What Automation Handles Well</h2>
          <p>
            Matching technician availability and location to a new job request, flagging schedule conflicts before
            they happen, and sending automatic appointment confirmations and &ldquo;on our way&rdquo; notifications
            are all things software does reliably and consistently &mdash; better than a person doing it manually
            between calls.
          </p>

          <h2>What Still Needs a Human Dispatcher</h2>
          <p>
            Deciding which emergency call bumps which scheduled job, judging whether a specific technician is the
            right fit for a difficult customer or a complex job, and handling the conversation when a customer is
            upset about a delay &mdash; these require judgment and context that automation doesn&apos;t have. The
            goal isn&apos;t to remove the dispatcher; it&apos;s to remove the busywork so the dispatcher can spend
            their attention on the decisions that actually need a person.
          </p>

          <h2>The Real Cost of a Bad Handoff</h2>
          <p>
            A schedule that exists only in one dispatcher&apos;s head is a single point of failure &mdash; if
            they&apos;re out sick or slammed, the whole operation loses visibility into what&apos;s already
            committed. The businesses that scale past a one-person dispatch desk are the ones where the schedule
            lives somewhere everyone can see it, not just in someone&apos;s memory.
          </p>

          <h2>Communication Gaps Around Delays</h2>
          <p>
            Customers rarely get upset about a delay itself &mdash; they get upset about not being told. A brief,
            proactive &ldquo;running 20 minutes behind&rdquo; message, sent automatically the moment a schedule
            shifts, prevents most of the frustration that would otherwise turn into a complaint call or a bad
            review.
          </p>

          <h2>Where Modern Trades CRM Fits</h2>
          <p>
            Modern Trades CRM surfaces scheduling conflicts, tracks which jobs and follow-ups are overdue, and
            keeps a visible record of commitments that doesn&apos;t depend on one person&apos;s memory. It gives each of these a visible owner and a next action.
          </p>

          <h2>Where It Does Not Replace Professional Judgment</h2>
          <p>
            Modern Trades CRM doesn&apos;t make the judgment call on which job takes priority during a genuine
            emergency, and it doesn&apos;t replace a dispatcher&apos;s knowledge of their team and customers. It
            organizes the visibility so those judgment calls can actually be made with full information.
          </p>
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-12 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">See if this matches your business</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/resources/tools/estimate-follow-up-priority-calculator" className="btn-primary inline-block">
              Try the Estimate Priority Calculator
            </Link>
            <TrackedCta href="/modern-trades-crm" event="modern_trades_crm_click" source="trade-guide" className="btn-secondary inline-block">See Modern Trades CRM</TrackedCta>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Related: <Link href="/resources/plumbing" className="text-brand-electric underline">Plumbing</Link>{' '}
          &middot; <Link href="/resources/hvac" className="text-brand-electric underline">HVAC</Link>{' '}
          &middot; <Link href="/resources/electrical" className="text-brand-electric underline">Electrical</Link>{' '}
          &middot; <Link href="/resources/ai-for-contractors" className="text-brand-electric underline">AI for Contractors</Link>
        </p>
      </div>
    </div>
  )
}
