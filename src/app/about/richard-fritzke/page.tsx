import Link from 'next/link'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://subzerometrix.com'

export const metadata = buildMetadata({
  title: 'Richard Fritzke — Founder & Editor-in-Chief',
  description: 'Richard Fritzke is the founder and editor-in-chief of SubZero Metrix. 24+ years of HVAC/R, facilities, and operations leadership experience.',
  path: '/about/richard-fritzke',
})

function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Richard Fritzke',
    url: `${SITE_URL}/about/richard-fritzke`,
    jobTitle: 'Founder & Editor-in-Chief',
    worksFor: {
      '@type': 'Organization',
      name: 'SubZero Metrix LLC',
      url: SITE_URL,
    },
    knowsAbout: [
      'HVAC/R',
      'Facilities Management',
      'Operations Leadership',
      'Online Business Software',
      'Affiliate Marketing',
      'Applied AI',
    ],
  }
}

export default function RichardFritzkePage() {
  const crumbs = breadcrumbSchema([
    { name: 'About', url: '/about' },
    { name: 'Richard Fritzke', url: '/about/richard-fritzke' },
  ])

  return (
    <div className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />

      <div className="section-container max-w-3xl">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/about" className="hover:text-brand-cyan">About</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">Richard Fritzke</span>
        </nav>

        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-brand-blue flex items-center justify-center text-brand-cyan font-bold text-3xl shrink-0">
            R
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Richard Fritzke</h1>
            <p className="text-brand-cyan mt-1">Founder &amp; Editor-in-Chief, SubZero Metrix</p>
          </div>
        </div>

        <div className="prose-content">
          <h2>About</h2>
          <p>
            Richard Fritzke is the founder and editor-in-chief of SubZero Metrix,
            an independent software comparison platform that helps entrepreneurs,
            creators, and business owners choose the right tools for online business
            growth.
          </p>
          <p>
            He brings over 24 years of hands-on experience in HVAC/R (heating,
            ventilation, air conditioning, and refrigeration), facilities management,
            and operations leadership. Over the course of his career, Richard has
            led teams of 20 or more technicians and supported operations across
            40 or more commercial locations.
          </p>

          <h2>Professional Background</h2>
          <p>
            Richard&apos;s career spans field operations, team leadership, and systems
            thinking in demanding technical environments. That background informs
            the practical, no-nonsense editorial approach at SubZero Metrix: tools
            are evaluated for real-world fit, not marketing polish.
          </p>
          <p>
            His current work includes applied AI research and development, exploring
            how artificial intelligence tools can support small business operations,
            content creation, and decision-making.
          </p>

          <h2>Other Ventures</h2>
          <p>
            Richard is the creator of{' '}
            <strong>The Modern Trades Mentor</strong>, an education and mentorship
            platform for tradespeople and contractors building businesses in skilled
            trades.
          </p>
          <p>
            He also created <strong>Metrix Score&trade;</strong>, a business
            intelligence and guided action system for contractors and service
            businesses.
          </p>

          <h2>Editorial Role at SubZero Metrix</h2>
          <p>
            As editor-in-chief, Richard oversees the editorial methodology,
            product evaluation criteria, and recommendation standards across
            SubZero Metrix. All published content reflects the platform&apos;s
            commitment to honest, use-case-driven recommendations that are
            independent of affiliate compensation.
          </p>
          <p>
            See the{' '}
            <Link href="/editorial-policy">editorial policy</Link> and{' '}
            <Link href="/editorial-methodology">editorial methodology</Link>{' '}
            for details on how products are evaluated and ranked.
          </p>

          <h2>Disclaimer</h2>
          <p>
            Content and views expressed are educational and informational. They do
            not represent an endorsement or official position of any government
            agency, Department of Defense organization, customer, or employer.
          </p>

          <h2>Contact</h2>
          <p>
            Have a correction, question, or suggestion?{' '}
            <Link href="/contact">Contact SubZero Metrix</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
