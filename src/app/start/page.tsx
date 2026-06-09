import { redirect } from 'next/navigation'

/**
 * /start now redirects directly to /assessment.
 * The old name/trade/year pre-screen duplicated questions already in the assessment.
 */
export default function StartPage() {
  redirect('/assessment')
}
