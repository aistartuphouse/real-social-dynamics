import { html, raw } from '../lib/html.js';
import { claim, tokenOr, deliveryLine, priceLine, vaultCta } from '../lib/claims.js';
import { formatPrice } from '../lib/offer.js';
import { programLogo } from './logos.js';

export const label = (kind) => {
  if (kind === 'planned') return html``; // owner direction (2026-10-01): no "Planned · not yet scheduled" badges; copy still says "planned" in words
  const map = { live: ['Live events · open now', 'lbl-policy'], history: ['Confirmed history', 'lbl-history'], policy: ['New RSD policy · proposed', 'lbl-policy'], planned: ['Planned · not yet scheduled', 'lbl-planned'] };
  const [t, c] = map[kind];
  return html`<span class="lbl ${c}">${t}</span>`;
};

export function deadline(cfg, state, { tone = 'light' } = {}) {
  if (state.phase === 'not-configured') {
    return html`<div class="deadline ${tone}"><span class="deadline-label">Offer window</span><span>Launch dates to be announced.</span></div>`;
  }
  const label = state.phase === 'upcoming' ? 'Opens' : state.phase === 'closed' ? 'Ended' : 'Offer ends';
  const when = state.phase === 'upcoming' ? state.startsLocal : state.endsLocal;
  return html`<div class="deadline ${tone}" role="group" aria-label="Offer deadline">
    <span class="deadline-label">${label}</span>
    <time datetime="${(state.phase === 'upcoming' ? state.startsAt : state.endsAt).toISOString()}">${when}</time>
    ${state.phase === 'open' ? html`<span class="countdown" data-ends="${state.endsAt.toISOString()}" aria-live="off"></span>` : ''}
    ${state.preview ? html`<span class="staging-flag">STAGING · preview window, real dates not set</span>` : ''}
  </div>`;
}

export function cover(p, { size = '' } = {}) {
  return html`<div class="cover cover-${p.collection} ${size}" role="img" aria-label="${p.title} by ${p.instructor}, RSD Legacy Archive logo">
    <span class="cover-brand">RSD ARCHIVE</span>
    ${programLogo(p)}
    <span class="cover-by">${p.instructor}</span>
  </div>`;
}

export function programCard(cfg, p) {
  return html`<article class="pcard" data-collection="${p.collection}" data-instructor="${p.instructorKey}" data-search="${[p.title, p.instructor, ...p.verifiedThemes].join(' ').toLowerCase()}">
    ${cover(p, { size: 'cover-sm' })}
    <div class="pcard-body">
      <p class="pcard-meta">${p.instructor}${p.lessonCount ? html` · ${p.lessonCount} lessons` : ''}</p>
      <h3><a href="/programs/${p.slug}">${p.title}</a></h3>
      <p class="pcard-head">${p.cardHeadline}</p>
      <p>${p.shortCopy}</p>
      ${p.individualPriceCents && cfg.individualSalesEnabled ? html`<p class="pcard-price">$${(p.individualPriceCents / 100).toFixed(0)} on its own · included in the $${(cfg.priceCents / 100).toFixed(0)} package</p>` : ''}
      <a class="textlink" href="/programs/${p.slug}">${p.cta} →</a>
      ${cfg.isStaging && !p.fulfillmentReady ? html`<span class="staging-flag">STAGING · edition &amp; files unverified</span>` : ''}
    </div>
  </article>`;
}

