# feat: add re-audit on pricing change with email notifications

## What this PR does

This PR adds live audit staleness detection to Audit.ai. When AI tool pricing changes, stored audits are automatically invalidated, affected users receive a consolidated email notification with a one-click re-run link, and the re-run page shows a side-by-side diff of the old vs new audit result. Audits are now persisted with a pricing snapshot at the time of generation so changes can be detected precisely.

## Why

A one-time audit becomes misleading the moment pricing changes — Cursor raised prices in 2024, Claude added tiers in 2025, Copilot restructured plans. Users who made decisions based on a stale audit are worse off than users with no audit at all. This feature turns Audit.ai from a snapshot tool into a living monitoring layer for your AI stack spend.

## How it works

```
User submits audit
      │
      ▼
audit.controller.js saves audit row + pricing_snapshot (JSON of current pricing)
      │
      ▼
pricingMonitor.cron.js runs hourly (node-cron) OR POST /api/detect-changes triggers manually
      │
      ▼
detectPricingChanges() in pricingDiff.service.js diffs pricing_snapshot vs current pricing.json
      │
      ├─ No changes → update last_checked_at
      │
      └─ Changes found → mark audit.invalidated = true
                       → group by user email (one email per user)
                       → sendPricingChangeEmail() via Resend with re-audit link
                       │
                       ▼
              User clicks link → /re-audit/:auditId
                       │
                       ▼
              reRunAuditService() regenerates report with current pricing
                       │
                       ▼
              Frontend renders diff view: old score vs new score,
              old monthly cost vs new, changed recommendations highlighted
```

**New files added:**
- `backend/src/services/reAudit.service.js` — re-runs audit logic and returns diff object
- `backend/src/services/pricingDiff.service.js` — detects plan-level pricing changes between two snapshots
- `backend/src/cron/pricingMonitor.cron.js` — hourly cron + manual trigger, groups emails per user
- `backend/src/controllers/reAudit.controller.js` — exposes `GET /api/re-audit/:auditId`
- `backend/src/routes/reAudit.routes.js` — route wiring

**Modified files:**
- `audit.controller.js` — saves `pricing_snapshot` on every audit creation
- `emailService.js` — added `sendPricingChangeEmail()` with re-audit CTA
- `server.js` — imports cron module, mounts `/api/detect-changes` manual trigger endpoint

## What I cut

- **One-click unsubscribe in email** — the re-audit link in the email was higher priority and took the available time. Unsubscribe would have required a separate `email_preferences` table and an unsubscribe token route. Worth adding in the next sprint.
- **"What changed in the AI tooling market this week" public page** — a good growth surface but not core to the 4 required features. Would be a simple `GET /api/pricing-changelog` endpoint reading a `pricing_change_log` table, seeded by the monitor cron.
- **Admin dashboard (total audits / emails sent / click-through)** — skipped because the cron already logs to console and Supabase has a built-in table editor. Adding a proper dashboard UI was lower ROI within the time budget.
- **Automated tests for the diff logic** — I manually verified the diff by seeding a changed price in `pricing.json` and triggering the `/api/detect-changes` endpoint. Unit tests for `detectPricingChanges()` and `calculateTotalCost()` are the first thing I'd add with another few hours.

## How to test it manually

1. **Submit an audit** — log in, pick any tools, fill metrics, submit. Note the audit ID from the response or the dashboard URL.

2. **Confirm pricing snapshot was saved** — in Supabase table editor, open `audits`, find the row, confirm `pricing_snapshot` is not null.

3. **Simulate a pricing change** — open `backend/src/data/pricing.json` and change any plan price by $1 (e.g. bump `cursor.pro` from 20 to 25). Save the file. (On the live deploy, hit `POST /api/admin/update-pricing` with the new value instead.)

4. **Trigger detection manually:**
   ```bash
   curl -X POST https://<your-deploy>/api/detect-changes \
     -H "Authorization: Bearer <admin-token>"
   ```
   Or just wait for the hourly cron if the deploy is live.

5. **Check your inbox** — the user associated with the audit should receive one consolidated email listing which tools changed and a "Re-run Audit" button.

6. **Click the re-run link** → you land on `/re-audit/:auditId`. The page shows:
   - Old score vs new score
   - Old monthly cost vs new monthly cost (savings delta as headline)
   - Per-tool rows: unchanged rows muted, changed rows highlighted in amber

7. **Confirm re-audit saved** — back in Supabase, `audits.invalidated` should now be `false` and `pricing_snapshot` updated to current pricing.

## What's tested

- Manual end-to-end flow described above (completed during development).
- `detectPricingChanges()` manually verified with three cases: price moved up, plan added, plan removed.
- Email consolidation verified: seeded two audits for the same user, triggered detection, confirmed one email received (not two).
- Skipped automated unit tests due to time; would write them first if given more time. Priority order: `detectPricingChanges()` pure function → `calculateTotalCost()` → `reRunAuditService()` with Supabase mocked.

## Open questions / risks

- **Cron on Vercel free tier** — `node-cron` works when the server is warm but Vercel serverless functions sleep between requests. The manual `/api/detect-changes` endpoint is the reliable fallback; a GitHub Actions schedule calling it on a cron would be more robust in production.
- **pricing.json as source of truth** — currently a static file. If two instances deploy with different versions of the file, the diff will fire false positives. Moving pricing to a `pricing` table in Supabase (with an admin edit UI) would make this production-safe.
- **Email deliverability at scale** — Resend's free tier has a 100 emails/day cap. If the user base grows, a pricing change affecting 500 users would silently fail for 400 of them. Need rate-limit handling and a retry queue before scaling.