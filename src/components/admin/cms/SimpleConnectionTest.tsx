
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { testCMSConnection } from '@/services/cms/utils/connection';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

/**
 * A simple CMS connection test component that can be used anywhere
 */
const SimpleConnectionTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const connectionResult = await testCMSConnection();
      
      setResult({
        success: connectionResult.success,
        message: connectionResult.message
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={runTest} 
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing Connection...
          </>
        ) : (
          'Test Connection'
        )}
      </Button>
      
      {result && (
        <div className={`p-3 rounded-md text-sm ${
          result.success ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
        }`}>
          <div className="flex items-center gap-2">
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span className={result.success ? 'text-green-800' : 'text-red-800'}>
              {result.success ? 'Connection Successful' : 'Connection Failed'}
            </span>
          </div>
          <p className="mt-1 text-xs">
            {result.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default SimpleConnectionTest;
