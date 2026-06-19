import { NextRequest, NextResponse } from 'next/server'
import { seedProducts } from '@/../../content/products'
import { createAdminClient } from '@/lib/supabase/admin'

const ALLOWED_DOMAINS = [
  'systeme.io',
  'mailerlite.com',
  'kinsta.com',
  'getresponse.com',
  'kit.com',
  'convertkit.com',
  'beehiiv.com',
  'activecampaign.com',
  'shopify.com',
  'semrush.com',
  'instantly.ai',
]

function isAllowedDomain(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ALLOWED_DOMAINS.some(
      (d) => parsed.hostname === d || parsed.hostname.endsWith('.' + d)
    )
  } catch {
    return false
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const product = seedProducts.find((p) => p.slug === params.slug)

  if (!product) {
    return NextResponse.redirect(new URL('/tools', request.url))
  }

  const destination = product.website_url
  if (!isAllowedDomain(destination)) {
    return NextResponse.redirect(new URL('/tools', request.url))
  }

  const ua = request.headers.get('user-agent') || ''
  const isBot = /bot|crawl|spider|slurp|facebookexternalhit|bingpreview/i.test(ua)

  if (!isBot) {
    const src = request.nextUrl.searchParams.get('src') || null
    const campaign = request.nextUrl.searchParams.get('utm_campaign') || null
    const fromToolFinder = src === 'tool-finder'
    const referer = request.headers.get('referer') || null
    const sourcePage = referer ? new URL(referer).pathname : null

    try {
      const supabase = createAdminClient()

      const dedupeKey = `${params.slug}-${sourcePage}-${Date.now().toString().slice(0, -4)}`
      const { data: existing } = await supabase
        .from('affiliate_click_events')
        .select('id')
        .eq('ip_hash', dedupeKey)
        .limit(1)
        .single()

      if (!existing) {
        await supabase.from('affiliate_click_events').insert({
          click_timestamp: new Date().toISOString(),
          source_page: sourcePage,
          campaign,
          tool_finder_result: fromToolFinder,
          ip_hash: dedupeKey,
        })
      }
    } catch {
      // Click logging should not block the redirect
    }
  }

  return NextResponse.redirect(destination, { status: 302 })
}
