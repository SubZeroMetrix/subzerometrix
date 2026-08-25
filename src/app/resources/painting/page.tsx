import Link from 'next/link'
import { TrackedCta } from '@/components/TrackedCta'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Running a Painting Business: Estimate Follow-Up and Repeat Customers',
  description:
    'A practical look at the operational gaps that cost painting businesses money -- estimate follow-up, seasonal lead flow, and repeat-customer retention, and where governed AI genuinely helps.',
  path: '/resources/painting',
})

export default function PaintingPillarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Painting', url: '/resources/painting' },
  ])
  const article = articleSchema({
    headline: 'Running a Painting Business: Estimate Follow-Up and Repeat Customers',
    description: 'Operational gaps that cost painting businesses money, and where governed AI helps.',
    path: '/resources/painting',
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
          <span className="text-gray-900">Painting</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Painting</p>
        <h1 className="text-headline text-gray-900 mb-4">Running a Painting Business: Estimate Follow-Up and Repeat Customers</h1>
        <p className="text-sm text-gray-600 mb-10">
          A practical operations guide from the SubZero Metrix team. This covers business operations, not paint
          products or application technique.
        </p>

        <div className="prose-content">
          <p>
            Painting is a high-quote-volume, high-competition trade &mdash; most homeowners get three or more
            estimates before deciding. The businesses that win the most jobs aren&apos;t always the cheapest; they&apos;re
            often the ones who follow up while the homeowner is still comparing, instead of submitting a quote and
            waiting for a callback that may never come.
          </p>

          <h2>Estimate Follow-Up in a Crowded Field</h2>
          <p>
            A painting estimate competes directly with two or three others for the same job. Silence after
            submitting a quote is the single easiest way to lose work you were otherwise competitive for &mdash; not
            because your price was wrong, but because nobody reminded the homeowner you existed at decision time.
          </p>

          <h2>Seasonal Demand Swings</h2>
          <p>
            Exterior painting is heavily seasonal in most climates, which means lead volume spikes hard in warmer
            months. Without a system tracking which leads from the busy season actually got followed up, some of
            the year&apos;s highest-value jobs end up buried under the next batch of new inquiries.
          </p>

          <h2>Repeat and Referral Customers</h2>
          <p>
            A homeowner who had interior rooms painted well is a strong candidate for exterior work, cabinets, or a
            referral to a neighbor &mdash; but only if someone reaches back out at a reasonable interval instead of
            treating every job as a one-time transaction.
          </p>

          <h2>Reviews While the Result Is Fresh</h2>
          <p>
            A finished paint job looks its best the day it&apos;s done. Asking for a review at that moment,
            rather than weeks later, consistently captures a more enthusiastic and more detailed response.
          </p>

          <h2>Where Modern Trades CRM Fits</h2>
          <p>
            Modern Trades CRM surfaces aging estimates, flags past customers worth re-engaging for repeat or
            referral work, and prompts review requests at the right moment. It gives each of these a visible owner and a next action.
          </p>

          <h2>Where It Does Not Replace Professional Judgment</h2>
          <p>
            Modern Trades CRM doesn&apos;t recommend paint products, surface prep methods, or color choices. It
            organizes the business side &mdash; follow-ups, repeat outreach, and review timing &mdash; so competitive
            estimates don&apos;t lose to silence.
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
