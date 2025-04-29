
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSBusinessGoal } from '@/types/cms';

interface FeaturedBusinessGoalsContent {
  title: string;
  description?: string;
  businessGoals: CMSBusinessGoal[];
}

export function useFeaturedBusinessGoalsContent() {
  return useQuery({
    queryKey: ['contentful', 'featuredBusinessGoalsContent'],
    queryFn: async () => {
      try {
        console.log('[useFeaturedBusinessGoalsContent] Fetching content');
        const client = await getContentfulClient();
        
        const entries = await client.getEntries({
          content_type: 'featuredBusinessGoas',
          limit: 1,
          include: 2
        });
        
        if (!entries.items[0]) {
          console.warn('[useFeaturedBusinessGoalsContent] No entries found');
          return null;
        }

        const fields = entries.items[0].fields;
        console.log('[useFeaturedBusinessGoalsContent] Entry found with fields:', fields);
        
        return {
          title: fields.title as string,
          description: fields.description as string | undefined,
          businessGoals: (fields.businessGoals as any[]).map((goal: any) => ({
            id: goal.sys?.id,
            title: goal.fields.title,
            description: goal.fields.description,
            slug: goal.fields.slug,
            icon: goal.fields.icon,
            image: goal.fields.image ? {
              id: goal.fields.image.sys?.id,
              url: goal.fields.image.fields?.file?.url,
              alt: goal.fields.image.fields?.title || goal.fields.title
            } : undefined,
            visible: goal.fields.visible !== false
          }))
        } as FeaturedBusinessGoalsContent;
      } catch (error) {
        console.error('[useFeaturedBusinessGoalsContent] Error fetching content:', error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
