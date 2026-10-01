# Instructor section prompts: paste into Claude Code, one at a time

**Purpose:** add a headline-driven **instructor intro section** before each coach's programs on the finished RSD site. The sections go on `/legacy` and on a new instructor page, `/instructors/<key>`. Each prompt is self-contained. Run **Prompt 0 once first**, then any instructor prompt in any order.

Style for every section is the same as the homepage: Dan Kennedy direct response. Lead with authority, then a captivating, curiosity-driven headline and sub-headline. Every headline in the section should tell the story on its own, so a skimmer knows exactly which programs this coach teaches and why they're different. Show that coach's mini value stack, then one CTA to the $997 package.

> **About "Executive Coach":** RSD's own 2015 page signs Jeffy as "Executive Coach, Real Social Dynamics". Use the title "RSD Executive Coach" for any other instructor only after you add a first-party source for that instructor to `data/sources.json`. Until then, use "RSD instructor".

---

## Prompt 0: build the reusable instructor-section system (run once)

```text
In rsd-website/, add a reusable instructor-section feature. Do not change any guardrails in PRELAUNCH_BLOCKERS.md.

1. Create data/instructors.json with one record per instructorKey already used in data/catalog.json
   (tyler, julien, jeffy, tim, alex, brad, derek, luke, madison, glenn, todd, plus "multi" for Transformations). Fields:
   key, displayName, title ("RSD instructor" unless a first-party source proves "Executive Coach"), eyebrow,
   headline, subheadline, authorityFacts[] ({text, sourceId, kind: "history"}), bodyParagraphs[], whatMakesThemDifferent,
   bestFor, approved (false), sourceIds[].
2. Create src/views/instructorSection.js exporting instructorSection(cfg, instructor, programs):
   - eyebrow, <h2> headline, sub-headline, authority facts each tagged with the existing "Confirmed history" label,
   - body copy, "what makes this coach different", "best for",
   - that instructor's public programs (publicPrograms(cfg) filtered by instructorKey) as program cards,
   - a mini value stack from data/historical-prices.json (verified prices only, lowest tier, capture link;
     "Price not verified" otherwise; no invented totals),
   - a CTA "Get every <name> program + both bonuses for $997" linking to /#package,
   - when !instructor.approved, show a STAGING flag in staging and render NOTHING in production.
3. On /legacy, add an "Browse by instructor" view that renders instructorSection before each instructor's cards.
   Add route /instructors/:key (404 for unknown or unapproved in production). Link instructor names on program cards.
4. Add tests: every instructor section's <h2>/<h3> text alone names the coach and every one of their programs;
   no forbidden patterns from data/exclusions.json; unapproved sections absent in production; no price unless
   status "verified".
5. Run npm test, then preview /legacy and one /instructors/<key> page on desktop and mobile. Report results.
```

---

## Shared guardrails (included in every instructor prompt below)

```text
GUARDRAILS (apply to all copy):
- Historical archive recordings only. Never imply the instructor participates in, endorses, or coaches in the 2026 relaunch.
  The included call is with a current RSD Success Coach.
- Authority facts only from data/sources.json or a new first-party source you add with URL + date. Label them "Confirmed history".
  No invented follower counts, earnings, celebrity, relationships, or "taught 100,000 men" claims.
- No guaranteed dates/sex/results, no medical/therapy claims, no "93%" claim, no revived old bonuses, calls, immersions, raffles.
- Do not mention RSD World Summit or any Max product. Do not invent curricula, modules, hours or tiers not in the catalog.
- Prices: only verified entries in data/historical-prices.json (lowest published tier), with capture link.
- Built as dating coaching for men; women are welcome to study the same material. Current standards: mutual interest, consent, boundaries.
- Put new copy into data/instructors.json (approved: false). Run npm test and preview. Do not deploy or send anything.
```

---

## Prompt 1: Tyler (Owen Cook)

```text
Using the instructor-section system, write Tyler's section in data/instructors.json (key "tyler").
Programs (from catalog): Foundations; The Blueprint Decoded; Hot Seat at Home.
Verified prices: Foundations $269 (CD, getfoundations.com 2007-12; $369 DVD/digital); The Blueprint Decoded $449 (CD, 2009-02; $599 DVD).
Hot Seat at Home: price not verified (lead: rsdhotseat.com/offer 2017 capture). Retry it; add it only if found on the official page.
Authority facts allowed: R01 (2007: Foundations recorded), R27 (June 2007: Tyler said his later bootcamps/products assumed familiarity
with Foundations), R02 (2008: multi-day Blueprint presentation), R28 (Foundations = practical outer game).
Angle: "where the RSD catalog began". The framework behind the techniques, then interactions you can pause and study.
Headline examples to beat:
  H2: "Before the bootcamps, Tyler said you should know this first."
  Sub: "Foundations, The Blueprint Decoded, and Hot Seat at Home: the practical starting point, the framework behind it,
        and real interactions you can pause and study."
Hot Seat footage needs a consent note ("distribution review pending") in staging.
[GUARDRAILS]
```

