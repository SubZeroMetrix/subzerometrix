// ─────────────────────────────────────────────────────────────────────────────
// foundationBuilder — Product-5A: Guided Business Foundation Builder DATA MODEL
// ─────────────────────────────────────────────────────────────────────────────
// The local-first, cloud-ready data model for the Guided Business Foundation Builder.
// DATA MODEL ONLY — no UI, no routes. It defines the catalog (sections → categories →
// step definitions), the per-user checklist item shape, the workflow stages, status,
// priority, completion model, stable ids/keys for Account-2I sync, and pure helpers
// (defaults, progress summary, next recommended item, safe local-storage contract).
//
// This is the canonical home for the Foundation Builder types + storage keys; the
// Account-2I sync helper (foundationBuilderSync.ts) imports them from here.
//
// GUARDRAILS
//   • Educational only — NO legal, tax, financial, or licensing advice. Steps prompt
//     the user to act and route to official sources; `officialSourceReminder` flags it.
//   • NEVER stores secrets, credentials, passwords, API keys, or sensitive identifiers.
//     `note` is the user's own free text (low-risk); the sync layer screens it.
//   • SSR-safe: storage helpers no-op when window/localStorage is unavailable.
// ─────────────────────────────────────────────────────────────────────────────

import { safeJsonParse } from './metrixStorage'

// Future local-storage keys (Account-2I sync readiness reads these).
export const FOUNDATION_BUILDER_KEYS = {
  foundation: 'szm_foundation_builder',
  vendorTracker: 'szm_vendor_tracker',
  launchReadiness: 'szm_launch_readiness',
} as const

// ── Enums ──────────────────────────────────────────────────────────────────────
export type FoundationStage =
  | 'start_here'
  | 'do_this_next'
  | 'later'
  | 'done'
  | 'blocked'

export type FoundationItemStatus =
  | 'not_started'
  | 'in_progress'
  | 'done'
  | 'blocked'

export type FoundationPriority = 'critical' | 'high' | 'medium' | 'low'

// Trade slugs mirror TRADE_OPTIONS in intake.ts. A step with no `trade` is core (applies
// to every business); a step with a `trade` only appears for that trade.
export type FoundationTrade =
  | 'hvac'
  | 'electrical'
  | 'plumbing'
  | 'roofing'
  | 'solar'
  | 'construction'
  | 'handyman'
  | 'landscaping'
  | 'cleaning'
  | 'painting'

const FOUNDATION_TRADES: FoundationTrade[] = [
  'hvac', 'electrical', 'plumbing', 'roofing', 'solar',
  'construction', 'handyman', 'landscaping', 'cleaning', 'painting',
]

/** Map an intake trade string to a FoundationTrade, or null for general/'other'/unknown. */
export function normalizeFoundationTrade(value: string | null | undefined): FoundationTrade | null {
  if (!value) return null
  return (FOUNDATION_TRADES as string[]).includes(value) ? (value as FoundationTrade) : null
}

export type FoundationSectionId =
  | 'identity_digital'
  | 'legal_financial'
  | 'brand_presence'
  | 'operations_sales'
  | 'launch_review'

export type FoundationCategoryId =
  | 'business_identity'
  | 'domain_website'
  | 'business_email'
  | 'legal_entity'
  | 'tax_ein'
  | 'banking_bookkeeping'
  | 'licensing_insurance'
  | 'brand_profiles'
  | 'google_business_profile'
  | 'operations'
  | 'pricing_sales'
  | 'tech_stack'
  | 'launch_readiness'
  | 'weekly_review'

// ── Catalog shapes ──────────────────────────────────────────────────────────────
export interface FoundationSection {
  id: FoundationSectionId
  label: string
}

export interface FoundationCategory {
  id: FoundationCategoryId
  sectionId: FoundationSectionId
  label: string
}

export interface FoundationStepDefinition {
  id: string                       // stable id → used as the checklist item id (sync local_id)
  category: FoundationCategoryId
  stepName: string
  description: string
  whyItMatters: string
  priority: FoundationPriority
  estimatedTime: string
  defaultStage: FoundationStage
  /** True when the step touches legal/tax/licensing — route to official sources, not advice. */
  officialSourceReminder?: boolean
  /** Set for trade-specific steps; undefined = core step (applies to every business). */
  trade?: FoundationTrade
}

// ── Per-user checklist item (canonical; Account-2I syncs this shape) ────────────
export interface FoundationChecklistItem {
  id: string                       // stable (= step definition id) for idempotent sync
  createdAt: string
  updatedAt?: string
  category: FoundationCategoryId
  sectionId: FoundationSectionId
  stepDefId: string
  stepName: string
  stage: FoundationStage           // workflow lane
  status: FoundationItemStatus     // execution state
  priority: FoundationPriority
  completed: boolean               // single source of truth for completion
  completedAt?: string | null      // ISO time the item was marked done (null otherwise)
  blockedReason?: string | null    // user's own note on why it is blocked (free text)
  trade?: FoundationTrade          // set for trade-specific items; undefined = core
  note: string | null              // user's own free text (low-risk; sync screens it)
}

