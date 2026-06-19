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
    <div className="py-16">
      <div className="section-container">
        <h1 className="text-3xl font-bold text-white mb-4">Compare Software</h1>
        <p className="text-gray-400 mb-10 max-w-2xl">
          Side-by-side comparisons to help you pick the right tool for your
          situation. Each comparison covers use-case fit, features, pricing,
          and limitations.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {comparisons.map((comp) => (
            <Link
              key={comp.slug}
              href={`/compare/${comp.slug}`}
              className="card hover:border-brand-electric/40 transition-colors group"
            >
              <h2 className="text-lg font-bold text-white group-hover:text-brand-cyan transition-colors">
                {comp.title}
              </h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Best for A</p>
                  <p className="text-sm text-gray-300 mt-1">{comp.bestForA}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Best for B</p>
                  <p className="text-sm text-gray-300 mt-1">{comp.bestForB}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <AffiliateDisclosureInline />
      </div>
    </div>
  )
}
