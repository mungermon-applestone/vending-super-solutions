
import { useQuery } from '@tanstack/react-query';
import { fetchTechnologyBySlug } from '@/services/cms/contentTypes/technologies';

export const useTechnologyData = (slug: string) => {
  return useQuery({
    queryKey: ['technology', slug],
    queryFn: async () => {
      try {
        const technology = await fetchTechnologyBySlug(slug);
        return technology;
      } catch (error) {
        console.error(`Error fetching technology data for slug: ${slug}`, error);
        throw error;
      }
    },
    enabled: !!slug,
  });
};
