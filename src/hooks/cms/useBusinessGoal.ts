
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
        
        // Special handling for expand-footprint - this is our highest priority business goal
        // so we have a dedicated code path for it
        if (slug === 'expand-footprint' || (slug.includes('expand') && slug.includes('footprint'))) {
          console.log('[useBusinessGoal] Using special handling for expand-footprint');
          const businessGoal = await getBusinessGoalBySlug('expand-footprint');
          
          if (businessGoal) {
            console.log(`[useBusinessGoal] Successfully loaded expand-footprint: ${businessGoal.title}`);
            return businessGoal;
          } else {
            console.log('[useBusinessGoal] No data returned from special handling, returning hardcoded fallback');
            // If the CMS fetch fails, return a hardcoded fallback to ensure this critical content is always available
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
        }
        
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
            try {
              businessGoal = await fetchBusinessGoalBySlug(slug);
            } catch (err) {
              console.error('[useBusinessGoal] Error in last attempt fetch:', err);
            }
          }
        }
        
        if (!businessGoal) {
          console.error(`[useBusinessGoal] No business goal found with any slug variation:`, {
            original: slug,
            resolved: resolvedSlug
          });
          
          // Special hardcoded fallback for expand-footprint
          if (slug === 'expand-footprint' || slug.includes('expand') && slug.includes('footprint')) {
            console.log('[useBusinessGoal] No data found, returning hardcoded expand-footprint fallback');
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
          
          throw new Error(`Business goal not found: ${slug}`);
        }
        
        console.log(`[useBusinessGoal] Successfully fetched business goal: ${businessGoal.title}`);
        return businessGoal;
      } catch (error) {
        console.error(`[useBusinessGoal] Error fetching business goal with slug "${slug}":`, error);
        
        // Special case handling for the critical expand-footprint goal
        if (slug === 'expand-footprint' || (slug.includes('expand') && slug.includes('footprint'))) {
          console.log('[useBusinessGoal] Error occurred but returning hardcoded fallback for expand-footprint');
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
        
        throw error;
      }
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to improve performance
    retry: 3, // Increase retries for this critical content
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    meta: {
      onError: (error: Error) => {
        if (slug === 'expand-footprint') {
          toast.error("We're experiencing an issue loading this content. Our team has been notified.");
        } else {
          toast.error(`Error loading business goal: ${error.message}`);
        }
      }
    }
  });
}
