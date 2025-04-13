
import { useQuery } from '@tanstack/react-query';
import { fetchTechnologies, fetchTechnologyBySlug } from '@/services/cms/technology';
import { CMSTechnology } from '@/types/cms';

export function useTechnologySections() {
  // Query to fetch all technologies
  const { data: technologies = [], isLoading, error } = useQuery({
    queryKey: ['technologies'],
    queryFn: async () => {
      try {
        const data = await fetchTechnologies();
        return data || [];
      } catch (err) {
        console.error('Error fetching technologies:', err);
        return [];
      }
    }
  });

  return { technologies, isLoading, error };
}

// Hook to fetch a specific technology by slug
export function useTechnologyBySlug(slug: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['technology', slug],
    queryFn: async () => {
      if (!slug) return null;
      try {
        return await fetchTechnologyBySlug(slug);
      } catch (err) {
        console.error(`Error fetching technology with slug ${slug}:`, err);
        return null;
      }
    },
    enabled: !!slug
  });

  return { technology: data, isLoading, error };
}
