import Image from 'next/image'
import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, webPageSchema } from '@/lib/seo'
import { BusterChat } from '@/components/buster/BusterChat'

export const metadata = buildMetadata({
  title: 'Ask Buster',
  description: 'Ask Buster anything about Metrix Command Center. Every answer comes from our real Help Center content, with the source cited — never a guess.',
  path: '/buster',
})

export default function BusterPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Ask Buster', url: '/buster' },
  ])
  const webPage = webPageSchema({
    name: 'Ask Buster',
    description: 'Ask Buster anything about Metrix Command Center, grounded in real Help Center content.',
    path: '/buster',
  })

  return (
    <div className="py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />

      <div className="section-container max-w-2xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-electric">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-900">Ask Buster</span>
        </nav>

        <div className="flex flex-col items-center text-center mb-8">
          <Image
            src="/brand/buster-ai-chief-of-staff-badge.png"
            alt="Buster, the Metrix Command Center AI Chief of Staff"
            width={140}
            height={140}
            className="mb-4"
            priority
          />
          <p className="text-label text-brand-electric mb-2">Ask Buster</p>
          <h1 className="text-headline text-gray-900 mb-3">Get a real answer, not a guess</h1>
          <p className="text-gray-500 max-w-lg">
            Buster only answers from our real Help Center content and cites its source every time. If it doesn&apos;t
            know something, it says so — and points you to a person or the right next step instead.
          </p>
        </div>

        <BusterChat />

        <p className="text-sm text-gray-500 mt-8 text-center">
          Prefer to browse instead? <Link href="/help" className="text-brand-electric underline">Visit the Help Center</Link>
        </p>
      </div>
    </div>
  )
}
