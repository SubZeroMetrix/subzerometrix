import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema, faqSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'The Complete Guide to Business Operating Systems for Service Companies',
  description:
    'What a real business operating system actually needs to cover for a service company -- CRM, scheduling, workflows, and dashboards -- and how MyAppFac builds one instead of stitching five separate tools together.',
  path: '/resources/myappfac/business-operating-systems',
})

const FAQS = [
  {
    question: 'What is a business operating system, exactly?',
    answer:
      'The set of connected systems a service business actually runs on day to day: a place customers and deals live (CRM), a place appointments get booked (scheduling), a place repeatable processes run (workflow), and a place the owner can see what state the business is actually in (dashboard). "Operating system" here means the operational core, not an OS in the computing sense.',
  },
  {
    question: 'Do I need all four pieces on day one?',
    answer:
      "No. Most businesses start with whichever piece is causing the most pain -- usually CRM or scheduling -- and add the rest as it becomes clear they're needed. MyAppFac builds each piece as its own real system, not a bundle you're forced to take all at once.",
  },
  {
    question: 'Is this the same thing as Metrix Command Center?',
    answer:
      "No, and the difference matters. Metrix Command Center (this site) finds what's slipping through the cracks in a business you already run -- overdue follow-ups, aging estimates, quiet customers. MyAppFac builds the underlying systems themselves, from scratch, for a business that doesn't have them yet or wants to replace what it has.",
  },
]

export default function BusinessOperatingSystemsPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'MyAppFac', url: '/resources/myappfac' },
    { name: 'Business Operating Systems', url: '/resources/myappfac/business-operating-systems' },
  ])
  const article = articleSchema({
    headline: 'The Complete Guide to Business Operating Systems for Service Companies',
    description: 'What a real business operating system needs to cover for a service company, and how MyAppFac builds one.',
    path: '/resources/myappfac/business-operating-systems',
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
          <span className="text-gray-900">Business Operating Systems</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">MyAppFac Guide</p>
        <h1 className="text-headline text-gray-900 mb-6">The Complete Guide to Business Operating Systems for Service Companies</h1>

        <div className="prose-content">
          <p>
            Most service businesses don&apos;t lack ambition or work ethic -- they lack a connected operating
            system. Instead, they run on a patchwork: a CRM here, a scheduling app there, a spreadsheet for
            everything else, and a dashboard that&apos;s really just someone&apos;s memory of how things are
            going. Each piece works fine in isolation. None of them talk to each other. That gap is where
            operational friction actually comes from.
          </p>

          <h2>The four systems a service business actually needs</h2>
          <p>
            <strong>CRM</strong> -- one place leads, customers, and deals live, instead of scattered across
            texts, email, and memory. <strong>Scheduling</strong> -- one place appointments and bookings
            actually get managed, instead of a shared calendar nobody fully trusts. <strong>Workflow</strong>
            -- the repeatable multi-step processes a business runs (intake, estimating, follow-up) captured
            as an actual system instead of tribal knowledge. <strong>Dashboard</strong> -- a real, current
            picture of the business, instead of a status meeting to find out how things are going.
          </p>

          <h2>Why these four, and not more</h2>
          <p>
            It&apos;s tempting to add a dozen more categories -- inventory, invoicing, payroll -- but most
            service businesses already have adequate tools for those, or don&apos;t need them yet. The four
            above are the ones that are usually missing entirely, hand-built badly in a spreadsheet, or
            scattered across tools that were never meant to work together. Fixing those four first is where
            the real friction lives.
          </p>

          <h2>How MyAppFac builds this</h2>
          <p>
            MyAppFac is an application factory: describe the business system you need, get a real Preview in
            Studio before anything is built for real, then unlock it. Each of CRM, Scheduling System,
            Workflow, and Dashboard is a real, working build family in MyAppFac&apos;s factory today -- not a
            mockup, not a roadmap item. You can start with the one piece causing the most pain and add the
            rest as your business actually needs them.
          </p>

          <h2>What this is not</h2>
          <p>
            This is not an unbounded &quot;build any app from any idea&quot; tool. MyAppFac starts from proven
            system types -- CRM, scheduling, workflow, dashboard, websites, estimating tools, calculators --
            and generates a coherent build inside that type, checked against a clear blueprint before it
            compiles. That constraint is what keeps the output usable instead of a pile of disconnected
            screens.
          </p>
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-12 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">See what MyAppFac can build for your business</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://myappfac.com/studio" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
              Open MyAppFac Studio &rarr;
            </a>
            <Link href="/resources/myappfac" className="btn-secondary inline-block">About MyAppFac</Link>
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
          <Link href="/resources/myappfac/replace-multiple-tools" className="text-brand-electric underline">
            How to Replace Multiple Tools with One Business Factory
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
