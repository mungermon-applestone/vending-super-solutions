
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentfulTypeCreator from '@/components/admin/cms/ContentfulTypeCreator';
import ContentfulHeroContent from '@/components/admin/cms/ContentfulHeroContent';
import ContentfulProductTypes from '@/components/admin/cms/ContentfulProductTypes';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ContentfulManagement: React.FC = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Contentful Content Management</h1>
          <Button asChild variant="outline">
            <Link to="/admin/settings">Back to Settings</Link>
          </Button>
        </div>
        
        <Tabs defaultValue="types">
          <TabsList className="mb-6">
            <TabsTrigger value="types">Content Types</TabsTrigger>
            <TabsTrigger value="hero">Hero Content</TabsTrigger>
            <TabsTrigger value="products">Product Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="types">
            <ContentfulTypeCreator />
          </TabsContent>
          
          <TabsContent value="hero">
            <ContentfulHeroContent />
          </TabsContent>
          
          <TabsContent value="products">
            <ContentfulProductTypes />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ContentfulManagement;
