
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContentfulFallbackMessageProps {
  message: string;
  contentType: string;
  showRefresh?: boolean;
  showAdmin?: boolean;
}

const ContentfulFallbackMessage: React.FC<ContentfulFallbackMessageProps> = ({
  message,
  contentType,
  showRefresh = false,
  showAdmin = true,
}) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Unable to load {contentType}</AlertTitle>
        <AlertDescription className="mt-2">
          <p>{message}</p>
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-4 justify-center mt-6">
        {showRefresh && (
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Page
          </Button>
        )}
        
        {showAdmin && (
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
