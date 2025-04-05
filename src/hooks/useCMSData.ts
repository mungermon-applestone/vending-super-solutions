
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
    queryFn: () => {
      // If slug is undefined, try to extract it from the URL
      let productSlug = slug;
      if (!productSlug) {
        const pathParts = window.location.pathname.split('/');
        productSlug = pathParts[pathParts.length - 1];
      }
      console.log("Fetching product type with slug:", productSlug);
      return cmsService.getProductTypeBySlug(productSlug || '');
    },
    enabled: true, // Always enable to work with URL-based product types too
    retry: false, // Don't retry if the product type doesn't exist
    refetchOnWindowFocus: false, // Don't automatically refetch on window focus
    retryOnMount: false, // Don't retry when component remounts
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
