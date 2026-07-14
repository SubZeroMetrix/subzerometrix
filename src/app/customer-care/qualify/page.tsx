import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, webPageSchema } from '@/lib/seo'
import { QualificationFlow } from '@/components/care/QualificationFlow'

export const metadata = buildMetadata({
  title: 'Find the Right Next Step',
  description: 'Answer a few quick questions and we’ll help you figure out whether Metrix Command Center fits your business.',
  path: '/customer-care/qualify',
})

export default function QualifyPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Customer Care Center', url: '/customer-care' },
    { name: 'Find the Right Next Step', url: '/customer-care/qualify' },
  ])
  const webPage = webPageSchema({
    name: 'Find the Right Next Step',
    description: 'A short qualification flow to help you figure out whether Metrix Command Center fits your business.',
    path: '/customer-care/qualify',
  })

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />

      <div className="section-container max-w-xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-electric">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link href="/customer-care" className="hover:text-brand-electric">Customer Care Center</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">Find the Right Next Step</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">Not Sure Where to Start?</p>
        <h1 className="text-headline text-gray-900 mb-6">Let&apos;s figure out what fits</h1>
        <p className="text-lg text-gray-500 mb-10">
          Four quick questions — no promise of a call or specific response time, just a clearer next step.
        </p>

        <QualificationFlow />
      </div>
    </div>
  )
}
