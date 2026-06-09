// ─────────────────────────────────────────────────────────────────────────────
// SubZeroMetrix — Marketing Assets
// 14 flyer concepts, 30-day social plan, and referral/upsell/cross-sell road paths
// ─────────────────────────────────────────────────────────────────────────────

export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'any'
export type FlyerAudience = 'residential' | 'commercial' | 'both'
export type FlyerDistribution = 'door-hanger' | 'direct-mail' | 'social' | 'email' | 'yard-sign' | 'truck'

export interface FlyerConcept {
  id: string
  title: string
  headline: string
  subheadline: string
  offer: string
  audience: FlyerAudience
  season: Season
  tradeRelevance: string[]
  doorHangerNote: string
  directMailNote: string
  socialCaption: string
  upsellTieIn: string
  followUpNote: string
  distributions: FlyerDistribution[]
  lockedContent: string
}

export interface SocialPost {
  weekNumber: number
  dayNumber: number
  theme: string
  platform: string[]
  contentType: 'photo' | 'video' | 'graphic' | 'text'
  caption: string
  callToAction: string
  notes: string
}

export interface SocialWeekProgram {
  weekNumber: number
  theme: string
  goal: string
  posts: SocialPost[]
}

export interface RoadPathStep {
  stepNumber: number
  action: string
  detail: string
  timing: string
  tool?: string
}

export interface RoadPath {
  id: string
  title: string
  shortTitle: string
  phaseRelevance: string[]
  summary: string
  steps: RoadPathStep[]
  successMetric: string
  lockedContent: string
}

// ── Flyer Concepts ─────────────────────────────────────────────────────────────

