import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, loadCatalog } from '../src/lib/config.js';
import { publicPrograms } from '../src/lib/catalog.js';

const staging = loadConfig({ mode: 'staging' });
const prod = loadConfig({ mode: 'production' });

test('HOLD items never reach public lists, even in staging', () => {
  const ids = publicPrograms(staging).map((p) => p.id);
  for (const held of ['rsd-mastermind', 'founders-lab', 'social-circle-blueprint-2', 'supplemental']) assert.ok(!ids.includes(held), held);
});

test('production shows only fully approved, deliverable programs (none yet)', () => {
  assert.equal(publicPrograms(prod).length, 0);
});

test('PIMP/SHIFT and Transformations/Transformation Mastery are separate records', () => {
  const c = loadCatalog().programs;
  const t = (id) => c.find((p) => p.id === id);
  assert.notEqual(t('pimp').slug, t('shift').slug);
  assert.notEqual(t('transformations').slug, t('transformation-mastery').slug);
  assert.ok(!c.some((p) => /pimp\s*shift/i.test(p.title)));
});

test('no excluded products in the catalog', () => {
  const s = JSON.stringify(loadCatalog().programs.map((p) => [p.title, p.instructor]));
  assert.ok(!/World Summit/i.test(s));
  assert.ok(!/\bMax\b/.test(s));
});

test('every instructor with programs has exactly 5 benefit bullets; no invented counts', async () => {
  const { loadInstructors } = await import('../src/lib/config.js');
  const keys = new Set(loadCatalog().programs.filter((p) => p.publicationState === 'candidate').map((p) => p.instructorKey));
  const ins = loadInstructors();
  for (const k of keys) {
    const i = ins.find((x) => x.key === k);
    assert.ok(i, `missing instructor ${k}`);
    assert.equal(i.bullets.length, 5, k);
    for (const b of i.bullets) assert.doesNotMatch(b, /\b(7|seven|five|5) (powerful )?(methods|secrets|steps)\b|guarantee/i, `${k}: ${b}`);
  }
});

test('every public program has an original logo emblem', async () => {
  const { EMBLEMS } = await import('../src/views/logos.js');
  const { publicPrograms } = await import('../src/lib/catalog.js');
  for (const p of publicPrograms(loadConfig({ mode: 'staging' }))) assert.ok(EMBLEMS[p.slug], `missing logo for ${p.slug}`);
});
