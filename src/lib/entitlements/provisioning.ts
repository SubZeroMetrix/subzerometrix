// ─────────────────────────────────────────────────────────────────────────────
// entitlements/provisioning — Wave 8 CP3: pure webhook → entitlement integrity logic
// ─────────────────────────────────────────────────────────────────────────────
// Deterministic, side-effect-free logic for turning a settled checkout into entitlement records
// and for applying lifecycle transitions (cancel / expire / refund / dispute / revoke). NO Stripe,
// NO Supabase, NO network, NO Date.now() — the webhook route supplies every input (event type,
// resolved session summary, timestamps, ids) and persists the result. Idempotency is expressed as
// a pure membership check so duplicate Stripe deliveries never double-provision.
//
// This module composes the CP1 grant builders, so the Roadmap Pass still yields a persistent
// roadmap grant plus a bounded 30-day Build window, and amounts/capabilities never diverge.
// ─────────────────────────────────────────────────────────────────────────────

import {
  ENTITLEMENT_SCHEMA_VERSION,
  intendedCapabilities,
  type EntitlementMetadata,
  type EntitlementProductKey,
  type EntitlementRecord,
  type EntitlementSource,
} from './types'
import { createRoadmapPassEntitlements } from './entitlements'
import type { PlanId } from '../pricing/pricingPlans'

// ── plan id → canonical product key ───────────────────────────────────────────────
// Plan ids (presentation) and product keys (entitlements) intentionally differ for the monthly
// plans so the access vocabulary stays provider/marketing-agnostic.
const PLAN_TO_PRODUCT: Readonly<Record<PlanId, EntitlementProductKey>> = Object.freeze({
  initial_direction: 'initial_direction',
  roadmap_pass: 'roadmap_pass',
  build: 'build_monthly',
  growth: 'growth_monthly',
  founding_lifetime: 'founding_lifetime',
})

export function productKeyForPlan(planId: PlanId): EntitlementProductKey | null {
  return PLAN_TO_PRODUCT[planId] ?? null
}

// ── idempotency ────────────────────────────────────────────────────────────────────

/** A stable idempotency key for a webhook event. Stripe event ids are globally unique. */
export function webhookEventIdempotencyKey(eventId: unknown): string | null {
  return typeof eventId === 'string' && eventId.trim().length > 0 ? eventId.trim() : null
}

/** Whether an event id has already been processed (duplicate delivery → skip). Pure. */
export function isDuplicateWebhookEvent(
  processedEventIds: Iterable<string> | null | undefined,
  eventId: string,
): boolean {
  const key = webhookEventIdempotencyKey(eventId)
  if (key === null) return false
  if (!processedEventIds) return false
  const set = processedEventIds instanceof Set ? processedEventIds : new Set(processedEventIds)
  return set.has(key)
}

// ── provisioning from a settled checkout ────────────────────────────────────────────

export interface CheckoutProvisionInput {
  planId: PlanId
  ownerId: string
  /** Activation timestamp (ISO-8601 UTC) — also the default createdAt for produced records. */
  activatedAt: string
  /** Base id from which deterministic record ids are derived (e.g. the Stripe session id). */
  idBase: string
  /** For subscriptions: the current period end (ISO). Omit/null for one-time & lifetime. */
  periodEnd?: string | null
  externalProvider?: string | null
  externalCustomerRef?: string | null
  externalTransactionRef?: string | null
  externalSubscriptionRef?: string | null
  metadata?: EntitlementMetadata | null
}

function externalRefs(input: CheckoutProvisionInput) {
  return {
    externalProvider: input.externalProvider ?? null,
    externalCustomerRef: input.externalCustomerRef ?? null,
    externalTransactionRef: input.externalTransactionRef ?? null,
    externalSubscriptionRef: input.externalSubscriptionRef ?? null,
    metadata: input.metadata ?? null,
  }
}

/**
 * Derive the entitlement records a settled checkout grants. Pure and deterministic for a fixed
 * input. The free plan yields no records (no checkout). Roadmap Pass yields a persistent roadmap
 * grant plus the bounded 30-day Build window (CP1 builders). Build/Growth are subscription records
 * bounded by the supplied period end; Founding Lifetime is an unbounded purchase record.
 */
