
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseCMSQueryOptions<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enableToasts?: boolean;
  retries?: number;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number | false;
  initialData?: T;
}

/**
 * Custom hook for handling CMS data fetching with consistent error handling
 * and loading states
 */
export function useCMSQuery<T>({
  queryKey,
  queryFn,
  onSuccess,
  onError,
  enableToasts = false,
  retries = 2,
  refetchOnWindowFocus = false,
  refetchInterval = false,
  initialData
}: UseCMSQueryOptions<T>) {
  // Track whether we've shown an error toast to prevent duplicates
  const [hasShownErrorToast, setHasShownErrorToast] = useState(false);
  
  // Use React Query for data fetching
  const query = useQuery({
    queryKey,
    queryFn,
    retry: retries,
    refetchOnWindowFocus,
    refetchInterval,
    initialData,
    meta: {
      onError: (error: Error) => {
        console.error(`[useCMSQuery] Error in ${queryKey.join('/')}:`, error);
        
        if (enableToasts && !hasShownErrorToast) {
          toast.error(`Error loading data: ${error.message}`);
          setHasShownErrorToast(true);
        }
        
        if (onError) {
          onError(error);
        }
      }
    }
  });
  
  // Reset toast tracker when query is successful
  useEffect(() => {
    if (query.isSuccess && hasShownErrorToast) {
      setHasShownErrorToast(false);
    }
    
    if (query.isSuccess && query.data && onSuccess) {
      onSuccess(query.data);
    }
  }, [query.isSuccess, query.data, hasShownErrorToast, onSuccess]);
  
  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    status: query.status
  };
}

export default useCMSQuery;