export const FLYER_CONCEPTS: FlyerConcept[] = [

  {
    id: 'seasonal-hvac-tuneup',
    title: 'Seasonal HVAC Tune-Up',
    headline: 'Is Your AC Ready for Summer?',
    subheadline: 'Beat the rush. Book your tune-up now.',
    offer: '$89 AC Tune-Up Special — Book Before [Date]',
    audience: 'residential',
    season: 'spring',
    tradeRelevance: ['hvac'],
    doorHangerNote: 'Target neighborhoods with homes 10+ years old. Hit 200–500 homes within a tight 5-mile radius. Pre-summer is the highest-converting door-hanger window for HVAC.',
    directMailNote: 'Send 3–4 weeks before peak heat. Use a red or orange design that conveys urgency. Include a QR code booking link and a deadline date.',
    socialCaption: 'Before it gets hot — make sure your AC is ready. We\'re booking spring tune-ups now and slots fill fast. $89 special for the next [X] appointments. Call us or tap the link to schedule.',
    upsellTieIn: 'On every tune-up, offer maintenance agreement enrollment at the end of the visit.',
    followUpNote: 'Follow up with a post-season "how did your AC hold up?" message in August with a fall heating check offer.',
    distributions: ['door-hanger', 'direct-mail', 'social', 'email'],
    lockedContent: 'Printable door-hanger template · Direct mail postcard design · Campaign timing calendar · Booking link setup guide',
  },

  {
    id: 'pre-winter-heating-check',
    title: 'Pre-Winter Heating Safety Check',
    headline: 'Don\'t Get Left in the Cold.',
    subheadline: 'Heating system safety inspection before temperatures drop.',
    offer: 'Free Safety Inspection with Any Heating Tune-Up — Limited Slots',
    audience: 'residential',
    season: 'fall',
    tradeRelevance: ['hvac'],
    doorHangerNote: 'Distribute in early October before first cold weather hits. Use a deep blue or charcoal design with urgency. "Last [X] slots" messaging increases response rate.',
    directMailNote: 'Send in the first two weeks of October. EDDM (Every Door Direct Mail) is cost-effective for tight radius campaigns.',
    socialCaption: 'Cold weather is coming faster than you think. A heating safety check now costs a lot less than an emergency call at 11pm on the first cold night. We\'re scheduling fall tune-ups — book yours before the rush.',
    upsellTieIn: 'Present maintenance agreement and IAQ (indoor air quality) add-ons on every heating check.',
    followUpNote: 'Customers who do not respond before first cold snap receive a "did you stay warm last night?" message.',
    distributions: ['door-hanger', 'direct-mail', 'social', 'email'],
    lockedContent: 'Fall heating campaign template · EDDM radius planning guide · Cold snap re-engagement sequence',
  },

  {
    id: 'new-contractor-intro',
    title: 'New Contractor Introduction',
    headline: 'New to [Your City]? So Are We.',
    subheadline: '[Trade] services from a local team that actually shows up.',
    offer: 'First Service Call — No Trip Charge. Meet us before you need us.',
    audience: 'residential',
    season: 'any',
    tradeRelevance: ['all'],
    doorHangerNote: 'Use in targeted neighborhoods during the first 60–90 days of entering a new service area. Good for contractors expanding to a new zip code. Include a QR code to Google review profile.',
    directMailNote: 'Combine with EDDM (Every Door Direct Mail) to saturate a new service area efficiently. Follow up with a second mailing 30 days later.',
    socialCaption: 'Proud to be serving [Neighborhood/City]. If you\'re looking for a [trade] company that shows up on time, does the job right, and stands behind their work — give us a call. First service call, no trip charge.',
    upsellTieIn: 'On every intro call, offer a full system diagnostic and maintenance agreement enrollment.',
    followUpNote: 'Intro flyer customers who book but do not enroll in maintenance get a 30-day follow-up offer.',
    distributions: ['door-hanger', 'direct-mail', 'social'],
    lockedContent: 'Market entry campaign playbook · New service area saturation guide · Google Business Profile rapid review growth plan for new areas',
  },

  {
    id: 'referral-program',
    title: 'Customer Referral Program',
    headline: 'Know Someone Who Needs Us?',
    subheadline: 'You get rewarded. They get great service.',
    offer: '$[Amount] Service Credit When Your Referral Books a Job',
    audience: 'residential',
    season: 'any',
    tradeRelevance: ['all'],
    doorHangerNote: 'Do not use as a door hanger — too much reliance on prior relationship. Use as a leave-behind at completed jobs or a thank-you-card insert.',
    directMailNote: 'Mail to your past customer list only. Cold list will not respond to a referral program. This is a retention and reactivation tool, not an acquisition tool.',
    socialCaption: 'We love our customers — and if you know someone who needs [trade] work, we\'d love to take care of them too. Refer a friend and get $[amount] toward your next service. No limit.',
    upsellTieIn: 'Include the referral offer on every maintenance agreement renewal notice.',
    followUpNote: 'Send a referral program reminder to past customers every spring and fall with a seasonal service offer.',
    distributions: ['direct-mail', 'social', 'email'],
    lockedContent: 'Referral program design guide · Leave-behind card template · Referral tracking system setup',
  },

  {
    id: 'emergency-service-available',
    title: 'Emergency Service Available',
    headline: 'No Heat? No AC? No Problem.',
    subheadline: 'Emergency service available 7 days a week.',
    offer: 'Same-Day Emergency Calls — [Your Trade] When You Need It Most',
    audience: 'residential',
    season: 'any',
    tradeRelevance: ['hvac', 'plumbing', 'electrical'],
    doorHangerNote: 'Effective as a general brand-building door hanger year-round, especially in neighborhoods with older homes and aging systems.',
    directMailNote: 'Good as a cold list introduction piece combined with your emergency service story. Works well in winter and summer.',
    socialCaption: 'System go down at the worst time? That\'s when we\'re most useful. Emergency service available — call us before you spend the night in the heat or cold.',
    upsellTieIn: 'On every emergency call, offer a maintenance agreement as the tool to prevent the next emergency.',
    followUpNote: 'Emergency call customers receive a "let\'s prevent the next one" maintenance agreement follow-up within 5 days of the call.',
    distributions: ['door-hanger', 'direct-mail', 'social', 'truck'],
    lockedContent: 'Emergency service campaign design · Urgency messaging guide · Truck decal/magnet design brief',
  },

  {
    id: 'financing-available',
    title: 'Financing Available',
    headline: 'New [System] — Without the Sticker Shock.',
    subheadline: 'Financing available. Approved in 60 seconds.',
    offer: 'As Low As $[X]/Month on New Equipment Installation',
    audience: 'residential',
    season: 'any',
    tradeRelevance: ['hvac', 'electrical', 'plumbing', 'construction'],
    doorHangerNote: 'Target neighborhoods with homes over 15 years old where systems are aging. Good for HVAC, water heater, and electrical panel replacement campaigns.',
    directMailNote: 'Use with a targeted mailing to homes where average home age suggests aging system infrastructure.',
    socialCaption: 'A new [system] is more affordable than you think. We offer financing with approvals in 60 seconds — no giant upfront payment. Let us show you what monthly payments look like on the system that\'s right for your home.',
    upsellTieIn: 'Every financing customer should be offered a maintenance agreement on the new system.',
    followUpNote: 'Financing leads that did not close receive a "rates may change" re-engagement message at 30 days.',
    distributions: ['door-hanger', 'direct-mail', 'social', 'email'],
    lockedContent: 'Financing offer campaign design · Monthly payment cheat sheet by system type · Financing lead follow-up sequence',
  },

  {
    id: 'commercial-property-manager',
    title: 'Commercial Property Manager Outreach',
    headline: 'One Contact. Every Property.',
    subheadline: 'Commercial maintenance contracts for property managers and building owners.',
    offer: 'Dedicated Account Management + Priority Scheduling for Commercial Clients',
    audience: 'commercial',
    season: 'any',
    tradeRelevance: ['hvac', 'plumbing', 'electrical', 'construction'],
    doorHangerNote: 'Not appropriate for door-to-door. Use in person, at local RE/MAX commercial offices, or as a leave-behind at property management companies.',
    directMailNote: 'Mail to commercial property management companies in your area. Target companies with 5–50 units under management. A single commercial account can be worth $10,000–$50,000 per year.',
    socialCaption: 'If you manage commercial properties in [City], we built a commercial service program specifically for property managers — dedicated account manager, priority response, easy per-property invoicing. Let\'s connect.',
    upsellTieIn: 'Commercial clients should be presented with multi-unit maintenance agreement pricing.',
    followUpNote: 'Commercial prospects receive a quarterly market update and system care tip to maintain the relationship between contract discussions.',
    distributions: ['direct-mail', 'social'],
    lockedContent: 'Commercial pitch presentation · Property manager account setup guide · Commercial agreement pricing template',
  },

  {
    id: 'maintenance-agreement-flyer',
    title: 'Maintenance Agreement Offer',
    headline: 'Never Get Stuck Without [Heat/AC/Hot Water] Again.',
    subheadline: 'Our maintenance plan customers get priority scheduling, regular tune-ups, and peace of mind.',
    offer: 'Annual Maintenance Plan — Starting at $[Price]/Year',
    audience: 'residential',
    season: 'any',
    tradeRelevance: ['hvac', 'plumbing', 'electrical'],
    doorHangerNote: 'Strong as a door hanger in neighborhoods you already serve. "We take care of [X] homes in this neighborhood" social proof adds credibility.',
    directMailNote: 'Mail to past customers who have had one service call but are not on an agreement. This is the highest-converting past-customer re-engagement campaign.',
    socialCaption: 'Did you know priority scheduling means you never wait in line during an emergency? Our maintenance plan customers get first call. We\'re enrolling for the [season] right now — limited slots available.',
    upsellTieIn: 'Include a financing option note for customers who want to do an upgrade at plan enrollment time.',
    followUpNote: 'Maintenance flyer recipients who do not respond receive a "final enrollment for [season]" message 3 weeks later.',
    distributions: ['door-hanger', 'direct-mail', 'social', 'email'],
    lockedContent: 'Maintenance plan benefit design · Enrollment campaign calendar · Priority scheduling value framework',
  },

  {
    id: 'new-construction-builder',
    title: 'New Construction Builder Outreach',
    headline: 'Building? Let\'s Talk Subcontract.',
    subheadline: 'Reliable [trade] subs for builders and GCs in [City].',
    offer: 'Certificate-Ready, Licensed, and Insured. Fast Response for Active Projects.',
    audience: 'commercial',
    season: 'any',
    tradeRelevance: ['hvac', 'plumbing', 'electrical', 'construction'],
    doorHangerNote: 'Leave at active construction sites and building permit offices. Not a door hanger in the traditional sense — a business card packet is more appropriate here.',
    directMailNote: 'Mail to GC and builder offices in your area. Follow up with a phone call 5–7 days after the mail arrives.',
    socialCaption: 'If you\'re a GC or builder looking for a reliable [trade] sub in [City] — we\'re taking on new construction work. Licensed, insured, certificate-ready, and we show up when we say we will.',
    upsellTieIn: 'New construction clients often become long-term service agreement customers on the homes they build or manage.',
    followUpNote: 'Builder contacts receive a quarterly follow-up to stay top-of-mind for new projects.',
    distributions: ['direct-mail', 'social'],
    lockedContent: 'Builder/GC relationship development guide · Subcontractor proposal template · New construction pricing framework',
  },

  {
    id: 'truck-wrap-branding',
    title: 'Truck / Van Branding Campaign',
    headline: '[Your Trade] in [City] — You\'ve Probably Seen Our Trucks.',
    subheadline: 'Local, licensed, insured. Call us when you need us.',
    offer: 'Serving [City] and surrounding areas since [Year].',
    audience: 'residential',
    season: 'any',
    tradeRelevance: ['all'],
    doorHangerNote: 'Not a traditional flyer — design concept for truck wrap with accompanying neighborhood leave-behind when parking prominently in target areas.',
    directMailNote: 'A "you may have seen our trucks in your neighborhood" mailer combined with the truck wrap campaign increases brand recognition conversion.',
    socialCaption: 'Our trucks are all over [City] — if you\'ve seen us in your neighborhood, now you know who to call. [Trade] services, local team, every job backed by our guarantee.',
    upsellTieIn: 'Truck branding is the entry point — follow up brand exposure with a specific seasonal offer.',
    followUpNote: 'Truck-and-mailer campaigns are most effective when the mailer lands within 3 weeks of a truck being regularly visible in the target neighborhood.',
    distributions: ['truck', 'door-hanger', 'direct-mail'],
    lockedContent: 'Truck wrap design brief template · Neighborhood saturation campaign guide · Brand recognition to lead conversion playbook',
  },

  {
    id: 'indoor-air-quality',
    title: 'Indoor Air Quality Campaign',
    headline: 'What\'s in Your Air?',
    subheadline: 'Most indoor air is 2–5x more polluted than outdoor air. We can fix that.',
    offer: 'Free Indoor Air Quality Assessment with Any Service Call',
    audience: 'residential',
    season: 'any',
    tradeRelevance: ['hvac'],
    doorHangerNote: 'Effective in neighborhoods with high allergy prevalence or during high-pollen seasons. IAQ is an emotional sell — the family\'s health is at stake.',
    directMailNote: 'Mail to HVAC maintenance agreement customers as an upgrade offer. Also effective as a cold mailing during allergy season (spring).',
    socialCaption: 'Did you know the air inside most homes is significantly more polluted than outside air? Between dust, allergens, and off-gassing, it adds up. We offer an indoor air quality assessment — let\'s find out what\'s in your air.',
    upsellTieIn: 'IAQ leads into UV light systems, whole-home air purifiers, and humidifier/dehumidifier upgrades — all high-margin add-ons.',
    followUpNote: 'IAQ assessment customers receive a follow-up with upgrade options within 7 days.',
    distributions: ['door-hanger', 'direct-mail', 'social'],
    lockedContent: 'IAQ campaign design · Assessment form template · IAQ upgrade offer presentation guide',
  },

  {
    id: 'water-quality-plumbing',
    title: 'Water Quality / Whole-Home Filtration',
    headline: 'Do You Know What\'s in Your Water?',
    subheadline: 'Hard water, contaminants, and aging pipes affect your home and your health.',
    offer: 'Free Water Quality Test with Any Plumbing Service',
    audience: 'residential',
    season: 'any',
    tradeRelevance: ['plumbing'],
    doorHangerNote: 'Effective in areas with known hard water or older housing stock. Water quality is an emotional and health-driven sell.',
    directMailNote: 'Mail to homes with older plumbing infrastructure or areas with known municipal water quality issues.',
    socialCaption: 'Hard water affects your water heater, fixtures, and pipes. It also affects the taste and safety of what you drink. We offer free water quality tests — ask us at your next service call.',
    upsellTieIn: 'Water quality assessment leads into whole-home filtration, water softener, and reverse osmosis system sales.',
    followUpNote: 'Water test customers receive upgrade options and comparison data within 5 days.',
    distributions: ['door-hanger', 'direct-mail', 'social'],
    lockedContent: 'Water quality campaign design · Test result presentation guide · Filtration upgrade offer matrix',
  },

  {
    id: 'electrical-safety-inspection',
    title: 'Electrical Safety Inspection',
    headline: 'When Was the Last Time Your Panel Was Inspected?',
    subheadline: 'Outdated panels and aging wiring are the #1 cause of house fires.',
    offer: '$[X] Safety Inspection — Older Homes, New Concern',
    audience: 'residential',
    season: 'any',
    tradeRelevance: ['electrical'],
    doorHangerNote: 'Target neighborhoods with homes 30+ years old. Older neighborhoods with Federal Pacific or Zinsco panels are highest priority.',
    directMailNote: 'EDDM to older neighborhoods. "Is your panel this old?" messaging with visual of old panel works well.',
    socialCaption: 'Most homeowners don\'t think about their electrical panel until something goes wrong. If your home is more than 25 years old, a panel inspection is worth doing. We\'re scheduling them now.',
    upsellTieIn: 'Safety inspection leads into panel replacement, GFCI upgrades, EV charger installation, and whole-home surge protection.',
    followUpNote: 'Safety inspection customers with findings receive an upgrade proposal within 48 hours.',
    distributions: ['door-hanger', 'direct-mail', 'social'],
    lockedContent: 'Electrical safety campaign design · Panel age inspection guide · Upgrade proposal template',
  },

  {
    id: 'five-star-reputation-social',
    title: 'Review / Reputation Social Campaign',
    headline: '[X] Five-Star Reviews and Counting.',
    subheadline: 'Your neighbors trust us. Let\'s see if we can earn your trust too.',
    offer: 'New Customer Special — [Specific Offer] for First-Time Customers',
    audience: 'residential',
    season: 'any',
    tradeRelevance: ['all'],
    doorHangerNote: 'Effective once you hit 25+ reviews. "Your neighbors have given us [X] five-star reviews" is social proof that converts. Include a QR code to your Google review profile.',
    directMailNote: 'Works best as a postcard with a QR code to Google reviews. Show a screenshot of a real, specific 5-star review.',
    socialCaption: 'We just hit [X] five-star reviews on Google. That\'s [X] homeowners in [City] who trust us with their [trade] needs. If you\'re new to us — here\'s a first-time customer offer to get to know us.',
    upsellTieIn: 'New customers acquired through reputation campaigns convert to maintenance agreements at high rates — the trust signal that brought them in is already established.',
    followUpNote: 'New customers from reputation campaign receive maintenance agreement offer at first job completion.',
    distributions: ['door-hanger', 'direct-mail', 'social'],
    lockedContent: 'Review-milestone social post template series · QR review link setup guide · First-time customer offer design',
  },
]

