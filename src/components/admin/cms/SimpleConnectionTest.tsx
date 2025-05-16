
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const testStrapiConnectionWithUrl = async (customUrl: string, endpoint: string = '') => {
  try {
    let baseUrl = customUrl.trim();
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }
    
    const hasApiSuffix = baseUrl.endsWith('/api');
    if (hasApiSuffix) {
      baseUrl = baseUrl.slice(0, -4);
    }
    
    let urlToTest = baseUrl;
    
    if (endpoint) {
      const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const apiPath = hasApiSuffix || urlToTest.includes('/api/') ? '' : '/api';
      urlToTest = `${baseUrl}${apiPath}${formattedEndpoint}`;
    }
    
    console.log(`Testing connection to: ${urlToTest}`);
    
    const response = await fetch(urlToTest);
    console.log(`Response from ${urlToTest}:`, response.status, response.statusText);
    
    if (response.ok) {
      try {
        const data = await response.json();
        console.log('Received JSON data:', data);
        return {
          success: true,
          message: `Successfully connected to Strapi API at ${urlToTest}`,
          data: data,
          testedUrl: urlToTest
        };
      } catch (parseError) {
        console.log(`Response not JSON from ${urlToTest}:`, parseError);
        const text = await response.text();
        if (text.includes('<!DOCTYPE html>')) {
          console.log('Received HTML response, likely admin UI');
          return {
            success: true,
            message: `Connected to Strapi at ${urlToTest} but received HTML (likely admin UI)`,
            testedUrl: urlToTest,
            details: { 
              info: 'Received HTML response - this might be the Strapi admin interface',
              status: response.status
            }
          };
        }
      }
    }
    
    return {
      success: false,
      message: `Failed to connect: Server returned ${response.status} ${response.statusText || ''}`,
      details: { 
        status: response.status,
        statusText: response.statusText,
        url: urlToTest
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Error testing connection: ${error instanceof Error ? error.message : String(error)}`,
      details: { error: String(error) }
    };
  }
};

const testStrapiEnvironment = async (baseUrl: string) => {
  let results = {
    success: false,
    message: "Failed to connect: All connection attempts failed",
    details: {
      attemptedEndpoints: [] as string[],
      successfulEndpoint: null as string | null,
      adminAccessible: false,
      apiAccessible: false,
      contentTypesAccessible: false
    }
  };
  
  let normalizedUrl = baseUrl.trim();
  if (normalizedUrl.endsWith('/')) {
    normalizedUrl = normalizedUrl.slice(0, -1);
  }
  
  const endpoints = [
    '/admin', 
    '/admin/init',
    '/api/technology',
    '/api/technologies',
    '/api',
    '' // Base URL
  ];
  
  for (const endpoint of endpoints) {
    try {
      const url = `${normalizedUrl}${endpoint}`;
      results.details.attemptedEndpoints.push(url);
      
      const response = await fetch(url);
      console.log(`Testing ${url}: ${response.status}`);
      
      if (response.ok) {
        if (endpoint.includes('/admin')) {
          results.details.adminAccessible = true;
          results.success = true;
          results.message = `Found Strapi admin interface at ${url}`;
          results.details.successfulEndpoint = url;
          break;
        } 
        else if (endpoint.includes('/api')) {
          results.details.apiAccessible = true;
          
          try {
            const data = await response.json();
            if (data) {
              results.success = true;
              results.message = `Successfully connected to Strapi API at ${url}`;
              results.details.successfulEndpoint = url;
              
              if (endpoint.includes('technology') || endpoint.includes('technologies')) {
                results.details.contentTypesAccessible = true;
              }
              
              break;
            }
          } catch (e) {
          }
        }
        else {
          try {
            const text = await response.text();
            if (text.includes('strapi') || text.includes('Strapi')) {
              results.details.adminAccessible = true;
              results.success = true;
              results.message = `Found Strapi at ${url}`;
              results.details.successfulEndpoint = url;
              break;
            }
          } catch (e) {
          }
        }
      }
    } catch (error) {
      console.log(`Error testing endpoint: ${error}`);
    }
  }
  
  return results;
};

const SimpleConnectionTest: React.FC = () => {
  const [activeTab, setActiveTab] = useState("default");
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
    details?: any;
  }>({ status: 'idle' });
  
  const defaultUrl = 'https://strong-balance-0789566afc.strapiapp.com';
  
  const [customUrl, setCustomUrl] = useState<string>(defaultUrl);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/admin');
  
  const commonEndpoints = [
    { value: '/admin', label: '/admin (Admin Interface)' },
    { value: '/admin/init', label: '/admin/init (Admin Check)' },
    { value: '/api/technology', label: '/api/technology (Singular)' },
    { value: '/api/technologies', label: '/api/technologies (Plural)' },
    { value: '/api', label: '/api (API Root)' }
  ];
  
  const handleTestConnection = async () => {
    setTestResult({ status: 'loading' });
    
    try {
      let baseUrlToTest = customUrl;
      let endpointToTest = selectedEndpoint;
      
      const result = await testStrapiConnectionWithUrl(baseUrlToTest, endpointToTest);
      
      if (result.success) {
        setTestResult({ 
          status: 'success', 
          message: result.message,
          details: result
        });
      } else {
        const envTest = await testStrapiEnvironment(baseUrlToTest);
        
        if (envTest.success) {
          setTestResult({
            status: 'success',
            message: envTest.message,
            details: envTest
          });
        } else {
          setTestResult({ 
            status: 'error', 
            message: result.message,
            details: {
              ...result.details,
              environmentTest: envTest
            }
          });
        }
      }
    } catch (error) {
      setTestResult({ 
        status: 'error', 
        message: `Error testing connection: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  };
  
  const getAdminUrl = () => {
    let adminUrl = customUrl.trim();
    if (adminUrl.endsWith('/')) {
      adminUrl = adminUrl.slice(0, -1);
    }
    
    if (!adminUrl.endsWith('/admin')) {
      adminUrl = `${adminUrl}/admin`;
    }
    
    return adminUrl;
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="default">Working URL</TabsTrigger>
          <TabsTrigger value="custom">Custom URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="default" className="pt-2">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex-grow">
                <Input 
                  value={defaultUrl} 
                  readOnly 
                  className="bg-muted"
                />
              </div>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => {
                  setCustomUrl(defaultUrl);
                  handleTestConnection();
                }}
              >
                Test
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Select Test Endpoint</Label>
              <Select 
                value={selectedEndpoint} 
                onValueChange={setSelectedEndpoint}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an endpoint" />
                </SelectTrigger>
                <SelectContent>
                  {commonEndpoints.map((endpoint) => (
                    <SelectItem key={endpoint.value} value={endpoint.value}>
                      {endpoint.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select an endpoint to test with the base URL
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="pt-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="strapiUrl">Test with a different Strapi URL:</Label>
              <Input 
                id="strapiUrl"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://your-strapi-instance.com"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Make sure this points to your Strapi instance base URL
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Test Endpoint</Label>
              <Select 
                value={selectedEndpoint} 
                onValueChange={setSelectedEndpoint}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an endpoint" />
                </SelectTrigger>
                <SelectContent>
                  {commonEndpoints.map((endpoint) => (
                    <SelectItem key={endpoint.value} value={endpoint.value}>
                      {endpoint.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleTestConnection}
          disabled={testResult.status === 'loading'}
          className="flex-1"
        >
          {testResult.status === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-3 w-3" />
              Test Connection
            </>
          )}
        </Button>
        
        {testResult.status === 'success' && testResult.details?.testedUrl?.includes('/admin') && (
          <Button 
            variant="default" 
            size="sm"
            className="flex-1"
            onClick={() => window.open(getAdminUrl(), '_blank')}
          >
            <ExternalLink className="mr-2 h-3 w-3" />
            Open Admin Panel
          </Button>
        )}
      </div>
      
      <div className="h-px bg-border my-2" />
      
      <div className="text-xs text-muted-foreground">
        Test URL: <span className="font-mono">{customUrl}{selectedEndpoint}</span>
      </div>
      
      {testResult.status === 'success' && (
        <div className="mt-2 text-xs text-green-600 flex items-center">
          <CheckCircle className="mr-1 h-3 w-3" />
          {testResult.message}
        </div>
      )}
      
      {testResult.status === 'error' && (
        <div className="mt-2 text-xs text-red-600 flex items-center">
          <AlertCircle className="mr-1 h-3 w-3" />
          {testResult.message}
        </div>
      )}
      
      {(testResult.status === 'success' || testResult.status === 'error') && testResult.details && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details">
            <AccordionTrigger className="text-xs font-medium">
              Response Details
            </AccordionTrigger>
            <AccordionContent>
              <pre className="text-xs overflow-auto max-h-40 p-2 bg-muted border rounded">
                {JSON.stringify(testResult.details, null, 2)}
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      
      {testResult.status === 'success' && testResult.details?.testedUrl?.includes('/admin') && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Content Type Builder & Transfer Limitations</h4>
          <p className="text-xs text-blue-700 mb-2">
            The Technology content type is missing from your Strapi cloud instance. Strapi Cloud restricts both access to the Content-Type Builder and data transfer features in production environments.
          </p>
          <div className="space-y-2 text-xs text-blue-700">
            <p className="font-medium">Error: "Data transfer is not enabled on the remote host"</p>
            <div className="bg-blue-100 p-2 rounded">
              <p className="font-medium">This error occurs because:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Strapi Cloud disables data transfers by default on free plans</li>
                <li>You need to upgrade to at least the Pro plan to enable transfers</li>
                <li>Even after upgrading, you may need to contact Strapi support to enable transfers</li>
              </ul>
            </div>
            
            <p className="font-medium mt-3">Available options:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>
                <strong>Upgrade your plan & contact support:</strong> Upgrade to the Pro plan and contact Strapi support to request enabling both data transfer and developer mode.
              </li>
              <li>
                <strong>Create a custom API in your local Strapi:</strong> Create an API endpoint that can export your content types in a format your app can import.
              </li>
              <li>
                <strong>Manual content creation:</strong> Recreate your content directly in the Strapi cloud admin interface.
              </li>
              <li>
                <strong>Local development:</strong> During development, point your app to a local Strapi instance where you have full control.
              </li>
            </ol>
            
            <div className="mt-3 p-2 bg-blue-100 rounded">
              <p className="font-medium">Contacting Strapi Support:</p>
              <ol className="list-disc pl-4 space-y-1 mt-1">
                <li>Log in to your Strapi cloud account</li>
                <li>Go to the Help section</li>
                <li>Create a support ticket requesting data transfer and developer mode enablement</li>
                <li>Be sure to mention you've upgraded to a paid plan (if you have)</li>
              </ol>
            </div>
            
            <div className="mt-3 p-2 bg-blue-100 rounded">
              <p className="font-medium">Alternative approach - create your content types manually:</p>
              <ol className="list-disc pl-4 space-y-1 mt-1">
                <li>Work with the existing content types available in your cloud instance</li>
                <li>Access Strapi REST API endpoints directly from your application</li>
                <li>Focus on utilizing the Single Types and Collection Types that already exist</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleConnectionTest;
