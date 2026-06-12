// ─────────────────────────────────────────────────────────────────────────────
// growthAnalytics — acquisition + activation analytics (Growth-6)
// ─────────────────────────────────────────────────────────────────────────────
// Lightweight, PRIVACY-RESPECTING analytics. Events are stored on THIS DEVICE only
// (no account/cloud sync) and routed through the existing no-op trackEvent stub.
//
// NEVER: third-party trackers, ad pixels, retargeting, cookies, external network
// calls, cross-account user tracking, or PII (no email/name/phone/company/free text).
// Acquisition channel is inferred from referral params + referrer HOST only.
// ─────────────────────────────────────────────────────────────────────────────

import { trackEvent } from './analytics'

export type AcquisitionChannel =
  | 'organic_search'
  | 'ai_search'
  | 'direct'
  | 'referral'
  | 'partner'
  | 'vendor'
  | 'association'
  | 'community'
  | 'spanish_discovery'
  | 'general_business_starter'
  | 'resource_page'
  | 'unknown'

export type ActivationMilestone =
  | 'public_page_viewed'
  | 'starter_assessment_started'
  | 'starter_assessment_completed'
  | 'results_viewed'
  | 'report_viewed'
  | 'dashboard_viewed'
  | 'roadmap_action_viewed'
  | 'kpi_saved'
  | 'feedback_submitted'
  | 'share_link_copied'
  | 'referral_created'
  | 'partner_interest_saved'
  | 'reassessment_completed'

export type GrowthEventName =
  | 'growth_event_tracked'
  | 'acquisition_source_detected'
  | 'activation_milestone_reached'

// Metadata is non-PII only.
export interface GrowthEventContext {
  path?: string
  source?: AcquisitionChannel
  channel?: AcquisitionChannel
  language?: string
  locale?: string
  milestone?: ActivationMilestone
  metadata?: Record<string, string | number | boolean>
}

export interface GrowthSourceContext {
  source: AcquisitionChannel
  channel: AcquisitionChannel
  language: string
  locale: string
  referrerHost: string | null   // host only (not a full URL); not stored in records
}

export interface GrowthActivationRecord {
  id: string
  eventName: GrowthEventName
  createdAt: string
  path: string | null
  source: AcquisitionChannel | null
  channel: AcquisitionChannel | null
  language: string | null
  locale: string | null
  milestone: ActivationMilestone | null
  metadata: Record<string, string | number | boolean>
  storageMode: 'local_device'
}

const STORAGE_KEY = 'szm_growth_events'
const MAX_EVENTS = 300

const CHANNEL_LABELS: Record<AcquisitionChannel, string> = {
  organic_search: 'Organic search',
  ai_search: 'AI search',
  direct: 'Direct',
  referral: 'Referral',
  partner: 'Partner',
  vendor: 'Vendor',
  association: 'Association',
  community: 'Community',
  spanish_discovery: 'Spanish discovery',
  general_business_starter: 'General business starter',
  resource_page: 'Resource page',
  unknown: 'Unknown',
}

const MILESTONE_LABELS: Record<ActivationMilestone, string> = {
  public_page_viewed: 'Public page viewed',
  starter_assessment_started: 'Assessment started',
  starter_assessment_completed: 'Assessment completed',
  results_viewed: 'Results viewed',
  report_viewed: 'Report viewed',
  dashboard_viewed: 'Dashboard viewed',
  roadmap_action_viewed: 'Roadmap action viewed',
  kpi_saved: 'KPI saved',
  feedback_submitted: 'Feedback submitted',
  share_link_copied: 'Share link copied',
  referral_created: 'Referral created',
  partner_interest_saved: 'Partner interest saved',
  reassessment_completed: 'Reassessment completed',
}

export function getAcquisitionChannelLabel(channel: AcquisitionChannel): string {
  return CHANNEL_LABELS[channel] ?? 'Unknown'
}

