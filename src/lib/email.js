import { escape } from './html.js';
import { EMAILS, FOOTER } from '../../emails/src/definitions.js';

export { EMAILS };

// Day 3 names Julien titles; render only when that sequence is approved (staging renders for review).
const resolveBlocks = (def, cfg) => def.blocks.filter((b) => !(b && b.prep) || b.prep === (cfg.preparationPolicyApproved ? 'approved' : 'planned'))
  .map((b) => (b && (b.prep || b.variantOnly) ? b.text : b)); // variantOnly lines: drop for contacts not enrolled on day 1 at send time

const NAVY = '#0B1F3A', INK = '#0A0A0A', LINE = '#D8DEE7';

export function renderHtml(def, cfg) {
  const blocks = resolveBlocks(def, cfg);
  const body = blocks.map((b) => {
    if (typeof b === 'string') return `<p style="margin:0 0 16px;font:16px/1.6 Georgia,'Times New Roman',serif;color:${INK}">${escape(b)}</p>`;
    if (b.cta) {
      const bg = b.cta.secondary ? '#FFFFFF' : NAVY, fg = b.cta.secondary ? NAVY : '#FFFFFF';
      return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px"><tr><td style="background:${bg};border:2px solid ${NAVY};border-radius:4px"><a href="${escape(b.cta.url)}" style="display:inline-block;padding:14px 24px;font:700 14px/1 Arial,Helvetica,sans-serif;letter-spacing:.06em;color:${fg};text-decoration:none">${escape(b.cta.label)}</a></td></tr></table>`;
    }
    if (b.list) return `<ul style="margin:0 0 16px;padding-left:20px;font:16px/1.6 Georgia,serif;color:${INK}">${b.list.map((li) => `<li style="margin-bottom:6px">${escape(li)}</li>`).join('')}</ul>`;
    if (b.sig) return `<p style="margin:8px 0 20px;font:16px/1.5 Georgia,serif;color:${INK}">${b.sig.map(escape).join('<br>')}</p>`;
    if (b.note) return `<p style="margin:0 0 16px;font:14px/1.5 Arial,sans-serif;color:#33404F">${escape(b.note)}</p>`;
    return '';
  }).join('\n');

  const footer = def.kind === 'marketing' ? `
<tr><td style="padding:24px 32px;border-top:1px solid ${LINE};font:14px/1.6 Arial,Helvetica,sans-serif;color:#33404F">
${FOOTER.lines.map((l) => `<div>${escape(l)}</div>`).join('')}
<div>${escape(FOOTER.phone)}</div>
<div style="margin:10px 0">${FOOTER.links.map(([t, h]) => `<a href="${escape(h)}" style="color:${NAVY};text-decoration:underline">${escape(t)}</a>`).join(' &nbsp;|&nbsp; ')}</div>
<div>${escape(FOOTER.disclosure)}</div></td></tr>` : `
<tr><td style="padding:24px 32px;border-top:1px solid ${LINE};font:14px/1.6 Arial,Helvetica,sans-serif;color:#33404F">
<div>{{actualSenderLegalName}} · {{currentValidPostalAddress}}</div><div>Transactional message about your order. It is sent regardless of marketing preferences and contains no promotions.</div></td></tr>`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light">
<title>${escape(def.subjects[0])}</title></head>
<body style="margin:0;background:#F5F7FA">
<div style="display:none;max-height:0;overflow:hidden">${escape(def.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border:1px solid ${LINE}">
<tr><td style="background:${NAVY};padding:18px 32px;font:800 13px/1 Arial,Helvetica,sans-serif;letter-spacing:.18em;color:#FFFFFF">REAL SOCIAL DYNAMICS · RSD IS BACK</td></tr>
<tr><td style="padding:32px 32px 8px">
${body}
</td></tr>${footer}
</table></td></tr></table></body></html>`;
}

export function renderText(def, cfg) {
  const lines = [];
  for (const b of resolveBlocks(def, cfg)) {
    if (typeof b === 'string') lines.push(b, '');
    else if (b.cta) lines.push(`${b.cta.label}: ${b.cta.url}`, '');
    else if (b.list) lines.push(...b.list.map((l) => `- ${l}`), '');
    else if (b.sig) lines.push(...b.sig, '');
    else if (b.note) lines.push(b.note, '');
  }
  if (def.kind === 'marketing') {
    lines.push('--', ...FOOTER.lines, FOOTER.phone, ...FOOTER.links.map(([t, h]) => `${t}: ${h}`), '', FOOTER.disclosure);
  } else {
    lines.push('--', '{{actualSenderLegalName}} · {{currentValidPostalAddress}}', 'Transactional message about your order.');
  }
  return lines.join('\n');
}

export const mergeTags = (s) => [...new Set([...s.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]))];

export function fillTags(s, values, { escapeHtml = false } = {}) {
  return s.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in values ? (escapeHtml ? escape(values[k]) : String(values[k])) : m));
}
