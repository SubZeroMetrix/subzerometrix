import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'
import { getAllHelpArticles, getHelpArticleBySlug } from '@/lib/help-articles'
import { HelpFeedbackWidget } from '@/components/help/HelpFeedbackWidget'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getHelpArticleBySlug(slug)
  if (!article) return buildMetadata({ title: 'Help Center', description: 'Help Center', path: '/help', noIndex: true })

  return buildMetadata({
    title: article.title,
    description: article.answer.slice(0, 155),
    path: `/help/${article.slug}`,
  })
}

const STATUS_LABEL: Record<string, string> = {
  VERIFIED: 'Verified',
  LIMITED: 'Limited — partial or in-progress capability',
  PLANNED: 'Planned — not available yet',
  UNKNOWN: 'Unknown — not yet confirmed',
}

export default async function HelpArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getHelpArticleBySlug(slug)
  if (!article) notFound()

  const allArticles = await getAllHelpArticles()
  const related = allArticles.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3)

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Help Center', url: '/help' },
    { name: article.title, url: `/help/${article.slug}` },
  ])
  const schema = articleSchema({
    headline: article.title,
    description: article.answer.slice(0, 200),
    path: `/help/${article.slug}`,
    authorGrounded: false,
  })

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="section-container max-w-2xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-electric">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link href="/help" className="hover:text-brand-electric">Help Center</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">{article.title}</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">{article.category}</p>
        <h1 className="text-headline text-gray-900 mb-4">{article.title}</h1>

        {article.status !== 'VERIFIED' && (
          <p className="text-sm font-semibold text-amber-700 bg-amber-50 inline-block px-3 py-1 rounded-full mb-6">
            {STATUS_LABEL[article.status]}
          </p>
        )}

        <div className="prose-content mb-4">
          <p>{article.answer}</p>
        </div>

        <p className="text-sm text-gray-500 mb-2">
          Source: <Link href={article.source_path} className="text-brand-electric underline">{article.source_path === '/' ? 'Homepage' : article.source_path}</Link>
        </p>
        <p className="text-xs text-gray-500 mb-8">Last verified {article.last_verified_date}</p>

        {article.escalation_rule === 'contact_support' && (
          <div className="card-panel bg-gray-50 mb-8">
            <p className="text-sm text-gray-600">
              Still not sure? <Link href="/customer-care" className="text-brand-electric underline">Ask the Customer Care Center</Link> for help specific to your situation.
            </p>
          </div>
        )}

        <HelpFeedbackWidget articleId={article.id} route={`/help/${article.slug}`} />

        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-surface-border">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Related questions</h2>
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/help/${r.slug}`} className="text-brand-electric underline text-sm">{r.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-8">
          <Link href="/help" className="text-brand-electric underline">&larr; Back to Help Center</Link>
        </p>
      </div>
    </div>
  )
}
