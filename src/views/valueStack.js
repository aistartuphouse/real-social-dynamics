import { html } from '../lib/html.js';
import { formatPrice } from '../lib/offer.js';
import { loadHistoricalPrices } from '../lib/config.js';

// "Add it up" value stack. Primary column: the owner-set price at which each program is genuinely sold on its own
// (individual checkout exists, so the comparison is real). Where an archived original sales-page price was verified,
// it's shown underneath with its capture link. Bonus values come from owner config.
// Production shows standalone prices only when individualPricesApproved, bonus values only when bonusValuesSubstantiated.
export function stackNumbers(cfg, programs) {
  const showSeparate = cfg.individualSalesEnabled && (cfg.individualPricesApproved || cfg.isStaging);
  const priced = showSeparate ? programs.filter((p) => p.individualPriceCents) : [];
  const separateCents = priced.reduce((s, p) => s + p.individualPriceCents, 0);
  const showBonus = cfg.bonusValuesSubstantiated || cfg.isStaging;
  const callV = showBonus ? cfg.bonusValues?.successCallCents || 0 : 0;
  const briefV = showBonus ? cfg.bonusValues?.briefingInviteCents || 0 : 0;
  return { showSeparate, pricedCount: priced.length, separateCents, callV, briefV, bonusCents: callV + briefV, totalCents: separateCents + callV + briefV };
}

export function valueStack(cfg, programs) {
  const hist = new Map((loadHistoricalPrices().prices || []).filter((x) => x.status === 'verified').map((x) => [x.programId, x]));
  const n = stackNumbers(cfg, programs);
  const year = (ts) => ts ? ts.slice(0, 4) : '';

  return html`<div class="value-stack">
    <table>
      <caption class="sr-only">Everything in the launch package with the price of each item bought separately</caption>
      <thead><tr><th scope="col">What you get</th><th scope="col" class="num">Bought separately</th></tr></thead>
      <tbody>
        ${programs.map((p) => {
          const h = hist.get(p.id);
          return html`<tr>
          <th scope="row"><span class="vs-title">${p.title}</span><span class="vs-by">${p.instructor}</span></th>
          <td class="num">${n.showSeparate && p.individualPriceCents ? html`<span class="vs-price">${formatPrice(p.individualPriceCents)}</span>` : html`<span class="vs-nv">Included</span>`}
            ${h ? html`<a class="vs-src" href="${h.captureUrl}" rel="noopener nofollow" target="_blank">originally from ${formatPrice(h.priceCents)} (archived ${year(h.timestamp)})</a>` : ''}</td>
        </tr>`;
        })}
        <tr class="vs-bonus"><th scope="row"><span class="vs-title">Bonus 1: Live RSD Success Coaching Call</span><span class="vs-by">Current RSD Success Coach</span></th><td class="num">${n.callV ? html`<span class="vs-price">${formatPrice(n.callV)} value</span><span class="vs-src">included free with package</span>` : 'Included with package'}</td></tr>
        <tr class="vs-bonus"><th scope="row"><span class="vs-title">Bonus 2: Private RSD Nation relaunch-briefing invitation</span><span class="vs-by">Package holders only</span></th><td class="num">${n.briefV ? html`<span class="vs-price">${formatPrice(n.briefV)} value</span><span class="vs-src">included free with package</span>` : 'Included with package'}</td></tr>
      </tbody>
      <tfoot>
        ${n.pricedCount ? html`<tr><th scope="row">All ${n.pricedCount} programs bought separately</th><td class="num vs-total">${formatPrice(n.separateCents)}</td></tr>` : ''}
        ${n.totalCents ? html`<tr><th scope="row">Total value, programs plus bonuses</th><td class="num vs-total">${formatPrice(n.totalCents)}</td></tr>` : ''}
        <tr class="vs-yours"><th scope="row">Your launch package, everything above</th><td class="num">${formatPrice(cfg.priceCents)}</td></tr>
      </tfoot>
    </table>
    <p class="vs-note">"Bought separately" is the price at which each program is sold on its own today, without the launch bonuses; you can buy any of them individually from its program page. Where we could verify a program's original price on its archived official sales page, it's linked underneath. Bonus values are what RSD assigns to the call and the briefing invitation, which come free only with the package.</p>
  </div>`;
}

export function verifiedTotal(programs) {
  const data = loadHistoricalPrices();
  const ids = new Set(programs.map((p) => p.id));
  const v = (data.prices || []).filter((x) => x.status === 'verified' && ids.has(x.programId));
  return { count: v.length, totalCents: v.reduce((s, x) => s + x.priceCents, 0) };
}
