// Timezone helpers without dependencies. Store UTC; display in campaign timezone (brief §12).

function partsInZone(date, timeZone) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p = Object.fromEntries(f.formatToParts(date).map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, mi: +p.minute, s: +p.second };
}

export function zoneOffsetMs(date, timeZone) {
  const p = partsInZone(date, timeZone);
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) - Math.floor(date.getTime() / 1000) * 1000;
}

// Convert a wall-clock time in `timeZone` to a UTC Date (DST-aware).
export function zonedToUtc({ y, m, d, h = 0, mi = 0, s = 0 }, timeZone) {
  const guess = Date.UTC(y, m - 1, d, h, mi, s);
  let utc = guess - zoneOffsetMs(new Date(guess), timeZone);
  const off2 = zoneOffsetMs(new Date(utc), timeZone);
  utc = guess - off2;
  return new Date(utc);
}

// Same local wall-clock time N calendar days later. Handles DST transitions.
export function addLocalDays(startUtc, days, timeZone) {
  const p = partsInZone(startUtc, timeZone);
  const base = new Date(Date.UTC(p.y, p.m - 1, p.d + days));
  return zonedToUtc({ y: base.getUTCFullYear(), m: base.getUTCMonth() + 1, d: base.getUTCDate(), h: p.h, mi: p.mi, s: p.s }, timeZone);
}

export function formatLocal(date, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  }).format(date);
}
