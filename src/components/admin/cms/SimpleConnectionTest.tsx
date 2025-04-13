
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { testStrapiConnection } from '@/services/cms/technology';

const SimpleConnectionTest: React.FC = () => {
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ status: 'idle' });
  
  const handleTestConnection = async () => {
    setTestResult({ status: 'loading' });
    
    try {
      const result = await testStrapiConnection();
      
      if (result.success) {
        setTestResult({ 
          status: 'success', 
          message: result.message 
        });
      } else {
        setTestResult({ 
          status: 'error', 
          message: result.message 
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
    <div>
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
    </div>
  );
};

export default SimpleConnectionTest;
