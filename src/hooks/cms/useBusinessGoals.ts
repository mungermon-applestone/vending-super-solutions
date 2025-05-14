
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { CMSBusinessGoal } from '@/types/cms';
import { normalizeSlug, getSlugVariations } from '@/services/cms/utils/slugMatching';
import { transformBusinessGoal } from './transformers/businessGoalTransformer';

/**
 * Hook to fetch all business goals
 */
export function useBusinessGoals(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ['businessGoals', filters],
    queryFn: async () => {
      try {
        // Convert filters to Contentful query params
        const queryParams = filters ? {
          ...(filters.visible !== undefined ? { 'fields.visible': filters.visible } : {}),
          ...(filters.showOnHomepage ? { 'fields.showOnHomepage': true } : {})
        } : {};
        
        // Add default ordering
        const params = {
          order: 'fields.displayOrder,fields.title',
          ...queryParams
        };
        
        // Fetch business goals from Contentful
        const entries = await fetchContentfulEntries('businessGoal', params);
        
        if (!entries || !Array.isArray(entries)) {
          return [];
        }
        
        // Transform entries to our application format
        return entries.map(entry => transformBusinessGoal(entry)).filter(Boolean) as CMSBusinessGoal[];
      } catch (error) {
        console.error('Error fetching business goals:', error);
        throw error;
      }
    }
  });
}

/**
 * Hook to fetch a specific business goal by slug
 */
export function useBusinessGoal(slug: string | undefined) {
  return useQuery({
    queryKey: ['businessGoal', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const normalizedSlug = normalizeSlug(slug);
      console.log(`[useBusinessGoal] Looking up business goal with slug: "${normalizedSlug}"`);
      
      try {
        // Try direct lookup first
        const entries = await fetchContentfulEntries('businessGoal', {
          'fields.slug': normalizedSlug,
          limit: 1
        });
        
        // Check if we found a match
        if (entries && entries.length > 0) {
          return transformBusinessGoal(entries[0]);
        }
        
        // If not found, try slug variations
        console.log(`[useBusinessGoal] Direct lookup failed, trying variations for: "${normalizedSlug}"`);
        const variations = getSlugVariations(normalizedSlug);
        
        for (const variation of variations) {
          if (variation === normalizedSlug) continue; // Skip the one we already tried
          
          console.log(`[useBusinessGoal] Trying variation: "${variation}"`);
          const entriesFromVariation = await fetchContentfulEntries('businessGoal', {
            'fields.slug': variation,
            limit: 1
          });
          
          if (entriesFromVariation && entriesFromVariation.length > 0) {
            console.log(`[useBusinessGoal] Found with variation: "${variation}"`);
            return transformBusinessGoal(entriesFromVariation[0]);
          }
        }
        
        console.log(`[useBusinessGoal] No business goal found for slug "${normalizedSlug}" or variations`);
        return null;
      } catch (error) {
        console.error(`[useBusinessGoal] Error fetching business goal with slug "${normalizedSlug}":`, error);
        throw error;
      }
    },
    enabled: !!slug
  });
}
