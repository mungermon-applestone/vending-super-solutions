# Export Help Desk Articles for AI Gap Analysis

Add a one-click export tool that pulls every `helpDeskArticle` entry from Contentful and downloads it as a single file you can feed to an AI (Claude, ChatGPT, Gemini) alongside your current software state.

## What you'll get

A new admin page at `/admin/export-help-desk` with two buttons:

1. **Download as Markdown** — one human/AI-readable `.md` file with every article (title, slug, category, body converted from Contentful Rich Text to plain Markdown). Best for pasting into an AI chat.
2. **Download as JSON** — full structured dump (all fields, IDs, timestamps, tags). Best for programmatic diffing or re-importing later.

Both include article count and export timestamp at the top.

## How it works (technical)

- New page `src/pages/admin/ExportHelpDeskArticles.tsx`, gated by the existing admin check (`admin_users` table, same pattern as DocBuilder).
- New Supabase edge function `supabase/functions/export-help-desk-articles/index.ts` that:
  - Paginates through `/spaces/{space}/entries?content_type=helpDeskArticle&limit=1000&skip=N` via the Contentful gateway (reuses the existing `CONTENTFUL_SPACE_ID` / `CONTENTFUL_API_KEY` secrets already wired into `get-contentful-config`).
  - Resolves linked assets (images) to URLs.
  - Returns `{ articles: [...], count, exportedAt }`.
- Frontend converts Rich Text → Markdown using `@contentful/rich-text-plain-text-renderer` (lightweight) plus a small custom walker for headings/lists/links, then triggers a browser download. JSON download is just `JSON.stringify` + Blob.
- Route added to `src/routes.tsx` behind the admin guard.

## Suggested AI workflow (after export)

1. Download the Markdown file.
2. In Claude/ChatGPT, attach: (a) the exported `help-desk-articles.md`, (b) a description or sitemap of your current app features (e.g., the routes list from `src/routes.tsx` plus screenshots from DocBuilder).
3. Prompt: *"Compare the documented features to the actual feature list. Produce a table of: (1) documented but removed/changed, (2) undocumented features needing new articles, (3) articles needing updates."*

## Files changed

- New: `src/pages/admin/ExportHelpDeskArticles.tsx`
- New: `supabase/functions/export-help-desk-articles/index.ts`
- Edit: `src/routes.tsx` (add admin route)
- Add dep: `@contentful/rich-text-plain-text-renderer`

No DB migrations, no new secrets — Contentful credentials are already configured.
