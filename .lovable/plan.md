

# Add Manual Capture Mode

## Approach
Add a toggle between "Auto" and "Manual" capture modes. In manual mode, the auto-detection polling is disabled — the user clicks a "Capture" button (or presses a hotkey) to snapshot the current screen share frame on demand.

## Changes

### 1. `src/hooks/useScreenCapture.ts`
- Add a `mode` option: `'auto' | 'manual'` (default `'auto'`)
- Store mode in a ref so `startCapture` can decide whether to start the polling interval
- In manual mode: skip `setInterval` — just keep the stream and video alive
- Add a new `manualCapture()` function that grabs the current video frame onto the canvas and calls `saveCapture()`
- Expose `manualCapture` in the return value

### 2. `src/components/doc-builder/CaptureControls.tsx`
- Add a mode toggle (two-segment button group or radio tabs: "Auto" / "Manual") above the start button
- In manual mode: hide the sensitivity slider, show a "📸 Capture Screenshot" button (visible only while capturing)
- The capture button calls `onManualCapture()`

### 3. `src/pages/DocBuilder.tsx`
- Add `captureMode` state (`'auto' | 'manual'`)
- Pass mode to `useScreenCapture` and to `CaptureControls`
- Wire up `manualCapture` to the controls

## UX
- Default mode is Auto (current behavior unchanged)
- User can switch to Manual before starting capture
- In Manual mode while capturing: a prominent "Capture Screenshot" button appears; no auto-detection runs
- Mode toggle is disabled while actively capturing (must stop first to switch)

