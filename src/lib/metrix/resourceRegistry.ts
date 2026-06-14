// ─────────────────────────────────────────────────────────────────────────────
// metrix/resourceRegistry — Wave 5: consolidated canonical resource/vendor registry
// ─────────────────────────────────────────────────────────────────────────────
// Builds ONE deterministic CanonicalResource[] by consolidating the existing vendor
// catalog, affiliate partner registry, and educational public resources. It does not
// fabricate vendors, relationships, or dates. Original ids are preserved verbatim; a
// tool that exists both as a catalog vendor AND an affiliate partner is merged into a
// single record (vendor entry enriched with the factual affiliate status) so it is never
// presented twice. Commercial status is recorded separately from relevance.
// ─────────────────────────────────────────────────────────────────────────────

import { VENDOR_CATEGORIES, type VendorEntry, type ContractorStageTarget } from '../vendorCategories'
import { AFFILIATE_PARTNERS, affiliateUrl, type AffiliatePartner } from '../affiliates'
import { getPublicResources, type PublicResource } from '../publicResources'
import { DISCLOSURE_TEXT } from '../tracking'
import type { LifecycleStage } from './lifecycle'
import type { CanonicalActionCategory } from './actionTypes'
import {
  RESOURCE_REVIEWED_DATE,
  type CanonicalResource, type CanonicalResourceCategory, type ResourcePlacement,
} from './resourceTypes'

// ── Category mapping (vendor catalog ids → canonical) ──────────────────────────
const VENDOR_CATEGORY_MAP: Record<string, CanonicalResourceCategory> = {
  fsm: 'field_service_software',
  crm: 'crm',
  estimating: 'estimating',
  payments: 'payments_financing',
  financing: 'payments_financing',
  banking: 'banking',
  accounting: 'accounting_bookkeeping',
  payroll: 'payroll',
  insurance: 'insurance',
  'credit-cards': 'payments_financing',
  lending: 'payments_financing',
  reviews: 'reviews',
  phones: 'customer_communication',
  'websites-seo': 'marketing_growth',
  'social-design': 'marketing_growth',
  'email-sms': 'marketing_growth',
  automation: 'operations',
  documentation: 'operations',
  training: 'education_exam_prep',
  'fleet-gps': 'operations',
  'formation-legal': 'legal_formation',
  'hiring-recruiting': 'operations',
  'local-ads': 'marketing_growth',
}

// ── Category mapping (affiliate categories → canonical) ────────────────────────
const AFFILIATE_CATEGORY_MAP: Record<string, CanonicalResourceCategory> = {
  'field-software': 'field_service_software',
  bookkeeping: 'accounting_bookkeeping',
  banking: 'banking',
  insurance: 'insurance',
  formation: 'legal_formation',
  marketing: 'marketing_growth',
  'funding-credit': 'payments_financing',
  payroll: 'payroll',
  estimating: 'estimating',
  'review-management': 'reviews',
  'email-sms': 'marketing_growth',
  'estimating-software': 'estimating',
}

// ── Canonical category → supported priority/action categories ──────────────────
const CATEGORY_PRIORITY_MAP: Record<CanonicalResourceCategory, CanonicalActionCategory[]> = {
  field_service_software: ['operations', 'tools_software'],
  crm: ['customer_acquisition', 'operations'],
  estimating: ['pricing', 'operations'],
  scheduling: ['operations'],
  payments_financing: ['banking_accounting', 'operations'],
  banking: ['banking_accounting'],
  accounting_bookkeeping: ['banking_accounting'],
  payroll: ['operations', 'banking_accounting'],
  insurance: ['insurance'],
  bonding: ['insurance', 'licensing_registration'],
  legal_formation: ['business_formation'],
  licensing_authority: ['licensing_registration'],
  permit_office: ['licensing_registration'],
  customer_communication: ['customer_acquisition', 'operations'],
  marketing_growth: ['customer_acquisition', 'growth'],
  reviews: ['customer_acquisition', 'growth'],
  operations: ['operations'],
  safety_compliance: ['safety_compliance', 'operations'],
  trade_association: ['general'],
  education_exam_prep: ['licensing_registration', 'general'],
  guide: [],
  other: [],
}

