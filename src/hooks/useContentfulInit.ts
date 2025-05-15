
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { testContentfulConnection, isContentfulConfigured } from '@/services/contentful/client';

/**
 * Hook to test and initialize Contentful connection
 */
export function useContentfulInit() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function testConnection() {
      setIsLoading(true);
      
      if (!isContentfulConfigured()) {
        console.log('[useContentfulInit] Contentful not configured');
        setIsConnected(false);
        setIsLoading(false);
        return;
      }
      
      try {
        const result = await testContentfulConnection();
        
        if (result.success) {
          console.log('[useContentfulInit] Contentful connection successful');
          setIsConnected(true);
          setError(null);
        } else {
          console.error('[useContentfulInit] Contentful connection failed:', result.message);
          setIsConnected(false);
          setError(new Error(result.message));
        }
      } catch (err) {
        console.error('[useContentfulInit] Error testing Contentful connection:', err);
        setIsConnected(false);
        setError(err instanceof Error ? err : new Error('Unknown error testing Contentful connection'));
      } finally {
        setIsLoading(false);
      }
    }
    
    testConnection();
  }, []);

  const refreshConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await testContentfulConnection();
      
      if (result.success) {
        setIsConnected(true);
        toast.success('Contentful connection refreshed');
      } else {
        setIsConnected(false);
        setError(new Error(result.message));
        toast.error('Failed to connect to Contentful');
      }
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast.error('Error refreshing Contentful connection');
    } finally {
      setIsLoading(false);
    }
  };
  
  return { 
    isConnected, 
    isLoading, 
    error, 
    refreshConnection,
    isInitialized: isConnected // Alias for backward compatibility
  };
}
