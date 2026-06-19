import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Guides',
  description: 'Guides for choosing the right software tools for your online business — email marketing, websites, e-commerce, and more.',
  path: '/guides',
})

const guides = [
  {
    slug: 'best-email-marketing-tools',
    title: 'Best Email Marketing Tools for Beginners',
    description: 'A guide to choosing your first email marketing platform based on budget, features, and use case.',
  },
  {
    slug: 'all-in-one-vs-best-of-breed',
    title: 'All-in-One vs Best-of-Breed: Which Approach Is Right?',
    description: 'When to use a single platform for everything vs specialized tools for each function.',
  },
  {
    slug: 'newsletter-platforms-compared',
    title: 'Newsletter Platforms Compared',
    description: 'How to choose between newsletter-focused platforms like beehiiv and Kit.',
  },
]

export default function GuidesPage() {
  return (
    <div className="py-16">
      <div className="section-container">
        <h1 className="text-3xl font-bold text-white mb-4">Guides</h1>
        <p className="text-gray-400 mb-10 max-w-2xl">
          Practical guides to help you choose the right software tools without
          wasting money on things you don&apos;t need yet.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="card hover:border-brand-electric/40 transition-colors group"
            >
              <h2 className="text-lg font-bold text-white group-hover:text-brand-cyan transition-colors">
                {guide.title}
              </h2>
              <p className="text-sm text-gray-400 mt-2">{guide.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
