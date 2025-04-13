
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { testStrapiConnection } from '@/services/cms/technology';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SimpleConnectionTest: React.FC = () => {
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
    details?: any;
  }>({ status: 'idle' });
  
  const [customUrl, setCustomUrl] = useState<string>(
    import.meta.env.VITE_STRAPI_API_URL || 'https://strong-balance-0789566afc.strapiapp.com/api'
  );
  
  const handleTestConnection = async () => {
    setTestResult({ status: 'loading' });
    
    try {
      console.log(`Testing connection to: ${customUrl}`);
      
      // Temporarily update the API URL for this test
      const originalApiUrl = import.meta.env.VITE_STRAPI_API_URL;
      // @ts-ignore - We're setting this temporarily for the test
      import.meta.env.VITE_STRAPI_API_URL = customUrl;
      
      const result = await testStrapiConnection();
      
      // Restore the original API URL
      // @ts-ignore - Restoring the original value
      import.meta.env.VITE_STRAPI_API_URL = originalApiUrl;
      
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
