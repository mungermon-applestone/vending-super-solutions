
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { logDeprecation, getContentfulRedirectUrl } from '@/services/cms/utils/deprecation';

interface ContentfulFallbackMessageProps {
  title?: string;
  message: string;
  contentType: string;
  actionText?: string;
  actionHref?: string;
  showRefresh?: boolean;
  showAdmin?: boolean;
}

const ContentfulFallbackMessage: React.FC<ContentfulFallbackMessageProps> = ({
  title,
  message,
  contentType,
  actionText,
  actionHref,
  showRefresh = false,
  showAdmin = true
}) => {
  const handleRefresh = () => {
    window.location.reload();
  };
  
  const handleViewInContentful = () => {
    logDeprecation('ContentfulFallbackMessage', `Redirected to Contentful for ${contentType}`);
    const url = getContentfulRedirectUrl(contentType.toLowerCase().replace(/\s+/g, ''));
    window.open(url, '_blank');
  };
  
  return (
    <div className="rounded-lg border p-6 shadow-sm bg-card">
      <Alert variant="warning" className="mb-4">
        <AlertTitle>{title || `${contentType} Unavailable`}</AlertTitle>
        <AlertDescription>
          {message}
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-wrap gap-3 mt-4">
        {showRefresh && (
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Page
          </Button>
        )}
        
        {actionText && actionHref && (
          <Button 
            onClick={() => window.location.href = actionHref} 
            variant="default" 
            size="sm"
          >
            {actionText}
          </Button>
        )}
        
        {showAdmin && (
          <Button onClick={handleViewInContentful} variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            View in Contentful
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContentfulFallbackMessage;
