// ─────────────────────────────────────────────────────────────────────────────
// Tier 2 Tools — original SubZeroMetrix™ content (Phase 1.7: data/model only)
// ─────────────────────────────────────────────────────────────────────────────
// Packaged, usable Pro-tier tools. ALL content is original SubZeroMetrix™ wording.
// No third-party templates, tables, forms, scripts, images, or proprietary
// frameworks are copied. Source references are user-reference links only.
// Not wired into any UI here. Related education assets are linked by id from
// educationContentMap.ts (which is NOT modified).
// ─────────────────────────────────────────────────────────────────────────────

import type { TierId } from './membershipTiers'
import type { OperatingSystemPillarId, LaunchTiming } from './educationContentMap'
import { deriveOwnership, type OwnershipMetadata } from './contentBranding'

// ── Types ─────────────────────────────────────────────────────────────────────
export type Tier2ToolType = 'checklist' | 'template' | 'worksheet' | 'script'

export interface Tier2ChecklistItem {
  id: string
  label: string
  detail?: string            // one line of original guidance
}

export interface Tier2Section {
  id: string
  title: string
  intro?: string
  items: Tier2ChecklistItem[]
}

export interface Tier2ScriptBlock {
  id: string
  label: string
  script: string
  notes?: string
}

export interface Tier2WorksheetField {
  id: string
  label: string
  helper?: string
  fieldType: 'text' | 'number' | 'currency' | 'percent' | 'select' | 'note'
}

export interface Tier2ToolBase {
  id: string
  title: string
  shortDescription: string
  pillar: OperatingSystemPillarId
  relatedEducationAssetId: string
  tierAccess: TierId
  toolType: Tier2ToolType
  launchTiming: LaunchTiming
  sections: Tier2Section[]
  scriptBlocks?: Tier2ScriptBlock[]
  worksheetFields?: Tier2WorksheetField[]
  usageNotes: string
  legalNote: string
  sourceReferences?: string[]
  // Copyright/source safety (Step 5) — fixed for every tool
  originalContentRequired: true
  doNotCopy: true
  sourceUse: 'original_content'
  copyrightRisk: 'low'
}

// Export/print readiness (FUTURE use — no downloads/PDFs/generation built here).
export type IntendedUse = 'contractor_self_guided_tool' | 'owner_operating_tool'
export interface ExportReadiness {
  printableEligible: boolean
  downloadEligible: boolean
  exportFormatReady: boolean
  intendedUse: IntendedUse
  revisionVersion: string
  lastReviewed: string
}

// Every Tier 2 tool carries SubZeroMetrix™ ownership/copyright + export-readiness metadata.
export interface Tier2Tool extends Tier2ToolBase, OwnershipMetadata, ExportReadiness {}

