// Launch countdown series (owner request, 2026-10-01): launch ("2 weeks available"), 7 days, 3 days, 2 days, 12 hours.
// Numbers are computed from the live catalog/config so emails always match the site.
import { loadConfig } from '../../src/lib/config.js';
import { publicPrograms, stats } from '../../src/lib/catalog.js';
import { formatPrice } from '../../src/lib/offer.js';

const cfg = loadConfig({ mode: 'staging', publicSite: true });
const programs = publicPrograms(cfg);
const { programCount, lessonCount } = stats(programs);
const separate = programs.reduce((s, p) => s + (p.individualPriceCents || 0), 0);
const call = cfg.bonusValues?.successCallCents || 0;
const brief = 0; // briefing no longer valued in the stack (owner, 2026-10-01)
const total = separate + call + brief;
const $ = (c) => formatPrice(c);
const PRICE = $(cfg.priceCents);
const VAULT = cfg.vaultCheckoutUrl || '{{siteUrl}}/#package';
const SITE = '{{siteUrl}}/?utm_source=email&utm_campaign=rsd-vault-countdown';
const CTA = { cta: { label: 'CLICK HERE TO GET THE RSD VAULT', url: VAULT } };
const SEE = { cta: { label: 'SEE EVERYTHING INSIDE', url: SITE, secondary: true } };
const SIG = { sig: ['The RSD Team', 'Real Social Dynamics'] };
const SUPPORT = `Questions? Call RSD Support at ${cfg.supportPhone || '310-202-9002'}${cfg.supportEmail ? ` or email ${cfg.supportEmail}` : ''}. Already own some of these programs and can't get in? Contact us before buying again; support never requires a new order.`;
const STACK = {
  list: [
    `The RSD Vault: ${programCount} programs, ${lessonCount} lessons, from Julien Blanc, Tyler, Madison, Jeffy, Luke and more (${$(separate)} if bought separately)`,
    `Bonus 1: a live 1-on-1 RSD Success Coaching Call plus dedicated permanent lifetime access on phone (${$(call)} value)`,
    `Bonus 2: your private invitation to the RSD Nation relaunch briefing`,
    `New for this relaunch: assignments and goal blocks for each program`,
  ],
};
const VALUE_LINE = `Total value: ${$(total)}. Your price during the launch: ${PRICE} one-time.`;
const BASE = { kind: 'marketing', segments: ['A', 'B', 'C', 'D', 'E', 'F'], series: 'vault-countdown' };

