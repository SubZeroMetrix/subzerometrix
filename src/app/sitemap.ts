import type { MetadataRoute } from 'next'
import { seedProducts, comparisons } from '@/../../content/products'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://subzerometric.com'
  const now = new Date().toISOString()

  const staticRoutes = [
    '',
    '/tools',
    '/compare',
    '/tool-finder',
    '/reviews',
    '/guides',
    '/about',
    '/contact',
    '/affiliate-disclosure',
    '/privacy',
    '/terms',
    '/editorial-policy',
  ]

  const productRoutes = seedProducts.map((p) => `/tools/${p.slug}`)
  const comparisonRoutes = comparisons.map((c) => `/compare/${c.slug}`)
  const reviewRoutes = seedProducts.map((p) => `/reviews/${p.slug}`)
  const guideRoutes = [
    '/guides/best-email-marketing-tools',
    '/guides/all-in-one-vs-best-of-breed',
    '/guides/newsletter-platforms-compared',
  ]

  const allRoutes = [
    ...staticRoutes,
    ...productRoutes,
    ...comparisonRoutes,
    ...reviewRoutes,
    ...guideRoutes,
  ]

  return allRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route.includes('/tools/') || route.includes('/compare/') ? 0.8 : 0.6,
  }))
}
