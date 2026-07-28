import Link from 'next/link'
import Image from 'next/image'

const productLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#buster', label: 'Meet Buster' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#trust', label: 'Trust & Security' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
]

const resourceLinks = [
  { href: '/resources', label: 'All Resources' },
  { href: '/resources/hvac', label: 'HVAC' },
  { href: '/resources/hvac/recurring-revenue', label: 'HVAC Recurring Revenue' },
  { href: '/resources/facility-management', label: 'Facility Management' },
  { href: '/resources/facility-management/facility-optimization', label: 'Facility Optimization' },
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
  { href: '/resources/business-operations/dispatch-and-scheduling', label: 'Dispatch and Scheduling' },
  { href: '/resources/ai-for-contractors', label: 'AI for Contractors' },
]

const myAppFacLinks = [
  { href: '/resources/myappfac', label: 'MyAppFac Overview' },
  { href: '/resources/myappfac/business-operating-systems', label: 'Business Operating Systems' },
  { href: '/resources/myappfac/ai-marketing-asset-creation', label: 'AI Marketing Asset Creation' },
  { href: '/resources/myappfac/replace-multiple-tools', label: 'Replace Multiple Tools' },
  { href: '/resources/myappfac/ai-video-marketing', label: 'AI Video Marketing' },
  { href: '/resources/myappfac/crm-and-marketing-stack', label: 'CRM and Marketing Stack' },
]

const toolsAndGuidesLinks = [
  { href: '/resources/tools/follow-up-revenue-calculator', label: 'Follow-Up Revenue Calculator' },
  { href: '/resources/tools/estimate-follow-up-priority-calculator', label: 'Estimate Priority Calculator' },
  { href: '/guides', label: 'Guides' },
  { href: '/compare', label: 'Compare' },
  { href: '/tools', label: 'Tools' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/tool-finder', label: 'Tool Finder' },
  { href: '/help', label: 'Help Center' },
]

const companyLinks = [
  { href: '/about', label: 'About' },
  { href: '/about/richard-fritzke', label: 'Richard Fritzke' },
  { href: '/contact', label: 'Contact' },
  { href: '/buster', label: 'Ask Buster' },
  { href: '/customer-care', label: 'Customer Care' },
  { href: '/customer-care/qualify', label: 'Customer Care: Qualify' },
  { href: '/customer-care/refer', label: 'Customer Care: Refer' },
]

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
  { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
  { href: '/editorial-policy', label: 'Editorial Policy' },
  { href: '/editorial-methodology', label: 'Editorial Methodology' },
]

export function Footer() {
  return (
    <footer className="dark-section border-t border-white/5 mt-0">
      <div className="section-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-10 lg:gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block mb-5 bg-white rounded-lg p-2">
              <Image
                src="/brand/metrix-command-center-logo.png"
                alt="Metrix Command Center"
                width={140}
                height={49}
                style={{ width: 140, height: 49, objectFit: 'contain' }}
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Metrix prepares the work. You approve what happens next. By SubZero Metrix LLC.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Product</p>
            <nav className="space-y-2.5" aria-label="Product">
              {productLinks.map((link) => (
                <a key={link.href} href={link.href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {link.label}
                </a>
              ))}
            </nav>
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
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">MyAppFac</p>
            <nav className="space-y-2.5" aria-label="MyAppFac">
              {myAppFacLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Tools &amp; Guides</p>
            <nav className="space-y-2.5" aria-label="Tools and Guides">
              {toolsAndGuidesLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {link.label}
                </Link>
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

        <div className="mt-14 pt-8 border-t border-white/10">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} SubZero Metrix LLC. All rights reserved. Metrix Command Center&trade; is a product of SubZero Metrix LLC.
          </p>
        </div>
      </div>
    </footer>
  )
}
