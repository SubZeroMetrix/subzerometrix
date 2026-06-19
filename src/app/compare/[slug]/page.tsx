import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { comparisons, seedProducts } from '@/../../content/products'
import { AffiliateDisclosureInline } from '@/components/AffiliateDisclosureInline'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const comp = comparisons.find((c) => c.slug === params.slug)
  if (!comp) return {}
  return buildMetadata({
    title: comp.title,
    description: `Compare ${comp.title}: features, pricing, strengths, and limitations side by side.`,
    path: `/compare/${comp.slug}`,
  })
}

export default function ComparisonPage({ params }: { params: { slug: string } }) {
  const comp = comparisons.find((c) => c.slug === params.slug)
  if (!comp) notFound()

  const productA = seedProducts.find((p) => p.slug === comp.productA)
  const productB = seedProducts.find((p) => p.slug === comp.productB)
  if (!productA || !productB) notFound()

  const crumbs = breadcrumbSchema([
    { name: 'Compare', url: '/compare' },
    { name: comp.title, url: `/compare/${comp.slug}` },
  ])

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      <div className="section-container max-w-5xl">
        <nav className="text-sm text-gray-400 mb-8" aria-label="Breadcrumb">
          <Link href="/compare" className="hover:text-brand-electric transition-colors">Compare</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700">{comp.title}</span>
        </nav>

        <AffiliateDisclosureInline />

        <div className="mt-8 mb-12">
          <p className="text-label text-brand-electric mb-3">Comparison</p>
          <h1 className="text-headline text-gray-900">{comp.title}</h1>
        </div>

        {/* Best By Use Case */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="card-panel border-t-4 border-t-emerald-400">
            <h2 className="text-sm font-bold text-emerald-700 mb-2">
              Choose {productA.name} if you need:
            </h2>
            <p className="text-gray-600">{comp.bestForA}</p>
            <Link href={`/go/${productA.slug}`} className="btn-primary mt-4 text-sm" rel="sponsored nofollow">
              Try {productA.name}
            </Link>
          </div>
          <div className="card-panel border-t-4 border-t-brand-electric">
            <h2 className="text-sm font-bold text-brand-electric mb-2">
              Choose {productB.name} if you need:
            </h2>
            <p className="text-gray-600">{comp.bestForB}</p>
            <Link href={`/go/${productB.slug}`} className="btn-primary mt-4 text-sm" rel="sponsored nofollow">
              Try {productB.name}
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="card-panel overflow-x-auto mb-12">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left py-4 px-4 text-label">Feature</th>
                <th className="text-left py-4 px-4 font-bold text-gray-900">{productA.name}</th>
                <th className="text-left py-4 px-4 font-bold text-gray-900">{productB.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border-light">
              <tr>
                <td className="py-3 px-4 text-gray-500">Category</td>
                <td className="py-3 px-4 text-gray-700 capitalize">{productA.category.replace(/-/g, ' ')}</td>
                <td className="py-3 px-4 text-gray-700 capitalize">{productB.category.replace(/-/g, ' ')}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-500">Free Plan</td>
                <td className="py-3 px-4 text-gray-700">{productA.free_plan_or_trial ? 'Yes' : 'No'}</td>
                <td className="py-3 px-4 text-gray-700">{productB.free_plan_or_trial ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-500">Setup</td>
                <td className="py-3 px-4 text-gray-700 capitalize">{productA.setup_complexity}</td>
                <td className="py-3 px-4 text-gray-700 capitalize">{productB.setup_complexity}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-500">Pricing</td>
                <td className="py-3 px-4 text-gray-700">{productA.pricing_note}</td>
                <td className="py-3 px-4 text-gray-700">{productB.pricing_note}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-500">Best For</td>
                <td className="py-3 px-4 text-gray-700">{productA.best_for}</td>
                <td className="py-3 px-4 text-gray-700">{productB.best_for}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Strengths */}
        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-subhead text-gray-900 mb-4">{productA.name} Strengths</h2>
            <div className="space-y-2">
              {productA.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-500 shrink-0 mt-0.5">&#10003;</span>
                  <span className="text-gray-700">{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-subhead text-gray-900 mb-4">{productB.name} Strengths</h2>
            <div className="space-y-2">
              {productB.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-500 shrink-0 mt-0.5">&#10003;</span>
                  <span className="text-gray-700">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Limitations */}
        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-subhead text-gray-900 mb-4">{productA.name} Limitations</h2>
            <div className="space-y-2">
              {productA.limitations.map((l, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-amber-500 shrink-0 mt-0.5">&#8226;</span>
                  <span className="text-gray-700">{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-subhead text-gray-900 mb-4">{productB.name} Limitations</h2>
            <div className="space-y-2">
              {productB.limitations.map((l, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-amber-500 shrink-0 mt-0.5">&#8226;</span>
                  <span className="text-gray-700">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Comparison based on vendor-published information. Features and pricing may change.{' '}
          <Link href="/editorial-policy" className="text-brand-electric underline">Editorial policy</Link>
          {' | '}
          <Link href="/contact" className="text-brand-electric underline">Report a correction</Link>
        </p>

        <AffiliateDisclosureInline />
      </div>
    </div>
  )
}
