// ─────────────────────────────────────────────────────────────────────────────
// ResourcePageView — Growth-7: reusable public resource page renderer
// ─────────────────────────────────────────────────────────────────────────────
// Server component. Renders a PublicResource (intro, sections, honest "what we
// support", educational disclaimer, conversion CTAs, related links, FAQ). No private
// assessment/score/account data is touched — public educational content only.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react'
import { resourceHasEmailCapture, type PublicResource } from '@/lib/publicResources'
import SupportedTrades from '@/components/SupportedTrades'
import EmailCaptureForm from '@/components/EmailCaptureForm'

export default function ResourcePageView({ resource }: { resource: PublicResource }) {
  return (
    <main className="min-h-dvh bg-brand-navy">
      <div className="px-5 pt-5 pb-4 border-b border-brand-blue/40"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)' }}>
        <Link href="/learn" className="inline-flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs tracking-wide">Learn</span>
        </Link>
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-1">SubZeroMetrix™ · Learn</p>
        <h1 className="font-display text-3xl tracking-wider text-brand-white leading-tight">{resource.title}</h1>
      </div>

      <article className="px-5 py-6 max-w-2xl mx-auto space-y-6">
        {resource.intro.map((p, i) => (
          <p key={i} className="text-[13px] text-brand-silver leading-relaxed">{p}</p>
        ))}

        {resource.sections.map((s, i) => (
          <section key={i}>
            <h2 className="font-display text-lg tracking-wide text-brand-white mb-1.5">{s.heading}</h2>
            {s.body.map((p, j) => (
              <p key={j} className="text-[13px] text-brand-silver leading-relaxed mb-1.5">{p}</p>
            ))}
            {s.bullets && (
              <ul className="mt-1 space-y-1">
                {s.bullets.map((b, k) => (
                  <li key={k} className="text-[12px] text-brand-silver/85 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#1D9E75' }} /> {b}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* Honest current-capability section */}
        <section className="glass rounded-2xl p-5">
          <h2 className="font-display text-base tracking-wide text-brand-white mb-2">What SubZeroMetrix™ supports today</h2>
          <ul className="space-y-1.5">
            {resource.whatWeSupport.map((b, i) => (
              <li key={i} className="text-[12px] text-brand-silver/85 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#4A90D9' }} /> {b}
              </li>
            ))}
          </ul>
        </section>

        {/* Reusable supported-trades callout (where relevant) */}
        {resource.showSupportedTrades && <SupportedTrades />}

        {/* Conversion paths */}
        <section className="space-y-2.5">
          <Link href={resource.primaryCta.href}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[13px] font-semibold tracking-wide uppercase bg-brand-accent text-white active:scale-[0.98] transition-all touch-target">
            {resource.primaryCta.label} <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="flex flex-wrap gap-2">
            {resource.secondaryCtas.map((c, i) => (
              <Link key={i} href={c.href}
                className="flex-1 text-center py-2.5 rounded-xl text-[12px] font-semibold glass text-brand-white active:scale-[0.98] transition-all touch-target">
                {c.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Email capture (one per page, strong-intent pages only) */}
        {resourceHasEmailCapture(resource.slug) && (
          <EmailCaptureForm sourcePage={`/learn/${resource.slug}`} sourceIntent={resource.intent} />
        )}

        {/* FAQ */}
        {resource.faq && resource.faq.length > 0 && (
          <section>
            <h2 className="font-display text-lg tracking-wide text-brand-white mb-2">Common questions</h2>
            <div className="space-y-3">
              {resource.faq.map((f, i) => (
                <div key={i} className="glass-light rounded-xl px-4 py-3">
                  <p className="text-[12px] font-semibold text-brand-white">{f.q}</p>
                  <p className="text-[12px] text-brand-silver/85 leading-relaxed mt-1">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {resource.related.length > 0 && (
          <section>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-silver mb-2">Related</p>
            <div className="space-y-1.5">
              {resource.related.map((r, i) => (
                <Link key={i} href={r.href} className="inline-flex items-center gap-1.5 text-[12px] text-brand-accent underline underline-offset-2">
                  <ExternalLink className="w-3 h-3 flex-shrink-0" /> {r.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Educational disclaimer */}
        <p className="text-[10px] text-brand-silver/50 leading-relaxed border-t border-brand-blue/30 pt-4">{resource.disclaimer}</p>
      </article>
    </main>
  )
}
