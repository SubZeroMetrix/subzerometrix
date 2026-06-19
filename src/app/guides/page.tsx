import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Guides',
  description: 'Guides for choosing the right software tools for your online business.',
  path: '/guides',
})

const guides = [
  { slug: 'best-email-marketing-tools', title: 'Best Email Marketing Tools for Beginners', description: 'A guide to choosing your first email marketing platform based on budget, features, and use case.' },
  { slug: 'all-in-one-vs-best-of-breed', title: 'All-in-One vs Best-of-Breed: Which Approach Is Right?', description: 'When to use a single platform for everything vs specialized tools for each function.' },
  { slug: 'newsletter-platforms-compared', title: 'Newsletter Platforms Compared', description: 'How to choose between newsletter-focused platforms like beehiiv and Kit.' },
]

export default function GuidesPage() {
  return (
    <div className="py-20">
      <div className="section-container">
        <div className="max-w-2xl mb-12">
          <p className="text-label text-brand-electric mb-3">Guides</p>
          <h1 className="text-headline text-gray-900 mb-4">Practical Guides</h1>
          <p className="text-body-lg">
            Practical guides to help you choose the right software tools without
            wasting money on things you don&apos;t need yet.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="card-panel group hover:shadow-panel-lg hover:border-brand-electric/20 transition-all duration-200"
            >
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-brand-electric transition-colors">
                {guide.title}
              </h2>
              <p className="text-sm text-gray-500 mt-2">{guide.description}</p>
              <div className="mt-4 pt-3 border-t border-surface-border">
                <span className="text-sm text-brand-electric font-medium">Read guide &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
