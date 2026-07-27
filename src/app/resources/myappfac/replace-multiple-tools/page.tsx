import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema, faqSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'How to Replace Multiple Tools with One Business Factory',
  description:
    'Most small businesses run on five or more disconnected tools for operations and marketing. What that actually costs, and how a single application factory like MyAppFac replaces the stack instead of adding to it.',
  path: '/resources/myappfac/replace-multiple-tools',
})

const FAQS = [
  {
    question: 'What tools does MyAppFac actually replace?',
    answer:
      'On the operations side, a standalone CRM, a scheduling app, and a workflow/automation tool. On the marketing side, a social content generator, a static ad design tool, and separate video/voiceover tools. MyAppFac does not claim to replace accounting, payroll, or industry-specific field-service software.',
  },
  {
    question: "Isn't a single factory tool a worse version of each specialized tool?",
    answer:
      "For a genuinely specialized, complex need (enterprise accounting, industry-specific compliance software), a dedicated tool is still the right call. For the operational core most small service businesses actually need -- CRM, scheduling, workflow, dashboard, plus real marketing assets -- MyAppFac builds each as a real, working system inside one factory, not a lowest-common-denominator compromise.",
  },
  {
    question: 'How much does tool sprawl actually cost a small business?',
    answer:
      "Beyond the subscription fees themselves, the real cost is usually time: re-entering the same customer data in three places, checking five dashboards instead of one, and losing context every time a task crosses a tool boundary. That coordination overhead is often larger than the subscription cost, and it's the part a single connected factory removes.",
  },
]

export default function ReplaceMultipleToolsPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'MyAppFac', url: '/resources/myappfac' },
    { name: 'Replace Multiple Tools', url: '/resources/myappfac/replace-multiple-tools' },
  ])
  const article = articleSchema({
    headline: 'How to Replace Multiple Tools with One Business Factory',
    description: 'What tool sprawl actually costs a small business, and how a single application factory replaces the stack.',
    path: '/resources/myappfac/replace-multiple-tools',
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
          <span className="text-gray-900">Replace Multiple Tools</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">MyAppFac Guide</p>
        <h1 className="text-headline text-gray-900 mb-6">How to Replace Multiple Tools with One Business Factory</h1>

        <div className="prose-content">
          <p>
            Look at the actual bill for a typical small service business&apos;s software stack and it&apos;s
            rarely one line item -- it&apos;s five to ten. A CRM subscription. A scheduling tool. A workflow
            or automation platform. A design tool for social graphics. A separate video tool. A separate
            voiceover tool. Each one solves its own narrow problem well. None of them share data, and none of
            them were designed to work together.
          </p>

          <h2>The real cost isn&apos;t the subscriptions</h2>
          <p>
            The subscription fees add up, but they&apos;re rarely the biggest cost. The bigger cost is
            coordination: the same customer entered in three systems, a dashboard that&apos;s only as current
            as whoever last remembered to update it, and campaign assets built in a design tool that has no
            idea what the CRM says about who the audience actually is. Every handoff between disconnected
            tools is a place for something to go stale or get lost.
          </p>

          <h2>What a single factory changes</h2>
          <p>
            MyAppFac builds the operational core (CRM, scheduling, workflow, dashboard) and the marketing
            asset layer (social content, ad creatives, video, voiceover, campaign packs) from one factory,
            starting from proven system profiles rather than a blank &quot;build anything&quot; prompt. That
            doesn&apos;t make it magic -- it means the pieces a business actually needs come from one coherent
            build process instead of five separate vendor relationships.
          </p>

          <h2>Where a specialized tool is still the right call</h2>
          <p>
            This isn&apos;t a claim that one factory replaces every tool a business owns. Accounting, payroll,
            and deeply specialized industry software (established field-service platforms, for example) stay
            better served by dedicated tools built specifically for that job. The honest scope is the
            operational-and-marketing core most small service businesses are currently solving with a
            patchwork -- that&apos;s the gap a single factory actually closes.
          </p>
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-12 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">See what one factory can replace for you</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://myappfac.com/studio" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
              Open MyAppFac Studio &rarr;
            </a>
            <Link href="/resources/myappfac/business-operating-systems" className="btn-secondary inline-block">
              Business Operating Systems Guide
            </Link>
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
          <Link href="/resources/myappfac/crm-and-marketing-stack" className="text-brand-electric underline">
            The CRM + Marketing Stack for Service Businesses
          </Link>
        </p>
      </div>
    </div>
  )
}
