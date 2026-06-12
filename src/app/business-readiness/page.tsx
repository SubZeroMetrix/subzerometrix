import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { buildOpenGraph, buildTwitter, faqPageJsonLd, type FaqEntry } from '@/lib/seo'
import ShareReferralCard from '@/components/ShareReferralCard'

const TITLE = 'Business Readiness for Contractors & Trades'
const DESCRIPTION =
  'What business readiness means for contractors, tradespeople, and service-business owners — and how a free Starter MetrixScore™ helps you see your gaps and next steps. Educational only.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/business-readiness' },
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION, path: '/business-readiness' }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
}

// Honest Q&A — also emitted as FAQPage structured data.
const FAQ: FaqEntry[] = [
  {
    question: 'What is business readiness?',
    answer:
      'Business readiness is how prepared a business is across the areas that determine whether it survives and grows — foundation and legal setup, finances and pricing, sales and marketing, operations, customer experience, people, and growth/risk. Readiness is not about how skilled you are at the work; it is about the business behind the work.',
  },
  {
    question: 'What is contractor business readiness?',
    answer:
      'Contractor business readiness applies the same idea to a trade or service business: is your entity, licensing, insurance, banking, pricing, lead generation, and job workflow set up so the business can run profitably and handle growth? It is the difference between being busy and being a stable, profitable company.',
  },
  {
    question: 'What is a Starter MetrixScore™?',
    answer:
      'The Starter MetrixScore™ is a free, 0-to-100 business-readiness score generated from a short assessment. It is a starting-point snapshot that becomes more accurate as you complete more of your profile. It is not a final, benchmarked, or predictive score.',
  },
  {
    question: 'What should someone check before starting a contractor or service business?',
    answer:
      'Common areas to confirm include: business entity and registration, required licensing and insurance, a separate business bank account, real pricing that covers costs and profit, a way to generate and follow up on leads, and a basic job/operations workflow. Always verify licensing, registration, insurance, tax, and permitting requirements with official state and local sources.',
  },
  {
    question: 'How does SubZeroMetrix™ help?',
    answer:
      'SubZeroMetrix™ helps contractors, tradespeople, and service-business owners assess readiness, see their strengths and risk areas, follow a practical action roadmap, track actions and their own KPIs, and reassess over time to see progress.',
  },
  {
    question: 'What does SubZeroMetrix™ not do?',
    answer:
      'SubZeroMetrix™ is educational only. It does not provide legal, tax, financial, licensing, or compliance advice, and it does not guarantee business success, search rankings, leads, or any specific outcome. For broad, non-trade business types it offers a general readiness framework, but recommendations may be less industry-specific.',
  },
]

function QA({ entry }: { entry: FaqEntry }) {
  return (
    <section className="glass rounded-2xl p-5">
      <h2 className="font-display text-base tracking-wide text-brand-white mb-2">{entry.question}</h2>
      <p className="text-[13px] text-brand-silver leading-relaxed">{entry.answer}</p>
    </section>
  )
}

export default function BusinessReadinessPage() {
  return (
    <main className="min-h-dvh bg-brand-navy">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQ)) }}
      />

      <div className="px-5 pt-5 pb-4 border-b border-brand-blue/40"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)' }}>
        <Link href="/" className="inline-flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs tracking-wide">Home</span>
        </Link>
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-1">Business Readiness</p>
        <h1 className="font-display text-3xl tracking-wider text-brand-white leading-tight">
          BUSINESS READINESS FOR CONTRACTORS &amp; TRADES
        </h1>
        <p className="text-[12px] text-brand-silver mt-2 leading-relaxed">{DESCRIPTION}</p>
      </div>

      <div className="px-5 max-w-md mx-auto w-full pb-12 pt-6 space-y-4">
        {FAQ.map(entry => <QA key={entry.question} entry={entry} />)}

        {/* Share this readiness guide (manual share only) */}
        <ShareReferralCard context="business_readiness" />

        <Link href="/start"
          className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl text-sm font-semibold tracking-wide uppercase bg-brand-accent text-white shadow-glow-blue active:scale-[0.98] transition-all touch-target">
          Get your free Starter MetrixScore™ <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
          {[['Resources', '/resources'], ['About', '/about'], ['Disclaimer', '/disclaimer']].map(([label, href]) => (
            <Link key={href} href={href} className="text-[12px] text-brand-accent hover:underline underline-offset-2">
              {label}
            </Link>
          ))}
        </div>

        <p className="text-[10px] text-brand-silver/50 leading-relaxed pt-2">
          Educational only. Not legal, tax, financial, licensing, or compliance advice.
          SubZeroMetrix™ and MetrixScore™ are trademarks of The Modern Trades Mentor LLC.
        </p>
      </div>
    </main>
  )
}
