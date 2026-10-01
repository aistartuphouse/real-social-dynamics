// Dry run only: computes who WOULD receive each scheduled email from the synthetic contact list,
// with every suppression reason. Never sends. Writes var/dry-run-report.csv.
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT, loadConfig } from '../src/lib/config.js';
import { Store } from '../src/lib/store.js';
import { seedSynthetic } from '../src/lib/synthetic.js';
import { eligibility, assertDispatchAllowed } from '../src/lib/campaign.js';
import { EMAILS } from '../src/lib/email.js';

const cfg = loadConfig({ mode: 'production' });
const manifest = JSON.parse(readFileSync(path.join(ROOT, 'campaign/automation-manifest.json'), 'utf8'));
const store = Store.memory(); seedSynthetic(store);
const rows = [['templateId', 'contact', 'segment', 'eligible', 'reasons']];
for (const step of manifest.steps) {
  const def = EMAILS.find((e) => e.id === step.templateId);
  for (const c of store.data.contacts) {
    const r = eligibility(c, store, { template: def });
    rows.push([step.templateId, c.email, c.segment, r.eligible ? 'yes' : 'no', r.reasons.join('; ')]);
  }
}
mkdirSync(path.join(ROOT, 'var'), { recursive: true });
writeFileSync(path.join(ROOT, 'var/dry-run-report.csv'), rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n'));
const yes = rows.filter((r) => r[3] === 'yes').length;
console.log(`Dry run: ${yes} would-be sends across ${manifest.steps.length} steps (synthetic contacts). Report: var/dry-run-report.csv`);
try { assertDispatchAllowed(cfg); } catch (e) { console.log(`Dispatch check: ${e.message}`); }
