
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ContentfulRedirectorProps {
  contentType: string;
  title?: string;
  description?: string;
  contentfulUrl?: string;
  showBackButton?: boolean;
  backPath?: string;
}

/**
 * Component to redirect users from legacy admin editors to Contentful
 * Part of the CMS migration strategy to phase out direct database operations
 */
const ContentfulRedirector: React.FC<ContentfulRedirectorProps> = ({
  contentType,
  title,
  description,
  contentfulUrl = 'https://app.contentful.com/',
  showBackButton = true,
  backPath = '/admin'
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Display toast notification on mount
  useEffect(() => {
    toast({
      title: "Admin Interface Deprecated",
      description: `${contentType} management has been moved to Contentful CMS.`,
      variant: "destructive",
    });
  }, [toast, contentType]);
  
  // Derived values
  const displayTitle = title || `${contentType} Management Moved`;
  const displayDescription = description || 
    `The ${contentType.toLowerCase()} editor has been deprecated. Please use Contentful CMS to manage ${contentType.toLowerCase()} content.`;
  
  const handleOpenContentful = () => {
    window.open(contentfulUrl, "_blank");
  };
  
  const handleBack = () => {
    navigate(backPath);
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto shadow-md">
          <CardHeader className="bg-amber-50 border-b border-amber-200">
            <CardTitle className="text-amber-800">{displayTitle}</CardTitle>
            <CardDescription className="text-amber-700">
              Migration to Contentful CMS
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="p-4 border border-amber-200 rounded-md bg-amber-50">
                <p className="text-amber-800 mb-2 font-medium">
                  Content Management Update
                </p>
                <p className="text-amber-700 mb-4">
                  {displayDescription}
                </p>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Button 
                  onClick={handleOpenContentful}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Contentful
                </Button>
                
                {showBackButton && (
                  <Button variant="outline" onClick={handleBack}>
                    Return to Admin Dashboard
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ContentfulRedirector;
