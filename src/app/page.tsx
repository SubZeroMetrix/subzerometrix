// ─────────────────────────────────────────────────────────────────────────────
// app/page (/) — Wave 8 fix: HomeExperience is the DEFAULT public homepage
// ─────────────────────────────────────────────────────────────────────────────
// The rebuilt conversion homepage (HomeExperience) renders by DEFAULT. The previous homepage
// (LegacyHomeExperience) is served ONLY when the explicit rollback env var is set
// (NEXT_PUBLIC_USE_LEGACY_HOMEPAGE=true). The homepage selector is deliberately NOT a commercial
// feature flag — a missing/unset environment always renders the new experience, and pricing,
// checkout, Stripe, Founding inventory, analytics, and consent remain independently controlled by
// their own flags. Metadata reuses the seo.ts builders — no parallel/duplicate metadata system.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { isLegacyHomepageEnabled } from '@/lib/home/homepageMode'
import { buildOpenGraph, buildTwitter, websiteJsonLd } from '@/lib/seo'
import LegacyHomeExperience from '@/components/home/LegacyHomeExperience'
import HomeExperience from '@/components/home/HomeExperience'

const HOME_TITLE = 'SubZeroMetrix™ — Find the Next Business Move That Matters Most'
const HOME_DESCRIPTION =
  'Start it. Build it. Grow it. SubZeroMetrix™ gives contractors, tradespeople, and service businesses a MetrixScore™ readiness reading and a personalized roadmap — so you always know the next move. Educational only; not legal advice.'

export function generateMetadata(): Metadata {
  // Rollback only: serve the minimal legacy metadata when the legacy homepage is forced on.
  if (isLegacyHomepageEnabled()) {
    return { alternates: { canonical: '/' } }
  }
  // Default: the new homepage's truthful, enhanced metadata.
  return {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    alternates: { canonical: '/' },
    openGraph: buildOpenGraph({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: '/' }),
    twitter: buildTwitter({ title: HOME_TITLE, description: HOME_DESCRIPTION }),
  }
}

export default function HomePage() {
  // Rollback only: explicit env var serves the previous homepage.
  if (isLegacyHomepageEnabled()) {
    return <LegacyHomeExperience />
  }
  // Default public homepage.
  return (
    <>
      {/* WebSite structured data — truthful, no ratings/reviews/offers (see seo.ts). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <HomeExperience />
    </>
  )
}
