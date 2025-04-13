
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Loader2, RefreshCw, Server } from 'lucide-react';

const StrapiConnectionDebug: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  
  const [baseUrl, setBaseUrl] = useState<string>('https://strong-balance-0789566afc.strapiapp.com');
  const [apiSuffix, setApiSuffix] = useState<string>('/api');
  const [endpoint, setEndpoint] = useState<string>('/technology');
  
  const getFullUrl = () => {
    return `${baseUrl}${apiSuffix}${endpoint}`;
  };
  
  const testEndpoint = async (url: string) => {
    setIsLoading(true);
    
    try {
      console.log(`Testing endpoint: ${url}`);
      const response = await fetch(url);
      
      let data: any;
      let jsonValid = false;
      
      try {
        data = await response.json();
        jsonValid = true;
      } catch (e) {
        data = await response.text();
      }
      
      setTestResults({
        ...testResults,
        [url]: {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          data: data,
          jsonValid,
          headers: Object.fromEntries(response.headers.entries()),
          testedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      setTestResults({
        ...testResults,
        [url]: {
          error: true,
          message: error instanceof Error ? error.message : String(error),
          testedAt: new Date().toISOString()
        }
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Strapi Connection Debugger</h1>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Strapi URL Builder
              </CardTitle>
              <CardDescription>
                Test your Strapi URL to find the correct endpoint for your technology content type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic Test</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Test</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic">
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Testing your Strapi connection</AlertTitle>
                      <AlertDescription>
                        This will help you verify if your Strapi URL is correct and if the technology content type exists.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="baseUrl">Base URL</Label>
                        <Input 
                          id="baseUrl" 
                          value={baseUrl} 
                          onChange={(e) => setBaseUrl(e.target.value)}
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          The base URL of your Strapi instance (e.g., https://your-strapi-app.com)
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="apiSuffix">API Path</Label>
                          <Input 
                            id="apiSuffix" 
                            value={apiSuffix} 
                            onChange={(e) => setApiSuffix(e.target.value)}
                            className="font-mono text-sm"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Usually "/api" for Strapi v4
                          </p>
                        </div>
                        
                        <div>
                          <Label htmlFor="endpoint">Content Type Endpoint</Label>
                          <Input 
                            id="endpoint" 
                            value={endpoint} 
                            onChange={(e) => setEndpoint(e.target.value)}
                            className="font-mono text-sm"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Try "/technology" or "/technologies"
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-sm font-medium mb-1">Full URL to test:</p>
                        <div className="bg-gray-100 p-2 rounded border font-mono text-sm overflow-auto">
                          {getFullUrl()}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => testEndpoint(getFullUrl())}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Test Connection
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customUrl">Custom URL to test</Label>
                      <Input 
                        id="customUrl" 
                        placeholder="https://your-strapi-instance.com/api/path-to-test"
                        className="font-mono text-sm"
                      />
                    </div>
                    <Button
                      onClick={() => testEndpoint((document.getElementById('customUrl') as HTMLInputElement).value)}
                      disabled={isLoading}
                      variant="outline"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        'Test Custom URL'
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {Object.keys(testResults).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(testResults).map(([url, result]) => (
                  <div key={url} className="border rounded-md p-4">
                    <h3 className="font-medium text-sm mb-2 break-all">{url}</h3>
                    
                    {result.error ? (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Connection Error</AlertTitle>
                        <AlertDescription>{result.message}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {result.ok ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium">
                            Status: {result.status} {result.statusText}
                          </span>
                        </div>
                        
                        {result.jsonValid && result.data && (
                          <div>
                            <p className="text-sm font-medium mb-1">Response:</p>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-96">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </div>
                        )}
                        
                        {!result.jsonValid && (
                          <div>
                            <p className="text-sm font-medium mb-1">Response (non-JSON):</p>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                              {result.data}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      Tested at: {new Date(result.testedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setTestResults({})}
                  size="sm"
                >
                  Clear Results
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StrapiConnectionDebug;
