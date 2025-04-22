
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchBusinessGoals, fetchBusinessGoalBySlug } from '@/services/cms/contentTypes/businessGoals';
import { CMSBusinessGoal } from '@/types/cms';

/**
 * Hook for fetching all business goals
 */
export const useBusinessGoals = () => {
  return useQuery({
    queryKey: ['business-goals'],
    queryFn: async () => {
      try {
        return await fetchBusinessGoals();
      } catch (error) {
        console.error('Error fetching business goals:', error);
        throw error;
      }
    },
  });
};

/**
 * Hook for fetching a single business goal by slug
 */
export const useBusinessGoalBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['business-goals', slug],
    queryFn: async () => {
      try {
        return await fetchBusinessGoalBySlug(slug);
      } catch (error) {
        console.error(`Error fetching business goal (${slug}):`, error);
        throw error;
      }
    },
    enabled: !!slug,
  });
};
