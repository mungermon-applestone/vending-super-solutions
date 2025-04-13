import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { switchCMSProvider } from '@/services/cms/cmsInit';
import { ContentProviderType } from '@/services/cms/adapters/types';
import { getCMSInfo } from '@/services/cms/utils/cmsInfo';
import { testCMSConnection } from '@/services/cms/utils/connection';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { fetchTechnologies } from '@/services/cms/contentTypes/technologies';

const StrapiConfig: React.FC = () => {
  const { toast } = useToast();
  const cmsInfo = getCMSInfo();
  
  const [strapiUrl, setStrapiUrl] = useState<string>(cmsInfo.apiUrl || 'https://strong-balance-0789566afc.strapiapp.com/api');
  const [strapiApiKey, setStrapiApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any>(null);
  
  useEffect(() => {
    if (!strapiUrl && cmsInfo.apiUrl) {
      setStrapiUrl(cmsInfo.apiUrl);
    }
  }, [cmsInfo.apiUrl]);
  
  const handleSaveStrapiSettings = () => {
    setIsLoading(true);
    
    try {
      if (!strapiUrl.trim()) {
        throw new Error("Strapi API URL is required");
      }
      
      const success = switchCMSProvider({
        providerType: ContentProviderType.STRAPI,
        strapiApiUrl: strapiUrl.trim(),
        strapiApiKey: strapiApiKey || undefined
      });
      
      if (success) {
        toast({
          title: "Strapi settings updated",
          description: "Successfully configured Strapi CMS integration.",
        });
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error("Failed to update Strapi settings");
      }
    } catch (error) {
      console.error("Error saving Strapi settings:", error);
      toast({
        variant: "destructive",
        title: "Error saving settings",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTestConnection = async () => {
    if (!strapiUrl.trim()) {
      setErrorMessage("Please enter a valid Strapi API URL");
      setTestStatus('error');
      return;
    }
    
    setTestStatus('testing');
    setErrorMessage(null);
    
    try {
      console.log('Testing connection with URL:', strapiUrl);
      
      switchCMSProvider({
        providerType: ContentProviderType.STRAPI,
        strapiApiUrl: strapiUrl.trim(),
        strapiApiKey: strapiApiKey || undefined
      });
      
      const result = await testCMSConnection();
      console.log('Connection test result:', result);
      setTestResults(result);
      
      if (result.success) {
        try {
          console.log('Testing technology fetch...');
          const technologies = await fetchTechnologies({ limit: 5 });
          console.log(`Fetched ${technologies.length} technologies`);
          
          setTestStatus('success');
          
          setTestResults(prev => ({
            ...prev,
            technologies: technologies.map(t => ({ id: t.id, title: t.title }))
          }));
        } catch (fetchError) {
          console.error('Error fetching technologies:', fetchError);
          
          setTestStatus('success');
          setTestResults(prev => ({
            ...prev,
            warningMessage: `Connected successfully, but couldn't fetch technologies: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`,
            contentTypeAccessible: false
          }));
        }
      } else {
        setErrorMessage(result.message);
        setTestStatus('error');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      setTestStatus('error');
    }
  };
  
  return (
    <Layout>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Strapi CMS Configuration</h1>
            <p className="text-muted-foreground">
              Configure integration with your Strapi CMS
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/admin/strapi-debug'}>
            Troubleshoot Connection
          </Button>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Current CMS Status</CardTitle>
              <CardDescription>
                Information about your current CMS configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Provider</h3>
                    <p className="font-medium">{cmsInfo.provider}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <div className="flex items-center gap-2">
                      {cmsInfo.isConfigured ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                      )}
                      <p className="font-medium">
                        {cmsInfo.isConfigured ? 'Fully Configured' : 'Needs Configuration'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {cmsInfo.provider === 'Strapi' && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">API URL</h3>
                      <p className="font-mono text-sm">{cmsInfo.apiUrl || 'Not configured'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">API Key</h3>
                      <p>{cmsInfo.apiKeyConfigured ? '••••••••••••••••••' : 'Not configured'}</p>
                    </div>
                    
                    {cmsInfo.adminUrl && (
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open(cmsInfo.adminUrl, '_blank')}
                        >
                          Open Strapi Admin
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Configure Strapi Connection</CardTitle>
              <CardDescription>
                Enter your Strapi API details to connect to your CMS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="strapiUrl">Strapi API URL</Label>
                  <Input 
                    id="strapiUrl"
                    value={strapiUrl}
                    onChange={(e) => setStrapiUrl(e.target.value)}
                    placeholder="https://your-strapi-app.com/api"
                  />
                  <p className="text-xs text-muted-foreground">
                    The URL to your Strapi API with /api at the end
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="strapiApiKey">Strapi API Key</Label>
                  <Input 
                    id="strapiApiKey"
                    type="password"
                    value={strapiApiKey}
                    onChange={(e) => setStrapiApiKey(e.target.value)}
                    placeholder="Enter your Strapi API key"
                  />
                  <p className="text-xs text-muted-foreground">
                    Create this in your Strapi admin under Settings → API Tokens
                  </p>
                </div>
                
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
                  <Button 
                    onClick={handleTestConnection}
                    variant="outline"
                    disabled={!strapiUrl || testStatus === 'testing'}
                    className="flex-1"
                  >
                    {testStatus === 'testing' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Testing...
                      </>
                    ) : (
                      'Test Connection'
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleSaveStrapiSettings}
                    className="flex-1" 
                    disabled={!strapiUrl || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Saving...
                      </>
                    ) : (
                      'Save Configuration'
                    )}
                  </Button>
                </div>
                
                {testStatus === 'success' && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Connection successful!</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Successfully connected to Strapi CMS.
                      {testResults?.technologies?.length > 0 && (
                        <p className="mt-2">
                          Found {testResults.technologies.length} technologies in your Strapi CMS.
                        </p>
                      )}
                      {testResults?.warningMessage && (
                        <p className="mt-2 text-amber-700 font-medium">
                          Warning: {testResults.warningMessage}
                        </p>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                
                {testStatus === 'error' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Connection failed</AlertTitle>
                    <AlertDescription className="space-y-2">
                      <p>{errorMessage || 'Could not connect to Strapi CMS with the provided credentials.'}</p>
                      
                      {testResults && (
                        <div className="mt-2 text-sm">
                          <p><strong>Endpoint tried:</strong> {testResults?.details?.endpointTried || 'Unknown'}</p>
                          <p><strong>URL used:</strong> {testResults?.details?.endpoint || 'Unknown'}</p>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                
                {testResults && (
                  <div className="mt-4 border rounded-md p-4 bg-gray-50">
                    <h3 className="font-medium mb-2">Connection Details</h3>
                    <pre className="text-xs overflow-auto max-h-40 p-2 bg-white border rounded">
                      {JSON.stringify(testResults, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default StrapiConfig;
