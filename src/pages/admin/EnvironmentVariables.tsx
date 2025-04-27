
import React from 'react';
import Layout from '@/components/layout/Layout';
import EnvironmentVariableManager from '@/components/admin/cms/EnvironmentVariableManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EnvironmentVariables = () => {
  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Environment Variables</h1>
        
        <Tabs defaultValue="manage">
          <TabsList className="mb-6">
            <TabsTrigger value="manage">Manage Variables</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage">
            <EnvironmentVariableManager />
          </TabsContent>
          
          <TabsContent value="help">
            <div className="prose max-w-none">
              <h2>Environment Variables Help</h2>
              <p>
                To access Contentful in your Lovable preview environment, you need to set up the following environment variables:
              </p>
              
              <h3>Required Variables</h3>
              <ul>
                <li><strong>VITE_CONTENTFUL_SPACE_ID</strong> - Your Contentful space identifier</li>
                <li><strong>VITE_CONTENTFUL_DELIVERY_TOKEN</strong> - Your Content Delivery API token</li>
                <li><strong>VITE_CONTENTFUL_ENVIRONMENT_ID</strong> - Usually "master" unless you're using a custom environment</li>
              </ul>
              
              <h3>How This Works</h3>
              <p>
                The variables you set on this page are stored in your browser's local storage. 
                They will be available for your current browser session and will persist between page reloads.
                These variables are only used for the preview environment in Lovable.
              </p>
              
              <h3>For Production Deployment</h3>
              <p>
                When deploying to production, you'll need to set these same environment variables 
                in your hosting platform (e.g., Vercel, Netlify, etc.).
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EnvironmentVariables;
