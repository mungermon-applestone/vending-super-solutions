
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useScreenCapture } from '@/hooks/useScreenCapture';
import CaptureControls, { type CaptureMode } from '@/components/doc-builder/CaptureControls';
import CapturePreview from '@/components/doc-builder/CapturePreview';
import ScreenshotTimeline from '@/components/doc-builder/ScreenshotTimeline';
import PublishForm from '@/components/doc-builder/PublishForm';
import { publishDocToContentful } from '@/services/cms/utils/docBuilderPublish';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function LoginGate({ onAuthenticated }: { onAuthenticated: () => void }) {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      onAuthenticated();
    } catch {
      // error toast handled by AuthContext
    }
  };

  return (
    <div className="container mx-auto py-16 px-4 max-w-md">
      <h1 className="text-2xl font-bold text-foreground mb-2">Documentation Builder</h1>
      <p className="text-muted-foreground mb-6">Sign in with your admin account to continue.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}

export default function DocBuilder() {
  const { session } = useAuth();
  const [sensitivity, setSensitivity] = useState(0.02);
  const [captureMode, setCaptureMode] = useState<CaptureMode>('auto');
  const [isPublishing, setIsPublishing] = useState(false);
  const [, forceUpdate] = useState(0);

  const {
    isCapturing,
    steps,
    captureCount,
    startCapture,
    stopCapture,
    removeStep,
    reorderSteps,
    updateStepDescription,
    updateStepImage,
    clearSteps,
  } = useScreenCapture({ changeThreshold: sensitivity });

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

  if (!session) {
    return <LoginGate onAuthenticated={() => forceUpdate(n => n + 1)} />;
  }

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
        onUpdateDescription={updateStepDescription}
        onUpdateImage={updateStepImage}
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
