
import React from 'react';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

interface ContentfulFallbackMessageProps {
  title?: string;
  message: string;
  contentType: string;
  showRefresh?: boolean;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

/**
 * A standardized component for displaying fallback messages when Contentful
 * data is unavailable or there's an error.
 */
const ContentfulFallbackMessage: React.FC<ContentfulFallbackMessageProps> = ({
  title = 'Content Unavailable',
  message,
  contentType,
  showRefresh = true,
  actionText,
  actionHref,
  onAction
}) => {
  return (
    <div className="p-6 border border-gray-200 bg-gray-50 rounded-lg text-center">
      <div className="flex justify-center mb-4">
        <Info size={32} className="text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-700 mb-6">
        {message}
      </p>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {showRefresh && (
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        )}
        
        {(actionText && (actionHref || onAction)) && (
          <Button 
            variant="default"
            onClick={onAction}
            {...(actionHref ? { as: 'a', href: actionHref } : {})}
          >
            {actionText}
          </Button>
        )}
      </div>
      
      <p className="text-xs text-gray-500 mt-6">
        Content type: {contentType}
      </p>
    </div>
  );
};

export default ContentfulFallbackMessage;
