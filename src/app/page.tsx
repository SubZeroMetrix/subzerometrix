import Image from 'next/image'
import { buildMetadata, organizationSchema, websiteSchema } from '@/lib/seo'
import { MccLeadCaptureForm } from '@/components/MccLeadCaptureForm'
import {
  MCC_PLANS,
  MCC_FOUNDER_PRICING_NOTICE,
  MCC_BILLING_TERMS,
  MCC_SIGNUP_URL,
  MCC_LOGIN_URL,
} from '@/content/mcc-pricing'

export const metadata = buildMetadata({
  title: 'Metrix Command Center — Governed AI Business Operating System',
  description:
    'Metrix Command Center helps service businesses find missed revenue, organize customer operations, and know what to do next — with a governed AI team where every recommendation requires your approval. Starting at $39/month with a 7-day free trial.',
  path: '/',
})

const VALUE_SECTIONS = [
  {
    title: 'Revenue Recovery',
    description:
      'Surface the follow-ups, estimates, and jobs that are quietly falling through the cracks, before they turn into lost revenue.',
  },
  {
    title: 'Customer 360 CRM',
    description:
      'Customers and properties as first-class records. Leads, estimates, jobs, and follow-ups, organized in one place.',
  },
  {
    title: 'Follow-Ups & Communications',
    description: 'Governed email communications keep customers in the loop without anything going out unreviewed.',
  },
  {
    title: 'Estimates, Jobs & Reports',
    description: 'Track estimates through to jobs, with reporting that reflects what actually happened.',
  },
  {
    title: 'Approval-Gated AI',
    description:
      'Every AI-drafted recommendation is checked against safety rules and requires your explicit approval before it reaches a customer or takes action.',
  },
  {
    title: 'Audit Trails & Kill Switches',
    description: 'Every automation is visible, controllable, and logged. You can stop anything, instantly.',
  },
  {
    title: 'Secure Workspace Access',
    description: 'Google login and a secured, workspace-isolated account keep your business data yours alone.',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Connect or enter your business data',
    desc: 'Bring in your customers, properties, and jobs — or start entering them directly.',
  },
  {
    step: '02',
    title: 'MCC identifies opportunities and risks',
    desc: 'The platform surfaces what needs attention: stalled follow-ups, overdue estimates, at-risk customers.',
  },
  {
    step: '03',
    title: 'Buster recommends next actions',
    desc: 'Your AI Chief of Staff drafts a recommended next step, grounded in your real data.',
  },
  {
    step: '04',
    title: 'You review and approve',
    desc: 'Nothing reaches a customer or executes until you say so.',
  },
  {
    step: '05',
    title: 'Results are tracked',
    desc: 'Every decision and outcome is logged to a permanent, searchable audit trail.',
  },
]

const FAQS = [
  {
    q: 'What is Metrix Command Center?',
    a: 'A governed AI business operating system for service companies — it organizes your customers, jobs, and follow-ups, and uses a supervised AI team to help you find missed revenue and know what to do next.',
  },
  {
    q: 'What does the free trial include?',
    a: `Every plan includes a ${MCC_PLANS.command_center.trialDays}-day free trial with full access to that plan's features.`,
  },
  {
    q: 'How much does it cost?',
    a: `Command Center is ${MCC_PLANS.command_center.priceDisplay}. Founder CRM is ${MCC_PLANS.founder_crm.priceDisplay} and requires an approved founder code, with limited availability. ${MCC_BILLING_TERMS.interval}`,
  },
  {
    q: 'Can I cancel anytime?',
    a: `Yes. ${MCC_BILLING_TERMS.cancellation}`,
  },
  {
    q: 'What happens to my billing if I cancel mid-cycle?',
    a: MCC_BILLING_TERMS.refunds,
  },
  {
    q: 'What does "approval-gated AI" actually mean?',
    a: 'No AI in Metrix Command Center takes an action — sending a message, changing a record, making a recommendation live — without passing safety checks and getting your explicit approval first.',
  },
  {
    q: 'Is this a full CRM?',
    a: 'Yes — customers, properties, leads, estimates, jobs, and follow-ups are all managed in one governed pipeline.',
  },
  {
    q: 'What integrations are available?',
    a: 'Google login and secure workspace access are available today. Additional integrations are being added over time.',
  },
  {
    q: 'Is SMS or text messaging live?',
    a: 'Not yet. SMS and social messaging are in active development and not currently available. Today, communications are handled through governed email.',
  },
  {
    q: 'How is my data kept secure?',
    a: 'Your account is workspace-isolated with secure authentication. See our Privacy Policy for full detail on how your data is collected, used, and protected.',
  },
  {
    q: 'How is this different from other AI business tools?',
    a: 'Most "autonomous AI" tools act first and explain later, if at all. Metrix Command Center never does — every AI recommendation waits for your explicit approval, with a full permanent audit trail and an instant kill switch on every automation.',
  },
  {
    q: 'Who builds Metrix Command Center?',
    a: 'Metrix Command Center is built by SubZero Metrix LLC, a small, independent team.',
  },
  {
    q: 'How do I get support?',
    a: 'Email info@subzerometrix.com and we will get back to you.',
  },
]

