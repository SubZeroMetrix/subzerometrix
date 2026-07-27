import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, webPageSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'MyAppFac — The Application Factory',
  description:
    'MyAppFac is a sibling product from SubZero Metrix LLC: an application factory that builds real business systems (websites, CRM, scheduling, workflows, dashboards) and generates marketing assets (social content, promo video, avatar video, voiceover, ad creatives, campaign packs, competitor research).',
  path: '/resources/myappfac',
})

const BUILD_CAPABILITIES = [
  { name: 'Website', description: 'A multi-section marketing or business site.' },
  { name: 'CRM', description: 'Track leads, customers, and deals.' },
  { name: 'Scheduling System', description: 'Booking and appointment management.' },
  { name: 'Workflow', description: 'Automate a multi-step business process.' },
  { name: 'Dashboard', description: 'Visualize your business data.' },
  { name: 'Estimating Tool', description: 'Quote and estimate jobs.' },
  { name: 'Calculator or Utility', description: 'A focused single-purpose tool.' },
]

const CREATE_CAPABILITIES = [
  { name: 'Design', description: 'Static ad creatives and images.' },
  { name: 'Social Content', description: 'Posts and carousels for social platforms.' },
  { name: 'Promo Video', description: 'Short AI-generated promotional video.' },
  { name: 'Avatar Video', description: 'Talking-head spokesperson video (HeyGen).' },
  { name: 'Voiceover', description: 'AI text-to-speech narration.' },
  { name: 'Campaign Pack', description: 'A bundled brief, storyboard, and assets.' },
  { name: 'Competitor Research', description: "Analyze a competitor's site and positioning." },
]

export default function MyAppFacPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'MyAppFac', url: '/resources/myappfac' },
  ])
  const webPage = webPageSchema({
    name: 'MyAppFac — The Application Factory',
    description: 'A sibling product from SubZero Metrix LLC: an application factory for business systems and marketing assets.',
    path: '/resources/myappfac',
  })

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />

      <div className="section-container max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-electric">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link href="/resources" className="hover:text-brand-electric">Resources</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">MyAppFac</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">From SubZero Metrix LLC</p>
        <h1 className="text-headline text-gray-900 mb-6">MyAppFac — The Application Factory</h1>

        <div className="prose-content">
          <p>
            MyAppFac is a separate product, also built by SubZero Metrix LLC, hosted on its own site at{' '}
            <a href="https://myappfac.com/" target="_blank" rel="noopener noreferrer" className="text-brand-electric underline">
              myappfac.com
            </a>
            . It is not part of your Metrix Command Center workspace -- it has its own account, its own
            sign-up, and its own pricing. Where Metrix Command Center helps you catch what&apos;s slipping
            through the cracks in an existing business, MyAppFac builds the systems and marketing assets
            themselves.
          </p>
          <p>
            MyAppFac is an application factory: describe the business system you need, get a real preview
            in Studio, then unlock it. Two categories of capability are working today.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Build — operating systems</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {BUILD_CAPABILITIES.map((c) => (
            <div key={c.name} className="card-panel">
              <h3 className="text-sm font-bold text-gray-900 mb-1">{c.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{c.description}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create &amp; Research — marketing assets</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {CREATE_CAPABILITIES.map((c) => (
            <div key={c.name} className="card-panel">
              <h3 className="text-sm font-bold text-gray-900 mb-1">{c.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{c.description}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mb-14">
          Auto-posting, ad-inspiration browsing, content strategy, and workflow/scheduling automation are
          on MyAppFac&apos;s roadmap -- not live yet, so they&apos;re not listed above.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Guides</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          <Link href="/resources/myappfac/business-operating-systems" className="card-panel hover:border-brand-electric/30 transition-colors">
            <h3 className="text-sm font-bold text-gray-900">The Complete Guide to Business Operating Systems for Service Companies</h3>
          </Link>
          <Link href="/resources/myappfac/ai-marketing-asset-creation" className="card-panel hover:border-brand-electric/30 transition-colors">
            <h3 className="text-sm font-bold text-gray-900">AI Marketing Asset Creation for Small Businesses</h3>
          </Link>
          <Link href="/resources/myappfac/replace-multiple-tools" className="card-panel hover:border-brand-electric/30 transition-colors">
            <h3 className="text-sm font-bold text-gray-900">How to Replace Multiple Tools with One Business Factory</h3>
          </Link>
          <Link href="/resources/myappfac/ai-video-marketing" className="card-panel hover:border-brand-electric/30 transition-colors">
            <h3 className="text-sm font-bold text-gray-900">AI Video Marketing for Trades and Contractors</h3>
          </Link>
          <Link href="/resources/myappfac/crm-and-marketing-stack" className="card-panel hover:border-brand-electric/30 transition-colors sm:col-span-2">
            <h3 className="text-sm font-bold text-gray-900">The CRM + Marketing Stack for Service Businesses</h3>
          </Link>
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Visit MyAppFac</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xl mx-auto">
            Sign up directly on myappfac.com -- a separate account from your Metrix Command Center workspace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://myappfac.com/studio" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
              Open MyAppFac Studio &rarr;
            </a>
            <a href="https://myappfac.com/" target="_blank" rel="noopener noreferrer" className="btn-secondary inline-block">
              Visit myappfac.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
