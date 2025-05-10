
import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeprecatedInterfaceWarningProps {
  contentType: string;
  message?: string;
}

const DeprecatedInterfaceWarning: React.FC<DeprecatedInterfaceWarningProps> = ({ 
  contentType, 
  message 
}) => {
  const defaultMessage = `This ${contentType} interface is deprecated and will be removed in future updates. Please use Contentful for content management.`;
  const displayMessage = message || defaultMessage;
  
  const handleOpenContentful = () => {
    window.open("https://app.contentful.com/", "_blank");
  };

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-md">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 mt-1" />
        <div className="flex-1">
          <h3 className="font-medium text-amber-800">Deprecated Interface</h3>
          <p className="text-amber-700 mt-1 mb-3">
            {displayMessage}
          </p>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100"
            onClick={handleOpenContentful}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Contentful
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeprecatedInterfaceWarning;
