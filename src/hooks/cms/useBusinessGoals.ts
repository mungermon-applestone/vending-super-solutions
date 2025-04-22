
import { useQuery } from '@tanstack/react-query';
import * as cmsService from '@/services/cms';
import { CMSBusinessGoal } from '@/types/cms';
import { normalizeSlug, getSlugVariations } from '@/services/cms/utils/slugMatching';
import { createQueryOptions } from './useQueryDefaults';

/**
 * Hook to fetch all business goals
 */
export function useBusinessGoals() {
  return useQuery({
    queryKey: ['businessGoals'],
    queryFn: cmsService.getBusinessGoals,
    ...createQueryOptions<CMSBusinessGoal[]>()
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
        console.warn('[useBusinessGoal] Called with empty slug');
        return null;
      }
      
      const normalizedSlug = normalizeSlug(slug);
      console.log(`[useBusinessGoal] Looking up business goal with slug: "${normalizedSlug}"`);
      
      try {
        // Try direct lookup first
        const result = await cmsService.getBusinessGoalBySlug(normalizedSlug);
        
        if (result) {
          return result;
        }
        
        // If direct lookup fails, try slug variations
        console.log(`[useBusinessGoal] Direct lookup failed, trying slug variations for: "${normalizedSlug}"`);
        const variations = getSlugVariations(normalizedSlug);
        
        for (const variation of variations) {
          if (variation === normalizedSlug) continue; // Skip the one we already tried
          
          console.log(`[useBusinessGoal] Trying variation: "${variation}"`);
          const resultFromVariation = await cmsService.getBusinessGoalBySlug(variation);
          
          if (resultFromVariation) {
            console.log(`[useBusinessGoal] Found business goal with variation: "${variation}"`);
            return resultFromVariation;
          }
        }
        
        console.warn(`[useBusinessGoal] No business goal found for slug "${normalizedSlug}" or variations`);
        return null;
      } catch (error) {
        console.error(`[useBusinessGoal] Error fetching business goal "${normalizedSlug}":`, error);
        return null;
      }
    },
    enabled: !!slug && slug.trim() !== '',
    ...createQueryOptions<CMSBusinessGoal | null>()
  });
}
