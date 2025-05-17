
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefetchOptions, QueryObserverResult } from '@tanstack/react-query';

export interface ContentfulFallbackMessageProps {
  title: string;
  message: string;
  onRetry?: (options?: RefetchOptions) => Promise<any>;
  contentType: string;
}

/**
 * Component to display when there's an error loading content from Contentful
 */
const ContentfulFallbackMessage: React.FC<ContentfulFallbackMessageProps> = ({
  title,
  message,
  onRetry,
  contentType
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-400 mb-4"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      {onRetry && (
        <Button onClick={() => onRetry()} className="mb-4">
          Try Again
        </Button>
      )}
      <p className="text-sm text-gray-500">
        If this problem persists, please check your Contentful content model for {contentType}.
      </p>
    </div>
  );
};

export default ContentfulFallbackMessage;
