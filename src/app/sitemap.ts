import type { MetadataRoute } from 'next'
import { seedProducts, comparisons } from '@/../../content/products'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://subzerometrix.com'
  const now = new Date().toISOString()

  // '' (the homepage) is now the Metrix Command Center landing page and
  // is the primary indexed route. The remaining affiliate-platform routes
  // stay reachable but are de-prioritized rather than removed outright.
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/tools',
    '/compare',
    '/tool-finder',
    '/reviews',
    '/guides',
    '/about/richard-fritzke',
    '/affiliate-disclosure',
    '/editorial-policy',
    '/editorial-methodology',
  ]

  const productRoutes = seedProducts.map((p) => `/tools/${p.slug}`)
  const comparisonRoutes = comparisons.map((c) => `/compare/${c.slug}`)
  const reviewRoutes = seedProducts.map((p) => `/reviews/${p.slug}`)

  const guideRoutes = [
    '/guides/best-email-marketing-tools',
    '/guides/all-in-one-vs-best-of-breed',
    '/guides/newsletter-platforms-compared',
  ]

  const launchContentRoutes = [
    '/tools/best-online-business-software',
    '/tools/best-email-marketing-software',
    '/tools/best-website-platform',
  ]

  const allRoutes = [
    ...staticRoutes,
    ...productRoutes,
    ...comparisonRoutes,
    ...reviewRoutes,
    ...guideRoutes,
    ...launchContentRoutes,
  ]

  return allRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === ''
      ? 1
      : route.includes('/tools/') || route.includes('/compare/')
        ? 0.8
        : 0.6,
  }))
}
