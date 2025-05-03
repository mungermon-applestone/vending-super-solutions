
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CMSBusinessGoal } from '@/types/cms';
import { normalizeSlug } from '@/services/cms/utils/slugMatching';

/**
 * Custom hook to fetch a single business goal by slug
 */
export function useBusinessGoal(slug: string | undefined) {
  return useQuery({
    queryKey: ['businessGoal', slug],
    queryFn: async () => {
      if (!slug) {
        throw new Error('Business goal slug is required');
      }

      const normalizedSlug = normalizeSlug(slug);
      console.log(`[useBusinessGoal] Fetching business goal with slug: "${normalizedSlug}"`);
      
      try {
        // Dynamically import to avoid circular dependencies
        const { fetchBusinessGoalBySlug } = await import('@/services/cms/contentTypes/businessGoals/fetchBusinessGoalBySlug');
        const businessGoal = await fetchBusinessGoalBySlug(normalizedSlug);
        
        if (!businessGoal) {
          console.error(`[useBusinessGoal] No business goal found with slug: "${normalizedSlug}"`);
          throw new Error(`Business goal not found: ${normalizedSlug}`);
        }
        
        console.log(`[useBusinessGoal] Successfully fetched business goal: ${businessGoal.title}`);
        return businessGoal;
      } catch (error) {
        console.error(`[useBusinessGoal] Error fetching business goal with slug "${normalizedSlug}":`, error);
        throw error;
      }
    },
    enabled: !!slug,
    retry: 1,
    meta: {
      onError: (error: Error) => {
        toast.error(`Error loading business goal: ${error.message}`);
      }
    }
  });
}

