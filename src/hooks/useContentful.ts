
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { refreshContentfulClient } from '@/services/cms/utils/contentfulClient';

interface ContentfulQueryOptions<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  fallbackData?: T;
  enableToasts?: boolean;
  retryLimit?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  refetchInterval?: number | false;
  cacheTime?: number;
}

/**
 * A hook for fetching data from Contentful with built-in error handling,
 * logging, and fallbacks.
 */
export function useContentful<T>({
  queryKey,
  queryFn,
  fallbackData,
  enableToasts = true,
  retryLimit = 2,
  onSuccess,
  onError,
  refetchInterval = false,
  cacheTime
}: ContentfulQueryOptions<T>) {
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        console.log(`[useContentful] Fetching data for ${queryKey.join('/')}`);
        return await queryFn();
      } catch (error) {
        // Enhanced error logging
        console.error(`[useContentful] Error fetching ${queryKey.join('/')}:`, error);
        
        // Try refreshing the client if there was an error
        try {
          console.log('[useContentful] Attempting to refresh client and retry query');
          await refreshContentfulClient();
          return await queryFn();
        } catch (retryError) {
          console.error(`[useContentful] Retry also failed:`, retryError);
          
          // Format the error message
          let errorMessage = 'Error fetching content';
          
          if (error instanceof Error) {
            errorMessage = error.message;
            
            // Check for specific Contentful error patterns
            if (errorMessage.includes('space') && errorMessage.includes('access token')) {
              errorMessage = 'Invalid Contentful space or access token';
            } else if (errorMessage.includes('content type')) {
              errorMessage = 'Content type not found in Contentful';
            } else if (errorMessage.includes('entry') && errorMessage.includes('not found')) {
              errorMessage = 'Content entry not found in Contentful';
            } else if (errorMessage.includes('Network Error')) {
              errorMessage = 'Network error while connecting to Contentful';
            }
          }
          
          // Re-throw the error with a more helpful message
          throw new Error(`Contentful error: ${errorMessage}`);
        }
      }
    },
    retry: retryLimit,
    initialData: fallbackData,
    gcTime: cacheTime,
    refetchInterval,
    refetchOnWindowFocus: false,
    meta: {
      onSuccess: (data: T) => {
        console.log(`[useContentful] Successfully fetched data for ${queryKey.join('/')}`);
        if (onSuccess) onSuccess(data);
      },
      onError: (error: Error) => {
        if (enableToasts) {
          toast.error(`Content loading error: ${error.message}`);
        }
        if (onError) onError(error);
      }
    }
  });

  return {
    ...query,
    isContentReady: query.isSuccess && !!query.data
  };
}

// Also export as default for backward compatibility
export default useContentful;
