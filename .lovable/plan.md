# Publish Customer Metrics section to Contentful

Move the Customer Metrics section out of hardcoded React and into Contentful, so it renders through the same `technologySection` pipeline as the other sections on /technology — with the chart living in the Contentful media library as a real asset.

Contentful can only store the chart as a static image, so the interactive tooltip goes away. The section keeps the identical alternating layout because it will render through `TechnologySections`.

## Steps

1. **Capture the chart as an image.** Screenshot the rendered chart card from the running preview at high resolution (2x), cropped to the card, producing a clean PNG that matches the site styling exactly.
2. **Host it temporarily.** Upload the PNG to the existing public `doc-builder-screenshots` storage bucket to get a public URL that Contentful can fetch.
3. **Create the Contentful asset.** Using the Contentful Management API (existing `CONTENTFUL_MANAGEMENT_TOKEN`), create an asset titled "Customer Traffic by Hour", process the file, and publish it — it then appears in the Contentful media library.
4. **Create the `technologySection` entry.** Fields:
   - title: Customer Metrics
   - summary: the one-sentence anonymized-insights blurb
   - bulletPoints: a few supporting points (peak-hour staffing, demand-based restocking, privacy-safe aggregate counts)
   - sectionImage: link to the asset from step 3
   - displayOrder: next value after the existing sections
   Then publish the entry.
5. **Remove the hardcoded component.** Delete `CustomerMetricsSection.tsx` and its usage in `TechnologyPage.tsx` so the section renders only from Contentful and isn't duplicated.
6. **Verify** the /technology page shows the Customer Metrics section, sourced from Contentful, in the correct alternating position.

## Technical notes

- The publish is done with a one-off Node script (`scripts/publish-customer-metrics-section.mjs`) following the asset create → process → poll → publish flow already used by `supabase/functions/publish-doc-to-contentful/index.ts`. It reads space/environment from `.env` and takes the management token from the environment.
- No new edge function or runtime code is added; after the entry exists, the site fetches it via the existing `useContentfulTechnologySections` hook.
- Once published, all copy and the image are editable in Contentful without code changes.
