import { html } from './html.js';
import { formatPrice } from './offer.js';

// Every claim that depends on an unconfirmed owner decision goes through here.
// Production: approved text only when the gate is true, otherwise the safe fallback.
// Staging: shows the owner's intended copy with a visible STAGING marker so reviewers see both.
export function claim(cfg, approved, intended, fallback, note) {
  if (approved) return html`${intended}`;
  if (!cfg.isStaging) return fallback ? html`${fallback}` : html``;
  return html`${intended}<span class="staging-flag" title="${note || 'Requires owner approval before production'}">STAGING · ${note || 'needs approval'}</span>`;
}

export const tokenOr = (cfg, value, label) =>
  value ? html`${value}` : cfg.isStaging ? html`<span class="token">{{${label}}}</span>` : html``;

export function deliveryLine(cfg) {
  return claim(cfg, cfg.instantAccessConfirmed,
    'Instant access: your library unlocks the moment your payment is confirmed.',
    'Library access is delivered by email after your payment is confirmed.',
    'requires working delivery system');
}

export function preparationParagraph(cfg) {
  // QA #11: wording switches automatically between planned and approved policy states.
  if (cfg.preparationPolicyApproved) {
    return 'For designated future RSD-operated programs, completion of the published Foundations Path will be a prerequisite to attendance. The relevant material is included in this package.';
  }
  return 'This archive is intended to support preparation for future RSD live programs. Requirements will be published with each program.';
}

export function priceLine(cfg) {
  return formatPrice(cfg.priceCents, cfg.currency);
}

// "20+ years" only with a first-party source for an earlier start year; otherwise "nearly 20" (earliest sourced: 2007).
export function yearsPhrase(cfg, { cap = false } = {}) {
  const s = cfg.archiveSinceYear && 2026 - cfg.archiveSinceYear >= 20 ? `${2026 - cfg.archiveSinceYear >= 25 ? '25' : '20'}+ years` : 'nearly 20 years';
  return cap ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export const supportEmailLink = (cfg) => cfg.supportEmail
  ? html`<a href="mailto:${cfg.supportEmail}">${cfg.supportEmail}</a>` : html``;

export const supportPhoneLink = (cfg) => cfg.supportPhone
  ? html`<a href="tel:+1${cfg.supportPhone.replace(/\D/g, '')}">${cfg.supportPhone}</a>` : html``;

// Main package CTA: owner's Stripe Payment Link when configured, else the internal review/checkout page.
export const vaultHref = (cfg) => cfg.vaultCheckoutUrl || '/checkout';
export function vaultCta(cfg, cls = 'btn btn-navy btn-lg') {
  const ext = Boolean(cfg.vaultCheckoutUrl);
  return html`<a class="${cls} vault-cta" href="${vaultHref(cfg)}"${ext ? html` rel="noopener"` : ''}>${cfg.vaultCtaLabel || 'Get the launch package'}</a>`;
}
