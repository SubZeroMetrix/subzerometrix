// ─────────────────────────────────────────────────────────────────────────────
// customerProof — ethical feedback / proof / review foundation (Growth-4)
// ─────────────────────────────────────────────────────────────────────────────
// CONSENT-FIRST. Models how SubZeroMetrix™ collects feedback, identifies testimonial
// / case-study candidates, and routes feedback — WITHOUT fake reviews, incentivized
// reviews, positive-only gating, automatic public posting, or any public use of a
// user's words without explicit permission.
//
// Negative feedback routes PRIVATELY to product/support — never to a public review
// page. No public review request is wired in this phase (documented as future).
// ─────────────────────────────────────────────────────────────────────────────

export type CustomerProofTrigger =
  | 'results_viewed'
  | 'report_viewed'
  | 'dashboard_returned'
  | 'action_completed'
  | 'kpi_saved'
  | 'reassessment_completed'
  | 'roadmap_progress_made'

export type CustomerFeedbackScore = 'positive' | 'neutral' | 'negative'

export type CustomerProofRoute =
  | 'invite_testimonial'        // positive → optional, consent-first testimonial/case-study interest
  | 'ask_what_would_help'       // neutral  → ask how to improve
  | 'private_support_feedback'  // negative → private product/support; NEVER public

export type TestimonialConsentStatus =
  | 'not_asked'
  | 'granted'
  | 'declined'
  | 'interested_contact_later'

export interface CaseStudyCandidate {
  trigger: CustomerProofTrigger
  feedbackScore: CustomerFeedbackScore
  qualifies: boolean
  reason: string
}

export interface ReviewRoutingRecommendation {
  feedbackScore: CustomerFeedbackScore
  route: CustomerProofRoute
  publicReviewAllowed: boolean  // always false in this phase
  message: string
}

export interface CustomerProofPrompt {
  trigger: CustomerProofTrigger
  question: string
  followUpNeutral: string
  testimonialQuestion: string
  disclosure: string
}

export interface TestimonialConsentCopy {
  permission: string
  caseStudy: string
  contactLater: string
  noPublicWithoutPermission: string
  decline: string
}

const SUPPORTED_TRIGGERS: CustomerProofTrigger[] = [
  'results_viewed', 'report_viewed', 'dashboard_returned',
  'action_completed', 'kpi_saved', 'reassessment_completed', 'roadmap_progress_made',
]

const PROGRESS_TRIGGERS: CustomerProofTrigger[] = [
  'action_completed', 'kpi_saved', 'reassessment_completed', 'roadmap_progress_made',
]

/** Low-pressure prompt copy for a trigger context. */
export function getCustomerProofPrompt(trigger: CustomerProofTrigger): CustomerProofPrompt {
  return {
    trigger,
    question: 'Was this useful?',
    followUpNeutral: 'What would make SubZeroMetrix™ more useful for you?',
    testimonialQuestion: 'Would you be open to sharing a short testimonial or case study later? Only with your permission.',
    disclosure: 'Optional and low pressure. We never publish anything without your explicit permission, and you can decline.',
  }
}

/**
 * Where feedback should go. Positive → optional, consent-first testimonial interest;
 * neutral → ask how to improve; negative → PRIVATE product/support (never public).
 * publicReviewAllowed is always false in this phase.
 */
export function getReviewRoutingRecommendation(score: CustomerFeedbackScore): ReviewRoutingRecommendation {
  switch (score) {
    case 'positive':
      return {
        feedbackScore: score,
        route: 'invite_testimonial',
        publicReviewAllowed: false,
        message: 'Glad it is helping. If you are open to it, you can share a testimonial or case study later — only with your permission.',
      }
    case 'neutral':
      return {
        feedbackScore: score,
        route: 'ask_what_would_help',
        publicReviewAllowed: false,
        message: 'Thanks. What would make SubZeroMetrix™ more useful for you?',
      }
    case 'negative':
    default:
      return {
        feedbackScore: score,
        route: 'private_support_feedback',
        publicReviewAllowed: false,
        message: 'Sorry this missed the mark. Your feedback goes privately to our team so we can improve — it is not posted publicly.',
      }
  }
}

