
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ContentfulButton from '../ContentfulButton';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

interface DeprecatedAdminLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  backPath?: string;
  contentType?: string;
  showContentfulButton?: boolean;
  isEditMode?: boolean;
}

/**
 * Layout component for deprecated admin interfaces
 * @deprecated This component will be removed when admin interfaces are migrated to Contentful
 */
const DeprecatedAdminLayout: React.FC<DeprecatedAdminLayoutProps> = ({
  title,
  description,
  children,
  backPath,
  contentType,
  showContentfulButton = true,
  isEditMode = false,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Track usage of deprecated admin interface
    logDeprecationWarning(
      "DeprecatedAdminLayout", 
      `Admin interface for ${contentType || 'unknown content type'} is deprecated`,
      "Please use Contentful for content management"
    );
    
    // Show toast notification about deprecation
    toast({
      title: "Deprecated Admin Interface",
      description: "This admin interface is being phased out. Please use Contentful for content management.",
      variant: "warning",
      duration: 5000,
    });
    
    // For edit mode, show additional warning
    if (isEditMode) {
      toast({
        title: "Read-Only Mode",
        description: "Edit functionality is disabled. Please use Contentful for content updates.",
        variant: "destructive",
        duration: 7000,
      });
    }
  }, [contentType, isEditMode, toast]);

  const handleOpenContentful = () => {
    window.open("https://app.contentful.com/", "_blank");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          {backPath && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(backPath)}
              className="mb-4"
            >
              ← Back
            </Button>
          )}
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-muted-foreground mt-1">{description}</p>
            </div>
            
            {showContentfulButton && (
              <ContentfulButton
                variant="default"
                contentType={contentType}
                className="bg-blue-600 hover:bg-blue-700"
              />
            )}
          </div>
        </div>
        
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Deprecated Admin Interface</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-2">
              This admin interface is being phased out and will be removed in a future release.
              {isEditMode && " Edit functionality is now disabled."}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100 mt-2"
              onClick={handleOpenContentful}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Contentful
            </Button>
          </AlertDescription>
        </Alert>
        
        {children}
      </div>
    </Layout>
  );
};

export default DeprecatedAdminLayout;
