import type { Metadata } from 'next'

const SITE_NAME = 'SubZero Metrix'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://subzerometrix.com'

export function buildMetadata(opts: {
  title: string
  description: string
  path?: string
  noIndex?: boolean
}): Metadata {
  const url = opts.path ? `${SITE_URL}${opts.path}` : SITE_URL

  return {
    title: `${opts.title} | ${SITE_NAME}`,
    description: opts.description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: `${opts.title} | ${SITE_NAME}`,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: `${SITE_URL}/brand/metrix-command-center-logo.png`, width: 600, height: 400, alt: 'Metrix Command Center' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${opts.title} | ${SITE_NAME}`,
      description: opts.description,
    },
    robots: opts.noIndex ? { index: false, follow: false } : undefined,
  }
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SubZero Metrix LLC',
    url: SITE_URL,
    logo: `${SITE_URL}/brand/metrix-command-center-logo.png`,
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}