// ── 30-Day Social Media Starter Plan ──────────────────────────────────────────

export const SOCIAL_STARTER_PLAN: SocialWeekProgram[] = [
  {
    weekNumber: 1,
    theme: 'Credibility & Introduction',
    goal: 'Establish who you are, that you are professional, and that you are local.',
    posts: [
      {
        weekNumber: 1,
        dayNumber: 1,
        theme: 'Company Introduction',
        platform: ['Facebook', 'Instagram', 'Google Business Profile'],
        contentType: 'photo',
        caption: 'We\'re [Company Name] — a local [trade] company serving [City] and surrounding areas. [Year] years in business, [X] five-star reviews, and a team that actually shows up when we say we will. If you\'ve been looking for a reliable [trade] company, we\'d love to earn your business.',
        callToAction: 'Call us at [number] or tap the link to schedule.',
        notes: 'Use your best truck/team photo. Clean, professional image. No filters needed.',
      },
      {
        weekNumber: 1,
        dayNumber: 3,
        theme: 'License & Insurance Credibility',
        platform: ['Facebook', 'Instagram'],
        contentType: 'graphic',
        caption: 'Licensed. Insured. Background-checked. We know you\'re inviting us into your home — we take that seriously. [Company Name] carries full liability insurance, all technicians are background-checked, and we\'re licensed in [State].',
        callToAction: 'Book your next service with confidence.',
        notes: 'Simple graphic with license number, insurance carrier, and a checkmark visual. Canva has templates for this.',
      },
      {
        weekNumber: 1,
        dayNumber: 5,
        theme: 'Completed Job Photo',
        platform: ['Facebook', 'Instagram', 'Google Business Profile'],
        contentType: 'photo',
        caption: 'Before and after: [Brief job description] in [Neighborhood]. Clean install, system running perfectly, happy customer. This is the standard on every job.',
        callToAction: 'Need [trade] work done right? Call us.',
        notes: 'Real before/after photos outperform stock images by 3–5x. Take them at every job.',
      },
    ],
  },
  {
    weekNumber: 2,
    theme: 'Education & Seasonal Tips',
    goal: 'Position your team as the local expert. Provide value before asking for anything.',
    posts: [
      {
        weekNumber: 2,
        dayNumber: 8,
        theme: 'Maintenance Tip',
        platform: ['Facebook', 'Instagram', 'Google Business Profile'],
        contentType: 'photo',
        caption: '[Quick maintenance tip for your trade — e.g., "Change your HVAC filter every 60–90 days. A dirty filter makes your system work harder, costs more to run, and shortens its life. Here\'s what a dirty filter looks like vs. a clean one."]',
        callToAction: 'Schedule your [tune-up/maintenance] with us this [season].',
        notes: 'Educational content builds credibility and gets high organic reach from homeowners saving it for later.',
      },
      {
        weekNumber: 2,
        dayNumber: 10,
        theme: 'Safety Alert',
        platform: ['Facebook', 'Instagram'],
        contentType: 'graphic',
        caption: '[Safety tip for your trade — e.g., "If you smell gas, leave the house immediately and call 911. Do not turn any lights on or off. Call your gas company from outside."] Share this with a neighbor who might not know.',
        callToAction: 'Our team is available for gas line inspections — call us any time.',
        notes: 'Safety content gets shared and saved more than any other content type. Great for algorithm reach.',
      },
      {
        weekNumber: 2,
        dayNumber: 12,
        theme: 'Q&A / FAQ',
        platform: ['Facebook', 'Instagram'],
        contentType: 'graphic',
        caption: '"How often should I have my [system] serviced?" Great question — we get this one a lot. [Brief answer with practical guidance]. Have a question about your [system]? Drop it in the comments — we answer every one.',
        callToAction: 'Comment your question below.',
        notes: 'FAQ posts drive engagement comments which boost algorithm distribution.',
      },
    ],
  },
  {
    weekNumber: 3,
    theme: 'Proof & Trust',
    goal: 'Show real customer outcomes. Reviews, before/after, and job highlights.',
    posts: [
      {
        weekNumber: 3,
        dayNumber: 15,
        theme: 'Customer Review Feature',
        platform: ['Facebook', 'Instagram', 'Google Business Profile'],
        contentType: 'graphic',
        caption: '"[Pull a real 5-star review quote]" — [Customer First Name], [City]. This is why we do what we do. Thank you, [Name].',
        callToAction: 'Ready to experience this for yourself? Schedule today.',
        notes: 'Screenshot or graphic of a real review. Ask customers for permission to feature their review. Most are happy to.',
      },
      {
        weekNumber: 3,
        dayNumber: 17,
        theme: 'Before/After Job Feature',
        platform: ['Facebook', 'Instagram', 'Google Business Profile'],
        contentType: 'photo',
        caption: 'Before: [Description of problem]. After: [Description of solution]. [Brief story about the job — age of system, customer situation, what the problem was doing to them.] This is what we do.',
        callToAction: 'If your [system] has been giving you trouble — call us.',
        notes: 'Tell a story, not just the technical description. Customers connect with the homeowner\'s situation, not the repair procedure.',
      },
      {
        weekNumber: 3,
        dayNumber: 19,
        theme: 'Team Introduction',
        platform: ['Facebook', 'Instagram'],
        contentType: 'photo',
        caption: 'Meet [Tech Name] — he\'s been with [Company] for [X] years and is one of the best [trade] techs in [City]. [One sentence about what he\'s good at or what he cares about.] You might see him at your next service call.',
        callToAction: 'We\'re hiring if you know great techs — tag them.',
        notes: 'Team photos build trust and humanize the brand. Also helps with recruiting.',
      },
    ],
  },
  {
    weekNumber: 4,
    theme: 'Offer & Referral',
    goal: 'Convert warm audience attention into bookings and referrals.',
    posts: [
      {
        weekNumber: 4,
        dayNumber: 22,
        theme: 'Seasonal Offer',
        platform: ['Facebook', 'Instagram', 'Google Business Profile'],
        contentType: 'graphic',
        caption: '[Season] special: [Your seasonal offer — e.g., "$89 AC tune-up, includes filter check, refrigerant check, and full 20-point inspection."] We\'re booking [Month] now — slots fill fast in [peak season].',
        callToAction: 'Call [number] or tap to book online.',
        notes: 'Offers with a specific price convert better than vague "discounts." Put a deadline on it.',
      },
      {
        weekNumber: 4,
        dayNumber: 24,
        theme: 'Maintenance Plan CTA',
        platform: ['Facebook', 'Instagram'],
        contentType: 'graphic',
        caption: 'Most of our emergency calls could have been prevented. Priority scheduling. Two visits per year. Parts discounts. That\'s our maintenance plan — and it\'s what keeps [Company Name] customers out of emergency situations.',
        callToAction: 'Ask about enrollment when you book your next service.',
        notes: 'Maintenance plan posts work best after 2–3 weeks of trust-building content. Do not lead with this in Week 1.',
      },
      {
        weekNumber: 4,
        dayNumber: 26,
        theme: 'Referral Ask',
        platform: ['Facebook', 'Instagram'],
        contentType: 'graphic',
        caption: 'If we\'ve taken care of your [system], would you send a friend our way? We built this company on referrals from customers like you — and every referral gets you a $[amount] service credit. Tag a neighbor below.',
        callToAction: 'Tag someone who needs [trade] work done right.',
        notes: 'Tag-a-friend posts generate organic reach and referrals simultaneously.',
      },
    ],
  },
]

