

# Show Manual Capture Button in All Modes

Simple one-line change in `src/components/doc-builder/CaptureControls.tsx`: remove the `captureMode === 'manual'` condition on line 62 so the "Capture Screenshot" button appears whenever capturing is active, regardless of mode.

