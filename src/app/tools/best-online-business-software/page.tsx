import Link from 'next/link'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { seedProducts } from '@/../../content/products'
import { AffiliateDisclosureInline } from '@/components/AffiliateDisclosureInline'
import { AnswerFirst } from '@/components/editorial/AnswerFirst'
import { TldrBlock } from '@/components/editorial/TldrBlock'
import { ComparisonTable } from '@/components/editorial/ComparisonTable'
import { AuthorCard } from '@/components/editorial/AuthorCard'
import { LastReviewed } from '@/components/editorial/LastReviewed'

export const metadata = buildMetadata({
  title: 'Best Online Business Software for Beginners (2026)',
  description: 'Compared: the best software tools for starting an online business. Honest recommendations based on use-case fit, pricing, and limitations.',
  path: '/tools/best-online-business-software',
})

export default function BestOnlineBusinessSoftwarePage() {
  const featured = ['systeme-io', 'mailerlite', 'shopify', 'kit', 'getresponse']
  const products = featured.map((slug) => seedProducts.find((p) => p.slug === slug)!).filter(Boolean)

  const crumbs = breadcrumbSchema([
    { name: 'Tools', url: '/tools' },
    { name: 'Best Online Business Software', url: '/tools/best-online-business-software' },
  ])

  return (
    <div className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />

      <div className="section-container max-w-3xl">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/tools" className="hover:text-brand-cyan">Tools</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">Best Online Business Software</span>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-4">
          Best Online Business Software for Beginners (2026)
        </h1>

        <LastReviewed date="June 19, 2026" reviewer="Richard Fritzke" reviewerUrl="/about/richard-fritzke" />
        <AffiliateDisclosureInline />

        <AnswerFirst
          answer="For most beginners starting an online business on a budget, Systeme.io is the strongest starting point. It combines funnels, email, courses, and selling in one free platform."
          context="If your primary need is email marketing specifically, MailerLite offers a more focused and equally beginner-friendly option. If you need a dedicated e-commerce store, Shopify is the industry standard."
          lastReviewed="June 19, 2026"
          reviewer="Richard Fritzke"
        />

        <TldrBlock
          points={[
            'Systeme.io is the best all-in-one free option for starting an online business from scratch.',
            'MailerLite is the best free email marketing platform for beginners building a list.',
            'Shopify is the best dedicated e-commerce platform for selling physical or digital products.',
            'Kit is best for creators who want paid newsletters and subscriber-first email.',
            'GetResponse is best when you need email marketing combined with webinars and funnels.',
          ]}
        />

        <div className="prose-content">
          <h2>How We Chose These Tools</h2>
          <p>
            Each tool on this list was evaluated based on use-case fit for
            beginners, pricing accessibility, setup complexity, and the honest
            balance of strengths versus limitations. We do not rank tools by
            affiliate commission rates.
          </p>
          <p>
            Product details are verified against vendor-published pricing pages
            and feature documentation. Strengths and limitations reflect editorial
            assessment, not vendor marketing language.
          </p>
        </div>

        <ComparisonTable
          products={products}
          features={[
            { key: 'category_display', label: 'Category' },
            { key: 'free_plan_or_trial', label: 'Free Plan' },
            { key: 'setup_complexity', label: 'Setup' },
            { key: 'pricing_note', label: 'Pricing' },
          ]}
        />

        {products.map((product) => (
          <div key={product.slug} className="mb-10">
            <h2 className="text-xl font-bold text-white mb-2">{product.name}</h2>
            <p className="text-sm text-gray-400 mb-4">{product.description}</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="card">
                <p className="text-xs text-green-400 font-semibold mb-1">Best For</p>
                <p className="text-sm text-gray-300">{product.best_for}</p>
              </div>
              <div className="card">
                <p className="text-xs text-amber-400 font-semibold mb-1">May Not Fit</p>
                <p className="text-sm text-gray-300">{product.poor_fit_for}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-300 mb-2">Strengths</p>
                <ul className="space-y-1">
                  {product.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-green-400 shrink-0">&#10003;</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-300 mb-2">Limitations</p>
                <ul className="space-y-1">
                  {product.limitations.map((l, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-amber-400 shrink-0">&bull;</span>{l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href={`/tools/${product.slug}`} className="text-sm text-brand-cyan hover:text-brand-cyan-light">
                Full review &rarr;
              </Link>
              <Link href={`/go/${product.slug}`} className="text-sm text-gray-400 hover:text-white" rel="sponsored nofollow">
                Visit {product.name} &rarr;
              </Link>
            </div>
          </div>
        ))}

        <AuthorCard
          name="Richard Fritzke"
          role="Founder & Editor-in-Chief, SubZero Metrix"
          bio="24+ years of operations and technical leadership. Evaluates tools based on real-world fit, not marketing claims."
          profileUrl="/about/richard-fritzke"
        />

        <div className="prose-content">
          <h2>Methodology</h2>
          <p>
            This guide is based on vendor-published feature and pricing
            information, verified as of the last-reviewed date above. Editorial
            assessments of strengths and limitations are our own analysis.
            We do not fabricate user reviews, test results, or usage statistics.
          </p>
          <p>
            <Link href="/editorial-methodology">Read our full editorial methodology</Link>
            {' | '}
            <Link href="/contact">Report a correction</Link>
          </p>
        </div>

        <AffiliateDisclosureInline />
      </div>
    </div>
  )
}
