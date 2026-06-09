// ─────────────────────────────────────────────────────────────────────────────
// SubZeroMetrix — Needs-First Roadmap Engine
//
// DESIGN PRINCIPLE: Education before monetization.
// Every recommendation explains what, why, cost range, DIY option, and
// common mistakes BEFORE showing any vendor.
//
// Affiliate options appear last, clearly marked, never ranked by commission.
// ─────────────────────────────────────────────────────────────────────────────

import type { ScoreResult } from '@/lib/scoring'

export type BudgetRange = 'bootstrap' | 'lean' | 'moderate' | 'invested'
// bootstrap = under $2K  |  lean = $2K–$10K  |  moderate = $10K–$25K  |  invested = $25K+

export type UrgencyLevel = 'must-do-now' | 'important-soon' | 'optional-later' | 'skip-for-now'

export type PhaseId =
  | 'legal-foundation'
  | 'financial-setup'
  | 'insurance-protection'
  | 'operations-systems'
  | 'sales-marketing'
  | 'hiring-scaling'

export interface VendorRecommendation {
  name: string
  url: string           // base URL — affiliate params added at render time via affiliateUrl()
  affiliateId: string | null   // matches AFFILIATE_PARTNERS[].id, null = non-affiliate
  isFree: boolean
  priceRange: string    // "Free" | "$0 + state fees" | "$15–$50/mo" etc.
  bestFor: string       // one honest sentence about who this fits
  notFor: string        // one honest sentence about who should skip it
}

export interface RoadmapItem {
  id: string
  phase: PhaseId
  urgency: UrgencyLevel
  title: string

  // Education block — comes BEFORE any vendor mention
  whyItMatters: string          // the business consequence of skipping this
  whatToLookFor: string         // what a good solution looks like
  commonMistakes: string[]      // 2–4 real mistakes contractors make here
  estimatedCostRange: string    // honest cost range including free option if exists

  // DIY path — always shown first
  diyOption: {
    title: string
    description: string
    resources: { label: string; url: string }[]
  }

  // Vendor options — shown AFTER education, sorted by fit (not commission)
  vendorOptions: VendorRecommendation[]

  // Context
  stateLinked: boolean
  tradesRelevance: string[]     // empty = all trades
  minBudgetRequired: BudgetRange
  scoreGapTriggers: string[]    // which answer IDs or score areas trigger this step
}

export interface RoadmapPhase {
  id: PhaseId
  title: string
  subtitle: string
  items: RoadmapItem[]
}

// ── Budget mapper ─────────────────────────────────────────────────────────────
export function mapBudget(financialAnswer: string): BudgetRange {
  switch (financialAnswer) {
    case 'under_2k':     return 'bootstrap'
    case 'k2_10':        return 'lean'
    case 'k10_25':       return 'moderate'
    case 'over_25k':     return 'invested'
    default:             return 'bootstrap'
  }
}

