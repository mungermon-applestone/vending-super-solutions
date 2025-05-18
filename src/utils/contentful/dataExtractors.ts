
import { Asset, Entry } from 'contentful';
import { isContentfulAsset, isContentfulEntry, isString, isNumber, isArray, isObject } from './typeGuards';

// Define the AssetFile type to match Contentful's structure
interface AssetFile {
  url: string;
  details?: {
    size?: number;
    image?: {
      width: number;
      height: number;
    };
  };
  fileName?: string;
  contentType?: string;
}

/**
 * Safely extracts the URL from a Contentful asset
 * 
 * @param asset Any potential Contentful asset value
 * @param defaultValue Optional fallback value
 * @returns The asset URL or the default value
 */
export function getAssetUrl(asset: any, defaultValue: string = ''): string {
  // Check for direct asset object
  if (isContentfulAsset(asset)) {
    if (asset.fields.file && asset.fields.file.url) {
      return ensureHttps(asset.fields.file.url);
    }
    return defaultValue;
  }
  
  // Check for inline asset format (fields.image.fields.file.url)
  if (isObject(asset) && 'fields' in asset && isObject(asset.fields)) {
    if ('file' in asset.fields && isObject(asset.fields.file) && 'url' in asset.fields.file) {
      const url = asset.fields.file.url;
      return isString(url) ? ensureHttps(url) : defaultValue;
    }
  }
  
  // Check for simplified format { url: 'http://...' }
  if (isObject(asset) && 'url' in asset && isString(asset.url)) {
    return ensureHttps(asset.url);
  }
  
  return defaultValue;
}

/**
 * Make sure URL starts with https://
 */
function ensureHttps(url: string): string {
  if (!url) return '';
  
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  if (!url.startsWith('http')) {
    return `https://${url}`;
  }
  
  return url;
}

/**
 * Safely get the alt text from a Contentful asset
 * 
 * @param asset Any potential Contentful asset value
 * @param defaultValue Optional fallback value
 * @returns The alt text or the default value
 */
export function getAssetAlt(asset: any, defaultValue: string = ''): string {
  // Check for direct asset object
  if (isContentfulAsset(asset) && asset.fields.title) {
    return String(asset.fields.title);
  }
  
  // Check for fields.title
  if (isObject(asset) && 'fields' in asset && isObject(asset.fields)) {
    if ('title' in asset.fields && isString(asset.fields.title)) {
      return asset.fields.title;
    }
  }
  
  // Check for alt property
  if (isObject(asset) && 'alt' in asset && isString(asset.alt)) {
    return asset.alt;
  }
  
  return defaultValue;
}

/**
 * Safely extract a field value from a Contentful entry
 * 
 * @param entry Any potential Contentful entry
 * @param fieldName The name of the field to extract
 * @param defaultValue Optional fallback value
 * @returns The field value or the default value
 */
export function getFieldValue<T>(entry: any, fieldName: string, defaultValue: T): T {
  // Check if it's a valid Contentful entry
  if (isContentfulEntry(entry)) {
    if (entry.fields && fieldName in entry.fields) {
      return entry.fields[fieldName] as unknown as T;
    }
  }
  
  // Check if it's a direct fields object
  if (isObject(entry) && 'fields' in entry && isObject(entry.fields)) {
    if (fieldName in entry.fields) {
      return entry.fields[fieldName] as unknown as T;
    }
  }
  
  // Check if the field exists directly in the object
  if (isObject(entry) && fieldName in entry) {
    return entry[fieldName] as unknown as T;
  }
  
  return defaultValue;
}

/**
 * Safely extract a string field from a Contentful entry
 */
export function getStringField(entry: any, fieldName: string, defaultValue: string = ''): string {
  const value = getFieldValue(entry, fieldName, null);
  return isString(value) ? value : defaultValue;
}

/**
 * Safely extract a number field from a Contentful entry
 */
export function getNumberField(entry: any, fieldName: string, defaultValue: number = 0): number {
  const value = getFieldValue(entry, fieldName, null);
  return isNumber(value) ? value : defaultValue;
}

/**
 * Safely extract an array field from a Contentful entry
 */
export function getArrayField<T = any>(entry: any, fieldName: string, defaultValue: T[] = []): T[] {
  const value = getFieldValue(entry, fieldName, null);
  return isArray(value) ? value as T[] : defaultValue;
}

/**
 * Get a content entry ID safely
 */
export function getEntryId(entry: any, defaultValue: string = 'unknown-id'): string {
  if (!entry) return defaultValue;
  
  // Check for sys.id
  if (isObject(entry) && 'sys' in entry && isObject(entry.sys) && 'id' in entry.sys) {
    return isString(entry.sys.id) ? entry.sys.id : defaultValue;
  }
  
  // Check for direct id
  if (isObject(entry) && 'id' in entry) {
    return isString(entry.id) ? entry.id : defaultValue;
  }
  
  return defaultValue;
}
