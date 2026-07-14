'use client'

import { useState, useEffect, useRef } from 'react'
import { updateConsent, getConsent } from '@/lib/analytics/events'

export function ConsentBanner() {
  const [visible, setVisible] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hasDecided = typeof window !== 'undefined' && localStorage.getItem('szm_consent')
    if (!hasDecided) setVisible(true)
  }, [])

  // The banner is fixed to the bottom of the viewport and can otherwise
  // cover interactive content (e.g. the hero CTA) on short mobile
  // viewports before a consent decision is made. Reserve real space for
  // it so nothing sits underneath, unreachable, while it's visible.
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (visible && bannerRef.current) {
      document.body.style.paddingBottom = `${bannerRef.current.offsetHeight}px`
    } else {
      document.body.style.paddingBottom = ''
    }
    return () => {
      document.body.style.paddingBottom = ''
    }
  }, [visible])

  function accept() {
    updateConsent({ analytics: true, marketing: false })
    setVisible(false)
  }

  function decline() {
    updateConsent({ analytics: false, marketing: false })
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div ref={bannerRef} className="fixed bottom-0 inset-x-0 z-50 bg-brand-navy text-white p-4 shadow-panel-xl" role="dialog" aria-label="Cookie consent">
      <div className="section-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-gray-300">
          We use cookies for essential functionality and optional analytics.
          See our{' '}
          <a href="/privacy" className="text-brand-cyan underline hover:text-brand-cyan-light">privacy policy</a>.
        </p>
        <div className="flex gap-3 shrink-0">
          <button onClick={decline} className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-full transition-colors">
            Decline
          </button>
          <button onClick={accept} className="text-sm font-semibold text-white bg-brand-electric hover:bg-blue-700 px-5 py-2 rounded-full transition-colors">
            Accept Analytics
          </button>
        </div>
      </div>
    </div>
  )
}
