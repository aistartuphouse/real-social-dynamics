import { html } from '../lib/html.js';
import { claim, tokenOr, priceLine, deliveryLine, supportPhoneLink } from '../lib/claims.js';
import { deadline } from './components.js';
import { loadCatalog } from '../lib/config.js';

const synthHint = (cfg) => cfg.isStaging ? html`<p class="hint">Staging accepts only synthetic addresses ending in .test or @example.com. Try <code>tm.owner@example.test</code>.</p>` : '';

export function accessPage(cfg, { csrf, sent = false, error = '' } = {}) {
  return html`<section class="band band-white page-head"><div class="wrap narrow">
    <p class="eyebrow">Existing customers</p>
    <h1 class="h-xxl">Check what you already own before you buy anything.</h1>
    <p class="lede">Enter your purchase email. If we find a matching account, we'll send a secure sign-in link so you can compare your existing access with this release. We never show purchase history on this page.</p>
    ${sent ? html`<div class="notice" role="status">If that address matches a customer record, a sign-in link is on its way. ${cfg.isStaging ? html`In staging, open the <a href="/dev/outbox">dev outbox</a>.` : ''}</div>` : ''}
    ${error ? html`<div class="notice notice-error" role="alert">${error}</div>` : ''}
    <form method="post" action="/access" class="form">
      <input type="hidden" name="csrf" value="${csrf}">
      <label for="a-email">Purchase email</label>
      <input id="a-email" name="email" type="email" required autocomplete="email">
      ${synthHint(cfg)}
      <button class="btn btn-navy" type="submit">Send my secure link</button>
    </form>
    <p>Can't get into a past purchase? <a href="/support">Open a support case</a>${cfg.supportPhone ? html` or call RSD Support at ${supportPhoneLink(cfg)}` : ''}. No new order is required.</p>
  </div></section>`;
}

