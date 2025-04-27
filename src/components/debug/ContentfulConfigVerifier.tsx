
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw, AlertTriangle, CheckCircle, Bug, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { CONTENTFUL_CONFIG, isContentfulConfigured, logContentfulConfig } from '@/config/cms';
import { refreshContentfulClient } from '@/services/cms/utils/contentfulClient';

const ContentfulConfigVerifier = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [activeTab, setActiveTab] = useState('config');
  
  const isConfigured = isContentfulConfigured();
  
  const handleCheckConfig = () => {
    setIsChecking(true);
    
    try {
      logContentfulConfig();
      
      // Log detailed environment variable info
      console.log('Environment Variables Check:', {
        VITE_CONTENTFUL_SPACE_ID_EXISTS: !!import.meta.env.VITE_CONTENTFUL_SPACE_ID,
        CONTENTFUL_SPACE_ID_EXISTS: !!import.meta.env.CONTENTFUL_SPACE_ID,
        VITE_CONTENTFUL_DELIVERY_TOKEN_EXISTS: !!import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
        CONTENTFUL_DELIVERY_TOKEN_EXISTS: !!import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
        SPACE_ID: CONTENTFUL_CONFIG.SPACE_ID,
        ENVIRONMENT_ID: CONTENTFUL_CONFIG.ENVIRONMENT_ID,
        HAS_DELIVERY_TOKEN: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN
      });
      
      toast.info('Contentful config check complete. Check browser console for details.');
    } catch (error) {
      console.error('Error checking config:', error);
      toast.error('Error checking configuration');
    } finally {
      setIsChecking(false);
    }
  };
  
  const handleRefreshClient = async () => {
    setIsChecking(true);
    
    try {
      toast.info('Refreshing Contentful client...');
      await refreshContentfulClient();
      toast.success('Contentful client refreshed');
    } catch (error) {
      console.error('Error refreshing client:', error);
      toast.error('Failed to refresh client');
    } finally {
      setIsChecking(false);
    }
  };
  
  return (
    <Card className="mt-4 mb-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Contentful Configuration Verifier
        </CardTitle>
        <CardDescription>
          Troubleshoot Contentful connection issues and verify your environment variables
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="debug">Debug Info</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config">
            <div className="space-y-4">
              <Alert variant={isConfigured ? "default" : "destructive"}>
                <AlertTitle className="flex items-center gap-2">
                  {isConfigured ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  Configuration Status
                </AlertTitle>
                <AlertDescription>
                  {isConfigured 
                    ? "Contentful appears to be configured correctly based on environment variables." 
                    : "Contentful configuration is incomplete. Missing required environment variables."}
                </AlertDescription>
              </Alert>
              
              <div className="bg-muted p-3 rounded text-sm font-mono">
                <div>SPACE_ID: {CONTENTFUL_CONFIG.SPACE_ID || '❌ Not set'}</div>
                <div>ENVIRONMENT_ID: {CONTENTFUL_CONFIG.ENVIRONMENT_ID || '❌ Not set'}</div>
                <div>DELIVERY_TOKEN: {CONTENTFUL_CONFIG.DELIVERY_TOKEN ? '✅ Set' : '❌ Not set'}</div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="secondary" 
                  onClick={handleCheckConfig}
                  disabled={isChecking}
                >
                  {isChecking ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Bug className="mr-2 h-4 w-4" />
                  )}
                  Check Configuration
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleRefreshClient}
                  disabled={isChecking}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
                  Refresh Client
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="debug">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                For Lovable preview environments, environment variables need to be set directly in the Lovable environment.
                They will not be automatically read from Vercel or other hosting platforms.
              </p>
              
              <Alert variant="warning" className="mt-3">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Important for Lovable Previews</AlertTitle>
                <AlertDescription>
                  You must add your environment variables in the Lovable project settings for previews to work.
                  Variables should be named exactly as: VITE_CONTENTFUL_SPACE_ID, VITE_CONTENTFUL_ENVIRONMENT_ID, and VITE_CONTENTFUL_DELIVERY_TOKEN.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="help">
            <div className="space-y-3">
              <h3 className="font-medium">Common Issues:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Missing Delivery Token:</strong> Make sure your 
                  VITE_CONTENTFUL_DELIVERY_TOKEN is set in the environment variables.
                </li>
                <li>
                  <strong>Invalid Space ID:</strong> Verify that your Space ID is correct 
                  and accessible to your Delivery Token.
                </li>
                <li>
                  <strong>Environment Variables Not Loading:</strong> For Lovable previews,
                  environment variables must be set directly in the Lovable project settings.
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentfulConfigVerifier;
