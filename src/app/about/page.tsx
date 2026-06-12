import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import {
  DEFAULT_DESCRIPTION, buildOpenGraph, buildTwitter, softwareApplicationJsonLd,
} from '@/lib/seo'

const TITLE = 'About'
const DESCRIPTION =
  'About SubZeroMetrix™ — a business-readiness platform by The Modern Trades Mentor LLC that helps contractors, tradespeople, and service-business owners assess readiness and identify practical next steps. Educational only.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: buildOpenGraph({ title: 'About SubZeroMetrix™', description: DESCRIPTION, path: '/about' }),
  twitter: buildTwitter({ title: 'About SubZeroMetrix™', description: DESCRIPTION }),
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-2xl p-5">
      <h2 className="font-display text-lg tracking-wider text-brand-white mb-2">{title}</h2>
      <div className="text-[13px] text-brand-silver leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-brand-navy">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd()) }}
      />

      <div className="px-5 pt-5 pb-4 border-b border-brand-blue/40"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)' }}>
        <Link href="/" className="inline-flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs tracking-wide">Home</span>
        </Link>
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-1">About</p>
        <h1 className="font-display text-3xl tracking-wider text-brand-white leading-none">
          ABOUT SUBZERO<span className="text-brand-accent">METRIX</span>™
        </h1>
        <p className="text-[12px] text-brand-silver mt-2 leading-relaxed">{DEFAULT_DESCRIPTION}</p>
      </div>

      <div className="px-5 max-w-md mx-auto w-full pb-12 pt-6 space-y-4">
        <Section title="What SubZeroMetrix™ is">
          <p>
            SubZeroMetrix™ is a business-readiness platform owned and operated by
            The Modern Trades Mentor LLC. It helps contractors, tradespeople, and
            service-business owners assess business readiness and identify practical
            next steps.
          </p>
        </Section>

        <Section title="What the MetrixScore™ means">
          <p>
            Your MetrixScore™ is a business-readiness score from a short assessment.
            The free Starter MetrixScore™ is a starting point that becomes more
            accurate as you complete more of your profile. It is a readiness snapshot,
            not a final, benchmarked, or predictive score.
          </p>
        </Section>

        <Section title="Who it helps today">
          <p>
            SubZeroMetrix™ is currently strongest for contractors, tradespeople, and
            service-business owners — for example HVAC, electrical, plumbing, roofing,
            landscaping, cleaning, handyman, and painting businesses.
          </p>
        </Section>

        <Section title="Why it exists">
          <p>
            Most trade and service businesses fail not from lack of skill, but from
            gaps in the business behind the work. SubZeroMetrix™ exists to make those
            gaps visible early and give owners a clear, practical path to close them.
          </p>
        </Section>

        <Section title="How to use it">
          <p>
            Take the assessment, review your readiness and risk areas, follow the
            recommended roadmap and actions, track the numbers that matter to you, and
            reassess over time to see your progress.
          </p>
        </Section>

        <Section title="What it does not do">
          <p>
            SubZeroMetrix™ is educational only. It is not legal, tax, financial,
            licensing, or compliance advice, and it does not guarantee business
            success, rankings, leads, or any specific outcome. Always confirm
            licensing, registration, insurance, tax, and permitting requirements with
            official state and local sources.
          </p>
        </Section>

        <Link href="/start"
          className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl text-sm font-semibold tracking-wide uppercase bg-brand-accent text-white shadow-glow-blue active:scale-[0.98] transition-all touch-target">
          Take the free assessment <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
          {[['Resources', '/resources'], ['Partners', '/partners'], ['Disclaimer', '/disclaimer'], ['Terms', '/terms']].map(([label, href]) => (
            <Link key={href} href={href} className="text-[12px] text-brand-accent hover:underline underline-offset-2">
              {label}
            </Link>
          ))}
        </div>

        <p className="text-[10px] text-brand-silver/50 leading-relaxed pt-2">
          SubZeroMetrix™ and MetrixScore™ are trademarks of The Modern Trades Mentor LLC.
        </p>
      </div>
    </main>
  )
}
