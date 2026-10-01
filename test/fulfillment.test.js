import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/lib/config.js';
import { Store } from '../src/lib/store.js';
import { seedSynthetic } from '../src/lib/synthetic.js';
import { createPendingOrder, handlePaymentEvent } from '../src/lib/fulfillment.js';

const cfg = loadConfig({ mode: 'staging' });
const now = new Date('2026-10-03T18:00:00Z');
const setup = () => { const s = Store.memory(); seedSynthetic(s); return s; };
const paid = (o, id = `evt_${o.id}`) => ({ id, type: 'payment.succeeded', orderId: o.id, amountCents: o.amountCents, currency: o.currency, created: 1790000000 });

test('pending order grants nothing until a verified payment event', () => {
  const s = setup();
  const o = createPendingOrder(s, cfg, { userId: 'usr_tm', email: 'tm.owner@example.test', sku: cfg.packageSku, now });
  assert.equal(s.entitlementsFor('usr_tm').length, 0);
  handlePaymentEvent(s, cfg, paid(o));
  const kinds = s.entitlementsFor('usr_tm').map((e) => e.kind);
  assert.ok(kinds.includes('bonus:success-call'));
  assert.ok(!kinds.includes('bonus:briefing-invite'), 'briefing bonus retired');
  assert.equal(kinds.filter((k) => k === 'bonus:success-call').length, 1);
  assert.ok(o.snapshot.manifest.length > 0, 'manifest snapshotted at purchase');
});

test('duplicate and replayed payment events are idempotent', () => {
  const s = setup();
  const o = createPendingOrder(s, cfg, { userId: 'usr_tm', email: 'tm.owner@example.test', sku: cfg.packageSku, now });
  handlePaymentEvent(s, cfg, paid(o));
  const n = s.data.entitlements.length;
  assert.equal(handlePaymentEvent(s, cfg, paid(o)).duplicate, true);
  handlePaymentEvent(s, cfg, paid(o, 'evt_other_id_same_order'));
  assert.equal(s.data.entitlements.length, n);
});

test('individual-program checkout grants only that program, never package bonuses', () => {
  const s = setup();
  // Individual program orders are real sales at the owner-set price, but never carry bonuses.
  const single = createPendingOrder(s, cfg, { userId: 'usr_tm', email: 'x@example.test', sku: 'PROGRAM-pimp', now });
  assert.equal(single.amountCents, 49700);
  handlePaymentEvent(s, cfg, paid(single));
  const kinds = s.data.entitlements.filter((e) => e.orderId === single.id).map((e) => e.kind);
  assert.deepEqual(kinds, ['program:pimp']);
  assert.throws(() => createPendingOrder(s, cfg, { userId: 'usr_tm', email: 'x@example.test', sku: 'PROGRAM-founders-lab', now }), /not available/);
  // Even a forged non-package order reaching the grant path gets no bonuses.
  const forged = { id: 'ord_forged', userId: 'usr_tm', email: 'x@example.test', sku: 'PROGRAM-PIMP', status: 'pending', amountCents: 19700, currency: 'USD', createdAt: now.toISOString(), snapshot: { manifest: [{ id: 'pimp' }], offerEndsAt: '2026-10-15T16:00:00Z', bonuses: { successCall: true, briefingInvite: true } } };
  s.data.orders.push(forged);
  handlePaymentEvent(s, cfg, paid(forged));
  assert.ok(!s.data.entitlements.some((e) => e.orderId === 'ord_forged' && e.kind.startsWith('bonus:')));
});

test('amount mismatch is rejected', () => {
  const s = setup();
  const o = createPendingOrder(s, cfg, { userId: 'usr_tm', email: 'tm.owner@example.test', sku: cfg.packageSku, now });
  assert.equal(handlePaymentEvent(s, cfg, { ...paid(o), amountCents: 100 }).error, 'amount-mismatch');
  assert.equal(s.entitlementsFor('usr_tm').length, 0);
});

test('refund revokes only this order, preserving unrelated prior entitlements', () => {
  const s = setup();
  s.data.entitlements.push({ id: 'ent_prior', userId: 'usr_tm', orderId: 'ord_2025', kind: 'program:transformation-mastery', status: 'active' });
  const o = createPendingOrder(s, cfg, { userId: 'usr_tm', email: 'tm.owner@example.test', sku: cfg.packageSku, now });
  handlePaymentEvent(s, cfg, paid(o));
  handlePaymentEvent(s, cfg, { id: 'evt_refund', type: 'payment.refunded', orderId: o.id });
  const active = s.entitlementsFor('usr_tm');
  assert.deepEqual(active.map((e) => e.id), ['ent_prior']);
});

test('orders cannot be created outside the offer window', () => {
  const s = setup();
  assert.throws(() => createPendingOrder(s, cfg, { userId: 'u', email: 'u@example.test', sku: cfg.packageSku, now: new Date('2027-01-01T00:00:00Z') }), /not open/);
});
