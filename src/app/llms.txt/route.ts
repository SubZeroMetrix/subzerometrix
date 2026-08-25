import { NextResponse } from 'next/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.subzerometrix.com'

const LLMS_TXT = `# SubZero Metrix LLC

> www.subzerometrix.com is operated by SubZero Metrix LLC and hosts two distinct offerings: Metrix Command Center (the homepage, which helps contractors find missed follow-ups, stalled estimates, and customer opportunities, with important actions kept under owner approval) and an independent affiliate software comparison platform (under /tools, /compare, /reviews, /guides).

## Metrix Command Center (homepage, /)

Metrix helps contractors find missed follow-ups, stalled estimates, and customer opportunities, then shows what deserves attention next while keeping important actions under owner approval. It organizes customers, properties, leads, estimates, and jobs into one CRM, and provides a supervised AI team (led by "Buster," an AI Chief of Staff) that recommends next actions. Every AI recommendation requires explicit human approval before it reaches a customer or takes any action — there is no autonomous mode. Pricing: Command Center at $99/month, Founder CRM at $39/month (founder-code required, eligibility-based), both with a 7-day free trial, billed monthly, cancel anytime. The product itself (login, signup, CRM) is hosted at mcc.subzerometrix.com; this domain (subzerometrix.com) hosts only the public marketing/lead-capture page.

## Resources for Contractors & Facility Operators

Practical guides grounded in the founder's own 26 years of HVAC/R, facilities, and mechanical operations experience where personally attributed, and honest organization-authored operational guides for adjacent trades. Path: /resources, with pillar pages at /resources/hvac, /resources/facility-management, /resources/electrical, /resources/plumbing, /resources/business-operations, and /resources/ai-for-contractors, plus free interactive tools at /resources/tools/follow-up-revenue-calculator and /resources/tools/estimate-follow-up-priority-calculator.

## Ask Buster (/buster), Help Center, and Customer Care

/buster is a retrieval-based Q&A assistant -- not a generative AI chatbot and not an unrestricted LLM. It answers only from the curated Help Center content at /help (each entry tagged Verified, Limited, Planned, or Unknown, citing its public source) and always shows its source and a confidence score. If it has no good match, it says "I don't know that yet" and offers a Help Center article, a Customer Care request, or a contact path instead of guessing. /customer-care is the public support hub for website visitors and prospects (bug reports, product/pricing questions, privacy requests) -- existing Metrix Command Center account holders are directed to mcc.subzerometrix.com for account-specific support.

## Affiliate Software Comparison Platform

An independent software comparison platform. We compare software for websites, email marketing, automation, ecommerce, newsletters, SEO, and online-business growth.

- **Tools**: Individual product pages covering strengths, limitations, pricing, best-fit users, and setup complexity. Path: /tools/[slug]
- **Comparisons**: Side-by-side software comparisons with feature tables, pricing, and use-case recommendations. Path: /compare/[slug]
- **Reviews**: Editorial reviews of software tools with verified details. Path: /reviews/[slug]
- **Guides**: Practical buying guides for selecting software tools. Path: /guides/[slug]
- **Tool Finder**: Interactive questionnaire that recommends software based on goals, budget, and experience. Path: /tool-finder

## Products Covered (affiliate platform)

Systeme.io, MailerLite, Kinsta, GetResponse, Kit (formerly ConvertKit), beehiiv, ActiveCampaign, Shopify, Semrush, Instantly

## Editorial Policy

Recommendations are based on use-case fit, verified features, published pricing, and honest assessment — not on affiliate commission rates. Full policy: ${SITE_URL}/editorial-policy

## Affiliate Disclosure

Some links are affiliate links. SubZero Metrix LLC may earn a commission at no extra cost to the reader. Full disclosure: ${SITE_URL}/affiliate-disclosure

## Sitemap

${SITE_URL}/sitemap.xml

## Extended Information

For a detailed listing of all pages and products: ${SITE_URL}/llms-full.txt

## Note

The presence of this llms.txt file does not guarantee that any AI system will cite, reference, or surface this content. This file exists to help AI systems understand the scope and purpose of this website.
`

export async function GET() {
  return new NextResponse(LLMS_TXT, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
