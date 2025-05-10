
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import DeprecatedConfigWarning from '../DeprecatedConfigWarning';

/**
 * @deprecated This component is deprecated as we are transitioning to Contentful
 */
const StrapiIntegrationInfo: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Strapi CMS Integration (Deprecated)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DeprecatedConfigWarning 
          service="Strapi"
          contentType="Content"
          showContentfulButton={true}
        />
        
        <p className="text-sm text-muted-foreground mt-4">
          The Strapi CMS integration has been deprecated and will be removed in a future release.
          All content management should be done through Contentful CMS.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto"
          onClick={() => window.open('https://app.contentful.com/', '_blank')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open Contentful
        </Button>
        
        <Button 
          variant="outline" 
          asChild
          className="w-full sm:w-auto"
        >
          <Link to="/admin/contentful">
            Manage Contentful Integration
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StrapiIntegrationInfo;
