
import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';

interface DeprecatedInterfaceWarningProps {
  title?: string;
  message?: string;
  contentType?: string;
  showContentfulLink?: boolean;
}

const DeprecatedInterfaceWarning: React.FC<DeprecatedInterfaceWarningProps> = ({
  title = "Deprecated Administration Interface",
  message,
  contentType,
  showContentfulLink = true
}) => {
  const defaultMessage = contentType 
    ? `This ${contentType} administration interface is being phased out in favor of direct Contentful CMS management. Changes made here may not affect content displayed on the website.`
    : "This administration interface is being phased out in favor of direct Contentful CMS management.";

  const openContentful = () => {
    const contentfulUrl = "https://app.contentful.com/";
    window.open(contentfulUrl, "_blank");
  };

  return (
    <Alert variant="warning" className="mb-6 border-amber-300 bg-amber-50">
      <AlertTriangle className="h-5 w-5 text-amber-600" />
      <AlertTitle className="text-amber-800 font-medium">{title}</AlertTitle>
      <AlertDescription className="text-amber-700">
        <p>{message || defaultMessage}</p>
        <div className="mt-4">
          {showContentfulLink && (
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100"
              onClick={openContentful}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Contentful
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DeprecatedInterfaceWarning;
