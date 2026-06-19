import { NextResponse } from 'next/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://subzerometric.com'

const LLMS_TXT = `# SubZero Metrix

> SubZero Metrix is an independent affiliate software comparison platform operated by SubZero Metrix LLC. We compare software for websites, email marketing, automation, ecommerce, newsletters, SEO, and online-business growth.

## Content Areas

- **Tools**: Individual product pages covering strengths, limitations, pricing, best-fit users, and setup complexity. Path: /tools/[slug]
- **Comparisons**: Side-by-side software comparisons with feature tables, pricing, and use-case recommendations. Path: /compare/[slug]
- **Reviews**: Editorial reviews of software tools with verified details. Path: /reviews/[slug]
- **Guides**: Practical buying guides for selecting software tools. Path: /guides/[slug]
- **Tool Finder**: Interactive questionnaire that recommends software based on goals, budget, and experience. Path: /tool-finder

## Products Covered

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
