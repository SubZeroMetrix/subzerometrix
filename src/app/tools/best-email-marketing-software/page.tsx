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
  title: 'Best Email Marketing Software for Beginners (2026)',
  description: 'Compared: MailerLite, Kit, GetResponse, ActiveCampaign, and beehiiv. Honest recommendations based on use-case fit, pricing, and limitations.',
  path: '/tools/best-email-marketing-software',
})

export default function BestEmailMarketingSoftwarePage() {
  const slugs = ['mailerlite', 'kit', 'getresponse', 'activecampaign', 'beehiiv']
  const products = slugs.map((slug) => seedProducts.find((p) => p.slug === slug)!).filter(Boolean)

  const crumbs = breadcrumbSchema([
    { name: 'Tools', url: '/tools' },
    { name: 'Best Email Marketing Software', url: '/tools/best-email-marketing-software' },
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
          <span className="text-gray-300">Best Email Marketing Software</span>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-4">
          Best Email Marketing Software for Beginners (2026)
        </h1>

        <LastReviewed date="June 19, 2026" reviewer="Richard Fritzke" reviewerUrl="/about/richard-fritzke" />
        <AffiliateDisclosureInline />

        <AnswerFirst
          answer="For most beginners, MailerLite is the best starting point for email marketing. It has a generous free plan, clean interface, solid automation, and built-in landing pages."
          context="If you are a creator focused on newsletters, beehiiv or Kit may be a better fit. If you need advanced automation and CRM, ActiveCampaign is the strongest option but comes with a steeper learning curve and higher price."
          lastReviewed="June 19, 2026"
          reviewer="Richard Fritzke"
        />

        <TldrBlock
          points={[
            'MailerLite: Best free email marketing for beginners — clean, capable, generous free tier.',
            'Kit: Best for creators who want subscriber-first email with paid newsletter options.',
            'GetResponse: Best when you also need webinars and conversion funnels alongside email.',
            'ActiveCampaign: Best for growing businesses that need deep automation and CRM.',
            'beehiiv: Best for newsletter operators focused on growth tools and ad monetization.',
          ]}
        />

        <ComparisonTable
          products={products}
          features={[
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
            This comparison is based on vendor-published feature and pricing
            information, verified as of the last-reviewed date above.
            Strengths, limitations, and editorial assessments are our own
            analysis. We do not fabricate user reviews, test results, or
            usage statistics.
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
