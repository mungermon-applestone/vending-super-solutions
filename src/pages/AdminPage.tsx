
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Settings, Database, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const AdminPage = () => {
  const navigate = useNavigate();

  const handleOpenContentful = () => {
    window.open("https://app.contentful.com/", "_blank");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Content Management</h1>
        <p className="text-muted-foreground mb-6">
          Manage content and configuration settings
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Contentful Migration</h3>
              <p className="text-blue-700 mt-1 mb-3">
                All content management has been migrated to Contentful CMS. The legacy admin interface 
                is being phased out and will be removed in future updates.
              </p>
              <Button 
                onClick={handleOpenContentful}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Contentful
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-sm hover:shadow transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <span>Contentful Configuration</span>
              </CardTitle>
              <CardDescription>
                Set up environment variables for Contentful CMS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/admin/contentful-config')}
              >
                Manage Configuration
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <span>Admin Dashboard</span>
              </CardTitle>
              <CardDescription>
                Access legacy content management tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate('/admin/dashboard')}
              >
                View Dashboard
                <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">Legacy</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
