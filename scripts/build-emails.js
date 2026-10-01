// Writes provider-neutral HTML + plaintext templates (merge tags intact) for every campaign
// and transactional email, plus both planned/approved variants of the preparation email.
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT, loadConfig } from '../src/lib/config.js';
import { EMAILS, renderHtml, renderText, mergeTags } from '../src/lib/email.js';

const out = path.join(ROOT, 'emails/templates');
mkdirSync(out, { recursive: true });
const cfg = loadConfig({ mode: 'production' });
const index = [];
for (const def of EMAILS) {
  const variants = def.id === 'day11-preparation' ? [['planned', false], ['approved', true]] : [[null, cfg.preparationPolicyApproved]];
  for (const [suffix, prep] of variants) {
    const c = { ...cfg, preparationPolicyApproved: prep };
    const name = suffix ? `${def.id}.${suffix}` : def.id;
    const h = renderHtml(def, c), t = renderText(def, c);
    writeFileSync(path.join(out, `${name}.html`), h);
    writeFileSync(path.join(out, `${name}.txt`), t);
    index.push({ file: name, kind: def.kind, subjects: def.subjects, preheader: def.preheader, mergeTags: mergeTags(h + t + def.preheader) });
  }
}
writeFileSync(path.join(out, 'index.json'), JSON.stringify(index, null, 2));
console.log(`Wrote ${index.length} templates to emails/templates/`);
