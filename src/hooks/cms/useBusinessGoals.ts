
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CMSBusinessGoal } from '@/types/cms';

/**
 * Custom hook to fetch all business goals
 */
export function useBusinessGoals(options?: { 
  visibleOnly?: boolean,
  showOnHomepageOnly?: boolean 
}) {
  return useQuery({
    queryKey: ['businessGoals', options],
    queryFn: async () => {
      console.log('[useBusinessGoals] Fetching business goals with options:', options);
      
      try {
        // Dynamically import to avoid circular dependencies
        const { fetchBusinessGoals } = await import('@/services/cms/contentTypes/businessGoals');
        
        const filters: Record<string, any> = {};
        
        if (options?.visibleOnly) {
          filters.visible = true;
        }
        
        if (options?.showOnHomepageOnly) {
          filters.showOnHomepage = true;
        }
        
        const businessGoals = await fetchBusinessGoals({ 
          filters,
          sort: options?.showOnHomepageOnly ? 'homepage_order' : 'display_order'
        });
        
        console.log(`[useBusinessGoals] Successfully fetched ${businessGoals.length} business goals`);
        return businessGoals;
      } catch (error) {
        console.error('[useBusinessGoals] Error fetching business goals:', error);
        throw error;
      }
    },
    retry: 1,
    meta: {
      onError: (error: Error) => {
        toast.error(`Error loading business goals: ${error.message}`);
      }
    }
  });
}
