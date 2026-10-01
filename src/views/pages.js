import { html, raw } from '../lib/html.js';
import { claim, tokenOr, preparationParagraph, priceLine, supportPhoneLink, supportEmailLink, vaultCta } from '../lib/claims.js';
import { stats, julienSequence } from '../lib/catalog.js';
import { label, cover, programCard, packageCard, faq, deadline, banner } from './components.js';
import { instructorBlocks } from './instructors.js';

export function legacyPage(cfg, programs, catalog) {
  const { programCount, instructorCount } = stats(programs);
  const instructors = [...new Map(programs.filter((p) => !['multi'].includes(p.instructorKey)).map((p) => [p.instructorKey, p.instructor])).entries()];
  return html`<section class="band band-white page-head"><div class="wrap">
    ${banner('home-study')}
    <p class="eyebrow">The RSD Legacy Archive</p>
    <h1 class="h-xxl">This isn't one course. It's ${programCount} programs from ${instructorCount} instructors in one searchable library.</h1>
    <p class="lede">${stats(programs).lessonCount ? `${stats(programs).lessonCount} lessons in all. ` : ''}Every program below is part of this release. Filter by instructor or theme, or search by topic. Exact editions and contents are shown on each program page.</p>
    <form class="filters" role="search" data-filter aria-label="Filter programs">
      <label>Search <input type="search" name="q" placeholder="e.g. storytelling, online, inner game"></label>
      <label>Instructor <select name="instructor"><option value="">All instructors</option>${instructors.map(([k, n]) => html`<option value="${k}">${n}</option>`)}</select></label>
      <label>Collection <select name="collection"><option value="">All collections</option>${catalog.collections.map((c) => html`<option value="${c.id}">${c.title}</option>`)}</select></label>
      <p class="filter-count" aria-live="polite"><span data-count>${programCount}</span> programs shown <button type="button" class="btn btn-outline btn-sm" data-clear hidden>Clear</button></p>
    </form>
  </div></section>
  <section class="band band-mist" id="by-instructor" data-ins-section><div class="wrap"><h2 class="h-xl">Instructor by instructor: what you'll discover.</h2><div class="ins-grid">${instructorBlocks(cfg, programs)}</div></div></section>
  ${catalog.collections.map((c) => {
    const items = programs.filter((p) => p.collection === c.id);
    if (!items.length) return '';
    return html`<section class="band ${c.id === 'julien-prequel' ? 'band-mist' : 'band-white'} catalog-section" id="${c.id}" data-section>
      <div class="wrap"><h2 class="h-lg">${c.title}</h2><p class="small">${c.blurb}</p>
      <div class="pgrid">${items.map((p) => programCard(cfg, p))}</div></div></section>`;
  })}
  <section class="band band-navy"><div class="wrap center"><h2 class="h-lg">All ${programCount} programs, plus two package-only bonuses, for ${priceLine(cfg)}.</h2>${vaultCta(cfg, 'btn btn-white btn-lg')}</div></section>`;
}