// ── Road Paths ─────────────────────────────────────────────────────────────────

export const ROAD_PATHS: RoadPath[] = [

  {
    id: 'referral-road-path',
    title: 'Referral Road Path',
    shortTitle: 'Referral Path',
    phaseRelevance: ['referrals-upsells-crosssells', 'followup-reviews-reputation'],
    summary: 'A 7-step systematic process for building a referral engine that generates consistent, near-zero-cost leads.',
    steps: [
      {
        stepNumber: 1,
        action: 'Ask after every completed job',
        detail: '"If you know anyone who needs [service], I would take great care of them." Simple, direct, every job, every time.',
        timing: 'Immediately after job completion and review request',
        tool: 'No tool required — habit only',
      },
      {
        stepNumber: 2,
        action: 'Build a simple referral incentive',
        detail: '$25–$50 service credit for referring customer when referred customer completes a job. Service credits create loyalty and come back as revenue.',
        timing: 'Set up once and communicate at every job',
        tool: 'Jobber or Housecall Pro customer notes',
      },
      {
        stepNumber: 3,
        action: 'Identify your top 10 referral sources',
        detail: 'Track every referral to its source. After 90 days you will know who your referral champions are. These are your highest-priority relationship maintenance contacts.',
        timing: 'Review monthly',
        tool: 'Simple spreadsheet or CRM tag',
      },
      {
        stepNumber: 4,
        action: 'Thank every referral source immediately',
        detail: 'Call or text when you receive a referral — before the job is done. "I just wanted to say thank you for sending [Name] our way — I\'m going to take great care of them." Reinforces the behavior.',
        timing: 'Same day the referral books',
        tool: 'Phone or text',
      },
      {
        stepNumber: 5,
        action: 'Build one trade referral partnership per quarter',
        detail: 'One complementary trade contractor who serves the same customer. Mutual referral exchange. One strong trade partner can generate 5–20 referrals per year.',
        timing: 'One new partnership per quarter',
        tool: 'In-person coffee meeting, LinkedIn',
      },
      {
        stepNumber: 6,
        action: 'Seasonal past-customer re-engagement',
        detail: 'Twice per year, reach out to your top 50 past customers with a seasonal service offer and a referral reminder. "We\'re heading into [season] — do you need anything? And if you know anyone who does..."',
        timing: 'Spring and fall',
        tool: 'Mailchimp or direct text',
      },
      {
        stepNumber: 7,
        action: 'Review and reward your referral program quarterly',
        detail: 'Count total referrals, identify top sources, send a personal thank-you to your top 3–5 referrers. A quarterly recognition keeps the program top of mind.',
        timing: 'Quarterly',
        tool: 'Any CRM with referral source tracking',
      },
    ],
    successMetric: 'Referrals per month, referral source diversity, and referral-to-booked-job conversion rate.',
    lockedContent: 'Referral tracking spreadsheet · Thank-you message templates · Trade partner agreement template · Referral incentive program design guide',
  },

  {
    id: 'upsell-road-path',
    title: 'Upsell Road Path',
    shortTitle: 'Upsell Path',
    phaseRelevance: ['technician-performance', 'pricing-profit-margin'],
    summary: 'An 8-step process for presenting additional options and upgrades to customers in a way that feels like service, not sales.',
    steps: [
      {
        stepNumber: 1,
        action: 'Complete a thorough system diagnostic',
        detail: 'Every upsell starts with a legitimate finding. Use the trade-specific diagnostic checklist. Document every finding with photos. No finding, no recommendation.',
        timing: 'On every service call',
        tool: 'CompanyCam, diagnostic checklist',
      },
      {
        stepNumber: 2,
        action: 'Categorize findings by urgency',
        detail: 'Safety concern / Performance issue / Maintenance recommendation. Three categories help customers prioritize without feeling overwhelmed.',
        timing: 'Before presenting to customer',
        tool: 'Job notes in FSM',
      },
      {
        stepNumber: 3,
        action: 'Present primary repair first — resolve it completely',
        detail: 'Never present upsells until the primary issue is resolved and the customer is satisfied. Sequence matters: fix their problem first, then recommend additional service.',
        timing: 'Primary issue resolution before upsell conversation',
        tool: 'None',
      },
      {
        stepNumber: 4,
        action: 'Transition to additional findings',
        detail: '"While I was here, I noticed a couple of other things — mind if I show you?" Get a yes to the transition. This is a micro-commitment that improves receptiveness.',
        timing: 'After primary repair confirmation',
        tool: 'Photos from CompanyCam',
      },
      {
        stepNumber: 5,
        action: 'Present each finding with a benefit, not just a description',
        detail: '"This [finding] means [what happens if left alone]. It\'s not an emergency today, but it\'s worth addressing before it becomes one." Photo accompanies every finding.',
        timing: 'During findings presentation',
        tool: 'Photos, FSM estimate tool',
      },
      {
        stepNumber: 6,
        action: 'Offer to address today or schedule separately',
        detail: '"I can take care of that while I\'m already here for $[X] — or I can leave you an estimate and we can schedule it separately." Two clear options, no pressure.',
        timing: 'After each finding presentation',
        tool: 'FSM estimate builder',
      },
      {
        stepNumber: 7,
        action: 'Include financing for all upsells over $500',
        detail: 'Present monthly payment option alongside total price for any upsell over $500. Removes affordability barrier.',
        timing: 'With any estimate over $500',
        tool: 'Wisetack, Hearth, GreenSky',
      },
      {
        stepNumber: 8,
        action: 'Track attach rate by tech monthly',
        detail: 'Attach rate = % of calls where an upsell recommendation was made. Review monthly. Coach techs with low attach rate on diagnostic thoroughness and presentation confidence.',
        timing: 'Monthly review',
        tool: 'FSM reporting',
      },
    ],
    successMetric: 'Average ticket per call and attach rate per tech.',
    lockedContent: 'Trade-specific upsell opportunity matrices · Benefit statement library · Attach rate tracking dashboard · Tech upsell training module',
  },

  {
    id: 'crosssell-road-path',
    title: 'Cross-Sell Road Path',
    shortTitle: 'Cross-Sell Path',
    phaseRelevance: ['referrals-upsells-crosssells', 'technician-performance'],
    summary: 'An 8-step process for identifying and presenting cross-trade or cross-service opportunities without losing the customer\'s trust.',
    steps: [
      {
        stepNumber: 1,
        action: 'Define your cross-sell opportunity list per trade',
        detail: 'HVAC: IAQ, duct cleaning, humidifier, dehumidifier, surge protection, thermostat upgrade. Plumbing: water heater, filtration, softener, sump pump. Electrical: panel, surge protection, EV charger, lighting. Build the list before you need it.',
        timing: 'One-time setup, quarterly review',
        tool: 'Checklist document',
      },
      {
        stepNumber: 2,
        action: 'Train techs on what to look for per cross-sell item',
        detail: 'Every tech should know the visual and performance signals for each cross-sell opportunity. IAQ: dusty returns, poor filter use, pet hair. Water quality: scale on fixtures, taste complaints. Electrical: tripping breakers, older panel, no GFCI.',
        timing: 'Training session, then regular refresher',
        tool: 'Training checklist',
      },
      {
        stepNumber: 3,
        action: 'Build cross-trade referral partnerships',
        detail: 'Identify the complementary trade contractor who serves your customers. An HVAC company should have a trusted plumber and electrician to refer to. A plumber should have an HVAC and electrical referral partner.',
        timing: 'One new trade partnership per quarter',
        tool: 'In-person introduction',
      },
      {
        stepNumber: 4,
        action: 'Introduce cross-sell observations during the diagnostic walk-through',
        detail: '"While I was checking the [system], I noticed [observation in a different trade area]. That\'s not my specialty, but it\'s worth having looked at. I can connect you with [Partner Name] if you\'d like."',
        timing: 'During findings presentation',
        tool: 'Photos, diagnostic checklist',
      },
      {
        stepNumber: 5,
        action: 'Never present cross-sells without a specific finding',
        detail: 'Recommending a service you did not specifically observe undermines credibility. Every cross-sell must be attached to a documented observation.',
        timing: 'Policy — enforce in training',
        tool: 'CompanyCam for documentation',
      },
      {
        stepNumber: 6,
        action: 'Track cross-sell recommendations and conversions',
        detail: 'Log every cross-sell recommendation in your FSM as a pending work item. Follow up at 30 days if the customer has not acted. Track conversion rate per tech.',
        timing: 'At every job close',
        tool: 'FSM follow-up/pending work feature',
      },
      {
        stepNumber: 7,
        action: 'Coordinate with referral partners for handoff quality',
        detail: 'When you refer a customer to a trade partner, give the partner a brief context note: "I sent [Name] your way — they have [issue] at [address]. They\'re good people." This professional handoff protects your reputation.',
        timing: 'At every cross-trade referral',
        tool: 'Phone or text to partner',
      },
      {
        stepNumber: 8,
        action: 'Review cross-sell revenue and partner referral volume quarterly',
        detail: 'Measure: total cross-sell revenue, trade partner referral count, cross-sell conversion rate per tech. This data drives training investment and partnership development.',
        timing: 'Quarterly business review',
        tool: 'FSM reporting + spreadsheet',
      },
    ],
    successMetric: 'Cross-sell attach rate, cross-sell revenue per month, and trade partner referral volume.',
    lockedContent: 'Cross-sell opportunity matrix by trade · Trade partner agreement template · Cross-sell finding documentation guide · Partner handoff message templates',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

export function getFlyerById(id: string): FlyerConcept | undefined {
  return FLYER_CONCEPTS.find(f => f.id === id)
}

export function getFlyersBySeason(season: Season): FlyerConcept[] {
  return FLYER_CONCEPTS.filter(f => f.season === season || f.season === 'any')
}

export function getFlyersForTrade(trade: string): FlyerConcept[] {
  return FLYER_CONCEPTS.filter(f => f.tradeRelevance.includes(trade) || f.tradeRelevance.includes('all'))
}

export function getRoadPathById(id: string): RoadPath | undefined {
  return ROAD_PATHS.find(r => r.id === id)
}

export function getSocialWeek(weekNumber: number): SocialWeekProgram | undefined {
  return SOCIAL_STARTER_PLAN.find(w => w.weekNumber === weekNumber)
}

export function getFlyersByIds(ids: string[]): FlyerConcept[] {
  return ids.map(id => getFlyerById(id)).filter((f): f is FlyerConcept => f !== undefined)
}

export function getRoadPathsForPhase(phaseId: string): RoadPath[] {
  return ROAD_PATHS.filter(r => r.phaseRelevance.includes(phaseId))
}
