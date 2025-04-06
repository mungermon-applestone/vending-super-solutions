
import { useQuery } from '@tanstack/react-query';
import * as cmsService from '@/services/cms';

export function useMachines(filters: Record<string, any> = {}) {
  return useQuery({
    queryKey: ['machines', filters],
    queryFn: () => cmsService.getMachines(filters),
  });
}

export function useMachine(type: string | undefined, id: string | undefined) {
  return useQuery({
    queryKey: ['machine', type, id],
    queryFn: () => cmsService.getMachineBySlug(type || '', id || ''),
    enabled: !!type && !!id,
  });
}

export function useProductTypes() {
  return useQuery({
    queryKey: ['productTypes'],
    queryFn: cmsService.getProductTypes,
  });
}

export function useProductType(slug: string | undefined) {
  return useQuery({
    queryKey: ['productType', slug],
    queryFn: async () => {
      // If slug is undefined or empty, don't proceed
      if (!slug) {
        console.warn('useProductType called with empty slug');
        return null;
      }
      
      console.log(`useProductType hook fetching product type with slug: ${slug}`);
      
      // Call the CMS service and add extra logging
      try {
        const result = await cmsService.getProductTypeBySlug(slug);
        console.log(`useProductType hook received result for ${slug}:`, result);
        return result;
      } catch (error) {
        console.error(`Error fetching product type ${slug}:`, error);
        throw error;
      }
    },
    enabled: !!slug, // Only run query when slug is available
    retry: 1, // Retry once if it fails
    refetchOnWindowFocus: false, // Don't refetch on window focus
    staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: cmsService.getTestimonials,
  });
}

export function useBusinessGoals() {
  return useQuery({
    queryKey: ['businessGoals'],
    queryFn: cmsService.getBusinessGoals,
  });
}

export function useBusinessGoal(slug: string | undefined) {
  return useQuery({
    queryKey: ['businessGoal', slug],
    queryFn: () => cmsService.getBusinessGoalBySlug(slug || ''),
    enabled: !!slug,
  });
}
