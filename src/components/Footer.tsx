import Link from 'next/link'
import { BrandWordmark } from '@/components/brand/BrandWordmark'

const resourceLinks = [
  { href: '/resources', label: 'All Resources' },
  { href: '/resources/hvac', label: 'HVAC' },
  { href: '/resources/electrical', label: 'Electrical' },
  { href: '/resources/plumbing', label: 'Plumbing' },
  { href: '/resources/roofing', label: 'Roofing' },
  { href: '/resources/landscaping', label: 'Landscaping' },
  { href: '/resources/general-contracting', label: 'General Contracting' },
  { href: '/resources/pest-control', label: 'Pest Control' },
  { href: '/resources/painting', label: 'Painting' },
  { href: '/resources/cleaning-services', label: 'Cleaning Services' },
  { href: '/resources/garage-door-repair', label: 'Garage Door Repair' },
  { href: '/resources/appliance-repair', label: 'Appliance Repair' },
  { href: '/resources/water-damage-restoration', label: 'Water Damage Restoration' },
  { href: '/resources/security-and-alarm', label: 'Security and Alarm' },
  { href: '/resources/business-operations', label: 'Business Operations' },
  { href: '/resources/ai-for-contractors', label: 'AI for Contractors' },
]

const toolsLinks = [
  { href: '/resources/tools/follow-up-revenue-calculator', label: 'Follow-Up Revenue Calculator' },
  { href: '/resources/tools/estimate-follow-up-priority-calculator', label: 'Estimate Priority Calculator' },
  { href: '/revenue-leak-check', label: 'Revenue Leak Check' },
]

const companyLinks = [
  { href: '/about', label: 'About & Ownership' },
  { href: '/contact', label: 'Contact' },
]

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
]

const pathwayLinks = [
  { href: '/modern-trades-crm', label: 'Modern Trades CRM' },
  { href: 'https://www.themoderntradesmentor.com', label: 'The Modern Trades Mentor' },
]

export function Footer() {
  return (
    <footer className="dark-section border-t border-white/5 mt-0">
      <div className="section-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 lg:gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <BrandWordmark size="sm" variant="dark" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Contractor revenue-leak intelligence, published by SubZero Metrix.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Resources</p>
            <nav className="space-y-2.5" aria-label="Resources">
              {resourceLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Tools</p>
            <nav className="space-y-2.5" aria-label="Tools">
              {toolsLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Related Pathways</p>
            <nav className="space-y-2.5" aria-label="Related Pathways">
              {pathwayLinks.map((link) => (
                <a key={link.href} href={link.href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Company</p>
            <nav className="space-y-2.5" aria-label="Company">
              {companyLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
              <a href="mailto:info@subzerometrix.com" className="block text-sm text-gray-400 hover:text-white transition-colors">
                info@subzerometrix.com
              </a>
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Legal</p>
            <nav className="space-y-2.5" aria-label="Legal">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 space-y-2">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} SubZeroMetrix LLC. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 max-w-2xl">
            SubZeroMetrix.com is owned and published by SubZeroMetrix LLC. Modern Trades CRM and The Modern Trades
            Mentor are affiliated offerings, not independent third parties.
          </p>
        </div>
      </div>
    </footer>
  )
}
