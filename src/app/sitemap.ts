import type { MetadataRoute } from 'next'
import { seedProducts, comparisons } from '@/../../content/products'
import { getAllHelpArticles } from '@/lib/help-articles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.subzerometrix.com'
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
    '/resources',
    '/resources/hvac',
    '/resources/facility-management',
    '/resources/electrical',
    '/resources/plumbing',
    '/resources/business-operations',
    '/resources/ai-for-contractors',
    '/resources/tools/follow-up-revenue-calculator',
    '/resources/tools/estimate-follow-up-priority-calculator',
    '/help',
    '/customer-care',
    '/customer-care/qualify',
    '/customer-care/refer',
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
  // /reviews/[slug] intentionally 307-redirects to /tools/[slug] (see
  // src/app/reviews/[slug]/page.tsx) -- it is not itself a 200 page, so
  // it must not be listed in the sitemap as if it were one. The
  // canonical destination is already covered by productRoutes above.

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

  const helpArticles = await getAllHelpArticles()
  const helpArticleRoutes = helpArticles.map((a) => `/help/${a.slug}`)

  const allRoutes = [
    ...staticRoutes,
    ...productRoutes,
    ...comparisonRoutes,
    ...guideRoutes,
    ...launchContentRoutes,
    ...helpArticleRoutes,
  ]

  return allRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === ''
      ? 1
      : route.includes('/tools/') || route.includes('/compare/') || route.startsWith('/resources')
        ? 0.8
        : 0.6,
  }))
}
