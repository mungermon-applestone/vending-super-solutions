
import { ContentfulAsset } from '@/types/contentful';
import { CMSImage } from '@/types/cms';

/**
 * Safely convert any value to a string, handling null and undefined
 */
export function safeString(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

/**
 * Safely convert Contentful asset to CMSImage format
 */
export function safeAssetToImage(asset: any): CMSImage | null {
  if (!asset || !asset.fields || !asset.fields.file) {
    return null;
  }

  try {
    const imageUrl = asset.fields.file.url;
    const fixedImageUrl = typeof imageUrl === 'string' ? 
      (imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl) : '';

    return {
      id: asset.sys?.id,
      url: fixedImageUrl,
      alt: safeString(asset.fields.title || ''),
      filename: safeString(asset.fields.file.fileName),
      width: asset.fields.file.details?.image?.width,
      height: asset.fields.file.details?.image?.height
    };
  } catch (error) {
    console.error('[safeAssetToImage] Error converting asset to image format:', error);
    return null;
  }
}

/**
 * Safely handle an array field, ensuring it's an array
 */
export function safeArrayField<T>(field: any, defaultValue: T[] = []): T[] {
  if (!field) {
    return defaultValue;
  }

  if (Array.isArray(field)) {
    return field;
  }

  return defaultValue;
}

/**
 * Safely handle a nested object field
 */
export function safeObjectField<T>(field: any, defaultValue: T): T {
  if (!field || typeof field !== 'object') {
    return defaultValue;
  }

  return field;
}

/**
 * Safely handle a numeric field
 */
export function safeNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Safely handle a boolean field
 */
export function safeBoolean(value: any, defaultValue: boolean = false): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  return Boolean(value);
}

/**
 * Safely handle a date field
 */
export function safeDate(value: any, defaultValue: Date = new Date()): Date {
  if (!value) {
    return defaultValue;
  }

  try {
    const date = new Date(value);
    return isNaN(date.getTime()) ? defaultValue : date;
  } catch (error) {
    return defaultValue;
  }
}
