// ─────────────────────────────────────────────────────────────────────────────
// SubZeroMetrix — Trade-Specific Platform Data
// Each trade has: KPIs, benchmarks, scaling phases, tools, and licensing
// ─────────────────────────────────────────────────────────────────────────────

export interface KPI {
  id: string
  label: string
  unit: string
  description: string
  targetRange: string
  warningBelow: string
  improvementTips: string[]
}

export interface Benchmark {
  stage: string
  revenueRange: string
  employees: string
  keyMetrics: string[]
  nextMove: string
}

export interface TradePhaseStep {
  title: string
  description: string
  diyOption: string
  estimatedCost: string
}

export interface TradePhase {
  id: string
  title: string
  subtitle: string
  when: string
  steps: TradePhaseStep[]
}

export interface TradeTool {
  name: string
  category: string
  description: string
  url: string
  affiliateId: string | null
  isFree: boolean
  priceRange: string
  bestFor: string
}

export interface LicenseRequirement {
  state: string
  board: string
  url: string
  examRequired: boolean
  notes: string
}

export interface TradeConfig {
  id: string
  slug: string
  name: string
  tradeName: string
  tagline: string
  accentColor: string
  description: string
  kpis: KPI[]
  benchmarks: Benchmark[]
  tradePhases: TradePhase[]
  tools: TradeTool[]
  licenseRequirements: LicenseRequirement[]
  uniqueRisks: string[]
  industryInsight: string
}

// ─────────────────────────────────────────────────────────────────────────────
// HVAC — HeatMetrix
// ─────────────────────────────────────────────────────────────────────────────
const HVAC: TradeConfig = {
  id: 'hvac',
  slug: 'heat',
  name: 'HeatMetrix',
  tradeName: 'HVAC',
  tagline: 'Stop chasing calls. Build a business that runs year-round.',
  accentColor: '#EF9F27',
  description: 'HVAC is one of the most demanding trades to run as a business. Seasonal swings, licensing complexity, and equipment costs create real barriers to scale. HeatMetrix is built around the metrics and decisions that separate HVAC contractors who stay stuck from those who grow past $1M.',
  kpis: [
    {
      id: 'maintenance_rate',
      label: 'Maintenance Agreement Rate',
      unit: '% of install base',
      description: 'Percentage of your install customers with an active maintenance agreement. Agreements flatten seasonal revenue, generate recurring income, and increase equipment replacement conversion by 3-4x.',
      targetRange: '25-50% of install base',
      warningBelow: '10%',
      improvementTips: [
        'Present maintenance agreements at every install as the expected next step, not an upsell',
        'Offer multi-year agreements at a small discount to lock in retention',
        'Set reminders to call agreement customers 2 weeks before their scheduled visit',
        'Track agreement revenue separately — it should be your most profitable line',
      ],
    },
    {
      id: 'tech_utilization',
      label: 'Technician Utilization Rate',
      unit: '%',
      description: 'Percentage of available technician hours billed to customers. Low utilization means paying for capacity you are not using. Over 85% sustained means you need another tech.',
      targetRange: '70-85%',
      warningBelow: '55%',
      improvementTips: [
        'Track drive time separately — it is unbillable and erodes utilization',
        'Cluster calls geographically by zone on each dispatch day',
        'Use a dispatch board to visualize open capacity daily',
        'Use maintenance agreements to fill off-peak capacity predictably',
      ],
    },
    {
      id: 'avg_ticket',
      label: 'Average Service Ticket',
      unit: '$/job',
      description: 'Average revenue per service call. Low average ticket usually means incomplete diagnosis, failure to present options, or technician reluctance to recommend necessary repairs.',
      targetRange: '$250-$450 (service) | $5,000-$12,000 (replacement)',
      warningBelow: '$150 per service call',
      improvementTips: [
        'Train techs to present 3 options: repair, repair plus maintenance, and replace',
        'Always bring the full system into the conversation, not just the failed part',
        'Document and present Indoor Air Quality findings at every visit',
        'Never leave without a written estimate for any deferred work found',
      ],
    },
    {
      id: 'replacement_close',
      label: 'Replacement Close Rate',
      unit: '%',
      description: 'Of customers presented with a replacement proposal, what percentage buy. Industry average is 30-40%. Top performers hit 50-65% through trust built during service relationships.',
      targetRange: '40-60%',
      warningBelow: '25%',
      improvementTips: [
        'Present financing on every replacement proposal — most customers do not ask',
        'Show the 10-year cost comparison between repair and replace clearly',
        'Offer a same-day decision incentive — creates urgency without pressure',
        'Follow up every declined proposal within 48 hours',
      ],
    },
  ],
  benchmarks: [
    {
      stage: 'Solo / Startup',
      revenueRange: '$0-$150K',
      employees: '1 (owner-operator)',
      keyMetrics: [
        'You do all service calls yourself — know your hourly cost exactly',
        'Building your first 100 customers is the only job that matters right now',
        'Maintenance agreements: aim for 20+ by end of year one',
        'All revenue comes from your labor — protect your body and your license',
      ],
      nextMove: 'Hire your first office or dispatch support before your first tech. Admin chaos kills growth faster than lack of techs.',
    },
    {
      stage: 'Growing',
      revenueRange: '$150K-$500K',
      employees: '2-4 (1-2 techs plus owner)',
      keyMetrics: [
        'Track technician utilization weekly, not monthly',
        'At least 100 active maintenance agreements as your floor revenue',
        'Replacement close rate above 35% across all techs, not just the owner',
        'Average ticket rising as techs get trained on presenting options',
      ],
      nextMove: 'Build a dispatch and scheduling system that does not require you on the phone. Dispatch is the bottleneck at this size.',
    },
    {
      stage: 'Established',
      revenueRange: '$500K-$1.5M',
      employees: '5-12',
      keyMetrics: [
        '200-500 active maintenance agreements creating stable recurring revenue',
        'Gross margin above 50% on service, above 35% on install',
        'Two lead techs who can run their own calls without you involved',
        'Separate P&L for service vs install so you know which is actually profitable',
      ],
      nextMove: 'Hire a Service Manager who owns the service department P&L. This is the hire that lets you work on the business.',
    },
    {
      stage: 'Scaling',
      revenueRange: '$1.5M+',
      employees: '12+',
      keyMetrics: [
        'Commercial maintenance contracts alongside residential for winter revenue stability',
        'Fleet utilization tracking per truck, not just per tech',
        'Warranty recall rate below 3% — quality control is a KPI at this size',
        'Revenue per truck above $350K — below that is a capacity or pricing problem',
      ],
      nextMove: 'Model out a second location only after your first market is fully systemized. Chaos does not scale.',
    },
  ],
  tradePhases: [
    {
      id: 'maintenance-program',
      title: 'Build Your Maintenance Program',
      subtitle: 'The single move that changes everything in HVAC.',
      when: 'Once you have 30+ residential customers and consistent call volume',
      steps: [
        {
          title: 'Price your maintenance agreement',
          description: 'Calculate your actual cost per visit: drive time, labor, consumables, overhead. Set a price that covers two visits per year plus profit. Most markets: $180-$350 per year depending on system type.',
          diyOption: 'Spreadsheet: 2 visits times your hourly rate plus materials plus overhead. Add 20-30% margin.',
          estimatedCost: 'Free to calculate. Customer acquisition cost already paid.',
        },
        {
          title: 'Create a simple agreement form',
          description: 'A one-page agreement covering: what is included, frequency, price, payment terms, cancellation, and exclusions. Keep it simple — a complex contract is worse than a simple one that both parties understand.',
          diyOption: 'Google Doc template. Key clauses: scope of work, payment terms, auto-renewal, liability cap.',
          estimatedCost: 'Free. Attorney review recommended once you have 20+ agreements.',
        },
        {
          title: 'Train the agreement conversation into every service call',
          description: 'Every tech, every call: present the maintenance program as a professional service recommendation, not a sales pitch. The difference is asking about their situation before presenting the solution.',
          diyOption: 'Role-play with your techs for 30 minutes. Practice until they can present without hesitation or apology.',
          estimatedCost: 'Free. Your time.',
        },
      ],
    },
  ],
  tools: [
    {
      name: 'Jobber',
      category: 'Field Service Software',
      description: 'Scheduling, quoting, invoicing, maintenance agreement management, and customer communication.',
      url: 'https://getjobber.com',
      affiliateId: 'jobber',
      isFree: false,
      priceRange: '$49-$149/month',
      bestFor: 'HVAC businesses $150K-$750K who need quoting and scheduling without enterprise complexity.',
    },
    {
      name: 'Housecall Pro',
      category: 'Field Service Software',
      description: 'Strong mobile app, automated customer review requests, and recurring service plan management.',
      url: 'https://www.housecallpro.com',
      affiliateId: 'housecall-pro',
      isFree: false,
      priceRange: '$49-$129/month',
      bestFor: 'Solo to small crew HVAC operators who prioritize customer communication and online reviews.',
    },
    {
      name: 'Simply Business',
      category: 'Insurance',
      description: 'Compare business liability insurance options from multiple carriers. Built for small contractors.',
      url: 'https://www.simplybusiness.com',
      affiliateId: 'simply-business',
      isFree: false,
      priceRange: 'Varies by coverage',
      bestFor: 'HVAC contractors who want to compare multiple carriers quickly and get covered without calling multiple agents.',
    },
    {
      name: 'EPA 608 Certification — IRS.gov',
      category: 'Licensing',
      description: 'Required by federal law to purchase and handle refrigerants. Universal certification covers all refrigerant types.',
      url: 'https://www.epa.gov/section608',
      affiliateId: null,
      isFree: false,
      priceRange: '$20-$60 exam fee',
      bestFor: 'Every HVAC technician. This is not optional under federal law.',
    },
  ],
  licenseRequirements: [
    { state: 'Texas', board: 'TDLR — HVAC', url: 'https://www.tdlr.texas.gov/a_c/', examRequired: true, notes: 'Class A and B licenses. Technician registration required. State exam plus NATE certification recommended.' },
    { state: 'Florida', board: 'DBPR — Contractor Licensing', url: 'https://www.myfloridalicense.com', examRequired: true, notes: 'Certified or Registered HVAC contractor license. Trade exam required. Financial responsibility documentation.' },
    { state: 'Colorado', board: 'DORA — Professions', url: 'https://dora.colorado.gov/professions-occupations', examRequired: true, notes: 'State contractor license via DORA. Local jurisdictions may add requirements.' },
    { state: 'Arizona', board: 'AZ Registrar of Contractors', url: 'https://roc.az.gov/', examRequired: true, notes: 'CR-39 license for air conditioning and refrigeration. Trade exam plus financial statement required.' },
    { state: 'North Carolina', board: 'NC HVACR Licensing Board', url: 'https://www.nchvacr.com/', examRequired: true, notes: 'H1, H2, or H3 license depending on scope. Exam through Pearson VUE.' },
    { state: 'Ohio', board: 'OH Construction Industry Licensing', url: 'https://com.ohio.gov', examRequired: false, notes: 'Local jurisdiction licensing varies significantly. Check your county and city directly.' },
  ],
  uniqueRisks: [
    'Seasonal revenue concentration — 60%+ revenue in 3-4 months makes year-round cash flow management critical',
    'Refrigerant regulatory changes (EPA phasedowns) create equipment inventory risk and technician certification costs',
    'One bad install or voided warranty can eliminate the margin from 10-20 service calls',
    'Key technician departure can drop your capacity 30-50% overnight — document processes and cross-train',
    'Deferred maintenance on customer systems creates liability when equipment fails — document every visit',
  ],
  industryInsight: 'The HVAC contractors who scale past $1M consistently have one thing in common: maintenance agreements. Not dispatch software. Not a great website. Not even the best techs. The agreement base creates predictable revenue, prioritizes your best customers, and converts to equipment replacement at 3-4x the rate of non-agreement customers. If you have fewer than 100 active maintenance agreements, that is the only thing you should be focused on right now. Everything else is secondary.',
}

