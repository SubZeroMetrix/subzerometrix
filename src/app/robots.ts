import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

// Growth-1 robots — allow normal crawling of public pages; keep private/paid/
// stateful routes and the API out of the index. No hidden AI instructions; no
// blocking of legitimate search/AI crawlers.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard',   // user-specific, device-local progress
        '/report',      // paid / private report
        '/unlock',      // checkout entry, stateful
        '/results',     // post-assessment, stateful
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
