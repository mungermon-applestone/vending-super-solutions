# Add "Touchscreen Wall-Mounted XL - 20 Coils" as a draft machine in Contentful

Create one new **machine** entry, saved as a draft only (not published, so it won't show on the site).

## Content
- Title: Touchscreen Wall-Mounted XL - 20 Coils
- Slug: touchscreen-wall-mounted-xl-20-coils
- Type: vending; Temperature: ambient
- Description: "A wall-mounted smart vending machine with a large digital touchscreen display, card and NFC payments, and cash and coin payments, in a compact footprint with custom branding and finishes."
- Features: Large digital display; Touchscreen interface; Card and NFC payments; Cash and coin payments; Compact footprint; Custom branding and finishes
- Dimensions: H 1,150 x W 650 x D 305 mm
- Payment options: Card, NFC, cash and coin
- Model note: Option 2 XL / 20 coils (in capacity: "20 coils")
- Weight, power, connectivity, manufacturer, warranty: "Information coming soon"
- Visible: true, not on homepage

## Left out on purpose
- The $7,245 price and the DMVI brochure source — machine pages have no price field, and the supplier name shouldn't appear publicly. Tell me if you want either included.

## Image
- Crop the machine photo from your screenshot, upload it to the Contentful media library as a draft asset, and attach it. You can swap in a better photo later.

## Technical
- New script `scripts/draft-wall-mounted-xl.mjs` using the Management API (token via env var), POST entry with `X-Contentful-Content-Type: machine`, no publish calls. Verify the draft exists by reading it back.