// Vendor/tool + launch readiness item shapes (future dedicated trackers; kept here so
// Account-2I consumes a single canonical model). References only — never credentials.
export interface VendorToolItem {
  id: string
  createdAt: string
  label: string
  category: string | null
  referenceUrl: string | null  // reference only — NEVER credentials/passwords/keys
  note: string | null
}

export interface LaunchReadinessItem {
  id: string
  createdAt: string
  label: string
  status: FoundationItemStatus
  completed: boolean
  note: string | null
}

// ── Sections + categories ───────────────────────────────────────────────────────
export const FOUNDATION_SECTIONS: FoundationSection[] = [
  { id: 'identity_digital', label: 'Identity & Digital' },
  { id: 'legal_financial', label: 'Legal & Financial' },
  { id: 'brand_presence', label: 'Brand & Presence' },
  { id: 'operations_sales', label: 'Operations & Sales' },
  { id: 'launch_review', label: 'Launch & Review' },
]

export const FOUNDATION_CATEGORIES: FoundationCategory[] = [
  { id: 'business_identity', sectionId: 'identity_digital', label: 'Business Identity' },
  { id: 'domain_website', sectionId: 'identity_digital', label: 'Domain + Website' },
  { id: 'business_email', sectionId: 'identity_digital', label: 'Business Email' },
  { id: 'legal_entity', sectionId: 'legal_financial', label: 'Legal / Entity Setup' },
  { id: 'tax_ein', sectionId: 'legal_financial', label: 'Tax / EIN / Registrations' },
  { id: 'banking_bookkeeping', sectionId: 'legal_financial', label: 'Banking + Bookkeeping' },
  { id: 'licensing_insurance', sectionId: 'legal_financial', label: 'Licensing / Insurance' },
  { id: 'brand_profiles', sectionId: 'brand_presence', label: 'Brand Profiles' },
  { id: 'google_business_profile', sectionId: 'brand_presence', label: 'Google Business Profile' },
  { id: 'operations', sectionId: 'operations_sales', label: 'Operations Setup' },
  { id: 'pricing_sales', sectionId: 'operations_sales', label: 'Sales / Pricing Foundation' },
  { id: 'tech_stack', sectionId: 'operations_sales', label: 'Technology Stack' },
  { id: 'launch_readiness', sectionId: 'launch_review', label: 'Launch Readiness' },
  { id: 'weekly_review', sectionId: 'launch_review', label: 'Post-Launch Weekly Review' },
]

const CATEGORY_SECTION: Record<FoundationCategoryId, FoundationSectionId> =
  FOUNDATION_CATEGORIES.reduce((acc, c) => { acc[c.id] = c.sectionId; return acc }, {} as Record<FoundationCategoryId, FoundationSectionId>)

