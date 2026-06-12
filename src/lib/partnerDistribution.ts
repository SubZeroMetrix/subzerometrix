// ─────────────────────────────────────────────────────────────────────────────
// partnerDistribution — partner / vendor / association distribution (Growth-5)
// ─────────────────────────────────────────────────────────────────────────────
// Active foundation for trade-ecosystem distribution. Captures PARTNER INTEREST
// locally (device-only) and provides channel types, fit signals, outreach templates,
// and shareable resource assets.
//
// TRUST LANGUAGE: "partner interest", "distribution channel", "community resource",
// and "vendor/resource fit" only. NEVER "official partner", "preferred vendor",
// "approved vendor", "sponsor", or "affiliate" unless verified. No fake endorsements,
// no paid-placement claims, no automatic outreach, no guaranteed leads/revenue/results.
// ─────────────────────────────────────────────────────────────────────────────

export const PARTNER_CONTACT_EMAIL = 'themoderntradesmentor@gmail.com'

export type PartnerChannelType =
  | 'trade_association'
  | 'supplier_vendor'
  | 'manufacturer'
  | 'distributor'
  | 'coach_consultant'
  | 'trade_school'
  | 'community_group'
  | 'podcast_media'
  | 'software_vendor'
  | 'local_business_network'

export type PartnerFitScore = 'high' | 'medium' | 'low'

export type PartnerInterestStatus =
  | 'research'
  | 'outreach_ready'
  | 'interested'
  | 'contact_later'
  | 'not_fit'
  | 'active_confirmed'

export interface PartnerDistributionChannel {
  type: PartnerChannelType
  label: string
  description: string
  howTheyShare: string
  fit: PartnerFitScore
}

export interface PartnerInterestSubmission {
  id: string
  createdAt: string
  storageMode: 'local_device'
  name: string
  company: string
  channelType: PartnerChannelType
  website: string | null
  email: string | null
  collaborationNote: string | null
  consentToContact: boolean
  status: PartnerInterestStatus   // default 'research' — never 'active_confirmed' automatically
}

export interface PartnerInterestInput {
  name: string
  company: string
  channelType: PartnerChannelType
  website?: string | null
  email?: string | null
  collaborationNote?: string | null
  consentToContact?: boolean
}

export interface PartnerOutreachTemplate {
  id: string
  audience: string
  subject: string
  body: string
}

export interface PartnerResourceAsset {
  id: string
  label: string
  path: string
  description: string
}

// ── Channel definitions + fit ─────────────────────────────────────────────────
const FIT: Record<PartnerChannelType, PartnerFitScore> = {
  trade_association: 'high',
  trade_school: 'high',
  community_group: 'high',
  coach_consultant: 'high',
  local_business_network: 'medium',
  podcast_media: 'medium',
  supplier_vendor: 'medium',
  distributor: 'medium',
  software_vendor: 'medium',
  manufacturer: 'low',
}

const CHANNELS: PartnerDistributionChannel[] = [
  { type: 'trade_association', label: 'Trade association', description: 'Associations serving contractors and tradespeople.', howTheyShare: 'Share a free readiness resource with members in newsletters or member portals.', fit: FIT.trade_association },
  { type: 'supplier_vendor', label: 'Supplier / vendor', description: 'Suppliers and vendors serving trade businesses.', howTheyShare: 'Offer it as a free educational resource to customers, with no endorsement implied.', fit: FIT.supplier_vendor },
  { type: 'manufacturer', label: 'Manufacturer', description: 'Manufacturers whose products trade businesses install or use.', howTheyShare: 'Include it in contractor-education materials as a neutral resource.', fit: FIT.manufacturer },
  { type: 'distributor', label: 'Distributor', description: 'Distributors and supply houses.', howTheyShare: 'Share at counters or in pro programs as a free readiness check.', fit: FIT.distributor },
  { type: 'coach_consultant', label: 'Coach / consultant', description: 'Business coaches and consultants for trades.', howTheyShare: 'Use the readiness framework as a starting point with clients.', fit: FIT.coach_consultant },
  { type: 'trade_school', label: 'Trade school', description: 'Trade schools and apprenticeship programs.', howTheyShare: 'Share with students starting their own businesses.', fit: FIT.trade_school },
  { type: 'community_group', label: 'Community group', description: 'Local and online contractor communities.', howTheyShare: 'Post it as a helpful, free community resource.', fit: FIT.community_group },
  { type: 'podcast_media', label: 'Podcast / media', description: 'Trade-focused podcasts, newsletters, and media.', howTheyShare: 'Mention it as an educational tool for listeners or readers.', fit: FIT.podcast_media },
  { type: 'software_vendor', label: 'Software vendor', description: 'Software used by trade businesses.', howTheyShare: 'Offer it as a complementary free readiness resource.', fit: FIT.software_vendor },
  { type: 'local_business_network', label: 'Local business network', description: 'Chambers and local business networks.', howTheyShare: 'Share with members starting or growing a trade business.', fit: FIT.local_business_network },
]

