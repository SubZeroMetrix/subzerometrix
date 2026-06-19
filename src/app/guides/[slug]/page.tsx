import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { AffiliateDisclosureInline } from '@/components/AffiliateDisclosureInline'
import type { Metadata } from 'next'

const guidesContent: Record<string, { title: string; description: string; body: string }> = {
  'best-email-marketing-tools': {
    title: 'Best Email Marketing Tools for Beginners',
    description: 'A guide to choosing your first email marketing platform based on budget, features, and use case.',
    body: `Starting email marketing can feel overwhelming when every platform promises to be "the best." The truth is that the right tool depends on your budget, list size, and what you actually need to do with email.

## Free Options for Getting Started

If you have fewer than 1,000 subscribers and want to learn email marketing without spending money, MailerLite and Kit both offer solid free plans. MailerLite gives you automation and landing pages on the free tier. Kit is built for creators who want subscriber-first email and eventual paid newsletters.

## When You Need More Automation

Once your list grows and you need multi-step automations, conditional logic, and CRM features, platforms like GetResponse and ActiveCampaign become more relevant. GetResponse adds webinars and funnels. ActiveCampaign provides deeper automation and a built-in CRM.

## Newsletter-First Platforms

If your primary goal is publishing and monetizing a newsletter, beehiiv is purpose-built for this use case with growth tools, referral systems, and ad network monetization.

## How to Decide

Start with what you need now, not what you might need in two years. Use the SubZero Metrix Tool Finder to get a personalized recommendation based on your current stage and goals.`,
  },
  'all-in-one-vs-best-of-breed': {
    title: 'All-in-One vs Best-of-Breed: Which Approach Is Right?',
    description: 'When to use a single platform for everything vs specialized tools for each function.',
    body: `One of the first decisions in building your online business stack is whether to use a single all-in-one platform or assemble specialized tools for each function.

## The Case for All-in-One

Platforms like Systeme.io bundle funnels, email, courses, memberships, and affiliate management into one tool. This works well when you're starting out because there's nothing to integrate, one login to manage, and often a free or low-cost plan to begin with. You avoid the complexity of connecting multiple services.

## The Case for Specialists

As your business grows, you may need features that all-in-one platforms don't do deeply — advanced email automation (ActiveCampaign), dedicated e-commerce (Shopify), or comprehensive SEO tools (Semrush). Specialist tools tend to be better at their specific job, but you pay for each one separately.

## A Practical Middle Ground

Start with an all-in-one platform to validate your business model. Once you hit a clear limitation — you need advanced segmentation, or your store needs real inventory management — move that specific function to a specialist. Don't pre-optimize for scale you haven't reached.`,
  },
  'newsletter-platforms-compared': {
    title: 'Newsletter Platforms Compared',
    description: 'How to choose between newsletter-focused platforms like beehiiv and Kit.',
    body: `Newsletters have become a legitimate business model, and the platforms serving newsletter creators have evolved rapidly. Here is how the main options compare.

## beehiiv

Built specifically for newsletter operators. Key strengths: growth tools (referral programs, recommendations), built-in ad network monetization, and audience analytics. Best for people who want to build a newsletter-first business with multiple revenue streams.

## Kit (formerly ConvertKit)

Started as a creator email platform and has added paid subscriptions and a tip jar for newsletter monetization. Stronger on general email marketing features like visual automations and subscriber tagging. Best for creators who want email marketing capabilities alongside their newsletter.

## Key Differences

beehiiv is more focused on newsletter growth and monetization through ads and referrals. Kit gives you more traditional email marketing power with the added ability to charge for subscriptions. If your primary revenue model is ad-supported newsletters, beehiiv has the edge. If you want to sell courses, products, or paid subscriptions alongside your newsletter, Kit may be more flexible.

## What About MailerLite?

MailerLite works well for newsletters too, especially if budget matters. Its free plan supports up to 1,000 subscribers with automation and landing pages. It lacks the newsletter-specific growth tools of beehiiv but is a strong option for getting started.`,
  },
}

export function generateStaticParams() {
  return Object.keys(guidesContent).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = guidesContent[params.slug]
  if (!guide) return {}

  return buildMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${params.slug}`,
  })
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = guidesContent[params.slug]
  if (!guide) notFound()

  const crumbs = breadcrumbSchema([
    { name: 'Guides', url: '/guides' },
    { name: guide.title, url: `/guides/${params.slug}` },
  ])

  const paragraphs = guide.body.split('\n\n')

  return (
    <div className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />

      <div className="section-container max-w-3xl">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/guides" className="hover:text-brand-cyan">Guides</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">{guide.title}</span>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-8">{guide.title}</h1>

        <div className="prose-content">
          {paragraphs.map((para, i) => {
            if (para.startsWith('## ')) {
              return <h2 key={i}>{para.replace('## ', '')}</h2>
            }
            return <p key={i}>{para}</p>
          })}
        </div>

        <div className="mt-12">
          <Link href="/tool-finder" className="btn-primary">
            Get a Personalized Recommendation
          </Link>
        </div>

        <AffiliateDisclosureInline />
      </div>
    </div>
  )
}