// ── Starter step catalog ────────────────────────────────────────────────────────
export const FOUNDATION_STEP_DEFINITIONS: FoundationStepDefinition[] = [
  // Business Identity
  { id: 'identity-name', category: 'business_identity', stepName: 'Decide your business name', description: 'Choose a clear, available business name and check it is not already in use.', whyItMatters: 'Your name anchors every other setup step — domain, email, branding, and registration.', priority: 'critical', estimatedTime: '30–60 min', defaultStage: 'start_here' },
  { id: 'identity-logo', category: 'business_identity', stepName: 'Create a simple logo + colors', description: 'Pick a basic logo, primary color, and font you can reuse everywhere.', whyItMatters: 'Consistent branding makes a new business look established and trustworthy.', priority: 'medium', estimatedTime: '1–2 hrs', defaultStage: 'later' },

  // Domain + Website
  { id: 'domain-register', category: 'domain_website', stepName: 'Register your domain', description: 'Buy the .com (and close variants) that match your business name.', whyItMatters: 'Owning your domain protects your brand and powers professional email.', priority: 'high', estimatedTime: '20–30 min', defaultStage: 'start_here' },
  { id: 'website-landing', category: 'domain_website', stepName: 'Publish a basic website / landing page', description: 'Put up a simple page with services, service area, and contact info.', whyItMatters: 'Customers check you exist online before they call.', priority: 'high', estimatedTime: '2–4 hrs', defaultStage: 'do_this_next' },

  // Business Email
  { id: 'email-professional', category: 'business_email', stepName: 'Set up professional email', description: 'Create you@yourdomain instead of a free personal address.', whyItMatters: 'A branded inbox builds trust and keeps business communication organized.', priority: 'high', estimatedTime: '30–45 min', defaultStage: 'start_here' },
  { id: 'email-deliverability', category: 'business_email', stepName: 'Confirm email deliverability (SPF/DKIM/DMARC)', description: 'Follow your email provider’s guide to set up sender authentication records.', whyItMatters: 'Proper records keep your emails out of spam and protect your domain.', priority: 'medium', estimatedTime: '30–60 min', defaultStage: 'later' },

  // Legal / Entity Setup
  { id: 'legal-entity', category: 'legal_entity', stepName: 'Choose and form your business entity', description: 'Decide on a structure (e.g., LLC) and register it with your state.', whyItMatters: 'The right structure affects liability and how you operate.', priority: 'critical', estimatedTime: 'Varies', defaultStage: 'start_here', officialSourceReminder: true },
  { id: 'legal-registered-agent', category: 'legal_entity', stepName: 'Set up a registered agent + business address', description: 'Confirm who receives official mail and where your business is registered.', whyItMatters: 'Required for entity compliance and official notices.', priority: 'medium', estimatedTime: '30 min', defaultStage: 'do_this_next', officialSourceReminder: true },

  // Tax / EIN / Registrations
  { id: 'tax-ein', category: 'tax_ein', stepName: 'Get your EIN', description: 'Apply for a federal Employer Identification Number from the official source.', whyItMatters: 'You need an EIN for banking, taxes, and hiring.', priority: 'critical', estimatedTime: '15–30 min', defaultStage: 'start_here', officialSourceReminder: true },
  { id: 'tax-registrations', category: 'tax_ein', stepName: 'Check state/local tax + sales-tax registrations', description: 'Confirm which registrations and permits your state and locality require.', whyItMatters: 'Registering correctly avoids penalties later.', priority: 'high', estimatedTime: 'Varies', defaultStage: 'do_this_next', officialSourceReminder: true },

  // Banking + Bookkeeping
  { id: 'bank-account', category: 'banking_bookkeeping', stepName: 'Open a business bank account', description: 'Separate business and personal money with a dedicated account.', whyItMatters: 'Clean separation simplifies taxes and protects your entity.', priority: 'high', estimatedTime: '1 hr', defaultStage: 'do_this_next' },
  { id: 'bookkeeping-system', category: 'banking_bookkeeping', stepName: 'Set up bookkeeping + receipt capture', description: 'Pick a bookkeeping tool and a habit for capturing receipts.', whyItMatters: 'Knowing your numbers is the difference between guessing and growing.', priority: 'medium', estimatedTime: '1–2 hrs', defaultStage: 'later' },

  // Licensing / Insurance
  { id: 'licensing-trade', category: 'licensing_insurance', stepName: 'Confirm trade licensing requirements', description: 'Check the licenses and permits your trade and state require, via official sources.', whyItMatters: 'Operating unlicensed risks fines and lost work.', priority: 'critical', estimatedTime: 'Varies', defaultStage: 'start_here', officialSourceReminder: true },
  { id: 'insurance-coverage', category: 'licensing_insurance', stepName: 'Get the right insurance coverage', description: 'Confirm liability and any required coverage with a licensed provider.', whyItMatters: 'Insurance protects you, your customers, and your bids.', priority: 'high', estimatedTime: 'Varies', defaultStage: 'do_this_next', officialSourceReminder: true },

  // Brand Profiles
  { id: 'brand-profiles', category: 'brand_profiles', stepName: 'Claim your core brand profiles', description: 'Reserve consistent handles on the platforms your customers use.', whyItMatters: 'Consistent profiles build trust and protect your name.', priority: 'medium', estimatedTime: '1 hr', defaultStage: 'later' },

  // Google Business Profile
  { id: 'gbp-create', category: 'google_business_profile', stepName: 'Create + verify your Google Business Profile', description: 'Set up your profile with services, area, hours, and photos.', whyItMatters: 'It is how local customers find and choose you on Google + Maps.', priority: 'high', estimatedTime: '45–60 min', defaultStage: 'do_this_next' },

  // Operations Setup
  { id: 'ops-estimate-invoice', category: 'operations', stepName: 'Set up estimate + invoice templates', description: 'Create reusable estimate and invoice templates with your branding.', whyItMatters: 'Fast, professional quotes win more jobs and get you paid sooner.', priority: 'high', estimatedTime: '1–2 hrs', defaultStage: 'do_this_next' },
  { id: 'ops-scheduling', category: 'operations', stepName: 'Set up scheduling + customer communication', description: 'Pick how you book jobs and follow up with customers.', whyItMatters: 'Reliable communication is what earns referrals and reviews.', priority: 'medium', estimatedTime: '1 hr', defaultStage: 'later' },

  // Sales / Pricing Foundation
  { id: 'pricing-menu', category: 'pricing_sales', stepName: 'Build your pricing / service menu', description: 'Set clear prices or ranges for your core services.', whyItMatters: 'Confident, consistent pricing protects your margins.', priority: 'high', estimatedTime: '2–3 hrs', defaultStage: 'do_this_next' },
  { id: 'pricing-followup', category: 'pricing_sales', stepName: 'Create a lead follow-up process', description: 'Decide how and when you follow up on every lead and quote.', whyItMatters: 'Most jobs are won in the follow-up, not the first call.', priority: 'medium', estimatedTime: '45 min', defaultStage: 'later' },

  // Technology Stack
  { id: 'tech-stack', category: 'tech_stack', stepName: 'Choose your core tools', description: 'Pick the CRM/field-service, payments, and storage tools you will use.', whyItMatters: 'A simple, connected stack saves hours every week.', priority: 'medium', estimatedTime: '1–2 hrs', defaultStage: 'later' },
  { id: 'tech-security', category: 'tech_stack', stepName: 'Set up passwords + 2FA', description: 'Use a password manager and turn on two-factor authentication on key accounts.', whyItMatters: 'Account security protects your business, money, and reputation.', priority: 'high', estimatedTime: '45 min', defaultStage: 'do_this_next' },

  // Launch Readiness
  { id: 'launch-checklist', category: 'launch_readiness', stepName: 'Complete your launch checklist', description: 'Confirm the must-have items are done before you start taking work.', whyItMatters: 'Launching ready avoids scrambling in front of customers.', priority: 'high', estimatedTime: '1 hr', defaultStage: 'later' },
  { id: 'launch-test-customer', category: 'launch_readiness', stepName: 'Run a test customer flow', description: 'Walk one job end to end: quote → schedule → invoice → review request.', whyItMatters: 'Testing the flow catches gaps before they cost you a customer.', priority: 'medium', estimatedTime: '1 hr', defaultStage: 'later' },

  // Post-Launch Weekly Review
  { id: 'weekly-review', category: 'weekly_review', stepName: 'Set a weekly review rhythm', description: 'Block a weekly time to review numbers, leads, and next actions.', whyItMatters: 'A steady review rhythm is how readiness turns into growth.', priority: 'medium', estimatedTime: '30 min/wk', defaultStage: 'later' },

  // ── Trade-specific steps (licensing/insurance). Educational only — verify the exact
  // licenses, certifications, and permits with official state/local sources. ──────────
  { id: 'trade-hvac-license', category: 'licensing_insurance', trade: 'hvac', stepName: 'Confirm HVAC licensing + refrigerant certification', description: 'Check the HVAC license, EPA refrigerant (Section 608) certification, and permits your state and locality require, via official sources.', whyItMatters: 'HVAC work is regulated; the right credentials keep your jobs legal and bankable.', priority: 'critical', estimatedTime: 'Varies', defaultStage: 'start_here', officialSourceReminder: true },
  { id: 'trade-electrical-license', category: 'licensing_insurance', trade: 'electrical', stepName: 'Confirm electrical license + permit requirements', description: 'Check the electrician license level and permit rules your state and locality require, via official sources.', whyItMatters: 'Electrical work almost always requires a license and pulled permits.', priority: 'critical', estimatedTime: 'Varies', defaultStage: 'start_here', officialSourceReminder: true },
  { id: 'trade-plumbing-license', category: 'licensing_insurance', trade: 'plumbing', stepName: 'Confirm plumbing license + backflow certification', description: 'Check the plumbing license and any backflow/cross-connection certifications your state and locality require, via official sources.', whyItMatters: 'Plumbing is licensed work tied to health and safety codes.', priority: 'critical', estimatedTime: 'Varies', defaultStage: 'start_here', officialSourceReminder: true },
  { id: 'trade-roofing-license', category: 'licensing_insurance', trade: 'roofing', stepName: 'Confirm roofing license, bonding + insurance', description: 'Check the roofing license, bonding, and insurance your state and locality require, via official sources.', whyItMatters: 'Many states regulate roofing and require proof of coverage to bid.', priority: 'high', estimatedTime: 'Varies', defaultStage: 'start_here', officialSourceReminder: true },
  { id: 'trade-solar-license', category: 'licensing_insurance', trade: 'solar', stepName: 'Confirm solar/electrical licensing + interconnection rules', description: 'Check the solar/electrical license and utility interconnection + permit requirements your state and locality require, via official sources.', whyItMatters: 'Solar installs touch electrical code and utility approval.', priority: 'critical', estimatedTime: 'Varies', defaultStage: 'start_here', officialSourceReminder: true },
  { id: 'trade-construction-license', category: 'licensing_insurance', trade: 'construction', stepName: 'Confirm general contractor license + bonding', description: 'Check the general contractor license thresholds and bonding your state and locality require, via official sources.', whyItMatters: 'GC licensing and bonding gate which projects you can legally take.', priority: 'critical', estimatedTime: 'Varies', defaultStage: 'start_here', officialSourceReminder: true },
  { id: 'trade-handyman-scope', category: 'licensing_insurance', trade: 'handyman', stepName: 'Confirm handyman scope limits + license thresholds', description: 'Check the dollar/scope limits and any license thresholds for handyman work your state and locality set, via official sources.', whyItMatters: 'Staying within scope limits keeps unlicensed work legal.', priority: 'high', estimatedTime: 'Varies', defaultStage: 'start_here', officialSourceReminder: true },
  { id: 'trade-landscaping-requirements', category: 'licensing_insurance', trade: 'landscaping', stepName: 'Confirm landscaping + pesticide applicator requirements', description: 'Check any pesticide/chemical applicator licensing and permits your state and locality require, via official sources.', whyItMatters: 'Chemical application is often separately regulated.', priority: 'medium', estimatedTime: 'Varies', defaultStage: 'do_this_next', officialSourceReminder: true },
  { id: 'trade-cleaning-bonding', category: 'licensing_insurance', trade: 'cleaning', stepName: 'Confirm cleaning business bonding + insurance', description: 'Check the bonding and liability insurance customers and your locality expect, via official sources.', whyItMatters: 'Bonding and insurance build trust for in-home/in-business access.', priority: 'high', estimatedTime: 'Varies', defaultStage: 'do_this_next', officialSourceReminder: true },
  { id: 'trade-painting-rrp', category: 'licensing_insurance', trade: 'painting', stepName: 'Confirm painting license + lead-safe (RRP) certification', description: 'Check painting license rules and EPA Lead Renovation, Repair and Painting (RRP) certification needs for older homes, via official sources.', whyItMatters: 'Lead-safe rules apply to pre-1978 properties and carry penalties.', priority: 'high', estimatedTime: 'Varies', defaultStage: 'start_here', officialSourceReminder: true },
]