// ─────────────────────────────────────────────────────────────────────────────
// ELECTRICAL — VoltMetrix
// ─────────────────────────────────────────────────────────────────────────────
const ELECTRICAL: TradeConfig = {
  id: 'electrical',
  slug: 'volt',
  name: 'VoltMetrix',
  tradeName: 'Electrical',
  tagline: 'License. Systemize. Capture the commercial and EV opportunity.',
  accentColor: '#378ADD',
  description: 'Electrical contracting sits at the intersection of the most rigorous licensing requirements in the trades and the fastest-growing demand category in construction. EV charging, panel upgrades, solar interconnects, and smart home integration are reshaping the revenue mix. VoltMetrix tracks the metrics that matter for electrical businesses at every stage.',
  kpis: [
    {
      id: 'billable_rate',
      label: 'Effective Billable Rate',
      unit: '$/hr',
      description: 'Total revenue divided by total labor hours billed. Most electricians underprice because they track what they charge, not what they actually earn after callbacks, warranty work, and drive time.',
      targetRange: '$95-$145/hr (residential) | $110-$180/hr (commercial)',
      warningBelow: '$75/hr',
      improvementTips: [
        'Track every callback and warranty hour as a cost that reduces your effective rate',
        'Flat-rate pricing for common jobs eliminates time estimate risk',
        'Commercial jobs should be priced at a premium — compliance and complexity cost more',
        'Review your rate annually against local competitors — most electricians are underpriced',
      ],
    },
    {
      id: 'permit_rate',
      label: 'Permit Pull Rate',
      unit: '%',
      description: 'What percentage of permit-required work has permits pulled. Unpermitted work creates liability on home sale, voids insurance, and puts your contractor license at risk.',
      targetRange: '100% — non-negotiable',
      warningBelow: 'Any percentage below 100%',
      improvementTips: [
        'Build permit cost and time into every estimate — customers accept it when presented upfront',
        'Never let a customer talk you out of a permit — your license is on the line',
        'Track inspection pass rate — first-pass failures cost time and credibility',
      ],
    },
    {
      id: 'ev_revenue',
      label: 'EV Charger Revenue',
      unit: '$/month',
      description: 'Monthly revenue from EV charger installation. This is the fastest-growing electrical revenue category. Level 2 home installs: $800-$2,500. Commercial EVSE: $5,000-$50,000+.',
      targetRange: 'Growing month-over-month',
      warningBelow: '$0 — you are missing the fastest-growing category',
      improvementTips: [
        'Get ChargePoint, Eaton, or Siemens EVSE certification — adds manufacturer referrals',
        'Partner with EV dealerships in your area — they refer installers to every buyer',
        'Most EV charger installs reveal panel inadequacy — dual revenue opportunity on each call',
      ],
    },
  ],
  benchmarks: [
    {
      stage: 'Solo / Startup',
      revenueRange: '$0-$120K',
      employees: '1 (journeyman or master)',
      keyMetrics: [
        'Your license is your entire business — protect it with permits and documentation',
        'Residential service work is fastest to cash; commercial requires more paperwork',
        'Every callback is a learning opportunity — track and eliminate root causes',
        'Build referral relationships with 3-5 general contractors in your first year',
      ],
      nextMove: 'Get your master electrician license if you do not have it — it opens commercial work and lets you pull your own permits.',
    },
    {
      stage: 'Growing',
      revenueRange: '$120K-$400K',
      employees: '2-5',
      keyMetrics: [
        'At least one licensed journeyman beyond you — do not build on unlicensed labor risk',
        'Flat-rate service menu for common residential work removes price negotiation',
        'Permit pass rate tracked — errors at this size become patterns quickly',
        'Starting to separate residential and commercial as distinct revenue lines',
      ],
      nextMove: 'Pursue your electrical contractor license — unlocks pulling permits without you physically present on every job.',
    },
    {
      stage: 'Established',
      revenueRange: '$400K-$1.2M',
      employees: '6-15',
      keyMetrics: [
        'Commercial project work alongside residential service — two distinct operations',
        'Project management system for multi-day commercial jobs',
        'Warranty and callback rate below 5%',
        'EV and solar interconnect as defined service lines with trained crews',
      ],
      nextMove: 'Hire a Foreman or Lead Electrician who runs commercial projects without you on-site daily.',
    },
    {
      stage: 'Scaling',
      revenueRange: '$1.2M+',
      employees: '15+',
      keyMetrics: [
        'Bonding capacity keeping pace with project scale — verify annually',
        'Revenue per electrician above $130K',
        'Service agreement program in place — most electrical contractors ignore this',
        'Apprentice pipeline — qualified electricians are scarce in every market',
      ],
      nextMove: 'Invest in apprentice development. The labor shortage does not improve — contractors who train their own people win.',
    },
  ],
  tradePhases: [
    {
      id: 'ev-service-line',
      title: 'Build an EV Charging Service Line',
      subtitle: 'The fastest-growing electrical revenue category in most markets.',
      when: 'Once you have residential service running and want to capture a growing specialty',
      steps: [
        {
          title: 'Get EVSE-specific training or certification',
          description: 'Manufacturer training from ChargePoint, Eaton, Siemens, or Clipper Creek positions you as a preferred installer and generates direct referrals from the manufacturer.',
          diyOption: 'Most manufacturer training programs are free or low-cost online. Start with ChargePoint Pro training.',
          estimatedCost: 'Free to $500 depending on program',
        },
        {
          title: 'Create a flat-rate EV charger service menu',
          description: 'Flat-rate pricing for Level 2 home charger installation at standard panel, 30ft run, indoor or outdoor unit. No surprises. You know your margin. Faster quoting.',
          diyOption: 'Calculate your loaded cost for a standard install. Add 35% margin. That is your flat rate. Site visit for non-standard situations.',
          estimatedCost: 'Time to develop. Zero hard cost.',
        },
        {
          title: 'Partner with local EV dealerships',
          description: 'Every EV sold is a potential Level 2 charger install. Most dealerships do not have a go-to electrician. One conversation with a service manager can generate 5-10 referrals per month.',
          diyOption: 'Walk into 3 EV dealerships. Ask for the service manager. Leave your card and a one-page EV installation overview.',
          estimatedCost: 'Free. Time and a professional introduction.',
        },
      ],
    },
  ],
  tools: [
    {
      name: 'Jobber',
      category: 'Field Service Software',
      description: 'Scheduling, quoting, and invoicing with strong mobile apps for field electricians.',
      url: 'https://getjobber.com',
      affiliateId: 'jobber',
      isFree: false,
      priceRange: '$49-$149/month',
      bestFor: 'Electrical contractors $100K-$600K who need quoting and scheduling without enterprise complexity.',
    },
    {
      name: 'QuickBooks',
      category: 'Accounting',
      description: 'Job costing on commercial projects, progress billing, and CPA-friendly reporting.',
      url: 'https://quickbooks.intuit.com/small-business',
      affiliateId: 'quickbooks',
      isFree: false,
      priceRange: '$30-$60/month',
      bestFor: 'Electrical contractors doing commercial projects who need job-level P&L and progress invoicing.',
    },
    {
      name: 'Simply Business',
      category: 'Insurance',
      description: 'General liability with electrical-specific coverage options and fast certificate issuance.',
      url: 'https://www.simplybusiness.com',
      affiliateId: 'simply-business',
      isFree: false,
      priceRange: 'Varies by coverage and revenue',
      bestFor: 'Electricians who need coverage quickly and want to compare multiple carriers in one place.',
    },
  ],
  licenseRequirements: [
    { state: 'Texas', board: 'TDLR — Electrical', url: 'https://www.tdlr.texas.gov/electricians/', examRequired: true, notes: 'Apprentice to Journeyman to Master path. Each level has experience and exam requirements.' },
    { state: 'Florida', board: 'DBPR — Electrical Contractor', url: 'https://www.myfloridalicense.com', examRequired: true, notes: 'Certified or Registered Electrical Contractor. Business/Finance exam plus trade exam.' },
    { state: 'Colorado', board: 'DORA — Electrical', url: 'https://dora.colorado.gov/professions-occupations/electrical-contractors', examRequired: true, notes: 'Journeyman and Master Electrician licenses via DORA. Contractor license separate from individual license.' },
    { state: 'Arizona', board: 'AZ Registrar of Contractors', url: 'https://roc.az.gov/', examRequired: true, notes: 'CR-11 (residential) or C-11 (commercial) electrical contractor license.' },
    { state: 'North Carolina', board: 'NC Electrical Contractor Licensing Board', url: 'https://www.ncbeec.org/', examRequired: true, notes: 'Limited, Intermediate, or Unlimited license. Exam plus experience requirements.' },
    { state: 'Ohio', board: 'OH Electrical — Local Jurisdiction', url: 'https://www.ohiosos.gov', examRequired: false, notes: 'Ohio has no statewide electrical contractor license. Requirements set by local jurisdiction.' },
  ],
  uniqueRisks: [
    'License suspension from code violations can shut your entire business down immediately',
    'Unpermitted work discovered during home sale can result in contractor liability years later',
    'Apprentice misclassification as independent contractors creates significant tax and labor law risk',
    'Commercial project underbidding on labor hours before establishing accurate production rates destroys margins',
    'NEC code updates every 3 years require ongoing training to avoid inspection failures',
  ],
  industryInsight: 'Electrical contracting has an unusual advantage: the barrier to entry is genuinely high. The licensing path is long, the exam is difficult, and the liability is real. That means less competition from unlicensed operators undercutting on price. Electricians who understand this lean into the professionalism of their license. The contractors who thrive treat their license as their brand, not just their credential.',
}

