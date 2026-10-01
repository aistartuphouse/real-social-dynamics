import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const readJson = (rel) => JSON.parse(readFileSync(path.join(ROOT, rel), 'utf8'));

export function loadConfig(overrides = {}) {
  const base = readJson('config/campaign.json');
  const mode = overrides.mode || process.env.RSD_MODE || 'staging';
  if (!['staging', 'production'].includes(mode)) throw new Error(`Unknown RSD_MODE ${mode}`);
  return { ...base, ...overrides, mode, isStaging: mode === 'staging' };
}

export const loadCatalog = () => readJson('data/catalog.json');
export const loadInstructors = () => readJson('data/instructors.json').instructors;
export const loadExclusions = () => readJson('data/exclusions.json');
export const loadHistoricalPrices = () => {
  try { return readJson('data/historical-prices.json'); } catch { return { prices: [] }; }
};

// Secrets come from the environment. Staging generates throwaway values; production refuses to start without them.
export function secret(name, cfg) {
  const v = process.env[name];
  if (v) return v;
  if (cfg.isStaging) return `staging-only-${name}-not-a-real-secret`;
  throw new Error(`Missing required secret ${name} in production mode`);
}
