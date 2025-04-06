
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
      // If slug is undefined, try to extract it from the URL
      let productSlug = slug;
      if (!productSlug) {
        const pathParts = window.location.pathname.split('/');
        productSlug = pathParts[pathParts.length - 1];
      }
      console.log(`useProductType hook fetching product type with slug: ${productSlug}`);
      
      // Call the CMS service and add extra logging
      const result = await cmsService.getProductTypeBySlug(productSlug || '');
      console.log(`useProductType hook received result for ${productSlug}:`, result);
      return result;
    },
    enabled: !!slug, // Only fetch when we have a slug
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
