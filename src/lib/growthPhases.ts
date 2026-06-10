// ─────────────────────────────────────────────────────────────────────────────
// SubZeroMetrix — Growth Phase System
// 12 contractor growth phases with deep 30/60/90 plans, KPIs, and vendor refs
// ─────────────────────────────────────────────────────────────────────────────

export type ContractorStage = 'startup' | 'early' | 'growth' | 'scale'
export type TradeFitCode = 'hvac' | 'plumbing' | 'electrical' | 'construction' | 'handyman' | 'landscaping' | 'roofing' | 'painting' | 'cleaning' | 'all'

export interface PlanStep {
  action: string
  detail: string
}

export interface GrowthPhase {
  id: string
  phaseNumber: number
  title: string
  shortTitle: string
  targetStages: ContractorStage[]
  scoreRange: { min: number; max: number }
  tradeFit: TradeFitCode[]
  icon: string
  mainBusinessProblem: string
  whyItMatters: string
  symptoms: string[]
  immediateAction: string
  thirtyDayPlan: PlanStep[]
  sixtyDayPlan: PlanStep[]
  ninetyDayPlan: PlanStep[]
  whatToMeasure: string[]
  commonMistakes: string[]
  salesImpact: string
  operationalImpact: string
  brandImpact: string
  financialImpact: string
  recommendedVendorIds: string[]
  basicVisibleGuidance: string
  lockedUpgradePreview: string
  upgradeModuleTitle: string
  completionImpactScore: number
  relatedPlaybookIds: string[]
  relatedFlyerIds: string[]
}

// ── Phase Data ─────────────────────────────────────────────────────────────────

