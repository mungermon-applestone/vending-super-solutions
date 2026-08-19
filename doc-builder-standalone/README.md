# Doc Builder — standalone extraction bundle

Everything needed to run the screen-capture → CMS publishing tool as its own Lovable app,
with self-serve accounts and per-user CMS credentials.

## How to use this bundle

1. Create a new blank Lovable project (React + Vite + Tailwind + shadcn, Lovable Cloud enabled).
2. In that project, either @mention this Applestone project and ask me to copy the doc-builder
   code across, or upload this folder.
3. Apply `supabase/migrations/0001_init.sql` via the migration tool.
4. Deploy the two edge functions in `supabase/functions/`.
5. Enable Email + Google auth providers, self-serve signup on.

## Contents

```
src/hooks/useScreenCapture.ts          capture engine (auto/manual/video frame extraction) — copied as-is
src/components/doc-builder/*           capture UI — copied as-is except PublishForm (see below)
src/pages/DocBuilder.tsx               main page — replace the LoginGate with the app's auth shell
src/pages/CmsSettings.tsx              NEW: per-user CMS connection form + test connection
src/cms/types.ts                       NEW: provider-agnostic CMS interface
src/lib/publishArticle.ts              NEW: upload to private storage + invoke publish-article
supabase/functions/publish-article/    NEW: generic publisher, Contentful provider inside
supabase/functions/test-cms-connection NEW: validates a connection before saving
supabase/migrations/0001_init.sql      NEW: profiles, cms_connections, capture_sessions,
                                       published_articles, private screenshots bucket
```

## What changed vs the Applestone version

- No admin allowlist / `is_admin` RPC. Any signed-in user can use the tool; RLS scopes all rows
  to `auth.uid()`.
- Contentful space/environment/tokens and the target content type + field names come from the
  user's `cms_connections` row instead of project secrets and hardcoded `helpDeskArticle`.
- Screenshots go to a **private** bucket under `${user_id}/${session_id}/…`; the edge function
  hands Contentful a short-lived signed URL for asset import.
- Publishing goes through `CmsProvider`, so adding WordPress/Sanity/Strapi is a new file in
  `supabase/functions/publish-article/providers/`.

## Follow-up on the Applestone site

Once the standalone app is verified, remove from this project: `src/pages/DocBuilder.tsx`,
`src/components/doc-builder/`, `src/hooks/useScreenCapture.ts`,
`src/services/cms/utils/docBuilderPublish.ts`, the `/doc-builder` route,
the `publish-doc-to-contentful` edge function, and the `doc-builder-screenshots` bucket.
