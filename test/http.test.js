import test from 'node:test';
import assert from 'node:assert/strict';
import { startApp } from './helpers.js';
import { sign, signWebhook } from '../src/lib/crypto.js';

test('production fails closed: no checkout, no programs, noindex', async () => {
  const t = await startApp({ mode: 'production' });
  const r = await t.req('/checkout');
  assert.equal(r.status, 503);
  assert.equal((await t.req('/admin/readiness')).status, 404);
  assert.equal((await t.req('/dev/outbox')).status, 404);
  assert.equal((await t.req('/test-pay/x')).status, 404);
  assert.match((await t.req('/')).headers.get('x-robots-tag'), /noindex/);
  await t.close();
});

test('staging end-to-end: checkout -> signed webhook -> entitlements -> library', async () => {
  const t = await startApp();
  const csrf = await t.csrf('/checkout');
  const r = await t.req('/checkout', { method: 'POST', form: { csrf, email: 'buyer@example.test', firstName: 'Sam', agree: 'yes' } });
  assert.equal(r.status, 303);
  const orderId = r.headers.get('location').split('/').pop();
  assert.equal(t.store.data.entitlements.length, 0, 'no grant before payment event');
  const csrf2 = await t.csrf(`/test-pay/${orderId}`);
  const paid = await t.req(`/test-pay/${orderId}`, { method: 'POST', form: { csrf: csrf2, outcome: 'duplicate' } });
  assert.equal(paid.status, 303);
  const ents = t.store.data.entitlements.filter((e) => e.orderId === orderId);
  assert.equal(ents.filter((e) => e.kind === 'bonus:success-call').length, 1);
  assert.equal(ents.filter((e) => e.kind === 'bonus:briefing-invite').length, 1);
  assert.ok(t.store.data.outbox.some((m) => m.to === 'buyer@example.test'));
  await t.close();
});

test('webhook rejects bad signatures; order page needs a signed token', async () => {
  const t = await startApp();
  const body = JSON.stringify({ id: 'evt_x', type: 'payment.succeeded', orderId: 'ord_x', amountCents: 99700, currency: 'USD' });
  const bad = await t.req('/webhooks/payment', { method: 'POST', body, headers: { 'x-rsd-signature': signWebhook(body, 'wrong-key') } });
  assert.equal(bad.status, 400);
  assert.equal((await t.req('/order/ord_x')).status, 404);
  await t.close();
});

test('staging refuses real-looking email addresses', async () => {
  const t = await startApp();
  const csrf = await t.csrf('/checkout');
  const r = await t.req('/checkout', { method: 'POST', form: { csrf, email: 'someone@gmail.com', agree: 'yes' } });
  assert.equal(r.status, 400);
  assert.match(r.text, /synthetic addresses/);
  await t.close();
});

test('existing-access check responds identically for known and unknown emails', async () => {
  const t = await startApp();
  const a = await t.req('/access', { method: 'POST', form: { csrf: await t.csrf('/access'), email: 'tm.owner@example.test' } });
  const b = await t.req('/access', { method: 'POST', form: { csrf: await t.csrf('/access'), email: 'nobody@example.test' } });
  assert.equal(a.status, b.status);
  assert.equal(a.headers.get('location'), b.headers.get('location'));
  await t.close();
});

test('bonus pages require auth and a package entitlement', async () => {
  const t = await startApp();
  assert.equal((await t.req('/success-call')).headers.get('location'), '/access');
  await t.req('/access', { method: 'POST', form: { csrf: await t.csrf('/access'), email: 'tm.owner@example.test' } });
  const link = t.store.data.outbox.at(-1).text.match(/\/auth\?t=\S+/)[0];
  assert.equal((await t.req(link)).status, 303);
  const lib = await t.req('/my-library');
  assert.equal(lib.status, 200);
  assert.match(lib.text, /Transformation Mastery/);
  assert.equal((await t.req('/success-call')).status, 403);
  await t.close();
});