// ── Master roadmap item library ───────────────────────────────────────────────
// Each item is defined once here. The engine selects and orders them per user.
const ROADMAP_LIBRARY: RoadmapItem[] = [

  // ── PHASE 1: Legal Foundation ────────────────────────────────────────────
  {
    id: 'ein',
    phase: 'legal-foundation',
    urgency: 'must-do-now',
    title: 'Get your Employer Identification Number (EIN)',
    whyItMatters: 'Your EIN is your business\'s tax ID — required to open a business bank account, hire employees, file business taxes separately from personal taxes, and establish your business identity with the IRS. It takes about 10 minutes online and costs nothing.',
    whatToLookFor: 'Apply directly at IRS.gov. Avoid any third-party site that charges a fee — there is no legitimate reason to pay for an EIN.',
    commonMistakes: [
      'Paying a third-party service $50–$200 for something that\'s free directly from the IRS',
      'Using your personal Social Security Number for business purposes after you\'ve launched',
      'Confusing EIN with a state tax ID (you may need both)',
    ],
    estimatedCostRange: 'Free — apply directly at IRS.gov',
    diyOption: {
      title: 'Apply directly at IRS.gov (free, 10 minutes)',
      description: 'Use the IRS online EIN application during business hours. You\'ll get your EIN immediately. Have your business name, address, and business structure ready.',
      resources: [
        { label: 'IRS EIN Application (free)', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online' },
        { label: 'SBA: Why you need an EIN', url: 'https://www.sba.gov/business-guide/launch-your-business/get-federal-state-tax-id-numbers' },
      ],
    },
    vendorOptions: [],
    stateLinked: false,
    tradesRelevance: [],
    minBudgetRequired: 'bootstrap',
    scoreGapTriggers: ['none_yet', 'setup_steps'],
  },

  {
    id: 'entity',
    phase: 'legal-foundation',
    urgency: 'must-do-now',
    title: 'Register your business entity',
    whyItMatters: 'Operating without a registered business entity (LLC or corporation) means your personal assets — your home, savings, vehicle, and future wages — are legally exposed if someone sues you, a job goes wrong, or a customer claims damages. For a trades business where accidents happen on job sites, this is not optional. An LLC creates a legal wall between you and your business.',
    whatToLookFor: 'For most solo or small trade contractors, a single-member LLC is the right starting structure. You want limited liability protection without the complexity of a corporation. File in your home state unless you have a specific reason to file elsewhere.',
    commonMistakes: [
      'Filing in Delaware or Wyoming thinking it saves money — usually wrong for a local service business',
      'Paying premium for features (Registered Agent bundled, compliance reminders) you don\'t need yet at launch',
      'Not actually separating finances after forming the LLC, which can void your liability protection',
      'Skipping annual report filings, which causes your LLC to lapse',
    ],
    estimatedCostRange: '$0 + state fees ($50–$500 depending on state). State fees: TX $300, FL $125, CO $50, AZ $50, NC $125, OH $99',
    diyOption: {
      title: 'File directly with your state Secretary of State',
      description: 'Most states let you file online in under 30 minutes. You\'ll need a business name, a registered agent address (can be your own), and the filing fee.',
      resources: [
        { label: 'TX SOS — Business filing', url: 'https://www.sos.state.tx.us/corp/businessstructure.shtml' },
        { label: 'FL Division of Corporations (Sunbiz)', url: 'https://dos.fl.gov/sunbiz/start-business/' },
        { label: 'CO SOS — Business filing', url: 'https://www.sos.state.co.us/pubs/business/businessHome.html' },
        { label: 'AZ Corporation Commission', url: 'https://azcc.gov/corporations/forms-fees' },
        { label: 'NC SOS — Business registration', url: 'https://www.sosnc.gov/online_services/business_registration' },
        { label: 'OH SOS — Business filing', url: 'https://www.ohiosos.gov/businesses/information-for-businesses/' },
      ],
    },
    vendorOptions: [
      {
        name: 'ZenBusiness',
        url: 'https://www.zenbusiness.com',
        affiliateId: 'zenbusiness',
        isFree: true,
        priceRange: '$0 + state fees (free starter plan)',
        bestFor: 'Contractors who want a guided filing process and a compliance reminder dashboard without doing it fully manually.',
        notFor: 'Anyone on the tightest possible budget who is comfortable filing on the state website directly — the DIY path is genuinely free.',
      },
    ],
    stateLinked: true,
    tradesRelevance: [],
    minBudgetRequired: 'bootstrap',
    scoreGapTriggers: ['none_yet', 'entity_reg'],
  },

  {
    id: 'license',
    phase: 'legal-foundation',
    urgency: 'must-do-now',
    title: 'Verify and obtain your trade license',
    whyItMatters: 'Most trades — HVAC, electrical, plumbing, roofing, general contracting — require a state or local license to operate legally. Working without the correct license means: your contracts may not be enforceable, your insurance may be voided on unlicensed work, you can face fines or criminal charges, and you can\'t legally bid commercial jobs.',
    whatToLookFor: 'Requirements vary by trade, state, and often by city or county. Look up your specific trade and location. Some trades require both a state license and a local business license. Bonding is separate from licensing — check both.',
    commonMistakes: [
      'Assuming a license in one county covers the whole state — it often doesn\'t',
      'Pulling permits under someone else\'s license — this is illegal and puts both parties at risk',
      'Skipping the exam prep and failing, which delays revenue and wastes fees',
      'Confusing a business license (city/county registration) with a trade license (state credential)',
    ],
    estimatedCostRange: 'Exam fees $50–$300 + license fee $50–$500. Some states have annual renewal fees.',
    diyOption: {
      title: 'Look up requirements directly on your state licensing board',
      description: 'Every state has a licensing board for each trade. Start there to understand the exam, experience requirements, and fees. Many offer study materials.',
      resources: [
        { label: 'TX TDLR — HVAC, plumbing, electrical', url: 'https://www.tdlr.texas.gov/' },
        { label: 'FL DBPR — Contractor licensing', url: 'https://www.myfloridalicense.com/intentions2.asp?chBoard=true&boardid=42' },
        { label: 'CO DORA — Trades licensing', url: 'https://dora.colorado.gov/professions-occupations' },
        { label: 'AZ Registrar of Contractors', url: 'https://roc.az.gov/' },
        { label: 'NC Licensing Board for Contractors', url: 'https://www.nclbgc.org/' },
        { label: 'OH Construction Industry Licensing Board', url: 'https://com.ohio.gov/divisions-and-programs/industrial-compliance/boards-and-commissions/ohio-construction-industry-licensing-board' },
      ],
    },
    vendorOptions: [],
    stateLinked: true,
    tradesRelevance: ['hvac', 'electrical', 'plumbing', 'roofing', 'construction', 'solar'],
    minBudgetRequired: 'bootstrap',
    scoreGapTriggers: ['none_yet', 'license_res'],
  },

  // ── PHASE 2: Financial Setup ──────────────────────────────────────────────
  {
    id: 'bank',
    phase: 'financial-setup',
    urgency: 'must-do-now',
    title: 'Open a dedicated business bank account',
    whyItMatters: 'Mixing personal and business money is the #1 accounting mistake small contractors make. It destroys your LLC liability protection (called "piercing the corporate veil"), makes taxes a nightmare, hides whether you\'re actually profitable, and makes it nearly impossible to get a business loan because you can\'t show clean business income.',
    whatToLookFor: 'A no-fee or low-fee business checking account with a debit card and easy online access. You don\'t need fancy features at launch — just separation. Your EIN must be in place first.',
    commonMistakes: [
      'Using a personal Chase or Wells Fargo account and just keeping mental notes',
      'Opening a business account at a big bank with $25/month fees you don\'t need yet',
      'Not moving all business income and expenses to the account consistently from day one',
    ],
    estimatedCostRange: 'Free options exist. Typical range: $0–$25/month',
    diyOption: {
      title: 'Open a free account directly online — takes 10 minutes',
      description: 'Most business banking is done online now. You\'ll need your EIN, business name, and state registration documents. Many accounts open same-day with no minimums.',
      resources: [
        { label: 'FDIC: Choosing a business bank', url: 'https://www.fdic.gov/resources/consumers/money-smart/teach-money-smart/money-smart-for-small-business.html' },
      ],
    },
    vendorOptions: [
      {
        name: 'Relay Business Banking',
        url: 'https://relayfi.com',
        affiliateId: 'relay',
        isFree: true,
        priceRange: 'Free — no monthly fees, no minimums',
        bestFor: 'Contractors who want multiple subaccounts (great for Profit First budgeting) and a clean interface for tracking job-by-job deposits.',
        notFor: 'Contractors who need in-person cash deposits — Relay is online-only.',
      },
    ],
    stateLinked: false,
    tradesRelevance: [],
    minBudgetRequired: 'bootstrap',
    scoreGapTriggers: ['none_yet', 'bank'],
  },

  {
    id: 'bookkeeping',
    phase: 'financial-setup',
    urgency: 'important-soon',
    title: 'Set up basic bookkeeping',
    whyItMatters: 'You cannot run a profitable business if you don\'t know what you\'re spending and earning. Most contractors who go under don\'t realize they\'re losing money until it\'s too late. Basic bookkeeping tells you your real profit margin per job, your tax liability, and whether you can afford that new tool or truck.',
    whatToLookFor: 'At launch, you need income and expense tracking, invoicing, and a way to categorize spending. You don\'t need a full accounting suite. Keep it simple so you actually use it.',
    commonMistakes: [
      'Paying for QuickBooks at $50+/month before you have consistent revenue',
      'Using a spreadsheet with no categories and then scrambling at tax time',
      'Not reconciling your bank account monthly — errors compound fast',
      'Skipping bookkeeping entirely and paying a CPA to sort it out retroactively (expensive)',
    ],
    estimatedCostRange: 'Free (Wave) to $15–$50/month (FreshBooks, QuickBooks Simple Start)',
    diyOption: {
      title: 'Start with Wave Accounting — free, web-based, built for small businesses',
      description: 'Wave is genuinely free (not a trial). It handles income tracking, expense categorization, invoicing, and basic reports. It\'s enough for most solo and small crew operations in the first 1–2 years.',
      resources: [
        { label: 'Wave Accounting (free)', url: 'https://www.waveapps.com' },
        { label: 'SBA: Small business bookkeeping basics', url: 'https://www.sba.gov/business-guide/manage-your-business/manage-your-finances' },
      ],
    },
    vendorOptions: [
      {
        name: 'Wave Accounting',
        url: 'https://www.waveapps.com',
        affiliateId: 'wave',
        isFree: true,
        priceRange: 'Free',
        bestFor: 'Early-stage contractors who need invoicing and expense tracking without a monthly bill.',
        notFor: 'Contractors billing more than $150K/year who need job costing, time tracking, or payroll features.',
      },
      {
        name: 'FreshBooks',
        url: 'https://www.freshbooks.com',
        affiliateId: 'freshbooks',
        isFree: false,
        priceRange: '$17–$55/month',
        bestFor: 'Contractors who need professional invoicing, project tracking, and a client portal.',
        notFor: 'Anyone not yet generating regular invoices — start free and upgrade when you need it.',
      },
      {
        name: 'QuickBooks',
        url: 'https://quickbooks.intuit.com/small-business',
        affiliateId: 'quickbooks',
        isFree: false,
        priceRange: '$30–$60/month',
        bestFor: 'Contractors scaling past $200K/year who need job costing, payroll integration, and CPA-friendly reporting.',
        notFor: 'New businesses — overkill until you have consistent revenue and a bookkeeper reviewing it.',
      },
    ],
    stateLinked: false,
    tradesRelevance: [],
    minBudgetRequired: 'bootstrap',
    scoreGapTriggers: ['financial'],
  },

  {
    id: 'pricing',
    phase: 'financial-setup',
    urgency: 'must-do-now',
    title: 'Build a real job pricing model',
    whyItMatters: 'Pricing by gut feel is the most common reason trades businesses quietly go broke. You may be busy and still losing money on every job. A real pricing model accounts for labor (including your own time), materials with markup, overhead, drive time, callbacks, and a profit margin. Without it, every estimate is a guess.',
    whatToLookFor: 'A simple spreadsheet that calculates your minimum price per hour or per job type. It doesn\'t need to be software — it needs to be accurate. Once you have it, every estimate takes 5 minutes instead of guessing.',
    commonMistakes: [
      'Pricing to match a competitor without knowing their cost structure',
      'Forgetting overhead — vehicle, insurance, tools, phone, gas add up to 20–40% of revenue',
      'Not including your own labor at a fair hourly rate',
      'Discounting frequently because you\'re afraid to lose the job — trains customers to negotiate',
    ],
    estimatedCostRange: 'Free — this is a spreadsheet exercise, not software',
    diyOption: {
      title: 'Build a cost-per-job calculator in a spreadsheet',
      description: 'List your fixed monthly costs (insurance, vehicle, phone, tools). Divide by billable hours per month. Add your labor rate. Add materials + markup. That\'s your minimum price. Add profit margin on top.',
      resources: [
        { label: 'SCORE: How to price your services', url: 'https://www.score.org/resource/article/how-price-your-services' },
        { label: 'SBA: Understand your costs', url: 'https://www.sba.gov/business-guide/manage-your-business/manage-your-finances' },
      ],
    },
    vendorOptions: [],
    stateLinked: false,
    tradesRelevance: [],
    minBudgetRequired: 'bootstrap',
    scoreGapTriggers: ['pricing', 'financial'],
  },

  // ── PHASE 3: Insurance & Risk ─────────────────────────────────────────────
  {
    id: 'insurance-gl',
    phase: 'insurance-protection',
    urgency: 'must-do-now',
    title: 'Get general liability insurance',
    whyItMatters: 'General liability (GL) insurance covers property damage and bodily injury claims arising from your work. Without it: one cracked pipe, one electrical fire, one injury on a customer\'s property and you\'re personally liable for everything. Most commercial clients won\'t let you on-site without a certificate of insurance. Many residential clients are starting to require it too.',
    whatToLookFor: 'A minimum of $1M per occurrence / $2M aggregate for most trade work. Make sure the policy covers your specific trade — HVAC, plumbing, and electrical require specific endorsements. Check if completed operations coverage is included (covers claims after the job is done).',
    commonMistakes: [
      'Getting a general business policy that excludes your specific trade work',
      'Buying the cheapest policy without reading what\'s excluded',
      'Not getting certificates of insurance — you\'ll need them for most commercial jobs',
      'Letting the policy lapse and continuing to work — any claims in that window are uncovered',
    ],
    estimatedCostRange: '$500–$3,000/year depending on trade, revenue, and state. HVAC and electrical typically higher.',
    diyOption: {
      title: 'Get quotes directly and compare — not a DIY product but you control the process',
      description: 'You can call a local independent insurance agent who represents multiple carriers, or use online comparison tools. Don\'t use your state\'s assigned risk pool unless you\'ve been declined elsewhere — rates are high.',
      resources: [
        { label: 'TX Department of Insurance', url: 'https://www.tdi.texas.gov/consumer/insurance-basics.html' },
        { label: 'FL Division of Financial Services', url: 'https://www.myfloridacfo.com/division/consumers' },
        { label: 'CO Division of Insurance', url: 'https://doi.colorado.gov/' },
        { label: 'AZ Department of Insurance', url: 'https://insurance.az.gov/' },
        { label: 'NC Department of Insurance', url: 'https://www.ncdoi.gov/' },
        { label: 'OH Department of Insurance', url: 'https://insurance.ohio.gov/' },
      ],
    },
    vendorOptions: [
      {
        name: 'Simply Business',
        url: 'https://www.simplybusiness.com',
        affiliateId: 'simply-business',
        isFree: false,
        priceRange: 'Varies — comparison tool shows multiple quotes',
        bestFor: 'Contractors who want to compare multiple carriers in one place and get covered fast without calling multiple agents.',
        notFor: 'Contractors with complex commercial work who need a specialized broker relationship.',
      },
      {
        name: 'NEXT Insurance',
        url: 'https://www.nextinsurance.com',
        affiliateId: 'next-insurance',
        isFree: false,
        priceRange: 'Varies — fast online quote',
        bestFor: 'Solo contractors who want a fast, all-digital quote and instant certificate of insurance.',
        notFor: 'Contractors needing highly customized or high-limit commercial policies.',
      },
    ],
    stateLinked: true,
    tradesRelevance: [],
    minBudgetRequired: 'bootstrap',
    scoreGapTriggers: ['none_yet', 'insurance'],
  },

  // ── PHASE 4: Operations Systems ───────────────────────────────────────────
  {
    id: 'field-software',
    phase: 'operations-systems',
    urgency: 'important-soon',
    title: 'Set up job management software',
    whyItMatters: 'When you\'re running 3+ jobs at once, managing scheduling, quotes, invoicing, and follow-ups in your head or a notebook stops working. You miss callbacks, forget to invoice, underbid jobs because you can\'t find your notes, and customers feel disorganized. Field service software brings this into one system — and the best ones make you look more professional to customers.',
    whatToLookFor: 'At minimum: mobile-friendly quoting, scheduling, and invoicing. Ideally: customer communication, job history, and payment collection. Avoid overly complex systems until you have 2+ employees.',
    commonMistakes: [
      'Paying for an enterprise system at $200+/month when a $49/month tool covers everything you need',
      'Not using the system consistently — software doesn\'t work if you don\'t use it every job',
      'Picking the cheapest option and then switching platforms 6 months later — import/export is painful',
    ],
    estimatedCostRange: 'Free (basic) to $49–$149/month for a solid small-contractor plan',
    diyOption: {
      title: 'Start with spreadsheets and a free invoice tool until you have 5+ recurring customers',
      description: 'If you\'re truly early-stage, a Google Sheets job log and Wave Accounting invoicing covers you until volume demands more. Don\'t pay for systems you\'re not ready to use consistently.',
      resources: [
        { label: 'Wave Accounting — free invoicing', url: 'https://www.waveapps.com' },
        { label: 'Google Workspace — free Sheets and Drive', url: 'https://workspace.google.com' },
      ],
    },
    vendorOptions: [
      {
        name: 'Jobber',
        url: 'https://getjobber.com',
        affiliateId: 'jobber',
        isFree: false,
        priceRange: '$49–$149/month',
        bestFor: 'Contractors with 1–10 employees who want quoting, scheduling, invoicing, and customer management in one mobile-friendly app.',
        notFor: 'Solo contractors doing fewer than 5 jobs/month — the cost isn\'t justified yet.',
      },
      {
        name: 'Housecall Pro',
        url: 'https://www.housecallpro.com',
        affiliateId: 'housecall-pro',
        isFree: false,
        priceRange: '$49–$129/month',
        bestFor: 'HVAC, plumbing, and cleaning contractors who want strong customer communication tools and automated review requests.',
        notFor: 'Landscaping or construction businesses — Housecall Pro is optimized for service-call work.',
      },
    ],
    stateLinked: false,
    tradesRelevance: ['hvac', 'plumbing', 'electrical', 'handyman', 'cleaning', 'landscaping', 'roofing', 'painting'],
    minBudgetRequired: 'lean',
    scoreGapTriggers: ['software'],
  },

  {
    id: 'gbp',
    phase: 'sales-marketing',
    urgency: 'important-soon',
    title: 'Claim your Google Business Profile',
    whyItMatters: 'When someone in your area searches "HVAC repair near me" or "plumber [city]," Google Business Profile determines whether you appear. It\'s the highest-return free marketing available to a local service business. A complete profile with reviews drives more leads than most paid advertising — and it costs nothing.',
    whatToLookFor: 'Complete profile: business name, categories (primary + secondary), service area, hours, phone, website. Photos of your truck, tools, and completed work. At least 10 reviews to start ranking meaningfully.',
    commonMistakes: [
      'Claiming the profile but never completing it — incomplete profiles don\'t rank',
      'Not adding your service area — if you serve 3 counties, list all of them',
      'Not asking customers for reviews — the profile without reviews ranks poorly',
      'Responding to negative reviews defensively — always respond professionally and constructively',
    ],
    estimatedCostRange: 'Free',
    diyOption: {
      title: 'Claim and complete your Google Business Profile directly',
      description: 'Go to business.google.com, search your business name, claim or create it, and complete every section. Takes 30–60 minutes. Verification takes a few days.',
      resources: [
        { label: 'Google Business Profile', url: 'https://business.google.com' },
        { label: 'SBA: Online marketing basics', url: 'https://www.sba.gov/business-guide/grow-your-business/market-your-business' },
      ],
    },
    vendorOptions: [
      {
        name: 'Angi Pro',
        url: 'https://www.angi.com/pro',
        affiliateId: 'angi',
        isFree: false,
        priceRange: 'Pay-per-lead or monthly plan',
        bestFor: 'Contractors in established markets who want inbound leads while building their organic presence.',
        notFor: 'Contractors not yet set up to respond to leads quickly — Angi leads go cold fast.',
      },
    ],
    stateLinked: false,
    tradesRelevance: [],
    minBudgetRequired: 'bootstrap',
    scoreGapTriggers: ['customers', 'marketing'],
  },

  {
    id: 'customers',
    phase: 'sales-marketing',
    urgency: 'must-do-now',
    title: 'Build a basic customer follow-up system',
    whyItMatters: 'Word of mouth is not a strategy — it\'s luck. A basic system for following up with past customers, asking for referrals, and staying in contact is the difference between a business that grows on purpose and one that waits and hopes. You don\'t need CRM software to start. You need a list and a habit.',
    whatToLookFor: 'A list of every customer you\'ve ever worked for, a way to contact them, and a reason to reach out periodically (seasonal reminders, check-ins, referral asks). The simplest version is a Google Sheet with a name, phone, and last-contact date.',
    commonMistakes: [
      'Waiting until you\'re slow to reach out — customers forget you fast',
      'Only contacting customers when you need work — this feels transactional',
      'Not asking for referrals explicitly — customers want to help but won\'t think to unless asked',
      'No follow-up after a job — a quick "did everything look good?" call builds loyalty',
    ],
    estimatedCostRange: 'Free — this is a habit, not a software purchase',
    diyOption: {
      title: 'Start with a simple Google Sheet — 10 minutes to set up',
      description: 'Create columns: Customer Name, Phone, Email, Last Job Date, Last Contact Date, Notes. Review it weekly. Contact 3–5 customers per week with a genuine check-in or seasonal reminder.',
      resources: [
        { label: 'SCORE: Building customer relationships', url: 'https://www.score.org/resource/article/keeping-customers-loyal' },
        { label: 'SBA: Customer retention basics', url: 'https://www.sba.gov/business-guide/grow-your-business/market-your-business' },
      ],
    },
    vendorOptions: [],
    stateLinked: false,
    tradesRelevance: [],
    minBudgetRequired: 'bootstrap',
    scoreGapTriggers: ['customers'],
  },

  {
    id: 'credit',
    phase: 'financial-setup',
    urgency: 'optional-later',
    title: 'Start building your business credit profile',
    whyItMatters: 'Business credit is separate from personal credit. A strong business credit profile lets you: qualify for business loans without a personal guarantee, get better rates on equipment financing, and separate your personal credit score from your business debt. It takes time to build — start early so it\'s ready when you need it.',
    whatToLookFor: 'Understand your current business credit score (Dun & Bradstreet, Experian Business, Equifax Business). Open accounts that report to business credit bureaus. Pay on time, every time.',
    commonMistakes: [
      'Not checking your business credit score — you may have errors dragging it down',
      'Applying for too many credit accounts too fast — hurts your score',
      'Using personal credit for all business purchases when business accounts exist',
    ],
    estimatedCostRange: 'Free to monitor (Nav free tier). Business credit cards: varies',
    diyOption: {
      title: 'Check your business credit profile for free',
      description: 'Nav offers a free business credit monitoring account. Understanding your score is step one — no spending required.',
      resources: [
        { label: 'Nav — Free business credit check', url: 'https://www.nav.com' },
        { label: 'SBA: Building business credit', url: 'https://www.sba.gov/business-guide/launch-your-business/fund-your-business' },
      ],
    },
    vendorOptions: [
      {
        name: 'Nav Business Credit',
        url: 'https://www.nav.com',
        affiliateId: 'nav',
        isFree: true,
        priceRange: 'Free tier available',
        bestFor: 'Contractors who want to understand and improve their business credit profile over time.',
        notFor: 'Anyone who needs immediate funding — credit building is a 6–12 month process.',
      },
    ],
    stateLinked: false,
    tradesRelevance: [],
    minBudgetRequired: 'lean',
    scoreGapTriggers: ['funding'],
  },
]

// ── Phase metadata ────────────────────────────────────────────────────────────
export const PHASES: Record<PhaseId, { title: string; subtitle: string }> = {
  'legal-foundation':    { title: 'Phase 1 — Legal Foundation',       subtitle: 'The non-negotiables. Do these first.' },
  'financial-setup':     { title: 'Phase 2 — Financial Setup',         subtitle: 'Know your numbers. Protect your money.' },
  'insurance-protection':{ title: 'Phase 3 — Insurance & Risk',        subtitle: 'One job gone wrong without this ends everything.' },
  'operations-systems':  { title: 'Phase 4 — Operations Systems',      subtitle: 'Build the machine that runs without chaos.' },
  'sales-marketing':     { title: 'Phase 5 — Sales & Marketing',       subtitle: 'Get customers on purpose, not by accident.' },
  'hiring-scaling':      { title: 'Phase 6 — Hiring & Scaling',        subtitle: 'Only tackle this once your foundation is solid.' },
}

// ── Urgency labels ────────────────────────────────────────────────────────────
export const URGENCY_CONFIG: Record<UrgencyLevel, {
  label: string; color: string; bg: string; order: number
}> = {
  'must-do-now':    { label: 'Do this now',      color: '#E05A4E', bg: 'rgba(224,90,78,0.12)',   order: 0 },
  'important-soon': { label: 'Do this soon',     color: '#EF9F27', bg: 'rgba(239,159,39,0.12)',  order: 1 },
  'optional-later': { label: 'When ready',       color: '#4A90D9', bg: 'rgba(74,144,217,0.12)',  order: 2 },
  'skip-for-now':   { label: 'Skip for now',     color: '#888780', bg: 'rgba(136,135,128,0.12)', order: 3 },
}

// ── Roadmap engine ────────────────────────────────────────────────────────────
export function buildPersonalizedRoadmap(result: ScoreResult): RoadmapPhase[] {
  const { answers, categoryScores } = result
  const setupIds     = answers.setup_steps ?? []
  const isNone       = setupIds.includes('none_yet')
  const budget       = mapBudget(answers.financial ?? '')
  const trade        = answers.business_type ?? 'other'
  const blocker      = answers.blocker ?? ''
  const stage        = answers.stage ?? ''
  const custPlan     = answers.customer_plan ?? ''
  const needsFunding = answers.financial === 'need_funding' || answers.financial === 'not_sure'

  // Which items to include and at what urgency
  const selectedItems: (RoadmapItem & { computedUrgency: UrgencyLevel })[] = []

  function add(id: string, urgencyOverride?: UrgencyLevel) {
    const item = ROADMAP_LIBRARY.find(i => i.id === id)
    if (!item) return
    // Skip if trade not relevant (empty = all trades)
    if (item.tradesRelevance.length > 0 && !item.tradesRelevance.includes(trade)) return
    // Skip if budget too low for paid-only vendors (still show DIY)
    const budgetOrder = { bootstrap: 0, lean: 1, moderate: 2, invested: 3 }
    const minOrder    = budgetOrder[item.minBudgetRequired] ?? 0
    const userOrder   = budgetOrder[budget] ?? 0
    const urgency     = urgencyOverride ?? item.urgency

    // Filter vendor options by budget
    const filteredItem = {
      ...item,
      vendorOptions: item.vendorOptions.filter(v => {
        if (v.isFree) return true
        if (budget === 'bootstrap') return false   // only show free options to bootstrap budget
        if (budget === 'lean') return !v.priceRange.startsWith('$3') && !v.priceRange.startsWith('$5') // skip expensive
        return true
      }),
      computedUrgency: urgency,
    }
    selectedItems.push(filteredItem)
  }

  // ── Needs-first logic: what does this person actually need? ──────────────
  const hasEIN    = !isNone && setupIds.includes('ein')
  const hasBank   = !isNone && setupIds.includes('bank')
  const hasEntity = !isNone && setupIds.includes('entity_reg')
  const hasInsur  = !isNone && setupIds.includes('insurance')
  const hasLicense= !isNone && setupIds.includes('license_res')
  const hasGBP    = !isNone && setupIds.includes('gbp')
  const hasWebsite= !isNone && setupIds.includes('website')

  // Phase 1: Legal Foundation — always start here
  if (!hasEIN)    add('ein',     'must-do-now')
  if (!hasEntity) add('entity',  'must-do-now')
  if (!hasLicense && ['hvac','electrical','plumbing','roofing','construction','solar'].includes(trade)) {
    add('license', 'must-do-now')
  }

  // Phase 2: Financial Setup
  if (!hasBank)                              add('bank',        'must-do-now')
  if (categoryScores.financialReadiness < 12) add('pricing',    'must-do-now')
  add('bookkeeping', categoryScores.financialReadiness < 10 ? 'must-do-now' : 'important-soon')

  // Phase 3: Insurance — always critical, adjust urgency by stage
  if (!hasInsur) {
    const insurUrgency: UrgencyLevel =
      stage === 'thinking' ? 'important-soon' : 'must-do-now'
    add('insurance-gl', insurUrgency)
  }

  // Phase 4: Operations — only suggest if they have basic foundation
  const hasFoundation = hasBank && hasEntity
  if (hasFoundation || stage === 'months_6_12' || stage === 'over_1yr') {
    const fsSoftwareUrgency: UrgencyLevel =
      blocker === 'software' ? 'must-do-now'
      : categoryScores.setupReadiness < 10 ? 'important-soon'
      : 'optional-later'
    add('field-software', fsSoftwareUrgency)
  }

  // Phase 5: Sales & Marketing
  if (!hasGBP) add('gbp', 'important-soon')
  if (categoryScores.customerReadiness < 8 || custPlan === 'no_plan') {
    add('customers', 'must-do-now')
  }

  // Credit/funding: only when financially stable enough
  if (needsFunding || blocker === 'funding') {
    add('credit', 'important-soon')
  } else if (stage === 'over_1yr') {
    add('credit', 'optional-later')
  }

  // ── Sort: urgency order within each phase ────────────────────────────────
  selectedItems.sort((a, b) => {
    const phaseOrder: PhaseId[] = [
      'legal-foundation', 'financial-setup', 'insurance-protection',
      'operations-systems', 'sales-marketing', 'hiring-scaling',
    ]
    const phaseA = phaseOrder.indexOf(a.phase)
    const phaseB = phaseOrder.indexOf(b.phase)
    if (phaseA !== phaseB) return phaseA - phaseB
    return URGENCY_CONFIG[a.computedUrgency].order - URGENCY_CONFIG[b.computedUrgency].order
  })

  // ── Group into phases ────────────────────────────────────────────────────
  const phaseMap = new Map<PhaseId, RoadmapItem[]>()
  for (const item of selectedItems) {
    if (!phaseMap.has(item.phase)) phaseMap.set(item.phase, [])
    phaseMap.get(item.phase)!.push(item)
  }

  return Array.from(phaseMap.entries()).map(([phaseId, items]) => ({
    id: phaseId,
    title: PHASES[phaseId]?.title ?? phaseId,
    subtitle: PHASES[phaseId]?.subtitle ?? '',
    items,
  }))
}
