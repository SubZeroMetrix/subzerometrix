export interface Product {
  id: string
  slug: string
  name: string
  description: string
  category: string
  website_url: string
  logo_url: string | null
  best_for: string | null
  poor_fit_for: string | null
  strengths: string[] | null
  limitations: string[] | null
  pricing_note: string | null
  free_plan_or_trial: boolean
  setup_complexity: 'easy' | 'moderate' | 'advanced'
  editorial_score: number | null
  verification_source: string | null
  last_verified_date: string | null
  next_review_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductCategory {
  id: string
  slug: string
  name: string
  description: string | null
  display_order: number
  is_active: boolean
}

export interface ProductUseCase {
  id: string
  product_id: string
  use_case_slug: string
  use_case_name: string
  relevance_score: number
}

export interface AffiliateProgram {
  id: string
  product_id: string
  affiliate_network: string | null
  commission_type: 'recurring' | 'one-time' | 'tiered' | 'hybrid'
  commission_display_text: string | null
  recurring_duration: string | null
  cookie_duration: string | null
  approval_status: 'approved' | 'pending' | 'rejected' | 'not_applied'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AffiliateLink {
  id: string
  product_id: string
  affiliate_program_id: string | null
  slug: string
  destination_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductComparison {
  id: string
  slug: string
  title: string
  description: string | null
  product_a_id: string
  product_b_id: string
  best_for_a: string | null
  best_for_b: string | null
  summary: string | null
  last_verified_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EditorialReview {
  id: string
  slug: string
  product_id: string
  title: string
  summary: string | null
  body_content: string | null
  editorial_score: number | null
  pros: string[] | null
  cons: string[] | null
  verdict: string | null
  last_reviewed_date: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface VerificationRecord {
  id: string
  entity_type: 'product' | 'comparison' | 'review' | 'affiliate_link'
  entity_id: string
  verified_by: string | null
  verification_source: string | null
  verified_date: string
  notes: string | null
}

export interface ToolFinderQuestion {
  id: string
  question_text: string
  question_key: string
  display_order: number
  is_active: boolean
}

export interface ToolFinderAnswer {
  id: string
  question_id: string
  answer_text: string
  answer_value: string
  display_order: number
}

export interface ToolFinderRule {
  id: string
  conditions: Record<string, string>
  primary_product_id: string
  secondary_product_id: string | null
  reasoning: string | null
  is_active: boolean
}

export interface LeadSignup {
  id: string
  email: string
  use_case: string | null
  source: string | null
  consent_given: boolean
  consent_text: string | null
  consent_timestamp: string | null
  created_at: string
}

export interface AffiliateClickEvent {
  id: string
  affiliate_link_id: string
  click_timestamp: string
  source_page: string | null
  campaign: string | null
  tool_finder_result: boolean
  ip_hash: string | null
  user_agent_hash: string | null
}

export interface ConsentRecord {
  id: string
  session_id: string
  consent_type: 'necessary' | 'analytics' | 'marketing'
  granted: boolean
  timestamp: string
  ip_hash: string | null
}

export interface ContentPage {
  id: string
  slug: string
  title: string
  body_content: string | null
  meta_description: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  created_at: string
}

export interface AdminProfile {
  id: string
  user_id: string
  role: 'admin' | 'editor'
  created_at: string
}
