
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchLandingPages, fetchLandingPageByKey, createLandingPage, updateLandingPage, deleteLandingPage } from '@/services/cms/contentTypes/landingPages';
import { LandingPage, LandingPageFormData } from '@/types/landingPage';

/**
 * Hook for fetching all landing pages
 */
export const useLandingPages = () => {
  return useQuery({
    queryKey: ['landing-pages'],
    queryFn: async () => {
      try {
        return await fetchLandingPages();
      } catch (error) {
        console.error('Error fetching landing pages:', error);
        throw error;
      }
    },
  });
};

/**
 * Hook for fetching a single landing page by key
 */
export const useLandingPageByKey = (key: string) => {
  return useQuery({
    queryKey: ['landing-pages', key],
    queryFn: async () => {
      try {
        return await fetchLandingPageByKey(key);
      } catch (error) {
        console.error(`Error fetching landing page (${key}):`, error);
        throw error;
      }
    },
    enabled: !!key,
  });
};

/**
 * Hook for creating a new landing page
 */
export const useCreateLandingPage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LandingPageFormData) => {
      try {
        const result = await createLandingPage(data);
        return result as LandingPage;
      } catch (error) {
        console.error('Error creating landing page:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
      toast.success('Landing page created successfully');
    },
  });
};

/**
 * Hook for updating an existing landing page
 */
export const useUpdateLandingPage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LandingPageFormData> }) => {
      try {
        const result = await updateLandingPage(id, data);
        return result as unknown as LandingPage; // Convert return type
      } catch (error) {
        console.error(`Error updating landing page (${id}):`, error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
      queryClient.invalidateQueries({ queryKey: ['landing-pages', variables.id] });
      toast.success('Landing page updated successfully');
    },
  });
};

/**
 * Hook for deleting a landing page
 */
export const useDeleteLandingPage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await deleteLandingPage(id);
      } catch (error) {
        console.error(`Error deleting landing page (${id}):`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
      toast.success('Landing page deleted successfully');
    },
  });
};
