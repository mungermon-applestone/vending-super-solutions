
// Stub media types for compatibility with components that need them
export interface MediaFile {
  id: string;
  storage_path: string;
  filename: string;
  file_type: string;
  file_size: number;
  width?: number;
  height?: number;
  alt_text?: string;
  title?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaUploadParams {
  file: File;
  alt_text?: string;
  title?: string;
  description?: string;
}

export interface MediaUpdateParams {
  id: string;
  alt_text?: string;
  title?: string;
  description?: string;
}

export interface MediaFiltersParams {
  file_type?: string; 
  search?: string;
  limit?: number;
  offset?: number;
}

// Mock media utilities for components that need them
export const getMediaUrl = (storagePath: string): string => {
  if (!storagePath) return '';
  return `https://example.com/media/${storagePath}`;
};

export const fetchMediaFiles = async (): Promise<MediaFile[]> => {
  console.log('[fetchMediaFiles] Mock: Would fetch media files');
  return [];
};

export const fetchMediaFileById = async (id: string): Promise<MediaFile | null> => {
  console.log('[fetchMediaFileById] Mock: Would fetch media file by ID:', id);
  return null;
};

export const uploadMedia = async (params?: MediaUploadParams): Promise<MediaFile> => {
  console.log('[uploadMedia] Mock: Would upload media file', params);
  return {
    id: 'mock-id',
    storage_path: 'mock-path',
    filename: 'mock-file.jpg',
    file_type: 'image/jpeg',
    file_size: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

export const updateMediaMetadata = async (params?: MediaUpdateParams): Promise<MediaFile> => {
  console.log('[updateMediaMetadata] Mock: Would update media metadata', params);
  return {
    id: params?.id || 'mock-id',
    storage_path: 'mock-path',
    filename: 'mock-file.jpg',
    file_type: 'image/jpeg',
    file_size: 0,
    alt_text: params?.alt_text,
    title: params?.title,
    description: params?.description,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

export const deleteMedia = async (id: string): Promise<boolean> => {
  console.log('[deleteMedia] Mock: Would delete media with ID:', id);
  return true;
};
