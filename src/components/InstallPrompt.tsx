'use client'

import { useState, useEffect } from 'react'
import { X, Download, Smartphone } from 'lucide-react'

// BeforeInstallPromptEvent is not in standard TS types
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)

  useEffect(() => {
    // Check if already installed
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    setIsInStandaloneMode(standalone)

    // Check iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream
    setIsIOS(ios)

    // Check if user already dismissed
    const wasDismissed = localStorage.getItem('szm_install_dismissed')
    if (wasDismissed) setDismissed(true)

    // Capture the Android/Chrome install event
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('szm_install_dismissed', '1')
  }

  const handleInstall = async () => {
    if (!installEvent) return
    await installEvent.prompt()
    const choice = await installEvent.userChoice
    if (choice.outcome === 'accepted') {
      setDismissed(true)
    }
    setInstallEvent(null)
  }

  // Don't show if: already installed, dismissed, or not eligible
  if (isInStandaloneMode || dismissed) return null
  if (!installEvent && !isIOS) return null

  return (
    <>
      {/* Android/Chrome native install prompt */}
      {installEvent && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe"
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
        >
          <div
            className="max-w-md mx-auto rounded-sm p-4"
            style={{
              background: 'linear-gradient(135deg, #0D2B5C 0%, #0A1628 100%)',
              border: '1px solid rgba(74,144,217,0.4)',
              boxShadow: '0 -4px 40px rgba(10,22,40,0.8)',
            }}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(74,144,217,0.15)', border: '1px solid rgba(74,144,217,0.3)' }}
              >
                <Smartphone className="w-6 h-6 text-brand-accent" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-display text-base tracking-widest text-brand-white leading-none mb-0.5">
                  SUBZERO<span className="text-brand-accent">METRIX</span>
                </p>
                <p className="text-[12px] text-brand-silver leading-relaxed">
                  Add to your home screen for quick access to your roadmap.
                </p>
              </div>

              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-brand-silver/60 hover:text-brand-silver touch-target flex items-center justify-center"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2.5 rounded-sm text-[12px] font-medium text-brand-silver"
                style={{ background: 'rgba(168,184,204,0.1)', border: '1px solid rgba(168,184,204,0.15)' }}
              >
                Not now
              </button>
              <button
                onClick={handleInstall}
                className="flex-1 py-2.5 rounded-sm text-[12px] font-semibold text-white flex items-center justify-center gap-1.5 bg-brand-accent hover:bg-brand-mid transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Add to Home Screen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari instructions */}
      {isIOS && !installEvent && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 px-4"
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
        >
          {!showIOSInstructions ? (
            <div
              className="max-w-md mx-auto rounded-sm p-4"
              style={{
                background: 'linear-gradient(135deg, #0D2B5C 0%, #0A1628 100%)',
                border: '1px solid rgba(74,144,217,0.4)',
                boxShadow: '0 -4px 40px rgba(10,22,40,0.8)',
              }}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <p className="text-[12px] text-brand-silver flex-1">
                  Add SubZeroMetrix to your iPhone home screen
                </p>
                <button onClick={() => setShowIOSInstructions(true)}
                  className="text-[11px] text-brand-accent font-medium px-3 py-1.5 rounded-sm"
                  style={{ background: 'rgba(74,144,217,0.15)', border: '1px solid rgba(74,144,217,0.3)' }}>
                  How?
                </button>
                <button onClick={handleDismiss} className="text-brand-silver/50">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              className="max-w-md mx-auto rounded-sm p-5"
              style={{
                background: 'linear-gradient(135deg, #0D2B5C 0%, #0A1628 100%)',
                border: '1px solid rgba(74,144,217,0.4)',
                boxShadow: '0 -4px 40px rgba(10,22,40,0.8)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-accent">
                  Add to Home Screen
                </p>
                <button onClick={handleDismiss} className="text-brand-silver/50">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { num: '1', text: 'Tap the Share button at the bottom of Safari (the box with an arrow pointing up)' },
                  { num: '2', text: 'Scroll down and tap "Add to Home Screen"' },
                  { num: '3', text: 'Tap "Add" in the top right' },
                ].map(({ num, text }) => (
                  <div key={num} className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
                      style={{ background: 'rgba(74,144,217,0.2)', color: '#4A90D9', border: '1px solid rgba(74,144,217,0.3)' }}
                    >
                      {num}
                    </div>
                    <p className="text-[12px] text-brand-silver leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-brand-silver/50 mt-3 leading-relaxed">
                The app will appear on your home screen and open full-screen, just like a native app.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
