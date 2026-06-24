# Contentful Token Rotation Runbook

The site's Contentful Content Delivery API (CDA) token can be set to expire. When it does, the public site stops loading content and you'll see cascading `401 Unauthorized` errors from `cdn.contentful.com`.

## Proactive monitoring

A scheduled Supabase edge function (`check-contentful-token`) runs **daily at 13:00 UTC** and:

1. Pings the Contentful CDA with the current token.
2. If the optional `CONTENTFUL_TOKEN_EXPIRES_AT` secret (ISO date, e.g. `2026-12-24`) is set, warns 14 / 7 / 3 / 1 days before expiry.
3. On 401 or expiry, sends an email via AWS SES to `CONTENTFUL_ALERT_EMAIL` (falls back to `EMAIL_TO`).

To change the alert recipient, set the `CONTENTFUL_ALERT_EMAIL` secret in Supabase. To set/update the known expiry, set `CONTENTFUL_TOKEN_EXPIRES_AT` to the date Contentful displays for the active key.

Manual test:

```bash
curl -X POST https://rwvlvooojegpebognnzn.supabase.co/functions/v1/check-contentful-token \
  -H "apikey: <SUPABASE_ANON_KEY>"
```

## Rotation steps (3 minutes)

1. **Generate a new token** in Contentful → Settings → API keys → your CDA key → "Generate token" (or create a new key with no expiry, which is recommended unless your security policy demands rotation).
2. **Update the project** — in Lovable chat, paste:
   > Rotate the Contentful delivery token to `<new token>` (expires `<new date or 'never'>`).
   
   The agent will update `.env`, `public/env-config.js` (`PREVIEW_CREDENTIALS` + `CREDENTIALS_VERSION`), bump `CACHE_NAME` in `public/service-worker.js`, bump the `?v=` query in `index.html`, set `VITE_CONTENTFUL_DELIVERY_TOKEN` + `CONTENTFUL_TOKEN_EXPIRES_AT` in Supabase secrets, and then publish.
3. **Hard-reload** `applestonesolutions.com` once (or DevTools → Application → Service Workers → Update) to evict the old service worker, then confirm the Authorization header on Contentful requests ends with the new token's last 5 chars.

## Why all the cache busting?

The previous outage was masked by:
- The browser HTTP-caching `/env-config.js`.
- The service worker (`vendingsolutions-v2`) holding a stale Contentful response cache for 30 minutes.

Bumping `CREDENTIALS_VERSION`, the `?v=` query, and `CACHE_NAME` together forces every visitor to fetch the new config and discard old cached responses on the next visit.