// ─────────────────────────────────────────────────────────────────────────────
// PLUMBING — FlowMetrix
// ─────────────────────────────────────────────────────────────────────────────
const PLUMBING: TradeConfig = {
  id: 'plumbing',
  slug: 'flow',
  name: 'FlowMetrix',
  tradeName: 'Plumbing',
  tagline: 'Emergency calls pay the bills. Water treatment and drain programs build the business.',
  accentColor: '#1D9E75',
  description: 'Plumbing sits in a unique position: emergency service creates high demand and urgency-based pricing, while residential remodel and commercial work offer larger projects and steadier scheduling. The contractors who build lasting plumbing businesses balance both while building recurring revenue through water treatment, drain maintenance programs, and service agreements.',
  kpis: [
    {
      id: 'flat_rate_adoption',
      label: 'Flat Rate Pricing Adoption',
      unit: '%',
      description: 'Percentage of service calls priced flat-rate vs time-and-material. Flat rate eliminates price shock, removes the incentive for techs to go slow, and makes revenue more predictable.',
      targetRange: '70-90% of service calls',
      warningBelow: '30%',
      improvementTips: [
        'Build a flat rate book starting with your 20 most common service calls',
        'Price flat rates at 1.3-1.5x your average T&M for the same job',
        'Train every tech on presenting flat rate pricing confidently before starting work',
      ],
    },
    {
      id: 'water_treatment',
      label: 'Water Treatment Attach Rate',
      unit: '%',
      description: 'Of service calls to homes without water treatment, what percentage result in an assessment. Water treatment is the highest-margin residential plumbing product category.',
      targetRange: '15-30% assessment rate | 10-20% close rate',
      warningBelow: '5% assessment rate',
      improvementTips: [
        'Run a quick water quality test on every service call — the conversation writes itself',
        'Water softener installs run $1,200-$3,500 with strong margin',
        'Whole-house filtration has an educated customer base — learn to present it',
      ],
    },
    {
      id: 'drain_agreements',
      label: 'Drain Maintenance Agreements',
      unit: 'total agreements',
      description: 'Number of active drain maintenance agreements. Annual drain cleaning agreements create recurring revenue and emergency-call prevention for customers.',
      targetRange: '50+ agreements per truck',
      warningBelow: '0 — most plumbers have none and should',
      improvementTips: [
        'Present drain maintenance to every customer after a drain call — they just experienced the problem',
        'Price at $150-$250 per year for annual drain cleaning',
        'Bundle with water heater flush for a home plumbing health agreement',
      ],
    },
  ],
  benchmarks: [
    {
      stage: 'Solo / Startup',
      revenueRange: '$0-$130K',
      employees: '1 (licensed plumber)',
      keyMetrics: [
        'Emergency service is your fastest path to cash — be reachable, be fast, charge appropriately',
        'Build flat rate pricing for your 15 most common calls in week one',
        'Every service call is a remodel conversation opportunity',
        'Keep material markup above 30% — this is standard industry practice',
      ],
      nextMove: 'Get a helper or apprentice to handle materials and drive time while you bill your hours.',
    },
    {
      stage: 'Growing',
      revenueRange: '$130K-$450K',
      employees: '2-5',
      keyMetrics: [
        'At least one additional licensed plumber — your license cannot be in two places at once',
        'Flat rate book in place and used on every call by every tech',
        'Tracking emergency vs non-emergency call mix to understand demand patterns',
        'Water treatment presentations on 20%+ of service calls',
      ],
      nextMove: 'Build your first drain maintenance agreement program — even 50 agreements creates meaningful recurring revenue.',
    },
    {
      stage: 'Established',
      revenueRange: '$450K-$1.3M',
      employees: '5-12',
      keyMetrics: [
        'Service and remodel as separate business lines with separate scheduling',
        '100+ drain maintenance or service agreements',
        'Water treatment division adding 15-20% to top line',
        'GC relationships generating steady remodel referrals',
      ],
      nextMove: 'Hire a Lead Plumber who can run jobs and manage a crew independently.',
    },
    {
      stage: 'Scaling',
      revenueRange: '$1.3M+',
      employees: '12+',
      keyMetrics: [
        'Commercial service alongside residential — higher tickets, scheduled work',
        'Revenue per licensed plumber above $150K',
        'Drain maintenance agreement base above 300 agreements',
        'Considering acquisitions of smaller plumbing operations',
      ],
      nextMove: 'A second market or commercial division. Do not scale before your first market is fully systemized.',
    },
  ],
  tradePhases: [
    {
      id: 'flat-rate',
      title: 'Convert to Flat Rate Pricing',
      subtitle: 'The single pricing decision that changes your business model.',
      when: 'Day one if possible — otherwise as soon as you have consistent call volume',
      steps: [
        {
          title: 'List your 20 most common service calls',
          description: 'Faucet repair, toilet replacement, water heater replacement, drain cleaning, leak detection, garbage disposal, shut-off valve. These 20 probably represent 70-80% of your service volume.',
          diyOption: 'Look at your last 6 months of invoices. Tally job types. Build the list from your actual data.',
          estimatedCost: 'Free — use your existing data.',
        },
        {
          title: 'Price each job at loaded cost plus 35% margin minimum',
          description: 'Loaded cost equals labor at your actual burdened rate including overhead, plus materials at cost plus 25-30% markup, plus overhead allocation. Then add your profit margin on top.',
          diyOption: 'Spreadsheet: hourly labor cost times estimated hours plus materials times 1.3 plus overhead per job. Then add margin.',
          estimatedCost: 'Free. Time to calculate.',
        },
        {
          title: 'Train every tech to present flat rate before starting work',
          description: 'The flat rate presentation is a professional service conversation, not a negotiation. Practice with each tech until they can present confidently without hesitation.',
          diyOption: 'Role-play with each tech. The hesitation is what kills flat rate adoption — practice eliminates it.',
          estimatedCost: 'Free. 30 minutes per tech.',
        },
      ],
    },
  ],
  tools: [
    {
      name: 'Jobber',
      category: 'Field Service Software',
      description: 'Scheduling, flat-rate quoting, and invoicing for plumbing service businesses.',
      url: 'https://getjobber.com',
      affiliateId: 'jobber',
      isFree: false,
      priceRange: '$49-$149/month',
      bestFor: 'Plumbing businesses $100K-$700K who need quoting, scheduling, and customer management.',
    },
    {
      name: 'Housecall Pro',
      category: 'Field Service Software',
      description: 'Strong for plumbing service operations with automated follow-ups and customer review management.',
      url: 'https://www.housecallpro.com',
      affiliateId: 'housecall-pro',
      isFree: false,
      priceRange: '$49-$129/month',
      bestFor: 'Residential plumbing service operations prioritizing customer experience and online reputation.',
    },
    {
      name: 'Simply Business',
      category: 'Insurance',
      description: 'General liability and tools coverage for plumbing contractors with fast online quoting.',
      url: 'https://www.simplybusiness.com',
      affiliateId: 'simply-business',
      isFree: false,
      priceRange: 'Varies',
      bestFor: 'Plumbing contractors who need coverage quickly and want to compare multiple carriers.',
    },
  ],
  licenseRequirements: [
    { state: 'Texas', board: 'TDLR — Plumbing', url: 'https://www.tdlr.texas.gov/plumbing/', examRequired: true, notes: 'Apprentice to Journeyman to Master path. Master required to pull permits. Exam and experience at each level.' },
    { state: 'Florida', board: 'DBPR — Plumbing Contractor', url: 'https://www.myfloridalicense.com', examRequired: true, notes: 'Certified or Registered Plumbing Contractor. Trade exam plus financial responsibility documentation.' },
    { state: 'Colorado', board: 'DORA — Plumbing', url: 'https://dora.colorado.gov/professions-occupations/plumbing-contractors', examRequired: true, notes: 'Journeyman and Master Plumber via DORA. Contractor license required to operate a plumbing business.' },
    { state: 'Arizona', board: 'AZ Registrar of Contractors', url: 'https://roc.az.gov/', examRequired: true, notes: 'CR-37 (residential) or C-37 (dual) plumbing license. Trade exam plus financial statement.' },
    { state: 'North Carolina', board: 'NC Plumbing-Heating-Fire Protection Board', url: 'https://www.nclbgc.org/', examRequired: true, notes: 'Plumbing contractor license. Limited, Intermediate, or Unlimited classification. Exam required.' },
    { state: 'Ohio', board: 'OH Local Jurisdiction', url: 'https://com.ohio.gov', examRequired: false, notes: 'Ohio sets plumbing licensing at local level. Check your city and county requirements directly.' },
  ],
  uniqueRisks: [
    'Water damage from faulty work is the top liability claim in plumbing — documentation and permits protect you',
    'Emergency-only positioning leaves you vulnerable to slow periods without water treatment or maintenance programs',
    'Material cost spikes on copper and PEX can destroy job margins on projects bid months earlier',
    'A single sewer line job with unexpected complications can wipe out a month of service call profit',
    'Unlicensed helpers doing licensed work creates liability that extends to your master plumber license',
  ],
  industryInsight: 'The plumbing businesses that struggle are the ones chasing emergency calls without a plan to convert those customers into something recurring. You show up in their worst moment, solve the problem, and leave. Three months later they cannot remember your name. The contractors who scale have a system for staying visible — drain maintenance programs, water treatment assessments, or a simple annual check-in. The emergency call is your introduction. What you do after is your business.',
}