export function programPage(cfg, p, state, programs) {
  const related = programs.filter((x) => x.collection === p.collection && x.id !== p.id).slice(0, 3);
  return html`<section class="band band-white page-head"><div class="wrap prog-grid">
    <div>
      <p class="eyebrow"><a href="/legacy">Archive</a> · ${p.instructor}${p.lessonCount ? html` · ${p.lessonCount} lessons` : ''}</p>
      <h1 class="h-xxl">${p.title}</h1>
      <p class="h-md">${p.cardHeadline}</p>
      <p class="lede">${p.shortCopy}</p>
      <p>${p.expandedCopy}</p>
      ${p.historicalNote ? html`<p>${label('history')} ${p.historicalNote.replace(/\s*\(R\d+[a-z]?(,\s*R\d+[a-z]?)*\)/g, '')}</p>` : ''}
      ${p.helpsWith ? html`<h2 class="h-sm">What this can help you work on</h2><dl class="helps">${p.helpsWith.map((h) => html`<div><dt>${h.title}</dt><dd>${h.text}</dd></div>`)}</dl>` : ''}
      ${p.closingLine ? html`<p class="pull">${p.closingLine}</p>` : ''}
      ${p.guestInstructors ? html`<h2 class="h-sm">Special guest instructors</h2><ul class="chips">${p.guestInstructors.map((g) => html`<li>${g.name}</li>`)}</ul>` : ''}
      <h2 class="h-sm">Themes</h2>
      <ul class="chips">${p.verifiedThemes.map((t) => html`<li>${t}</li>`)}</ul>
      <h2 class="h-sm">Best for</h2><p>${p.audienceFit}</p>
      <h2 class="h-sm">Edition &amp; contents</h2>
      ${p.editionId && p.curriculumStatus === 'verified' ? html`<p>Edition ${p.editionId}.</p>` : html`<p>Exact edition, running time, and recording list are published here once the archive files are inspected.${cfg.isStaging ? html`<span class="staging-flag">STAGING · manifest required before sale</span>` : ''}</p>`}
      <h2 class="h-sm">How to buy</h2>
      ${p.individualPriceCents && cfg.individualSalesEnabled ? html`<div class="buy-options">
        ${cfg.publicSite && !p.stripePaymentLink ? '' : html`<div class="buy-opt"><p class="buy-l">This program only</p><p class="buy-p">$${(p.individualPriceCents / 100).toFixed(0)}</p><p class="small">No launch bonuses.</p><a class="btn btn-outline btn-block" href="${p.stripePaymentLink || `/checkout?program=${p.slug}`}"${p.stripePaymentLink ? html` rel="noopener"` : ''}>Buy ${p.title.replace(/\s*\(.*\)$/, '')} only</a></div>`}
        <div class="buy-opt buy-best"><p class="buy-l">Best value · launch package</p><p class="buy-p">$${(cfg.priceCents / 100).toFixed(0)}</p><p class="small">This program plus every other program in the release, the live coaching call, and the RSD Nation briefing invitation.</p>${vaultCta(cfg, 'btn btn-navy btn-block')}</div>
      </div>` : html`<p>Available in the launch package.</p>`}
      ${p.excludesHistoricalLiveBenefits ? html`<p class="note">Historical live calls, communities, immersion days, raffles, and old bonuses attached to the original sale are not included.</p>` : ''}
    </div>
    <aside>${cover(p, { size: 'cover-lg' })}</aside>
  </div></section>
  <section class="band band-mist"><div class="wrap pkg-grid">
    <div><h2 class="h-lg">${p.title} is included in the launch package, with a live coaching call and your RSD Nation briefing invitation.</h2>
      ${related.length ? html`<h3 class="h-sm">Compare with</h3><ul class="related">${related.map((r) => html`<li><a href="/programs/${r.slug}">${r.title}</a> · ${r.instructor}</li>`)}</ul>` : ''}
    </div>
    ${packageCard(cfg, state, { id: 'pkg' })}
  </div></section>`;
}

export function welcomeBackPage(cfg, state, programs) {
  const julien = julienSequence(programs);
  return html`<section class="hero"><div class="wrap narrow">
    <p class="eyebrow eyebrow-light">A RETURN INVITATION FOR RETURNING RSD CUSTOMERS</p>
    <h1 class="mega mega-sm">You know Julien's transformation work. But have you seen what came before it?</h1>
    <p class="hero-body">Before Julien's later transformation work, there were years of RSD programs about confidence, social dynamics, dating, communication, identity, and real-world application. For the first time in this relaunch, explore the broader archive and the earlier chapters that came before the ideas you already know.</p>
    <p class="hero-body">This is a historical collection presented by RSD, not an announcement that Julien is joining the relaunch.</p>
    ${cfg.isStaging && !cfg.julienSequenceApproved ? html`<span class="staging-flag">STAGING · Julien-specific wording requires approved, included titles</span>` : ''}
    <div class="cta-row"><a class="btn btn-white btn-lg" href="/legacy#julien-prequel">Explore the RSD prequel</a></div>
  </div></section>
  <section class="band band-white"><div class="wrap">
    <h2 class="h-xl">The Julien chapters, in one place, next to ${stats(programs).instructorCount - 1} other instructors.</h2>
    <div class="pgrid">${julien.map((p) => programCard(cfg, p))}</div>
  </div></section>
  <section class="band band-mist"><div class="wrap narrow">
    <h2 class="h-xl">Already own part of the library? Check before you purchase again.</h2>
    <p>Many returning customers already own some of the programs in this release. Verify your purchase email to see what this release adds. Valid existing access is never conditional on buying again.</p>
    <div class="cta-row"><a class="btn btn-navy" href="/access">Check my existing access</a><a class="btn btn-outline" href="/support">Get help with a past purchase</a></div>
  </div></section>
  <section class="band band-white" id="package"><div class="wrap pkg-grid"><div><h2 class="h-xl">Add the earlier chapters, a live coaching call, and your RSD Nation briefing invitation.</h2><p class="lede">One package, ${priceLine(cfg)}, for the 14-day return promotion.</p></div>${packageCard(cfg, state)}</div></section>`;
}

