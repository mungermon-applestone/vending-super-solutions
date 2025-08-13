/**
 * File Upload Utilities
 * 
 * Utilities for handling file uploads, validation, and conversion for email attachments
 */

export interface FileUploadResult {
  success: boolean;
  data?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    base64Data: string;
  };
  error?: string;
}

export interface FileValidationOptions {
  maxSizeBytes?: number;
  allowedTypes?: string[];
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

/**
 * Validates a file against size and type restrictions
 */
export function validateFile(
  file: File, 
  options: FileValidationOptions = {}
): { isValid: boolean; error?: string } {
  const { maxSizeBytes = DEFAULT_MAX_SIZE, allowedTypes = DEFAULT_ALLOWED_TYPES } = options;
  
  // Check file size
  if (file.size > maxSizeBytes) {
    const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024));
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB. Current file is ${Math.round(file.size / (1024 * 1024))}MB.`
    };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type "${file.type}" is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }
  
  return { isValid: true };
}

/**
 * Converts a file to base64 for email attachment
 */
export function fileToBase64(file: File): Promise<FileUploadResult> {
  return new Promise((resolve) => {
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      resolve({
        success: false,
        error: validation.error
      });
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64Data = base64String.split(',')[1];
        
        resolve({
          success: true,
          data: {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            base64Data
          }
        });
      } catch (error) {
        resolve({
          success: false,
          error: 'Failed to process file'
        });
      }
    };
    
    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Failed to read file'
      });
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Gets a human-readable list of allowed file types
 */
export function getAllowedTypesDisplay(): string {
  const typeMap: Record<string, string> = {
    'image/jpeg': 'JPEG',
    'image/png': 'PNG', 
    'image/gif': 'GIF',
    'image/webp': 'WebP',
    'application/pdf': 'PDF',
    'text/plain': 'Text',
    'application/msword': 'Word (.doc)',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word (.docx)',
    'application/vnd.ms-excel': 'Excel (.xls)',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel (.xlsx)'
  };
  
  return DEFAULT_ALLOWED_TYPES
    .map(type => typeMap[type] || type)
    .join(', ');
}