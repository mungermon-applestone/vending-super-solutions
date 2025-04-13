
import { useQuery } from '@tanstack/react-query';
import { fetchTechnologies, fetchTechnologyBySlug, fetchTechnologyBySlugSafe } from '@/services/cms/contentTypes/technologies';
import { CMSTechnology } from '@/types/cms';
import { DEFAULT_QUERY_OPTIONS } from './cms/useQueryDefaults';
import { QueryOptions } from '@/types/cms';

export function useTechnologySections() {
  // Query to fetch all technologies
  const { data: technologies = [], isLoading, error } = useQuery({
    queryKey: ['technologies'],
    queryFn: async () => {
      const data = await fetchTechnologies();
      return data || [];
    },
    ...DEFAULT_QUERY_OPTIONS
  });

  return { technologies, isLoading, error };
}

// Hook to fetch a specific technology by slug
export function useTechnologyBySlug(slug: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['technology', slug],
    queryFn: async () => {
      if (!slug) return null;
      return await fetchTechnologyBySlugSafe(slug);
    },
    enabled: !!slug,
    ...DEFAULT_QUERY_OPTIONS
  });

  return { technology: data, isLoading, error };
}
