// ─────────────────────────────────────────────────────────────────────────────
// app/page (/) — Wave 7 Checkpoint 3: flag-gated homepage switch + metadata
// ─────────────────────────────────────────────────────────────────────────────
// Route-preserving switch for `/`. With `presentation_shell` OFF (production default) it renders
// the existing homepage verbatim (LegacyHomeExperience) so behavior is unchanged. With the flag
// ON it renders the rebuilt conversion experience (HomeExperience) and richer, truthful metadata.
// Metadata reuses the seo.ts builders — no parallel/duplicate metadata system is introduced.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { isFeatureEnabled } from '@/lib/featureFlags'
import { buildOpenGraph, buildTwitter, websiteJsonLd } from '@/lib/seo'
import LegacyHomeExperience from '@/components/home/LegacyHomeExperience'
import HomeExperience from '@/components/home/HomeExperience'

const NEW_HOME_TITLE = 'SubZeroMetrix™ — Find the Next Business Move That Matters Most'
const NEW_HOME_DESCRIPTION =
  'Start it. Build it. Grow it. SubZeroMetrix™ gives contractors, tradespeople, and service businesses a MetrixScore™ readiness reading and a personalized roadmap — so you always know the next move. Educational only; not legal advice.'

export function generateMetadata(): Metadata {
  // Flag OFF: return nothing extra so the layout defaults (title/description/canonical '/')
  // apply exactly as today. Flag ON: enhanced, truthful homepage metadata.
  if (!isFeatureEnabled('presentation_shell')) {
    return { alternates: { canonical: '/' } }
  }
  return {
    title: NEW_HOME_TITLE,
    description: NEW_HOME_DESCRIPTION,
    alternates: { canonical: '/' },
    openGraph: buildOpenGraph({ title: NEW_HOME_TITLE, description: NEW_HOME_DESCRIPTION, path: '/' }),
    twitter: buildTwitter({ title: NEW_HOME_TITLE, description: NEW_HOME_DESCRIPTION }),
  }
}

export default function HomePage() {
  if (!isFeatureEnabled('presentation_shell')) {
    return <LegacyHomeExperience />
  }
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
