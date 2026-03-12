

# Fixing Missed Screen Captures — Pixel Ratio Detection

## Problem

The current algorithm averages pixel differences across the entire screen. When navigating between pages in a sidebar-based app, ~70% of the screen (sidebar, header) stays identical while only ~30% (content area) changes. This dampens the average difference significantly — a major page navigation might only register as 4-6% average change, barely clearing the 5% threshold even at max sensitivity.

This explains why it missed 2 of 6 screens: pages that share the same layout but differ only in the content area produce a small average diff.

## Solution: Switch to Changed-Pixel Ratio

Instead of averaging RGB differences across all samples, **count what fraction of sampled pixels changed meaningfully**. A pixel counts as "changed" if its RGB difference exceeds a per-pixel threshold (e.g., 10% of max brightness).

This way, if 25% of the screen changes (content area swap), the score is 0.25 regardless of how static the sidebar is. Much more reliable for sidebar-based apps.

## Changes

### `src/hooks/useScreenCapture.ts`

**Replace `compareFrames`** with a changed-pixel-ratio approach:
- For each sampled pixel, compute its normalized RGB diff
- If that diff exceeds a per-pixel threshold (0.08), count it as "changed"
- Return the ratio of changed pixels to total sampled pixels
- This makes the score directly represent "what % of the screen changed"

**Lower default thresholds:**
- `changeThreshold` default: 0.05 → 0.02 (trigger on 2% of screen pixels changing)
- `STABLE_THRESHOLD`: 0.005 → 0.003 (tighter stability detection)
- Add a `PIXEL_CHANGE_THRESHOLD` constant of 0.08 (per-pixel sensitivity)

### `src/pages/DocBuilder.tsx`
- Update default sensitivity from 0.05 to 0.02

### `src/components/doc-builder/CaptureControls.tsx`  
- Adjust slider range to map 0.5%–5% (was 1%–10%) so the full range is useful for this new metric
- Keep the inverted UX (right = more sensitive = lower threshold)

## Why This Works

Current (average diff): sidebar nav produces ~5% avg → borderline detection
New (pixel ratio): sidebar nav changes ~25-35% of pixels → 0.25-0.35 score → easily detected at 2% threshold

The "standard details" inline expand was caught because it triggered enough pixel change even with averaging. The missed screens were likely pages with very similar layouts where only the data table content differed.

