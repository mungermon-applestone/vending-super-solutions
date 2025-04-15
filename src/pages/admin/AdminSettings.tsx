import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { switchCMSProvider } from '@/services/cms/cmsInit';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle2, RefreshCw, Settings } from 'lucide-react';
import { getCMSInfo } from '@/services/cms/utils/cmsInfo';
import CMSConnectionTest from '@/components/admin/cms/CMSConnectionTest';
import CMSProviderDisplay from '@/components/admin/cms/CMSProviderDisplay';
import { supabase } from '@/integrations/supabase/client';

const AdminSettings: React.FC = () => {
  const { toast } = useToast();
  const cmsInfo = getCMSInfo();
  
  const [activeTab, setActiveTab] = useState('general');
  
  const [cmsProvider, setCmsProvider] = useState<string>(cmsInfo.provider === 'Strapi' ? 'strapi' : 'supabase');
  const [strapiUrl, setStrapiUrl] = useState<string>(cmsInfo.apiUrl || '');
  const [strapiApiKey, setStrapiApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [spaceId, setSpaceId] = useState('');
  const [environmentId, setEnvironmentId] = useState('master');
  const [managementToken, setManagementToken] = useState('');
  const [deliveryToken, setDeliveryToken] = useState('');

  const handleSaveCmsSettings = () => {
    setIsLoading(true);
    
    try {
      const success = switchCMSProvider();
      
      if (success) {
        toast({
          title: "CMS settings updated",
          description: "Successfully switched to Supabase CMS provider.",
        });
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error("Failed to update CMS settings");
      }
    } catch (error) {
      console.error("Error saving CMS settings:", error);
      toast({
        variant: "destructive",
        title: "Error saving settings",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContentfulConfig = async () => {
    setIsLoading(true);

    try {
      // Validate inputs
      if (!spaceId || !managementToken) {
        throw new Error('Space ID and Management Token are required');
      }

      if (!deliveryToken) {
        throw new Error('Delivery Token is required for content retrieval');
      }

      // Insert or update Contentful configuration
      const { data, error } = await supabase
        .from('contentful_config')
        .upsert({
          space_id: spaceId,
          environment_id: environmentId || 'master',
          management_token: managementToken,
          delivery_token: deliveryToken
        })
        .select();

      if (error) throw error;

      toast({
        title: 'Contentful Configuration',
        description: 'Credentials saved successfully',
        variant: 'default'
      });

      // Clear sensitive inputs after saving
      setManagementToken('');
      setDeliveryToken('');
    } catch (error) {
      console.error('Error saving Contentful config:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save configuration',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your application settings
            </p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="cms">CMS Configuration</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your application's general settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>General settings content will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cms">
            <div className="grid gap-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        CMS Provider Configuration
                      </CardTitle>
                      <CardDescription>
                        Configure which CMS provider your application will use
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Alert className="mb-6">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                          Changing your CMS provider will affect how content is retrieved and managed.
                          Make sure you have set up the corresponding environment variables in your .env file.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-6">
                        <div>
                          <Label>CMS Provider</Label>
                          <div className="flex items-center gap-4 mt-2">
                            <button
                              type="button"
                              onClick={() => setCmsProvider('supabase')}
                              className={`p-4 border rounded-md flex flex-col items-center gap-2 w-40 ${
                                cmsProvider === 'supabase' 
                                  ? 'border-primary bg-primary/5' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                DB
                              </div>
                              <span className="font-medium">Supabase</span>
                              {cmsProvider === 'supabase' && (
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              )}
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => setCmsProvider('strapi')}
                              className={`p-4 border rounded-md flex flex-col items-center gap-2 w-40 ${
                                cmsProvider === 'strapi' 
                                  ? 'border-primary bg-primary/5' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                ST
                              </div>
                              <span className="font-medium">Strapi</span>
                              {cmsProvider === 'strapi' && (
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {cmsProvider === 'strapi' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="strapiUrl">Strapi API URL</Label>
                              <Input 
                                id="strapiUrl"
                                placeholder="http://localhost:1337/api"
                                value={strapiUrl}
                                onChange={(e) => setStrapiUrl(e.target.value)}
                              />
                              <p className="text-sm text-muted-foreground">
                                The base URL of your Strapi API (e.g., http://localhost:1337/api)
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="strapiApiKey">Strapi API Key (Optional)</Label>
                              <Input 
                                id="strapiApiKey"
                                type="password"
                                placeholder="Your Strapi API key"
                                value={strapiApiKey}
                                onChange={(e) => setStrapiApiKey(e.target.value)}
                              />
                              <p className="text-sm text-muted-foreground">
                                The API key to authenticate with Strapi
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-4">
                          <Button 
                            onClick={handleSaveCmsSettings} 
                            disabled={isLoading || (cmsProvider === 'strapi' && !strapiUrl)}
                          >
                            {isLoading ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 
                                Saving...
                              </>
                            ) : (
                              'Save CMS Settings'
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <CMSProviderDisplay />
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Connection Test</CardTitle>
                  <CardDescription>
                    Test the connection to your CMS provider
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CMSConnectionTest />
                </CardContent>
              </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Contentful Configuration</CardTitle>
                        <CardDescription>
                            Enter your Contentful API credentials
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="spaceId" className="block text-sm font-medium">
                                        Space ID
                                    </label>
                                    <Input
                                        id="spaceId"
                                        value={spaceId}
                                        onChange={(e) => setSpaceId(e.target.value)}
                                        placeholder="Your Contentful Space ID"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="environmentId" className="block text-sm font-medium">
                                        Environment ID (Optional)
                                    </label>
                                    <Input
                                        id="environmentId"
                                        value={environmentId}
                                        onChange={(e) => setEnvironmentId(e.target.value)}
                                        placeholder="master"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="managementToken" className="block text-sm font-medium">
                                    Management Token (CMA)
                                </label>
                                <Input
                                    id="managementToken"
                                    type="password"
                                    value={managementToken}
                                    onChange={(e) => setManagementToken(e.target.value)}
                                    placeholder="Your Contentful Management API Token (CFPAT-...)"
                                />
                                <p className="text-xs text-muted-foreground">Used for content management operations</p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="deliveryToken" className="block text-sm font-medium">
                                    Delivery Token (CDA)
                                </label>
                                <Input
                                    id="deliveryToken"
                                    type="password"
                                    value={deliveryToken}
                                    onChange={(e) => setDeliveryToken(e.target.value)}
                                    placeholder="Your Contentful Content Delivery API Token"
                                />
                                <p className="text-xs text-muted-foreground">Required for retrieving content on the frontend</p>
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={handleSaveContentfulConfig}
                                    disabled={isLoading || !spaceId || !managementToken || !deliveryToken}
                                    className="w-full"
                                >
                                    {isLoading ? (
                                        <>
                                            <CheckCircle2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Contentful Configuration'
                                    )}
                                </Button>
                            </div>

                            <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                <p>You need both the Management (CMA) and Delivery (CDA) tokens for full functionality.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage API keys for third-party services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>API keys management will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminSettings;
