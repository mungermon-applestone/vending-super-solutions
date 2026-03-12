

# Documentation Builder — Screen Share + Auto-Capture → Contentful

## What We're Building

A `/doc-builder` route that lets you share a browser tab, automatically captures screenshots when the screen changes, sequences them vertically with placeholder text, and publishes the result directly as a Contentful `helpDeskArticle` with embedded asset blocks.

## How It Works

```text
┌─────────────────────────────────────────────┐
│  /doc-builder                               │
│                                             │
│  [Start Capture] ← getDisplayMedia()        │
│                                             │
│  ┌─ Live preview of shared tab ───────────┐ │
│  │  (hidden canvas for frame comparison)  │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  Auto-detected captures:                    │
│  ┌──────────┐  ┌──────────┐                 │
│  │ Step 1   │  │ Step 2   │  ...            │
│  │ [delete] │  │ [delete] │                 │
│  └──────────┘  └──────────┘                 │
│                                             │
│  Article Title: [________________]          │
│  Section Category: [____________]           │
│  Heading Category: [____________]           │
│                                             │
│  [Preview] [Publish to Contentful]          │
└─────────────────────────────────────────────┘
```

## Architecture

### 1. Screen Capture Engine
- Use `navigator.mediaDevices.getDisplayMedia({ video: true })` to capture a browser tab
- Draw frames to a hidden canvas at ~1fps interval
- Compare consecutive frames using pixel sampling (compute difference ratio)
- When difference exceeds threshold (~15%), save canvas as PNG blob — this is a new "step"
- Add debounce (~2 seconds) to avoid capturing mid-transition states

### 2. Screenshot Storage
- Create a **Supabase Storage bucket** (`doc-builder-screenshots`, public) for uploading captured PNGs
- Each capture session gets a UUID prefix for organization
- Images are uploaded as the user captures, giving us permanent URLs for Contentful

### 3. Contentful Publishing (via existing Management API)
- Upload each screenshot as a **Contentful Asset** using the Management API (already have `VITE_CONTENTFUL_MANAGEMENT_TOKEN`)
- Create a `helpDeskArticle` entry with Rich Text body containing:
  - For each step: an `embedded-asset-block` node pointing to the uploaded asset, followed by a paragraph with placeholder text ("Step N: Describe what the user should do here.")
- Publish the entry (or leave as draft — user's choice)

### 4. UI Components

| Component | Purpose |
|---|---|
| `DocBuilder` (page) | Main page at `/doc-builder` |
| `CaptureControls` | Start/stop screen share, sensitivity slider |
| `CapturePreview` | Live video feed + capture count |
| `ScreenshotTimeline` | Ordered list of captures with reorder/delete |
| `PublishForm` | Title, section category, heading category, publish button |
| `PublishPreview` | Modal showing the article as it will appear |

### 5. Database Migration
- Create `doc-builder-screenshots` storage bucket (public, for Contentful to reference)

## Key Technical Details

- **Frame comparison**: Sample ~1000 random pixels per frame, compute mean absolute difference. Threshold triggers capture. This avoids comparing every pixel while still detecting meaningful changes.
- **Contentful Rich Text structure**: The `articleContent` field expects a `Document` node with `embedded-asset-block` nodes for images — the content model already allows this node type.
- **Asset upload flow**: Upload image to Contentful via Management API → process → create asset → publish asset → reference in entry's rich text.
- **Reordering**: Users can drag-reorder or delete captures before publishing.
- **The Management API client** already exists in `src/services/cms/utils/contentfulManagement.ts` — we'll extend it with `createAsset` and `createEntry` methods.

## Files to Create/Modify

- `src/pages/DocBuilder.tsx` — main page
- `src/components/doc-builder/CaptureControls.tsx`
- `src/components/doc-builder/CapturePreview.tsx`
- `src/components/doc-builder/ScreenshotTimeline.tsx`
- `src/components/doc-builder/PublishForm.tsx`
- `src/components/doc-builder/PublishPreview.tsx`
- `src/hooks/useScreenCapture.ts` — screen share + change detection logic
- `src/services/cms/utils/contentfulManagement.ts` — add `createAsset`, `createEntry` methods
- `src/routes.tsx` — add `/doc-builder` route
- SQL migration — create storage bucket

