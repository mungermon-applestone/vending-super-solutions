# Move the NAMA badge into Contentful

Today the NAMA logo lives in the repo as a Lovable asset and the membership sentence is hardcoded in `NamaMembership.tsx`. This moves both into Contentful so the About page copy is editable there.

## What will change

1. **Logo in the Contentful media library** — upload the NAMA logo as a published asset named "NAMA Logo" with alt/description text ("NAMA — National Automatic Merchandising Association").
2. **Membership sentence in the About entry** — append a paragraph to the About page entry's rich text body containing the logo image plus the sentence "Applestone Solutions is a proud member of National Automatic Merchandising Association." After this, editing that text is done entirely in Contentful.
3. **About page rendering** — remove the hardcoded `<NamaMembership variant="page" />` block from `src/pages/About.tsx`, since the same content now comes from the CMS body. The rich text renderer already handles embedded assets and paragraphs.
4. **Footer stays as-is** — the global footer keeps the static component (footer content is not CMS-driven on this site).

## What I need from you

A Contentful Management API token (`cfpat-...`), Settings → API keys → Content management tokens. Existing scripts read `CONTENTFUL_MANAGEMENT_TOKEN`; without it neither the asset upload nor the entry update can run.

## Technical notes

- New `scripts/publish-nama-membership.mjs`, modeled on `scripts/publish-customer-metrics-section.mjs`: uploads `src/assets` NAMA image bytes via the CMA upload endpoint, creates + processes + publishes the asset, then patches the About entry.
- The About page reads content type `privacyPolicy` (limit 1) — the script will target that same entry, append an `embedded-asset-block` node and a `paragraph` node to its rich text field, and republish.
- The logo file currently exists only as a Lovable asset pointer (`src/assets/nama-logo.jpg.asset.json`); the script fetches the bytes from that asset URL before uploading.
- No changes to `NamaMembership.tsx` itself; it remains in use by the footer.