const LICENSING_RELEVANT: ReadonlySet<CanonicalResourceCategory> = new Set<CanonicalResourceCategory>([
  'insurance', 'bonding', 'legal_formation', 'licensing_authority', 'permit_office', 'education_exam_prep',
])

// Stage targets → canonical lifecycle stages.
const STAGE_TARGET_MAP: Record<ContractorStageTarget, LifecycleStage[]> = {
  startup: ['Explore', 'Side Hustle', 'Prepare', 'Launch'],
  early: ['Launch', 'Stabilize'],
  growth: ['Grow'],
  scale: ['Scale'],
  any: [],
}

function lifecycleFromStageTargets(targets: readonly ContractorStageTarget[] | undefined): LifecycleStage[] {
  if (!targets || targets.length === 0 || targets.includes('any')) return []
  const out = new Set<LifecycleStage>()
  for (const t of targets) for (const s of STAGE_TARGET_MAP[t] ?? []) out.add(s)
  return Array.from(out)
}

// Deterministic, neutral disclosure text for a canonical category.
function disclosureFor(category: CanonicalResourceCategory): string {
  switch (category) {
    case 'insurance':
    case 'bonding':
      return DISCLOSURE_TEXT['insurance-routing']
    case 'banking':
    case 'payments_financing':
      return DISCLOSURE_TEXT['banking-routing']
    case 'legal_formation':
      return DISCLOSURE_TEXT['formation-not-legal']
    default:
      return DISCLOSURE_TEXT['affiliate-universal']
  }
}

const safeArr = (v: unknown): string[] => (Array.isArray(v) ? v.filter(x => typeof x === 'string') : [])

// ── Vendor catalog → CanonicalResource ─────────────────────────────────────────
function fromVendor(v: VendorEntry): CanonicalResource {
  const category = VENDOR_CATEGORY_MAP[v.categoryId] ?? 'other'
  return {
    resourceId: `vendor:${v.id}`,
    sourceId: v.id,
    vendorId: v.id,
    kind: 'vendor',
    category,
    title: v.name,
    description: v.desc ?? v.tagline ?? '',
    destinationPath: null,
    officialUrl: v.websiteUrl ?? null,
    tradeApplicability: safeArr(v.tradeRelevance),
    stateApplicability: [],
    lifecycleApplicability: lifecycleFromStageTargets(v.bestFor),
    priorityApplicability: CATEGORY_PRIORITY_MAP[category] ?? [],
    licensingRelevant: LICENSING_RELEVANT.has(category),
    relationshipStatus: v.affiliateStatus === 'active' ? 'affiliate' : 'editorial',
    affiliateStatus: v.affiliateStatus ?? 'none',
    sponsorshipStatus: 'none',
    reviewedDate: RESOURCE_REVIEWED_DATE,
    provenance: { source: 'vendor', sourceId: v.id, reviewedDate: RESOURCE_REVIEWED_DATE },
    placementContexts: ['resources_page', 'dashboard', 'roadmap', 'foundation_builder'],
    analyticsId: `vendor_${v.id}`,
    active: true,
    stale: false,
    broken: false,
    disclosureText: disclosureFor(category),
  }
}

// ── Affiliate partner → CanonicalResource ──────────────────────────────────────
function fromAffiliate(p: AffiliatePartner): CanonicalResource {
  const category = AFFILIATE_CATEGORY_MAP[p.category] ?? 'other'
  const hasCode = !!p.trackingValue && p.trackingValue !== 'PENDING'
  return {
    resourceId: `affiliate:${p.id}`,
    sourceId: p.id,
    vendorId: p.id,
    kind: 'affiliate',
    category,
    title: p.name,
    description: p.desc ?? '',
    destinationPath: null,
    officialUrl: affiliateUrl(p),
    tradeApplicability: safeArr(p.tradeRelevance),
    stateApplicability: [],
    lifecycleApplicability: [],
    priorityApplicability: CATEGORY_PRIORITY_MAP[category] ?? [],
    licensingRelevant: LICENSING_RELEVANT.has(category) || !!p.regulatedActivity,
    relationshipStatus: hasCode ? 'affiliate' : 'editorial',
    affiliateStatus: hasCode ? 'active' : 'none',
    sponsorshipStatus: 'none',
    reviewedDate: RESOURCE_REVIEWED_DATE,
    provenance: { source: 'affiliate', sourceId: p.id, reviewedDate: RESOURCE_REVIEWED_DATE },
    placementContexts: ['resources_page', 'dashboard', 'roadmap'],
    analyticsId: `affiliate_${p.id}`,
    active: true,
    stale: false,
    broken: false,
    disclosureText: disclosureFor(category),
  }
}

