import Link from 'next/link'
import { TrackedCta } from '@/components/TrackedCta'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Running a Plumbing Business: Emergency Work, Scheduling, and the Follow-Up Gap',
  description:
    'A practical look at the operational gaps that cost plumbing businesses money -- emergency vs. planned work, dispatch, callbacks, and where governed AI genuinely helps.',
  path: '/resources/plumbing',
})

export default function PlumbingPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Plumbing', url: '/resources/plumbing' },
  ])
  const article = articleSchema({
    headline: 'Running a Plumbing Business: Emergency Work, Scheduling, and the Follow-Up Gap',
    description: 'Operational gaps that cost plumbing businesses money, and where governed AI genuinely helps.',
    path: '/resources/plumbing',
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
          <span className="text-gray-900">Plumbing</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Plumbing</p>
        <h1 className="text-headline text-gray-900 mb-4">Running a Plumbing Business: Emergency Work, Scheduling, and the Follow-Up Gap</h1>
        <p className="text-sm text-gray-600 mb-10">
          A practical operations guide from the SubZero Metrix team. This covers business operations, not plumbing
          code or licensed trade practice -- for technical questions, defer to a licensed plumber.
        </p>

        <div className="prose-content">
          <p>
            Plumbing is unusual among the trades in how sharply it splits between emergency and planned work, and
            that split creates its own specific operational challenges. What follows is about the business
            discipline around that split, not the plumbing itself.
          </p>

          <h2>Emergency vs. Planned Work</h2>
          <p>
            Emergency calls understandably jump the queue, but every time they do, a planned job or a follow-up
            gets pushed -- and if nobody is tracking what got bumped, it&apos;s easy for planned work to quietly
            slip for days. The businesses that handle this well aren&apos;t the ones that avoid emergencies; they&apos;re
            the ones with visibility into what got displaced.
          </p>

          <h2>Estimate Follow-Up</h2>
          <p>
            A planned-work estimate given after an emergency call often gets forgotten in the rush to the next
            job. Recovering this revenue depends on the estimate being tracked somewhere durable, not carried in
            someone&apos;s memory.
          </p>

          <h2>Maintenance Agreements</h2>
          <p>
            Water heater, backflow, and drain-maintenance agreements are a real recurring-revenue opportunity that&apos;s
            easy to under-sell when a business is busy reacting to emergency calls instead of proactively offering
            them.
          </p>

          <h2>Dispatch and Scheduling</h2>
          <p>
            Real-time technician location and availability matter more in plumbing than most trades, precisely
            because emergency calls need the closest available tech, not just the next one in a queue. Dispatching
            from a shared calendar without real visibility routinely sends the wrong technician the wrong distance.
          </p>

          <h2>Callbacks</h2>
          <p>
            A callback (the customer calling again about the same issue) is one of the clearest signals something
            went wrong, and tracking callback rate by technician or issue type is one of the most useful quality
            signals a plumbing business can have -- if it&apos;s actually tracked, not just handled ad hoc.
          </p>

          <h2>Customer Communication</h2>
          <p>
            Plumbing emergencies are stressful for customers by nature. Clear communication about arrival windows
            and status updates does more for customer satisfaction than almost anything else, independent of how
            good the repair itself is.
          </p>

          <h2>Technician Capacity</h2>
          <p>
            Knowing real technician capacity in the moment -- not an assumed daily average -- is what determines
            whether a business can actually say yes to an emergency call without silently breaking a planned
            commitment elsewhere.
          </p>

          <h2>Field-to-Office Handoff</h2>
          <p>
            A technician who spots a second issue while fixing the first (an aging water heater next to a fixed
            leak, for example) needs that observation to become a tracked follow-up opportunity, not just a
            passing comment.
          </p>

          <h2>Approval-Gated AI Use</h2>
          <p>
            AI here should organize -- surfacing overdue follow-ups, aging estimates, and callback patterns -- with
            every recommendation requiring your explicit approval before it reaches a customer or changes a record.
            No autonomous mode.
          </p>

          <h2>Where Modern Trades CRM Fits</h2>
          <p>
            Modern Trades CRM organizes leads, estimates, jobs, and follow-ups in one place and flags what
            needs attention -- including estimates that got bumped by emergency work and never revisited.
          </p>

          <h2>Where Licensed Plumbing Judgment Remains Required</h2>
          <p>
            Modern Trades CRM does not diagnose plumbing issues, does not make code-compliance determinations,
            and does not replace a licensed plumber&apos;s assessment. It organizes the business side of the
            operation only.
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
          Related: <Link href="/resources/business-operations/dispatch-and-scheduling" className="text-brand-electric underline">Dispatch and Scheduling</Link>{' '}
          &middot; <Link href="/resources/business-operations" className="text-brand-electric underline">Business Operations</Link>{' '}
          &middot; <Link href="/resources/ai-for-contractors" className="text-brand-electric underline">AI for Contractors</Link>
        </p>
      </div>
    </div>
  )
}
