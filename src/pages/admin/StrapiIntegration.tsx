
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CMSConfigInfo from '@/components/admin/cms/CMSConfigInfo';
import { CMSProviderDisplay } from '@/components/admin/cms/CMSProviderDisplay';
import ContentSynchronization from '@/components/admin/cms/ContentSynchronization';
import CMSConnectionTest from '@/components/admin/cms/CMSConnectionTest';
import { getCMSInfo } from '@/services/cms/utils/cmsInfo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Database, RefreshCw, Server } from 'lucide-react';

const StrapiIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const cmsInfo = getCMSInfo();
  
  return (
    <Layout>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Strapi CMS Integration</h1>
            <p className="text-muted-foreground">
              Manage your Strapi CMS integration and content synchronization
            </p>
          </div>
        </div>
        
        {cmsInfo.provider !== 'Strapi' && (
          <Alert variant="warning" className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Strapi not active</AlertTitle>
            <AlertDescription className="text-yellow-700">
              You are currently using {cmsInfo.provider} as your CMS provider.
              Go to Settings to switch to Strapi CMS provider.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sync">Content Synchronization</TabsTrigger>
            <TabsTrigger value="settings">Connection Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Strapi Integration Overview
                    </CardTitle>
                    <CardDescription>
                      Connect your application with Strapi CMS to manage content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p>
                      Strapi is a headless CMS that gives developers the freedom to use their
                      favorite tools and frameworks while allowing editors to manage their content
                      via a user-friendly interface.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="p-4 bg-gray-50 rounded-md border">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Server className="h-4 w-4" />
                          Connection Status
                        </h3>
                        <CMSConnectionTest />
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-md border">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <RefreshCw className="h-4 w-4" />
                          Content Sync Status
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {cmsInfo.status === 'configured' 
                            ? 'Ready to synchronize content'
                            : 'Configure Strapi connection to enable synchronization'}
                        </p>
                        {cmsInfo.status === 'configured' ? (
                          <div className="text-sm text-green-600 font-medium">
                            ✓ Synchronization available
                          </div>
                        ) : (
                          <div className="text-sm text-yellow-600 font-medium">
                            ✗ Synchronization unavailable
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <CMSProviderDisplay />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sync">
            <ContentSynchronization />
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Connection Settings</CardTitle>
                <CardDescription>
                  Manage your connection to the Strapi CMS instance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CMSConfigInfo />
                <div className="mt-6">
                  <h3 className="font-medium mb-4">Environment Variables</h3>
                  <div className="bg-gray-50 p-4 rounded-md border font-mono text-sm">
                    <p className="mb-1">VITE_CMS_PROVIDER=strapi</p>
                    <p className="mb-1">VITE_STRAPI_API_URL=http://your-strapi-url/api</p>
                    <p>VITE_STRAPI_API_KEY=your-strapi-api-key</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Set these environment variables in your .env file to configure the Strapi connection.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StrapiIntegration;