export function libraryPage(cfg, user, ents, programs) {
  const owned = new Set(ents.filter((e) => e.kind.startsWith('program:')).map((e) => e.kind.slice(8)));
  const prior = user.priorEntitlements || [];
  const titleOf = new Map(loadCatalog().programs.map((p) => [p.id, p.title]));
  const hasCall = ents.some((e) => e.kind === 'bonus:success-call');
  const hasInvite = ents.some((e) => e.kind === 'bonus:briefing-invite');
  const adds = programs.filter((p) => !owned.has(p.id) && !prior.includes(p.id));
  return html`<section class="band band-white page-head"><div class="wrap">
    <p class="eyebrow">My library</p>
    <h1 class="h-xl">Welcome back${user.firstName ? `, ${user.firstName}` : ''}.</h1>
    <div class="two-col">
      <div>
        <h2 class="h-sm">Programs you already owned before this release</h2>
        ${prior.length ? html`<ul>${prior.map((id) => html`<li>${titleOf.get(id) || id}</li>`)}</ul>` : html`<p>None on record.</p>`}
        ${(user.priorOtherTitles || []).length ? html`<h2 class="h-sm">Other titles on record</h2><ul>${user.priorOtherTitles.map((t) => html`<li>${t}</li>`)}</ul>` : ''}
        <h2 class="h-sm">From your launch package</h2>
        ${owned.size ? html`<ul>${[...owned].map((id) => html`<li>${titleOf.get(id) || id} <span class="small">(${cfg.isStaging ? 'test-mode order; playback not yet connected' : 'open'})</span></li>`)}</ul>` : html`<p>No launch package on this account.</p>`}
      </div>
      <div>
        <h2 class="h-sm">Launch bonuses</h2>
        <ul>
          <li>Success Coaching Call: ${hasCall ? html`<a href="/success-call">Book your call</a>` : 'Not included (package-only bonus)'}</li>
          <li>RSD Nation relaunch briefing: ${hasInvite ? html`<a href="/rsd-nation-invitation">View your invitation</a>` : 'Not included (package-only bonus)'}</li>
        </ul>
        ${!owned.size ? html`<h2 class="h-sm">What this release would add for you</h2><p>${adds.length} programs you don't already own${prior.length ? `, plus both package-only bonuses. You would not be charged separately for the ${prior.length} you already have, but the package price is the same for everyone unless an upgrade-credit policy is published.` : ', plus both package-only bonuses.'}</p><a class="btn btn-navy" href="/#package">See the package</a>` : ''}
        <form method="post" action="/logout"><button class="btn btn-outline btn-sm" type="submit">Sign out</button></form>
      </div>
    </div>
  </div></section>`;
}

export function successCallPage(cfg, ent) {
  return html`<section class="band band-white page-head"><div class="wrap narrow">
    <p class="eyebrow">Your package bonus</p>
    <h1 class="h-xl">Book your live RSD Success Coaching Call.</h1>
    <p class="lede">One call with a current RSD Success Coach to identify the most relevant material and outline your first study-and-practice step. Educational coaching, not therapy. No further purchase required.</p>
    <dl class="terms">
      <div><dt>Length</dt><dd>${claim(cfg, cfg.callTermsApproved, `${cfg.callDurationMinutes} minutes, one-to-one video`, '', 'proposed')}</dd></div>
      <div><dt>Book within</dt><dd>${claim(cfg, cfg.callTermsApproved, `${ent.bookingWindowDays} days of purchase`, '', 'proposed')}</dd></div>
      <div><dt>Rescheduling</dt><dd>${tokenOr(cfg, cfg.reschedulePolicy, 'reschedulePolicy')}</dd></div>
    </dl>
    ${cfg.schedulingProvider ? html`<a class="btn btn-navy" href="/success-call/book">Choose a time</a>` : html`<div class="notice">Booking opens once the coaching roster and scheduling provider are configured. ${cfg.isStaging ? html`<span class="staging-flag">STAGING · no scheduling provider</span>` : ''}</div>`}
  </div></section>`;
}

export function invitationPage(cfg) {
  return html`<section class="band band-black page-head"><div class="wrap narrow">
    <p class="eyebrow eyebrow-light">Private invitation · package holders only</p>
    <h1 class="h-xl">You're invited to the RSD Nation relaunch briefing.</h1>
    <dl class="terms terms-dark">
      <div><dt>When</dt><dd>${tokenOr(cfg, cfg.briefingDate, 'briefingDateAndTime')}</dd></div>
      <div><dt>Format</dt><dd>${cfg.briefingFormat}</dd></div>
      <div><dt>Hosts</dt><dd>${tokenOr(cfg, cfg.briefingHosts, 'confirmedHosts')}</dd></div>
    </dl>
    <p>This invitation is personal to your order. It is not a bootcamp reservation or global-tour ticket, and it doesn't change ordinary RSD Nation access.</p>
  </div></section>`;
}

export function checkoutPage(cfg, state, programs, { csrf, error = '' } = {}) {
  return html`<section class="band band-white page-head"><div class="wrap pkg-grid">
    <div>
      <p class="eyebrow">Review before you pay</p>
      <h1 class="h-xl">Here is exactly what you're buying.</h1>
      <h2 class="h-sm">Delivered with your order: ${programs.length} programs</h2>
      <ul class="inventory">${programs.map((p) => html`<li><strong>${p.title}</strong> · ${p.instructor}${p.editionId ? html` · Edition: ${p.editionId}` : ''}</li>`)}</ul>
      <h2 class="h-sm">Package-only bonuses</h2>
      <ul><li>One live RSD Success Coaching Call (${claim(cfg, cfg.callTermsApproved, `${cfg.callDurationMinutes} min, book within ${cfg.bookingWindowDays} days`, '', 'proposed')})</li>
      <li>Invitation to the private RSD Nation relaunch briefing (${tokenOr(cfg, cfg.briefingDate, 'briefingDateAndTime')})</li></ul>
      <h2 class="h-sm">Terms</h2>
      <dl class="terms">
        <div><dt>Delivery</dt><dd>${deliveryLine(cfg)}</dd></div>
        <div><dt>Access</dt><dd>${tokenOr(cfg, cfg.archiveAccessDuration, 'archiveAccessDuration')}</dd></div>
        <div><dt>Refunds</dt><dd>${tokenOr(cfg, cfg.refundPolicyVersion, 'refundPolicy')}</dd></div>
        <div><dt>Tax</dt><dd>${tokenOr(cfg, cfg.taxDisclosure, 'taxDisclosure')}</dd></div>
        ${cfg.supportPhone ? html`<div><dt>Questions</dt><dd>Call RSD Support: ${supportPhoneLink(cfg)}</dd></div>` : ''}
        <div><dt>Seller</dt><dd>${tokenOr(cfg, cfg.sellerLegalName, 'sellerLegalName')}</dd></div>
        <div><dt>Not included</dt><dd>Bootcamp tuition, global-tour tickets, travel, accommodation, future memberships, historical live bonuses.</dd></div>
      </dl>
    </div>
    <div class="package-card">
      <p class="price-row"><span class="price">${priceLine(cfg)}</span><span class="price-sub">one-time</span></p>
      ${cfg.isStaging ? html`<div class="notice"><strong>Test mode.</strong> No real payment is taken. Use a synthetic email.</div>` : ''}
      ${error ? html`<div class="notice notice-error" role="alert">${error}</div>` : ''}
      <form method="post" action="/checkout" class="form">
        <input type="hidden" name="csrf" value="${csrf}">
        <label for="c-name">First name</label><input id="c-name" name="firstName" autocomplete="given-name" maxlength="60">
        <label for="c-email">Email</label><input id="c-email" name="email" type="email" required autocomplete="email">
        ${synthHint(cfg)}
        <label class="check"><input type="checkbox" name="agree" value="yes" required> I have read the inventory and terms above.</label>
        <button class="btn btn-navy btn-lg btn-block" type="submit">Continue to ${cfg.isStaging ? 'test payment' : 'secure payment'}</button>
      </form>
      ${deadline(cfg, state)}
    </div>
  </div></section>`;
}

export function testPayPage(cfg, order, csrf) {
  return html`<section class="band band-white page-head"><div class="wrap narrow">
    <p class="eyebrow">Simulated payment provider · staging only</p>
    <h1 class="h-xl">Test checkout for order ${order.id}</h1>
    <p>Amount: ${(order.amountCents / 100).toFixed(2)} ${order.currency}. No card details are collected and no money moves. Pressing the button sends a signed test webhook to the server, which is the only thing that can grant access.</p>
    <form method="post" action="/test-pay/${order.id}"><input type="hidden" name="csrf" value="${csrf}">
      <button class="btn btn-navy" name="outcome" value="succeeded" type="submit">Simulate successful payment</button>
      <button class="btn btn-outline" name="outcome" value="duplicate" type="submit">Simulate duplicate webhook</button>
    </form>
  </div></section>`;
}

export function orderPage(cfg, order) {
  const paid = order.status === 'paid';
  return html`<section class="band band-white page-head"><div class="wrap narrow">
    <p class="eyebrow">Order ${order.id}</p>
    <h1 class="h-xl">${paid ? 'You\'re in. Your archive and both bonuses are on your account.' : order.status === 'refunded' ? 'This order was refunded.' : 'Waiting for payment confirmation.'}</h1>
    <p>${paid ? html`<a class="btn btn-navy" href="/my-library">Open my library</a>` : 'This page does not grant access by itself. Access is created only when the payment provider confirms the payment.'}</p>
    ${paid ? html`<p class="small">A confirmation was queued to the ${cfg.isStaging ? html`<a href="/dev/outbox">dev outbox</a>` : 'order email'}. Sign in with that address to see your library.</p>` : ''}
  </div></section>`;
}

export function unsubscribePage(cfg, { token, email, done }) {
  return html`<section class="band band-white page-head"><div class="wrap narrow">
    <h1 class="h-xl">${done ? 'You are unsubscribed.' : 'Unsubscribe from RSD launch emails'}</h1>
    ${done ? html`<p>${email} will receive no further marketing from this campaign. Order and access messages about purchases you've made still arrive. Your existing purchases are unaffected.</p>`
      : html`<p>Stop marketing emails to <strong>${email}</strong>. No login required.</p>
      <form method="post" action="/unsubscribe"><input type="hidden" name="t" value="${token}"><button class="btn btn-navy" type="submit">Unsubscribe</button></form>`}
  </div></section>`;
}

export const messagePage = (title, text) => html`<section class="band band-white page-head"><div class="wrap narrow"><h1 class="h-xl">${title}</h1><p>${text}</p><p><a href="/">Return to the homepage</a></p></div></section>`;

export function singleCheckoutPage(cfg, prog, { csrf, error = '' } = {}) {
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: cfg.currency, maximumFractionDigits: 0 }).format(prog.individualPriceCents / 100);
  return html`<section class="band band-white page-head"><div class="wrap pkg-grid">
    <div>
      <p class="eyebrow">Review before you pay · single program</p>
      <h1 class="h-xl">${prog.title}, on its own.</h1>
      <p class="lede">${prog.instructor}. ${prog.shortCopy}</p>
      <div class="notice"><strong>This purchase does not include the launch bonuses.</strong> The live Success Coaching Call and the RSD Nation briefing invitation come only with the full $997 launch package, which includes this program and every other program in the release. <a href="/checkout">Get the full package instead</a>.</div>
      <dl class="terms">
        <div><dt>Delivery</dt><dd>${deliveryLine(cfg)}</dd></div>
        <div><dt>Access</dt><dd>${tokenOr(cfg, cfg.archiveAccessDuration, 'archiveAccessDuration')}</dd></div>
        <div><dt>Refunds</dt><dd>${tokenOr(cfg, cfg.refundPolicyVersion, 'refundPolicy')}</dd></div>
        ${cfg.supportPhone ? html`<div><dt>Questions</dt><dd>Call RSD Support: ${supportPhoneLink(cfg)}</dd></div>` : ''}
      </dl>
    </div>
    <div class="package-card">
      <p class="price-row"><span class="price">${price}</span><span class="price-sub">one-time</span></p>
      ${cfg.isStaging ? html`<div class="notice"><strong>Test mode.</strong> No real payment is taken. Use a synthetic email.</div>` : ''}
      ${error ? html`<div class="notice notice-error" role="alert">${error}</div>` : ''}
      <form method="post" action="/checkout" class="form">
        <input type="hidden" name="csrf" value="${csrf}">
        <input type="hidden" name="program" value="${prog.slug}">
        <label for="c-name">First name</label><input id="c-name" name="firstName" autocomplete="given-name" maxlength="60">
        <label for="c-email">Email</label><input id="c-email" name="email" type="email" required autocomplete="email">
        ${synthHint(cfg)}
        <label class="check"><input type="checkbox" name="agree" value="yes" required> I understand this is one program without the launch bonuses.</label>
        <button class="btn btn-navy btn-lg btn-block" type="submit">Continue to ${cfg.isStaging ? 'test payment' : 'secure payment'}</button>
      </form>
    </div>
  </div></section>`;
}
