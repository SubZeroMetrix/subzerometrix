// ─────────────────────────────────────────────────────────────────────────────
// /state/[state] — Wave 7 CP8: per-state contractor licensing & setup surface
// ─────────────────────────────────────────────────────────────────────────────
// Reads the canonical Wave 4 STATE_REGISTRY (no competing licensing engine). Shows authoritative
// authority references, the reviewed date + freshness, trade applicability, state-vs-local
// uncertainty, and standing verify-before-action language. Educational only — not legal advice;
// it never implies state info eliminates city/county/board/project requirements.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, MapPin, AlertTriangle } from 'lucide-react'
import {
  STATE_REGISTRY, CANONICAL_STATE_IDS, resolveState,
  LICENSING_REVIEWED_DATE, LICENSING_FRESHNESS_WINDOW_DAYS, CANONICAL_TRADE_IDS,
} from '@/lib/metrix'
import { breadcrumbJsonLd } from '@/lib/seo'
import AppShell from '@/components/shell/AppShell'
import { Container, Section, Eyebrow, PageHeading, Lead, Rule, Card, Badge, CTALink } from '@/components/ui'

export function generateStaticParams() {
  return CANONICAL_STATE_IDS.map(id => ({ state: id.toLowerCase() }))
}

function entryFor(param: string) {
  const resolved = resolveState(param)
  return resolved.id ? STATE_REGISTRY[resolved.id] : null
}

export function generateMetadata({ params }: { params: { state: string } }): Metadata {
  const e = entryFor(params.state)
  if (!e) return { title: 'State not yet fully supported' }
  const title = `${e.displayName} Contractor Licensing & Business Setup`
  const description = `${e.displayName} contractor licensing authorities, reviewed ${e.reviewedDate}. Educational, verify-before-action guidance for contractors, tradespeople, and service businesses. Not legal advice.`
  return {
    title, description,
    alternates: { canonical: `/state/${params.state.toLowerCase()}` },
    openGraph: { title, description, type: 'website' },
  }
}

const TRADE_LABEL: Record<string, string> = {
  hvac: 'HVAC', electrical: 'Electrical', plumbing: 'Plumbing', handyman: 'Handyman',
  landscaping: 'Landscaping', painting: 'Painting', roofing: 'Roofing', solar: 'Solar',
  construction: 'General Contracting / Construction', cleaning: 'Cleaning Services',
}

function freshnessVerdict(reviewedDate: string): { label: string; tone: 'positive' | 'caution' | 'neutral' } {
  const reviewed = Date.parse(reviewedDate)
  if (Number.isNaN(reviewed)) return { label: 'Reviewed date unknown', tone: 'neutral' }
  const days = Math.floor((Date.now() - reviewed) / 86_400_000)
  if (days <= LICENSING_FRESHNESS_WINDOW_DAYS) return { label: 'Recently reviewed', tone: 'positive' }
  if (days <= LICENSING_FRESHNESS_WINDOW_DAYS * 2) return { label: 'Review due soon', tone: 'caution' }
  return { label: 'Past review window — verify', tone: 'caution' }
}

export default function StatePage({ params }: { params: { state: string } }) {
  const e = entryFor(params.state)
  if (!e) notFound()
  const fresh = freshnessVerdict(e.reviewedDate)

  return (
    <AppShell variant="content" header={false}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
          { name: 'Home', path: '/' }, { name: 'States', path: '/trades' },
          { name: e.displayName, path: `/state/${params.state.toLowerCase()}` },
        ])) }}
      />
      <Section className="pt-6 pb-16">
        <Container width="base">
          <Link href="/" className="inline-flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors mb-4 touch-target">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs tracking-wide">Home</span>
          </Link>
          <Eyebrow>State licensing &amp; setup</Eyebrow>
          <PageHeading className="mt-2">{e.displayName.toUpperCase()}</PageHeading>

          <div className="flex flex-wrap gap-2 mt-3">
            <Badge tone={e.coverage === 'covered' ? 'positive' : 'caution'}>
              {e.coverage === 'covered' ? 'State-level coverage' : 'Partial coverage (much licensing is local)'}
            </Badge>
            <Badge tone={fresh.tone}>
              <ShieldCheck className="w-3 h-3" aria-hidden="true" /> {fresh.label}
            </Badge>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider uppercase text-brand-silver/70">
              Reviewed {e.reviewedDate}
            </span>
          </div>

          <Lead className="mt-4 mb-2">{e.notes}</Lead>
          <p className="text-[13px] text-brand-accent leading-relaxed mb-6">{e.verifyBeforeAction}</p>
          <Rule />

          {/* Authorities (canonical Wave 4 references) */}
          <h2 className="font-display text-xl tracking-wider text-brand-white mb-3">OFFICIAL AUTHORITIES</h2>
          <ul className="space-y-2 mb-8">
            {e.authorities.map(a => (
              <li key={a.name}>
                <Card>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-brand-white">{a.name}</p>
                      <p className="text-[12px] text-brand-silver">{a.role}</p>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>

          {/* State vs local uncertainty */}
          <Card tone="caution" className="mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-[13px] text-brand-silver leading-relaxed">
                State-level information does not replace city, county, municipal, board, or
                project-specific requirements. Requirements vary by trade, scope, and jurisdiction —
                confirm current rules with the responsible authority before acting. This is educational
                information, not legal advice. Found something out of date?{' '}
                <Link href="/partners" className="text-brand-accent hover:underline">Report a correction</Link>.
              </p>
            </div>
          </Card>

          {/* Trade applicability */}
          <h2 className="font-display text-xl tracking-wider text-brand-white mb-3">TRADES</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {CANONICAL_TRADE_IDS.map(t => (
              <Link key={t} href="/trades" className="rounded-full steel-border px-3 py-1.5 text-[12px] text-brand-silver hover:text-brand-white hover:border-brand-accent/50 transition-colors touch-target">
                {TRADE_LABEL[t] ?? t}
              </Link>
            ))}
          </div>

          <CTALink href="/start">Check your readiness — Free</CTALink>
          <p className="text-[11px] text-brand-silver/60 mt-3 text-center">
            Reviewed {LICENSING_REVIEWED_DATE}. Always verify current requirements with the official authority.
          </p>
        </Container>
      </Section>
    </AppShell>
  )
}