// ── Label maps ──────────────────────────────────────────────────────────────────
const STAGE_LABELS: Record<FoundationStage, string> = {
  start_here: 'Start here',
  do_this_next: 'Do this next',
  later: 'Later',
  done: 'Done',
  blocked: 'Blocked',
}
const STATUS_LABELS: Record<FoundationItemStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  done: 'Done',
  blocked: 'Blocked',
}
const PRIORITY_LABELS: Record<FoundationPriority, string> = {
  critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low',
}
const STAGE_ORDER: FoundationStage[] = ['start_here', 'do_this_next', 'later', 'blocked', 'done']
const PRIORITY_ORDER: Record<FoundationPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 }

export function getFoundationStageLabel(stage: FoundationStage): string { return STAGE_LABELS[stage] }
export function getFoundationStatusLabel(status: FoundationItemStatus): string { return STATUS_LABELS[status] }
export function getFoundationPriorityLabel(priority: FoundationPriority): string { return PRIORITY_LABELS[priority] }
export function getFoundationSections(): FoundationSection[] { return FOUNDATION_SECTIONS }
export function getFoundationCategories(): FoundationCategory[] { return FOUNDATION_CATEGORIES }
export function getFoundationStepDefinitions(): FoundationStepDefinition[] { return FOUNDATION_STEP_DEFINITIONS }

