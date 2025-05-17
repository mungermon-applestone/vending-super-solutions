
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefetchOptions, QueryObserverResult } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

export interface ContentfulFallbackMessageProps {
  title?: string; // Make title optional
  message: string;
  onRetry?: (options?: RefetchOptions) => Promise<any>;
  contentType: string;
  
  // Additional props that are used in the project
  showRefresh?: boolean;
  actionText?: string;
  actionHref?: string;
  showAdmin?: boolean;
  onAction?: () => Promise<any>;
}

/**
 * Component to display when there's an error loading content from Contentful
 */
const ContentfulFallbackMessage: React.FC<ContentfulFallbackMessageProps> = ({
  title,
  message,
  onRetry,
  contentType,
  showRefresh = false,
  actionText,
  actionHref,
  showAdmin = false,
  onAction
}) => {
  // Default title if one isn't provided
  const displayTitle = title || `Error Loading ${contentType}`;

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
      <h2 className="text-2xl font-bold mb-2">{displayTitle}</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      
      <div className="space-y-3">
        {onRetry && (
          <Button onClick={() => onRetry()} className="mb-4">
            Try Again
          </Button>
        )}
        
        {showRefresh && (
          <Button onClick={() => window.location.reload()} className="mb-4">
            Refresh Page
          </Button>
        )}
        
        {actionText && actionHref && (
          <div>
            <Link to={actionHref} className="inline-block">
              <Button variant="outline" className="mb-4">
                {actionText}
              </Button>
            </Link>
          </div>
        )}
        
        {actionText && onAction && !actionHref && (
          <Button onClick={onAction} className="mb-4" variant="outline">
            {actionText}
          </Button>
        )}
      </div>
      
      {showAdmin && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
          <p>Admin options</p>
          <div className="flex gap-2 justify-center mt-2">
            <Button variant="outline" size="sm">
              Manage in Contentful
            </Button>
          </div>
        </div>
      )}
      
      <p className="text-sm text-gray-500 mt-4">
        If this problem persists, please check your Contentful content model for {contentType}.
      </p>
    </div>
  );
};

export default ContentfulFallbackMessage;
