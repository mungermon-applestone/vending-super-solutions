

Remove the "Step N" badge overlay from each screenshot card in `src/components/doc-builder/ScreenshotTimeline.tsx`. The step number is already implied by the card order and the description placeholder text.

## Change

**`src/components/doc-builder/ScreenshotTimeline.tsx`** — Delete the absolute-positioned step badge div (lines with `"Step {index + 1}"` in the `bg-primary` badge).

