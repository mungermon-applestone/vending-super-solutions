
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

interface ContentfulFallbackMessageProps {
  title?: string;
  message: string;
  contentType: string;
  showRefresh?: boolean;
  showAdmin?: boolean;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  onRetry?: (options?: RefetchOptions) => Promise<any>; // Added onRetry prop
}

const ContentfulFallbackMessage: React.FC<ContentfulFallbackMessageProps> = ({
  title,
  message,
  contentType,
  showRefresh = false,
  showAdmin = true,
  actionText,
  actionHref,
  onAction,
  onRetry,
}) => {
  const handleRefresh = () => {
    if (onRetry) {
      onRetry();
    } else if (onAction) {
      onAction();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{title || `Unable to load ${contentType}`}</AlertTitle>
        <AlertDescription className="mt-2">
          <p>{message}</p>
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-4 justify-center mt-6">
        {showRefresh && (
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            {actionText || "Refresh Page"}
          </Button>
        )}
        
        {actionHref && actionText && !showRefresh && (
          <Button onClick={onAction || (() => {})} asChild>
            <Link to={actionHref}>
              {actionText}
            </Link>
          </Button>
        )}
        
        {showAdmin && !actionHref && (
          <Button asChild>
            <Link to="/admin/contentful-config">
              Configure Contentful
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContentfulFallbackMessage;
