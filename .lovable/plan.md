# Export Published "Machine" Entries from Contentful

Add a one-off admin script that pulls every published `machine` entry from the configured Contentful space and writes the result to a downloadable JSON file. Nothing on the live site changes.

## Approach

Contentful's **Content Delivery API (CDA)** only returns published entries by design, so we use it (not the Management API) with the existing delivery token. The script paginates through all entries and resolves linked assets/entries.

## What to build

1. **`scripts/export-published-machines.mjs`** — Node script run locally with `node scripts/export-published-machines.mjs`.
   - Reads `VITE_CONTENTFUL_SPACE_ID`, `VITE_CONTENTFUL_ENVIRONMENT_ID` (default `master`), and `VITE_CONTENTFUL_DELIVERY_TOKEN` from `.env`.
   - Calls `GET https://cdn.contentful.com/spaces/{space}/environments/{env}/entries?content_type=machine&limit=100&skip={n}&include=2`.
   - Loops until `skip + items.length >= total`.
   - Merges included `Asset` / `Entry` links into each item (simple resolver) so exported records are self-contained.
   - Writes `exports/machines-published-<timestamp>.json` with `{ exportedAt, space, environment, count, items }`.
   - Also writes a flat `machines-published-<timestamp>.csv` with core fields (title, slug, type, temperature, visible, updatedAt) for spreadsheet use.

2. **`package.json`** — add script:
   ```
   "export:machines": "node scripts/export-published-machines.mjs"
   ```

3. **`docs/contentful-export-machines.md`** — short runbook: prerequisites, command, output location, note that CDA = published only, and how to switch env via `CONTENTFUL_ENVIRONMENT_ID=staging npm run export:machines`.

## Technical notes

- CDA returns only the published version of each entry, so no extra status filtering is required.
- Using `include=2` resolves image assets and any linked references two levels deep — enough for the current `machine` model (thumbnail, images).
- Script is read-only, uses the delivery token already in `.env`, and does not touch Supabase, edge functions, or app runtime code.
- If the user later wants draft/changed entries too, that requires the Preview API + preview token or the Management API — out of scope here.

## Out of scope

- No UI button in the admin panel (can add later if wanted).
- No changes to existing `useContentfulMachines`, edge functions, or the token-monitoring cron.
