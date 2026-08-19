import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScreenCapture } from '@/hooks/useScreenCapture';
import CaptureControls, { type CaptureMode } from '@/components/doc-builder/CaptureControls';
import CapturePreview from '@/components/doc-builder/CapturePreview';
import VideoCapture from '@/components/doc-builder/VideoCapture';
import ScreenshotTimeline from '@/components/doc-builder/ScreenshotTimeline';
import PublishForm from '@/components/doc-builder/PublishForm';
import { publishArticle } from '@/lib/publishArticle';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

/**
 * Standalone Doc Builder. Auth is handled by the app's route guard —
 * this page assumes a signed-in user (self-serve account, no admin allowlist).
 */
export default function DocBuilder() {
  const [sensitivity, setSensitivity] = useState(0.02);
  const [captureMode, setCaptureMode] = useState<CaptureMode>('auto');
  const [isPublishing, setIsPublishing] = useState(false);

  const {
    isCapturing,
    steps,
    captureCount,
    startCapture,
    startVideoCapture,
    stopCapture,
    removeStep,
    reorderSteps,
    updateStepDescription,
    updateStepImage,
    clearSteps,
    manualCapture,
  } = useScreenCapture({ changeThreshold: sensitivity, mode: captureMode });

  const handlePublish = async (data: {
    connectionId: string;
    articleTitle: string;
    section: string;
    heading: string;
    publishImmediately: boolean;
  }) => {
    setIsPublishing(true);
    try {
      const result = await publishArticle({ ...data, steps });
      if (result.success) {
        toast.success(`Article created! Entry ID: ${result.entryId}`, { duration: 8000 });
      } else {
        toast.error(`Publish failed: ${result.error}`);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documentation Builder</h1>
          <p className="mt-1 text-muted-foreground">
            Capture screenshots from a live screen share or a video recording, caption them, and publish to your CMS.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/settings/cms">CMS settings</Link>
        </Button>
      </div>

      <Tabs defaultValue="screen" className="w-full">
        <TabsList>
          <TabsTrigger value="screen" disabled={isCapturing}>Screen Capture</TabsTrigger>
          <TabsTrigger value="video" disabled={isCapturing}>Video Import</TabsTrigger>
        </TabsList>

        <TabsContent value="screen" className="mt-4 space-y-4">
          <CaptureControls
            isCapturing={isCapturing}
            captureCount={captureCount}
            sensitivity={sensitivity}
            captureMode={captureMode}
            onCaptureModeChange={setCaptureMode}
            onSensitivityChange={setSensitivity}
            onStart={startCapture}
            onStop={stopCapture}
            onClear={clearSteps}
            onManualCapture={manualCapture}
          />
          <CapturePreview isCapturing={isCapturing} />
        </TabsContent>

        <TabsContent value="video" className="mt-4">
          <VideoCapture
            isCapturing={isCapturing}
            captureCount={captureCount}
            sensitivity={sensitivity}
            captureMode={captureMode}
            onCaptureModeChange={setCaptureMode}
            onSensitivityChange={setSensitivity}
            onStartVideoCapture={startVideoCapture}
            onStop={stopCapture}
            onClear={clearSteps}
            onManualCapture={manualCapture}
          />
        </TabsContent>
      </Tabs>

      <ScreenshotTimeline
        steps={steps}
        onRemove={removeStep}
        onReorder={reorderSteps}
        onUpdateDescription={updateStepDescription}
        onUpdateImage={updateStepImage}
      />

      {steps.length > 0 && !isCapturing && (
        <PublishForm stepCount={steps.length} onPublish={handlePublish} isPublishing={isPublishing} />
      )}
    </div>
  );
}
