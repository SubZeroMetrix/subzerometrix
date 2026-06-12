// ─────────────────────────────────────────────────────────────────────────────
// publicResources — Growth-7: reusable public resource / tool page engine
// ─────────────────────────────────────────────────────────────────────────────
// A small, CURATED, typed dataset of high-quality public educational pages — NOT a
// programmatic mass-page generator. Each entry answers a distinct user intent, carries
// standalone educational value, an honest "what SubZeroMetrix™ supports" section, an
// educational disclaimer that routes to official sources, and natural conversion paths.
// The architecture is ready for future trade/state expansion (applicability fields), but
// we do NOT generate all trade × state combinations.
//
// GUARDRAILS baked in: no fabricated data, no fake reviews/backlinks, no doorway/thin
// pages (every entry has real content), no claim of equal support for every industry
// (SubZeroMetrix™ is strongest for contractors, tradespeople, and service businesses),
// and legal/tax/licensing content stays educational with official-source routing.
// ─────────────────────────────────────────────────────────────────────────────

export type ResourceAudience = 'contractors_trades' | 'service_business' | 'general'
export type ResourceContentType = 'guide' | 'checklist' | 'overview' | 'tool_explainer'
export type StructuredDataType = 'Article' | 'FAQPage' | 'HowTo' | 'CollectionPage'

export interface ResourceSection {
  heading: string
  body: string[]   // paragraphs
  bullets?: string[]
}

export interface ResourceFaq { q: string; a: string }
export interface ResourceLink { label: string; href: string }

// Normalized supported trade (mirrors intake TRADE_OPTIONS slugs).
export type SupportedTrade =
  | 'hvac' | 'electrical' | 'plumbing' | 'roofing' | 'construction'
  | 'handyman' | 'landscaping' | 'cleaning' | 'painting' | 'solar'

export interface PublicResource {
  slug: string                          // stable
  title: string                         // on-page H1
  metaTitle: string                     // <title>
  description: string                   // meta description + OG
  audience: ResourceAudience
  intent: string                        // primary user intent this page owns
  secondaryIntents?: string[]           // closely-related variants handled here
  contentType?: ResourceContentType
  tradeApplicability: 'all_trades' | string[]
  stateApplicability: 'all_states' | string[]
  supportedTrades?: SupportedTrade[] | 'all'   // future trade-specific expansion
  supportedStates?: string[] | 'all'           // future state-specific expansion
  updatedAt: string                     // lastReviewed
  indexable?: boolean                   // default true; false = noindex until complete
  published?: boolean                   // default true
  structuredDataType?: StructuredDataType
  intro: string[]
  sections: ResourceSection[]
  whatWeSupport: string[]               // honest current-capability bullets
  showSupportedTrades?: boolean         // render the reusable SupportedTrades callout
  disclaimer: string
  primaryCta: ResourceLink
  secondaryCtas: ResourceLink[]
  related: ResourceLink[]
  faq?: ResourceFaq[]
  keywords: string[]
}

// ── Supported trades (normalized) + one honest startup consideration each ───────
export interface TradeStartupNote {
  slug: SupportedTrade
  label: string
  consideration: string
}

export const SUPPORTED_TRADES: TradeStartupNote[] = [
  { slug: 'hvac', label: 'HVAC', consideration: 'Plan for refrigerant (EPA Section 608) certification, service agreements, dispatch, and stocked trucks.' },
  { slug: 'electrical', label: 'Electrical', consideration: 'Licensing and permits drive most work; plan estimating, service calls, and hiring licensed electricians.' },
  { slug: 'plumbing', label: 'Plumbing', consideration: 'Licensing, backflow work, emergency dispatch, and truck inventory shape day-one operations.' },
  { slug: 'roofing', label: 'Roofing', consideration: 'Insurance, bonding, estimating, and crew/subcontractor management matter before storm and project work.' },
  { slug: 'construction', label: 'General Contractor / Construction', consideration: 'License thresholds, bonding, contracts, subcontractor management, and cash-flow planning are core.' },
  { slug: 'handyman', label: 'Handyman / Home Repair', consideration: 'Know your scope-of-work limits, insurance, pricing, scheduling, and local review building.' },
  { slug: 'landscaping', label: 'Landscaping / Lawn Care', consideration: 'Equipment, routes, recurring service, seasonal cash flow, and any pesticide/applicator requirements.' },
  { slug: 'cleaning', label: 'Cleaning', consideration: 'Bonding/insurance, recurring clients, scheduling, hiring, and quality control for home or commercial work.' },
  { slug: 'painting', label: 'Painting', consideration: 'Estimating, crews, equipment, and lead-safe (EPA RRP) requirements for older homes.' },
  { slug: 'solar', label: 'Solar', consideration: 'Licensing, utility interconnection, permitting, sales, and installation-crew planning.' },
]

