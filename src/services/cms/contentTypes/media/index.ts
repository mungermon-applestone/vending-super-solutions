
import { supabase } from "@/integrations/supabase/client";
import { MediaFile, MediaUploadParams, MediaUpdateParams, MediaFiltersParams } from "@/types/media";
import { v4 as uuidv4 } from 'uuid';

// Base URL for public storage access
const STORAGE_URL = `https://eyxlqcavscrthjkonght.supabase.co/storage/v1/object/public/cms_media`;

// Fetch all media files with optional filters
export const fetchMediaFiles = async (filters: MediaFiltersParams = {}): Promise<MediaFile[]> => {
  console.log("[fetchMediaFiles] Fetching media files with filters:", filters);
  
  let query = supabase
    .from('cms_media')
    .select('*');
    
  // Apply file type filter
  if (filters.file_type) {
    query = query.eq('file_type', filters.file_type);
  }
  
  // Apply search filter (searches in filename, title, and description)
  if (filters.search) {
    query = query.or(`filename.ilike.%${filters.search}%,title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  
  // Apply pagination
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  
  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }
  
  // Sort by newest first
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error("[fetchMediaFiles] Error fetching media files:", error);
    throw error;
  }
  
  return data as MediaFile[];
};

// Fetch a single media file by ID
export const fetchMediaFileById = async (id: string): Promise<MediaFile | null> => {
  console.log("[fetchMediaFileById] Fetching media file with ID:", id);
  
  const { data, error } = await supabase
    .from('cms_media')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error("[fetchMediaFileById] Error fetching media file:", error);
    throw error;
  }
  
  return data as MediaFile | null;
};

// Upload a file to storage and create a media record
export const uploadMedia = async (params: MediaUploadParams): Promise<MediaFile> => {
  const { file, alt_text = '', title = '', description = '' } = params;
  console.log("[uploadMedia] Uploading file:", file.name);
  
  // Create a unique path for the file to prevent overwriting
  const fileExt = file.name.split('.').pop();
  const uniqueFilename = `${uuidv4()}.${fileExt}`;
  const storagePath = `${uniqueFilename}`;
  
  // Upload to storage
  const { error: uploadError } = await supabase
    .storage
    .from('cms_media')
    .upload(storagePath, file);
  
  if (uploadError) {
    console.error("[uploadMedia] Error uploading file:", uploadError);
    throw uploadError;
  }
  
  // Get dimensions for image files
  let width = null;
  let height = null;
  
  if (file.type.startsWith('image/')) {
    try {
      const result = await getImageDimensions(file);
      width = result.width;
      height = result.height;
    } catch (e) {
      console.warn("[uploadMedia] Could not get image dimensions:", e);
    }
  }
  
  // Create a record in cms_media table
  const mediaData = {
    storage_path: storagePath,
    filename: file.name,
    file_type: file.type,
    file_size: file.size,
    width,
    height,
    alt_text,
    title: title || file.name,
    description
  };
  
  const { data, error: dbError } = await supabase
    .from('cms_media')
    .insert(mediaData)
    .select()
    .single();
  
  if (dbError) {
    console.error("[uploadMedia] Error creating media record:", dbError);
    // Try to clean up storage if DB insert fails
    await supabase.storage.from('cms_media').remove([storagePath]);
    throw dbError;
  }
  
  return data as MediaFile;
};

// Update media metadata
export const updateMediaMetadata = async (params: MediaUpdateParams): Promise<MediaFile> => {
  const { id, alt_text, title, description } = params;
  console.log("[updateMediaMetadata] Updating media metadata for ID:", id);
  
  const updates: Record<string, any> = {
    updated_at: new Date().toISOString()
  };
  
  if (alt_text !== undefined) updates.alt_text = alt_text;
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  
  const { data, error } = await supabase
    .from('cms_media')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("[updateMediaMetadata] Error updating media:", error);
    throw error;
  }
  
  return data as MediaFile;
};

// Delete media (both record and file)
export const deleteMedia = async (id: string): Promise<boolean> => {
  console.log("[deleteMedia] Deleting media with ID:", id);
  
  // First get the file path
  const { data: mediaFile, error: fetchError } = await supabase
    .from('cms_media')
    .select('storage_path')
    .eq('id', id)
    .single();
  
  if (fetchError) {
    console.error("[deleteMedia] Error fetching media to delete:", fetchError);
    throw fetchError;
  }
  
  // Delete the file from storage
  const { error: storageError } = await supabase
    .storage
    .from('cms_media')
    .remove([mediaFile.storage_path]);
  
  if (storageError) {
    console.error("[deleteMedia] Error deleting file from storage:", storageError);
    throw storageError;
  }
  
  // Delete the database record
  const { error: dbError } = await supabase
    .from('cms_media')
    .delete()
    .eq('id', id);
  
  if (dbError) {
    console.error("[deleteMedia] Error deleting media record:", dbError);
    throw dbError;
  }
  
  return true;
};

// Helper to get image dimensions
const getImageDimensions = (file: File): Promise<{ width: number, height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};

// Get public URL for media file
export const getMediaUrl = (storagePath: string): string => {
  if (!storagePath) return '';
  return `${STORAGE_URL}/${storagePath}`;
};
