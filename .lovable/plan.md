## Plan

1. **Update live runtime config source**
   - Replace the deployed `env-config.js` logic so production/custom domains also receive the current Contentful delivery token instead of relying on stale build/runtime values.
   - Keep the existing localStorage and cache cleanup, but make it override stale saved Contentful credentials instead of reusing them.

2. **Force a new live deployment version**
   - Update `index.html` to reference a new `env-config.js` cache-busting version.
   - Bump the service worker cache name again so the live site installs a fresh worker and clears old cached Contentful responses.

3. **Validate deployed behavior after publish/update**
   - Confirm the source files include the new version and current token.
   - After you publish/update the live site, verify `applestonesolutions.com` serves the new `env-config.js` and service worker rather than the old deployment.

## Important note

The custom domain is currently still serving the old published build: its `index.html` references plain `/env-config.js`, and its service worker is still `vendingsolutions-v2`. The preview has the newer files, but they have not reached the live deployment yet.