import Link from 'next/link'
import { TrackedCta } from '@/components/TrackedCta'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Running a Cleaning Business: Recurring Schedules and Client Retention',
  description:
    'A practical look at the operational gaps that cost residential and commercial cleaning businesses money -- recurring schedule reliability, client retention, and where governed AI genuinely helps.',
  path: '/resources/cleaning-services',
})

export default function CleaningServicesPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Cleaning Services', url: '/resources/cleaning-services' },
  ])
  const article = articleSchema({
    headline: 'Running a Cleaning Business: Recurring Schedules and Client Retention',
    description: 'Operational gaps that cost cleaning businesses money, and where governed AI helps.',
    path: '/resources/cleaning-services',
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
          <span className="text-gray-900">Cleaning Services</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Cleaning Services</p>
        <h1 className="text-headline text-gray-900 mb-4">Running a Cleaning Business: Recurring Schedules and Client Retention</h1>
        <p className="text-sm text-gray-600 mb-10">
          A practical operations guide from the SubZero Metrix team, covering both residential and commercial
          cleaning operations.
        </p>

        <div className="prose-content">
          <p>
            Cleaning businesses live or die on recurring schedule reliability &mdash; weekly, biweekly, or monthly
            visits that clients expect to happen like clockwork. The businesses that retain clients longest aren&apos;t
            necessarily the ones with the best cleaners; they&apos;re the ones where a missed or rescheduled visit
            gets communicated proactively instead of discovered by the client.
          </p>

          <h2>Recurring Schedule Reliability</h2>
          <p>
            A skipped or late recurring visit, with no notice, is one of the fastest ways to lose a client &mdash;
            even if the cleaning quality itself was never in question. Clients judge reliability as much as they
            judge the cleaning.
          </p>

          <h2>Client Churn Without Warning</h2>
          <p>
            Clients rarely announce they&apos;re unhappy before cancelling &mdash; they just stop renewing. Without
            visibility into which clients have gone quiet, skipped a visit, or given lukewarm feedback, churn looks
            sudden even though the warning signs were usually there weeks earlier.
          </p>

          <h2>New-Lead Follow-Up</h2>
          <p>
            A quote request for a one-time deep clean or move-out clean is also a recurring-service opportunity.
            Converting that first job into an ongoing schedule requires a follow-up conversation that&apos;s easy to
            skip when the team is focused on the day&apos;s cleaning jobs rather than the office side of the
            business.
          </p>

          <h2>Referrals and Reviews</h2>
          <p>
            Cleaning is a trust-based service delivered inside someone&apos;s home or business, which makes referrals
            unusually powerful &mdash; but only if you actually ask satisfied, long-term clients rather than assuming
            they&apos;ll refer you on their own.
          </p>

          <h2>Where Modern Trades CRM Fits</h2>
          <p>
            Modern Trades CRM flags clients who&apos;ve gone quiet or skipped a scheduled visit, tracks new leads
            that haven&apos;t converted to a recurring schedule, and prompts referral and review requests at the
            right moment. It gives each of these a visible owner and a next action.
          </p>

          <h2>Where It Does Not Replace Professional Judgment</h2>
          <p>
            Modern Trades CRM doesn&apos;t manage cleaning checklists or staffing logistics for a given visit. It
            organizes the business side &mdash; retention, follow-up, and referrals &mdash; so recurring revenue
            doesn&apos;t erode quietly.
          </p>
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-12 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">See if this matches your business</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/resources/tools/follow-up-revenue-calculator" className="btn-primary inline-block">
              Try the Follow-Up Revenue Calculator
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
