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
  
  // New state variables for key names
  const [spaceIdKeyName, setSpaceIdKeyName] = useState('VITE_CONTENTFUL_SPACE_ID');
  const [deliveryTokenKeyName, setDeliveryTokenKeyName] = useState('VITE_CONTENTFUL_DELIVERY_TOKEN');
  const [environmentIdKeyName, setEnvironmentIdKeyName] = useState('VITE_CONTENTFUL_ENVIRONMENT_ID');
  
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
        
        // Set key names with VITE_ prefix
        setSpaceIdKeyName('VITE_CONTENTFUL_SPACE_ID');
        setDeliveryTokenKeyName('VITE_CONTENTFUL_DELIVERY_TOKEN');
        setEnvironmentIdKeyName('VITE_CONTENTFUL_ENVIRONMENT_ID');
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
      
      await refreshContentful();
      
      toast.success('Environment variables saved successfully!');
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

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="space-id-key">Space ID Variable Name</Label>
              <Input
                id="space-id-key"
                placeholder="e.g., VITE_CONTENTFUL_SPACE_ID"
                value={spaceIdKeyName}
                onChange={(e) => setSpaceIdKeyName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The environment variable name for the Space ID
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="space-id">Space ID Value</Label>
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="delivery-token-key">Delivery Token Variable Name</Label>
              <Input
                id="delivery-token-key"
                placeholder="e.g., VITE_CONTENTFUL_DELIVERY_TOKEN"
                value={deliveryTokenKeyName}
                onChange={(e) => setDeliveryTokenKeyName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The environment variable name for the Delivery Token
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery-token">Delivery Token Value</Label>
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="environment-id-key">Environment ID Variable Name</Label>
              <Input
                id="environment-id-key"
                placeholder="e.g., VITE_CONTENTFUL_ENVIRONMENT_ID"
                value={environmentIdKeyName}
                onChange={(e) => setEnvironmentIdKeyName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The environment variable name for the Environment ID
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="environment-id">Environment ID Value</Label>
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
          disabled={isSaving || !spaceId || !deliveryToken || !spaceIdKeyName || !deliveryTokenKeyName || !environmentIdKeyName}
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
