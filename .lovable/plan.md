

# Vertical Layout with Editable Placeholder Text

## What needs to change

Looking at the reference screenshot, the final article displays screenshots stacked vertically at full width with descriptive text paragraphs between them. Two things need updating:

### 1. ScreenshotTimeline — switch from grid to vertical stack
Currently uses `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`. Needs to be a single-column vertical list with full-width screenshots, matching how the article will actually render in Contentful.

### 2. Add editable step descriptions between screenshots
Each step should have a text area below the screenshot where the user can type the instruction text for that step. These descriptions get pushed into the Rich Text document as paragraphs between the `embedded-asset-block` nodes — so what you see in the builder is what lands in Contentful.

### 3. Wire descriptions through to the publish function
- `CapturedStep` type gains an optional `description` string
- `ScreenshotTimeline` renders a textarea per step and calls a new `onUpdateDescription(stepId, text)` callback
- `DocBuilder` page manages descriptions and passes them to `publishDocToContentful`
- `buildRichTextDocument` uses the user-written description instead of the generic "Step N: Describe what the user should do here" placeholder (falls back to placeholder if left empty)

## Files to modify

| File | Change |
|---|---|
| `src/hooks/useScreenCapture.ts` | Add `description` field to `CapturedStep`, add `updateStepDescription` method |
| `src/components/doc-builder/ScreenshotTimeline.tsx` | Vertical stack layout, textarea per step, `onUpdateDescription` prop |
| `src/pages/DocBuilder.tsx` | Wire `updateStepDescription` through |
| `src/services/cms/utils/docBuilderPublish.ts` | `buildRichTextDocument` accepts step descriptions, uses them in paragraphs |

