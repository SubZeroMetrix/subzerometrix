// ─────────────────────────────────────────────────────────────────────────────
// home/HomeExperience — Wave 7 Checkpoint 3: the rebuilt conversion homepage
// ─────────────────────────────────────────────────────────────────────────────
// The canonical positioning ("Start it. Build it. Grow it." / "Find the next business move that
// matters most.") with one dominant CTA, the connected-system explanation, the real lifecycle,
// the 8 audience entry points, honest market clarity, and trust-without-hype. Server component
// (no client JS, reduced-motion-safe by construction). Routes only to preserved routes. Gated
// by `presentation_shell` at the route; the legacy homepage remains the default fallback.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { ArrowRight, ShieldCheck, MapPin } from 'lucide-react'
import AppShell from '@/components/shell/AppShell'
import IceCrystal from '@/components/ui/IceCrystal'
import {
  Container, Section, Eyebrow, SectionHeading, PageHeading, Lead, Rule, Card, CTALink,
} from '@/components/ui'
import {
  POSITIONING, PRIMARY_CTA, SECONDARY_LINKS, CONNECTED_SYSTEM, LIFECYCLE_STAGES,
  RECOVER_PATH, AUDIENCE_ROUTING, LAUNCH_TRADES, LAUNCH_STATES, MARKET_CLARITY, TRUST_POINTS,
} from '@/lib/home/homeContent'

function PrimaryCta({ className = '' }: { className?: string }) {
  return (
    <CTALink href={PRIMARY_CTA.href} className={className}>
      {PRIMARY_CTA.label} <ArrowRight className="w-4 h-4" />
    </CTALink>
  )
}

