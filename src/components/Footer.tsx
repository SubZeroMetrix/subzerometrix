import Link from 'next/link'
import Image from 'next/image'

const solutionLinks = [
  { href: '/tools?use-case=start-online-business', label: 'Start an Online Business' },
  { href: '/tools?use-case=build-website', label: 'Build a Website' },
  { href: '/tools?use-case=grow-email-list', label: 'Grow an Email List' },
  { href: '/tools?use-case=launch-newsletter', label: 'Launch a Newsletter' },
  { href: '/tools?use-case=sell-online', label: 'Sell Online' },
  { href: '/tools?use-case=automate-marketing', label: 'Automate Marketing' },
  { href: '/tools?use-case=improve-seo', label: 'Improve SEO' },
  { href: '/tools?use-case=run-b2b-outreach', label: 'Run B2B Outreach' },
]

const exploreLinks = [
  { href: '/tools', label: 'Tools' },
  { href: '/compare', label: 'Comparisons' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/guides', label: 'Guides' },
  { href: '/tool-finder', label: 'Tool Finder' },
]

const companyLinks = [
  { href: '/about', label: 'About SubZero Metrix' },
  { href: '/about/richard-fritzke', label: 'Richard Fritzke' },
  { href: '/editorial-methodology', label: 'Editorial Methodology' },
  { href: '/contact', label: 'Contact' },
]

const legalLinks = [
  { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
  { href: '/editorial-policy', label: 'Editorial Policy' },
]

export function Footer() {
  return (
    <footer className="dark-section border-t border-white/5 mt-0">
      <div className="section-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <Image src="/brand/subzero-metrix-logo.png" alt="SubZero Metrix" width={32} height={32} className="rounded" />
              <span className="text-sm font-bold text-white tracking-tight">SubZero Metrix</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Independent software intelligence for building and growing online businesses.
            </p>
          </div>

          {/* Solutions */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Solutions</p>
            <nav className="space-y-2.5" aria-label="Solutions">
              {solutionLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Explore</p>
            <nav className="space-y-2.5" aria-label="Explore">
              {exploreLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Company</p>
            <nav className="space-y-2.5" aria-label="Company">
              {companyLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Legal</p>
            <nav className="space-y-2.5" aria-label="Legal">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} SubZero Metrix LLC. All rights reserved. SubZero Metrix&trade; is a trademark of SubZero Metrix LLC.
          </p>
          <p className="text-xs text-gray-500">
            Some links on this site are affiliate links. See our{' '}
            <Link href="/affiliate-disclosure" className="text-gray-400 hover:text-white underline">
              affiliate disclosure
            </Link>{' '}
            for details.
          </p>
        </div>
      </div>
    </footer>
  )
}
