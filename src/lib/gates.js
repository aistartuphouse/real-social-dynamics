import { loadCatalog } from './config.js';
import { isFullyApproved } from './catalog.js';

// Launch gates (brief §2.3). Production checkout and email dispatch fail closed while any gate fails.
export function launchGates(cfg, catalog = loadCatalog()) {
  const candidates = catalog.programs.filter((p) => p.includedInLaunch);
  const unready = candidates.filter((p) => !isFullyApproved(p)).map((p) => p.title);
  const g = (id, ok, owner, text) => ({ id, ok: Boolean(ok), owner, text });
  return [
    g('price', cfg.priceApproved, 'Owner', 'Final package price approved'),
    g('individualPrices', !cfg.individualSalesEnabled || cfg.individualPricesApproved, 'Owner', 'Individual program prices approved (programs genuinely sold at these prices)'),
    g('window', cfg.launchStartsAtUTC && cfg.launchEndsAtUTC, 'Owner', 'Exact launch start/end timestamps set'),
    g('seller', cfg.sellerLegalName && cfg.sellerPostalAddress, 'Owner / counsel', 'Legal seller identity and postal address'),
    g('support', cfg.customerSupportContact, 'Operations', 'Monitored customer-support contact'),
    g('refunds', cfg.refundPolicyVersion, 'Owner / counsel', 'Refund and statutory-rights terms published'),
    g('access', cfg.archiveAccessDuration, 'Owner', 'Archive access duration defined'),
    g('tax', cfg.taxDisclosure, 'Finance', 'Tax treatment and disclosure'),
    g('inventory', unready.length === 0 && candidates.length > 0, 'Owner / content', `Every launch program fully approved and deliverable (${unready.length} not ready)`),
    g('delivery', cfg.instantAccessConfirmed, 'Engineering', 'Working delivery system (library hosting + playback)'),
    g('coaching', cfg.callTermsApproved && cfg.coachingCapacity && cfg.schedulingProvider && cfg.completionWindowDays && cfg.reschedulePolicy, 'Coaching lead', 'Coaching roster, capacity, booking and completion terms'),
    g('briefing', cfg.briefingTermsApproved && cfg.briefingDate && cfg.briefingHosts && cfg.briefingDeliveryDeadline, 'Owner', 'RSD Nation briefing date, hosts, format, delivery commitment'),
    g('merchant', cfg.paymentProvider && cfg.paymentProvider !== 'simulated-test', 'Engineering / finance', 'Real merchant integration (test mode first)'),
    g('publish', cfg.publishApproved, 'Owner', 'Explicit authorization to publish'),
  ];
}

export function sendGates(cfg) {
  const g = (id, ok, owner, text) => ({ id, ok: Boolean(ok), owner, text });
  return [
    g('sendApproved', cfg.sendApproved, 'Owner', 'Explicit authorization to send'),
    g('provider', cfg.emailProvider, 'Engineering', 'Email provider configured with SPF/DKIM/DMARC alignment verified by received headers'),
    g('sender', cfg.sellerLegalName && cfg.sellerPostalAddress, 'Owner / counsel', 'Sender legal name and valid postal address for footer'),
    g('window', cfg.launchStartsAtUTC && cfg.launchEndsAtUTC, 'Owner', 'Real deadline for {{launchEndLocal}}'),
  ];
}

export const allPass = (gates) => gates.every((x) => x.ok);
