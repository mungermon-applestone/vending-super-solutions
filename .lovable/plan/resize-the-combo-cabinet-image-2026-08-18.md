# Resize the combo cabinet image

Keep the current joined-unit rendering (two doors, shared body, single payment box, CHILLED/FROZEN + AMBIENT labels), but make each side match the proportions of the existing smart fridge / AI cooler product image.

## What changes

- Measure the door/cabinet aspect ratio in the existing smart fridge image (the tall, narrow single-door reference).
- Rebuild the combo so each half uses that same width-to-height ratio, i.e. each side becomes narrower/taller relative to today's version.
- Scale the whole joined unit down so it sits comfortably inside the 1600x1200 (4:3) white canvas with even margins, matching how other machine images are framed on the site.
- Re-apply the CHILLED / FROZEN and AMBIENT labels below the unit at proportional size.
- Produce a new PNG plus an updated full-page mockup of the draft machine page for review.

## Notes

- Nothing is published to Contentful in this step. The entry stays in draft so you can finish copy edits.
- Deliverables: `cold-ambient-combo-image-v2.png` and `cold-ambient-combo-page-preview-v2.png`.
- The page mockup again uses a temporary local preview route that is removed afterward, since the Delivery API cannot serve draft entries.
