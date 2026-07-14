import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'
import { MCC_PLANS, MCC_SIGNUP_URL } from '@/content/mcc-pricing'

export const metadata = buildMetadata({
  title: 'AI for Contractors: What’s Real, What’s Roadmap, and How to Stay in Control',
  description:
    'A practical, honest look at how AI actually helps a contractor or service business today -- and where "autonomous AI" claims should make you cautious.',
  path: '/resources/ai-for-contractors',
})

export default function AiForContractorsPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'AI for Contractors', url: '/resources/ai-for-contractors' },
  ])
  const article = articleSchema({
    headline: 'AI for Contractors: What’s Real, What’s Roadmap, and How to Stay in Control',
    description: 'A practical, honest look at how AI actually helps a contractor or service business today.',
    path: '/resources/ai-for-contractors',
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
          <span className="text-gray-900">AI for Contractors</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">AI for Contractors</p>
        <h1 className="text-headline text-gray-900 mb-10">AI for Contractors: What&apos;s Real, What&apos;s Roadmap, and How to Stay in Control</h1>

        <div className="prose-content">
          <p>
            &quot;AI for contractors&quot; means very different things depending on who&apos;s selling it. Some of
            it is genuinely useful today. Some of it is marketing ahead of what the software actually does. This
            page is an honest breakdown of both, using Metrix Command Center as the concrete example since it&apos;s
            what we build.
          </p>

          <h2>Practical AI Uses Today</h2>
          <p>Real, shipped uses of AI in a service-business context fall into a few categories:</p>
          <ul>
            <li><strong>Lead follow-up</strong> -- surfacing which leads and follow-ups are overdue, so nothing goes cold silently.</li>
            <li><strong>Missed-revenue detection</strong> -- flagging aging estimates and stalled jobs that represent real, recoverable revenue.</li>
            <li><strong>Customer communication drafting</strong> -- drafting a message for a human to review and send, not sending it unsupervised.</li>
            <li><strong>Operational summaries</strong> -- a morning brief and end-of-day summary grounded in what actually happened, not a generic template.</li>
          </ul>

          <h2>Approval-Gated Automation</h2>
          <p>
            The single most important distinction in this space: does the AI act, or does it recommend? In Metrix
            Command Center, every AI-drafted action -- a message, a record change, a recommendation -- requires
            your explicit approval before it reaches a customer or takes effect. There is no autonomous mode.
          </p>

          <h2>The Risks of Fake Autonomy</h2>
          <p>
            &quot;Autonomous AI&quot; that acts on its own without a human checkpoint sounds efficient until it
            sends the wrong message to a customer, or changes a record based on a misread. In a business where
            trust and reputation are everything, an AI system that can act unsupervised is a real liability, not
            just a convenience trade-off.
          </p>

          <h2>Privacy and Governance</h2>
          <p>
            Ask any AI vendor two direct questions: can it act without my approval, and is there a real audit log
            of what it did and why. If the answer to the first is yes and the second is vague, treat that as a
            real warning sign, not a minor detail.
          </p>

          <h2>How to Adopt AI Without Losing Control</h2>
          <p>
            Start with approval-gated tools, not autonomous ones. Look for a real, permanent audit trail. Confirm
            you can stop any automation instantly (a real kill switch, not a support ticket). These three checks
            filter out most of the overclaiming in this space quickly.
          </p>

          <h2>What Buster and Metrix Command Center Actually Do Today</h2>
          <p>
            Buster, the AI Chief of Staff inside Metrix Command Center, produces a morning brief and end-of-day
            summary grounded in your real account data, and recommends next actions on overdue follow-ups, aging
            estimates, and at-risk customers. Every recommendation requires your approval before anything happens.
            Command Center is {MCC_PLANS.command_center.priceDisplay}, Founder CRM is {MCC_PLANS.founder_crm.priceDisplay} (founder code
            required), both with a {MCC_PLANS.command_center.trialDays}-day free trial.
          </p>

          <h2>What Remains Roadmap or Future Capability</h2>
          <p>
            A unified Communications Center (SMS and social messaging alongside governed email) is in active
            development and not available today. Additional integrations beyond Google login and secure workspace
            access are planned, not shipped. Anywhere this changes, it will be disclosed here as a fact, not a
            promise -- see the homepage FAQ for the current, always-accurate status.
          </p>
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-12 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">See the approval gate in action</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#buster" className="btn-primary inline-block">Meet Buster</Link>
            <a href={MCC_SIGNUP_URL} className="btn-secondary inline-block">Start Free Trial</a>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Related: <Link href="/resources/hvac" className="text-brand-electric underline">HVAC</Link>{' '}
          &middot; <Link href="/resources/facility-management" className="text-brand-electric underline">Facility Management</Link>
        </p>
      </div>
    </div>
  )
}
