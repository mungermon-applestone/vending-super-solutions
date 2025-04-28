
import React, { useEffect, useState } from 'react';
import { forceContentfulProvider } from '@/services/cms/cmsInit';
import { getContentfulClient, testContentfulConnection, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isContentfulConfigured } from '@/config/cms';

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
  const [attempted, setAttempted] = useState(false);

  const initContentful = async () => {
    if (!isContentfulConfigured()) {
      setError(new Error('Contentful is not configured. Please set up your API credentials in the admin panel.'));
      setIsLoading(false);
      setAttempted(true);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('[ContentfulInitializer] Starting Contentful initialization');
      
      // Force Contentful provider
      forceContentfulProvider();
      
      // Test the connection - first try with a refreshed client
      await refreshContentfulClient();
      
      // Then test the connection
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
      setAttempted(true);
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

  if (error && attempted) {
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
