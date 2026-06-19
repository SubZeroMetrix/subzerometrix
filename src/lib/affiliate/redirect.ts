import { createClient } from '@/lib/supabase/server'

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
]

export function isAllowedDestination(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ALLOWED_DOMAINS.some(
      (domain) =>
        parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
    )
  } catch {
    return false
  }
}

export async function resolveAffiliateLink(slug: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('affiliate_links')
    .select(`
      id,
      slug,
      destination_url,
      is_active,
      product_id,
      products (name, slug)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  if (!isAllowedDestination(data.destination_url)) return null

  return data
}

export async function logClickEvent(
  affiliateLinkId: string,
  sourcePage: string | null,
  campaign: string | null,
  fromToolFinder: boolean
) {
  const supabase = createClient()

  await supabase.from('affiliate_click_events').insert({
    affiliate_link_id: affiliateLinkId,
    click_timestamp: new Date().toISOString(),
    source_page: sourcePage,
    campaign: campaign,
    tool_finder_result: fromToolFinder,
  })
}
