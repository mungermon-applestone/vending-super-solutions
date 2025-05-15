
import { UseQueryOptions } from '@tanstack/react-query';

/**
 * Common options for all CMS data queries
 */
export const defaultQueryOptions = {
  retry: 2,
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 10, // 10 minutes
};

/**
 * Creates standardized query options by merging defaults with custom options
 */
export function createQueryOptions<T, E = Error>(
  customOptions?: Partial<UseQueryOptions<T, E>>
): Partial<UseQueryOptions<T, E>> {
  return {
    ...defaultQueryOptions,
    ...customOptions,
  };
}
