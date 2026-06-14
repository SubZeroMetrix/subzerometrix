// ─────────────────────────────────────────────────────────────────────────────
// /pricing — Wave 7 CP11: approved pricing presentation surface (flag-gated)
// ─────────────────────────────────────────────────────────────────────────────
// A NEW public surface that presents the approved pricing model. Gated behind the new-experience
// flag `presentation_shell` (default OFF) so production behavior is unchanged until launch — when
// the flag is OFF the route 404s rather than exposing an unfinished surface. It wires no payment
// behavior; the live checkout path (/unlock + /api/checkout) is untouched.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { isFeatureEnabled } from '@/lib/featureFlags'
import AppShell from '@/components/shell/AppShell'
import { Container, Section, Eyebrow, PageHeading, Lead } from '@/components/ui'
import PricingTiers from '@/components/pricing/PricingTiers'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'SubZeroMetrix™ pricing: a free Initial Direction, a one-time $19 Roadmap Pass with 30 days of Build access, Build at $39/month, invitation-only Growth, and a Founding Lifetime Membership. Educational use only.',
  alternates: { canonical: '/pricing' },
}

export default function PricingPage() {
  if (!isFeatureEnabled('presentation_shell')) notFound()

  return (
    <AppShell variant="content" header={false}>
      <Section className="pt-6 pb-16">
        <Container width="wide">
          <Link href="/" className="inline-flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors mb-4 touch-target">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs tracking-wide">Home</span>
          </Link>
          <Eyebrow>Pricing</Eyebrow>
          <PageHeading className="mt-2">SIMPLE, HONEST PRICING</PageHeading>
          <Lead className="mt-3 mb-8">
            Start free. Move up only when it&apos;s worth it. One-time and monthly options are clearly
            labeled — no surprise renewals, no fabricated discounts, and no guaranteed-outcome claims.
          </Lead>
          <PricingTiers />
        </Container>
      </Section>
    </AppShell>
  )
}
