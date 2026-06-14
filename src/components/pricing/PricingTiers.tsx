// ─────────────────────────────────────────────────────────────────────────────
// pricing/PricingTiers — Wave 7 CP11: approved pricing presentation (server, display-only)
// ─────────────────────────────────────────────────────────────────────────────
// Renders the approved pricing model from the single source of truth (pricingPlans.ts) using the
// shared design system. It wires NO checkout: only the genuinely-free plan has an active CTA
// (→ /start). Paid plans present the offer truthfully but are not purchasable here — live Stripe
// for the new model is deferred to Wave 10A, and this page never routes into the existing
// (separately-priced) /unlock flow, which would be misleading.
//
// The Founding Lifetime offer is additionally gated behind `lifetime_offer_presentation` (the
// existing default-OFF payment-dependent flag). Its availability comes only from the integrity-
// checked counter, which is `unknown` today (no reliable inventory source) — so no number or fake
// scarcity is ever shown.
// ─────────────────────────────────────────────────────────────────────────────

import { isFeatureEnabled } from '@/lib/featureFlags'
import {
  PRICING_PLAN_LIST, PRICING_DISCLOSURES, type PricingPlan, type BillingKind,
} from '@/lib/pricing/pricingPlans'
import { FOUNDING_AVAILABILITY } from '@/lib/pricing/foundingAvailability'
import {
  Card, Eyebrow, Badge, CTALink, Alert,
} from '@/components/ui'
import type { Tone } from '@/lib/ui/presentationState'
import { Check, Info, Lock } from 'lucide-react'

// Cadence badge per billing kind — distinguishes the offer mechanics visually AND in text.
const CADENCE: Record<BillingKind, { label: string; tone: Tone }> = {
  free: { label: 'Free', tone: 'positive' },
  one_time: { label: 'One-time', tone: 'info' },
  subscription: { label: 'Per month', tone: 'neutral' },
  lifetime: { label: 'One-time · lifetime', tone: 'caution' },
}

function PlanCard({ plan }: { plan: PricingPlan }) {
  const cadence = CADENCE[plan.billingKind]
  const isFree = plan.billingKind === 'free'
  const invitation = plan.invitationOnly

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg tracking-wide text-brand-white leading-tight">{plan.name}</h3>
          <p className="mt-1 flex items-baseline gap-1.5">
            <span className="font-display text-2xl tracking-wider text-brand-white">{plan.priceLabel}</span>
            {plan.billingKind === 'subscription' ? (
              <span className="text-[12px] text-brand-silver">/ month</span>
            ) : null}
          </p>
        </div>
        <Badge tone={cadence.tone}>
          {invitation ? 'Invitation only' : cadence.label}
        </Badge>
      </div>

      <p className="text-[13px] text-brand-silver leading-relaxed mb-4">{plan.summary}</p>

      <ul className="space-y-2 mb-4">
        {plan.includes.map(item => (
          <li key={item} className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-brand-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-[13px] text-brand-silver leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>

      {plan.scopeNotes.length > 0 ? (
        <ul className="space-y-1.5 mb-4">
          {plan.scopeNotes.map(note => (
            <li key={note} className="flex items-start gap-2">
              <Info className="w-3 h-3 text-brand-silver/60 flex-shrink-0 mt-1" aria-hidden="true" />
              <span className="text-[11px] text-brand-silver/70 leading-relaxed">{note}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {/* CTA area — only the free plan is purchasable here. */}
      <div className="mt-auto pt-2">
        {isFree ? (
          <CTALink href="/start">{plan.ctaLabel}</CTALink>
        ) : invitation ? (
          <p className="inline-flex items-center gap-1.5 text-[12px] font-medium tracking-wide text-brand-silver/70 py-3">
            <Lock className="w-3.5 h-3.5" aria-hidden="true" /> By invitation only
          </p>
        ) : (
          <p className="text-[12px] font-medium tracking-wide text-brand-silver/70 py-3">
            Available at launch
          </p>
        )}
      </div>
    </Card>
  )
}

function FoundingOffer({ plan }: { plan: PricingPlan }) {
  const avail = FOUNDING_AVAILABILITY
  return (
    <Card tone="caution" className="mt-6">
      <Eyebrow>Founding offer</Eyebrow>
      <div className="flex items-start justify-between gap-3 mt-2 mb-2">
        <h2 className="font-display text-xl tracking-wide text-brand-white leading-tight">{plan.name}</h2>
        <span className="font-display text-2xl tracking-wider text-brand-white">{plan.priceLabel}</span>
      </div>
      <p className="text-[13px] text-brand-silver leading-relaxed mb-3">{plan.summary}</p>

      {/* Availability — integrity-checked. `unknown` today → truthful statement, never a fake count. */}
      <p className="text-[12px] text-amber-200/90 leading-relaxed mb-4">{avail.display}</p>

      <ul className="space-y-2 mb-4">
        {plan.includes.map(item => (
          <li key={item} className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-brand-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-[13px] text-brand-silver leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>

      <ul className="space-y-1.5 mb-4">
        {plan.scopeNotes.map(note => (
          <li key={note} className="flex items-start gap-2">
            <Info className="w-3 h-3 text-brand-silver/60 flex-shrink-0 mt-1" aria-hidden="true" />
            <span className="text-[11px] text-brand-silver/70 leading-relaxed">{note}</span>
          </li>
        ))}
      </ul>

      <p className="text-[12px] font-medium tracking-wide text-brand-silver/70 py-1">Available at launch</p>
    </Card>
  )
}

export default function PricingTiers() {
  // The Founding Lifetime offer is the payment-dependent presentation: keep it behind the
  // existing default-OFF flag. Everything else is the approved standard pricing.
  const showFounding = isFeatureEnabled('lifetime_offer_presentation')
  const standardPlans = PRICING_PLAN_LIST.filter(p => p.id !== 'founding_lifetime')
  const founding = PRICING_PLAN_LIST.find(p => p.id === 'founding_lifetime')

  return (
    <div>
      <h2 className="sr-only">Plans</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {standardPlans.map(plan => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {showFounding && founding ? <FoundingOffer plan={founding} /> : null}

      <Alert tone="neutral" title="How pricing works" className="mt-8">
        <ul className="space-y-1.5 mt-1">
          {PRICING_DISCLOSURES.map(line => (
            <li key={line} className="text-[12px] leading-relaxed">{line}</li>
          ))}
        </ul>
      </Alert>
    </div>
  )
}
