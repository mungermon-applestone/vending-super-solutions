
import React, { ReactNode } from 'react';
import Layout from '@/components/layout/Layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import ContentfulButton from '@/components/admin/ContentfulButton';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface DeprecatedAdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  contentType?: string;
  showContentfulButton?: boolean;
  backPath?: string;
  showBackButton?: boolean;
}

/**
 * Standardized layout for deprecated admin pages that displays consistent 
 * migration messaging and directs users to Contentful
 */
const DeprecatedAdminLayout: React.FC<DeprecatedAdminLayoutProps> = ({
  children,
  title,
  description,
  contentType,
  showContentfulButton = true,
  backPath = '/admin',
  showBackButton = true,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Show a toast notification on component mount
  useEffect(() => {
    toast({
      title: "Deprecated Admin Interface",
      description: contentType 
        ? `This ${contentType} management interface is being phased out. Please use Contentful CMS.` 
        : "This admin interface is being phased out. Please use Contentful CMS.",
      variant: "warning",
    });
  }, [toast, contentType]);
  
  return (
    <Layout>
      <div className="container mx-auto py-10">
        {showBackButton && (
          <div className="mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(backPath)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {backPath === '/admin' ? 'Admin' : 'Dashboard'}
            </Button>
          </div>
        )}
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Deprecated Admin Interface</AlertTitle>
          <AlertDescription>
            This admin interface is being phased out. All content management should now be done 
            directly in Contentful CMS.
            {contentType && (
              <p className="mt-1">
                {`${contentType} management has been fully migrated to Contentful. This view is kept for reference only.`}
              </p>
            )}
          </AlertDescription>
        </Alert>
        
        {showContentfulButton && (
          <div className="mb-6">
            <ContentfulButton 
              contentType={contentType}
              variant="default"
              size="default"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            />
          </div>
        )}
        
        {children}
      </div>
    </Layout>
  );
};

export default DeprecatedAdminLayout;