test('unsubscribe works without login and overrides automations', async () => {
  const t = await startApp();
  const tok = sign({ purpose: 'unsubscribe', email: 'academy@example.test' }, t.app.keys.link, 86400 * 30);
  assert.equal((await t.req(`/unsubscribe?t=${encodeURIComponent(tok)}`)).status, 200);
  const r = await t.req('/unsubscribe', { method: 'POST', form: { t: tok } });
  assert.equal(r.status, 200);
  assert.ok(t.store.isSuppressed('academy@example.test'));
  await t.close();
});

test('support case suppresses the address from sales', async () => {
  const t = await startApp();
  await t.req('/support', { method: 'POST', form: { csrf: await t.csrf('/support'), email: 'highvibe@example.test', topic: 'access', message: 'cannot log in' } });
  assert.ok(t.store.hasOpenSupportCase('highvibe@example.test'));
  await t.close();
});

test('CSRF token is required on forms', async () => {
  const t = await startApp();
  const r = await t.req('/support', { method: 'POST', form: { email: 'a@example.test' } });
  assert.equal(r.status, 403);
  await t.close();
});

test('production refuses to start without secrets', async () => {
  const { createApp } = await import('../src/server.js');
  const { loadConfig } = await import('../src/lib/config.js');
  const { Store } = await import('../src/lib/store.js');
  const saved = process.env.RSD_SESSION_SECRET; delete process.env.RSD_SESSION_SECRET;
  assert.throws(() => createApp({ cfg: loadConfig({ mode: 'production' }), store: Store.memory() }), /Missing required secret/);
  if (saved) process.env.RSD_SESSION_SECRET = saved;
});

test('individual program checkout charges the program price and grants no bonuses', async () => {
  const t = await startApp();
  const csrf = await t.csrf('/checkout?program=boss');
  const r = await t.req('/checkout', { method: 'POST', form: { csrf, program: 'boss', email: 'single@example.test', agree: 'yes' } });
  assert.equal(r.status, 303);
  const orderId = r.headers.get('location').split('/').pop();
  const order = t.store.data.orders.find((o) => o.id === orderId);
  assert.equal(order.amountCents, 59700);
  await t.req(`/test-pay/${orderId}`, { method: 'POST', form: { csrf: await t.csrf(`/test-pay/${orderId}`), outcome: 'succeeded' } });
  const kinds = t.store.data.entitlements.filter((e) => e.orderId === orderId).map((e) => e.kind);
  assert.deepEqual(kinds, ['program:boss']);
  assert.equal((await t.req('/checkout?program=founders-lab')).status, 404);
  await t.close();
});

test('public site: no staging banner or tools, checkout goes to Stripe, indexable', async () => {
  const t = await startApp({ overrides: { publicSite: true } });
  const home = await t.req('/');
  assert.doesNotMatch(home.text, /STAGING PREVIEW/);
  assert.doesNotMatch(home.text, /noindex/);
  assert.equal(home.headers.get('x-robots-tag'), null);
  assert.equal((await t.req('/admin/readiness')).status, 404);
  assert.equal((await t.req('/dev/outbox')).status, 404);
  const co = await t.req('/checkout');
  assert.equal(co.status, 303);
  assert.match(co.headers.get('location'), /^https:\/\/buy\.stripe\.com\//);
  assert.equal((await t.req('/checkout?program=boss')).status, 404);
  assert.doesNotMatch((await t.req('/programs/boss')).text, /Buy BOSS only/);
  assert.match((await t.req('/support')).text, /310-202-9002/);
  await t.close();
});

test('public site: single-program buy buttons go to that program\'s own Stripe link', async () => {
  const t = await startApp({ overrides: { publicSite: true } });
  const page = (await t.req('/programs/pimp')).text;
  assert.match(page, /href="https:\/\/buy\.stripe\.com\/28EbJ2f1cb2Bbz91Jv1oI15"[^>]*>Buy PIMP only/);
  const r = await t.req('/checkout?program=pimp');
  assert.equal(r.status, 303);
  assert.equal(r.headers.get('location'), 'https://buy.stripe.com/28EbJ2f1cb2Bbz91Jv1oI15');
  assert.match((await t.req('/programs/get-your-ten')).text, /1oI1e"[^>]*>Buy Get Your Ten only/);
  assert.doesNotMatch((await t.req('/programs/boss')).text, /Buy BOSS only/);
  await t.close();
});
