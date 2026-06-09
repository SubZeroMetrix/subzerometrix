import { redirect } from 'next/navigation'

/**
 * /contractor-builders is a legacy URL.
 * Permanent redirect handled in next.config.js.
 * This component is a fallback safety net.
 */
export default function ContractorBuildersPage() {
  redirect('/platform-ecosystem')
}
