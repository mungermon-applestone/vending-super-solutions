
import { CMSTechnology } from '@/types/cms';
import { useCMSQuery } from './useCMSQuery';
import { improvedTechnologyAdapter } from '@/services/cms/adapters/technologies/improvedTechnologyAdapter';
import { useQuery } from '@tanstack/react-query';
import { useContentfulTechnology } from './cms/useContentfulTechnology';

type UseTechnologySectionsOptions = {
  slug?: string;
  enableToasts?: boolean;
  refetchInterval?: number | false;
};

/**
 * Custom hook to fetch technologies with sections
 */
export function useTechnologySections(options: UseTechnologySectionsOptions = {}) {
  const { slug, enableToasts = false, refetchInterval = false } = options;
  
  // Try to get data from Contentful first
  const contentfulQuery = useContentfulTechnology();
  
  // Fall back to Supabase if needed
  const fetchAllTechnologies = async () => {
    console.log('[useTechnologySections] Fetching all technologies');
    try {
      const technologies = await improvedTechnologyAdapter.getAll();
      console.log('[useTechnologySections] Retrieved technologies from Supabase:', technologies);
      return technologies;
    } catch (error) {
      console.error('[useTechnologySections] Error fetching technologies from Supabase:', error);
      throw error;
    }
  };
  
  const supabaseQuery = useCMSQuery<CMSTechnology[]>({
    queryKey: ['technologies-supabase'],
    queryFn: fetchAllTechnologies,
    enableToasts,
    refetchInterval,
    initialData: []
  });
  
  // Combine results, preferring Contentful data if available
  const data = contentfulQuery.data && contentfulQuery.data.length > 0 
    ? contentfulQuery.data 
    : supabaseQuery.data || [];
  
  const isLoading = contentfulQuery.isLoading || supabaseQuery.isLoading;
  const error = contentfulQuery.error || supabaseQuery.error;
  
  console.log('[useTechnologySections] Combined data:', {
    contentful: contentfulQuery.data,
    supabase: supabaseQuery.data,
    final: data
  });
  
  return {
    technologies: data,
    isLoading,
    error,
    refetch: () => {
      contentfulQuery.refetch();
      supabaseQuery.refetch();
    }
  };
}

export default useTechnologySections;

export function useTechnologyBySlug(slug: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['technology', slug],
    queryFn: async () => {
      if (!slug) return null;
      try {
        const { fetchTechnologyBySlug } = await import('@/services/cms/contentTypes/technologies');
        const technology = await fetchTechnologyBySlug(slug);
        console.log(`[useTechnologyBySlug] Fetched technology with slug "${slug}":`, technology);
        return technology;
      } catch (err) {
        console.error(`[useTechnologyBySlug] Error fetching technology with slug ${slug}:`, err);
        return null;
      }
    },
    enabled: !!slug
  });

  return { technology: data, isLoading, error };
}