export function getSupportedTrades(): TradeStartupNote[] {
  return SUPPORTED_TRADES
}

const SHARED_DISCLAIMER =
  'SubZeroMetrix™ is an educational business-readiness platform from The Modern Trades Mentor LLC. ' +
  'This page is general education — not legal, tax, financial, or licensing advice. Verify requirements ' +
  'with official state and local sources. SubZeroMetrix™ is strongest for contractors, tradespeople, and ' +
  'service businesses; it is not tailored equally to every industry.'

const PUBLIC_RESOURCES: PublicResource[] = [
  {
    slug: 'starting-a-contractor-business',
    title: 'Starting a Contractor Business: A Practical Field Guide',
    metaTitle: 'Starting a Contractor Business — Practical Steps',
    description: 'A practical, field-tested overview of what it takes to start a contractor or trades business: identity, legal setup, licensing, money, and getting your first jobs.',
    audience: 'contractors_trades',
    intent: 'How do I start a contractor or trades business?',
    tradeApplicability: 'all_trades',
    stateApplicability: 'all_states',
    updatedAt: '2026-06-12',
    intro: [
      'Starting a contractor business is less about a perfect plan and more about doing the right setup steps in the right order. This guide walks the foundation most trades businesses need before taking on real work.',
    ],
    sections: [
      {
        heading: '1. Lock in your business identity',
        body: ['Pick a clear, available name and reuse it everywhere — domain, email, and branding. A consistent identity makes a new business look established and earns trust faster.'],
      },
      {
        heading: '2. Handle the legal and tax basics',
        body: ['Choose a business structure, register it, get your EIN, and confirm state and local tax registrations. These are gatekeepers for banking and legal operation.'],
        bullets: ['Form your entity with your state', 'Get an EIN', 'Confirm sales-tax and registration requirements with official sources'],
      },
      {
        heading: '3. Confirm licensing and insurance',
        body: ['Most trades require specific licenses, certifications, and insurance. Requirements vary by trade and state, so verify them with the official licensing authority before you bid work.'],
      },
      {
        heading: '4. Set up money and operations',
        body: ['Open a business bank account, start simple bookkeeping, build estimate and invoice templates, and decide how you will schedule jobs and follow up with customers.'],
      },
      {
        heading: '5. Get ready to win your first jobs',
        body: ['Set clear pricing, claim your Google Business Profile, and create a simple follow-up process. Most jobs are won in the follow-up, not the first call.'],
      },
    ],
    whatWeSupport: [
      'A free Starter assessment that produces a Starter MetrixScore™ across readiness categories',
      'A Guided Business Foundation Builder checklist that tracks these setup steps',
      'A roadmap of recommended next actions tied to your answers',
      'Curated links to official resources for licensing, tax, and registration',
    ],
    disclaimer: SHARED_DISCLAIMER,
    primaryCta: { label: 'Check your business readiness (free)', href: '/start' },
    secondaryCtas: [
      { label: 'Open the Foundation Builder', href: '/foundation-builder' },
      { label: 'Browse contractor resources', href: '/resources' },
    ],
    related: [
      { label: 'Contractor business readiness', href: '/business-readiness' },
      { label: 'General business starter', href: '/general-business-starter' },
    ],
    faq: [
      { q: 'Do I need a license to start a contractor business?', a: 'It depends on your trade and state. Many trades require a license, certifications, and insurance. Verify the exact requirements with your official state and local licensing authority before taking on work.' },
      { q: 'What should I set up first?', a: 'Start with your business identity (name, domain, email), then your legal/entity and EIN, then licensing and insurance, then banking and basic bookkeeping.' },
    ],
    keywords: ['starting a contractor business', 'how to start a trades business', 'contractor startup steps'],
  },
  {
    slug: 'contractor-startup-checklist',
    title: 'The Contractor Startup Checklist',
    metaTitle: 'Contractor Startup Checklist — What to Set Up',
    description: 'A clear, category-by-category checklist of what a new contractor or service business needs to set up: identity, legal, tax, banking, licensing, brand, operations, and launch.',
    audience: 'contractors_trades',
    intent: 'What do I need to set up to launch my contracting business?',
    tradeApplicability: 'all_trades',
    stateApplicability: 'all_states',
    updatedAt: '2026-06-12',
    intro: [
      'Use this checklist to see the foundation a trades business needs before launch. It mirrors the categories inside the SubZeroMetrix™ Foundation Builder, where you can track each step.',
    ],
    sections: [
      { heading: 'Identity & digital', body: ['Business name, logo and colors, domain, professional email, and email deliverability.'] },
      { heading: 'Legal & financial', body: ['Entity formation, EIN, tax and state registrations, business bank account, bookkeeping, licensing, and insurance — verified with official sources.'] },
      { heading: 'Brand & presence', body: ['Core brand profiles and a verified Google Business Profile so local customers can find you.'] },
      { heading: 'Operations & sales', body: ['Estimate and invoice templates, a pricing menu, a lead follow-up process, your core tools, and basic account security (password manager + 2FA).'] },
      { heading: 'Launch & review', body: ['A launch checklist, a test customer run-through, and a weekly review rhythm to turn readiness into momentum.'] },
    ],
    whatWeSupport: [
      'A trackable, in-platform Foundation Builder with every category above',
      'Stage tracking (Start here, Do this next, Later, Done, Blocked) and notes',
      'Trade-specific licensing/insurance steps and state official-resource starting points',
      'CSV / print export of your own progress',
    ],
    disclaimer: SHARED_DISCLAIMER,
    primaryCta: { label: 'Open the Foundation Builder', href: '/foundation-builder' },
    secondaryCtas: [
      { label: 'Check your readiness (free)', href: '/start' },
      { label: 'Contractor resources', href: '/resources' },
    ],
    related: [
      { label: 'Starting a contractor business', href: '/learn/starting-a-contractor-business' },
      { label: 'What is the MetrixScore™?', href: '/learn/metrixscore-overview' },
    ],
    keywords: ['contractor startup checklist', 'new business checklist', 'trades business setup'],
  },
  {
    slug: 'metrixscore-overview',
    title: 'What Is the MetrixScore™?',
    metaTitle: 'MetrixScore™ — Business Readiness Score Explained',
    description: 'An educational overview of the SubZeroMetrix™ MetrixScore™: what it measures, how the readiness categories work, and how to use it to improve your contracting business.',
    audience: 'contractors_trades',
    intent: 'What is the MetrixScore™ and how does it work?',
    tradeApplicability: 'all_trades',
    stateApplicability: 'all_states',
    updatedAt: '2026-06-12',
    intro: [
      'The MetrixScore™ is an educational business-readiness score for contractors, tradespeople, and service businesses. It turns a short assessment into a clear picture of where your business stands across the areas that matter most.',
    ],
    sections: [
      { heading: 'What it measures', body: ['The MetrixScore™ looks at readiness across categories like foundation, operations, sales, and financial basics — the things that make a trades business stable and ready to grow.'] },
      { heading: 'How to read it', body: ['Your Starter MetrixScore™ is a starting point, not a grade. It highlights strengths to build on and risks to address, and it powers a roadmap of recommended next actions.'] },
      { heading: 'How to improve it', body: ['Work your roadmap, track your foundation setup, and reassess over time. The score is designed to move as you complete real-world setup and operations steps.'] },
    ],
    whatWeSupport: [
      'A free Starter assessment that produces your Starter MetrixScore™',
      'A category breakdown with strengths and risks',
      'A roadmap of recommended next actions',
      'Progress tracking and reassessment over time',
    ],
    disclaimer: SHARED_DISCLAIMER + ' The MetrixScore™ is a business-readiness measure and is not a credit score or any consumer credit measure.',
    primaryCta: { label: 'Get your free Starter MetrixScore™', href: '/start' },
    secondaryCtas: [
      { label: 'Open the Foundation Builder', href: '/foundation-builder' },
      { label: 'Learn about readiness', href: '/business-readiness' },
    ],
    related: [
      { label: 'Contractor startup checklist', href: '/learn/contractor-startup-checklist' },
      { label: 'Foundation Builder guide', href: '/learn/foundation-builder-guide' },
    ],
    faq: [
      { q: 'Is the MetrixScore™ a credit score?', a: 'No. The MetrixScore™ is an educational business-readiness measure for trades and service businesses. It is not a credit score or any consumer credit measure.' },
      { q: 'Is the assessment free?', a: 'Yes — the Starter assessment and your Starter MetrixScore™ are free.' },
    ],
    keywords: ['metrixscore', 'business readiness score', 'contractor readiness'],
  },
  {
    slug: 'foundation-builder-guide',
    title: 'The Business Foundation Builder: A Guided Setup System',
    metaTitle: 'Business Foundation Builder — Guided Setup',
    description: 'A preview of the SubZeroMetrix™ Guided Business Foundation Builder: a trackable, step-by-step checklist for setting up a contractor or service business the right way.',
    audience: 'contractors_trades',
    intent: 'How can I track setting up my business step by step?',
    tradeApplicability: 'all_trades',
    stateApplicability: 'all_states',
    updatedAt: '2026-06-12',
    intro: [
      'The Guided Business Foundation Builder turns business setup from a pile of advice into a tracked execution system. You see each step, why it matters, and move it across simple stages as you go.',
    ],
    sections: [
      { heading: 'Step-by-step, not a wall of text', body: ['The Builder organizes setup into sections, categories, and concrete steps — each with why it matters and what "done" looks like.'] },
      { heading: 'Track real progress', body: ['Move each step across Start here, Do this next, Later, Done, or Blocked, add your own notes, and watch your completion and next recommended step update.'] },
      { heading: 'Trade and state aware', body: ['Trade-specific licensing/insurance steps and official state resource starting points appear where relevant — always pointing you to official sources to verify.'] },
      { heading: 'Yours to keep', body: ['Your progress is saved on your device, can back up to your account when signed in, and exports to CSV or print at any time.'] },
    ],
    whatWeSupport: [
      'A live, in-platform Foundation Builder checklist',
      'Stage tracking, notes, completion stats, and next-step guidance',
      'Trade-specific steps and state official-resource routing',
      'Device-local-first with optional account backup and export',
    ],
    disclaimer: SHARED_DISCLAIMER,
    primaryCta: { label: 'Open the Foundation Builder', href: '/foundation-builder' },
    secondaryCtas: [
      { label: 'Check your readiness (free)', href: '/start' },
      { label: 'Startup checklist', href: '/learn/contractor-startup-checklist' },
    ],
    related: [
      { label: 'Starting a contractor business', href: '/learn/starting-a-contractor-business' },
      { label: 'What is the MetrixScore™?', href: '/learn/metrixscore-overview' },
    ],
    keywords: ['business foundation builder', 'contractor setup checklist', 'business setup tracker'],
  },
  {
    slug: 'start-a-trade-business',
    title: 'From Technician to Owner: Starting a Trade Business',
    metaTitle: 'How to Start a Trade Business — Technician to Owner',
    description: 'For skilled tradespeople going out on their own: the difference between trade skill and business readiness, and the foundation a trade business needs to launch.',
    audience: 'contractors_trades',
    intent: 'How do I start a trade business / go from technician to owner?',
    secondaryIntents: ['how to become self-employed in the trades', 'how to go from technician to business owner', 'starting a business with trade experience'],
    contentType: 'guide',
    tradeApplicability: 'all_trades',
    stateApplicability: 'all_states',
    supportedTrades: 'all',
    supportedStates: 'all',
    updatedAt: '2026-06-12',
    indexable: true,
    published: true,
    structuredDataType: 'Article',
    intro: [
      'Being great in the field is not the same as being ready to run the business. This guide is for skilled tradespeople making the jump from technician to owner — what changes, and what foundation you need first.',
    ],
    sections: [
      { heading: 'Trade skill vs. business readiness', body: ['Your trade gets you the work; your business systems keep you paid, legal, and growing. The gap between the two is where most new owners struggle — and where readiness work pays off.'] },
      { heading: 'Pick your lane', body: ['SubZeroMetrix™ is built for the trades. Supported trades include HVAC, electrical, plumbing, roofing, construction, handyman, landscaping, cleaning, painting, and solar — each with its own licensing and operating realities.'] },
      { heading: 'The foundation sequence', body: ['Set up identity, then legal/entity and EIN, then licensing and insurance (verified with official sources), then banking and bookkeeping, then pricing and operations, then launch.'] },
      { heading: 'Know when to leave your job', body: ['Readiness — not just confidence — tells you when to go full-time. A clear picture of your gaps and a funded runway beats a gut call.'] },
    ],
    whatWeSupport: [
      'A free Starter assessment + Starter MetrixScore™ tuned for the trades',
      'A roadmap of recommended next actions for your situation',
      'A Foundation Builder with trade-specific steps and official-resource routing',
    ],
    disclaimer: SHARED_DISCLAIMER,
    showSupportedTrades: true,
    primaryCta: { label: 'Check your business readiness (free)', href: '/start' },
    secondaryCtas: [
      { label: 'See supported trades', href: '/trades' },
      { label: 'Open the Foundation Builder', href: '/foundation-builder' },
    ],
    related: [
      { label: 'Starting a contractor business', href: '/learn/starting-a-contractor-business' },
      { label: 'Am I ready? Contractor readiness', href: '/learn/contractor-business-readiness' },
    ],
    keywords: ['how to start a trade business', 'technician to owner', 'self-employed in the trades'],
  },
  {
    slug: 'start-a-home-service-business',
    title: 'Starting a Home-Service Business',
    metaTitle: 'How to Start a Home-Service Business',
    description: 'A practical guide to starting a home-service or local-service business: service area, demand, scheduling and dispatch, customer communication, reviews, and recurring work.',
    audience: 'service_business',
    intent: 'How do I start a home-service / local-service business?',
    secondaryIntents: ['how to start a local business', 'how to start a field-service business', 'how to start a service business'],
    contentType: 'guide',
    tradeApplicability: 'all_trades',
    stateApplicability: 'all_states',
    supportedTrades: 'all',
    supportedStates: 'all',
    updatedAt: '2026-06-12',
    indexable: true,
    published: true,
    structuredDataType: 'Article',
    intro: [
      'Home-service and local-service businesses live or die on service area, responsiveness, and reputation. This guide covers the operating foundation a field-service business needs to launch and grow.',
    ],
    sections: [
      { heading: 'Service area and demand', body: ['Define where you will work and confirm there is steady local demand before you scale spend. A tight, well-served area beats a wide, thin one.'] },
      { heading: 'Scheduling, dispatch, and communication', body: ['Decide how jobs get booked, scheduled, and confirmed. Reliable, fast communication is what earns repeat work and referrals.'] },
      { heading: 'Reviews and recurring work', body: ['Build a simple, consent-first review process and look for recurring or maintenance-style services that smooth out cash flow.'] },
      { heading: 'Field operations', body: ['Standardize estimates, invoices, and follow-up so quality stays consistent as you add jobs and people.'] },
    ],
    whatWeSupport: [
      'Readiness scoring and a roadmap tuned for contractors, trades, and home-service businesses',
      'A Foundation Builder covering operations, sales, and launch setup',
      'Honest scope: SubZeroMetrix™ is strongest for trade and field-service work, not every industry',
    ],
    disclaimer: SHARED_DISCLAIMER,
    showSupportedTrades: true,
    primaryCta: { label: 'Check your business readiness (free)', href: '/start' },
    secondaryCtas: [
      { label: 'See supported trades', href: '/trades' },
      { label: 'Contractor resources', href: '/resources' },
    ],
    related: [
      { label: 'Starting a contractor business', href: '/learn/starting-a-contractor-business' },
      { label: 'Contractor startup checklist', href: '/learn/contractor-startup-checklist' },
    ],
    keywords: ['how to start a home-service business', 'local service business', 'field service startup'],
  },
  {
    slug: 'contractor-business-readiness',
    title: 'Am I Ready to Start a Contractor Business?',
    metaTitle: 'Contractor Business Readiness — Am I Ready?',
    description: 'Understand contractor business readiness: the categories that matter, common gaps and risks, what the MetrixScore™ measures, and how to find what your business may be missing.',
    audience: 'contractors_trades',
    intent: 'Am I ready to start a contractor business?',
    secondaryIntents: ['contractor business readiness assessment', 'what am I missing before launching', 'business owner readiness'],
    contentType: 'overview',
    tradeApplicability: 'all_trades',
    stateApplicability: 'all_states',
    supportedTrades: 'all',
    supportedStates: 'all',
    updatedAt: '2026-06-12',
    indexable: true,
    published: true,
    structuredDataType: 'FAQPage',
    intro: [
      'Readiness is more than confidence. It is a clear-eyed look at the parts of your business that need to be in place before — and shortly after — you launch. This page explains how to think about it.',
    ],
    sections: [
      { heading: 'Readiness categories', body: ['Foundation, operations, sales/pricing, and financial basics are the areas that most determine whether a new trades business stays stable and gets paid.'] },
      { heading: 'Common gaps and risks', body: ['Unclear pricing, no follow-up process, missing licensing/insurance verification, and thin cash reserves are the gaps that sink otherwise-skilled operators.'] },
      { heading: 'What the MetrixScore™ measures', body: ['The Starter MetrixScore™ turns a short assessment into a readiness picture across those categories — strengths to build on and risks to address — and powers a roadmap of next actions.'] },
    ],
    whatWeSupport: [
      'A free Starter assessment that produces your Starter MetrixScore™',
      'A category breakdown of strengths and risks',
      'A roadmap and Foundation Builder to close the gaps over time',
    ],
    disclaimer: SHARED_DISCLAIMER + ' The MetrixScore™ is an educational business-readiness measure — not a credit score, lending, underwriting, or any guarantee of approval or success.',
    primaryCta: { label: 'See what your business may be missing', href: '/start' },
    secondaryCtas: [
      { label: 'What is the MetrixScore™?', href: '/learn/metrixscore-overview' },
      { label: 'Business readiness', href: '/business-readiness' },
    ],
    related: [
      { label: 'Contractor startup checklist', href: '/learn/contractor-startup-checklist' },
      { label: 'Foundation Builder guide', href: '/learn/foundation-builder-guide' },
    ],
    faq: [
      { q: 'How do I know if I am ready to start a contractor business?', a: 'Look at readiness across foundation, operations, sales/pricing, and finances — not just trade skill. A free Starter assessment gives you a MetrixScore™ and highlights your specific gaps.' },
      { q: 'Is the readiness score a guarantee of success?', a: 'No. It is educational business-readiness guidance. It is not a credit score, lending, underwriting, or any guarantee of approval, revenue, or success.' },
    ],
    keywords: ['contractor business readiness', 'am I ready to start a contractor business', 'business readiness assessment'],
  },
]

/** Published resources only (published !== false). */
export function getPublicResources(): PublicResource[] {
  return PUBLIC_RESOURCES.filter(r => r.published !== false)
}

/** Slugs of published resources only — drives generateStaticParams + sitemap. */
export function getPublicResourceSlugs(): string[] {
  return getPublicResources().map(r => r.slug)
}

/** A single published resource by slug, or null. */
export function getPublicResource(slug: string): PublicResource | null {
  const found = PUBLIC_RESOURCES.find(r => r.slug === slug)
  return found && found.published !== false ? found : null
}

/** True when the resource should be indexed (complete + indexable !== false). */
export function isResourceIndexable(resource: PublicResource): boolean {
  return resource.indexable !== false && resource.published !== false
}
