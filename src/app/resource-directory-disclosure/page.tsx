// ─────────────────────────────────────────────────────────────────────────────
// /resource-directory-disclosure — Wave 7: full Resource Directory Disclosure (Part 4)
// ─────────────────────────────────────────────────────────────────────────────
// The fuller disclosure linked from the /resources directory ("Learn how resources are
// selected"). Educational/informational only — not legal, tax, accounting, insurance, financial,
// licensing, or compliance advice. Truthful about the current non-commercial stance.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AppShell from '@/components/shell/AppShell'
import { Container, Section, Eyebrow, PageHeading, Lead } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Resource Directory Disclosure',
  description:
    'How SubZeroMetrix selects and links third-party educational resources. Listings are unpaid and earn no commission. Educational only; not professional advice.',
  alternates: { canonical: '/resource-directory-disclosure' },
}

const POINTS: { h: string; b: string }[] = [
  { h: 'Free to users', b: 'The resource directory is free to use.' },
  { h: 'No paid inclusion', b: 'Providers currently do not pay to be included or for placement.' },
  { h: 'No commissions', b: 'SubZeroMetrix currently earns no commission from these listings.' },
  { h: 'How listings are selected', b: 'Listings are selected based on educational relevance to contractors, tradespeople, and service businesses, and on technical availability (a reachable, secure, identity-matched destination at the time of review).' },
  { h: 'Verification is technical, not a quality guarantee', b: 'Technical verification confirms a link was reachable and secure at a point in time. It does not guarantee service quality, suitability, pricing, eligibility, or results.' },
  { h: 'Third-party websites', b: 'External websites are controlled by third parties. After you leave SubZeroMetrix, the third party’s own terms and privacy practices apply.' },
  { h: 'Information can change', b: 'URLs, pricing, products, eligibility, and availability may change at any time. Verify details directly with the provider.' },
  { h: 'Licensing', b: 'Confirm licensing rules and current requirements with the responsible licensing authority for your trade, project, and jurisdiction.' },
  { h: 'Not professional advice', b: 'Listings do not constitute legal, tax, accounting, insurance, financial, licensing, or compliance advice.' },
  { h: 'Future relationships', b: 'If SubZeroMetrix enters a compensated relationship in the future, it will be clearly disclosed.' },
  { h: 'Compensation will not bias the product', b: 'Future compensation will not influence MetrixScore, Metrix Priority, licensing guidance, pathway order, or resource relevance/ordering.' },
]

export default function ResourceDirectoryDisclosurePage() {
  return (
    <AppShell variant="content" header={false}>
      <Section className="pt-6 pb-16">
        <Container width="base">
          <Link href="/resources" className="inline-flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors mb-4 touch-target">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs tracking-wide">Back to resources</span>
          </Link>
          <Eyebrow>Resource directory</Eyebrow>
          <PageHeading className="mt-2">HOW RESOURCES ARE SELECTED</PageHeading>
          <Lead className="mt-3 mb-6">
            SubZeroMetrix is an educational and informational resource directory. This page explains how
            listings are chosen and the limits of what inclusion means.
          </Lead>
          <dl className="space-y-4">
            {POINTS.map(p => (
              <div key={p.h} className="steel-border rounded-sm p-4 bg-[rgba(13,43,92,0.2)]">
                <dt className="text-sm font-semibold text-brand-white">{p.h}</dt>
                <dd className="text-[13px] text-brand-silver leading-relaxed mt-1">{p.b}</dd>
              </div>
            ))}
          </dl>
          <p className="text-[12px] text-brand-silver/60 leading-relaxed mt-6">
            This disclosure does not eliminate all legal risk and is not a substitute for your own due
            diligence. See also our{' '}
            <Link href="/affiliate-disclosure" className="text-brand-accent hover:underline">Affiliate Disclosure</Link>,{' '}
            <Link href="/disclaimer" className="text-brand-accent hover:underline">Disclaimer</Link>, and{' '}
            <Link href="/privacy" className="text-brand-accent hover:underline">Privacy Policy</Link>.
          </p>
        </Container>
      </Section>
    </AppShell>
  )
}
