import { html } from '../lib/html.js';
import { preparationParagraph } from '../lib/claims.js';

export function faqItems(cfg) {
  const prepAnswer = cfg.preparationPolicyApproved
    ? 'For future RSD-operated programs expressly designated under the published preparation policy, the specified Foundations Path must be completed. Existing contracts are not changed.'
    : `${preparationParagraph(cfg)} Existing event contracts are not changed.`;
  return [
    ['What is the prequel collection?', 'A curated release of the specific historical RSD programs and editions listed on this page, organized for study and comparison. It is not every RSD program ever created.'],
    ['Is this only for men?', 'The programs were built primarily as dating coaching for men, and many examples reflect that. The communication, confidence, and inner-game material is open to anyone, and women are welcome to study it.'],
    ['Is this only for people who already succeeded in personal growth?', 'No. The invitation may resonate with customers familiar with later self-development programs, but you do not need to claim a particular result or meet an emotional benchmark to explore the archive.'],
    ['Will following an instructor produce the same results?', 'No result is guaranteed. Study the methods and context, think critically, and adapt appropriate ideas to your circumstances. Outcomes depend on many factors and other people\'s independent choices.'],
    ['Is Julien participating in the relaunch or conducting my call?', 'The named legacy programs are historical recordings. Their inclusion does not mean the original instructor participates in the relaunch. Your included call is with a current RSD Success Coach identified through the booking process.'],
    ['Are PIMP, SHIFT, and The Ten Game separate programs?', 'Yes. Each has its own edition and content list. '],
    ['What are the two exclusive launch bonuses?', 'One complimentary live Success Coaching Call and an invitation to the specified package-holder RSD Nation relaunch briefing, under the terms displayed beside the offer. They are attached to this launch package, not individual-course purchases.'],
    ['Does the RSD Nation invitation mean the whole community is paid or unavailable elsewhere?', 'No. The exclusive element is the package-holder briefing described here. It does not change existing public or customer community access.'],
    ['Does this buy me a bootcamp or global-tour ticket?', 'No. Those are separate programs with their own dates, coaches, eligibility, prices, and terms. Buying the archive does not guarantee admission or reserve a seat.'],
    ['Is archive study required before a bootcamp?', prepAnswer],
    ['Do I have to watch everything?', 'No. The published preparation path identifies the relevant lessons for an applicable live program. The wider archive remains a reference library.'],
    ['How fast do I get access?', cfg.instantAccessConfirmed ? 'Instantly. Your library unlocks as soon as your payment is confirmed by our payment provider.' : 'Your library is delivered after your payment is confirmed. Exact delivery timing will be stated here before launch.'],
    ['I already purchased one of these programs.', `Verify your existing entitlements before purchasing. We will identify what this release adds.${cfg.relaunchAssignmentsReady || cfg.isStaging ? ' Your original copies do not include the assignments and goal blocks built into this relaunch.' : ''} Valid existing access is not conditional on buying it again. Any upgrade credit requires a specific policy displayed at checkout.`],
    ['What if my old access is broken?', html`Use the <a href="/support">previous-purchase support route</a>. Support does not require another purchase.`],
    ['Are all old bonuses included?', 'No. Only the recordings and current benefits expressly listed in this offer are included. Old live calls, raffles, communities, discounts, or event days are not revived.'],
    ['What ends after 14 days?', `The launch price and the two package-only bonuses. ${cfg.postLaunchStatement || 'What remains available afterward will be stated here before launch; the recordings do not simply vanish.'}`],
    ['How do access, refunds, and statutory rights work?', cfg.refundPolicyVersion ? html`See the <a href="/refunds">refund terms</a> and <a href="/terms">terms of sale</a>.` : 'The approved terms will be published here verbatim before any sale. Nothing on this page waives rights you have by law.'],
  ];
}
