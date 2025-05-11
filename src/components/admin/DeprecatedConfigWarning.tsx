
import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { trackDeprecatedFeatureUsage } from '@/services/cms/utils/deprecationLogger';

interface DeprecatedConfigWarningProps {
  service: string;
  contentType: string;
  showContentfulButton?: boolean;
}

/**
 * A standardized warning component for deprecated configuration settings
 */
const DeprecatedConfigWarning: React.FC<DeprecatedConfigWarningProps> = ({
  service,
  contentType,
  showContentfulButton = false
}) => {
  React.useEffect(() => {
    trackDeprecatedFeatureUsage(`DeprecatedConfigWarning:${service}`, `Warning shown for ${service} ${contentType} config`);
  }, [service, contentType]);

  const handleOpenContentful = () => {
    trackDeprecatedFeatureUsage('DeprecatedConfigWarning:OpenContentful', `User clicked to open Contentful from ${service} warning`);
    window.open('https://app.contentful.com/', '_blank');
  };

  return (
    <Alert variant="warning">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-medium text-amber-800">Deprecated Configuration</AlertTitle>
      <AlertDescription className="text-amber-700 mt-1">
        <p>
          The {service} integration for {contentType} management has been deprecated 
          and will be removed in a future release. Please use Contentful CMS for all 
          content management.
        </p>
        
        {showContentfulButton && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleOpenContentful}
            className="mt-2 border-amber-300 hover:bg-amber-50 text-amber-900"
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