export function deriveEntitlementsFromCheckout(input: CheckoutProvisionInput): EntitlementRecord[] {
  const product = productKeyForPlan(input.planId)
  if (!product || product === 'initial_direction') return []

  const refs = externalRefs(input)
  const createdAt = input.activatedAt

  if (product === 'roadmap_pass') {
    return createRoadmapPassEntitlements({
      id: `${input.idBase}:roadmap`,
      buildAccessId: `${input.idBase}:build`,
      ownerId: input.ownerId,
      activatedAt: input.activatedAt,
      source: 'purchase',
      ...refs,
    })
  }

  if (product === 'build_monthly' || product === 'growth_monthly') {
    const source: EntitlementSource = 'subscription'
    const record: EntitlementRecord = {
      id: `${input.idBase}:${product}`,
      schemaVersion: ENTITLEMENT_SCHEMA_VERSION,
      ownerId: input.ownerId,
      product,
      capabilities: intendedCapabilities(product),
      source,
      status: 'active',
      createdAt,
      activatedAt: input.activatedAt,
      expiresAt: input.periodEnd ?? null,
      ...refs,
    }
    return [record]
  }

  // founding_lifetime — unbounded one-time purchase.
  const founding: EntitlementRecord = {
    id: `${input.idBase}:founding_lifetime`,
    schemaVersion: ENTITLEMENT_SCHEMA_VERSION,
    ownerId: input.ownerId,
    product: 'founding_lifetime',
    capabilities: intendedCapabilities('founding_lifetime'),
    source: 'purchase',
    status: 'active',
    createdAt,
    activatedAt: input.activatedAt,
    expiresAt: null,
    ...refs,
  }
  return [founding]
}

// ── lifecycle transitions (pure) ─────────────────────────────────────────────────────
// Each returns a NEW record; the original is never mutated. Status names carry no legal
// conclusion — see entitlements.ts header.

/** Mark a subscription canceled at a timestamp. Access continues to expiresAt (CP1 rule). */
export function applyCancellation(rec: EntitlementRecord, atIso: string): EntitlementRecord {
  return { ...rec, status: 'canceled', canceledAt: atIso }
}

/** Mark an entitlement expired at a timestamp (e.g. subscription deleted). Ends access. */
export function applyExpiration(rec: EntitlementRecord, atIso: string): EntitlementRecord {
  return { ...rec, status: 'expired', expiresAt: rec.expiresAt ?? atIso }
}

/** Mark an entitlement refunded at a timestamp. Ends access. */
export function applyRefund(rec: EntitlementRecord, atIso: string): EntitlementRecord {
  return { ...rec, status: 'refunded', refundedAt: atIso }
}

/** Mark an entitlement disputed at a timestamp. Ends access. */
export function applyDispute(rec: EntitlementRecord, atIso: string): EntitlementRecord {
  return { ...rec, status: 'disputed', disputedAt: atIso }
}

/** Administratively revoke an entitlement at a timestamp. Ends access. */
export function applyRevocation(rec: EntitlementRecord, atIso: string): EntitlementRecord {
  return { ...rec, status: 'revoked', revokedAt: atIso }
}

// ── persistence mapping (pure) ─────────────────────────────────────────────────────────
// Map a canonical EntitlementRecord to the snake_case row shape for commercial_entitlements
// (migration 005). Kept pure so the column mapping is testable without a database.
export interface EntitlementRow {
  id: string
  schema_version: number
  owner_user_id: string
  product: string
  capabilities: string[]
  source: string
  status: string
  created_at: string
  activated_at: string | null
  expires_at: string | null
  canceled_at: string | null
  revoked_at: string | null
  refunded_at: string | null
  disputed_at: string | null
  external_provider: string | null
  external_customer_ref: string | null
  external_transaction_ref: string | null
  external_subscription_ref: string | null
  metadata: EntitlementMetadata | null
}

export function entitlementToRow(rec: EntitlementRecord): EntitlementRow {
  return {
    id: rec.id,
    schema_version: rec.schemaVersion,
    owner_user_id: rec.ownerId,
    product: rec.product,
    capabilities: rec.capabilities,
    source: rec.source,
    status: rec.status,
    created_at: rec.createdAt,
    activated_at: rec.activatedAt ?? null,
    expires_at: rec.expiresAt ?? null,
    canceled_at: rec.canceledAt ?? null,
    revoked_at: rec.revokedAt ?? null,
    refunded_at: rec.refundedAt ?? null,
    disputed_at: rec.disputedAt ?? null,
    external_provider: rec.externalProvider ?? null,
    external_customer_ref: rec.externalCustomerRef ?? null,
    external_transaction_ref: rec.externalTransactionRef ?? null,
    external_subscription_ref: rec.externalSubscriptionRef ?? null,
    metadata: rec.metadata ?? null,
  }
}

// ── webhook event classification ──────────────────────────────────────────────────────

export type WebhookEntitlementIntent =
  | 'provision'
  | 'cancel'
  | 'expire'
  | 'refund'
  | 'dispute'
  | 'none'

/**
 * Map a Stripe event type to the entitlement intent it implies. Unmapped / ambiguous events (incl.
 * invoice.payment_failed, which is handled with a retry/grace window, not an immediate access
 * change) return 'none' so the route never guesses.
 */
export function classifyWebhookEvent(eventType: unknown): WebhookEntitlementIntent {
  switch (eventType) {
    case 'checkout.session.completed':
      return 'provision'
    case 'customer.subscription.deleted':
      return 'expire'
    case 'charge.refunded':
      return 'refund'
    case 'charge.dispute.created':
      return 'dispute'
    default:
      return 'none'
  }
}
