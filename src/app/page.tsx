import Image from 'next/image'
import Link from 'next/link'
import { buildMetadata, organizationSchema, websiteSchema } from '@/lib/seo'
import { MccLeadCaptureForm } from '@/components/MccLeadCaptureForm'
import { BusterChat } from '@/components/buster/BusterChat'
import {
  MCC_PLANS,
  MCC_FOUNDER_PRICING_NOTICE,
  MCC_BILLING_TERMS,
  MCC_SIGNUP_URL,
  MCC_LOGIN_URL,
} from '@/content/mcc-pricing'

export const metadata = buildMetadata({
  title: 'Metrix Command Center | Contractor Lead and Estimate Follow-Up',
  description:
    'Metrix helps contractors find missed follow-ups, stalled estimates, and customer opportunities, then shows what deserves attention next while keeping important actions under owner approval.',
  path: '/',
})

const PROBLEMS = [
  { title: 'Leads wait too long', description: 'A new lead comes in, gets a first look, then sits — because nobody has visibility into how long it has actually been waiting.' },
  { title: 'Estimates never get followed up', description: 'A quote goes out, the customer goes quiet, and the estimate ages out of anyone’s attention without ever being formally lost.' },
  { title: 'Customers quietly disappear', description: 'A once-regular customer stops calling. Nobody notices until a competitor’s truck is in their driveway.' },
  { title: 'Reviews and referrals go unasked', description: 'A job goes well and nobody follows up to ask for the review or the referral while the experience is still fresh.' },
  { title: 'Opportunities live in five different places', description: 'Texts, a notebook, a shared inbox, someone’s memory, a spreadsheet nobody opens — nothing lives in one place long enough to be tracked.' },
  { title: 'Owners don’t know what deserves attention today', description: 'With everything scattered, the owner is left guessing what’s actually urgent instead of knowing.' },
]

const MECHANISM = [
  { step: '01', title: 'Metrix finds what is being missed.', desc: 'Overdue follow-ups, aging estimates, and customers who’ve gone quiet, surfaced automatically from your real data.' },
  { step: '02', title: 'It explains why it matters.', desc: 'Every item comes with the evidence behind it — not just a flag, but the reason it’s worth your attention.' },
  { step: '03', title: 'It recommends the next action.', desc: 'Buster drafts a specific next step grounded in what actually happened, not a generic suggestion.' },
  { step: '04', title: 'It prepares the work for owner approval.', desc: 'Nothing reaches a customer or changes a record until you say so.' },
]

const OUTCOME_AREAS = [
  {
    title: 'Lead Follow-Up',
    problem: 'New leads go days without a response and nobody notices until the lead is gone.',
    identifies: 'Leads waiting past a reasonable response window.',
    nextStep: 'Review the recommended follow-up and approve it, or handle it yourself.',
    approval: 'Approval required before any customer contact.',
  },
  {
    title: 'Estimate Recovery',
    problem: 'A quote goes out and, without a deliberate decision, quietly becomes a lost sale.',
    identifies: 'Estimates aging past your typical close window.',
    nextStep: 'Approve a recommended follow-up on the estimates worth chasing.',
    approval: 'Approval required before any customer contact.',
  },
  {
    title: 'Customer Reactivation',
    problem: 'A previously active customer stops calling and nobody flags the change.',
    identifies: 'Customers whose activity has gone quiet relative to their history.',
    nextStep: 'Decide whether a reactivation outreach makes sense, then approve it.',
    approval: 'Approval required before any customer contact.',
  },
  {
    title: 'Reviews and Referrals',
    problem: 'A completed job is a review/referral opportunity that expires the longer it sits unaddressed.',
    identifies: 'Recently completed jobs that haven’t been asked for a review or referral yet.',
    nextStep: 'Approve the recommended ask while the experience is still fresh.',
    approval: 'Approval required before any customer contact.',
  },
  {
    title: 'Daily Priorities',
    problem: 'Without one place to look, the owner is guessing what’s actually urgent today.',
    identifies: 'The items across your business that most need attention right now.',
    nextStep: 'Start the day with a real list, not a guess.',
    approval: 'No approval needed to view — approval still required for any resulting customer action.',
  },
  {
    title: 'Customer History',
    problem: 'Context about a customer is scattered across notes, memory, and old messages.',
    identifies: 'A single record per customer and property, built as the relationship happens.',
    nextStep: 'Reference real history instead of relying on memory.',
    approval: 'No approval needed to view.',
  },
  {
    title: 'Team Accountability',
    problem: 'Without visibility, it’s not fair to hold anyone accountable to numbers nobody can see.',
    identifies: 'What’s open, what’s overdue, and what’s been completed, visible in one place.',
    nextStep: 'Use real visibility to manage the team, not memory or guesswork.',
    approval: 'No approval needed to view.',
  },
  {
    title: 'Business Visibility',
    problem: 'Most owners can’t see the true state of their pipeline without asking someone.',
    identifies: 'A real, current picture of leads, estimates, jobs, and follow-ups.',
    nextStep: 'Check the state of the business without a status meeting.',
    approval: 'No approval needed to view.',
  },
]

