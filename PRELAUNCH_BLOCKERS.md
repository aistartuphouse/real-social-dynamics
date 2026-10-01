# PRELAUNCH BLOCKERS: RSD IS BACK / The RSD Legacy Archive

Status as of **October 1, 2026**: **Not launch-ready.** The staging site, sales letter, catalog, value stack, email templates, and disabled automations are built and tested (34/34 tests pass). Production mode **fails closed**: no checkout, no programs listed, no email dispatch, and no indexing until every item below marked 🔴 is resolved.

Nothing has been deployed, sent, imported, charged, or changed in DNS.

The live gate status is at `/admin/readiness` in staging. Owners are named in each table.

---

## 1. Commercial decisions (owner must decide)

| # | Blocker | What's needed | Owner |
|---|---|---|---|
| C1 🔴 | **Price not approved** | Confirm $997 one-time (config `priceApproved`). The optional $1,997 future price stays hidden and must never be called a "former price". | Nikky |
| C2 🔴 | **No launch dates** | Exact `launchStartsAtUTC` / `launchEndsAtUTC`. Staging uses a preview window (ending Oct 14, 11:59 PM PT) that is **not** a real deadline. | Nikky |
| C2b ✅ | **Support phone** set to 310-202-9002 (footer, support page, existing-customer section, checkout, P.P.S., email footers). Support email support@rsdnation.com added too (footer, support page, existing-customer section, checkout area, P.P.S., emails). Confirm both are monitored during the launch window. Support email changed to support@rsdnation.com at owner direction; confirm that mailbox exists and is monitored (rsdnation.com email is unaffected by the realsocialdynamics.com DNS move). | Operations |
| C3 🔴 | **Legal seller unknown** | The legal entity that sells, plus a valid postal address. These appear in the footer, checkout, and every email. Is it RSD, Self Mastery Co, or another entity? | Nikky + counsel |
| C4 🔴 | **Refund and statutory-rights terms** | Approved text for `/refunds` and `/terms`. No money-back guarantee is advertised until one exists. | Counsel |
| C5 🔴 | **Archive access duration** | Lifetime, N years, or another term. Nothing currently says "lifetime". | Nikky |
| C6 🔴 | **Tax treatment** | Sales tax / VAT handling and the disclosure line next to the price. | Finance |
| C7 🔴 | **What happens after day 14** | One sentence (`postLaunchStatement`): do the recordings stay for sale, at what price, and without the bonuses? The page cannot imply the recordings disappear. | Nikky |
| C8 🟡 | **Upgrade credit for existing owners** | Decide whether owners of PIMP, SHIFT, or Transformation Mastery get a credit. Until a policy exists, the site promises none. | Nikky |
| C9 🔴 | **Individual program prices (set Oct 1 at your direction)** | All 25 programs now have a standalone price, **raised by $300 each at your direction** ($367–$749; **$13,341 total**, $13,635 with bonus values). Programs with an archived original price use that price; the rest are priced in line with them. Each can genuinely be bought on its own from its program page, without bonuses. The value stack adds these up. For the "bought separately" comparison to be lawful (FTC 16 CFR 233), the programs must really be offered at these prices, in good faith, for a reasonable period. The FTC's classic example of a fictitious comparison is a price raised only to make a bundle look like a bargain, so be ready to show genuine individual sales at these prices. Approve them with `individualPricesApproved: true`; edit any price via `individualPriceCents` in `data/catalog.json`. | Nikky |

## 2. Value stack and historical prices (you asked for Wayback pricing)

