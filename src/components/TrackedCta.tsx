'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'

interface TrackedCtaProps {
  href: string
  event: string
  source: string
  className?: string
  children: React.ReactNode
  external?: boolean
}

/**
 * Every outbound/internal CTA that routes to TMT, Modern Trades CRM, or
 * another tracked destination should use this instead of a raw <a>/<Link>
 * -- keeps click tracking consistent instead of some CTAs having it and
 * others silently not (found during the CTA/attribution audit: most
 * public-page CTAs had no tracking at all before this component existed).
 */
export function TrackedCta({ href, event, source, className, children, external = false }: TrackedCtaProps) {
  const handleClick = () => track(event, { source })

  if (external) {
    return (
      <a href={href} className={className} onClick={handleClick}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
