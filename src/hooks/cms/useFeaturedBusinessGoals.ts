
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSBusinessGoal } from '@/types/cms';

export function useFeaturedBusinessGoals(entryId: string) {
  return useQuery({
    queryKey: ['contentful', 'featuredBusinessGoals', entryId],
    queryFn: async () => {
      console.log('[useFeaturedBusinessGoals] Fetching featured goals');
      try {
        const client = await getContentfulClient();
        const entry = await client.getEntry(entryId);
        
        if (!entry || !entry.fields.businessGoals) {
          return [];
        }

        const goals = entry.fields.businessGoals as any[];
        return goals.map(goal => ({
          id: goal.sys?.id,
          title: goal.fields.title,
          description: goal.fields.description,
          icon: goal.fields.icon,
          slug: goal.fields.slug
        })) as CMSBusinessGoal[];
      } catch (error) {
        console.error('[useFeaturedBusinessGoals] Error:', error);
        return [];
      }
    }
  });
}
