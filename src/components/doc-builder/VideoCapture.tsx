import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Upload, Link, Play, StopCircle, Camera, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { CaptureMode } from './CaptureControls';

function transformGoogleDriveUrl(url: string): string {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (match) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
}

interface VideoCaptureProps {
  isCapturing: boolean;
  captureCount: number;
  sensitivity: number;
  captureMode: CaptureMode;
  onCaptureModeChange: (mode: CaptureMode) => void;
  onSensitivityChange: (value: number) => void;
  onStartVideoCapture: (video: HTMLVideoElement) => void;
  onStop: () => void;
  onClear: () => void;
  onManualCapture: () => void;
}

export default function VideoCapture({
  isCapturing,
  captureCount,
  sensitivity,
  captureMode,
  onCaptureModeChange,
  onSensitivityChange,
  onStartVideoCapture,
  onStop,
  onClear,
  onManualCapture,
}: VideoCaptureProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const videoElRef = useRef<HTMLVideoElement>(null);

  const sliderStep = Math.round(sensitivity * 200);
  const displaySlider = Math.max(1, Math.min(10, 11 - sliderStep));

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file.');
      return;
    }
    if (videoSrc) URL.revokeObjectURL(videoSrc);
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
  }, [videoSrc]);

  const handleUrlLoad = useCallback(() => {
    if (!urlInput.trim()) return;
    const transformed = transformGoogleDriveUrl(urlInput.trim());
    setVideoSrc(transformed);
  }, [urlInput]);

  const handleStart = useCallback(() => {
    const video = videoElRef.current;
    if (!video) return;
    if (video.readyState < 2) {
      toast.error('Video is not ready yet. Wait for it to load.');
      return;
    }
    video.currentTime = 0;
    video.play();
    onStartVideoCapture(video);
  }, [onStartVideoCapture]);

  return (
    <div className="flex flex-col gap-4">
      {/* Video source input */}
      {!videoSrc && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">Upload a video file</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="sr-only"
              />
              <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4" />
                Choose Video
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">Paste a direct video URL</p>
              <p className="text-xs text-muted-foreground">
                Note: Google Drive and most cloud storage URLs are blocked by browser security (CORS).
                For best results, download the video first and upload it using the file picker above.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="https://drive.google.com/file/d/…/view"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlLoad()}
                />
                <Button onClick={handleUrlLoad} variant="outline" className="gap-2 shrink-0">
                  <Link className="h-4 w-4" />
                  Load
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video player & controls */}
      {videoSrc && (
        <>
          <Card>
            <CardContent className="p-4">
              <video
                ref={videoElRef}
                key={videoSrc}
                src={videoSrc}
                controls
                muted
                {...(!videoSrc.startsWith('blob:') ? { crossOrigin: 'anonymous' as const } : {})}
                className="w-full max-h-[400px] rounded-md bg-black"
                onLoadedData={() => toast.success('Video loaded successfully.')}
                onError={() => toast.error('Failed to load video. The URL may be blocked by CORS. Try downloading and uploading the file directly.')}
              />
            </CardContent>
          </Card>

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
                <Button onClick={handleStart} className="gap-2">
                  <Play className="h-4 w-4" />
                  Start Capture from Video
                </Button>
              ) : (
                <>
                  <Button onClick={onStop} variant="destructive" className="gap-2">
                    <StopCircle className="h-4 w-4" />
                    Stop Capture
                  </Button>
                  <Button onClick={onManualCapture} variant="secondary" className="gap-2">
                    <Camera className="h-4 w-4" />
                    Capture Screenshot
                  </Button>
                </>
              )}

              {captureCount > 0 && !isCapturing && (
                <Button onClick={onClear} variant="outline" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              )}

              {!isCapturing && videoSrc && (
                <Button
                  onClick={() => {
                    if (videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc);
                    setVideoSrc(null);
                    setUrlInput('');
                  }}
                  variant="ghost"
                  className="gap-2 text-muted-foreground"
                >
                  Change Video
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
        </>
      )}
    </div>
  );
}
