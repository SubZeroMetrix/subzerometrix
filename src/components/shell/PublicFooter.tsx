// ─────────────────────────────────────────────────────────────────────────────
// shell/PublicFooter — Wave 7 Checkpoint 2: one consistent footer (content preserved)
// ─────────────────────────────────────────────────────────────────────────────
// Consolidates the homepage footer (affiliate/resource disclosure, educational disclaimer,
// legal nav, copyright) into one shared, server-rendered component so every surface carries
// the same required disclosures and legal links. Copy is preserved from the existing footer —
// no claims added or removed. Links target existing preserved routes only.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import IceCrystal from '@/components/ui/IceCrystal'

const LEGAL_LINKS: [string, string][] = [
  ['Resources', '/resources'],
  ['Get the App', '/install'],
  ['Platform Ecosystem', '/platform-ecosystem'],
  ['Privacy Policy', '/privacy'],
  ['Terms of Service', '/terms'],
  ['Cancellation & Refunds', '/cancellation'],
  ['Affiliate Disclosure', '/affiliate-disclosure'],
  ['Disclaimer', '/disclaimer'],
]

export default function PublicFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="px-5 pt-12 pb-10 border-t" style={{ borderColor: 'rgba(168,184,204,0.1)' }}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <IceCrystal size={28} accent="#A8B8CC" />
          <div>
            <div className="font-display text-xl tracking-widest text-brand-white">
              SUBZERO<span className="text-brand-accent">METRIX</span>
            </div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-brand-silver">by The Modern Trades Mentor</p>
          </div>
        </div>

        <div className="mb-6 p-4 rounded-sm steel-border" style={{ background: 'rgba(13,43,92,0.2)' }}>
          <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver mb-2">Affiliate &amp; Resource Disclosure</p>
          <p className="text-[12px] text-brand-silver/70 leading-relaxed">
            Tool recommendations are provided for educational purposes. SubZeroMetrix™ may pursue
            affiliate or vendor relationships in the future; if added, they will be disclosed clearly.
            Any future relationships would not influence MetrixScore™ results or roadmap recommendations.
          </p>
          <Link href="/affiliate-disclosure" className="inline-flex items-center gap-1 text-[11px] text-brand-accent mt-2 hover:underline">
            Full disclosure <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="mb-8 p-4 rounded-sm steel-border" style={{ background: 'rgba(13,43,92,0.2)' }}>
          <p className="font-mono text-[9px] tracking-widest uppercase text-brand-silver mb-2">Disclaimer</p>
          <p className="text-[12px] text-brand-silver/70 leading-relaxed">
            SubZeroMetrix™ provides educational scoring and informational content only. Nothing here
            constitutes legal, financial, tax, insurance, licensing, or lending advice.
            No business outcomes are guaranteed. Always consult qualified professionals.
          </p>
          <Link href="/disclaimer" className="inline-flex items-center gap-1 text-[11px] text-brand-accent mt-2 hover:underline">
            Full disclaimer <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 mb-6" aria-label="Footer">
          {LEGAL_LINKS.map(([label, href]) => (
            <Link key={href} href={href} className="text-[11px] tracking-wide text-brand-silver/60 hover:text-brand-silver transition-colors">
              {label}
            </Link>
          ))}
        </nav>

        <p className="text-[11px] text-brand-silver/40 leading-relaxed">
          © {year} SubZeroMetrix™ · The Modern Trades Mentor LLC<br />
          SubZeroMetrix™ and MetrixScore™ are owned by The Modern Trades Mentor LLC.<br />
          Educational purposes only. Not legal, financial, or licensing advice.
        </p>
      </div>
    </footer>
  )
}
