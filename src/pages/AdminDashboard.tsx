
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, Goal, Database, ExternalLink, AlertTriangle, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
        description: "Welcome to the content management dashboard. Use Contentful for all content updates.",
      });
    }
  }, [isAdmin, toast]);

  const handleOpenContentful = () => {
    window.open("https://app.contentful.com/", "_blank");
  };

  const handleOpenConfig = () => {
    navigate('/admin/contentful-config');
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

        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-md">
          <div className="flex gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <div>
              <h3 className="font-medium text-amber-800">Legacy Admin Portal</h3>
              <p className="text-amber-700 mt-1">
                The internal admin portal is being phased out. Please use Contentful for all content management. 
                Direct database operations will be removed in future updates.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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
              <Button onClick={handleOpenConfig} variant="outline" className="w-full">
                Manage Configuration
              </Button>
            </CardContent>
          </Card>
        </div>

        <div id="legacy-notice" className="mt-16 border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Legacy Admin Sections</h2>
          <p className="text-gray-600 mb-6">
            The following legacy admin sections are deprecated and will be removed in a future update.
            Please transition all content management to Contentful.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Products", path: "/admin/products", icon: <Package className="h-4 w-4" /> },
              { name: "Business Goals", path: "/admin/business-goals", icon: <Goal className="h-4 w-4" /> },
              // More legacy sections can be listed here
            ].map((item) => (
              <Button 
                key={item.name}
                variant="ghost" 
                className="justify-start text-gray-500 border border-gray-200 hover:bg-gray-100"
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
                <span className="ml-auto text-xs bg-gray-200 px-2 py-1 rounded-full">Deprecated</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
