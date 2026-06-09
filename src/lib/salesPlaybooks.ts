// ─────────────────────────────────────────────────────────────────────────────
// SubZeroMetrix — Sales Playbooks
// 10 structured sales playbooks for contractor field and office teams
// ─────────────────────────────────────────────────────────────────────────────

export type PlaybookRole = 'csr' | 'dispatcher' | 'technician' | 'owner' | 'estimator'
export type PlaybookScenario = 'inbound-call' | 'on-site' | 'follow-up' | 'estimate' | 'objection' | 'upsell' | 'agreement' | 'referral'

export interface PlaybookStep {
  stepNumber: number
  title: string
  script?: string
  notes: string
  avoidThis?: string
}

export interface SalesPlaybook {
  id: string
  title: string
  shortTitle: string
  scenario: PlaybookScenario
  roles: PlaybookRole[]
  phaseRelevance: string[]
  summary: string
  whyItWorks: string
  whenToUse: string
  steps: PlaybookStep[]
  keyPrinciples: string[]
  commonMistakes: string[]
  successMetric: string
  lockedContent: string
}

// ── Playbook Data ──────────────────────────────────────────────────────────────

export const SALES_PLAYBOOKS: SalesPlaybook[] = [

  {
    id: 'phone-booking',
    title: 'Phone Answering & Booking',
    shortTitle: 'Phone Booking',
    scenario: 'inbound-call',
    roles: ['csr', 'dispatcher', 'owner'],
    phaseRelevance: ['sales-process-call-handling'],
    summary: 'How to answer a service call professionally, gather the right information, and book a confirmed appointment without giving price over the phone.',
    whyItWorks: 'The goal of the inbound call is not to answer questions — it is to book a confirmed appointment. Customers who hear price over the phone will shop it. Customers who are asked the right questions and given a booking frame commit before they can compare.',
    whenToUse: 'Every inbound residential or commercial service call where the customer is seeking help with a repair, maintenance, or new installation.',
    steps: [
      {
        stepNumber: 1,
        title: 'Answer with professionalism',
        script: '"Thank you for calling [Company Name], this is [Your Name]. How can I help you today?"',
        notes: 'Answer within 3 rings. Use business name and your name. Energetic but not scripted-sounding. Never "hello?" — that sounds like a personal call.',
        avoidThis: 'Answering with just "hello" or your name alone. It sounds like a personal call, not a business.',
      },
      {
        stepNumber: 2,
        title: 'Listen and empathize',
        script: '"I understand — that\'s definitely something we can help with. I just want to get a couple of details to make sure we send the right tech."',
        notes: 'Let the customer describe their problem completely before asking questions. Show empathy first. "I understand" and "we can help" are the two most reassuring phrases in the call.',
        avoidThis: 'Interrupting or jumping to solutions before the customer finishes describing the problem.',
      },
      {
        stepNumber: 3,
        title: 'Ask discovery questions',
        script: '"Can I get your name and address? And is this a repair on an existing [system] or something new? How long has this been going on — is it still [running/working] at all right now?"',
        notes: 'Name, address, problem type, urgency level. These four questions tell you the right technician, the right time slot priority, and start the customer relationship. Urgency question determines if this is emergency or standard scheduling.',
        avoidThis: 'Asking too many questions at once, or asking about the technical specifics you cannot diagnose by phone anyway.',
      },
      {
        stepNumber: 4,
        title: 'Decline to give price',
        script: '"I\'d love to give you a ballpark, but honestly every [system] is different and I don\'t want to give you a number that turns out to be wrong either way. What I can do is get a tech out there to look at it and give you an exact price — no charge just to come out and diagnose."',
        notes: 'Never give price over the phone. Always deflect with honesty — "I don\'t want to give you a wrong number" — not with vagueness. Offer the "no charge to diagnose" if your business model includes a trip charge that converts to a service call.',
        avoidThis: 'Saying "it depends" without explanation. It sounds evasive. Explain WHY you cannot quote over the phone.',
      },
      {
        stepNumber: 5,
        title: 'Book a specific time',
        script: '"We have tomorrow between 10 and noon or 2 to 4 — which works better for you?"',
        notes: 'Offer two specific windows — never "sometime next week." Two options creates commitment. Note: it is okay to offer same-day for emergencies or if the schedule allows. Get a yes to the specific window.',
        avoidThis: 'Offering vague availability like "we can probably get you in early next week." Vague leads to no-shows.',
      },
      {
        stepNumber: 6,
        title: 'Confirm and close the call',
        script: '"Perfect — I have you scheduled for [Day] between [Time]. We\'ll send you a confirmation text in just a minute. Is this the best number to reach you? Great — we\'ll see you [Day]."',
        notes: 'Repeat the appointment back. Confirm contact number. Commit to sending a text confirmation. End on a positive note. The appointment is not booked until it is confirmed in your system.',
        avoidThis: 'Ending the call before getting a confirmed phone number or before explicitly repeating the appointment date and time.',
      },
    ],
    keyPrinciples: [
      'The call\'s goal is to book the visit — not to answer technical questions',
      'Never give price over the phone — ever',
      'Offer two specific time windows, never open-ended availability',
      'Empathy before information — acknowledge the problem before asking questions',
      'Confirm the appointment before hanging up',
    ],
    commonMistakes: [
      'Giving an estimated price range "just to be helpful" — it anchors the customer to the low end',
      'Offering vague scheduling: "we can try to fit you in" loses bookings',
      'Not sending a confirmation text — leads to no-shows',
      'Not asking the urgency question — missing same-day opportunities',
      'Answering with just "hello" or being informal in tone',
    ],
    successMetric: 'Booking rate: appointments booked ÷ calls answered. Target 70%+.',
    lockedContent: 'Emergency call booking script · After-hours answering protocol · Commercial call script (different tone and questions) · Callback script for missed calls · CSR performance scorecard · Role-play training guide',
  },

  {
    id: 'speed-to-lead',
    title: 'Speed-to-Lead Response',
    shortTitle: 'Speed to Lead',
    scenario: 'inbound-call',
    roles: ['csr', 'dispatcher', 'owner'],
    phaseRelevance: ['sales-process-call-handling', 'lead-flow-visibility'],
    summary: 'A structured process for responding to web, Angi, Thumbtack, and other digital leads within 5 minutes to maximize conversion before competitors call.',
    whyItWorks: 'Research consistently shows that lead conversion drops by 80% after 5 minutes, and by 400% after 10 minutes. Contractors who respond within 5 minutes convert digital leads at 3–4x the rate of those who call back within an hour. Speed-to-lead is free margin improvement — same lead, higher conversion.',
    whenToUse: 'Any time a lead comes in via web form, Angi, Thumbtack, Google Local Services, or any digital channel where the customer submitted a request rather than calling directly.',
    steps: [
      {
        stepNumber: 1,
        title: 'Set up real-time lead notifications',
        notes: 'Configure your FSM, Angi, and Thumbtack to send an alert to your phone immediately when a new lead arrives. SMS notification is faster than email. Assign one person to be the designated lead responder during business hours.',
        avoidThis: 'Checking leads at the end of the day or even hourly — the window is 5 minutes, not 60.',
      },
      {
        stepNumber: 2,
        title: 'Text first within 2 minutes',
        script: '"Hi [Name], this is [Your Name] from [Company]. Thanks for reaching out about your [service request]. Can I call you right now to get you scheduled?"',
        notes: 'Text first — it is lower-pressure than a call and gets a faster initial response. Immediately follow with a phone call. The text removes the cold-call feeling from the phone call that follows.',
        avoidThis: 'Only calling without texting first. Many people do not answer unknown numbers but will respond to a text.',
      },
      {
        stepNumber: 3,
        title: 'Call within 3–5 minutes',
        script: '"Hi, is this [Name]? This is [Your Name] from [Company] — I just sent you a quick text. You reached out about your [service] and I wanted to get you taken care of right away. Are you available to chat for 2 minutes?"',
        notes: 'Call from your business number (or a tracked number via CallRail). Mention the text you just sent — it signals that you are responsive and makes the call expected.',
        avoidThis: 'Starting the call cold as if you had no prior contact. Reference the lead and the text.',
      },
      {
        stepNumber: 4,
        title: 'Run the booking conversation',
        notes: 'Once connected, follow the Phone Booking playbook. Your goal is to book a confirmed appointment, not to answer all their questions over the phone.',
        avoidThis: 'Giving price or extensive technical information over the phone. The visit is the goal.',
      },
      {
        stepNumber: 5,
        title: 'If no answer — leave a voicemail and follow up',
        script: '"Hi [Name], this is [Your Name] from [Company]. You reached out about your [service] — I\'d love to get you scheduled. I\'ll try you again shortly, or you can text me at this number. Have a great day."',
        notes: 'Leave one voicemail, keep it brief, offer text as an alternative contact method. Attempt a second call 30 minutes later. Third attempt the next morning. Do not make more than 3 contact attempts before marking the lead as closed.',
        avoidThis: 'Leaving a long, rambling voicemail. Short and action-oriented is all that is needed.',
      },
    ],
    keyPrinciples: [
      '5 minutes is the window — after 10 minutes, most leads have called a competitor',
      'Text first, call second — lower friction, higher response rate',
      'Mention the lead source in your opening — shows attentiveness',
      'A second and third attempt are standard — do not assume silence is a no after one call',
      'Assign a specific person to lead response — no one assigned means no one responds',
    ],
    commonMistakes: [
      'Waiting until the end of the day to respond to morning leads',
      'Calling without texting first — lower answer rates on unknown numbers',
      'Giving up after one missed call',
      'Not tracking response time as a KPI',
      'The owner being the only one who can respond — vacation and emergencies break the system',
    ],
    successMetric: 'Speed-to-first-contact (minutes) and online lead conversion rate (online leads ÷ booked jobs).',
    lockedContent: 'Speed-to-lead response tracker template · After-hours lead protocol · Lead source conversion rate benchmarks by channel · Multi-attempt follow-up sequence with day 2, 3, and 7 templates',
  },

  {
    id: 'diagnostic-conversation',
    title: 'Diagnostic Conversation',
    shortTitle: 'Diagnostics',
    scenario: 'on-site',
    roles: ['technician'],
    phaseRelevance: ['technician-performance', 'pricing-profit-margin'],
    summary: 'A structured on-site diagnostic process that builds customer trust, creates a comprehensive report, and sets up the Good/Better/Best presentation naturally.',
    whyItWorks: 'Customers buy from technicians they trust. Trust is built through thoroughness, clarity, and honesty — not through pressure. A structured diagnostic that explains every finding, shows photos, and presents options professionally creates a high-conversion environment without any sales tactics that feel uncomfortable.',
    whenToUse: 'Every service call and maintenance visit. The diagnostic conversation is the foundation of the entire on-site experience.',
    steps: [
      {
        stepNumber: 1,
        title: 'Greet and establish trust',
        script: '"Hi, I\'m [Name] from [Company]. Thanks for having us out today. Before I start, is there anything specific you wanted me to check on, or can you tell me more about what you\'ve been noticing?"',
        notes: 'Introduce yourself with name and company. Shake hands. Look professional. Ask one open-ended question to understand the customer\'s experience before starting work. Listen completely before beginning the diagnostic.',
        avoidThis: 'Walking past the customer to the equipment without introducing yourself or asking questions first.',
      },
      {
        stepNumber: 2,
        title: 'Conduct a complete system diagnostic',
        notes: 'Use the trade-specific diagnostic checklist for this call type. Document every finding — including items that are in good condition. Do not filter findings during the diagnostic phase. Photo every finding, every before-and-after, and the overall system condition.',
        avoidThis: 'Only diagnosing the specific complaint without inspecting the full system. You will miss additional issues that become your liability later.',
      },
      {
        stepNumber: 3,
        title: 'Organize and review findings',
        notes: 'Before presenting to the customer, organize your findings into three categories: 1) Safety concerns (must address), 2) Performance issues (should address), 3) Maintenance recommendations (could address). This structure naturally leads to Good/Better/Best.',
        avoidThis: 'Presenting a disorganized list of everything you found. Overwhelming customers creates decision paralysis.',
      },
      {
        stepNumber: 4,
        title: 'Walk the customer through findings with photos',
        script: '"Let me show you what I found today. Everything I\'m going to show you, I have photos of so you can see exactly what we\'re dealing with."',
        notes: 'Show photos as you explain findings. This transforms abstract problems into visible, understandable issues. Customers who see the problem trust the recommendation. Present findings in order of severity — safety first, then performance, then maintenance.',
        avoidThis: 'Explaining technical findings in trade jargon without interpreting what they mean for the customer.',
      },
      {
        stepNumber: 5,
        title: 'Let the customer respond',
        notes: 'After presenting findings, pause and let the customer respond. Do not immediately move to pricing. Their response tells you their priority, their budget mindset, and their decision-making process. Silence here is your best tool.',
        avoidThis: 'Rushing to the price before the customer has processed the diagnostic information.',
      },
    ],
    keyPrinciples: [
      'Thorough diagnostics build the trust that makes recommendations credible',
      'Photos turn invisible problems into undeniable evidence',
      'Organize findings into safety, performance, and maintenance categories',
      'Let the customer respond before presenting options',
      'Never skip findings because you think the customer won\'t want to address them',
    ],
    commonMistakes: [
      'Only diagnosing the complaint and missing the full system check',
      'Not taking photos — this undermines recommendation credibility and creates liability exposure',
      'Using technical language without translation into plain English',
      'Presenting all findings simultaneously without prioritization',
      'Rushing from diagnostic to price without letting the customer absorb the information',
    ],
    successMetric: 'Average findings per diagnostic call and upsell attach rate per call.',
    lockedContent: 'Trade-specific diagnostic checklists (HVAC, plumbing, electrical) · Photo documentation workflow guide · Findings organization matrix · Diagnostic-to-presentation transition scripts',
  },

  {
    id: 'good-better-best',
    title: 'Good/Better/Best Proposal',
    shortTitle: 'Good/Better/Best',
    scenario: 'estimate',
    roles: ['technician', 'estimator', 'owner'],
    phaseRelevance: ['pricing-profit-margin', 'technician-performance'],
    summary: 'A three-option proposal framework that increases average ticket by 20–40% on qualifying calls by giving customers choice rather than a single take-it-or-leave-it price.',
    whyItWorks: 'Customers who receive one price feel constrained — they can only say yes or no. Customers who receive three options feel empowered — they can choose. Most customers choose the middle option. A meaningful percentage choose the premium option. Almost no one chooses the basic option, but its presence makes the middle look reasonable.',
    whenToUse: 'Any service call or estimate where there is a meaningful choice between repair options, replacement vs. repair, or standard vs. premium equipment.',
    steps: [
      {
        stepNumber: 1,
        title: 'Define three options before presenting',
        notes: 'Option 1 (Good): Addresses the immediate complaint, minimum fix, lowest price. Option 2 (Better): Fixes the complaint plus addresses the most significant related issue. Option 3 (Best): Comprehensive solution that addresses all findings and provides the best long-term outcome.',
        avoidThis: 'Making up options on the spot — build your Good/Better/Best framework per call type before you need it.',
      },
      {
        stepNumber: 2,
        title: 'Present options in order from low to high',
        script: '"I have three options for you today. I\'ll walk you through each one and you tell me which feels right for your situation."',
        notes: 'Always present lowest to highest. Lead with the problem each option solves, not the price. Build the customer\'s understanding of value before you reveal the cost.',
        avoidThis: 'Starting with the premium option and working down. It anchors the customer to the high price and makes the middle seem like settling.',
      },
      {
        stepNumber: 3,
        title: 'Present each option with the benefit, not just the price',
        script: 'Good: "Option 1 is $[X]. This fixes [specific problem] and gets you [result]. This is the minimum to address what you\'re experiencing today." Better: "Option 2 is $[X]. This includes everything in Option 1 plus [additional fix], which means [customer benefit]. This is what I\'d recommend for most situations." Best: "Option 3 is $[X]. This is the most comprehensive approach — it includes [everything], and it means [biggest benefit statement]. Most of our customers who are thinking long-term choose this one."',
        notes: 'Each option needs a benefit statement, not just a description of work. "This means your system will run more efficiently and your utility bills will be lower" is a benefit. "This includes a coil cleaning" is a description. Sell the outcome, not the task.',
        avoidThis: 'Reading the options like a menu without explaining the real-world benefit of each.',
      },
      {
        stepNumber: 4,
        title: 'Make a recommendation',
        script: '"If you\'re asking me what I\'d do — Option 2. It takes care of the immediate issue and addresses [the related finding] before it becomes a bigger problem. Option 3 is the most complete if you want the peace of mind."',
        notes: 'Making a recommendation is the single most trust-building thing a technician can do. Customers want guidance from the expert in their home. A technician who cannot recommend sounds uncertain. Make a specific recommendation and explain why.',
        avoidThis: 'Refusing to make a recommendation with "it\'s really up to you." That is not service — that is avoidance.',
      },
      {
        stepNumber: 5,
        title: 'Handle the decision moment',
        notes: 'After presenting and recommending, pause. Let the customer respond. Answer questions directly. If they want to think about it, offer to leave the written proposal and confirm a follow-up time. Do not discount on the spot under pressure.',
        avoidThis: 'Volunteering a discount before the customer asks for one. It signals that your original price was inflated.',
      },
    ],
    keyPrinciples: [
      'Present options as choices, not as pressure',
      'Always include a benefit statement with each option',
      'Always make a recommendation — customers expect the expert\'s opinion',
      'Most customers choose the middle — design the middle for your target margin',
      'Never discount on the spot under pressure — "let me check with my manager" is the correct response',
    ],
    commonMistakes: [
      'Not having the framework prepared in advance — improvised options miss margin',
      'Making the Good option too appealing — it should be minimal',
      'Not making a recommendation — it undermines the customer\'s trust in your expertise',
      'Discounting when the customer hesitates instead of asking what their concern is',
      'Presenting only two options — three is the psychological sweet spot',
    ],
    successMetric: 'Average ticket on calls where Good/Better/Best was presented vs. not presented.',
    lockedContent: 'Trade-specific Good/Better/Best frameworks (HVAC repair, HVAC replacement, plumbing repair, electrical) · Benefit statement library by job type · Customer objection responses for each option · Proposal template · Field training role-play guide',
  },

  {
    id: 'financing-conversation',
    title: 'Financing Conversation',
    shortTitle: 'Financing',
    scenario: 'estimate',
    roles: ['technician', 'estimator', 'owner'],
    phaseRelevance: ['pricing-profit-margin'],
    summary: 'How to introduce financing as a service tool that increases close rate on large-ticket jobs without making the customer feel pressured or embarrassed.',
    whyItWorks: 'Most customers who say "I need to think about it" on a large-ticket job are not thinking — they are calculating whether they can afford it. Financing removes the affordability barrier while preserving the full-price close. A customer who would have said no becomes a yes at $89/month.',
    whenToUse: 'Any job where the total exceeds $1,500. Present financing as an option alongside the full-price option — never as a last resort after the customer declines.',
    steps: [
      {
        stepNumber: 1,
        title: 'Introduce financing proactively',
        script: '"Before I walk you through the pricing, I just want to mention that we offer financing options through [Lender] — so if you\'d like to look at monthly payment options instead of one upfront payment, that\'s absolutely available."',
        notes: 'Introduce financing before presenting price — not after the customer declines. When financing is introduced after hesitation, it feels like a reaction to price objection. When introduced proactively, it feels like a customer service feature.',
        avoidThis: 'Waiting until the customer says "that\'s too much" to mention financing. That puts the customer in a defensive position.',
      },
      {
        stepNumber: 2,
        title: 'Show the monthly payment option',
        script: '"For Option 2 at $3,200 — with our 12-month financing, that\'s about $267 a month. 24-month is around $145. Some people prefer to pay upfront; others like to keep cash in the bank. Either way works for us."',
        notes: 'Translate the total price to monthly — always. Show multiple term options. Treat both payment methods as equally valid choices, not as a backup.',
        avoidThis: 'Only showing financing for the most expensive option. Show it for any option over your threshold.',
      },
      {
        stepNumber: 3,
        title: 'Handle the application process',
        notes: 'Wisetack, GreenSky, and Hearth all have 60-second mobile applications. Walk the customer through the QR code or link on your tablet. The application does not affect their credit score until they accept a loan. Soft pulls are standard for pre-qualification.',
        avoidThis: 'Telling the customer about financing but not having the application ready to run immediately.',
      },
      {
        stepNumber: 4,
        title: 'Let the customer choose their path',
        notes: 'Once options are presented — full price or financing — let the customer decide. Do not push one over the other. Your goal is to make it easy for them to say yes, not to steer them to a specific payment method.',
        avoidThis: 'Pushing financing when the customer prefers to pay in full. Respect their preference.',
      },
    ],
    keyPrinciples: [
      'Introduce financing before pricing, not after hesitation',
      'Show monthly payment equivalent for every large-ticket option',
      'Treat financing and cash as equally valid choices',
      'Have the application ready on your device before the appointment',
      'Financing is not a desperation move — it is a customer service feature',
    ],
    commonMistakes: [
      'Only mentioning financing after the customer declines the price',
      'Apologizing for the price before offering financing — it anchors the customer to thinking the price is high',
      'Not having the lender application ready at the appointment',
      'Assuming a homeowner cannot afford the job before offering options',
      'Not knowing the payment terms for each financing option',
    ],
    successMetric: 'Close rate on jobs over $1,500 with financing offered vs. not offered.',
    lockedContent: 'Financing introduction scripts by job type · Monthly payment cheat sheet for common job sizes · Lender comparison matrix · Objection responses for financing hesitation · Training guide for presenting financing naturally',
  },

  {
    id: 'maintenance-agreement-sales',
    title: 'Maintenance Agreement Sales',
    shortTitle: 'Agreement Sales',
    scenario: 'on-site',
    roles: ['technician'],
    phaseRelevance: ['service-agreements'],
    summary: 'A natural, non-pressured process for introducing and closing maintenance agreements on service, repair, and maintenance calls.',
    whyItWorks: 'Maintenance agreements are easiest to sell to customers who have just received good service. The positive experience is fresh, the technician has demonstrated competence, and the customer has just been reminded of how inconvenient system failures are. The offer frames the agreement as a service continuation, not a product push.',
    whenToUse: 'After completing a service call, repair, or maintenance visit. Never offer before the work is done and the customer is satisfied.',
    steps: [
      {
        stepNumber: 1,
        title: 'Complete the job and confirm customer satisfaction first',
        script: '"Before I go — is everything working the way you\'d expect? Any questions about the work I did today?"',
        notes: 'Confirm satisfaction before any agreement offer. An unsatisfied customer cannot be converted to an agreement customer. If there is a concern, address it first completely.',
        avoidThis: 'Offering the agreement before the job is fully complete and the customer is satisfied.',
      },
      {
        stepNumber: 2,
        title: 'Transition to the agreement offer',
        script: '"I also wanted to mention — we have a maintenance plan that a lot of our customers find really valuable. Would it be okay if I told you about it real quick?"',
        notes: 'Ask permission to tell them about the plan. Getting a yes to "can I tell you about it" makes them more receptive to the offer itself. It also screens customers who are clearly not interested, saving everyone\'s time.',
        avoidThis: 'Launching into the agreement pitch without any transition or permission signal.',
      },
      {
        stepNumber: 3,
        title: 'Explain the plan in customer terms',
        script: '"Basically, it means we come out twice a year to inspect and tune up your [system] before the busy season. You get priority scheduling — so if something does go wrong, you\'re not waiting in line like everyone else. And you get a [X]% discount on any parts. It\'s $[price] a year, or about $[monthly equivalent] a month."',
        notes: 'Translate every feature into a customer benefit. "Two visits per year" becomes "we catch problems before they become emergencies." Priority scheduling is often more valued by customers than the price discount.',
        avoidThis: 'Leading with the discount or the price before the value is clear.',
      },
      {
        stepNumber: 4,
        title: 'Offer a first-year incentive for same-day decisions',
        script: '"If you want to get started today, I can set it up right now and the first year is $[discounted price] since you just had service."',
        notes: 'A modest first-year discount (10–15%) for same-day enrollment increases on-site close rate significantly. The discount should be genuine — you are capturing a customer while they are warm, which is worth a first-year incentive.',
        avoidThis: 'Offering the same discount regardless of timing — the incentive only works when it rewards immediate decision.',
      },
      {
        stepNumber: 5,
        title: 'Handle objections and close',
        notes: '"Let me think about it" usually means the value was not clear. Ask: "What questions do you have about it?" and re-establish the priority scheduling and cost savings benefits. If they genuinely want to think about it, leave written materials and follow up within 3 days.',
        avoidThis: 'Accepting "I\'ll think about it" without asking what questions remain. There is almost always an objection you can address.',
      },
    ],
    keyPrinciples: [
      'Never offer before the job is done and the customer is satisfied',
      'Ask permission to present the plan — micro-commitment improves reception',
      'Translate features to benefits: priority scheduling is more compelling than the price discount',
      'Offer a same-day incentive for immediate enrollment',
      'Follow up within 3 days if the customer wants to think about it',
    ],
    commonMistakes: [
      'Offering the agreement at the beginning of the call before work is done',
      'Describing the plan in terms of what the contractor gets ("two guaranteed visits") instead of what the customer gets',
      'Not having a same-day incentive',
      'Accepting a "maybe" without asking what questions remain',
      'Never following up on customers who deferred the decision',
    ],
    successMetric: 'Agreement offer rate (% of calls where offer was made) and agreement conversion rate per tech.',
    lockedContent: 'Agreement offer scripts by call type (repair, maintenance, install) · Objection handling guide for agreements · Agreement follow-up sequence · Renewal conversation guide · Tech training role-play module',
  },

  {
    id: 'objection-handling',
    title: 'Objection Handling',
    shortTitle: 'Objections',
    scenario: 'objection',
    roles: ['technician', 'estimator', 'csr'],
    phaseRelevance: ['sales-process-call-handling', 'pricing-profit-margin'],
    summary: 'How to respond to the most common customer objections without discounting, arguing, or losing the relationship.',
    whyItWorks: 'Most objections are not final decisions — they are requests for more information or reassurance. A contractor who has a practiced, confident response to common objections converts significantly more hesitant customers than one who either panics and discounts or goes silent.',
    whenToUse: 'Any time a customer expresses hesitation, price concern, competitive comparison, or need to defer a decision.',
    steps: [
      {
        stepNumber: 1,
        title: '"That\'s too expensive" / "Your price is too high"',
        script: '"I understand — it\'s more than you were expecting. Can I ask what you were thinking it might be?" [Listen.] "Here\'s what goes into it: [material cost, labor time, warranty]. I want to make sure you understand exactly what you\'re getting for that. We also have financing if you\'d like to look at monthly payment options."',
        notes: 'Never defend the price by saying "well it costs a lot to run a business." Ask what they expected. Explain the value. Offer financing. Discounting immediately signals that your original price was not honest.',
        avoidThis: 'Immediately offering a discount. It tells the customer your original price was inflated.',
      },
      {
        stepNumber: 2,
        title: '"I want to get another quote"',
        script: '"Absolutely — I always tell people to be comfortable with whoever they hire. I just want to make sure you\'re comparing apples to apples. [Ask about what the quote covers — parts warranty, labor warranty, equipment brand.] If you have any questions after talking to other companies, feel free to call me directly."',
        notes: 'Do not fight the comparison. Invite it — but frame the criteria. Customers who understand what a quality quote covers often come back when they find out competitors are not offering the same warranty or materials.',
        avoidThis: 'Criticizing competitors by name. It sounds defensive and unprofessional.',
      },
      {
        stepNumber: 3,
        title: '"I need to talk to my spouse/partner"',
        script: '"Totally understand — a decision like this is worth discussing. Is there anything I can clarify that might help with that conversation? I can also put together a summary you can share with them."',
        notes: 'Offer a written summary they can share. Ask if there is any information you can provide that would help the decision. Offer to schedule a call where both partners can be present.',
        avoidThis: 'Assuming this is a stall and not a real concern. Most of the time, the partner truly needs to be involved.',
      },
      {
        stepNumber: 4,
        title: '"I\'ll just wait and see"',
        script: '"I understand. The one thing I want to make sure you know is [specific consequence of waiting — e.g., "waiting on this refrigerant issue means the system will lose efficiency and can cause compressor failure which would be $X more to repair"]. I\'m not trying to pressure you — I just want to make sure you have the full picture."',
        notes: 'Give a specific, honest consequence of deferring. Not vague warnings — real, specific information about what happens if the issue is not addressed. This is service, not pressure.',
        avoidThis: 'Using fear language like "this could fail any day" without evidence from the diagnostic.',
      },
      {
        stepNumber: 5,
        title: '"I need to think about it"',
        script: '"Of course. What questions do you have that I haven\'t answered yet?"',
        notes: 'This response almost always uncovers a real objection that was not stated. The customer does not need "time" — they need information or reassurance. Ask what is left unanswered.',
        avoidThis: 'Accepting "I need to think about it" at face value without asking what questions remain.',
      },
    ],
    keyPrinciples: [
      'Objections are usually requests for more information, not final no\'s',
      'Never discount on the spot under price pressure',
      'Ask what they expected before defending the price',
      'Invite competitive comparison — but frame the criteria',
      'Always ask "what questions do you have?" after "I need to think about it"',
    ],
    commonMistakes: [
      'Immediately discounting at the first sign of hesitation',
      'Getting defensive when asked for another quote',
      'Not asking what they expected to pay before defending the price',
      'Using generic fear language without specific diagnostic evidence',
      'Giving up after the first objection without asking a follow-up question',
    ],
    successMetric: 'Close rate on calls where an objection was logged vs. no objection.',
    lockedContent: 'Full objection response library (15+ objections) · Price pushback scripts · Competitive comparison framework · Written proposal follow-up email template · Tech confidence training guide for price conversations',
  },

  {
    id: 'followup-unsold-estimates',
    title: 'Unsold Estimate Recovery',
    shortTitle: 'Estimate Follow-Up',
    scenario: 'follow-up',
    roles: ['csr', 'dispatcher', 'owner'],
    phaseRelevance: ['followup-reviews-reputation'],
    summary: 'A structured 3-touch follow-up sequence to recover estimates that went cold, covering day 2, day 7, and day 21 touchpoints.',
    whyItWorks: 'Most unsold estimates are not definite no\'s — they are deferred decisions. Contractors who follow up systematically recover 15–30% of cold estimates. The follow-up shows persistence, care, and professionalism. Competitors who never follow up lose by default.',
    whenToUse: 'Any estimate that was presented but not closed within 24 hours of presentation.',
    steps: [
      {
        stepNumber: 1,
        title: 'Day 2 — Text follow-up',
        script: '"Hi [Name], this is [Your Name] from [Company]. Just checking in to see if you had any questions about the estimate for your [job type]. Happy to walk through anything or look at different options. Feel free to text or call me."',
        notes: 'Keep it short and low-pressure. Reference the specific job, not just "your estimate." The goal is to open a conversation, not close the job immediately.',
        avoidThis: 'Starting with "just following up" — it is weak and adds no value. Reference the specific job.',
      },
      {
        stepNumber: 2,
        title: 'Day 7 — Personal phone call',
        script: '"Hi [Name], this is [Your Name] from [Company]. I wanted to personally follow up on the estimate for your [job type] — last week was a busy one and I just wanted to make sure you had everything you needed to make a decision. Any questions I can answer for you?"',
        notes: 'Day 7 follow-up should be a phone call, not a text. More personal. If you have a new piece of relevant information (parts availability, seasonal pricing), include it here.',
        avoidThis: 'Only sending texts — at least one follow-up in the sequence should be a personal call.',
      },
      {
        stepNumber: 3,
        title: 'Day 21 — Seasonal or relevance trigger',
        script: '"Hi [Name], wanted to reach out one more time about the [job type] work. [Relevant trigger: peak season approaching, price adjustment, financing now available, or parts availability change]. If the timing is right, we\'re still here and happy to get you scheduled."',
        notes: 'The third touch works best when it has a new reason — not just "still checking in." Seasonal urgency, a price change, or a new financing option creates a legitimate reason to reconnect. This is the last systematic attempt; after this, move to periodic re-engagement.',
        avoidThis: 'Sending the exact same message as touch 1 or 2. If there is no new reason to contact them, at least personalize the message.',
      },
    ],
    keyPrinciples: [
      '3 touches is the minimum — most contractors stop after one',
      'Each touch should have a specific reason to contact, not just "checking in"',
      'Text for touches 1 and 3; phone call for touch 2',
      'Track every estimate that received a follow-up and the outcome',
      'After 3 touches with no response, move to low-frequency re-engagement (seasonal)',
    ],
    commonMistakes: [
      'Giving up after one unreturned follow-up',
      'Using identical messages for each follow-up touch',
      'Following up daily — it feels harassing, not helpful',
      'Not tracking which follow-up resulted in a close',
      'Skipping the phone call in favor of all-text follow-up',
    ],
    successMetric: 'Recovered estimate revenue per month and follow-up response rate per touch.',
    lockedContent: 'Full 3-touch follow-up sequence templates · Seasonal trigger message library · Long-term re-engagement template (90+ day dormant estimates) · Follow-up tracking spreadsheet',
  },

  {
    id: 'cross-sell-upsell',
    title: 'Cross-Selling & Upselling',
    shortTitle: 'Cross-Sell',
    scenario: 'upsell',
    roles: ['technician'],
    phaseRelevance: ['referrals-upsells-crosssells', 'technician-performance'],
    summary: 'How to identify and present upsell and cross-sell opportunities on service calls without appearing pushy or losing customer trust.',
    whyItWorks: 'The customer who just hired you is your warmest possible sales prospect. They already trust you. They already let you in their home or building. They have a system you have just inspected. A cross-sell or upsell in this context is a service recommendation from a trusted expert — not a sales pitch.',
    whenToUse: 'During or after every diagnostic, service, or maintenance call where a relevant additional opportunity was identified during the diagnostic process.',
    steps: [
      {
        stepNumber: 1,
        title: 'Identify during the diagnostic — document everything',
        notes: 'Every cross-sell starts with a legitimate finding. Use the diagnostic checklist to identify all relevant observations. Document them with photos. An upsell without a documented finding is a guess; a finding documented in photos is credible.',
        avoidThis: 'Recommending add-ons you did not specifically find during the inspection. Customers can tell when a recommendation is not grounded in a real finding.',
      },
      {
        stepNumber: 2,
        title: 'Frame as a professional observation, not a sales pitch',
        script: '"While I was working on your [primary issue], I noticed [observation]. It\'s not causing your [primary problem], but it\'s something I want to make sure you know about. [Show photo.] It\'s not an emergency right now, but it\'s worth addressing before it becomes one."',
        notes: 'The word "noticed" is important — it frames you as an attentive professional, not a salesperson looking for add-ons. Show the photo immediately after the observation to ground the recommendation in reality.',
        avoidThis: 'Saying "I also wanted to mention we offer [service]" without grounding it in a specific finding.',
      },
      {
        stepNumber: 3,
        title: 'Classify the finding by urgency',
        notes: 'Safety concern: address now. Performance issue: should be addressed soon. Maintenance recommendation: best practice, good to address within 6 months. Giving customers a clear urgency classification helps them prioritize without feeling pressured.',
        avoidThis: 'Treating all findings as equal urgency. Customers cannot prioritize if everything is presented as critical.',
      },
      {
        stepNumber: 4,
        title: 'Offer to include in today\'s visit or schedule separately',
        script: '"I can take care of that today while I\'m already here — it would be $[X] to add on. Or if you\'d rather schedule it separately, I can leave you a written estimate and we can get you on the schedule."',
        notes: '"While I\'m already here" is a powerful phrase — it is both true and economical. The trip charge is already paid; the incremental cost of adding on is lower than a separate visit.',
        avoidThis: 'Presenting the add-on as a separate full-price call when it can genuinely be done at lower cost during the same visit.',
      },
    ],
    keyPrinciples: [
      'Every recommendation must be grounded in a documented finding',
      'Frame observations as professional insights, not sales opportunities',
      'Classify each finding by urgency so customers can prioritize',
      '"While I\'m already here" is honest and effective framing',
      'Photo documentation makes recommendations credible',
    ],
    commonMistakes: [
      'Recommending services not connected to any specific finding in the diagnostic',
      'Treating every finding as equally urgent — customers tune out everything-is-critical presentations',
      'Not showing photos — makes recommendations seem speculative',
      'Presenting cross-sell opportunities before the primary issue is resolved and the customer is satisfied',
      'Not tracking attach rate — without data, you cannot coach or improve',
    ],
    successMetric: 'Attach rate per tech (% of calls with a cross-sell opportunity identified and presented).',
    lockedContent: 'Trade-specific cross-sell checklists · Cross-sell opportunity matrix by call type · Photo documentation guide for cross-sell support · Customer presentation scripts by finding type',
  },

  {
    id: 'referral-system',
    title: 'Referral System',
    shortTitle: 'Referrals',
    scenario: 'referral',
    roles: ['technician', 'csr', 'owner'],
    phaseRelevance: ['referrals-upsells-crosssells', 'followup-reviews-reputation'],
    summary: 'A systematic approach to building a consistent referral engine from customers, trade partners, and community relationships.',
    whyItWorks: 'Referred customers cost near-zero to acquire, convert at higher rates, have higher lifetime value, and refer at higher rates themselves than cold-acquired customers. A contractor who builds a referral system instead of relying on passive word-of-mouth creates a compounding, self-reinforcing growth engine that runs at near-zero marginal cost.',
    whenToUse: 'After every completed job, and as an ongoing relationship management strategy with past customers and trade partners.',
    steps: [
      {
        stepNumber: 1,
        title: 'Ask after every completed job',
        script: '"I really appreciate your business — it means a lot. If you know anyone who might need [service], I\'d take great care of them. Referrals from our best customers are how we grow."',
        notes: 'The ask is simple and direct. It is a compliment — you are telling them they are the kind of customer whose referral means something. Most contractors do not ask; the few who do consistently outperform on referral volume.',
        avoidThis: 'Not asking because it feels uncomfortable. The discomfort is one-sided — satisfied customers are genuinely happy to refer.',
      },
      {
        stepNumber: 2,
        title: 'Create a referral incentive',
        notes: 'Simple program: referring customer receives a $25–$50 service credit when a referred customer has a job completed. Service credits create loyalty and come back as revenue. Cash feels transactional. Note: check your state\'s laws on referral programs for licensed trades.',
        avoidThis: 'Creating a complex referral program with many tiers and rules. Simple and immediate is more effective.',
      },
      {
        stepNumber: 3,
        title: 'Build trade referral partnerships',
        notes: 'Meet one HVAC, one plumber, one electrician, one roofer, or one remodeler in your area who serves the same residential customer and is not a direct competitor. Propose a mutual referral exchange. One referral partnership with a high-volume contractor can generate 5–20 referrals per year.',
        avoidThis: 'Referring to unreliable partners — one bad customer experience damages your relationship with both the partner and the customer.',
      },
      {
        stepNumber: 4,
        title: 'Track every referral source',
        notes: 'Every referred customer: who referred them, when, and what job they booked. After 90 days you will know which customers are your active referral champions. This data tells you where to invest in relationship maintenance.',
        avoidThis: 'Receiving referrals but not tracking where they came from.',
      },
      {
        stepNumber: 5,
        title: 'Acknowledge and thank referral sources immediately',
        notes: 'When someone refers a customer, call or text them to say thank you before the referred customer\'s job is even completed. This reinforces the behavior. Referral champions who feel appreciated refer more. Those who are ignored stop.',
        avoidThis: 'Waiting until the referred job is complete to acknowledge the referral.',
      },
      {
        stepNumber: 6,
        title: 'Build seasonal re-engagement for dormant referral sources',
        notes: 'Past customers who referred 6–12 months ago and have not referred since deserve a touch. A seasonal check-in or service reminder reactivates the relationship and the referral channel.',
        avoidThis: 'Only engaging referral sources when you need something.',
      },
    ],
    keyPrinciples: [
      'Ask after every job — most contractors do not',
      'Thank referral sources immediately, not after the job is done',
      'Track every referral source — data drives investment decisions',
      'Service credits create loyalty; cash feels transactional',
      'Trade partnerships are your highest-trust external referral channel',
    ],
    commonMistakes: [
      'Not asking because it feels like a favor',
      'Thanking referral sources only after the job is complete and invoiced',
      'Not tracking where referrals come from',
      'Creating a referral program with cash that feels transactional',
      'Neglecting the relationship between referrals — every month without contact is an opportunity lost',
    ],
    successMetric: 'Referral count per month, referral source diversity, and referral-to-close conversion rate.',
    lockedContent: 'Referral ask scripts by call type · Referral incentive program design guide · Trade partner agreement template · Referral thank-you message templates · Referral tracking spreadsheet · Community referral network building guide',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

export function getPlaybookById(id: string): SalesPlaybook | undefined {
  return SALES_PLAYBOOKS.find(p => p.id === id)
}

export function getPlaybooksForPhase(phaseId: string): SalesPlaybook[] {
  return SALES_PLAYBOOKS.filter(p => p.phaseRelevance.includes(phaseId))
}

export function getPlaybooksForRole(role: PlaybookRole): SalesPlaybook[] {
  return SALES_PLAYBOOKS.filter(p => p.roles.includes(role))
}
