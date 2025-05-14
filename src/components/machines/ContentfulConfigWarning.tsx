
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentfulConfigWarningProps {
  onRetry?: () => void;
  showDetails?: boolean;
  message?: string;
}

const ContentfulConfigWarning: React.FC<ContentfulConfigWarningProps> = ({
  onRetry,
  showDetails = true,
  message = "The connection to our content management system couldn't be established."
}) => {
  return (
    <div className="w-full bg-orange-50 border border-orange-200 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 mr-3" />
        <div className="flex-1">
          <h3 className="font-medium text-orange-800">Content Loading Issue</h3>
          <p className="text-orange-700 mt-1">{message}</p>
          
          {showDetails && (
            <div className="mt-2 text-sm text-orange-600">
              <p>This could be due to a temporary connection issue or missing configuration.</p>
            </div>
          )}
          
          {onRetry && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-white border-orange-300 text-orange-700 hover:bg-orange-50"
                onClick={onRetry}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentfulConfigWarning;
