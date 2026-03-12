
import { useState } from 'react';
import { useScreenCapture } from '@/hooks/useScreenCapture';
import CaptureControls from '@/components/doc-builder/CaptureControls';
import CapturePreview from '@/components/doc-builder/CapturePreview';
import ScreenshotTimeline from '@/components/doc-builder/ScreenshotTimeline';
import PublishForm from '@/components/doc-builder/PublishForm';
import { publishDocToContentful } from '@/services/cms/utils/docBuilderPublish';
import { toast } from 'sonner';

export default function DocBuilder() {
  const [sensitivity, setSensitivity] = useState(0.15);
  const [isPublishing, setIsPublishing] = useState(false);

  const {
    isCapturing,
    steps,
    captureCount,
    startCapture,
    stopCapture,
    removeStep,
    reorderSteps,
    clearSteps,
  } = useScreenCapture({ sensitivity });

  const handlePublish = async (data: {
    articleTitle: string;
    sectionCategory: string;
    headingCategory: string;
    publishImmediately: boolean;
  }) => {
    setIsPublishing(true);
    try {
      const result = await publishDocToContentful({
        ...data,
        steps,
      });

      if (result.success) {
        toast.success(`Article created! Entry ID: ${result.entryId}`, {
          duration: 8000,
        });
      } else {
        toast.error(`Publish failed: ${result.error}`);
      }
    } catch {
      toast.error('An unexpected error occurred while publishing.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Documentation Builder</h1>
        <p className="text-muted-foreground mt-1">
          Share your screen, navigate through the steps, and publish directly to Contentful as a Help Desk Article.
        </p>
      </div>

      <CaptureControls
        isCapturing={isCapturing}
        captureCount={captureCount}
        sensitivity={sensitivity}
        onSensitivityChange={setSensitivity}
        onStart={startCapture}
        onStop={stopCapture}
        onClear={clearSteps}
      />

      <CapturePreview isCapturing={isCapturing} />

      <ScreenshotTimeline
        steps={steps}
        onRemove={removeStep}
        onReorder={reorderSteps}
      />

      {steps.length > 0 && !isCapturing && (
        <PublishForm
          stepCount={steps.length}
          onPublish={handlePublish}
          isPublishing={isPublishing}
        />
      )}
    </div>
  );
}
