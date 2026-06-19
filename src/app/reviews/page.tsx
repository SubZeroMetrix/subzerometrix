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
    <div className="py-20">
      <div className="section-container">
        <div className="max-w-2xl mb-12">
          <p className="text-label text-brand-electric mb-3">Reviews</p>
          <h1 className="text-headline text-gray-900 mb-4">Software Reviews</h1>
          <p className="text-body-lg">
            Detailed reviews covering strengths, limitations, pricing, and who each
            tool is built for.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {seedProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/reviews/${product.slug}`}
              className="card-panel group hover:shadow-panel-lg hover:border-brand-electric/20 transition-all duration-200"
            >
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-brand-electric transition-colors">
                {product.name} Review
              </h2>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                {product.description}
              </p>
              <p className="text-xs text-gray-400 mt-3">
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