const FAQS = [
  {
    q: 'What is Metrix Command Center?',
    a: 'Metrix helps contractors find the leads, estimates, follow-ups, reviews, and customer relationships that are slipping through the cracks, and shows you what deserves attention next. A supervised AI team drafts the recommended next step — every one of them waits for your approval before anything reaches a customer.',
  },
  {
    q: 'How long does setup take?',
    a: 'You can start entering your customers, properties, and jobs directly, or bring in your existing data. There is no lengthy implementation process — the trial starts working from the data you give it.',
  },
  {
    q: 'Does Metrix replace my current CRM or field-service software?',
    a: 'Metrix is a full CRM on its own — customers, properties, leads, estimates, jobs, and follow-ups are all managed in one governed pipeline. If you’re currently relying on spreadsheets, notes, or a patchwork of tools, Metrix is built to replace that. If you’re on established field-service software, talk to us about your specific workflow before switching.',
  },
  {
    q: 'What happens if a recommendation is wrong?',
    a: 'Every recommendation shows the evidence behind it so you can judge it before approving. Nothing executes automatically — if a recommendation doesn’t hold up, you simply don’t approve it, and nothing happens.',
  },
  {
    q: 'Will AI contact customers without approval?',
    a: 'No. This is a hard rule, not a setting. No AI-drafted message, record change, or recommendation reaches a customer or takes effect without your explicit approval first.',
  },
  {
    q: 'Does Metrix guarantee revenue?',
    a: 'No. Metrix surfaces opportunities that are being missed and helps you act on them faster — the outcome still depends on your business, your market, and your follow-through, the same as it always has.',
  },
  {
    q: 'Can AI assistance be paused?',
    a: 'Yes. Every automation is visible and controllable, and you can stop it instantly.',
  },
  {
    q: 'Is Metrix fully autonomous?',
    a: 'No. There is no autonomous mode. Metrix prepares the work; you approve what happens next.',
  },
  {
    q: 'What does the free trial include?',
    a: `Every plan includes a ${MCC_PLANS.command_center.trialDays}-day free trial with full access to that plan's features.`,
  },
  {
    q: 'How much does it cost?',
    a: `Command Center is ${MCC_PLANS.command_center.priceDisplay}. Founder CRM is ${MCC_PLANS.founder_crm.priceDisplay} and requires an approved founder code. ${MCC_BILLING_TERMS.interval}`,
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
    q: 'Who builds Metrix Command Center?',
    a: 'Metrix Command Center is built by SubZero Metrix LLC, a small, independent team led by Richard Fritzke, who spent 24+ years in HVAC/R, facilities, and mechanical operations leadership before building it.',
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
    description:
      'Metrix helps contractors find missed follow-ups, stalled estimates, and customer opportunities, then shows what deserves attention next while keeping important actions under owner approval.',
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
              <p className="text-label text-brand-cyan mb-4">Meet Buster, your AI Chief of Staff</p>
              <h1 className="text-display text-white mb-6">
                Hi, I&apos;m Buster.<br className="hidden sm:block" /> Let&apos;s stop losing good leads and estimates to silence.
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-10">
                Your business is already generating opportunities. I&apos;ll help you find the leads,
                estimates, follow-ups, reviews, and customer relationships slipping through the cracks —
                and tell you what deserves attention next. Ask me anything.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-4">
                <a href="#ask-buster" className="btn-primary text-lg px-10 py-4">
                  Ask Buster
                </a>
                <a href="#ask-buster" className="btn-outline-visible text-lg px-10 py-4">
                  Show Me How Metrix Can Help
                </a>
              </div>
              <p className="text-sm text-gray-400">
                Metrix prepares the work. You approve what happens next.
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

      {/* ─── ASK BUSTER (embedded chat, primary homepage entry point) ─── */}
      <section id="ask-buster" className="py-24 sm:py-32 bg-gray-50">
        <div className="section-container max-w-2xl">
          <div className="text-center mb-10">
            <p className="text-label text-brand-electric mb-3">Ask Buster</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Get a real answer, not a link dump</h2>
            <p className="text-lg text-gray-500">
              Buster only answers from real, published content and always shows its source. If it doesn&apos;t
              know something, it says so.
            </p>
          </div>
          <BusterChat
            introText="Hi, I'm Buster. I can help you understand what Metrix does, whether it fits your business, what a plan includes, or where to start. Every answer comes from real, published content — I'll tell you if I don't know something."
            suggestedPrompts={['What does Metrix actually do?', 'Can you help my business?', 'Compare plans', "I'm losing customers", 'Where should I start?']}
            heightClassName="h-[560px] max-h-[70vh]"
          />
        </div>
      </section>

      {/* ─── PROBLEM ─── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">The Real Cost</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Where the revenue actually goes missing</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              None of this is a training problem. It&apos;s a visibility problem.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="card-panel">
                <h3 className="text-base font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-10">
            <a href="#ask-buster" className="text-sm font-semibold text-brand-electric hover:underline">
              Recognize your business here? Ask Buster what to do about it &rarr;
            </a>
          </p>
        </div>
      </section>

      {/* ─── PRODUCT PROOF ─── */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">See It In Practice</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What a recommendation actually looks like</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              An illustrative example of the real product flow — every recommendation Metrix generates
              follows this same evidence-then-approval structure.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="card-panel border-2 border-brand-electric/20">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Illustrative example — not live customer data</p>
              <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-surface-border">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full inline-block mb-2">Estimate Aging</p>
                  <h3 className="text-lg font-bold text-gray-900">Follow up with J. Alvarez — kitchen remodel estimate</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                <strong>Why this matters:</strong> Estimate sent 11 days ago, no response since. Customer
                has a completed job history with you and a typical response window of 3–4 days on prior
                estimates — this one is well outside that pattern.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                <strong>Recommended action:</strong> Send a brief, friendly check-in referencing the
                original estimate.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <span className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold bg-brand-electric text-white">Approve &amp; Send</span>
                <span className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold border border-gray-300 text-gray-600">Edit First</span>
                <span className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold border border-gray-300 text-gray-600">Dismiss</span>
              </div>
              <p className="text-xs text-gray-500 mt-6">Nothing is sent until one of these is chosen by you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SIMPLE MECHANISM ─── */}
      <section id="how-it-works" className="dark-section py-24 sm:py-32">
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-cyan mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Four steps. No jargon.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {MECHANISM.map((item) => (
              <div key={item.step} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-center">
                <span className="text-4xl font-bold text-white/40 block mb-3">{item.step}</span>
                <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DAILY OWNER EXPERIENCE / MEET BUSTER ─── */}
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
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">Your Daily Starting Point</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Know What Needs Attention Before the Day Gets Away From You.</h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
                Every day, Buster reviews what actually happened in your business and tells you what
                needs attention first — grounded in your real data, not a guess.
              </p>
              <ul className="space-y-3 mb-8 text-left max-w-xl mx-auto lg:mx-0">
                <li className="flex gap-3 items-start">
                  <span className="text-brand-electric mt-0.5" aria-hidden="true">&#10003;</span>
                  <span className="text-gray-700"><strong>What needs attention</strong> — the leads, estimates, and customers worth acting on today.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-brand-electric mt-0.5" aria-hidden="true">&#10003;</span>
                  <span className="text-gray-700"><strong>What Buster recommends</strong> — a specific next step, with the evidence behind it.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-brand-electric mt-0.5" aria-hidden="true">&#10003;</span>
                  <span className="text-gray-700"><strong>What awaits your approval</strong> — nothing moves forward without you.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-brand-electric mt-0.5" aria-hidden="true">&#10003;</span>
                  <span className="text-gray-700"><strong>What was completed</strong> — a real accounting of what got done, and why each item was flagged.</span>
                </li>
              </ul>
              <a href={MCC_SIGNUP_URL} className="btn-primary text-lg px-10 py-4 inline-block">
                Find My Revenue Leaks
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── OUTCOME AREAS ─── */}
      <section id="features" className="py-24 sm:py-32 bg-gray-50">
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">What Metrix Covers</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Every place revenue quietly leaks</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OUTCOME_AREAS.map((o) => (
              <div key={o.title} className="card-panel">
                <h3 className="text-base font-bold text-gray-900 mb-2">{o.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{o.problem}</p>
                <p className="text-xs text-gray-600 leading-relaxed mb-1"><strong>Metrix identifies:</strong> {o.identifies}</p>
                <p className="text-xs text-gray-600 leading-relaxed mb-1"><strong>You:</strong> {o.nextStep}</p>
                <p className="text-xs font-semibold text-brand-electric mt-2">{o.approval}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-10">
            <a href="#ask-buster" className="text-sm font-semibold text-brand-electric hover:underline">
              Not sure which of these applies to you? Ask Buster &rarr;
            </a>
          </p>
        </div>
      </section>

      {/* ─── GOVERNANCE (SINGLE CONSOLIDATED SECTION) ─── */}
      <section id="trust" className="py-24 sm:py-32 bg-white">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">Trust &amp; Security</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Metrix prepares the work. You approve what happens next.</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              This is a hard rule built into the product, not a setting you have to turn on.
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
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="section-container max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">Why It&apos;s Different</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Software that tells you what deserves attention next</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="card-panel">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Traditional software</p>
              <p className="text-sm text-gray-600 leading-relaxed">Stores information. It’s on you to remember to check it, and to know what’s worth checking.</p>
            </div>
            <div className="card-panel border-2 border-brand-electric">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-2">Metrix</p>
              <p className="text-sm text-gray-900 leading-relaxed">Helps identify what deserves attention next, with the evidence behind it — and every recommendation waits for your approval.</p>
            </div>
            <div className="card-panel">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Generic AI tools</p>
              <p className="text-sm text-gray-600 leading-relaxed">Generate output. It’s on you to judge whether it’s grounded in anything real.</p>
            </div>
            <div className="card-panel border-2 border-brand-electric">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-2">Metrix</p>
              <p className="text-sm text-gray-900 leading-relaxed">Connects every recommendation to real business evidence and to your explicit approval before anything happens.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOUNDER AUTHORITY ─── */}
      <section className="py-16 sm:py-20 bg-white border-t border-surface-border">
        <div className="section-container max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">Built by an Operator</p>
          <p className="text-gray-600 leading-relaxed mb-3">
            Metrix is built by Richard Fritzke, who spent 24+ years in HVAC/R, facilities, and mechanical
            operations leadership — including field service supervision of 20+ technicians and current
            work as a Recommissioning &amp; Optimization Engineer on mission-critical government
            facilities — before building the product he wished his own businesses had.
          </p>
          <Link href="/about/richard-fritzke" className="text-sm font-semibold text-brand-electric hover:underline">
            Read the full background &rarr;
          </Link>
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

          <p className="text-center text-xs text-gray-600 max-w-xl mx-auto mb-6">{MCC_BILLING_TERMS.refunds}</p>
          <p className="text-center">
            <a href="#ask-buster" className="text-sm font-semibold text-brand-electric hover:underline">
              Not sure which plan fits? Ask Buster &rarr;
            </a>
          </p>
        </div>
      </section>

      {/* ─── ROADMAP ─── */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="section-container max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">What&apos;s Coming Next</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Roadmap</h2>
          <ul className="space-y-3 mb-6">
            <li className="flex gap-3 items-start">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full shrink-0 mt-0.5">In progress</span>
              <span className="text-gray-700 text-sm">A unified Communications Center — SMS and social messaging alongside governed email.</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-700 bg-gray-200 px-2 py-0.5 rounded-full shrink-0 mt-0.5">Planned</span>
              <span className="text-gray-700 text-sm">Additional integrations beyond Google login and secure workspace access.</span>
            </li>
          </ul>
          <Link href="/resources" className="text-sm font-semibold text-brand-electric hover:underline">
            Read our HVAC, electrical, plumbing &amp; facility management guides &rarr;
          </Link>
        </div>
      </section>

      {/* ─── LEAD CAPTURE ─── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="section-container max-w-xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">Not Ready to Start a Trial?</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Tell us how you handle follow-up today</h2>
            <p className="text-lg text-gray-500">
              Tell us how you currently handle leads and estimate follow-up, and we&apos;ll help you
              determine whether Metrix fits your workflow.
            </p>
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
            <p className="text-gray-500">
              Still have questions?{' '}
              <a href="#ask-buster" className="text-brand-electric font-semibold hover:underline">Ask Buster</a> — or browse the
              answers below.
            </p>
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
