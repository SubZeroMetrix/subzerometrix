import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Info } from 'lucide-react'
import { buildOpenGraph, buildTwitter } from '@/lib/seo'
import { getSpanishBusinessStarterCopy, getSpanishDiscoveryPages, SPANISH_OG_LOCALE } from '@/lib/spanishDiscovery'
import ShareReferralCard from '@/components/ShareReferralCard'

const PAGE = getSpanishDiscoveryPages()[1]

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.metaDescription,
  alternates: { canonical: '/es/como-empezar-un-negocio' },
  openGraph: { ...buildOpenGraph({ title: PAGE.title, description: PAGE.metaDescription, path: '/es/como-empezar-un-negocio' }), locale: SPANISH_OG_LOCALE },
  twitter: buildTwitter({ title: PAGE.title, description: PAGE.metaDescription }),
}

export default function ComoEmpezarUnNegocioPage() {
  const copy = getSpanishBusinessStarterCopy()

  return (
    <main lang="es" className="min-h-dvh bg-brand-navy">
      <div className="px-5 pt-5 pb-4 border-b border-brand-blue/40"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)' }}>
        <Link href="/es" className="inline-flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs tracking-wide">Español</span>
        </Link>
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-1">Guía educativa</p>
        <h1 className="font-display text-3xl tracking-wider text-brand-white leading-tight">CÓMO EMPEZAR UN NEGOCIO</h1>
        <p className="text-[12px] text-brand-silver mt-2 leading-relaxed">{PAGE.intro}</p>
      </div>

      <div className="px-5 max-w-md mx-auto w-full pb-12 pt-6 space-y-4">
        <div className="rounded-2xl p-4 flex items-start gap-2"
          style={{ background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.25)' }}>
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EFB967' }} />
          <p className="text-[12px] text-brand-silver leading-relaxed">{copy.scopeNote}</p>
        </div>

        {copy.sections.map(section => (
          <section key={section.id} className="glass rounded-2xl p-5">
            <h2 className="font-display text-base tracking-wide text-brand-white mb-1">{section.title}</h2>
            <p className="text-[11px] text-brand-silver/70 leading-relaxed mb-3">{section.intro}</p>
            <div className="space-y-2.5">
              {section.items.map(item => (
                <div key={item.label}>
                  <p className="text-[13px] font-semibold text-brand-white leading-snug">{item.label}</p>
                  <p className="text-[11px] text-brand-silver leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="glass rounded-2xl p-5">
          <h2 className="font-display text-base tracking-wide text-brand-white mb-3">Tu próximo paso</h2>
          <div className="space-y-3">
            {copy.routing.map(rec => (
              <Link key={rec.audience} href={rec.recommendedPath} className="block rounded-xl px-3 py-3"
                style={{ background: 'rgba(74,144,217,0.08)', border: '1px solid rgba(74,144,217,0.22)' }}>
                <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-brand-accent block mb-0.5">{rec.audience}</span>
                <span className="text-[13px] font-semibold text-brand-white">{rec.cta}</span>
                <span className="text-[11px] text-brand-silver block mt-0.5 leading-relaxed">{rec.note}</span>
              </Link>
            ))}
          </div>
        </section>

        <Link href="/start"
          className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl text-sm font-semibold tracking-wide uppercase bg-brand-accent text-white shadow-glow-blue active:scale-[0.98] transition-all touch-target">
          Comenzar evaluación <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Compartir (solo manual) */}
        <ShareReferralCard context="spanish_business_starter" lang="es" />

        <p className="text-[10px] text-brand-silver/60 leading-relaxed pt-1">{copy.disclaimer}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {[['Español', '/es'], ['Preparación empresarial', '/es/preparacion-empresarial'], ['Resources (English)', '/resources'], ['Disclaimer (English)', '/disclaimer']].map(([label, href]) => (
            <Link key={href} href={href} className="text-[12px] text-brand-accent hover:underline underline-offset-2">{label}</Link>
          ))}
        </div>
      </div>
    </main>
  )
}
