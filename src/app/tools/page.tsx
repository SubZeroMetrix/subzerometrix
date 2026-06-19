import { buildMetadata } from '@/lib/seo'
import { seedProducts, categories } from '@/../../content/products'
import { ProductCard } from '@/components/ProductCard'
import { AffiliateDisclosureInline } from '@/components/AffiliateDisclosureInline'
import Link from 'next/link'

export const metadata = buildMetadata({
  title: 'Software Tools',
  description: 'Compare the best software tools for online business — email marketing, website builders, e-commerce, SEO, newsletters, and automation.',
  path: '/tools',
})

export default function ToolsPage({
  searchParams,
}: {
  searchParams: { category?: string; 'use-case'?: string }
}) {
  const categoryFilter = searchParams.category
  const filtered = categoryFilter
    ? seedProducts.filter((p) => p.category === categoryFilter)
    : seedProducts

  const activeCategory = categories.find((c) => c.slug === categoryFilter)

  return (
    <div className="py-16">
      <div className="section-container">
        <h1 className="text-3xl font-bold text-white mb-4">
          {activeCategory ? activeCategory.name : 'Software Tools'}
        </h1>
        <p className="text-gray-400 mb-8 max-w-2xl">
          {activeCategory
            ? activeCategory.description
            : 'Explore software tools compared by SubZero Metrix. Each tool is evaluated for use-case fit, strengths, limitations, and pricing.'}
        </p>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/tools"
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !categoryFilter
                ? 'bg-brand-electric text-white border-brand-electric'
                : 'text-gray-400 border-gray-700 hover:border-brand-cyan'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tools?category=${cat.slug}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                categoryFilter === cat.slug
                  ? 'bg-brand-electric text-white border-brand-electric'
                  : 'text-gray-400 border-gray-700 hover:border-brand-cyan'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-gray-500 text-center py-12">
            No tools found for this category yet.
          </p>
        )}

        <AffiliateDisclosureInline />
      </div>
    </div>
  )
}
