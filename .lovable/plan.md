# Unpublish age-restricted / regulated product pages

Take the pages about OTC-pharma, cannabis, nicotine, vape, and ID verification offline without deleting anything. Every item stays in Contentful as a draft and can be republished later with one click.

## Pages to unpublish

Product pages:
- OTC / Pharma Vending (`otc-pharma-vending`)
- Cannabis Vending (`cannabis-vending`)
- Nicotine Pouches (`nicotine-pouch-vending`)
- Nicotine Pouches and Vape (`vape-vending`)

Blog posts about nicotine vending:
- "Shenzhen Zhilai Sci and Tech Co. Collaborates with Applestone on Nicotine Vending"
- "Shenzhen Zhilai Sci and Tech Co. Announces Partnership with Applestone Solutions"

## Not touched

- "New Software for OEMs" and "Note to Vending OEMs" blog posts — the OEM post only names cannabis in one passing sentence; the other doesn't mention these topics at all.
- Home page, products page, technology section, machine pages, FAQ — these only mention "age/ID verification" inside feature lists and stay live and unedited, as you asked.
- The "New: Nicotine Pouch Solution" homepage hero item: this one does need attention since it links to a page that will be offline. Recommendation is to unpublish that hero slide too so the home page doesn't advertise a dead link.

## After unpublishing

Once the four product pages are offline, any place that links to them (products listing, navigation, related-product links) will simply stop showing them, because those lists are built from published content. I'll load the site afterwards and confirm no broken links remain.

## Technical details

- New script `scripts/unpublish-regulated-pages.mjs`, same pattern as `scripts/remove-id-verification-feature.mjs`: Contentful Management API, reads `VITE_CONTENTFUL_SPACE_ID` / `VITE_CONTENTFUL_ENVIRONMENT_ID` / management token from `.env`.
- For each target entry ID it calls `DELETE /entries/{id}/published` (unpublish only — no archive, no delete):
  - productType: `6yAnjbhnS6GURjdMYxmLOd`, `7GzLx6QF465sZFW1KlaHb8`, `6Ee2GR0owduHh2L6mt150l`, `558jTJSXkkSDMexavWCx2L`
  - blogPost: `5w3Q1F59agbT2qiqAs3rXS`, `7yQwCmUgSM7i0fWlPwJbQV`
  - heroContent: `4oi4Aw6C8M8JO8X4ijlrvp` (pending your OK)
- Script is idempotent and logs each entry's before/after publish state.
- Verify with the Delivery API that the entries and their slugs no longer resolve, then check `/products` and the blog index in the preview.
- The management token from the last session may be expired; if the calls return 401 I'll ask you for a fresh one.
