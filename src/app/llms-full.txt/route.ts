import { NextResponse } from 'next/server'
import { seedProducts, comparisons, categories } from '@/../../content/products'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.subzerometrix.com'

export async function GET() {
  const lines: string[] = [
    '# SubZero Metrix — Full Content Listing',
    '',
    `> Generated: ${new Date().toISOString().split('T')[0]}`,
    '',
    '## Metrix Command Center',
    '',
    `- URL: ${SITE_URL}/`,
    '- Helps contractors find missed follow-ups, stalled estimates, and customer opportunities, then shows what deserves attention next while keeping important actions under owner approval.',
    '- Pricing: Command Center $99/month, Founder CRM $39/month (founder code required, eligibility-based), both 7-day free trial, monthly, cancel anytime.',
    '- AI Chief of Staff "Buster" recommends next actions; every recommendation requires human approval before any action is taken.',
    `- Product app (login/signup/CRM): https://mcc.subzerometrix.com`,
    '',
    '## Resources for Contractors & Facility Operators',
    '',
    `- Hub: ${SITE_URL}/resources`,
    `- HVAC: ${SITE_URL}/resources/hvac -- operational leaks (missed follow-up, scheduling, technician coordination, estimates, maintenance agreements, communication, reputation, field-to-office handoff, BAS/BMS), by Richard Fritzke, 26 years HVAC/R and facilities leadership.`,
    `- Facility Management: ${SITE_URL}/resources/facility-management -- preventive maintenance, asset lifecycle planning, recommissioning, capital planning, multi-site and mission-critical operations, by Richard Fritzke.`,
    `- Electrical: ${SITE_URL}/resources/electrical -- lead follow-up, estimate management, scheduling, service agreements, technician coordination, field-to-office handoff, organization-authored.`,
    `- Plumbing: ${SITE_URL}/resources/plumbing -- emergency vs. planned work, estimate follow-up, maintenance agreements, dispatch, callbacks, technician capacity, organization-authored.`,
    `- Business Operations: ${SITE_URL}/resources/business-operations -- lead response, sales pipeline, follow-up discipline, scheduling, estimate aging, team accountability, daily operating rhythm, organization-authored.`,
    `- AI for Contractors: ${SITE_URL}/resources/ai-for-contractors -- practical AI uses, approval-gated automation, governance, what Buster/Metrix Command Center does today vs. roadmap.`,
    `- Follow-Up Revenue Calculator (free tool): ${SITE_URL}/resources/tools/follow-up-revenue-calculator`,
    `- Estimate Follow-Up Priority Calculator (free tool): ${SITE_URL}/resources/tools/estimate-follow-up-priority-calculator`,
    '',
    '## Ask Buster, Help Center, and Customer Care',
    '',
    `- Ask Buster: ${SITE_URL}/buster -- retrieval-based Q&A over the Help Center only, not a generative AI chatbot or unrestricted LLM. Every answer cites its source article and a confidence score; unmatched questions get "I don't know that yet" plus a handoff to Help Center, Customer Care, or contact.`,
    `- Help Center: ${SITE_URL}/help -- curated, human-authored Q&A, each tagged with a verification status (Verified/Limited/Planned/Unknown) and a public source citation. Not a generative AI chatbot.`,
    `- Customer Care Center: ${SITE_URL}/customer-care -- public support hub for website visitors and prospects.`,
    `- Qualification flow: ${SITE_URL}/customer-care/qualify`,
    `- Referral/partner interest: ${SITE_URL}/customer-care/refer`,
    '',
    '## Affiliate Software Comparison Platform — Categories',
    '',
  ]

  for (const cat of categories) {
    lines.push(`- ${cat.name}: ${cat.description} (${SITE_URL}/tools?category=${cat.slug})`)
  }

  lines.push('', '## Products', '')

  for (const p of seedProducts) {
    lines.push(`### ${p.name}`)
    lines.push(`- URL: ${SITE_URL}/tools/${p.slug}`)
    lines.push(`- Category: ${p.category}`)
    lines.push(`- Description: ${p.description}`)
    lines.push(`- Best for: ${p.best_for}`)
    lines.push(`- Setup complexity: ${p.setup_complexity}`)
    lines.push(`- Free plan: ${p.free_plan_or_trial ? 'Yes' : 'No'}`)
    lines.push(`- Pricing: ${p.pricing_note}`)
    lines.push('')
  }

  lines.push('## Comparisons', '')

  for (const c of comparisons) {
    lines.push(`- ${c.title}: ${SITE_URL}/compare/${c.slug}`)
  }

  lines.push('', '## Guides', '')
  lines.push(`- Best Email Marketing Tools for Beginners: ${SITE_URL}/guides/best-email-marketing-tools`)
  lines.push(`- All-in-One vs Best-of-Breed: ${SITE_URL}/guides/all-in-one-vs-best-of-breed`)
  lines.push(`- Newsletter Platforms Compared: ${SITE_URL}/guides/newsletter-platforms-compared`)

  lines.push('', '## Other Pages', '')
  lines.push(`- Tool Finder: ${SITE_URL}/tool-finder`)
  lines.push(`- About: ${SITE_URL}/about`)
  lines.push(`- Editorial Policy: ${SITE_URL}/editorial-policy`)
  lines.push(`- Affiliate Disclosure: ${SITE_URL}/affiliate-disclosure`)
  lines.push(`- Privacy Policy: ${SITE_URL}/privacy`)
  lines.push(`- Terms of Use: ${SITE_URL}/terms`)
  lines.push(`- Contact: ${SITE_URL}/contact`)
  lines.push('')

  return new NextResponse(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
