import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import { loadConfig, loadCatalog, secret, ROOT } from './lib/config.js';
import { html } from './lib/html.js';
import { offerState } from './lib/offer.js';
import { publicPrograms, findPublicProgram } from './lib/catalog.js';
import { launchGates, sendGates, allPass } from './lib/gates.js';
import { sign, verify, signWebhook, verifyWebhook, randomId } from './lib/crypto.js';
import { Store } from './lib/store.js';
import { createPendingOrder, handlePaymentEvent } from './lib/fulfillment.js';
import { EMAILS, renderHtml, renderText, fillTags } from './lib/email.js';
import { seedSynthetic, SAMPLE_MERGE } from './lib/synthetic.js';
import { layout } from './views/layout.js';
import { cover } from './views/components.js';
import { homePage } from './views/home.js';
import * as P from './views/pages.js';
import * as A from './views/account.js';
import * as Admin from './views/admin.js';

const MIME = { '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const SYNTHETIC_EMAIL = /(@example\.(com|test)|\.test)$/i;
const EMAIL_RE = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}$/;

export function createApp({ cfg = loadConfig(), store = new Store(), now = () => new Date() } = {}) {
  const KEYS = { session: secret('RSD_SESSION_SECRET', cfg), link: secret('RSD_LINK_SECRET', cfg), webhook: secret('RSD_WEBHOOK_SECRET', cfg) };
  if (cfg.isStaging && !store.data.users.length) seedSynthetic(store);
  const hits = new Map();

  const queueMail = (to, subject, text) => { store.data.outbox.push({ to, subject, text, at: now().toISOString() }); store.save(); };

  function securityHeaders(res, { relaxedStyles = false } = {}) {
    res.setHeader('Content-Security-Policy', [
      "default-src 'self'", "script-src 'self'", `style-src 'self' https://fonts.googleapis.com${relaxedStyles ? " 'unsafe-inline'" : ''}`,
      "font-src https://fonts.gstatic.com", "img-src 'self' data:", "form-action 'self'", "frame-ancestors 'none'", "base-uri 'none'", "object-src 'none'",
    ].join('; '));
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (!cfg.publicSite && (cfg.isStaging || !cfg.publishApproved)) res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }

  const cookies = (req) => Object.fromEntries((req.headers.cookie || '').split(';').map((c) => c.trim().split('=')).filter(([k]) => k).map(([k, ...v]) => [k, decodeURIComponent(v.join('='))]));
  const setCookie = (res, name, value, maxAge) => {
    const prev = res.getHeader('Set-Cookie') || [];
    res.setHeader('Set-Cookie', [...[].concat(prev), `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${cfg.isStaging ? '' : '; Secure'}`]);
  };
  const csrfFor = (req, res) => { let t = cookies(req).rsd_csrf; if (!t) { t = randomBytes(18).toString('base64url'); setCookie(res, 'rsd_csrf', t, 7200); } return t; };
  const csrfOk = (req, form) => { const c = cookies(req).rsd_csrf; return c && form.csrf && c === form.csrf; };
  const currentUser = (req) => { const s = verify(cookies(req).rsd_session, KEYS.session); return s ? store.userById(s.uid) : null; };

  const send = (res, status, body, type = 'text/html; charset=utf-8', opts) => { securityHeaders(res, opts); res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' }); res.end(String(body)); };
  const page = (res, opts, status = 200) => send(res, status, layout(cfg, { ...opts, showNotes: res.showNotes, currentUrl: res.currentUrl }));
  const redirect = (res, to) => { securityHeaders(res); res.writeHead(303, { Location: to }); res.end(); };
  const notFound = (res) => page(res, { title: 'Not found | RSD', body: A.messagePage('Page not found', 'That page is not part of this release.') }, 404);

  function rateLimited(req) {
    const ip = req.socket.remoteAddress || 'x'; const t = Date.now();
    const arr = (hits.get(ip) || []).filter((x) => t - x < 60000); arr.push(t); hits.set(ip, arr);
    return arr.length > 30;
  }

  async function readBody(req, limit = 64 * 1024) {
    let size = 0; const chunks = [];
    for await (const c of req) { size += c.length; if (size > limit) throw Object.assign(new Error('Payload too large'), { status: 413 }); chunks.push(c); }
    return Buffer.concat(chunks).toString('utf8');
  }
  const parseForm = (s) => Object.fromEntries(new URLSearchParams(s));

  function ensureUser(email, firstName) {
    let u = store.userByEmail(email);
    if (!u) { u = { id: randomId('usr'), email: email.toLowerCase(), firstName: (firstName || '').slice(0, 60), priorEntitlements: [], synthetic: cfg.isStaging }; store.data.users.push(u); store.save(); }
    return u;
  }

  function validEmail(email) {
    if (!EMAIL_RE.test(email || '')) return 'Please enter a valid email address.';
    if (cfg.isStaging && !SYNTHETIC_EMAIL.test(email)) return 'Staging accepts only synthetic addresses (ending in .test or @example.com). Do not enter real customer data.';
    return '';
  }

  function grantedMail(order) {
    const def = EMAILS.find((e) => e.id === 'txn-order-confirmation');
    const text = fillTags(renderText(def, cfg), { ...SAMPLE_MERGE, firstNameOrThere: 'there', orderNumber: order.id, purchasedManifestSummary: order.snapshot.manifest.map((m) => m.title).join(', ') });
    queueMail(order.email, def.subjects[0], text);
  }

  async function route(req, res) {
    const url = new URL(req.url, 'http://localhost');
    const p = url.pathname.replace(/\/+$/, '') || '/';
    const method = req.method;
    res.showNotes = cfg.isStaging && !cfg.publicSite && url.searchParams.get('notes') === '1';
    res.currentUrl = url.pathname;
    const t = now();
    const state = offerState(cfg, t);
    const programs = publicPrograms(cfg);
    const catalog = loadCatalog();

    if (method === 'POST' && rateLimited(req)) return send(res, 429, 'Too many requests', 'text/plain');

    // ---------- static ----------
    if (method === 'GET' && /^\/(css|js|img)\//.test(p)) {
      const file = path.normalize(path.join(ROOT, 'public', p));
      if (!file.startsWith(path.join(ROOT, 'public'))) return notFound(res);
      try { const buf = await readFile(file); securityHeaders(res); res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': cfg.isStaging ? 'no-cache' : 'public, max-age=300' }); return res.end(buf); } catch { return notFound(res); }
    }
    if (p === '/robots.txt') return send(res, 200, !cfg.publicSite && (cfg.isStaging || !cfg.publishApproved) ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nDisallow: /my-library\nDisallow: /success-call\nDisallow: /rsd-nation-invitation\n', 'text/plain');
    if (p === '/healthz') return send(res, 200, 'ok', 'text/plain');

    // ---------- public pages ----------
    if (method === 'GET' && p === '/') {
      store.track('page_view', { path: '/' }); store.track('offer_view', {});
      return page(res, { title: 'What Did Julien Blanc Know Before Teaching Personal Transformation? | RSD Legacy Archive', description: 'Go back to the earlier RSD training. The Complete RSD Legacy Archive plus a live Success Coaching Call and a private RSD Nation relaunch-briefing invitation.', path: '/', stickyCta: true, body: homePage(cfg, state, programs, catalog) });
    }
    if (method === 'GET' && p === '/welcome-back') return page(res, { title: 'Welcome back | RSD Legacy Archive', path: p, body: P.welcomeBackPage(cfg, state, programs) });
    if (method === 'GET' && p === '/legacy') return page(res, { title: 'All programs | RSD Legacy Archive', path: p, body: P.legacyPage(cfg, programs, catalog) });
    if (method === 'GET' && p.startsWith('/programs/')) {
      const prog = findPublicProgram(cfg, p.slice(10));
      if (!prog) return notFound(res);
      store.track('approved_program_view', { programId: prog.id });
      return page(res, { title: `${prog.title} | RSD Legacy Archive`, description: prog.cardHeadline, path: p, body: P.programPage(cfg, prog, state, programs) });
    }
    if (method === 'GET' && p === '/about') return page(res, { title: 'About Us | Real Social Dynamics', path: p, body: P.aboutPage(cfg) });
    if (method === 'GET' && p === '/preparation') return page(res, { title: 'Preparation path | RSD', path: p, body: P.preparationPage(cfg) });
    if (method === 'GET' && p === '/global-tour') return page(res, { title: 'Global tour plans | RSD', path: p, body: P.globalTourPage(cfg) });
    if (method === 'GET' && ['/terms', '/privacy', '/refunds'].includes(p)) return page(res, { title: 'Policies | RSD', path: p, body: P.policyPage(cfg, p.slice(1)) });
    if (method === 'GET' && p === '/api/catalog.json') {
      const safe = programs.map(({ id, slug, title, instructor, collection, cardHeadline, shortCopy, verifiedThemes }) => ({ id, slug, title, instructor, collection, cardHeadline, shortCopy, verifiedThemes }));
      return send(res, 200, JSON.stringify({ programs: safe }), 'application/json');
    }

    // ---------- support (service-first; suppresses sales sequence) ----------
    if ((p === '/support' || p === '/access') && cfg.publicSite) {
      if (method !== 'GET') return notFound(res);
      return page(res, { title: 'Support | RSD', path: p, body: P.publicSupportPage(cfg) });
    }
    if (p === '/support') {
      if (method === 'GET') return page(res, { title: 'Support | RSD', path: p, body: P.supportPage(cfg, { csrf: csrfFor(req, res), sent: url.searchParams.has('sent') }) });
      const f = parseForm(await readBody(req));
      if (!csrfOk(req, f)) return send(res, 403, 'Invalid form token', 'text/plain');
      const err = validEmail(f.email);
      if (err) return page(res, { title: 'Support | RSD', body: P.supportPage(cfg, { csrf: csrfFor(req, res), error: err }) }, 400);
      store.data.supportCases.push({ id: randomId('case'), email: f.email.toLowerCase(), topic: ['access', 'refund', 'other'].includes(f.topic) ? f.topic : 'other', message: String(f.message || '').slice(0, 2000), status: 'open', openedAt: t.toISOString() });
      store.track('support_request', {}); store.save();
      return redirect(res, '/support?sent=1');
    }

    // ---------- existing-access check / magic link ----------
    if (p === '/access') {
      if (method === 'GET') return page(res, { title: 'Check my existing access | RSD', path: p, body: A.accessPage(cfg, { csrf: csrfFor(req, res), sent: url.searchParams.has('sent') }) });
      const f = parseForm(await readBody(req));
      if (!csrfOk(req, f)) return send(res, 403, 'Invalid form token', 'text/plain');
      const err = validEmail(f.email);
      if (err) return page(res, { title: 'Check my existing access | RSD', body: A.accessPage(cfg, { csrf: csrfFor(req, res), error: err }) }, 400);
      store.track('existing_access_check_started', {});
      const u = store.userByEmail(f.email);
      if (u) queueMail(u.email, 'Your secure RSD sign-in link', `Sign in: /auth?t=${sign({ uid: u.id, purpose: 'login' }, KEYS.link, 1800)}\nThis link expires in 30 minutes.`);
      return redirect(res, '/access?sent=1'); // identical response whether or not the address exists
    }
    if (method === 'GET' && p === '/auth') {
      const d = verify(url.searchParams.get('t'), KEYS.link);
      if (!d || d.purpose !== 'login' || !store.userById(d.uid)) return page(res, { title: 'Link expired | RSD', body: A.messagePage('That link has expired', 'Request a new sign-in link from the existing-access page.') }, 400);
      setCookie(res, 'rsd_session', sign({ uid: d.uid }, KEYS.session, 7 * 86400), 7 * 86400);
      store.track('existing_access_check_completed', {});
      return redirect(res, '/my-library');
    }
    if (method === 'POST' && p === '/logout') { setCookie(res, 'rsd_session', '', 0); return redirect(res, '/'); }

    // ---------- authenticated areas ----------
    if (method === 'GET' && ['/my-library', '/success-call', '/rsd-nation-invitation'].includes(p)) {
      const u = currentUser(req);
      if (!u) return redirect(res, '/access');
      const ents = store.entitlementsFor(u.id);
      if (p === '/my-library') return page(res, { title: 'My library | RSD', body: A.libraryPage(cfg, u, ents, programs) });
      const kind = p === '/success-call' ? 'bonus:success-call' : 'bonus:briefing-invite';
      const ent = ents.find((e) => e.kind === kind);
      if (!ent) return page(res, { title: 'Package bonus | RSD', body: A.messagePage('This is a package-only bonus', 'It is included only with the RSD Legacy Archive launch package.') }, 403);
      if (kind === 'bonus:briefing-invite') store.track('briefing_invitation_viewed', {});
      return page(res, { title: 'Your bonus | RSD', body: kind === 'bonus:success-call' ? A.successCallPage(cfg, ent) : A.invitationPage(cfg) });
    }

    // ---------- checkout (fails closed in production) ----------
    if (p === '/checkout' && cfg.publicSite) {
      // Public site: the only live purchase path is the owner's Stripe link.
      const slug = url.searchParams.get('program');
      const one = slug ? findPublicProgram(cfg, slug) : null;
      if (slug) { if (!one || !one.stripePaymentLink) return notFound(res); securityHeaders(res); res.writeHead(303, { Location: one.stripePaymentLink }); return res.end(); }
      if (!cfg.vaultCheckoutUrl) return notFound(res);
      securityHeaders(res); res.writeHead(303, { Location: cfg.vaultCheckoutUrl }); return res.end();
    }
    if (p === '/checkout') {
      const gates = launchGates(cfg);
      if (!cfg.isStaging && !allPass(gates)) return page(res, { title: 'Checkout not open | RSD', body: A.messagePage('Checkout is not open', 'The launch package is not yet available for purchase.') }, 503);
      const body = method === 'POST' ? parseForm(await readBody(req)) : {};
      const slug = body.program || url.searchParams.get('program');
      const single = slug ? findPublicProgram(cfg, slug) : null;
      if (slug && (!single || !single.individualPriceCents || !cfg.individualSalesEnabled)) return notFound(res);
      if (!single && state.phase !== 'open') return page(res, { title: 'Offer not open | RSD', body: A.messagePage('The launch offer is not open', state.phase === 'closed' ? 'The 14-day launch offer has ended.' : 'The launch offer has not started.') }, 409);
      const view = (extra) => single ? A.singleCheckoutPage(cfg, single, { csrf: csrfFor(req, res), ...extra }) : A.checkoutPage(cfg, state, programs, { csrf: csrfFor(req, res), ...extra });
      if (method === 'GET') { store.track('checkout_started', { sku: single ? `PROGRAM-${single.id}` : cfg.packageSku }); return page(res, { title: 'Review your order | RSD', body: view() }); }
      if (!csrfOk(req, body)) return send(res, 403, 'Invalid form token', 'text/plain');
      const err = validEmail(body.email) || (body.agree !== 'yes' ? 'Please confirm you have read the inventory and terms.' : '');
      if (err) return page(res, { title: 'Review your order | RSD', body: view({ error: err }) }, 400);
      const u = ensureUser(body.email, body.firstName);
      const order = createPendingOrder(store, cfg, { userId: u.id, email: u.email, sku: single ? `PROGRAM-${single.id}` : cfg.packageSku, now: t });
      if (cfg.paymentProvider === 'simulated-test') return redirect(res, `/test-pay/${order.id}`);
      return send(res, 501, 'Real payment provider adapter not installed', 'text/plain');
    }

    if (p.startsWith('/test-pay/')) {
      if (!cfg.isStaging || cfg.publicSite || cfg.paymentProvider !== 'simulated-test') return notFound(res);
      const order = store.data.orders.find((o) => o.id === p.slice(10));
      if (!order) return notFound(res);
      if (method === 'GET') return page(res, { title: 'Test payment | RSD', body: A.testPayPage(cfg, order, csrfFor(req, res)) });
      const f = parseForm(await readBody(req));
      if (!csrfOk(req, f)) return send(res, 403, 'Invalid form token', 'text/plain');
      const event = { id: `evt_${order.id}`, type: 'payment.succeeded', orderId: order.id, amountCents: order.amountCents, currency: order.currency, created: Math.floor(Date.now() / 1000), providerRef: 'sim' };
      const raw = JSON.stringify(event);
      const sig = signWebhook(raw, KEYS.webhook);
      const runs = f.outcome === 'duplicate' ? 2 : 1;
      for (let i = 0; i < runs; i++) processWebhook(raw, sig);
      return redirect(res, `/order/${order.id}?t=${sign({ oid: order.id }, KEYS.link, 86400)}`);
    }

    if (method === 'POST' && p === '/webhooks/payment') {
      const raw = await readBody(req, 256 * 1024);
      const r = processWebhook(raw, req.headers['x-rsd-signature']);
      return send(res, r.status, JSON.stringify(r.body), 'application/json');
    }

    if (method === 'GET' && p.startsWith('/order/')) {
      const d = verify(url.searchParams.get('t'), KEYS.link);
      const order = store.data.orders.find((o) => o.id === p.slice(7));
      if (!order || !d || d.oid !== order.id) return notFound(res);
      return page(res, { title: 'Your order | RSD', body: A.orderPage(cfg, order) });
    }

    // ---------- unsubscribe: no login, one-click POST supported (RFC 8058) ----------
    if (p === '/unsubscribe') {
      const body = method === 'POST' ? parseForm(await readBody(req)) : {};
      const token = body.t || url.searchParams.get('t');
      const d = verify(token, KEYS.link);
      if (!d || d.purpose !== 'unsubscribe') return page(res, { title: 'Unsubscribe | RSD', body: A.messagePage('That unsubscribe link is invalid', `Reply to any campaign email with "unsubscribe" or contact support and we will remove you.`) }, 400);
      if (method === 'POST') {
        if (!store.isSuppressed(d.email)) store.data.suppression.push({ email: d.email.toLowerCase(), reason: 'unsubscribe', at: t.toISOString() });
        store.track('unsubscribe', {}); store.save();
        return page(res, { title: 'Unsubscribed | RSD', body: A.unsubscribePage(cfg, { email: d.email, done: true }) });
      }
      return page(res, { title: 'Unsubscribe | RSD', body: A.unsubscribePage(cfg, { token, email: d.email, done: false }) });
    }

    // ---------- staging-only internal tools ----------
    if (cfg.isStaging && !cfg.publicSite && method === 'GET') {
      if (p === '/admin/readiness') return page(res, { title: 'Launch readiness | RSD staging', body: Admin.readinessPage(cfg, launchGates(cfg), sendGates(cfg), state) });
      if (p === '/dev/logos') return page(res, { title: 'Program logos | RSD staging', body: html`<section class="band band-white page-head"><div class="wrap"><p class="eyebrow">Program logos · staging</p><h1 class="h-xl">${programs.length} original program logos</h1><p>Standalone SVG files (dark and light) are in <code>public/img/logos/</code>.</p><div class="logo-sheet">${programs.map((pr) => cover(pr))}</div></div></section>` });
      if (p === '/dev/outbox') return page(res, { title: 'Dev outbox | RSD staging', body: Admin.outboxPage(store.data.outbox) });
      if (p === '/dev/emails') return page(res, { title: 'Email templates | RSD staging', body: Admin.emailIndexPage(EMAILS) });
      const m = p.match(/^\/dev\/emails\/([\w-]+)\.(html|txt)$/);
      if (m) {
        const def = EMAILS.find((e) => e.id === m[1]);
        if (!def) return notFound(res);
        const sample = { ...SAMPLE_MERGE, launchEndLocal: state.endsLocal || SAMPLE_MERGE.launchEndLocal };
        return m[2] === 'html'
          ? send(res, 200, fillTags(renderHtml(def, cfg), sample, { escapeHtml: true }), 'text/html; charset=utf-8', { relaxedStyles: true })
          : send(res, 200, fillTags(renderText(def, cfg), sample), 'text/plain; charset=utf-8');
      }
    }
    return notFound(res);
  }

  function processWebhook(raw, sigHeader) {
    if (!verifyWebhook(raw, sigHeader, KEYS.webhook)) return { status: 400, body: { error: 'bad-signature' } };
    let event; try { event = JSON.parse(raw); } catch { return { status: 400, body: { error: 'bad-json' } }; }
    const r = handlePaymentEvent(store, cfg, event);
    if (r.error) return { status: 409, body: r };
    if (r.ok && event.type === 'payment.succeeded') grantedMail(r.order);
    return { status: 200, body: { received: true, duplicate: Boolean(r.duplicate) } };
  }

  const handler = (req, res) => route(req, res).catch((e) => {
    if (!res.headersSent) send(res, e.status || 500, e.status ? e.message : 'Server error', 'text/plain');
    if (!e.status) console.error(e);
  });
  return { handler, store, cfg, keys: KEYS };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const app = createApp();
  const port = Number(process.env.PORT || 8130);
  http.createServer(app.handler).listen(port, '127.0.0.1', () => {
    console.log(`RSD ${app.cfg.mode} server on http://127.0.0.1:${port}`);
    if (!app.cfg.isStaging) console.log('Production mode: checkout and dispatch fail closed until all launch gates pass.');
  });
}
