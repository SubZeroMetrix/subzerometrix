'use client'

import { useState, useEffect } from 'react'
import { updateConsent, getConsent } from '@/lib/analytics/events'

export function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hasDecided = typeof window !== 'undefined' && localStorage.getItem('szm_consent')
    if (!hasDecided) setVisible(true)
  }, [])

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
    <div className="fixed bottom-0 inset-x-0 z-50 bg-brand-navy text-white p-4 shadow-panel-xl" role="dialog" aria-label="Cookie consent">
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
