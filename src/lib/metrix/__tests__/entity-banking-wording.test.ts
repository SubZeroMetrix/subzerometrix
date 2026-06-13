// ─────────────────────────────────────────────────────────────────────────────
// SZM-2D — entity + banking gate wording truthfulness regression tests.
// ─────────────────────────────────────────────────────────────────────────────

import test from 'node:test'
import assert from 'node:assert/strict'

import { EMPTY_INTAKE, type QuickIntake } from '../../intake'
import { evaluateMetrixProfile } from '../index'
import type { RawAnswers } from '../../scoring'

const NOW = '2026-01-01T00:00:00.000Z'
const intake = (o: Partial<QuickIntake>): QuickIntake => ({ ...EMPTY_INTAKE, ...o })
const lead = { firstName: 'X', email: 'x@example.com' }

// Pre-launch, no entity, non-regulated → entity gate triggered, nothing higher.
const NO_ENTITY: RawAnswers = {
  business_type: 'cleaning', stage: 'months_6_12',
  setup_steps: ['biz_name', 'ein', 'bank', 'insurance', 'website', 'gbp'], // NO entity_reg
  financial: 'over_25k', customer_plan: 'existing_base', blocker: 'confidence', lead,
}
const snapNoEntity = evaluateMetrixProfile(NO_ENTITY, intake({ stage: 'months_6_12', trade: 'cleaning' }), { now: NOW, profileId: 'mp_e' })
const entityGate = snapNoEntity.criticalGates.find(g => g.id === 'gate_entity')!
const bankingGate = (() => {
  const noBank: RawAnswers = { ...NO_ENTITY, setup_steps: ['biz_name', 'ein', 'insurance'] }
  const s = evaluateMetrixProfile(noBank, intake({ stage: 'months_6_12', trade: 'cleaning' }), { now: NOW, profileId: 'mp_b' })
  return s.criticalGates.find(g => g.id === 'gate_banking')!
})()

// 1 — Entity copy does not claim automatic liability separation.
test('SZM-2D: entity copy makes no automatic liability-separation claim', () => {
  assert.equal(entityGate.title, 'Business structure not confirmed')
  assert.doesNotMatch(entityGate.explanation, /separates? .*liability/i)
  assert.doesNotMatch(entityGate.explanation, /protect/i)
  assert.match(entityGate.explanation, /depend on your business and jurisdiction/i)
})

// 2 — Entity outcome does not universally prescribe an LLC.
test('SZM-2D: entity outcome does not universally prescribe an LLC', () => {
  assert.doesNotMatch(entityGate.requiredOutcome, /LLC/)
  assert.doesNotMatch(entityGate.requiredOutcome, /register a business entity/i)
  assert.match(entityGate.requiredOutcome, /appropriate business structure/i)
})

// 3 — Banking copy does not claim a bank account creates legal protection.
test('SZM-2D: banking copy makes no legal-protection claim', () => {
  assert.doesNotMatch(bankingGate.explanation, /protects your entity/i)
  assert.doesNotMatch(bankingGate.explanation, /protect/i)
  assert.match(bankingGate.explanation, /may help support proper business formalities/i)
})

// 4 — Entity priority ranking behavior is unchanged (entity still primary here).
test('SZM-2D: entity ranking unchanged (entity is primary when top gate)', () => {
  assert.equal(snapNoEntity.metrixPriority.domain, 'entity')
  assert.equal(entityGate.status, 'triggered')
  assert.equal(entityGate.blocksStageAdvance, true)
})

// 5 — Other gate behavior remains unchanged (titles + statuses intact).
test('SZM-2D: licensing/insurance/pricing/customer-path wording unchanged', () => {
  const a: RawAnswers = { business_type: 'electrical', stage: 'months_6_12', setup_steps: ['biz_name', 'entity_reg', 'ein', 'bank'], financial: 'not_sure', customer_plan: 'no_plan', blocker: 'pricing', lead }
  const s = evaluateMetrixProfile(a, intake({ stage: 'months_6_12', trade: 'electrical' }), { now: NOW, profileId: 'mp_o' })
  const byId = (id: string) => s.criticalGates.find(g => g.id === id)!
  assert.equal(byId('gate_licensing').title, 'Trade licensing not confirmed')
  assert.equal(byId('gate_insurance').title, 'Insurance not started')
  assert.equal(byId('gate_pricing').title, 'Pricing / margin not confirmed')
  assert.equal(byId('gate_customer_path').title, 'No reliable customer path')
  // licensing still the blocking primary for a regulated, operating, unlicensed trade
  assert.equal(s.metrixPriority.domain, 'licensing')
})

// 6 — Evaluation remains deterministic after the wording change.
test('SZM-2D: evaluation remains deterministic', () => {
  const i = intake({ stage: 'months_6_12', trade: 'cleaning' })
  const a = evaluateMetrixProfile(NO_ENTITY, i, { now: NOW, profileId: 'mp_d' })
  const b = evaluateMetrixProfile(NO_ENTITY, i, { now: NOW, profileId: 'mp_d' })
  assert.deepStrictEqual(a.criticalGates, b.criticalGates)
  assert.deepStrictEqual(a.metrixPriority, b.metrixPriority)
})
