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
    <div className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />

      <div className="section-container max-w-4xl">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/compare" className="hover:text-brand-cyan">Compare</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">{comp.title}</span>
        </nav>

        <AffiliateDisclosureInline />

        <h1 className="text-3xl font-bold text-white mb-8 mt-6">{comp.title}</h1>

        {/* Best By Use Case */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <div className="card border-green-900/40">
            <h2 className="text-sm font-semibold text-green-400 mb-2">
              Choose {productA.name} if you need:
            </h2>
            <p className="text-sm text-gray-300">{comp.bestForA}</p>
          </div>
          <div className="card border-blue-900/40">
            <h2 className="text-sm font-semibold text-brand-cyan mb-2">
              Choose {productB.name} if you need:
            </h2>
            <p className="text-sm text-gray-300">{comp.bestForB}</p>
          </div>
        </div>

        {/* Side-by-Side Table */}
        <div className="overflow-x-auto mb-10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Feature</th>
                <th className="text-left py-3 px-4 text-white font-medium">{productA.name}</th>
                <th className="text-left py-3 px-4 text-white font-medium">{productB.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr>
                <td className="py-3 px-4 text-gray-400">Category</td>
                <td className="py-3 px-4 text-gray-300 capitalize">{productA.category.replace(/-/g, ' ')}</td>
                <td className="py-3 px-4 text-gray-300 capitalize">{productB.category.replace(/-/g, ' ')}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-400">Free Plan</td>
                <td className="py-3 px-4 text-gray-300">{productA.free_plan_or_trial ? 'Yes' : 'No'}</td>
                <td className="py-3 px-4 text-gray-300">{productB.free_plan_or_trial ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-400">Setup Complexity</td>
                <td className="py-3 px-4 text-gray-300 capitalize">{productA.setup_complexity}</td>
                <td className="py-3 px-4 text-gray-300 capitalize">{productB.setup_complexity}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-400">Pricing</td>
                <td className="py-3 px-4 text-gray-300">{productA.pricing_note}</td>
                <td className="py-3 px-4 text-gray-300">{productB.pricing_note}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-400">Best For</td>
                <td className="py-3 px-4 text-gray-300">{productA.best_for}</td>
                <td className="py-3 px-4 text-gray-300">{productB.best_for}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Strengths Comparison */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <div>
            <h2 className="text-lg font-bold text-white mb-4">{productA.name} Strengths</h2>
            <ul className="space-y-2">
              {productA.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-green-400 shrink-0">&#10003;</span>{s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-4">{productB.name} Strengths</h2>
            <ul className="space-y-2">
              {productB.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-green-400 shrink-0">&#10003;</span>{s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Limitations */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <div>
            <h2 className="text-lg font-bold text-white mb-4">{productA.name} Limitations</h2>
            <ul className="space-y-2">
              {productA.limitations.map((l, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-amber-400 shrink-0">&#8226;</span>{l}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-4">{productB.name} Limitations</h2>
            <ul className="space-y-2">
              {productB.limitations.map((l, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-amber-400 shrink-0">&#8226;</span>{l}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTAs */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="card text-center">
            <Link href={`/go/${productA.slug}`} className="btn-primary w-full" rel="sponsored nofollow">
              Try {productA.name}
            </Link>
          </div>
          <div className="card text-center">
            <Link href={`/go/${productB.slug}`} className="btn-primary w-full" rel="sponsored nofollow">
              Try {productB.name}
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Comparison based on vendor-published information. Features and pricing may change.{' '}
          <Link href="/editorial-policy" className="underline hover:text-brand-cyan">Editorial policy</Link>
          {' | '}
          <Link href="/contact" className="underline hover:text-brand-cyan">Report a correction</Link>
        </p>

        <AffiliateDisclosureInline />
      </div>
    </div>
  )
}
