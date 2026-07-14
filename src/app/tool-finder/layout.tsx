import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Tool Finder',
  description: 'Answer a few questions to get a software recommendation based on your goals, budget, and experience.',
  path: '/tool-finder',
})

export default function ToolFinderLayout({ children }: { children: React.ReactNode }) {
  return children
}
