import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';

const b64u = (b) => Buffer.from(b).toString('base64url');

export function sign(payload, key, ttlSeconds = 3600) {
  const body = b64u(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds }));
  const mac = createHmac('sha256', key).update(body).digest('base64url');
  return `${body}.${mac}`;
}

export function verify(token, key) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [body, mac] = token.split('.');
  const expected = createHmac('sha256', key).update(body).digest('base64url');
  const a = Buffer.from(mac || ''), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch { return null; }
}

// Webhook signatures: "t=<unix>,v1=<hex hmac of `${t}.${rawBody}`>", 5-minute tolerance.
export function signWebhook(rawBody, key, t = Math.floor(Date.now() / 1000)) {
  return `t=${t},v1=${createHmac('sha256', key).update(`${t}.${rawBody}`).digest('hex')}`;
}

export function verifyWebhook(rawBody, header, key, toleranceSec = 300) {
  const parts = Object.fromEntries(String(header || '').split(',').map((kv) => kv.split('=')));
  const t = Number(parts.t);
  if (!t || !parts.v1 || Math.abs(Date.now() / 1000 - t) > toleranceSec) return false;
  const expected = createHmac('sha256', key).update(`${t}.${rawBody}`).digest('hex');
  const a = Buffer.from(parts.v1), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const randomId = (prefix) => `${prefix}_${randomBytes(9).toString('base64url')}`;
