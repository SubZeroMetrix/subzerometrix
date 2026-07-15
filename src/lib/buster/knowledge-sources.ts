import { MCC_PLANS, MCC_BILLING_TERMS, MCC_FOUNDER_PRICING_NOTICE } from '@/content/mcc-pricing'

// Additional indexed documents beyond help_articles -- built directly
// from the site's own real, already-published copy (pricing constants,
// resource pillar summaries). Nothing here is invented; every string is
// either sourced verbatim from an existing content file or is a short,
// accurate summary of a real published page, with a real source_path
// Buster can cite and link to.
export interface KnowledgeDoc {
  id: string
  title: string
  category: string
  text: string
  source_path: string
}

export const STATIC_KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: 'static-pricing-command-center',
    title: 'Command Center plan pricing',
    category: 'Pricing and Trial',
    text: `Command Center is ${MCC_PLANS.command_center.priceDisplay}, with a ${MCC_PLANS.command_center.trialDays}-day free trial. Includes: ${MCC_PLANS.command_center.featureSummary.join('; ')}.`,
    source_path: '/#pricing',
  },
  {
    id: 'static-pricing-founder-crm',
    title: 'Founder CRM plan pricing',
    category: 'Pricing and Trial',
    text: `Founder CRM is ${MCC_PLANS.founder_crm.priceDisplay}, with a ${MCC_PLANS.founder_crm.trialDays}-day free trial, requires an approved founder code. Includes: ${MCC_PLANS.founder_crm.featureSummary.join('; ')}. ${MCC_FOUNDER_PRICING_NOTICE}`,
    source_path: '/#pricing',
  },
  {
    id: 'static-billing-terms',
    title: 'Billing terms',
    category: 'Billing and Cancellation',
    text: `${MCC_BILLING_TERMS.interval} ${MCC_BILLING_TERMS.cancellation} ${MCC_BILLING_TERMS.refunds}`,
    source_path: '/terms',
  },
  {
    id: 'static-resources-hvac',
    title: 'HVAC business operations guide',
    category: 'Resources and Calculators',
    text: 'Missed follow-up, service scheduling, technician coordination, aging estimates, maintenance agreement opportunities, customer communication, reviews and reputation, field-to-office handoff -- where HVAC businesses lose revenue without noticing, and where governed AI genuinely helps.',
    source_path: '/resources/hvac',
  },
  {
    id: 'static-resources-electrical',
    title: 'Electrical contracting business operations guide',
    category: 'Resources and Calculators',
    text: 'Lead follow-up, estimate management, scheduling, service agreements, technician coordination, customer communication, field-to-office handoff for electrical contracting businesses.',
    source_path: '/resources/electrical',
  },
  {
    id: 'static-resources-plumbing',
    title: 'Plumbing business operations guide',
    category: 'Resources and Calculators',
    text: 'Emergency vs. planned work, estimate follow-up, maintenance agreements, dispatch and scheduling, callbacks, customer communication, technician capacity for plumbing businesses.',
    source_path: '/resources/plumbing',
  },
  {
    id: 'static-resources-facility-management',
    title: 'Facility management operations guide',
    category: 'Resources and Calculators',
    text: 'Preventive maintenance, asset lifecycle planning, recommissioning, capital planning, multi-site and mission-critical facility operational reliability.',
    source_path: '/resources/facility-management',
  },
  {
    id: 'static-resources-business-operations',
    title: 'Business operating system guide',
    category: 'Resources and Calculators',
    text: 'Lead response, sales pipeline, follow-up discipline, scheduling, estimate aging, customer communication, team accountability, revenue leakage, daily operating rhythm for any service business.',
    source_path: '/resources/business-operations',
  },
  {
    id: 'static-resources-ai-for-contractors',
    title: 'AI for contractors: what is real vs. roadmap',
    category: 'Resources and Calculators',
    text: 'A practical, honest look at how AI actually helps a contractor or service business today, and where "autonomous AI" claims should make you cautious. Approval-gated automation explained.',
    source_path: '/resources/ai-for-contractors',
  },
  {
    id: 'static-calculator-revenue',
    title: 'Follow-Up Revenue Calculator',
    category: 'Resources and Calculators',
    text: 'A free calculator that estimates how much revenue is sitting in open estimates and overdue follow-ups, using your own numbers -- nothing is sent to a server or stored.',
    source_path: '/resources/tools/follow-up-revenue-calculator',
  },
  {
    id: 'static-calculator-priority',
    title: 'Estimate Follow-Up Priority Calculator',
    category: 'Resources and Calculators',
    text: 'A free calculator that scores which open estimates need follow-up first, based on age, customer response, urgency, and value.',
    source_path: '/resources/tools/estimate-follow-up-priority-calculator',
  },
  {
    id: 'static-privacy',
    title: 'Privacy Policy',
    category: 'Security and Privacy',
    text: 'How SubZero Metrix collects, uses, and protects your data, including third-party processors, cross-domain routing to Metrix Command Center, and data retention.',
    source_path: '/privacy',
  },
  {
    id: 'static-terms',
    title: 'Terms of Use',
    category: 'Billing and Cancellation',
    text: 'Terms covering Metrix Command Center pricing, trial, cancellation, and refund policy.',
    source_path: '/terms',
  },
  {
    id: 'static-about',
    title: 'About SubZero Metrix and the founder',
    category: 'What Metrix Does',
    text: 'Metrix is built by Richard Fritzke, who spent 24+ years in HVAC/R, facilities, and mechanical operations leadership before building it -- and by SubZero Metrix LLC, a small independent team.',
    source_path: '/about/richard-fritzke',
  },
  {
    id: 'static-customer-care',
    title: 'Customer Care Center',
    category: 'Contact Support',
    text: 'Report a website problem, report incorrect information, suggest an improvement, ask a product or pricing question, report a security concern, make a privacy request, or ask for help finding the right next step.',
    source_path: '/customer-care',
  },
]
