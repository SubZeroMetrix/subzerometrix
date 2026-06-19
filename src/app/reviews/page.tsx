import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { seedProducts } from '@/../../content/products'
import { AffiliateDisclosureInline } from '@/components/AffiliateDisclosureInline'

export const metadata = buildMetadata({
  title: 'Software Reviews',
  description: 'In-depth software reviews for online business tools — email marketing, website builders, e-commerce, SEO, and more.',
  path: '/reviews',
})

export default function ReviewsPage() {
  return (
    <div className="py-16">
      <div className="section-container">
        <h1 className="text-3xl font-bold text-white mb-4">Software Reviews</h1>
        <p className="text-gray-400 mb-10 max-w-2xl">
          Detailed reviews covering strengths, limitations, pricing, and who each
          tool is built for. Each review includes a last-reviewed date and links to
          verification sources.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {seedProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/reviews/${product.slug}`}
              className="card hover:border-brand-electric/40 transition-colors group"
            >
              <h2 className="text-lg font-bold text-white group-hover:text-brand-cyan transition-colors">
                {product.name} Review
              </h2>
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                {product.description}
              </p>
              <p className="text-xs text-gray-500 mt-3">
                {product.free_plan_or_trial ? 'Free plan available' : product.pricing_note}
              </p>
            </Link>
          ))}
        </div>

        <AffiliateDisclosureInline />
      </div>
    </div>
  )
}
