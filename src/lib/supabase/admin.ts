import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase admin credentials')
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// Dedicated client for the Metrix Command Center landing-page lead form
// only (src/app/api/mcc-lead/route.ts). Deliberately a SEPARATE Supabase
// project (SubZeroMetrixLandingPage, ref sskgceffpkiuxjhlyjjr) from the
// one createAdminClient() above talks to -- that shared project still
// hosts lead_signups/contact_submissions/affiliate_links/product data for
// /go/[slug] and the admin CMS, and swapping the whole app to a
// landing-only database would break both. This client exists so landing
// leads are fully isolated without touching any of that.
export function createMccLeadsAdminClient() {
  const url = process.env.MCC_LEADS_SUPABASE_URL
  const key = process.env.MCC_LEADS_SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing MCC leads Supabase credentials')
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