## Prompt 2: Julien Blanc

```text
Write Julien's section (key "julien"). Programs: PIMP; SHIFT (Making a SHIFT); TenGame; Transformation Mastery.
Verified prices: PIMP $197 (Standard; Platinum $397, Diamond $497; pimpingmygame.com 2014-09-24);
SHIFT $297 (Natural; $497/$597; makingashift.com 2015-05). TenGame and Transformation Mastery: not verified.
IMPORTANT: the 2014 capture of transformationmastery.com belonged to "Max and Nancy". Do NOT cite that domain for Julien
until the owner confirms the domain history (PRELAUNCH_BLOCKERS F1).
Angle: "You know the transformation. Now see the chapters before it." Aim this at Self Mastery customers who know only
Transformation Mastery. Present the four as separate programs (never "Pimp Shift"), as a prequel sequence, with
Transformation Mastery as the later comparison point. Julien-specific copy renders publicly only when julienSequenceApproved is true.
Headline examples to beat:
  H2: "You've seen Julien's transformation. You probably haven't seen what came first."
  Sub: "PIMP, SHIFT, and TenGame: three earlier RSD chapters, each a different program, side by side with Transformation Mastery."
State plainly: archival recordings; Julien is not joining the relaunch.
[GUARDRAILS]
```

## Prompt 3: Jeffy (Jeffrey Allen)

```text
Write Jeffy's section (key "jeffy"). Programs: The Jeffy Show; The Resonator; Execute the Program 2.0.
Title: "RSD Executive Coach" is allowed: executetheprogram.com capture 20150106221334 is signed
"Jeffy, Executive Coach, Real Social Dynamics". Add it to data/sources.json as R29.
Verified prices: Resonator $197 (Attack; $297/$397; rsdresonator.com 2018-01). Execute: the $197 capture is "The Program",
not confirmed as 2.0, so show "Price not verified". The Jeffy Show: not verified.
Authority: R01 (The Jeffy Show recorded by 2007), R07 (Resonator: vocal projection, storytelling, humor).
Angle: delivery and personality. How you sound, tell stories and use humor, plus the online-to-offline branch.
Headline examples to beat:
  H2: "Same words. Different voice. Different result. Jeffy's case for delivery."
  Sub: "The Jeffy Show, The Resonator, and Execute the Program 2.0: style, voice, storytelling, humor, and online presentation."
No nonverbal-percentage claims. Old memberships and immersion days are not included.
[GUARDRAILS]
```

## Prompt 4: Tim

```text
Write Tim's section (key "tim"). Program: Flawless Natural.
Verified price: $169 (CD; $269 DVD; flawlessnatural.com 2009-01, page titled "Real Social Dynamics - Flawless Natural Method").
Authority: R09 (secondary profile; natural-style emphasis) and R11. Use cautiously and label as a secondary source.
Angle: the natural-style branch. Understanding a framework without sounding rehearsed.
Headline examples to beat:
  H2: "What if the goal was never to sound like a technique?"
  Sub: "Flawless Natural: Tim's natural-style branch of the RSD archive."
Never confuse it with Max's "The Natural" (excluded); do not mention that title at all in public copy.
[GUARDRAILS]
```

## Prompt 5: Alex Social

```text
Write Alex's section (key "alex"). Programs: Social Encrypted (2015); No Reason You're Not Enough / NRYNE (2016).
Verified price: Social Encrypted $247 (White; $347/$497; socialencrypted.com 2016-01; medium confidence, so say "archived official product page").
NRYNE: not verified.
Authority: R13 (Alex's own site: Social Encrypted = nighttime social events with instruction and demonstration; NRYNE = inner game).
Angle: two sides of one coach. The outer environment (nightlife) and the inner game.
Headline examples to beat:
  H2: "The nightlife and the inner game: Alex Social's two RSD programs."
  Sub: "Social Encrypted (2015) for the nighttime social setting. No Reason You're Not Enough (2016) for the internal side."
Do not use Alex's current immersion schedule, prices, or testimonials.
[GUARDRAILS]
```

## Prompt 6: Brad Branson