function deriveExportReadiness(toolType: Tier2ToolType): ExportReadiness {
  return {
    printableEligible: true,
    downloadEligible: true,
    exportFormatReady: false,   // no real export format exists yet
    intendedUse: toolType === 'template' ? 'owner_operating_tool' : 'contractor_self_guided_tool',
    revisionVersion: '1.0',
    lastReviewed: '2026-06',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLS
// ─────────────────────────────────────────────────────────────────────────────
const TIER2_TOOLS_BASE: Tier2ToolBase[] = [

  // ── 1. Business Setup Checklist ─────────────────────────────────────────────
  {
    id: 'business_setup_checklist',
    title: 'Business Setup Checklist',
    shortDescription: 'Organize the core startup and business-readiness steps in the right order.',
    pillar: 'foundation_system',
    relatedEducationAssetId: 'business_setup_checklist',
    tierAccess: 'pro_roadmap',
    toolType: 'checklist',
    launchTiming: 'pre_launch',
    sections: [
      {
        id: 'identity', title: 'Identity & Registration',
        intro: 'Lock in who the business is before money moves.',
        items: [
          { id: 'name', label: 'Business name chosen and available', detail: 'Confirm the name is not already in use in your state and that a matching domain/handle is realistic.' },
          { id: 'entity', label: 'Business entity registered (LLC or other structure)', detail: 'Pick a structure that fits your liability and tax situation, then file with your state.' },
          { id: 'ein', label: 'EIN obtained from the IRS', detail: 'Free and quick directly from the IRS — needed for banking, hiring, and taxes.' },
        ],
      },
      {
        id: 'money', title: 'Money Setup',
        intro: 'Keep business money separate from day one.',
        items: [
          { id: 'bank', label: 'Dedicated business bank account opened', detail: 'Run every dollar of business income and expense through it — never the personal account.' },
          { id: 'bookkeeping', label: 'Basic bookkeeping method in place', detail: 'A simple, consistent way to track income and expenses each month beats a perfect system you never use.' },
          { id: 'tax_savings', label: 'Separate tax savings habit started', detail: 'Set aside a fixed percentage of each deposit so quarterly taxes are not a surprise.' },
        ],
      },
      {
        id: 'protection', title: 'Protection & Compliance',
        intro: 'Cover the risks that can end a young business.',
        items: [
          { id: 'insurance', label: 'Business insurance started or active', detail: 'General liability at minimum; add coverage your trade and contracts require.' },
          { id: 'license', label: 'Licensing path confirmed (and responsible/master license holder where required)', detail: 'Some trades require a state license and a designated license holder; verify what applies to you.' },
          { id: 'contracts', label: 'Contract / service agreement reviewed', detail: 'A written agreement covering scope, price, payment terms, and change orders protects both sides.' },
        ],
      },
      {
        id: 'presence', title: 'Presence & Records',
        intro: 'Be findable, look legitimate, and keep your paperwork.',
        items: [
          { id: 'gbp', label: 'Google Business Profile claimed', detail: 'The highest-return free way for local customers to find and trust you.' },
          { id: 'web_presence', label: 'Basic website or contact presence set up', detail: 'Even a simple page with services, area, and a way to contact you builds credibility.' },
          { id: 'documents', label: 'Document storage organized', detail: 'Keep formation docs, licenses, insurance certificates, and tax records in one secure, backed-up place.' },
        ],
      },
    ],
    usageNotes: 'Work top to bottom — each section builds on the one above it. Check items off as you complete them; revisit annually as the business changes.',
    legalNote: 'This is business-readiness guidance, not legal, tax, or licensing advice. Verify requirements with official state/local agencies and qualified professionals.',
    sourceReferences: [
      'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online',
      'https://www.sba.gov/business-guide',
    ],
    originalContentRequired: true, doNotCopy: true, sourceUse: 'original_content', copyrightRisk: 'low',
  },

  // ── 2. Pricing Readiness Checklist ──────────────────────────────────────────
  {
    id: 'pricing_readiness_checklist',
    title: 'Pricing Readiness Checklist',
    shortDescription: 'Make sure your prices cover real costs and a real profit before you quote.',
    pillar: 'pricing_profit_system',
    relatedEducationAssetId: 'pricing_readiness_checklist',
    tierAccess: 'pro_roadmap',
    toolType: 'checklist',
    launchTiming: 'pre_launch',
    sections: [
      {
        id: 'cost_inputs', title: 'Know Your Cost Inputs',
        intro: 'You cannot price what you have not measured.',
        items: [
          { id: 'labor_rate', label: 'Labor rate per hour defined', detail: 'What you actually pay for an hour of skilled work on the job.' },
          { id: 'labor_burden', label: 'Labor burden accounted for', detail: 'Taxes, insurance, and benefits on top of wages — often 15–35% above the base rate.' },
          { id: 'overhead', label: 'Overhead recovery built into pricing', detail: 'Vehicle, tools, phone, software, insurance, and admin must be recovered across billable hours.' },
          { id: 'material_markup', label: 'Material markup policy set', detail: 'A consistent markup that covers procurement time, waste, and warranty risk.' },
        ],
      },
      {
        id: 'targets', title: 'Set Your Targets & Floors',
        intro: 'Decide the numbers you will not drop below.',
        items: [
          { id: 'margin_target', label: 'Gross margin target chosen', detail: 'The margin each job should clear after direct labor and materials.' },
          { id: 'min_job', label: 'Minimum job price established', detail: 'The smallest ticket worth dispatching for — protects against money-losing small jobs.' },
        ],
      },
      {
        id: 'addons', title: 'Add-Ons & Protection',
        intro: 'Charge for the work that usually gets given away.',
        items: [
          { id: 'trip_fee', label: 'Trip / diagnostic fee policy decided', detail: 'Whether and how you charge for showing up and diagnosing.' },
          { id: 'callback_allowance', label: 'Warranty / callback allowance included', detail: 'Build a small allowance into pricing so callbacks do not erase the profit.' },
        ],
      },
      {
        id: 'options', title: 'Customer Options & Discipline',
        intro: 'Give customers a way to say yes and keep pricing current.',
        items: [
          { id: 'financing', label: 'Financing / payment options considered', detail: 'For larger tickets, a monthly-payment option can lift close rates without discounting.' },
          { id: 'review_cadence', label: 'Price review cadence set', detail: 'Revisit pricing on a schedule as material costs, wages, and overhead change.' },
        ],
      },
    ],
    usageNotes: 'Use this to pressure-test your pricing — not as a calculator. Each item is a conceptual input to confirm; plug in your own real numbers.',
    legalNote: 'This is business-readiness guidance, not financial, tax, or accounting advice. Pricing inputs are conceptual — verify your own costs and consult a qualified professional.',
    sourceReferences: [
      'https://www.score.org/resource/article/how-price-your-services',
      'https://www.sba.gov/business-guide/manage-your-business/manage-your-finances',
    ],
    originalContentRequired: true, doNotCopy: true, sourceUse: 'original_content', copyrightRisk: 'low',
  },

  // ── 3. Google Business Profile Checklist ────────────────────────────────────
  {
    id: 'gbp_checklist',
    title: 'Google Business Profile Checklist',
    shortDescription: 'Set up a complete profile so local customers find and trust you.',
    pillar: 'marketing_lead_system',
    relatedEducationAssetId: 'gbp_checklist',
    tierAccess: 'pro_roadmap',
    toolType: 'checklist',
    launchTiming: 'pre_launch',
    sections: [
      {
        id: 'claim', title: 'Claim & Identity',
        items: [
          { id: 'claim_verify', label: 'Profile claimed and verified', detail: 'An unverified profile cannot be fully managed and ranks poorly.' },
          { id: 'name', label: 'Business name entered exactly as it appears in real life', detail: 'Keep it consistent with signage and other listings — avoid stuffing keywords.' },
          { id: 'primary_category', label: 'Primary category set accurately', detail: 'Your main category strongly influences which searches you appear in.' },
        ],
      },
      {
        id: 'reach', title: 'Reach & Contact',
        items: [
          { id: 'service_areas', label: 'Service areas listed', detail: 'List every city or county you genuinely serve.' },
          { id: 'hours', label: 'Hours set and kept current', detail: 'Update for holidays and seasonal changes so customers are not turned away.' },
          { id: 'phone', label: 'Phone number added (and answered)', detail: 'A consistent, monitored number builds trust and captures calls.' },
          { id: 'website', label: 'Website or landing page linked', detail: 'Even a single page gives customers somewhere to verify you.' },
        ],
      },
      {
        id: 'content', title: 'Content & Trust',
        items: [
          { id: 'services', label: 'Services / offerings filled in', detail: 'List the work you do so the profile matches more searches.' },
          { id: 'photos', label: 'Photos added (work, team, truck, logo)', detail: 'Real photos of completed work build more trust than stock images.' },
          { id: 'reviews', label: 'Review collection started', detail: 'Ask satisfied customers to leave a review and respond to every one professionally.' },
          { id: 'qa', label: 'Questions & Answers seeded and monitored', detail: 'Post and answer common questions so customers get accurate information.' },
        ],
      },
      {
        id: 'habit', title: 'Ongoing Habit',
        items: [
          { id: 'call_tracking', label: 'Call / message tracking readiness', detail: 'Decide how you will track which leads come from the profile.' },
          { id: 'weekly_update', label: 'Weekly update habit established', detail: 'A short post, new photo, or review reply each week keeps the profile active.' },
        ],
      },
    ],
    usageNotes: 'Complete the top sections first, then build the weekly habit. A complete, active profile outperforms a claimed-but-empty one.',
    legalNote: 'Google Business Profile is a third-party platform. SubZeroMetrix™ is not affiliated with or endorsed by Google. This is general guidance, not a guarantee of ranking or results.',
    sourceReferences: ['https://business.google.com'],
    originalContentRequired: true, doNotCopy: true, sourceUse: 'original_content', copyrightRisk: 'low',
  },

  // ── 4. Lead Follow-Up Checklist ─────────────────────────────────────────────
  {
    id: 'lead_followup_checklist',
    title: 'Lead Follow-Up Checklist',
    shortDescription: 'Capture more leads, respond faster, and stop letting estimates go cold.',
    pillar: 'sales_conversion_system',
    relatedEducationAssetId: 'lead_followup_checklist',
    tierAccess: 'pro_roadmap',
    toolType: 'checklist',
    launchTiming: 'pre_launch',
    sections: [
      {
        id: 'capture', title: 'Capture Every Lead',
        items: [
          { id: 'missed_call', label: 'Missed-call process defined', detail: 'Decide who calls back, how fast, and what gets logged when a call is missed.' },
          { id: 'lead_source', label: 'Lead source captured for every inquiry', detail: 'Note how each lead found you so you can invest in what works.' },
          { id: 'call_notes', label: 'Call notes recorded consistently', detail: 'Name, address, problem, and urgency on every call — in one place the whole team can see.' },
        ],
      },
      {
        id: 'speed', title: 'Respond Fast',
        items: [
          { id: 'first_response', label: 'First-response time target set', detail: 'The first contractor to respond usually wins — set a target measured in minutes, not days.' },
          { id: 'no_answer_text', label: 'No-answer text routine in place', detail: 'A quick, friendly text when you cannot answer keeps the lead warm.' },
        ],
      },
      {
        id: 'persistence', title: 'Follow Up With Persistence',
        items: [
          { id: 'estimate_followup', label: 'Estimate follow-up scheduled', detail: 'Plan a follow-up after every quote — most sales happen after the first touch.' },
          { id: 'second_third', label: 'Second and third follow-ups planned', detail: 'A short sequence of polite check-ins beats a single quote and silence.' },
          { id: 'unsold_list', label: 'Unsold estimate list maintained', detail: 'Keep a running list of open quotes to revisit, especially in slow weeks.' },
        ],
      },
      {
        id: 'close_loop', title: 'Close the Loop',
        items: [
          { id: 'review_referral', label: 'Review / referral ask after completed jobs', detail: 'Ask happy customers for a review and a referral while the work is fresh.' },
          { id: 'owner_review', label: 'Owner weekly review of open leads', detail: 'A short weekly look at open leads and estimates keeps nothing from slipping.' },
        ],
      },
    ],
    usageNotes: 'Treat this as your follow-up operating standard. Speed and persistence move close rates more than any single script.',
    legalNote: 'General business-readiness guidance for your own process. Not legal or compliance advice — follow applicable calling and texting consent rules and consult a qualified professional.',
    originalContentRequired: true, doNotCopy: true, sourceUse: 'original_content', copyrightRisk: 'low',
  },

  // ── 5. Weekly Business Review Template ──────────────────────────────────────
  {
    id: 'weekly_business_review_template',
    title: 'Weekly Business Review Template',
    shortDescription: 'A 10-minute owner routine to run the business on numbers, not gut feel.',
    pillar: 'operations_delivery_system',
    relatedEducationAssetId: 'weekly_business_review_template',
    tierAccess: 'pro_roadmap',
    toolType: 'template',
    launchTiming: 'pre_launch',
    sections: [
      {
        id: 'money', title: 'Money This Week',
        items: [
          { id: 'revenue_booked', label: 'Revenue booked', detail: 'Total value of work sold or scheduled this week.' },
          { id: 'revenue_collected', label: 'Revenue collected', detail: 'Money actually received — booked is not the same as in the bank.' },
          { id: 'cash_position', label: 'Cash position', detail: 'Current operating cash and weeks of overhead it covers.' },
        ],
      },
      {
        id: 'pipeline', title: 'Pipeline & Conversion',
        items: [
          { id: 'open_estimates', label: 'Open estimates', detail: 'Count and total dollar value of quotes still waiting on a decision.' },
          { id: 'close_rate', label: 'Close rate notes', detail: 'Roughly what share of quotes turned into jobs, and why the rest did not.' },
          { id: 'top_lead_source', label: 'Top lead source', detail: 'Where this week’s best leads came from.' },
        ],
      },
      {
        id: 'delivery', title: 'Delivery & Reputation',
        items: [
          { id: 'callbacks', label: 'Callbacks / issues', detail: 'Any callbacks, warranty visits, or quality problems and their cause.' },
          { id: 'reviews_referrals', label: 'Reviews / referrals', detail: 'New reviews earned and referrals received this week.' },
        ],
      },
      {
        id: 'focus', title: 'Owner Focus',
        items: [
          { id: 'bottleneck', label: 'Team / ops bottleneck', detail: 'The one thing that slowed the business down most this week.' },
          { id: 'priority', label: 'One priority for next week', detail: 'The single most important thing to move forward.' },
          { id: 'score_action', label: 'One action to improve your MetrixScore™', detail: 'Pick one readiness gap to close this week and check it off in your roadmap.' },
        ],
      },
    ],
    usageNotes: 'Fill this in at the same time each week — ten focused minutes. The last line keeps your MetrixScore™ moving in the right direction.',
    legalNote: 'A practical operating routine, not financial, tax, or business advice. Adapt it to your own business and consult qualified professionals for decisions that matter.',
    originalContentRequired: true, doNotCopy: true, sourceUse: 'original_content', copyrightRisk: 'low',
  },

  // ── 6. Service Agreement Starter Checklist ──────────────────────────────────
  {
    id: 'service_agreement_checklist',
    title: 'Service Agreement Starter Checklist',
    shortDescription: 'Think through what a recurring service or maintenance plan needs before you offer one.',
    pillar: 'recurring_revenue_system',
    relatedEducationAssetId: 'service_agreement_checklist',
    tierAccess: 'pro_roadmap',
    toolType: 'checklist',
    launchTiming: 'soon_after_launch',
    sections: [
      {
        id: 'offer_readiness', title: 'Offer Readiness',
        intro: 'Decide whether a recurring offer fits your business before you sell it.',
        items: [
          { id: 'why_offer', label: 'Reason for the agreement is clear', detail: 'Know what the plan does for the customer and for you — steady revenue, scheduled visits, priority service — before you build it.' },
          { id: 'service_defined', label: 'Recurring service is defined', detail: 'Spell out exactly what the customer gets each period: how many visits, what each visit covers, and any included parts or discounts.' },
          { id: 'price_set', label: 'Plan price and billing cycle decided', detail: 'Set a price and a clear cycle (monthly or annual) that covers your real cost to deliver each visit plus profit.' },
          { id: 'capacity', label: 'Capacity to deliver is confirmed', detail: 'Make sure you can actually schedule and complete the visits you are promising before you sign customers up.' },
        ],
      },
      {
        id: 'scope_exclusions', title: 'Scope & Exclusions',
        intro: 'Be specific about what is and is not included so expectations stay clear.',
        items: [
          { id: 'included', label: 'Included work listed in plain language', detail: 'Write what the plan covers in words a customer understands, not trade shorthand.' },
          { id: 'excluded', label: 'Exclusions and limits stated', detail: 'List what is not covered — major repairs, parts above a set cost, emergencies — so nobody assumes more than you offered.' },
          { id: 'response_terms', label: 'Response or priority terms defined', detail: 'If you promise faster or priority service, define what that means in hours or scheduling order.' },
        ],
      },
      {
        id: 'customer_expectations', title: 'Customer Expectations',
        intro: 'Put the agreement in writing so both sides know what was promised.',
        items: [
          { id: 'written', label: 'Agreement is written and signed', detail: 'A simple written agreement the customer signs prevents most disputes later.' },
          { id: 'terms_clear', label: 'Payment, term length, and cancellation are clear', detail: 'State how and when they pay, how long the plan runs, and how either side can cancel.' },
          { id: 'contact', label: 'How to request service is explained', detail: 'Tell the customer exactly how to reach you and book the visits their plan includes.' },
        ],
      },
      {
        id: 'renewal_followup', title: 'Renewal & Follow-Up',
        intro: 'Plan the renewal before the first term ends — that is where recurring revenue is won or lost.',
        items: [
          { id: 'reminder', label: 'Visit reminders are scheduled', detail: 'Set a way to remind yourself and the customer when each included visit is due.' },
          { id: 'renewal_process', label: 'Renewal process is defined', detail: 'Decide when and how you will offer renewal before the plan lapses.' },
          { id: 'lapse_followup', label: 'Lapsed-member follow-up is planned', detail: 'Have a simple way to follow up with members who do not renew on time.' },
        ],
      },
      {
        id: 'internal_tracking', title: 'Internal Tracking',
        intro: 'Track agreements so none slip through the cracks as you grow.',
        items: [
          { id: 'member_list', label: 'Active member list is maintained', detail: 'Keep one list of every active agreement with start date, term, and visits used.' },
          { id: 'visit_log', label: 'Completed visits are logged', detail: 'Record each completed visit so you and the customer agree on what has been delivered.' },
          { id: 'revenue_view', label: 'Recurring revenue is reviewed regularly', detail: 'Check total active agreements and renewal rate on a schedule to see the program working.' },
        ],
      },
    ],
    usageNotes: 'Use this to design a recurring offer you can actually deliver — not as the contract itself. Build your own written agreement from these points and have it reviewed before use.',
    legalNote: 'This is a planning checklist, not a legal contract or legal advice. Service agreements create binding obligations — have your own agreement reviewed by a qualified professional before offering it to customers.',
    originalContentRequired: true, doNotCopy: true, sourceUse: 'original_content', copyrightRisk: 'low',
  },

  // ── 7. Sales Call Script ────────────────────────────────────────────────────
  {
    id: 'sales_call_script',
    title: 'Sales Call Script',
    shortDescription: 'A consultative call structure built on diagnosis and trust — not pressure.',
    pillar: 'sales_conversion_system',
    relatedEducationAssetId: 'sales_call_script',
    tierAccess: 'pro_roadmap',
    toolType: 'script',
    launchTiming: 'pre_launch',
    sections: [
      {
        id: 'how_to_use', title: 'How to Use This Script',
        intro: 'A guide, not a word-for-word reading. Stay natural and listen more than you talk.',
        items: [
          { id: 'adapt', label: 'Adapt the words to sound like you', detail: 'Use your own voice — customers trust a real conversation, not a recited pitch.' },
          { id: 'listen', label: 'Spend most of the call listening', detail: 'The customer should be talking more than you are; ask, then listen.' },
          { id: 'no_pressure', label: 'Lead with diagnosis, not pressure', detail: 'Your job is to understand the problem and offer a fitting solution, never to push someone into a yes.' },
        ],
      },
    ],
    scriptBlocks: [
      { id: 'opening', label: 'Opening & Trust',
        script: `"Thanks for taking the time today. Before I recommend anything, I want to understand what is going on and what matters most to you. Then I will walk you through your options so you can decide what makes sense. Does that sound fair?"`,
        notes: 'Set a calm, customer-first tone and earn permission to ask questions.' },
      { id: 'discovery', label: 'Discovery Questions',
        script: `"Can you tell me what you are noticing, and when it started? How is it affecting things day to day? Has anyone looked at it before? And when you picture this solved, what does that look like for you?"`,
        notes: 'Open-ended questions surface the real problem and what success means to them.' },
      { id: 'confirm', label: 'Problem Confirmation',
        script: `"So if I have this right, the main issue is ____, and what matters most to you is ____. Did I miss anything?"`,
        notes: 'Repeat back what you heard so the customer feels understood and can correct anything.' },
      { id: 'solution', label: 'Solution Framing',
        script: `"Based on what you told me, here is what I would recommend and why. This option fixes it properly. This more basic option costs less if budget is the priority. Here is what each one means for you."`,
        notes: 'Tie the recommendation to what they said. Offer clear options instead of a single take-it-or-leave-it price.' },
      { id: 'objections', label: 'Objection Handling',
        script: `"That is a fair concern, and a lot of people ask about it. Can I share how I would think about it? ____. What is the biggest thing holding you back right now?"`,
        notes: 'Acknowledge first, answer honestly, then ask a question to understand the real hesitation. Never argue.' },
      { id: 'close', label: 'Next-Step Close',
        script: `"Here is what I would suggest as the next step: ____. I can get you on the schedule for ____. Would you like to move ahead, or is there anything you would like me to clarify first?"`,
        notes: 'Offer a clear, low-pressure next step and let the customer decide.' },
    ],
    usageNotes: 'Practice the flow until it feels natural, then make it your own. The structure matters more than the exact words: diagnose, confirm, offer options, and agree on a next step.',
    legalNote: 'A communication guide for your own sales process, not legal, financial, or compliance advice. Follow applicable calling, recording, and consent rules in your area.',
    originalContentRequired: true, doNotCopy: true, sourceUse: 'original_content', copyrightRisk: 'low',
  },

  // ── 8. Review Request Script ────────────────────────────────────────────────
  {
    id: 'review_request_script',
    title: 'Review Request Script',
    shortDescription: 'Ask happy customers for a review consistently and ethically, right after the work.',
    pillar: 'customer_retention_system',
    relatedEducationAssetId: 'review_request_script',
    tierAccess: 'pro_roadmap',
    toolType: 'script',
    launchTiming: 'pre_launch',
    sections: [
      {
        id: 'when_to_ask', title: 'When to Ask',
        intro: 'Timing is most of the battle — ask while the good experience is fresh.',
        items: [
          { id: 'after_done', label: 'Ask right after the work is finished and the customer is happy', detail: 'The best moment is when they have just seen the result and expressed satisfaction.' },
          { id: 'only_satisfied', label: 'Only ask customers who seem genuinely satisfied', detail: 'If someone is unhappy, fix the problem first — do not push for a review.' },
          { id: 'every_job', label: 'Make the ask a consistent habit on every qualifying job', detail: 'A steady stream of honest reviews comes from asking every time, not occasionally.' },
        ],
      },
      {
        id: 'what_not', title: 'What Not to Do',
        intro: 'Keep it honest so your reviews stay trustworthy and within platform rules.',
        items: [
          { id: 'no_incentive', label: 'Do not pay for or trade incentives for reviews', detail: 'Offering money, discounts, or gifts for reviews violates most platform policies and undermines trust.' },
          { id: 'no_fake', label: 'Do not write reviews yourself or filter to only 5-star', detail: 'Ask everyone happy; let customers say what they honestly think.' },
          { id: 'no_pressure', label: 'Do not pressure or repeat-badger the customer', detail: 'One ask plus one gentle reminder is enough — more than that feels pushy.' },
        ],
      },
    ],
    scriptBlocks: [
      { id: 'verbal', label: 'Technician / Verbal Request',
        script: `"I am really glad we got this taken care of for you. If you were happy with the work, a quick online review would genuinely help our small business — and it helps other folks nearby find a contractor they can trust. I can text you the link right now if that is easier. No pressure at all."`,
        notes: 'Said in person while the result is fresh. Honest, brief, and easy to say yes to.' },
      { id: 'text', label: 'Text Request',
        script: `"Hi ____, thanks again for letting us help with your ____ today. If you were happy with how it went, would you mind leaving a short review here? ____ It only takes a minute and it really helps. Thank you either way!"`,
        notes: 'Send the same day while it is fresh. Include your review link where the placeholder is.' },
      { id: 'email', label: 'Email Request',
        script: `"Hi ____, it was a pleasure working with you on your ____. We are a small local business, and honest reviews from customers like you make a real difference in helping others find us. If you have a minute, here is where you can leave a quick review: ____. Thank you for your trust in us."`,
        notes: 'A good fallback when you have an email but not a mobile number.' },
      { id: 'followup', label: 'Follow-Up',
        script: `"Hi ____, just a friendly note in case my last message got buried. If you have a moment for a quick review, here is the link: ____. And if anything about the job was less than perfect, please tell me first so I can make it right."`,
        notes: 'One gentle reminder only. The last line gives unhappy customers a private path to you instead of a public review.' },
    ],
    usageNotes: 'Pick the channels that fit how you already talk to customers. Consistency beats cleverness — asking every happy customer, every time, is what builds a strong review profile.',
    legalNote: 'General guidance for your own review process, not legal advice. Follow the review policies of each platform and applicable texting/email consent rules; do not offer incentives in exchange for reviews.',
    originalContentRequired: true, doNotCopy: true, sourceUse: 'original_content', copyrightRisk: 'low',
  },

  // ── 9. Financing Conversation Script ────────────────────────────────────────
  {
    id: 'financing_conversation_script',
    title: 'Financing Conversation Script',
    shortDescription: 'Offer financing as an option — without pressure, promises, or giving financial advice.',
    pillar: 'pricing_profit_system',
    relatedEducationAssetId: 'financing_conversation_script',
    tierAccess: 'pro_roadmap',
    toolType: 'script',
    launchTiming: 'soon_after_launch',
    sections: [
      {
        id: 'before_offer', title: 'Before You Offer',
        intro: 'Financing is a customer convenience you mention, not something you sell or advise on.',
        items: [
          { id: 'partner_set', label: 'Use an established financing partner', detail: 'Let a qualified lender handle approval, rates, and terms — you simply introduce the option.' },
          { id: 'know_basics', label: 'Know the basics you are allowed to share', detail: 'Be able to explain how to apply and roughly how it works, and hand off the rest to the lender.' },
          { id: 'offer_everyone', label: 'Offer it the same way to everyone', detail: 'Mention financing consistently rather than guessing who can or cannot afford the work.' },
        ],
      },
      {
        id: 'compliance_safe', title: 'Compliance-Safe Language',
        intro: 'Stay on the right side of the line: introduce the option, do not advise or promise.',
        items: [
          { id: 'no_advice', label: 'Do not give financial advice', detail: 'Do not tell a customer whether they should borrow or what is right for their finances — that is their decision and their lender’s role.' },
          { id: 'no_promises', label: 'Do not promise approval or specific rates', detail: 'Approval, rates, and terms are set by the lender. Say the customer can apply and find out, not that they will qualify.' },
          { id: 'say_option', label: 'Frame it as an available option', detail: 'Use phrasing like "financing is available if it is helpful" rather than steering someone toward debt.' },
        ],
      },
    ],
    scriptBlocks: [
      { id: 'intro', label: 'Permission-Based Introduction',
        script: `"Before we finalize, I want to make sure you know all your options. Some customers prefer to pay over time rather than all at once, so we offer financing through a lending partner. Would it be helpful if I showed you how that works? Totally up to you."`,
        notes: 'Ask permission first. Present financing as one option among others, never as the expected choice.' },
      { id: 'monthly', label: 'Monthly Payment Framing',
        script: `"If it is useful, the project can be looked at as an estimated monthly amount instead of the full total. The exact payment depends on what you and the lender agree to — I can show you where to apply so you can see real numbers for your situation."`,
        notes: 'You may mention that a monthly view exists, but make clear the actual amount comes from the lender, not from you.' },
      { id: 'comfort', label: 'Comfort & Affordability Questions',
        script: `"Would paying over time make this project easier to move forward with, or would you rather keep it simple and pay directly? Either way is completely fine — I just want to give you the choice."`,
        notes: 'Ask open, pressure-free questions. Respect the answer immediately; do not push if they decline.' },
      { id: 'handoff', label: 'Next-Step Handoff',
        script: `"If you would like to explore it, here is how to apply with our lending partner: ____. They handle the approval and the terms, and they can answer any questions about rates and payments. Whatever you decide, we are ready to do the work."`,
        notes: 'Hand the financial details to the lender and keep your focus on doing the job well.' },
    ],
    usageNotes: 'Introduce financing as a convenience and then step back. Your role is to mention the option and hand off to the lending partner — never to advise, qualify, or pressure.',
    legalNote: 'This is a communication guide, not financial, lending, or legal advice. Do not advise customers on borrowing or promise approval, rates, or terms. Financing approval and terms are set solely by the lending partner; follow all applicable lending and advertising regulations.',
    originalContentRequired: true, doNotCopy: true, sourceUse: 'original_content', copyrightRisk: 'low',
  },

  // ── 10. Vendor Setup Tracker ────────────────────────────────────────────────
  {
    id: 'vendor_setup_tracker',
    title: 'Vendor Setup Tracker',
    shortDescription: 'Organize the tools and vendors you use or are considering, in one simple place.',
    pillar: 'operations_delivery_system',
    relatedEducationAssetId: 'vendor_setup_tracker',
    tierAccess: 'pro_roadmap',
    toolType: 'worksheet',
    launchTiming: 'soon_after_launch',
    sections: [
      {
        id: 'how_to_use', title: 'How to Use This Tracker',
        intro: 'List one row per tool or vendor. Update it whenever something changes so nothing gets forgotten.',
        items: [
          { id: 'one_row', label: 'Add one entry per tool or vendor', detail: 'Capture every paid tool, app, and service you run the business on, plus ones you are evaluating.' },
          { id: 'keep_current', label: 'Review and update it on a schedule', detail: 'A quick monthly or quarterly review keeps renewal dates and costs accurate.' },
          { id: 'own_choice', label: 'Choose vendors on your own judgment', detail: 'This tracker organizes your decisions; it does not recommend or endorse any specific vendor.' },
        ],
      },
    ],
    worksheetFields: [
      { id: 'vendor_category', label: 'Vendor category', helper: 'What this tool is for (e.g., accounting, scheduling, insurance, financing).', fieldType: 'select' },
      { id: 'vendor_name', label: 'Vendor / tool name', helper: 'The product or company name.', fieldType: 'text' },
      { id: 'purpose', label: 'Purpose', helper: 'In one line, what you use it for.', fieldType: 'text' },
      { id: 'status', label: 'Status', helper: 'Considering, trialing, active, or cancelling.', fieldType: 'select' },
      { id: 'cost', label: 'Cost', helper: 'What you pay and how often (monthly or annual).', fieldType: 'currency' },
      { id: 'renewal_date', label: 'Renewal date', helper: 'When the next bill or contract renewal is due.', fieldType: 'text' },
      { id: 'owner', label: 'Owner', helper: 'Who on your team manages this tool and its login.', fieldType: 'text' },
      { id: 'notes', label: 'Notes', helper: 'Anything worth remembering — plan level, account email, support contact.', fieldType: 'note' },
      { id: 'replacement_risk', label: 'Replacement risk', helper: 'How easily you could switch if needed: low, medium, or high.', fieldType: 'select' },
      { id: 'next_action', label: 'Next action', helper: 'The next thing to do — review price, finish setup, cancel, or none.', fieldType: 'note' },
    ],
    usageNotes: 'Keep this as your single source of truth for the tools you run on. Knowing your real costs, renewals, and logins prevents surprise charges and lost access.',
    legalNote: 'An organizational tool for your own records, not an endorsement of any vendor and not legal, financial, or tax advice. Vendors listed are your choices; SubZeroMetrix™ does not approve, endorse, or guarantee any vendor.',
    originalContentRequired: true, doNotCopy: true, sourceUse: 'original_content', copyrightRisk: 'low',
  },
]

// Enriched export — every tool carries ownership/copyright + export-readiness metadata.
export const TIER2_TOOLS: Tier2Tool[] = TIER2_TOOLS_BASE.map(t => ({
  ...t, ...deriveOwnership(true), ...deriveExportReadiness(t.toolType),
}))

// ─────────────────────────────────────────────────────────────────────────────
// Helpers (Step 4)
// ─────────────────────────────────────────────────────────────────────────────
export function getTier2Tools(): Tier2Tool[] {
  return TIER2_TOOLS
}
export function getTier2Tool(toolId: string): Tier2Tool | undefined {
  return TIER2_TOOLS.find(t => t.id === toolId)
}
export function getTier2ToolsByPillar(pillarId: OperatingSystemPillarId): Tier2Tool[] {
  return TIER2_TOOLS.filter(t => t.pillar === pillarId)
}
export function getPreLaunchTier2Tools(): Tier2Tool[] {
  return TIER2_TOOLS.filter(t => t.launchTiming === 'pre_launch')
}
export function getTier2ToolsByType(toolType: Tier2ToolType): Tier2Tool[] {
  return TIER2_TOOLS.filter(t => t.toolType === toolType)
}
