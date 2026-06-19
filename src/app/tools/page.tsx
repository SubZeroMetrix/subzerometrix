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
    <div className="py-20">
      <div className="section-container">
        <div className="max-w-2xl mb-12">
          <p className="text-label text-brand-electric mb-3">Software Tools</p>
          <h1 className="text-headline text-gray-900 mb-4">
            {activeCategory ? activeCategory.name : 'Every Tool, Compared'}
          </h1>
          <p className="text-body-lg">
            {activeCategory
              ? activeCategory.description
              : 'Each tool is evaluated for use-case fit, strengths, limitations, and pricing. No tool is ranked by commission rate.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/tools"
            className={`text-sm px-4 py-2 rounded-full border transition-all ${
              !categoryFilter
                ? 'bg-brand-electric text-white border-brand-electric shadow-sm'
                : 'text-gray-600 border-surface-border hover:border-brand-electric hover:text-brand-electric'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tools?category=${cat.slug}`}
              className={`text-sm px-4 py-2 rounded-full border transition-all ${
                categoryFilter === cat.slug
                  ? 'bg-brand-electric text-white border-brand-electric shadow-sm'
                  : 'text-gray-600 border-surface-border hover:border-brand-electric hover:text-brand-electric'
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
          <p className="text-gray-400 text-center py-16">
            No tools found for this category yet.
          </p>
        )}

        <AffiliateDisclosureInline />
      </div>
    </div>
  )
}
