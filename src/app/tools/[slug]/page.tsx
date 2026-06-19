import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { seedProducts } from '@/../../content/products'
import { AffiliateDisclosureInline } from '@/components/AffiliateDisclosureInline'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return seedProducts.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = seedProducts.find((p) => p.slug === params.slug)
  if (!product) return {}

  return buildMetadata({
    title: `${product.name} Review`,
    description: product.description,
    path: `/tools/${product.slug}`,
  })
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = seedProducts.find((p) => p.slug === params.slug)
  if (!product) notFound()

  const crumbs = breadcrumbSchema([
    { name: 'Tools', url: '/tools' },
    { name: product.name, url: `/tools/${product.slug}` },
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
          <span className="text-gray-300">{product.name}</span>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
        <p className="text-gray-400 mb-8">{product.description}</p>

        {/* Quick Info */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <p className="text-xs text-gray-500 uppercase mb-1">Setup</p>
            <p className="text-sm text-white capitalize">{product.setup_complexity}</p>
          </div>
          <div className="card">
            <p className="text-xs text-gray-500 uppercase mb-1">Free Plan</p>
            <p className="text-sm text-white">{product.free_plan_or_trial ? 'Yes' : 'No'}</p>
          </div>
          <div className="card">
            <p className="text-xs text-gray-500 uppercase mb-1">Category</p>
            <p className="text-sm text-white capitalize">{product.category.replace(/-/g, ' ')}</p>
          </div>
        </div>

        {/* Best For / Poor Fit */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-sm font-semibold text-green-400 mb-2">Best For</h2>
            <p className="text-sm text-gray-300">{product.best_for}</p>
          </div>
          <div className="card">
            <h2 className="text-sm font-semibold text-amber-400 mb-2">May Not Fit</h2>
            <p className="text-sm text-gray-300">{product.poor_fit_for}</p>
          </div>
        </div>

        {/* Strengths */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Strengths</h2>
          <ul className="space-y-2">
            {product.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-green-400 mt-0.5 shrink-0">&#10003;</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Limitations */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Limitations</h2>
          <ul className="space-y-2">
            {product.limitations.map((l, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-amber-400 mt-0.5 shrink-0">&#8226;</span>
                {l}
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing */}
        <div className="card mb-8">
          <h2 className="text-lg font-bold text-white mb-2">Pricing</h2>
          <p className="text-sm text-gray-300">{product.pricing_note}</p>
        </div>

        {/* CTA */}
        <div className="card text-center mb-8">
          <p className="text-sm text-gray-400 mb-4">
            Ready to try {product.name}?
          </p>
          <Link
            href={`/go/${product.slug}`}
            className="btn-primary"
            rel="sponsored nofollow"
          >
            Visit {product.name}
          </Link>
        </div>

        {/* Methodology */}
        <p className="text-xs text-gray-500">
          This listing was compiled from vendor-published information and hands-on
          evaluation. See our{' '}
          <Link href="/editorial-policy" className="underline hover:text-brand-cyan">
            editorial policy
          </Link>
          .{' '}
          <Link href="/contact" className="underline hover:text-brand-cyan">
            Report a correction
          </Link>
          .
        </p>

        <AffiliateDisclosureInline />
      </div>
    </div>
  )
}
