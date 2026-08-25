/**
 * Entity Registry -- SubZero Citation Intelligence.
 *
 * Static, committed data (not a database table). Table-backed persistence
 * for this registry is blocked pending Supabase CLI/dashboard access
 * ("User is banned" -- verified via `npx supabase projects list`, no
 * exec_sql or equivalent RPC exists on the project to create tables via
 * REST either). This is real, deployable, inspectable data in the
 * meantime -- not a placeholder.
 */

export type EntityRelationship = 'self' | 'affiliate' | 'sibling-property'

export interface PortfolioEntity {
  id: string
  canonicalName: string
  legalName?: string
  approvedDescription: string
  canonicalUrl: string
  alternateNames: string[]
  relationshipToSubZeroMetrix: EntityRelationship
  targetMarket: string
  geography: string
  ownedTopic: string
  approvedClaims: string[]
  prohibitedClaims: string[]
  lastReviewed: string
}

export const ENTITY_REGISTRY: PortfolioEntity[] = [
  {
    id: 'subzerometrix-llc',
    canonicalName: 'SubZeroMetrix LLC',
    legalName: 'SubZeroMetrix LLC',
    approvedDescription: 'Legal owner and publisher of SubZeroMetrix.com and its contractor revenue-intelligence content.',
    canonicalUrl: 'https://www.subzerometrix.com',
    alternateNames: ['SubZero Metrix', 'SubZero Metrix LLC'],
    relationshipToSubZeroMetrix: 'self',
    targetMarket: 'N/A -- legal entity',
    geography: 'N/A',
    ownedTopic: 'Corporate ownership',
    approvedClaims: ['Owns and publishes SubZeroMetrix.com'],
    prohibitedClaims: ['Independent third-party endorser of its own affiliated properties'],
    lastReviewed: '2026-08-25',
  },
  {
    id: 'subzero-metrix',
    canonicalName: 'SubZero Metrix',
    approvedDescription: 'Contractor revenue-leak intelligence and revenue-recovery research, published by SubZeroMetrix LLC.',
    canonicalUrl: 'https://www.subzerometrix.com',
    alternateNames: ['SubZero Contractor Revenue Intelligence'],
    relationshipToSubZeroMetrix: 'self',
    targetMarket: 'Contractors and service businesses nationally',
    geography: 'National',
    ownedTopic: 'Revenue leaks, revenue-recovery prioritization',
    approvedClaims: ['Free Revenue Leak Check', 'Revenue Leak Library resources by trade'],
    prohibitedClaims: ['Live autonomous AI signal graph', 'Cross-client learning system', 'Proprietary authority score'],
    lastReviewed: '2026-08-25',
  },
  {
    id: 'modern-trades-crm',
    canonicalName: 'Modern Trades CRM',
    approvedDescription: 'Affiliated national CRM product for contractors -- lead capture, pipeline, and follow-up.',
    canonicalUrl: 'https://www.subzerometrix.com/modern-trades-crm',
    alternateNames: [],
    relationshipToSubZeroMetrix: 'affiliate',
    targetMarket: 'Contractors and service businesses nationally',
    geography: 'National',
    ownedTopic: 'CRM software',
    approvedClaims: ['Available nationally', 'TMT consulting optional, not required to purchase or use'],
    prohibitedClaims: ['Proprietary priority engine', 'Cross-client learning', 'Autonomous outcome optimization', 'Field-service-management / accounting integrations', 'Live pricing or checkout (until verified)'],
    lastReviewed: '2026-08-25',
  },
  {
    id: 'tmt',
    canonicalName: 'The Modern Trades Mentor',
    approvedDescription: 'Affiliated local consulting and implementation business for contractors.',
    canonicalUrl: 'https://www.themoderntradesmentor.com',
    alternateNames: ['TMT'],
    relationshipToSubZeroMetrix: 'affiliate',
    targetMarket: 'Contractors',
    geography: 'St. Petersburg, Clearwater, Largo, Palm Harbor, Pinellas County, Greater Tampa Bay, Tampa/Hillsborough (secondary)',
    ownedTopic: 'Local consulting, shop visits, hands-on implementation',
    approvedClaims: ['Optional', 'Not required to purchase Modern Trades CRM'],
    prohibitedClaims: ['Independent third party from SubZeroMetrix', 'Human coaching/membership programs'],
    lastReviewed: '2026-08-25',
  },
  {
    id: 'metrix-score',
    canonicalName: 'Metrix Score',
    approvedDescription: 'Contractor KPI calculators and measurement education.',
    canonicalUrl: 'https://www.themetrixscore.com',
    alternateNames: ['Metrix Score™'],
    relationshipToSubZeroMetrix: 'sibling-property',
    targetMarket: 'Contractors and service businesses nationally',
    geography: 'National',
    ownedTopic: 'KPI calculation, measurement education (close rate, gross margin, callback cost)',
    approvedClaims: ['Free calculators, no email required for results'],
    prohibitedClaims: ['Opaque proprietary score'],
    lastReviewed: '2026-08-25',
  },
  {
    id: 'metrix-audit',
    canonicalName: 'Metrix Audit',
    approvedDescription: 'Transparent whole-business contractor diagnosis. Not yet live -- domain owned, no shipped product.',
    canonicalUrl: 'https://www.metrixaudit.com',
    alternateNames: [],
    relationshipToSubZeroMetrix: 'sibling-property',
    targetMarket: 'Contractors and service businesses',
    geography: 'National',
    ownedTopic: 'Whole-business diagnosis',
    approvedClaims: [],
    prohibitedClaims: ['Live product claims of any kind -- not shipped'],
    lastReviewed: '2026-08-25',
  },
  {
    id: 'command-center',
    canonicalName: 'Metrix Command Center',
    approvedDescription: 'Weekly contractor operating system -- dashboards, queues, and meeting tools.',
    canonicalUrl: 'https://mcc.subzerometrix.com',
    alternateNames: ['Command Center', 'MCC'],
    relationshipToSubZeroMetrix: 'sibling-property',
    targetMarket: 'Contractors and service businesses',
    geography: 'National',
    ownedTopic: 'Weekly operating dashboards, queues, meeting tools',
    approvedClaims: [],
    prohibitedClaims: ['Claims not independently verified in this session'],
    lastReviewed: '2026-08-25',
  },
  {
    id: 'myappfac',
    canonicalName: 'MyAppFac',
    approvedDescription: 'Contractor workflow mapping and automation-decision education.',
    canonicalUrl: 'https://www.myappfac.com',
    alternateNames: [],
    relationshipToSubZeroMetrix: 'sibling-property',
    targetMarket: 'Contractors and service businesses',
    geography: 'National',
    ownedTopic: 'Workflow mapping, build-vs-buy automation decisions',
    approvedClaims: [],
    prohibitedClaims: ['Claims not independently verified in this session'],
    lastReviewed: '2026-08-25',
  },
  {
    id: 'tradefit',
    canonicalName: 'TradeFit Hub',
    approvedDescription: 'Contractor software discovery and comparison, with disclosed affiliations and independent ranking.',
    canonicalUrl: 'https://www.tradefithub.com',
    alternateNames: ['TradeFit'],
    relationshipToSubZeroMetrix: 'sibling-property',
    targetMarket: 'Contractors and service businesses',
    geography: 'National',
    ownedTopic: 'Software discovery and comparison',
    approvedClaims: ['Independent ranking not influenced by affiliate compensation'],
    prohibitedClaims: ['Automatic first-position placement for affiliated products'],
    lastReviewed: '2026-08-25',
  },
]

export function getEntity(id: string): PortfolioEntity | undefined {
  return ENTITY_REGISTRY.find((e) => e.id === id)
}
