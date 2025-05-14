
import { QueryOptions } from '@tanstack/react-query';

/**
 * Create standardized query options with sensible defaults
 */
export function createQueryOptions<T>(customOptions: Partial<QueryOptions> = {}): Partial<QueryOptions> {
  return {
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    ...customOptions
  };
}
