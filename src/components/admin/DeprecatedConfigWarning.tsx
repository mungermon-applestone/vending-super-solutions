
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ContentfulButton from './ContentfulButton';

interface DeprecatedConfigWarningProps {
  service: string;
  contentType?: string;
  showContentfulButton?: boolean;
  contentfulSpaceId?: string;
  contentfulEnvironmentId?: string;
}

/**
 * Component to display a consistent warning about deprecated configuration/services
 */
const DeprecatedConfigWarning: React.FC<DeprecatedConfigWarningProps> = ({
  service,
  contentType,
  showContentfulButton = true,
  contentfulSpaceId,
  contentfulEnvironmentId
}) => {
  return (
    <Alert variant="warning" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{service} Configuration Deprecated</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          {service} integration is being deprecated in favor of Contentful CMS.
          {contentType && ` Please use Contentful to manage ${contentType.toLowerCase()} content.`}
        </p>
        
        {showContentfulButton && (
          <div className="mt-4">
            <ContentfulButton
              variant="outline"
              size="sm"
              contentfulSpaceId={contentfulSpaceId}
              contentfulEnvironmentId={contentfulEnvironmentId}
              contentType={contentType}
            />
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default DeprecatedConfigWarning;