export function getActivationMilestoneLabel(milestone: ActivationMilestone): string {
  return MILESTONE_LABELS[milestone] ?? milestone
}

// Map a referral `ref` param to an acquisition channel.
const REF_TO_CHANNEL: Record<string, AcquisitionChannel> = {
  partners: 'partner',
  spanish_discovery: 'spanish_discovery',
  general_business_starter: 'general_business_starter',
  resources: 'resource_page',
  results: 'referral',
  report: 'referral',
  dashboard: 'referral',
  business_readiness: 'referral',
  referral_invite: 'referral',
}

/** Infer the acquisition source for the current page. Client-only; no PII. */
export function getGrowthSourceContext(): GrowthSourceContext {
  const fallback: GrowthSourceContext = {
    source: 'unknown', channel: 'unknown', language: 'en', locale: 'en-US', referrerHost: null,
  }
  if (typeof window === 'undefined') return { ...fallback, source: 'direct', channel: 'direct' }

  let referrerHost: string | null = null
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname : null
  } catch {
    referrerHost = null
  }

  const params = new URLSearchParams(window.location.search)
  const ref = params.get('ref') ?? ''
  if (REF_TO_CHANNEL[ref]) {
    const channel = REF_TO_CHANNEL[ref]
    return { source: channel, channel, language: 'en', locale: 'en-US', referrerHost }
  }

  if (referrerHost) {
    if (/google\.|bing\.|duckduckgo\.|yahoo\.|ecosia\./i.test(referrerHost)) {
      return { source: 'organic_search', channel: 'organic_search', language: 'en', locale: 'en-US', referrerHost }
    }
    if (/openai\.|chatgpt\.|perplexity\.|gemini\.|claude\./i.test(referrerHost)) {
      return { source: 'ai_search', channel: 'ai_search', language: 'en', locale: 'en-US', referrerHost }
    }
    return { source: 'referral', channel: 'referral', language: 'en', locale: 'en-US', referrerHost }
  }

  return { ...fallback, source: 'direct', channel: 'direct' }
}

function genId(): string {
  return `ge_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function createGrowthEvent(eventName: GrowthEventName, ctx: GrowthEventContext = {}): GrowthActivationRecord {
  return {
    id: genId(),
    eventName,
    createdAt: new Date().toISOString(),
    path: ctx.path ?? null,
    source: ctx.source ?? null,
    channel: ctx.channel ?? null,
    language: ctx.language ?? null,
    locale: ctx.locale ?? null,
    milestone: ctx.milestone ?? null,
    metadata: ctx.metadata ?? {},
    storageMode: 'local_device',
  }
}

/** All locally-stored growth events (device-only). */
export function getGrowthEventsLocal(): GrowthActivationRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as GrowthActivationRecord[]) : []
  } catch {
    return []
  }
}

/** Append a growth event to local storage (capped). Never sends anything. */
export function saveGrowthEventLocal(record: GrowthActivationRecord): void {
  if (typeof window === 'undefined') return
  try {
    const existing = getGrowthEventsLocal()
    const next = [...existing, record].slice(-MAX_EVENTS)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // storage unavailable — non-fatal
  }
}

/**
 * Record a growth event: saves it locally and routes it through the existing no-op
 * trackEvent stub. No PII, no network calls, no third-party trackers.
 */
export function trackGrowthEvent(eventName: GrowthEventName, ctx: GrowthEventContext = {}): GrowthActivationRecord {
  const record = createGrowthEvent(eventName, ctx)
  saveGrowthEventLocal(record)
  trackEvent(eventName, {
    path: record.path ?? undefined,
    source: record.source ?? undefined,
    channel: record.channel ?? undefined,
    language: record.language ?? undefined,
    milestone: record.milestone ?? undefined,
  })
  return record
}

export function getGrowthAnalyticsDisclosureText(): string {
  return 'We use lightweight, privacy-respecting analytics saved on your device to improve the product. No personal information, cookies, ad pixels, or third-party trackers are used.'
}
