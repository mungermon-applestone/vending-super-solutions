import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle2, RefreshCw, Settings, Mail } from 'lucide-react';
import { getCMSInfo } from '@/services/cms/utils/cmsInfo';
import CMSConnectionTest from '@/components/admin/cms/CMSConnectionTest';
import CMSProviderDisplay from '@/components/admin/cms/CMSProviderDisplay';
import { supabase } from '@/integrations/supabase/client';
import { resetContentfulClient } from '@/services/cms/utils/contentfulClient';
import EmailServiceTester from '@/components/admin/email/EmailServiceTester';
import { emailConfig, getEmailEnvironment } from '@/services/email/emailConfig';
import { getSendGridConfigStatus } from '@/services/email/sendGridService';

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
  const [configId, setConfigId] = useState<string | null>(null);
  
  // Email configuration state
  const emailEnv = getEmailEnvironment();
  const emailConfigStatus = getSendGridConfigStatus();

  useEffect(() => {
    fetchContentfulConfig();
  }, []);

  const fetchContentfulConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('contentful_config')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[AdminSettings] Error fetching Contentful config:', error);
        return;
      }

      if (data) {
        console.log('[AdminSettings] Found existing Contentful config:', {
          id: data.id,
          spaceId: data.space_id,
          environmentId: data.environment_id,
          hasManagementToken: !!data.management_token,
          hasDeliveryToken: !!data.delivery_token
        });
        
        setConfigId(data.id);
        setSpaceId(data.space_id || '');
        setEnvironmentId(data.environment_id || 'master');
      }
    } catch (err) {
      console.error('[AdminSettings] Unexpected error fetching config:', err);
    }
  };

  const handleSaveCmsSettings = () => {
    setIsLoading(true);
    
    try {
      toast({
        title: "CMS settings updated",
        description: "Successfully updated CMS settings.",
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
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
      if (!spaceId) {
        throw new Error('Space ID is required');
      }

      // Check if at least one token is provided
      if (!managementToken && !deliveryToken) {
        throw new Error('At least one token (Management or Delivery) must be provided');
      }
      
      // If delivery token is not provided, show a strong warning
      if (!deliveryToken) {
        toast({
          title: 'Warning',
          description: 'Delivery Token is required for content retrieval. Without it, your application may not display content properly.',
          variant: 'destructive'
        });
        return;
      }

      console.log(`[AdminSettings] ${configId ? 'Updating' : 'Creating new'} Contentful configuration`);

      // Prepare the data object with the fields that should be updated
      let configData: Record<string, any> = {
        space_id: spaceId,
        environment_id: environmentId || 'master',
      };
      
      // Only update tokens that were provided (to avoid wiping out existing tokens)
      if (managementToken) {
        configData.management_token = managementToken;
      }
      
      if (deliveryToken) {
        configData.delivery_token = deliveryToken;
      }

      // If we have a configId, use it for the upsert
      if (configId) {
        configData.id = configId;
      }

      // Insert or update Contentful configuration
      const { data, error } = await supabase
        .from('contentful_config')
        .upsert(configData)
        .select();

      if (error) {
        console.error('[AdminSettings] Error saving Contentful config:', error);
        throw error;
      }

      console.log('[AdminSettings] Contentful config saved successfully:', {
        configId: data?.[0]?.id,
        saved: !!data?.[0],
        fields: Object.keys(configData).filter(k => k !== 'management_token' && k !== 'delivery_token')
      });

      // Update the configId with the saved record ID
      if (data && data.length > 0) {
        setConfigId(data[0].id);
      }

      toast({
        title: 'Contentful Configuration',
        description: 'Credentials saved successfully',
        variant: 'default'
      });

      // Clear sensitive inputs after saving
      setManagementToken('');
      setDeliveryToken('');
      
      // Reset the client to use the new credentials
      resetContentfulClient();
      
      // Try to refresh the client
      try {
        await fetch('/api/refresh-cms-client', { method: 'POST' }).catch(() => {
          // This endpoint might not exist, just suppress errors
        });
      } catch (e) {
        console.log('No refresh client endpoint available:', e);
      }
    } catch (error) {
      console.error('[AdminSettings] Error saving Contentful config:', error);
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
            <TabsTrigger value="email">Email</TabsTrigger>
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
                            {configId && (
                                <Alert className="bg-blue-50 border-blue-200">
                                    <AlertTitle className="text-blue-800">Configuration Found</AlertTitle>
                                    <AlertDescription className="text-blue-700">
                                        Existing Contentful configuration detected. Updating your tokens will overwrite the previous configuration.
                                    </AlertDescription>
                                </Alert>
                            )}
                            
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
                                    Delivery Token (CDA) <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="deliveryToken"
                                    type="password"
                                    value={deliveryToken}
                                    onChange={(e) => setDeliveryToken(e.target.value)}
                                    placeholder="Your Contentful Content Delivery API Token"
                                    className="border-red-200 focus:ring-red-500" 
                                />
                                <p className="text-xs text-red-600 font-medium">Required for retrieving content on the frontend</p>
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={handleSaveContentfulConfig}
                                    disabled={isLoading || !spaceId || (!managementToken && !deliveryToken)}
                                    className="w-full"
                                >
                                    {isLoading ? (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
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
          
          <TabsContent value="email">
            <div className="grid gap-6">
              {/* Email Configuration Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Configuration
                  </CardTitle>
                  <CardDescription>
                    Current email configuration status and settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-md font-semibold mb-2">Provider Settings</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Provider:</span>
                            <span className="font-medium">{emailConfig.provider}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Environment:</span>
                            <span className="font-medium">{emailEnv.isDevelopment ? 'Development' : 'Production'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Log Emails:</span>
                            <span className="font-medium">{emailEnv.logEmails ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-md font-semibold mb-2">Email Addresses</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">From:</span>
                            <span className="font-medium">{emailEnv.senderEmail}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">To:</span>
                            <span className="font-medium">{emailEnv.recipientEmail}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Configuration Status */}
                    {emailConfig.provider === 'SENDGRID' && (
                      <Alert variant={emailConfigStatus.isConfigured ? "default" : "destructive"}>
                        {emailConfigStatus.isConfigured ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                        <AlertTitle>
                          SendGrid {emailConfigStatus.isConfigured ? 'is properly configured' : 'is not fully configured'}
                        </AlertTitle>
                        <AlertDescription>
                          {emailConfigStatus.isConfigured ? (
                            <p>All required environment variables are set.</p>
                          ) : (
                            <>
                              <p>Missing environment variables:</p>
                              <ul className="list-disc list-inside mt-2">
                                {emailConfigStatus.missingEnvVars.map(envVar => (
                                  <li key={envVar}>{envVar}</li>
                                ))}
                              </ul>
                              <p className="mt-2">
                                Set these environment variables in your project's environment settings.
                              </p>
                            </>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {/* Environment Variables Info */}
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Environment Configuration</AlertTitle>
                      <AlertDescription>
                        <p className="mb-2">Email functionality requires the following environment variables:</p>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <pre className="text-sm whitespace-pre-wrap">
                            <code>
                              SENDGRID_API_KEY=your_sendgrid_api_key{"\n"}
                              EMAIL_TO=recipient@example.com{"\n"}
                              EMAIL_FROM=sender@example.com
                            </code>
                          </pre>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
              
              {/* Email Service Tester */}
              <EmailServiceTester />
              
              {/* Documentation */}
              <Card>
                <CardHeader>
                  <CardTitle>Email Implementation Documentation</CardTitle>
                  <CardDescription>
                    How to configure and use email services in your application
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <h2>Email Configuration Guide</h2>
                  <p>
                    The application uses a flexible email system with support for SendGrid integration.
                    To set up email functionality, follow these steps:
                  </p>
                  
                  <h3>Step 1: Set Environment Variables</h3>
                  <p>Add the following environment variables to your deployment platform:</p>
                  <ul>
                    <li><strong>SENDGRID_API_KEY</strong>: Your SendGrid API key</li>
                    <li><strong>EMAIL_TO</strong>: Recipient email address (where form submissions will be sent)</li>
                    <li><strong>EMAIL_FROM</strong>: Sender email address (must be verified in SendGrid)</li>
                  </ul>
                  
                  <h3>Step 2: Verify Your Sender Email</h3>
                  <p>
                    Make sure to verify your sender email address in SendGrid to avoid delivery issues.
                    This is a requirement from SendGrid to prevent spam.
                  </p>
                  
                  <h3>Development vs Production</h3>
                  <p>
                    In development mode, emails are logged to the console instead of being sent.
                    This behavior can be configured in <code>src/services/email/emailConfig.ts</code>.
                  </p>
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
