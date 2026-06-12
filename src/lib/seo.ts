// ─────────────────────────────────────────────────────────────────────────────
// seo — site metadata + discovery helpers (Growth-1: Organic Discovery Foundation)
// ─────────────────────────────────────────────────────────────────────────────
// Reusable, brand-safe metadata constants and helpers for titles, descriptions,
// canonical URLs, Open Graph / Twitter cards, and Organization structured data.
// Honest, educational framing only — no guaranteed-outcome or full-industry claims.
// ─────────────────────────────────────────────────────────────────────────────

// Canonical site origin. Uses the configured app URL, falling back to the public
// domain. Trailing slash stripped so paths join cleanly.
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://subzerometrix.com').replace(/\/+$/, '')

export const SITE_NAME = 'SubZeroMetrix™'
export const SCORE_BRAND = 'MetrixScore™'
export const ORG_LEGAL_NAME = 'The Modern Trades Mentor LLC'

export const DEFAULT_TITLE = 'SubZeroMetrix™ — Business Readiness for Contractors & Trades'
export const TITLE_TEMPLATE = '%s | SubZeroMetrix™'

export const DEFAULT_DESCRIPTION =
  'SubZeroMetrix™ helps contractors, tradespeople, and service-business owners assess business readiness, understand next steps, and build a practical action roadmap. Educational only. Not legal, tax, financial, licensing, or compliance advice.'

/** Absolute canonical URL for a path (e.g. "/resources"). Root returns the origin. */
export function canonicalUrl(path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  return clean === '/' ? SITE_URL : `${SITE_URL}${clean}`
}

/** Open Graph defaults, overridable per page. */
export function buildOpenGraph(opts: { title?: string; description?: string; path?: string } = {}) {
  return {
    type: 'website' as const,
    siteName: SITE_NAME,
    title: opts.title ?? DEFAULT_TITLE,
    description: opts.description ?? DEFAULT_DESCRIPTION,
    url: canonicalUrl(opts.path ?? '/'),
  }
}

/** Twitter/social card defaults, overridable per page. */
export function buildTwitter(opts: { title?: string; description?: string } = {}) {
  return {
    card: 'summary_large_image' as const,
    title: opts.title ?? DEFAULT_TITLE,
    description: opts.description ?? DEFAULT_DESCRIPTION,
  }
}

/** Organization structured data (schema.org). Honest, claim-free. */
export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    legalName: ORG_LEGAL_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
  }
}

/** WebSite structured data. */
export function websiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: { '@type': 'Organization', name: SITE_NAME, legalName: ORG_LEGAL_NAME },
  }
}

/**
 * SoftwareApplication structured data. Intentionally carries NO aggregateRating,
 * review, or offers markup — no fake ratings, reviews, or pricing claims.
 */
export function softwareApplicationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: { '@type': 'Organization', name: SITE_NAME, legalName: ORG_LEGAL_NAME },
  }
}

export interface FaqEntry {
  question: string
  answer: string
}

/** FAQPage structured data from accurate Q&A only. */
export function faqPageJsonLd(entries: FaqEntry[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map(e => ({
      '@type': 'Question',
      name: e.question,
      acceptedAnswer: { '@type': 'Answer', text: e.answer },
    })),
  }
}

export interface BreadcrumbItem {
  name: string
  path: string
}

/** BreadcrumbList structured data. */
export function breadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  }
}
