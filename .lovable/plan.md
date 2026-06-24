## Goal

Let you sign into the admin tools (`/doc-builder`, `/admin/export-help-desk`) with your Google account instead of the lost password. Admin access stays gated by the `public.admin_users` table, so OAuth doesn't weaken security — it only changes how you prove who you are.

## Why this is safe

- Admin gating is server-side: RLS + the `is_admin(uid)` SECURITY DEFINER function check `admin_users.user_id`. The auth method (password vs Google) is irrelevant.
- Google adds 2FA and removes the reused-password risk — net security improvement.
- No client-side admin checks are introduced.

## Steps

### 1. Enable Google provider in Supabase (you do this once, in the dashboard)

I'll give exact instructions in chat. Summary:
- Google Cloud Console → create OAuth Client ID (Web application)
- Authorized redirect URI: `https://rwvlvooojegpebognnzn.supabase.co/auth/v1/callback`
- Paste Client ID + Secret into Supabase Dashboard → Authentication → Providers → Google
- Under Authentication → URL Configuration, add `https://applestonesolutions.com`, the preview URL, and `http://localhost:*` to allowed redirect URLs.

### 2. Add Google sign-in to the UI

- Extend `AuthContext` with a `signInWithGoogle()` method that calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/doc-builder' } })`.
- Add a "Continue with Google" button to the login forms in `src/pages/DocBuilder.tsx` and `src/pages/admin/ExportHelpDeskArticles.tsx`, above the email/password fields, with a visual divider.

### 3. Link your Google identity to admin_users

Two clean options — I'd suggest **(a)**:

**(a) Update the existing admin_users row** to your new Google user_id after your first Google sign-in. I'll provide a one-line migration once you've signed in once and we can read the new `auth.users.id` (visible in the Supabase dashboard → Authentication → Users).

**(b)** Insert a second `admin_users` row for the Google user_id, leaving the password row in place as a backup.

### 4. Keep password login working

The existing email/password form stays as a fallback. We don't delete the password row from `admin_users` unless you want to.

## Technical notes

- Files touched: `src/context/AuthContext.tsx`, `src/pages/DocBuilder.tsx`, `src/pages/admin/ExportHelpDeskArticles.tsx`.
- One small migration after first Google login to update `admin_users.user_id`.
- No edge function changes; `is_admin()` already works for any `auth.uid()`.
- No changes to RLS policies or other admin gates.

## What I need from you before building

Just confirm the plan. After you approve:
1. I'll implement the code changes.
2. You'll enable Google in the Supabase dashboard (I'll walk you through it).
3. You'll sign in with Google once.
4. I'll run the migration to point `admin_users` at your Google user_id.
