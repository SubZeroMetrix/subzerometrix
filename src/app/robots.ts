import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.subzerometrix.com'

  const aiAllowPaths = [
    '/',
    '/revenue-leak-check',
    '/modern-trades-crm',
    '/resources/',
    '/about/',
    '/llms.txt',
    '/llms-full.txt',
  ]

  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/go/', '/newsletter/preferences'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/go/', '/newsletter/preferences'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: aiAllowPaths,
        disallow: ['/api/', '/admin/', '/go/', '/newsletter/preferences'],
      },
      {
        userAgent: 'GPTBot',
        allow: aiAllowPaths,
        disallow: ['/api/', '/admin/', '/go/', '/newsletter/preferences'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: aiAllowPaths,
        disallow: ['/api/', '/admin/', '/go/', '/newsletter/preferences'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: aiAllowPaths,
        disallow: ['/api/', '/admin/', '/go/', '/newsletter/preferences'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: aiAllowPaths,
        disallow: ['/api/', '/admin/', '/go/', '/newsletter/preferences'],
      },
      {
        userAgent: 'Claude-User',
        allow: aiAllowPaths,
        disallow: ['/api/', '/admin/', '/go/', '/newsletter/preferences'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/go/', '/newsletter/preferences'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
