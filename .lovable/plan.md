## Rotate the Contentful Delivery API Token

The public site is throwing `401 AccessTokenInvalid` because `VITE_CONTENTFUL_DELIVERY_TOKEN` (ending `…d7vf4`) is no longer valid in Contentful space `al01e4yh2wq4`. We'll mint a new Delivery token in Contentful and update the secret in Lovable.

### Step 1 — Get a new Delivery token from Contentful

1. Go to https://app.contentful.com and open the **Applestone** space.
2. Top nav: **Settings → API keys**.
3. You'll see existing API keys (each one has a *Content Delivery API token* and a *Content Preview API token*). Two options:
   - **Preferred:** click the existing key that the site has been using (likely named something like "Website" or "Lovable"), then click **Regenerate** next to the *Content Delivery API - access token*. Copy the new token immediately — Contentful only shows it once.
   - **Or:** click **Add API key**, name it (e.g. "Lovable Production"), save, and copy the *Content Delivery API - access token*.
4. While you're on that screen, double-check the **Space ID** matches `al01e4yh2wq4` and the **Environment** includes `master` (or whatever env the site uses).

### Step 2 — Update the secret in Lovable

Once you paste the new token to me, I'll update the `VITE_CONTENTFUL_DELIVERY_TOKEN` secret using the secrets tool. Because it's a `VITE_` prefixed build-time variable, the site will pick it up on the next build/preview reload — no code changes needed.

If the new key has a different *Space ID* or *Environment ID* than what's currently stored, I'll also update `VITE_CONTENTFUL_SPACE_ID` and/or `VITE_CONTENTFUL_ENVIRONMENT_ID` at the same time.

### Step 3 — Verify

After the secret is updated:
1. Hard-refresh the preview / homepage.
2. The red "Error loading page content" banner should disappear and Contentful-driven sections (hero, business goals, etc.) should render.
3. If anything still 401s, we'll check the browser network tab for the failing request and confirm which token/space/env it's using.

### Notes / safety
- The old token can be left active in Contentful until you confirm the new one works, then **revoke** it from the API keys screen so the leaked one can't be reused.
- No code files change in this plan — it's purely a secret rotation.
