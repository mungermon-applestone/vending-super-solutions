# Cold + Ambient Smart Cabinet Combo — Contentful machine page

A new published `machine` entry that markets a two-cabinet offering (one refrigerated/frozen smart cooler beside one ambient smart cabinet) as Applestone's answer to 365's Stockwell. It renders at `/machines/cold-ambient-smart-cabinet-combo` through the existing machine detail template — no layout code changes.

## Positioning

Stockwell sells "dual climate, secure grab-and-go" as a single cabinet. Our counter-position leans on what Applestone actually knows better than a kiosk vendor: perishable food. Two independent cabinets instead of one split box means real cold integrity on one side, full ambient capacity on the other, and either unit can be serviced or swapped without taking the whole market offline.

## Content to publish

**Title:** Cold + Ambient Smart Cabinet Combo
**Slug:** `cold-ambient-smart-cabinet-combo`
**Type:** vending · **Temperature:** multi · **Display order:** 10 · **Visible:** yes · **Show on homepage:** no

**Description (hero copy):**
Two AI-vision cabinets, side by side: one refrigerated or frozen for fresh meals, proteins, and dairy, one ambient for snacks and pantry staples. Customers tap once, open, take what they want, and walk — the cabinets settle the basket automatically. Where a single split-climate box forces you to trade cold capacity against dry capacity, the combo gives you both at full depth, backed by Applestone's perishable-food operating experience.

**Features:**
- Dedicated refrigerated or frozen cabinet — no shared-airflow compromise
- Full-depth ambient cabinet for snacks, pantry, and non-food
- AI computer-vision checkout: tap, open, grab, go
- Continuous temperature logging and out-of-range alerts
- Real-time inventory and planogram data per cabinet
- Built for perishables: date rotation, shrink tracking, HACCP-friendly records
- Independent service — one cabinet down never closes the market
- Scales from a single pair to a full unattended market footprint
- Cashless, contactless, and mobile-wallet payment
- Optional branded wrap and on-screen merchandising

**Specifications:** every field set to "Information Coming Soon" — dimensions, weight, capacity, power requirements, payment options, connectivity, manufacturer, warranty.

## Imagery

Reuse the existing `generic-smart-fridge.png` asset (already in the Contentful media library). Build one new composite from that same file: the cabinet rendered twice side by side on a clean background, the left one labeled Chilled / Frozen, the right one Ambient. Composition is done with PIL from the downloaded original — no AI-generated hardware. Uploaded as a new asset, `cold-ambient-cabinet-combo.png`, and attached as the entry's primary image. The original single-cabinet asset stays attached as a second gallery image.

## Technical notes

- New script `scripts/publish-cold-ambient-combo.mjs`, modeled on `scripts/publish-customer-metrics-section.mjs`: downloads the existing asset, composes the pair image, uploads and processes it via the Contentful Management API, creates the `machine` entry with the fields above, then publishes both asset and entry.
- Uses the existing `CONTENTFUL_MANAGEMENT_TOKEN` secret and space `al01e4yh2wq4`, environment `master`.
- No React components, routes, or Tailwind changes — `/machines/:machineId` already resolves any published machine slug.
- After publishing, verify the page renders on the dev server and that the hero image is not clipped.
