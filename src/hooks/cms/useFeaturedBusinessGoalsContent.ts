
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSBusinessGoal } from '@/types/cms';

interface FeaturedBusinessGoalsContent {
  title: string;
  description: string;
  businessGoals: CMSBusinessGoal[];
}

export function useFeaturedBusinessGoalsContent() {
  return useQuery({
    queryKey: ['contentful', 'featuredBusinessGoalsContent'],
    queryFn: async () => {
      const client = await getContentfulClient();
      const entries = await client.getEntries({
        content_type: 'featuredBusinessGoas',
        limit: 1,
        include: 2
      });
      
      if (!entries.items[0]) {
        return null;
      }

      const fields = entries.items[0].fields;
      
      return {
        title: fields.title as string,
        description: fields.description as string,
        businessGoals: (fields.businessGoals as any[]).map((goal: any) => ({
          id: goal.sys?.id,
          title: goal.fields.title,
          description: goal.fields.description,
          slug: goal.fields.slug,
          icon: goal.fields.icon,
          visible: goal.fields.visible !== false
        }))
      } as FeaturedBusinessGoalsContent;
    }
  });
}
