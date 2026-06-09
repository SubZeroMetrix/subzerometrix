import type { ScoreResult } from '@/lib/scoring'

export type GrowthLayer = 'sales' | 'brand' | 'operations'
export type TempStatus = 'sub-zero' | 'cold' | 'warming' | 'hot'

export const TEMP_CONFIG: Record<TempStatus, { label: string; color: string; bg: string; barPct: number }> = {
  'sub-zero': { label: 'Sub-Zero', color: '#4A90D9', bg: 'rgba(74,144,217,0.12)',  barPct: 5   },
  'cold':     { label: 'Cold',     color: '#7BB3D9', bg: 'rgba(123,179,217,0.12)', barPct: 25  },
  'warming':  { label: 'Warming',  color: '#EF9F27', bg: 'rgba(239,159,39,0.12)',  barPct: 60  },
  'hot':      { label: 'Hot',      color: '#1D9E75', bg: 'rgba(29,158,117,0.12)',  barPct: 100 },
}

export const SCORE_IMPACT_PER_TAB = 1.5

export interface GrowthVendor {
  name: string
  category: string
  whatItHelps: string
  bestFor: string
  whyRecommended: string
  url: string
  affiliateId: string | null
  isFree: boolean
  priceRange: string
}

export interface GrowthAction {
  title: string
  description: string
  timeframe: string
}

export interface GrowthRoadmapTab {
  id: string
  layer: GrowthLayer
  title: string
  subtitle: string
  scoreImpact: number
  whyItMatters: string
  currentWeaknessSignal: string
  primaryAction: GrowthAction
  alternativeAction: GrowthAction
  quickWin: string
  whatToMeasure: string
  salesImpact: string
  vendors: GrowthVendor[]
  relevantFor: string[]
  priorityWhenScoreBelow: number
}

