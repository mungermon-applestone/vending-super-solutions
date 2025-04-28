
import React, { useEffect, useState } from 'react';
import { forceContentfulProvider } from '@/services/cms/cmsInit';
import { getContentfulClient, testContentfulConnection } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ContentfulInitializerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ContentfulInitializer: React.FC<ContentfulInitializerProps> = ({ 
  children, 
  fallback 
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const initContentful = async () => {
    setIsLoading(true);
    try {
      console.log('[ContentfulInitializer] Starting Contentful initialization');
      
      // Force Contentful provider
      forceContentfulProvider();
      
      // Test the connection
      const testResult = await testContentfulConnection();
      
      if (!testResult.success) {
        throw new Error(testResult.message);
      }
      
      console.log('[ContentfulInitializer] Contentful initialized successfully');
      setIsInitialized(true);
      setError(null);
      
    } catch (err) {
      console.error('[ContentfulInitializer] Initialization failed:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize Contentful'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initContentful();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-4" />
        <p className="text-gray-500">Connecting to Contentful...</p>
      </div>
    );
  }

  if (error) {
    return fallback || (
      <div className="p-4">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Contentful Connection Error</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{error.message}</p>
            <p className="text-sm">Make sure you've set up your Contentful credentials in Admin &gt; Contentful Configuration.</p>
          </AlertDescription>
        </Alert>
        <Button onClick={initContentful} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry Connection
        </Button>
      </div>
    );
  }

  return isInitialized ? <>{children}</> : null;
};

export default ContentfulInitializer;
