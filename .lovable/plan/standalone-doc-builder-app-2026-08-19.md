# Standalone Doc Builder app

Extract the `/doc-builder` tool into a self-contained application that captures screenshots from screen shares or videos, lets you caption/crop/reorder them, and publishes them to a CMS — starting with Contentful, structured so other CMSs can be added later.

## How the extraction happens

I cannot create a new Lovable project from here. Two workable paths:

1. **Recommended:** you create a new blank Lovable project, then in that project @mention this one. I copy the doc-builder code across and rework it there.
2. **Alternative:** remix this project and delete the Applestone site from the copy (faster start, but drags along the whole marketing site's history and dependencies).

Either way the work below is what gets built in the new project.

## What moves over

- Capture engine: `useScreenCapture` (auto change-detection, manual capture, video frame extraction)
- UI: CaptureControls, CapturePreview, VideoCapture, ScreenshotTimeline, ImageCropper, PublishForm
- Publish pipeline: upload screenshots to storage, then create a CMS entry with an image + caption per step
- Auth shell and shadcn/Tailwind design system

## What changes in the standalone app

**Self-serve accounts.** Email/password plus Google sign-in, open signup — no admin allowlist. Each account owns its own data.

**Per-user CMS settings.** A Settings screen where a user enters their Contentful space ID, environment, delivery token, and management token, plus the content type and field names to publish into (article title field, body rich-text field, optional category fields). Credentials are stored server-side per account, never exposed to the browser after saving. A "Test connection" button validates before saving.

**CMS abstraction.** The publish step goes through a provider interface (`createArticle`, `uploadAsset`, `testConnection`) with a Contentful implementation behind it, so a future WordPress/Sanity/Strapi provider is a new file rather than a rewrite.

**Projects / articles list.** Saved capture sessions per user so work isn't lost on refresh, with a history of published articles.

**Own branding.** Neutral product identity, its own landing page and metadata — no Applestone references.

## Technical notes

- Lovable Cloud (Supabase) backend in the new project: `profiles`, `cms_connections` (per-user, RLS-scoped, tokens stored encrypted/server-only), `capture_sessions`, `published_articles`; private storage bucket for screenshots with per-user path prefixes.
- Edge functions: `publish-article` (validates session, loads that user's CMS connection, creates assets + entry) and `test-cms-connection`. Management tokens are read only inside edge functions.
- The current version hardcodes the `helpDeskArticle` content type and `articleTitle`/`articleContent` fields; those become per-connection configuration.
- Storage upload currently uses a public bucket and a flat session path; the new app uses a private bucket with signed URLs handed to the CMS during asset import.

## Applestone site

`/doc-builder` stays live here until the standalone app is verified working, then I remove the page, its components, hook, publish service, edge function, and storage bucket in a follow-up.

## First step

Tell me which extraction path you want (new blank project + cross-project copy, or remix). Then I build the standalone app in that project.
