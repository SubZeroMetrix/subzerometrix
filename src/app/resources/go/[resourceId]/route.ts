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

// A friendly, status-leak-free "resource unavailable" page. It never reveals WHY a resource is
// unavailable (held / unverified / stale / disabled) and offers a safe return to the directory
// and dashboard. No provider URL, no internal verification detail.
function unavailableHtml(): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Resource unavailable | SubZeroMetrix</title>
<style>body{margin:0;background:#0A1628;color:#F4F7FB;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.card{max-width:28rem;text-align:center}h1{font-size:1.4rem;margin:0 0 .5rem}p{color:#A8B8CC;line-height:1.6;font-size:.95rem}
a{display:inline-block;margin:.4rem;padding:.7rem 1.1rem;border-radius:4px;text-decoration:none;font-size:.85rem}
.primary{background:#4A90D9;color:#fff}.secondary{border:1px solid rgba(168,184,204,.35);color:#A8B8CC}</style></head>
<body><div class="card"><h1>This resource isn&rsquo;t available right now</h1>
<p>We only link to providers once they pass verification. You can browse other resources or continue your roadmap &mdash; and you can always use your own provider.</p>
<div><a class="primary" href="/resources">Resource directory</a><a class="secondary" href="/dashboard">Your dashboard</a></div></div></body></html>`
}

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
    // Fail safe: disabled, unverified, broken, stale, held, or unknown → never a provider redirect.
    // Return a user-friendly, status-leak-free unavailable page (404) with a safe way back.
    return new NextResponse(unavailableHtml(), {
      status: 404,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
  }

  // Verified + active destination only. External absolute URL or internal path.
  const target = resolution.isExternal
    ? resolution.destination
    : new URL(resolution.destination, req.nextUrl.origin).toString()
  return NextResponse.redirect(target, { status: 302 })
}