const GROWTH_TABS: GrowthRoadmapTab[] = [
  {
    id: 'lead-flow',
    layer: 'sales',
    title: 'Lead Flow',
    subtitle: 'Getting found and generating consistent inbound interest',
    scoreImpact: SCORE_IMPACT_PER_TAB,
    whyItMatters: 'Without a predictable lead system you take any job that calls, discount to stay busy, and cannot plan 30 days ahead. Contractors with consistent lead flow get to be selective, price properly, and plan crew schedules. Word of mouth is not a system — it is luck.',
    currentWeaknessSignal: 'No structured channel generating consistent inbound leads. Dependent on referrals or past customers without an active source you control.',
    primaryAction: {
      title: 'Fully complete your Google Business Profile',
      description: 'Claim your profile at business.google.com. Add every service you offer, your full service area, business hours, and at least 10 job photos. Write a description using your trade and city. This is the highest-return free marketing move for any local contractor.',
      timeframe: 'This week',
    },
    alternativeAction: {
      title: 'List on Angi, Thumbtack, and Houzz Pro simultaneously',
      description: 'These platforms connect you to homeowners who are actively searching and ready to hire. Response time is critical — leads not contacted within 5 minutes convert at a fraction of the rate. Build your own presence in parallel.',
      timeframe: 'This month',
    },
    quickWin: 'Go to business.google.com right now. Verify your profile is marked complete and has at least 5 photos of real work.',
    whatToMeasure: 'Inbound leads per week. Source of each lead (GBP, referral, paid, social).',
    salesImpact: 'Contractors with a complete GBP and 20+ reviews typically get 3–8 more inbound calls per month. At $600 average job = $1,800–$4,800/month additional.',
    vendors: [
      {
        name: 'Google Business Profile',
        category: 'Local Search',
        whatItHelps: 'Appear in Google Maps and local search results when homeowners search your trade',
        bestFor: 'Budget Pick — Free',
        whyRecommended: 'Highest ROI of any lead channel for local contractors. Completely free and directly tied to inbound call volume.',
        url: 'https://business.google.com',
        affiliateId: null,
        isFree: true,
        priceRange: 'Free',
      },
      {
        name: 'Angi Pro',
        category: 'Lead Generation',
        whatItHelps: 'Connects you with homeowners actively searching for your trade',
        bestFor: 'Solo / Startup',
        whyRecommended: 'Good volume of ready-to-buy leads while you build organic presence. Respond within 5 minutes for best conversion.',
        url: 'https://www.angi.com/pro',
        affiliateId: 'angi',
        isFree: false,
        priceRange: 'Pay-per-lead or monthly plan',
      },
      {
        name: 'Thumbtack Pro',
        category: 'Lead Generation',
        whatItHelps: 'Bid on local service requests from homeowners in your area',
        bestFor: 'Growing Team',
        whyRecommended: 'Pay only for leads you choose to pursue. Lower commitment than Angi for testing a new service area.',
        url: 'https://www.thumbtack.com/pro',
        affiliateId: 'thumbtack',
        isFree: false,
        priceRange: 'Pay-per-lead',
      },
    ],
    relevantFor: [],
    priorityWhenScoreBelow: 75,
  },

  {
    id: 'close-rate',
    layer: 'sales',
    title: 'Close Rate',
    subtitle: 'Converting more quotes into paid jobs',
    scoreImpact: SCORE_IMPACT_PER_TAB,
    whyItMatters: 'Most contractors close 30–50% of quotes. Contractors with a repeatable process close 60–75%. That gap is pure revenue left on the table without spending more on marketing. You already paid for the lead — now close it.',
    currentWeaknessSignal: 'No defined quote follow-up process. Quotes are sent and forgotten. Customers are lost to competitors not because of price, but because someone else followed up.',
    primaryAction: {
      title: 'Build a 3-touch quote follow-up sequence',
      description: 'Day 2 — text or email referencing the specific job and their timeline. Day 7 — a personal call asking what questions they have. Day 21 — a seasonal or availability reminder. Three touches recovers 15–25% of quotes that would have gone cold.',
      timeframe: 'This week',
    },
    alternativeAction: {
      title: 'Build a professional quote presentation format',
      description: 'A quote that shows exactly what the customer gets, what it costs, and why you are the right choice closes at a higher rate than a plain number. Even a clean PDF or a formatted Jobber quote makes a measurable difference.',
      timeframe: 'This month',
    },
    quickWin: 'Pull every open quote from the last 30 days. Send a personal text to each one today — not a template, a real message referencing their specific job.',
    whatToMeasure: 'Quotes sent vs. jobs won per week. Close rate as a percentage.',
    salesImpact: 'Moving from 40% to 55% close rate on 10 quotes/month at $800 avg = $1,200 more monthly revenue with zero additional marketing spend.',
    vendors: [
      {
        name: 'Jobber',
        category: 'Quoting + Follow-Up',
        whatItHelps: 'Professional quotes, automatic follow-up reminders, and one-click quote approval for customers',
        bestFor: 'Growing Team',
        whyRecommended: 'Automated quote follow-up alone recovers an average of 1–2 jobs per month for contractors using it consistently.',
        url: 'https://getjobber.com',
        affiliateId: 'jobber',
        isFree: false,
        priceRange: '$49–$149/mo',
      },
      {
        name: 'Housecall Pro',
        category: 'Mobile Quoting',
        whatItHelps: 'Mobile-friendly quotes, digital approval, and automated follow-up messages to open quotes',
        bestFor: 'Solo / Startup',
        whyRecommended: 'Strong mobile quoting experience for contractors who quote on-site. Customers approve from their phone.',
        url: 'https://www.housecallpro.com',
        affiliateId: 'housecall-pro',
        isFree: false,
        priceRange: '$49–$129/mo',
      },
    ],
    relevantFor: [],
    priorityWhenScoreBelow: 70,
  },

  {
    id: 'pricing-estimating',
    layer: 'sales',
    title: 'Pricing & Estimating',
    subtitle: 'Knowing your numbers and pricing every job for profit',
    scoreImpact: SCORE_IMPACT_PER_TAB,
    whyItMatters: 'Pricing by gut feel is the most common reason trades businesses quietly go broke. You can be fully booked and still losing money on every job. A real pricing model accounts for all costs plus a profit margin — not just labor and materials.',
    currentWeaknessSignal: 'No documented pricing floor. Estimating is done by feel or to match a competitor, not from a cost model that guarantees profit on every job.',
    primaryAction: {
      title: 'Build a cost-per-hour pricing floor',
      description: 'List every fixed monthly cost: insurance, truck, tools, phone, gas, subscriptions. Divide by billable hours per month. That is your break-even hourly rate. Add a target profit margin on top. This is your floor — never quote below it.',
      timeframe: 'This week',
    },
    alternativeAction: {
      title: 'Implement flat-rate pricing for your top 5 job types',
      description: 'Flat-rate pricing removes the guesswork for customers and the risk for you. Build your 5 most common jobs into fixed packages. Customers prefer a clear price, and you protect your margin on every job regardless of how long it takes.',
      timeframe: 'This month',
    },
    quickWin: 'Calculate your actual overhead cost per billable hour this week. Add up all monthly fixed costs and divide by billable hours. Most contractors are surprised — the number is higher than they think.',
    whatToMeasure: 'Average job revenue. Gross margin per job type. Percentage of jobs over your pricing floor.',
    salesImpact: 'A 10% price increase on a $400K revenue business = $40K more annually without a single additional customer.',
    vendors: [
      {
        name: 'Jobber',
        category: 'Estimating / Price Lists',
        whatItHelps: 'Line-item estimating, product and service price lists, and professional PDF quotes',
        bestFor: 'Growing Team',
        whyRecommended: 'Price list feature lets you standardize pricing once and apply it consistently — no more underquoting your most profitable jobs.',
        url: 'https://getjobber.com',
        affiliateId: 'jobber',
        isFree: false,
        priceRange: '$49–$149/mo',
      },
      {
        name: 'Housecall Pro',
        category: 'Flat-Rate Pricing',
        whatItHelps: 'Flat-rate pricebook, on-site quoting, and good/better/best option presentation',
        bestFor: 'Solo / Startup',
        whyRecommended: 'Best flat-rate pricing experience for HVAC, plumbing, and service-call businesses. The good/better/best feature consistently increases average ticket.',
        url: 'https://www.housecallpro.com',
        affiliateId: 'housecall-pro',
        isFree: false,
        priceRange: '$49–$129/mo',
      },
      {
        name: 'BuilderTrend',
        category: 'Construction Estimating',
        whatItHelps: 'Full construction estimating, bid management, and project costing for larger jobs',
        bestFor: 'Premium Option',
        whyRecommended: 'Built for general contractors and remodelers handling $100K+ projects. Overkill for service-call work but right for construction-heavy contractors.',
        url: 'https://buildertrend.com',
        affiliateId: 'buildertrend',
        isFree: false,
        priceRange: '$199–$499/mo',
      },
    ],
    relevantFor: [],
    priorityWhenScoreBelow: 65,
  },

  {
    id: 'average-ticket',
    layer: 'sales',
    title: 'Average Ticket',
    subtitle: 'Getting more revenue from every job you already win',
    scoreImpact: SCORE_IMPACT_PER_TAB,
    whyItMatters: 'You already paid to get the lead, drove to the job, and earned trust. Getting more from each job is faster and cheaper than getting more jobs. Increasing average ticket by 15–20% has zero additional marketing cost.',
    currentWeaknessSignal: 'Single-option quoting on every job. Presenting only the minimum required scope — leaving upgrade revenue on the table from customers who would have said yes to a better option.',
    primaryAction: {
      title: 'Present good/better/best on every major quote',
      description: 'For every job over $300, build three options: Good (minimum viable), Better (recommended), Best (full solution). Customers who want value self-select the middle or top tier. You stop underserving customers who would pay more for peace of mind.',
      timeframe: 'This month',
    },
    alternativeAction: {
      title: 'Add a walkthrough inspection to every job',
      description: 'Before you leave any job, walk the customer through what you saw while you were there. Note related systems needing attention. Present what you found. Conversion on additional work found on-site runs 40–60%.',
      timeframe: 'This week',
    },
    quickWin: 'On your next 3 quotes, add a complete option that is 25–30% higher than your standard quote. See what happens.',
    whatToMeasure: 'Average invoice value per job. Percentage of jobs with an upgrade or add-on.',
    salesImpact: 'Increasing average ticket from $450 to $525 on 40 jobs/month = $3,000/month more revenue without a single new customer.',
    vendors: [
      {
        name: 'Housecall Pro',
        category: 'Good/Better/Best Quoting',
        whatItHelps: 'Built-in tiered quote presentation that customers approve on their phone',
        bestFor: 'Solo / Startup',
        whyRecommended: 'One of the few field software platforms with native good/better/best built into the quoting flow.',
        url: 'https://www.housecallpro.com',
        affiliateId: 'housecall-pro',
        isFree: false,
        priceRange: '$49–$129/mo',
      },
      {
        name: 'Jobber',
        category: 'Quote Packages',
        whatItHelps: 'Optional line items and package-based quoting to present tiered options',
        bestFor: 'Growing Team',
        whyRecommended: 'Optional line items let you build upgrade packages into any quote. Customers check off add-ons before approving.',
        url: 'https://getjobber.com',
        affiliateId: 'jobber',
        isFree: false,
        priceRange: '$49–$149/mo',
      },
    ],
    relevantFor: [],
    priorityWhenScoreBelow: 70,
  },

  {
    id: 'cross-selling',
    layer: 'sales',
    title: 'Cross-Selling',
    subtitle: 'Finding and presenting related work to customers already on-site',
    scoreImpact: SCORE_IMPACT_PER_TAB,
    whyItMatters: 'Your existing customers already trust you — it costs 5x less to sell to them than to acquire a new customer. Contractors who cross-sell consistently build more stable revenue and reduce dependency on new lead volume.',
    currentWeaknessSignal: 'Jobs completed and invoiced with no presentation of related work observed during the visit. Revenue from existing customer relationships left on the table every day.',
    primaryAction: {
      title: 'Build a 5-minute job walkthrough into every visit',
      description: 'Before you leave every job, do a brief visual of adjacent systems or related areas. Note what you see. Present your findings before you leave. "While I was here, I noticed your X — want me to take a look?" is not pushy. It is professional.',
      timeframe: 'This week',
    },
    alternativeAction: {
      title: 'Create a simple upsell menu for your most common job types',
      description: 'List 3–5 services that naturally accompany your core work. Include them in your invoice follow-up or hand the list to the customer before you leave. A drain cleaning customer who gets a card for water heater maintenance books it 20–30% of the time.',
      timeframe: 'This month',
    },
    quickWin: 'On your next job, spend 5 minutes looking for one related issue before you leave. Mention it. You will be surprised how often they say yes.',
    whatToMeasure: 'Percentage of jobs with a second service added. Monthly revenue from cross-sells specifically.',
    salesImpact: 'Adding $150 in secondary work to 30% of 40 monthly jobs = $1,800/month with no additional marketing cost.',
    vendors: [
      {
        name: 'Housecall Pro',
        category: 'Service Recommendations',
        whatItHelps: 'Customer history, previous job notes, and service reminders for follow-up conversations',
        bestFor: 'Solo / Startup',
        whyRecommended: 'The customer history view shows what work you have done before and what was noted — making cross-sell conversations natural.',
        url: 'https://www.housecallpro.com',
        affiliateId: 'housecall-pro',
        isFree: false,
        priceRange: '$49–$129/mo',
      },
      {
        name: 'Jobber',
        category: 'Job Notes / Client History',
        whatItHelps: 'Job notes, property details, and follow-up reminders to surface cross-sell opportunities',
        bestFor: 'Growing Team',
        whyRecommended: 'Property notes mean every tech who visits a customer knows what was flagged last time — enabling consistent cross-sell conversations.',
        url: 'https://getjobber.com',
        affiliateId: 'jobber',
        isFree: false,
        priceRange: '$49–$149/mo',
      },
    ],
    relevantFor: [],
    priorityWhenScoreBelow: 70,
  },

  {
    id: 'follow-up',
    layer: 'sales',
    title: 'Follow-Up',
    subtitle: 'Recovering lost quotes and staying in contact with past customers',
    scoreImpact: SCORE_IMPACT_PER_TAB,
    whyItMatters: 'Most customers who do not respond to a quote are not saying no — they are saying not yet. Most contractors follow up once or not at all. A consistent 3-touch follow-up system recovers 10–20% of quotes that would have gone cold with no additional marketing spend.',
    currentWeaknessSignal: 'Open quotes go cold after one or zero follow-ups. Past customers go months without contact. The customer list is not being worked as a revenue asset.',
    primaryAction: {
      title: 'Set up a 3-touch follow-up system for every open quote',
      description: 'Day 2: text or email — specific to their job, not a template. Day 7: personal call — ask what questions they have, not "are you ready." Day 21: seasonal or value reminder. Three touches is standard. One touch is average.',
      timeframe: 'This week',
    },
    alternativeAction: {
      title: 'Set up automated post-job messages for review requests and check-ins',
      description: 'An automatic text sent 24 hours after job completion — thanking them and including your Google review link — converts at 40–60% for customers who were satisfied. Requires field software with automation.',
      timeframe: 'This month',
    },
    quickWin: 'Pull every open quote right now. Send a personal message to every quote over 3 days old today.',
    whatToMeasure: 'Open quote close rate. Average number of follow-up touches per quote. Reviews received per month.',
    salesImpact: 'Recovering 2 stalled quotes per month at $600 average = $1,200/month from the same lead volume with no new marketing cost.',
    vendors: [
      {
        name: 'Jobber',
        category: 'Automated Follow-Up',
        whatItHelps: 'Automated quote follow-up sequences, post-job review requests, and customer reminders',
        bestFor: 'Growing Team',
        whyRecommended: 'Automated quote follow-up alone is worth the monthly fee for most contractors. Set it once, recover jobs on autopilot.',
        url: 'https://getjobber.com',
        affiliateId: 'jobber',
        isFree: false,
        priceRange: '$49–$149/mo',
      },
      {
        name: 'Housecall Pro',
        category: 'Customer Messaging',
        whatItHelps: 'Automated appointment reminders, post-job follow-ups, and review request sequences',
        bestFor: 'Solo / Startup',
        whyRecommended: 'Best automated customer communication for HVAC, plumbing, and service-call businesses.',
        url: 'https://www.housecallpro.com',
        affiliateId: 'housecall-pro',
        isFree: false,
        priceRange: '$49–$129/mo',
      },
      {
        name: 'Mailchimp',
        category: 'Email Follow-Up',
        whatItHelps: 'Email sequences to past customers, seasonal reminders, and reactivation campaigns',
        bestFor: 'Budget Pick',
        whyRecommended: 'Free up to 500 contacts. A monthly email to your customer list with a seasonal tip or availability reminder keeps you top of mind without paying for ads.',
        url: 'https://mailchimp.com',
        affiliateId: 'mailchimp',
        isFree: true,
        priceRange: 'Free up to 500 contacts',
      },
    ],
    relevantFor: [],
    priorityWhenScoreBelow: 70,
  },

  {
    id: 'reviews-referrals',
    layer: 'brand',
    title: 'Reviews & Referrals',
    subtitle: 'Building the social proof that drives calls without paying for leads',
    scoreImpact: SCORE_IMPACT_PER_TAB,
    whyItMatters: '88% of homeowners check reviews before hiring a contractor. A business with 50+ reviews gets 3–5x more calls than one with 10. Every review compounds — it raises your ranking AND your conversion rate simultaneously.',
    currentWeaknessSignal: 'Low review count or no system for requesting reviews after jobs. Referrals are happening by accident — no consistent ask, no tracking, no program.',
    primaryAction: {
      title: 'Build a review-ask into every job completion',
      description: 'Text your Google review link to every customer within 24 hours of finishing a job. Make it personal and direct — not a blast. Customers who just had a good experience leave a review 40–60% of the time when asked immediately. Waiting until the end of the week drops that rate below 10%.',
      timeframe: 'This week',
    },
    alternativeAction: {
      title: 'Launch a simple referral program',
      description: 'Tell every satisfied customer: "We grow through referrals — if you know anyone who needs our service, we would appreciate the introduction." Follow up with a small thank-you for any referral that becomes a job. Track where referrals come from monthly.',
      timeframe: 'This month',
    },
    quickWin: 'Write one review request text template right now. Send it to your last 3 customers. Check that your Google Business Profile review link is working.',
    whatToMeasure: 'Google review count. New reviews per month. Referral jobs per month and their source.',
    salesImpact: 'Going from 8 to 40+ Google reviews typically doubles or triples inbound call volume for local service contractors.',
    vendors: [
      {
        name: 'Podium',
        category: 'Review Management',
        whatItHelps: 'SMS-based review requests, Google review automation, and centralized customer messaging',
        bestFor: 'Growing Team',
        whyRecommended: 'SMS review requests convert at 2–3x the rate of email. Podium automates the ask and brings all customer messages into one inbox.',
        url: 'https://www.podium.com',
        affiliateId: 'podium',
        isFree: false,
        priceRange: '$249–$399/mo',
      },
      {
        name: 'Housecall Pro',
        category: 'Automated Review Requests',
        whatItHelps: 'Post-job review request automation built into the job completion flow',
        bestFor: 'Budget Pick',
        whyRecommended: 'If you are already using Housecall Pro for scheduling, the built-in review automation eliminates the need for a separate tool.',
        url: 'https://www.housecallpro.com',
        affiliateId: 'housecall-pro',
        isFree: false,
        priceRange: '$49–$129/mo',
      },
      {
        name: 'Jobber',
        category: 'Review Requests',
        whatItHelps: 'Automated review request messages sent after job completion',
        bestFor: 'Solo / Startup',
        whyRecommended: 'Simple review request automation included in Jobber plans. Works with Google, Facebook, and other platforms.',
        url: 'https://getjobber.com',
        affiliateId: 'jobber',
        isFree: false,
        priceRange: '$49–$149/mo',
      },
    ],
    relevantFor: [],
    priorityWhenScoreBelow: 80,
  },

  {
    id: 'social-brand',
    layer: 'brand',
    title: 'Social Media & Brand',
    subtitle: 'Building visibility and trust with consistent before/after content',
    scoreImpact: SCORE_IMPACT_PER_TAB,
    whyItMatters: 'Customers hire contractors they recognize and trust. A consistent social presence — even just before/after photos — builds familiarity before they call. Google indexes your GBP photos and posts, which helps your ranking. Your portfolio is your best salesperson and it costs nothing to build.',
    currentWeaknessSignal: 'Little or no before/after documentation of completed work. No consistent social presence that builds recognition in your local market over time.',
    primaryAction: {
      title: 'Take a before and after photo on every job',
      description: 'This takes 60 seconds. A photo of the problem and a photo of the solution. Post both to your Google Business Profile and Facebook page with your trade, city, and a one-sentence description. Consistency beats production quality. Three posts per week builds a local portfolio faster than any ad campaign.',
      timeframe: 'This week — start on your next job',
    },
    alternativeAction: {
      title: 'Create 5 short FAQ videos answering your most common customer questions',
      description: 'Film a 60–90 second answer on your phone for each of the 5 most common questions you get asked on the job. Post one per week. Local homeowners find these videos and build trust before calling. This earns more calls per month than most paid ads for local contractors.',
      timeframe: 'This month',
    },
    quickWin: 'Take a before photo on your next job today. After the job, take the after photo. Post both immediately with your business name and city.',
    whatToMeasure: 'Google Business Profile photo views. Post engagement. Calls or messages attributed to social.',
    salesImpact: 'Contractors with 20+ Google Business photos receive 35% more direction requests and 42% more website clicks — Google\'s own data.',
    vendors: [
      {
        name: 'Canva',
        category: 'Content Creation',
        whatItHelps: 'Professional-looking before/after posts, branded social content, and business cards without design skills',
        bestFor: 'Budget Pick — Free',
        whyRecommended: 'Free tier is genuinely useful. Templates for contractor before/after posts take 5 minutes. Consistent branding makes small operations look established.',
        url: 'https://www.canva.com',
        affiliateId: null,
        isFree: true,
        priceRange: 'Free / $15/mo Pro',
      },
      {
        name: 'Google Business Profile',
        category: 'Local Search + Photos',
        whatItHelps: 'Photo portfolio, job posts, and Q&A that improve local search ranking',
        bestFor: 'Solo / Startup',
        whyRecommended: 'Every photo you add to your GBP improves both your ranking and your credibility. Completely free and directly tied to inbound call volume.',
        url: 'https://business.google.com',
        affiliateId: null,
        isFree: true,
        priceRange: 'Free',
      },
    ],
    relevantFor: [],
    priorityWhenScoreBelow: 70,
  },

  {
    id: 'operations-systems',
    layer: 'operations',
    title: 'Operations Systems',
    subtitle: 'Running jobs cleaner, invoicing faster, eliminating paperwork',
    scoreImpact: SCORE_IMPACT_PER_TAB,
    whyItMatters: 'Every hour spent chasing paperwork, re-entering data, or manually scheduling is an hour you cannot spend billing. Contractors who systematize operations handle 30–50% more revenue with the same headcount — and make fewer mistakes. The system is what separates a $300K business from a $600K one at the same skill level.',
    currentWeaknessSignal: 'Jobs managed through texts, notebooks, phone calls, and memory. No single system for quotes, scheduling, jobs, and invoicing. High admin time and high callback rate.',
    primaryAction: {
      title: 'Pick one field software platform and use it consistently for 90 days',
      description: 'The most common mistake is buying a tool and using it for 30% of jobs. Pick one platform. Use it for every quote, every job, every invoice for 90 straight days. A system you use consistently beats a better system you use sporadically.',
      timeframe: 'This month',
    },
    alternativeAction: {
      title: 'Build a digital job checklist for your most common job type',
      description: 'A one-page digital checklist — Google Form, Jobber inspection, or Notion — that every tech completes on every job. This alone catches missed work, reduces callbacks, speeds up invoicing, and creates a paper trail for any disputes.',
      timeframe: 'This week',
    },
    quickWin: 'Count your open invoices right now. Follow up on every invoice over 14 days old today.',
    whatToMeasure: 'Days from job completion to invoice sent. Days sales outstanding (DSO). Callback rate per job type.',
    salesImpact: 'Invoicing same-day instead of end-of-week typically reduces DSO by 7–14 days — improving cash flow by $10,000–$30,000 depending on annual revenue.',
    vendors: [
      {
        name: 'Jobber',
        category: 'Field Service Management',
        whatItHelps: 'Quoting, scheduling, job management, invoicing, and customer communication in one platform',
        bestFor: 'Growing Team',
        whyRecommended: 'Best all-in-one for contractors with 1–10 employees. Mobile-first and built for field work, not office administration.',
        url: 'https://getjobber.com',
        affiliateId: 'jobber',
        isFree: false,
        priceRange: '$49–$149/mo',
      },
      {
        name: 'Housecall Pro',
        category: 'Field Service Management',
        whatItHelps: 'Scheduling, dispatching, invoicing, and automated customer communication for service businesses',
        bestFor: 'Solo / Startup',
        whyRecommended: 'Best user experience for HVAC, plumbing, and service-call businesses. Strong dispatching and GPS tracking for multi-tech operations.',
        url: 'https://www.housecallpro.com',
        affiliateId: 'housecall-pro',
        isFree: false,
        priceRange: '$49–$129/mo',
      },
      {
        name: 'QuickBooks',
        category: 'Job Costing / Accounting',
        whatItHelps: 'Job cost tracking, profit per project, payroll, and CPA-ready financial reporting',
        bestFor: 'Premium Option',
        whyRecommended: 'Once you are billing over $300K/year, job costing tells you which services are actually profitable and which are quietly losing money.',
        url: 'https://quickbooks.intuit.com/small-business',
        affiliateId: 'quickbooks',
        isFree: false,
        priceRange: '$30–$60/mo',
      },
    ],
    relevantFor: [],
    priorityWhenScoreBelow: 65,
  },

  {
    id: 'owner-scorecard',
    layer: 'operations',
    title: 'Owner Weekly Scorecard',
    subtitle: 'Running your business on numbers, not gut feel',
    scoreImpact: SCORE_IMPACT_PER_TAB,
    whyItMatters: 'You cannot improve what you do not measure. Most contractors run on gut feel — they feel busy so they assume profitable. A 30-minute weekly review of 5–7 numbers tells you exactly where you are growing, where you are leaking, and what to focus on next week. This is the difference between owning a business and being owned by one.',
    currentWeaknessSignal: 'No regular review of business performance numbers. Revenue, lead flow, and close rate tracked by memory or not at all. Decisions made on feel, not data.',
    primaryAction: {
      title: 'Review 5 numbers every Monday morning',
      description: 'Every Monday, write down: (1) leads last week, (2) quotes sent, (3) jobs won, (4) revenue collected, (5) open invoices. Compare to the week before. Make one decision based on what you see. Thirty minutes. Creates more business clarity than any coaching program.',
      timeframe: 'This week — start this Monday',
    },
    alternativeAction: {
      title: 'Build a simple weekly KPI spreadsheet',
      description: 'A Google Sheet with your 5–7 key metrics tracked weekly for 90 days. The trend line tells you more than any single week. Revenue down 3 weeks in a row is a signal to act. Revenue up 4 straight weeks means something is working — do more of it.',
      timeframe: 'This week',
    },
    quickWin: 'Right now — write down your revenue, lead count, and close rate for this week from memory. Then verify against your actual records. The gap between what you think and what is real is your scorecard gap.',
    whatToMeasure: 'Weekly revenue. Leads per week. Quotes sent. Close rate. Average job value. Open invoice total.',
    salesImpact: 'Contractors who track weekly KPIs find and fix revenue leaks 60–90 days faster than those running on gut feel — worth $20,000–$50,000/year for a $300–$500K business.',
    vendors: [
      {
        name: 'Wave Accounting',
        category: 'Financial Reporting',
        whatItHelps: 'Free income, expense, and cash flow tracking with simple reports for weekly reviews',
        bestFor: 'Budget Pick — Free',
        whyRecommended: 'Free and genuinely useful. Gives you the revenue and cash flow numbers you need for a weekly review without a monthly bill.',
        url: 'https://www.waveapps.com',
        affiliateId: 'wave',
        isFree: true,
        priceRange: 'Free',
      },
      {
        name: 'QuickBooks',
        category: 'Business Reporting',
        whatItHelps: 'Profit and loss, cash flow, job costing, and custom reports for business performance tracking',
        bestFor: 'Growing Team',
        whyRecommended: 'Once you have a bookkeeper reviewing your numbers, QuickBooks gives you the most complete picture of business performance.',
        url: 'https://quickbooks.intuit.com/small-business',
        affiliateId: 'quickbooks',
        isFree: false,
        priceRange: '$30–$60/mo',
      },
      {
        name: 'Google Sheets',
        category: 'KPI Tracker',
        whatItHelps: 'Custom weekly KPI tracking, trend charts, and a dashboard built exactly how you want it',
        bestFor: 'Training / Resource',
        whyRecommended: 'A custom Sheet you actually understand beats any off-the-shelf dashboard you barely open. Start here, upgrade when you outgrow it.',
        url: 'https://sheets.google.com',
        affiliateId: null,
        isFree: true,
        priceRange: 'Free',
      },
    ],
    relevantFor: [],
    priorityWhenScoreBelow: 100,
  },
]

