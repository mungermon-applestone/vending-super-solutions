
import { useQuery } from '@tanstack/react-query';
import * as cmsService from '@/services/cms';
import { normalizeSlug, getSlugVariations, slugsMatch } from '@/services/cms/utils/slugMatching';

/**
 * Common options for all CMS data queries
 */
const defaultQueryOptions = {
  retry: 2,
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 10, // 10 minutes
};

/**
 * Hook to fetch machines with optional filters
 */
export function useMachines(filters: Record<string, any> = {}) {
  return useQuery({
    queryKey: ['machines', filters],
    queryFn: () => cmsService.getMachines(filters),
    ...defaultQueryOptions,
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
    ...defaultQueryOptions,
  });
}

/**
 * Hook to fetch all product types
 */
export function useProductTypes() {
  return useQuery({
    queryKey: ['productTypes'],
    queryFn: cmsService.getProductTypes,
    ...defaultQueryOptions,
    meta: {
      onError: (err: any) => {
        console.error('[useCMSData] Error fetching product types:', err);
      }
    }
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
        // Enhanced product lookup with improved slug handling
        const result = await cmsService.getProductTypeBySlug(normalizedSlug);
        
        if (result) {
          console.log(`[useCMSData] useProductType hook received result for "${normalizedSlug}":`, { 
            title: result.title,
            slug: result.slug,
            id: result.id
          });
        } else {
          console.warn(`[useCMSData] No product found for slug "${normalizedSlug}"`);
          
          // Try slug variations as a last resort
          const variations = getSlugVariations(normalizedSlug);
          for (const variation of variations) {
            if (variation === normalizedSlug) continue; // Skip the one we already tried
            
            console.log(`[useCMSData] Trying slug variation: "${variation}"`);
            const resultFromVariation = await cmsService.getProductTypeBySlug(variation);
            if (resultFromVariation) {
              console.log(`[useCMSData] Found product with slug variation: "${variation}"`);
              return resultFromVariation;
            }
          }
        }
        
        return result;
      } catch (error) {
        console.error(`[useCMSData] Error fetching product type "${normalizedSlug}":`, error);
        throw error;
      }
    },
    enabled: (!!slug && slug.trim() !== '') || !!uuid, // Run if either slug or UUID is provided
    ...defaultQueryOptions,
  });
}

/**
 * Hook to fetch all testimonials
 */
export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: cmsService.getTestimonials,
    ...defaultQueryOptions,
  });
}

/**
 * Hook to fetch all business goals
 */
export function useBusinessGoals() {
  return useQuery({
    queryKey: ['businessGoals'],
    queryFn: cmsService.getBusinessGoals,
    ...defaultQueryOptions,
  });
}

/**
 * Hook to fetch a specific business goal by slug
 */
export function useBusinessGoal(slug: string | undefined) {
  return useQuery({
    queryKey: ['businessGoal', slug],
    queryFn: async () => {
      if (!slug) {
        console.warn('[useCMSData] useBusinessGoal called with empty slug');
        return null;
      }
      
      const normalizedSlug = normalizeSlug(slug);
      console.log(`[useCMSData] Looking up business goal with slug: "${normalizedSlug}"`);
      
      try {
        // Try direct lookup first
        const result = await cmsService.getBusinessGoalBySlug(normalizedSlug);
        
        if (result) {
          return result;
        }
        
        // If direct lookup fails, try slug variations
        console.log(`[useCMSData] Direct lookup failed, trying slug variations for: "${normalizedSlug}"`);
        const variations = getSlugVariations(normalizedSlug);
        
        for (const variation of variations) {
          if (variation === normalizedSlug) continue; // Skip the one we already tried
          
          console.log(`[useCMSData] Trying variation: "${variation}"`);
          const resultFromVariation = await cmsService.getBusinessGoalBySlug(variation);
          
          if (resultFromVariation) {
            console.log(`[useCMSData] Found business goal with variation: "${variation}"`);
            return resultFromVariation;
          }
        }
        
        console.warn(`[useCMSData] No business goal found for slug "${normalizedSlug}" or variations`);
        return null;
      } catch (error) {
        console.error(`[useCMSData] Error fetching business goal "${normalizedSlug}":`, error);
        return null;
      }
    },
    enabled: !!slug && slug.trim() !== '',
    ...defaultQueryOptions,
  });
}

/**
 * Hook to fetch all technologies
 */
export function useTechnologies() {
  return useQuery({
    queryKey: ['technologies'],
    queryFn: () => cmsService.getTechnologies(),
    ...defaultQueryOptions,
  });
}

/**
 * Hook to fetch a specific technology by slug
 */
export function useTechnology(slug: string | undefined) {
  return useQuery({
    queryKey: ['technology', slug],
    queryFn: async () => {
      if (!slug) {
        console.warn('[useCMSData] useTechnology called with empty slug');
        return null;
      }
      
      const normalizedSlug = normalizeSlug(slug);
      console.log(`[useCMSData] Looking up technology with slug: "${normalizedSlug}"`);
      
      try {
        // Try direct lookup first
        const result = await cmsService.getTechnologyBySlug(normalizedSlug);
        
        if (result) {
          return result;
        }
        
        // If direct lookup fails, try slug variations
        console.log(`[useCMSData] Direct lookup failed, trying slug variations for: "${normalizedSlug}"`);
        const variations = getSlugVariations(normalizedSlug);
        
        for (const variation of variations) {
          if (variation === normalizedSlug) continue; // Skip the one we already tried
          
          console.log(`[useCMSData] Trying variation: "${variation}"`);
          const resultFromVariation = await cmsService.getTechnologyBySlug(variation);
          
          if (resultFromVariation) {
            console.log(`[useCMSData] Found technology with variation: "${variation}"`);
            return resultFromVariation;
          }
        }
        
        console.warn(`[useCMSData] No technology found for slug "${normalizedSlug}" or variations`);
        return null;
      } catch (error) {
        console.error(`[useCMSData] Error fetching technology "${normalizedSlug}":`, error);
        return null;
      }
    },
    enabled: !!slug && slug.trim() !== '',
    ...defaultQueryOptions,
  });
}
