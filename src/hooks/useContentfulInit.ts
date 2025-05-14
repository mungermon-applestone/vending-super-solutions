
import { useState, useEffect } from 'react';
import { testContentfulConnection, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { isContentfulConfigured } from '@/config/cms';

/**
 * Hook to initialize and test the Contentful connection
 */
export function useContentfulInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    let isMounted = true;
    
    const initializeContentful = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if Contentful is configured
        if (!isContentfulConfigured()) {
          throw new Error('CONTENTFUL_CONFIG_MISSING');
        }
        
        // Try to refresh the client
        await refreshContentfulClient();
        
        // Test the connection
        const testResult = await testContentfulConnection();
        
        if (!testResult.success) {
          if (retryCount >= MAX_RETRIES) {
            throw new Error(testResult.message || 'Could not connect to Contentful');
          }
          
          // Auto-retry
          setRetryCount(prev => prev + 1);
          return;
        }
        
        // Mark as initialized
        if (isMounted) {
          setIsInitialized(true);
          window._contentfulInitialized = true;
        }
      } catch (err) {
        if (isMounted) {
          console.error('[useContentfulInit] Error initializing Contentful:', err);
          setError(err instanceof Error ? err : new Error('Unknown error initializing Contentful'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Initialize on mount
    initializeContentful();
    
    // Cleanup
    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  return {
    isInitialized,
    isLoading,
    error,
    retry: () => setRetryCount(count => count + 1)
  };
}
