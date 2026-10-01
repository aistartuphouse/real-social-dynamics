import { randomId } from './crypto.js';
import { offerState } from './offer.js';
import { publicPrograms } from './catalog.js';

// Brief §10: entitlements only from a validated provider event; idempotent; bonuses only on the package SKU
// purchased inside the offer window at the offer price; manifest snapshotted at purchase.

export const programSku = (p) => `PROGRAM-${p.id}`;

export function createPendingOrder(store, cfg, { userId, email, sku, now = new Date() }) {
  const state = offerState(cfg, now);
  const isPackage = sku === cfg.packageSku;
  let manifest, amountCents, offerEndsAt;
  if (isPackage) {
    if (state.phase !== 'open') throw Object.assign(new Error('The launch offer is not open.'), { status: 409 });
    manifest = publicPrograms(cfg).map((p) => ({ id: p.id, title: p.title, editionId: p.editionId, instructor: p.instructor }));
    amountCents = cfg.priceCents;
    offerEndsAt = state.endsAt.toISOString();
  } else {
    // Individual program: real standalone sale at the owner-set price; never includes launch bonuses.
    const prog = publicPrograms(cfg).find((p) => programSku(p) === sku);
    if (!cfg.individualSalesEnabled || !prog || !prog.individualPriceCents) throw Object.assign(new Error('Individual-course checkout is not available for this program.'), { status: 409 });
    manifest = [{ id: prog.id, title: prog.title, editionId: prog.editionId, instructor: prog.instructor }];
    amountCents = prog.individualPriceCents;
    offerEndsAt = null;
  }
  const order = {
    id: randomId('ord'), userId, email, sku, status: 'pending',
    amountCents, currency: cfg.currency, createdAt: now.toISOString(),
    snapshot: {
      offerPolicyVersion: cfg.offerPolicyVersion, offerEndsAt, manifest,
      bonuses: isPackage ? { successCall: cfg.coachingBonusEnabled, briefingInvite: cfg.briefingBonusEnabled } : { successCall: false, briefingInvite: false },
      callDurationMinutes: cfg.callDurationMinutes, bookingWindowDays: cfg.bookingWindowDays,
      testMode: cfg.paymentProvider === 'simulated-test',
    },
  };
  store.data.orders.push(order);
  store.save();
  return order;
}

export function handlePaymentEvent(store, cfg, event) {
  if (store.data.processedEvents.includes(event.id)) return { duplicate: true };
  const order = store.data.orders.find((o) => o.id === event.orderId);
  if (!order) return { error: 'unknown-order' };

  if (event.type === 'payment.succeeded') {
    if (order.status === 'paid') { store.data.processedEvents.push(event.id); store.save(); return { duplicate: true, order }; }
    if (event.amountCents !== order.amountCents || event.currency !== order.currency) return { error: 'amount-mismatch' };
    order.status = 'paid'; order.paidAt = new Date(event.created * 1000).toISOString(); order.providerRef = event.providerRef;
    grant(store, cfg, order);
  } else if (event.type === 'payment.refunded') {
    order.status = 'refunded';
    // Revoke only what this order granted; unrelated prior entitlements are untouched (QA #15).
    for (const e of store.data.entitlements) if (e.orderId === order.id && e.status === 'active') { e.status = 'revoked'; e.revokedReason = 'refund'; }
  }
  store.data.processedEvents.push(event.id);
  store.track('checkout_completed', { orderId: order.id, type: event.type });
  store.save();
  return { ok: true, order };
}

function grant(store, cfg, order) {
  const has = (kind) => store.data.entitlements.some((e) => e.orderId === order.id && e.kind === kind);
  const add = (kind, extra = {}) => { if (!has(kind)) store.data.entitlements.push({ id: randomId('ent'), orderId: order.id, userId: order.userId, kind, status: 'active', grantedAt: new Date().toISOString(), source: 'launch-package', ...extra }); };

  for (const item of order.snapshot.manifest) add(`program:${item.id}`, { editionId: item.editionId });

  const paidInWindow = Boolean(order.snapshot.offerEndsAt) && new Date(order.createdAt) < new Date(order.snapshot.offerEndsAt);
  const isPackage = order.sku === cfg.packageSku;
  if (isPackage && paidInWindow) {
    if (order.snapshot.bonuses.successCall) add('bonus:success-call', { uses: 1, bookingWindowDays: order.snapshot.bookingWindowDays });
    if (order.snapshot.bonuses.briefingInvite) add('bonus:briefing-invite');
  }
  store.track('package_entitlement_created', { orderId: order.id });
}
