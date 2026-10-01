import { html } from '../lib/html.js';
import { claim, tokenOr, preparationParagraph, priceLine, deliveryLine, yearsPhrase, supportPhoneLink, vaultCta } from '../lib/claims.js';
import { stats, julienSequence } from '../lib/catalog.js';
import { label, deadline, cover, packageCard, faq, countdownClock } from './components.js';
import { valueStack, verifiedTotal, stackNumbers } from './valueStack.js';
import { formatPrice } from '../lib/offer.js';
import { faqItems } from './faq.js';
import { instructorBlocks } from './instructors.js';

const SPOTLIGHT = ['foundations', 'blueprint-decoded', 'transformations', 'jeffy-show', 'resonator', 'boss', 'social-circle-blueprint', 'execute-the-program-2'];
const shortName = (p) => p.instructor.replace(/\s*\(.*\)$/, '').replace(/ (Blanc|Branson|Ackerman|Social)$/, '');

// Direct-response sales letter. Read only the <h2> headlines top to bottom and you get the whole offer
// (covered by test/public-output.test.js "headline skim test").
export function homePage(cfg, state, programs, catalog) {
  const { programCount, instructorCount } = stats(programs);
  const julien = julienSequence(programs);
  const vt = verifiedTotal(programs);
  const sn = stackNumbers(cfg, programs);
  const bonusCents = cfg.bonusValuesSubstantiated || cfg.isStaging ? (cfg.bonusValues?.successCallCents || 0) + (cfg.bonusValues?.briefingInviteCents || 0) : 0;
  const yrs = yearsPhrase(cfg), Yrs = yearsPhrase(cfg, { cap: true });
  const deadlineText = state.endsLocal || 'the announced deadline';
  const mosaic = programs.slice(0, 9);
  const names = [...new Set(programs.filter((p) => !['multi'].includes(p.instructorKey)).map(shortName))];
  const spotlight = SPOTLIGHT.map((id) => programs.find((p) => p.id === id)).filter(Boolean);
  const julienTitles = julien.filter((p) => p.id !== 'transformation-mastery').map((p) => p.title.replace(/\s*\(.*\)$/, ''));

  return html`
<section class="hero" aria-labelledby="hero-h">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow eyebrow-light">REAL SOCIAL DYNAMICS | 14-DAY RETURN SPECIAL</p>
      <h1 id="hero-h" class="hero-h1">You've done the inner work. Now put it to work.</h1>
      <p class="hero-sub">Go back to Julien Blanc's earlier RSD training, and ${yrs} of lessons from Tyler, Madison, Jeffy, and other instructors, to build greater social confidence, communicate more effectively, meet more people, and create your own blueprint for dating and social success.</p>
      <p class="hero-hook">You already know what personal transformation feels like on the inside. Now explore how RSD taught people to practice confidence, communication, and social skills in the situations where they actually matter.</p>
      <p class="hero-body"><strong>Study the lessons. Apply what fits. Get live guidance from an RSD Success Coach.</strong> Then arrive better prepared for the next generation of RSD live programs. For 14 days: the Complete RSD Legacy Archive (${programCount} programs from ${instructorCount} instructors), a live Success Coaching Call, and an exclusive RSD Nation relaunch-briefing invitation.</p>
      <p class="hero-price">Launch package: <strong>${priceLine(cfg)} one-time.</strong></p>
      <div class="cta-row">
        ${vaultCta(cfg, 'btn btn-white btn-lg')}
        <a class="btn btn-ghost btn-lg" href="/legacy">Explore the programs</a>
      </div>
      ${countdownClock(state, { tone: 'dark' })}
      <p class="hero-fine">"Complete" means every program and edition listed in this release, not every RSD product ever made. Both launch bonuses come only with this package during the promotion. Exact editions and access terms are listed below.</p>
    </div>
    <div class="hero-art" aria-label="Selected programs in the archive">
      <div class="mosaic">${mosaic.map((p) => cover(p))}</div>
    </div>
  </div>
</section>

<section class="band band-white authority" aria-labelledby="auth-h">
  <div class="wrap">
    <p class="eyebrow">The authority behind the archive</p>
    <h2 id="auth-h" class="h-xl">This isn't one course. It's ${yrs} of RSD teaching history in one place.</h2>
    <p class="lede">Before the personal-growth programs you may know, RSD's instructors were recording seminars, programs, and presentations on dating, communication, and social dynamics. RSD's own blog documents it from 2007. Here is the record, with confirmed history kept separate from what is new.</p>
    <div class="stats" role="list">
      <div role="listitem"><span class="stat">${programCount}</span><span class="stat-l">programs in this release</span></div>
      <div role="listitem"><span class="stat">${instructorCount}</span><span class="stat-l">instructors, compared side by side</span></div>
      <div role="listitem"><span class="stat">2</span><span class="stat-l">package-only live bonuses</span></div>
      ${cfg.customersServedDisplay && (cfg.customersServedSubstantiated || cfg.isStaging) ? html`<div role="listitem"><span class="stat">${cfg.customersServedDisplay}</span><span class="stat-l">customers served</span></div>` : ''}
    </div>
    <ol class="timeline">
      <li><span class="tl-year">2007</span><div>${label('history')}<p>RSD's blog identifies <strong>Foundations</strong>, the multi-instructor <strong>Transformations</strong>, and <strong>The Jeffy Show</strong> as recorded programs.</p></div></li>
      <li><span class="tl-year">2007</span><div>${label('history')}<p>Tyler describes Foundations as the recorded version of his conference material and says his later bootcamps and products assumed familiarity with it.</p></div></li>
      <li><span class="tl-year">2008</span><div>${label('history')}<p>The multi-day <strong>Blueprint</strong> presentation is discussed on the RSD blog: a connected framework rather than isolated tips.</p></div></li>
      <li><span class="tl-year">2014–18</span><div>${label('history')}<p>Official sales pages for <strong>PIMP</strong> (captured 2014), <strong>SHIFT</strong> (2015), <strong>Social Encrypted</strong> (2015 program), <strong>Social Circle Blueprint</strong> (2017), and <strong>The Resonator</strong> (2017) are preserved in the Internet Archive.</p></div></li>
      <li><span class="tl-year">2026</span><div>${label('policy')}<p>The archive reopens, curated for study and comparison, with a live Success Coaching Call from a current coach.</p></div></li>
      ${(cfg.liveEvents || []).length ? html`<li><span class="tl-year">Live</span><div>${label('live')}<p>Take it off the screen. RSD live events are open now:</p><ul class="live-links">${cfg.liveEvents.map((e) => html`<li><a href="${e.url}" rel="noopener" target="_blank"><strong>${e.label}</strong></a>: ${e.blurb}</li>`)}</ul><p class="small">Live events are sold separately and are not included in the archive package.</p></div></li>` : ''}
      <li><span class="tl-year">Next</span><div>${label('planned')}<p><strong>A new global RSD Nation.</strong> RSD is partnering with PUA Training, celebrity dating coaches, and other dating-coaching companies to build an entirely new global RSD Nation, with a new series of immersion programs, bootcamps, phone coaching, and more.*</p><p>${cfg.supportPhone ? html`<strong>Call us for details: ${supportPhoneLink(cfg)}</strong>` : ''}</p><p class="small">*We are actively recruiting new coaches.${cfg.supportPhone ? html` Interested? Call ${supportPhoneLink(cfg)}.` : ''}</p></div></li>
    </ol>
  </div>
</section>

<section class="band band-white letter" aria-labelledby="story-h">
  <div class="wrap narrow">
    <p class="eyebrow">The prequel</p>
    <h2 id="story-h" class="h-xl">Turn personal growth into real-world charisma, confidence, and connection.</h2>
    <p class="beats beats-plain">You can understand confidence intellectually.<br>You can watch hundreds of hours of personal-development training.<br>You can understand your beliefs, your identity, your emotions, and exactly what you should be doing.</p>
    <p><strong>But then life tests you.</strong></p>
    <p class="beats">You see someone you want to meet.<br>You walk into a room where you know nobody.<br>You have seconds to make a first impression.<br>You have to start the conversation.<br>You have to hold someone's attention.<br>You have to express your personality instead of hiding it.<br>You have to communicate what you want.<br>And you have to handle attraction, uncertainty, rejection, and pressure without disappearing back inside your head.</p>
    <p class="pull">That is where personal growth becomes real.</p>
    <p>The RSD Legacy Archive lets you study how Julien Blanc, Tyler, Madison, Jeffy, Luke, and other RSD instructors approached those real-world challenges from dramatically different perspectives.</p>
    <p>Not so you can become them. So you can take ${yrs} of lessons, compare what each instructor discovered, and speed up the process of finding what works for you.</p>
    <div class="growth">
      <div class="growth-item">
        <h3 class="h-md growth-h">Build confidence you can actually use.</h3>
        <p>Confidence isn't nearly as valuable if it disappears the moment you enter an unfamiliar room.</p>
        <p>Study how RSD instructors approached meeting people, beginning conversations, handling social pressure, expressing interest, developing presence, and becoming comfortable taking social initiative.</p>
        <div class="growth-benefit"><p class="benefit-label">The benefit to you:</p><p>You don't just learn about confidence. You get frameworks you can evaluate, practice, and adapt when confidence actually matters.</p></div>
      </div>
      <div class="growth-item">
        <h3 class="h-md growth-h">Become someone people want to talk to.</h3>
        <p>Knowing how to introduce yourself is useful. Knowing how to create an engaging conversation is far more powerful.</p>
        <p>This is where Madison's material becomes especially relevant. Study Madison's approach to conversation, body language, social presence, personality, self-expression, and presentation, and how Madison approached becoming more socially engaging rather than simply memorizing another collection of lines.</p>
        <div class="growth-benefit"><p class="benefit-label">The benefit to you:</p><p>Develop a stronger understanding of how your words, delivery, body language, personality, and presence work together, so you can become a more engaging communicator without pretending to be somebody else.</p></div>
      </div>
      <div class="growth-item">
        <h3 class="h-md growth-h">Develop charisma instead of waiting to be born with it.</h3>
        <p>What if charisma isn't simply something certain people are lucky enough to have?</p>
        <p>Study Madison's approach to conversation and social presence alongside Jeffy's emphasis on voice and expression, Tyler's frameworks around social behavior, and Julien Blanc's evolution from social training toward personal transformation.</p>
        <div class="growth-benefit"><p class="benefit-label">The benefit to you:</p><p>Instead of treating charisma as a mysterious personality trait, you can break communication down into elements you can observe, understand, and practice:</p><ul class="chips chips-dark"><li>Conversation</li><li>Presence</li><li>Expression</li><li>Body language</li><li>Voice</li><li>Confidence</li><li>Authenticity</li><li>Social awareness</li></ul><p>You don't need Madison's personality to learn from Madison's charisma. You need to understand the principles underneath it and decide how they apply to yours.</p></div>
      </div>
      <div class="growth-item">
        <h3 class="h-md growth-h">Learn from Julien Blanc's evolution.</h3>
        <p>If Julien Blanc's later transformation work changed the way you think about yourself, go backward and explore an earlier chapter.</p>
        <p>Study Julien Blanc's RSD-era material: how Julien approached confidence, communication, social interaction, and dating before the later personal-transformation era. Then compare the earlier Julien Blanc with the ideas you already know from his later work.</p>
        <div class="growth-benefit"><p class="benefit-label">The benefit to you:</p><p>Instead of seeing only Julien's eventual conclusions, you get another reference point for understanding the evolution of his ideas, and for deciding which lessons belong in your own development.</p></div>
      </div>
      <div class="growth-item">
        <h3 class="h-md growth-h">Study Tyler's frameworks.</h3>
        <p>Explore Tyler's earlier RSD material on social interaction, confidence, and behavior, and see how practical social situations connected with the larger framework Tyler developed and taught.</p>
        <div class="growth-benefit"><p class="benefit-label">The benefit to you:</p><p>You can examine both the internal and external sides of confidence instead of treating personal development and social ability as completely separate skills.</p></div>
      </div>
      <div class="growth-item">
        <h3 class="h-md growth-h">Study Madison's charisma.</h3>
        <p>Explore Madison's approach to conversation, presence, body language, personality, presentation, and social interaction, and how Madison thought about becoming more expressive, socially engaging, and comfortable showing personality in an interaction.</p>
        <div class="growth-benefit"><p class="benefit-label">The benefit to you:</p><p>You can identify specific elements of charisma to work on rather than simply telling yourself to "be more charismatic."</p><p class="beats">Learn what to observe.<br>Learn what to practice.<br>Learn where you may be holding yourself back.<br>Then develop a version of charisma that actually fits you.</p></div>
      </div>
      <div class="growth-item">
        <h3 class="h-md growth-h">Study Jeffy's expression.</h3>
        <p>Explore Jeffy's distinctive approach to voice, projection, humor, storytelling, energy, and self-expression.</p>
        <div class="growth-benefit"><p class="benefit-label">The benefit to you:</p><p>Communication isn't only about choosing the right words. How you say them can completely change the interaction.</p></div>
      </div>
      <div class="growth-item">
        <h3 class="h-md growth-h">Study different instructors without becoming a copy of any of them.</h3>
        <p>Julien Blanc isn't Madison. Madison isn't Tyler. Tyler isn't Jeffy. Jeffy isn't Luke. And in Transformations, special guest instructors Ozzie and Hoobie bring perspectives of their own. That's the advantage.</p>
        <p>One instructor may help you understand confidence. Another may change how you think about conversation. Another may help you recognize weak body language. Another may make you reconsider your voice and delivery. Another may give you a completely different perspective on social environments.</p>
        <div class="growth-benefit"><p class="benefit-label">The benefit to you:</p><p>Instead of forcing yourself into one instructor's personality, you can compare multiple approaches and assemble the lessons that make sense for your personality, goals, and life.</p></div>
      </div>
      <div class="growth-item">
        <h3 class="h-md growth-h">Turn "I know this" into "I can do this."</h3>
        <p>There's a huge difference between understanding something while watching a video and being able to use it when another human being is standing in front of you.</p>
        <p>The archive gives you material to study. Your real life gives you somewhere to practice it. And your included RSD Success Coaching Call gives you a chance to identify where to start.</p>
        <div class="growth-benefit"><p class="benefit-label">The benefit to you:</p><p>Less random consumption. Less wondering which program to watch next. More clarity about what you actually want to improve and which material may help you work on it.</p></div>
      </div>
    </div>
    <h3 class="h-xl growth-close">Don't try to become Julien Blanc. Don't try to become Tyler. Don't try to become Madison. Don't try to become Jeffy. Build the most confident, charismatic, and socially capable version of you.</h3>
    <p class="beats">Study Julien Blanc's evolution.<br>Study Tyler's frameworks.<br>Study Madison's charisma.<br>Study Jeffy's expression.<br>Study Luke's approach to social environment and community.</p>
    <p class="beats">Take the lessons that serve you.<br>Practice them.<br>Learn from what happens.<br>Keep what works. Discard what doesn't.<br>Respect the choices and boundaries of the people you meet.<br>And gradually build an approach to confidence, charisma, communication, dating, and social life that actually belongs to you.</p>
    <p class="pull">Study their blueprints. Build your own.</p>
    ${vaultCta(cfg)}
  </div>
</section>

<section class="band band-black" aria-labelledby="role-h">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-light">Role models without imitation</p>
    <h2 id="role-h" class="h-xl">Don't just study what they eventually taught. Study the road they took to get there.</h2>
    <p>If an instructor's later personal-development work resonates with you, the earlier archive gives you another reference point:</p>
    <ul class="qs">
      <li>What were they studying before?</li>
      <li>What problems were they trying to solve?</li>
      <li>What did they teach about confidence before they taught transformation?</li>
      <li>What changed? What stayed the same?</li>
      <li>What can you adapt to your own path?</li>
    </ul>
    <p>It isn't a spotless highlight reel or a promise of someone else's life. It's teaching from different eras, with ideas to examine rather than instructions to accept uncritically.</p>
    <p class="pull pull-light">Don't copy the person. Study the process.</p>
  </div>
</section>

${julien.length ? html`<section class="band band-white" aria-labelledby="julien-h" id="julien-prequel">
  <div class="wrap">
    <p class="eyebrow">Featured prequel sequence</p>
    <h2 id="julien-h" class="h-xl">Before Transformation Mastery, there was an earlier chapter: Julien's ${julienTitles.join(', ').replace(/, ([^,]*)$/, ', and $1')}.</h2>
    <p class="lede">Explore the RSD-era material that came before Julien's later personal-development work, and trace the shift from outward social performance toward identity, awareness, and transformation.</p>
    ${cfg.isStaging && !cfg.julienSequenceApproved ? html`<span class="staging-flag">STAGING · Julien wording renders publicly only once these titles are approved and included</span>` : ''}
    <ol class="sequence">
      ${julien.map((p, i) => html`<li class="seq-item">
        <span class="seq-n">${String(i + 1).padStart(2, '0')}</span>
        <div><h3><a href="/programs/${p.slug}">${p.title}</a></h3><p class="seq-head">${p.id === 'pimp' ? 'The earlier RSD dating-program chapter.' : p.cardHeadline}</p><p>${p.shortCopy}</p></div>
      </li>`)}
    </ol>
    <p class="note">These are separate programs, not four names for one course. Existing customers should check which editions they already own. These are archival recordings, not a new Julien program or an announcement that Julien is joining the relaunch.</p>
  </div>
</section>` : ''}

<section class="band band-mist" aria-labelledby="beyond-h">
  <div class="wrap">
    <p class="eyebrow">Beyond one instructor</p>
    <h2 id="beyond-h" class="h-xl">Different men. Different methods. ${instructorCount} instructors and one question: what can you learn from the paths they took?</h2>
    <p class="names">${names.join('. ')}.</p>
    <p class="lede">They didn't all teach the same thing. That's exactly why the archive matters. Choose an instructor to understand a perspective. Choose a theme to compare perspectives. Use it as a reference library, not a binge-watching obligation.</p>
    <div class="ins-grid">${instructorBlocks(cfg, programs)}</div>
  </div>
</section>

<section class="band band-white" aria-labelledby="spot-h">
  <div class="wrap">
    <p class="eyebrow">Inside the archive</p>
    <h2 id="spot-h" class="h-xl">You could hunt for these programs one at a time. Or unlock all ${programCount} in one place.</h2>
    <div class="spotlights">
      ${spotlight.map((p) => html`<article class="spot">
        <p class="pcard-meta">${p.title} · ${p.instructor}</p>
        <h3><a href="/programs/${p.slug}">${p.cardHeadline}</a></h3>
        <p>${p.shortCopy}</p>
        <a class="textlink" href="/programs/${p.slug}">${p.cta} →</a>
      </article>`)}
    </div>
    <div class="cta-row">${vaultCta(cfg)}<a class="btn btn-outline btn-lg" href="/legacy">See all ${programCount} programs</a></div>
  </div>
</section>

<section class="band band-mist" aria-labelledby="who-h">
  <div class="wrap narrow">
    <p class="eyebrow">Who it's for</p>
    <h2 id="who-h" class="h-xl">Built as dating coaching for men. Open to anyone who wants to communicate with confidence.</h2>
    <p>RSD's programs were created primarily as dating and social-skills coaching for men, and many of the examples reflect that. That is the honest context.</p>
    <p>But most of what the instructors spent their time explaining (confidence, presence, conversation, vocal delivery, humor, social circles, and the inner game behind all of it) isn't a men-only subject. Women are welcome to study the same material from the same instructors, compare the approaches, and take what's useful for their own social and professional lives.</p>
    <p>Either way, the standard today is the same: mutual interest, consent, and respect for boundaries.</p>
  </div>
</section>

<section class="band band-navy" aria-labelledby="value-h" id="value">
  <div class="wrap">
    <p class="eyebrow eyebrow-light">The value stack</p>
    <h2 id="value-h" class="h-xl">${sn.pricedCount
      ? `Add it up: bought separately, these ${sn.pricedCount} programs cost ${formatPrice(sn.separateCents)}${sn.bonusCents ? `. Add ${formatPrice(sn.bonusCents)} in bonuses and that's ${formatPrice(sn.totalCents)} in total value` : ''}. Your price for everything: ${priceLine(cfg)}.`
      : `Add it up: ${programCount} programs, a live coaching call, and a private briefing invitation, all for ${priceLine(cfg)}.`}</h2>
    <p class="lede lede-light">Every program below is sold on its own at the price shown. The launch package gives you all of them, plus two bonuses you can't buy separately, for ${priceLine(cfg)}. ${sn.totalCents > cfg.priceCents ? `You save ${formatPrice(sn.totalCents - cfg.priceCents)} off the total value.` : ''}</p>
    ${valueStack(cfg, programs)}
    <div class="cta-row cta-center">${vaultCta(cfg, 'btn btn-white btn-lg')}</div>
  </div>
</section>

<section class="band band-white" aria-labelledby="pkg-h" id="package">
  <div class="wrap pkg-grid">
    <div>
      <p class="eyebrow">The Complete RSD Legacy Archive</p>
      <h2 id="pkg-h" class="h-xl">Don't buy the chapters one at a time. Get the whole story, plus two package-only bonuses, for ${priceLine(cfg)}.</h2>
      <p class="lede">The Complete RSD Legacy Archive gives you every cleared program in this release, organized across instructors, eras, and themes. One library. One account. One place to study the evolution. ${claim(cfg, cfg.relaunchAssignmentsReady, 'New in this relaunch: assignments and goal blocks for each program, so the material turns into action.', '', 'needs assignments built')} ${deliveryLine(cfg)}</p>
      <h3 class="h-sm">During the 14-day return special, your package also includes:</h3>
      <ol class="bonus-list">
        <li><strong>A complimentary live RSD Success Coaching Call.</strong> A current RSD Success Coach helps you identify the material most relevant to your goals and build a practical starting plan.${bonusCents ? html` <strong>(${formatPrice(cfg.bonusValues.successCallCents)} value)</strong>` : ''}</li>
        <li><strong>An exclusive invitation to the package-holder RSD Nation relaunch briefing.</strong> Hear the next-chapter plans and how the community and separately sold live programs are intended to connect.${bonusCents && cfg.bonusValues.briefingInviteCents ? html` <strong>(${formatPrice(cfg.bonusValues.briefingInviteCents)} value)</strong>` : ''}</li>
      </ol>
      <p class="note">"Complete" means every program and edition expressly listed in this release. The call and briefing invitation are package-only launch bonuses; individual purchases don't include them. Bootcamp tuition, global-tour tickets, travel, accommodation, and future memberships aren't included. You'll see the full inventory, access duration, refund, coaching, and briefing terms again before checkout.</p>
    </div>
    ${packageCard(cfg, state)}
  </div>
</section>

<section class="band band-mist" aria-labelledby="b1-h">
  <div class="wrap narrow">
    <p class="eyebrow">Bonus 1 · free with the Complete Archive</p>
    <h2 id="b1-h" class="h-xl">${Yrs} of material. Where the hell do you start? Bonus 1: your live RSD Success Coaching Call.</h2>
    <p>That's why the package includes something recordings alone can't give you: a live conversation about <em>you</em>.</p>
    <p>Tell your coach where you are and where you want to go. They'll help you identify the material most relevant to your goals and build a practical starting plan. You can also ask how the preparation path relates to future RSD-operated live training.</p>
    <p>It's a real conversation with a current RSD Success Coach. It isn't a prerecorded video, and it isn't time with Julien or any other historical instructor. It's educational coaching, not therapy, and no further purchase is required. ${claim(cfg, cfg.callTermsApproved, 'If optional paid programs come up, your coach says so first. The call is never a disguised sales appointment.', '', 'disclosure policy')}</p>
    <dl class="terms">
      <div><dt>Length</dt><dd>${claim(cfg, cfg.callTermsApproved, `${cfg.callDurationMinutes} minutes, one-to-one video`, '', 'proposed')}</dd></div>
      <div><dt>Book within</dt><dd>${claim(cfg, cfg.callTermsApproved, `${cfg.bookingWindowDays} days of purchase`, '', 'proposed')}</dd></div>
      <div><dt>Completed within</dt><dd>${tokenOr(cfg, cfg.completionWindowDays && `${cfg.completionWindowDays} days`, 'completionWindow')}</dd></div>
      <div><dt>Rescheduling</dt><dd>${tokenOr(cfg, cfg.reschedulePolicy, 'reschedulePolicy')}</dd></div>
      <div><dt>Booking</dt><dd>Private booking link in your account after purchase</dd></div>
    </dl>
    ${vaultCta(cfg, 'btn btn-navy btn-lg')}
  </div>
</section>

<section class="band band-black" aria-labelledby="b2-h">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-light">Bonus 2 · package holders only</p>
    <h2 id="b2-h" class="h-xl">This archive is the past. Bonus 2 is about what comes next: your invitation to the private RSD Nation relaunch briefing.</h2>
    <p>Complete Archive customers during this launch receive an exclusive invitation to the RSD Nation relaunch briefing, reserved for this package's holders.</p>
    <p>See the direction of the new community, hear what's being developed, and learn about future programs as they're confirmed. ${label('planned')}</p>
    <p>The exclusive part is this specific briefing. Ordinary RSD Nation access is unchanged, and the invitation doesn't include future paid events or memberships.</p>
    <dl class="terms terms-dark">
      <div><dt>When</dt><dd>${tokenOr(cfg, cfg.briefingDate, 'briefingDateAndTime')}</dd></div>
      <div><dt>Format</dt><dd>${claim(cfg, cfg.briefingTermsApproved, cfg.briefingFormat, '', 'proposed')}</dd></div>
      <div><dt>Hosts</dt><dd>${tokenOr(cfg, cfg.briefingHosts, 'confirmedHosts')}</dd></div>
      <div><dt>Commitment</dt><dd>${tokenOr(cfg, cfg.briefingDeliveryDeadline && `Held by ${cfg.briefingDeliveryDeadline}`, 'briefingDeliveryCommitment')}</dd></div>
    </dl>
    ${vaultCta(cfg, 'btn btn-white btn-lg')}
  </div>
</section>

<section class="band band-white" aria-labelledby="prep-h">
  <div class="wrap narrow">
    <p class="eyebrow">Preparation for live training</p>
    <h2 id="prep-h" class="h-xl">The videos are the preparation. The next chapter of RSD bootcamps happens live.</h2>
    ${label('planned')}
    <p>RSD is developing the next generation of live experiences and a planned global tour. Cities, dates, formats, coaches, and fees will be announced only when confirmed.</p>
    <p>${preparationParagraph(cfg)} ${cfg.preparationPolicyApproved ? '' : label('policy')} The idea is simple: cover the fundamentals before you arrive, then use live time for practice, feedback, and coaching.</p>
    <p class="pull">Study before you arrive. Show up ready to work.</p>
    <p>You don't need to complete every course in the archive. Buying the archive doesn't reserve a bootcamp place, guarantee acceptance, or pay future tuition. If you already hold valid access to the relevant lessons, you can show it without buying them again. Existing event contracts are unchanged.</p>
    <a class="btn btn-outline" href="/preparation">See the preparation path</a>
  </div>
</section>

${cfg.tylerPrecedentApproved || cfg.isStaging ? html`<section class="band band-mist" aria-labelledby="hist-h">
  <div class="wrap narrow">
    <p class="eyebrow">Historical precedent</p>
    <h2 id="hist-h" class="h-xl">Preparation has a place in RSD's history.</h2>
    ${label('history')}
    <p>In a June 2007 RSD post, Tyler described familiarity with Foundations as preparation for his later teaching: study selected material first, then use live time for questions, feedback, and application.</p>
    <p class="note">This is a historical description of his approach, not a statement that he's participating in the relaunch or that this package was required in 2007.</p>
    ${cfg.isStaging && !cfg.tylerPrecedentApproved ? html`<span class="staging-flag">STAGING · renders publicly only with approved historical attribution</span>` : ''}
  </div>
</section>` : ''}

<section class="band band-navy" aria-labelledby="why-h">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-light">The deadline</p>
    <h2 id="why-h" class="h-xl">In 14 days, this offer changes.</h2>
    <p>Not "everything disappears forever." Here's exactly what happens: the ${priceLine(cfg)} Complete Archive launch price and both launch-only bonuses end at <strong>${deadlineText}</strong>.</p>
    <p>This is the insider window, ahead of RSD's planned full-catalog relaunch and new live programs ${label('planned')}. The private RSD Nation relaunch briefing is reserved for people who hold this package. If you want to be in that room when the next chapter is explained, this is your ticket.</p>
    <p>${claim(cfg, Boolean(cfg.postLaunchStatement), cfg.postLaunchStatement || 'What remains available after the deadline will be stated here.', '', 'post-launch availability must be stated')} The deadline is the same for everyone, and we won't reset it for returning visitors.</p>
    ${countdownClock(state, { tone: 'navy', size: 'clock-lg' })}
    ${vaultCta(cfg, 'btn btn-white btn-lg')}
  </div>
</section>

<section class="band band-white" aria-labelledby="own-h" id="existing">
  <div class="wrap">
    <p class="eyebrow">Existing customers</p>
    <h2 id="own-h" class="h-xl">Already bought RSD training? Good. Don't pay twice.</h2>
    <div class="two-col">
      <div>
        <p>Check what you already own before you purchase, and see exactly what this release adds: the chapters you don't have, the organization, and the two launch bonuses.</p>
        <p class="callout"><strong>Already have some of these programs?</strong> ${claim(cfg, cfg.relaunchAssignmentsReady, "Your original copies don't include the assignments and goal blocks we've built into this relaunch of the programs. Each one now comes with practical assignments and goal blocks to help you turn what you watch into action.", '', 'assignments & goal blocks must exist before launch')} ${label('policy')}</p>
        <p>Having trouble accessing a previous purchase? Contact support before placing another order${cfg.supportPhone ? html`, or call RSD Support at ${supportPhoneLink(cfg)}` : ''}. Fixing a valid access issue never depends on buying this package.</p>
        <div class="cta-row"><a class="btn btn-navy" href="/access">Check my existing access</a><a class="btn btn-outline" href="/support">Get help with a past purchase</a></div>
        ${claim(cfg, Boolean(cfg.upgradeCreditPolicy), cfg.upgradeCreditPolicy || '', '', 'no upgrade credit unless a policy is approved')}
      </div>
      <div>
        <table class="compare">
          <caption>What is genuinely additional in this package</caption>
          <thead><tr><th scope="col">Item</th><th scope="col">RSD Nation free classics</th><th scope="col">This package</th></tr></thead>
          <tbody>
            <tr><th scope="row">Legacy RSD dating &amp; social programs listed here</th><td>Some classics advertised free in members area</td><td>✓ exact editions listed</td></tr>
            <tr><th scope="row">Transformation Mastery</th><td>—</td><td>✓</td></tr>
            <tr><th scope="row">Curated prequel library &amp; preparation path</th><td>—</td><td>✓</td></tr>
            <tr><th scope="row">New assignments &amp; goal blocks for each program</th><td>—</td><td>✓ new in this relaunch</td></tr>
            <tr><th scope="row">Live Success Coaching Call</th><td>—</td><td>✓ package only</td></tr>
            <tr><th scope="row">Private RSD Nation relaunch briefing</th><td>Ordinary access unchanged</td><td>✓ package only</td></tr>
          </tbody>
        </table>
        ${cfg.isStaging ? html`<span class="staging-flag">STAGING · audit real RSD Nation and prior-bundle inventories before publishing</span>` : ''}
      </div>
    </div>
  </div>
</section>

<section class="band band-mist" aria-labelledby="ctx-h">
  <div class="wrap narrow">
    <p class="eyebrow">Historical-content note</p>
    <h2 id="ctx-h" class="h-xl">Yes, some of this material is old. That's why it's called an archive.</h2>
    <p class="beats">Platforms changed. Culture changed. Dating changed. RSD changed.</p>
    <p>We're not pretending otherwise. The point is to let you study the original material in its historical context, compare approaches, and decide what's still useful to you today.</p>
    <p>Terminology, norms, and the instructors' own views may differ from current practice, and inclusion doesn't mean every statement reflects RSD's position today or that the original instructor is part of this relaunch. Current RSD coaching emphasizes mutual interest, consent, respect for boundaries, and lawful conduct. Persistence is never a reason to ignore a "no". The old recordings haven't been rewritten to these standards. They're presented as history, and you and your coach bring today's judgment.</p>
  </div>
</section>

<section class="band band-white" aria-labelledby="faq-h" id="faq">
  <div class="wrap narrow">
    <p class="eyebrow">Questions</p>
    <h2 id="faq-h" class="h-xl">Straight answers before you decide.</h2>
    ${faq(faqItems(cfg))}
  </div>
</section>

<section class="band band-black close" aria-labelledby="close-h">
  <div class="wrap narrow center">
    <p class="eyebrow eyebrow-light">Final word</p>
    <h2 id="close-h" class="h-xxl">You've seen the sequel. Now watch the prequel.</h2>
    <p class="beats beats-center">Before the transformation programs.<br>Before the later philosophies.<br>Before the instructors became the people you recognize today.</p>
    <p>There were years of experiments, frameworks, successes, mistakes, teaching, and evolution. The archive lets you study that history for yourself.</p>
    <p class="close-stack"><strong>THE COMPLETE RSD LEGACY ARCHIVE</strong><br><strong>+ LIVE RSD SUCCESS COACHING CALL</strong><br><strong>+ EXCLUSIVE RSD NATION RELAUNCH-BRIEFING INVITATION</strong></p>
    <p class="close-price">${priceLine(cfg)}: 14-day return special</p>
    ${countdownClock(state, { tone: 'dark' })}
    ${vaultCta(cfg, 'btn btn-white btn-lg')}
    <p class="hero-fine">Offer ends ${deadlineText}. Package-only bonuses; published booking and briefing terms apply. Live-tour admission and bootcamp tuition sold separately.</p>
    <p class="sign-off">Study the past. Build your next chapter.</p>
  </div>
</section>

<section class="band band-white letter ps" aria-label="Postscript">
  <div class="wrap narrow">
    <p><strong>P.S.</strong> If you skimmed straight to the bottom, here it is in one breath: ${programCount} historical RSD programs from ${instructorCount} instructors, one live call with a current RSD Success Coach, and a private invitation to the RSD Nation relaunch briefing, all for ${priceLine(cfg)} until ${deadlineText}. After that, the launch price and both bonuses end. ${vaultCta(cfg, 'textlink')} →</p>
    <p><strong>P.P.S.</strong> Already bought an RSD program and can't get in? Don't buy it again. <a href="/support">Get help with your past purchase</a>${cfg.supportPhone ? html` or call ${supportPhoneLink(cfg)}` : ''}. Support never requires a new order.</p>
  </div>
</section>`;
}