```text
Write Brad's section (key "brad"). Programs: Evolutions; Lifestyle Academy. Prices: not verified (retry official domains).
Authority: R14 (Evolutions: mindset, approach, conversation, application by experience level), R15 (Lifestyle Academy:
values and several life domains). Both are secondary sources; label them as such.
Angle: the stage you're in, and the life around the dating.
Headline examples to beat:
  H2: "Find your stage. Then look past the single conversation."
  Sub: "Evolutions maps beginner-to-advanced stages; Lifestyle Academy widens the lens to values, work, and direction."
Not financial, medical, or psychological advice. Do not conflate with 2.0 or Syndicate.
[GUARDRAILS]
```

## Prompt 7: Derek

```text
Write Derek's section (key "derek"). Program: Ten Commandments of Game. Price: not verified.
Authority: R16 (secondary: principle-based instruction). Angle: principles beneath tactics.
Headline examples to beat:
  H2: "Ten principles. Everything else is tactics."
  Sub: "Ten Commandments of Game: Derek's principle-first RSD program."
No old raffles, calls, or immersions. A "Resurrected" edition only if verified separately.
[GUARDRAILS]
```

## Prompt 8: Luke

```text
Write Luke's section (key "luke"). Program: Social Circle Blueprint (original edition only; 2.0 stays on HOLD).
Verified price: $297 (Standard; $497/$597; socialcircleblueprint.com/scb-offer 2017-05).
Note: that capture's bonus list names Max. Never quote or reference its bonuses.
Authority: R17 (secondary: social environments, networks, community).
Angle: beyond one interaction. Circles, venues, and repeat connection.
Headline examples to beat:
  H2: "Stop starting from zero every night. Study the social circle."
  Sub: "Social Circle Blueprint: Luke's program on the environment around your social life."
Historical parties and immersions are not included.
[GUARDRAILS]
```

## Prompt 9: Madison

```text
Write Madison's section (key "madison"). Program: BOSS. Price: not verified.
Authority: R18 (secondary: inner game connected to outward behavior and lifestyle).
Angle: from inner game to how you actually show up.
Headline examples to beat:
  H2: "Inner game is only real when it shows up in the room."
  Sub: "BOSS: Madison's RSD program connecting internal attitude to outward behavior."
Not interchangeable with Get Your Ten or Bootcamp at Home. No persona or result guarantee.
[GUARDRAILS]
```

## Prompt 10: Glenn Ackerman

```text
Write Glenn's section (key "glenn"). Program: Energy Awareness. Price: not verified.
Authority: R19 (secondary inventory plus a first-person interview on awareness, emotions, and "energy").
Angle: a distinct personal-development lens, presented as the instructor's framework, not science.
Headline examples to beat:
  H2: "A different lens on the emotions behind every interaction."
  Sub: "Energy Awareness: Glenn Ackerman's high- and low-vibration framework, presented as he taught it."
Never claim treatment of anxiety, trauma, addiction, depression, or any condition.
[GUARDRAILS]
```

## Prompt 11: Todd Valentine

```text
Write Todd's section (key "todd"). Programs: 3 Girls a Day; Daygame by Todd; Text & Dates Machine; Valentine University (Recordings); Women.
Verified price: 3 Girls a Day $67 (3girlsaday.com 2015-01; medium confidence). Others: not verified.
Authority: R20 (Todd's own retrospective: 3 Girls A Day, Daygame by Todd, Valentine University in his RSD-era work), R21, R22.
Angle: the most complete digital-to-daytime path in the archive: online, texting, daytime, calibration.
Headline examples to beat:
  H2: "Online, by text, in daylight: Todd's five-program path from first message to first date."
  Sub: "3 Girls a Day, Text & Dates Machine, Daygame by Todd, Women, and the Valentine University recordings."
"3 Girls a Day" is a title, not a promise. No response-rate claims. A non-response is to be respected.
Valentine University is not current enrollment or accreditation. Never use "Woman Transformations".
[GUARDRAILS]
```

## Prompt 12: Multi-instructor RSD (Transformations)

```text
Write the "multi" section. Program: Transformations (original multi-instructor RSD program; NOT Transformation Mastery).
Price: not verified. Authority: R01 (2007: recorded multi-instructor program; differing presenter styles).
Angle: RSD as a company of voices, not one personality.
Headline examples to beat:
  H2: "One stage, several RSD instructors, and the chance to compare them."
  Sub: "Transformations: the early multi-instructor RSD program, not Julien's later Transformation Mastery."
[GUARDRAILS]
```

---

**After all sections:** ask Claude Code to "run the headline skim test across /legacy and every /instructors page, then list any instructor whose section can't name all of their programs from headlines alone." Before setting `approved: true`, review each section against PRELAUNCH_BLOCKERS.md.
