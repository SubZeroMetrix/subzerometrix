import Image from 'next/image'
import Link from 'next/link'
import { LeadCaptureForm } from '@/components/LeadCaptureForm'
import { AffiliateDisclosureInline } from '@/components/AffiliateDisclosureInline'
import { categories, useCases } from '@/../../content/products'
import { organizationSchema, websiteSchema } from '@/lib/seo'

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

      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-navy" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.08),transparent_70%)]" aria-hidden="true" />

        <div className="section-container relative z-10 text-center">
          <Image
            src="/brand/subzero-metrix-logo.png"
            alt="SubZero Metrix"
            width={120}
            height={120}
            className="mx-auto mb-8 rounded-xl"
            priority
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white max-w-3xl mx-auto leading-tight">
            Choose the Right Software Stack Before Wasting Money on the Wrong Tools.
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            SubZero Metrix compares software for websites, email, automation,
            ecommerce, newsletters, SEO, and online-business growth.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tool-finder" className="btn-primary text-lg px-8 py-4">
              Find My Best Tool
            </Link>
            <Link href="/compare" className="btn-secondary text-lg px-8 py-4">
              Compare Top Platforms
            </Link>
          </div>
        </div>
      </section>

      {/* Use-Case Entry Cards */}
      <section className="py-16 bg-brand-navy-light">
        <div className="section-container">
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            What Are You Working On?
          </h2>
          <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto">
            Pick your goal and we&apos;ll show you the tools that actually fit.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {useCases.map((uc) => (
              <Link
                key={uc.slug}
                href={`/tools?use-case=${uc.slug}`}
                className="card text-center hover:border-brand-electric/40 transition-colors group"
              >
                <span className="text-3xl mb-3 block" aria-hidden="true">{uc.icon}</span>
                <span className="text-sm font-medium text-gray-200 group-hover:text-brand-cyan transition-colors">
                  {uc.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="section-container">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Browse by Category
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/tools?category=${cat.slug}`}
                className="card hover:border-brand-electric/40 transition-colors group"
              >
                <h3 className="text-lg font-bold text-white group-hover:text-brand-cyan transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-400 mt-2">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Methodology */}
      <section className="py-16 bg-brand-navy-light">
        <div className="section-container max-w-3xl">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            How We Recommend Tools
          </h2>
          <div className="space-y-4 text-gray-300 text-sm">
            <p>
              Every recommendation on SubZero Metrix is based on hands-on evaluation,
              verified feature sets, published pricing, and real use-case fit. We
              consider strengths, limitations, pricing, complexity, and who each tool
              is actually built for.
            </p>
            <p>
              We do not rank tools based on commission rates. Affiliate relationships
              help fund this site, but they do not determine our editorial
              recommendations.
            </p>
            <p>
              Product details, pricing, and features are verified against vendor
              sources. Each listing includes a last-verified date so you know how
              current the information is.
            </p>
          </div>
          <div className="mt-6 text-center">
            <Link href="/editorial-policy" className="text-sm text-brand-cyan hover:text-brand-cyan-light underline">
              Read our full editorial policy &rarr;
            </Link>
          </div>
          <AffiliateDisclosureInline />
        </div>
      </section>

      {/* Tool Finder CTA */}
      <section className="py-16">
        <div className="section-container max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-gray-400 mb-8">
            Answer a few quick questions and get a personalized software
            recommendation based on your goals, budget, and experience level.
          </p>
          <Link href="/tool-finder" className="btn-primary text-lg px-8 py-4">
            Start the Tool Finder
          </Link>
        </div>
      </section>

      {/* Email Capture */}
      <section className="py-16 bg-brand-navy-light">
        <div className="section-container max-w-lg">
          <LeadCaptureForm source="homepage" />
        </div>
      </section>
    </>
  )
}
