'use client'

import { useState, useEffect } from 'react'

const activities = [
  { text: 'Beginner launch stack completed', color: 'bg-emerald-400' },
  { text: 'MailerLite compared with Kit', color: 'bg-brand-electric' },
  { text: 'Premium hosting path updated', color: 'bg-amber-400' },
  { text: '3 overlapping subscriptions identified', color: 'bg-rose-400' },
  { text: 'SEO software deferred until growth stage', color: 'bg-violet-400' },
  { text: 'Newsletter path matched with beehiiv', color: 'bg-brand-cyan' },
  { text: 'Ecommerce path matched with Shopify', color: 'bg-emerald-400' },
]

export function ActivityStream() {
  const [visibleCount, setVisibleCount] = useState(3)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      setVisibleCount(activities.length)
      return
    }
    const interval = setInterval(() => {
      setVisibleCount((prev) => (prev >= activities.length ? 3 : prev + 1))
    }, 2500)
    return () => clearInterval(interval)
  }, [reducedMotion])

  const visible = activities.slice(0, visibleCount)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-3">
        {visible.map((activity, i) => (
          <div
            key={`${activity.text}-${i}`}
            className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/10 motion-safe:animate-fade-up"
            style={reducedMotion ? undefined : { animationDelay: `${i * 100}ms` }}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${activity.color} shrink-0`} />
            <span className="text-sm text-gray-200 flex-1">{activity.text}</span>
            <span className="text-xs text-gray-500 shrink-0">Example activity</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 text-center mt-6 italic">
        Example recommendation activity — not live user data
      </p>
    </div>
  )
}
