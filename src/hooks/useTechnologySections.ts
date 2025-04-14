import { CMSTechnology } from '@/types/cms';
import { useCMSQuery } from './useCMSQuery';
import { improvedTechnologyAdapter } from '@/services/cms/adapters/technologies/improvedTechnologyAdapter';

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
  
  // If slug is provided, fetch a single technology by slug
  if (slug) {
    const fetchTechnology = async () => {
      console.log(`[useTechnologySections] Fetching technology by slug: ${slug}`);
      const technology = await improvedTechnologyAdapter.getBySlug(slug);
      
      if (!technology) {
        throw new Error(`Technology with slug "${slug}" not found`);
      }
      
      return technology;
    };
    
    const query = useCMSQuery<CMSTechnology>({
      queryKey: ['technology', slug],
      queryFn: fetchTechnology,
      enableToasts,
      refetchInterval
    });
    
    return {
      technology: query.data,
      isLoading: query.isLoading,
      error: query.error,
      refetch: query.refetch
    };
  }
  
  // Otherwise, fetch all technologies
  const fetchAllTechnologies = async () => {
    console.log('[useTechnologySections] Fetching all technologies');
    try {
      const technologies = await improvedTechnologyAdapter.getAll();
      return technologies;
    } catch (error) {
      console.error('[useTechnologySections] Error fetching technologies:', error);
      throw error;
    }
  };
  
  const query = useCMSQuery<CMSTechnology[]>({
    queryKey: ['technologies'],
    queryFn: fetchAllTechnologies,
    enableToasts,
    refetchInterval,
    initialData: []
  });
  
  return {
    technologies: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}

export default useTechnologySections;

export function useTechnologyBySlug(slug: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['technology', slug],
    queryFn: async () => {
      if (!slug) return null;
      try {
        const { fetchTechnologyBySlug } = await import('@/services/cms/technology');
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
