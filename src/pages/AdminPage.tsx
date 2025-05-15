
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, Info } from 'lucide-react';

// Get Contentful space URL from environment variable
const CONTENTFUL_SPACE_URL = import.meta.env.VITE_CONTENTFUL_SPACE_URL || 'https://app.contentful.com/';

const AdminPage: React.FC = () => {
  // Redirect to Contentful web app
  const openContentfulWebApp = () => {
    window.open(CONTENTFUL_SPACE_URL, '_blank');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Content Management</h1>
        
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Contentful CMS Integration</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              This application now uses Contentful as the content management system.
              All content is managed directly through the Contentful web interface.
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