// ─────────────────────────────────────────────────────────────────────────────
// Remaining trades — full structure, streamlined content
// ─────────────────────────────────────────────────────────────────────────────
const ROOFING: TradeConfig = {
  id: 'roofing', slug: 'roof', name: 'RoofMetrix', tradeName: 'Roofing', accentColor: '#D85A30',
  tagline: 'Weather creates opportunity. Systems capture it.',
  description: 'Roofing operates on a unique calendar driven by weather events and seasonal demand. Storm restoration, insurance claim navigation, and residential retail each require different skills. RoofMetrix tracks the metrics that separate organized roofing operations from the ones that scramble through every storm season.',
  kpis: [
    { id: 'insurance_close', label: 'Insurance Claim Close Rate', unit: '%', description: 'Of homeowners who file a claim after your inspection, what percentage result in a completed job with you.', targetRange: '55-75%', warningBelow: '35%', improvementTips: ['Follow up within 24 hours of every adjuster visit', 'Walk homeowners through the supplement process — most do not understand it', 'Never leave without a signed contingency agreement if damage is present'] },
    { id: 'supplement_rate', label: 'Supplement Revenue Rate', unit: '%', description: 'Percentage of insurance jobs where you successfully supplemented the original estimate. Most initial estimates miss items.', targetRange: '60-80% of insurance jobs', warningBelow: '20%', improvementTips: ['Learn to read Xactimate estimates — that is how adjusters write scopes', 'Document everything before, during, and after tear-off', 'Common missed items: code upgrades, drip edge, ice and water shield, permit fees'] },
    { id: 'referral_rate', label: 'Referral Rate', unit: '%', description: 'Percentage of new customers from past customer referrals. Roofing is a high-trust purchase — referrals convert at 3-5x the rate of cold leads.', targetRange: '25-40%', warningBelow: '10%', improvementTips: ['Ask for referrals at job completion when satisfaction is highest', 'Put a yard sign at every job — neighbors ask', 'Offer a referral incentive for completed referrals'] },
  ],
  benchmarks: [
    { stage: 'Solo / Startup', revenueRange: '$0-$200K', employees: '1-2 (owner plus crew)', keyMetrics: ['Know your material cost cold — margin lives and dies there', 'Document every job with photos from the first nail', 'Build a storm tracking habit — know what is coming before the phone rings'], nextMove: 'Build a consistent inspection pipeline — canvas storm-affected neighborhoods proactively.' },
    { stage: 'Growing', revenueRange: '$200K-$700K', employees: '3-8', keyMetrics: ['Insurance supplement process documented and consistent', 'Material supplier with net-30 terms — cash flow is critical in roofing', 'Warranty and callback tracking per crew'], nextMove: 'Hire a project coordinator who manages insurance claims and customer communication end-to-end.' },
    { stage: 'Established', revenueRange: '$700K-$2M', employees: '8-20', keyMetrics: ['Multiple crews running simultaneously', 'Retail non-insurance sales alongside storm restoration', 'Commercial roofing as a second revenue line'], nextMove: 'Expand to adjacent markets in storm season — crews can travel, overhead stays fixed.' },
    { stage: 'Scaling', revenueRange: '$2M+', employees: '20+', keyMetrics: ['Multi-state operations or multi-market capability', 'Revenue per crew day above $8,000', 'Commercial flat roof division for year-round revenue stability'], nextMove: 'Invest in local brand and reputation to reduce dependence on storm seasons.' },
  ],
  tradePhases: [
    {
      id: 'insurance-process', title: 'Master the Insurance Claim Process', subtitle: 'The contractors who understand claims win the most work.',
      when: 'Before your first storm season — this is table stakes in roofing',
      steps: [
        { title: 'Learn to read a Xactimate estimate', description: 'Xactimate is what most insurance adjusters use. Understanding line items, what is commonly missed, and how to document supplements is a core business skill.', diyOption: 'Xactimate training at xactware.com. YouTube also has extensive supplement training content.', estimatedCost: '$0-$300 for training resources' },
        { title: 'Build a photo documentation system', description: 'Every claim starts with your inspection photos. Every supplement starts with documentation of what was found. Consistent format across all jobs.', diyOption: 'Jobber or Google Photos with consistent naming. Property info, date, all affected areas, all measurements.', estimatedCost: 'Free with existing tools' },
        { title: 'Establish your contingency agreement process', description: 'A contingency agreement lets you inspect, submit to insurance, and be first in line if approved — without the homeowner committing money they do not have.', diyOption: 'One-page agreement: homeowner agrees you will perform the work if insurance approves the scope.', estimatedCost: '$200-$400 attorney review once' },
      ],
    },
  ],
  tools: [
    { name: 'Jobber', category: 'Field Service Software', description: 'Job management, quoting, and customer communication for roofing operations.', url: 'https://getjobber.com', affiliateId: 'jobber', isFree: false, priceRange: '$49-$149/month', bestFor: 'Roofing contractors who need job tracking, quoting, and customer communication in one place.' },
    { name: 'NEXT Insurance', category: 'Insurance', description: 'Fast online GL and instant certificate of insurance for roofing contractors.', url: 'https://www.nextinsurance.com', affiliateId: 'next-insurance', isFree: false, priceRange: 'Varies — roofing is higher risk', bestFor: 'Small roofing contractors who need quick coverage and certificates for job sites.' },
  ],
  licenseRequirements: [
    { state: 'Texas', board: 'No state roofing license — local requirements vary', url: 'https://www.sos.state.tx.us', examRequired: false, notes: 'Texas has no statewide roofing contractor license. Some cities and counties have local requirements.' },
    { state: 'Florida', board: 'DBPR — Roofing Contractor', url: 'https://www.myfloridalicense.com', examRequired: true, notes: 'Certified Roofing Contractor license required. Strong enforcement in Florida.' },
    { state: 'Colorado', board: 'Local jurisdiction', url: 'https://dora.colorado.gov', examRequired: false, notes: 'No statewide roofing license in Colorado. Local requirements vary.' },
    { state: 'Arizona', board: 'AZ Registrar of Contractors', url: 'https://roc.az.gov/', examRequired: true, notes: 'CR-42 roofing license. Trade exam plus financial statement.' },
    { state: 'North Carolina', board: 'NC LBGC', url: 'https://www.nclbgc.org/', examRequired: true, notes: 'General contractor license with roofing endorsement.' },
    { state: 'Ohio', board: 'OH Local Jurisdiction', url: 'https://com.ohio.gov', examRequired: false, notes: 'Local licensing requirements only. Check your city and county.' },
  ],
  uniqueRisks: ['Storm chasing creates customer acquisition costs that can exceed margins without strong close rates', 'Subcontractor quality control — their work is your warranty liability', 'Material price volatility on multi-week insurance jobs can erode margin significantly', 'Three or more bad reviews during storm season can cost more than a bad job', 'Insurance carriers increasingly scrutinize roofing claims in storm markets'],
  industryInsight: 'Roofing is one of the few trades where you can go from zero to $500K in a single storm season — and go broke the next year waiting for the next storm. The businesses that survive build a local reputation and referral base during normal weather, so when a storm hits they are the first call in every neighborhood. Storm chasing works short-term. Community presence works long-term. The best roofing contractors do both.',
}

