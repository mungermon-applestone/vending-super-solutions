
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CONTENTFUL_CONFIG, isContentfulConfigured } from '@/config/cms';
import { testContentfulConnection } from '@/utils/contentfulConnectionTest';

const ContentfulDebug = () => {
  const [formInputs, setFormInputs] = useState({
    spaceId: '',
    deliveryToken: '',
    environmentId: 'master'
  });
  
  // Log all relevant environment variables
  const envVars = {
    VITE_CONTENTFUL_SPACE_ID: import.meta.env.VITE_CONTENTFUL_SPACE_ID || 'NOT SET',
    VITE_CONTENTFUL_ENVIRONMENT_ID: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'NOT SET',
    VITE_CONTENTFUL_DELIVERY_TOKEN: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN ? 'PRESENT' : 'NOT SET',
    hasDeliveryToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
    spaceIdLength: CONTENTFUL_CONFIG.SPACE_ID?.length || 0,
    configuredStatus: isContentfulConfigured() ? 'CONFIGURED' : 'NOT CONFIGURED'
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInputs({
      ...formInputs,
      [e.target.name]: e.target.value
    });
  };

  const handleApplySettings = () => {
    try {
      // Open the cms.ts file and explain how to add the values manually
      toast.info(
        'To use these credentials, open src/config/cms.ts and update the INLINE_CONTENTFUL_CONFIG object with these values.',
        { duration: 10000 }
      );
      
      // Show the values that need to be copied
      const codeSnippet = `const INLINE_CONTENTFUL_CONFIG = {
  SPACE_ID: '${formInputs.spaceId}',
  DELIVERY_TOKEN: '${formInputs.deliveryToken}',
  ENVIRONMENT_ID: '${formInputs.environmentId}'
};`;
      
      console.log('[ContentfulDebug] Copy these settings to src/config/cms.ts:');
      console.log(codeSnippet);
      
      // Show in toast
      toast.info('Settings logged to console. Copy them to your cms.ts file.', { duration: 5000 });
    } catch (error) {
      toast.error('Failed to apply settings.');
      console.error('[ContentfulDebug] Error:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-sm z-50 max-w-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">Contentful Setup</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 text-xs"
          onClick={handleTestConnection}
        >
          Test Connection
        </Button>
      </div>
      
      <pre className="text-xs overflow-auto max-h-40 mb-3">
        {JSON.stringify(envVars, null, 2)}
      </pre>
      
      <div className="space-y-3 border-t border-gray-600 pt-3">
        <h4 className="text-sm font-semibold">Enter Contentful Credentials</h4>
        
        <div className="space-y-2">
          <div>
            <Label htmlFor="spaceId" className="text-xs text-gray-300">Space ID</Label>
            <Input 
              id="spaceId"
              name="spaceId"
              value={formInputs.spaceId}
              onChange={handleInputChange}
              className="h-7 text-xs bg-gray-800 border-gray-700" 
            />
          </div>
          
          <div>
            <Label htmlFor="deliveryToken" className="text-xs text-gray-300">Delivery Token</Label>
            <Input 
              id="deliveryToken"
              name="deliveryToken"
              value={formInputs.deliveryToken}
              onChange={handleInputChange}
              className="h-7 text-xs bg-gray-800 border-gray-700" 
            />
          </div>
          
          <div>
            <Label htmlFor="environmentId" className="text-xs text-gray-300">Environment ID</Label>
            <Input 
              id="environmentId"
              name="environmentId"
              value={formInputs.environmentId}
              onChange={handleInputChange}
              className="h-7 text-xs bg-gray-800 border-gray-700" 
            />
          </div>
          
          <Button 
            size="sm" 
            className="w-full h-7 text-xs mt-1"
            onClick={handleApplySettings}
          >
            Get Configuration Code
          </Button>
        </div>
        
        <div className="text-xs text-gray-400 mt-2">
          <p className="mb-1">Since you can't create a .env file:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Enter your credentials above</li>
            <li>Click "Get Configuration Code"</li>
            <li>Copy the code from the browser console</li>
            <li>Open src/config/cms.ts and paste the values</li>
            <li>Restart your development server</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ContentfulDebug;
