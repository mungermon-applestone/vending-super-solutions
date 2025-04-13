import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Create a modified version of the test function that accepts a custom URL
const testStrapiConnectionWithUrl = async (customUrl: string, endpoint: string = '') => {
  try {
    // Process the base URL to ensure it's correctly formatted
    let baseUrl = customUrl.trim();
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }
    
    // Remove /api suffix for now, we'll handle it separately
    const hasApiSuffix = baseUrl.endsWith('/api');
    if (hasApiSuffix) {
      baseUrl = baseUrl.slice(0, -4);
    }
    
    // Determine the full URL to test based on endpoint provided
    let urlToTest = baseUrl;
    
    // If endpoint is provided, use it
    if (endpoint) {
      // Make sure it starts with a slash
      const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      
      // Add /api if needed
      const apiPath = hasApiSuffix || urlToTest.includes('/api/') ? '' : '/api';
      urlToTest = `${baseUrl}${apiPath}${formattedEndpoint}`;
    }
    
    console.log(`Testing connection to: ${urlToTest}`);
    
    const response = await fetch(urlToTest);
    console.log(`Response from ${urlToTest}:`, response.status, response.statusText);
    
    if (response.ok) {
      // Try to parse the response as JSON
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
        // If it's HTML, it might be the Strapi admin UI
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

// Test multiple endpoints to help diagnose Strapi configuration
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
  
  // Normalize the base URL
  let normalizedUrl = baseUrl.trim();
  if (normalizedUrl.endsWith('/')) {
    normalizedUrl = normalizedUrl.slice(0, -1);
  }
  
  // Define endpoints to try in order
  const endpoints = [
    '/admin', 
    '/admin/init',
    '/api/technology',
    '/api/technologies',
    '/api',
    '' // Base URL
  ];
  
  // Try each endpoint
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
            // Not JSON data, continue to next endpoint
          }
        }
        else {
          // Check if HTML response contains Strapi admin strings
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
            // Cannot read as text, continue
          }
        }
      }
    } catch (error) {
      console.log(`Error testing endpoint: ${error}`);
      // Continue with next endpoint
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
  
  // Successful URL from previous test
  const defaultUrl = 'https://strong-balance-0789566afc.strapiapp.com';
  
  const [customUrl, setCustomUrl] = useState<string>(defaultUrl);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/admin');
  
  // Common Strapi endpoints to test
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
      // Extract the endpoint from the custom URL if it contains one
      let baseUrlToTest = customUrl;
      let endpointToTest = selectedEndpoint;
      
      // Test the connection with the provided URL and endpoint
      const result = await testStrapiConnectionWithUrl(baseUrlToTest, endpointToTest);
      
      if (result.success) {
        setTestResult({ 
          status: 'success', 
          message: result.message,
          details: result
        });
      } else {
        // If direct test fails, try the environment diagnostic test
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
          <h4 className="text-sm font-medium text-blue-800 mb-1">Missing Content Types</h4>
          <p className="text-xs text-blue-700 mb-2">
            If you can access the admin panel but don't see the Technology content type, you need to transfer it from your local instance or create it in the cloud.
          </p>
          <div className="space-y-2 text-xs text-blue-700">
            <p className="font-medium">Options:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Use Strapi's transfer feature to copy your content type from local to cloud</li>
              <li>Create the Technology content type manually in the cloud admin panel</li>
              <li>Check if the Technology content type is created but not published</li>
            </ol>
            <p className="mt-2">
              <strong>Note:</strong> Creating or modifying content types in production may require a paid plan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleConnectionTest;