export function getGrowthTabs(result: ScoreResult): GrowthRoadmapTab[] {
  return [...GROWTH_TABS].sort((a, b) => {
    const aUrgent = result.overall < a.priorityWhenScoreBelow ? 0 : 1
    const bUrgent = result.overall < b.priorityWhenScoreBelow ? 0 : 1
    if (aUrgent !== bUrgent) return aUrgent - bUrgent
    return GROWTH_TABS.indexOf(a) - GROWTH_TABS.indexOf(b)
  })
}

export function getTempStatus(
  tab: GrowthRoadmapTab,
  result: ScoreResult,
  completed: boolean
): TempStatus {
  if (completed) return 'hot'
  const { overall, categoryScores, answers } = result
  const setupSteps = answers.setup_steps ?? []

  switch (tab.id) {
    case 'lead-flow':
      if (categoryScores.customerReadiness <= 4)  return 'sub-zero'
      if (categoryScores.customerReadiness <= 8)  return 'cold'
      return 'warming'
    case 'close-rate':
      if (overall < 45) return 'sub-zero'
      if (overall < 65) return 'cold'
      return 'warming'
    case 'pricing-estimating':
      if (categoryScores.financialReadiness <= 8)  return 'sub-zero'
      if (categoryScores.financialReadiness <= 14) return 'cold'
      return 'warming'
    case 'average-ticket':
    case 'cross-selling':
      if (overall < 50) return 'sub-zero'
      if (overall < 68) return 'cold'
      return 'warming'
    case 'follow-up':
      if (categoryScores.customerReadiness <= 6)  return 'sub-zero'
      if (categoryScores.customerReadiness <= 11) return 'cold'
      return 'warming'
    case 'reviews-referrals':
      if (!setupSteps.includes('gbp')) return 'sub-zero'
      if (overall < 65) return 'cold'
      return 'warming'
    case 'social-brand':
      if (!setupSteps.includes('gbp') && !setupSteps.includes('website')) return 'sub-zero'
      if (overall < 60) return 'cold'
      return 'warming'
    case 'operations-systems':
      if (categoryScores.setupReadiness <= 8)  return 'sub-zero'
      if (categoryScores.setupReadiness <= 14) return 'cold'
      return 'warming'
    case 'owner-scorecard':
      if (overall < 55) return 'sub-zero'
      if (overall < 72) return 'cold'
      return 'warming'
    default:
      if (overall < 50) return 'sub-zero'
      if (overall < 65) return 'cold'
      return 'warming'
  }
}
