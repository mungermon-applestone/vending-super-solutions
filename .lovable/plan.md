

# Fix Video Import — File Upload and Google Drive URLs

## Problems Identified

1. **File upload not working**: The `crossOrigin="anonymous"` attribute on the `<video>` element can prevent blob URLs from loading in some browser/security contexts. Additionally, the nested `Button asChild > span > input` structure may not reliably propagate clicks to the hidden file input.

2. **Google Drive URLs don't play**: The `uc?export=download` transformation doesn't produce a streamable video URL — Google Drive redirects through an intermediate page and blocks CORS. This is a fundamental browser limitation.

## Fixes

**`src/components/doc-builder/VideoCapture.tsx`**:

- **Remove `crossOrigin="anonymous"`** from the video element — it's unnecessary for local blob URLs and actively blocks cross-origin URLs. For canvas frame capture, the hook already reads from the video without needing this attribute on local files.
- **Conditionally apply `crossOrigin`** only when the source is a remote URL (not a blob).
- **Simplify file input** — move the hidden input outside the Button to avoid click propagation issues with the `asChild` pattern.
- **Add `video.load()`** call after setting the source to ensure the browser re-initializes the media element.
- **Improve Google Drive messaging** — inform users that Google Drive URLs are blocked by browser CORS policies and recommend downloading the video first, then uploading it via file picker.