export const COUNTDOWN_EMAILS = [
  {
    ...BASE, id: 'vault-01-launch-2-weeks', dayOffset: 0,
    subjects: ['Get Access to the Special Launch for the RSD Vault', 'RSD is back. The Vault is open for 2 weeks.', 'What did Julien Blanc know before teaching personal transformation?', `${lessonCount} RSD lessons. ${PRICE}. 2 weeks.`],
    preheader: `${programCount} programs, ${lessonCount} lessons, a live coaching call, and an RSD Nation invitation. Open for 14 days.`,
    blocks: [
      'Hi {{firstNameOrThere}},',
      'RSD is back.',
      'For the next 2 weeks, the RSD Vault is open: the original Real Social Dynamics training that came before the personal-transformation programs you may already know.',
      `Inside: ${programCount} programs and ${lessonCount} lessons from Julien Blanc, Tyler, Madison, Jeffy, Luke and more. PIMP, SHIFT and The Ten Game. Foundations and The Blueprint Decoded. The Boss and Get Your Ten. Social Circle Blueprint. The Resonator. Transformations, with special guests Ozzie and Hoobie.`,
      'Personal growth is theory until life tests it. These programs show how RSD instructors put confidence, conversation, charisma and social skills to work in the situations where they actually matter.',
      'Here is everything you get:',
      STACK,
      VALUE_LINE,
      CTA,
      'Don\'t copy the person. Study the process. Then use your live coaching call to build a plan that fits you.',
      'The launch price and both bonuses are available for 2 weeks, until {{launchEndLocal}}.',
      SEE,
      SIG,
      { note: SUPPORT },
    ],
  },
  {
    ...BASE, id: 'vault-02-7-days-left', dayOffset: 7, sendAt: 'deadline-minus-7d',
    subjects: ['7 Days Left: Get Access to the Special Launch for the RSD Vault', '7 days left: the RSD Vault', 'One week left to get the RSD Vault + both bonuses', 'Halfway there: 7 days left'],
    preheader: `${PRICE} for ${programCount} programs and ${lessonCount} lessons, plus a live coaching call. 7 days left.`,
    blocks: [
      'Hi {{firstNameOrThere}},',
      'The RSD Vault launch is halfway done. You have 7 days left.',
      `In one place: ${lessonCount} lessons from the instructors who taught confidence, conversation and charisma before the transformation era. Study Julien Blanc's earlier chapters. Study Tyler's frameworks. Study Madison's charisma. Study Jeffy's delivery. Study Luke's social circles.`,
      'And with ' + lessonCount + ' lessons, the real question is where to start. That is exactly what your included live RSD Success Coaching Call is for: a current coach helps you pick the right material and build a practical starting plan.',
      STACK,
      VALUE_LINE,
      CTA,
      'The launch price and both bonuses end {{launchEndLocal}}.',
      SIG,
      { note: SUPPORT },
    ],
  },
  {
    ...BASE, id: 'vault-03-3-days-left', sendAt: 'deadline-minus-3d',
    subjects: ['3 Days Left: Get Access to the Special Launch for the RSD Vault', '3 days left on the RSD Vault', 'Only 3 days left: archive + coaching call + RSD Nation invitation', 'Before the bootcamp, build the foundation (3 days left)'],
    preheader: `The ${PRICE} launch price and both bonuses end in 3 days.`,
    blocks: [
      'Hi {{firstNameOrThere}},',
      'Three days left.',
      'In 3 days, this offer changes. The launch price and both bonuses (the live Success Coaching Call and your private RSD Nation relaunch-briefing invitation) end on {{launchEndLocal}}.',
      'RSD is building the next chapter: new bootcamps, immersions, and a global RSD Nation. The Vault is how you prepare. Study before you arrive. Show up ready to work.',
      STACK,
      VALUE_LINE,
      CTA,
      'Already bought RSD training before? Good. Don\'t pay twice. Your original copies don\'t include the new assignments and goal blocks in this relaunch, and our support team can check what you already own.',
      SIG,
      { note: SUPPORT },
    ],
  },
  {
    ...BASE, id: 'vault-04-2-days-left', sendAt: 'deadline-minus-48h',
    subjects: ['48 Hours Left: Get Access to the Special Launch for the RSD Vault', '48 hours left', '2 days left: the RSD Vault', 'You\'ve had 12 days. Now there are 48 hours left.'],
    preheader: `48 hours left to get ${programCount} programs, ${lessonCount} lessons and both bonuses for ${PRICE}.`,
    blocks: [
      'Hi {{firstNameOrThere}},',
      'You\'ve had 12 days. Now there are 48 hours left.',
      `${programCount} programs. ${lessonCount} lessons. A live coaching call. An insider invitation to the RSD Nation relaunch briefing. ${PRICE}.`,
      `Bought one at a time, the programs alone come to ${$(separate)}. With both bonuses, that's ${$(total)} in total value.`,
      CTA,
      'When the deadline passes on {{launchEndLocal}}, the launch price and both bonuses end. We won\'t reset the clock.',
      SIG,
      { note: SUPPORT },
    ],
  },
  {
    ...BASE, id: 'vault-05-12-hours-left', sendAt: 'deadline-minus-12h',
    subjects: ['12 Hours Left: Get Access to the Special Launch for the RSD Vault', '12 hours left', 'Tonight: the RSD Vault launch closes', 'Last call: 12 hours left on the RSD Vault'],
    preheader: `The ${PRICE} launch price and both bonuses end in 12 hours.`,
    blocks: [
      'Hi {{firstNameOrThere}},',
      '12 hours left.',
      'This is the last reminder. At {{launchEndLocal}}, the RSD Vault launch closes, and the launch price and both bonuses go with it.',
      STACK,
      VALUE_LINE,
      CTA,
      'You\'ve seen the sequel. Now watch the prequel. Study their blueprints. Build your own.',
      SIG,
      { note: SUPPORT },
    ],
  },
];
