import Link from 'next/link'
import { buildMetadata, organizationSchema, websiteSchema, breadcrumbSchema, webPageSchema } from '@/lib/seo'
import { getAllHelpArticles } from '@/lib/help-articles'
import { HelpSearchList } from '@/components/help/HelpSearchList'

export const metadata = buildMetadata({
  title: 'Help Center',
  description: 'Answers to real questions about Metrix Command Center — what it does, how owner approval works, pricing, setup, and more.',
  path: '/help',
})

export const revalidate = 300

export default async function HelpCenterPage() {
  const articles = await getAllHelpArticles()
  const categories = Array.from(new Set(articles.map((a) => a.category)))

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Help Center', url: '/help' },
  ])
  const webPage = webPageSchema({
    name: 'Help Center',
    description: 'Answers to real questions about Metrix Command Center.',
    path: '/help',
  })
  const faqSchema = articles.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: articles.slice(0, 20).map((a) => ({
      '@type': 'Question',
      name: a.title,
      acceptedAnswer: { '@type': 'Answer', text: a.answer },
    })),
  } : null

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div className="section-container max-w-4xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-electric">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">Help Center</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Help Center</p>
        <h1 className="text-headline text-gray-900 mb-6">How can we help?</h1>
        <p className="text-lg text-gray-500 max-w-2xl mb-12">
          Real, curated answers grounded in how Metrix Command Center actually works today. Every answer is
          reviewed and tagged with its verification status — nothing here is generated on the fly.
        </p>

        {articles.length === 0 ? (
          <div className="card-panel text-center py-12">
            <p className="text-gray-600 mb-4">The Help Center is being updated right now.</p>
            <Link href="/customer-care" className="text-sm font-semibold text-brand-electric hover:underline">
              Contact the Customer Care Center &rarr;
            </Link>
          </div>
        ) : (
          <HelpSearchList articles={articles} categories={categories} />
        )}

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-16 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Didn&apos;t find your answer?</h2>
          <p className="text-sm text-gray-500 mb-6">
            Submit a question to the Customer Care Center and we&apos;ll follow up.
          </p>
          <Link href="/customer-care" className="btn-primary inline-block">Go to Customer Care</Link>
        </div>
      </div>
    </div>
  )
}
