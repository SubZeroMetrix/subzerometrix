'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
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
  { href: '/buster', label: 'Ask Buster' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  function close() {
    setMobileOpen(false)
    buttonRef.current?.focus()
  }

  useEffect(() => {
    if (!mobileOpen) return

    // Focus the first link so keyboard/screen-reader users land inside the
    // panel immediately, and restore body scroll prevention while open.
    firstLinkRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    function onClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        close()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [mobileOpen])

  return (
    <>
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
            ref={buttonRef}
            type="button"
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-electric"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
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
      </header>

      {/* Rendered as a sibling of <header>, not a descendant -- the header
          has backdrop-blur-md (backdrop-filter), which per spec creates a
          new containing block for position:fixed descendants. A fixed
          panel nested inside it resolves "fixed" relative to the ~64px
          header box instead of the viewport, collapsing to zero height
          and becoming invisible despite every visibility-related CSS
          property reading correctly. Keeping this outside the header
          avoids that entirely. */}
      {mobileOpen && (
        <div
          id="mobile-nav-panel"
          ref={panelRef}
          className="lg:hidden fixed top-16 left-0 right-0 bottom-0 z-40 bg-white overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="section-container py-6 space-y-1" aria-label="Mobile">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                ref={i === 0 ? firstLinkRef : undefined}
                href={link.href}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-surface-light-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-electric"
                onClick={close}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/customer-care"
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-surface-light-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-electric"
              onClick={close}
            >
              Customer Care
            </a>
            <a
              href="/about"
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-surface-light-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-electric"
              onClick={close}
            >
              About
            </a>
            <div className="pt-4 border-t border-surface-border space-y-3">
              <a href={MCC_LOGIN_URL} className="btn-secondary w-full text-center block">Log In</a>
              <a href={MCC_SIGNUP_URL} className="btn-primary w-full text-center block">Start Free Trial</a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
