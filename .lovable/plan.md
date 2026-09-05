# Remaining vape / OTC / nicotine / cannabis mentions

Six published items still mention these categories in passing. Below is each sentence exactly as it appears today, with a suggested replacement. Approve or strike any of them and I'll apply the approved ones in Contentful and republish.

## 1. Home page — first feature card

Current:
> From grocery and fresh food to vape products and collectibles, you can sell a diverse array of products.

Suggested:
> From grocery and fresh food to cosmetics and collectibles, you can sell a diverse array of products.

## 2. Products page — hero

Current:
> Our current clients are selling everyting from fresh meat to vape products to recycled golf balls.

Suggested:
> Our current clients are selling everything from fresh meat to cosmetics to recycled golf balls.

(Also fixes the "everyting" typo.)

## 3. Products page — purpose statement

Current:
> Sell virtually any product: perishable foods, cosmetics, toys, even items that require ID verification like OTC medicines and CBD.

Suggested:
> Sell virtually any product: perishable foods, cosmetics, toys, and high-value items that need secure, tracked dispensing.

## 4. Technology page — "Hardware Agnostic" bullet list

Current bullets include:
> Vape Machines
> OTC Machines

Suggested: remove both bullets, or replace with:
> Refrigerated Machines
> Locker Systems

(I'll confirm what the other bullets in that list already say before choosing, so we don't duplicate.)

## 5. Machine page — Applestone High-Capacity Slim Machine

Current:
> Designed to dispense pocket-sized packages like nicotine pouches or decks of collectible cards, it has a total capacity of 448 items.

Suggested:
> Designed to dispense pocket-sized packages like small-format retail goods or decks of collectible cards, it has a total capacity of 448 items.

## 6. Blog — "Note to Vending OEMs"

Current:
> When a prospect needs age verification for cannabis vending, temperature monitoring for fresh food, or RFID integration for tool cribs, you face two options: spend months on custom development or walk away from the deal.

Suggested (phrase removed entirely):
> When a prospect needs temperature monitoring for fresh food or RFID integration for tool cribs, you face two options: spend months on custom development or walk away from the deal.


## Not proposed for change

- Blog "New Software for OEMs" mentions "pharmaceuticals" in a generic list of inventory categories — no product-line claim, recommend leaving as is.

## Also included

Website backup copy stored in the code (used only if Contentful is unreachable) still has "Vape & Cannabis" and "OTC Products" placeholders. These get scrubbed in the same pass so a Contentful outage can't surface them.


## Technical details

- Contentful entries affected: `homePageContent 6LtA5vr8JVX8yo8uCmqLZ0` (feature1Description), `productsPageContent 5YfQbcsaDZ1NUPbujXXOdn` (heroDescription, purposeStatementDescription), `technologySection 751TUGlWyMDSjpJ26gJLry` (bulletPoints), `machine 3tQIRzIcysQGBXnDXGoFYn` (description), `blogPost 2fNFJGgDstz7I86PZ3X6lu` (rich-text content node).
- Applied with a new `scripts/update-regulated-copy.mjs` using the Management API, same pattern as `scripts/unpublish-regulated-pages.mjs`; each entry is updated then republished, and the script logs before/after values.
- Optional code cleanup: `src/data/productFallbacks.tsx` (`vape`, `otc` entries), `src/data/mockCmsData.ts`, `src/components/home/ProductTypesSection.tsx` and `MachineTypesSection.tsx` ("Vape & Cannabis" card, `/products/vape` link).
