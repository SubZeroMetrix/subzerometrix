import Link from 'next/link'
import { seedProducts } from '@/../../content/products'

type Product = (typeof seedProducts)[number]

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card hover:border-brand-electric/40 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-white">{product.name}</h3>
        {product.free_plan_or_trial && (
          <span className="text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full">
            Free plan
          </span>
        )}
      </div>
      <p className="text-sm text-gray-400 mb-4">{product.description}</p>
      <p className="text-xs text-gray-500 mb-4">
        <strong>Best for:</strong> {product.best_for}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 capitalize">{product.setup_complexity} setup</span>
        <Link
          href={`/tools/${product.slug}`}
          className="text-sm text-brand-cyan hover:text-brand-cyan-light transition-colors"
        >
          Learn more &rarr;
        </Link>
      </div>
    </div>
  )
}
