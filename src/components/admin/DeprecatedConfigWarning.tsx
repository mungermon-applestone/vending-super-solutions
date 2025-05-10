
import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface DeprecatedConfigWarningProps {
  service: string;
  contentType: string;
  showContentfulButton?: boolean;
}

const DeprecatedConfigWarning: React.FC<DeprecatedConfigWarningProps> = ({
  service,
  contentType,
  showContentfulButton = false
}) => {
  const openContentful = () => {
    window.open('https://app.contentful.com/', '_blank');
  };
  
  return (
    <Alert variant="warning" className="mb-4">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle>{service} Integration Deprecated</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          The {service} {contentType} integration has been deprecated. 
          All content management has been migrated to Contentful CMS.
        </p>
        
        {showContentfulButton && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-fit bg-white"
            onClick={openContentful}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Contentful
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default DeprecatedConfigWarning;