const CLEANING: TradeConfig = {
  id: 'cleaning', slug: 'clean', name: 'CleanMetrix', tradeName: 'Cleaning Services', accentColor: '#5DCAA5',
  tagline: 'Recurring clients are the business. Everything else is noise.',
  description: 'Cleaning services have the lowest barrier to entry and the highest retention potential of any trade. A client who books monthly for 3 years is worth $3,000-$6,000+ in lifetime value. CleanMetrix tracks the metrics that separate transactional cleaning businesses from ones that compound.',
  kpis: [
    { id: 'retention', label: 'Monthly Client Retention Rate', unit: '%', description: 'Percentage of recurring clients who rebook the following month. The most important metric in cleaning.', targetRange: '92-97% monthly', warningBelow: '85%', improvementTips: ['Follow up after every first clean with a quality check call', 'Track cancellation reasons — one reason appearing twice is a solvable problem', 'Consistent cleaning team assignment dramatically increases retention'] },
    { id: 'route_density', label: 'Route Density', unit: 'clients/area', description: 'How concentrated your clients are geographically. Dense routes mean more cleans per day and more referrals from neighbors.', targetRange: '3-5 clients within 1 mile', warningBelow: 'Every client requires 15+ minute drive', improvementTips: ['Run acquisition campaigns specifically in neighborhoods where you already have clients', 'Ask current clients for referrals on their street — your van is already there', 'Decline clients outside your target geography even if it means turning down revenue'] },
    { id: 'avg_ticket', label: 'Average Job Value', unit: '$', description: 'Average revenue per clean. Most cleaning businesses undercharge or fail to upsell add-on services.', targetRange: '$150-$280 (residential)', warningBelow: '$100', improvementTips: ['Price by square footage and condition, not by hours', 'Create an add-on services menu and present it at booking', 'Deep clean as an entry offer at a higher price converts to recurring clients well'] },
  ],
  benchmarks: [
    { stage: 'Solo / Startup', revenueRange: '$0-$60K', employees: '1', keyMetrics: ['20 recurring clients is a viable solo business', 'Every client is a referral source — ask explicitly', 'Track your time per job to ensure profitability'], nextMove: 'Hire your first cleaner and take yourself partially off cleaning to focus on client acquisition.' },
    { stage: 'Growing', revenueRange: '$60K-$200K', employees: '2-5', keyMetrics: ['Schedule consistency is your retention engine', 'Cleaning team training and quality control process in place', 'Route optimization — group clients geographically'], nextMove: 'Build a quality control system that does not require you to be at every job.' },
    { stage: 'Established', revenueRange: '$200K-$600K', employees: '5-15', keyMetrics: ['Commercial cleaning alongside residential — larger contracts', 'Recurring revenue covers all fixed costs', '90%+ retention rate company-wide'], nextMove: 'Separate residential and commercial as distinct operations with dedicated teams.' },
    { stage: 'Scaling', revenueRange: '$600K+', employees: '15+', keyMetrics: ['Multi-location consideration or franchise model', 'Commercial contract base provides stability', 'Brand and reputation as key differentiators in a commodity market'], nextMove: 'Systematize completely so the business runs without your daily involvement.' },
  ],
  tradePhases: [],
  tools: [
    { name: 'Jobber', category: 'Field Service Software', description: 'Scheduling, recurring client management, and team dispatching for cleaning businesses.', url: 'https://getjobber.com', affiliateId: 'jobber', isFree: false, priceRange: '$49-$149/month', bestFor: 'Cleaning businesses with 3+ cleaners who need route management and client communication.' },
    { name: 'Wave Accounting', category: 'Bookkeeping', description: 'Free invoicing and expense tracking for early-stage cleaning businesses.', url: 'https://www.waveapps.com', affiliateId: 'wave', isFree: true, priceRange: 'Free', bestFor: 'Solo cleaners and small operations who need invoicing without monthly fees.' },
  ],
  licenseRequirements: [
    { state: 'Texas', board: 'TX SOS — Business Registration', url: 'https://www.sos.state.tx.us', examRequired: false, notes: 'No trade license required. Business registration plus liability insurance strongly recommended.' },
    { state: 'Florida', board: 'FL Division of Corporations', url: 'https://dos.fl.gov/sunbiz/', examRequired: false, notes: 'No state trade license. Register your business and carry general liability.' },
    { state: 'Colorado', board: 'CO SOS', url: 'https://www.sos.state.co.us', examRequired: false, notes: 'No trade license. Business registration required.' },
    { state: 'Arizona', board: 'AZ Corporation Commission', url: 'https://azcc.gov', examRequired: false, notes: 'No trade license required for residential cleaning.' },
    { state: 'North Carolina', board: 'NC SOS', url: 'https://www.sosnc.gov', examRequired: false, notes: 'No state trade license. Commercial cleaning may have local requirements.' },
    { state: 'Ohio', board: 'OH SOS', url: 'https://www.ohiosos.gov', examRequired: false, notes: 'No state trade license for cleaning services.' },
  ],
  uniqueRisks: ['Low barrier to entry means constant new competition and price pressure', 'Turnover of cleaning staff is the top operational challenge', 'One property damage claim can exceed job margin by 10x', 'Key cleaner absence on a scheduled day directly damages client retention'],
  industryInsight: 'Cleaning is the trade where recurring revenue is most attainable and most neglected. The difference between a cleaning business at $80K and one at $400K is almost always the retention system. Quality gets you the first client. The follow-up call, the consistent team, and the proactive communication keep them for years.',
}

