import Link from 'next/link'
import { seedProducts } from '@/../../content/products'

type Product = (typeof seedProducts)[number]

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/tools/${product.slug}`}
      className="card-panel group hover:shadow-panel-lg hover:border-brand-electric/20 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-electric transition-colors">
          {product.name}
        </h3>
        {product.free_plan_or_trial && (
          <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium">
            Free plan
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
      <p className="text-xs text-gray-400 mb-4">
        <strong className="text-gray-600">Best for:</strong> {product.best_for}
      </p>
      <div className="flex items-center justify-between pt-3 border-t border-surface-border">
        <span className="text-xs text-gray-400 capitalize">{product.setup_complexity} setup</span>
        <span className="text-sm text-brand-electric font-medium group-hover:translate-x-0.5 transition-transform">
          Learn more &rarr;
        </span>
      </div>
    </Link>
  )
}
