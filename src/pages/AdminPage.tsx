
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Settings, Database, ExternalLink, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminPage = () => {
  const navigate = useNavigate();

  const handleOpenContentful = () => {
    window.open("https://app.contentful.com/", "_blank");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Content Management</h1>
          <p className="text-muted-foreground mb-6">
            Manage content and configuration settings
          </p>
          
          <Card className="mb-8 border-blue-200 shadow-md">
            <CardHeader className="bg-blue-50 border-b border-blue-200">
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Contentful CMS
              </CardTitle>
              <CardDescription className="text-blue-700">
                Primary content management system
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  All content management has been migrated to Contentful CMS. Please use Contentful for creating, editing, and managing:
                </p>
                
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Products</li>
                  <li>Machines</li>
                  <li>Business Goals</li>
                  <li>Technology Pages</li>
                  <li>Blog Articles</li>
                  <li>Case Studies</li>
                  <li>Landing Pages</li>
                </ul>
                
                <Button 
                  onClick={handleOpenContentful}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
                  size="lg"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Open Contentful CMS
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Alert variant="warning" className="mb-8">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Legacy Admin Interface</AlertTitle>
            <AlertDescription>
              The legacy admin interface is being phased out and will be removed in future updates.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm hover:shadow transition-shadow duration-200 border-gray-200">
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
                <p className="text-sm text-gray-600 mb-4">
                  Configure the connection between your application and Contentful CMS.
                  Set API keys, environment variables, and other Contentful settings.
                </p>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/admin/contentful-config')}
                >
                  Manage Configuration
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm hover:shadow transition-shadow duration-200 border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  <span>Legacy Dashboard</span>
                </CardTitle>
                <CardDescription>
                  Access legacy content management tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  The previous content management interface is being deprecated.
                  These tools will be removed in future updates as we complete
                  the migration to Contentful.
                </p>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/admin/dashboard')}
                >
                  View Dashboard
                  <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">Deprecated</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Need to manage content? Use Contentful CMS
            </p>
            <Button 
              variant="default" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleOpenContentful}
            >
              Go to Contentful
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
