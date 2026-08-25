import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.subzerometrix.com'
  const now = new Date().toISOString()

  const staticRoutes = [
    '',
    '/about',
    '/about/richard-fritzke',
    '/contact',
    '/privacy',
    '/terms',
    '/resources',
    '/resources/hvac',
    '/resources/hvac/recurring-revenue',
    '/resources/facility-management',
    '/resources/facility-management/facility-optimization',
    '/resources/electrical',
    '/resources/plumbing',
    '/resources/roofing',
    '/resources/landscaping',
    '/resources/general-contracting',
    '/resources/pest-control',
    '/resources/painting',
    '/resources/cleaning-services',
    '/resources/garage-door-repair',
    '/resources/appliance-repair',
    '/resources/water-damage-restoration',
    '/resources/security-and-alarm',
    '/resources/business-operations',
    '/resources/business-operations/dispatch-and-scheduling',
    '/resources/ai-for-contractors',
    '/resources/tools/follow-up-revenue-calculator',
    '/resources/tools/estimate-follow-up-priority-calculator',
  ]

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
    priority: route === '' ? 1 : route.startsWith('/resources') ? 0.8 : 0.5,
  }))
}
