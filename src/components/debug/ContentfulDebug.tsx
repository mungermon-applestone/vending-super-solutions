
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
  
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);
  
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
      // Generate code snippet for INLINE_CONTENTFUL_CONFIG
      const snippet = `const INLINE_CONTENTFUL_CONFIG = {
  SPACE_ID: '${formInputs.spaceId}',
  DELIVERY_TOKEN: '${formInputs.deliveryToken}',
  ENVIRONMENT_ID: '${formInputs.environmentId}'
};`;
      
      setCodeSnippet(snippet);
      setShowCodeSnippet(true);
      
      // Still log it to console as well
      console.log('[ContentfulDebug] Copy these settings to src/config/cms.ts:');
      console.log(snippet);
      
      toast.info('Code snippet generated! Copy it and update src/config/cms.ts file.', { duration: 5000 });
    } catch (error) {
      toast.error('Failed to generate settings.');
      console.error('[ContentfulDebug] Error:', error);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippet)
      .then(() => {
        toast.success('Code copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy code. Please copy it manually.');
      });
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
            Generate Configuration Code
          </Button>
        </div>
        
        {showCodeSnippet && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold">Copy this code to src/config/cms.ts:</h4>
            <div className="relative">
              <pre className="bg-gray-900 p-2 rounded overflow-x-auto text-xs">
                {codeSnippet}
              </pre>
              <Button 
                size="sm" 
                variant="outline"
                className="absolute top-2 right-2 h-6 text-xs py-0 px-2"
                onClick={handleCopyCode}
              >
                Copy
              </Button>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              <p>After copying the code:</p>
              <ol className="list-decimal list-inside space-y-1 pl-2">
                <li>Open src/config/cms.ts</li>
                <li>Replace the existing INLINE_CONTENTFUL_CONFIG with this code</li>
                <li>Refresh the page</li>
              </ol>
            </div>
            <Button 
              size="sm"
              variant="outline" 
              className="w-full h-7 text-xs mt-2"
              onClick={() => setShowCodeSnippet(false)}
            >
              Hide Code
            </Button>
          </div>
        )}
        
        <div className="text-xs text-gray-400 mt-2">
          <p className="mb-1">Since you can't create a .env file:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Enter your credentials above</li>
            <li>Click "Generate Configuration Code"</li>
            <li>Copy the code from the panel above</li>
            <li>Open src/config/cms.ts and paste the values</li>
            <li>Refresh your application</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ContentfulDebug;
