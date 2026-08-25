import Link from 'next/link'
import { TrackedCta } from '@/components/TrackedCta'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Running an Electrical Contracting Business: Where Operations Break Down',
  description:
    'A practical look at the operational gaps that cost electrical contracting businesses money -- lead follow-up, estimates, scheduling, and where governed AI genuinely helps.',
  path: '/resources/electrical',
})

export default function ElectricalPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Electrical', url: '/resources/electrical' },
  ])
  const article = articleSchema({
    headline: 'Running an Electrical Contracting Business: Where Operations Break Down',
    description: 'Operational gaps that cost electrical contracting businesses money, and where governed AI helps.',
    path: '/resources/electrical',
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
          <span className="text-gray-900">Electrical</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Electrical</p>
        <h1 className="text-headline text-gray-900 mb-4">Running an Electrical Contracting Business: Where Operations Break Down</h1>
        <p className="text-sm text-gray-600 mb-10">
          A practical operations guide from the SubZero Metrix team. This covers business operations, not electrical
          code or licensed trade practice -- for technical and code questions, defer to a licensed electrician.
        </p>

        <div className="prose-content">
          <p>
            Electrical contracting businesses lose revenue the same way most service businesses do: quietly, in the
            gap between doing good work and running the business side well. None of what follows is about wiring or
            code -- it&apos;s about the operational discipline that determines whether good field work turns into a
            healthy business.
          </p>

          <h2>Lead Follow-Up</h2>
          <p>
            A lead that doesn&apos;t get a timely response goes to whichever electrician calls back first -- often
            not the best one, just the fastest. Visibility into which leads are waiting is the single highest-leverage
            fix here.
          </p>

          <h2>Estimate Management</h2>
          <p>
            Electrical estimates can vary widely in complexity, and it&apos;s easy for a detailed quote to sit
            finished but unsent, or sent but never followed up on. Tracking estimate age, not just estimate status,
            is what catches this before it becomes a lost job.
          </p>

          <h2>Scheduling</h2>
          <p>
            Electrical work often mixes planned installs with reactive service calls, which makes scheduling
            genuinely harder than a single-service-type trade. Clear visibility into technician availability
            prevents the double-booking and idle-time problems that come from scheduling from memory or a shared
            calendar nobody fully trusts.
          </p>

          <h2>Service Agreements</h2>
          <p>
            Recurring inspection or maintenance agreements (panel checks, commercial compliance inspections) are a
            real, under-captured recurring-revenue opportunity in this trade, and they&apos;re easy to forget to
            offer at the moment a job wraps up.
          </p>

          <h2>Technician Coordination</h2>
          <p>
            Coordinating multiple technicians or crews across job sites requires real-time visibility the office
            doesn&apos;t automatically have -- without it, parts get ordered for the wrong site and job status
            updates lag behind what&apos;s actually happening in the field.
          </p>

          <h2>Customer Communication</h2>
          <p>
            Electrical work can involve real safety concerns and disruption (power shutoffs, code violations found
            mid-job) that make clear, timely customer communication more important than in lower-stakes trades. A
            customer left in the dark about a delay or a discovered issue is a customer likely to be unhappy
            regardless of the work quality.
          </p>

          <h2>Field-to-Office Handoff</h2>
          <p>
            A technician who discovers a code issue or additional work needed on-site needs that information to
            reach the office reliably, not verbally and informally. Missed handoffs here directly cost billable
            follow-up work.
          </p>

          <h2>Approval-Gated AI Use</h2>
          <p>
            Where AI can genuinely help is organizing this operational information -- surfacing overdue follow-ups
            and aging estimates -- with every recommendation requiring your explicit approval before anything
            reaches a customer or changes a record. No autonomous mode.
          </p>

          <h2>Where Modern Trades CRM Fits</h2>
          <p>
            Modern Trades CRM organizes leads, estimates, jobs, and follow-ups in one place and flags what needs
            attention, so the business side of an electrical contracting operation gets the same discipline the
            field work does.
          </p>

          <h2>Where Licensed Electrical Judgment Remains Required</h2>
          <p>
            Modern Trades CRM does not evaluate electrical work, does not make code-compliance determinations,
            and does not replace a licensed electrician&apos;s assessment. It organizes the business side of the
            operation only -- every technical and safety decision remains with your licensed team.
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
          Related: <Link href="/resources/business-operations" className="text-brand-electric underline">Business Operations</Link>{' '}
          &middot; <Link href="/resources/ai-for-contractors" className="text-brand-electric underline">AI for Contractors</Link>
        </p>
      </div>
    </div>
  )
}
