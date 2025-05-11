
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

interface ContentfulRedirectorProps {
  contentType: string;
  title?: string;
  description?: string;
  contentfulUrl?: string;
  showBackButton?: boolean;
  backPath?: string;
  contentfulSpaceId?: string;
  contentfulEnvironmentId?: string;
  contentTypeId?: string;
}

/**
 * Component that provides a transition page to redirect users to Contentful
 * Used when a legacy admin page has been completely deprecated
 */
const ContentfulRedirector: React.FC<ContentfulRedirectorProps> = ({
  contentType,
  title = "Content Management Moved",
  description,
  contentfulUrl,
  showBackButton = true,
  backPath = "/admin/dashboard",
  contentfulSpaceId,
  contentfulEnvironmentId = "master",
  contentTypeId
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Default description if none provided
  const defaultDescription = `All ${contentType} management has moved to Contentful. Please use Contentful to manage this content.`;
  const displayDescription = description || defaultDescription;

  useEffect(() => {
    // Log this redirection
    logDeprecationWarning(
      "ContentfulRedirector",
      `User attempted to access deprecated admin page for ${contentType}`,
      "Use Contentful directly"
    );
    
    // Show toast - using 'default' variant instead of 'info' which is not a valid variant
    toast({
      title: "Redirecting to Contentful",
      description: displayDescription,
      variant: "default", // Changed from "info" to "default"
    });
  }, [contentType, displayDescription, toast]);

  const getContentfulUrl = (): string => {
    if (contentfulUrl) {
      return contentfulUrl;
    }
    
    let url = "https://app.contentful.com/";
    
    if (contentfulSpaceId) {
      url += `spaces/${contentfulSpaceId}/`;
      
      if (contentfulEnvironmentId) {
        url += `environments/${contentfulEnvironmentId}/`;
      }
      
      if (contentTypeId) {
        url += `entries/?contentTypeId=${contentTypeId}`;
      } else {
        url += "entries/";
      }
    }
    
    return url;
  };

  const handleOpenContentful = () => {
    window.open(getContentfulUrl(), "_blank");
  };

  const handleBack = () => {
    navigate(backPath);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Card className="shadow-md border-2 border-blue-100">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-xl text-blue-800">{title}</CardTitle>
            <CardDescription className="text-blue-700">
              {displayDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center text-center">
              <p className="mb-6 text-gray-600">
                The {contentType} management interface has been moved to Contentful CMS.
                Please click the button below to open Contentful and manage your content there.
              </p>
              
              <Button 
                onClick={handleOpenContentful} 
                className="bg-blue-600 hover:bg-blue-700 mb-8"
                size="lg"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Open {contentType} in Contentful
              </Button>
              
              {showBackButton && (
                <Button 
                  variant="ghost" 
                  onClick={handleBack}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Admin Dashboard
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ContentfulRedirector;
