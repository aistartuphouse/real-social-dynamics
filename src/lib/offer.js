import { addLocalDays, formatLocal } from './time.js';

// Server-side offer window. Production uses only owner-approved timestamps; staging uses a preview window.
// No per-visitor timers: every visitor and every email shares one deadline (brief §12).
export function offerWindow(cfg) {
  if (cfg.launchStartsAtUTC && cfg.launchEndsAtUTC) {
    return { startsAt: new Date(cfg.launchStartsAtUTC), endsAt: new Date(cfg.launchEndsAtUTC), preview: false };
  }
  if (cfg.isStaging && cfg.stagingPreviewStartsAtUTC) {
    const startsAt = new Date(cfg.stagingPreviewStartsAtUTC);
    return { startsAt, endsAt: addLocalDays(startsAt, cfg.launchDurationDays, cfg.displayTimezone), preview: true };
  }
  return null;
}

export function offerState(cfg, now = new Date()) {
  const w = offerWindow(cfg);
  if (!w) return { phase: 'not-configured' };
  const phase = now < w.startsAt ? 'upcoming' : now >= w.endsAt ? 'closed' : 'open';
  return {
    phase, ...w,
    startsLocal: formatLocal(w.startsAt, cfg.displayTimezone),
    endsLocal: formatLocal(w.endsAt, cfg.displayTimezone),
    msRemaining: Math.max(0, w.endsAt - now),
  };
}

export const formatPrice = (cents, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
