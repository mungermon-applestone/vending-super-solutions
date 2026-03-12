
import { CapturedStep } from '@/hooks/useScreenCapture';
import { Button } from '@/components/ui/button';
import { X, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

interface ScreenshotTimelineProps {
  steps: CapturedStep[];
  onRemove: (id: string) => void;
  onReorder: (steps: CapturedStep[]) => void;
}

export default function ScreenshotTimeline({
  steps,
  onRemove,
  onReorder,
}: ScreenshotTimelineProps) {
  if (steps.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
        No screenshots captured yet. Start screen sharing and navigate through the steps you want to document.
      </div>
    );
  }

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    onReorder(newSteps);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">
        Captured Steps ({steps.length})
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="relative group rounded-lg border border-border bg-card overflow-hidden"
          >
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
              Step {index + 1}
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="secondary"
                className="h-6 w-6"
                onClick={() => moveStep(index, 'up')}
                disabled={index === 0}
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-6 w-6"
                onClick={() => moveStep(index, 'down')}
                disabled={index === steps.length - 1}
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="h-6 w-6"
                onClick={() => onRemove(step.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <img
              src={step.thumbnailUrl}
              alt={`Step ${index + 1}`}
              className="w-full aspect-video object-cover object-top"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
