## 2026-05-21 14:00 — Start

Read the Round 2 assignment carefully. The core ask is: persist audits, detect pricing changes, email users, show a diff on re-run. Spent ~25 min mapping what already exists in my Round 1 code vs what needs to be built. Good news: `reAudit.service.js`, `pricingDiff.service.js`, and the cron file already exist as stubs. Bad news: they're not wired up end-to-end and `pricing_snapshot` isn't being saved on audit creation. That's the critical gap.

Planning approach: fix the data layer first (snapshot saving), then detection, then email, then diff UI. Don't touch UI until backend is solid.

---

## 2026-05-21 14:30 — Confirmed what's wired and what isn't

Traced the full flow. `audit.controller.js` does NOT save `pricing_snapshot` on audit creation — that's the root problem. Without snapshots, there's nothing to diff against. Also confirmed that the cron file exists and imports look correct but the cron is never imported in `server.js`. Two missing links.

---

## 2026-05-21 15:05 — Fixed pricing_snapshot on audit creation

Added `pricing_snapshot: currentPricing` to the `auditDataToInsert` object in `audit.controller.js`. Called `getCurrentPricing()` at the top of `createAudit`. Also needed to add it to the fallback insertion path (the one that strips extra columns). Tested locally: submitted a test audit, confirmed the row in Supabase now has `pricing_snapshot` populated as a JSON object.

---

## 2026-05-21 15:40 — Wired cron into server.js

Added `import './src/cron/pricingMonitor.cron.js'` in `server.js`. Also added the `/api/detect-changes` manual POST endpoint that calls `runPricingCheck()` directly — this is important because Vercel serverless won't keep the cron alive reliably.

Tested the manual endpoint: hit it with Postman, it ran, logged "Check finished. Invalidated 0 audits." (no audits existed yet with snapshots at that point — correct).

---

## 2026-05-21 16:15 — Hit a Supabase schema issue

`audits` table was missing `invalidated_at` and `last_checked_at` columns. The cron was throwing a 400 error on update. The cron already had a try/catch fallback that just sets `invalidated: true` without the timestamps — so it didn't crash, but I lost the timestamp data.

Ran the migration SQL to add those columns. Going to also add them to `schema.sql` so the repo stays in sync.

---

## 2026-05-21 17:00 — Verified end-to-end detection

Submitted a real audit. Then manually edited `pricing.json` to bump cursor pro from $20 to $25. Hit `/api/detect-changes`. Confirmed:
- Audit row now has `invalidated: true`
- Console logs show the correct diff: `cursor (pro): 20 → 25`
- Email was sent (checked Resend dashboard — 1 email delivered)

The email content was a bit sparse. Going to improve the HTML template next.

---

## 2026-05-21 17:45 — Improved pricing change email

The existing `sendPricingChangeEmail` used a plain text `changesSummary` string pasted into a `<pre>` tag. Rewrote it with a proper HTML table showing tool / plan / old price / new price / delta. Added the re-audit button prominently. Also made sure the re-audit URL points to `/re-audit/:auditId` on the frontend, not the old `/report/` route.

---

## 2026-05-21 18:30 — Email consolidation bug

Realized the cron was sending one email per audit, not one email per user. If a user had 3 audits and pricing changed on tools in all 3, they'd get 3 emails. The spec says send one consolidated email.

Refactored `runPricingCheck()`: first pass collects all affected audits, groups them by user email into a Map, second pass sends one email per user with all affected audits listed. Tested with two audits under the same user account — confirmed one email with both audits listed.

---

## 2026-05-21 19:15 — Started diff view on frontend

The re-audit flow already existed (`/re-audit/:auditId` route was in the router). The `reRunAuditService` returns a diff object with `oldResult`, `newResult`, and `diff.toolChanges`. The frontend page was mostly a placeholder. 

Built the diff UI: side-by-side cards for old vs new score and monthly cost. Total savings delta as the headline in green/red. Tool changes table: rows with no change are muted gray, changed rows are amber highlighted.

---

## 2026-05-21 20:00 — Diff UI edge cases

Handled the case where `oldReport` is null (audit was created before Round 2, so no old data). In that case show a banner: "No previous report data — showing current audit only." Also handled `toolChanges` being empty (price changed but the user wasn't on that plan) — diff table shows "No tool changes affected your stack."

---

## 2026-05-21 20:45 — Manual full end-to-end test

Complete flow test:
1. Submitted audit with Cursor Pro, 5 seats
2. Confirmed `pricing_snapshot` saved ✓
3. Changed cursor pro price in pricing.json: 20 → 30
4. POST /api/detect-changes ✓
5. Audit marked invalidated ✓
6. Email received with table showing cursor pro $20 → $30 ✓
7. Clicked re-run link in email ✓
8. Diff page loaded, showed: old cost $100 → new cost $150, savings delta -$50 (red) ✓
9. Re-ran audit ✓
10. Audit marked invalidated: false, pricing_snapshot updated ✓

---

## 2026-05-21 21:15 — Cleaned up and wrote docs

Reverted `pricing.json` to real prices. Cleaned up console.log statements I'd left in during debugging. Wrote `ROUND2_PR.md`. Added comments to `pricingMonitor.cron.js` explaining the consolidation logic. Wrote this devlog from notes.

---

## 2026-05-21 21:45 — Final review pass

Re-read the requirements checklist:
- ✅ Persistent audit storage (pricing_snapshot saved, audit_id same as share URL)
- ✅ Pricing-change detection (cron + manual endpoint)
- ✅ Notification emails (Resend, consolidated per user, includes what changed + re-run link)
- ✅ Diff view on re-run (side-by-side, highlighted changes, savings delta headline)

Bonus items: unsubscribe link — skipped (documented in PR). Public pricing changelog page — skipped. Admin dashboard — skipped. Time is up, core 4 work.

Pushed final commits. Branch: `round-2-reaudit`.