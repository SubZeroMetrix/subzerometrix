// ─────────────────────────────────────────────────────────────────────────────
// app/resources (/resources) — Wave 7 Checkpoint 6: flag-gated public directory switch
// ─────────────────────────────────────────────────────────────────────────────
// Route-preserving switch for the preserved /resources route. With `public_resource_directory`
// OFF (production default) it renders the existing resources page verbatim (LegacyResourcesPage),
// so behavior is unchanged. With the flag ON it renders the new verification-gated Resource
// Directory, which consumes ONLY the canonical published ecosystem catalog (empty today) and
// shows a truthful empty state — it never reads the workbook, the launch-import map, the backlog,
// or any held/draft/pending record.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { isFeatureEnabled } from '@/lib/featureFlags'
import AppShell from '@/components/shell/AppShell'
import { Container, Section, Eyebrow, PageHeading, Lead, Alert } from '@/components/ui'
import LegacyResourcesPage from '@/components/resources/LegacyResourcesPage'
import ResourceDirectory from '@/components/resources/ResourceDirectory'

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Browse vetted tools, official authorities, and free resources for contractors, tradespeople, and service businesses. Educational only; not legal advice.',
  alternates: { canonical: '/resources' },
}

export default function ResourcesPage() {
  if (!isFeatureEnabled('public_resource_directory')) {
    return <LegacyResourcesPage />
  }
  return (
    <AppShell variant="directory" header={false}>
      <Section className="pt-6 pb-16">
        <Container width="wide">
          <Link href="/" className="inline-flex items-center gap-1.5 text-brand-silver hover:text-brand-white transition-colors mb-4 touch-target">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs tracking-wide">Home</span>
          </Link>
          <Eyebrow>Resource directory</Eyebrow>
          <PageHeading className="mt-2">RESOURCES</PageHeading>
          <Lead className="mt-3 mb-4">
            Browse vetted tools, official authorities, and free resources by category, trade, region,
            stage, and need. Listings are verification-gated — only reviewed, healthy, official
            destinations appear. This is a browse directory; your personalized next steps live on your
            dashboard.
          </Lead>
          <Alert tone="info" className="mb-6">
            Every listing shows its reviewed date and any required disclosure. Commercial relationships
            never change which resources appear or their order. You can always use your own provider.
          </Alert>
          <ResourceDirectory />
        </Container>
      </Section>
    </AppShell>
  )
}
