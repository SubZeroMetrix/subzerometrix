// ─────────────────────────────────────────────────────────────────────────────
// generalBusinessStarter — General Business Starter Information Package (Growth-2B)
// ─────────────────────────────────────────────────────────────────────────────
// Educational starter content for broad "how to start a business" visitors who may
// not be in a supported contractor/trade category. Data/model only.
//
// HONESTY: SubZeroMetrix™ is currently strongest for contractors, tradespeople, and
// service-business owners. This package is educational and may be less industry-
// specific. It is NOT legal, tax, financial, licensing, or compliance advice, and it
// does not provide official state guidance — it routes users to official sources.
// ─────────────────────────────────────────────────────────────────────────────

export interface GeneralBusinessStarterChecklistItem {
  id: string
  label: string
  detail: string
}

export interface GeneralBusinessStarterSection {
  id: string
  title: string
  intro: string
  items: GeneralBusinessStarterChecklistItem[]
}

export interface GeneralBusinessRoutingRecommendation {
  audience: string
  recommendedPath: string
  cta: string
  note: string
}

export interface GeneralBusinessStarterPackage {
  scopeNote: string
  disclaimer: string
  sections: GeneralBusinessStarterSection[]
  routing: GeneralBusinessRoutingRecommendation[]
}

export const GENERAL_BUSINESS_SCOPE_NOTE =
  'SubZeroMetrix™ is currently strongest for contractors, tradespeople, and service-business owners. This general business starter package is educational and may be less industry-specific.'

export const GENERAL_BUSINESS_DISCLAIMER =
  'Educational only. Not legal, tax, financial, licensing, or compliance advice. Use official state, local, and professional sources to confirm legal, tax, licensing, insurance, registration, and permitting requirements.'

