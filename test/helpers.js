import http from 'node:http';
import { createApp } from '../src/server.js';
import { loadConfig } from '../src/lib/config.js';
import { Store } from '../src/lib/store.js';
import { seedSynthetic } from '../src/lib/synthetic.js';

export async function startApp({ mode = 'staging', overrides = {}, now } = {}) {
  if (mode === 'production') for (const k of ['RSD_SESSION_SECRET', 'RSD_LINK_SECRET', 'RSD_WEBHOOK_SECRET']) process.env[k] ||= `test-${k}`;
  const cfg = loadConfig({ mode, ...overrides });
  const store = Store.memory();
  seedSynthetic(store);
  const app = createApp({ cfg, store, now: now || (() => new Date('2026-10-03T18:00:00Z')) });
  const server = http.createServer(app.handler);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  server.unref(); // a failed assertion must not hang the test run
  const base = `http://127.0.0.1:${server.address().port}`;
  const jar = {};
  const req = async (path, { method = 'GET', form, headers = {}, body } = {}) => {
    const h = { ...headers, cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ') };
    let payload = body;
    if (form) { h['content-type'] = 'application/x-www-form-urlencoded'; payload = new URLSearchParams(form).toString(); }
    const res = await fetch(base + path, { method, headers: h, body: payload, redirect: 'manual' });
    for (const c of res.headers.getSetCookie()) { const [kv] = c.split(';'); const [k, v] = kv.split('='); if (v) jar[k] = v; else delete jar[k]; }
    return { status: res.status, headers: res.headers, text: await res.text() };
  };
  const csrf = async (path) => (await req(path)).text.match(/name="csrf" value="([^"]+)"/)[1];
  return { app, store, cfg, req, csrf, close: () => new Promise((r) => server.close(r)) };
}

export const PUBLIC_ROUTES = ['/', '/about', '/welcome-back', '/legacy', '/preparation', '/global-tour', '/support', '/access', '/terms', '/privacy', '/refunds', '/api/catalog.json', '/robots.txt'];
