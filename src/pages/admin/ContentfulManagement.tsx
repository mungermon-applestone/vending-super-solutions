
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExternalLink, Settings, Database, Server } from 'lucide-react';

const ContentfulManagement = () => {
  const navigate = useNavigate();
  
  const handleOpenContentful = () => {
    window.open('https://app.contentful.com/', '_blank');
  };
  
  const contentTypes = [
    { name: 'Products', description: 'Manage product catalog and details' },
    { name: 'Machines', description: 'Configure vending machines and lockers' },
    { name: 'Business Goals', description: 'Define and track business objectives' },
    { name: 'Technologies', description: 'Showcase technology capabilities' },
    { name: 'Blog Posts', description: 'Create and publish blog content' },
    { name: 'Case Studies', description: 'Document customer success stories' },
    { name: 'Landing Pages', description: 'Design conversion-focused pages' },
    { name: 'Media Library', description: 'Manage images and other media assets' }
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/admin/dashboard')}
            className="mb-4"
          >
            <span className="mr-2">&larr;</span>
            Back to Admin
          </Button>
          
          <h1 className="text-3xl font-bold">Contentful CMS Management</h1>
          <p className="mt-2 text-muted-foreground">
            Manage all website content through the Contentful CMS
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card className="border-blue-200 shadow-md">
            <CardHeader className="bg-blue-50 border-b border-blue-200">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Contentful CMS
              </CardTitle>
              <CardDescription>
                Centralized content management platform
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">
                All content management operations are now handled through Contentful CMS.
                Use the Contentful web interface to create, edit, and manage all your content.
              </p>
              <Button 
                onClick={handleOpenContentful} 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Contentful
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Content Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {contentTypes.map((type) => (
            <Card key={type.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{type.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{type.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleOpenContentful}
                  className="w-full"
                >
                  Manage in Contentful
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" /> API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Configure Contentful API keys, environment settings, and integration parameters.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Manage API Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="h-5 w-5" /> Preview Environment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Configure preview environment settings to test content changes before publishing.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Configure Preview
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ContentfulManagement;
