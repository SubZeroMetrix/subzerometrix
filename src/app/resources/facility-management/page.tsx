import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema, personSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Facility Management: Reliability, Planning, and What AI Can and Can’t Do',
  description:
    'Preventive maintenance, asset lifecycle planning, and operational reliability for multi-site and mission-critical facilities -- from a Recommissioning & Optimization Engineer with 24+ years in the field.',
  path: '/resources/facility-management',
})

export default function FacilityManagementPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Facility Management', url: '/resources/facility-management' },
  ])
  const article = articleSchema({
    headline: 'Facility Management: Reliability, Planning, and What AI Can and Can’t Do',
    description: 'Preventive maintenance, asset lifecycle planning, and operational reliability for multi-site facilities.',
    path: '/resources/facility-management',
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
          <span className="text-gray-900">Facility Management</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Facility Management</p>
        <h1 className="text-headline text-gray-900 mb-4">Facility Management: Reliability, Planning, and What AI Can and Can&apos;t Do</h1>
        <p className="text-sm text-gray-600 mb-10">
          By Richard Fritzke -- Recommissioning &amp; Optimization Engineer, currently supporting mission-critical
          government facilities, with prior facilities-management roles overseeing maintenance operations across
          40+ commercial sites and 24+ years total in HVAC/R, facilities, and mechanical operations leadership.
        </p>

        <div className="prose-content">
          <p>
            Facility management is fundamentally a reliability discipline: keep the building systems running, know
            what&apos;s about to fail before it does, and make defensible capital decisions with limited budget.
            Everything below reflects how I&apos;ve actually run this work, from multi-site commercial portfolios
            to mission-critical federal facilities today.
          </p>

          <h2>Preventive Maintenance</h2>
          <p>
            A PM program is only as good as its follow-through. Building the schedule is the easy part; the hard
            part is knowing, in real time, which PM tasks are actually being completed versus which are quietly
            slipping. Most reliability failures I&apos;ve seen trace back to a PM task that was scheduled but never
            verified.
          </p>

          <h2>Asset Lifecycle Planning</h2>
          <p>
            Every major mechanical asset -- chillers, boilers, air handlers -- has a real, knowable lifecycle.
            Planning replacement before failure, rather than reacting to it, is the difference between a budgeted
            capital project and an emergency purchase order at the worst possible time.
          </p>

          <h2>Work-Ticket Analysis</h2>
          <p>
            Work tickets are a genuine data source most facilities teams under-use. Patterns in repeat tickets on
            the same asset are usually the earliest real signal of a developing failure -- long before it shows up
            as an emergency.
          </p>

          <h2>Recommissioning</h2>
          <p>
            Recommissioning -- verifying that building systems are actually operating as designed, not just as
            installed -- is where I spend a significant part of my current work. It routinely surfaces drift
            between how a system was designed to run and how it&apos;s actually running today, and that gap is
            almost always where efficiency and reliability are being lost.
          </p>

          <h2>Capital Planning</h2>
          <p>
            Capital improvement planning is a coordination problem as much as a budgeting one: engineering
            recommendations, real asset condition, and available capital rarely arrive on the same timeline.
            Defensible capital planning depends on having real asset-condition data ready when the budget
            conversation happens, not scrambling to justify a request after the fact.
          </p>

          <h2>Operational Reliability</h2>
          <p>
            Reliability is the sum of the above done consistently, not a single initiative. It&apos;s built from
            PM follow-through, honest asset lifecycle tracking, and a real feedback loop from work tickets back
            into planning.
          </p>

          <h2>Vendor Coordination</h2>
          <p>
            Coordinating vendors, service teams, and facility-improvement projects across multiple sites is
            genuinely difficult to do from memory. The teams that do it well have a real system tracking who
            owns what, not a shared inbox.
          </p>

          <h2>Mechanical-System Oversight</h2>
          <p>
            Mechanical system oversight across a portfolio means knowing the condition and priority of every major
            asset at every site simultaneously -- something that becomes genuinely hard to hold in one person&apos;s
            head past a handful of sites.
          </p>

          <h2>Multi-Site Facilities</h2>
          <p>
            Multi-site operations multiply every one of the challenges above. What works informally at one site
            breaks down at five, because informal tracking doesn&apos;t scale with headcount or geography.
          </p>

          <h2>Government &amp; Mission-Critical Environments</h2>
          <p>
            Mission-critical facility work -- my current focus, supporting operations at MacDill Air Force Base --
            raises the stakes on all of the above. There is less tolerance for reactive maintenance and a higher
            bar for documented, defensible operational decisions.
          </p>

          <h2>Where AI Can Help Organize and Prioritize</h2>
          <p>
            The genuinely useful role for AI here is organizing and prioritizing information a facilities team
            already has -- surfacing overdue items, aging patterns in work tickets, and follow-ups that are
            falling through -- so a human can make the actual engineering call faster and with better information.
          </p>

          <h2>Where Human Engineering Judgment Remains Required</h2>
          <p>
            AI does not make engineering decisions, does not certify equipment, and does not replace a qualified
            engineer&apos;s assessment of a system&apos;s condition. Any tool -- including Metrix Command Center --
            that claims otherwise should not be trusted with facility operations.
          </p>
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-12 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">See how this applies to your operation</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#trust" className="btn-primary inline-block">See the Governance Model</Link>
            <Link href="/#pricing" className="btn-secondary inline-block">See Pricing</Link>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Related: <Link href="/resources/hvac" className="text-brand-electric underline">HVAC</Link>{' '}
          &middot; <Link href="/resources/ai-for-contractors" className="text-brand-electric underline">AI for Contractors</Link>
        </p>
      </div>
    </div>
  )
}
