import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ImageCropperProps {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
  onCrop: (blob: Blob) => void;
}

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function ImageCropper({ open, imageUrl, onClose, onCrop }: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [dragging, setDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [crop, setCrop] = useState<CropRect | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setCrop(null);
      setDragging(false);
      setImgLoaded(false);
    }
  }, [open]);

  const getRelativePos = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: Math.max(0, Math.min(e.clientX - rect.left, rect.width)),
      y: Math.max(0, Math.min(e.clientY - rect.top, rect.height)),
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const pos = getRelativePos(e);
    setStartPoint(pos);
    setCrop({ x: pos.x, y: pos.y, w: 0, h: 0 });
    setDragging(true);
  }, [getRelativePos]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const pos = getRelativePos(e);
    setCrop({
      x: Math.min(startPoint.x, pos.x),
      y: Math.min(startPoint.y, pos.y),
      w: Math.abs(pos.x - startPoint.x),
      h: Math.abs(pos.y - startPoint.y),
    });
  }, [dragging, startPoint, getRelativePos]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const applyCrop = useCallback(() => {
    if (!crop || crop.w < 5 || crop.h < 5 || !imgRef.current || !containerRef.current) return;

    const img = imgRef.current;
    const container = containerRef.current;
    const displayW = container.clientWidth;
    const displayH = container.clientHeight;

    // Scale from display coords to natural image coords
    const scaleX = img.naturalWidth / displayW;
    const scaleY = img.naturalHeight / displayH;

    const sx = Math.round(crop.x * scaleX);
    const sy = Math.round(crop.y * scaleY);
    const sw = Math.round(crop.w * scaleX);
    const sh = Math.round(crop.h * scaleY);

    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    canvas.toBlob((blob) => {
      if (blob) onCrop(blob);
    }, 'image/png');
  }, [crop, onCrop]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>Crop Screenshot</DialogTitle>
          <DialogDescription>Click and drag to select the area you want to keep.</DialogDescription>
        </DialogHeader>

        <div
          ref={containerRef}
          className="relative select-none cursor-crosshair overflow-hidden rounded-md border border-border bg-muted"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Screenshot to crop"
            className="block w-full h-auto"
            draggable={false}
            onLoad={() => setImgLoaded(true)}
          />

          {/* Dim overlay outside crop area */}
          {imgLoaded && crop && crop.w > 2 && crop.h > 2 && (
            <>
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50 pointer-events-none" />
              {/* Clear window for crop area */}
              <div
                className="absolute border-2 border-primary pointer-events-none"
                style={{
                  left: crop.x,
                  top: crop.y,
                  width: crop.w,
                  height: crop.h,
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
                  background: 'transparent',
                  zIndex: 10,
                }}
              />
              {/* Show the image through the crop window */}
              <div
                className="absolute overflow-hidden pointer-events-none"
                style={{
                  left: crop.x,
                  top: crop.y,
                  width: crop.w,
                  height: crop.h,
                  zIndex: 5,
                }}
              >
                <img
                  src={imageUrl}
                  alt=""
                  className="block"
                  draggable={false}
                  style={{
                    position: 'absolute',
                    left: -crop.x,
                    top: -crop.y,
                    width: containerRef.current?.clientWidth,
                    height: containerRef.current?.clientHeight,
                  }}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={applyCrop}
            disabled={!crop || crop.w < 5 || crop.h < 5}
          >
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