// ── Item factory + transitions (pure) ───────────────────────────────────────────
export function createFoundationItemFromDefinition(def: FoundationStepDefinition): FoundationChecklistItem {
  const now = new Date().toISOString()
  return {
    id: def.id,
    createdAt: now,
    updatedAt: now,
    category: def.category,
    sectionId: CATEGORY_SECTION[def.category],
    stepDefId: def.id,
    stepName: def.stepName,
    stage: def.defaultStage,
    status: 'not_started',
    priority: def.priority,
    completed: false,
    completedAt: null,
    blockedReason: null,
    trade: def.trade,
    note: null,
  }
}

/** Step definitions for a trade: all core steps + that trade's steps (or just core). */
export function getFoundationStepDefinitionsForTrade(trade: FoundationTrade | null): FoundationStepDefinition[] {
  return FOUNDATION_STEP_DEFINITIONS.filter(d => d.trade === undefined || d.trade === trade)
}

/**
 * A fresh default checklist. With a trade, includes core + that trade's steps; without a
 * trade (or 'other'/unknown), falls back to the general core steps only. Pure; writes nothing.
 */
export function createDefaultFoundationItems(trade: FoundationTrade | null = null): FoundationChecklistItem[] {
  return getFoundationStepDefinitionsForTrade(trade).map(createFoundationItemFromDefinition)
}

/** Items relevant to a trade: core items + items matching the trade (or just core). */
export function getFoundationItemsByTrade(items: FoundationChecklistItem[], trade: FoundationTrade | null): FoundationChecklistItem[] {
  return items.filter(it => it.trade === undefined || it.trade === trade)
}

/**
 * Upgrade an existing checklist by appending any missing core/trade step items (idempotent).
 * Lets users who started before a trade was set pick up the trade-specific steps. Pure.
 */
export function withTradeSteps(items: FoundationChecklistItem[], trade: FoundationTrade | null): FoundationChecklistItem[] {
  const present = new Set(items.map(i => i.id))
  const missing = getFoundationStepDefinitionsForTrade(trade)
    .filter(d => !present.has(d.id))
    .map(createFoundationItemFromDefinition)
  return missing.length > 0 ? [...items, ...missing] : items
}

/** Move an item to a stage and keep status/completed/completedAt/blockedReason in sync. */
export function setFoundationItemStage(item: FoundationChecklistItem, stage: FoundationStage): FoundationChecklistItem {
  const now = new Date().toISOString()
  const completed = stage === 'done'
  const status: FoundationItemStatus =
    stage === 'done' ? 'done'
      : stage === 'blocked' ? 'blocked'
      : stage === 'start_here' ? 'in_progress'
      : item.status === 'done' || item.status === 'blocked' ? 'not_started'
      : item.status
  return {
    ...item,
    stage,
    status,
    completed,
    // Preserve the original completion time if it was already done; set it on transition.
    completedAt: completed ? (item.completedAt ?? now) : null,
    // Clear the blocked reason when leaving the blocked stage.
    blockedReason: stage === 'blocked' ? (item.blockedReason ?? null) : null,
    updatedAt: now,
  }
}

