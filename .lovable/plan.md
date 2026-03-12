

# Fix: Publish to Contentful Not Reaching Edge Function

## Root Cause (Two Issues)

**Issue 1: No Supabase session.** The `/doc-builder` page has no auth gate. The storage upload requires an authenticated user (RLS policy: `TO authenticated`). Without a session, the upload fails at step 1, so the edge function is never called — explaining the empty logs.

**Issue 2: Invalid API call in edge function.** The function uses `supabase.auth.getClaims(token)` which does not exist in the Supabase JS client. It needs to use `supabase.auth.getUser(token)` instead. This would cause a 401 even if the function were reached.

## Changes

### 1. `src/pages/DocBuilder.tsx` — Add auth gate
- Import `useAuth` from `AuthContext`
- If no session, show a login form (email/password using existing `signIn` from AuthContext)
- Only render the doc builder UI when authenticated
- This ensures `supabase.storage.upload()` and `supabase.functions.invoke()` both have a valid JWT

### 2. `supabase/functions/publish-doc-to-contentful/index.ts` — Fix auth
- Replace `supabase.auth.getClaims(token)` with `supabase.auth.getUser(token)`
- Use `user.id` instead of `claimsData.claims.sub`
- Use `SUPABASE_SERVICE_ROLE_KEY` instead of `SUPABASE_ANON_KEY` for the admin RPC call (the anon key client can't call `is_admin` which is a security definer function — service role ensures it works)

### 3. `src/services/cms/utils/docBuilderPublish.ts` — Better error visibility
- Add console.log before storage upload attempts
- Log the specific step that fails so debugging is easier

