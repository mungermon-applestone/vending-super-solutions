
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CMSConnectionTest from '@/components/admin/cms/CMSConnectionTest';
import ContentfulTypeCreator from '@/components/admin/cms/ContentfulTypeCreator';

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