The value stack is built. It shows **8 programs with verified original prices adding up to $2,122**, plus the $197 call and $97 briefing values, for **$2,416 total value** against your $997 package. (3 Girls a Day, $67, dropped out when Todd's programs were removed.)

| Program | Price used | Capture | Notes |
|---|---|---|---|
| Foundations | $269 | getfoundations.com, Dec 2007 | CD price. DVD and 2017 digital were $369. |
| The Blueprint Decoded | $449 | blueprintdecoded.com, Feb 2009 | CD price. DVD was $599. |
| Flawless Natural | $169 | flawlessnatural.com, Jan 2009 | CD price. DVD was $269. |
| PIMP | $197 | pimpingmygame.com, Sep 2014 | Standard tier. Platinum $397, Diamond $497. |
| SHIFT | $297 | makingashift.com, May 2015 | Natural tier. $497 / $597 tiers. |
| Resonator | $197 | rsdresonator.com, Jan 2018 | Attack tier. Captured about 6 months after launch. |
| Social Encrypted | $247 | socialencrypted.com, Jan 2016 | White tier. Medium confidence: no RSD corporate footer. |
| Social Circle Blueprint | $297 | socialcircleblueprint.com, May 2017 | Standard tier. |
| ~~3 Girls a Day~~ | ~~$67~~ | 3girlsaday.com, Jan 2015 | Removed with Todd's programs. |

Decisions and blockers:

- **V1 🔴 Approve the comparison.** Historical-price comparisons fall under FTC former-price rules (16 CFR 233) and state law. Counsel should approve `historicalPriceComparisonApproved` before production. Until then, production hides all prices and staging shows them with a STAGING flag.
- **V2 · I used the lowest price on each page, not the top tier.** Using the top tiers would have produced a much bigger number ($3,889 for the same 9 programs). Those tiers included live calls and bonuses that this package does not revive, so I didn't use them. Tell me if you want a different rule; it is a one-line data change in `data/historical-prices.json`.
- **V3 · The old pages' "total value" figures were ignored** (PIMP's $5,481, SHIFT's $7,785, and so on). The brief bars reviving inflated valuations.
- **V4 🔴 Bonus 1 is now the coaching call plus "dedicated permanent lifetime access on phone", valued at $997 (your direction); the $97 briefing value was removed from the stack.** A lifetime phone-coaching promise is an open-ended service commitment: define what "lifetime access" includes (hours, scheduling, who staffs it, what happens if RSD stops operating) and staff for it before selling. Previously: It shows in the value stack and package card, and the RSD Nation briefing is valued at $97. The stack now adds a "Total value" row ($2,416). To show it in production, RSD must actually sell a comparable call on its own at $497 (FTC free-with-purchase guidance); then set `bonusValuesSubstantiated: true`. The same applies to the $97 briefing value: RSD would need to sell comparable briefing or event access for $97.
- **V5 🟡 Prices not found for 15 programs:** Transformations, The Jeffy Show, Hot Seat at Home, TenGame, Transformation Mastery, NRYNE, Evolutions, Lifestyle Academy, Ten Commandments of Game, BOSS, Energy Awareness, Daygame by Todd, Text & Dates Machine, Valentine University, and Women. If you have old order records or sales-page exports, the stack will grow. Best next lead: `rsdhotseat.com/offer` (2017).
- **V6 🟡 Execute the Program:** the priced page ($197) is "The Program by RSD Jeffy". It is not confirmed to be the **2.0** edition in this release, so it isn't counted.
- **V7 🟡 Link destinations:** one archived Social Circle Blueprint page names a Max bonus. We link to the capture as evidence only. If you want zero Max references even at link destinations, swap that source link for a screenshot you host.

## 3. Rights, product identity, and the actual files (blocks every program)

Every program is currently `candidate`, not `approved`. **Production lists zero programs** until each record has a verified edition, curriculum, rights, approved copy and media, and a working, playable file manifest.

| # | Blocker | Owner |
|---|---|---|
| R1 🔴 | **Playable archive manifest**: actual files, editions, and running times for all 25 candidate programs (`includedAssetIds`, `editionId`). | Content / Nikky |
| R2 🔴 | **Rights confirmation** for the recordings, cover art, music, and any third-party footage or testimonials. Rights to a course don't automatically cover the photography or music in it. | Counsel |
| R3 🔴 | **Hot Seat at Home footage**: identifiable people appear in interaction footage, so distribution consent needs review. | Counsel |
| R4 🟡 | **On hold, never public: RSD Mastermind** (versus the Hot Seat Mastermind tier), **Founder's Lab / Founders Club** (unidentified), **Social Circle Blueprint 2.0** (revision differences unmapped), and the **supplemental recordings** list. | Nikky |
| R4c 🔴 | **Todd Valentine / VanDeHey litigation.** You shared a U.S. District Court order (Judge Jennifer A. Dorsey) in *Todd VanDeHey v. Real Social Dynamics, Inc.; Nicholas Kho; Owen Cook; Amber Kho* over **Valentine Life**. It compelled arbitration in part and stayed the case. Before selling **3 Girls a Day, Daygame by Todd, Text & Dates Machine, Valentine University, and Women**, or using Todd's name in headlines and bullets, counsel must confirm that RSD holds clear distribution rights and that the arbitration or any settlement doesn't restrict them. **Update (owner decision, Oct 1):** Todd's five programs were removed, re-added, then **removed again for now** (owner decision, Oct 1). They're on `hold`, absent from every public page, API and email, and a test blocks his name and program titles. Their prices are kept in the catalog for when they return. **The rights review is required before they come back.** | Counsel / Nikky |
| R4b 🔴 | **Assignments and goal blocks.** The site now says the relaunch adds assignments and goal blocks that original copies don't have. These must actually exist for every listed program before launch (`relaunchAssignmentsReady`). Production hides the claim until then. | Content / coaches |
| R4d 🟡 | **Madison / BOSS charisma themes.** The new copy features Madison's conversation, body language, social presence, personality and presentation. Those themes come from secondary historical descriptions; confirm them against the BOSS edition files before launch. | Content |
| R4e 🟡 | **Ozzie and Hoobie as Transformations special guests** (your statement). The site now credits them on the Transformations page and card, in the multi-instructor block and the prequel section (kept out of the "Confirmed history" timeline until verified). Confirm their appearance and the spelling of their names against the edition files, and that RSD may use their names. | Content / counsel |
| R5 🟡 | **Women vs "Woman Transformations"**: only "Women" is used. | Content |
| R6 🟡 | **Execute the Program**: is it the original, 2.0, or both? Count it once unless both editions are delivered. | Content |
| R7 🟡 | **The later Self Mastery titles** (Academy, High Vibe Communication, Purpose Process, Endless Motivation 2.0, Charisma Mastery) are **not** in this package. Add them only deliberately. | Nikky |
| R8 🟡 | **Authorized original sales copy**: none has been reused yet. All page copy is new. If you want original RSD sales-page passages reused, list them and confirm authorization; each one gets logged in `docs/COPY_REUSE_REGISTER.md`. | Nikky |
| R9 🟡 | **Course cover art**: the site uses labeled typographic "archive cover treatments". Supply licensed original covers to replace them. | Nikky |
| R10 🟡 | **Logo**: the supplied RSD logo (435×116 PNG) is in use. Supply a vector or high-res version and confirm trademark ownership and usage rights. | Nikky |

## 4. Factual and historical findings that need a decision

- **F1 🔴 Transformation Mastery domain history.** The 2014 Wayback capture of `transformationmastery.com` shows a site belonging to **"Max and Nancy"**, not Julien. The research register (R04) treats that domain as Julien's sales page. Julien's program probably used the domain later, but confirm it from your records before relying on R04. Max products are excluded, so this matters.
- **F2 ✅ PIMP Wayback snapshot (R03) now retrieved.** `20140924035139` loads: "PIMP by RSD Julien", Standard / Platinum / Diamond tiers, with bonuses marked "14 Days Only". Tier names are now first-party facts, but **which tier's content this release delivers** is still unknown. The old 14-day bonuses are **not** revived.
- **F3 · "Executive Coach".** You described the instructors as executive coaches. RSD did use that title: the 2015 Execute the Program page is signed "Jeffy, Executive Coach, Real Social Dynamics". It is verified for one instructor only, so the page doesn't apply the title to everyone. Supply evidence for the others if you want it used broadly.
- **F4 🟡 Authority claim used.** The page says "Nearly two decades of recorded RSD teaching", based on first-party 2007 blog posts (R01/R27). I did not claim a founding year or customer counts, because none were sourced. Supply them if you want bigger authority numbers.
- **F4b 🔴 "Over 1,000,000 customers served"** replaces the "14 days" stat. You stated this figure; keep the sales or customer records that prove it, since advertising claims must be substantiated. Then set `customersServedSubstantiated: true` (production hides it until then). State what counts as a "customer" (unique buyers, event attendees, free members).
- **F5 🟡 Julien-specific wording** (the featured sequence and the welcome-back hero) renders publicly only once PIMP, SHIFT, TenGame, and Transformation Mastery are approved and included (`julienSequenceApproved`).
- **F6 🟡 Tyler's 2007 preparation precedent** renders publicly only with approved historical attribution (`tylerPrecedentApproved`).

## 5. Bonuses and service delivery

| # | Blocker | Owner |
|---|---|---|
| S1 🔴 | **Coaching roster and capacity.** Who the Success Coaches are, how many calls per week, and proof there is capacity for every possible order. No unlimited promise against unknown availability. | Coaching lead |
| S2 🔴 | **Call terms.** Confirm the proposed 30-minute 1:1 video call, the 60-day booking window, the completion window, the rescheduling policy, and the disclosure rule if paid programs are discussed. | Coaching lead |
| S3 🔴 | **Scheduling provider** with authenticated, per-order booking links. The page currently says "Booking opens once configured". | Engineering |
| S4 🔴 | **RSD Nation briefing.** Date, time, format, hosts, and a delivery commitment. Without these, attendance can't be advertised as a guaranteed event (`briefingTermsApproved`). | Nikky |
| S5 🔴 | **Remedy if a call or the briefing can't be delivered** (refund, reschedule, or credit). It must be decided and published. | Nikky + counsel |
| S6 🟡 | **Household / one-person policy** for the bonuses (one call per order or per person). | Nikky |
| S7 🟡 | **RSD Nation free classics audit.** rsdnation.com advertises free RSD classics. The comparison table on the homepage needs the real list, so we don't sell something already free as exclusive. | Content |
| S8 🟡 | **Earlier Self Mastery bundle inventory** to finalize the "already own it?" comparison. | Ops |

## 6. Preparation path and global tour

- **P1 🔴 Prerequisite policy not approved.** The site currently says the archive "is intended to support preparation for future RSD live programs. Requirements will be published with each program." The mandatory wording switches on automatically when `preparationPolicyApproved` is true (tested).
- **P2 🔴** Applicable bootcamp IDs, the specific lesson asset IDs, completion rules, and existing-owner equivalence. Coaches must approve them (`docs/FOUNDATIONS_PATH_PROPOSAL.md`).
- **P2b 🔴 Live event links (added at your direction).** The homepage timeline's "Next" entry and `/global-tour` now link to owenbootcamp.com/home, selfhelpfreetour.com/home, and a Madison Immersion page. Not opened by this build. Confirm: (1) each page is live and current; (2) the Madison link is a Vercel **preview** URL (`…-ep0wcf25s-self-mastery-co.vercel.app`), which can change or require login, so replace it with a permanent domain; (3) Owen and Madison have agreed to their names being used for current events. The brief bars implying current instructor participation unless it's true.
- **P2c 🔴 Partnership announcement (added at your direction).** The timeline now says RSD is partnering with **PUA Training, celebrity dating coaches, and other dating-coaching companies** on a new global RSD Nation (immersions, bootcamps, phone coaching), with "call us" at 310-202-9002. It's labelled PLANNED. Before launch, confirm signed agreements exist and that each partner approves being named. Don't name individual "celebrity" coaches until each one has agreed in writing.
- **P3 🟡 Global tour.** `/global-tour` honestly shows "not yet announced" for cities, dates, coaches, and prices. Nothing fictional is shown.

## 7. Email, consent, and list (no sending is possible yet)

| # | Blocker | Owner |
|---|---|---|
| E1 🔴 | **Send authorization** (`sendApproved`) and the env flag `RSD_ALLOW_SEND`. Both are off. | Nikky |
| E2 🔴 | **Email provider + authenticated domain**: SPF, DKIM, DMARC alignment, and one-click unsubscribe, verified from *received headers*, not a settings checkbox. No provider adapter is installed on purpose. | Engineering |
| E3 🔴 | **Lawful basis per contact.** Which entity collected each address, under what notice, whether a soft opt-in applies to RSD offers, and territorial rules (US CAN-SPAM, UK/EU PECR/GDPR, and others). Unknown permission = no send. | Counsel |
| E4 🔴 | **Suppression import**: existing unsubscribes, bounces, complaints, and open support, refund, or chargeback cases from the current platform. These must load **before** any contact list. | Ops |
| E4b ✅ | **Brand separation (owner direction).** Papa / Nikky Kho and the RSD Inner Circle are removed from the site and emails; emails are signed "The RSD Team". A test blocks these names in every public page and email. The brief's draft sender line "Nikky Kho \| Self Mastery Co" is no longer used, so choose the sender name and address for the email provider. | Nikky |
| E4c ✅ | **No Self Mastery products or brand on this site (owner direction).** Removed from the welcome-back hero, the existing-customer section and comparison table, the FAQ, the support page, the P.P.S. and the emails; a test blocks them. Transformation Mastery (Julien) stays as an archive program. Note: the email segments in the brief come from Self Mastery purchase history, so check marketing permission and sender identity before mailing that list under the RSD name. | Nikky / counsel |
| E4d 🟡 | **"Planned · not yet scheduled" badges removed (owner direction).** Planned items (the global tour, new bootcamps, the RSD Nation relaunch and partnerships, the preparation requirement) are still described as planned or "as confirmed" in the text itself; keep that wording so they don't read as confirmed. | Nikky |
| E4e ✅ | **Transformation Mastery removed (owner direction).** The program is on hold and its name is gone from pages and emails; copy now says "Julien's later transformation work". A test blocks the title. The Julien sequence is now PIMP, SHIFT, TenGame. | Nikky |
| E4f ✅ | **Flawless Natural (Tim) and Alex Social's programs (Social Encrypted, NRYNE) removed (owner direction).** On hold; their instructor blocks, hero names, prices and timeline mention are gone; a test blocks the titles. | Nikky |
| E4g ✅ | **Brad Branson's programs (Evolutions, Lifestyle Academy) removed (owner direction).** On hold; test blocks them. | Nikky |
| E4h ✅ | **Glenn Ackerman's program (Energy Awareness) removed (owner direction).** On hold; test blocks it. | Nikky |
| E4i 🟡 | **Comprehensive program list applied (owner, Oct 1).** 17 programs, 671 lessons (Ten Commandments of Game kept; lesson count not supplied). New: Get Your Ten (Madison, 93), Owen's Last Game Program (Tyler, 30), Social Circle Hacking (24) and Influence Mastery Program (27). The last two are credited to "RSD" until you name the instructor. Execute the Program is no longer "2.0". | Nikky |
| E4k 🟡 | **Program names standardized to the members-area names:** The Ten Game, The Boss, The Resonator, SHIFT. **Still for Nick to decide:** "Owen's Last Game Program" vs "The Last Game Ever" (product sheet). Make the Stripe product names match whichever is chosen. | Nick |
| E4j 🟡 | **Stripe payment link per program: 15 of 16 attached (Oct 1).** The `…1oI1e` link was confirmed (by viewing the Stripe page) to sell **Get Your Ten ($597)**, so it's attached to Get Your Ten; **BOSS is missing its own link**. Stripe checkout pages show the merchant name **"Self Mastery Co"**: change the Stripe account's public business name if the brand should be RSD only. The Ten Commandments link is stored but the program is hidden. Verify each link's price and product in Stripe. Earlier note: No Stripe access from this build. Create one Payment Link per row in `campaign/stripe-payment-links.csv` and paste each URL into that program's `stripePaymentLink` in `data/catalog.json` (or send them to me). Each program's "Buy … only" button then goes to its own Stripe link. Until a link exists, the public site hides that program's single-buy button. | Nikky |
| E5 🔴 | **Footer values**: sender legal name, postal address, and the subscription explanation per segment. | Counsel |
| E6 🟡 | **Segment tagging** (A–I) from verified purchase history. The December 2025 announcement follow-up line is used only for the segment that received it. | Ops |
| E7 🟡 | **Sending ramp plan**: start with the engaged lawful segment and halt before a 0.3% spam rate. | Ops |

## 8. Technical (before any production deployment)

| # | Blocker | Owner |
|---|---|---|
| T1 🔴 | **Real payment provider** (test mode first) with signed webhooks. A simulated provider is in place for staging; production returns 501 until an adapter is written and authorized. | Engineering |
| T2 🔴 | **Database.** Staging uses a JSON file (`var/store.json`). Production needs a real database with backups and transactional idempotency. | Engineering |
| T3 🔴 | **Library hosting and video playback** with authenticated access. Until it works, the "instant access" line stays in STAGING. You asked for "programs delivered instantly"; the copy says exactly that once `instantAccessConfirmed` is true. | Engineering |
| T4 🔴 | **Secrets**: `RSD_SESSION_SECRET`, `RSD_LINK_SECRET`, `RSD_WEBHOOK_SECRET`. Production refuses to start without them (tested). | Engineering |
| T5 🔴 | **Hosting, TLS, deployment.** See `docs/DEPLOYMENT_PLAN.md`. | Engineering |
| T6 🔴 | **Domain routing.** realsocialdynamics.com currently redirects to selfmasteryco.com. No redirect or DNS change has been made; a migration plan needs approval. | Nikky |
| T5b 🔴 | **Stripe Payment Link wired to every main CTA** ("Click here to get the RSD Vault" → https://buy.stripe.com/4gM00k2eqdaJ0Uvdsd1oI10), at your direction. Not opened or tested by this build. Before anyone can be charged: (1) confirm the link's price ($997), product name, and test vs live mode in Stripe; (2) **deactivate the link at the deadline**, because Stripe won't enforce the 14-day window; (3) connect a Stripe webhook to `/webhooks/payment` so payments create library access and both bonuses (today a Stripe payment grants nothing on this site); (4) show refund/access/bonus terms on or before the Stripe page, since the buttons now skip the internal order-review page; (5) the site is still not deployed, and nothing here charges anyone until it is. | Engineering / Nikky |
| T6b 🔴 | **Footer links and disclaimer removed (your direction).** Before launch, the site still needs a visible link to the **privacy policy** (California's CalOPPA requires one on any site collecting personal data), **terms**, and **refund terms** near checkout. The "no current instructor endorsement / no guaranteed results" notice still appears in the page body (historical-content section, FAQ). Suggested: one slim footer line "Terms · Privacy · Refunds". | Counsel / Nikky |
| T6c 🔴 | **Site made public at your direction (Oct 1).** Vercel production deployments run in "public site" mode: no staging banner or admin/dev tools, search indexing allowed, the internal test checkout is off, the support and access forms are replaced by the support phone line, and every purchase goes through the Stripe link. Unresolved items in this file (rights, terms, privacy link, bonus fulfillment, the Stripe webhook, pricing substantiation) are now live risks, not just staging notes. | Nikky |
| T7 🟡 | **Analytics / consent banner**: event names are defined and stripped of personal data. A cookie-consent mechanism and a provider are still needed if any third-party analytics are added. | Engineering |
| T8 🟡 | **Accessibility audit** with a screen reader and an automated tool such as axe, plus a Lighthouse run on the deployed host. Initial checks are in `docs/QA_REPORT.md`; that is not a certification. | Engineering |
| T9 🟡 | **Customer account migration**: real prior entitlements from Kajabi or the current platform, if access is available and undisputed. | Ops |
| T10 🟡 | **Fonts** load from Google Fonts. Self-host them for privacy and performance if preferred. | Engineering |

## 9. Where the build deliberately differs from the chat request, and why

**From the aggressive copy pass** (full list in `prompts/COPY_DIRECTION_PROMPT.md`):

- "20+ years" shows as **"nearly 20 years"** because the earliest first-party source is 2007. Set `archiveSinceYear` with a first-party source and the copy upgrades itself everywhere.
- "Lost archive" is now **"original archive"**, because RSD Nation advertises free classics.
- "The training that built the men behind it" is now **"the training that came before it"**. The brief bars claiming the archive caused the instructors' success.
- "Get credit for what you already own" is now **"Don't pay twice. Check what you own."** There is no credit policy yet (C8).
- "Something the old archive never had" is now **"something recordings alone can't give you"**, because some old programs included live calls.
- Program hooks keep only verified themes. The added topics (qualification, follow-up, self-esteem, conditioning, tonality, nonverbal layer) were held back until the files are inspected.
- **Hero (owner direction):** the site leads with "What did they know before they taught personal transformation?" and "RSD is back" appears only in emails. "The 20+ year archive" renders as "the nearly 20-year archive" until `archiveSinceYear` is sourced. The visible caption explaining the typographic covers was removed at your request; screen readers still announce them as archive cover treatments, and they should be replaced with licensed artwork (R9).
- **Hero (Oct 1, restored):** the rotating headline "What did [Julien Blanc / Owen Cook / RSD Madison / …] know before teaching personal transformation?" is back at the top (Todd excluded). Only Julien's later personal-transformation work is sourced (R04). Confirm each other name is fair to include, or trim `HERO_NAMES` in src/views/home.js.
- **Deadline time:** set the end time in the evening Pacific time. The day-14 email says "tonight".


1. **"Programs will be delivered instantly."** This is written into the copy, but gated: production shows it only when a working delivery system is confirmed (T3). Otherwise it would be an untrue promise.
2. **"Only available for a short period before the full catalog launch."** The page says the $997 price and both bonuses end at the deadline. It labels the full-catalog relaunch and live programs **PLANNED**. It does not say the recordings vanish (C7).
3. **"Insider access: they have to buy this ticket."** The package-holder RSD Nation briefing is presented as the insider ticket, and it is genuinely exclusive. The page doesn't claim ordinary RSD Nation access is unavailable, because rsdnation.com advertises free classics.
4. **Value stack.** It uses real, linked Wayback prices at the conservative lowest tier and no invented bonus values (section 2).
5. **Men and women.** The page states plainly that the programs were built as dating coaching for men and that women are welcome to study the same material. It doesn't claim proven results for anyone.

---

**To clear a gate:** update `config/campaign.json` or the program record in `data/catalog.json`, run `npm test`, and check `/admin/readiness`.
