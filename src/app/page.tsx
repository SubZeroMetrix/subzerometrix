import Link from 'next/link'
import { buildMetadata, organizationSchema, websiteSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'SubZero Metrix — Where Contractors Lose Revenue Without Noticing',
  description:
    'Practical, trade-specific guides and free calculators on the revenue leaks that quietly cost contractors money -- missed follow-ups, stalled estimates, and customers who go quiet. Written from 24+ years of real HVAC/R and facilities operations.',
  path: '/',
})

const LEAK_TYPES = [
  { title: 'Leads that wait too long', description: 'A new lead comes in, gets a first look, then sits — because nobody has visibility into how long it has actually been waiting.' },
  { title: 'Estimates that never get followed up', description: 'A quote goes out, the customer goes quiet, and the estimate ages out of anyone’s attention without ever being formally lost.' },
  { title: 'Customers who quietly disappear', description: 'A once-regular customer stops calling. Nobody notices until a competitor’s truck is in their driveway.' },
  { title: 'Reviews and referrals nobody asks for', description: 'A job goes well and nobody follows up to ask for the review or the referral while the experience is still fresh.' },
]

const FEATURED_TRADES = [
  { slug: 'hvac', name: 'HVAC' },
  { slug: 'plumbing', name: 'Plumbing' },
  { slug: 'electrical', name: 'Electrical' },
  { slug: 'roofing', name: 'Roofing' },
  { slug: 'general-contracting', name: 'General Contracting' },
  { slug: 'landscaping', name: 'Landscaping' },
]

export default function HomePage() {
  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }} />

      <div className="section-container max-w-4xl">
        <p className="text-label text-brand-electric mb-3">SubZero Metrix</p>
        <h1 className="text-headline text-gray-900 mb-6">Where Contractors Lose Revenue Without Noticing</h1>
        <p className="text-lg text-gray-500 max-w-2xl mb-14">
          Most service businesses don&apos;t lose money in one obvious place — they lose it in a dozen small gaps:
          a lead that waited too long, an estimate nobody followed up on, a customer who quietly stopped calling.
          These guides and calculators are written from 24+ years running HVAC/R and facilities operations, not
          generic AI filler.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">The four leaks that cost the most</h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {LEAK_TYPES.map((leak) => (
            <div key={leak.title} className="card-panel">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{leak.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{leak.description}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Free calculators</h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          <Link href="/resources/tools/follow-up-revenue-calculator" className="card-panel hover:border-brand-electric/30 transition-colors">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Follow-Up Revenue Calculator</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Estimate how much revenue is sitting in open estimates and overdue follow-ups right now.</p>
          </Link>
          <Link href="/resources/tools/estimate-follow-up-priority-calculator" className="card-panel hover:border-brand-electric/30 transition-colors">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Estimate Follow-Up Priority Calculator</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Score which open estimates need follow-up first based on age, response, urgency, and value.</p>
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Guides by trade</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {FEATURED_TRADES.map((t) => (
            <Link key={t.slug} href={`/resources/${t.slug}`} className="card-panel hover:border-brand-electric/30 transition-colors text-center">
              <span className="text-sm font-semibold text-gray-900">{t.name}</span>
            </Link>
          ))}
        </div>
        <p className="mb-16">
          <Link href="/resources" className="text-brand-electric font-semibold hover:underline">See all 18 trade and operations guides &rarr;</Link>
        </p>

        <div className="card-panel bg-gray-50 border-brand-electric/20 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Ready to fix the leak, not just find it?</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xl mx-auto">
            The Modern Trades Mentor works directly with St. Petersburg and Pinellas County contractors to close
            these gaps — follow-up systems, CRM setup, and operating discipline.
          </p>
          <a href="https://www.themoderntradesmentor.com" className="btn-primary inline-block">Talk to TMT</a>
        </div>
      </div>
    </div>
  )
}
