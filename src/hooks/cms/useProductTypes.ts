
import { useQuery } from '@tanstack/react-query';
import * as cmsService from '@/services/cms/products';
import { CMSProductType } from '@/types/cms';
import { normalizeSlug, getSlugVariations } from '@/services/cms/utils/slugMatching';
import { createQueryOptions } from './useQueryDefaults';

/**
 * Hook to fetch all product types
 */
export function useProductTypes() {
  return useQuery({
    queryKey: ['productTypes'],
    queryFn: cmsService.getProductTypes,
    ...createQueryOptions<CMSProductType[]>({
      meta: {
        onError: (err: any) => {
          console.error('[useProductTypes] Error fetching product types:', err);
        }
      }
    })
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
    ...createQueryOptions<CMSProductType | null>()
  });
}
