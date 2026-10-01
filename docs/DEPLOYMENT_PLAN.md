# Production deployment plan (requires separate authorization at each step)

Nothing below has been done.

1. **Clear the blockers.** Every 🔴 item in PRELAUNCH_BLOCKERS.md, with all launch gates green at `/admin/readiness`.
2. **Infrastructure**
   - Node ≥ 20 host behind TLS (e.g. a managed container or VM). Set `RSD_MODE=production`, the three secrets, and `PORT`.
   - Replace the JSON store with a database (Postgres): unique constraints on `processedEvents.id` and on `(orderId, kind)` for entitlements; daily backups.
   - Payment provider adapter in **test mode**; webhook endpoint `/webhooks/payment` with the provider's signature scheme; reconcile against provider events.
   - Library hosting with authenticated, signed playback URLs.
   - Scheduling provider for success calls, using per-order signed booking links.
3. **Pre-production staging on a private URL** (password-protected, `noindex`). Run end-to-end tests with test cards, synthetic users only. Accessibility audit (axe + screen reader), Lighthouse.
4. **Email**: verify SPF/DKIM/DMARC alignment from *received headers*; test one-click unsubscribe; load the suppression list first; dry-run on the real segment counts; owner approves each step in `campaign/automation-manifest.json`.
5. **Domain**: realsocialdynamics.com currently redirects to selfmasteryco.com. Propose the exact DNS and redirect change, get approval, lower the TTL 48h ahead, and keep selfmasteryco.com customer paths working. Have a rollback plan ready.
6. **Go-live switches** (owner only): `publishApproved`, `priceApproved`, real `launchStartsAtUTC`/`launchEndsAtUTC`, payment provider live keys, then `sendApproved` + `RSD_ALLOW_SEND` as a separate later decision.
7. **Monitor**: refunds, chargebacks, coaching capacity vs orders, briefing obligations, spam rate (halt before 0.3%), and support queue. Report net collected revenue separately from gross.
