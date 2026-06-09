import Link from 'next/link'
import { ArrowRight, Smartphone, Star, Zap, Map, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Get the SubZeroMetrix App | Free Download',
  description: 'Install SubZeroMetrix on your phone. Free MetrixScore™ assessment and personalized business roadmap for trades professionals.',
}

export default function InstallPage() {
  return (
    <main className="min-h-dvh bg-brand-navy">
      <div className="px-5 pt-8 pb-20 max-w-md mx-auto">

        {/* Brand */}
        <div className="text-center mb-10">
          {/* Ice crystal */}
          <div className="flex justify-center mb-5">
            <svg width="64" height="64" viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <line x1="40" y1="6" x2="40" y2="74" stroke="#C8D4E0" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="6" y1="40" x2="74" y2="40" stroke="#C8D4E0" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="12" y1="12" x2="68" y2="68" stroke="#C8D4E0" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="68" y1="12" x2="12" y2="68" stroke="#C8D4E0" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="40" y1="6" x2="33" y2="16" stroke="#C8D4E0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              <line x1="40" y1="6" x2="47" y2="16" stroke="#C8D4E0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              <line x1="40" y1="74" x2="33" y2="64" stroke="#C8D4E0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              <line x1="40" y1="74" x2="47" y2="64" stroke="#C8D4E0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              <line x1="6" y1="40" x2="16" y2="33" stroke="#C8D4E0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              <line x1="6" y1="40" x2="16" y2="47" stroke="#C8D4E0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              <line x1="74" y1="40" x2="64" y2="33" stroke="#C8D4E0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              <line x1="74" y1="40" x2="64" y2="47" stroke="#C8D4E0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              <circle cx="40" cy="40" r="7" fill="#0A1628" stroke="#C8D4E0" strokeWidth="2"/>
              <circle cx="40" cy="40" r="3.5" fill="#4A90D9"/>
              <circle cx="40" cy="6" r="3" fill="#4A90D9" opacity="0.8"/>
              <circle cx="40" cy="74" r="3" fill="#4A90D9" opacity="0.8"/>
              <circle cx="6" cy="40" r="3" fill="#4A90D9" opacity="0.8"/>
              <circle cx="74" cy="40" r="3" fill="#4A90D9" opacity="0.8"/>
              <circle cx="12" cy="12" r="2.5" fill="#C8D4E0" opacity="0.6"/>
              <circle cx="68" cy="68" r="2.5" fill="#C8D4E0" opacity="0.6"/>
              <circle cx="68" cy="12" r="2.5" fill="#C8D4E0" opacity="0.6"/>
              <circle cx="12" cy="68" r="2.5" fill="#C8D4E0" opacity="0.6"/>
            </svg>
          </div>

          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-brand-accent mb-2">
            Free App
          </p>
          <h1 className="font-display text-brand-white leading-none mb-3"
            style={{ fontSize: 'clamp(2.4rem, 11vw, 3.2rem)', letterSpacing: '0.04em' }}>
            SUBZERO<span className="text-brand-accent">METRIX</span>
          </h1>
          <p className="text-brand-silver text-[14px] leading-relaxed">
            Know your business temperature. Get your roadmap. Build from there.
          </p>

          {/* Rating strip */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-4 h-4 fill-current text-brand-accent" />
            ))}
            <span className="text-[11px] text-brand-silver ml-1">Free to start</span>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="space-y-3 mb-8">
          {[
            { icon: Zap, title: 'MetrixScore™ in 4 minutes', desc: 'Honest assessment of where your business actually stands.' },
            { icon: Map, title: 'Personalized roadmap', desc: 'Step-by-step priorities built for your trade and your state.' },
            { icon: CheckCircle2, title: 'Progress tracking', desc: 'Check off roadmap steps. Watch your temperature rise.' },
            { icon: Smartphone, title: 'Works like a native app', desc: 'Installs on your home screen. Full-screen. Offline capable.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 rounded-sm p-4"
              style={{ background: 'rgba(13,43,92,0.35)', border: '1px solid rgba(168,184,204,0.15)' }}>
              <div className="w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(74,144,217,0.15)' }}>
                <Icon className="w-4 h-4 text-brand-accent" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-brand-white mb-0.5">{title}</p>
                <p className="text-[12px] text-brand-silver leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Android install */}
        <div className="rounded-sm p-5 mb-4"
          style={{ background: 'rgba(74,144,217,0.1)', border: '1.5px solid rgba(74,144,217,0.4)' }}>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-accent mb-1">Android</p>
          <p className="text-sm font-semibold text-brand-white mb-2">Chrome — tap "Add to Home Screen"</p>
          <div className="space-y-1.5 mb-3">
            {[
              'Open subzerometrix.com in Chrome',
              'Tap the menu (⋮) in the top right',
              'Tap "Add to Home Screen"',
              'Tap "Add" to confirm',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                  style={{ background: 'rgba(74,144,217,0.2)', color: '#4A90D9' }}>
                  {i + 1}
                </div>
                <span className="text-[12px] text-brand-silver">{step}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-brand-silver/60">
            On Android, Chrome will show an automatic install banner when you visit the site.
          </p>
        </div>

        {/* iOS install */}
        <div className="rounded-sm p-5 mb-8"
          style={{ background: 'rgba(168,184,204,0.06)', border: '1px solid rgba(168,184,204,0.2)' }}>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-silver mb-1">iPhone / iPad</p>
          <p className="text-sm font-semibold text-brand-white mb-2">Safari — Add to Home Screen</p>
          <div className="space-y-1.5 mb-3">
            {[
              'Open subzerometrix.com in Safari',
              'Tap the Share button (box with arrow ↑) at the bottom',
              'Scroll down and tap "Add to Home Screen"',
              'Tap "Add" in the top right corner',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                  style={{ background: 'rgba(168,184,204,0.15)', color: '#A8B8CC' }}>
                  {i + 1}
                </div>
                <span className="text-[12px] text-brand-silver">{step}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-brand-silver/60">
            Must use Safari on iPhone/iPad for the &quot;Add to Home Screen&quot; option to appear.
          </p>
        </div>

        {/* CTA */}
        <Link href="/assessment"
          className="flex items-center justify-center gap-3 w-full py-4 rounded-sm text-[13px] font-semibold tracking-[0.1em] uppercase bg-brand-accent text-white hover:bg-brand-mid transition-all active:scale-[0.98] touch-target mb-3"
          style={{ boxShadow: '0 0 32px rgba(74,144,217,0.25)' }}>
          Get My MetrixScore™ — Free <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-center text-[11px] text-brand-silver/60 mb-8">
          No download required to start. Install after for quick access.
        </p>

        {/* App store note */}
        <div className="rounded-sm p-4 text-center"
          style={{ background: 'rgba(13,43,92,0.3)', border: '1px solid rgba(168,184,204,0.1)' }}>
          <p className="text-[11px] text-brand-silver leading-relaxed">
            <span className="text-brand-white font-medium">Native app store versions coming soon.</span>
            {' '}SubZeroMetrix currently installs as a Progressive Web App (PWA) — the same experience as a native app, directly from your browser. No App Store required.
          </p>
        </div>

      </div>
    </main>
  )
}
