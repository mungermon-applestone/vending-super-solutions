import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LandingPage, LandingPageFormData } from '@/types/landingPage';
import { fetchLandingPages, fetchLandingPageByKey, createLandingPage, updateLandingPage, deleteLandingPage } from '@/services/cms/contentTypes/landingPages';
import { createQueryOptions } from './useQueryDefaults';

export function useLandingPages() {
  return useQuery({
    queryKey: ['landing-pages'],
    queryFn: fetchLandingPages,
    ...createQueryOptions()
  });
}

export function useLandingPageByKey(key: string) {
  return useQuery({
    queryKey: ['landing-pages', key],
    queryFn: () => fetchLandingPageByKey(key),
    enabled: !!key,
    ...createQueryOptions()
  });
}

export function useCreateLandingPage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LandingPageFormData) => createLandingPage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
    },
  });
}

export function useUpdateLandingPage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<LandingPageFormData> }) => 
      updateLandingPage(id, data),
    onSuccess: (data: LandingPage) => {
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
      queryClient.invalidateQueries({ queryKey: ['landing-pages', data.page_key] });
    },
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
