
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Monitor, StopCircle, Trash2 } from 'lucide-react';

interface CaptureControlsProps {
  isCapturing: boolean;
  captureCount: number;
  sensitivity: number;
  onSensitivityChange: (value: number) => void;
  onStart: () => void;
  onStop: () => void;
  onClear: () => void;
}

export default function CaptureControls({
  isCapturing,
  captureCount,
  sensitivity,
  onSensitivityChange,
  onStart,
  onStop,
  onClear,
}: CaptureControlsProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-3 flex-wrap">
        {!isCapturing ? (
          <Button onClick={onStart} className="gap-2">
            <Monitor className="h-4 w-4" />
            Start Screen Capture
          </Button>
        ) : (
          <Button onClick={onStop} variant="destructive" className="gap-2">
            <StopCircle className="h-4 w-4" />
            Stop Capture
          </Button>
        )}

        {captureCount > 0 && !isCapturing && (
          <Button onClick={onClear} variant="outline" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        )}

        {isCapturing && (
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Capturing… {captureCount} screenshot{captureCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 max-w-sm">
        <label className="text-sm font-medium text-foreground whitespace-nowrap">
          Sensitivity
        </label>
        <Slider
          value={[sensitivity * 100]}
          onValueChange={([v]) => onSensitivityChange(v / 100)}
          min={5}
          max={40}
          step={1}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground w-8 text-right">
          {Math.round(sensitivity * 100)}%
        </span>
      </div>
    </div>
  );
}
