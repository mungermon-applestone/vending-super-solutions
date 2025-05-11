
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ContentfulButton from '@/components/admin/ContentfulButton';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

interface DeprecatedAdminLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  contentType?: string;
  backPath?: string;
  showContentfulButton?: boolean;
}

/**
 * Layout wrapper for deprecated admin pages
 * Provides consistent warning banners and navigation
 */
const DeprecatedAdminLayout: React.FC<DeprecatedAdminLayoutProps> = ({
  title,
  description,
  children,
  contentType,
  backPath = '/admin/dashboard',
  showContentfulButton = true,
}) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Log usage of this deprecated page
    logDeprecationWarning(
      `DeprecatedAdminLayout:${title}`,
      `User visited deprecated admin page: ${title}`,
      "Content management should be done via Contentful"
    );
  }, [title]);
  
  return (
    <Layout>
      <div className="container mx-auto p-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(backPath)}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">{title}</h1>
              {description && (
                <p className="text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            
            {showContentfulButton && contentType && (
              <ContentfulButton 
                contentType={contentType}
                variant="outline"
              />
            )}
          </div>
          
          <Alert variant="warning" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This admin interface is deprecated and will be removed in a future version.
              All content management should be done through Contentful CMS.
            </AlertDescription>
          </Alert>
          
          {children}
          
          <div className="mt-8 border-t pt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Need to manage content? Use Contentful CMS
            </p>
            <Button 
              variant="default"
              onClick={() => window.open('https://app.contentful.com/', '_blank')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Contentful
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DeprecatedAdminLayout;
