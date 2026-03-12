

# Fix: Move Contentful Publishing to Edge Function

## Root Cause

The publish button calls `publishDocToContentful` which runs entirely in the browser. It needs the Contentful **Management Token** to create assets and entries via the Management API. But the management token is a server-side secret — it's not available in `import.meta.env` or `window.env` in the browser. So `getContentfulConfig()` returns an empty `MANAGEMENT_TOKEN`, and the function throws "Contentful management token or space ID not configured" (caught silently, shown as a toast error or swallowed).

## Solution

Move the Contentful Management API calls to a new edge function `publish-doc-to-contentful`. The browser already uploads screenshots to Supabase Storage successfully — it just needs to send the public URLs and metadata to the edge function, which has access to `VITE_CONTENTFUL_MANAGEMENT_TOKEN` and `CONTENTFUL_SPACE_ID`.

## Changes

### 1. New edge function: `supabase/functions/publish-doc-to-contentful/index.ts`
- Accepts JSON body: `{ articleTitle, sectionCategory, headingCategory, publishImmediately, steps: [{ publicUrl, description, order }] }`
- Requires auth (admin check via `is_admin` RPC, same pattern as `get-contentful-config`)
- Reads `VITE_CONTENTFUL_MANAGEMENT_TOKEN`, `CONTENTFUL_SPACE_ID` (or `VITE_CONTENTFUL_SPACE_ID`), `VITE_CONTENTFUL_ENVIRONMENT_ID` from `Deno.env`
- Creates Contentful assets from public URLs, processes them, builds rich text document, creates `helpDeskArticle` entry as draft
- Optionally publishes if `publishImmediately` is true
- Returns `{ success, entryId }` or `{ success: false, error }`

### 2. Refactor `src/services/cms/utils/docBuilderPublish.ts`
- Keep `uploadToStorage` (runs client-side, works fine)
- Remove `createContentfulAsset`, `buildRichTextDocument` (moved to edge function)
- `publishDocToContentful` now:
  1. Uploads blobs to Supabase Storage (existing logic)
  2. Calls the edge function via `supabase.functions.invoke('publish-doc-to-contentful', { body: { articleTitle, sectionCategory, headingCategory, publishImmediately, steps: [{ publicUrl, description, order }] } })`
  3. Returns the result

### 3. Update `supabase/config.toml`
- Add `[functions.publish-doc-to-contentful]` with `verify_jwt = false`