export const GROWTH_PHASES: GrowthPhase[] = [

  // ── Phase 1 ──────────────────────────────────────────────────────────────────
  {
    id: 'foundation-setup',
    phaseNumber: 1,
    title: 'Foundation & Business Setup',
    shortTitle: 'Foundation',
    targetStages: ['startup', 'early'],
    scoreRange: { min: 0, max: 40 },
    tradeFit: ['all'],
    icon: '🏗️',
    mainBusinessProblem:
      'Operating without a legal business structure, proper licensing, or insurance creates personal liability, tax exposure, and zero ability to build business credit.',
    whyItMatters:
      'Every other growth phase depends on a solid foundation. A contractor who is not properly set up legally cannot get bonded for commercial work, cannot open a business credit line, and risks losing everything personal if a job goes wrong. The IRS is not lenient on cash-only operators. Building on a cracked foundation is how trades businesses collapse at the worst possible moment.',
    symptoms: [
      'Running under your personal name with no LLC or business entity',
      'Using personal bank account for business income and expenses',
      'No business license or operating under someone else\'s license',
      'No general liability or workers comp insurance',
      'Customers writing checks to you personally, not a business name',
    ],
    immediateAction:
      'File your LLC or business entity this week. Get your EIN from IRS.gov — it is free, takes 5 minutes online, and is required to open a business bank account. Do this before anything else.',
    thirtyDayPlan: [
      { action: 'File LLC or sole proprietor DBA', detail: 'Use ZenBusiness, Northwest Registered Agent, or file directly with your state. LLC is usually $50–$500 depending on state. The legal protection is worth every dollar.' },
      { action: 'Get EIN from IRS.gov', detail: 'Free. Online. Takes 5 minutes. Required for business banking, hiring, and taxes. Go to irs.gov/businesses and apply for an Employer Identification Number.' },
      { action: 'Open a dedicated business checking account', detail: 'Every dollar of business income goes in. Every business expense goes out. No personal mixing. Relay and Mercury have no monthly fees. Chase and Bank of America have more lending relationship potential.' },
      { action: 'Get a basic contract template', detail: 'At minimum: scope of work, price, payment terms, change order process, and limitation of liability. Even a one-page document. Verbal agreements lose in court.' },
    ],
    sixtyDayPlan: [
      { action: 'Get general liability insurance', detail: 'Most residential contractors need $1M per occurrence / $2M aggregate minimum. NEXT Insurance and Simply Business have fast online quotes. Commercial jobs often require higher limits and certificate capability.' },
      { action: 'Get commercial auto coverage', detail: 'If you drive your personal vehicle for work without commercial auto coverage, your personal policy will deny a claim. Get commercial auto or a combined personal/commercial policy.' },
      { action: 'Verify state and local licensing requirements', detail: 'HVAC, electrical, and plumbing typically require state licenses. General contracting requirements vary by state and city. Check your state\'s contractor licensing board website.' },
      { action: 'Set up a tax savings account', detail: 'Open a separate savings account and move 25–30% of every deposit into it. Self-employed contractors pay quarterly estimated taxes. Running out of money on April 15 is avoidable.' },
    ],
    ninetyDayPlan: [
      { action: 'File for any required local business licenses', detail: 'Many cities require a local business license separate from state licensing. Check with your city clerk or county business office.' },
      { action: 'Get a business credit card', detail: 'Even a simple Chase Ink or Capital One Spark. Use it for business purchases only. Pay it in full monthly. You are starting to build a business credit profile.' },
      { action: 'Create a basic filing and record-keeping system', detail: 'Contracts, permits, insurance certificates, tax records. A Google Drive folder is fine to start. You will need this for audits, bonding, and loan applications.' },
      { action: 'Review formation and insurance annually', detail: 'As revenue and crew size change, your insurance needs change. Review every year and after major new hires or new service additions.' },
    ],
    whatToMeasure: [
      'Legal entity status: LLC filed or not',
      'Business license current: yes/no',
      'Insurance coverage in force: yes/no and coverage amount',
      'Separate business bank account: yes/no',
      'Tax savings account funded: % of revenue set aside',
    ],
    commonMistakes: [
      'Waiting to form an LLC until you "grow bigger" — liability doesn\'t wait',
      'Skipping insurance to save money — one job gone wrong ends the business',
      'Mixing personal and business money — makes tax prep a nightmare and hides profitability',
      'Letting an old employee carry your license — creates legal exposure for both parties',
      'Not setting aside money for quarterly taxes — self-employment tax is 15.3% plus income tax',
    ],
    salesImpact: 'Proper licensing and insurance unlocks commercial work, property management contracts, and insurance restoration jobs — often 2–4x the residential average ticket.',
    operationalImpact: 'A separate business entity with its own bank account, credit, and records makes every other operational decision cleaner and more professional.',
    brandImpact: 'Licensed, insured, and properly formed businesses win more bids. Homeowners increasingly verify license and insurance before booking.',
    financialImpact: 'Separating business finances reveals true profit or loss. Many contractors discover they are working for less than minimum wage once overhead is accounted for.',
    recommendedVendorIds: ['zenbusiness', 'northwest-ra', 'relay', 'mercury', 'next-insurance', 'simply-business', 'chase-ink'],
    basicVisibleGuidance:
      'File your LLC, get your EIN, open a business bank account, and get insured. In that order. These four moves take about two weeks and cost less than a slow service call. Every other phase in this roadmap depends on them being done.',
    lockedUpgradePreview:
      'State-by-state licensing requirements by trade · Contract template library (residential, commercial, service agreement) · Insurance coverage calculator by trade and revenue · Business credit building 12-month plan · Tax setup guide for self-employed contractors · Chart of accounts template for QuickBooks',
    upgradeModuleTitle: 'Full Foundation Setup Kit',
    completionImpactScore: 4,
    relatedPlaybookIds: [],
    relatedFlyerIds: [],
  },

  // ── Phase 2 ──────────────────────────────────────────────────────────────────
  {
    id: 'banking-finance',
    phaseNumber: 2,
    title: 'Banking, Bookkeeping & Financial Control',
    shortTitle: 'Financials',
    targetStages: ['startup', 'early', 'growth'],
    scoreRange: { min: 0, max: 55 },
    tradeFit: ['all'],
    icon: '💰',
    mainBusinessProblem:
      'Without financial systems, contractors cannot tell which jobs make money, cannot plan for taxes, and cannot access credit or lending when they need it to grow.',
    whyItMatters:
      'Cash in the bank does not equal profit. Most contractors discover this the hard way when tax season arrives and there is nothing left after materials, subs, and equipment. Job costing — knowing the real cost of each job before and after completion — is the difference between a business that grows and one that stays stuck trading time for cash. Financial clarity enables better pricing, smarter hiring, and lender credibility.',
    symptoms: [
      'Cannot tell which job types or customers are most profitable',
      'Surprised by tax bills because nothing was set aside',
      'No monthly P&L review — just checking if there\'s money in the account',
      'Inconsistent invoicing — customers paying whenever they feel like it',
      'Using owner withdrawals as a substitute for payroll — no salary discipline',
    ],
    immediateAction:
      'Open a separate business savings account TODAY and move 25% of every deposit into it for taxes. Label it "Tax Reserve." This one habit prevents the April 15 crisis that takes out more contractors than slow seasons ever do.',
    thirtyDayPlan: [
      { action: 'Set up business banking properly', detail: 'Business checking for operating expenses. Business savings for tax reserve (25–30% of revenue). Consider a third account for equipment/reserve fund. Relay and Mercury both offer multiple account structures with no fees.' },
      { action: 'Start basic bookkeeping — even a spreadsheet', detail: 'Income by job, expenses by category (materials, labor, truck, insurance, overhead). Know your gross revenue and gross margin every month. QuickBooks Simple Start or Wave Accounting are free-to-low-cost starting points.' },
      { action: 'Invoice every job before you leave the site', detail: 'Same-day invoicing through Jobber, Housecall Pro, or QuickBooks. Every day you wait on an invoice is a day you are financing the customer\'s job for free. Net 30 terms for residential work is too lenient.' },
      { action: 'Set up payment acceptance', detail: 'Credit card, ACH, or check on-site. Jobber Payments, Square, and Stripe all charge 2.6–2.9%. Factor that cost into your pricing — do not absorb it.' },
    ],
    sixtyDayPlan: [
      { action: 'Set up QuickBooks or job-costing software', detail: 'QuickBooks Online is the standard. Add Knowify or a job-costing integration if you need per-job profit tracking. Connect your business bank account and run it for 60 days before touching anything else.' },
      { action: 'Build a simple chart of accounts for contractors', detail: 'Revenue: service, install, maintenance. COGS: materials, labor, subs. Overhead: truck, insurance, marketing, software. This structure reveals gross margin and overhead clearly.' },
      { action: 'Set owner salary or draw policy', detail: 'Stop taking random withdrawals. Pay yourself a set owner draw or salary. This makes business financials accurate and prevents spending business money on personal impulse.' },
      { action: 'Track accounts receivable', detail: 'Know who owes you money and how old the balance is. Anything over 30 days residential needs a follow-up call. Anything over 60 days gets a formal collection process.' },
    ],
    ninetyDayPlan: [
      { action: 'Run your first monthly P&L review', detail: 'Revenue, COGS, gross margin, overhead expenses, net profit. Compare to prior month. Identify one expense to reduce and one revenue opportunity to add.' },
      { action: 'Start job costing on every job', detail: 'Estimated vs. actual hours and materials. After 30 days you will know which job types are profitable and which are bleeding you dry. This is the most important financial data a contractor can track.' },
      { action: 'Meet with a bookkeeper or CPA', detail: 'Even one session with a bookkeeper who understands contractor businesses will save you more than it costs. They will set up your QuickBooks correctly and identify deductions you are missing.' },
      { action: 'Build a 90-day cash forecast', detail: 'Revenue pipeline × close rate, minus known upcoming expenses. A simple spreadsheet. Seasonal businesses live and die by cash flow forecasting.' },
    ],
    whatToMeasure: [
      'Gross margin by job type (revenue minus direct costs)',
      'Average days to invoice after job completion',
      'Average days to collect payment (DSO)',
      'Monthly overhead as % of revenue',
      'Tax reserve % of revenue set aside',
    ],
    commonMistakes: [
      'Pricing based on what competitors charge rather than actual cost of doing business',
      'Not separating materials cost from labor cost in job records',
      'Withdrawing from the business account based on what\'s available, not what\'s earned',
      'Not tracking overhead — insurance, truck, phone, and software are real job costs',
      'Waiting until year-end to reconcile books — by then decisions are already made',
    ],
    salesImpact: 'Knowing your real costs enables confident pricing. Contractors who know their numbers stop discounting out of fear and start winning at the right margin.',
    operationalImpact: 'Financial systems create the data you need to decide when to hire, what equipment to buy, and which service areas are worth keeping.',
    brandImpact: 'Clean financials open the door to SBA loans, equipment financing, and bank lines of credit — which fund the growth moves that build brand and capacity.',
    financialImpact: 'Contractors with proper job costing and P&L tracking typically find 10–20% margin improvement within 6 months just from eliminating unprofitable job types and tightening overhead.',
    recommendedVendorIds: ['quickbooks', 'wave', 'knowify', 'relay', 'mercury', 'chase-business', 'gusto', 'qb-payroll'],
    basicVisibleGuidance:
      'Separate your money, invoice same-day, reserve 25% for taxes, and track every job\'s actual cost vs. revenue. These four habits build the financial clarity that lets you make real growth decisions instead of guessing.',
    lockedUpgradePreview:
      'Contractor chart of accounts template (QuickBooks-ready) · Job cost tracking spreadsheet · Cash flow forecast template · Owner pay structure guide · Break-even calculator · AR collection scripts and sequence · Monthly financial review checklist',
    upgradeModuleTitle: 'Contractor Financial Control System',
    completionImpactScore: 4,
    relatedPlaybookIds: [],
    relatedFlyerIds: [],
  },

  // ── Phase 3 ──────────────────────────────────────────────────────────────────
  {
    id: 'lead-flow-visibility',
    phaseNumber: 3,
    title: 'Lead Flow & Local Visibility',
    shortTitle: 'Lead Flow',
    targetStages: ['startup', 'early', 'growth'],
    scoreRange: { min: 0, max: 70 },
    tradeFit: ['all'],
    icon: '📡',
    mainBusinessProblem:
      'Relying on word of mouth alone creates a feast-or-famine revenue cycle with no way to predict or control lead volume.',
    whyItMatters:
      'Word of mouth is not a system — it is the result of good work and luck. A contractor who controls their lead flow controls their revenue. Google Business Profile, local SEO, and at least one paid or platform-based lead source creates the foundation for consistent pipeline. Without this, you cannot plan, cannot staff appropriately, and compete only on desperation pricing when things get slow.',
    symptoms: [
      'No Google Business Profile or it is incomplete/unclaimed',
      'Fewer than 10 Google reviews despite years of good work',
      'All new business comes from referrals from the same 2–3 people',
      'Revenue drops significantly in slow season because there is no lead reserve',
      'No idea where leads are coming from because you never asked',
    ],
    immediateAction:
      'Go to business.google.com right now. Claim and verify your Google Business Profile if you have not already. Add your real business hours, service area, every service you offer, and at least 5–10 photos of real completed work. This is the highest-return free marketing move a local contractor can make.',
    thirtyDayPlan: [
      { action: 'Complete and optimize Google Business Profile', detail: 'Business name, address (or service area if no storefront), hours, services list, description with your trade and city, 10+ job photos, question answers. Fully complete profiles rank higher and convert better.' },
      { action: 'Ask every customer from the last 3 months for a Google review', detail: 'Text them a direct review link. Say: "I\'d really appreciate it if you left us a review — it helps us a lot." Direct links via Google\'s review link generator have 3–5x the completion rate of just asking verbally.' },
      { action: 'Set up basic lead source tracking', detail: 'Ask every new customer: "How did you hear about us?" Log it. After 30 calls you will know which sources are working. Most contractors are surprised where their best leads actually come from.' },
      { action: 'Create or update your Facebook Business Page', detail: 'Post job photos weekly. Service area homeowners use Facebook heavily. Free visibility.' },
    ],
    sixtyDayPlan: [
      { action: 'List on Angi Pro and Thumbtack', detail: 'Two different platforms for two different customer types. Respond to leads within 5 minutes when possible — conversion drops by 80% after 30 minutes. Track your cost per booked job from each platform separately.' },
      { action: 'Build a basic website', detail: 'Even a simple 3-page website (home, services, contact) with your trade, service area, phone number, and a gallery of job photos. Scorpion, RYNO, and local agencies build contractor sites. WordPress with a local SEO agency is also effective and less expensive.' },
      { action: 'Add Google Local Service Ads if eligible', detail: 'Google Guaranteed program puts your business at the top of search above regular ads. Pay per call, not per click. High-intent leads. Available for most home service trades.' },
      { action: 'Set up call tracking', detail: 'CallRail or a dedicated number lets you know which marketing sources actually generate phone calls. Without this, you are spending money blind.' },
    ],
    ninetyDayPlan: [
      { action: 'Hit 25 Google reviews and maintain response cadence', detail: 'Respond to every review — positive and negative. A negative review with a professional response converts better than no negative reviews. Reviewers do not trust perfection.' },
      { action: 'Add Nextdoor and neighborhood Facebook groups', detail: 'Introduce yourself, offer seasonal tips, share before/afters. Direct, local, zero-cost. Property managers and HOAs often hire off Nextdoor recommendations.' },
      { action: 'Evaluate lead source ROI', detail: 'Cost per lead × close rate × average job size = actual ROI per channel. Cut channels with cost-per-job above your threshold. Double down on what works.' },
      { action: 'Start a seasonal email or text list', detail: 'Past customers who gave you their contact info are your highest-value marketing asset. A spring tune-up text blast or pre-winter reminder generates immediate jobs at near-zero cost.' },
    ],
    whatToMeasure: [
      'Number of inbound calls or leads per week, by source',
      'Google review count and average rating',
      'Cost per lead by channel (Angi, Thumbtack, Google Ads, organic)',
      'Cost per booked job by channel',
      'GBP views, calls, and direction requests per month',
    ],
    commonMistakes: [
      'Running paid ads before Google Business Profile is fully optimized — free traffic first',
      'Buying leads from platforms with no follow-up speed system — 5-minute response is not optional',
      'Treating all lead sources equally — track cost per booked job, not cost per lead',
      'Ignoring reviews until a bad one appears — proactive review generation is the only defense',
      'Switching lead channels constantly instead of mastering one at a time',
    ],
    salesImpact: 'Contractors with 25+ Google reviews and a complete GBP receive 3–8 more inbound calls per month on average. At $800 average job, that is $2,400–$6,400 additional monthly revenue.',
    operationalImpact: 'Predictable inbound lead flow enables planned scheduling, capacity planning, and technician utilization — instead of scrambling when the phone goes quiet.',
    brandImpact: 'A strong Google presence with photos and reviews is your brand for most residential customers. It is what they check before they call, and what they send to friends.',
    financialImpact: 'Every review-driven or organic inbound lead costs zero. Contractors with strong GBP and SEO presence reduce paid lead dependency, which directly increases net margin.',
    recommendedVendorIds: ['callrail', 'scorpion', 'ryno', 'podium', 'nicejob', 'canva'],
    basicVisibleGuidance:
      'Fully complete your Google Business Profile. Ask every happy customer for a review with a direct link. Know where every new lead comes from. These three habits give you more control over your pipeline than any ad spend.',
    lockedUpgradePreview:
      'Google Business Profile optimization checklist · Review request text and email templates · Lead source tracking spreadsheet · Google Local Service Ads setup guide · Angi/Thumbtack profile optimization checklist · Seasonal marketing calendar · Direct mail campaign guide by trade',
    upgradeModuleTitle: 'Local Visibility & Lead Flow Playbook',
    completionImpactScore: 4,
    relatedPlaybookIds: ['speed-to-lead', 'referral-system'],
    relatedFlyerIds: ['seasonal-hvac-tuneup', 'new-contractor-intro', 'referral-program'],
  },

  // ── Phase 4 ──────────────────────────────────────────────────────────────────
  {
    id: 'sales-process-call-handling',
    phaseNumber: 4,
    title: 'Sales Process & Call Handling',
    shortTitle: 'Sales Process',
    targetStages: ['early', 'growth'],
    scoreRange: { min: 10, max: 75 },
    tradeFit: ['all'],
    icon: '📞',
    mainBusinessProblem:
      'Untrained call handling, voicemail answered leads, and no defined booking process loses 30–50% of inbound leads before a technician ever shows up.',
    whyItMatters:
      'You paid for the lead — with marketing spend, reputation work, or referral goodwill. If it goes to voicemail and nobody follows up, that money is gone. The phone call is the first sales moment. How you answer, what you ask, and how you book creates or destroys the relationship before the technician leaves the shop. Contractors with a defined call and booking process convert significantly more leads into booked jobs at higher average tickets.',
    symptoms: [
      'Calls going to voicemail during business hours — no live answer or callback system',
      'Giving price over the phone without seeing the job',
      'No standard booking process — customers book loosely or not at all',
      'No CRM or log of who called and what they needed',
      'Answering the phone with "Hello?" instead of a professional greeting',
    ],
    immediateAction:
      'Record your current phone greeting today. Play it back. If it does not immediately convey professional, local, trade-specific business that is ready to help — rewrite it. "Thank you for calling [Company], this is [Name], how can I help you today?" is a starting point. Answer every call with your business name and your name.',
    thirtyDayPlan: [
      { action: 'Create and practice a phone booking script', detail: 'Get customer name, address, and problem description. Ask urgency questions: "Is this an emergency?" and "Is the system still running at all?" Book a specific date and time — not "sometime next week." Confirm the appointment before hanging up.' },
      { action: 'Set up missed call text-back', detail: 'Podium, Jobber, and Housecall Pro all offer automatic text-back when a call is missed. "Hi, sorry we missed your call — we can help with [trade]. What can we assist with?" Recovers 20–35% of missed calls that would otherwise go to a competitor.' },
      { action: 'Never give price over the phone', detail: 'Train everyone who answers your phone: "We do not quote over the phone because every job is different — but I can get a tech out to you [today/tomorrow] to take a look and give you an exact number." Booking the visit is the goal of the call.' },
      { action: 'Start logging every inbound call', detail: 'Date, source, customer name, job type, booked yes/no. Even a simple spreadsheet. After 30 days you will know your answer rate, booking rate, and which call types you are winning or losing.' },
    ],
    sixtyDayPlan: [
      { action: 'Implement a CRM or lead tracking system', detail: 'Even the basic Jobber or Housecall Pro customer record is a CRM. Track every lead through: called → booked → visited → estimated → sold. Know where in the funnel you are losing.' },
      { action: 'Create a speed-to-lead process', detail: 'New leads from Angi, Thumbtack, or your website need a response within 5 minutes. Build the system: alert to phone, text first, call immediately after. Speed to lead is the single highest-impact change most contractors can make to their conversion rate.' },
      { action: 'Train every person who answers your phone', detail: 'The owner should not be the only one who can book a call. A trained CSR or dispatcher who knows the script and can book appointments is worth every dollar of their wage in recovered revenue.' },
      { action: 'Add a booking confirmation and reminder sequence', detail: 'Text confirmation immediately after booking. Reminder text the day before. Day-of reminder with tech name and ETA window. Reduces no-shows by 40–60%.' },
    ],
    ninetyDayPlan: [
      { action: 'Track and review your booking metrics weekly', detail: 'Calls answered, calls missed, leads contacted, appointments booked, booking rate %. Review every Monday. A 10-point improvement in booking rate at your call volume is worth more than most marketing campaigns.' },
      { action: 'Build a no-show and cancellation recovery process', detail: 'Call immediately. Offer same-day or next-available. Do not charge a cancellation fee on first offense — just rebook. Cancellations that are not rebooked are revenue that disappears permanently.' },
      { action: 'Consider a professional answering service for after-hours', detail: 'Services like Answerforce, MAP Communications, or Ruby Receptionists handle after-hours calls and emergency dispatch. Emergency calls book at 2–4x normal rates. Missing them is expensive.' },
      { action: 'Review call recordings if your phone system supports it', detail: 'CallRail and OpenPhone both record calls. Listen to 5–10 calls per week. You will find missed booking opportunities and training gaps that no report can show you.' },
    ],
    whatToMeasure: [
      'Call answer rate (calls answered ÷ total inbound calls)',
      'Booking rate (appointments booked ÷ calls answered)',
      'Speed to lead for online inquiries (minutes to first contact)',
      'No-show rate (no-shows ÷ booked appointments)',
      'Missed call recovery rate (callbacks that result in booked jobs)',
    ],
    commonMistakes: [
      'Answering the phone yourself while on a job — distracted booking leads to errors and missed opportunities',
      'Training staff only once — scripts need regular review and role-play practice',
      'Using personal cell phone for business calls — no recording, no tracking, no professional impression',
      'Giving price over the phone and then being surprised when customers shop around',
      'Treating a missed call as lost — 70% of missed calls that get a fast callback will book',
    ],
    salesImpact: 'Contractors who move from 50% to 70% booking rate on 20 calls per week at $800 average job gain an additional $3,200 in weekly revenue potential from zero additional marketing spend.',
    operationalImpact: 'A defined call and booking process enables dispatchers and CSRs to handle calls professionally, freeing the owner from the phone and creating schedule stability.',
    brandImpact: 'Professional call handling is often the first real brand impression a customer has. A poorly answered phone costs more in lost trust than any bad review.',
    financialImpact: 'Faster speed-to-lead response alone typically improves online lead conversion by 20–40%, representing one of the highest-ROI improvements a contractor can make without spending a dollar on additional advertising.',
    recommendedVendorIds: ['callrail', 'openphone', 'jobber', 'housecall-pro', 'ringcentral'],
    basicVisibleGuidance:
      'Answer every call with your business name and your name. Never give price over the phone. Book a specific date and time on every call. Respond to missed calls within 5 minutes. These four habits alone will recover revenue you are currently leaving on the table every week.',
    lockedUpgradePreview:
      'Phone booking script (residential + commercial) · Missed call text-back sequence · Speed-to-lead response template · CRM pipeline setup guide for Jobber/Housecall Pro · Booking confirmation and reminder text templates · Call metrics tracking dashboard · CSR training guide',
    upgradeModuleTitle: 'Sales Call & Booking Mastery System',
    completionImpactScore: 4,
    relatedPlaybookIds: ['phone-booking', 'speed-to-lead', 'objection-handling'],
    relatedFlyerIds: [],
  },

  // ── Phase 5 ──────────────────────────────────────────────────────────────────
  {
    id: 'pricing-profit-margin',
    phaseNumber: 5,
    title: 'Estimating, Pricing & Profit Margin',
    shortTitle: 'Pricing',
    targetStages: ['early', 'growth'],
    scoreRange: { min: 10, max: 80 },
    tradeFit: ['all'],
    icon: '📊',
    mainBusinessProblem:
      'Pricing based on gut feeling, competitor rates, or hourly time-and-material without understanding true job cost creates the most common contractor trap: busy and broke.',
    whyItMatters:
      'Most contractors who go out of business were not short on work — they were short on margin. If your price does not cover materials, labor burden (wages plus payroll taxes plus benefits plus workers comp), overhead (truck, insurance, software, marketing, office), and a profit margin, you are subsidizing your customers\' jobs out of your own equity. Flat-rate pricing and job costing are the two systems that turn a busy contractor into a profitable one.',
    symptoms: [
      'Winning most bids but still feeling like you never have money',
      'Not knowing your actual cost per hour to be in business',
      'Quoting jobs "like the last one" without reviewing actual costs',
      'Under-pricing repeat customers out of relationship loyalty',
      'Materials costs eating into margin without being tracked per job',
    ],
    immediateAction:
      'Calculate your true fully-loaded cost per hour for one technician in the field: wages + payroll taxes + workers comp + truck + insurance + tools + overhead share. Most contractors find this is 40–70% higher than they thought. Every hour sold must exceed this number plus margin.',
    thirtyDayPlan: [
      { action: 'Calculate your break-even rate per tech per day', detail: 'Total monthly costs ÷ billable days ÷ tech count = your daily break-even. Divide by hours worked to get hourly floor. Add your target margin. This is your minimum billable rate — not your average.' },
      { action: 'Build a job cost sheet for your top 10 most common jobs', detail: 'Estimated materials + labor hours × fully-loaded rate + overhead allocation = real cost. Add target margin. This becomes your starting price floor for each job type.' },
      { action: 'Stop quoting based on competitor pricing alone', detail: 'You do not know what their overhead is. You do not know their margin. You do not know if they are profitable. Set your prices based on your costs and your target margin. The market will tell you if you are out of range.' },
      { action: 'Create a basic price book for your 20 most common services', detail: 'Flat rates for drain clears, tune-ups, filter swaps, diagnostic fees, trip charges. Consistent pricing protects margin and makes quoting faster. Customers trust consistent pricing.' },
    ],
    sixtyDayPlan: [
      { action: 'Implement flat-rate or upfront pricing for standard jobs', detail: 'ServiceTitan, Jobber, and Housecall Pro all support flat-rate price books. Customers prefer knowing the price upfront. Techs close at higher rates when they present a total price, not hourly guesses.' },
      { action: 'Build a Good/Better/Best option structure', detail: 'Every service call should have a low/mid/high option where possible. Customers who are given only one option feel constrained. Three options increase average ticket by 20–40% on jobs where it applies.' },
      { action: 'Review actual job costs vs. estimated job costs', detail: 'For 30 jobs over 60 days, compare estimated vs. actual materials and time. Find your most common cost overruns. Adjust your price book accordingly.' },
      { action: 'Add a written change order process', detail: 'Any work beyond original scope = new written authorization. This single policy eliminates most "he said/she said" disputes and forces the scope clarification that protects your margin.' },
    ],
    ninetyDayPlan: [
      { action: 'Identify your top 5 most profitable job types and double down', detail: 'Some jobs are consistent, high-margin, and fast. Some are unpredictable, low-margin, and time-consuming. Focus marketing and capacity on the former. Consider exiting the worst performers.' },
      { action: 'Raise prices by 5–10% across the board', detail: 'If you have not raised prices in 12+ months, you have effectively taken a pay cut due to inflation and material cost increases. Most customers do not notice a 5–10% price increase. Track your close rate — if it barely moves, you were underpriced.' },
      { action: 'Add a financing offer to large-ticket estimates', detail: 'Customers who can\'t afford $4,000 upfront can often afford $89/month. Wisetack, GreenSky, and Hearth integrate with most FSM platforms. Financing-offered jobs close at significantly higher rates on large tickets.' },
      { action: 'Build gross margin targets by job category', detail: 'Service: 60–70% gross margin target. Install: 35–50%. Maintenance: 50–65%. Compare your actuals. Where you miss, find whether it is pricing, material cost, or labor efficiency.' },
    ],
    whatToMeasure: [
      'Gross margin by job type (revenue minus direct job costs)',
      'Average ticket per service call (trend over time)',
      'Close rate on estimates (won ÷ total submitted)',
      'Materials cost as % of job revenue',
      'Labor efficiency (billable hours ÷ hours paid)',
    ],
    commonMistakes: [
      'Not including overhead in job cost calculations — "I just need to cover materials and wages"',
      'Matching competitor prices without knowing their cost structure',
      'Offering T&M pricing instead of flat-rate — customers hate open-ended pricing and techs work slower',
      'Forgetting to price in truck, insurance, and tools on every job',
      'Not raising prices annually — inflation is a pay cut you give yourself',
    ],
    salesImpact: 'Flat-rate pricing with Good/Better/Best options typically raises average ticket 20–40% on qualifying calls without any additional marketing spend.',
    operationalImpact: 'A price book makes quoting faster, reduces estimating errors, and makes training new estimators possible without depending on the owner for every job.',
    brandImpact: 'Contractors who price with confidence and present options professionally are perceived as more expert and trustworthy than those who hesitate or apologize for their price.',
    financialImpact: 'Moving gross margin from 40% to 55% on $30,000 monthly revenue adds $4,500/month in gross profit — without a single additional sale.',
    recommendedVendorIds: ['servicetitan', 'jobber', 'housecall-pro', 'wisetack', 'greensky', 'hearth'],
    basicVisibleGuidance:
      'Know your true cost per hour. Build a flat-rate price book for your 20 most common jobs. Always offer three options on qualifying calls. Add financing to large-ticket estimates. These four moves will raise your average ticket and protect your margin without scaring off customers.',
    lockedUpgradePreview:
      'Hourly cost calculator by trade · Flat-rate price book template · Good/Better/Best option scripts by trade and job type · Change order template · Gross margin tracking spreadsheet · Financing presentation scripts · Price increase strategy guide',
    upgradeModuleTitle: 'Contractor Pricing & Margin Control System',
    completionImpactScore: 5,
    relatedPlaybookIds: ['good-better-best', 'financing-conversation', 'diagnostic-conversation'],
    relatedFlyerIds: ['financing-available'],
  },

  // ── Phase 6 ──────────────────────────────────────────────────────────────────
  {
    id: 'followup-reviews-reputation',
    phaseNumber: 6,
    title: 'Follow-Up, Reviews & Reputation',
    shortTitle: 'Reviews',
    targetStages: ['early', 'growth'],
    scoreRange: { min: 15, max: 80 },
    tradeFit: ['all'],
    icon: '⭐',
    mainBusinessProblem:
      'Not following up on unsold estimates and not systematically collecting reviews leaves money unrecovered and digital credibility underdeveloped.',
    whyItMatters:
      'Unsold estimates are not lost — they are deferred decisions. Contractors with a 3-touch follow-up system recover 15–30% of estimates that would have gone cold. Separately, Google reviews are the #1 factor in local search ranking and customer trust. A contractor with 50 reviews beats one with 3 every time, regardless of how much better the smaller-reviewed contractor actually is. Both are systematic habits, not effort — the contractor who automates them wins.',
    symptoms: [
      'Fewer than 25 Google reviews despite years of completed jobs',
      'Sending estimates and never following up',
      'No process for asking customers for referrals after a positive job',
      'Receiving negative reviews and not responding to them',
      'No systematic way to reconnect with past customers',
    ],
    immediateAction:
      'After your next completed job, text the customer a direct Google review link and say: "Thanks for trusting us — if you have a minute, a review really helps our small business." Do this for every job this week. Track how many you send and how many respond.',
    thirtyDayPlan: [
      { action: 'Build a 3-touch estimate follow-up sequence', detail: 'Day 2: text referencing their specific job and asking if they have questions. Day 7: personal call to see where they are in the decision. Day 21: seasonal or availability reminder. Document each touch in your CRM.' },
      { action: 'Send review request after every completed job', detail: 'The best time is 2–4 hours after job completion when the experience is fresh. Text is preferred over email for open rate. Use a direct review link — not just "leave us a review on Google."' },
      { action: 'Respond to every Google review — positive and negative', detail: 'Positive: thank them by name and mention the specific work done. Negative: apologize, acknowledge, offer to resolve privately. Thoughtful responses to negative reviews often impress potential customers more than the review itself.' },
      { action: 'Create a "thank you" follow-up for completed jobs', detail: 'A thank-you text or call 24 hours after completion asking if everything is working correctly. This creates referral opportunities, prevents small issues from becoming negative reviews, and builds loyalty.' },
    ],
    sixtyDayPlan: [
      { action: 'Automate review requests through your FSM', detail: 'Jobber, Housecall Pro, and Podium all have automated review request workflows. Set it up once and it runs after every closed job. Automation turns a habit most contractors forget into a system that runs without you.' },
      { action: 'Build a seasonal past-customer re-engagement campaign', detail: 'Your past customer list is your most valuable marketing asset. A pre-season text blast ("HVAC tune-up season — $89 for current customers") generates immediate revenue at near-zero cost.' },
      { action: 'Set up email or text nurture for unsold estimates over 30 days', detail: 'A seasonal update, a price change notice, or a financing-now-available message often breaks the hesitation of customers who went quiet. Do not assume silence means no.' },
      { action: 'Track and respond to reviews on Yelp, Angi, and Facebook', detail: 'Google is primary, but Yelp and Angi reviews affect both ranking and conversion on those platforms. Assign a weekly 15-minute review response block.' },
    ],
    ninetyDayPlan: [
      { action: 'Hit 50 Google reviews and target 4.6+ average rating', detail: '50 reviews is where local search ranking meaningfully improves. A 4.6+ rating converts at a higher rate than perfect 5.0 (which looks suspicious) or below 4.5 (which loses to competition).' },
      { action: 'Build a referral ask into the job completion process', detail: 'After the review ask, add: "Do you know anyone else who might need [service]? We always take great care of referrals." Track every referral source — after 90 days you will know who your real referral champions are.' },
      { action: 'Implement a closed-loop complaint process', detail: 'Any customer who does not leave a review or gives 1–3 stars gets a personal call. Most negative situations can be resolved before they become permanent brand damage. One recovered negative review is worth more than 10 positive ones.' },
      { action: 'Evaluate reputation management software', detail: 'Podium, NiceJob, and Birdeye automate the entire review collection and response workflow and track your reputation across platforms. Worth the cost once you hit 5+ jobs per week.' },
    ],
    whatToMeasure: [
      'Google review count and average rating (monthly)',
      'Review request send rate (% of completed jobs that receive a request)',
      'Review conversion rate (requests sent ÷ reviews received)',
      'Unsold estimate follow-up rate (% of estimates that receive 3 touches)',
      'Recovered estimate revenue per month',
    ],
    commonMistakes: [
      'Asking for a review verbally at the job site — customers forget; a text link they convert in 2 minutes',
      'Not responding to positive reviews — missed opportunity to show personality and reinforce trust',
      'Treating a single negative review as a crisis — one bad review among 30 positives barely moves conversion',
      'Waiting too long to follow up on unsold estimates — after 14 days urgency drops sharply',
      'Skipping the follow-up call because you assume a no-response is a no',
    ],
    salesImpact: 'A systematic 3-touch follow-up process recovers 15–30% of unsold estimates. For a contractor submitting 20 estimates per month at $1,200 average, that is $3,600–$7,200 per month in recovered revenue.',
    operationalImpact: 'Automated review requests and follow-up sequences run without owner involvement once set up, creating a system that generates revenue and reputation passively.',
    brandImpact: '50+ Google reviews with 4.6+ average rating creates a visible trust signal that no paid ad can replicate. It directly increases inbound call conversion from search.',
    financialImpact: 'Review-driven organic search traffic reduces cost-per-lead. A contractor with strong reviews spending less on Angi/Thumbtack improves net margin on every job.',
    recommendedVendorIds: ['podium', 'nicejob', 'birdeye', 'broadly', 'jobber', 'housecall-pro'],
    basicVisibleGuidance:
      'Send a review request after every completed job. Follow up on every unsold estimate at day 2, day 7, and day 21. Respond to every review. These three habits build the reputation and revenue recovery system that most of your competitors are not running.',
    lockedUpgradePreview:
      'Estimate follow-up text and call scripts (3-touch sequence) · Review request templates for text and email · Negative review response guide · Seasonal re-engagement campaign templates · Referral ask scripts · Reputation dashboard setup guide · Past customer reactivation playbook',
    upgradeModuleTitle: 'Follow-Up & Reputation System',
    completionImpactScore: 4,
    relatedPlaybookIds: ['followup-unsold-estimates', 'referral-system'],
    relatedFlyerIds: ['referral-program', 'seasonal-hvac-tuneup'],
  },

  // ── Phase 7 ──────────────────────────────────────────────────────────────────
  {
    id: 'service-agreements',
    phaseNumber: 7,
    title: 'Service Agreements & Maintenance Plans',
    shortTitle: 'Agreements',
    targetStages: ['early', 'growth'],
    scoreRange: { min: 20, max: 85 },
    tradeFit: ['hvac', 'plumbing', 'electrical', 'construction', 'all'],
    icon: '📋',
    mainBusinessProblem:
      'One-time service work with no recurring contracts creates seasonal revenue swings, zero predictability, and no customer base to sell into when business slows.',
    whyItMatters:
      'Maintenance agreements are the closest thing a service contractor has to a subscription model. An HVAC company with 200 maintenance agreement customers knows they will generate $40,000–$60,000 in planned maintenance visits before selling a single repair or replacement. Those customers are also 3–4x more likely to buy replacements from the company holding their maintenance contract. A maintenance agreement base is a valuation multiplier when it comes time to sell the business.',
    symptoms: [
      'Revenue drops sharply every slow season with no committed customer base',
      'Past customers going to competitors for their next service call',
      'Technicians have nothing to sell on maintenance or tune-up calls',
      'No way to predict revenue or staff appropriately for the next 90 days',
      'Business value is entirely tied to owner relationships, not systems or contracts',
    ],
    immediateAction:
      'Define your maintenance plan this week. For HVAC: two visits per year (spring/fall), priority scheduling, 10–15% parts discount. For plumbing: annual inspection, priority response, small drain clean discount. For electrical: annual safety inspection, priority scheduling. Price it at $149–$249/year for single-system residential. Do not overthink it — launch the first version and improve it.',
    thirtyDayPlan: [
      { action: 'Build a maintenance plan offer with real pricing', detail: 'Calculate your cost for two visits (labor + materials) and add margin. Most residential single-system HVAC agreements price at $149–$249/year. Multi-system residential: $249–$399. Commercial: negotiate based on equipment count.' },
      { action: 'Train every tech to offer the agreement on every service call', detail: 'Script: "Before I go — we offer a maintenance plan that includes two visits per year, priority scheduling, and a parts discount. Customers on the plan typically save money on repairs and never get stuck in a queue during peak season. Can I tell you about it?" Present it as a service, not a sale.' },
      { action: 'Offer the agreement as a conversion on repair calls', detail: 'On any repair over $300: "That repair is taken care of. We also have a maintenance plan — first year at [discounted price] since you just had service today. It covers your next two visits and gives you priority scheduling." Repair-to-agreement conversion is typically 15–25% of repair calls.' },
      { action: 'Set up recurring billing for agreements', detail: 'Monthly ACH or credit card billing is preferred over annual upfront. Customers convert at higher rates on lower monthly payments. Jobber and Housecall Pro support recurring billing. Do not manually invoice agreement customers.' },
    ],
    sixtyDayPlan: [
      { action: 'Contact your last 12 months of customers with an agreement offer', detail: 'A simple text: "We recently serviced your [system]. We have a maintenance plan that includes two visits per year, priority scheduling, and parts discounts for $[price]/year. Want me to set that up for you?" Past customers convert to agreements at 20–35% when directly contacted.' },
      { action: 'Build agreement renewal into your annual maintenance visit', detail: 'At each visit, renew the agreement on-site before leaving. Train techs to handle the renewal conversation as part of their visit checklist. Do not send renewal invoices — renew at the visit.' },
      { action: 'Set up a quarterly agreement customer touch campaign', detail: 'Agreement customers get a quarterly call or text check-in. Not a service push — just relationship maintenance. This dramatically reduces cancellation rate and generates referrals from your most loyal customers.' },
      { action: 'Build a commercial agreement pitch for your service area', detail: 'Commercial customers — restaurants, property managers, small office buildings — value the contract structure and priority response. Commercial agreements are often $600–$2,400 per year per system. They are also sticky: commercial customers switch vendors less often than residential.' },
    ],
    ninetyDayPlan: [
      { action: 'Target 20–25% of service customers on active agreements', detail: '20–25% agreement penetration is a healthy residential target. Above 30% is exceptional. Track this metric monthly. Your agreement base is your most reliable revenue predictor.' },
      { action: 'Build an agreement referral incentive', detail: 'Agreement customers who refer a new agreement customer get a credit, a free service call, or a discount on next renewal. Agreement-to-agreement referrals have the highest lifetime value in your business.' },
      { action: 'Calculate the replacement premium from agreement customers', detail: 'Track what % of equipment replacements come from agreement customers. If it is not at least 60–70%, your agreement conversion script on replacement calls needs work. Agreement customers should be your primary replacement sales source.' },
      { action: 'Evaluate software for agreement management', detail: 'As your agreement base grows past 50 customers, manual tracking breaks down. ServiceTitan, Jobber, and Housecall Pro all have agreement management modules that automate visit scheduling, renewal reminders, and billing.' },
    ],
    whatToMeasure: [
      'Total active agreements (number and growth rate)',
      'Agreement penetration rate (agreements ÷ unique service customers in 12 months)',
      'Agreement renewal rate (%)',
      'Revenue from agreements (recurring + per-visit)',
      'Replacement conversion rate from agreement customers',
    ],
    commonMistakes: [
      'Making the plan too complicated — two visits and priority scheduling is enough to start',
      'Not offering the agreement on every service call — "they probably won\'t want it" is lost revenue',
      'Underpricing agreements to get volume — price them to cover cost and margin, not to be the cheapest',
      'Not billing automatically — annual invoice agreements have high non-renewal rates',
      'Forgetting to track agreement customers separately from one-time customers in your CRM',
    ],
    salesImpact: 'Agreement customers spend 3–4x more per year than non-agreement customers and have dramatically higher replacement conversion rates. A base of 100 agreements at $199/year is $19,900 in predictable recurring revenue before any repairs or replacements are sold.',
    operationalImpact: 'Agreements create planned, schedulable maintenance visits that fill gaps in the schedule during slow seasons and reduce the feast/famine revenue cycle.',
    brandImpact: 'Customers on maintenance agreements are your most loyal brand advocates. They refer more, review more, and stay with you longer than any other customer segment.',
    financialImpact: 'Agreement revenue is the most predictable revenue a service contractor has. Banks and buyers assign higher multiples to businesses with strong recurring contract bases.',
    recommendedVendorIds: ['servicetitan', 'jobber', 'housecall-pro', 'stripe', 'square'],
    basicVisibleGuidance:
      'Build a simple 2-visit maintenance agreement. Price it to cover your cost plus margin. Train every tech to offer it on every call. Set up automatic billing. Contact your last year of customers with the offer. A base of 50–100 agreements changes how your business feels and forecasts.',
    lockedUpgradePreview:
      'Maintenance agreement plan templates by trade · Tech conversion scripts for service, repair, and replacement calls · Commercial agreement pitch guide · Agreement renewal conversation script · Recurring revenue calculator · Agreement customer communication templates · Rate structure analysis tool',
    upgradeModuleTitle: 'Maintenance Agreement Growth System',
    completionImpactScore: 5,
    relatedPlaybookIds: ['maintenance-agreement-sales', 'good-better-best'],
    relatedFlyerIds: ['maintenance-agreement-flyer'],
  },

  // ── Phase 8 ──────────────────────────────────────────────────────────────────
  {
    id: 'dispatch-scheduling-workflow',
    phaseNumber: 8,
    title: 'Dispatch, Scheduling & Office Workflow',
    shortTitle: 'Operations',
    targetStages: ['early', 'growth', 'scale'],
    scoreRange: { min: 20, max: 85 },
    tradeFit: ['all'],
    icon: '🗓️',
    mainBusinessProblem:
      'Disorganized scheduling and dispatch creates technician idle time, missed appointments, and owner dependence on manual coordination that does not scale.',
    whyItMatters:
      'Every idle hour in the field is a billable hour lost forever. Contractors who run tight dispatch and efficient scheduling squeeze more revenue out of the same headcount without adding a single truck. A tech who runs 4–5 billable calls per day versus 2–3 is the difference between a profitable operation and one that is perpetually behind. Systematic dispatch also protects customer experience — missed windows and poor communication create the negative reviews that hurt you in search.',
    symptoms: [
      'Scheduling happens in the owner\'s head or on a personal phone calendar',
      'Technicians driving excessive time between jobs due to poor routing',
      'Missed appointments or wide arrival windows that customers hate',
      'No visibility into what each technician is doing in real time',
      'Emergency calls throw the entire schedule into chaos',
    ],
    immediateAction:
      'Move every scheduled job to a shared digital calendar TODAY — Google Calendar is free and works. Every tech must be able to see their schedule. The owner must stop being the only one who knows where people are supposed to be.',
    thirtyDayPlan: [
      { action: 'Implement a field service management platform', detail: 'Jobber, Housecall Pro, or ServiceTitan depending on your size. These platforms handle scheduling, dispatching, invoicing, and customer communication in one place. Start simple — use the scheduling and dispatch features first before adding complexity.' },
      { action: 'Zone your service area by geography', detail: 'Assign morning and afternoon zones. A technician who starts in the north, drives to the south, and comes back to the north has wasted an hour of billable time. Zone-based scheduling adds 1–2 billable calls per tech per day in most markets.' },
      { action: 'Set firm arrival windows and send customer notifications', detail: '"We will arrive between 10 AM and noon" is no longer acceptable. Customers want a 2-hour window and a heads-up text when the tech is 30 minutes out. Housecall Pro and Jobber both do automated customer notifications.' },
      { action: 'Create a daily dispatch board review process', detail: 'Every morning: review the day\'s schedule, confirm tech assignments, confirm job notes are complete, confirm customer communication was sent. 15-minute daily dispatch review prevents 80% of the day\'s scheduling surprises.' },
    ],
    sixtyDayPlan: [
      { action: 'Build a standard job preparation checklist for techs', detail: 'Before leaving the shop: job order reviewed, customer address confirmed, tools loaded, parts for likely repairs in the truck. Time spent organizing at the shop is always cheaper than driving back for a part.' },
      { action: 'Implement GPS tracking for fleet', detail: 'Samsara, Motive, or Verizon Connect. Know where every vehicle is in real time. Reduces personal use, improves dispatch accuracy, and provides liability protection if a vehicle is involved in an incident.' },
      { action: 'Set up a priority dispatch protocol for emergency calls', detail: 'Define what qualifies as emergency (no heat/cooling in extreme weather, active leak, no power). Define your SLA: "Emergency calls receive a same-day response." Protect your emergency pricing — emergency calls command premium rates.' },
      { action: 'Build a parts inventory and truck stock process', detail: 'The most common repairs for your trade should always be on the truck. Calculate your top 20 parts by call frequency and keep them stocked. Every "I need to come back with a part" call loses money and customer confidence.' },
    ],
    ninetyDayPlan: [
      { action: 'Track tech utilization rate monthly', detail: 'Billable hours ÷ paid hours = utilization. Industry target is 65–75%. Below 60% means scheduling inefficiency, excessive drive time, or poor call mix. Above 80% means the schedule is too tight and quality may suffer.' },
      { action: 'Create a CSR/dispatcher role or define dispatcher responsibilities', detail: 'As volume grows past 5–6 calls per day, the owner cannot dispatch and do the job. Either train an existing office person on dispatching or hire a part-time dispatcher. A good dispatcher pays for themselves in the first week.' },
      { action: 'Build a weekly capacity planning process', detail: 'Monday morning: review booked calls for the week, identify open slots, review pending estimates, decide where to push marketing. Running capacity planning weekly prevents scrambling and prevents over-commitment.' },
      { action: 'Evaluate integration between scheduling and accounting', detail: 'Jobber and Housecall Pro connect directly to QuickBooks. Every closed job creates an invoice automatically. This eliminates duplicate data entry and keeps revenue recognition current.' },
    ],
    whatToMeasure: [
      'Tech utilization rate (billable hours ÷ paid hours)',
      'Average calls per tech per day',
      'On-time arrival rate (% of jobs within arrival window)',
      'First-time fix rate (% of calls resolved without return trip)',
      'Emergency call response time (hours from call to tech on-site)',
    ],
    commonMistakes: [
      'Scheduling from memory or personal phone — not scalable and creates dependencies that break when the owner is unavailable',
      'Allowing techs to self-schedule — creates geographic inefficiency and inconsistent customer experience',
      'Not routing jobs by geography — cross-town routing is expensive in fuel, time, and tech morale',
      'Skipping customer communication — an on-the-way text eliminates 80% of "where are they" calls to the office',
      'Not tracking idle time or drive time — you cannot fix what you do not measure',
    ],
    salesImpact: 'A technician running 4 calls per day versus 3 calls per day at $400 average job generates $400 more revenue per day, $2,000 per week, $8,000 per month — from the same truck and the same wage.',
    operationalImpact: 'Tight dispatch and scheduling is the operational foundation for every other growth initiative. You cannot hire more techs efficiently if you cannot dispatch the ones you have.',
    brandImpact: 'Customers judge contractors heavily on professionalism of scheduling — arrival windows, notifications, and not making them wait all day. This directly drives review scores and repeat business.',
    financialImpact: 'Improving tech utilization from 60% to 70% on a 2-tech operation at $120/hour revenue rate adds $9,600/month in revenue from existing payroll — before any new hires.',
    recommendedVendorIds: ['servicetitan', 'jobber', 'housecall-pro', 'samsara', 'motive', 'fieldedge'],
    basicVisibleGuidance:
      'Get all jobs on a shared platform. Zone your service area. Send automated customer notifications. Track tech utilization monthly. These four moves transform scheduling from a daily crisis into a growth engine.',
    lockedUpgradePreview:
      'Daily dispatch checklist · Tech morning briefing template · Zone-based scheduling guide by market size · Capacity planning spreadsheet · Emergency call protocol · Parts inventory management guide · CSR/dispatcher training guide',
    upgradeModuleTitle: 'Dispatch & Field Operations System',
    completionImpactScore: 4,
    relatedPlaybookIds: [],
    relatedFlyerIds: [],
  },

  // ── Phase 9 ──────────────────────────────────────────────────────────────────
  {
    id: 'technician-performance',
    phaseNumber: 9,
    title: 'Technician Performance & Field Process',
    shortTitle: 'Field Performance',
    targetStages: ['growth', 'scale'],
    scoreRange: { min: 30, max: 90 },
    tradeFit: ['hvac', 'plumbing', 'electrical', 'construction'],
    icon: '🔧',
    mainBusinessProblem:
      'Technicians who do not follow a diagnostic process, do not present options, and do not sell agreements leave significant revenue on the table on every call.',
    whyItMatters:
      'The technician is your primary revenue generator. Their diagnostic thoroughness, their ability to present options honestly, and their professionalism directly determine average ticket, close rate, and customer satisfaction. A tech who runs 4 calls per day and presents one option per call at $350 average generates $1,400. The same tech presenting Good/Better/Best on qualifying calls and offering a maintenance agreement generates $1,900–$2,200 — from the same schedule. Tech performance is the highest-leverage investment a growing contractor can make.',
    symptoms: [
      'Wide variance in average ticket between technicians on similar call types',
      'Techs completing calls without offering maintenance agreements',
      'Customers calling back with "nothing was fixed" or "same issue returned"',
      'No standard diagnostic process — every tech diagnoses differently',
      'Techs avoiding difficult conversation about full system replacement when needed',
    ],
    immediateAction:
      'Create a diagnostic checklist for your top 3 most common service call types. Every tech uses it on every call. The checklist does not need to be long — it just needs to ensure nothing is missed and every relevant upsell or safety item is evaluated.',
    thirtyDayPlan: [
      { action: 'Create trade-specific diagnostic checklists', detail: 'HVAC: filter condition, thermostat, refrigerant level, electrical connections, blower condition, heat exchanger (gas), coil condition. Plumbing: water pressure, water heater condition, shutoff valve operation, visible leaks, drain condition, water quality. Electrical: panel condition, breaker age, GFCI/AFCI, visible wiring issues, grounding.' },
      { action: 'Define Good/Better/Best option presentation for top 5 call types', detail: 'For each common repair scenario, pre-define what the low/mid/high options are. Techs should not have to create options on-the-spot — they should work from a framework. This reduces anxiety about presenting options and improves consistency.' },
      { action: 'Implement a photo documentation requirement on every call', detail: 'Every tech photos the equipment, the problem identified, and the completed work. CompanyCam is purpose-built for this. Photos protect against callbacks, support recommendation credibility, and create a record for future calls.' },
      { action: 'Train techs on agreement offer timing and language', detail: 'The agreement offer happens at the end of the service, after the repair is complete and the customer is satisfied. Not as a pitch — as a natural service extension. Role-play this until it is comfortable.' },
    ],
    sixtyDayPlan: [
      { action: 'Run weekly one-on-one tech performance reviews', detail: '15 minutes per tech per week. Review calls from prior week: average ticket, agreements offered, agreements sold, callbacks, customer satisfaction. Recognize wins. Address gaps. Consistency makes this valuable.' },
      { action: 'Implement ride-alongs for lower-performing techs', detail: 'Ride with struggling techs, not to supervise — to observe, coach, and model the diagnostic and presentation process. The most valuable feedback happens in the field, not in a meeting room.' },
      { action: 'Build a compensation structure that rewards performance', detail: 'Commission on maintenance agreements, bonus on average ticket above threshold, recognition for zero callbacks. Techs perform to the incentives you create. Flat hourly with no performance incentive creates flat performance.' },
      { action: 'Create a standard job completion checklist', detail: 'System fully operational, area cleaned, customer walked through work completed, next service or recommendation mentioned, review request made, invoice presented. Every call, every tech.' },
    ],
    ninetyDayPlan: [
      { action: 'Track average ticket and close rate by tech monthly', detail: 'Post metrics on a visible team board — not to shame, but to create accountability and friendly competition. Top performers often coach others informally once metrics are visible.' },
      { action: 'Build a tech training library', detail: 'Short video walkthroughs of diagnostic procedures, product knowledge, and objection responses. Interplay Learning and SkillCat have trade-specific content. Your own 5-minute "how we handle this" videos are often more effective than outside training.' },
      { action: 'Consider a flat-rate compensation structure for experienced techs', detail: 'Techs paid on flat-rate (% of job revenue) are motivated to be efficient and to present options correctly. This model requires strong tech skills and pricing discipline — but aligns tech income with company revenue.' },
      { action: 'Implement a technician scorecard', detail: 'Monthly scorecard: average ticket, agreements sold, callbacks, customer satisfaction score, utilization rate. Share with each tech individually. Use it in annual performance conversations.' },
    ],
    whatToMeasure: [
      'Average ticket per tech per call',
      'Maintenance agreement offer rate (% of calls where agreement was offered)',
      'Agreement conversion rate per tech',
      'Callback rate per tech (callbacks within 30 days of service)',
      'Customer satisfaction score per tech',
    ],
    commonMistakes: [
      'Training once and expecting behavior change — field skills require repeated coaching',
      'Measuring only revenue output without measuring process (offer rate, diagnostic completeness)',
      'Not recognizing top performers publicly — recognition is free and highly effective',
      'Creating punitive metrics instead of coaching metrics',
      'Not providing techs a clear framework for presenting options — they avoid it if they feel unprepared',
    ],
    salesImpact: 'A systematic Good/Better/Best presentation with maintenance agreement offer on every qualifying call typically raises average ticket 20–40% without changing the call volume or marketing spend.',
    operationalImpact: 'Consistent diagnostic processes reduce callbacks, increase first-time fix rate, and create documentation that protects against warranty disputes and legal liability.',
    brandImpact: 'Technicians who are thorough, professional, and communicate clearly are your brand in the field. Every interaction either builds or erodes customer trust.',
    financialImpact: 'Moving a 3-tech operation from $380 average ticket to $480 average ticket at 4 calls per day per tech adds $14,400 per month in revenue from existing headcount.',
    recommendedVendorIds: ['interplay-learning', 'skillcat', 'companycam', 'servicetitan', 'housecall-pro'],
    basicVisibleGuidance:
      'Give every tech a diagnostic checklist. Train the Good/Better/Best framework. Require a maintenance agreement offer on every call. Track average ticket by tech monthly. These four practices unlock the revenue that is already sitting in your existing call volume.',
    lockedUpgradePreview:
      'Trade-specific diagnostic checklists · Good/Better/Best option scripts by trade and call type · Agreement offer scripts · Tech performance scorecard template · Ride-along coaching guide · Weekly one-on-one review framework · Incentive compensation structure guide',
    upgradeModuleTitle: 'Field Performance & Tech Coaching System',
    completionImpactScore: 5,
    relatedPlaybookIds: ['diagnostic-conversation', 'good-better-best', 'maintenance-agreement-sales', 'cross-sell-upsell'],
    relatedFlyerIds: [],
  },

  // ── Phase 10 ─────────────────────────────────────────────────────────────────
  {
    id: 'brand-social-media',
    phaseNumber: 10,
    title: 'Brand Building & Social Media',
    shortTitle: 'Brand',
    targetStages: ['early', 'growth', 'scale'],
    scoreRange: { min: 10, max: 90 },
    tradeFit: ['all'],
    icon: '📱',
    mainBusinessProblem:
      'Contractors without a visible brand presence compete entirely on price and referrals — with no ability to build recognition, charge premium rates, or attract customers who choose them before they even call.',
    whyItMatters:
      'Brand is the reason a customer calls you instead of the guy with the same truck. It is the reason they pay $50 more without asking why. In the trades, brand is built on three things: visual professionalism (truck, uniform, logo), proof of work (photos, reviews, before/after), and consistent presence (showing up in their social feed before they need you). This does not require a marketing agency — it requires a phone, a consistent posting habit, and a clear professional identity.',
    symptoms: [
      'No recognizable brand identity — no consistent logo, colors, or vehicle marking',
      'No social media presence or irregular posting with no strategy',
      'Google reviews and job photos are the only digital presence',
      'No before/after content showing quality of work',
      'Competing on price because customers see no differentiator',
    ],
    immediateAction:
      'Post one real job photo or before/after to your Google Business Profile and Facebook page today. No filters needed. A real photo of a complete, clean job communicates competence better than any designed graphic.',
    thirtyDayPlan: [
      { action: 'Build your core brand identity', detail: 'Logo (simple and legible), primary color, consistent name format. Use Canva if you do not have a designer — it has contractor logo templates. Print it on business cards, uniform shirts, and truck magnets at minimum.' },
      { action: 'Set up or complete social profiles: Facebook, Instagram, Google', detail: 'Consistent name, logo, bio with services and service area, contact information, website link. Every profile should send the same message: professional, local, capable.' },
      { action: 'Commit to a posting frequency you can maintain', detail: '3x per week is better than 7x per week for two weeks then nothing. Job photos, before/after, completed installs. Your phone camera is enough. Real work beats stock photos every time.' },
      { action: 'Start a "finished job" photo habit', detail: 'Every completed job gets a clean photo before you leave. System installed, area cleaned up, nameplate visible if applicable. Build a photo library. 30 days of consistent photos gives you months of content.' },
    ],
    sixtyDayPlan: [
      { action: 'Add short video content — even 30-second clips', detail: 'A quick walkthrough of what you found, what you did, and what it looked like before and after. No editing required. Post to Facebook Reels, Instagram Reels, and TikTok. Trades content performs extremely well on short video platforms — homeowners find it educational and trustworthy.' },
      { action: 'Build a seasonal content calendar', detail: 'Pre-plan posts around service needs: pre-summer AC prep, pre-winter heating tune-up, spring plumbing inspection, fall electrical safety. Content tied to seasonal urgency generates real calls.' },
      { action: 'Create a Google Business Profile posting schedule', detail: 'Google Business Profile posts (offers, updates, job photos) improve local search ranking. Post once per week minimum. Even a before/after photo with 2 sentences is enough.' },
      { action: 'Invest in truck or van branding', detail: 'A branded truck is a moving billboard. In a 50-mile service area, a properly branded vehicle generates 30,000–70,000 impressions per day according to OAAA research. A basic vinyl wrap pays for itself in brand recognition within 6–12 months.' },
    ],
    ninetyDayPlan: [
      { action: 'Build your 30-day social media starter plan', detail: 'Week 1: Business credibility (logo, team intro, truck photo, license/insurance highlight). Week 2: Educational content (seasonal tips, maintenance reminders, safety alerts). Week 3: Proof/trust (before/afters, customer testimonials, job highlights). Week 4: Offer/referral (maintenance plan CTA, referral program, seasonal offer).' },
      { action: 'Add LinkedIn for commercial credibility', detail: 'Commercial property managers, contractors, facility managers, and builders use LinkedIn. A professional company page with job project highlights and team credentials builds commercial credibility differently than Facebook or Instagram.' },
      { action: 'Evaluate social media scheduling tools', detail: 'Buffer, Metricool, or Hootsuite let you batch-schedule a week of posts in one sitting. Reduce the daily burden of posting. Batch Sunday evening, post all week.' },
      { action: 'Create branded uniform and vehicle standards', detail: 'Clean uniform, consistent logo placement, professional appearance. Send a clear message before a word is spoken. Customers consistently rank uniformed, branded technicians higher in trust surveys.' },
    ],
    whatToMeasure: [
      'Google Business Profile impressions and calls per month',
      'Social media follower growth rate',
      'Post engagement rate (likes, shares, comments per post)',
      'Inbound calls attributed to social or brand awareness',
      'Review count growth per month',
    ],
    commonMistakes: [
      'Inconsistent posting that builds and then goes dark — brand requires sustained presence, not bursts',
      'Using stock photos instead of real job photos — customers trust real work over generic imagery',
      'Not filming on-site with customer permission — verbal permission is sufficient for most content',
      'Starting with expensive video production before establishing a simple content habit',
      'Treating social media as a broadcast channel instead of a trust-building channel',
    ],
    salesImpact: 'Brand visibility creates calls from customers who choose you before they search — they remember seeing your truck, your post, or your reviews. These calls have a higher booking rate because the customer has already decided.',
    operationalImpact: 'A recognizable brand makes hiring easier — professionals prefer to work for companies with a visible brand identity. It also supports premium pricing in your market.',
    brandImpact: 'Social media presence converts past customers into brand advocates who share your content and refer friends. A 10,000-view video from a homeowner\'s neighborhood generates more trust than any ad.',
    financialImpact: 'Organic brand presence reduces paid advertising dependency. Contractors with strong brand recognition charge 10–20% more than competitors in the same market without meaningful pushback.',
    recommendedVendorIds: ['canva', 'buffer', 'metricool', 'capcut', 'adobe-express'],
    basicVisibleGuidance:
      'Post real job photos consistently. Film short before/after videos. Build your visual identity with logo and truck branding. Run the 30-day social starter plan. Brand is not built in a day — but it builds compoundingly, and contractors who start early have a massive advantage over those who start late.',
    lockedUpgradePreview:
      '30-day social media starter plan with daily post ideas · Caption prompt library by trade · Short video script guide · Seasonal content calendar · Brand identity checklist · Platform-by-platform setup guide · Content batch scheduling system · Commercial brand credibility guide',
    upgradeModuleTitle: 'Contractor Brand & Social Media System',
    completionImpactScore: 3,
    relatedPlaybookIds: [],
    relatedFlyerIds: ['seasonal-hvac-tuneup', 'new-contractor-intro', 'referral-program'],
  },

  // ── Phase 11 ─────────────────────────────────────────────────────────────────
  {
    id: 'referrals-upsells-crosssells',
    phaseNumber: 11,
    title: 'Referrals, Upsells & Cross-Sells',
    shortTitle: 'Referrals',
    targetStages: ['growth', 'scale'],
    scoreRange: { min: 25, max: 90 },
    tradeFit: ['all'],
    icon: '🔁',
    mainBusinessProblem:
      'Not maximizing the value of every existing customer relationship means constantly spending money to acquire new customers while underutilizing the ones you already have.',
    whyItMatters:
      'The customer in front of you is the cheapest sale you will ever make. They already trust you, they already let you in their home or building, and they have a system you understand. A contractor who builds a referral system, identifies cross-sell opportunities on every call, and follows up after every job earns 30–50% more per customer per year without changing their marketing budget. Every dollar of referral or cross-sell revenue has near-zero acquisition cost.',
    symptoms: [
      'No formal referral program — just hoping customers mention you',
      'Not identifying or mentioning adjacent service opportunities during calls',
      'Customers discovering they need an HVAC, plumbing, or electrical repair from a competitor',
      'Not tracking where referrals come from or who sends them',
      'No cross-trade referral partnerships with complementary contractors',
    ],
    immediateAction:
      'Ask your last 10 completed customers for one referral today. Use this language: "I really appreciate your business. If you know anyone who needs [service], I would take great care of them — and I\'d really appreciate the referral." That is all. No card, no program required. Just ask.',
    thirtyDayPlan: [
      { action: 'Build a simple referral ask into the job completion process', detail: 'After every completed job and review request: "Do you know anyone who might need [service]? We always take extra care of referrals from our best customers." Track every referral by source. After 30 days you will know who your top referral sources are.' },
      { action: 'Create a referral incentive program', detail: 'Keep it simple: $25–$50 account credit or service discount for the referring customer. Not cash — service credits create loyalty and come back as revenue. Print a simple referral card with the offer.' },
      { action: 'Build a cross-sell checklist per trade', detail: 'HVAC: IAQ, humidifier, thermostat, maintenance plan, duct cleaning, surge protection. Plumbing: water heater, water quality, shutoff valves, sump pump, drain maintenance. Electrical: surge protection, panel health, smoke/CO, EV readiness, generator. Use during diagnostics — identify, photo, report, offer.' },
      { action: 'Start building trade referral partnerships', detail: 'Identify one HVAC, one plumber, one electrician, one roofer, and one remodeler in your area who is not a direct competitor. Propose a mutual referral exchange. This creates a free, high-trust lead channel that grows over time.' },
    ],
    sixtyDayPlan: [
      { action: 'Train techs on cross-sell identification and language', detail: '"While I was here, I noticed your water heater is showing corrosion on the connections. It\'s not an emergency, but something to watch. Want me to include an inspection in our report?" Soft, honest, customer-first. No pressure — just awareness.' },
      { action: 'Build a property manager referral strategy', detail: 'Property managers control multiple units. One relationship = multiple recurring jobs. Offer priority scheduling, easy invoicing, and a commercial account setup. A single property manager referral can be worth $10,000–$50,000 per year in service volume.' },
      { action: 'Create a referral partner recognition system', detail: 'Send a thank-you note, a gift card, or a personal call to every referral partner after their first send. Reinforce the relationship. Partners who feel appreciated send more referrals. Partners who are ignored stop sending.' },
      { action: 'Segment your customer database by job type and recency', detail: 'Identify customers who have used one service but not others. Example: HVAC customers who have not had a plumbing call. A targeted "Did you know we also..." campaign to these customers generates cross-trade conversions.' },
    ],
    ninetyDayPlan: [
      { action: 'Track attach rate per tech and per call type', detail: 'Attach rate = % of calls where an upsell or cross-sell recommendation was made. Target 30–40% on residential service calls. Track by tech — low attach rate techs need coaching on identification and soft presentation.' },
      { action: 'Build a real estate / home sale referral strategy', detail: 'Real estate agents, home inspectors, and closing attorneys refer sellers who need inspections and buyers who need work completed quickly. These are high-urgency calls that often involve multiple trades. Develop one realtor relationship this quarter.' },
      { action: 'Build an annual customer value goal', detail: 'Target average revenue per customer per year. Year 1 customer: $600 service. Year 2 target: $800 with agreement. Year 3 target: $1,200 with replacement or upgrade. A deliberate annual customer value target transforms how you think about every interaction.' },
      { action: 'Review cross-sell and referral metrics in monthly business review', detail: 'Referral count and source, referral conversion rate, attach rate by tech, cross-sell revenue, partner referral count. These metrics tell you where relationship-based revenue is coming from and where to invest more attention.' },
    ],
    whatToMeasure: [
      'Referral count per month and referral source',
      'Referral conversion rate (referred leads → booked jobs)',
      'Attach rate per tech (% of calls with upsell/cross-sell offer)',
      'Average annual revenue per customer',
      'Cross-trade referral partner count and lead volume per partner',
    ],
    commonMistakes: [
      'Not asking for referrals because it feels uncomfortable — the ask is a compliment; customers who like you are happy to refer',
      'Offering cash for referrals — service credits come back as revenue and build stronger loyalty',
      'Presenting cross-sell recommendations without finding a real need first — always diagnose before recommending',
      'Building referral partnerships with contractors who are slow or unreliable — one bad experience poisons the relationship',
      'Not tracking referral sources — without data, you cannot reinforce your best channels',
    ],
    salesImpact: 'Contractors with active referral programs and systematic cross-sell processes earn 30–50% more per customer per year. Referral customers also have a significantly higher lifetime value than cold-acquired customers.',
    operationalImpact: 'Cross-sell and referral systems create organic revenue growth without proportional marketing cost increases — protecting margin as the business scales.',
    brandImpact: 'A contractor known for honest recommendations and who customers actively refer becomes a community brand rather than just a service provider. This drives premium pricing and loyalty.',
    financialImpact: 'Referral revenue has near-zero acquisition cost. Moving 20% of new customer revenue from paid channels to referral channels adds 8–15% to net margin on that revenue.',
    recommendedVendorIds: ['jobber', 'housecall-pro', 'podium', 'companycam'],
    basicVisibleGuidance:
      'Ask every happy customer for a referral. Build trade partnerships with complementary contractors. Train techs on the cross-sell checklist. Track every referral source. These four habits compound over time into your most cost-effective growth engine.',
    lockedUpgradePreview:
      'Referral ask scripts · Referral card template · Cross-sell checklists by trade · Trade partner referral agreement template · Property manager pitch guide · Real estate agent referral strategy · Attach rate tracking dashboard · Annual customer value calculator',
    upgradeModuleTitle: 'Referral & Cross-Sell Revenue System',
    completionImpactScore: 4,
    relatedPlaybookIds: ['referral-system', 'cross-sell-upsell'],
    relatedFlyerIds: ['referral-program', 'financing-available'],
  },

  // ── Phase 12 ─────────────────────────────────────────────────────────────────
  {
    id: 'scaling-hiring-leadership',
    phaseNumber: 12,
    title: 'Scaling, Hiring, Leadership & Financial Control',
    shortTitle: 'Scaling',
    targetStages: ['growth', 'scale'],
    scoreRange: { min: 40, max: 100 },
    tradeFit: ['all'],
    icon: '📈',
    mainBusinessProblem:
      'When the owner is the bottleneck in every department — sales, dispatch, operations, and finance — the business has a hard ceiling that no marketing or lead flow can break through.',
    whyItMatters:
      'The transition from owner-operator to business owner is the hardest shift in contracting. It requires building systems that run without the owner, hiring and developing people who execute those systems, and managing the business through KPIs and financial controls rather than personal involvement in every call. Contractors who make this transition successfully build businesses with real enterprise value. Contractors who do not stay stuck earning a job wage forever, regardless of how busy they are.',
    symptoms: [
      'Owner is the only one who can estimate, dispatch, and handle difficult customers',
      'Revenue hits a plateau because there are only so many hours in the owner\'s day',
      'Hiring attempts have failed because there was no process to train into',
      'No financial controls — the owner approves every purchase personally',
      'No clarity on which revenue level supports which headcount',
    ],
    immediateAction:
      'Write down every task you do in a week. Separate them into two lists: things only you can do (relationship decisions, final financial authority, strategic calls) and things someone else could do with proper training and a process. The second list is your first delegation target.',
    thirtyDayPlan: [
      { action: 'Define the 3 roles your business most needs in the next 12 months', detail: 'Common contractor growth roles: dispatcher/CSR, lead technician/field supervisor, estimator, service manager. Define what each role does and what success looks like before posting a job listing. Never hire a person without a defined role.' },
      { action: 'Build your first written standard operating procedure (SOP)', detail: 'Pick one repeatable process the owner currently controls: morning dispatch, estimate follow-up, invoice collection. Write down every step. This document lets someone else do it consistently.' },
      { action: 'Move to a weekly P&L review cadence', detail: 'Revenue, COGS, gross margin, overhead, net profit. Compare to plan. If you do not have a plan, set one this month. You cannot scale what you do not measure weekly.' },
      { action: 'Define owner salary separately from business profit', detail: 'Pay yourself a market-rate salary for your role. Profit distributions come from what remains. This is the clearest financial boundary between owner income and business performance — and it is required for any future valuation or lending conversation.' },
    ],
    sixtyDayPlan: [
      { action: 'Make your first leadership hire or promotion', detail: 'A lead technician who can run calls independently, train newer techs, and handle field escalations is the most high-leverage first hire for most service contractors. Promote from within when possible — they know your systems and your customers.' },
      { action: 'Implement a weekly management meeting', detail: 'Owner + key leads. 30 minutes. Agenda: previous week revenue vs. plan, open issues, top priority for current week, anything blocking anyone. Consistency creates accountability and shared visibility.' },
      { action: 'Build a technician incentive and development path', detail: 'Apprentice → Technician → Senior Technician → Lead Technician → Service Manager. Clear steps with clear compensation and clear performance metrics at each level. Techs who see a path stay. Techs who see a ceiling leave.' },
      { action: 'Set financial controls for the growing business', detail: 'Spending authority limits by role. Owner approval over $X. Manager approval over $Y. No one has a company card without a documented expense policy. These controls prevent the financial bleed that kills growing contractors.' },
    ],
    ninetyDayPlan: [
      { action: 'Build a 90-day business plan every quarter', detail: 'Revenue goal, headcount plan, marketing budget, top 3 operational priorities. Review at the end of each quarter. Contractors who plan quarterly grow 2–3x faster than those who operate reactively.' },
      { action: 'Set up a KPI dashboard the leadership team reviews weekly', detail: 'Revenue per tech, average ticket, close rate, agreements sold, callbacks, Google reviews. Every key metric on one page. Every key team member sees the same numbers. This is management by fact, not by feel.' },
      { action: 'Begin building a business valuation perspective', detail: 'A service business with strong recurring revenue (agreements), documented systems (SOPs), trained staff, and clean financials sells for 3–6x EBITDA. A business that depends on the owner sells for 1–2x or is unsellable. Build toward the higher multiple — even if you never plan to sell.' },
      { action: 'Join a peer group or coaching network', detail: 'Nexstar Network, BDR, and Service Nation Alliance are contractor-specific business coaching and peer group organizations. The ROI on peer group membership — accountability, benchmarking, shared best practices — is among the highest-return investments a growing contractor can make.' },
    ],
    whatToMeasure: [
      'Revenue per technician per month (efficiency metric)',
      'Owner hours worked per week vs. revenue (dependency metric)',
      'Number of documented SOPs (systems metric)',
      'Employee retention rate (culture/management metric)',
      'EBITDA margin and growth rate (financial control metric)',
    ],
    commonMistakes: [
      'Hiring people before the process is defined — good people fail in undefined roles',
      'Delegating without training — tasks handed off without systems create problems faster than they solve them',
      'Keeping financial visibility to the owner only — key managers need the numbers to make good decisions',
      'Treating every hire as a test of the concept — hiring requires commitment to training and onboarding',
      'Not investing in your own leadership development — the business grows as far as the owner grows',
    ],
    salesImpact: 'Scaling from owner-dependent to systems-dependent creates a business that can handle 2–3x the call volume with structured sales processes that survive without the owner on every call.',
    operationalImpact: 'Documented systems and defined roles enable delegation, consistent execution, and the ability to hire, train, and retain talent at every level.',
    brandImpact: 'A professional, leadership-driven company with clear standards and consistent execution builds a brand that attracts both customers and talent — and commands premium rates.',
    financialImpact: 'A business with documented systems, strong recurring revenue, and trained leadership sells for 3–6x EBITDA vs. 1–2x for owner-dependent operations. Systems build real enterprise value.',
    recommendedVendorIds: ['servicetitan', 'gusto', 'adp', 'quickbooks', 'nexstar-network', 'bdr-training'],
    basicVisibleGuidance:
      'Define roles before hiring. Write your first SOP. Review your P&L weekly. Pay yourself a salary and manage profit separately. These foundations are what separate businesses that scale from businesses that plateau at the owner\'s personal capacity.',
    lockedUpgradePreview:
      'Job description templates for dispatcher, CSR, lead tech, service manager, estimator · SOP templates for dispatch, invoicing, follow-up, hiring · KPI dashboard template · 90-day business planning guide · Technician career path and compensation matrix · Owner extraction roadmap · Business valuation primer for contractors',
    upgradeModuleTitle: 'Contractor Scaling & Leadership System',
    completionImpactScore: 5,
    relatedPlaybookIds: [],
    relatedFlyerIds: [],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

export function getGrowthPhases(): GrowthPhase[] {
  return GROWTH_PHASES
}

export function getPhaseById(id: string): GrowthPhase | undefined {
  return GROWTH_PHASES.find(p => p.id === id)
}

export function getPhasesForScore(score: number): GrowthPhase[] {
  return GROWTH_PHASES.filter(p => score <= p.scoreRange.max).sort((a, b) => a.phaseNumber - b.phaseNumber)
}