// ── Product-5C: durable, measurable completion tracking helpers (pure) ──────────

/** Apply a partial patch to one item by id; always refreshes updatedAt. Returns a new list. */
export function updateFoundationItem(
  items: FoundationChecklistItem[],
  id: string,
  patch: Partial<FoundationChecklistItem>,
): FoundationChecklistItem[] {
  return items.map(it => (it.id === id ? { ...it, ...patch, updatedAt: new Date().toISOString() } : it))
}

/** Mark an item done (stage=done, completed=true, completedAt set). Returns a new list. */
export function completeFoundationItem(items: FoundationChecklistItem[], id: string): FoundationChecklistItem[] {
  return items.map(it => (it.id === id ? setFoundationItemStage(it, 'done') : it))
}

/** Mark an item blocked with an optional reason. Returns a new list. */
export function blockFoundationItem(items: FoundationChecklistItem[], id: string, reason?: string | null): FoundationChecklistItem[] {
  const cleaned = reason && reason.trim() !== '' ? reason.trim() : null
  return items.map(it => {
    if (it.id !== id) return it
    const moved = setFoundationItemStage(it, 'blocked')
    return { ...moved, blockedReason: cleaned }
  })
}

export interface FoundationCompletionStats {
  total: number
  completed: number
  inProgress: number
  notStarted: number
  blocked: number
  percent: number
  lastCompletedAt: string | null
  lastUpdatedAt: string | null
}

/** Durable completion stats for Product-5D dashboard summary. Pure. */
export function getFoundationCompletionStats(items: FoundationChecklistItem[]): FoundationCompletionStats {
  let completed = 0, inProgress = 0, notStarted = 0, blocked = 0
  let lastCompletedAt: string | null = null
  let lastUpdatedAt: string | null = null
  for (const it of items) {
    if (it.stage === 'blocked' || it.status === 'blocked') blocked += 1
    else if (it.completed) completed += 1
    else if (it.status === 'in_progress') inProgress += 1
    else notStarted += 1
    if (it.completed && it.completedAt && (!lastCompletedAt || it.completedAt > lastCompletedAt)) lastCompletedAt = it.completedAt
    const u = it.updatedAt ?? it.createdAt
    if (u && (!lastUpdatedAt || u > lastUpdatedAt)) lastUpdatedAt = u
  }
  const total = items.length
  return {
    total,
    completed,
    inProgress,
    notStarted,
    blocked,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    lastCompletedAt,
    lastUpdatedAt,
  }
}

/** Group items by their workflow stage. Pure. */
export function getFoundationItemsByStage(items: FoundationChecklistItem[]): Record<FoundationStage, FoundationChecklistItem[]> {
  const out: Record<FoundationStage, FoundationChecklistItem[]> = {
    start_here: [], do_this_next: [], later: [], done: [], blocked: [],
  }
  for (const it of items) out[it.stage].push(it)
  return out
}

// ── Safe local-storage contract (SSR-safe) ──────────────────────────────────────
export function loadFoundationItems(): FoundationChecklistItem[] {
  if (typeof window === 'undefined') return []
  const parsed = safeJsonParse<FoundationChecklistItem[]>(window.localStorage.getItem(FOUNDATION_BUILDER_KEYS.foundation))
  return Array.isArray(parsed) ? parsed : []
}

export function saveFoundationItems(items: FoundationChecklistItem[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(FOUNDATION_BUILDER_KEYS.foundation, JSON.stringify(items))
  } catch {
    // storage unavailable / quota — non-fatal, device-only data
  }
}

/**
 * Saved items if present, otherwise the default checklist for the trade (does NOT write).
 * No trade → general core steps only.
 */
export function getFoundationItemsOrDefaults(trade: FoundationTrade | null = null): FoundationChecklistItem[] {
  const saved = loadFoundationItems()
  return saved.length > 0 ? saved : createDefaultFoundationItems(trade)
}

// ── Progress summary + next recommended item ────────────────────────────────────
export interface FoundationProgressSummary {
  total: number
  completed: number
  percent: number
  blockedCount: number
  byStage: Record<FoundationStage, number>
  byCategory: { category: FoundationCategoryId; label: string; total: number; completed: number; percent: number }[]
}

export function getFoundationProgressSummary(items: FoundationChecklistItem[]): FoundationProgressSummary {
  const total = items.length
  const completed = items.filter(i => i.completed).length
  const blockedCount = items.filter(i => i.stage === 'blocked').length
  const byStage: Record<FoundationStage, number> = { start_here: 0, do_this_next: 0, later: 0, done: 0, blocked: 0 }
  for (const i of items) byStage[i.stage] += 1

  const catMap = new Map<FoundationCategoryId, { total: number; completed: number }>()
  for (const i of items) {
    const e = catMap.get(i.category) ?? { total: 0, completed: 0 }
    e.total += 1
    if (i.completed) e.completed += 1
    catMap.set(i.category, e)
  }
  const labelOf = (id: FoundationCategoryId) => FOUNDATION_CATEGORIES.find(c => c.id === id)?.label ?? id
  const byCategory = FOUNDATION_CATEGORIES
    .filter(c => catMap.has(c.id))
    .map(c => {
      const e = catMap.get(c.id)!
      return { category: c.id, label: labelOf(c.id), total: e.total, completed: e.completed, percent: e.total > 0 ? Math.round((e.completed / e.total) * 100) : 0 }
    })

  return {
    total,
    completed,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    blockedCount,
    byStage,
    byCategory,
  }
}

