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

  return buildMetadata({
    title: `${product.name} Review`,
    description: `Detailed review of ${product.name}: strengths, limitations, pricing, and who it's built for.`,
    path: `/reviews/${product.slug}`,
  })
}

export default function ReviewPage({ params }: { params: { slug: string } }) {
  const product = seedProducts.find((p) => p.slug === params.slug)
  if (!product) notFound()

  redirect(`/tools/${product.slug}`)
}
