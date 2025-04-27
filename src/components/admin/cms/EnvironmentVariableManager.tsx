
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { refreshContentfulClient } from '@/services/cms/utils/contentfulClient';

// Storage keys for environment variables
const ENV_STORAGE_KEY = 'vending-cms-env-variables';

export const EnvironmentVariableManager = () => {
  const [spaceId, setSpaceId] = useState('');
  const [deliveryToken, setDeliveryToken] = useState('');
  const [environmentId, setEnvironmentId] = useState('master');
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Load variables from local storage on component mount
  useEffect(() => {
    try {
      const storedVars = localStorage.getItem(ENV_STORAGE_KEY);
      if (storedVars) {
        const parsedVars = JSON.parse(storedVars);
        setSpaceId(parsedVars.spaceId || '');
        setDeliveryToken(parsedVars.deliveryToken || '');
        setEnvironmentId(parsedVars.environmentId || 'master');
        
        // Set these values to window.env for access throughout the app
        if (parsedVars.spaceId) {
          window.env = window.env || {};
          window.env.VITE_CONTENTFUL_SPACE_ID = parsedVars.spaceId;
          window.env.VITE_CONTENTFUL_DELIVERY_TOKEN = parsedVars.deliveryToken;
          window.env.VITE_CONTENTFUL_ENVIRONMENT_ID = parsedVars.environmentId || 'master';
          
          console.log('Loaded environment variables from local storage', window.env);
        }
      }
      setInitialLoad(false);
    } catch (error) {
      console.error('Failed to load environment variables from storage', error);
      setInitialLoad(false);
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Store in local storage
      const envVars = { spaceId, deliveryToken, environmentId };
      localStorage.setItem(ENV_STORAGE_KEY, JSON.stringify(envVars));
      
      // Make variables available to the app
      window.env = window.env || {};
      window.env.VITE_CONTENTFUL_SPACE_ID = spaceId;
      window.env.VITE_CONTENTFUL_DELIVERY_TOKEN = deliveryToken;
      window.env.VITE_CONTENTFUL_ENVIRONMENT_ID = environmentId;
      
      // Force reload to apply the environment variables
      await refreshContentful();
      
      toast.success('Environment variables saved successfully!');
    } catch (error) {
      console.error('Failed to save environment variables', error);
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

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Environment Variables Manager
        </CardTitle>
        <CardDescription>
          Set your Contentful environment variables here for Lovable previews
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="mb-4">
          <AlertTitle>Important Information</AlertTitle>
          <AlertDescription>
            These variables will be stored in your browser's local storage and will only work for preview
            environments. When you deploy your app to production, you'll need to set these variables in
            your hosting platform (e.g., Vercel).
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="space-id">Space ID</Label>
          <Input
            id="space-id"
            placeholder="e.g., al01e4yh2wq4"
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
