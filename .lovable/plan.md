## Plan: Never get caught by an expired Contentful token again

Contentful Content Delivery API tokens (CDA/CPA) can be set to expire on a fixed date. The fix is a combination of (a) knowing the expiry date, (b) getting warned well before it, and (c) making rotation a 30-second job instead of a site-wide incident.

### 1. Record the expiry up front
- In the Contentful web app → Settings → API keys, open the delivery token and note the **Expires** date (or set one if it's currently "Never").
- Store that date in `mem://` project memory (e.g. `mem://ops/contentful-token-expiry`) so future sessions automatically know when the next rotation is due.

### 2. Proactive monitoring (pick one — recommended: edge function + cron)
Add a Supabase edge function `check-contentful-token` that:
- Calls `GET https://cdn.contentful.com/spaces/{space}/content_types` with the current delivery token.
- On `401`, sends an alert (email via existing SES function, or Slack webhook if you prefer).
- Optionally also checks a stored `CONTENTFUL_TOKEN_EXPIRES_AT` secret and alerts when fewer than 14 / 7 / 1 days remain.

Schedule it daily via `pg_cron` (Lovable Cloud / Supabase). One daily ping = guaranteed early warning, no third-party service.

Alternative: a free uptime monitor (UptimeRobot, BetterStack) hitting `applestonesolutions.com` keyword-checking for a hero string. Less precise (only catches it after breakage) but zero code.

### 3. In-app early-warning banner (optional, belt-and-suspenders)
In `ContentfulPersistenceProvider`, when a fetch returns 401, surface a visible admin-only toast/banner ("Contentful token rejected — rotate it") instead of silently cascading errors. This makes the failure mode obvious the moment it starts, even before the cron alert fires.

### 4. Make rotation painless
Document the rotation runbook (3 steps) in `SECURITY.md` or a new `docs/contentful-token-rotation.md`:
1. Generate a new CDA token in Contentful.
2. Paste it into Lovable → tell the agent "rotate the Contentful token to `<value>`" — agent updates `.env`, `public/env-config.js`, bumps `CREDENTIALS_VERSION` + service-worker `CACHE_NAME`, and publishes.
3. Hard-reload to confirm.

### 5. Prefer non-expiring tokens where possible
Contentful CDA tokens can be created without an expiry. Unless your security policy requires rotation, create the replacement token with **no expiry** and rely on manual rotation only if leaked. That removes the recurring failure mode entirely.

### What I'd build now (if you approve)
- Edge function `check-contentful-token` + daily cron + email alert to a configurable address.
- Admin-only "Contentful auth failed" banner in `ContentfulPersistenceProvider`.
- `docs/contentful-token-rotation.md` runbook.
- Memory entry with the current token's expiry date (you'd tell me the date or I'd read it from Contentful via the connector).

### Questions before building
1. Do you want the daily check + email alert, the in-app banner, or both?
2. What email address (or Slack webhook) should alerts go to?
3. Want me to switch the replacement token to **no expiry** going forward, or keep dated rotations?