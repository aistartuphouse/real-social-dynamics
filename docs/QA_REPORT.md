# QA report (staging build, October 1, 2026)

Initial checks only, not a certification. See PRELAUNCH_BLOCKERS.md T8 for the full audit that's still needed.

## Automated tests: `npm test`

```
ok 1 - unresolved support cases are suppressed from the sales sequence
ok 2 - unsubscribe and unknown permission block every template
ok 3 - buyers exit the sales sequence
ok 4 - dormant contacts get only the limited re-introduction; final-hours only to engaged
ok 5 - dispatch is disabled by default and fails closed
ok 6 - HOLD items never reach public lists, even in staging
ok 7 - production shows only fully approved, deliverable programs (none yet)
ok 8 - PIMP/SHIFT and Transformations/Transformation Mastery are separate records
ok 9 - no excluded products in the catalog
ok 10 - prerequisite wording switches between planned and approved policy (QA \#11)
ok 11 - pending order grants nothing until a verified payment event
ok 12 - duplicate and replayed payment events are idempotent
ok 13 - individual-course checkout cannot be created and never yields package bonuses
ok 14 - amount mismatch is rejected
ok 15 - refund revokes only this order, preserving unrelated prior entitlements
ok 16 - orders cannot be created outside the offer window
ok 17 - production fails closed: no checkout, no programs, noindex
ok 18 - staging end-to-end: checkout -> signed webhook -> entitlements -> library
ok 19 - webhook rejects bad signatures; order page needs a signed token
ok 20 - staging refuses real-looking email addresses
ok 21 - existing-access check responds identically for known and unknown emails
ok 22 - bonus pages require auth and a package entitlement
ok 23 - unsubscribe works without login and overrides automations
ok 24 - support case suppresses the address from sales
ok 25 - CSRF token is required on forms
ok 26 - production refuses to start without secrets
ok 27 - 14-day window keeps local wall-clock time across the DST change
ok 28 - one shared deadline: phases switch exactly at the stored UTC instants
ok 29 - production without approved timestamps is not-configured (no fake window)
ok 30 - staging: no excluded, held, or forbidden content in public pages
ok 31 - production: no excluded, held, or forbidden content in public pages
ok 32 - every email template (HTML + text) is free of forbidden content and has a footer
ok 33 - staging pages are noindex and robots disallows all
ok 34 - headline skim test: h2 headlines alone describe the full offer
# pass 34
# fail 0
```

Coverage against brief §15 acceptance criteria:

| # | Criterion | Evidence |
|---|---|---|
| 1 | White/black/navy, desktop + mobile, no obstructive banners | Palette tokens in `public/css/site.css`; previewed at 1366×900 and 375×812; sticky CTA mobile-only, hidden near the package, dismissible |
| 2 | Product-specific copy | 25 distinct records in `data/catalog.json` |
| 3 | PIMP≠SHIFT, Transformations≠Transformation Mastery | catalog test |
| 4 | World Summit / Max absent | public-output scan, staging + production, all routes + all emails |
| 5 | Unresolved items not invented | HOLD records 404; forbidden-pattern scan |
| 6 | Real deliverable manifests | **Not met.** No files supplied, so production lists 0 programs (R1) |
| 7 | Old bonuses not revived | copy + `excludesHistoricalLiveBenefits` |
| 8 | Bonuses only via package | fulfillment tests (individual SKU refused; forged order gets no bonus) |
| 9 | Past owners keep access; support cases suppressed | refund test; campaign + HTTP support tests |
| 10 | Briefing invite distinct from RSD Nation/tour | copy + FAQ |
| 11 | Prerequisite wording switches automatically | claims test (site + Day 11 email) |
| 12 | No unconfirmed city/date/coach | `/global-tour` shows "not yet announced" |
| 13 | Deadline enforced server-side, DST-safe | offer tests; checkout 409 outside window |
| 14 | Entitlements only after verified, idempotent payment | fulfillment + HTTP end-to-end tests |
| 15 | Refund preserves unrelated entitlements | fulfillment test |
| 16 | Unsubscribe without login; suppression overrides | HTTP + campaign tests |
| 17 | Email HTML/text/footer; no archived tracking | email test; previews at `/dev/emails` |
| 18 | Staging noindex; no auto deploy/send | robots/header tests; dispatch hard-disabled |
| 19 | No fake testimonials/valuations/scarcity | none used; value stack uses only verified archived prices |
| 20 | Blockers in plain English with owners | PRELAUNCH_BLOCKERS.md |

## Accessibility (initial)

Contrast ratios (WCAG AA needs 4.5:1 for body text):

| Pair | Ratio |
|---|---|
| Body #0A0A0A on white | 19.80:1 |
| Secondary #33404F on white / mist | 10.57 / 9.85:1 |
| White on navy | 16.52:1 |
| Muted #C9D3E0 on navy / black | 10.92 / 13.08:1 |

Also checked:

- One `h1` per page, logical h2/h3 order, skip link, visible focus rings, and labelled form fields.
- FAQ uses native `<details>`; the value stack has a `<caption>`; all images have alt text.
- The countdown is `aria-live="off"`, so it doesn't spam screen readers; reduced-motion is respected.
- No horizontal overflow at 375px (checked in the browser after a fix).

## Performance (local)

| Asset | Size |
|---|---|
| Homepage HTML | ~55 KB |
| CSS | ~25 KB |
| JS | 2.5 KB |
| Logo | 10 KB |

There are no third-party scripts. Fonts come from Google Fonts. Server render time is under 30 ms locally. Lighthouse should be run on the real host.

## Security

- Strict CSP (no inline script).
- HttpOnly + SameSite session cookies, which are Secure in production.
- CSRF double-submit on all forms.
- POST rate limit (30/min/IP).
- HMAC-signed magic links, order links, unsubscribe tokens, and webhooks with timing-safe compare and a 5-minute tolerance.
- No emails in URLs. Staging rejects non-synthetic emails.
- Production refuses to start without secrets.

## Screenshots

Captured in the in-app browser during this session: desktop hero, value stack ($2,416 total value vs $997), package card, program spotlights, Bonus 1, and the mobile hero. Re-run with `npm start` → http://127.0.0.1:8130.
