
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Create a modified version of the test function that accepts a custom URL
const testStrapiConnectionWithUrl = async (customUrl: string) => {
  try {
    console.log(`Testing connection to: ${customUrl}`);
    
    // Process the URL to ensure it's correctly formatted
    // Remove trailing slash if present
    let baseUrl = customUrl.trim();
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }
    
    // Remove /api suffix for now, we'll try with and without it
    const hasApiSuffix = baseUrl.endsWith('/api');
    if (hasApiSuffix) {
      baseUrl = baseUrl.slice(0, -4);
    }
    
    console.log(`Processed base URL: ${baseUrl}`);
    
    // Try multiple endpoints to find the right one
    const endpointsToTry = [];
    
    // Strapi Cloud-specific endpoints
    if (baseUrl.includes('cloud.strapi.io')) {
      endpointsToTry.push(
        `${baseUrl}/api/technology`,
        `${baseUrl}/api/technologies`,
        `${baseUrl}/api/content-api/technology`,
        `${baseUrl}/api/content-api/technologies`,
        `${baseUrl}/api/content-manager/collection-types`
      );
    }
    
    // Regular endpoints for both Cloud and self-hosted
    endpointsToTry.push(
      `${baseUrl}/api/technology?populate=*`,  // Standard API path with singular
      `${baseUrl}/api/technologies?populate=*`, // Standard API path with plural
      `${baseUrl}/api/technology`,  // Without population
      `${baseUrl}/api/technologies`, // Without population
      `${baseUrl}/api/content-type-builder/content-types`, // Content type builder API
      `${baseUrl}/api`, // Just the API base path
      baseUrl     // The base URL itself
    );
    
    // If it's the Strapi Cloud deployment URL format
    if (baseUrl.includes('strapiapp.com')) {
      // Try common variations of the API path for Strapi Cloud
      endpointsToTry.unshift(
        `${baseUrl}/api/technology`,
        `${baseUrl}/api/technologies`,
        // Add admin API endpoints to detect if we can at least connect
        `${baseUrl}/admin/init`
      );
    }
    
    console.log('Endpoints to try:', endpointsToTry);
    
    let lastError = null;
    let urlsTried = [];
    
    // Try each endpoint until one works
    for (const url of endpointsToTry) {
      try {
        console.log(`Trying endpoint: ${url}`);
        urlsTried.push(url);
        
        const response = await fetch(url);
        console.log(`Response from ${url}:`, response.status, response.statusText);
        
        if (response.ok) {
          // Try to parse the response as JSON
          try {
            const data = await response.json();
            console.log('Received JSON data:', data);
            return {
              success: true,
              message: `Successfully connected to Strapi API at ${url}`,
              data: data,
              testedUrl: url,
              allUrlsTried: urlsTried
            };
          } catch (parseError) {
            console.log(`Response not JSON from ${url}:`, parseError);
            // If it's HTML, it might be the Strapi admin UI
            const text = await response.text();
            if (text.includes('<!DOCTYPE html>')) {
              console.log('Received HTML response, likely admin UI');
              return {
                success: true,
                message: `Connected to Strapi at ${url} but received HTML (likely admin UI)`,
                testedUrl: url,
                allUrlsTried: urlsTried,
                details: { 
                  info: 'Received HTML response - this might be the Strapi admin interface',
                  status: response.status
                }
              };
            }
          }
        } else {
          lastError = {
            status: response.status,
            statusText: response.statusText,
            url: url
          };
        }
      } catch (error) {
        console.error(`Error trying ${url}:`, error);
        lastError = {
          error: error instanceof Error ? error.message : String(error),
          url: url
        };
      }
    }
    
    // If we got here, none of the endpoints worked
    return {
      success: false,
      message: `Failed to connect: ${lastError?.status ? `Server returned ${lastError.status} ${lastError.statusText || ''}` : 'All connection attempts failed'}`,
      details: { 
        ...lastError,
        attemptedEndpoints: urlsTried
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

const SimpleConnectionTest: React.FC = () => {
  const [activeTab, setActiveTab] = useState("default");
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
    details?: any;
  }>({ status: 'idle' });
  
  // Use both URLs as potential defaults
  const potentialUrls = [
    'https://cloud.strapi.io/projects/applestone-strapi-6b2a2544e3',
    'https://strong-balance-0789566afc.strapiapp.com'
  ];
  
  const envUrl = import.meta.env.VITE_STRAPI_API_URL;
  const defaultUrl = envUrl || potentialUrls[1]; // Prefer the strapiapp.com URL by default
  
  const [customUrl, setCustomUrl] = useState<string>(defaultUrl);
  
  const handleTestConnection = async () => {
    setTestResult({ status: 'loading' });
    
    try {
      // Use our custom function with the URL from state
      const result = await testStrapiConnectionWithUrl(customUrl);
      
      if (result.success) {
        setTestResult({ 
          status: 'success', 
          message: result.message,
          details: result
        });
      } else {
        setTestResult({ 
          status: 'error', 
          message: result.message,
          details: result
        });
      }
    } catch (error) {
      setTestResult({ 
        status: 'error', 
        message: `Error testing connection: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="default">Default URL</TabsTrigger>
          <TabsTrigger value="custom">Custom URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="default" className="pt-2">
          <div className="space-y-2">
            <p className="text-sm">Test with one of these default URLs:</p>
            <div className="space-y-2">
              {potentialUrls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Button 
                    variant={customUrl === url ? "default" : "outline"} 
                    size="sm"
                    className="w-full justify-start overflow-hidden text-ellipsis"
                    onClick={() => setCustomUrl(url)}
                  >
                    <span className="truncate">{url}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setCustomUrl(url);
                      handleTestConnection();
                    }}
                  >
                    Test
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="pt-2">
          <div className="space-y-2">
            <Label htmlFor="strapiUrl">Test with a different Strapi URL:</Label>
            <Input 
              id="strapiUrl"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://your-strapi-instance.com/api"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Make sure this points to your Strapi API base URL (with /api at the end if needed)
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleTestConnection}
        disabled={testResult.status === 'loading'}
        className="w-full"
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
          
          {testResult.details.allUrlsTried && (
            <AccordionItem value="urls-tried">
              <AccordionTrigger className="text-xs font-medium">
                URLs Attempted ({testResult.details.allUrlsTried.length})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 text-xs">
                  {testResult.details.allUrlsTried.map((url: string, index: number) => (
                    <div key={index} className="font-mono p-1 border-b last:border-b-0">
                      {url}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      )}
    </div>
  );
};

export default SimpleConnectionTest;
