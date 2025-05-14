
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContentfulFallbackMessageProps {
  message?: string;
  contentType?: string;
  showRefresh?: boolean;
  showAdminLink?: boolean;
  className?: string;
  onRefresh?: () => void;
}

/**
 * Reusable fallback message for Contentful content loading failures
 */
const ContentfulFallbackMessage: React.FC<ContentfulFallbackMessageProps> = ({
  message,
  contentType = 'content',
  showRefresh = true,
  showAdminLink = true,
  className = '',
  onRefresh
}) => {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <Alert variant="default" className={`mb-4 ${className}`}>
      <AlertTitle>Contentful {contentType} not available</AlertTitle>
      <AlertDescription>
        <p className="mb-4">
          {message || `We couldn't load the ${contentType} from Contentful. This could be due to missing content or configuration issues.`}
        </p>
        <div className="flex flex-wrap gap-2">
          {showRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          )}
          
          {showAdminLink && (
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="flex items-center gap-1"
            >
              <Link to="/admin/contentful">
                <Settings className="h-4 w-4" />
                <span>Manage Contentful</span>
              </Link>
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ContentfulFallbackMessage;
