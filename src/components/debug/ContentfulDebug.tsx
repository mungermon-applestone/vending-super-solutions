
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CONTENTFUL_CONFIG, isContentfulConfigured } from '@/config/cms';
import { testContentfulConnection } from '@/utils/contentfulConnectionTest';

const ContentfulDebug = () => {
  // Log all relevant environment variables
  const envVars = {
    VITE_CONTENTFUL_SPACE_ID: import.meta.env.VITE_CONTENTFUL_SPACE_ID || 'NOT SET',
    VITE_CONTENTFUL_ENVIRONMENT_ID: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'NOT SET',
    VITE_CONTENTFUL_DELIVERY_TOKEN: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN ? 'PRESENT' : 'NOT SET',
    hasDeliveryToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
    configuredStatus: isContentfulConfigured() ? 'CONFIGURED' : 'NOT CONFIGURED'
  };

  useEffect(() => {
    // Notify about missing environment variables when component mounts
    if (!isContentfulConfigured()) {
      toast.error(
        'Contentful is not properly configured. Please set the required environment variables.',
        { duration: 10000, id: 'contentful-config-error' }
      );
    }
  }, []);

  const handleTestConnection = async () => {
    toast.loading('Testing Contentful connection...');
    
    try {
      const result = await testContentfulConnection();
      
      if (result.success) {
        toast.success(`Connection successful: ${result.message}`);
      } else {
        toast.error(`Connection failed: ${result.message}`);
      }
    } catch (error) {
      toast.error(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-sm z-50 max-w-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">Contentful Debug</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 text-xs"
          onClick={handleTestConnection}
        >
          Test Connection
        </Button>
      </div>
      
      <pre className="text-xs overflow-auto max-h-60">
        {JSON.stringify(envVars, null, 2)}
      </pre>
      
      <div className="mt-3 pt-3 border-t border-gray-600 text-xs">
        <p className="font-semibold mb-1">Setup Instructions:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Create a <code>.env</code> file in project root</li>
          <li>Add Contentful credentials in the format:</li>
          <li className="ml-4 font-mono">VITE_CONTENTFUL_SPACE_ID=your_space_id</li>
          <li className="ml-4 font-mono">VITE_CONTENTFUL_DELIVERY_TOKEN=your_token</li>
          <li className="ml-4 font-mono">VITE_CONTENTFUL_ENVIRONMENT_ID=master</li>
          <li>Restart your development server</li>
        </ol>
      </div>
    </div>
  );
};

export default ContentfulDebug;
