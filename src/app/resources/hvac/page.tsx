import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema, personSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Where HVAC Businesses Lose Revenue Without Noticing',
  description:
    'A practical look at the operational leaks that quietly cost HVAC/R businesses money -- missed follow-ups, scheduling gaps, and communication breakdowns -- from 24+ years running HVAC and facilities operations.',
  path: '/resources/hvac',
})

export default function HvacPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'HVAC', url: '/resources/hvac' },
  ])
  const article = articleSchema({
    headline: 'Where HVAC Businesses Lose Revenue Without Noticing',
    description: 'Operational leaks that quietly cost HVAC/R businesses money, and where governed AI genuinely helps.',
    path: '/resources/hvac',
    authorGrounded: true,
  })

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }} />

      <div className="section-container max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-electric">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link href="/resources" className="hover:text-brand-electric">Resources</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">HVAC</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">HVAC</p>
        <h1 className="text-headline text-gray-900 mb-4">Where HVAC Businesses Lose Revenue Without Noticing</h1>
        <p className="text-sm text-gray-600 mb-10">
          By Richard Fritzke -- 24+ years in HVAC/R, facilities, and mechanical operations leadership, including
          field service supervision of 20+ technicians and current work as a Recommissioning &amp; Optimization
          Engineer on mission-critical government facilities.
        </p>

        <div className="prose-content">
          <p>
            Most HVAC businesses don&apos;t lose money in one obvious place. They lose it in a dozen small gaps
            that never show up on a P&amp;L line item -- an estimate that never got a follow-up call, a
            maintenance agreement that was never offered, a technician who finished a job and never told the
            office what he saw. Having run field service operations and managed technician teams directly, these
            are the leaks I&apos;ve actually seen, not theoretical ones.
          </p>

          <h2>Missed Follow-Up</h2>
          <p>
            A customer calls, gets a quote, and hears nothing for two weeks. By the time someone remembers to
            follow up, the customer has already called a competitor. This is the single most common leak in a
            service business, and it&apos;s almost never a training problem -- it&apos;s a visibility problem.
            Nobody can act on a follow-up they don&apos;t know is overdue.
          </p>

          <h2>Service Scheduling</h2>
          <p>
            Scheduling gaps compound: a technician sits idle for an hour because two jobs were booked too close
            together, or a customer waits three extra days because nobody checked who was actually free nearby.
            None of this requires better technicians -- it requires better visibility into what&apos;s already
            committed.
          </p>

          <h2>Technician Coordination</h2>
          <p>
            Coordinating 20+ technicians taught me that the office almost never has the same picture the field
            has in real time. Jobs get double-booked, parts get ordered for the wrong site, and the dispatcher
            finds out about a delay only when the next customer calls asking where the tech is.
          </p>

          <h2>Estimates Waiting</h2>
          <p>
            An estimate that sits open for two weeks is functionally a lost sale, even though it&apos;s still
            technically &quot;open&quot; in the system. The businesses that recover this revenue are the ones that
            can actually see which estimates are aging, not the ones that assume someone is tracking it manually.
          </p>

          <h2>Maintenance Agreement Opportunities</h2>
          <p>
            Every completed job is a maintenance-agreement opportunity that most businesses simply don&apos;t
            capture, because nobody flags it at the moment the job closes. Recurring revenue from PM agreements is
            one of the most reliable revenue sources in this trade, and it&apos;s consistently under-sold.
          </p>

          <h2>Customer Communication</h2>
          <p>
            &quot;Running late&quot; texts, appointment confirmations, and post-job check-ins are small, but their
            absence is one of the fastest ways to lose a customer&apos;s trust. Customers don&apos;t expect
            perfection -- they expect to be told what&apos;s happening.
          </p>

          <h2>Reviews and Reputation</h2>
          <p>
            A satisfied customer rarely leaves a review unprompted. The businesses with strong online reputations
            are almost always asking at the right moment -- right after a job is completed well, while the
            experience is fresh -- not hoping it happens organically.
          </p>

          <h2>Field-to-Office Handoff</h2>
          <p>
            The handoff between a technician finishing a job and the office knowing what happened is where a lot
            of real information dies. A technician notices a failing part on an adjacent unit, mentions it
            verbally, and it never makes it into a record anyone acts on. This is a documentation and follow-through
            problem, not a technician-quality problem.
          </p>

          <h2>BAS/BMS and Facility-Operations Context</h2>
          <p>
            For HVAC businesses that also touch commercial or light-facility work, building automation and
            management systems (BAS/BMS) add another layer: data exists, but it&apos;s rarely connected to the
            service side of the business. Recommissioning work in particular depends on someone actually
            correlating what the controls are reporting with what&apos;s happening in the field -- work I do
            directly in my current role.
          </p>

          <h2>Where Metrix Command Center Helps</h2>
          <p>
            Metrix Command Center is built to surface exactly these gaps: overdue follow-ups, aging estimates, and
            stalled jobs, organized in one place, with an AI team that recommends the next action -- grounded in
            your real data, not a guess. Every recommendation requires your explicit approval before anything
            reaches a customer.
          </p>

          <h2>Where It Does Not Replace Professional Judgment</h2>
          <p>
            Metrix Command Center does not diagnose HVAC systems, does not replace a licensed technician&apos;s
            assessment, and does not make engineering decisions. It organizes the business side of the operation
            and flags what needs attention -- the technical judgment stays entirely with your team.
          </p>
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-12 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">See if this matches your business</h2>
          <p className="text-sm text-gray-500 mb-6">Try the calculator, or see how Metrix Command Center handles this.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/resources/tools/follow-up-revenue-calculator" className="btn-primary inline-block">
              Try the Follow-Up Revenue Calculator
            </Link>
            <Link href="/#pricing" className="btn-secondary inline-block">See Pricing</Link>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Related: <Link href="/resources/facility-management" className="text-brand-electric underline">Facility Management</Link>{' '}
          &middot; <Link href="/resources/ai-for-contractors" className="text-brand-electric underline">AI for Contractors</Link>
        </p>
      </div>
    </div>
  )
}
