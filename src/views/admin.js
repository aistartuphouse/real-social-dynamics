import { html } from '../lib/html.js';
import { loadCatalog } from '../lib/config.js';

export function readinessPage(cfg, launch, send, offer) {
  const catalog = loadCatalog();
  const row = (g) => html`<tr class="${g.ok ? 'ok' : 'bad'}"><td>${g.ok ? '✓' : '✗'}</td><td>${g.text}</td><td>${g.owner}</td></tr>`;
  const yes = (v) => (v ? '✓' : '·');
  return html`<section class="band band-white page-head"><div class="wrap">
    <p class="eyebrow">Internal · staging only · not indexed</p>
    <h1 class="h-xl">Launch readiness</h1>
    <p>Mode: <strong>${cfg.mode}</strong>. Offer phase: <strong>${offer.phase}</strong>${offer.preview ? ' (staging preview window)' : ''}. Production checkout and email dispatch stay closed until every gate passes. Full list: PRELAUNCH_BLOCKERS.md.</p>
    <h2 class="h-sm">Launch gates</h2>
    <table class="compare admin"><thead><tr><th></th><th>Gate</th><th>Owner</th></tr></thead><tbody>${launch.map(row)}</tbody></table>
    <h2 class="h-sm">Email send gates</h2>
    <table class="compare admin"><thead><tr><th></th><th>Gate</th><th>Owner</th></tr></thead><tbody>${send.map(row)}</tbody></table>
    <h2 class="h-sm">Product approval states</h2>
    <table class="compare admin"><thead><tr><th>Program</th><th>State</th><th>Identity</th><th>Curriculum</th><th>Rights</th><th>Copy</th><th>Media</th><th>Fulfil.</th><th>Sources</th></tr></thead><tbody>
      ${catalog.programs.map((p) => html`<tr><td>${p.title}</td><td>${p.publicationState}</td><td>${p.identityStatus}</td><td>${p.curriculumStatus}</td><td>${p.rightsStatus}</td><td>${yes(p.copyApproved)}</td><td>${yes(p.mediaApproved)}</td><td>${yes(p.fulfillmentReady)}</td><td>${p.sourceIds.join(', ')}</td></tr>`)}
    </tbody></table>
    <p><a href="/dev/emails">Email template previews</a> · <a href="/dev/outbox">Dev outbox</a></p>
  </div></section>`;
}

export function outboxPage(items) {
  return html`<section class="band band-white page-head"><div class="wrap narrow">
    <p class="eyebrow">Dev outbox · staging only</p>
    <h1 class="h-xl">Messages that would have been sent</h1>
    <p>Nothing here leaves this machine. Transactional messages and sign-in links for synthetic users only.</p>
    ${items.length ? html`<ol class="outbox">${items.slice().reverse().map((m) => html`<li><p><strong>${m.subject}</strong> → ${m.to} <span class="small">${m.at}</span></p><pre>${m.text}</pre></li>`)}</ol>` : html`<p>Empty.</p>`}
  </div></section>`;
}

export function emailIndexPage(emails) {
  return html`<section class="band band-white page-head"><div class="wrap narrow">
    <p class="eyebrow">Email templates · staging only</p>
    <h1 class="h-xl">Campaign and transactional templates</h1>
    <p>Previews fill merge tags with synthetic sample values. Dispatch is disabled.</p>
    <table class="compare"><thead><tr><th>Template</th><th>Kind</th><th>Subject A</th><th>Preview</th></tr></thead><tbody>
    ${emails.map((e) => html`<tr><td>${e.id}</td><td>${e.kind}</td><td>${e.subjects[0]}</td><td><a href="/dev/emails/${e.id}.html">HTML</a> · <a href="/dev/emails/${e.id}.txt">Text</a></td></tr>`)}
    </tbody></table>
  </div></section>`;
}
