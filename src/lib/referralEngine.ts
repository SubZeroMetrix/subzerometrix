// ─────────────────────────────────────────────────────────────────────────────
// referralEngine — referral link + prompt model (Growth-3)
// ─────────────────────────────────────────────────────────────────────────────
// MANUAL SHARE ONLY. Builds referral URLs and prompt/disclosure copy. NOTHING here
// auto-sends email/SMS, posts to social, or invites anyone automatically. No third-
// party analytics. No claim that a user endorsed SubZeroMetrix™ — sharing is an
// explicit, optional user action.
// ─────────────────────────────────────────────────────────────────────────────

import { SITE_URL } from './seo'

export type ReferralSource =
  | 'results'
  | 'report'
  | 'dashboard'
  | 'general_business_starter'
  | 'business_readiness'
  | 'spanish_discovery'
  | 'resources'
  | 'referral_invite'
  | 'partners'

export type ReferralChannel =
  | 'copy_link'
  | 'email'
  | 'sms_manual'
  | 'social_manual'
  | 'community_manual'

export interface ReferralContext {
  source: ReferralSource
  channel?: ReferralChannel
  campaign?: string
  referrerId?: string   // optional anonymous tag (future; no auth today)
}

export interface ReferralLink {
  url: string
  source: ReferralSource
  channel: ReferralChannel
  params: Record<string, string>
}

/** UTM-style tracking params for a manual referral link (no auto-send). */
export function getReferralTrackingParams(ctx: ReferralContext): Record<string, string> {
  const params: Record<string, string> = {
    utm_source: 'subzerometrix',
    utm_medium: ctx.channel ?? 'copy_link',
    utm_campaign: ctx.campaign ?? 'referral',
    ref: ctx.source,
  }
  if (ctx.referrerId) params.rid = ctx.referrerId
  return params
}

/** Build an absolute referral URL for a public path. */
export function buildReferralUrl(targetPath: string, ctx: ReferralContext): string {
  const path = targetPath.startsWith('/') ? targetPath : `/${targetPath}`
  const base = path === '/' ? SITE_URL : `${SITE_URL}${path}`
  const qs = new URLSearchParams(getReferralTrackingParams(ctx)).toString()
  return qs ? `${base}?${qs}` : base
}

/** Full referral link object. */
export function buildReferralLink(targetPath: string, ctx: ReferralContext): ReferralLink {
  const channel = ctx.channel ?? 'copy_link'
  return {
    url: buildReferralUrl(targetPath, { ...ctx, channel }),
    source: ctx.source,
    channel,
    params: getReferralTrackingParams({ ...ctx, channel }),
  }
}

const PROMPTS_EN: Partial<Record<ReferralSource, string>> = {
  results: 'Know another contractor who could use this? Share a free starter score.',
  general_business_starter: 'Know someone starting a business? Share this free starter guide.',
  business_readiness: 'Share this plain-language guide to business readiness.',
  resources: 'Share these free, official resources.',
  referral_invite: 'Invite another contractor to check their business readiness.',
}

const PROMPTS_ES: Partial<Record<ReferralSource, string>> = {
  spanish_discovery: '¿Conoces a otro contratista que le sirva esto? Comparte una evaluación gratuita.',
  general_business_starter: '¿Conoces a alguien que va a empezar un negocio? Comparte esta guía gratuita.',
}

/** A short, honest prompt encouraging an optional manual share. */
export function getReferralPrompt(source: ReferralSource, lang: 'en' | 'es' = 'en'): string {
  if (lang === 'es') {
    return PROMPTS_ES[source] ?? '¿Le sirve a alguien que conoces? Compártelo.'
  }
  return PROMPTS_EN[source] ?? 'Know someone this could help? Share it.'
}

/** Honest disclosure: manual only, nothing auto-sent. */
export function getReferralDisclosureText(lang: 'en' | 'es' = 'en'): string {
  if (lang === 'es') {
    return 'Compartir es manual y opcional. SubZeroMetrix™ no envía mensajes ni publica por ti.'
  }
  return 'Sharing is manual and optional. SubZeroMetrix™ never auto-sends messages or posts on your behalf.'
}
