
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchTechnologies, fetchTechnologyBySlug } from '@/services/cms/contentTypes/technologies';
import { CMSTechnology } from '@/types/cms';

/**
 * Hook for fetching all technologies
 */
export const useTechnologies = () => {
  return useQuery({
    queryKey: ['technologies'],
    queryFn: async () => {
      try {
        return await fetchTechnologies();
      } catch (error) {
        console.error('Error fetching technologies:', error);
        throw error;
      }
    },
  });
};

/**
 * Hook for fetching a single technology by slug
 */
export const useTechnologyBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['technologies', slug],
    queryFn: async () => {
      try {
        return await fetchTechnologyBySlug(slug);
      } catch (error) {
        console.error(`Error fetching technology (${slug}):`, error);
        throw error;
      }
    },
    enabled: !!slug,
  });
};
