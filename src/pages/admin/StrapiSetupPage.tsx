
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Save, Database, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { isStrapiConfigured, validateStrapiConfig } from '@/services/cms/utils/strapiConfig';
import { forceContentfulProvider } from '@/services/cms/cmsInit';

// Storage key for environment variables
const ENV_STORAGE_KEY = 'vending-cms-env-variables';

const StrapiSetupPage = () => {
  const [strapiUrl, setStrapiUrl] = useState('');
  const [strapiApiKey, setStrapiApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isConfigured, setIsConfigured] = useState(isStrapiConfigured());

  // Save Strapi configuration
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate inputs
      if (!strapiUrl) {
        toast.error("Strapi API URL is required");
        return;
      }

      const strapiConfig = {
        strapiUrl,
        strapiApiKey,
        // Add key names mapping for compatibility
        keyNames: {
          strapiUrl: 'VITE_STRAPI_API_URL',
          strapiApiKey: 'VITE_STRAPI_API_KEY'
        }
      };
      
      // Store in localStorage
      localStorage.setItem(ENV_STORAGE_KEY, JSON.stringify(strapiConfig));

      // Also add to window.env
      if (typeof window !== 'undefined') {
        if (!window.env) window.env = {};
        window.env.VITE_STRAPI_API_URL = strapiUrl;
        window.env.VITE_STRAPI_API_KEY = strapiApiKey;
      }

      setIsConfigured(true);
      toast.success("Strapi configuration saved successfully");
    } catch (error) {
      console.error("Error saving Strapi config:", error);
      toast.error("Failed to save Strapi configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const forceContentful = async () => {
    setIsSaving(true);
    try {
      await forceContentfulProvider();
      toast.success("Successfully forced Contentful provider");
    } catch (error) {
      console.error("Error forcing Contentful provider:", error);
      toast.error("Failed to force Contentful provider");
    } finally {
      setIsSaving(false);
    }
  };

  const testStrapiConnection = async () => {
    setIsSaving(true);
    try {
      validateStrapiConfig();
      toast.success("Strapi configuration is valid");
    } catch (error) {
      console.error("Strapi configuration error:", error);
      toast.error(error instanceof Error ? error.message : "Invalid Strapi configuration");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Strapi CMS Setup</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Strapi Configuration
              </CardTitle>
              <CardDescription>
                Configure your Strapi CMS connection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  These settings will be stored in your browser's local storage. For production deployment, 
                  you should set these environment variables in your hosting platform.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="strapi-url">Strapi API URL</Label>
                  <Input
                    id="strapi-url"
                    placeholder="e.g., https://your-strapi.com/api"
                    value={strapiUrl}
                    onChange={(e) => setStrapiUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    The base URL for your Strapi API
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="strapi-api-key">API Key</Label>
                  <Input
                    id="strapi-api-key"
                    type="password"
                    placeholder="Your Strapi API token"
                    value={strapiApiKey}
                    onChange={(e) => setStrapiApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your Strapi API key for authentication
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={testStrapiConnection} 
                  disabled={isSaving || !strapiUrl}
                >
                  {isSaving ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Test Connection
                </Button>
                <Button 
                  variant="outline" 
                  onClick={forceContentful} 
                  disabled={isSaving}
                >
                  Force Contentful
                </Button>
              </div>
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !strapiUrl}
              >
                {isSaving ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Configuration
              </Button>
            </CardFooter>
          </Card>
          
          {isConfigured && (
            <Alert variant="default" className="border-green-200 bg-green-50 text-green-800">
              <AlertTitle>Configuration Status</AlertTitle>
              <AlertDescription>
                <p>Strapi configuration appears to be valid.</p>
                <p className="mt-2">API URL: {strapiUrl}</p>
                <p>API Key: {strapiApiKey ? '••••••••••••••••••' : 'Not configured'}</p>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StrapiSetupPage;
