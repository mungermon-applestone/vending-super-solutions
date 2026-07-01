# Export Published Machine Entries from Contentful

Exports every **published** entry of the `machine` content type to timestamped JSON + CSV files under `exports/`.

## Prerequisites

`.env` must contain (already set in this project):

- `VITE_CONTENTFUL_SPACE_ID`
- `VITE_CONTENTFUL_ENVIRONMENT_ID` (defaults to `master`)
- `VITE_CONTENTFUL_DELIVERY_TOKEN`

## Run

```bash
npm run export:machines
```

Or override the environment for a single run:

```bash
CONTENTFUL_ENVIRONMENT_ID=staging npm run export:machines
```

## Output

Two files in `exports/`:

- `machines-published-<timestamp>.json` — full entries with linked assets/entries resolved 2 levels deep.
- `machines-published-<timestamp>.csv` — flat spreadsheet view (id, title, slug, type, temperature, visible, displayOrder, showOnHomepage, updatedAt, publishedAt).

## Notes

- Uses the Contentful **Content Delivery API** (`cdn.contentful.com`), which by design returns only currently-published entries. No status filter is needed.
- Read-only — safe to run any time. Does not touch Supabase, edge functions, or the running app.
- To include drafts or changed-but-not-published entries, you'd need the Preview API (different token) or the Management API — out of scope for this script.
