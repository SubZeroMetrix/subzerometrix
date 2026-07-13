import Link from 'next/link'
import Image from 'next/image'

const productLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

const companyLinks = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
]

export function Footer() {
  return (
    <footer className="dark-section border-t border-white/5 mt-0">
      <div className="section-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
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
              The governed AI business operating system for service companies, by SubZero Metrix LLC.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Product</p>
            <nav className="space-y-2.5" aria-label="Product">
              {productLinks.map((link) => (
                <a key={link.href} href={link.href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Company</p>
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

        <div className="mt-14 pt-8 border-t border-white/10">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} SubZero Metrix LLC. All rights reserved. Metrix Command Center&trade; is a product of SubZero Metrix LLC.
          </p>
        </div>
      </div>
    </footer>
  )
}
