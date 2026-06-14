'use client'

// ─────────────────────────────────────────────────────────────────────────────
// shell/PublicHeader — Wave 7 Checkpoint 2: one consistent public/marketing header
// ─────────────────────────────────────────────────────────────────────────────
// Replaces the per-page hand-rolled navs with a single industrial header: the shared brand
// mark, the canonical primary CTA ("Find My Next Move — Free" → /start), a Dashboard link, and
// an accessible mobile menu. Client component only because the mobile menu toggles. Route-
// preserving: it links to existing routes only and removes nothing.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import IceCrystal from '@/components/ui/IceCrystal'
import { buttonClasses } from '@/components/ui'

const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'How it works', href: '/business-readiness' },
  { label: 'Trades', href: '/trades' },
  { label: 'Resources', href: '/resources' },
  { label: 'Learn', href: '/learn' },
  { label: 'Pricing', href: '/pricing' },
]

export default function PublicHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50">
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(to bottom, rgba(10,22,40,0.97) 0%, rgba(10,22,40,0.85) 100%)' }}
      >
        <Link href="/" className="flex items-center gap-3 touch-target" aria-label="SubZeroMetrix home">
          <IceCrystal size={28} accent="#C8D4E0" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-widest text-brand-white">
              SUBZERO<span className="text-brand-accent">METRIX</span>
            </span>
            <span className="text-[8px] tracking-[0.22em] text-brand-silver uppercase">by The Modern Trades Mentor</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] font-medium tracking-widest uppercase px-3 py-2 rounded-sm text-brand-silver hover:text-brand-white transition-all touch-target"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="text-[11px] font-medium tracking-widest uppercase px-3 py-2 rounded-sm text-brand-silver hover:text-brand-white transition-all touch-target"
          >
            Dashboard
          </Link>
          <Link href="/start" className={buttonClasses('primary', 'md', 'ml-2')}>
            Find My Next Move — Free <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden touch-target text-brand-silver hover:text-brand-white"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(v => !v)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="md:hidden px-5 pb-5 pt-2 flex flex-col gap-1 border-t border-brand-silver/10"
          style={{ background: 'rgba(10,22,40,0.98)' }}
        >
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[13px] tracking-wide text-brand-silver hover:text-brand-white py-3 touch-target"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="text-[13px] tracking-wide text-brand-silver hover:text-brand-white py-3 touch-target"
          >
            Dashboard
          </Link>
          <Link
            href="/start"
            onClick={() => setOpen(false)}
            className={buttonClasses('primary', 'lg', 'mt-2')}
          >
            Find My Next Move — Free <ArrowRight className="w-4 h-4" />
          </Link>
        </nav>
      ) : null}
    </header>
  )
}
