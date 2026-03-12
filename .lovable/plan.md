

# Fixing the Screen Capture Algorithm

## Root Cause Analysis

I identified **five problems** causing missed screenshots:

1. **Sensitivity slider is inverted**: Sliding right increases the threshold (requires MORE pixel change to trigger). "Max sensitivity" at 40% actually means "ignore everything under 40% different" — the opposite of what users expect. That's why you got fewer captures at "max sensitivity."

2. **Captures mid-transition**: The algorithm triggers on the first frame that differs, which catches loading spinners and partial renders instead of the final settled screen.

3. **1fps polling is too slow**: If a page transition completes in under 1 second, the algorithm might compare two near-identical settled frames and miss the change entirely.

4. **2-second debounce drops real changes**: Rapid navigation (clicking through menus) within 2 seconds causes steps to be silently discarded.

5. **Only 1000 pixel samples**: On a 1920×1080 display (~2M pixels), sampling 1000 is very sparse. Subtle but meaningful changes (like a sidebar item highlighting or a section expanding) can be missed.

## Solution: "Detect Change, Wait for Stability, Then Capture"

Instead of capturing the instant a difference is detected, use a two-phase approach:

```text
Phase 1: WATCHING — compare each frame to last captured frame
  → If diff > low threshold (3-5%) → enter SETTLING phase

Phase 2: SETTLING — compare consecutive frames to each other
  → If consecutive frames are nearly identical for ~800ms → screen is stable → CAPTURE
  → If change keeps happening (animation/spinner) → keep waiting
  → After 5s timeout → capture anyway (handles infinite animations)
```

This naturally filters out loading spinners — the algorithm waits for the spinner to finish before capturing.

## Specific Changes

### `useScreenCapture.ts` — rewrite capture algorithm
- **Increase poll rate** to 4fps (250ms interval) for better temporal resolution
- **Increase sample size** to 5000 pixels for better spatial coverage
- **Add state machine**: `watching` → `settling` → `capture`
  - `watching`: compare current frame to last *captured* frame; if diff > `changeThreshold` (3%), enter settling
  - `settling`: compare consecutive frames; if diff < `stableThreshold` (0.5%) for 3+ consecutive checks (~750ms), capture. Timeout at 5s forces capture.
- **Remove debounce** — the settling phase replaces it naturally
- **Fix sensitivity direction**: slider controls `changeThreshold`; sliding RIGHT = more sensitive (lower threshold)

### `CaptureControls.tsx` — fix slider UX
- Invert the slider so right = more sensitive
- Change label to show "Low / High" instead of raw percentage
- Adjust range: slider maps to changeThreshold of 1%–10% (right = 1% = very sensitive)

### `DocBuilder.tsx` — update default sensitivity
- Default to 0.05 (5% change threshold) which is a good middle ground

