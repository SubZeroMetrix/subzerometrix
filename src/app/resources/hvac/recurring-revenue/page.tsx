import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema, personSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Recurring Revenue for HVAC Contractors: Maintenance Agreements Done Right',
  description:
    'How HVAC contractors build predictable recurring revenue through maintenance agreements -- what to offer, when to ask, and why most businesses under-sell it, from 26 years in HVAC/R operations.',
  path: '/resources/hvac/recurring-revenue',
})

export default function HvacRecurringRevenuePage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'HVAC', url: '/resources/hvac' },
    { name: 'Recurring Revenue', url: '/resources/hvac/recurring-revenue' },
  ])
  const article = articleSchema({
    headline: 'Recurring Revenue for HVAC Contractors: Maintenance Agreements Done Right',
    description: 'How HVAC contractors build predictable recurring revenue through maintenance agreements.',
    path: '/resources/hvac/recurring-revenue',
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
          <Link href="/resources/hvac" className="hover:text-brand-electric">HVAC</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">Recurring Revenue</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">HVAC</p>
        <h1 className="text-headline text-gray-900 mb-4">Recurring Revenue for HVAC Contractors: Maintenance Agreements Done Right</h1>
        <p className="text-sm text-gray-600 mb-10">
          By Richard Fritzke &mdash; 26 years in HVAC/R, facilities, and mechanical operations leadership, including
          field service supervision of 20+ technicians and current work as a Recommissioning &amp; Optimization
          Engineer on mission-critical government facilities.
        </p>

        <div className="prose-content">
          <p>
            Recurring revenue is the most reliable money in an HVAC business, and it&apos;s also the most
            consistently under-sold. A preventive maintenance (PM) agreement isn&apos;t an upsell you pitch out of
            nowhere &mdash; it&apos;s a natural extension of a job you already did well. The businesses that build real
            recurring revenue are the ones that treat every completed install or repair as a maintenance-agreement
            opportunity by default, not as an afterthought someone might remember to bring up.
          </p>

          <h2>Why Recurring Revenue Matters More Than One-Off Jobs</h2>
          <p>
            A single repair job is revenue you have to go win again from scratch every time. A maintenance
            agreement converts a one-time customer into a predictable, renewing revenue stream &mdash; and it gives you
            first call on the next failure, the next replacement, and the next referral. In a trade where demand is
            seasonal and lead flow is inconsistent, PM agreements are the closest thing to a stable revenue floor.
          </p>

          <h2>What to Actually Offer</h2>
          <p>
            Keep it simple: seasonal tune-ups (typically spring for cooling, fall for heating), priority scheduling
            during peak-demand periods, and a modest discount on repairs for enrolled customers. Complexity kills
            adoption &mdash; a maintenance plan with too many tiers or fine print is harder to sell and harder for your
            office staff to track. The plans that renew year over year are the ones a customer can explain back to
            you in one sentence.
          </p>

          <h2>When to Ask</h2>
          <p>
            The best moment to offer a maintenance agreement is at the close of a job that went well &mdash; while the
            customer is standing in front of a working system and a technician who just solved their problem. Wait
            a week and that moment is gone. This is exactly the kind of moment that gets lost when there&apos;s no
            system flagging it: the technician moves to the next job, the office never hears about the opportunity,
            and the agreement never gets offered.
          </p>

          <h2>Why It Gets Under-Sold</h2>
          <p>
            In my experience running field service teams, the gap is almost never that technicians don&apos;t
            believe in maintenance agreements &mdash; it&apos;s that nothing in the workflow prompts the offer at the
            right moment, and nothing in the office tracks who was offered one and said no versus who was never
            asked at all. Without that visibility, PM agreement sales become dependent on whichever technician
            happens to remember, which means most jobs simply close without the conversation happening.
          </p>

          <h2>Tracking Renewals, Not Just Signups</h2>
          <p>
            A maintenance agreement that lapses without a renewal call is the same lost opportunity as never
            selling it in the first place &mdash; it just takes a year to notice. Renewal dates need the same visibility
            as new-agreement opportunities: a list of what&apos;s coming due, sorted by date, that someone actually
            looks at before the customer&apos;s coverage quietly expires.
          </p>

          <h2>Where Metrix Command Center Helps</h2>
          <p>
            Metrix Command Center flags completed jobs as maintenance-agreement opportunities automatically and
            surfaces upcoming renewals before they lapse, so the offer doesn&apos;t depend on one technician&apos;s
            memory. Every recommendation still requires your explicit approval before anything reaches a customer.
          </p>

          <h2>Where It Does Not Replace Professional Judgment</h2>
          <p>
            Metrix Command Center doesn&apos;t decide what should be included in your maintenance plans or price
            them for you &mdash; that&apos;s a business decision that depends on your market, your labor costs, and your
            equipment mix. It organizes the follow-through so the opportunities you&apos;ve already decided to
            pursue don&apos;t fall through the cracks.
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
          Related: <Link href="/resources/hvac" className="text-brand-electric underline">HVAC Overview</Link>{' '}
          &middot; <Link href="/resources/facility-management" className="text-brand-electric underline">Facility Management</Link>{' '}
          &middot; <Link href="/resources/business-operations" className="text-brand-electric underline">Business Operations</Link>
        </p>
      </div>
    </div>
  )
}
