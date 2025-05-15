
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, Info } from 'lucide-react';
import { getContentfulRedirectUrl } from '@/services/cms/utils/deprecation';

const AdminPage = () => {
  const openContentfulWebApp = () => {
    const url = getContentfulRedirectUrl('');
    window.open(url, '_blank');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Content Management</h1>
        
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>CMS Migration Complete</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              This application now uses Contentful as the single source of truth for all content.
              The legacy admin functionality has been removed in favor of direct Contentful management.
            </p>
            <p>
              Please use the Contentful web app to manage your content.
            </p>
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader>
            <CardTitle>Contentful Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              All content is now managed directly through the Contentful web application.
              Click the button below to access your Contentful space.
            </p>
            
            <Button onClick={openContentfulWebApp} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Open Contentful Web App
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminPage;
