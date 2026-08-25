import Link from 'next/link'
import { buildMetadata, organizationSchema, websiteSchema } from '@/lib/seo'
import { TrackedCta } from '@/components/TrackedCta'

export const metadata = buildMetadata({
  title: 'SubZero Contractor Revenue Intelligence',
  description:
    'Find where contractor revenue is leaking -- missed calls, stalled estimates, dormant customers, callback waste, and follow-up gaps -- and see the strongest verified opportunity first.',
  path: '/',
})

const LEAK_CATEGORIES = [
  { title: 'Missed inbound calls', description: 'A call that goes to voicemail during business hours is a lead most shops never recover.' },
  { title: 'Stalled estimates', description: 'A quote goes out, the customer goes quiet, and nobody formally follows up or marks it lost.' },
  { title: 'Dormant-customer reactivation', description: 'A once-regular customer stops calling and nobody notices until a competitor gets the job.' },
  { title: 'Callback and rework cost', description: 'A return visit tied to a job already completed eats labor, travel, and materials that were never priced in.' },
  { title: 'Follow-up gaps', description: 'Leads, quotes, and past customers living across texts, notebooks, and someone’s memory instead of one tracked place.' },
  { title: 'Owner-dependent processes', description: 'Revenue that only happens when the owner personally remembers to make it happen.' },
]

const METHODOLOGY_STEPS = [
  { step: '01', title: 'Contractor Business Profile', detail: 'Trade, service area, and the handful of facts that determine which leak categories are even relevant.' },
  { step: '02', title: 'Evidence Ledger', detail: 'Every signal is labeled verified, estimated, or unknown — nothing gets treated as fact without a source.' },
  { step: '03', title: 'Revenue Leak Signals', detail: 'Specific, checkable indicators inside each leak category, not a vague industry benchmark.' },
  { step: '04', title: 'Priority Selection', detail: 'The single most defensible opportunity, chosen from the evidence you actually have — not everything at once.' },
  { step: '05', title: 'Recommended Intervention', detail: 'One concrete first action tied to the priority signal.' },
]

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }} />

      {/* Hero */}
      <section className="dark-section">
        <div className="section-container py-24">
          <p className="text-label text-brand-cyan mb-4">SubZero Contractor Revenue Intelligence</p>
          <h1 className="text-headline text-white max-w-3xl mb-6">Find the revenue already hiding in your business.</h1>
          <p className="text-lg text-gray-300 max-w-2xl mb-10">
            Identify missed calls, stalled estimates, dormant customers, callback costs, and follow-up gaps. See the
            strongest verified opportunity first — without an opaque score.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/revenue-leak-check" className="btn-primary">Check for Revenue Leaks</Link>
            <Link href="/resources" className="btn-secondary">Explore the Revenue Leak Library</Link>
          </div>
        </div>
      </section>

      {/* Leak categories */}
      <section className="py-20">
        <div className="section-container">
          <p className="text-label text-brand-electric mb-3">Where it hides</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Six places contractor revenue actually leaks</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEAK_CATEGORIES.map((leak) => (
              <div key={leak.title} className="card-panel">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{leak.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{leak.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-20 bg-surface-light-muted">
        <div className="section-container">
          <p className="text-label text-brand-electric mb-3">How it works</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-10">The methodology behind the priority</h2>
          <div className="space-y-4">
            {METHODOLOGY_STEPS.map((m) => (
              <div key={m.step} className="flex gap-4 items-start card-panel">
                <span className="text-xs font-mono text-brand-electric shrink-0 pt-1">{m.step}</span>
                <div>
                  <h3 className="font-bold text-gray-900">{m.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{m.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-gray-500 max-w-2xl">
            This describes the methodology and framework SubZero Metrix uses to evaluate contractor revenue leaks.
            It is not a claim of a live autonomous AI system, cross-client learning model, or proprietary signal
            graph — those are research directions, not shipped functionality.
          </p>
        </div>
      </section>

      {/* Worked example */}
      <section className="py-20">
        <div className="section-container max-w-3xl">
          <p className="text-label text-brand-electric mb-3">Worked example</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What a result actually looks like</h2>
          <div className="card-panel">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-2">Primary signal (verified)</p>
            <p className="text-gray-900 font-medium mb-4">14 estimates sent in the last 60 days have no logged follow-up and no won/lost status.</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Why this was selected</p>
            <p className="text-sm text-gray-500 mb-4">It&apos;s the leak category with the most direct evidence in this example — a countable, dated fact, not an estimate.</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Recommended first action</p>
            <p className="text-sm text-gray-500">Pull the 14 estimates, contact each one this week, and log a won/lost outcome on every single one — even the losses.</p>
          </div>
          <p className="mt-4 text-xs text-gray-400">Illustrative example. Your actual result depends on your own answers in the Revenue Leak Check.</p>
        </div>
      </section>

      {/* Revenue Leak Check preview */}
      <section className="py-20 bg-surface-light-muted">
        <div className="section-container text-center">
          <p className="text-label text-brand-electric mb-3">Free, no email required</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Run the Revenue Leak Check</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-8">A few questions about your trade and how leads/estimates/customers move through your business. See your result immediately.</p>
          <Link href="/revenue-leak-check" className="btn-primary">Start the Revenue Leak Check</Link>
        </div>
      </section>

      {/* National / Local routing */}
      <section className="py-20">
        <div className="section-container grid gap-6 sm:grid-cols-2">
          <div className="card-panel">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-2">National</p>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Need the workflow in software, not just identified?</h3>
            <p className="text-sm text-gray-500 mb-4">Modern Trades CRM handles lead capture, follow-up, and pipeline tracking — sold nationally, independent of any consulting engagement.</p>
            <TrackedCta href="/modern-trades-crm" event="modern_trades_crm_click" source="homepage" className="btn-secondary">Explore Modern Trades CRM</TrackedCta>
            <p className="mt-3 text-xs text-gray-400">Modern Trades CRM is an affiliated product, sold independently of TMT consulting.</p>
          </div>
          <div className="card-panel">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-2">Local — Pinellas County &amp; Tampa Bay</p>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Want hands-on help fixing it?</h3>
            <p className="text-sm text-gray-500 mb-4">The Modern Trades Mentor works directly with St. Petersburg, Clearwater, Largo, and Pinellas County contractors on implementation.</p>
            <TrackedCta href="https://www.themoderntradesmentor.com" event="tmt_local_click" source="homepage" external className="btn-secondary">Talk to The Modern Trades Mentor</TrackedCta>
            <p className="mt-3 text-xs text-gray-400">TMT is a SubZeroMetrix affiliate, not an independent third party.</p>
          </div>
        </div>
      </section>

      {/* Ownership */}
      <section className="py-16 bg-surface-light-muted">
        <div className="section-container max-w-3xl text-center">
          <p className="text-sm text-gray-500">
            SubZeroMetrix.com is owned and published by SubZeroMetrix LLC. Modern Trades CRM and The Modern Trades
            Mentor are affiliated offerings — recommendations for them are not independent third-party endorsements.{' '}
            <Link href="/about" className="text-brand-electric underline underline-offset-2">Full ownership disclosure</Link>.
          </p>
        </div>
      </section>
    </>
  )
}
