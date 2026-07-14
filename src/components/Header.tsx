'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BrandWordmark } from '@/components/brand/BrandWordmark'

const MCC_LOGIN_URL = 'https://mcc.subzerometrix.com/login'
const MCC_SIGNUP_URL = 'https://mcc.subzerometrix.com/signup'

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#buster', label: 'Meet Buster' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/resources', label: 'Resources' },
  { href: '/help', label: 'Help' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-border">
      <div className="section-container flex items-center justify-between h-16">
        <Link href="/" className="shrink-0" aria-label="Metrix Command Center home" onClick={() => setMobileOpen(false)}>
          <BrandWordmark size="sm" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={MCC_LOGIN_URL}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-gray-700 border border-gray-300 hover:border-brand-electric hover:text-brand-electric transition-all"
          >
            Log In
          </a>
          <a href={MCC_SIGNUP_URL} className="btn-primary text-sm px-6 py-2.5">
            Start Free Trial
          </a>
        </div>

        <button
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-white overflow-y-auto" role="dialog" aria-label="Mobile navigation">
          <nav className="section-container py-6 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-surface-light-muted"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-surface-border space-y-3">
              <a href={MCC_LOGIN_URL} className="btn-secondary w-full text-center block">Log In</a>
              <a href={MCC_SIGNUP_URL} className="btn-primary w-full text-center block">Start Free Trial</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
