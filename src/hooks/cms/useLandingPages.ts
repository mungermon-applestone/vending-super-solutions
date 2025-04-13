
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LandingPage, LandingPageFormData } from '@/types/landingPage';
import { fetchLandingPages, fetchLandingPageByKey, createLandingPage, updateLandingPage, deleteLandingPage } from '@/services/cms/contentTypes/landingPages';
import { createQueryOptions } from './useQueryDefaults';
import { initMockLandingPagesData } from '@/services/cms/initMockData';

export function useLandingPages() {
  return useQuery<LandingPage[]>({
    queryKey: ['landing-pages'],
    queryFn: async () => {
      console.log('useLandingPages hook fetching data...');
      try {
        const pages = await fetchLandingPages();
        console.log('useLandingPages hook fetched data:', pages);
        
        if (!pages || !Array.isArray(pages)) {
          console.warn('useLandingPages: fetchLandingPages returned unexpected data type:', typeof pages);
          return [];
        }
        
        return pages;
      } catch (error) {
        console.error('Error in useLandingPages:', error);
        return []; 
      }
    },
    ...createQueryOptions(),
    retry: 3,
    staleTime: 0, // Always refetch on component mount
    refetchOnMount: true,
  });
}

export function useLandingPageByKey(key: string) {
  return useQuery<LandingPage | null>({
    queryKey: ['landing-pages', key],
    queryFn: async () => {
      console.log(`useLandingPageByKey hook fetching data for key: ${key}`);
      try {
        const page = await fetchLandingPageByKey(key);
        console.log(`useLandingPageByKey hook (${key}) fetched data:`, page);
        return page;
      } catch (error) {
        console.error(`Error fetching landing page by key (${key}):`, error);
        return null;
      }
    },
    enabled: !!key,
    ...createQueryOptions(),
    staleTime: 0, // Always refetch
    refetchOnMount: true,
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
