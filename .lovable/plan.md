# Fix the cropped Customer Metrics chart image

## What's happening

Every technology section image is rendered inside a fixed 4:3 frame that crops the image to fill it (`src/components/technology/TechnologySection.tsx:100-110` uses `aspect-[4/3]` with `object-cover`). The other section images are photos, so trimming the edges is invisible. The chart is a wide 1200x732 graphic (about 1.6:1), so filling a 4:3 frame slices off the left and right — which is why the y-axis labels and the last hour are cut.

## Fix

Republish the chart asset at a 4:3 ratio so nothing gets cropped, leaving all rendering code untouched.

1. Re-capture the chart from the preview at high resolution.
2. Pad the capture onto a 1600x1200 white canvas (matching the card background) so the artwork is centered with breathing room and the image is exactly 4:3.
3. Upload the padded PNG to Contentful as a new asset and point the existing "Customer Metrics" `technologySection` entry at it, then publish both.
4. Verify on /technology that the full chart, y-axis, and the 6a-10p labels are all visible.

No component or layout changes, so other technology sections are unaffected.

## Alternative considered

Switching the image container to `object-contain` would also fix it, but it changes how every technology section image renders and would letterbox the existing photos. Not recommended.
