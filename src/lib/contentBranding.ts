// ─────────────────────────────────────────────────────────────────────────────
// Content Branding — ownership, copyright, and disclaimer metadata (data/model)
// ─────────────────────────────────────────────────────────────────────────────
// Reusable constants + ownership derivation for ORIGINAL SubZeroMetrix™ content.
// Third-party / public resources are reference links only and never carry a
// SubZeroMetrix™ ownership or copyright claim. Leaf module — imports nothing from
// other app libs (avoids circular dependencies). No UI/auth/payment here.
// ─────────────────────────────────────────────────────────────────────────────

export const ORIGINAL_CONTENT_OWNER = 'The Modern Trades Mentor LLC'

export const ORIGINAL_CONTENT_COPYRIGHT_NOTICE =
  '© 2026 The Modern Trades Mentor LLC. All rights reserved.'

export const SUBZEROMETRIX_BRAND_NOTICE =
  'SubZeroMetrix™ and MetrixScore™ are trademarks of The Modern Trades Mentor LLC.'

export const ORIGINAL_CONTENT_DISCLAIMER =
  'This educational tool is provided for general business-readiness guidance and is not legal, tax, financial, licensing, or professional advice. Verify requirements with official agencies and qualified professionals.'

export const THIRD_PARTY_REFERENCE_NOTICE =
  'Third-party and public-resource links are provided for reference only. SubZeroMetrix™ does not copy, republish, or claim ownership of external resources.'

// ── Brand identity (no image/logo files — names/text only) ─────────────────────
export const BRAND_NAME = 'The Modern Trades Mentor LLC'
export const PRODUCT_NAME = 'SubZeroMetrix™'
export const SCORE_BRAND_NAME = 'MetrixScore™'
export const OWNER_NAME = 'The Modern Trades Mentor LLC'

export const BRAND_IDENTITY = {
  brandName: BRAND_NAME,
  productName: PRODUCT_NAME,
  scoreBrandName: SCORE_BRAND_NAME,
  ownerName: OWNER_NAME,
} as const

// Reusable footer/notice for FUTURE downloadable / printable tools (no export built yet).
export const ORIGINAL_CONTENT_FOOTER =
  '© 2026 The Modern Trades Mentor LLC. All rights reserved. SubZeroMetrix™ and MetrixScore™ are trademarks of The Modern Trades Mentor LLC. This tool is provided for general business-readiness guidance and is not legal, tax, financial, licensing, or professional advice.'

// External/reference boundary — branding may appear on our wrapper, never implying ownership.
export const EXTERNAL_REFERENCE_BOUNDARY_NOTICE =
  'SubZeroMetrix™ may link to external resources for reference only. SubZeroMetrix™ does not own, copy, republish, or endorse external resources. SubZeroMetrix™ branding may appear on our wrapper, card, or page, but not in a way that implies we own or created the external resource.'

const ORIGINAL_LOGO_USAGE_NOTE =
  'SubZeroMetrix™ branding and logo may be placed on this original tool, card, or printable.'
const EXTERNAL_LOGO_USAGE_NOTE =
  'Branding may appear only on the SubZeroMetrix™ wrapper, card, or page — never in a way that implies ownership or creation of the external resource.'

// ── Ownership metadata shape ──────────────────────────────────────────────────
// Three separate concepts are kept distinct and type-safe:
//   copyrightNotice (ownership) · brandNotice (trademark) · disclaimer (educational)
export interface OwnershipMetadata {
  owner?: string
  ownerName?: string
  brandName?: string
  productName?: string
  scoreBrandName?: string
  copyrightNotice?: string   // ownership / copyright
  brandNotice?: string       // trademark / brand
  disclaimer?: string        // educational / professional
  brandFooterText?: string
  logoEligible?: boolean
  logoPlacementAllowed?: boolean
  logoUsageNote?: string
  copyrightEligible?: boolean
  ownershipClaimAllowed?: boolean
  referenceOnly?: boolean
}

// Derive ownership metadata. `isOriginalContent` = internal/future original or a
// SubZeroMetrix™ tool artifact. External/reference resources pass false: they keep
// our wrapper trademark + a reference notice but carry NO ownership/copyright claim.
export function deriveOwnership(isOriginalContent: boolean): OwnershipMetadata {
  if (isOriginalContent) {
    return {
      owner: ORIGINAL_CONTENT_OWNER,
      ownerName: OWNER_NAME,
      brandName: BRAND_NAME,
      productName: PRODUCT_NAME,
      scoreBrandName: SCORE_BRAND_NAME,
      copyrightNotice: ORIGINAL_CONTENT_COPYRIGHT_NOTICE,
      brandNotice: SUBZEROMETRIX_BRAND_NOTICE,
      disclaimer: ORIGINAL_CONTENT_DISCLAIMER,
      brandFooterText: ORIGINAL_CONTENT_FOOTER,
      logoEligible: true,
      logoPlacementAllowed: true,
      logoUsageNote: ORIGINAL_LOGO_USAGE_NOTE,
      copyrightEligible: true,
      ownershipClaimAllowed: true,
      referenceOnly: false,
    }
  }
  // Third-party / public / vendor reference — NO ownership/copyright claim over external
  // material. Our product trademark may appear on the wrapper only; no owner/copyright set.
  return {
    productName: PRODUCT_NAME,
    scoreBrandName: SCORE_BRAND_NAME,
    brandNotice: SUBZEROMETRIX_BRAND_NOTICE,
    disclaimer: THIRD_PARTY_REFERENCE_NOTICE,
    brandFooterText: EXTERNAL_REFERENCE_BOUNDARY_NOTICE,
    logoEligible: false,
    logoPlacementAllowed: false,
    logoUsageNote: EXTERNAL_LOGO_USAGE_NOTE,
    copyrightEligible: false,
    ownershipClaimAllowed: false,
    referenceOnly: true,
  }
}

// Standard combined notice for original SubZeroMetrix™ content.
export function getOriginalContentNotice(): {
  owner: string
  copyright: string
  brand: string
  disclaimer: string
} {
  return {
    owner: ORIGINAL_CONTENT_OWNER,
    copyright: ORIGINAL_CONTENT_COPYRIGHT_NOTICE,
    brand: SUBZEROMETRIX_BRAND_NOTICE,
    disclaimer: ORIGINAL_CONTENT_DISCLAIMER,
  }
}
