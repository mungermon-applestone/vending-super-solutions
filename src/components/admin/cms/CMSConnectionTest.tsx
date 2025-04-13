
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { getCMSInfo } from '@/services/cms/utils/cmsInfo';
import { testCMSConnection } from '@/services/cms/utils/connection';

const CMSConnectionTest: React.FC = () => {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any>(null);
  
  const cmsInfo = getCMSInfo();
  
  const handleTestConnection = async () => {
    setTestStatus('testing');
    setErrorMessage(null);
    
    try {
      // Test connection to the current CMS provider
      console.log('[CMSConnectionTest] Testing connection to CMS...');
      const result = await testCMSConnection();
      
      console.log('[CMSConnectionTest] Test result:', result);
      
      if (result.success) {
        setTestResults(result);
        setTestStatus('success');
      } else {
        setErrorMessage(result.message);
        setTestStatus('error');
      }
    } catch (error) {
      console.error('[CMSConnectionTest] Connection test failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      setTestStatus('error');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Test CMS Connection</h3>
        <Button 
          onClick={handleTestConnection} 
          disabled={testStatus === 'testing'}
          size="sm"
          variant="outline"
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
      </div>
      
      {testStatus === 'success' && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Connection successful</AlertTitle>
          <AlertDescription className="text-green-700">
            Successfully connected to {cmsInfo.provider} CMS.
          </AlertDescription>
        </Alert>
      )}
      
      {testStatus === 'error' && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Connection failed</AlertTitle>
          <AlertDescription>
            Failed to connect to {cmsInfo.provider} CMS. Error: {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {testStatus === 'success' && testResults && (
        <div className="border rounded-md p-4 bg-gray-50 mt-4">
          <h4 className="font-medium mb-2">Connection details:</h4>
          <pre className="text-xs overflow-auto max-h-40 p-2 bg-white border rounded">
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CMSConnectionTest;