/**
 * The next recommended item: not done and not blocked, chosen by stage order
 * (start_here → do_this_next → later) then priority then creation order.
 */
export function getNextFoundationItem(items: FoundationChecklistItem[]): FoundationChecklistItem | null {
  const open = items.filter(i => !i.completed && i.stage !== 'blocked')
  if (open.length === 0) return null
  const stageRank = (s: FoundationStage) => STAGE_ORDER.indexOf(s)
  return [...open].sort((a, b) => {
    const s = stageRank(a.stage) - stageRank(b.stage)
    if (s !== 0) return s
    const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    if (p !== 0) return p
    return a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0
  })[0]
}

// ── Product-5E: dependency-free export helpers (pure) ───────────────────────────
// Export the user's OWN local Foundation Builder progress only. CSV cells are
// neutralized against spreadsheet formula injection; HTML output escapes user text.

const SECTION_LABEL: Record<FoundationSectionId, string> =
  FOUNDATION_SECTIONS.reduce((acc, s) => { acc[s.id] = s.label; return acc }, {} as Record<FoundationSectionId, string>)
const CATEGORY_LABEL: Record<FoundationCategoryId, string> =
  FOUNDATION_CATEGORIES.reduce((acc, c) => { acc[c.id] = c.label; return acc }, {} as Record<FoundationCategoryId, string>)

export const FOUNDATION_EXPORT_HEADERS = [
  'Section', 'Category', 'Step', 'Stage', 'Status', 'Priority',
  'Completed', 'Completed At', 'Blocked Reason', 'Note', 'Updated At',
] as const

/** One string row per item, in export-header order. Pure. */
export function foundationItemsToRows(items: FoundationChecklistItem[]): string[][] {
  return items.map(it => [
    SECTION_LABEL[it.sectionId] ?? it.sectionId,
    CATEGORY_LABEL[it.category] ?? it.category,
    it.stepName,
    getFoundationStageLabel(it.stage),
    getFoundationStatusLabel(it.status),
    getFoundationPriorityLabel(it.priority),
    it.completed ? 'Yes' : 'No',
    it.completedAt ?? '',
    it.blockedReason ?? '',
    it.note ?? '',
    it.updatedAt ?? it.createdAt ?? '',
  ])
}

// Quote + escape a CSV cell; neutralize leading formula chars (anti CSV injection).
function csvCell(value: string): string {
  let v = value
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`
  return `"${v.replace(/"/g, '""')}"`
}

