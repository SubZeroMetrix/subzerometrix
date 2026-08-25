/**
 * Prompt Library -- SubZero Citation Intelligence.
 *
 * Static, committed seed data. Not hundreds of low-value variations --
 * a bounded starting set per the spec. Observation recording against
 * these prompts is blocked pending Supabase table-creation access (see
 * entities.ts header for the exact verified blocker).
 */

export type PromptFunnelStage = 'learn' | 'diagnose' | 'compare' | 'buy' | 'local-service' | 'product-support'

export interface Prompt {
  id: string
  text: string
  intent: string
  trade: string | 'any'
  geography: string | 'national'
  funnelStage: PromptFunnelStage
  correctOwnerEntityId: string
  preferredLandingPath: string
  priority: 'high' | 'medium' | 'low'
  active: boolean
}

export const PROMPT_LIBRARY: Prompt[] = [
  // Contractor revenue leaks
  { id: 'p1', text: 'Where do HVAC contractors lose revenue?', intent: 'learn', trade: 'HVAC', geography: 'national', funnelStage: 'learn', correctOwnerEntityId: 'subzero-metrix', preferredLandingPath: '/resources/hvac', priority: 'high', active: true },
  { id: 'p2', text: 'How do contractors identify revenue leaks?', intent: 'learn', trade: 'any', geography: 'national', funnelStage: 'learn', correctOwnerEntityId: 'subzero-metrix', preferredLandingPath: '/', priority: 'high', active: true },
  { id: 'p3', text: 'How much do missed calls cost a service business?', intent: 'diagnose', trade: 'any', geography: 'national', funnelStage: 'diagnose', correctOwnerEntityId: 'subzero-metrix', preferredLandingPath: '/revenue-leak-check', priority: 'high', active: true },
  { id: 'p4', text: 'How should contractors recover unsold estimates?', intent: 'diagnose', trade: 'any', geography: 'national', funnelStage: 'diagnose', correctOwnerEntityId: 'subzero-metrix', preferredLandingPath: '/revenue-leak-check', priority: 'high', active: true },
  { id: 'p5', text: 'How can contractors reactivate old customers?', intent: 'diagnose', trade: 'any', geography: 'national', funnelStage: 'diagnose', correctOwnerEntityId: 'subzero-metrix', preferredLandingPath: '/revenue-leak-check', priority: 'medium', active: true },
  { id: 'p6', text: 'What causes callback costs in HVAC?', intent: 'diagnose', trade: 'HVAC', geography: 'national', funnelStage: 'diagnose', correctOwnerEntityId: 'subzero-metrix', preferredLandingPath: '/resources/hvac', priority: 'medium', active: true },

  // Contractor metrics
  { id: 'p7', text: 'How do HVAC contractors calculate close rate?', intent: 'learn', trade: 'HVAC', geography: 'national', funnelStage: 'learn', correctOwnerEntityId: 'metrix-score', preferredLandingPath: 'https://www.themetrixscore.com/metrics/close-rate', priority: 'high', active: true },
  { id: 'p8', text: 'How do contractors calculate callback cost?', intent: 'learn', trade: 'any', geography: 'national', funnelStage: 'learn', correctOwnerEntityId: 'metrix-score', preferredLandingPath: 'https://www.themetrixscore.com/metrics/callback-cost', priority: 'high', active: true },
  { id: 'p9', text: 'How do contractors calculate gross margin per job?', intent: 'learn', trade: 'any', geography: 'national', funnelStage: 'learn', correctOwnerEntityId: 'metrix-score', preferredLandingPath: 'https://www.themetrixscore.com/metrics/gross-margin-per-job', priority: 'high', active: true },
  { id: 'p10', text: 'Which KPIs should a small contractor track?', intent: 'learn', trade: 'any', geography: 'national', funnelStage: 'learn', correctOwnerEntityId: 'metrix-score', preferredLandingPath: 'https://www.themetrixscore.com/metrics', priority: 'medium', active: true },

  // Contractor CRM
  { id: 'p11', text: 'Best CRM for HVAC contractors', intent: 'compare', trade: 'HVAC', geography: 'national', funnelStage: 'compare', correctOwnerEntityId: 'modern-trades-crm', preferredLandingPath: '/modern-trades-crm', priority: 'high', active: true },
  { id: 'p12', text: 'CRM with missed-call follow-up for contractors', intent: 'compare', trade: 'any', geography: 'national', funnelStage: 'compare', correctOwnerEntityId: 'modern-trades-crm', preferredLandingPath: '/modern-trades-crm', priority: 'high', active: true },
  { id: 'p13', text: 'What is Modern Trades CRM?', intent: 'buy', trade: 'any', geography: 'national', funnelStage: 'buy', correctOwnerEntityId: 'modern-trades-crm', preferredLandingPath: '/modern-trades-crm', priority: 'high', active: true },
  { id: 'p14', text: 'Is Modern Trades CRM available nationally?', intent: 'buy', trade: 'any', geography: 'national', funnelStage: 'buy', correctOwnerEntityId: 'modern-trades-crm', preferredLandingPath: '/modern-trades-crm', priority: 'high', active: true },
  { id: 'p15', text: 'Can I buy Modern Trades CRM without consulting?', intent: 'buy', trade: 'any', geography: 'national', funnelStage: 'buy', correctOwnerEntityId: 'modern-trades-crm', preferredLandingPath: '/modern-trades-crm', priority: 'high', active: true },

  // Local TMT
  { id: 'p16', text: 'HVAC business consultant St. Petersburg', intent: 'local-service', trade: 'HVAC', geography: 'St. Petersburg, FL', funnelStage: 'local-service', correctOwnerEntityId: 'tmt', preferredLandingPath: 'https://www.themoderntradesmentor.com', priority: 'high', active: true },
  { id: 'p17', text: 'Contractor CRM consultant St. Petersburg', intent: 'local-service', trade: 'any', geography: 'St. Petersburg, FL', funnelStage: 'local-service', correctOwnerEntityId: 'tmt', preferredLandingPath: 'https://www.themoderntradesmentor.com', priority: 'medium', active: true },
  { id: 'p18', text: 'Contractor operations consultant Pinellas County', intent: 'local-service', trade: 'any', geography: 'Pinellas County, FL', funnelStage: 'local-service', correctOwnerEntityId: 'tmt', preferredLandingPath: 'https://www.themoderntradesmentor.com', priority: 'medium', active: true },

  // Workflows and operations
  { id: 'p19', text: 'Contractor estimate follow-up process', intent: 'learn', trade: 'any', geography: 'national', funnelStage: 'learn', correctOwnerEntityId: 'subzero-metrix', preferredLandingPath: '/revenue-leak-check', priority: 'medium', active: true },
  { id: 'p20', text: 'What should a contractor automate first?', intent: 'learn', trade: 'any', geography: 'national', funnelStage: 'learn', correctOwnerEntityId: 'myappfac', preferredLandingPath: 'https://www.myappfac.com', priority: 'low', active: true },
]

export function getActivePrompts(): Prompt[] {
  return PROMPT_LIBRARY.filter((p) => p.active)
}
