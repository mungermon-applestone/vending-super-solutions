
import { useQuery } from '@tanstack/react-query';
import * as cmsService from '@/services/cms';

/**
 * Hook to fetch machines with optional filters
 */
export function useMachines(filters: Record<string, any> = {}) {
  return useQuery({
    queryKey: ['machines', filters],
    queryFn: () => cmsService.getMachines(filters),
  });
}

/**
 * Hook to fetch a specific machine by type and ID
 */
export function useMachine(type: string | undefined, id: string | undefined) {
  return useQuery({
    queryKey: ['machine', type, id],
    queryFn: () => cmsService.getMachineBySlug(type || '', id || ''),
    enabled: !!type && !!id,
  });
}

/**
 * Hook to fetch all product types
 */
export function useProductTypes() {
  return useQuery({
    queryKey: ['productTypes'],
    queryFn: cmsService.getProductTypes,
  });
}

/**
 * Hook to fetch a specific product type by slug with improved error handling
 */
export function useProductType(slug: string | undefined) {
  return useQuery({
    queryKey: ['productType', slug],
    queryFn: async () => {
      // If slug is undefined or empty, don't proceed
      if (!slug) {
        console.warn('[useCMSData] useProductType called with empty slug');
        return null;
      }
      
      console.log(`[useCMSData] useProductType hook fetching product type with slug: ${slug}`);
      
      try {
        const result = await cmsService.getProductTypeBySlug(slug);
        console.log(`[useCMSData] useProductType hook received result for ${slug}:`, result);
        return result;
      } catch (error) {
        console.error(`[useCMSData] Error fetching product type ${slug}:`, error);
        throw error;
      }
    },
    enabled: !!slug && slug.trim() !== '', // Only run query when slug is available and not empty
    retry: 2,                              // Retry twice if it fails
    refetchOnWindowFocus: false,           // Don't refetch on window focus
    staleTime: 1000 * 60 * 5,              // Data remains fresh for 5 minutes
  });
}

/**
 * Hook to fetch all testimonials
 */
export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: cmsService.getTestimonials,
  });
}

/**
 * Hook to fetch all business goals
 */
export function useBusinessGoals() {
  return useQuery({
    queryKey: ['businessGoals'],
    queryFn: cmsService.getBusinessGoals,
  });
}

/**
 * Hook to fetch a specific business goal by slug
 */
export function useBusinessGoal(slug: string | undefined) {
  return useQuery({
    queryKey: ['businessGoal', slug],
    queryFn: () => cmsService.getBusinessGoalBySlug(slug || ''),
    enabled: !!slug,
  });
}
