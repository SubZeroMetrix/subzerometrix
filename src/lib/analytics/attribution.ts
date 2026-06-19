export type TrafficSource =
  | 'google-organic'
  | 'bing-organic'
  | 'direct'
  | 'social'
  | 'email'
  | 'chatgpt-referral'
  | 'perplexity-referral'
  | 'gemini-referral'
  | 'other-ai-referral'
  | 'partner-referral'
  | 'paid'
  | 'unknown'

export function classifySource(
  referrer: string | null,
  utmSource: string | null
): TrafficSource {
  if (utmSource) {
    const src = utmSource.toLowerCase()
    if (src === 'google' || src === 'google-ads' || src === 'adwords') return 'paid'
    if (src === 'bing' || src === 'bing-ads') return 'paid'
    if (src === 'facebook' || src === 'twitter' || src === 'linkedin' || src === 'instagram' || src === 'youtube' || src === 'tiktok' || src === 'reddit') return 'social'
    if (src === 'email' || src === 'newsletter' || src === 'mailerlite' || src === 'getresponse' || src === 'kit' || src === 'beehiiv' || src === 'activecampaign') return 'email'
    if (src === 'chatgpt') return 'chatgpt-referral'
    if (src === 'perplexity') return 'perplexity-referral'
    if (src === 'gemini') return 'gemini-referral'
    if (src === 'partner') return 'partner-referral'
  }

  if (!referrer) return 'direct'

  let hostname: string
  try {
    hostname = new URL(referrer).hostname.toLowerCase()
  } catch {
    return 'unknown'
  }

  if (hostname.includes('google.') || hostname === 'www.google.com') return 'google-organic'
  if (hostname.includes('bing.com')) return 'bing-organic'

  if (hostname.includes('chat.openai.com') || hostname.includes('chatgpt.com')) return 'chatgpt-referral'
  if (hostname.includes('perplexity.ai')) return 'perplexity-referral'
  if (hostname.includes('gemini.google.com') || hostname.includes('bard.google.com')) return 'gemini-referral'
  if (hostname.includes('claude.ai') || hostname.includes('copilot.microsoft.com') || hostname.includes('you.com')) return 'other-ai-referral'

  if (
    hostname.includes('facebook.com') || hostname.includes('fb.com') ||
    hostname.includes('twitter.com') || hostname.includes('x.com') ||
    hostname.includes('linkedin.com') ||
    hostname.includes('instagram.com') ||
    hostname.includes('youtube.com') ||
    hostname.includes('tiktok.com') ||
    hostname.includes('reddit.com') ||
    hostname.includes('pinterest.com')
  ) {
    return 'social'
  }

  if (hostname.includes('mail.') || hostname.includes('outlook.') || hostname.includes('yahoo.')) {
    return 'email'
  }

  return 'unknown'
}
