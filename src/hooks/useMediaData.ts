
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchMediaFiles, 
  fetchMediaFileById,
  uploadMedia,
  updateMediaMetadata,
  deleteMedia,
  getMediaUrl,
  MediaFiltersParams,
  MediaUpdateParams,
  MediaUploadParams
} from '@/types/mediaStubs';

// Hook for fetching media files
export const useMediaFiles = (filters?: MediaFiltersParams) => {
  return useQuery({
    queryKey: ['media-files', filters],
    queryFn: () => fetchMediaFiles(),
  });
};

// Hook for fetching a single media file by ID
export const useMediaFileById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['media-file', id],
    queryFn: () => id ? fetchMediaFileById(id) : null,
    enabled: !!id,
  });
};

// Hook for uploading media
export const useUploadMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: MediaUploadParams) => uploadMedia(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-files'] });
    },
  });
};

// Hook for updating media metadata
export const useUpdateMediaMetadata = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: MediaUpdateParams) => updateMediaMetadata(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-files'] });
    },
  });
};

// Hook for deleting media
export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-files'] });
    },
  });
};

// Utility hook to get media URL
export const useMediaUrl = () => {
  return {
    getUrl: (path: string) => getMediaUrl(path),
  };
};
