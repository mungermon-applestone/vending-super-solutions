

# Add Screenshot Cropping to Doc Builder

## Approach
Add a "Crop" button to each screenshot card in the timeline. Clicking it opens a dialog/modal with a canvas-based crop tool where the user drags a rectangle selection, previews the result, and confirms. The cropped image replaces the original step's blob and thumbnail.

No external libraries needed -- we'll build a lightweight crop component using a canvas overlay with mouse/touch drag to define the crop rectangle.

## Components to create/modify

### 1. New: `src/components/doc-builder/ImageCropper.tsx`
A modal (using existing Dialog component) containing:
- The full screenshot rendered in an `<img>` tag
- A draggable selection overlay (div with border) positioned via mouse events
- Preview of the cropped area
- "Apply Crop" and "Cancel" buttons
- Uses canvas to extract the cropped region, produces a new Blob + object URL

### 2. Modify: `src/hooks/useScreenCapture.ts`
- Add an `updateStepImage` callback that replaces a step's `blob` and `thumbnailUrl` (revoking the old URL)

### 3. Modify: `src/components/doc-builder/ScreenshotTimeline.tsx`
- Add a `Crop` icon button alongside the existing move/delete buttons
- Track which step is being cropped (`croppingStepId` state)
- Render `ImageCropper` dialog when a step is selected for cropping
- On crop confirm, call `onUpdateImage(id, newBlob)` to replace the screenshot

### 4. Modify: `src/pages/DocBuilder.tsx`
- Pass the new `updateStepImage` function down to `ScreenshotTimeline`

## UX flow
1. User hovers over a screenshot card, sees a crop (scissors) icon alongside the existing reorder/delete buttons
2. Clicks crop -- a dialog opens showing the full image
3. User clicks and drags to define a crop rectangle on the image
4. Crop rectangle is resizable/movable with visual feedback
5. User clicks "Apply" -- the image is cropped client-side via canvas, original blob is replaced
6. Dialog closes, timeline shows the cropped version

