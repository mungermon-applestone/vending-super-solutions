

# Video-Based Screenshot Capture

## Concept
Reuse the exact same change-detection algorithm from screen capture, but instead of `getDisplayMedia`, feed the engine a `<video>` element playing a user-provided video file or URL. The user loads a video (file upload or URL paste), plays it in-browser, and the same watching/settling/capture state machine extracts screenshots at each screen change — producing steps in the timeline just like screen capture does.

## Approach

The core `captureFrame`, `compareFrames`, and `saveCapture` functions in `useScreenCapture` already work against a generic `<video>` element. The only screen-capture-specific code is `startCapture` (which calls `getDisplayMedia`). We'll add a parallel `startVideoCapture` method that attaches a user-provided video element instead.

### New hook method: `startVideoCapture(videoElement: HTMLVideoElement)`

Added to `useScreenCapture.ts`:
- Accepts an existing `<video>` element (already loaded with a source)
- Sets up the same canvas + refs, resets state machine
- Starts the polling interval (auto mode) or waits for manual triggers
- Listens for the video's `ended`/`pause` events to auto-stop capture
- No `MediaStream` involved — just reads frames from the video element

### New component: `VideoCapture.tsx`

A panel in the DocBuilder page (sibling to `CaptureControls`) that lets the user:
1. **Provide a video** — either drag-and-drop / file picker for local files, or paste a URL (Google Drive direct link, etc.)
2. **Video player** — renders a `<video>` element with standard controls (play/pause/seek)
3. **"Start Capture from Video" button** — begins the frame analysis while the video plays
4. **Stop / status indicator** — same pattern as screen capture

The video player is visible so the user can watch playback and also manually capture at any point.

### DocBuilder page changes

- Add a source selector (toggle or tabs): **Screen Capture** | **Video Import**
- When "Video Import" is selected, show the `VideoCapture` component instead of `CaptureControls` + `CapturePreview`
- Both modes share the same `steps` array, `ScreenshotTimeline`, and `PublishForm`

### Files to create/modify

| File | Action |
|---|---|
| `src/hooks/useScreenCapture.ts` | Add `startVideoCapture(video: HTMLVideoElement)` method |
| `src/components/doc-builder/VideoCapture.tsx` | **New** — video input + player + capture controls |
| `src/pages/DocBuilder.tsx` | Add source tabs, integrate VideoCapture component |

### Key detail: Google Drive URLs

Google Drive share links need transformation to get a direct video URL:
`https://drive.google.com/file/d/{ID}/view` → `https://drive.google.com/uc?export=download&id={ID}`

We'll handle this automatically when a Google Drive URL is pasted. Note: CORS may block some URLs, so file upload is the primary path; URL paste is best-effort with a helpful error message if it fails.

