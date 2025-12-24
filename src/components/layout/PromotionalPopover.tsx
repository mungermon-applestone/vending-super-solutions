import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';
import { usePromotionalPopover } from '@/hooks/cms/usePromotionalPopover';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

const STORAGE_KEY = 'promotional-popover-dismissed';
const AUTO_CLOSE_SECONDS = 10;

const getRichTextOptions = (): Options => ({
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className="mb-3 last:mb-0">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node, children) => (
      <h1 className="text-2xl font-bold mb-3">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="text-xl font-bold mb-2">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="text-lg font-semibold mb-2">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => <li>{children}</li>,
    [INLINES.HYPERLINK]: (node, children) => (
      <a
        href={node.data.uri}
        className="text-primary underline hover:opacity-80 transition-opacity"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  renderMark: {
    [MARKS.BOLD]: (text) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
  },
});

const PromotionalPopover: React.FC = () => {
  const { data, isLoading } = usePromotionalPopover();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(AUTO_CLOSE_SECONDS);

  // Check if should show popover
  const shouldShow = useCallback(() => {
    if (!data || !data.isActive) return false;
    if (location.pathname !== data.targetRoute) return false;
    if (isMobile) return false; // Don't show on mobile devices
    
    // Check if already dismissed this session
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed === 'true') return false;
    
    return true;
  }, [data, location.pathname, isMobile]);

  // Open popover when conditions are met
  useEffect(() => {
    if (shouldShow()) {
      setIsOpen(true);
      setSecondsRemaining(AUTO_CLOSE_SECONDS);
    }
  }, [shouldShow]);

  // Auto-close countdown timer
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          handleDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleDismiss = useCallback(() => {
    setIsOpen(false);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  if (isLoading || !data || !isOpen) {
    return null;
  }

  const progressValue = (secondsRemaining / AUTO_CLOSE_SECONDS) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="sm:max-w-[560px] p-0 gap-0 overflow-hidden">
        {/* Large prominent close button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Close promotional popover"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Featured image */}
        {data.imageUrl && (
          <div className="w-full max-h-[280px] overflow-hidden bg-muted/30">
            <img
              src={data.imageUrl}
              alt={data.title}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 pt-5">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-xl font-bold pr-10">
              {data.title}
            </DialogTitle>
          </DialogHeader>

          {/* Rich text body */}
          <div className="text-muted-foreground text-sm leading-relaxed">
            {documentToReactComponents(data.body, getRichTextOptions())}
          </div>
        </div>

        {/* Countdown progress bar */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-3">
            <Progress value={progressValue} className="h-2 flex-1" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {secondsRemaining}s
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionalPopover;
