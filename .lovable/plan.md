# Fix recurring Contentful 401 errors

## Confirmed diagnosis

The failing browser request is using the older Contentful token ending in `d7vf4`, while the current runtime files contain the rotated token. On the production domain, an authenticated admin session takes a different configuration path: `getContentfulConfig()` calls the protected `get-contentful-config` Edge Function, whose `VITE_CONTENTFUL_DELIVERY_TOKEN` secret can override the newer browser runtime token. This explains why the error returned after signing in to the Documentation Builder.

The app also persists Contentful credentials in local storage and maintains several overlapping token sources, making future rotations prone to drift.

## Changes

1. **Synchronize the live secrets**
   - Update both Contentful delivery-token secrets used by the Edge Functions to the current rotated token.
   - Keep the token monitor and authenticated configuration endpoint aligned with the same value.

2. **Make delivery-token selection deterministic**
   - Use the current browser runtime configuration as the authoritative source for Contentful Delivery API reads, whether the visitor is signed in or signed out.
   - Keep the protected Edge Function path only for admin-only credentials such as Contentful management/preview access.
   - Prevent an authenticated session from replacing the current delivery token with an older Edge Function value.

3. **Remove stale credential persistence**
   - Stop reading or writing Contentful delivery credentials in local storage.
   - Retain only harmless cleanup needed for users who already have old credential records.
   - Remove unreachable legacy credential-selection branches so the active precedence is clear.

4. **Recover cleanly from rotations**
   - Ensure a refreshed runtime configuration resets the in-memory Contentful client.
   - Avoid repeatedly retrying a known-invalid in-memory token after a 401.

5. **Verify the affected flows**
   - Test `/doc-builder` while authenticated and confirm Help Desk content loads without a 401.
   - Test a public Contentful-backed page while signed out.
   - Confirm no stale token is restored after reload.
   - Check the Contentful token-monitor function against the synchronized secret.

## Technical scope

Expected files include the CMS configuration/client, runtime configuration bootstrap, and Contentful token-monitor/config Edge Functions. No Contentful content models or page copy will change.