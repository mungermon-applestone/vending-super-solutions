
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CMSBusinessGoal } from '@/types/cms';
import { normalizeSlug, getCanonicalSlug } from '@/services/cms/utils/slugMatching';

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

      const normalizedSlug = normalizeSlug(slug);
      const canonicalSlug = getCanonicalSlug(normalizedSlug);
      
      console.log(`[useBusinessGoal] Fetching business goal with slug: "${slug}"`);
      console.log(`[useBusinessGoal] Normalized slug: "${normalizedSlug}"`);
      console.log(`[useBusinessGoal] Canonical slug: "${canonicalSlug}"`);
      
      try {
        // Dynamically import to avoid circular dependencies
        const { fetchBusinessGoalBySlug } = await import('@/services/cms/contentTypes/businessGoals/fetchBusinessGoalBySlug');
        
        // Try to fetch using canonical slug first
        let businessGoal = await fetchBusinessGoalBySlug(canonicalSlug);
        
        // If not found with canonical slug and it's different from normalized, try with normalized
        if (!businessGoal && canonicalSlug !== normalizedSlug) {
          console.log(`[useBusinessGoal] Not found with canonical slug, trying normalized slug`);
          businessGoal = await fetchBusinessGoalBySlug(normalizedSlug);
        }
        
        // If still not found, try with original slug as last resort
        if (!businessGoal && slug !== normalizedSlug) {
          console.log(`[useBusinessGoal] Not found with normalized slug, trying original slug`);
          businessGoal = await fetchBusinessGoalBySlug(slug);
        }
        
        if (!businessGoal) {
          console.error(`[useBusinessGoal] No business goal found with any slug variation:`, {
            original: slug,
            normalized: normalizedSlug,
            canonical: canonicalSlug
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
    retry: 2,
    meta: {
      onError: (error: Error) => {
        toast.error(`Error loading business goal: ${error.message}`);
      }
    }
  });
}
