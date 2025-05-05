
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
        
        // Try direct lookup first - always attempt to get the real content
        const businessGoal = await getBusinessGoalBySlug(resolvedSlug);
        
        if (businessGoal) {
          console.log(`[useBusinessGoal] Successfully loaded business goal: ${businessGoal.title}`);
          return businessGoal;
        }
        
        // If the resolved slug didn't work, try with the original slug
        if (resolvedSlug !== slug) {
          console.log(`[useBusinessGoal] Attempting with original slug: "${slug}"`);
          const originalSlugResult = await getBusinessGoalBySlug(slug);
          
          if (originalSlugResult) {
            console.log(`[useBusinessGoal] Found with original slug: ${originalSlugResult.title}`);
            return originalSlugResult;
          }
        }
        
        // Final attempt - try direct import from contentful operation
        console.log('[useBusinessGoal] Last attempt - using direct contentful operation');
        const { fetchBusinessGoalBySlug } = await import('@/services/cms/contentTypes/businessGoals/fetchBusinessGoalBySlug');
        try {
          const directResult = await fetchBusinessGoalBySlug(slug);
          if (directResult) {
            console.log(`[useBusinessGoal] Found via direct operation: ${directResult.title}`);
            return directResult;
          }
        } catch (err) {
          console.error('[useBusinessGoal] Error in direct fetch:', err);
        }
        
        // Special case for expand-footprint - this is implemented as the last resort
        if (slug === 'expand-footprint' || (slug.includes('expand') && slug.includes('footprint'))) {
          console.log('[useBusinessGoal] Using special handling for expand-footprint');
          
          // Create a fallback if nothing is found
          console.log(`[useBusinessGoal] No content found, using fallback for expand-footprint as last resort`);
          return {
            id: 'expand-footprint-fallback',
            slug: 'expand-footprint',
            title: 'Expand Your Footprint',
            description: 'Grow your retail presence with automated smart vending solutions.',
            visible: true,
            icon: 'map',
            benefits: [
              'Expand to new locations without traditional store overhead',
              'Reach customers in high-traffic areas with minimal space requirements',
              'Test new markets with lower investment risk',
              'Scale your retail footprint faster than traditional stores',
              'Operate 24/7 without additional staffing costs'
            ],
            features: [
              {
                id: 'expandf-1',
                title: 'Lower Entry Costs',
                description: 'Automated retail machines cost a fraction of traditional store openings',
                icon: 'trending-up',
                display_order: 1
              },
              {
                id: 'expandf-2',
                title: 'Flexible Deployment',
                description: 'Place machines in locations impossible for traditional retail',
                icon: 'map',
                display_order: 2
              },
              {
                id: 'expandf-3',
                title: 'Rapid Market Testing',
                description: 'Quickly test product offerings in new demographic areas',
                icon: 'pie-chart',
                display_order: 3
              }
            ]
          };
        }
        
        console.error(`[useBusinessGoal] No business goal found with any slug variation:`, {
          original: slug,
          resolved: resolvedSlug
        });
        
        throw new Error(`Business goal not found: ${slug}`);
      } catch (error) {
        console.error(`[useBusinessGoal] Error fetching business goal with slug "${slug}":`, error);
        throw error;
      }
    },
    enabled: !!slug,
    staleTime: 60 * 1000, // Reduced to 1 minute to allow for more frequent refetching
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    meta: {
      onError: (error: Error) => {
        toast.error(`Error loading business goal: ${error.message}`);
      }
    }
  });
}