export function packageCard(cfg, state, { id = 'package-card' } = {}) {
  const open = state.phase === 'open';
  return html`<div class="package-card" id="${id}">
    <p class="eyebrow">Launch package</p>
    <h3 class="package-title">The RSD Legacy Archive: The Prequel Collection</h3>
    <ul class="stack">
      <li><span class="tick" aria-hidden="true">✓</span><div><strong>The RSD Legacy Archive</strong>: every program and edition listed in this release, organized in one customer library${cfg.relaunchAssignmentsReady || cfg.isStaging ? html`, <strong>now with new assignments and goal blocks</strong> not included in the original releases` : ''}.</div></li>
      <li><span class="tick" aria-hidden="true">✓</span><div><strong>Bonus 1: One live RSD Success Coaching Call</strong>${(cfg.bonusValuesSubstantiated || cfg.isStaging) && cfg.bonusValues?.successCallCents ? html` <span class="bonus-value">(${formatPrice(cfg.bonusValues.successCallCents)} value, yours free)</span>` : ''} with a current RSD Success Coach. ${claim(cfg, cfg.callTermsApproved, `${cfg.callDurationMinutes} minutes, one-to-one, by video, booked within ${cfg.bookingWindowDays} days of purchase.`, '', 'call format proposed')}</div></li>
      <li><span class="tick" aria-hidden="true">✓</span><div><strong>Bonus 2: An exclusive invitation to the private RSD Nation relaunch briefing</strong>${(cfg.bonusValuesSubstantiated || cfg.isStaging) && cfg.bonusValues?.briefingInviteCents ? html` <span class="bonus-value">(${formatPrice(cfg.bonusValues.briefingInviteCents)} value, yours free)</span>` : ''}, reserved for package holders. ${claim(cfg, cfg.briefingTermsApproved, cfg.briefingDate ? `Scheduled ${cfg.briefingDate}.` : 'Date announced to package holders.', '', 'date & hosts not set')}</div></li>
    </ul>
    <div class="price-row">
      <span class="price">${priceLine(cfg)}</span><span class="price-sub">one-time${cfg.taxDisclosure ? html`, ${cfg.taxDisclosure}` : html`, before applicable taxes`}</span>
      ${cfg.isStaging && !cfg.priceApproved ? html`<span class="staging-flag">STAGING · price awaiting owner approval</span>` : ''}
    </div>
    <p class="delivery">${deliveryLine(cfg)}</p>
    <dl class="terms-mini">
      <div><dt>Access</dt><dd>${tokenOr(cfg, cfg.archiveAccessDuration, 'archiveAccessDuration')}</dd></div>
      <div><dt>Refunds</dt><dd>${cfg.refundPolicyVersion ? html`<a href="/refunds">See refund terms</a>` : tokenOr(cfg, null, 'refundPolicy')}</dd></div>
      <div><dt>Not included</dt><dd>Bootcamp tuition, global-tour tickets, travel, accommodation, future memberships.</dd></div>
    </dl>
    ${open ? vaultCta(cfg, 'btn btn-navy btn-lg btn-block')
      : html`<p class="closed-note">${state.phase === 'upcoming' ? 'The launch package opens soon.' : state.phase === 'closed' ? 'The launch package has ended.' : 'The launch package is not yet open.'}</p>`}
    <p class="fine">The call and private-briefing invitation are package-only launch bonuses. Individual purchases do not include them.</p>
    ${countdownClock(state, { tone: 'light', size: 'clock-sm' })}
    ${state.phase === 'open' ? '' : deadline(cfg, state)}
  </div>`;
}

export function faq(items) {
  return html`<div class="faq">${items.map(([q, a]) => html`<details><summary><span>${q}</span></summary><div class="faq-a">${a}</div></details>`)}</div>`;
}

export const money = formatPrice;
export { raw };

// Big countdown clock. Server renders the initial values (works without JS); site.js ticks every second.
// One shared deadline for every visitor, never per-visitor, never reset.
export function countdownClock(state, { tone = 'dark', size = '' } = {}) {
  if (state.phase !== 'open') return '';
  const ms = state.msRemaining;
  const parts = [['days', Math.floor(ms / 86400000)], ['hours', Math.floor(ms / 3600000) % 24], ['minutes', Math.floor(ms / 60000) % 60], ['seconds', Math.floor(ms / 1000) % 60]];
  return html`<div class="clock clock-${tone} ${size}" data-clock="${state.endsAt.toISOString()}" role="timer" aria-label="Time left until the launch offer ends at ${state.endsLocal}">
    <p class="clock-label">Launch offer ends in</p>
    <div class="clock-units">${parts.map(([u, v]) => html`<div class="clock-unit"><span class="clock-num" data-unit="${u}">${String(v).padStart(2, '0')}</span><span class="clock-u">${u}</span></div>`)}</div>
  </div>`;
}
