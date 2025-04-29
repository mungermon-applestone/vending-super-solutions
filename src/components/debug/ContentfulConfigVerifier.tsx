
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw, AlertTriangle, CheckCircle, Bug, ShieldAlert, Settings, Info } from 'lucide-react';
import { toast } from 'sonner';
import { CONTENTFUL_CONFIG, isContentfulConfigured, logContentfulConfig } from '@/config/cms';
import { refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { useNavigate } from 'react-router-dom';

const ContentfulConfigVerifier = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [activeTab, setActiveTab] = useState('config');
  const navigate = useNavigate();
  
  const isConfigured = isContentfulConfigured();
  const credentialSource = typeof window !== 'undefined' ? window._contentfulInitialized : undefined;
  
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
        HAS_DELIVERY_TOKEN: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
        WINDOW_ENV: typeof window !== 'undefined' ? window.env : undefined,
        CREDENTIAL_SOURCE: credentialSource
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
      
      // Reload the page to apply changes
      window.location.reload();
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
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <div>Credential Source: {credentialSource || 'Unknown'}</div>
                  <div>window.env: {typeof window !== 'undefined' && window.env ? '✅ Available' : '❌ Not set'}</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
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
                
                <Button 
                  variant="default"
                  onClick={() => navigate('/admin/environment-variables')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Environment Variables
                </Button>
              </div>
              
              {credentialSource === 'fallback-hardcoded' && (
                <Alert variant="default" className="mt-4 border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-700">Using Fallback Credentials</AlertTitle>
                  <AlertDescription className="text-blue-600">
                    Your application is currently using hardcoded fallback credentials for the Lovable preview environment.
                    These credentials are built into the app for preview purposes.
                  </AlertDescription>
                </Alert>
              )}
              
              {!isConfigured && (
                <Alert variant="warning" className="mt-4">
                  <AlertDescription>
                    <p className="mb-2">Contentful is not properly configured. Please set up your environment variables.</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/admin/environment-variables')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Go to Environment Variables Manager
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="debug">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                For Lovable preview environments, a fallback mechanism is in place if the /api/runtime-config endpoint doesn't work.
              </p>
              
              <Alert variant="warning" className="mt-3">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Important for Lovable Previews</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">Preview environments use a fallback mechanism with hardcoded credentials if runtime-config fails.</p>
                  <p className="text-xs text-muted-foreground">Credential source: {credentialSource || 'Unknown'}</p>
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/admin/environment-variables')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Open Environment Variables Manager
                    </Button>
                  </div>
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
                  VITE_CONTENTFUL_DELIVERY_TOKEN is set in the Environment Variables Manager.
                </li>
                <li>
                  <strong>Invalid Space ID:</strong> Verify that your Space ID is correct 
                  and accessible to your Delivery Token.
                </li>
                <li>
                  <strong>Environment Variables Not Loading:</strong> For Lovable previews,
                  a fallback mechanism with hardcoded credentials should ensure content loads.
                </li>
                <li>
                  <strong>Need to Refresh:</strong> Sometimes you may need to refresh the page
                  after changing environment variables.
                </li>
              </ul>
              
              <div className="mt-4">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/admin/environment-variables')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Go to Environment Variables Manager
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentfulConfigVerifier;
