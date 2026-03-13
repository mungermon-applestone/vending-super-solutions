import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Upload, Link, Play, StopCircle, Camera, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { CaptureMode } from './CaptureControls';

function transformGoogleDriveUrl(url: string): string {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (match) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
}

function isGoogleDriveUrl(url: string): boolean {
  return /drive\.google\.com/i.test(url);
}

function getMediaErrorMessage(code: number | undefined): string {
  switch (code) {
    case 1: return 'Video loading was aborted.';
    case 2: return 'A network error prevented the video from loading.';
    case 3: return 'The video format is not supported by your browser. Try converting to MP4 (H.264).';
    case 4: return 'The video URL could not be loaded. It may be blocked by CORS or require authentication.';
    default: return 'An unknown error occurred while loading the video.';
  }
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
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sliderStep = Math.round(sensitivity * 200);
  const displaySlider = Math.max(1, Math.min(10, 11 - sliderStep));

  // Reset ready state when source changes
  useEffect(() => {
    setIsVideoReady(false);
    setVideoError(null);
    if (videoSrc && videoElRef.current) {
      videoElRef.current.load();
    }
  }, [videoSrc]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file.');
      return;
    }
    if (videoSrc && videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc);
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
  }, [videoSrc]);

  const handleUrlLoad = useCallback(() => {
    if (!urlInput.trim()) return;
    const raw = urlInput.trim();
    if (isGoogleDriveUrl(raw)) {
      toast.warning('Google Drive links are usually blocked by browser security (CORS). If the video doesn\'t load, download it and upload locally.', { duration: 6000 });
    }
    const transformed = transformGoogleDriveUrl(raw);
    setVideoSrc(transformed);
  }, [urlInput]);

  const handleStart = useCallback(() => {
    const video = videoElRef.current;
    if (!video || !isVideoReady) return;
    video.currentTime = 0;
    video.play();
    onStartVideoCapture(video);
  }, [onStartVideoCapture, isVideoReady]);

  const handleVideoError = useCallback(() => {
    const video = videoElRef.current;
    const code = video?.error?.code;
    const msg = getMediaErrorMessage(code);
    setVideoError(msg);
    toast.error(msg + ' Try downloading the video and uploading it directly.');
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileUpload}
        className="sr-only"
      />

      {/* Video source input */}
      {!videoSrc && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div
              className={`flex flex-col items-center justify-center gap-3 p-8 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file && file.type.startsWith('video/')) {
                  if (videoSrc && videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc);
                  setVideoSrc(URL.createObjectURL(file));
                } else {
                  toast.error('Please drop a video file.');
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className={`h-8 w-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {isDragging ? 'Drop video here' : 'Drag & drop a video file'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">Paste a direct video URL</p>
              <div className="flex items-start gap-2 p-2 rounded-md bg-muted/50 border border-border">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Google Drive and most cloud storage URLs are blocked by browser security (CORS).
                  For best results, <strong>download the video first</strong> and upload it using the file picker above.
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/video.mp4"
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
                src={videoSrc}
                controls
                muted
                playsInline
                preload="auto"
                className="w-full max-h-[400px] rounded-md bg-black"
                onLoadedMetadata={() => setIsVideoReady(true)}
                onCanPlay={() => setIsVideoReady(true)}
                onLoadedData={() => toast.success('Video loaded successfully.')}
                onError={handleVideoError}
              />
              {videoError && (
                <div className="flex items-start gap-2 mt-2 p-2 rounded-md bg-destructive/10 border border-destructive/30">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-xs text-destructive">{videoError} Download the video and upload it locally for best results.</p>
                </div>
              )}
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
                <Button onClick={handleStart} className="gap-2" disabled={!isVideoReady}>
                  <Play className="h-4 w-4" />
                  {isVideoReady ? 'Start Capture from Video' : 'Loading video…'}
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
                    setIsVideoReady(false);
                    setVideoError(null);
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
