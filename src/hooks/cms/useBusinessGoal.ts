
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CMSBusinessGoal } from '@/types/cms';
import { normalizeSlug, getCanonicalSlug, resolveSlug } from '@/services/cms/utils/slugMatching';
import { isExpandFootprintSlug } from '@/services/cms/utils/slug/specialCases';

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

      // Log the original slug for debugging
      console.log(`[useBusinessGoal] Original slug received: "${slug}"`);

      // Special case for expand-footprint - early check to ensure it's treated correctly
      if (isExpandFootprintSlug(slug)) {
        console.log(`[useBusinessGoal] Identified as expand-footprint slug pattern: "${slug}"`);
        // Force the canonical slug for this special case
        slug = 'expand-footprint';
      }

      // Use centralized resolveSlug function
      const resolvedSlug = resolveSlug(slug);
      
      console.log(`[useBusinessGoal] Slug resolution: original="${slug}", resolved="${resolvedSlug}"`);
      
      try {
        // Dynamically import to avoid circular dependencies
        const { getBusinessGoalBySlug } = await import('@/services/cms/businessGoals');
        
        // Try direct lookup first with the resolved slug
        console.log(`[useBusinessGoal] Attempting to fetch business goal with resolved slug: "${resolvedSlug}"`);
        const businessGoal = await getBusinessGoalBySlug(resolvedSlug);
        
        if (businessGoal) {
          console.log(`[useBusinessGoal] Successfully loaded business goal: ${businessGoal.title} with slug ${businessGoal.slug}`);
          
          // Add detailed feature logging
          console.log(`[useBusinessGoal] Business goal features:`, 
            Array.isArray(businessGoal.features) 
              ? businessGoal.features.map(f => ({ 
                  id: f.id, 
                  title: f.title, 
                  hasIcon: !!f.icon,
                  hasScreenshot: !!f.screenshot 
                })) 
              : 'No features'
          );
          
          // Add detailed debugging for video
          if (businessGoal.video) {
            console.log(`[useBusinessGoal] Business goal video details:`, {
              id: businessGoal.video.id,
              url: businessGoal.video.url,
              title: businessGoal.video.title
            });
          } else {
            console.log(`[useBusinessGoal] Business goal has no video`);
          }
          
          // Add detailed debugging for recommended machines
          if (businessGoal.recommendedMachines && businessGoal.recommendedMachines.length > 0) {
            console.log(`[useBusinessGoal] Business goal has ${businessGoal.recommendedMachines.length} recommended machines`);
          } else {
            console.log(`[useBusinessGoal] Business goal has no recommended machines`);
          }
          
          return businessGoal;
        }
        
        // If the resolved slug didn't work, try with the original slug
        if (resolvedSlug !== slug) {
          console.log(`[useBusinessGoal] Resolved slug failed, attempting with original slug: "${slug}"`);
          const originalSlugResult = await getBusinessGoalBySlug(slug);
          
          if (originalSlugResult) {
            console.log(`[useBusinessGoal] Found with original slug: ${originalSlugResult.title}`);
            return originalSlugResult;
          }
        }
        
        // Final attempt for expand-footprint - let's be very deliberate
        if (slug === 'expand-footprint' || isExpandFootprintSlug(slug)) {
          console.log('[useBusinessGoal] Final attempt specifically for expand-footprint');
          const expandFootprintGoal = await getBusinessGoalBySlug('expand-footprint');
          if (expandFootprintGoal) {
            console.log('[useBusinessGoal] Found expand-footprint goal in final attempt');
            return expandFootprintGoal;
          }
          
          // If all else fails for expand-footprint, create a fallback
          console.log('[useBusinessGoal] All attempts failed, creating fallback for expand-footprint');
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
                icon: 'trending-up'
              },
              {
                id: 'expandf-2',
                title: 'Flexible Deployment',
                description: 'Place machines in locations impossible for traditional retail',
                icon: 'map'
              },
              {
                id: 'expandf-3',
                title: 'Rapid Market Testing',
                description: 'Quickly test product offerings in new demographic areas',
                icon: 'pie-chart'
              }
            ]
          } as CMSBusinessGoal;
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
    staleTime: 60 * 1000, // 1 minute to allow for more frequent refetching
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    meta: {
      onError: (error: Error) => {
        toast.error(`Error loading business goal: ${error.message}`);
      }
    }
  });
}
