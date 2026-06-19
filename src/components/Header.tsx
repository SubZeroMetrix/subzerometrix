'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'

const solutions = [
  { href: '/tools?use-case=start-online-business', label: 'Start an Online Business', color: 'bg-blue-500' },
  { href: '/tools?use-case=build-website', label: 'Build a Website', color: 'bg-indigo-500' },
  { href: '/tools?use-case=grow-email-list', label: 'Grow an Email List', color: 'bg-cyan-500' },
  { href: '/tools?use-case=launch-newsletter', label: 'Launch a Newsletter', color: 'bg-teal-500' },
  { href: '/tools?use-case=sell-online', label: 'Sell Online', color: 'bg-emerald-500' },
  { href: '/tools?use-case=automate-marketing', label: 'Automate Marketing', color: 'bg-amber-500' },
  { href: '/tools?use-case=improve-seo', label: 'Improve SEO', color: 'bg-violet-500' },
  { href: '/tools?use-case=run-b2b-outreach', label: 'Run B2B Outreach', color: 'bg-rose-500' },
]

const explore = [
  { href: '/tools', label: 'Tools' },
  { href: '/compare', label: 'Comparisons' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/guides', label: 'Guides' },
  { href: '/tool-finder', label: 'Tool Finder' },
]

const company = [
  { href: '/about', label: 'About SubZero Metrix' },
  { href: '/about/richard-fritzke', label: 'Richard Fritzke' },
  { href: '/editorial-methodology', label: 'Editorial Methodology' },
  { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
]

type MenuKey = 'solutions' | 'explore' | 'company' | null

export function Header() {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  const closeAll = useCallback(() => {
    setOpenMenu(null)
    setMobileOpen(false)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeAll()
    }
    function onClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [closeAll])

  function toggle(key: MenuKey) {
    setOpenMenu(openMenu === key ? null : key)
  }

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-border">
      <div className="section-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="SubZero Metrix home" onClick={closeAll}>
          <Image src="/brand/subzero-metrix-logo.png" alt="SubZero Metrix" width={36} height={36} className="rounded" priority />
          <span className="text-base font-bold text-brand-navy hidden sm:block tracking-tight">SubZero Metrix</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {(['solutions', 'explore', 'company'] as MenuKey[]).map((key) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                openMenu === key ? 'text-brand-electric bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              aria-expanded={openMenu === key}
              aria-haspopup="true"
            >
              {key === 'solutions' ? 'Solutions' : key === 'explore' ? 'Explore' : 'Company'}
              <svg className={`inline-block ml-1 w-3.5 h-3.5 transition-transform ${openMenu === key ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/compare" className="btn-ghost">Compare Tools</Link>
          <Link href="/tool-finder" className="btn-primary text-sm px-6 py-2.5">Build My Stack</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
          onClick={() => setMobileOpen(!mobileOpen)}
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

      {/* Desktop Mega Menus */}
      {openMenu === 'solutions' && (
        <div className="hidden lg:block absolute left-0 right-0 top-full" role="menu">
          <div className="section-container py-4">
            <div className="mega-menu p-6">
              <p className="text-label mb-4">I want to&hellip;</p>
              <div className="grid grid-cols-4 gap-3">
                {solutions.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-light-muted transition-colors group"
                    onClick={closeAll}
                    role="menuitem"
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${s.color} shrink-0`} aria-hidden="true" />
                    <span className="text-sm text-gray-700 group-hover:text-brand-electric font-medium">{s.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {openMenu === 'explore' && (
        <div className="hidden lg:block absolute left-0 right-0 top-full" role="menu">
          <div className="section-container py-4">
            <div className="mega-menu p-6 max-w-md">
              <p className="text-label mb-4">Browse</p>
              <div className="space-y-1">
                {explore.map((e) => (
                  <Link
                    key={e.href}
                    href={e.href}
                    className="block px-3 py-2.5 rounded-xl text-sm text-gray-700 font-medium hover:bg-surface-light-muted hover:text-brand-electric transition-colors"
                    onClick={closeAll}
                    role="menuitem"
                  >
                    {e.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {openMenu === 'company' && (
        <div className="hidden lg:block absolute left-0 right-0 top-full" role="menu">
          <div className="section-container py-4">
            <div className="mega-menu p-6 max-w-sm">
              <p className="text-label mb-4">Company</p>
              <div className="space-y-1">
                {company.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="block px-3 py-2.5 rounded-xl text-sm text-gray-700 font-medium hover:bg-surface-light-muted hover:text-brand-electric transition-colors"
                    onClick={closeAll}
                    role="menuitem"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Panel */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-white overflow-y-auto" role="dialog" aria-label="Mobile navigation">
          <nav className="section-container py-6 space-y-8">
            <div>
              <p className="text-label mb-3">Solutions</p>
              <div className="space-y-1">
                {solutions.map((s) => (
                  <Link key={s.href} href={s.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-surface-light-muted" onClick={closeAll}>
                    <span className={`w-2 h-2 rounded-full ${s.color}`} aria-hidden="true" />
                    <span className="text-sm font-medium">{s.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-label mb-3">Explore</p>
              <div className="space-y-1">
                {explore.map((e) => (
                  <Link key={e.href} href={e.href} className="block px-3 py-2.5 rounded-xl text-sm text-gray-700 font-medium hover:bg-surface-light-muted" onClick={closeAll}>{e.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-label mb-3">Company</p>
              <div className="space-y-1">
                {company.map((c) => (
                  <Link key={c.href} href={c.href} className="block px-3 py-2.5 rounded-xl text-sm text-gray-700 font-medium hover:bg-surface-light-muted" onClick={closeAll}>{c.label}</Link>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-surface-border space-y-3">
              <Link href="/compare" className="btn-secondary w-full text-center" onClick={closeAll}>Compare Tools</Link>
              <Link href="/tool-finder" className="btn-primary w-full text-center" onClick={closeAll}>Build My Stack</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
