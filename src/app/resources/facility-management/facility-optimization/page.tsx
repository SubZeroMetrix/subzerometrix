import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema, personSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Facility Optimization: What It Actually Means and Where Software Helps',
  description:
    'A practical breakdown of facility optimization -- energy, maintenance, space, and asset lifecycle -- and where software genuinely helps versus where it just adds another dashboard, from a working Recommissioning & Optimization Engineer.',
  path: '/resources/facility-management/facility-optimization',
})

export default function FacilityOptimizationPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Facility Management', url: '/resources/facility-management' },
    { name: 'Facility Optimization', url: '/resources/facility-management/facility-optimization' },
  ])
  const article = articleSchema({
    headline: 'Facility Optimization: What It Actually Means and Where Software Helps',
    description: 'A practical breakdown of facility optimization and where software genuinely helps.',
    path: '/resources/facility-management/facility-optimization',
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
          <Link href="/resources/facility-management" className="hover:text-brand-electric">Facility Management</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">Facility Optimization</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Facility Management</p>
        <h1 className="text-headline text-gray-900 mb-4">Facility Optimization: What It Actually Means and Where Software Helps</h1>
        <p className="text-sm text-gray-600 mb-10">
          By Richard Fritzke &mdash; 24+ years in HVAC/R, facilities, and mechanical operations leadership, currently
          working as a Recommissioning &amp; Optimization Engineer on mission-critical government facilities.
        </p>

        <div className="prose-content">
          <p>
            &ldquo;Facility optimization&rdquo; gets used as a catch-all term for almost anything &mdash; lower utility
            bills, fewer work orders, better space utilization, longer equipment life. In practice it breaks down
            into a handful of distinct problems, and conflating them is exactly why so many optimization
            initiatives stall out after the first dashboard gets built.
          </p>

          <h2>Energy Optimization</h2>
          <p>
            This is the one people mean by default: reducing consumption through better scheduling, setpoint
            discipline, and equipment that&apos;s actually running the way it was designed to. The gap is rarely a
            lack of data &mdash; most commercial buildings already have a BAS/BMS generating plenty of it. The gap is
            that nobody is consistently correlating what the controls are reporting with what&apos;s actually
            happening mechanically. That correlation work is what recommissioning actually is, and it&apos;s manual,
            ongoing work, not a one-time software install.
          </p>

          <h2>Maintenance Optimization</h2>
          <p>
            Preventive maintenance done on a fixed calendar catches some failures and wastes effort on equipment
            that didn&apos;t need attention yet. Condition-based maintenance is the better model in theory, but it
            requires someone actually watching the condition data and someone actually acting on what it shows &mdash;
            neither of which happens automatically just because a sensor exists.
          </p>

          <h2>Space and Asset Utilization</h2>
          <p>
            Underused space and underused equipment are optimization problems too, and they&apos;re the ones most
            commonly ignored because they don&apos;t show up on a utility bill. A facility team that&apos;s fully
            consumed reacting to work orders never gets to the planning-level question of whether the space or the
            asset mix still matches how the building is actually being used.
          </p>

          <h2>Where This Breaks Down in Practice</h2>
          <p>
            Every one of these depends on the same underlying thing: someone with the time and the visibility to
            actually look at the data and act on it. Most facility teams are staffed for reactive work order
            volume, not for proactive optimization &mdash; so the data accumulates, the dashboard exists, and nobody
            has the bandwidth to turn it into a decision. This is the actual bottleneck in the vast majority of
            facilities I&apos;ve worked in, not a lack of tools.
          </p>

          <h2>Where Software Genuinely Helps</h2>
          <p>
            Software helps when it surfaces the specific thing that needs a decision &mdash; an asset trending toward
            failure, a maintenance task that&apos;s overdue, a follow-up that never happened &mdash; instead of just
            adding another dashboard nobody has time to read. The value isn&apos;t in having more data; it&apos;s in
            having the right thing flagged at the right moment so a real person can make the call.
          </p>

          <h2>Where It Does Not Replace Professional Judgment</h2>
          <p>
            No software makes the engineering judgment calls that recommissioning and facility optimization
            actually require &mdash; correlating control-system behavior with real mechanical performance is
            professional work, not something a dashboard resolves on its own. What software can do is make sure the
            operational side (follow-ups, scheduling, tracked commitments) doesn&apos;t silently fall through the
            cracks while the technical work is happening.
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
          Related: <Link href="/resources/facility-management" className="text-brand-electric underline">Facility Management Overview</Link>{' '}
          &middot; <Link href="/resources/hvac" className="text-brand-electric underline">HVAC</Link>{' '}
          &middot; <Link href="/resources/ai-for-contractors" className="text-brand-electric underline">AI for Contractors</Link>
        </p>
      </div>
    </div>
  )
}