export function preparationPage(cfg) {
  return html`<section class="band band-white page-head"><div class="wrap narrow">
    ${banner('bootcamp')}
    <p class="eyebrow">Preparation path</p>
    <h1 class="h-xxl">Before the bootcamp, build the foundation.</h1>
    <p>${label(cfg.preparationPolicyApproved ? 'policy' : 'planned')}</p>
    <p class="lede">${preparationParagraph(cfg)}</p>
    <p>This is new RSD orientation and editorial structure, not newly discovered historical course content. ${cfg.preparationPolicyApproved ? '' : 'It is a proposal under review by RSD\'s coaches and will be finalized before any program requires it.'}</p>
    <h2 class="h-lg">The proposed Foundations Path</h2>
    <ol class="path">
      <li><strong>Current RSD conduct and consent orientation.</strong> Written and reviewed by the current team.</li>
      <li><strong>One selected early-classics lesson</strong> for historical context.</li>
      <li><strong>One practical-communication lesson or exercise</strong> from the archive.</li>
      <li><strong>A short reflection</strong> on your chosen social-development goal and respectful practice boundaries.</li>
      <li><strong>Your Success Coaching Call</strong>, or an approved equivalent for existing owners.</li>
      <li><strong>A short preparation check</strong> specific to the live program you plan to attend.</li>
    </ol>
    ${cfg.isStaging ? html`<span class="staging-flag">STAGING · lesson asset IDs, applicable programs and completion rules not yet set</span>` : ''}
    <h2 class="h-lg">What it is not</h2>
    <ul>
      <li>Not a requirement to watch the entire archive.</li>
      <li>Not an accreditation, clinical assessment, dating score, or guarantee of eligibility.</li>
      <li>Not a new purchase requirement if you already hold valid access to the specified lessons.</li>
      <li>Not a change to any existing event contract.</li>
    </ul>
    <h2 class="h-lg">The historical precedent</h2>
    <p>${label('history')} In June 2007, Tyler wrote that his later bootcamps and products assumed familiarity with Foundations. That is one instructor's approach at the time, not proof that a package like this was ever compulsory.</p>
  </div></section>`;
}

export function globalTourPage(cfg) {
  return html`<section class="band band-white page-head"><div class="wrap narrow">
    ${banner('news')}
    <p class="eyebrow">Global tour</p>
    <h1 class="h-xxl">The next chapter: RSD live, around the world.</h1>
    <p>${label('planned')}</p>
    <p class="lede">RSD is planning new bootcamps and other live programs, with a global-tour rollout. Nothing on this page is a ticket, a reservation, or a confirmed date.</p>
    <table class="compare"><caption>Tour status</caption><thead><tr><th scope="col">Item</th><th scope="col">Status</th></tr></thead><tbody>
      <tr><th scope="row">Cities</th><td>Not yet announced</td></tr>
      <tr><th scope="row">Dates</th><td>Not yet announced</td></tr>
      <tr><th scope="row">Coaches</th><td>Not yet announced</td></tr>
      <tr><th scope="row">Prices</th><td>Not yet announced; sold separately from the archive</td></tr>
      <tr><th scope="row">Preparation requirement</th><td>${cfg.preparationPolicyApproved ? 'Published with each designated program' : 'Proposed; will be published with each program'}</td></tr>
    </tbody></table>
    ${(cfg.liveEvents || []).length ? html`<h2 class="h-lg">Live events open now</h2><ul class="live-links">${cfg.liveEvents.map((e) => html`<li><a href="${e.url}" rel="noopener" target="_blank"><strong>${e.label}</strong></a>: ${e.blurb}</li>`)}</ul><p class="small">Sold separately; not included in the archive package.</p>` : ''}
    <p>Package holders will hear the plans first-hand at the private RSD Nation relaunch briefing. Confirmed announcements will appear here.</p>
    ${vaultCta(cfg)}
  </div></section>`;
}