const LANDSCAPING: TradeConfig = {
  id: 'landscaping', slug: 'ground', name: 'GroundMetrix', tradeName: 'Landscaping & Lawn Care', accentColor: '#3B6D11',
  tagline: 'Maintenance contracts are your foundation. Everything else is gravy.',
  description: 'Landscaping and lawn care range from solo mow-and-blow operations to full-service landscape design companies. The model that works at scale is built on recurring maintenance contracts. GroundMetrix tracks what turns seasonal labor into a year-round business.',
  kpis: [
    { id: 'contract_rate', label: 'Maintenance Contract Rate', unit: '%', description: 'Percentage of lawn care customers on annual or seasonal contracts vs one-time service.', targetRange: '60-80% of revenue on contract', warningBelow: '30%', improvementTips: ['Present annual contracts at every estimate — price certainty and priority scheduling are genuine benefits', 'Offer monthly billing on annual contracts for client convenience', 'Include winter services where possible to make contracts year-round'] },
    { id: 'rev_per_crew', label: 'Revenue Per Crew Day', unit: '$', description: 'Total daily revenue divided by crews running. Low revenue per crew means routes are inefficient or jobs are underpriced.', targetRange: '$1,200-$2,500 per crew per day', warningBelow: '$600 per crew per day', improvementTips: ['Remove accounts below your minimum profitability threshold', 'Group routes geographically to eliminate drive time', 'Charge more for difficult access, steep terrain, or excessive travel'] },
  ],
  benchmarks: [
    { stage: 'Solo / Startup', revenueRange: '$0-$80K', employees: '1', keyMetrics: ['30-40 weekly accounts is a viable solo operation', 'Every account within 5 miles of the next one', 'Quote annual contracts from day one'], nextMove: 'Hire a second person so you can take on more accounts without working 70-hour weeks.' },
    { stage: 'Growing', revenueRange: '$80K-$300K', employees: '2-6', keyMetrics: ['2 full crews with defined routes', '60%+ on maintenance contracts', 'Landscape installation as an upsell to maintenance clients'], nextMove: 'A dedicated estimator so you are not doing all new business development personally.' },
    { stage: 'Established', revenueRange: '$300K-$900K', employees: '6-20', keyMetrics: ['Multiple crews with crew leaders', 'Commercial maintenance contracts alongside residential', 'Design and installation as a separate revenue line'], nextMove: 'Operations manager who runs crew scheduling without you.' },
    { stage: 'Scaling', revenueRange: '$900K+', employees: '20+', keyMetrics: ['Commercial property maintenance contracts', 'Snow removal as complementary winter service', 'Revenue per crew day above $2,000'], nextMove: 'Multi-location or acquisition strategy in adjacent markets.' },
  ],
  tradePhases: [],
  tools: [{ name: 'Jobber', category: 'Field Service Software', description: 'Route management, recurring scheduling, and contract billing for lawn care and landscaping.', url: 'https://getjobber.com', affiliateId: 'jobber', isFree: false, priceRange: '$49-$149/month', bestFor: 'Landscaping businesses with 2+ crews who need route optimization and contract billing.' }],
  licenseRequirements: [
    { state: 'Texas', board: 'TX Dept of Agriculture — Pesticide', url: 'https://www.texasagriculture.gov', examRequired: true, notes: 'Pesticide applicator license required if applying chemicals. Business registration with TX SOS.' },
    { state: 'Florida', board: 'FL Dept of Agriculture — Pesticide', url: 'https://www.fdacs.gov', examRequired: true, notes: 'Pesticide applicator license required. Landscape contractor license for certain work.' },
    { state: 'Colorado', board: 'CO Dept of Agriculture', url: 'https://ag.colorado.gov', examRequired: true, notes: 'Pesticide applicator license if applying chemicals.' },
    { state: 'Arizona', board: 'AZ Office of Pest Management', url: 'https://opm.az.gov', examRequired: true, notes: 'Pest control license if applying pesticides.' },
    { state: 'North Carolina', board: 'NC Dept of Agriculture', url: 'https://www.ncagr.gov', examRequired: true, notes: 'Pesticide applicator license for chemical applications.' },
    { state: 'Ohio', board: 'OH Dept of Agriculture', url: 'https://agri.ohio.gov', examRequired: true, notes: 'Pesticide applicator certification required for chemical applications.' },
  ],
  uniqueRisks: ['Weather dependency creates revenue volatility — drought kills demand', 'Crew turnover at peak season directly threatens client retention', 'Equipment breakdown mid-season can delay entire routes', 'Customer acquisition in spring is expensive — retention through winter is cheaper'],
  industryInsight: 'Landscaping companies that scale are usually not the most skilled — they are the most systematic. Consistent cut quality, consistent crew assignment, consistent billing. Customers cancel because of uncertainty and inconsistency, not because the grass was not cut perfectly. Build the systems first.',
}

const HANDYMAN: TradeConfig = {
  id: 'handyman', slug: 'fix', name: 'FixMetrix', tradeName: 'Handyman Services', accentColor: '#888780',
  tagline: 'The right jobs, priced right, for the right customers.',
  description: 'Handyman services face a positioning challenge: being the person who does everything is a recipe for low prices and difficult customers. The businesses that thrive specialize — either in a customer type or a job category — and become known as the best at that specific thing.',
  kpis: [
    { id: 'avg_ticket', label: 'Average Job Value', unit: '$', description: 'Average revenue per job. Low average ticket usually means taking too many small jobs with the same overhead as profitable ones.', targetRange: '$250-$600+', warningBelow: '$150', improvementTips: ['Set a minimum job size of $150-$250 and stick to it', 'Bundle small tasks into one visit', 'Specialize in higher-value categories: aging-in-place, deck repairs, door and window work'] },
    { id: 'repeat_rate', label: 'Repeat Customer Rate', unit: '%', description: 'Percentage of revenue from returning customers. High repeat rates mean a sustainable client base.', targetRange: '50-70% of revenue from returning clients', warningBelow: '25%', improvementTips: ['Quarterly touchpoint with past clients', 'Annual home maintenance packages for high-value clients', 'Property management companies are repeat clients by design — pursue them'] },
  ],
  benchmarks: [
    { stage: 'Solo / Startup', revenueRange: '$0-$70K', employees: '1', keyMetrics: ['Know your hourly cost and price above it', 'Minimum job size policy from day one', 'Build relationships with 2-3 property managers in year one'], nextMove: 'Define your specialty — the thing you are best at and want to be known for.' },
    { stage: 'Growing', revenueRange: '$70K-$200K', employees: '1-3', keyMetrics: ['Average ticket above $300', 'Property management or commercial recurring clients', 'Referral system generating 30%+ of new jobs'], nextMove: 'Add a second technician and take yourself partially off the tools.' },
    { stage: 'Established', revenueRange: '$200K-$500K', employees: '3-8', keyMetrics: ['Specialization visible in your marketing', 'Recurring maintenance contract clients', 'Revenue per tech above $100K'], nextMove: 'Lead tech or operations manager who runs jobs without daily supervision.' },
    { stage: 'Scaling', revenueRange: '$500K+', employees: '8+', keyMetrics: ['Multiple specialty teams', 'Commercial and institutional client base', 'Premium positioning in your market'], nextMove: 'Franchise or multi-location consideration if systems are repeatable.' },
  ],
  tradePhases: [],
  tools: [
    { name: 'Jobber', category: 'Field Service Software', description: 'Job management, quoting, and invoicing for handyman operations.', url: 'https://getjobber.com', affiliateId: 'jobber', isFree: false, priceRange: '$49-$149/month', bestFor: 'Handyman businesses with consistent volume who need quoting and client management.' },
    { name: 'Wave Accounting', category: 'Bookkeeping', description: 'Free invoicing and expense tracking for solo operators.', url: 'https://www.waveapps.com', affiliateId: 'wave', isFree: true, priceRange: 'Free', bestFor: 'Solo handyman operators who need invoicing without a monthly bill.' },
  ],
  licenseRequirements: [
    { state: 'Texas', board: 'Local jurisdiction varies', url: 'https://www.sos.state.tx.us', examRequired: false, notes: 'No state handyman license. Many cities limit job value without a contractor license.' },
    { state: 'Florida', board: 'Local jurisdiction', url: 'https://dos.fl.gov/sunbiz/', examRequired: false, notes: 'Handyman exemption exists but has job value and scope limits. Check county rules.' },
    { state: 'Colorado', board: 'Local jurisdiction', url: 'https://dora.colorado.gov', examRequired: false, notes: 'No statewide handyman license. Contractor license needed above certain value thresholds.' },
    { state: 'Arizona', board: 'AZ ROC — Handyman exemption', url: 'https://roc.az.gov/', examRequired: false, notes: 'Handyman exemption for jobs under $1,000. Above that requires ROC license.' },
    { state: 'North Carolina', board: 'NC LBGC', url: 'https://www.nclbgc.org/', examRequired: false, notes: 'Handyman work has exemptions below certain dollar thresholds.' },
    { state: 'Ohio', board: 'Local jurisdiction', url: 'https://com.ohio.gov', examRequired: false, notes: 'No statewide handyman license. Local requirements vary.' },
  ],
  uniqueRisks: ['No clear specialization leads to competing on price with every other handyman', 'Property damage liability — GL insurance is non-negotiable', 'Scope creep on T&M jobs erodes margin without firm communication upfront', 'Small job economics require high volume — efficiency is survival'],
  industryInsight: 'The handyman who tries to do everything for everyone never builds a real business — they build a busy job. The ones who scale have a niche: preferred vendor for a property management company, go-to for a senior services network, or the best deck and fence contractor in town. Positioning is strategy in handyman. Everything else is operations.',
}

