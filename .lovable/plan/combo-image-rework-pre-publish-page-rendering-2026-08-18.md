# Combo image rework + pre-publish page rendering

Two deliverables: a new hero image where the two cabinets read as one attached unit, and a PNG mockup of the machine page for review — with nothing published in Contentful until you say so.

## 1. New composite image

Current asset shows two separate cabinets with a visible gap, each with its own side payment box — it reads as two machines parked next to each other.

New version:
- The two cabinets touch flush side-by-side, no gap, aligned tops and bases so they read as a single joined unit.
- One shared payment/card-reader box only, mounted on the outer side of the pair (the other cabinet's reader removed).
- Same clean white background, same 4:3 framing used elsewhere so nothing gets clipped.
- Keep the CHILLED / FROZEN and AMBIENT labels.

Approach: AI image edit starting from the existing `generic-smart-fridge.png` / current composite so the hardware still matches real Applestone equipment, rather than generating a machine from scratch. If the edit drifts from the actual cabinet design, fall back to a PIL composite (crop out the second unit's reader, butt the two panels together) and re-run the edit only for the seam.

## 2. Rendering the draft page as a PNG

The page is now draft in Contentful, so the live Delivery API won't return it. To show you what it will look like:
- Fetch the draft entry through the Contentful Preview API (or read the field values directly via the management API).
- Render the existing machine detail template locally against those draft values on a temporary local-only route.
- Screenshot the full page at desktop width and save it as a PNG for you to review.
- Remove the temporary route afterwards — no permanent code change ships from this step.

## 3. Publishing

Nothing gets published or unpublished in Contentful in this pass. The new image is prepared and the mockup delivered; once you've done your copy editing you tell me when to upload the image to the media library, attach it to the entry, and publish.

## Technical notes

- Image work happens in `/tmp`, final PNG delivered as a file you can open.
- Contentful writes use `CONTENTFUL_MANAGEMENT_TOKEN` (already set) but are deferred to your go-ahead.
- No changes to `MachineDetailHero`, `MachinePageTemplate`, or routing beyond the temporary preview route.
