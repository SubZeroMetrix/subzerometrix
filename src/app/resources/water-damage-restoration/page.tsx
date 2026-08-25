import Link from 'next/link'
import { TrackedCta } from '@/components/TrackedCta'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Running a Water Damage Restoration Business: Speed, Insurance, and Follow-Up',
  description:
    'A practical look at the operational gaps that cost water damage and restoration businesses money -- emergency response speed, insurance-claim coordination, and where governed AI genuinely helps.',
  path: '/resources/water-damage-restoration',
})

export default function WaterDamageRestorationPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Water Damage Restoration', url: '/resources/water-damage-restoration' },
  ])
  const article = articleSchema({
    headline: 'Running a Water Damage Restoration Business: Speed, Insurance, and Follow-Up',
    description: 'Operational gaps that cost restoration businesses money, and where governed AI helps.',
    path: '/resources/water-damage-restoration',
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
          <span className="text-gray-900">Water Damage Restoration</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Water Damage Restoration</p>
        <h1 className="text-headline text-gray-900 mb-4">Running a Water Damage Restoration Business: Speed, Insurance, and Follow-Up</h1>
        <p className="text-sm text-gray-600 mb-10">
          A practical operations guide from the SubZero Metrix team. This covers business operations, not
          mitigation or remediation technique.
        </p>

        <div className="prose-content">
          <p>
            Restoration is one of the few trades where response time is the entire pitch &mdash; every hour of
            delay makes the damage worse and the job more expensive. Beyond the initial response, though, most
            restoration jobs run through an insurance claim with its own timeline, and that&apos;s where jobs quietly
            stall if nobody is tracking where each claim actually stands.
          </p>

          <h2>Emergency Response Speed</h2>
          <p>
            A flooded basement or burst pipe is a true emergency, and homeowners will call whoever answers first
            and can arrive fastest. Slow response doesn&apos;t just lose the job &mdash; it&apos;s the single biggest
            factor in whether you get the job at all.
          </p>

          <h2>Insurance-Claim Coordination</h2>
          <p>
            Restoration work depends heavily on insurance approval at multiple stages &mdash; initial mitigation,
            then the larger repair scope. A claim that&apos;s waiting on an adjuster or a document can sit for days,
            and if nobody on your side is tracking it, the job silently stalls while the customer assumes
            you&apos;ve moved on.
          </p>

          <h2>Multi-Stage Job Tracking</h2>
          <p>
            A single restoration job often has distinct phases &mdash; extraction, drying, repair &mdash; sometimes
            handled by different teams or even different companies. Without a single tracked record of where a job
            actually stands, phases can overlap, get missed, or leave the customer without a clear answer about
            what happens next.
          </p>

          <h2>Reviews After a Stressful Event</h2>
          <p>
            Customers dealing with water damage are usually stressed and relieved once it&apos;s resolved. Asking
            for a review right at project completion, while that relief is fresh, gets a meaningfully stronger
            response than asking after the memory of the stress has faded.
          </p>

          <h2>Where Modern Trades CRM Fits</h2>
          <p>
            Modern Trades CRM tracks multi-stage job status, flags insurance claims awaiting action, and
            prompts review requests at project close. It gives each of these a visible owner and a next action.
          </p>

          <h2>Where It Does Not Replace Professional Judgment</h2>
          <p>
            Modern Trades CRM doesn&apos;t assess water damage, mold risk, or structural drying progress, and it
            doesn&apos;t handle insurance-claim adjudication. It organizes the business side &mdash; job status,
            follow-up, and claim tracking &mdash; so nothing stalls silently during a multi-week job.
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
          Related: <Link href="/resources/roofing" className="text-brand-electric underline">Roofing</Link>{' '}
          &middot; <Link href="/resources/business-operations" className="text-brand-electric underline">Business Operations</Link>{' '}
          &middot; <Link href="/resources/ai-for-contractors" className="text-brand-electric underline">AI for Contractors</Link>
        </p>
      </div>
    </div>
  )
}
