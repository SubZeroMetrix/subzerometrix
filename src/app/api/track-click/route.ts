// ─────────────────────────────────────────────────────────────────────────────
// POST /api/track-click
// Logs every outbound referral click before the user is redirected.
// Returns the tracked URL so the client can redirect.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import {
  buildSubId,
  buildTrackedUrl,
  getDisclosuresForCategory,
  sanitizePostbackPayload,
  isVendorAllowedInState,
  VERTICAL_CODES,
} from '@/lib/tracking'
import { AFFILIATE_PARTNERS, affiliateUrl } from '@/lib/affiliates'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      vendorId,
      sourcePage = 'resources',
      sourcePosition = '',
      userId,
      sessionId,
      userScore = 0,
      userBand = '',
      userState = '',
      userTrade = '',
      userStage = '',
      utmSource = '',
      utmMedium = '',
      utmCampaign = '',
      disclosureText = '',
    } = body

    // ── 1. Validate vendor ──────────────────────────────────────────────────
    const partner = AFFILIATE_PARTNERS.find(p => p.id === vendorId)
    if (!partner) {
      return NextResponse.json({ error: 'Unknown vendor' }, { status: 400 })
    }

    // ── 2. State-gating check ───────────────────────────────────────────────
    if (userState && !isVendorAllowedInState(vendorId, userState)) {
      return NextResponse.json(
        { error: 'Vendor not available in your state' },
        { status: 403 }
      )
    }

    // ── 3. Generate click ID and SubID ──────────────────────────────────────
    const clickId = randomUUID()
    const subId = buildSubId({
      vendorId,
      vendorCategory: partner.category,
      score: userScore,
      state: userState,
      trade: userTrade,
      sourcePage,
      clickId,
    })

    // ── 4. Build tracked URL ────────────────────────────────────────────────
    const trackedUrl = buildTrackedUrl({
      baseUrl: partner.baseUrl,
      trackingParam: partner.trackingParam,
      trackingValue: partner.trackingValue,
      subId,
      utmCampaign: utmCampaign || `${partner.category}-${sourcePage}`,
    })

    // ── 5. Get disclosures for this vendor category ─────────────────────────
    const disclosures = getDisclosuresForCategory(partner.category)
    const vertical = VERTICAL_CODES[partner.category] ?? 'saa'

    // ── 6. Log to Supabase (non-fatal — never block the user redirect) ──────
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Log the click
      const { error: clickError } = await supabase
        .from('referral_clicks')
        .insert({
          id:                clickId,
          vendor_slug:       vendorId,
          vendor_category:   partner.category,
          vendor_vertical:   vertical,
          source_page:       sourcePage,
          source_position:   sourcePosition,
          placement_type:    'organic',
          subid:             subId,
          full_tracking_url: trackedUrl,
          user_id:           userId ?? null,
          session_id:        sessionId ?? `anon_${clickId.substring(0, 8)}`,
          user_trade:        userTrade,
          user_state:        userState,
          user_score:        userScore,
          user_band:         userBand,
          user_stage:        userStage,
          utm_source:        utmSource || 'subzerometrix',
          utm_medium:        utmMedium || 'referral',
          utm_campaign:      utmCampaign || partner.category,
          disclosure_shown:  disclosureText.length > 0,
          disclosure_text:   disclosureText || disclosures[0] || '',
          disclosure_shown_at: disclosureText ? new Date().toISOString() : null,
        })

      if (clickError) {
        // Log but don't block — user still gets redirected
        console.error('track-click insert error (non-fatal):', clickError.message)
      }

      // Log each disclosure shown (immutable audit record)
      if (disclosures.length > 0) {
        await supabase.from('disclosures_log').insert(
          disclosures.map(text => ({
            user_id:          userId ?? null,
            session_id:       sessionId ?? `anon_${clickId.substring(0, 8)}`,
            disclosure_type:  partner.category.includes('insur') ? 'insurance-routing'
                              : partner.category.includes('bank') || partner.category.includes('fund') ? 'banking-routing'
                              : 'affiliate',
            disclosure_text:  text,
            page_url:         sourcePage,
            vendor_slug:      vendorId,
            user_acknowledged: false,
          }))
        )
      }
    }

    // ── 7. Return tracked URL to client ─────────────────────────────────────
    return NextResponse.json({
      url:        trackedUrl,
      clickId,
      subId,
      disclosures,
    })

  } catch (err) {
    console.error('track-click error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