export function supportPage(cfg, { csrf, sent = false, error = '' } = {}) {
  return html`<section class="band band-white page-head"><div class="wrap narrow">
    ${banner('contact')}
    <p class="eyebrow">Support</p>
    <h1 class="h-xxl">Trouble with a past purchase? We'll help. No new order required.</h1>
    <p class="lede">If you can't access an RSD program you bought, tell us here. Resolving a valid access issue never depends on buying this package, and while your case is open you won't receive launch sales emails.</p>
    ${sent ? html`<div class="notice" role="status"><strong>Received.</strong> Your case is open. We have paused launch sales emails to this address until it's resolved.</div>` : ''}
    ${error ? html`<div class="notice notice-error" role="alert">${error}</div>` : ''}
    ${cfg.supportPhone ? html`<p class="support-phone">Prefer to talk? Call Real Social Dynamics Support at <strong>${supportPhoneLink(cfg)}</strong>${cfg.supportEmail ? html` or email <strong>${supportEmailLink(cfg)}</strong>` : ''}.</p>` : ''}
    <form method="post" action="/support" class="form" novalidate>
      <input type="hidden" name="csrf" value="${csrf}">
      <label for="s-email">Purchase email <span class="req">(required)</span></label>
      <input id="s-email" name="email" type="email" required autocomplete="email" aria-describedby="s-email-h">
      <p id="s-email-h" class="hint">${cfg.isStaging ? 'Staging accepts only synthetic addresses ending in .test or @example.com.' : 'The email you used when you purchased.'}</p>
      <label for="s-topic">What do you need help with?</label>
      <select id="s-topic" name="topic"><option value="access">I can't access a program I bought</option><option value="refund">Refund or billing question</option><option value="other">Something else</option></select>
      <label for="s-msg">Details</label>
      <textarea id="s-msg" name="message" rows="5" maxlength="2000"></textarea>
      <button class="btn btn-navy" type="submit">Open a support case</button>
    </form>
    
  </div></section>`;
}

export function policyPage(cfg, kind) {
  const titles = { terms: 'Terms of sale', privacy: 'Privacy notice', refunds: 'Refunds and statutory rights' };
  return html`<section class="band band-white page-head"><div class="wrap narrow">
    <h1 class="h-xxl">${titles[kind]}</h1>
    <p class="lede">The approved ${titles[kind].toLowerCase()} will be published here verbatim before any sale or data collection beyond this staging preview.</p>
    ${cfg.isStaging ? html`<span class="staging-flag">STAGING · owner/counsel must supply this policy</span>` : ''}
    <p>Nothing on this site waives rights you have under applicable consumer law.</p>
  </div></section>`;
}

export function publicSupportPage(cfg) {
  return html`<section class="band band-white page-head"><div class="wrap narrow">
    ${banner('contact')}
    <p class="eyebrow">Support</p>
    <h1 class="h-xxl">Already a customer, or need help with a past purchase? Call us.</h1>
    <p class="lede">Real Social Dynamics Support can check what you already own, fix access to a past purchase, and answer questions about the RSD Vault. No new order is required for help with something you already bought.</p>
    ${cfg.supportPhone ? html`<p class="support-phone">Call Real Social Dynamics Support: <strong>${supportPhoneLink(cfg)}</strong></p>
    ${cfg.supportEmail ? html`<p class="support-phone">Or email: <strong>${supportEmailLink(cfg)}</strong></p>` : ''}` : ''}
  </div></section>`;
}

export function aboutPage(cfg) {
  return html`<section class="band band-white page-head"><div class="wrap">
    ${banner('about')}
    <div class="narrow">
    <p class="eyebrow">About us</p>
    <h1 class="h-xxl">Real Social Dynamics: the company behind the archive.</h1>
    <p class="lede">For years, Real Social Dynamics ran live programs, bootcamps and seminars in cities around the world. This is how the company described itself in its own words, in the original company bio from its early years.</p>
    <h2 class="h-lg">- Company bio -</h2>
    <p class="note">The original RSD company bio, as published on realsocialdynamics.com in the company's early years. It's reproduced here as history; offices, programs and the Project Hollywood Mansion described below reflect that era.</p>
    <div class="bio">
      <p>Real Social Dynamics (RSD) is an international corporation, based out of Los Angeles, with branch offices developing in New York, London, Sydney, and San Francisco. Programs have been conducted in most major metropolitan English-speaking cities worldwide.</p>
      <p>Real Social Dynamics have conducted Live Programs for thousands of clients, including a diverse variety of individuals ranging from Fortune 100 executives, royalty, and celebrities...to college students and professionals from over 30 different countries.</p>
      <p>RSD specializes in image consultation, public representation, and integrating clients into social scenes.</p>
      <p>Live programs have typically been offered privately or via word of mouth, but are now made available for the public via the Internet and direct phone contact with the RSD Headquarters at its central office and main training facility, the Project Hollywood Mansion.</p>
      <p>The dating branch of RSD is a top-tier operation, run by the firm's best instructors, who dedicated all of their days and nights for the last few years meeting thousands of attractive women, and meeting the world's most popular dating book authors, image consultants, and executive coaches.</p>
      <p>Executive Management read and decided to meet the authors of thousands of amazing articles about dating the world's most attractive women. After spending years traveling around the world to meet these men and see them in the field, Executive Management hired those individuals who could demonstrate their skills in the field, while teaching others, to become RSD Instructors.</p>
      <p>RSD's Live Programs provide students the unique opportunity to meet these instructors, become their wingmen, and hire them as their personal coach and image consultant.</p>
    </div>
    <h2 class="h-lg">Today</h2>
    <p>Today, the recorded programs from that era are back in one place: the RSD Vault. ${cfg.supportPhone ? html`Questions? Call RSD at ${supportPhoneLink(cfg)}${cfg.supportEmail ? html` or email ${supportEmailLink(cfg)}` : ''}.` : ''}</p>
    <div class="cta-row">${vaultCta(cfg)}<a class="btn btn-outline btn-lg" href="/legacy">Explore the programs</a></div>
    </div>
  </div></section>`;
}
