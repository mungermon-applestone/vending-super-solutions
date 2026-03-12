
interface CapturePreviewProps {
  isCapturing: boolean;
}

export default function CapturePreview({ isCapturing }: CapturePreviewProps) {
  if (!isCapturing) return null;

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
        Screen sharing active — navigate the shared tab to auto-capture screenshots
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Screenshots are captured automatically when the screen changes significantly.
      </p>
    </div>
  );
}
