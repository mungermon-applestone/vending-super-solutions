
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LandingPage, LandingPageFormData } from '@/types/landingPage';
import { fetchLandingPages, fetchLandingPageByKey, createLandingPage, updateLandingPage, deleteLandingPage } from '@/services/cms/contentTypes/landingPages';
import { createQueryOptions } from './useQueryDefaults';

export function useLandingPages() {
  return useQuery<LandingPage[]>({
    queryKey: ['landing-pages'],
    queryFn: fetchLandingPages,
    ...createQueryOptions()
  });
}

export function useLandingPageByKey(key: string) {
  return useQuery<LandingPage | null>({
    queryKey: ['landing-pages', key],
    queryFn: () => fetchLandingPageByKey(key),
    enabled: !!key,
    ...createQueryOptions()
  });
}

export function useCreateLandingPage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LandingPageFormData) => {
      console.log('Creating landing page with data:', data);
      return createLandingPage(data);
    },
    onSuccess: (data) => {
      console.log('Landing page created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
    },
    onError: (error) => {
      console.error('Error creating landing page:', error);
    }
  });
}

export function useUpdateLandingPage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<LandingPageFormData> }) => {
      console.log(`Updating landing page ${id} with data:`, data);
      return updateLandingPage(id, data);
    },
    onSuccess: (data: LandingPage) => {
      console.log('Landing page updated successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
      queryClient.invalidateQueries({ queryKey: ['landing-pages', data.page_key] });
    },
    onError: (error) => {
      console.error('Error updating landing page:', error);
    }
  });
}

export function useDeleteLandingPage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteLandingPage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
    },
  });
}
