
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Monitor, StopCircle, Trash2, Camera } from 'lucide-react';

export type CaptureMode = 'auto' | 'manual';

interface CaptureControlsProps {
  isCapturing: boolean;
  captureCount: number;
  sensitivity: number;
  captureMode: CaptureMode;
  onCaptureModeChange: (mode: CaptureMode) => void;
  onSensitivityChange: (value: number) => void;
  onStart: () => void;
  onStop: () => void;
  onClear: () => void;
  onManualCapture: () => void;
}

export default function CaptureControls({
  isCapturing,
  captureCount,
  sensitivity,
  captureMode,
  onCaptureModeChange,
  onSensitivityChange,
  onStart,
  onStop,
  onClear,
  onManualCapture,
}: CaptureControlsProps) {
  const sliderStep = Math.round(sensitivity * 200);
  const displaySlider = Math.max(1, Math.min(10, 11 - sliderStep));

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-3 flex-wrap">
        <ToggleGroup
          type="single"
          value={captureMode}
          onValueChange={(v) => { if (v) onCaptureModeChange(v as CaptureMode); }}
          disabled={isCapturing}
          className="border border-border rounded-md"
        >
          <ToggleGroupItem value="auto" className="text-xs px-3">Auto</ToggleGroupItem>
          <ToggleGroupItem value="manual" className="text-xs px-3">Manual</ToggleGroupItem>
        </ToggleGroup>

        {!isCapturing ? (
          <Button onClick={onStart} className="gap-2">
            <Monitor className="h-4 w-4" />
            Start Screen Capture
          </Button>
        ) : (
          <>
            <Button onClick={onStop} variant="destructive" className="gap-2">
              <StopCircle className="h-4 w-4" />
              Stop Capture
            </Button>
            {captureMode === 'manual' && (
              <Button onClick={onManualCapture} variant="secondary" className="gap-2">
                <Camera className="h-4 w-4" />
                Capture Screenshot
              </Button>
            )}
          </>
        )}

        {captureCount > 0 && !isCapturing && (
          <Button onClick={onClear} variant="outline" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        )}

        {isCapturing && (
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            Capturing… {captureCount} screenshot{captureCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {captureMode === 'auto' && (
        <div className="flex items-center gap-4 max-w-sm">
          <label className="text-sm font-medium text-foreground whitespace-nowrap">
            Sensitivity
          </label>
          <span className="text-xs text-muted-foreground">Low</span>
          <Slider
            value={[displaySlider]}
            onValueChange={([v]) => onSensitivityChange((11 - v) / 200)}
            min={1}
            max={10}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground">High</span>
        </div>
      )}
    </div>
  );
}
