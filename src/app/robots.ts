import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.subzerometrix.com'

  const aiAllowPaths = [
    '/',
    '/resources/',
    '/tools/',
    '/compare/',
    '/guides/',
    '/reviews/',
    '/about/',
    '/editorial-policy',
    '/editorial-methodology',
    '/llms.txt',
    '/llms-full.txt',
  ]

  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/go/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/go/'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: aiAllowPaths,
        disallow: ['/api/', '/admin/', '/go/'],
      },
      {
        userAgent: 'GPTBot',
        allow: aiAllowPaths,
        disallow: ['/api/', '/admin/', '/go/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: aiAllowPaths,
        disallow: ['/api/', '/admin/', '/go/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: aiAllowPaths,
        disallow: ['/api/', '/admin/', '/go/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: aiAllowPaths,
        disallow: ['/api/', '/admin/', '/go/'],
      },
      {
        userAgent: 'Claude-User',
        allow: aiAllowPaths,
        disallow: ['/api/', '/admin/', '/go/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/go/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
