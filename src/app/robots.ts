import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://subzerometric.com'

  const aiAllowPaths = [
    '/',
    '/tools/',
    '/compare/',
    '/guides/',
    '/reviews/',
    '/about/',
    '/editorial-policy',
    '/editorial-methodology',
    '/llms.txt',
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
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/go/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
