import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { usePromotionalStrip } from '@/hooks/cms/usePromotionalStrip';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';

// Inline-specific render options for the promotional strip
const getInlineRichTextOptions = (): Options => ({
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <span>{children}</span>,
    [BLOCKS.DOCUMENT]: (node, children) => <>{children}</>,
    [INLINES.HYPERLINK]: (node, children) => (
      <a 
        href={node.data.uri}
        className="underline hover:opacity-80 transition-opacity"
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

const PromotionalStrip: React.FC = () => {
  const { data, isLoading } = usePromotionalStrip();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Check if previously dismissed this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('promo-strip-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  // Check for text overflow
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 60; // Account for dismiss button
        const textWidth = textRef.current.scrollWidth;
        setIsOverflowing(textWidth > containerWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [data?.richText]);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('promo-strip-dismissed', 'true');
  };

  // Don't render if loading, no data, not active, or dismissed
  if (isLoading || !data || !data.isActive || isDismissed) {
    return null;
  }

  const renderedContent = documentToReactComponents(data.richText, getInlineRichTextOptions());

  return (
    <div className="bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground relative overflow-hidden">
      <div ref={containerRef} className="px-4 py-2.5 relative flex items-center justify-center">
        {isOverflowing ? (
          // Marquee mode when text overflows
          <div className="animate-marquee whitespace-nowrap pr-12">
            <span className="text-base font-medium tracking-wide mx-8">
              {renderedContent}
            </span>
            <span className="text-base font-medium tracking-wide mx-8">
              {renderedContent}
            </span>
          </div>
        ) : (
          // Static centered text when it fits
          <div ref={textRef} className="text-center text-base font-medium tracking-wide whitespace-nowrap">
            {renderedContent}
          </div>
        )}
        <button
          onClick={handleDismiss}
          className="absolute right-2 md:right-4 p-1 hover:bg-primary-foreground/10 rounded-full transition-colors z-10 bg-primary/80"
          aria-label="Dismiss promotional banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PromotionalStrip;
