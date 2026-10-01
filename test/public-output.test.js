import test from 'node:test';
import assert from 'node:assert/strict';
import { startApp, PUBLIC_ROUTES } from './helpers.js';
import { loadExclusions, loadConfig } from '../src/lib/config.js';
import { publicPrograms } from '../src/lib/catalog.js';
import { EMAILS, renderHtml, renderText } from '../src/lib/email.js';

const patterns = loadExclusions().forbiddenPublicPatterns.map((p) => [new RegExp(p.pattern, p.flags), p.why]);
const scan = (label, text) => { for (const [re, why] of patterns) assert.ok(!re.test(text), `${label} matched ${re} (${why})`); };

for (const mode of ['staging', 'production']) {
  test(`${mode}: no excluded, held, or forbidden content in public pages`, async () => {
    const t = await startApp({ mode });
    const routes = [...PUBLIC_ROUTES, ...publicPrograms(t.cfg).map((p) => `/programs/${p.slug}`)];
    for (const r of routes) {
      const res = await t.req(r);
      assert.ok([200].includes(res.status), `${r} -> ${res.status}`);
      scan(`${mode} ${r}`, res.text);
    }
    for (const held of ['rsd-mastermind', 'founders-lab', 'social-circle-blueprint-2']) assert.equal((await t.req(`/programs/${held}`)).status, 404);
    await t.close();
  });
}

test('every email template (HTML + text) is free of forbidden content and has a footer', () => {
  const cfg = loadConfig({ mode: 'staging' });
  for (const e of EMAILS) {
    const h = renderHtml(e, cfg), x = renderText(e, cfg);
    scan(e.id, h); scan(e.id, x);
    if (e.kind === 'marketing') {
      assert.match(x, /\{\{unsubscribeURL\}\}/, `${e.id} needs unsubscribe`);
      assert.match(x, /\{\{currentValidPostalAddress\}\}/, `${e.id} needs postal address`);
    }
    assert.doesNotMatch(h, /web\.archive\.org|<img[^>]+width="1"/i, `${e.id}: no archived tracking or pixels`);
  }
});

test('staging pages are noindex and robots disallows all', async () => {
  const t = await startApp();
  assert.match((await t.req('/robots.txt')).text, /Disallow: \//);
  const home = await t.req('/');
  assert.match(home.text, /noindex/);
  assert.match(home.headers.get('x-robots-tag'), /noindex/);
  await t.close();
});

test('sales copy leads with the owner hero headline; "RSD IS BACK" lives in email only', async () => {
  const t = await startApp();
  const home = (await t.req('/')).text;
  assert.match(home, /<h1[^>]*>What did <span class="rotator" data-names="[^"]*Julien Blanc[^"]*Madison[^"]*">Julien Blanc<\/span> know before teaching personal transformation\?<\/h1>/);
  assert.doesNotMatch(home, /RSD IS BACK/i);
  assert.doesNotMatch(home, /Original artwork appears once licensed/);
  await t.close();
});

test('countdown clock renders on the homepage with the shared deadline', async () => {
  const t = await startApp();
  const home = (await t.req('/')).text;
  const clocks = [...home.matchAll(/data-clock="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(clocks.length >= 3, 'hero, deadline section, close/package');
  assert.equal(new Set(clocks).size, 1, 'one shared deadline');
  assert.match(home, /data-unit="seconds"/);
  await t.close();
});

test('RSD Vault CTA appears top, middle, and bottom of the sales letter', async () => {
  const t = await startApp();
  const home = (await t.req('/')).text;
  const hits = [...home.matchAll(/class="[^"]*vault-cta"[^>]*href="https:\/\/buy\.stripe\.com\/4gM00k2eqdaJ0Uvdsd1oI10"[^>]*>Click here to get the RSD Vault</g)];
  assert.ok(hits.length >= 8, `found ${hits.length}`);
  assert.doesNotMatch(home, />Unlock the archive</i);
  await t.close();
});

test('no Planned badges on the public site', async () => {
  const t = await startApp({ overrides: { publicSite: true } });
  for (const r of ['/', '/preparation', '/global-tour']) assert.doesNotMatch((await t.req(r)).text, /not yet scheduled/i, r);
  await t.close();
});

test('headline skim test: h2 headlines alone describe the full offer', async () => {
  const t = await startApp();
  const h2 = [...(await t.req('/')).text.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => m[1].replace(/<[^>]+>/g, '')).join(' | ');
  for (const must of [/RSD teaching/, /prequel|screen/i, /Julien/, /instructors/, /\$997/, /Bonus 1/, /Bonus 2/, /14 days/, /bootcamp/i, /Already bought/]) assert.match(h2, must);
  await t.close();
});
