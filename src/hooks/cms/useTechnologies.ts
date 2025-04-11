
import { useQuery } from '@tanstack/react-query';
import * as cmsService from '@/services/cms';
import { CMSTechnology } from '@/types/cms';
import { normalizeSlug, getSlugVariations } from '@/services/cms/utils/slugMatching';
import { createQueryOptions } from './useQueryDefaults';

/**
 * Hook to fetch all technologies
 */
export function useTechnologies() {
  return useQuery({
    queryKey: ['technologies'],
    queryFn: () => cmsService.getTechnologies(),
    ...createQueryOptions<CMSTechnology[]>()
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
        console.warn('[useTechnology] Called with empty slug');
        return null;
      }
      
      const normalizedSlug = normalizeSlug(slug);
      console.log(`[useTechnology] Looking up technology with slug: "${normalizedSlug}"`);
      
      try {
        // Try direct lookup first
        const result = await cmsService.getTechnologyBySlug(normalizedSlug);
        
        if (result) {
          return result;
        }
        
        // If direct lookup fails, try slug variations
        console.log(`[useTechnology] Direct lookup failed, trying slug variations for: "${normalizedSlug}"`);
        const variations = getSlugVariations(normalizedSlug);
        
        for (const variation of variations) {
          if (variation === normalizedSlug) continue; // Skip the one we already tried
          
          console.log(`[useTechnology] Trying variation: "${variation}"`);
          const resultFromVariation = await cmsService.getTechnologyBySlug(variation);
          
          if (resultFromVariation) {
            console.log(`[useTechnology] Found technology with variation: "${variation}"`);
            return resultFromVariation;
          }
        }
        
        console.warn(`[useTechnology] No technology found for slug "${normalizedSlug}" or variations`);
        return null;
      } catch (error) {
        console.error(`[useTechnology] Error fetching technology "${normalizedSlug}":`, error);
        return null;
      }
    },
    enabled: !!slug && slug.trim() !== '',
    ...createQueryOptions<CMSTechnology | null>()
  });
}
