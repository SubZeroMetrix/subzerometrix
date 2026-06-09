// ─────────────────────────────────────────────────────────────────────────────
// Question schema — SubZeroMetrix MetrixScore v3
// ─────────────────────────────────────────────────────────────────────────────

export type QuestionVariant =
  | 'single'
  | 'checkbox'
  | 'location'
  | 'lead'

export interface OptionItem {
  id: string
  label: string
  score: number
}

export interface AssessmentQuestion {
  id: string
  step: number
  categoryLabel: string
  question: string
  variant: QuestionVariant
  maxPoints: number
  options?: OptionItem[]
  noneOptionId?: string
}

// Platform routing — single source of truth for business_type → platform
export const PLATFORM_ROUTES: Record<string, { slug: string; name: string; accentColor: string }> = {
  hvac:          { slug: 'heat',   name: 'HeatMetrix',    accentColor: '#EF9F27' },
  electrical:    { slug: 'volt',   name: 'VoltMetrix',    accentColor: '#378ADD' },
  plumbing:      { slug: 'flow',   name: 'FlowMetrix',    accentColor: '#1D9E75' },
  roofing:       { slug: 'roof',   name: 'RoofMetrix',    accentColor: '#D85A30' },
  solar:         { slug: 'sun',    name: 'SunMetrix',     accentColor: '#639922' },
  construction:  { slug: 'build',  name: 'BuildMetrix',   accentColor: '#7F77DD' },
  handyman:      { slug: 'fix',    name: 'FixMetrix',     accentColor: '#888780' },
  landscaping:   { slug: 'ground', name: 'GroundMetrix',  accentColor: '#3B6D11' },
  cleaning:      { slug: 'clean',  name: 'CleanMetrix',   accentColor: '#5DCAA5' },
  painting:      { slug: 'paint',  name: 'PaintMetrix',   accentColor: '#C084FC' },
  other:         { slug: 'core',   name: 'SubZeroMetrix', accentColor: '#4A90D9' },
}

// ─── Q1: Business Type ───────────────────────────────────────────────────────
const Q1: AssessmentQuestion = {
  id: 'business_type',
  step: 1,
  categoryLabel: 'Business Type',
  question: 'What type of trade or service business are you starting or running?',
  variant: 'single',
  maxPoints: 10,
  options: [
    { id: 'hvac',         label: 'HVAC',                         score: 10 },
    { id: 'electrical',   label: 'Electrical',                   score: 10 },
    { id: 'plumbing',     label: 'Plumbing',                     score: 10 },
    { id: 'roofing',      label: 'Roofing',                      score: 10 },
    { id: 'solar',        label: 'Solar',                        score: 10 },
    { id: 'construction', label: 'Construction & Remodeling',    score: 10 },
    { id: 'handyman',     label: 'Handyman Services',            score: 10 },
    { id: 'landscaping',  label: 'Landscaping & Lawn Care',      score: 10 },
    { id: 'cleaning',     label: 'Cleaning Services',            score: 10 },
    { id: 'painting',     label: 'Painting',                     score: 10 },
    { id: 'other',        label: 'Other local service business', score: 7  },
  ],
}

// ─── Q2: Location ────────────────────────────────────────────────────────────
const Q2: AssessmentQuestion = {
  id: 'location',
  step: 2,
  categoryLabel: 'Operating Area',
  question: 'Where are you planning to operate?',
  variant: 'location',
  maxPoints: 10,
  options: [],
}

// ─── Q3: Stage ───────────────────────────────────────────────────────────────
const Q3: AssessmentQuestion = {
  id: 'stage',
  step: 3,
  categoryLabel: 'Business Stage',
  question: 'Where does your business stand right now?',
  variant: 'single',
  maxPoints: 15,
  options: [
    { id: 'thinking',    label: 'Just thinking about starting',          score: 4  },
    { id: 'planning',    label: 'Planning to launch in the next 90 days',    score: 8  },
    { id: 'launched_u6', label: 'Already launched — under 6 months in',              score: 10 },
    { id: 'months_6_12', label: '6–12 months in business',            score: 12 },
    { id: 'over_1yr',    label: 'Over 1 year in business, growing steadily',            score: 13 },
    { id: 'reset',       label: 'Existing business that needs a reset',     score: 7  },
  ],
}

