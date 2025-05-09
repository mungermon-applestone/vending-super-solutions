
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
        
        // Now we call fetchBusinessGoals without any parameter since it doesn't expect one
        const businessGoals = await fetchBusinessGoals();
        
        // Apply client-side filtering based on options if needed
        let filteredGoals = businessGoals;
        
        if (options?.visibleOnly) {
          filteredGoals = filteredGoals.filter(goal => goal.visible);
        }
        
        if (options?.showOnHomepageOnly) {
          filteredGoals = filteredGoals.filter(goal => goal.showOnHomepage);
        }
        
        console.log(`[useBusinessGoals] Successfully fetched ${filteredGoals.length} business goals`);
        return filteredGoals;
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
