import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Info } from 'lucide-react'
import { buildOpenGraph, buildTwitter } from '@/lib/seo'
import {
  getSpanishScopeNote, getSpanishNotFullyTranslatedNote, getSpanishDiscoveryPages, SPANISH_OG_LOCALE,
} from '@/lib/spanishDiscovery'
import ShareReferralCard from '@/components/ShareReferralCard'

const PAGE = getSpanishDiscoveryPages()[0]

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.metaDescription,
  alternates: { canonical: '/es' },
  openGraph: { ...buildOpenGraph({ title: PAGE.title, description: PAGE.metaDescription, path: '/es' }), locale: SPANISH_OG_LOCALE },
  twitter: buildTwitter({ title: PAGE.title, description: PAGE.metaDescription }),
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-2xl p-5">
      <h2 className="font-display text-base tracking-wide text-brand-white mb-2">{title}</h2>
      <div className="text-[13px] text-brand-silver leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

export default function SpanishHomePage() {
  return (
    <main lang="es" className="min-h-dvh bg-brand-navy">
      <div className="px-5 pt-5 pb-4 border-b border-brand-blue/40"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)' }}>
        <Link href="/" className="inline-flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs tracking-wide">Inicio (English)</span>
        </Link>
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-1">Español</p>
        <h1 className="font-display text-3xl tracking-wider text-brand-white leading-tight">
          SUBZERO<span className="text-brand-accent">METRIX</span>™ EN ESPAÑOL
        </h1>
        <p className="text-[12px] text-brand-silver mt-2 leading-relaxed">{PAGE.intro}</p>
      </div>

      <div className="px-5 max-w-md mx-auto w-full pb-12 pt-6 space-y-4">
        <div className="rounded-2xl p-4 flex items-start gap-2"
          style={{ background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.25)' }}>
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EFB967' }} />
          <p className="text-[12px] text-brand-silver leading-relaxed">{getSpanishScopeNote()}</p>
        </div>

        <Section title="Qué es SubZeroMetrix™">
          <p>
            SubZeroMetrix™ es una plataforma de preparación empresarial operada por
            The Modern Trades Mentor LLC. Ayuda a contratistas, personas de oficios y
            dueños de negocios de servicios a evaluar la preparación de su negocio e
            identificar próximos pasos prácticos.
          </p>
        </Section>

        <Section title="Para quién es">
          <p>
            Actualmente es más fuerte para contratistas, personas de oficios y dueños
            de negocios de servicios, por ejemplo HVAC, electricidad, plomería,
            techado, jardinería, limpieza y pintura.
          </p>
        </Section>

        <Section title="Qué es el MetrixScore™">
          <p>
            Tu MetrixScore™ es un puntaje de preparación empresarial que se genera con
            una evaluación corta. El Starter MetrixScore™ gratuito es un punto de
            partida que se vuelve más preciso a medida que completas tu perfil. Es una
            referencia de preparación, no un puntaje final, comparado ni predictivo.
          </p>
        </Section>

        <Link href="/start"
          className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl text-sm font-semibold tracking-wide uppercase bg-brand-accent text-white shadow-glow-blue active:scale-[0.98] transition-all touch-target">
          Comenzar evaluación <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="grid grid-cols-1 gap-2">
          <Link href="/es/como-empezar-un-negocio"
            className="flex items-center justify-center text-center py-3 px-3 rounded-xl text-[13px] font-medium glass text-brand-silver hover:text-brand-white transition-colors touch-target">
            Ver guía para iniciar un negocio
          </Link>
          <Link href="/es/preparacion-empresarial"
            className="flex items-center justify-center text-center py-3 px-3 rounded-xl text-[13px] font-medium glass text-brand-silver hover:text-brand-white transition-colors touch-target">
            Aprender sobre preparación empresarial
          </Link>
        </div>

        {/* Compartir (solo manual) */}
        <ShareReferralCard context="spanish_discovery" lang="es" />

        <p className="text-[11px] text-brand-silver/70 leading-relaxed pt-1">{getSpanishNotFullyTranslatedNote()}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {[['About (English)', '/about'], ['Resources (English)', '/resources'], ['Disclaimer (English)', '/disclaimer']].map(([label, href]) => (
            <Link key={href} href={href} className="text-[12px] text-brand-accent hover:underline underline-offset-2">
              {label}
            </Link>
          ))}
        </div>
        <p className="text-[10px] text-brand-silver/50 leading-relaxed">
          SubZeroMetrix™ y MetrixScore™ son marcas de The Modern Trades Mentor LLC.
        </p>
      </div>
    </main>
  )
}
