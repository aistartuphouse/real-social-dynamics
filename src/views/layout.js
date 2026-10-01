import { html, raw } from '../lib/html.js';
import { tokenOr, supportPhoneLink, supportEmailLink, vaultCta } from '../lib/claims.js';

const V = Date.now().toString(36); // cache-busting asset version per server start

export function layout(cfg, { title, description, body, path = '/', bodyClass = '', stickyCta = false, showNotes = false, currentUrl = '/' }) {
  const nav = [['/about', 'About Us'], ['/legacy', 'Programs'], ['/#package', 'The Package'], ['/preparation', 'Preparation'], ['/access', 'Already a customer?']];
  return html`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description || 'The RSD Legacy Archive: The Prequel Collection.'}">
${!cfg.publicSite && (cfg.isStaging || !cfg.publishApproved) ? raw('<meta name="robots" content="noindex, nofollow">') : ''}
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32.png?v=2"><link rel="icon" type="image/png" sizes="512x512" href="/img/icon-512.png?v=2"><link rel="apple-touch-icon" href="/img/apple-touch-icon.png?v=2">
<meta property="og:image" content="/img/rsd-vault-bundle.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..700;1,8..60,400..600&display=swap">
<link rel="stylesheet" href="/css/site.css?v=${V}">
<script src="/js/site.js?v=${V}" defer></script>
</head>
<body class="${bodyClass}${showNotes ? ' show-notes' : ''}">
<a class="skip" href="#main">Skip to content</a>
${cfg.isStaging && !cfg.publicSite ? html`<div class="staging-bar" role="note"><strong>STAGING PREVIEW</strong> · Not public · ${cfg.vaultCheckoutUrl ? 'Vault buttons open the owner\'s Stripe link (may be live)' : 'Test-mode payments only'} · No emails are sent · ${showNotes ? html`<a href="${currentUrl}">Hide review notes</a>` : html`<a href="${currentUrl}?notes=1">Show review notes</a>`} · <a href="/admin/readiness">Launch readiness</a></div>` : ''}
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="Real Social Dynamics home"><img src="/img/rsd-logo.png" alt="Real Social Dynamics" width="174" height="46"></a>
    <nav aria-label="Primary">
      <ul>${nav.map(([h, t]) => html`<li><a href="${h}" ${path === h ? raw('aria-current="page"') : ''}>${t}</a></li>`)}</ul>
    </nav>
    ${vaultCta(cfg, 'btn btn-navy btn-sm header-cta')}
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <div class="footer-logo"><img src="/img/rsd-logo.png" alt="Real Social Dynamics" width="150" height="40"></div>
      <p class="small${cfg.sellerLegalName ? '' : ' review-only'}">Seller: ${tokenOr(cfg, cfg.sellerLegalName, 'sellerLegalName')}${cfg.sellerPostalAddress ? html` · ${cfg.sellerPostalAddress}` : ''}</p>
      ${cfg.supportPhone ? html`<p class="footer-phone">Real Social Dynamics Support: ${supportPhoneLink(cfg)}${cfg.supportEmail ? html` · ${supportEmailLink(cfg)}` : ''}</p>` : ''}
    </div>
  </div>
  <div class="wrap legal-bar"><a href="/terms">Terms &amp; Conditions</a><span aria-hidden="true">·</span><a href="/privacy">Privacy Policy</a><span aria-hidden="true">·</span><a href="/terms#gdpr">GDPR &amp; Your Data Rights</a><span aria-hidden="true">·</span><a href="/support">Contact Support</a></div>
</footer>
${stickyCta ? html`<div class="sticky-cta" data-sticky hidden><span>Archive + package-only bonus</span>${vaultCta(cfg, 'btn btn-white btn-sm')}<button class="sticky-close" type="button" aria-label="Dismiss">×</button></div>` : ''}
</body>
</html>`;
}