/** Consent copy — explicit permission, optional, withdrawable. */
export function getTestimonialConsentCopy(): TestimonialConsentCopy {
  return {
    permission: 'May we share your testimonial publicly? Only if you say yes.',
    caseStudy: 'Open to a short case study about your progress? Optional.',
    contactLater: 'Is it okay for us to contact you later about this? You can decline.',
    noPublicWithoutPermission: 'We never publish your name, quote, or business without your explicit permission, and you can withdraw it at any time.',
    decline: 'No thanks',
  }
}

/** Whether a positive result after real progress is a (consent-required) case-study candidate. */
export function getCaseStudyCandidateSignal(
  trigger: CustomerProofTrigger,
  feedbackScore: CustomerFeedbackScore,
): CaseStudyCandidate {
  const qualifies = feedbackScore === 'positive' && PROGRESS_TRIGGERS.includes(trigger)
  return {
    trigger,
    feedbackScore,
    qualifies,
    reason: qualifies
      ? 'Positive feedback after real progress — a potential case-study candidate (consent required before any use).'
      : 'Not a case-study candidate signal yet.',
  }
}

/** Whether to show the prompt for a trigger (low pressure; respects prior dismissal). */
export function shouldShowCustomerProofPrompt(
  trigger: CustomerProofTrigger,
  opts: { alreadyDismissed?: boolean } = {},
): boolean {
  if (opts.alreadyDismissed) return false
  return SUPPORTED_TRIGGERS.includes(trigger)
}

// ── Active local-device feedback capture ──────────────────────────────────────
// Device-only (matches the szm_* localStorage pattern). NEVER sent externally, never
// posted publicly, never used as a public review. Testimonial/case-study interest is
// recorded only as INTENT — explicit consent is still required before any public use.
export interface CustomerFeedbackRecord {
  id: string
  createdAt: string
  trigger: CustomerProofTrigger
  score: CustomerFeedbackScore
  comment: string | null
  testimonialInterest: boolean
  caseStudyInterest: boolean
  contactLaterOk: boolean
  storageMode: 'local_device'
}

export interface CustomerFeedbackInput {
  trigger: CustomerProofTrigger
  score: CustomerFeedbackScore
  comment?: string | null
  testimonialInterest?: boolean
  caseStudyInterest?: boolean
  contactLaterOk?: boolean
}

const FEEDBACK_STORAGE_KEY = 'szm_customer_feedback'

export function getFeedbackStorageKey(): string {
  return FEEDBACK_STORAGE_KEY
}

function genFeedbackId(): string {
  return `fb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function createCustomerFeedbackRecord(input: CustomerFeedbackInput): CustomerFeedbackRecord {
  const comment = input.comment && input.comment.trim() ? input.comment.trim() : null
  return {
    id: genFeedbackId(),
    createdAt: new Date().toISOString(),
    trigger: input.trigger,
    score: input.score,
    comment,
    testimonialInterest: input.testimonialInterest ?? false,
    caseStudyInterest: input.caseStudyInterest ?? false,
    contactLaterOk: input.contactLaterOk ?? false,
    storageMode: 'local_device',
  }
}

/** All locally-saved feedback records on this device. */
export function getCustomerFeedbackLocal(): CustomerFeedbackRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(FEEDBACK_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CustomerFeedbackRecord[]) : []
  } catch {
    return []
  }
}

/** Append a feedback record to LOCAL device storage. Never sends or posts anything. */
export function saveCustomerFeedbackLocal(record: CustomerFeedbackRecord): void {
  if (typeof window === 'undefined') return
  try {
    const existing = getCustomerFeedbackLocal()
    window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify([...existing, record]))
  } catch {
    // storage unavailable — non-fatal, device-only data
  }
}
