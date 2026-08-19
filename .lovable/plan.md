# Make the Doc Builder bundle reachable from the new project

The zip only exists in this session's scratch storage, which is why the download is flaky and why the other project's instance never found it. The reliable path is to put the bundle inside this project's own repo — then the new project can read it directly with a cross-project checkout, no downloading or uploading involved.

## What gets added here

A new top-level folder `doc-builder-standalone/` committed to this project, containing the 29 files already built:

```text
doc-builder-standalone/
  README.md
  src/cms/types.ts                        provider-agnostic CMS contract
  src/hooks/useScreenCapture.ts           capture engine
  src/components/doc-builder/*.tsx        CaptureControls, CapturePreview,
                                          ImageCropper, PublishForm,
                                          ScreenshotTimeline, VideoCapture
  src/lib/publishArticle.ts
  src/pages/DocBuilder.tsx, CmsSettings.tsx
  supabase/functions/publish-article/     index.ts + contentful.ts
  supabase/functions/test-cms-connection/index.ts
  supabase/migrations/0001_init.sql
```

It is inert reference material: nothing imports it, no route points at it, and it does not affect the Applestone site build. The live `/doc-builder` page stays exactly as it is.

## What you send to the other project

Once it is committed, the reply becomes a one-liner: tell that instance to check out this project by name or ID and copy from `doc-builder-standalone/`. It gets the real files instead of waiting on a transfer.

## On the Contentful Management token

Say yes to the secure form, but scope it as a developer test credential, not the app's shared write key. The standalone app is meant to be multi-tenant, so the durable design is: each user saves their own space ID, environment, and CMA token in Settings; those are stored server-side, RLS-scoped to the account, read only inside edge functions, and never returned to the browser. `0001_init.sql` and `test-cms-connection` in the bundle already assume that shape.

## Note on the folder name

If you would rather not carry a second `supabase/` tree in the repo (some tooling scans for it), the alternative is naming it `reference/doc-builder-standalone/`. Functionally identical for the handoff.
