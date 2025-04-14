
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CMSConnectionTest from '@/components/admin/cms/CMSConnectionTest';
import ContentfulTypeCreator from '@/components/admin/cms/ContentfulTypeCreator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const ContentfulManagement: React.FC = () => {
  return (
    <Layout>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contentful Management</h1>
            <p className="text-muted-foreground">
              Create and manage Contentful content types and entries
            </p>
          </div>
        </div>
        
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>About Content Type Management</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              This tool currently supports creating predefined content types in your Contentful space. 
              To modify existing content types, you'll need to:
            </p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Delete the existing content type from Contentful</li>
              <li>Create a new content type with the updated definition</li>
            </ol>
            <p className="mt-2">
              Note: Deleting a content type will also delete any entries of that type in Contentful.
              Make sure to back up your content before deleting content types.
            </p>
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="connection">
          <TabsList className="mb-8">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="content-types">Content Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection">
            <div className="grid gap-6">
              <CMSConnectionTest />
            </div>
          </TabsContent>
          
          <TabsContent value="content-types">
            <div className="grid gap-6">
              <ContentfulTypeCreator />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ContentfulManagement;
