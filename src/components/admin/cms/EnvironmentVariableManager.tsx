
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw, Info, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { refreshContentfulClient, testContentfulConnection } from '@/services/cms/utils/contentfulClient';
import { isPreviewEnvironment } from '@/config/cms';

// Storage keys for environment variables
const ENV_STORAGE_KEY = 'vending-cms-env-variables';

export const EnvironmentVariableManager = () => {
  const [spaceId, setSpaceId] = useState('');
  const [deliveryToken, setDeliveryToken] = useState('');
  const [environmentId, setEnvironmentId] = useState('master');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [testSuccess, setTestSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('local');
  
  const isPreview = isPreviewEnvironment();

  // Load variables from local storage on component mount
  useEffect(() => {
    try {
      // First check window.env for values
      if (typeof window !== 'undefined' && window.env) {
        const spaceIdFromEnv = window.env.VITE_CONTENTFUL_SPACE_ID;
        const tokenFromEnv = window.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
        const envIdFromEnv = window.env.VITE_CONTENTFUL_ENVIRONMENT_ID;
        
        if (spaceIdFromEnv) setSpaceId(spaceIdFromEnv);
        if (tokenFromEnv) setDeliveryToken(tokenFromEnv);
        if (envIdFromEnv) setEnvironmentId(envIdFromEnv);
        
        console.log('[EnvironmentVariableManager] Loaded vars from window.env:', {
          hasSpaceId: !!spaceIdFromEnv,
          hasDeliveryToken: !!tokenFromEnv,
          envId: envIdFromEnv || 'master'
        });
      }
      
      // Then check localStorage as a fallback
      const storedVars = localStorage.getItem(ENV_STORAGE_KEY);
      console.log('[EnvironmentVariableManager] Checking localStorage:', { 
        hasStoredVars: !!storedVars,
        storageKey: ENV_STORAGE_KEY
      });
      
      if (storedVars) {
        const parsedVars = JSON.parse(storedVars);
        
        // Only update values that aren't already set from window.env
        if (!spaceId && parsedVars.spaceId) setSpaceId(parsedVars.spaceId);
        if (!deliveryToken && parsedVars.deliveryToken) setDeliveryToken(parsedVars.deliveryToken);
        if (!environmentId && parsedVars.environmentId) setEnvironmentId(parsedVars.environmentId);
        
        console.log('[EnvironmentVariableManager] Loaded vars from storage:', {
          hasSpaceId: !!parsedVars.spaceId,
          hasDeliveryToken: !!parsedVars.deliveryToken,
          envId: parsedVars.environmentId || 'master'
        });
      }
      setInitialLoad(false);
    } catch (error) {
      console.error('[EnvironmentVariableManager] Failed to load variables:', error);
      setInitialLoad(false);
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const envVars = {
        spaceId,
        deliveryToken,
        environmentId: environmentId || 'master',
        keyNames: {
          VITE_CONTENTFUL_SPACE_ID: 'spaceId',
          VITE_CONTENTFUL_DELIVERY_TOKEN: 'deliveryToken',
          VITE_CONTENTFUL_ENVIRONMENT_ID: 'environmentId'
        }
      };
      
      console.log('[EnvironmentVariableManager] Saving to localStorage:', { 
        storageKey: ENV_STORAGE_KEY,
        varsToSave: {
          hasSpaceId: !!spaceId,
          hasDeliveryToken: !!deliveryToken,
          environmentId: environmentId || 'master'
        }
      });
      
      localStorage.setItem(ENV_STORAGE_KEY, JSON.stringify(envVars));
      
      // Initialize window.env with the saved values
      if (typeof window !== 'undefined') {
        if (!window.env) window.env = {};
        window.env.VITE_CONTENTFUL_SPACE_ID = spaceId;
        window.env.VITE_CONTENTFUL_DELIVERY_TOKEN = deliveryToken;
        window.env.VITE_CONTENTFUL_ENVIRONMENT_ID = environmentId || 'master';
        
        // Also set legacy values
        window.env.spaceId = spaceId;
        window.env.deliveryToken = deliveryToken;
        window.env.environmentId = environmentId || 'master';
        
        console.log('[EnvironmentVariableManager] Updated window.env:', {
          hasSpaceId: !!window.env.VITE_CONTENTFUL_SPACE_ID,
          hasDeliveryToken: !!window.env.VITE_CONTENTFUL_DELIVERY_TOKEN
        });
      }
      
      await refreshContentful();
      
      // Test connection after saving
      const testResult = await testContentfulConnection();
      setTestSuccess(testResult.success);
      
      if (testResult.success) {
        toast.success('Contentful credentials saved and connection verified!');
      } else {
        toast.warning(`Credentials saved, but connection test failed: ${testResult.message}`);
      }
    } catch (error) {
      console.error('[EnvironmentVariableManager] Failed to save variables:', error);
      toast.error('Failed to save environment variables');
    } finally {
      setIsSaving(false);
    }
  };

  const refreshContentful = async () => {
    setIsRefreshing(true);
    try {
      await refreshContentfulClient();
      toast.success('Contentful client refreshed with new variables');
    } catch (error) {
      console.error('[EnvironmentVariableManager] Failed to refresh client', error);
      toast.error('Failed to refresh Contentful client');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Environment Variables Manager
        </CardTitle>
        <CardDescription>
          {isPreview 
            ? "Configure your Contentful environment variables for this preview environment" 
            : "Set your Contentful environment variables for local development"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPreview && (
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Preview Environment Detected</AlertTitle>
            <AlertDescription>
              <p>You're currently in a preview environment. For production deployments, you should:</p>
              <ol className="list-decimal ml-5 mt-2">
                <li>Add environment variables to your Lovable project settings</li>
                <li>Make sure your build process includes these variables</li>
                <li>The values set here will be stored in browser localStorage and only work for this browser session</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="local">Local Storage</TabsTrigger>
            <TabsTrigger value="runtime">Runtime Environment</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>
          
          <TabsContent value="local">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="space-id">Space ID</Label>
                <Input
                  id="space-id"
                  placeholder="e.g., abc123def456"
                  value={spaceId}
                  onChange={(e) => setSpaceId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Your Contentful space identifier
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery-token">Content Delivery API Token</Label>
                <Input
                  id="delivery-token"
                  type="password"
                  placeholder="Contentful Content Delivery API token"
                  value={deliveryToken}
                  onChange={(e) => setDeliveryToken(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  API token used to fetch content from Contentful
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="environment-id">Environment ID</Label>
                <Input
                  id="environment-id"
                  placeholder="e.g., master"
                  value={environmentId}
                  onChange={(e) => setEnvironmentId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Usually "master" unless you're using a custom environment
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="runtime">
            <div className="space-y-4">
              <Alert>
                <AlertTitle>Runtime Environment Information</AlertTitle>
                <AlertDescription>
                  <div className="space-y-2 mt-2">
                    <p><strong>window.env available:</strong> {typeof window !== 'undefined' && window.env ? "Yes" : "No"}</p>
                    
                    {typeof window !== 'undefined' && window.env && (
                      <>
                        <p><strong>Space ID:</strong> {window.env.VITE_CONTENTFUL_SPACE_ID || "Not set"}</p>
                        <p><strong>Environment ID:</strong> {window.env.VITE_CONTENTFUL_ENVIRONMENT_ID || "Not set"}</p>
                        <p><strong>Delivery Token:</strong> {window.env.VITE_CONTENTFUL_DELIVERY_TOKEN ? "Set" : "Not set"}</p>
                      </>
                    )}
                    
                    <p><strong>import.meta.env available:</strong> {import.meta.env ? "Yes" : "No"}</p>
                    <p><strong>Local Storage variables:</strong> {typeof window !== 'undefined' && localStorage.getItem(ENV_STORAGE_KEY) ? "Yes" : "No"}</p>
                    <p><strong>Preview Environment:</strong> {isPreview ? "Yes" : "No"}</p>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="help">
            <div className="prose max-w-none dark:prose-invert">
              <h3>Environment Variables Help</h3>
              
              <h4>Local Development</h4>
              <p>
                For local development, you can enter your Contentful credentials here and they will be stored in localStorage.
                This is convenient for development, but not secure for production environments.
              </p>
              
              <h4>Preview & Production Environments</h4>
              <p>
                For preview and production environments, you should set environment variables in your Lovable project settings:
              </p>
              <ul>
                <li><code>VITE_CONTENTFUL_SPACE_ID</code> - Your Contentful space ID</li>
                <li><code>VITE_CONTENTFUL_DELIVERY_TOKEN</code> - Your Contentful delivery token</li>
                <li><code>VITE_CONTENTFUL_ENVIRONMENT_ID</code> - Your Contentful environment (usually "master")</li>
              </ul>
              
              <h4>Troubleshooting</h4>
              <p>
                If you're having issues with Contentful connectivity:
              </p>
              <ol>
                <li>Check browser console for errors</li>
                <li>Ensure your Space ID and Delivery Token are correct</li>
                <li>Verify that your token has the correct permissions</li>
                <li>Try refreshing the client after making changes</li>
                <li>Clear browser cache and local storage if needed</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>

        {testSuccess && (
          <Alert variant="default" className="border-green-200 bg-green-50 text-green-800">
            <AlertTitle>Connection Verified</AlertTitle>
            <AlertDescription>
              Your Contentful connection is working properly. You can now view content in the app.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={refreshContentful} 
          disabled={isRefreshing || isSaving}
        >
          {isRefreshing ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh Client
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isSaving || !spaceId || !deliveryToken}
        >
          {isSaving ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Variables
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EnvironmentVariableManager;