// ── Public educational resource → CanonicalResource ────────────────────────────
function fromGuide(r: PublicResource): CanonicalResource {
  const trade = r.tradeApplicability === 'all_trades' || !Array.isArray(r.tradeApplicability)
    ? [] : r.tradeApplicability
  const state = r.stateApplicability === 'all_states' || !Array.isArray(r.stateApplicability)
    ? [] : r.stateApplicability
  return {
    resourceId: `guide:${r.slug}`,
    sourceId: r.slug,
    vendorId: null,
    kind: 'guide',
    category: 'guide',
    title: r.title,
    description: r.description ?? '',
    destinationPath: `/resources/${r.slug}`,
    officialUrl: null,
    tradeApplicability: trade,
    stateApplicability: state,
    lifecycleApplicability: [],
    priorityApplicability: [],
    licensingRelevant: false,
    relationshipStatus: 'editorial',
    affiliateStatus: 'none',
    sponsorshipStatus: 'none',
    reviewedDate: r.updatedAt ?? RESOURCE_REVIEWED_DATE,
    provenance: { source: 'guide', sourceId: r.slug, reviewedDate: r.updatedAt ?? RESOURCE_REVIEWED_DATE },
    placementContexts: ['resources_page', 'dashboard', 'results', 'foundation_builder', 'growth_engine'],
    analyticsId: `guide_${r.slug}`,
    active: r.published !== false,
    stale: false,
    broken: false,
    disclosureText: r.disclaimer ?? DISCLOSURE_TEXT['affiliate-universal'],
  }
}

// ── Build the consolidated registry (deterministic, deduped) ───────────────────
function buildRegistry(): CanonicalResource[] {
  const byVendorId = new Map<string, CanonicalResource>()
  const out: CanonicalResource[] = []

  // 1. Vendor catalog (preserves catalog order).
  for (const cat of VENDOR_CATEGORIES) {
    for (const v of cat.vendors ?? []) {
      if (!v?.id || byVendorId.has(v.id)) continue
      const res = fromVendor(v)
      byVendorId.set(v.id, res)
      out.push(res)
    }
  }

  // 2. Affiliate partners — merge into an existing vendor record where the id matches
  //    (records the factual affiliate status without presenting the tool twice).
  for (const p of AFFILIATE_PARTNERS) {
    if (!p?.id) continue
    const existing = byVendorId.get(p.id)
    if (existing) {
      const hasCode = !!p.trackingValue && p.trackingValue !== 'PENDING'
      if (hasCode) {
        existing.affiliateStatus = 'active'
        existing.relationshipStatus = 'affiliate'
        existing.officialUrl = affiliateUrl(p)
      }
      existing.licensingRelevant = existing.licensingRelevant || !!p.regulatedActivity
      continue
    }
    const res = fromAffiliate(p)
    byVendorId.set(p.id, res)
    out.push(res)
  }

  // 3. Educational guides (slugs never collide with vendor ids).
  for (const r of getPublicResources()) {
    if (!r?.slug) continue
    out.push(fromGuide(r))
  }

  return out
}

export const RESOURCE_REGISTRY: CanonicalResource[] = buildRegistry()

// ── Lookups (defensive) ────────────────────────────────────────────────────────
export function getResourceById(resourceId: string): CanonicalResource | undefined {
  return RESOURCE_REGISTRY.find(r => r.resourceId === resourceId)
}

export function getResourceBySourceId(sourceId: string): CanonicalResource | undefined {
  return RESOURCE_REGISTRY.find(r => r.sourceId === sourceId)
}

export function getResourcesByCategory(category: string): CanonicalResource[] {
  return RESOURCE_REGISTRY.filter(r => r.category === category)
}

export function getResourcesForPlacement(placement: ResourcePlacement): CanonicalResource[] {
  return RESOURCE_REGISTRY.filter(r => r.active && r.placementContexts.includes(placement))
}

export function allResources(): CanonicalResource[] {
  return RESOURCE_REGISTRY
}
