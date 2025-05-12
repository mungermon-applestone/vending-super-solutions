
import React from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getContentfulClient, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { logDeprecation } from '@/services/cms/utils/deprecation';

/**
 * Generic hook for fetching data from Contentful
 * This centralizes Contentful data fetching logic and adds deprecation tracking
 */
export default function useContentful<T>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 1000 * 60 * 5, // 5 minutes
  ...options
}: UseQueryOptions<T, Error>) {
  // Log usage for tracking purposes
  React.useEffect(() => {
    logDeprecation(
      'useContentful',
      `Fetching ${Array.isArray(queryKey) ? queryKey.join('-') : queryKey}`
    );
  }, [queryKey]);
  
  const queryResult = useQuery({
    queryKey,
    queryFn,
    enabled,
    staleTime,
    ...options,
  });
  
  // Add convenience flag to check if content is truly ready
  const isContentReady = !queryResult.isLoading && !queryResult.error && !!queryResult.data;
  
  return {
    ...queryResult,
    isContentReady,
  };
}
