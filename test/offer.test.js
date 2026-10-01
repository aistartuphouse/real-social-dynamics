import test from 'node:test';
import assert from 'node:assert/strict';
import { addLocalDays, formatLocal } from '../src/lib/time.js';
import { offerState } from '../src/lib/offer.js';
import { loadConfig } from '../src/lib/config.js';

test('14-day window keeps local wall-clock time across the DST change', () => {
  const start = new Date('2026-10-25T16:00:00Z'); // 9:00 AM PDT
  const end = addLocalDays(start, 14, 'America/Los_Angeles');
  assert.equal(end.toISOString(), '2026-11-08T17:00:00.000Z'); // 9:00 AM PST
  assert.match(formatLocal(end, 'America/Los_Angeles'), /9:00 AM PST/);
});

test('one shared deadline: phases switch exactly at the stored UTC instants', () => {
  const cfg = loadConfig({ mode: 'production', launchStartsAtUTC: '2026-10-05T16:00:00Z', launchEndsAtUTC: '2026-10-19T16:00:00Z' });
  assert.equal(offerState(cfg, new Date('2026-10-05T15:59:59Z')).phase, 'upcoming');
  assert.equal(offerState(cfg, new Date('2026-10-05T16:00:00Z')).phase, 'open');
  assert.equal(offerState(cfg, new Date('2026-10-19T15:59:59Z')).phase, 'open');
  assert.equal(offerState(cfg, new Date('2026-10-19T16:00:00Z')).phase, 'closed');
});

test('production without approved timestamps is not-configured (no fake window)', () => {
  assert.equal(offerState(loadConfig({ mode: 'production' })).phase, 'not-configured');
});
