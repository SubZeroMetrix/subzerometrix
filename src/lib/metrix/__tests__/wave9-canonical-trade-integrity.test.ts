// ─────────────────────────────────────────────────────────────────────────────
// Wave 9 CP2 — canonical trade/profile integrity (Node runner).
// Locks the data-integrity invariants flagged for review: NO silent Electrical/default trade,
// a later explicit trade answer wins over legacy business_type, an unknown/empty trade resolves to
// null (honest incomplete), all ten trades are first-class, and licensing + trade intelligence read
// the SAME single canonical source. Pure + source inspection — no Stripe/network.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { resolveTrade, CANONICAL_TRADE_IDS, TRADE_REGISTRY } from '../../metrix/trades'
import { readTradeSource, readStateSource } from '../../metrix/profileSources'
import type { MetrixProfileSnapshot } from '../../metrix/profileTypes'

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8')

// Minimal snapshot shape for the readers (only the fields they touch).
function snap(over: {
  ctxTrade?: string
  normTrade?: string
  bizType?: string
  ctxRegion?: string
  normRegion?: string
  locState?: string
}): MetrixProfileSnapshot {
  return {
    businessContext: { trade: over.ctxTrade ?? '', region: over.ctxRegion ?? '' },
    normalizedAnswers: {
      trade: over.normTrade ?? '',
      region: over.normRegion ?? '',
      rawAnswers: {
        business_type: over.bizType,
        location: over.locState ? { state: over.locState } : undefined,
      },
    },
  } as unknown as MetrixProfileSnapshot
}

test('cp2: resolveTrade never defaults — empty/unknown → null (no Electrical injection)', () => {
  assert.equal(resolveTrade('').id, null)
  assert.equal(resolveTrade(null).id, null)
  assert.equal(resolveTrade(undefined).id, null)
  assert.equal(resolveTrade('   ').id, null)
  assert.equal(resolveTrade('something-not-a-trade').id, null)
  assert.equal(resolveTrade('something-not-a-trade').supportStatus, 'unsupported')
})

test('cp2: readTradeSource returns null when no trade signal exists (honest incomplete)', () => {
  assert.equal(readTradeSource(snap({})), null)
  assert.equal(resolveTrade(readTradeSource(snap({}))).id, null) // not Electrical
})

test('cp2: trade source precedence — businessContext > normalizedAnswers > business_type', () => {
  assert.equal(readTradeSource(snap({ ctxTrade: 'plumbing', normTrade: 'hvac', bizType: 'electrical' })), 'plumbing')
  assert.equal(readTradeSource(snap({ normTrade: 'hvac', bizType: 'electrical' })), 'hvac')
  assert.equal(readTradeSource(snap({ bizType: 'electrical' })), 'electrical')
})

test('cp2: a later explicit trade answer becomes canonical and overrides legacy business_type', () => {
  // Legacy business_type says electrical, but the explicit trade answer is plumbing → plumbing wins.
  const s = snap({ ctxTrade: 'plumbing', bizType: 'electrical' })
  assert.equal(resolveTrade(readTradeSource(s)).id, 'plumbing')
})

test('cp2: state source precedence — region > normalized region > location.state', () => {
  assert.equal(readStateSource(snap({ ctxRegion: 'FL', normRegion: 'CO', locState: 'TX' })), 'FL')
  assert.equal(readStateSource(snap({ normRegion: 'CO', locState: 'TX' })), 'CO')
  assert.equal(readStateSource(snap({ locState: 'TX' })), 'TX')
  assert.equal(readStateSource(snap({})), null)
})

test('cp2: all ten trades are first-class (resolve + registry entry)', () => {
  assert.equal(CANONICAL_TRADE_IDS.length, 10)
  for (const id of CANONICAL_TRADE_IDS) {
    const r = resolveTrade(id)
    assert.equal(r.id, id, id)
    assert.equal(r.supportStatus, 'supported', id)
    assert.ok(TRADE_REGISTRY[id]?.displayName, `${id} has a display name`)
  }
  // Every mandated launch trade is present.
  for (const id of ['hvac', 'electrical', 'plumbing', 'handyman', 'landscaping', 'painting', 'roofing', 'solar', 'construction', 'cleaning']) {
    assert.ok(CANONICAL_TRADE_IDS.includes(id as never), id)
  }
})

test('cp2: licensing and trade intelligence read the SINGLE canonical source (no duplicate reader)', () => {
  const lic = read('src/lib/metrix/licensingIntelligence.ts')
  const tr = read('src/lib/metrix/tradeIntelligence.ts')
  assert.ok(/from '\.\/profileSources'/.test(lic), 'licensing imports the shared reader')
  assert.ok(/from '\.\/profileSources'/.test(tr), 'trade intelligence imports the shared reader')
  assert.ok(!/function readTradeSource/.test(lic), 'no local trade reader in licensing')
  assert.ok(!/function readTradeSource/.test(tr), 'no local trade reader in trade intelligence')
})
