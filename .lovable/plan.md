

# Make Auto-Capture More Aggressive

## Problem
The current algorithm is too conservative — it misses screenshots during navigation sequences. Since users can easily delete unwanted captures, over-capturing is preferable to under-capturing.

## Changes — `src/hooks/useScreenCapture.ts` only

Tune the detection constants to be significantly more sensitive:

| Constant | Current | New | Effect |
|---|---|---|---|
| `POLL_INTERVAL_MS` | 250 (4fps) | 150 (~7fps) | Check for changes more frequently |
| `PIXEL_CHANGE_THRESHOLD` | 0.08 | 0.04 | Smaller per-pixel RGB differences count as "changed" |
| `STABLE_THRESHOLD` | 0.003 | 0.002 | Less motion needed to consider frame "stable" |
| `STABLE_COUNT_NEEDED` | 3 (~750ms) | 2 (~300ms) | Capture sooner once motion stops |
| `SETTLE_TIMEOUT_MS` | 5000 | 3000 | Force-capture sooner during long animations |
| Default `changeThreshold` | 0.05 | 0.02 | Lower default trigger threshold |

Additionally, add a **minimum cooldown** (~1.5s) between captures to avoid rapid-fire duplicates of essentially the same frame, while still being aggressive enough to catch each distinct screen state.

No UI changes needed — the sensitivity slider already controls `changeThreshold`, and the new defaults simply shift the baseline toward "capture more."