export default function HomeExperience() {
  return (
    <AppShell variant="public">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <Section className="pt-12 pb-16">
        <Container>
          <div className="flex justify-center mb-6">
            <IceCrystal size={60} accent="#C8D4E0" title="SubZeroMetrix" />
          </div>
          <Eyebrow className="text-center">{POSITIONING.tagline}</Eyebrow>
          <PageHeading className="mt-4 text-center">
            FIND THE NEXT BUSINESS MOVE THAT MATTERS MOST.
          </PageHeading>

          <div className="my-6">
            <div className="temp-bar w-full mb-1.5" />
            <div className="flex justify-between">
              <span className="font-mono text-[8px] tracking-wider text-brand-silver/50 uppercase">Sub-Zero</span>
              <span className="font-mono text-[8px] tracking-wider text-brand-silver/50 uppercase">Superheated</span>
            </div>
          </div>

          <Lead className="text-center">
            A MetrixScore™ reading and a personalized roadmap for contractors, tradespeople, and
            service businesses — so you always know the one move to make next.
          </Lead>

          <div className="mt-8">
            <PrimaryCta />
            <p className="text-center text-[11px] text-brand-silver/60 tracking-wide mt-2">
              4 minutes · Free to start · No account required.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2">
            {SECONDARY_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[12px] tracking-wide text-brand-silver/70 hover:text-brand-white underline underline-offset-4 decoration-brand-silver/30"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── The connected system ───────────────────────────────────────────── */}
      <Section className="bg-[linear-gradient(180deg,#0D2B5C_0%,#0A1628_100%)]">
        <Container>
          <Eyebrow>The system</Eyebrow>
          <SectionHeading className="mt-2">ONE CONNECTED SYSTEM</SectionHeading>
          <Rule />
          <Lead className="mb-6">
            Five parts, one line of logic — each step feeds the next. No disconnected quiz, no
            generic checklist.
          </Lead>
          <ol className="space-y-3">
            {CONNECTED_SYSTEM.map((s, i) => (
              <li key={s.name}>
                <Card>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] text-brand-accent border border-brand-accent/40 bg-brand-accent/10">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-white">{s.name}</p>
                      <p className="text-[13px] text-brand-silver leading-relaxed mt-0.5">{s.what}</p>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ── Lifecycle ──────────────────────────────────────────────────────── */}
      <Section>
        <Container>
          <Eyebrow>Where you are</Eyebrow>
          <SectionHeading className="mt-2">FROM FIRST IDEA TO SCALE</SectionHeading>
          <Rule />
          <ol className="flex flex-wrap items-center gap-2 mb-5">
            {LIFECYCLE_STAGES.map((stage, i) => (
              <li key={stage} className="flex items-center gap-2">
                <span className="rounded-sm steel-border px-3 py-1.5 text-[12px] text-brand-white bg-[rgba(13,43,92,0.35)]">
                  {stage}
                </span>
                {i < LIFECYCLE_STAGES.length - 1 ? (
                  <ArrowRight className="w-3.5 h-3.5 text-brand-silver/50" aria-hidden="true" />
                ) : null}
              </li>
            ))}
          </ol>
          <Card tone="info">
            <p className="text-[13px] text-brand-silver leading-relaxed">
              <span className="font-semibold text-brand-white">{RECOVER_PATH.label}:</span>{' '}
              {RECOVER_PATH.note}
            </p>
          </Card>
        </Container>
      </Section>

      {/* ── Audience routing ───────────────────────────────────────────────── */}
      <Section className="bg-[linear-gradient(180deg,#0D2B5C_0%,#0A1628_100%)]">
        <Container>
          <Eyebrow>Start where you are</Eyebrow>
          <SectionHeading className="mt-2">WHICH ONE SOUNDS LIKE YOU?</SectionHeading>
          <Rule />
          <ul className="grid grid-cols-2 gap-2 mb-6">
            {AUDIENCE_ROUTING.map(a => (
              <li key={a.key}>
                <Link
                  href={PRIMARY_CTA.href}
                  className="flex items-center justify-between gap-2 rounded-sm steel-border px-3 py-3 text-[13px] text-brand-white hover:border-brand-accent/50 hover:text-brand-white bg-[rgba(10,22,40,0.4)] transition-colors touch-target"
                >
                  <span>{a.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <PrimaryCta />
        </Container>
      </Section>

      {/* ── Market clarity ─────────────────────────────────────────────────── */}
      <Section>
        <Container>
          <Eyebrow>Honest about fit</Eyebrow>
          <SectionHeading className="mt-2">WHO IT&apos;S STRONGEST FOR</SectionHeading>
          <Rule />
          <ul className="space-y-3 mb-6">
            {MARKET_CLARITY.map(point => (
              <li key={point} className="flex items-start gap-3 accent-line pl-3">
                <span className="text-[14px] text-brand-silver leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>

          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-brand-silver/60 mb-2">
            10 first-class launch trades
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {LAUNCH_TRADES.map(t => (
              <span key={t} className="rounded-full border border-brand-silver/20 bg-brand-silver/5 px-3 py-1 text-[11px] text-brand-silver">
                {t}
              </span>
            ))}
          </div>

          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-brand-silver/60 mb-2">
            Six-state licensing &amp; jurisdiction intelligence
          </p>
          <div className="flex flex-wrap gap-2">
            {LAUNCH_STATES.map(s => (
              <span key={s.code} className="inline-flex items-center gap-1.5 rounded-full border border-brand-silver/20 bg-brand-silver/5 px-3 py-1 text-[11px] text-brand-silver">
                <MapPin className="w-3 h-3 text-brand-accent" aria-hidden="true" /> {s.name}
              </span>
            ))}
          </div>
          <p className="text-[12px] text-brand-silver/70 leading-relaxed mt-3">
            Always verify licensing and legal requirements with the official authority that governs
            your work. SubZeroMetrix is educational and not legal advice.
          </p>
        </Container>
      </Section>

      {/* ── Trust ──────────────────────────────────────────────────────────── */}
      <Section className="bg-[linear-gradient(180deg,#0D2B5C_0%,#0A1628_100%)]">
        <Container>
          <Eyebrow>How it stays honest</Eyebrow>
          <SectionHeading className="mt-2">BUILT TO BE TRUSTED</SectionHeading>
          <Rule />
          <div className="space-y-3">
            {TRUST_POINTS.map(t => (
              <Card key={t.title}>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-brand-white">{t.title}</p>
                    <p className="text-[13px] text-brand-silver leading-relaxed mt-0.5">{t.body}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <Section>
        <Container>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <IceCrystal size={48} accent="#4A90D9" />
            </div>
            <Eyebrow className="text-brand-silver">{POSITIONING.tagline}</Eyebrow>
            <SectionHeading className="mt-3">{POSITIONING.promise.toUpperCase()}</SectionHeading>
            <p className="text-brand-silver text-[14px] leading-relaxed mt-4 mb-8">
              {POSITIONING.forWho} Free to start. No account required. Takes four minutes.
            </p>
            <PrimaryCta />
          </div>
        </Container>
      </Section>
    </AppShell>
  )
}
