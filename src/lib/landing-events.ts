'use client'

function getOrCreateId(key: string): string {
  if (typeof window === 'undefined') return 'server'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
  }
  return id
}

function getVisitorId(): string {
  if (typeof window === 'undefined') return 'server'
  let id = localStorage.getItem('szm_visitor_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('szm_visitor_id', id)
  }
  return id
}

export function trackLandingEvent(
  eventName: string,
  metadata?: Record<string, string | number | boolean>,
  relatedId?: string
) {
  if (typeof window === 'undefined') return

  let consent = false
  try {
    const stored = localStorage.getItem('szm_consent')
    consent = stored ? JSON.parse(stored).analytics === true : false
  } catch {
    consent = false
  }
  if (!consent) return

  const payload = {
    eventName,
    visitorId: getVisitorId(),
    sessionId: getOrCreateId('szm_session_id'),
    route: window.location.pathname,
    metadata: metadata || {},
    relatedId: relatedId || null,
    consentAnalytics: true,
  }

  fetch('/api/landing-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // Analytics failures must never affect the user experience.
  })
}
