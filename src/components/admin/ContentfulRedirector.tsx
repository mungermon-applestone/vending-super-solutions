
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { getContentfulRedirectUrl } from '@/services/cms/utils/deprecation';
import { logDeprecation } from '@/services/cms/utils/deprecation';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { CONTENTFUL_APP_URL } from '@/services/cms/utils/deprecationConstants';

interface ContentfulRedirectorProps {
  contentType?: string;
  contentId?: string;
  entityName?: string;
  redirectDelay?: number;
  showAutoRedirectMessage?: boolean;
}

/**
 * Redirector component for sending users to Contentful for content management
 */
const ContentfulRedirector: React.FC<ContentfulRedirectorProps> = ({
  contentType,
  contentId,
  entityName = 'content',
  redirectDelay = 0,
  showAutoRedirectMessage = false,
}) => {
  useEffect(() => {
    // Log this redirection for tracking
    logDeprecation(
      "ContentfulRedirector",
      `User redirected to Contentful for ${contentType || 'content management'}`
    );

    // If a delay is set, automatically redirect after that delay
    if (redirectDelay > 0) {
      const timer = setTimeout(() => {
        handleRedirect();
      }, redirectDelay * 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleRedirect = () => {
    const url = contentType 
      ? getContentfulRedirectUrl(contentType, contentId)
      : CONTENTFUL_APP_URL;
    
    window.open(url, "_blank");
  };

  return (
    <Card className="max-w-lg mx-auto border-blue-200 shadow-sm">
      <CardHeader className="bg-blue-50 border-b border-blue-200">
        <CardTitle className="text-blue-800">Contentful Redirection</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Alert variant="info" className="mb-4">
          <AlertTitle>Content Management Has Moved</AlertTitle>
          <AlertDescription>
            All {entityName} management has been migrated to Contentful CMS.
          </AlertDescription>
        </Alert>
        
        <p className="mb-6">
          {contentType
            ? `To manage this ${entityName}, please use Contentful's content editor.`
            : 'Please use Contentful for all content management tasks.'}
        </p>
        
        {showAutoRedirectMessage && redirectDelay > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            You will be automatically redirected to Contentful in {redirectDelay} seconds.
          </p>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 border-t">
        <Button onClick={handleRedirect} className="bg-blue-600 hover:bg-blue-700 w-full">
          <ExternalLink className="mr-2 h-4 w-4" />
          {contentType 
            ? `Open ${entityName} in Contentful` 
            : 'Open Contentful CMS'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentfulRedirector;
