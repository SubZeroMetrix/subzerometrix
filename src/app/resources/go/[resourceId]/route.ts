// ─────────────────────────────────────────────────────────────────────────────
// GET /resources/go/[resourceId] — Wave 6: privacy-safe tracked outbound redirect
// ─────────────────────────────────────────────────────────────────────────────
// The thin I/O shell over metrix/resourceRedirects.resolveRedirect. It is DORMANT by design
// in Wave 6:
//   • Gated behind the `tracked_resource_redirects` feature flag (defaults OFF).
//   • Resolves against the PUBLISHED ecosystem catalog, which is EMPTY until Wave 7 records
//     are verified with evidence.
// With either guard in place the route returns 404 — no unverified provider is ever reachable.
//
// When activated (flag on + verified records), it resolves ONLY verified + active destinations,
// fails safe on anything else, and never places private user data in the URL. The privacy-safe
// outbound event is wired through the existing /api/track-click sink in Wave 7; this handler
// only performs the gated redirect.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { resolveRedirect } from '@/lib/metrix/resourceRedirects'
import { getPublishedEcosystemCatalog } from '@/lib/metrix/ecosystemCatalog'
import { isFeatureEnabled } from '@/lib/featureFlags'

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ resourceId: string }> },
) {
  const { resourceId } = await ctx.params
  const enabled = isFeatureEnabled('tracked_resource_redirects')

  const resolution = resolveRedirect(
    resourceId,
    getPublishedEcosystemCatalog(),
    {
      // Only non-PII, allow-listed context — the originating path is read defensively.
      originatingRoute: req.nextUrl.pathname,
      placement: 'resources_page',
    },
    enabled,
  )

  if (resolution.status !== 'ok' || !resolution.destination) {
    // Fail safe: disabled, unverified, broken, stale, or unknown → 404. Never a broken redirect.
    return new NextResponse(null, { status: 404 })
  }

  // Verified + active destination only. External absolute URL or internal path.
  const target = resolution.isExternal
    ? resolution.destination
    : new URL(resolution.destination, req.nextUrl.origin).toString()
  return NextResponse.redirect(target, { status: 302 })
}
