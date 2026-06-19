import Image from 'next/image'
import Link from 'next/link'
import { LeadCaptureForm } from '@/components/LeadCaptureForm'
import { AffiliateDisclosureInline } from '@/components/AffiliateDisclosureInline'
import { seedProducts, categories, useCases } from '@/../../content/products'
import { organizationSchema, websiteSchema } from '@/lib/seo'
import { StackBuilderDemo } from '@/components/home/StackBuilderDemo'
import { ActivityStream } from '@/components/home/ActivityStream'
import { MethodologyGrid } from '@/components/home/MethodologyGrid'
import { FounderSection } from '@/components/home/FounderSection'

const pathwayDetails: Record<string, { problem: string; answer: string }> = {
  'start-online-business': {
    problem: 'Too many tools, no clear starting point.',
    answer: 'Start with one all-in-one platform, add specialists as you grow.',
  },
  'build-website': {
    problem: 'Choosing between WordPress, builders, and all-in-ones.',
    answer: 'Match hosting and builder to your content type and budget.',
  },
  'grow-email-list': {
    problem: 'Free plans are limited, paid plans overlap.',
    answer: 'Start free with MailerLite or Kit, upgrade when you hit the ceiling.',
  },
  'launch-newsletter': {
    problem: 'Newsletter platforms are multiplying faster than you can evaluate them.',
    answer: 'Choose by monetization model: ads, paid subscriptions, or sponsorships.',
  },
  'sell-online': {
    problem: 'Shopify is the default, but is it always the right choice?',
    answer: 'If you sell digital products only, an all-in-one may be cheaper and simpler.',
  },
  'automate-marketing': {
    problem: 'Automation tools range from simple to overwhelming.',
    answer: 'Match automation depth to your actual workflow complexity, not aspirational complexity.',
  },
  'improve-seo': {
    problem: 'Premium SEO tools are expensive and complex.',
    answer: 'Defer SEO tooling until you have content. Start with free audits.',
  },
  'run-b2b-outreach': {
    problem: 'Cold email deliverability is hard and getting harder.',
    answer: 'Invest in warmup and domain reputation before scaling volume.',
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
      />

      {/* ─── HERO ─── */}
      <section className="dark-section relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.15),transparent)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_80%,rgba(34,211,238,0.08),transparent)]" aria-hidden="true" />

        <div className="section-container relative z-10 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div>
              <Image
                src="/brand/subzero-metrix-logo.png"
                alt="SubZero Metrix"
                width={100}
                height={100}
                className="rounded-xl mb-10"
                priority
              />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                Build Your<br />Business Stack.
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-xl mb-10">
                Tell us what you are building. SubZero Metrix compares software for
                websites, email, automation, ecommerce, newsletters, SEO, and
                growth&mdash;then helps you choose the stack that fits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link href="/tool-finder" className="btn-primary text-lg px-8 py-4">
                  Build My Stack
                </Link>
                <Link href="/compare" className="btn-secondary text-lg px-8 py-4">
                  Compare Top Tools
                </Link>
              </div>
              <p className="text-xs text-gray-500">
                Some links on this site are affiliate links.{' '}
                <Link href="/affiliate-disclosure" className="text-gray-400 underline hover:text-gray-300">
                  How we earn revenue
                </Link>
              </p>
            </div>

            {/* Hero Preview Panel */}
            <div className="hidden lg:block motion-safe:animate-fade-up" aria-hidden="true">
              <div className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  <span className="text-xs text-gray-500 ml-3">Stack Builder</span>
                </div>
                <div className="space-y-3">
                  {[
                    { cat: 'Website', tool: 'Systeme.io', status: 'Matched' },
                    { cat: 'Email', tool: 'MailerLite', status: 'Matched' },
                    { cat: 'Automation', tool: 'Included', status: 'Bundled' },
                    { cat: 'Ecommerce', tool: '—', status: 'Not needed' },
                    { cat: 'SEO', tool: '—', status: 'Deferred' },
                  ].map((row) => (
                    <div key={row.cat} className="flex items-center justify-between py-2.5 px-4 rounded-lg bg-white/[0.03] border border-white/5">
                      <span className="text-sm text-gray-400">{row.cat}</span>
                      <span className="text-sm text-gray-200 font-medium">{row.tool}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full ${
                        row.status === 'Matched' ? 'bg-emerald-500/20 text-emerald-300' :
                        row.status === 'Bundled' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 text-center mt-4 italic">Demonstration preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STACK BUILDER WORKSPACE ─── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">Interactive Preview</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your Stack, Built in Minutes
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              See how SubZero Metrix assembles a recommended software stack based on
              your goals, stage, and budget.
            </p>
          </div>
          <StackBuilderDemo />
        </div>
      </section>

      {/* ─── ACTIVITY STREAM ─── */}
      <section className="dark-section py-24 sm:py-32">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-cyan mb-3">Intelligence Feed</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Always Analyzing. Always Current.
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              SubZero Metrix continuously evaluates software changes, pricing
              updates, and feature shifts.
            </p>
          </div>
          <ActivityStream />
        </div>
      </section>

      {/* ─── TOOL ECOSYSTEM ─── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">Ecosystem</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The Software Ecosystem
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {seedProducts.length} tools evaluated across {categories.length} categories. Each reviewed for fit, strengths, limitations, and pricing.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <Link href="/tools" className="text-sm px-4 py-2 rounded-full bg-brand-electric text-white font-medium">
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/tools?category=${cat.slug}`}
                className="text-sm px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-brand-electric hover:text-brand-electric transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {seedProducts.slice(0, 6).map((product) => (
              <Link
                key={product.slug}
                href={`/tools/${product.slug}`}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-brand-electric/20 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-electric transition-colors">
                    {product.name}
                  </h3>
                  {product.free_plan_or_trial && (
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium">
                      Free plan
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400 capitalize">{product.category.replace(/-/g, ' ')}</span>
                  <span className="text-sm text-brand-electric font-medium">
                    Learn more &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/tools" className="text-sm font-semibold text-brand-electric hover:text-blue-700 transition-colors">
              View all {seedProducts.length} tools &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BUSINESS-GOAL PATHWAYS ─── */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">Solutions</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Start With Your Goal
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Every recommendation begins with what you are trying to accomplish.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {useCases.map((uc) => {
              const details = pathwayDetails[uc.slug]
              return (
                <Link
                  key={uc.slug}
                  href={`/tools?use-case=${uc.slug}`}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 hover:shadow-lg hover:border-brand-electric/20 transition-all duration-200 group"
                >
                  <span className="text-3xl mb-4 block">{uc.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-electric transition-colors mb-2">
                    {uc.name}
                  </h3>
                  {details && (
                    <>
                      <p className="text-sm text-gray-500 mb-2">{details.problem}</p>
                      <p className="text-sm text-gray-700 font-medium">{details.answer}</p>
                    </>
                  )}
                  <span className="inline-block mt-4 text-sm text-brand-electric font-medium group-hover:translate-x-0.5 transition-transform">
                    Explore &rarr;
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="dark-section py-24 sm:py-32">
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-cyan mb-3">Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How SubZero Metrix Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Tell us what you\'re building',
                desc: 'Share your business goal, stage, budget, and technical comfort. No account needed.',
                icon: (
                  <svg className="w-8 h-8 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'We compare the software',
                desc: 'Every tool is evaluated on User Fit, Budget alignment, Feature Requirements, Product Limitations, Editorial Confidence, and Verification Freshness.',
                icon: (
                  <svg className="w-8 h-8 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Receive your recommended stack',
                desc: 'Get a primary and secondary recommendation with clear reasoning, limitations, pricing, and honest fit assessment.',
                icon: (
                  <svg className="w-8 h-8 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-center">
                <div className="mb-4 flex justify-center">{item.icon}</div>
                <span className="text-5xl font-bold text-white/10 block mb-3">{item.step}</span>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── METHODOLOGY ─── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">Methodology</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Transparent Evaluation
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Every recommendation is built on four evaluation signals.
            </p>
          </div>
          <MethodologyGrid />
        </div>
      </section>

      {/* ─── FOUNDER ─── */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-3">Editorial Authority</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built by an Operator
            </h2>
          </div>
          <FounderSection />
        </div>
      </section>

      {/* ─── LEAD CAPTURE ─── */}
      <section className="dark-section py-24 sm:py-32">
        <div className="section-container max-w-xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-cyan mb-3">Free Resource</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              The Online Business Software Buying Guide
            </h2>
            <p className="text-lg text-gray-400">
              What to Buy Now, Later, or Never
            </p>
          </div>
          <LeadCaptureForm source="homepage" />
        </div>
      </section>

      {/* ─── FINAL CONVERSION ─── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="section-container text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready to Build Your Stack?
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
            Stop paying for tools you don&apos;t need. Start with software that fits.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tool-finder" className="btn-primary text-lg px-10 py-4">
              Build My Stack
            </Link>
            <Link href="/compare" className="btn-secondary text-lg px-10 py-4">
              Compare Top Tools
            </Link>
          </div>
          <AffiliateDisclosureInline />
        </div>
      </section>
    </>
  )
}
