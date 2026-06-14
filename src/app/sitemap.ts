import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { TRADE_CONFIGS } from '@/lib/tradeData'
import { getPublicResourceSlugs } from '@/lib/publicResources'
import { CANONICAL_STATE_IDS } from '@/lib/metrix'

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
    { path: '/learn', priority: 0.8 },
    { path: '/trades', priority: 0.7 },
    { path: '/foundation-builder', priority: 0.7 },
    { path: '/growth', priority: 0.6 },
    { path: '/partners', priority: 0.6 },
    { path: '/platform-ecosystem', priority: 0.7 },
    { path: '/terms', priority: 0.3 },
    { path: '/privacy', priority: 0.3 },
    { path: '/disclaimer', priority: 0.3 },
    { path: '/affiliate-disclosure', priority: 0.3 },
    { path: '/resource-directory-disclosure', priority: 0.3 },
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

  // Curated public Learn pages (Growth-7) — each resolves to a real, hand-written page.
  const learnEntries: MetadataRoute.Sitemap = getPublicResourceSlugs().map(slug => ({
    url: `${SITE_URL}/learn/${slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Wave 7 CP8 — per-state licensing/setup pages (FL/CO/TX/AZ/OH/NC), each a real page.
  const stateEntries: MetadataRoute.Sitemap = CANONICAL_STATE_IDS.map(id => ({
    url: `${SITE_URL}/state/${id.toLowerCase()}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticEntries, ...platformEntries, ...learnEntries, ...stateEntries]
}
