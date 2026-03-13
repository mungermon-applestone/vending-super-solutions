
Root cause is likely not the uploader itself: your app-level Content Security Policy in `index.html` only allows `default-src 'self'` and does not define `media-src`, so browser video loads fall back to `default-src` and block both:
- local `blob:` video URLs (from file upload)
- remote Google Drive URLs

That exactly matches your symptom: a video control bar appears, but no playable media.

Implementation plan (targeted fix):

1) Update CSP to allow media playback sources
- File: `index.html`
- Add a dedicated `media-src` directive (instead of widening `default-src`), e.g. allow at least:
  - `'self'`
  - `blob:`
  - `data:`
  - `https:`
- Keep existing security posture for scripts/connect/etc unchanged.
- Also update report-only CSP in `src/components/seo/EnhancedSEO.tsx` so diagnostics match runtime behavior.

2) Harden `VideoCapture` loading lifecycle
- File: `src/components/doc-builder/VideoCapture.tsx`
- Track `isVideoReady` (`onLoadedMetadata` / `onCanPlay`) and disable “Start Capture from Video” until ready.
- When `videoSrc` changes, explicitly call `video.load()` via ref/effect to force media re-initialization.
- Keep `crossOrigin` off for `blob:` sources.
- Add `playsInline`, `preload="auto"`, and stronger error handling (`MediaError.code`) so users get clear reasons (unsupported codec vs blocked URL vs network/CORS).

3) Improve URL behavior and user feedback
- Keep Google Drive URL transform, but show explicit warning that many Drive links still won’t be directly streamable/capturable due Drive/CORS rules.
- If load fails, present actionable fallback: “Download video and upload locally.”

4) Verification checklist after implementation
- Upload local MP4 from file picker:
  - video duration should be non-zero
  - first frame or playback should appear
  - Start Capture should produce timeline screenshots
- Paste a known direct MP4 URL with CORS enabled:
  - should load and capture
- Paste typical Google Drive share link:
  - should show clear warning/error and fallback guidance (not silent failure)

Technical details (exact area to change):
- `index.html` CSP meta currently has `default-src`, `img-src`, `connect-src`, etc., but no `media-src`.
- Add `media-src` there; do not loosen `script-src` or other directives.
