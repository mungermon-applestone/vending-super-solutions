
import React, { ReactNode } from 'react';
import Layout from '@/components/layout/Layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import ContentfulButton from '@/components/admin/ContentfulButton';

interface DeprecatedAdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  contentType?: string;
  showContentfulButton?: boolean;
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
  showContentfulButton = true
}) => {
  return (
    <Layout>
      <div className="container mx-auto py-10">
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
