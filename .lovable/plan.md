# Remove the "ID Verification" feature card

## What's happening now

A "ID Verification" card appears in the **Key Features** row on two product pages:

- Nicotine Pouches (`/products/nicotine-pouch-vending`)
- Nicotine Pouches and Vape (`/products/vape-vending`)

Both pages pull that card from a single shared item in Contentful (a `feature` entry titled "ID Verification"). No other page links to it.

The "ID Verification Demo" section on the nicotine pouch page stays exactly as it is.

## What will change

1. Unlink the "ID Verification" card from both product pages in Contentful and republish them, so the card disappears from the live site.
2. Delete the now-unused "ID Verification" feature item itself, so it can't be re-linked by accident.
3. Remove the matching placeholder "ID Verification" card from the site's built-in backup content, so it can't reappear if Contentful is briefly unreachable.

Everything else on those pages — benefits list, demo video section, recommended machines — is untouched.

## Technical details

- Entry: `feature` `36wqE5SLXLvMVeLClWxfU1` ("ID Verification").
- Referencing entries: `productType` `6Ee2GR0owduHh2L6mt150l` (nicotine-pouch-vending) and `productType` `558jTJSXkkSDMexavWCx2L` (vape-vending); remove the link from their `features` array, then publish each.
- Add `scripts/remove-id-verification-feature.mjs` following the existing script pattern (Contentful Management API, `CONTENTFUL_MANAGEMENT_TOKEN` from env), which unlinks, republishes, then unpublishes and deletes the feature entry.
- Frontend cleanup: drop the "ID Verification" feature object from `src/data/mockCmsData.ts` (line ~150). Leave `src/data/productFallbacks.tsx` "Age Verification System" alone unless you want that removed too.

## What I need from you

A Contentful **Content management token** (Settings → API keys → Content management tokens) to make the change. Without it I can only prepare the script for you to run.
