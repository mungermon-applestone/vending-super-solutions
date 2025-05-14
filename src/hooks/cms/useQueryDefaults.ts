
import { UseQueryOptions } from '@tanstack/react-query';

/**
 * Create standardized query options with sensible defaults
 */
export function createQueryOptions<T>(customOptions: Partial<UseQueryOptions<T>> = {}): Partial<UseQueryOptions<T>> {
  return {
    retry: 1,
    gcTime: 5 * 60 * 1000, // 5 minutes
    ...customOptions
  };
}
