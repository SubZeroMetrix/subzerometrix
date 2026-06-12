import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildOpenGraph, buildTwitter, breadcrumbJsonLd, faqPageJsonLd } from '@/lib/seo'
import { getPublicResource, getPublicResourceSlugs, isResourceIndexable } from '@/lib/publicResources'
import ResourcePageView from '@/components/ResourcePageView'

interface Params { params: { slug: string } }

// A small, curated set — NOT programmatic mass generation.
export function generateStaticParams() {
  return getPublicResourceSlugs().map(slug => ({ slug }))
}

export function generateMetadata({ params }: Params): Metadata {
  const resource = getPublicResource(params.slug)
  if (!resource) return { title: 'Not found' }
  const path = `/learn/${resource.slug}`
  return {
    title: resource.metaTitle,
    description: resource.description,
    keywords: resource.keywords,
    alternates: { canonical: path },
    robots: isResourceIndexable(resource) ? undefined : { index: false, follow: true },
    openGraph: buildOpenGraph({ title: `${resource.metaTitle} | SubZeroMetrix™`, description: resource.description, path }),
    twitter: buildTwitter({ title: `${resource.metaTitle} | SubZeroMetrix™`, description: resource.description }),
  }
}

export default function LearnResourcePage({ params }: Params) {
  const resource = getPublicResource(params.slug)
  if (!resource) notFound()

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Learn', path: '/learn' },
    { name: resource.title, path: `/learn/${resource.slug}` },
  ])
  const faq = resource.faq && resource.faq.length > 0
    ? faqPageJsonLd(resource.faq.map(f => ({ question: f.q, answer: f.a })))
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {faq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />}
      <ResourcePageView resource={resource} />
    </>
  )
}
