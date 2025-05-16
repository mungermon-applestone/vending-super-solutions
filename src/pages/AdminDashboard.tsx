
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, Goal, Database, ExternalLink, AlertTriangle, Settings } from 'lucide-react';
import ContentfulButton from '@/components/admin/ContentfulButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import DeprecationUsage from '@/components/admin/DeprecationUsage';

const AdminDashboard = () => {
  const { toast } = useToast();
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to sign-in if not an admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/admin/sign-in');
    }
  }, [isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      toast({
        title: "Content Management",
        description: "Welcome to the content management dashboard. All content management has been moved to Contentful CMS.",
        variant: "warning",
      });
    }
  }, [isAdmin, toast]);

  const handleOpenContentful = () => {
    window.open("https://app.contentful.com/", "_blank");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-center h-64">
            <p>Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Content Management</h1>
          <p className="text-muted-foreground">
            Manage your content through Contentful CMS
          </p>
        </div>

        <Alert variant="warning" className="mb-8">
          <AlertTriangle className="h-6 w-6" />
          <AlertTitle>Legacy Admin Portal</AlertTitle>
          <AlertDescription>
            The internal admin portal is being phased out. Please use Contentful for all content management. 
            Direct database operations will be removed in future updates.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card className="border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Contentful CMS
              </CardTitle>
              <CardDescription>All content management is now done via Contentful</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-sm text-gray-600">
                Use Contentful to manage all your website content including products, machines,
                business goals, technologies, blog posts, and case studies.
              </p>
              <Button onClick={handleOpenContentful} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Contentful
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Contentful Configuration
              </CardTitle>
              <CardDescription>Manage API keys and environment settings</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-sm text-gray-600">
                Configure your Contentful API keys, environment IDs, and other settings 
                needed to connect your website to the Contentful CMS.
              </p>
              <Button 
                onClick={() => navigate('/admin/contentful')} 
                variant="outline" 
                className="w-full"
              >
                Manage Configuration
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Usage tracking section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-6">Deprecation Usage Tracking</h2>
          <DeprecationUsage showResetButton={true} showChart={true} />
        </div>

        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Legacy Admin Sections</h2>
          <p className="text-gray-600 mb-6">
            The following admin sections are deprecated and will be removed in a future update.
            All content management should now be done directly in Contentful CMS.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              { name: "Products", path: "/admin/products", icon: <Package className="h-4 w-4" /> },
              { name: "Business Goals", path: "/admin/business-goals", icon: <Goal className="h-4 w-4" /> },
              // Add other legacy sections as needed
            ].map((item) => (
              <Button 
                key={item.name}
                variant="outline" 
                className="justify-start text-gray-500 border border-gray-200 hover:bg-gray-100"
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <ContentfulButton 
            className="bg-blue-600 hover:bg-blue-700 text-white" 
            variant="default"
          />
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
