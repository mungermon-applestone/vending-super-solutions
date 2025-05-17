
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { contentfulClient } from '@/lib/contentful';
import { transformTechnologyEntry } from '@/hooks/cms/transformers/technologyTransformer';

export type TechnologiesQueryFilter = {
  featured?: boolean;
  limit?: number;
  slug?: string;
};

/**
 * Hook for fetching technologies from Contentful
 * 
 * @param filters Optional filters for the query
 * @param options Additional React Query options
 * @returns Query result with technologies
 */
export const useContentfulTechnologies = (
  filters?: TechnologiesQueryFilter,
  options?: UseQueryOptions
) => {
  return useQuery({
    queryKey: ['contentful', 'technologies', filters],
    queryFn: async () => {
      try {
        const contentTypeId = 'technology';
        
        // Build query parameters
        const queryParams: any = {
          content_type: contentTypeId,
          include: 2, // Include linked entries/assets up to 2 levels deep
        };
        
        // Add filters if provided
        if (filters) {
          if (filters.featured !== undefined) {
            queryParams['fields.featured'] = filters.featured;
          }
          
          if (filters.slug) {
            queryParams['fields.slug'] = filters.slug;
          }
          
          if (filters.limit) {
            queryParams.limit = filters.limit;
          }
        }
        
        const response = await contentfulClient.getEntries(queryParams);
        
        if (response.items.length === 0) {
          return [];
        }
        
        // Transform Contentful entries to our data model
        return response.items.map(entry => transformTechnologyEntry(entry));
      } catch (error) {
        console.error('[useContentfulTechnologies] Error fetching technologies:', error);
        throw new Error(`Failed to fetch technologies: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    ...options
  });
};
