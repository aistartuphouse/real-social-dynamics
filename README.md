# RealSocialDynamics.com relaunch: staging build

**RSD IS BACK. You know the transformation. Now explore the prequel.**

This is a local/staging build of the RSD Legacy Archive launch built from `RSD_Claude_Code_Complete_Prompt.md`, the brief dated October 1, 2026. It has zero runtime dependencies (Node ≥ 20). **Nothing here deploys, sends email, imports contacts, changes DNS, or charges anyone.**

```bash
npm start          # http://127.0.0.1:8130 in STAGING mode (synthetic data, test payments)
npm test           # 34 tests: offer window, entitlements, suppression, public-output scans
npm run build:emails       # regenerate emails/templates/*.html|.txt
npm run campaign:dry-run   # who WOULD receive each step (synthetic contacts); never sends
RSD_MODE=production npm start   # fails closed: needs secrets; no checkout/programs until gates pass
```

## What's where

| Path | What it is |
|---|---|
| `src/views/home.js` | The sales letter. Its `<h2>` headlines, read alone, tell the whole offer (tested). |
| `src/views/*.js` | Welcome-back, catalog (`/legacy`), program pages, preparation, global tour, support, account, checkout |
| `config/campaign.json` | Central config (brief §12). Every `null`/`false` is an unapproved decision. |
| `data/catalog.json` | Machine-readable catalog: 29 records with separate identity/curriculum/rights/copy/media/fulfillment states. |
| `data/historical-prices.json` | Wayback-verified original prices for the value stack, each with its capture URL. |
| `data/exclusions.json` | Excluded products and forbidden public patterns (World Summit, Max, "Pimp Shift", 93%…) |
| `data/sources.json` | Research register R01–R28 |
| `emails/src/definitions.js` | Single source for all 10 campaign emails + 3 transactional emails |
| `emails/templates/` | Built HTML + plaintext templates (merge tags intact) |
| `campaign/` | Disabled-by-default automation manifest, schedule CSV/JSON |
| `src/lib/fulfillment.js` | Orders → signed webhook → idempotent entitlements; bonuses only for the package SKU |
| `src/lib/campaign.js` | Eligibility + suppression; dispatch hard-disabled |
| `src/lib/claims.js` | STAGING vs production wording for every unconfirmed claim |
| `public/img/rsd-logo.png` | Supplied Real Social Dynamics logo |
| `PRELAUNCH_BLOCKERS.md` | Everything still missing, with an owner for each item |
| `docs/` | QA report, deployment plan, Foundations Path proposal, copy-reuse register |

## Staging conveniences (404 in production)

- `/admin/readiness`: live launch gates, send gates, product approval states
- `/dev/emails`: preview every template with sample merge values
- `/dev/outbox`: sign-in links and order confirmations that would have been sent
- `/test-pay/:order`: simulated payment provider that posts a **signed** webhook

Synthetic accounts: `tm.owner@example.test` (owns Transformation Mastery), `pimp.owner@example.test` (owns PIMP + SHIFT), `support.case@example.test` (open support case, so suppressed from sales). Staging rejects non-synthetic emails.

## The headline sequence (skim test)

1. You've done the inner work. Now put it to work. ("RSD is back" is reserved for the emails)
2. This isn't one course. It's nearly 20 years of RSD teaching history in one place.
3. Turn personal growth into real-world charisma, confidence, and connection.
4. Don't just study what they eventually taught. Study the road they took to get there.
5. Before Transformation Mastery, there was an earlier chapter: Julien's PIMP, SHIFT, and TenGame.
6. Different men. Different methods. 11 instructors and one question: what can you learn from the paths they took?
7. You could hunt for these programs one at a time. Or unlock all 25 in one place.
8. Built as dating coaching for men. Open to anyone who wants to communicate with confidence.
9. Add it up: bought separately, these 25 programs cost $5,841. Add $294 in bonuses and that's $6,135 in total value. Your price for everything: $997.
10. Don't buy the chapters one at a time. Get the whole story, plus two package-only bonuses, for $997.
11. Nearly 20 years of material. Where the hell do you start? Bonus 1: your live RSD Success Coaching Call.
12. This archive is the past. Bonus 2 is about what comes next: your invitation to the private RSD Nation relaunch briefing.
13. The videos are the preparation. The next chapter of RSD bootcamps happens live.
14. Preparation has a place in RSD's history.
15. In 14 days, this offer changes.
16. Already bought RSD or Self Mastery training? Good. Don't pay twice.
17. Yes, some of this material is old. That's why it's called an archive.
18. Straight answers before you decide.
19. You've seen the sequel. Now watch the prequel. → Study the past. Build your next chapter.
20. P.S. / P.P.S.

## Prompts for further work

- `prompts/COPY_DIRECTION_PROMPT.md`: the aggressive direct-response copy pass, plus the substantiation adjustments
- `prompts/INSTRUCTOR_SECTION_PROMPTS.md`: one Claude Code prompt per instructor, each adding a headline-driven section before that coach's programs
