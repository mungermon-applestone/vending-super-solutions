
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CMSBusinessGoal } from '@/types/cms';
import { normalizeSlug, getCanonicalSlug, resolveSlug } from '@/services/cms/utils/slugMatching';

/**
 * Custom hook to fetch a single business goal by slug
 */
export function useBusinessGoal(slug: string | undefined) {
  return useQuery({
    queryKey: ['businessGoal', slug],
    queryFn: async () => {
      if (!slug) {
        console.error('[useBusinessGoal] No slug provided');
        throw new Error('Business goal slug is required');
      }

      // Use centralized resolveSlug function
      const resolvedSlug = resolveSlug(slug);
      
      console.log(`[useBusinessGoal] Fetching business goal with slug: "${slug}"`);
      console.log(`[useBusinessGoal] Resolved slug: "${resolvedSlug}"`);
      
      try {
        // Dynamically import to avoid circular dependencies
        const { getBusinessGoalBySlug } = await import('@/services/cms/businessGoals');
        
        // Try direct method first
        console.log(`[useBusinessGoal] Attempting direct fetch with resolved slug: "${resolvedSlug}"`);
        let businessGoal = await getBusinessGoalBySlug(resolvedSlug);
        
        // If not found and resolved is different from original, try with original
        if (!businessGoal && resolvedSlug !== slug) {
          console.log(`[useBusinessGoal] Not found with resolved slug, trying original slug: "${slug}"`);
          businessGoal = await getBusinessGoalBySlug(slug);
        }
        
        // If still not found, try fallback methods
        if (!businessGoal) {
          console.log('[useBusinessGoal] Trying fallback methods for slug lookup');
          // Try normalized slug as another option
          const normalizedSlug = normalizeSlug(slug);
          if (normalizedSlug !== resolvedSlug && normalizedSlug !== slug) {
            console.log(`[useBusinessGoal] Trying normalized slug: "${normalizedSlug}"`);
            businessGoal = await getBusinessGoalBySlug(normalizedSlug);
          }
          
          // Final attempt - try direct import from contentful operation
          if (!businessGoal) {
            console.log('[useBusinessGoal] Last attempt - using direct contentful operation');
            const { fetchBusinessGoalBySlug } = await import('@/services/cms/contentTypes/businessGoals/fetchBusinessGoalBySlug');
            businessGoal = await fetchBusinessGoalBySlug(slug);
          }
        }
        
        if (!businessGoal) {
          console.error(`[useBusinessGoal] No business goal found with any slug variation:`, {
            original: slug,
            resolved: resolvedSlug
          });
          throw new Error(`Business goal not found: ${slug}`);
        }
        
        console.log(`[useBusinessGoal] Successfully fetched business goal: ${businessGoal.title}`);
        return businessGoal;
      } catch (error) {
        console.error(`[useBusinessGoal] Error fetching business goal with slug "${slug}":`, error);
        throw error;
      }
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to improve performance
    retry: 2, // Retry twice to improve chances of success
    meta: {
      onError: (error: Error) => {
        toast.error(`Error loading business goal: ${error.message}`);
      }
    }
  });
}
