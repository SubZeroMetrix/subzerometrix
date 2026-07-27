import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema, faqSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'The CRM + Marketing Stack for Service Businesses',
  description:
    'Why a CRM and a marketing asset toolkit work better connected than separate, and how MyAppFac builds both from one factory alongside Metrix Command Center for ongoing follow-up.',
  path: '/resources/myappfac/crm-and-marketing-stack',
})

const FAQS = [
  {
    question: 'Should a small service business build its CRM and marketing tools together, or separately?',
    answer:
      "There's no requirement either way, but building both from the same factory means the marketing assets it generates are grounded in a business description that's consistent with the CRM it also builds -- one source of truth instead of two systems that were configured independently and may drift.",
  },
  {
    question: 'Does MyAppFac connect to Metrix Command Center?',
    answer:
      "No -- they're deliberately separate products from SubZero Metrix LLC, each with their own account and sign-up. MyAppFac builds the CRM and marketing systems; Metrix Command Center finds what's slipping through the cracks in a business that's already running, whichever CRM it uses.",
  },
  {
    question: 'What does the buyer\'s guide comparison actually look like?',
    answer:
      'A CRM without marketing tools means leads get tracked but the campaigns to fill the pipeline are built elsewhere. Marketing tools without a CRM mean assets get created but nobody\'s tracking whether they turned into a real lead. Building both together closes that loop without a third tool stitching them.',
  },
]

export default function CrmAndMarketingStackPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'MyAppFac', url: '/resources/myappfac' },
    { name: 'CRM + Marketing Stack', url: '/resources/myappfac/crm-and-marketing-stack' },
  ])
  const article = articleSchema({
    headline: 'The CRM + Marketing Stack for Service Businesses',
    description: 'Why a CRM and a marketing asset toolkit work better connected than separate.',
    path: '/resources/myappfac/crm-and-marketing-stack',
  })
  const faq = faqSchema(FAQS)

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />

      <div className="section-container max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-electric">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link href="/resources/myappfac" className="hover:text-brand-electric">MyAppFac</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">CRM + Marketing Stack</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">MyAppFac Guide</p>
        <h1 className="text-headline text-gray-900 mb-6">The CRM + Marketing Stack for Service Businesses</h1>

        <div className="prose-content">
          <p>
            A CRM answers &quot;who are our leads and customers, and where do they stand.&quot; A marketing
            toolkit answers &quot;how do we get more of them, and what do we say.&quot; Most small businesses
            end up with two separate answers to two separate questions, built in two separate tools that
            were never designed to share context.
          </p>

          <h2>What connects them</h2>
          <p>
            A campaign built with real knowledge of who the CRM says the audience actually is performs
            differently than one built in a vacuum. A lead captured from a campaign is more useful when it
            lands directly in the CRM that already tracks follow-up, instead of a spreadsheet export nobody
            imports promptly. The value isn&apos;t magic integration -- it&apos;s simply not having two
            disconnected sources of truth about the same customers.
          </p>

          <h2>How MyAppFac builds both</h2>
          <p>
            MyAppFac&apos;s CRM build family is a real, working system-generation path -- the same factory
            that generates a website, a scheduling system, or a dashboard. Its Create/Research capabilities
            (social content, ad creatives, promo video, avatar video, voiceover, campaign packs, competitor
            research) are built from the same business description, so the marketing assets and the CRM
            they feed aren&apos;t configured as two unrelated projects.
          </p>

          <h2>Where Metrix Command Center fits, and where it doesn&apos;t</h2>
          <p>
            Metrix Command Center -- this site&apos;s primary product -- is a separate, deliberately distinct
            product from SubZero Metrix LLC. It doesn&apos;t build a CRM from scratch; it works with the
            business you already have, surfacing overdue follow-ups, aging estimates, and quiet customers
            inside your existing pipeline, with every recommendation requiring your explicit approval. If
            you&apos;re building a business&apos;s systems from zero, that&apos;s MyAppFac&apos;s job. If
            you&apos;re trying to stop missing what&apos;s already happening in a business you run, that&apos;s
            Metrix Command Center&apos;s job. They don&apos;t compete for the same problem.
          </p>
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-12 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Build your CRM and marketing stack</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://myappfac.com/studio" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
              Open MyAppFac Studio &rarr;
            </a>
            <Link href="/#pricing" className="btn-secondary inline-block">See Metrix Command Center Pricing</Link>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">FAQ</h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.question} className="card-panel">
                <summary className="cursor-pointer list-none font-semibold text-gray-900">{f.question}</summary>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Related:{' '}
          <Link href="/resources/myappfac/business-operating-systems" className="text-brand-electric underline">
            The Complete Guide to Business Operating Systems
          </Link>{' '}
          &middot;{' '}
          <Link href="/resources/myappfac/replace-multiple-tools" className="text-brand-electric underline">
            How to Replace Multiple Tools with One Business Factory
          </Link>
        </p>
      </div>
    </div>
  )
}