export default function HomePage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Metrix Command Center',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: [
      { '@type': 'Offer', name: MCC_PLANS.command_center.name, price: '99', priceCurrency: 'USD' },
      { '@type': 'Offer', name: MCC_PLANS.founder_crm.name, price: '39', priceCurrency: 'USD' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ─── HERO ─── */}
      <section className="dark-section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-navy" aria-hidden="true" />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(37,99,235,0.08) 0%, transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="section-container relative z-10 pt-20 sm:pt-24 pb-16 sm:pb-20">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            <div className="text-center lg:text-left">
              <p className="text-label text-brand-cyan mb-4">Governed AI Business Operating System for Contractors</p>
              <h1 className="text-display text-white mb-6">
                Find missed revenue.<br className="hidden sm:block" /> Know what to do next.
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-10">
                Metrix Command Center organizes your customer operations and gives you a governed AI
                team that recommends next actions — nothing reaches a customer or your business until
                you approve it.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-4">
                <a href={MCC_SIGNUP_URL} className="btn-primary text-lg px-10 py-4">
                  Start Free Trial — {MCC_PLANS.command_center.priceDisplay}
                </a>
                <a href="#buster" className="btn-outline-visible text-lg px-10 py-4">
                  Meet Buster
                </a>
              </div>
              <p className="text-sm text-gray-400">
                {MCC_PLANS.command_center.trialDays}-day free trial &middot; monthly, cancel anytime &middot; no fake
                guarantees, just a real trial
              </p>
            </div>
            <div className="hidden lg:flex justify-center">
              <Image
                src="/brand/buster-ai-chief-of-staff-badge.png"
                alt="Buster, the Metrix Command Center AI Chief of Staff"
                width={360}
                height={360}
                className="w-full max-w-xs xl:max-w-sm h-auto drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── VALUE SECTIONS ─── */}
      <section id="features" className="py-24 sm:py-32 bg-white">
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">What&apos;s Included</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything you need, nothing you don&apos;t</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Real, shipped capability — not a roadmap slide.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_SECTIONS.map((v) => (
              <div key={v.title} className="card-panel">
                <h3 className="text-base font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MEET BUSTER ─── */}
      <section id="buster" className="py-24 sm:py-32 bg-white overflow-hidden">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <Image
                src="/brand/buster-ai-chief-of-staff-badge.png"
                alt="Buster, the Metrix Command Center AI Chief of Staff"
                width={420}
                height={420}
                className="w-full max-w-sm lg:max-w-md h-auto"
                priority
              />
            </div>
            <div className="text-center lg:text-left order-1 lg:order-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">Meet Your AI Chief of Staff</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Buster runs the morning brief, so you don&apos;t have to.</h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
                Every day, Buster reviews what actually happened in your business — new leads, stalled
                follow-ups, overdue estimates, at-risk customers — and tells you what needs attention
                first. Ask Buster a question and get an answer grounded in your real data, not a guess.
              </p>
              <ul className="space-y-3 mb-8 text-left max-w-xl mx-auto lg:mx-0">
                <li className="flex gap-3 items-start">
                  <span className="text-brand-electric mt-0.5" aria-hidden="true">&#10003;</span>
                  <span className="text-gray-700"><strong>Morning brief</strong> — what changed overnight and what to do about it.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-brand-electric mt-0.5" aria-hidden="true">&#10003;</span>
                  <span className="text-gray-700"><strong>End-of-day summary</strong> — a real accounting of what got done.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-brand-electric mt-0.5" aria-hidden="true">&#10003;</span>
                  <span className="text-gray-700"><strong>Live business health score</strong> — grounded in real records, not vibes.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-brand-electric mt-0.5" aria-hidden="true">&#10003;</span>
                  <span className="text-gray-700"><strong>Nothing happens without you</strong> — every recommendation waits for your approval before it reaches a customer.</span>
                </li>
              </ul>
              <a href={MCC_SIGNUP_URL} className="btn-primary text-lg px-10 py-4 inline-block">
                Meet Buster — Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="dark-section py-24 sm:py-32">
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-cyan mb-3">Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-center">
                <span className="text-4xl font-bold text-white/40 block mb-3">{item.step}</span>
                <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST & SECURITY ─── */}
      <section id="trust" className="py-24 sm:py-32 bg-gray-50">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">Trust &amp; Security</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Your business, your data, your call</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Governed AI is not a slogan here — it is how every account is built.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-panel">
              <h3 className="text-base font-bold text-gray-900 mb-2">Human approval, always</h3>
              <p className="text-sm text-gray-500 leading-relaxed">No AI action reaches a customer or changes a record without your explicit sign-off. There is no autonomous mode.</p>
            </div>
            <div className="card-panel">
              <h3 className="text-base font-bold text-gray-900 mb-2">Workspace isolation</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Your account and data are isolated to your workspace, secured with Google login.</p>
            </div>
            <div className="card-panel">
              <h3 className="text-base font-bold text-gray-900 mb-2">Full audit trail</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Every AI recommendation and every decision you make is logged permanently and is searchable.</p>
            </div>
            <div className="card-panel">
              <h3 className="text-base font-bold text-gray-900 mb-2">You own your data</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Your customer and business records are yours. See our Privacy Policy for exactly what we collect and why.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON ─── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="section-container max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">Why It&apos;s Different</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Not another AI tool that acts on its own</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th scope="col" className="text-left py-4 pr-4 font-semibold text-gray-600">&nbsp;</th>
                  <th scope="col" className="text-left py-4 px-4 font-bold text-brand-electric">Metrix Command Center</th>
                  <th scope="col" className="text-left py-4 px-4 font-semibold text-gray-600">Typical &quot;autonomous AI&quot; tools</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['AI actions', 'Every action requires your approval', 'Often acts automatically, after the fact'],
                  ['Audit trail', 'Full, permanent, searchable log', 'Inconsistent or absent'],
                  ['Data model', 'Customer/property-first CRM built in', 'Bolt-on AI over a generic tool'],
                  ['Kill switch', 'Stop any automation instantly', 'Rarely available'],
                  ['Pricing', 'Flat, transparent, monthly', 'Often usage-based and unpredictable'],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-gray-100">
                    <th scope="row" className="text-left py-4 pr-4 font-semibold text-gray-700">{row[0]}</th>
                    <td className="py-4 px-4 text-gray-900">{row[1]}</td>
                    <td className="py-4 px-4 text-gray-600">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 sm:py-32 bg-gray-50">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple, monthly pricing</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {MCC_PLANS.command_center.trialDays}-day free trial on every plan. {MCC_BILLING_TERMS.cancellation}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
            <div className="card-panel border-2 border-brand-electric">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-2">Recommended</p>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{MCC_PLANS.command_center.name}</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">{MCC_PLANS.command_center.priceDisplay}</p>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                {MCC_PLANS.command_center.featureSummary.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-brand-electric" aria-hidden="true">&#10003;</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href={MCC_SIGNUP_URL} className="btn-primary w-full text-center block">Start Free Trial</a>
            </div>

            <div className="card-panel">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Founder Code Required</p>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{MCC_PLANS.founder_crm.name}</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">{MCC_PLANS.founder_crm.priceDisplay}</p>
              <ul className="space-y-2 mb-4 text-sm text-gray-600">
                {MCC_PLANS.founder_crm.featureSummary.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-brand-electric" aria-hidden="true">&#10003;</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-600 mb-4">{MCC_FOUNDER_PRICING_NOTICE}</p>
              <a href={MCC_SIGNUP_URL} className="btn-secondary w-full text-center block">I Have a Founder Code</a>
            </div>
          </div>

          <p className="text-center text-xs text-gray-600 max-w-xl mx-auto">{MCC_BILLING_TERMS.refunds}</p>
        </div>
      </section>

      {/* ─── COMPANY & ROADMAP ─── */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="section-container grid lg:grid-cols-2 gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">Built by an Operator</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Why Metrix Command Center exists</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Metrix Command Center is built by SubZero Metrix LLC, a small, independent team. We built
              it because service businesses lose revenue quietly — a follow-up that never happens, an
              estimate that goes cold, a customer nobody checked on — and most software either buries
              that signal in noise or hands total control to an AI with no oversight. We wanted neither.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every part of this platform is built on one rule: the AI can recommend, but you decide.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">What&apos;s Coming Next</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Roadmap</h2>
            <ul className="space-y-3">
              <li className="flex gap-3 items-start">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full shrink-0 mt-0.5">In progress</span>
                <span className="text-gray-700 text-sm">A unified Communications Center — SMS and social messaging alongside governed email.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-700 bg-gray-200 px-2 py-0.5 rounded-full shrink-0 mt-0.5">Planned</span>
                <span className="text-gray-700 text-sm">Additional integrations beyond Google login and secure workspace access.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── LEAD CAPTURE ─── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="section-container max-w-xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">Want to See It in Action?</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Tell us about your business</h2>
            <p className="text-lg text-gray-500">We&apos;ll reach out to help you get started.</p>
          </div>
          <MccLeadCaptureForm source="landing_page" />
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24 sm:py-32 bg-gray-50">
        <div className="section-container max-w-3xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="card-panel group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-gray-900">
                  {f.q}
                  <span className="text-brand-electric shrink-0 group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CONVERSION ─── */}
      <section className="dark-section py-24 sm:py-32">
        <div className="section-container text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Ready to find your missed revenue?</h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10">
            {MCC_PLANS.command_center.trialDays}-day free trial. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={MCC_SIGNUP_URL} className="btn-primary text-lg px-10 py-4">Start Free Trial</a>
            <a href={MCC_LOGIN_URL} className="btn-outline-visible text-lg px-10 py-4">Log In</a>
          </div>
        </div>
      </section>
    </>
  )
}
