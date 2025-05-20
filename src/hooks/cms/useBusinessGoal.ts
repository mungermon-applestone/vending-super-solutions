
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
        // Changed the import path to match the pattern in useBusinessGoals.ts
        const { fetchBusinessGoalBySlug } = await import('@/services/cms/contentTypes/businessGoals');
        
        // Try to fetch using resolved slug
        let businessGoal = await fetchBusinessGoalBySlug(resolvedSlug);
        
        // If not found and resolved is different from normalized, try with normalized
        const normalizedSlug = normalizeSlug(slug);
        if (!businessGoal && resolvedSlug !== normalizedSlug) {
          console.log(`[useBusinessGoal] Not found with resolved slug, trying normalized slug`);
          businessGoal = await fetchBusinessGoalBySlug(normalizedSlug);
        }
        
        // If still not found, try with original slug as last resort
        if (!businessGoal && normalizedSlug !== slug) {
          console.log(`[useBusinessGoal] Not found with normalized slug, trying original slug`);
          businessGoal = await fetchBusinessGoalBySlug(slug);
        }
        
        if (!businessGoal) {
          console.error(`[useBusinessGoal] No business goal found with any slug variation:`, {
            original: slug,
            normalized: normalizedSlug,
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
    retry: 1, // Only retry once to avoid hammering the API
    meta: {
      onError: (error: Error) => {
        toast.error(`Error loading business goal: ${error.message}`);
      }
    }
  });
}