const SECTIONS: GeneralBusinessStarterSection[] = [
  {
    id: 'setup_basics',
    title: 'Business Setup Basics',
    intro: 'The structure and accounts that make your business real and separate from you.',
    items: [
      { id: 'name_structure', label: 'Choose a business name and structure', detail: 'Pick a name you can use and a structure (such as an LLC) that fits your situation. Confirm details with official sources.' },
      { id: 'register_ein', label: 'Register the business and get an EIN', detail: 'Register with your state and get a federal EIN so you can bank, hire, and file taxes as a business.' },
      { id: 'bank', label: 'Open a separate business bank account', detail: 'Keep business money separate from personal money from day one.' },
    ],
  },
  {
    id: 'legal_tax_licensing',
    title: 'Legal / Tax / Licensing Disclaimer Routing',
    intro: 'Requirements vary by location and industry. Confirm yours with official sources — this is not advice.',
    items: [
      { id: 'official_sources', label: 'Confirm requirements with official sources', detail: 'Use official state and local agencies to confirm licensing, registration, tax, insurance, and permitting rules for your business and location.' },
      { id: 'professionals', label: 'Get professional help where it matters', detail: 'A qualified attorney, accountant, or insurance agent can confirm what applies to your specific situation.' },
      { id: 'insurance', label: 'Understand the insurance you may need', detail: 'Many businesses need liability and other coverage before they operate or sign contracts. Verify with a licensed agent.' },
    ],
  },
  {
    id: 'financial_readiness',
    title: 'Financial Readiness',
    intro: 'Know your numbers before money starts moving.',
    items: [
      { id: 'startup_costs', label: 'Estimate startup and monthly costs', detail: 'List what it costs to start and what it costs to run each month.' },
      { id: 'tax_set_aside', label: 'Set aside money for taxes', detail: 'Put a fixed share of income aside so taxes are not a surprise.' },
      { id: 'bookkeeping', label: 'Set up simple bookkeeping', detail: 'Track income and expenses from the start so you can see real profit.' },
    ],
  },
  {
    id: 'pricing_revenue',
    title: 'Pricing and Revenue Basics',
    intro: 'Price to cover real costs and a real profit, not just to match competitors.',
    items: [
      { id: 'true_cost', label: 'Know your true cost to deliver', detail: 'Include labor, materials, overhead, and your own time before you set a price.' },
      { id: 'margin', label: 'Build in a profit margin', detail: 'Decide the margin every sale should clear, and hold to it.' },
      { id: 'price_review', label: 'Review pricing on a schedule', detail: 'Revisit prices as your costs change.' },
    ],
  },
  {
    id: 'customer_acquisition',
    title: 'Customer Acquisition Basics',
    intro: 'A repeatable way to find and win customers beats luck.',
    items: [
      { id: 'channel', label: 'Pick one or two lead channels', detail: 'Choose where your customers actually look (for example online listings or referrals) and focus there.' },
      { id: 'follow_up', label: 'Follow up consistently', detail: 'Most sales happen after the first contact — keep a simple follow-up habit.' },
      { id: 'referrals', label: 'Ask for referrals and reviews', detail: 'Happy customers are your cheapest, highest-trust source of new work.' },
    ],
  },
  {
    id: 'operations_systems',
    title: 'Operations and Systems Basics',
    intro: 'Simple systems keep quality and cash flow steady as you get busier.',
    items: [
      { id: 'scheduling', label: 'Use one scheduling and job system', detail: 'A single place for jobs, appointments, and customer info prevents dropped work.' },
      { id: 'standardize', label: 'Standardize repeatable work', detail: 'A simple checklist keeps quality consistent.' },
      { id: 'invoicing', label: 'Invoice and get paid promptly', detail: 'Send invoices fast and make it easy for customers to pay.' },
    ],
  },
  {
    id: 'first_hire',
    title: 'First-Hire Readiness Basics',
    intro: 'Hire when the work and the cash flow are steady enough to support it.',
    items: [
      { id: 'when_to_hire', label: 'Know when a hire makes sense', detail: 'Consistent demand and the cash to cover the role come before the hire.' },
      { id: 'define_role', label: 'Write down the role', detail: 'Define what the person owns before you bring them on.' },
      { id: 'onboarding', label: 'Have a basic onboarding plan', detail: 'A short onboarding gets a new hire productive and protects your standards.' },
    ],
  },
  {
    id: 'vendor_tool',
    title: 'Vendor / Tool Readiness Basics',
    intro: 'Choose tools that fit your stage — not the most expensive option.',
    items: [
      { id: 'needs_first', label: 'Start from your real needs', detail: 'Pick tools that solve a problem you have now, not features you may never use.' },
      { id: 'track_tools', label: 'Track your tools and costs', detail: 'Keep one list of what you pay for, when it renews, and who manages it.' },
      { id: 'evaluate', label: 'Evaluate vendors on fit', detail: 'Compare on fit, price, and support. SubZeroMetrix™ does not endorse specific vendors.' },
    ],
  },
  {
    id: 'thirty_day_plan',
    title: '30-Day Startup Action Plan',
    intro: 'A simple first month to turn research into motion.',
    items: [
      { id: 'week1', label: 'Week 1 — Foundation', detail: 'Decide your name and structure, and confirm registration and licensing requirements with official sources.' },
      { id: 'week2', label: 'Week 2 — Money', detail: 'Open a business bank account, set up simple bookkeeping, and estimate startup and monthly costs.' },
      { id: 'week3', label: 'Week 3 — Offer and pricing', detail: 'Define what you sell, calculate your true cost, and set prices with a real margin.' },
      { id: 'week4', label: 'Week 4 — Customers and systems', detail: 'Pick a lead channel, set a follow-up habit, and put one scheduling and invoicing system in place.' },
    ],
  },
]

const ROUTING: GeneralBusinessRoutingRecommendation[] = [
  {
    audience: 'Contractors and tradespeople',
    recommendedPath: '/start',
    cta: 'Take the SubZeroMetrix™ assessment',
    note: 'The assessment and roadmap are built for your trade.',
  },
  {
    audience: 'Service-business owners',
    recommendedPath: '/start',
    cta: 'Take the SubZeroMetrix™ assessment',
    note: 'Service businesses are a core focus of the platform.',
  },
  {
    audience: 'Anyone wanting to understand readiness',
    recommendedPath: '/business-readiness',
    cta: 'Explore business readiness',
    note: 'Plain-language answers about what business readiness means.',
  },
  {
    audience: 'Other industries',
    recommendedPath: '/start',
    cta: 'Use the general readiness framework',
    note: 'SubZeroMetrix™ is currently strongest for contractors, trades, and service businesses; some recommendations may be less industry-specific.',
  },
]

export function getGeneralBusinessStarterSections(): GeneralBusinessStarterSection[] {
  return SECTIONS
}

export function getGeneralBusinessStarterChecklist(): GeneralBusinessStarterChecklistItem[] {
  return SECTIONS.flatMap(section => section.items)
}

export function getGeneralBusinessRoutingRecommendation(): GeneralBusinessRoutingRecommendation[] {
  return ROUTING
}

export function getGeneralBusinessStarterPackage(): GeneralBusinessStarterPackage {
  return {
    scopeNote: GENERAL_BUSINESS_SCOPE_NOTE,
    disclaimer: GENERAL_BUSINESS_DISCLAIMER,
    sections: SECTIONS,
    routing: ROUTING,
  }
}
