
import { useState } from 'react';
import { CapturedStep } from '@/hooks/useScreenCapture';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, ArrowUp, ArrowDown, Crop } from 'lucide-react';
import ImageCropper from './ImageCropper';

interface ScreenshotTimelineProps {
  steps: CapturedStep[];
  onRemove: (id: string) => void;
  onReorder: (steps: CapturedStep[]) => void;
  onUpdateDescription: (id: string, description: string) => void;
  onUpdateImage: (id: string, blob: Blob) => void;
}

export default function ScreenshotTimeline({
  steps,
  onRemove,
  onReorder,
  onUpdateDescription,
  onUpdateImage,
}: ScreenshotTimelineProps) {
  const [croppingStepId, setCroppingStepId] = useState<string | null>(null);
  const croppingStep = steps.find((s) => s.id === croppingStepId);
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
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="relative group rounded-lg border border-border bg-card overflow-hidden"
          >
            <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
              Step {index + 1}
            </div>
            <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                variant="secondary"
                className="h-6 w-6"
                onClick={() => setCroppingStepId(step.id)}
              >
                <Crop className="h-3 w-3" />
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
              className="w-full object-contain"
            />
            <div className="p-3 border-t border-border">
              <Textarea
                placeholder={`Step ${index + 1}: Describe what the user should do here…`}
                value={step.description}
                onChange={(e) => onUpdateDescription(step.id, e.target.value)}
                className="min-h-[60px] resize-y text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
