import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './config.js';

// Small JSON-file store for staging. Swap for a real database before production.
// Only synthetic data belongs here (brief §12: never commit customer data).
const EMPTY = () => ({ orders: [], entitlements: [], processedEvents: [], suppression: [], supportCases: [], contacts: [], users: [], outbox: [], analytics: [] });

export class Store {
  constructor(file = process.env.RSD_STORE || path.join(ROOT, 'var/store.json')) {
    this.file = file;
    mkdirSync(path.dirname(file), { recursive: true });
    try { this.data = { ...EMPTY(), ...JSON.parse(readFileSync(file, 'utf8')) }; } catch { this.data = EMPTY(); }
  }
  save() {
    const tmp = `${this.file}.tmp`;
    writeFileSync(tmp, JSON.stringify(this.data, null, 2));
    renameSync(tmp, this.file);
  }
  static memory() { const s = Object.create(Store.prototype); s.data = EMPTY(); s.file = null; s.save = () => {}; return s; }

  userByEmail(email) { return this.data.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase().trim()); }
  userById(id) { return this.data.users.find((u) => u.id === id); }
  entitlementsFor(userId) { return this.data.entitlements.filter((e) => e.userId === userId && e.status === 'active'); }
  isSuppressed(email) { return this.data.suppression.some((s) => s.email.toLowerCase() === String(email).toLowerCase()); }
  hasOpenSupportCase(email) {
    return this.data.supportCases.some((c) => c.email.toLowerCase() === String(email).toLowerCase() && c.status !== 'resolved');
  }
  track(event, props = {}) {
    // No emails, names, coaching goals or course history in analytics (brief §14).
    const { email, name, goals, ...safe } = props;
    this.data.analytics.push({ event, at: new Date().toISOString(), ...safe });
  }
}
