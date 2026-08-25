import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'
import { TrackedCta } from '@/components/TrackedCta'

export const metadata = buildMetadata({
  title: 'Running a Service Business as an Operating System',
  description:
    'Lead response, pipeline discipline, follow-up, scheduling, and the daily operating rhythm that separates service businesses that grow from ones that stall.',
  path: '/resources/business-operations',
})

export default function BusinessOperationsPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Business Operations', url: '/resources/business-operations' },
  ])
  const article = articleSchema({
    headline: 'Running a Service Business as an Operating System',
    description: 'The daily operating rhythm and metrics that separate service businesses that grow from ones that stall.',
    path: '/resources/business-operations',
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
          <span className="text-gray-900">Business Operations</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Business Operations</p>
        <h1 className="text-headline text-gray-900 mb-4">Running a Service Business as an Operating System</h1>
        <p className="text-sm text-gray-600 mb-10">
          A practical operations guide from the SubZero Metrix team, applicable across HVAC, electrical, plumbing,
          and other field-service trades.
        </p>

        <div className="prose-content">
          <p>
            Every trade page on this site -- HVAC, facility management, electrical, plumbing -- points back to the
            same underlying operational discipline. This page is that discipline on its own, independent of trade.
          </p>

          <h2>Lead Response</h2>
          <p>
            Response time to a new lead is one of the highest-leverage numbers in a service business, and most
            businesses don&apos;t actually know theirs -- they estimate it, and the estimate is almost always
            optimistic.
          </p>

          <h2>Sales Pipeline</h2>
          <p>
            A pipeline that exists only in someone&apos;s head isn&apos;t a pipeline -- it&apos;s a memory test. A
            real pipeline means every open lead and estimate has a visible, current status that doesn&apos;t depend
            on asking someone.
          </p>

          <h2>Follow-Up Discipline</h2>
          <p>
            The gap between &quot;we called once&quot; and &quot;we followed up until we got an answer&quot; is
            where most service businesses leave revenue on the table. This is a process problem, solvable with
            visibility, not a sales-skill problem.
          </p>

          <h2>Scheduling</h2>
          <p>
            Scheduling that lives in one person&apos;s head doesn&apos;t scale past that person&apos;s working
            hours or memory. Real scheduling visibility is what lets a business grow past its founder being the
            single point of coordination.
          </p>

          <h2>Estimate Aging</h2>
          <p>
            An estimate&apos;s age is more predictive of whether it will close than almost any other single
            factor -- the longer it sits, the colder it gets. Tracking age, not just status, is the difference
            between managing a pipeline and just having one.
          </p>

          <h2>Customer Communication</h2>
          <p>
            Consistent, proactive communication -- confirmations, status updates, post-job check-ins -- is a
            retention lever most businesses underuse simply because nobody owns making sure it happens every time.
          </p>

          <h2>Team Accountability</h2>
          <p>
            Accountability requires visibility first. It&apos;s not reasonable to hold a team accountable to
            numbers nobody can actually see in real time.
          </p>

          <h2>Revenue Leakage</h2>
          <p>
            Revenue leakage is rarely one big problem -- it&apos;s the accumulation of missed follow-ups, aging
            estimates, and forgotten maintenance-agreement offers, each individually small, collectively
            significant.
          </p>

          <h2>Daily Operating Rhythm</h2>
          <p>
            A real daily rhythm -- a morning look at what needs attention, an end-of-day look at what actually got
            done -- keeps a business responsive instead of reactive. The specific tool matters less than the
            habit of actually doing it daily.
          </p>

          <h2>Metrics Owners Should Review</h2>
          <p>
            At minimum: lead response time, open pipeline value, overdue follow-up count, estimate age distribution,
            and job completion rate. All five are things a business owner should be able to see without asking
            anyone, at any moment.
          </p>

          <h2>Approval-Gated AI</h2>
          <p>
            AI&apos;s real role in this operating rhythm is surfacing what needs attention and drafting recommended
            next actions -- never acting unsupervised. Every recommendation requires explicit human approval before
            it reaches a customer or changes a record.
          </p>

          <h2>A Practical Operating-System Approach</h2>
          <p>
            Treat the business itself as a system with real inputs (leads, jobs, estimates) and a real daily
            feedback loop, not a collection of disconnected habits. That&apos;s the underlying idea behind every
            trade-specific guide on this site, and it&apos;s the design principle behind Modern Trades CRM
            itself.
          </p>
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-12 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Put this into practice</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/resources/tools/estimate-follow-up-priority-calculator" className="btn-primary inline-block">
              Try the Estimate Priority Calculator
            </Link>
            <TrackedCta href="/modern-trades-crm" event="modern_trades_crm_click" source="trade-guide" className="btn-secondary inline-block">
              See Modern Trades CRM
            </TrackedCta>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Related: <Link href="/resources/hvac" className="text-brand-electric underline">HVAC</Link>{' '}
          &middot; <Link href="/resources/electrical" className="text-brand-electric underline">Electrical</Link>{' '}
          &middot; <Link href="/resources/plumbing" className="text-brand-electric underline">Plumbing</Link>{' '}
          &middot; <Link href="/resources/ai-for-contractors" className="text-brand-electric underline">AI for Contractors</Link>
        </p>
      </div>
    </div>
  )
}
