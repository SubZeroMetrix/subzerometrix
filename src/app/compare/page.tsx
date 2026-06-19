import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { comparisons } from '@/../../content/products'
import { AffiliateDisclosureInline } from '@/components/AffiliateDisclosureInline'

export const metadata = buildMetadata({
  title: 'Compare Software',
  description: 'Side-by-side software comparisons for email marketing, website builders, e-commerce, newsletters, SEO, and online business tools.',
  path: '/compare',
})

export default function ComparePage() {
  return (
    <div className="py-20">
      <div className="section-container">
        <div className="max-w-2xl mb-12">
          <p className="text-label text-brand-electric mb-3">Comparisons</p>
          <h1 className="text-headline text-gray-900 mb-4">Side-by-Side Software Comparisons</h1>
          <p className="text-body-lg">
            Pick the right tool for your situation. Each comparison covers use-case fit, features, pricing,
            and honest limitations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {comparisons.map((comp) => (
            <Link
              key={comp.slug}
              href={`/compare/${comp.slug}`}
              className="card-panel group hover:shadow-panel-lg hover:border-brand-electric/20 transition-all duration-200"
            >
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-brand-electric transition-colors mb-4">
                {comp.title}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-label mb-1">Choose A if</p>
                  <p className="text-sm text-gray-600">{comp.bestForA}</p>
                </div>
                <div>
                  <p className="text-label mb-1">Choose B if</p>
                  <p className="text-sm text-gray-600">{comp.bestForB}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-surface-border">
                <span className="text-sm text-brand-electric font-medium">View comparison &rarr;</span>
              </div>
            </Link>
          ))}
        </div>

        <AffiliateDisclosureInline />
      </div>
    </div>
  )
}
