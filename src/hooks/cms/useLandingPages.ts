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
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

export function useLandingPageByKey(key: string) {
  return useQuery<LandingPage | null>({
    queryKey: ['landing-pages', key],
    queryFn: async () => {
      console.log(`[useLandingPageByKey] Fetching landing page for key: ${key}`);
      try {
        // Force a fresh fetch from the database
        const page = await fetchLandingPageByKey(key);
        
        if (page) {
          console.log(`[useLandingPageByKey] Successfully fetched landing page for key ${key}:`, {
            id: page.id,
            page_key: page.page_key,
            has_hero_content: !!page.hero_content,
            hero_title: page.hero_content?.title,
            is_video: page.hero_content?.is_video,
            has_video_file: !!page.hero_content?.video_file,
            video_url: page.hero_content?.video_url,
            video_thumbnail: page.hero_content?.video_thumbnail
          });
          
          // Add additional video debugging
          if (page.hero_content?.is_video) {
            console.log(`[useLandingPageByKey] Video details for ${key}:`, {
              video_file: page.hero_content.video_file,
              video_url: page.hero_content.video_url,
              video_thumbnail: page.hero_content.video_thumbnail
            });
          }
        } else {
          console.warn(`[useLandingPageByKey] No landing page found for key: ${key}`);
        }
        
        return page;
      } catch (error) {
        console.error(`[useLandingPageByKey] Error fetching landing page by key (${key}):`, error);
        return null;
      }
    },
    enabled: !!key,
    ...createQueryOptions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when window gets focus
    refetchOnMount: 'always', // Always refetch when component mounts
    retry: 2, // Retry failed requests a couple times
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
      // Invalidate all landing pages queries
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
      // Also invalidate this specific page
      if (data.page_key) {
        queryClient.invalidateQueries({ queryKey: ['landing-pages', data.page_key] });
      }
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
