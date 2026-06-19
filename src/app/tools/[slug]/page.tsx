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
    <div className="py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />

      <div className="section-container max-w-4xl">
        <nav className="text-sm text-gray-400 mb-8" aria-label="Breadcrumb">
          <Link href="/tools" className="hover:text-brand-electric transition-colors">Tools</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700">{product.name}</span>
        </nav>

        <div className="mb-10">
          <p className="text-label text-brand-electric mb-3">Software Review</p>
          <h1 className="text-headline text-gray-900 mb-3">{product.name}</h1>
          <p className="text-body-lg max-w-2xl">{product.description}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="card-panel text-center">
            <p className="text-label mb-1">Setup</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">{product.setup_complexity}</p>
          </div>
          <div className="card-panel text-center">
            <p className="text-label mb-1">Free Plan</p>
            <p className="text-lg font-semibold text-gray-900">{product.free_plan_or_trial ? 'Yes' : 'No'}</p>
          </div>
          <div className="card-panel text-center">
            <p className="text-label mb-1">Category</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">{product.category.replace(/-/g, ' ')}</p>
          </div>
        </div>

        {/* Best For / Poor Fit */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <div className="card-panel border-l-4 border-l-emerald-400">
            <h2 className="text-sm font-bold text-emerald-700 mb-2">Best For</h2>
            <p className="text-sm text-gray-600">{product.best_for}</p>
          </div>
          <div className="card-panel border-l-4 border-l-amber-400">
            <h2 className="text-sm font-bold text-amber-700 mb-2">May Not Fit</h2>
            <p className="text-sm text-gray-600">{product.poor_fit_for}</p>
          </div>
        </div>

        {/* Strengths */}
        <div className="mb-10">
          <h2 className="text-subhead text-gray-900 mb-5">Strengths</h2>
          <div className="space-y-3">
            {product.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">&#10003;</span>
                <span className="text-gray-700">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Limitations */}
        <div className="mb-10">
          <h2 className="text-subhead text-gray-900 mb-5">Limitations</h2>
          <div className="space-y-3">
            {product.limitations.map((l, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 text-xs">&#8226;</span>
                <span className="text-gray-700">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="card-panel mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Pricing</h2>
          <p className="text-gray-600">{product.pricing_note}</p>
        </div>

        {/* CTA */}
        <div className="card-panel text-center py-10 mb-10 bg-surface-light-muted">
          <p className="text-gray-500 mb-5">
            Ready to try {product.name}?
          </p>
          <Link
            href={`/go/${product.slug}`}
            className="btn-primary text-lg"
            rel="sponsored nofollow"
          >
            Visit {product.name}
          </Link>
        </div>

        {/* Methodology */}
        <p className="text-xs text-gray-400 mb-2">
          This listing was compiled from vendor-published information and editorial evaluation. See our{' '}
          <Link href="/editorial-policy" className="text-brand-electric underline decoration-brand-electric/30 hover:decoration-brand-electric">
            editorial policy
          </Link>
          .{' '}
          <Link href="/contact" className="text-brand-electric underline decoration-brand-electric/30 hover:decoration-brand-electric">
            Report a correction
          </Link>
          .
        </p>

        <AffiliateDisclosureInline />
      </div>
    </div>
  )
}
