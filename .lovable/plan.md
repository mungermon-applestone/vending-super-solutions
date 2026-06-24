## Plan: Finalize Contentful monitoring (alerts only)

The token has no expiry, so we'll skip the expiry-date secret and rely on the daily live-ping cron. Alerts go to the existing `EMAIL_TO` recipient.

### Changes

1. **No new secrets needed.** The `check-contentful-token` edge function already falls back to `EMAIL_TO` when `CONTENTFUL_ALERT_EMAIL` is not set, and it already skips expiry warnings when `CONTENTFUL_TOKEN_EXPIRES_AT` is not set. So nothing to add.

2. **Smoke-test the function** by invoking it once via curl and confirming it returns `{ ok: true }` (token valid) and doesn't send an alert.

3. **Update `docs/contentful-token-rotation.md`** to note that the active token (`June Delivery Token`) has no expiry, so monitoring is failure-only and the cron is the early-warning system.

4. **Update memory** (`mem://ops/contentful-token-monitoring`) to reflect that the expiry secret is intentionally unused.

No code or secret changes required beyond the doc/memory tweaks. After that, the system is fully wired and you'll get an email at the `EMAIL_TO` address the next morning the token starts returning 401 for any reason.