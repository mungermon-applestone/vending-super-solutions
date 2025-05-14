
import { Entry, Asset, EntrySkeletonType } from 'contentful';

/**
 * Type guard to check if a value is a Contentful Entry
 */
export function isContentfulEntry(value: any): value is Entry<EntrySkeletonType, undefined, string> {
  return value && typeof value === 'object' && value.sys && value.fields;
}

/**
 * Type guard to check if a value is a Contentful Asset
 */
export function isContentfulAsset(value: any): value is Asset<undefined, string> {
  return value && typeof value === 'object' && value.sys && value.fields && value.fields.file;
}

/**
 * Safely get a string field from a Contentful entry
 */
export function getStringField(entry: any, fieldName: string, defaultValue: string = ''): string {
  if (
    entry && 
    entry.fields && 
    fieldName in entry.fields && 
    entry.fields[fieldName] !== null && 
    entry.fields[fieldName] !== undefined
  ) {
    const field = entry.fields[fieldName];
    if (typeof field === 'string') {
      return field;
    }
    return String(field);
  }
  return defaultValue;
}

/**
 * Convert a Contentful asset to a simple image object
 */
export function assetToImage(asset: any) {
  if (!isContentfulAsset(asset)) {
    return null;
  }
  
  return {
    id: asset.sys.id,
    url: asset.fields.file.url.startsWith('//') ? `https:${asset.fields.file.url}` : asset.fields.file.url,
    alt: asset.fields.title || '',
    filename: asset.fields.file.fileName
  };
}

/**
 * Helper function to safely get text content with fallbacks from an object
 */
export function getTextContent(
  obj: Record<string, any> | null | undefined, 
  primaryKey: string, 
  fallbackKeys: string[], 
  defaultValue: string
): string {
  if (!obj) return defaultValue;
  
  if (primaryKey in obj && obj[primaryKey]) {
    return String(obj[primaryKey]);
  }
  
  // Try fallback keys
  for (const key of fallbackKeys) {
    if (key in obj && obj[key]) {
      return String(obj[key]);
    }
  }
  
  return defaultValue;
}

/**
 * Convert any value to a safe string
 */
export function safeString(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value);
}