const PAINTING: TradeConfig = {
  id: 'painting', slug: 'paint', name: 'PaintMetrix', tradeName: 'Painting', accentColor: '#C084FC',
  tagline: 'Prep is your reputation. Referrals are your marketing.',
  description: 'Painting contracting ranges from solo residential painters to commercial crews with multi-year maintenance contracts. Whether you build a reputation and referral base or compete on price in a commodity market is the key variable. PaintMetrix tracks what separates painting businesses that compound from ones that start over every season.',
  kpis: [
    { id: 'close_rate', label: 'Estimate Close Rate', unit: '%', description: 'Percentage of estimates that convert to booked jobs. Low close rates usually mean price shock or failure to differentiate your process.', targetRange: '40-60%', warningBelow: '25%', improvementTips: ['Present your preparation process in detail — most customers do not know what separates good from bad paint jobs', 'Itemize your estimate — customers who understand scope are less likely to shop price alone', 'Follow up every estimate within 48 hours'] },
    { id: 'referral_rate', label: 'Referral Rate', unit: '%', description: 'Percentage of new customers from referrals. A well-executed job in a neighborhood generates neighbor inquiries without any marketing spend.', targetRange: '40-60% of new customers', warningBelow: '15%', improvementTips: ['Put a yard sign at every job', 'Ask for referrals at job completion when satisfaction is highest', 'Offer a referral reward for completed referrals'] },
  ],
  benchmarks: [
    { stage: 'Solo / Startup', revenueRange: '$0-$80K', employees: '1', keyMetrics: ['Know your paint and material markup — 30%+ minimum', 'Every job is a portfolio piece — document with photos', 'Price for quality, not to match the cheapest bid'], nextMove: 'Hire a laborer for prep work so you can focus on finish work and more estimates.' },
    { stage: 'Growing', revenueRange: '$80K-$250K', employees: '2-5', keyMetrics: ['Crew training on prep standards', 'Commercial painting as a second revenue line', 'Referral system generating 40%+ of leads'], nextMove: 'Build a lead painter role who can run jobs independently.' },
    { stage: 'Established', revenueRange: '$250K-$700K', employees: '5-15', keyMetrics: ['Commercial and HOA painting contracts', 'Multiple crews running simultaneously', 'Average residential job above $4,000'], nextMove: 'Operations manager who handles crew scheduling and quality control.' },
    { stage: 'Scaling', revenueRange: '$700K+', employees: '15+', keyMetrics: ['Multi-family and commercial contract base', 'Revenue per painter above $100K', 'Brand as premium differentiator'], nextMove: 'Multi-market expansion or commercial division focus.' },
  ],
  tradePhases: [],
  tools: [{ name: 'Jobber', category: 'Field Service Software', description: 'Quoting, scheduling, and job management for painting contractors.', url: 'https://getjobber.com', affiliateId: 'jobber', isFree: false, priceRange: '$49-$149/month', bestFor: 'Painting contractors who need professional quoting and crew scheduling.' }],
  licenseRequirements: [
    { state: 'Texas', board: 'No state painting license', url: 'https://www.sos.state.tx.us', examRequired: false, notes: 'No state painting contractor license. Business registration plus liability insurance.' },
    { state: 'Florida', board: 'DBPR — Painting (optional)', url: 'https://www.myfloridalicense.com', examRequired: false, notes: 'Painting contractor certification optional in FL. Some commercial work requires licensed contractor.' },
    { state: 'Colorado', board: 'No state license', url: 'https://www.sos.state.co.us', examRequired: false, notes: 'No state painting license.' },
    { state: 'Arizona', board: 'AZ ROC — C-99', url: 'https://roc.az.gov/', examRequired: true, notes: 'C-99 painting contractor license for commercial work.' },
    { state: 'North Carolina', board: 'Local requirements', url: 'https://www.sosnc.gov', examRequired: false, notes: 'No statewide painting license.' },
    { state: 'Ohio', board: 'Local jurisdiction', url: 'https://www.ohiosos.gov', examRequired: false, notes: 'No statewide painting contractor license.' },
  ],
  uniqueRisks: ['Prep shortcuts follow you — bad jobs generate permanent bad reviews', 'Weather delays on exterior projects create scheduling and cash flow gaps', 'Crew quality equals job quality — turnover is a business risk', 'Lead paint regulations on pre-1978 homes require EPA RRP certification — significant liability if ignored'],
  industryInsight: 'The gap between a painting business at $80K and $400K is almost never the painting — it is the prep. Once a customer understands why you are more expensive, they become your best referral source.',
}

