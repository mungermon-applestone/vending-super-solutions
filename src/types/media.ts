
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
