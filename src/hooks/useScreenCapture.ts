import { useState, useRef, useCallback, useEffect } from 'react';

export interface CapturedStep {
  id: string;
  blob: Blob;
  thumbnailUrl: string;
  timestamp: number;
  order: number;
  description: string;
}

interface UseScreenCaptureOptions {
  sensitivity?: number; // 0-1, lower = more sensitive. Default 0.15
  debounceMs?: number;  // Minimum ms between captures. Default 2000
  sampleSize?: number;  // Number of pixels to sample. Default 1000
}

export function useScreenCapture(options: UseScreenCaptureOptions = {}) {
  const {
    sensitivity = 0.15,
    debounceMs = 2000,
    sampleSize = 1000,
  } = options;

  const [isCapturing, setIsCapturing] = useState(false);
  const [steps, setSteps] = useState<CapturedStep[]>([]);
  const [captureCount, setCaptureCount] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevFrameRef = useRef<ImageData | null>(null);
  const intervalRef = useRef<number | null>(null);
  const lastCaptureTimeRef = useRef<number>(0);
  const sensitivityRef = useRef(sensitivity);
  const orderCounterRef = useRef(0);

  // Keep sensitivity ref in sync
  useEffect(() => {
    sensitivityRef.current = sensitivity;
  }, [sensitivity]);

  const compareFrames = useCallback((current: ImageData, previous: ImageData): number => {
    const { data: curr } = current;
    const { data: prev } = previous;
    const totalPixels = current.width * current.height;
    const step = Math.max(1, Math.floor(totalPixels / sampleSize));

    let totalDiff = 0;
    let samplesChecked = 0;

    for (let i = 0; i < totalPixels; i += step) {
      const idx = i * 4;
      const rDiff = Math.abs(curr[idx] - prev[idx]);
      const gDiff = Math.abs(curr[idx + 1] - prev[idx + 1]);
      const bDiff = Math.abs(curr[idx + 2] - prev[idx + 2]);
      totalDiff += (rDiff + gDiff + bDiff) / (3 * 255);
      samplesChecked++;
    }

    return samplesChecked > 0 ? totalDiff / samplesChecked : 0;
  }, [sampleSize]);

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

    if (!prevFrameRef.current) {
      // First frame — always capture
      prevFrameRef.current = currentFrame;
      saveCapture(canvas);
      return;
    }

    const diff = compareFrames(currentFrame, prevFrameRef.current);
    const now = Date.now();

    if (diff > sensitivityRef.current && (now - lastCaptureTimeRef.current) > debounceMs) {
      prevFrameRef.current = currentFrame;
      lastCaptureTimeRef.current = now;
      saveCapture(canvas);
    }
  }, [compareFrames, debounceMs]);

  const saveCapture = useCallback((canvas: HTMLCanvasElement) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const order = orderCounterRef.current++;
      const step: CapturedStep = {
        id: `step-${Date.now()}-${order}`,
        blob,
        thumbnailUrl: url,
        timestamp: Date.now(),
        order,
        description: '',
      };
      setSteps((prev) => [...prev, step]);
      setCaptureCount((c) => c + 1);
    }, 'image/png');
  }, []);

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

      prevFrameRef.current = null;
      lastCaptureTimeRef.current = 0;
      orderCounterRef.current = 0;

      setIsCapturing(true);

      // Check frames at ~1fps
      intervalRef.current = window.setInterval(captureFrame, 1000);

      // Stop if user ends share via browser UI
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

  const clearSteps = useCallback(() => {
    steps.forEach((s) => URL.revokeObjectURL(s.thumbnailUrl));
    setSteps([]);
    setCaptureCount(0);
    orderCounterRef.current = 0;
  }, [steps]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCapture();
      steps.forEach((s) => URL.revokeObjectURL(s.thumbnailUrl));
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
    clearSteps,
    videoRef,
  };
}
