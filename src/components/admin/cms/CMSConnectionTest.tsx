
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { testContentfulConnection } from '@/services/cms/utils/connection';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CMSConnectionTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const { toast } = useToast();

  const handleConnectionTest = async () => {
    setIsLoading(true);
    setErrorDetails(null);
    
    try {
      const result = await testContentfulConnection();

      if (result.success) {
        toast({
          title: 'Contentful Connection',
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              <span>{result.message}</span>
            </div>
          ),
          variant: 'default'
        });
      } else {
        // Store error details for display
        if (result.errorData) {
          setErrorDetails(result.errorData);
        }
        
        toast({
          title: 'Connection Error',
          description: (
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-500" />
              <span>{result.message}</span>
            </div>
          ),
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Unexpected Error',
        description: (
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-500" />
            <span>Failed to test Contentful connection</span>
          </div>
        ),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button 
          onClick={handleConnectionTest} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            'Test Contentful Connection'
          )}
        </Button>
      </div>
      
      {errorDetails && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            <div className="space-y-2 text-sm">
              <p><strong>Error Code:</strong> {errorDetails.status}</p>
              <p><strong>Message:</strong> {errorDetails.message}</p>
              {errorDetails.request?.url && (
                <p><strong>Request URL:</strong> {errorDetails.request.url}</p>
              )}
              <p className="text-xs text-gray-100 mt-2">
                This error typically indicates an invalid or expired management token. 
                Please check your Contentful credentials in the settings page.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CMSConnectionTest;