const SOLAR: TradeConfig = {
  id: 'solar', slug: 'sun', name: 'SunMetrix', tradeName: 'Solar', accentColor: '#639922',
  tagline: 'Install is the start. Battery, service, and monitoring are the business.',
  description: 'Solar installation is a high-growth, high-complexity trade with significant incentive navigation, financing attach rates, and post-install service opportunities. SunMetrix tracks the metrics that matter for solar contractors in a rapidly changing market.',
  kpis: [
    { id: 'battery_attach', label: 'Battery Storage Attach Rate', unit: '%', description: 'Percentage of solar installs that include a battery storage system. Battery attachment dramatically increases average job value.', targetRange: '25-45%', warningBelow: '10%', improvementTips: ['Present battery in every proposal — let the customer decline, do not pre-screen them out', 'Net metering changes in many states make batteries increasingly attractive — know your state policy', 'Finance the battery separately if needed'] },
    { id: 'lead_to_install', label: 'Lead to Install Time', unit: 'days', description: 'Days from initial customer contact to energization. Long lead times mean frustrated customers and more cancellations.', targetRange: '45-90 days', warningBelow: '>120 days', improvementTips: ['Permitting delays are the most common culprit — build permit expediting into your process', 'Know your local utility interconnection backlog', 'Weekly updates to customers during the wait reduce cancellations significantly'] },
  ],
  benchmarks: [
    { stage: 'Solo / Startup', revenueRange: '$0-$300K', employees: '1-3', keyMetrics: ['Subcontract installation before hiring full crews', 'Focus on residential first — lower complexity', 'Understand your state incentive landscape deeply'], nextMove: 'Build a dedicated sales process before scaling installation capacity.' },
    { stage: 'Growing', revenueRange: '$300K-$1M', employees: '3-10', keyMetrics: ['In-house installation vs subcontractor mix defined', 'Battery attach rate above 20%', 'Financing partner relationships established'], nextMove: 'Commercial solar as a second revenue line — larger projects, longer cycles.' },
    { stage: 'Established', revenueRange: '$1M-$3M', employees: '10-25', keyMetrics: ['Commercial and industrial alongside residential', 'Service and monitoring revenue growing', 'Revenue per install crew day above $8,000'], nextMove: 'Operations and maintenance contracts as recurring revenue base.' },
    { stage: 'Scaling', revenueRange: '$3M+', employees: '25+', keyMetrics: ['Multi-state operations', 'Monitoring and service division as standalone revenue', 'Utility-scale or commercial project capability'], nextMove: 'Acquisition or partnership with roofing or electrical for integrated offerings.' },
  ],
  tradePhases: [],
  tools: [{ name: 'Relay Banking', category: 'Banking', description: 'Business banking for managing large job deposits and material payments separately.', url: 'https://relayfi.com', affiliateId: 'relay', isFree: true, priceRange: 'Free', bestFor: 'Solar contractors managing large project deposits and milestone payments.' }],
  licenseRequirements: [
    { state: 'Texas', board: 'TDLR — Electrical for solar', url: 'https://www.tdlr.texas.gov', examRequired: true, notes: 'Electrical contractor license required for solar interconnection. No separate solar license.' },
    { state: 'Florida', board: 'DBPR — Electrical or Solar Contractor', url: 'https://www.myfloridalicense.com', examRequired: true, notes: 'Electrical contractor license required. FL has a Solar Contractor specialty license option.' },
    { state: 'Colorado', board: 'DORA — Electrical', url: 'https://dora.colorado.gov', examRequired: true, notes: 'Electrical contractor license for all solar-electrical work.' },
    { state: 'Arizona', board: 'AZ ROC', url: 'https://roc.az.gov/', examRequired: true, notes: 'Electrical contractor license required for interconnection. Separate license for structural mounting work.' },
    { state: 'North Carolina', board: 'NC Electrical', url: 'https://www.nclbgc.org/', examRequired: true, notes: 'Electrical contractor license for interconnects. General contractor for structural work.' },
    { state: 'Ohio', board: 'Local electrical licensing', url: 'https://com.ohio.gov', examRequired: false, notes: 'Electrical work licensing is local in Ohio.' },
  ],
  uniqueRisks: ['Net metering policy changes can shift customer value proposition overnight', 'Incentive cliff risks create volatile demand spikes followed by slowdowns', 'Roof penetrations from solar installation create long-term liability', 'Equipment warranty claims require strong manufacturer relationships to resolve quickly'],
  industryInsight: 'The solar contractors who build durable businesses are the ones who build service relationships beyond the install. Battery storage, monitoring subscriptions, and annual performance reviews are the path to recurring revenue. The install pays for today. The service relationship pays for the next decade.',
}

const CONSTRUCTION: TradeConfig = {
  id: 'construction', slug: 'build', name: 'BuildMetrix', tradeName: 'Construction & Remodeling', accentColor: '#7F77DD',
  tagline: 'Win rate, change order capture, and subcontractor management. That is the game.',
  description: 'General contracting and remodeling require managing multiple trades, client expectations, and project timelines simultaneously. The contractors who scale build systems for bidding accuracy, change order documentation, and subcontractor management — not just for doing great work.',
  kpis: [
    { id: 'bid_win_rate', label: 'Bid Win Rate', unit: '%', description: 'Percentage of bids submitted that are won. Very high win rate suggests underpricing. Very low suggests overpricing or failure to qualify leads.', targetRange: '25-45%', warningBelow: '<15% or >65%', improvementTips: ['Track win rate by project type — some may be consistently profitable, others not', 'Pre-qualify clients before spending time on a bid — budget, timeline, decision process', 'Lost bid follow-up — ask why you did not win; data is worth more than pride'] },
    { id: 'change_order', label: 'Change Order Capture Rate', unit: '%', description: 'Percentage of scope changes that are documented and billed. Unbilled change orders are one of the most common reasons construction projects are unprofitable.', targetRange: '90-100%', warningBelow: '70%', improvementTips: ['Never start work on a scope change without a signed change order regardless of size', 'Train your team — they often absorb small changes to avoid conflict with clients', 'Build change order templates into your project management system'] },
  ],
  benchmarks: [
    { stage: 'Solo / Startup', revenueRange: '$0-$200K', employees: '1-3', keyMetrics: ['Scope control is survival — change orders from day one', 'Know your loaded cost per hour and apply it to every estimate', 'Subcontractor relationships are your capacity — build them early'], nextMove: 'A dedicated project manager so you are not managing every subcontractor personally.' },
    { stage: 'Growing', revenueRange: '$200K-$750K', employees: '3-10', keyMetrics: ['Project management software tracking schedules, budgets, and change orders', 'Preferred subcontractor network in every trade', 'Gross margin per project above 30%'], nextMove: 'Hire a Project Manager or Superintendent who runs jobs day-to-day.' },
    { stage: 'Established', revenueRange: '$750K-$2.5M', employees: '10-25', keyMetrics: ['Estimating system producing accurate bids consistently', 'Design-build capability for higher-margin projects', 'Commercial work alongside residential'], nextMove: 'Business Development Manager focused on architect, developer, and commercial client relationships.' },
    { stage: 'Scaling', revenueRange: '$2.5M+', employees: '25+', keyMetrics: ['Multiple project managers running simultaneous projects', 'Revenue per project manager above $800K', 'Bonding capacity keeping pace with project size'], nextMove: 'Geographic expansion or vertical integration of key subcontractor trades.' },
  ],
  tradePhases: [],
  tools: [
    { name: 'Jobber', category: 'Field Service Software', description: 'Project management, quoting, and client communication for remodeling contractors.', url: 'https://getjobber.com', affiliateId: 'jobber', isFree: false, priceRange: '$49-$149/month', bestFor: 'Remodeling contractors who need project tracking and client communication tools.' },
    { name: 'QuickBooks', category: 'Accounting', description: 'Job costing, progress billing, and subcontractor payment tracking for construction.', url: 'https://quickbooks.intuit.com/small-business', affiliateId: 'quickbooks', isFree: false, priceRange: '$30-$60/month', bestFor: 'GCs who need job-level P&L and subcontractor payment management.' },
  ],
  licenseRequirements: [
    { state: 'Texas', board: 'No GC license — local requirements', url: 'https://www.sos.state.tx.us', examRequired: false, notes: 'No statewide GC license in Texas. Individual trades still require their own licenses.' },
    { state: 'Florida', board: 'DBPR — General Contractor', url: 'https://www.myfloridalicense.com', examRequired: true, notes: 'Certified General Contractor license required. Business exam plus trade exam.' },
    { state: 'Colorado', board: 'Local jurisdiction', url: 'https://dora.colorado.gov', examRequired: false, notes: 'No statewide GC license. Trades within projects require individual licenses.' },
    { state: 'Arizona', board: 'AZ ROC — B-1 or KB', url: 'https://roc.az.gov/', examRequired: true, notes: 'B-1 (residential) or KB (commercial) general contractor license.' },
    { state: 'North Carolina', board: 'NC LBGC — General Contractor', url: 'https://www.nclbgc.org/', examRequired: true, notes: 'Limited, Intermediate, or Unlimited GC license. Exam required.' },
    { state: 'Ohio', board: 'OH OCILB', url: 'https://com.ohio.gov', examRequired: true, notes: 'Residential contractor license via OCILB. Commercial varies by local jurisdiction.' },
  ],
  uniqueRisks: ['Lien laws vary by state — failing to file or respond creates major cash flow risk', 'Subcontractor failure mid-project puts completion cost on you', 'Material escalation clauses essential on projects over 90 days', 'Permit and inspection delays cascade across all subcontractors simultaneously'],
  industryInsight: 'The most common reason construction companies fail is not bad work — it is bad bids that look profitable until the change orders go unbilled, the sub shows up late, and materials cost more. Estimating accuracy and change order discipline are the business. Everything else is skill you already have.',
}

// ─────────────────────────────────────────────────────────────────────────────
// Export registry
// ─────────────────────────────────────────────────────────────────────────────
export const TRADE_CONFIGS: Record<string, TradeConfig> = {
  hvac:         HVAC,
  electrical:   ELECTRICAL,
  plumbing:     PLUMBING,
  roofing:      ROOFING,
  cleaning:     CLEANING,
  landscaping:  LANDSCAPING,
  handyman:     HANDYMAN,
  painting:     PAINTING,
  solar:        SOLAR,
  construction: CONSTRUCTION,
}

export function getTradeConfig(tradeId: string): TradeConfig | null {
  return TRADE_CONFIGS[tradeId] ?? null
}

export function getTradeBySlug(slug: string): TradeConfig | null {
  return Object.values(TRADE_CONFIGS).find(t => t.slug === slug) ?? null
}
