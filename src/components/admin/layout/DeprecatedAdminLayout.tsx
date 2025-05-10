
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DeprecatedAdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  contentType: string;
  backPath?: string;
}

const DeprecatedAdminLayout: React.FC<DeprecatedAdminLayoutProps> = ({
  children,
  title,
  description,
  contentType,
  backPath = "/admin/dashboard"
}) => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto py-8">
        {/* Back button and page header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(backPath)}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
          
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="mt-2 text-muted-foreground">{description}</p>
          )}
        </div>
        
        {/* Deprecation warning */}
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Deprecated Interface</AlertTitle>
          <AlertDescription>
            This {contentType} admin interface is deprecated and will be removed in a future version.
            Please use Contentful to manage {contentType.toLowerCase()} content.
          </AlertDescription>
        </Alert>
        
        {/* Main content */}
        {children}
      </div>
    </Layout>
  );
};

export default DeprecatedAdminLayout;
