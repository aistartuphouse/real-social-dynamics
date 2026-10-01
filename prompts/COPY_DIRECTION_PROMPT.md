# Additional prompt: aggressive direct-response copy pass (owner direction, Oct 1 2026)

Paste the block below into Claude Code to re-run or extend this copy pass, for example on new pages or the instructor sections from `INSTRUCTOR_SECTION_PROMPTS.md`. **This pass has already been applied once** to `src/views/home.js`, the welcome-back hero, `/legacy`, the program card headlines in `data/catalog.json`, and the email subject variants.

```text
Rewrite the RSD site copy to be significantly more aggressive, curiosity-driven, and benefit-led, while keeping every
guardrail in PRELAUNCH_BLOCKERS.md. Don't imitate any living copywriter's exact voice. Use the underlying
direct-response mechanics: big specific promise, curiosity, contrast, mechanism, proof, urgency, and a clear "why now".
Replace ordinary section headings with direct-response headlines. A reader who only skims the H2s must understand the full offer.

MASTER HERO (favorite):
  RSD IS BACK.
  You've seen the transformation. Now see the training that came before it.
  Unlock {yearsPhrase} of RSD social, dating, communication and personal-development training, and study the earlier
  programs that came before the instructors and ideas you already know. For 14 days, get the Complete RSD Legacy Archive
  plus a live RSD Success Coaching Call and an exclusive invitation to the RSD Nation relaunch briefing.
  STUDY THE BLUEPRINT. BUILD YOUR OWN VERSION.      CTA: UNLOCK THE COMPLETE ARCHIVE
Alternates to A/B test: "WHAT DID THEY KNOW BEFORE THEY TAUGHT PERSONAL TRANSFORMATION?" (CTA SHOW ME THE PREQUEL);
  "BEFORE THE INNER WORK… THERE WAS THE REAL-WORLD TEST."; "{YEARS} OF RSD TRAINING. REOPENED FOR 14 DAYS."
  ("If you only know the later Self Mastery and Transformation era, you've seen the sequel. Now see the prequel.");
  "THE PREQUEL TO PERSONAL TRANSFORMATION." (CTA OPEN THE RSD ARCHIVE).
JULIEN-AWARE HERO (/welcome-back): "YOU KNOW JULIEN'S TRANSFORMATION WORK. BUT HAVE YOU SEEN WHAT CAME BEFORE IT?" CTA EXPLORE THE RSD PREQUEL.

SECTION HEADLINES:
  Archive: THIS ISN'T ONE COURSE. IT'S {YEARS} OF RSD HISTORY IN ONE PLACE.
  Instructors: DIFFERENT MEN. DIFFERENT METHODS. ONE QUESTION: What can you learn from the paths they took?
    then the names line (generated from the catalog) + "They didn't all teach the same thing. That's exactly why the archive matters."
  Bridge: PERSONAL GROWTH IS THEORY UNTIL LIFE TESTS IT. (confidence sounds simple in a video / then you meet someone… / the room where you know nobody…)
  Role models: DON'T JUST STUDY WHAT THEY EVENTUALLY TAUGHT. STUDY THE ROAD THEY TOOK TO GET THERE. (question list)
    pull quote: DON'T COPY THE PERSON. STUDY THE PROCESS.   recurring slogan: STUDY THE BLUEPRINT. BUILD YOUR OWN VERSION.
  Contents: YOU COULD HUNT FOR THESE PROGRAMS ONE AT A TIME. OR UNLOCK ALL OF THEM IN ONE PLACE.
  Program hooks: Foundations "BEFORE THE ADVANCED STUFF, MASTER THE BASICS." (START AT THE BEGINNING) · Blueprint Decoded
    "WHAT IF THE 'TECHNIQUES' WERE NEVER THE REAL POINT?" (DECODE THE BLUEPRINT) · Transformations "ONE PROBLEM. MULTIPLE
    INSTRUCTORS. COMPLETELY DIFFERENT ANSWERS." · Jeffy Show "WHAT HAPPENS WHEN YOU STOP TRYING TO SOUND LIKE EVERYONE ELSE?"
    · Resonator "PEOPLE DON'T ONLY HEAR YOUR WORDS. THEY HEAR HOW YOU SAY THEM." (FIND YOUR VOICE) · Social Circle Blueprint
    "STOP CHASING INDIVIDUAL INTERACTIONS. BUILD A LIFE PEOPLE WANT TO BE PART OF." · Daygame "WHAT HAPPENS WHEN THERE'S NO
    NIGHTCLUB TO HIDE BEHIND?" (TAKE IT INTO THE REAL WORLD) · Online "YOUR PROFILE SPEAKS BEFORE YOU DO." · Julien
    "BEFORE TRANSFORMATION MASTERY, THERE WAS AN EARLIER CHAPTER."
  Bundle: DON'T BUY THE CHAPTERS ONE AT A TIME. GET THE WHOLE STORY. ("One library. One account. One place to study the evolution.")
  Bonus 1: {YEARS} OF MATERIAL. WHERE THE HELL DO YOU START? (live conversation about you)  CTA GET THE ARCHIVE + MY COACHING CALL
  Bonus 2: THIS ARCHIVE IS THE PAST. YOUR SECOND BONUS IS ABOUT WHAT COMES NEXT.  CTA UNLOCK MY INVITATION
  Tour: THE VIDEOS ARE THE PREPARATION. THE NEXT CHAPTER HAPPENS LIVE. / STUDY BEFORE YOU ARRIVE. SHOW UP READY TO WORK.
  Deadline: IN 14 DAYS, THIS OFFER CHANGES. (exact time, countdown)  CTA LOCK IN THE RETURN SPECIAL
  Past customers: ALREADY BOUGHT RSD OR SELF MASTERY TRAINING? GOOD. DON'T PAY TWICE.  CTA CHECK MY EXISTING ACCESS
  Disclaimer: YES, SOME OF THIS MATERIAL IS OLD. THAT'S WHY IT'S CALLED AN ARCHIVE. (Platforms changed. Culture changed…)
  Close: YOU'VE SEEN THE SEQUEL. NOW WATCH THE PREQUEL. → stack → $997 → RSD IS BACK. STUDY THE PAST. BUILD YOUR NEXT CHAPTER.
EMAIL SUBJECTS to A/B/n test: RSD is back. Here's what you missed. · You saw the sequel. Want to see the prequel? ·
  Before Transformation Mastery… · What Julien was teaching before the transformation era · The original RSD archive is open ·
  {Years} of RSD training just reopened · Why we brought the old RSD programs back · Some of this training is 15+ years old. Good. ·
  The training before the transformation · Don't copy your role models. Study them. · {Years} of material. Where do you start? ·
  Your RSD Success Coach is included · The videos are only the beginning · What comes after the archive · 48 hours left ·
  Tonight, the RSD return special ends. 48-hour headline: "YOU'VE HAD 12 DAYS. NOW THERE ARE 48 HOURS LEFT."

SUBSTANTIATION ADJUSTMENTS (keep these; they were applied in the first pass):
 1. "20+ years": use src/lib/claims.js yearsPhrase(). It prints "nearly 20 years" until config.archiveSinceYear is set from
    a first-party source dated 2006 or earlier. The earliest sourced year is 2007.
 2. Never "lost archive" or "lost lessons". RSD Nation advertises free classics, so say "original".
 3. "Complete" always means "every program and edition listed in this release". Show that definition near the claim.
 4. No "training that built the men behind it" or "helped shape the instructors". Those are causal claims about the
    instructors' success. Use "came before".
 5. "Something the old archive never had": false, because some original programs included live calls. Use "something
    recordings alone can't give you".
 6. "Get credit for what you already own": only with an approved upgrade-credit policy. Otherwise "Don't pay twice. Check what you own."
 7. Program hooks keep only verified themes. Don't add qualification/follow-up (Foundations), identity/self-esteem/
    conditioning (Blueprint), or tonality/"nonverbal layer" (Resonator) until the edition files are inspected.
 8. Bonus 2: "learn about future programs as they're confirmed", not "first look", unless package holders really get priority.
 9. "This is the last email I'll send you…" goes only on the true last campaign email (the final-hours note).
    "You've had 12 days" only for contacts enrolled on day 1. "Tonight" copy needs an evening deadline.
10. Bootcamp preparation: "may form part of the preparation pathway", never "all bootcamps require this purchase", until
    the policy is adopted. Existing owners can demonstrate access.
Then run npm test (includes the headline skim test and forbidden-pattern scan) and preview desktop + mobile.
```
