
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Save } from 'lucide-react';
import { toast } from 'sonner';
import { refreshContentfulClient, testContentfulConnection } from '@/services/cms/utils/contentfulClient';
import { useNavigate } from 'react-router-dom';
import ContentfulDebug from '@/components/debug/ContentfulDebug';

const ENV_STORAGE_KEY = 'vending-cms-env-variables';

const ContentfulConfigurationPage = () => {
  const [spaceId, setSpaceId] = useState('');
  const [deliveryToken, setDeliveryToken] = useState('');
  const [environmentId, setEnvironmentId] = useState('master');
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedVars = localStorage.getItem(ENV_STORAGE_KEY);
      if (storedVars) {
        const parsedVars = JSON.parse(storedVars);
        setSpaceId(parsedVars.spaceId || '');
        setDeliveryToken(parsedVars.deliveryToken || '');
        setEnvironmentId(parsedVars.environmentId || 'master');
      }
    } catch (error) {
      console.error('Failed to load variables:', error);
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const envVars = {
        spaceId,
        deliveryToken,
        environmentId,
        keyNames: {
          spaceId: 'VITE_CONTENTFUL_SPACE_ID',
          deliveryToken: 'VITE_CONTENTFUL_DELIVERY_TOKEN',
          environmentId: 'VITE_CONTENTFUL_ENVIRONMENT_ID'
        }
      };
      
      localStorage.setItem(ENV_STORAGE_KEY, JSON.stringify(envVars));
      
      // Initialize window.env with the saved values
      if (!window.env) window.env = {};
      window.env.VITE_CONTENTFUL_SPACE_ID = spaceId;
      window.env.VITE_CONTENTFUL_DELIVERY_TOKEN = deliveryToken;
      window.env.VITE_CONTENTFUL_ENVIRONMENT_ID = environmentId;
      
      // Also set legacy values
      window.env.spaceId = spaceId;
      window.env.deliveryToken = deliveryToken;
      window.env.environmentId = environmentId;
      
      toast.success('Environment variables saved successfully!');
    } catch (error) {
      console.error('Failed to save variables:', error);
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
      console.error('Failed to refresh client', error);
      toast.error('Failed to refresh Contentful client');
    } finally {
      setIsRefreshing(false);
    }
  };

  const testConnection = async () => {
    setIsRefreshing(true);
    try {
      const result = await testContentfulConnection();
      setTestResult(result);
      
      if (result.success) {
        toast.success("Contentful connection successful!");
      } else {
        toast.error("Contentful connection failed");
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        error
      });
      toast.error("Error testing connection");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Contentful Configuration</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>
                  Set your Contentful environment variables for the editor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    These variables are stored in your browser's local storage and will be used by the editor
                    to connect to your Contentful space.
                  </AlertDescription>
                </Alert>
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
                    <Label htmlFor="delivery-token">Delivery Token</Label>
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
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={testConnection}
                    disabled={isRefreshing || isSaving || !spaceId || !deliveryToken}
                  >
                    {isRefreshing ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Test Connection
                  </Button>
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
                </div>
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
            
            {testResult && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Connection Test Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert variant={testResult.success ? "default" : "destructive"}>
                    <AlertTitle>Status: {testResult.success ? "Success" : "Failed"}</AlertTitle>
                    <AlertDescription>
                      {testResult.message}
                      
                      {testResult.details && (
                        <div className="mt-2 p-2 bg-black/5 rounded overflow-auto max-h-40">
                          <pre className="text-xs">{JSON.stringify(testResult.details, null, 2)}</pre>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <ContentfulDebug />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContentfulConfigurationPage;