/** RFC-4180-style CSV text for the user's checklist. Pure; no dependencies. */
export function foundationItemsToCsv(items: FoundationChecklistItem[]): string {
  const rows = [Array.from(FOUNDATION_EXPORT_HEADERS), ...foundationItemsToRows(items)]
  return rows.map(r => r.map(csvCell).join(',')).join('\r\n')
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** A simple, dependency-free printable HTML document (for browser Print / Save as PDF). */
export function foundationItemsToPrintableHtml(items: FoundationChecklistItem[]): string {
  const stats = getFoundationCompletionStats(items)
  const head = FOUNDATION_EXPORT_HEADERS.map(h => `<th>${escapeHtml(h)}</th>`).join('')
  const body = foundationItemsToRows(items)
    .map(r => `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`)
    .join('')
  return `<!doctype html><html><head><meta charset="utf-8"><title>Foundation Builder progress</title>` +
    `<style>body{font-family:system-ui,Segoe UI,sans-serif;padding:24px;color:#111}` +
    `h1{font-size:18px;margin:0 0 4px}p.sub{color:#555;font-size:12px;margin:0 0 16px}` +
    `table{border-collapse:collapse;width:100%;font-size:11px}` +
    `th,td{border:1px solid #ccc;padding:6px;text-align:left;vertical-align:top}th{background:#f3f4f6}` +
    `p.note{font-size:10px;color:#666;margin-top:14px}</style></head><body>` +
    `<h1>SubZeroMetrix&trade; Foundation Builder</h1>` +
    `<p class="sub">${stats.completed} of ${stats.total} steps complete (${stats.percent}%)` +
    `${stats.blocked > 0 ? ` &middot; ${stats.blocked} blocked` : ''}</p>` +
    `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>` +
    `<p class="note">Educational only. Verify legal, tax, and licensing requirements with official sources.</p>` +
    `</body></html>`
}

// ── Product-5G: state-specific official-resource routing ────────────────────────
// EDUCATIONAL STARTING POINTS ONLY. These point to official government portals so the
// user can verify requirements themselves. They are NOT legal/tax/licensing advice and
// make NO claim that a state's requirements are complete or current. Always verify.

export interface FoundationOfficialResource {
  label: string
  url: string
  scope: 'federal' | 'state'
}

// Federal resources (same for every state).
const FEDERAL_EIN_RESOURCE: FoundationOfficialResource = {
  label: 'IRS — Apply for an EIN (official)', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number', scope: 'federal',
}
const GBP_RESOURCE: FoundationOfficialResource = {
  label: 'Google Business Profile (official)', url: 'https://www.google.com/business/', scope: 'federal',
}

interface StateResourceSet {
  entity: FoundationOfficialResource     // Secretary of State / business registration
  tax: FoundationOfficialResource        // state department of revenue
  licensing: FoundationOfficialResource  // state licensing authority
}

// Launch states only. Links are official-portal starting points (homepages/portals),
// chosen to be stable. Labels say "official"; the UI adds a "verify current" caption.
const LAUNCH_STATE_RESOURCES: Record<string, StateResourceSet> = {
  Florida: {
    entity: { label: 'Florida Division of Corporations — Sunbiz (official)', url: 'https://www.sunbiz.org/', scope: 'state' },
    tax: { label: 'Florida Department of Revenue (official)', url: 'https://floridarevenue.com/', scope: 'state' },
    licensing: { label: 'Florida DBPR — licensing (official)', url: 'https://www.myfloridalicense.com/', scope: 'state' },
  },
  Colorado: {
    entity: { label: 'Colorado Secretary of State — Business (official)', url: 'https://www.coloradosos.gov/', scope: 'state' },
    tax: { label: 'Colorado Department of Revenue — Taxation (official)', url: 'https://tax.colorado.gov/', scope: 'state' },
    licensing: { label: 'Colorado DORA — professions & occupations (official)', url: 'https://dpo.colorado.gov/', scope: 'state' },
  },
  Texas: {
    entity: { label: 'Texas Secretary of State (official)', url: 'https://www.sos.state.tx.us/', scope: 'state' },
    tax: { label: 'Texas Comptroller (official)', url: 'https://comptroller.texas.gov/', scope: 'state' },
    licensing: { label: 'Texas Dept. of Licensing & Regulation — TDLR (official)', url: 'https://www.tdlr.texas.gov/', scope: 'state' },
  },
  Arizona: {
    entity: { label: 'Arizona Corporation Commission (official)', url: 'https://azcc.gov/', scope: 'state' },
    tax: { label: 'Arizona Department of Revenue (official)', url: 'https://azdor.gov/', scope: 'state' },
    licensing: { label: 'Arizona Registrar of Contractors — ROC (official)', url: 'https://roc.az.gov/', scope: 'state' },
  },
  Ohio: {
    entity: { label: 'Ohio Secretary of State — Business (official)', url: 'https://www.ohiosos.gov/', scope: 'state' },
    tax: { label: 'Ohio Department of Taxation (official)', url: 'https://tax.ohio.gov/', scope: 'state' },
    licensing: { label: 'Ohio eLicense (official)', url: 'https://elicense.ohio.gov/', scope: 'state' },
  },
  'North Carolina': {
    entity: { label: 'North Carolina Secretary of State — Business (official)', url: 'https://www.sosnc.gov/', scope: 'state' },
    tax: { label: 'North Carolina Department of Revenue (official)', url: 'https://www.ncdor.gov/', scope: 'state' },
    licensing: { label: 'NC Licensing Board for General Contractors (official)', url: 'https://nclbgc.org/', scope: 'state' },
  },
}

export const FOUNDATION_LAUNCH_STATES: string[] = Object.keys(LAUNCH_STATE_RESOURCES)

/** Canonical launch-state name if we have official resources for it, else null. */
export function normalizeFoundationState(value: string | null | undefined): string | null {
  if (!value) return null
  const match = FOUNDATION_LAUNCH_STATES.find(s => s.toLowerCase() === value.trim().toLowerCase())
  return match ?? null
}

/**
 * Official-resource starting points for a step's category, given the user's state.
 * Federal resources (EIN, GBP) apply to every state. State resources only resolve for the
 * launch states; other states return just the federal items (UI shows a verify-your-state
 * fallback). NEVER advice; NEVER a completeness/currency claim.
 */
export function getFoundationStateResources(
  state: string | null | undefined,
  category: FoundationCategoryId,
): FoundationOfficialResource[] {
  const out: FoundationOfficialResource[] = []
  if (category === 'tax_ein') out.push(FEDERAL_EIN_RESOURCE)
  if (category === 'google_business_profile') out.push(GBP_RESOURCE)

  const canonical = normalizeFoundationState(state)
  if (canonical) {
    const set = LAUNCH_STATE_RESOURCES[canonical]
    if (category === 'legal_entity') out.push(set.entity)
    else if (category === 'tax_ein') out.push(set.tax)
    else if (category === 'licensing_insurance') out.push(set.licensing)
  }
  return out
}
