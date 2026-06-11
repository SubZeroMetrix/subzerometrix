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
