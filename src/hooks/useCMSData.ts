
import { useQuery } from '@tanstack/react-query';
import * as cmsService from '@/services/cms';
import { normalizeSlug } from '@/services/cms/utils/slugMatching';

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
 * Now supports looking up by UUID as well as slug
 */
export function useProductType(slug: string | undefined, uuid: string | null = null) {
  return useQuery({
    queryKey: ['productType', slug, uuid],
    queryFn: async () => {
      // First try using UUID if available (most reliable method)
      if (uuid) {
        console.log(`[useCMSData] Looking up product by UUID: ${uuid}`);
        try {
          const resultByUUID = await cmsService.getProductTypeByUUID(uuid);
          if (resultByUUID) {
            console.log(`[useCMSData] Found product by UUID: ${uuid}`);
            return resultByUUID;
          }
          console.log(`[useCMSData] No product found with UUID: ${uuid}, falling back to slug`);
        } catch (err) {
          console.error(`[useCMSData] Error looking up product by UUID: ${uuid}`, err);
          // Continue to try by slug
        }
      }
      
      // If slug is undefined or empty, don't proceed
      if (!slug) {
        console.warn('[useCMSData] useProductType called with empty slug and no UUID');
        return null;
      }
      
      const normalizedSlug = normalizeSlug(slug);
      console.log(`[useCMSData] useProductType hook fetching product type with slug: "${normalizedSlug}"`);
      
      try {
        // Enhanced product lookup with multiple fallback strategies
        const result = await cmsService.getProductTypeBySlug(normalizedSlug);
        
        if (result) {
          console.log(`[useCMSData] useProductType hook received result for "${normalizedSlug}":`, { 
            title: result.title,
            slug: result.slug,
            id: result.id
          });
        } else {
          console.warn(`[useCMSData] No product found for slug "${normalizedSlug}"`);
        }
        
        return result;
      } catch (error) {
        console.error(`[useCMSData] Error fetching product type "${normalizedSlug}":`, error);
        throw error;
      }
    },
    enabled: (!!slug && slug.trim() !== '') || !!uuid, // Run if either slug or UUID is provided
    retry: 2,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
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
