
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { testContentfulConnection } from '@/services/cms/utils/connection';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, CheckCircle, AlertTriangle, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

const CMSConnectionTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [noConfigFound, setNoConfigFound] = useState(false);
  const { toast } = useToast();

  const handleConnectionTest = async () => {
    setIsLoading(true);
    setErrorDetails(null);
    setNoConfigFound(false);
    
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
        // Check if this is a configuration missing error
        if (result.message === 'No Contentful configuration found') {
          setNoConfigFound(true);
        }
        
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
      
      {noConfigFound && (
        <Alert variant="warning" className="mt-4 border-amber-200 bg-amber-50">
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium text-amber-800">No Contentful configuration found</p>
              <p className="text-sm text-amber-700">
                Please add your Contentful credentials in the Contentful Configuration section below.
              </p>
              <p className="text-sm text-amber-700">
                You'll need to enter your Space ID and Management Token to connect to Contentful.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
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
