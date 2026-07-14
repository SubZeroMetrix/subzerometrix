import Link from 'next/link'
import { buildMetadata, organizationSchema, websiteSchema, breadcrumbSchema, webPageSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Resources for Contractors & Facility Operators',
  description:
    'Practical guides for HVAC, facility management, and AI adoption in service businesses -- grounded in real operational experience, not generic advice.',
  path: '/resources',
})

const CATEGORIES = [
  {
    slug: 'hvac',
    name: 'HVAC',
    description: 'Service scheduling, follow-ups, technician coordination, and where AI genuinely helps an HVAC business.',
    populated: true,
  },
  {
    slug: 'facility-management',
    name: 'Facility Management',
    description: 'Preventive maintenance, asset lifecycle planning, recommissioning, and multi-site operational reliability.',
    populated: true,
  },
  {
    slug: 'ai-for-contractors',
    name: 'AI for Contractors',
    description: 'What governed AI actually does today, what it doesn’t, and how to adopt it without losing control.',
    populated: true,
  },
  {
    slug: 'business-operations',
    name: 'Business Operations',
    description: 'CRM fundamentals, revenue recovery, and follow-up process design for service businesses.',
    populated: false,
  },
]

const FEATURED_GUIDES = [
  { href: '/resources/hvac', title: 'Where HVAC Businesses Lose Revenue Without Noticing', category: 'HVAC' },
  { href: '/resources/facility-management', title: 'Facility Management: Reliability, Planning, and What AI Can and Can’t Do', category: 'Facility Management' },
  { href: '/resources/ai-for-contractors', title: 'AI for Contractors: What’s Real, What’s Roadmap, and How to Stay in Control', category: 'AI for Contractors' },
]

export default function ResourcesHubPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
  ])
  const webPage = webPageSchema({
    name: 'Resources for Contractors & Facility Operators',
    description: 'Practical guides for HVAC, facility management, and AI adoption in service businesses.',
    path: '/resources',
  })

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />

      <div className="section-container max-w-5xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-electric">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">Resources</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Resources</p>
        <h1 className="text-headline text-gray-900 mb-6">Practical Guides for Contractors &amp; Facility Operators</h1>
        <p className="text-lg text-gray-500 max-w-2xl mb-14">
          Written from real operational experience -- 24+ years in HVAC/R, facilities, and mechanical operations
          leadership -- not generic AI-written filler. Every guide is honest about what a tool like Metrix Command
          Center can and can&apos;t do.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {CATEGORIES.map((cat) =>
            cat.populated ? (
              <Link key={cat.slug} href={`/resources/${cat.slug}`} className="card-panel hover:border-brand-electric/30 transition-colors">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{cat.description}</p>
              </Link>
            ) : (
              <div key={cat.slug} className="card-panel opacity-60">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-2">{cat.description}</p>
                <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Coming soon</p>
              </div>
            )
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Guides</h2>
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {FEATURED_GUIDES.map((g) => (
            <Link key={g.href} href={g.href} className="card-panel hover:border-brand-electric/30 transition-colors">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-2">{g.category}</p>
              <h3 className="text-base font-bold text-gray-900">{g.title}</h3>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Free Tool</h2>
        <div className="card-panel mb-16">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Follow-Up Revenue Calculator</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Estimate how much revenue is sitting in open estimates and overdue follow-ups right now.
          </p>
          <Link href="/resources/tools/follow-up-revenue-calculator" className="btn-secondary inline-block">
            Try the Calculator
          </Link>
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">See how Metrix Command Center helps</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xl mx-auto">
            Governed AI that recommends next actions -- every recommendation requires your approval before it reaches
            a customer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#pricing" className="btn-primary inline-block">See Pricing</Link>
            <Link href="/#buster" className="btn-secondary inline-block">Meet Buster</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
