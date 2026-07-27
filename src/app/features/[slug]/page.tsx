import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildMetadata, organizationSchema, breadcrumbSchema, webPageSchema } from '@/lib/seo'
import { OUTCOME_AREAS } from '@/../../content/outcome-areas'
import { MCC_SIGNUP_URL } from '@/content/mcc-pricing'

export function generateStaticParams() {
  return OUTCOME_AREAS.map((o) => ({ slug: o.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const area = OUTCOME_AREAS.find((o) => o.slug === params.slug)
  if (!area) return buildMetadata({ title: 'Feature', description: 'Metrix Command Center feature.', noIndex: true })
  return buildMetadata({
    title: `${area.title} | Metrix Command Center`,
    description: area.longDescription,
    path: `/features/${area.slug}`,
  })
}

export default function FeaturePage({ params }: { params: { slug: string } }) {
  const area = OUTCOME_AREAS.find((o) => o.slug === params.slug)
  if (!area) notFound()

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: area.title, url: `/features/${area.slug}` },
  ])
  const webPage = webPageSchema({
    name: `${area.title} | Metrix Command Center`,
    description: area.longDescription,
    path: `/features/${area.slug}`,
  })

  const others = OUTCOME_AREAS.filter((o) => o.slug !== area.slug)

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />

      <div className="section-container max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-electric">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">{area.title}</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">What Metrix Covers</p>
        <h1 className="text-headline text-gray-900 mb-6">{area.title}</h1>

        <div className="prose-content">
          <p>{area.longDescription}</p>
        </div>

        <div className="card-panel mt-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">The problem</p>
          <p className="text-sm text-gray-700 leading-relaxed mb-6">{area.problem}</p>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Metrix identifies</p>
          <p className="text-sm text-gray-700 leading-relaxed mb-6">{area.identifies}</p>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">You</p>
          <p className="text-sm text-gray-700 leading-relaxed mb-6">{area.nextStep}</p>
          <p className="text-sm font-semibold text-brand-electric">{area.approval}</p>
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-8 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">See how this works in your business</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={MCC_SIGNUP_URL} className="btn-primary inline-block">Start Free Trial</a>
            <Link href="/#ask-buster" className="btn-secondary inline-block">Ask Buster</Link>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Other things Metrix covers</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/features/${o.slug}`} className="text-sm text-brand-electric hover:underline">
                {o.title} &rarr;
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
