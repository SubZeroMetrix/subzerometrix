import { notFound, redirect } from 'next/navigation'
import { seedProducts } from '@/../../content/products'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return seedProducts.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = seedProducts.find((p) => p.slug === params.slug)
  if (!product) return {}

  // This page never actually renders content -- it always redirects to
  // /tools/[slug] below. A self-referencing canonical on a page that
  // never serves content is meaningless (and can confuse a crawler that
  // doesn't follow the redirect), so the canonical points at the real
  // destination instead. Also noindex: this URL is never the correct
  // one to show in search results, /tools/[slug] is.
  return buildMetadata({
    title: `${product.name} Review`,
    description: `Detailed review of ${product.name}: strengths, limitations, pricing, and who it's built for.`,
    path: `/tools/${product.slug}`,
    noIndex: true,
  })
}

export default function ReviewPage({ params }: { params: { slug: string } }) {
  const product = seedProducts.find((p) => p.slug === params.slug)
  if (!product) notFound()

  redirect(`/tools/${product.slug}`)
}
