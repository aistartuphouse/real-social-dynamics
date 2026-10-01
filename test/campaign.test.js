import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/lib/config.js';
import { Store } from '../src/lib/store.js';
import { seedSynthetic, SYNTHETIC_CONTACTS } from '../src/lib/synthetic.js';
import { eligibility, assertDispatchAllowed } from '../src/lib/campaign.js';
import { EMAILS } from '../src/lib/email.js';

const s = Store.memory(); seedSynthetic(s);
const c = (email) => SYNTHETIC_CONTACTS.find((x) => x.email === email);
const day1 = EMAILS.find((e) => e.id === 'day01-reintroduction');
const finalHours = EMAILS.find((e) => e.id === 'final-hours-optional');
const dormant = EMAILS.find((e) => e.id === 'dormant-reintroduction');

test('unresolved support cases are suppressed from the sales sequence', () => {
  const r = eligibility(c('support.case@example.test'), s, { template: day1 });
  assert.equal(r.eligible, false);
  assert.ok(r.reasons.some((x) => /support/.test(x)));
  assert.equal(eligibility(c('chargeback@example.test'), s, { template: day1 }).eligible, false);
});

test('unsubscribe and unknown permission block every template', () => {
  for (const t of EMAILS.filter((e) => e.kind === 'marketing')) {
    assert.equal(eligibility(c('unsubscribed@example.test'), s, { template: t }).eligible, false);
    assert.equal(eligibility(c('unknown.permission@example.test'), s, { template: t }).eligible, false);
  }
});

test('buyers exit the sales sequence', () => {
  const s2 = Store.memory(); seedSynthetic(s2);
  s2.data.orders.push({ email: 'academy@example.test', status: 'paid' });
  assert.equal(eligibility(c('academy@example.test'), s2, { template: day1 }).eligible, false);
});

test('dormant contacts get only the limited re-introduction; final-hours only to engaged', () => {
  assert.equal(eligibility(c('dormant@example.test'), s, { template: day1 }).eligible, false);
  assert.equal(eligibility(c('dormant@example.test'), s, { template: dormant }).eligible, true);
  assert.equal(eligibility(c('academy@example.test'), s, { template: finalHours }).eligible, false);
  assert.equal(eligibility(c('tm.owner@example.test'), s, { template: finalHours }).eligible, true);
});

test('dispatch is disabled by default and fails closed', () => {
  assert.throws(() => assertDispatchAllowed(loadConfig({ mode: 'production' })), { code: 'DISPATCH_DISABLED' });
});
