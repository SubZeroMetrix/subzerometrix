import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { TRADE_CONFIGS } from '@/lib/tradeData'

// Growth-1 sitemap — REAL public, indexable routes only.
// Excludes private/paid/stateful pages (/report, /dashboard, /unlock, /results,
// /assessment), API routes, and the PWA /install helper.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  // Public marketing + legal pages that exist today.
  const staticPaths: { path: string; priority: number }[] = [
    { path: '/', priority: 1 },
    { path: '/start', priority: 0.9 },
    { path: '/about', priority: 0.8 },
    { path: '/business-readiness', priority: 0.8 },
    { path: '/general-business-starter', priority: 0.7 },
    { path: '/es', priority: 0.7 },
    { path: '/es/como-empezar-un-negocio', priority: 0.6 },
    { path: '/es/preparacion-empresarial', priority: 0.6 },
    { path: '/resources', priority: 0.8 },
    { path: '/partners', priority: 0.6 },
    { path: '/platform-ecosystem', priority: 0.7 },
    { path: '/terms', priority: 0.3 },
    { path: '/privacy', priority: 0.3 },
    { path: '/disclaimer', priority: 0.3 },
    { path: '/affiliate-disclosure', priority: 0.3 },
    { path: '/cancellation', priority: 0.3 },
  ]

  // Real trade platform pages (branded slugs: heat, volt, flow, …) from the
  // source of truth — every entry resolves to an existing page.
  const platformEntries: MetadataRoute.Sitemap = Object.values(TRADE_CONFIGS).map(trade => ({
    url: `${SITE_URL}/platform/${trade.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map(({ path, priority }) => ({
    url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: 'weekly',
    priority,
  }))

  return [...staticEntries, ...platformEntries]
}
