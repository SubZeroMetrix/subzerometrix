import Link from 'next/link'
import Image from 'next/image'

const footerLinks = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms' },
  { href: '/editorial-policy', label: 'Editorial Policy' },
]

export function Footer() {
  return (
    <footer className="bg-brand-navy border-t border-gray-800 mt-20">
      <div className="section-container py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/brand/subzero-metrix-logo.png"
                alt="SubZero Metrix"
                width={36}
                height={36}
                className="rounded"
              />
              <span className="text-lg font-bold text-white">SubZero Metrix</span>
            </Link>
            <p className="text-sm text-gray-400">
              SubZero Metrix compares software for websites, email, automation,
              ecommerce, newsletters, SEO, and online-business growth.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-3" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 hover:text-brand-cyan transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} SubZero Metrix LLC. All rights reserved. SubZero Metrix&trade; is a trademark of SubZero Metrix LLC.
          </p>
          <p className="text-xs text-gray-500">
            Some links on this site are affiliate links. See our{' '}
            <Link href="/affiliate-disclosure" className="text-gray-400 hover:text-brand-cyan underline">
              affiliate disclosure
            </Link>{' '}
            for details.
          </p>
        </div>
      </div>
    </footer>
  )
}
