import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Info } from 'lucide-react'
import { buildOpenGraph, buildTwitter, faqPageJsonLd } from '@/lib/seo'
import { getSpanishContractorReadinessCopy, getSpanishDiscoveryPages } from '@/lib/spanishDiscovery'

const PAGE = getSpanishDiscoveryPages()[2]

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.metaDescription,
  alternates: { canonical: '/es/preparacion-empresarial' },
  openGraph: buildOpenGraph({ title: PAGE.title, description: PAGE.metaDescription, path: '/es/preparacion-empresarial' }),
  twitter: buildTwitter({ title: PAGE.title, description: PAGE.metaDescription }),
}

export default function PreparacionEmpresarialPage() {
  const copy = getSpanishContractorReadinessCopy()
  const faqLd = faqPageJsonLd(copy.faqs.map(f => ({ question: f.question, answer: f.answer })))

  return (
    <main lang="es" className="min-h-dvh bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="px-5 pt-5 pb-4 border-b border-brand-blue/40"
        style={{ background: 'linear-gradient(180deg, #0D2B5C 0%, #0A1628 100%)' }}>
        <Link href="/es" className="inline-flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs tracking-wide">Español</span>
        </Link>
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-silver mb-1">Educativo</p>
        <h1 className="font-display text-3xl tracking-wider text-brand-white leading-tight">PREPARACIÓN EMPRESARIAL</h1>
        <p className="text-[12px] text-brand-silver mt-2 leading-relaxed">{PAGE.intro}</p>
      </div>

      <div className="px-5 max-w-md mx-auto w-full pb-12 pt-6 space-y-4">
        <div className="rounded-2xl p-4 flex items-start gap-2"
          style={{ background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.25)' }}>
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EFB967' }} />
          <p className="text-[12px] text-brand-silver leading-relaxed">{copy.scopeNote}</p>
        </div>

        {copy.faqs.map(faq => (
          <section key={faq.question} className="glass rounded-2xl p-5">
            <h2 className="font-display text-base tracking-wide text-brand-white mb-2">{faq.question}</h2>
            <p className="text-[13px] text-brand-silver leading-relaxed">{faq.answer}</p>
          </section>
        ))}

        <Link href="/start"
          className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl text-sm font-semibold tracking-wide uppercase bg-brand-accent text-white shadow-glow-blue active:scale-[0.98] transition-all touch-target">
          Comenzar evaluación <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-[10px] text-brand-silver/60 leading-relaxed pt-1">{copy.disclaimer}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {[['Español', '/es'], ['Cómo empezar un negocio', '/es/como-empezar-un-negocio'], ['Resources (English)', '/resources'], ['Disclaimer (English)', '/disclaimer']].map(([label, href]) => (
            <Link key={href} href={href} className="text-[12px] text-brand-accent hover:underline underline-offset-2">{label}</Link>
          ))}
        </div>
        <p className="text-[10px] text-brand-silver/50 leading-relaxed">
          SubZeroMetrix™ y MetrixScore™ son marcas de The Modern Trades Mentor LLC.
        </p>
      </div>
    </main>
  )
}
