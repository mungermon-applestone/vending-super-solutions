
import { useEffect, useState } from 'react';
import { forceContentfulProvider } from '@/services/cms/cmsInit';
import { getContentfulClient, testContentfulConnection } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';

export function useContentfulInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initContentful = async () => {
      try {
        console.log('[useContentfulInit] Starting Contentful initialization');
        
        // Force Contentful provider
        forceContentfulProvider();
        
        // Test the connection
        const client = await getContentfulClient();
        const testResult = await testContentfulConnection();
        
        if (!testResult.success) {
          throw new Error(testResult.message);
        }
        
        console.log('[useContentfulInit] Contentful initialized successfully');
        setIsInitialized(true);
        setError(null);
        
      } catch (err) {
        console.error('[useContentfulInit] Initialization failed:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize Contentful'));
        toast.error('Failed to connect to CMS');
      }
    };

    initContentful();
  }, []);

  return { isInitialized, error };
}