export function getPartnerChannelTypes(): PartnerChannelType[] {
  return CHANNELS.map(c => c.type)
}

export function getPartnerDistributionChannels(): PartnerDistributionChannel[] {
  return CHANNELS
}

export function getPartnerFitScore(channelType: PartnerChannelType): PartnerFitScore {
  return FIT[channelType] ?? 'medium'
}

// ── Outreach templates (honest; no endorsement/partnership claims) ────────────
export function getPartnerOutreachTemplates(): PartnerOutreachTemplate[] {
  return [
    {
      id: 'association',
      audience: 'trade_association',
      subject: 'A free business-readiness resource for your members',
      body: 'We built SubZeroMetrix™, a free business-readiness assessment for contractors, tradespeople, and service-business owners. If it would help your members, you are welcome to share it as an educational resource. This is not an endorsement or partnership unless we confirm one together. Reach us at ' + PARTNER_CONTACT_EMAIL + '.',
    },
    {
      id: 'trade_school',
      audience: 'trade_school',
      subject: 'A readiness framework for students starting a business',
      body: 'SubZeroMetrix™ is a free educational readiness framework for new trade-business owners. Students are welcome to use it. No endorsement is implied. Contact ' + PARTNER_CONTACT_EMAIL + ' to talk further.',
    },
    {
      id: 'community',
      audience: 'community_group',
      subject: 'A free community resource for contractors',
      body: 'If your community could use a free business-readiness check for contractors and service businesses, feel free to share SubZeroMetrix™. It is educational only and implies no endorsement. Questions: ' + PARTNER_CONTACT_EMAIL + '.',
    },
  ]
}

// ── Shareable resource assets (public pages) ──────────────────────────────────
export function getPartnerResourceAssets(): PartnerResourceAsset[] {
  return [
    { id: 'assessment', label: 'Free business-readiness assessment', path: '/start', description: 'The free Starter MetrixScore™ assessment.' },
    { id: 'business_readiness', label: 'Business readiness guide', path: '/business-readiness', description: 'Plain-language readiness answers.' },
    { id: 'general_starter', label: 'General business starter', path: '/general-business-starter', description: 'A free starter framework.' },
    { id: 'resources', label: 'Contractor resources', path: '/resources', description: 'Free, official resources and tools.' },
    { id: 'spanish', label: 'Recursos en español', path: '/es', description: 'Spanish discovery pages.' },
  ]
}

// ── Local-device partner interest capture ─────────────────────────────────────
const PARTNER_STORAGE_KEY = 'szm_partner_interest'

function genId(): string {
  return `pi_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function clean(value: string | null | undefined): string | null {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

export function createPartnerInterestSubmission(input: PartnerInterestInput): PartnerInterestSubmission {
  return {
    id: genId(),
    createdAt: new Date().toISOString(),
    storageMode: 'local_device',
    name: input.name.trim(),
    company: input.company.trim(),
    channelType: input.channelType,
    website: clean(input.website),
    email: clean(input.email),
    collaborationNote: clean(input.collaborationNote),
    consentToContact: input.consentToContact ?? false,
    // Default is research — NEVER active_confirmed without manual confirmation.
    status: 'research',
  }
}

export function getPartnerInterestLocal(): PartnerInterestSubmission[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(PARTNER_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as PartnerInterestSubmission[]) : []
  } catch {
    return []
  }
}

export function savePartnerInterestLocal(submission: PartnerInterestSubmission): void {
  if (typeof window === 'undefined') return
  try {
    const existing = getPartnerInterestLocal()
    window.localStorage.setItem(PARTNER_STORAGE_KEY, JSON.stringify([...existing, submission]))
  } catch {
    // storage unavailable — non-fatal, device-only data
  }
}

export function getPartnerDisclosureText(): string {
  return 'SubZeroMetrix™ is an educational business-readiness platform owned and operated by The Modern Trades Mentor LLC. Sharing or listing a resource does not imply an official partnership, endorsement, approval, affiliate relationship, or sponsorship unless confirmed in writing. We do not pay for placements and do not guarantee leads, revenue, or results.'
}
