import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema, faqSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'AI Video Marketing for Trades and Contractors',
  description:
    'Promo video, avatar spokesperson video, and voiceover for trades and contractors -- what AI video marketing actually requires today, and what MyAppFac generates without a camera crew.',
  path: '/resources/myappfac/ai-video-marketing',
})

const FAQS = [
  {
    question: 'Do I need to be on camera for AI video marketing to work?',
    answer:
      'No. Avatar Video generates a talking-head spokesperson video via HeyGen without you appearing on camera. Promo Video generates short promotional video from a brief. Voiceover adds AI narration to either. All three are usable by a business owner who has never filmed a marketing video.',
  },
  {
    question: 'How is this different from a stock video template tool?',
    answer:
      "A stock template swaps in your logo and colors around someone else's footage. Avatar Video and Promo Video generate content shaped around your actual business description and campaign brief, not a fixed template library.",
  },
  {
    question: "What happens if the video provider isn't configured?",
    answer:
      "The feature fails closed and tells you plainly that video generation isn't enabled -- it never fabricates a fake result or claims a video was created when it wasn't. That's a deliberate product rule, not an edge case that got missed.",
  },
]

export default function AiVideoMarketingPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'MyAppFac', url: '/resources/myappfac' },
    { name: 'AI Video Marketing', url: '/resources/myappfac/ai-video-marketing' },
  ])
  const article = articleSchema({
    headline: 'AI Video Marketing for Trades and Contractors',
    description: 'What AI video marketing actually requires today, and what MyAppFac generates without a camera crew.',
    path: '/resources/myappfac/ai-video-marketing',
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
          <span className="text-gray-900">AI Video Marketing</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">MyAppFac Guide</p>
        <h1 className="text-headline text-gray-900 mb-6">AI Video Marketing for Trades and Contractors</h1>

        <div className="prose-content">
          <p>
            Video consistently outperforms static content for engagement, and trades businesses know it --
            most just don&apos;t have a camera crew, an on-camera-comfortable owner, or the hours it takes to
            script, shoot, and edit a promotional video every time a new service or seasonal push needs one.
            That gap is exactly where AI video generation is genuinely useful, not a novelty.
          </p>

          <h2>Two different jobs, two different tools</h2>
          <p>
            <strong>Promo Video</strong> generates a short, AI-produced promotional video from a brief --
            useful for a seasonal offer, a new-service announcement, or a general brand piece.{' '}
            <strong>Avatar Video</strong> generates a talking-head spokesperson video via HeyGen -- useful
            when the message benefits from a person speaking directly to the viewer, without requiring an
            owner or technician to actually be on camera.{' '}
            <strong>Voiceover</strong> adds AI text-to-speech narration to either, or to any video that needs
            a voice track without hiring a voice actor.
          </p>

          <h2>What a trades business would actually use this for</h2>
          <p>
            A seasonal HVAC maintenance reminder. A quick explainer on what a service call includes. A
            spokesperson video introducing a new technician or service line. A voiceover for a before/after
            job-site montage. None of these require a production budget -- they require a brief and a
            provider-backed generation pipeline, which is what MyAppFac Studio runs.
          </p>

          <h2>What this doesn&apos;t do</h2>
          <p>
            It doesn&apos;t auto-post the finished video anywhere -- that publishing step is still on the
            roadmap, not live. It doesn&apos;t fabricate a result if the underlying provider isn&apos;t
            configured; it fails closed with an honest message instead. And it&apos;s not a replacement for
            real footage of an actual completed job when that&apos;s the stronger asset -- it&apos;s a tool
            for the gap where real footage isn&apos;t practical.
          </p>
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-12 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Generate a promo or avatar video</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://myappfac.com/studio" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
              Open MyAppFac Studio &rarr;
            </a>
            <Link href="/resources/myappfac/ai-marketing-asset-creation" className="btn-secondary inline-block">
              AI Marketing Asset Creation Guide
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
          <Link href="/resources/myappfac/ai-marketing-asset-creation" className="text-brand-electric underline">
            AI Marketing Asset Creation for Small Businesses
          </Link>{' '}
          &middot;{' '}
          <Link href="/resources/hvac" className="text-brand-electric underline">
            Where HVAC Businesses Lose Revenue Without Noticing
          </Link>
        </p>
      </div>
    </div>
  )
}
