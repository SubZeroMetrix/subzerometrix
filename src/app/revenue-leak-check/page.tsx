import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { RevenueLeakCheckForm } from './RevenueLeakCheckForm'

export const metadata = buildMetadata({
  title: 'Revenue Leak Check',
  description: 'A free, no-email-required self-assessment that identifies the strongest verified revenue leak in your contractor business and recommends one first action.',
  path: '/revenue-leak-check',
})

export default function RevenueLeakCheckPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Revenue Leak Check', url: '/revenue-leak-check' },
  ])

  return (
    <div className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="section-container max-w-2xl">
        <p className="text-label text-brand-electric mb-3">Free — no email required</p>
        <h1 className="text-headline text-gray-900 mb-4">Revenue Leak Check</h1>
        <p className="text-lg text-gray-500 mb-12">
          Nine questions about how leads, estimates, and past customers move through your business. Answers marked
          &quot;not sure&quot; are shown as unknown, not folded into the result. See your primary signal and
          recommended first action immediately — no email required.
        </p>

        <RevenueLeakCheckForm />
      </div>
    </div>
  )
}
