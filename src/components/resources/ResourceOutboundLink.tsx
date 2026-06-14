'use client'

// ─────────────────────────────────────────────────────────────────────────────
// resources/ResourceOutboundLink — Wave 7 CP7: consent-gated tracked outbound link
// ─────────────────────────────────────────────────────────────────────────────
// Renders the outbound link to the tracked redirect (/resources/go/<id>). On click it emits the
// consent-gated outbound funnel signal through the EXISTING attribution sink (no new system) —
// and ONLY when analytics consent is granted. Navigation is NEVER blocked by missing consent.
// The server redirect route re-gates eligibility and fails safe, so this never reaches an
// unverified provider. No PII is passed — only the allow-listed entry fields.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import type { DirectoryEntry } from '@/lib/metrix/resourceDirectory'
import { trackOutboundClickFields } from '@/lib/metrix/resourceAttribution'

export default function ResourceOutboundLink({
  entry,
  placement = 'resource_directory',
  trackingConsent = false,
  children,
}: {
  entry: DirectoryEntry
  placement?: string
  trackingConsent?: boolean
  children?: React.ReactNode
}) {
  function onClick() {
    // Consent-aware: drops silently without consent. Never blocks the navigation below.
    trackOutboundClickFields(
      {
        resourceId: entry.resourceId,
        vendorId: entry.vendorId,
        placement,
        relationshipStatus: entry.relationshipStatus,
        disclosureRequired: entry.disclosureRequired,
      },
      trackingConsent,
    )
  }
  return (
    <Link
      href={entry.redirectPath}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-brand-accent hover:underline underline-offset-2 touch-target"
    >
      {children ?? 'Visit provider'} <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
    </Link>
  )
}
