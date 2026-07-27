import Link from 'next/link'
import { buildMetadata, organizationSchema, breadcrumbSchema, articleSchema, faqSchema } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'AI Marketing Asset Creation for Small Businesses',
  description:
    'Social content, promo video, avatar video, voiceover, and ad creatives -- what AI marketing asset creation actually means today, and which of it MyAppFac generates live.',
  path: '/resources/myappfac/ai-marketing-asset-creation',
})

const FAQS = [
  {
    question: 'What marketing assets can MyAppFac actually generate today?',
    answer:
      'Social posts and carousels, static ad creatives, promo video, avatar (talking-head) video via HeyGen, AI voiceover, and campaign packs that bundle a brief, storyboard, and assets together. All seven are real, working capabilities in MyAppFac Studio today, not a roadmap slide.',
  },
  {
    question: 'Does this replace a marketing agency?',
    answer:
      "For asset creation, often yes -- a business can generate a full set of campaign assets without briefing an outside agency and waiting for a turnaround. It doesn't replace strategy, media buying, or account management, and it doesn't auto-post anything; you still decide what goes out and where.",
  },
  {
    question: 'Is video generation actually live, or does it just say "AI-generated" without producing anything?',
    answer:
      "It's live -- Promo Video and Avatar Video both run through configured provider integrations (video generation and HeyGen respectively), and Voiceover runs through a configured text-to-speech provider. If a provider key isn't configured in a given environment, the feature fails closed with an honest message rather than fabricating output.",
  },
]

export default function AiMarketingAssetCreationPage() {
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'MyAppFac', url: '/resources/myappfac' },
    { name: 'AI Marketing Asset Creation', url: '/resources/myappfac/ai-marketing-asset-creation' },
  ])
  const article = articleSchema({
    headline: 'AI Marketing Asset Creation for Small Businesses',
    description: 'What AI marketing asset creation actually means today, and which of it MyAppFac generates live.',
    path: '/resources/myappfac/ai-marketing-asset-creation',
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
          <span className="text-gray-900">AI Marketing Asset Creation</span>
        </nav>

        <p className="text-label text-brand-electric mb-3">MyAppFac Guide</p>
        <h1 className="text-headline text-gray-900 mb-6">AI Marketing Asset Creation for Small Businesses</h1>

        <div className="prose-content">
          <p>
            &quot;AI marketing tool&quot; has become a crowded, often overpromised category. Most small
            business owners have run into at least one that generates something -- an image, a caption -- but
            falls apart the moment you need a real, campaign-ready asset. The honest question worth asking
            about any of these tools is simple: what does it actually produce, right now, without a provider
            key missing or a feature quietly not working?
          </p>

          <h2>What &quot;marketing asset creation&quot; should mean</h2>
          <p>
            Not one generic image generator bolted onto a chat interface. A real asset-creation toolkit for a
            small business needs to cover the actual formats a campaign uses: social posts and carousels for
            organic reach, static ad creatives for paid placement, video for platforms where video wins
            attention, voiceover for anything that needs narration, and a way to bundle a brief and storyboard
            so the assets aren&apos;t created in a vacuum.
          </p>

          <h2>What MyAppFac generates today</h2>
          <p>
            Seven capabilities, all real and working in Studio: <strong>Social Content</strong> (posts and
            carousels), <strong>Design</strong> (static ad creatives and images), <strong>Promo Video</strong>{' '}
            (short AI-generated promotional video), <strong>Avatar Video</strong> (talking-head spokesperson
            video via HeyGen), <strong>Voiceover</strong> (AI text-to-speech narration), and{' '}
            <strong>Campaign Pack</strong> (a bundled brief, storyboard, and assets in one pass). A seventh,{' '}
            <strong>Competitor Research</strong>, sits alongside these to ground creation in an actual
            understanding of the market first.
          </p>

          <h2>What&apos;s not live yet -- stated honestly</h2>
          <p>
            Auto-posting, ad-inspiration browsing, content strategy planning, and workflow/scheduling
            automation are on MyAppFac&apos;s roadmap but not built. If a page or a tool claims otherwise,
            that claim is wrong -- MyAppFac&apos;s own product truth discipline treats an unbuilt feature
            marketed as live as a defect, not a rounding error.
          </p>
        </div>

        <div className="card-panel bg-gray-50 border-brand-electric/20 mt-12 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Generate a real campaign asset</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://myappfac.com/studio" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
              Open MyAppFac Studio &rarr;
            </a>
            <Link href="/resources/myappfac/ai-video-marketing" className="btn-secondary inline-block">
              AI Video Marketing Guide
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
          <Link href="/resources/myappfac/ai-video-marketing" className="text-brand-electric underline">
            AI Video Marketing for Trades and Contractors
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
