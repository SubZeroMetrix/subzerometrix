// ─────────────────────────────────────────────────────────────────────────────
// shareEngine — shareable resources + share copy (Growth-3)
// ─────────────────────────────────────────────────────────────────────────────
// MANUAL SHARE ONLY. Maps share contexts to PUBLIC resources and provides honest,
// descriptive share copy (English for public pages, Spanish for Spanish discovery
// pages). Share text is descriptive of the resource — it never puts a fake personal
// endorsement in the user's mouth. Builds share URLs via referralEngine. No auto-
// posting, no social API integration, no full-Spanish-platform claims.
// ─────────────────────────────────────────────────────────────────────────────

import { buildReferralUrl, type ReferralChannel, type ReferralSource } from './referralEngine'

export type ShareContext =
  | 'results'
  | 'business_readiness'
  | 'general_business_starter'
  | 'resources'
  | 'spanish_discovery'
  | 'spanish_business_starter'

export type ShareLang = 'en' | 'es'

export interface ShareableResource {
  id: ShareContext
  path: string
  source: ReferralSource
  lang: ShareLang | 'both'
  title: string
}

export interface ShareCopyVariant {
  lang: ShareLang
  shareText: string
  ctaLabel: string
}

const RESOURCES: Record<ShareContext, ShareableResource> = {
  // "Starter MetrixScore™ insight" → share the public assessment entry, not the
  // private/stateful /results page.
  results: { id: 'results', path: '/start', source: 'results', lang: 'en', title: 'Starter MetrixScore™ insight' },
  business_readiness: { id: 'business_readiness', path: '/business-readiness', source: 'business_readiness', lang: 'en', title: 'Business readiness guide' },
  general_business_starter: { id: 'general_business_starter', path: '/general-business-starter', source: 'general_business_starter', lang: 'en', title: 'General business starter guide' },
  resources: { id: 'resources', path: '/resources', source: 'resources', lang: 'en', title: 'Contractor resources' },
  spanish_discovery: { id: 'spanish_discovery', path: '/es', source: 'spanish_discovery', lang: 'es', title: 'SubZeroMetrix™ en Español' },
  spanish_business_starter: { id: 'spanish_business_starter', path: '/es/como-empezar-un-negocio', source: 'spanish_discovery', lang: 'es', title: 'Cómo empezar un negocio' },
}

const COPY: Record<ShareContext, { en?: ShareCopyVariant; es?: ShareCopyVariant }> = {
  results: {
    en: { lang: 'en', shareText: 'A free business-readiness starter score for contractors, tradespeople, and service businesses:', ctaLabel: 'Share your starter insight' },
  },
  business_readiness: {
    en: { lang: 'en', shareText: 'A clear, free guide to business readiness for contractors and trades:', ctaLabel: 'Share this guide' },
  },
  general_business_starter: {
    en: { lang: 'en', shareText: 'A free starter framework for anyone starting a business:', ctaLabel: 'Share this guide' },
  },
  resources: {
    en: { lang: 'en', shareText: 'Free, official resources for starting and running a trade business:', ctaLabel: 'Share these resources' },
  },
  spanish_discovery: {
    es: { lang: 'es', shareText: 'SubZeroMetrix™ en español: una evaluación gratuita de preparación empresarial para contratistas y negocios de servicios:', ctaLabel: 'Compartir' },
  },
  spanish_business_starter: {
    es: { lang: 'es', shareText: 'Una guía educativa y gratuita para empezar un negocio:', ctaLabel: 'Compartir' },
  },
}

export function getShareableResources(): ShareableResource[] {
  return Object.values(RESOURCES)
}

export function getShareableResource(context: ShareContext): ShareableResource | undefined {
  return RESOURCES[context]
}

export function getShareCopy(context: ShareContext, lang: ShareLang = 'en'): ShareCopyVariant {
  const entry = COPY[context]
  return entry[lang] ?? entry.en ?? entry.es ?? { lang, shareText: '', ctaLabel: 'Share' }
}

export function getShareCtaLabel(context: ShareContext, lang: ShareLang = 'en'): string {
  return getShareCopy(context, lang).ctaLabel
}

/** Absolute share URL (manual share) for a context, with referral params. */
export function buildShareUrl(context: ShareContext, channel: ReferralChannel = 'copy_link'): string {
  const resource = RESOURCES[context]
  return buildReferralUrl(resource.path, { source: resource.source, channel })
}
