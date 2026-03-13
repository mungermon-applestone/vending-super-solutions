import { useState, useRef, useCallback, useEffect } from 'react';

export interface CapturedStep {
  id: string;
  blob: Blob;
  thumbnailUrl: string;
  timestamp: number;
  order: number;
  description: string;
}

type CapturePhase = 'watching' | 'settling';

interface UseScreenCaptureOptions {
  /** Change threshold (0-1). Lower = more sensitive. Default 0.05 */
  changeThreshold?: number;
  /** Capture mode. 'auto' polls for changes, 'manual' waits for user trigger. Default 'auto' */
  mode?: 'auto' | 'manual';
}

const POLL_INTERVAL_MS = 150;       // ~7fps
const SAMPLE_SIZE = 5000;
const PIXEL_CHANGE_THRESHOLD = 0.04; // per-pixel: 4% RGB diff = "changed"
const STABLE_THRESHOLD = 0.002;      // 0.2% changed-pixel ratio = "same"
const STABLE_COUNT_NEEDED = 2;       // ~300ms of stability
const SETTLE_TIMEOUT_MS = 3000;      // force capture after 3s of settling
const MIN_CAPTURE_COOLDOWN_MS = 1500; // minimum 1.5s between captures

export function useScreenCapture(options: UseScreenCaptureOptions = {}) {
  const { changeThreshold = 0.02, mode = 'auto' } = options;
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const [isCapturing, setIsCapturing] = useState(false);
  const [steps, setSteps] = useState<CapturedStep[]>([]);
  const [captureCount, setCaptureCount] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const orderCounterRef = useRef(0);

  // State machine refs
  const phaseRef = useRef<CapturePhase>('watching');
  const lastCapturedFrameRef = useRef<ImageData | null>(null);
  const prevFrameRef = useRef<ImageData | null>(null);
  const stableCountRef = useRef(0);
  const settleStartRef = useRef(0);
  const changeThresholdRef = useRef(changeThreshold);
  const lastCaptureTimeRef = useRef(0);

  useEffect(() => {
    changeThresholdRef.current = changeThreshold;
  }, [changeThreshold]);

  const compareFrames = useCallback((current: ImageData, previous: ImageData): number => {
    const { data: curr } = current;
    const { data: prev } = previous;
    const totalPixels = current.width * current.height;
    const step = Math.max(1, Math.floor(totalPixels / SAMPLE_SIZE));

    let changedPixels = 0;
    let samplesChecked = 0;

    for (let i = 0; i < totalPixels; i += step) {
      const idx = i * 4;
      const rDiff = Math.abs(curr[idx] - prev[idx]);
      const gDiff = Math.abs(curr[idx + 1] - prev[idx + 1]);
      const bDiff = Math.abs(curr[idx + 2] - prev[idx + 2]);
      const pixelDiff = (rDiff + gDiff + bDiff) / (3 * 255);
      if (pixelDiff > PIXEL_CHANGE_THRESHOLD) {
        changedPixels++;
      }
      samplesChecked++;
    }

    return samplesChecked > 0 ? changedPixels / samplesChecked : 0;
  }, []);

  const saveCapture = useCallback((canvas: HTMLCanvasElement) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const order = orderCounterRef.current++;
      const newStep: CapturedStep = {
        id: `step-${Date.now()}-${order}`,
        blob,
        thumbnailUrl: url,
        timestamp: Date.now(),
        order,
        description: '',
      };
      setSteps((prev) => [...prev, newStep]);
      setCaptureCount((c) => c + 1);
    }, 'image/png');
  }, []);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // First frame — always capture
    if (!lastCapturedFrameRef.current) {
      lastCapturedFrameRef.current = currentFrame;
      prevFrameRef.current = currentFrame;
      saveCapture(canvas);
      return;
    }

    const now = Date.now();

    if (phaseRef.current === 'watching') {
      // Compare to last CAPTURED frame
      const diff = compareFrames(currentFrame, lastCapturedFrameRef.current);
      if (diff > changeThresholdRef.current) {
        // Significant change detected — start settling
        phaseRef.current = 'settling';
        stableCountRef.current = 0;
        settleStartRef.current = now;
        prevFrameRef.current = currentFrame;
      }
    } else if (phaseRef.current === 'settling') {
      // Compare consecutive frames to detect stability
      const consecutiveDiff = compareFrames(currentFrame, prevFrameRef.current!);
      prevFrameRef.current = currentFrame;

      if (consecutiveDiff < STABLE_THRESHOLD) {
        stableCountRef.current++;
      } else {
        stableCountRef.current = 0;
      }

      const timedOut = (now - settleStartRef.current) > SETTLE_TIMEOUT_MS;

      if (stableCountRef.current >= STABLE_COUNT_NEEDED || timedOut) {
        const timeSinceLastCapture = now - lastCaptureTimeRef.current;
        if (timeSinceLastCapture >= MIN_CAPTURE_COOLDOWN_MS) {
          // Screen is stable (or timed out) — capture
          lastCapturedFrameRef.current = currentFrame;
          phaseRef.current = 'watching';
          stableCountRef.current = 0;
          lastCaptureTimeRef.current = now;
          saveCapture(canvas);
        }
      }
    }
  }, [compareFrames, saveCapture]);

  const startCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' } as any,
      });

      streamRef.current = stream;

      const video = document.createElement('video');
      video.srcObject = stream;
      video.muted = true;
      await video.play();
      videoRef.current = video;

      const canvas = document.createElement('canvas');
      canvasRef.current = canvas;

      lastCapturedFrameRef.current = null;
      prevFrameRef.current = null;
      phaseRef.current = 'watching';
      stableCountRef.current = 0;
      orderCounterRef.current = 0;

      setIsCapturing(true);

      if (modeRef.current === 'auto') {
        intervalRef.current = window.setInterval(captureFrame, POLL_INTERVAL_MS);
      }

      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopCapture();
      });
    } catch (err) {
      console.error('[useScreenCapture] Failed to start capture:', err);
    }
  }, [captureFrame]);

  const stopCapture = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current = null;
    }
    setIsCapturing(false);
  }, []);

  const removeStep = useCallback((id: string) => {
    setSteps((prev) => {
      const step = prev.find((s) => s.id === id);
      if (step) URL.revokeObjectURL(step.thumbnailUrl);
      return prev.filter((s) => s.id !== id);
    });
  }, []);

  const reorderSteps = useCallback((newSteps: CapturedStep[]) => {
    setSteps(newSteps.map((s, i) => ({ ...s, order: i })));
  }, []);

  const updateStepDescription = useCallback((id: string, description: string) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, description } : s)));
  }, []);

  const updateStepImage = useCallback((id: string, blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        URL.revokeObjectURL(s.thumbnailUrl);
        return { ...s, blob, thumbnailUrl: url };
      })
    );
  }, []);

  const manualCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    saveCapture(canvas);
  }, [saveCapture]);

  const clearSteps = useCallback(() => {
    steps.forEach((s) => URL.revokeObjectURL(s.thumbnailUrl));
    setSteps([]);
    setCaptureCount(0);
    orderCounterRef.current = 0;
  }, [steps]);

  useEffect(() => {
    return () => {
      stopCapture();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
  }, []);

  return {
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
    manualCapture,
    videoRef,
  };
}
