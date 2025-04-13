
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    const endpointsToTry = [
      `${baseUrl}/api/technology?populate=*`,  // Standard API path with singular
      `${baseUrl}/api/technologies?populate=*`, // Standard API path with plural
      `${baseUrl}/technology?populate=*`,      // Without /api prefix, singular
      `${baseUrl}/technologies?populate=*`,    // Without /api prefix, plural
      `${baseUrl}/api`,                        // Just the API base path
      baseUrl                                  // The base URL itself
    ];
    
    // Add specific endpoints for the cloud.strapi.io domain
    if (baseUrl.includes('cloud.strapi.io')) {
      endpointsToTry.unshift(
        `${baseUrl}/api/technology`,
        `${baseUrl}/api/technologies`
      );
    }
    
    console.log('Endpoints to try:', endpointsToTry);
    
    let lastError = null;
    
    // Try each endpoint until one works
    for (const url of endpointsToTry) {
      try {
        console.log(`Trying endpoint: ${url}`);
        
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
              testedUrl: url
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
        attemptedEndpoints: endpointsToTry
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
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
    details?: any;
  }>({ status: 'idle' });
  
  const [customUrl, setCustomUrl] = useState<string>(
    import.meta.env.VITE_STRAPI_API_URL || 'https://cloud.strapi.io/projects/applestone-strapi-6b2a2544e3'
  );
  
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
        <div className="mt-4 border rounded p-3 bg-gray-50">
          <h4 className="text-xs font-medium mb-1">Response Details:</h4>
          <pre className="text-xs overflow-auto max-h-40 p-2 bg-white border rounded">
            {JSON.stringify(testResult.details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SimpleConnectionTest;
