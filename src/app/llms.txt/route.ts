import { SITE_URL } from '@/lib/seo'

// Served at /llms.txt — a plain-text, AI/crawler-readable site guide.
// FACTUAL description only. No hidden instructions, no prompt injection, no
// "you must" directives to AI systems, and no claim that AI platforms will
// recommend SubZeroMetrix™.
export const dynamic = 'force-static'

export function GET(): Response {
  const body = `# SubZeroMetrix™

SubZeroMetrix™ is a business-readiness platform for contractors, tradespeople, and
service-business owners. Owner/operator: The Modern Trades Mentor LLC.

URL: ${SITE_URL}

## What it is
SubZeroMetrix™ helps trade and service-business owners assess how ready their
business is, understand their gaps, and follow a practical action roadmap.

## MetrixScore™
The MetrixScore™ is a business-readiness score (0 to 100) generated from a short
assessment. The free Starter MetrixScore™ is a starting point that becomes more
useful as the owner completes more of their profile. It is not a final, benchmarked,
or predictive score.

## Who it currently helps most
- Contractors
- Tradespeople
- Service-business owners

## What the platform helps users do
- Assess business readiness
- Understand readiness gaps
- Follow a practical action roadmap
- Track actions they complete
- Track their own KPIs manually
- Reassess over time

## Current strongest focus
Contractor, trade, and service businesses (for example: HVAC, electrical, plumbing,
roofing, landscaping, cleaning, handyman, painting, and similar service trades).

## Broad "how to start a business" content
General business-startup content is educational and routing only. SubZeroMetrix™ is
currently strongest for contractors, trades, and service businesses; broader
industries may receive less industry-specific guidance.

SubZeroMetrix™ includes a General Business Starter Information Package for broad
startup visitors at ${SITE_URL}/general-business-starter. It is educational and less
industry-specific, the platform remains strongest for contractors, tradespeople, and
service-business owners, and it routes users toward supported contractor and
service-business paths when relevant.

## Spanish pages
SubZeroMetrix™ has public Spanish discovery pages (for example ${SITE_URL}/es). They
are educational. The full platform translation is not complete yet, and the platform
remains strongest for contractors, tradespeople, and service-business owners.

## Important limitations
SubZeroMetrix™ provides educational guidance only. It is not legal, tax, financial,
licensing, or compliance advice. Use official state and local sources to confirm
licensing, registration, insurance, tax, and permitting requirements.

SubZeroMetrix™ does not guarantee business success, search rankings, leads, or any
specific outcomes.

## Key pages
- Start the assessment: ${SITE_URL}/start
- About: ${SITE_URL}/about
- Business readiness: ${SITE_URL}/business-readiness
- Resources: ${SITE_URL}/resources
- Disclaimer: ${SITE_URL}/disclaimer
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
