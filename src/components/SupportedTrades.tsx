// ─────────────────────────────────────────────────────────────────────────────
// SupportedTrades — Growth-7: reusable supported-trades callout
// ─────────────────────────────────────────────────────────────────────────────
// Server component. Lists the trades SubZeroMetrix™ supports with one honest startup
// consideration each, states that licensing/permitting/tax/insurance/certification
// requirements vary by state and locality (verify with official sources), and links only
// to pages that exist (/start, /foundation-builder). It does NOT present all trades as
// having identical requirements and makes no guarantees.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { Wrench, ArrowRight } from 'lucide-react'
import { getSupportedTrades } from '@/lib/publicResources'

export default function SupportedTrades({ heading = 'Supported trades' }: { heading?: string }) {
  const trades = getSupportedTrades()
  return (
    <section className="glass rounded-2xl p-5">
      <h2 className="font-display text-base tracking-wide text-brand-white mb-1 flex items-center gap-1.5">
        <Wrench className="w-4 h-4 text-brand-accent flex-shrink-0" /> {heading}
      </h2>
      <p className="text-[11px] text-brand-silver/70 leading-relaxed mb-3">
        SubZeroMetrix™ is strongest for these trades. Licensing, permitting, tax, insurance, and
        certification requirements vary by trade, state, and locality — always verify with official
        state and local sources.
      </p>
      <ul className="space-y-2">
        {trades.map(t => (
          <li key={t.slug} className="text-[12px]">
            <span className="font-semibold text-brand-white">{t.label}.</span>{' '}
            <span className="text-brand-silver/85">{t.consideration}</span>
          </li>
        ))}
      </ul>
      <Link href="/start"
        className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-accent">
        Check your readiness for your trade <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </section>
  )
}
