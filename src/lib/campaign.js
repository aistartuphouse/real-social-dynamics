import { sendGates, allPass } from './gates.js';

// Eligibility for the sales sequence (brief §8.2, §13). Suppression overrides every automation (QA #16).
// Unknown permission means no send.
export function eligibility(contact, store, { now = new Date(), template } = {}) {
  const reasons = [];
  if (store.isSuppressed(contact.email)) reasons.push('suppressed (unsubscribe/bounce/complaint)');
  if (contact.permission !== 'verified') reasons.push(`marketing permission ${contact.permission || 'unknown'}`);
  if (contact.segment === 'G' || store.hasOpenSupportCase(contact.email)) reasons.push('unresolved support/refund/chargeback case: service-first queue');
  if (contact.segment === 'H' || store.data.orders.some((o) => o.email === contact.email && o.status === 'paid')) reasons.push('purchased: moved to fulfillment');
  if (template) {
    if (!template.segments.includes(contact.segment)) reasons.push(`template not for segment ${contact.segment}`);
    if (template.engagedOnly && !contact.engaged) reasons.push('final-hours note is for engaged non-buyers only');
    if (contact.segment === 'I' && template.id !== 'dormant-reintroduction') reasons.push('dormant contact: limited re-introduction route only');
  }
  if ((contact.sendsThisCampaign || 0) >= (contact.frequencyCap ?? 8)) reasons.push('frequency cap reached');
  return { eligible: reasons.length === 0, reasons };
}

export function assertDispatchAllowed(cfg) {
  const gates = sendGates(cfg);
  if (!allPass(gates) || process.env.RSD_ALLOW_SEND !== 'yes-i-am-authorized') {
    const failing = gates.filter((g) => !g.ok).map((g) => g.text);
    throw Object.assign(new Error(`Dispatch disabled. Failing send gates: ${failing.join('; ') || 'RSD_ALLOW_SEND not set'}`), { code: 'DISPATCH_DISABLED' });
  }
  // No provider adapter is implemented on purpose; wiring one is a separately authorized task.
  throw Object.assign(new Error('No email provider adapter is installed.'), { code: 'NO_PROVIDER' });
}
