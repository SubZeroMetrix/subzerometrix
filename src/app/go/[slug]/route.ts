import { NextRequest, NextResponse } from 'next/server'
import { seedProducts } from '@/../../content/products'

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

    // Privacy-safe logging: no PII stored, just aggregate click data
    // In production this would write to Supabase affiliate_click_events
    if (process.env.NODE_ENV === 'development') {
      console.log('[affiliate-click]', {
        slug: params.slug,
        source: request.nextUrl.searchParams.get('ref') || request.headers.get('referer'),
        campaign,
        fromToolFinder,
        timestamp: new Date().toISOString(),
      })
    }
  }

  return NextResponse.redirect(destination, { status: 302 })
}