// ─── Q4: Setup Checkboxes ────────────────────────────────────────────────────
const Q4: AssessmentQuestion = {
  id: 'setup_steps',
  step: 4,
  categoryLabel: 'Foundation Setup',
  question: 'Which foundation steps have you completed?',
  variant: 'checkbox',
  maxPoints: 20,
  noneOptionId: 'none_yet',
  options: [
    { id: 'biz_name',    label: 'Business name chosen',                       score: 2 },
    { id: 'entity_reg',  label: 'Business / entity registered (LLC, etc.)',   score: 3 },
    { id: 'ein',         label: 'EIN secured from the IRS',                   score: 3 },
    { id: 'bank',        label: 'Business bank account opened',               score: 3 },
    { id: 'insurance',   label: 'Insurance started or active',                score: 3 },
    { id: 'license_res', label: 'License / trade certification in progress',  score: 3 },
    { id: 'website',     label: 'Website or landing page started',            score: 1 },
    { id: 'gbp',         label: 'Google Business Profile claimed',            score: 2 },
    { id: 'none_yet',    label: "None of these yet — I'm starting from zero", score: 0 },
  ],
}

// ─── Q5: Financial Readiness ─────────────────────────────────────────────────
const Q5: AssessmentQuestion = {
  id: 'financial',
  step: 5,
  categoryLabel: 'Financial Readiness',
  question: 'How prepared are you financially to launch or grow?',
  variant: 'single',
  maxPoints: 20,
  options: [
    { id: 'under_2k',     label: 'Under $2,000 available',                   score: 4  },
    { id: 'k2_10',        label: '$2,000–$10,000 available',                     score: 10 },
    { id: 'k10_25',       label: '$10,000–$25,000 available',                    score: 16 },
    { id: 'over_25k',     label: 'Over $25,000 available or strong cash flow',    score: 20 },
    { id: 'need_funding', label: 'Need funding or credit before I can move forward',    score: 6  },
    { id: 'not_sure',     label: 'Not sure what this will cost yet',                    score: 3  },
  ],
}

// ─── Q6: Customer Acquisition ────────────────────────────────────────────────
const Q6: AssessmentQuestion = {
  id: 'customer_plan',
  step: 6,
  categoryLabel: 'Customer Acquisition',
  question: 'How do you plan to get your first — or next — customers?',
  variant: 'single',
  maxPoints: 15,
  options: [
    { id: 'word_of_mouth', label: 'Word of mouth / personal network',       score: 10 },
    { id: 'gbp_local',     label: 'Google Business Profile / local search', score: 12 },
    { id: 'social',        label: 'Social media content',                   score: 7  },
    { id: 'paid_ads',      label: 'Paid ads (Google, Meta, etc.)',          score: 6  },
    { id: 'flyers',        label: 'Door hangers / flyers / local outreach', score: 8  },
    { id: 'referrals',     label: 'Referrals from other contractors',       score: 13 },
    { id: 'existing_base', label: 'Existing customer base',                 score: 15 },
    { id: 'no_plan',       label: 'No clear customer plan yet',             score: 0  },
  ],
}

// ─── Q7: Biggest Blocker ─────────────────────────────────────────────────────
const Q7: AssessmentQuestion = {
  id: 'blocker',
  step: 7,
  categoryLabel: 'Biggest Blocker',
  question: 'What is the single biggest thing freezing your progress right now?',
  variant: 'single',
  maxPoints: 10,
  options: [
    { id: 'legal_setup',  label: "Legal / setup — I haven't formalized anything",        score: 3 },
    { id: 'licensing',    label: "Licensing or compliance — I don't know what I need",   score: 2 },
    { id: 'funding',      label: "Funding / capital — I don't have enough money",        score: 3 },
    { id: 'credit',       label: 'Credit — my credit is holding me back',                score: 3 },
    { id: 'insurance',    label: "Insurance — I'm not covered or don't know how",        score: 4 },
    { id: 'pricing',      label: "Pricing — I don't know what to charge",               score: 6 },
    { id: 'customers',    label: "Customers — I can't get consistent leads",             score: 4 },
    { id: 'branding',     label: "Branding / website — I don't look professional",      score: 8 },
    { id: 'software',     label: "Software / systems — I'm doing everything manually",  score: 7 },
    { id: 'confidence',   label: "Confidence — I don't know what to do first",          score: 5 },
  ],
}

export const QUESTIONS: AssessmentQuestion[] = [Q1, Q2, Q3, Q4, Q5, Q6, Q7]
export const TOTAL_QUESTIONS = 7

export function getQuestion(id: string): AssessmentQuestion | undefined {
  return QUESTIONS.find((q) => q.id === id)
}
